const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Bind server process to a port
const { PORT = 3333 } = process.env;

// connect mongoose – https://mongoosejs.com/docs/index.html
mongoose.connect('mongodb://localhost/pizza-001', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('db connected!');
});

// Schema
const { Schema } = mongoose;

const pizzaSchema = new Schema({
  name: String,
  toppings: [],
  image_url: {
    type: String,
    default: 'https://www.iconpacks.net/icons/1/free-car-icon-1057-thumb.png',
  },
});

// Model
const Pizza = mongoose.model('Pizza', pizzaSchema);

// Create static file server
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());

// Redirect to root
app.get('/redirect', (req, res) => {
  res.redirect('/');
});

/*****************
 ***** API
 *****************/

// GET data
// TODO – find only one pizza
app.get('/api/v1/pizzas/:id?', (req, res) => {
  console.log('query string params', req.query);

  const filters = {};
  const { id } = req.params;

  if (id) {
    filters._id = id;
  }

  Pizza.find({}).exec((err, pizzas) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).json(pizzas);
  });
});

// ADD data
app.post('/api/v1/pizzas', (req, res) => {
  console.log(req.body);
  const newPizza = new Pizza(req.body);

  newPizza.save((err, pizza) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(pizza);
  });
});

// UPDATE data
app.put('/api/v1/pizzas/:id', (req, res) => {
  console.log(req.params.id);
  // get pizza id from url param
  const { id } = req.params;

  Pizza.updateOne({ _id: id }, req.body, (err, report) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log({ report });
    res.sendStatus(200);
  });
});

// DELETE data
app.delete('/api/v1/pizzas/:id', (req, res) => {
  console.log(req.params.id);
  // get pizza id from url param
  const { id } = req.params;

  Pizza.remove({ _id: id }, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.sendStatus(204);
  });
});

// Open port and listen to changes – npm run start:dev (npx nodemon server.js)
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
