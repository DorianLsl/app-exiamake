const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    fs = require('fs'),
    path = require('path'),
    root = path.dirname(require.main.filename),
    p = path.join(root, 'data', 'data.json'),
    nodemailer = require('nodemailer'),
    ejs = require('ejs');

const check = (user) => {
    return new Promise((resolve) => {
        getAll(json => {
            resolve(json.filter(i => i.mail === user).length);
        })
    })
};

const getAll = (callback) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            callback([])
        } else {
            callback(JSON.parse(fileContent))
        }
    })
};

const sendEmail = () => {
    ejs.renderFile(__dirname + "/template.ejs", {
        title: 'Un titre'
    }, (err, data) => {
        if (err) {
            return process.exit(1);
        } else {
            transporter.sendMail({
                from: 'no-reply@email.com',
                to: 'ogivales@kopiacehgayo15701806.cf',
                subject: 'WARNING',
                html: data
            }, (err, info) => {
                if (err) {
                    return process.exit(1);
                }
                console.log(info.response);
            });
        }
    });
}

// Configuration

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: false 
}));
app.set('view engine', 'ejs');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'forallstuff62@gmail.com',
        pass: 'M2.+YPy^'
    }
});
// Routes

app.get('/', (req, res) => {
    res.render('login', {
        err: 0
    })
});

app.post('/home', (req, res) => {
    let currentMail = req.body.email;
    let currentName;
    let currentId;
    check(currentMail).then((dataLength) => {
        if (dataLength === 1) {
            getAll(json => {
                res.render('studentsList', {
                    users: json
                })
            })
        } else {
            res.render('login', {
                err: 1
            })
        }
    })
});

app.get('/send', (req, res) => {
    sendEmail();
    res.redirect('/');
});

app.listen(3000);
