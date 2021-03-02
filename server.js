const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

// Bind server process to a port
const { PORT = 3333 } = process.env;

// Create static file server
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// Create some dummy data for pizza api
const pizzas = [
  { name: 'funghi', toppings: ['mushrooms', 'mozerella', 'basil'] },
  { name: 'margaritta', toppings: ['buffallo mozerella', 'basil'] },
  { name: 'padana', toppings: ['goats cheese', 'spinach', 'capers'] },
];

// GET data
app.get('/api/v1/pizzas', (req, res) => {
  return res.json(pizzas);
});

// Search
// TODO use query params
app.get('/api/v1/pizzas/', (req, res) => {
  // console.log('query string params', req.query.q);
  // return res.json(pizzas);
});

// ADD data
app.post('/api/v1/pizzas', (req, res) => {
  console.log(req.body);
  const newPizza = { ...req.body, _id: uuidv4() };
  pizzas.push(newPizza);
  res.status(201).send(newPizza);
});

// UPDATE data
app.put('/api/v1/pizzas/:id', (req, res) => {
  console.log(req.params.id);
  // get pizza id from url param
  const { id } = req.params;
  // Find index of pizza
  const index = pizzas.findIndex(({ _id }) => id === _id);
  // defense check
  if (index === -1) {
    return res.sendStatus(404);
  }
  // merge changes
  const oldPizza = pizzas[index];
  const updatedPizza = { ...oldPizza, ...req.body };
  // add updated pizza to array
  pizzas.splice(index, 1, updatedPizza);
  // status check
  res.status(200).send(updatedPizza);
});

// DELETE data
app.delete('/api/v1/pizzas/:id', (req, res) => {
  console.log(req.params.id);
  // get pizza id from url param
  const { id } = req.params;
  // find index of that pizza
  const index = pizzas.findIndex(({ _id }) => id === _id);
  // if pizza not found, bail and send 404 to user
  if (index === -1) {
    return res.sendStatus(404);
  }
  // remove that pizza from array
  pizzas.splice(index, 1);
  res.sendStatus(204);
});

// Open the port and listen to changes – npm run start:dev (npx nodemon server.js)
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
