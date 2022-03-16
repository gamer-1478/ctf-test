require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require('fs');

// Middleware
app.use(express.json());

//setup ejs
app.set('view engine', 'ejs');

app.post('/api/javascript/run', (req, res) => {
    var outputData = [];
    var input = 'no input provided';
    if (req.body.input) {
        input = req.body.input.split('\n');
    }
    // Save Console Log's To Ouput
    var log = console.log;
    console.log = function (...args) {
        outputData.push(...args);
    }
    // End Submission So that user can check output
    function EndSubmission() {
        res.send({ output: outputData });
    }

    // SetTimeout to End Submission
    setTimeout(() => {
        if (!res.headersSent) {
            EndSubmission();
        }
    }, 5000);

    try {
        eval(req.body.code)
    } catch (error) {
        log(error);
        res.send({ error: error });
    };
})

app.get('/Question/:id', (req, res) => {
    var data = fs.readFileSync(`./questions.json`, 'utf8');
    var questions = JSON.parse(data);
    var question = questions.find(q => q.id == req.params.id);
    if (question) {
        res.render('question', { question });
    } else {
        res.redirect('/404');
    }
})

app.get('/', (req, res) => {
    //send all questions
    var data = fs.readFileSync(`./questions.json`, 'utf8');
    var questions = JSON.parse(data);
    res.render('index', { questions });
})

app.get('*', (req, res) => {
    res.send('404');
});

app.listen(port, () => {
    console.log(`Example app listening http://localhost:${port}`);
});

//Run app, then load http://localhost:port in a browser to see the output.