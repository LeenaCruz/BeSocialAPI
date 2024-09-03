const express = require('express');
const db = require('./config/connection');
// Require model
const { Thought, User } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Get all users
app.get('/users', async (req, res) => {
  try {
    // Using model in route to find all documents that are instances of that model
    const result = await User.find({}).populate('thoughts');
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
});
// Searchs for a single user 
app.get('/users/:userId', async (req, res) => {
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
app.post('/users', (req, res) => {
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
app.put('/users/:userId', async (req, res) => {
  try {
  const user = await User.findOneAndUpdate(
    { _id: req.body.userId },
    { username: req.body.username, email: req.body.email},
  );
  if (!user) {
    return res
      .status(404)
      .json({ message: 'Thought created, but no users with this ID' });
  }
  
res.json({message: "User updated correctly!"});
} catch (err){
  res.status(500).json(err);
}

})
// Delete user 
app.delete('/users/:userId', async (req,res) => {
  try { 
    const user = await User.findOneAndDelete({_id: req.params.userId});
    if (!user) {
      return res.status(404).json({message: 'No user with that ID'});
    }
    await Thought.deleteMany({ _id: {$in: user.thoughts}});
    res.json({message: 'User and Thoughts deleted.'});
  }catch(err){
    res.status(500).json(err);
  }
});

app.get('/thoughts', async (req, res) => {
  try {
    // Using model in route to find all documents that are instances of that model
    const result = await Thought.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
});
// Get  a single thought
app.get('/thoughts/:thoughtId', async (req, res) => {
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
app.post('/thoughts', async (req, res) => {
  //Find user to attach thoughts
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).json({ message: 'No user with that ID' });
    }
    // Create thought find user and  update toughts
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

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
