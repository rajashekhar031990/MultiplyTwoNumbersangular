const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PORT = process.env.PORT || 3000;
const app = express();

// connect to mongodb
mongoose.connect('mongodb://localhost:27017/admin', () => {
    console.log('connected to mongodb');
});


//Headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const calcSchema = new Schema({
    value1: String,
    value2: String,
    result: String
}, {
        versionKey: false
    });

const Calc = mongoose.model('calc', calcSchema);

// Routes
app.get('/', function (req, res) {
    res.send({ ' status': ' UP' });
});

app.post('/saveData', function (req, res) {
    var request = req.body;
    var value1 = request.value1;
    var value2 = request.value2;
    var multiplication = request.result;
    new Calc({
        value1: value1,
        value2: value2,
        result: multiplication
    }).save().then((newCalc) => {
        console.log('Created record: ', newCalc);
    });
});
app.get('/getData', function (req, res) {
    Calc.find({}, function (err, data) {
        console.log(err, data, data.length);
        res.send(data);
    });
});
app.use((err, req, res, next) => {
    if (err.status === 404) {
        const error = new Error('Resource Not Found');
        error.status = 404;
        next(error);
    }
    next(err);
});


// Error Handler
app.use((err, req, res, next) => {
    console.log(`Invalid Exception Occurred. Please contact admin.${err}`);
    res.status(err.status || 500);
    res.send('Invalid Exception Occurred. Please contact admin.');
});


const server = app.listen(PORT, () => {
    console.log(`server started on port:${PORT}`);
});

