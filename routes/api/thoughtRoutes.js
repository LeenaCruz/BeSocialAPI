const router = require('express').Router();
// Require model
const { Thought, User } = require('../../models');


// Get all the thoughts
router.get('/', async (req, res) => {
  try {
    // Using model in route to find all documents that are instances of that model
    const result = await Thought.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
});
// Get  a single thought
router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId })
    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Creates a new  thought
router.post('/', async (req, res) => {
  //Find user to attach thoughts
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }
    // Create thought find user and update toughts
    const newestThought = await Thought.create(req.body);
    const thought = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { thoughts: newestThought._id } },
      { new: true }
    );
    if (!thought) {
      return res
        .status(404)
        .json({ message: 'Thought created, but no users with this ID' });
    }
    res.json(newestThought);
  } catch (err) {
    res.status(500).json(err);
  }
}
);
// Update a thought 
router.put('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { thoughtText: req.body.thoughtText },
      { new: true }
    );
    if (!thought) {
      return res
        .status(404)
        .json({ message: 'Can not update thought' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});
//Delete a thought
router.delete('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }
    res.json({ message: 'Thought deleted.' });
  } catch (err) {
    res.status(500).json(err);
  }
});
// Post a reaction to a thought
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { new: true }
    );
    if (!thought) {
      return res
        .status(404)
        .json({ message: 'Can not add reaction.' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Delete reactions from a thought
router.delete('/:thoughtId/reactions', async (req,res)=> {
  try {
    const thought = await Thought.findOneAndUpdate(
       {_id: req.params.thoughtId},
      { $pull: { reactions: {reactionId: req.body.reactionId} } },
      { new: true }
    );
    if (!thought) {
      return res
        .status(404)
        .json({ message: 'Can not delete reaction.' });
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;