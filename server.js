const express = require('express');
const db = require('./config/connection');
// Require model
const { Thought, User } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    // Using model in route to find all documents that are instances of that model
    const result = await User.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({ message: 'Internal Server Error' })
  }
});

// Creates a new user
app.post('/users', (req, res) => {
  const newUser = new User ({ username: req.body.username, email: req.body.email });
  newUser.save();
  if ( newUser) {
    res.status(201).json(newUser);
  } else {
    console.log('Uh Oh, something went wrong');
    res.status(500).json({ error: 'Something went wrong' });
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

// Creates a new  thought
app.post('/thoughts', (req, res) => {
  //Find user to attach thoughts WIP
// try { 
//   const user = await User.findOne({username: req.body.username})
  
// }
  const newThought = new Thought({ thoughtText: req.body.thoughtText, username: req.body.username });
  newThought.save();
  if ( newThought) {
    res.status(201).json(newThought);
  } else {
    console.log('Uh Oh, something went wrong');
    res.status(500).json({ error: 'Something went wrong' });
  }
});



db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
