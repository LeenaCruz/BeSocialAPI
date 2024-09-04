const router = require('express').Router();
// Require model
const { Thought, User } = require('../../models');

// Get all users 
router.get('/', async (req, res) => {
    try {
      // Using model in route to find all documents that are instances of that model
      const result = await User.find({}).populate('thoughts');
      res.status(200).json(result);
    } catch (err) {
      res.status(500).send({ message: 'Internal Server Error' })
    }
  });
// Searchs for a single user 
router.get('/:userId', async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.params.userId }).populate('thoughts');
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  // Creates a new user
  router.post('/', (req, res) => {
    const newUser = new User({ username: req.body.username, email: req.body.email });
    newUser.save();
    if (newUser) {
      res.status(201).json(newUser);
    } else {
      console.log('Uh Oh, something went wrong');
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  // Update a user
  router.put('/:userId', async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { username: req.body.username, email: req.body.email },
        { new: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ message: 'Thought created, but no users with this ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  // Delete user 
  router.delete('/:userId', async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and Thoughts deleted.' });
    } catch (err) {
      res.status(500).json(err);
    }
  });
  // Add friends to users
  router.post('/:userId/friends/:friendId', async (req, res) => {
    //Find user to attach thoughts
    try {
      const user = await User.findOne({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      // Found friend and push to friend(host)
      const friend = await User.findOne({ _id: req.params.friendId });
      const friendly = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $push: { friends: friend._id } },
        { new: true }
      );
      if (!friendly) {
        return res
          .status(404)
          .json({ message: 'Thought created, but no users with this ID' });
      }
      res.json(friendly);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  //Delete friend
  router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        //Pass the Id directly because findByIdandUpdate search for id not objects.
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;