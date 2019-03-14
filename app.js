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
            res.redirect('/')
        }
    })
});

app.get('/send/:id', (req, res) => {
    const id = req.params.id;
    let mailList = ["poxezukuf@easyemail.info", "cehizuxuyo@next-mail.info"];

    const file = fs.readFileSync(p);
    const json = JSON.parse(file);

    const troubleMaker = json.find(x => x.id == id);
    const persons = json.filter(x => x.id != id);
    persons.forEach((person) => {
        // mailList += person.mail;
    });
    transporter.sendMail({
        to: mailList,
        subject: 'WARNING',
        html: ejs.renderFile(__dirname + "/template.ejs", {
            title: troubleMaker.name
        }),
    }, (err,info) => {
        if (err)
            return process.exit(1);
    });
    res.redirect('/')
});

app.listen(3000);
