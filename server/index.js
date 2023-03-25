// const books = require('./routes/api/books');
// app.use('/api/books', books);
const express = require('express');
var bodyParser = require('body-parser');
const {spawn} = require('child_process');
const port = process.env.PORT || 8080;
var cors = require('cors');
const app = express();
app.use(cors());
app.get('/', (req, res) => {
 
 var dataToSend;
 // spawn new child process to call the python script
 const python = spawn('python', ['script1.py']);
 // collect data from script
 python.stdout.on('data', function (data) {
  console.log('Pipe data from python script ...');
  dataToSend = data.toString();
 });

 // in close event we are sure that stream from child process is closed
 python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend)
 });
});

app.use(bodyParser.json());
// var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post('/api/product', (req, res,next) => {
    var dataToSend;
    console.log("Request body: ", req.body);
    const python = spawn('python', ['scraper.py', req.body.url]);
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        // dataToSend = dataToSend.replace("'", "\"");
        // console.log(dataToSend);
        // console.log("After Data: ");
        // console.log(JSON.parse("{\"reviews\": {\"positive\": [\"sdfjsdlkjsl\"]}}"));
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        // res.send(dataToSend)
        if(dataToSend !== undefined) {
            // var resp = JSON.parse(dataToSend)
            res.status(200).json(JSON.parse(dataToSend));
        } else {
            res.status(500);
        }
    });
});
app.listen(port, () => console.log(`Server listening on port ${port}!`))

