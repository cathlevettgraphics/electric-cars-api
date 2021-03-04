const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Bind server process to a port
const { PORT = 3333 } = process.env;

// connect mongoose – https://mongoosejs.com/docs/index.html
mongoose.connect('mongodb://localhost/cars-001', {
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

const carSchema = new Schema({
  name: String,
  bhp: String,
  avatar_url: {
    type: String,
    required: true,
    default: 'https://www.iconpacks.net/icons/1/free-car-icon-1057-thumb.png',
  },
});

// Model
const Car = mongoose.model('Car', carSchema);

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
app.get('/api/v1/cars/:id?', (req, res) => {
  console.log('query string params', req.query);

  const filters = {};
  const { id } = req.params;
  // Find one pizza
  if (id) {
    filters._id = id;
  }

  Car.find(filters).exec((err, car) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(200).json(car);
  });
});

// ADD data
app.post('/api/v1/cars/', (req, res) => {
  console.log(req.body);

  const newCar = new Car(req.body);

  // Defensive check for bad data before
  if (!newCar.name || !newCar.bhp || !newCar.avatar_url) {
    return res.status(400).send('no inputs provided');
  }

  newCar.save((err, car) => {
    if (err) {
    }
    res.status(201).send(car);
  });
});

// UPDATE data
app.put('/api/v1/cars/:id', (req, res) => {
  console.log(req.params.id);
  // get car id from url param
  const { id } = req.params;

  Car.updateOne({ _id: id }, req.body, (err, report) => {
    if (err) {
      return res.status(500).send(err);
    }
    console.log({ report });
    res.sendStatus(200);
  });
});

// DELETE data
app.delete('/api/v1/cars/:id', (req, res) => {
  console.log(req.params.id);
  // get car id from url param
  const { id } = req.params;

  Car.remove({ _id: id }, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.sendStatus(204);
  });
});

app.all('*', (req, res) => {
  res.sendStatus(404);
});

// Open port and listen to changes – npm run start:dev
app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
