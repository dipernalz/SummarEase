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
app.post('/api/product', (req, res,next) => {
    var dataToSend;
    console.log("Request body: ", req.body);
    const python = spawn('python', ['scraper.py', req.body.url]);
    // collect data from script
    python.stdout.on('data', function (data) {
        console.log('Pipe data from python script ...');
        dataToSend = data.toString();
        console.log(dataToSend);
        console.log("Parsed Data: ");
        dataToSend = JSON.parse(dataToSend);
        console.log(dataToSend);
    });
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        // send data to browser
        if(dataToSend !== undefined) {
            res.status(200).json(dataToSend);
        } else {
            res.status(500);
        }
    });
});

app.post('/api/emailsave', (req, res) => {
    console.log("Request body: ", req.body);
    const sgMail = require('@sendgrid/mail');
    console.log(process.env.SENDGRID_API_KEY);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // Ran `export SENDGRID_API_KEY=the_key_you_copied_from_SendGrid` in terminal for env var

    const msg = {
        to: req.body.emailrecipient,
        from: 'summarease.reviews@gmail.com', // Change to your verified sender
        subject: 'Your SummarEased Amazon Review',
        text: `Here is your requested amazon review summary ${req.body.content}`,
        html: '<strong>HELP ME<strong>',
    }

    sgMail
    .send(msg)
    .then((response) => {
        console.log(response[0].statusCode)
        console.log(response[0].headers)
    })
    .catch((error) => {
        console.log("Email send error: ")
        console.error(error)
    });
    console.log("email done");
    res.status(200).send();
});

app.listen(port, () => console.log(`Server listening on port ${port}!`))

