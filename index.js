const express = require('express'),
    app = express(),
    fs = require('fs'),
    url = require('url'),
    mySql = require('mysql'),
    bodyParser = require('body-parser')
    cookieSession = require('cookie-session'),
    port = process.env.PORT || 3000,
    env = process.env.NODE_ENV || 'development',
    cloneDeep = require('lodash.clonedeep'),
    institutionsApiHelper = require('./api/institutionsData'),
    redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
 
let server;

const dbConnection = mySql.createConnection({
    host: "r6ze0q02l4me77k3.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
    user: "qnb696pnrf7r8nos",
    password: "irsiotaejg0o046h",
    database: "sdgdzt8r494bddye"
});

dbConnection.connect(function(error){
    if (error)
        throw error;
    console.log("Connected to the database!");
});

const forceSsl = function(req, res, next) {
    //console.log(req.headers);
    if (req.get('x-forwarded-proto') !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
};

//application resources folders setup
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use('/scripts', express.static(__dirname + '/node_modules'));

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

//cookie-session middleware
app.use(cookieSession({
    name: 'session',
    keys: ['whatever'],
    maxAge: 24 * 60 * 60 * 1000
}));

//redirect http to https
app.use(redirectToHTTPS([], []));

app.get('/', (req, res) => {
    res.type('text/html');

    fs.readFile('./public/views/main.html', (error, data) => {
        if (error) {
            throw error;
        }

        res.send(data);
    });

});

app.get('/getInstitutions', (request, response) => {

    institutionsApiHelper.getAllInstitutionsData(dbConnection, response);

});

app.get('/getInstitutionActions/:instId', (req, res) => {
    dbConnection.query('SELECT * FROM `Actions` WHERE `InstitutionId` = ?', [req.params.instId], function(error, results, fields) {
        if (error)
            throw error;
        //console.log(results);  
        res.send(JSON.stringify(results));  
    });
});

app.get('/getActionInstructions/:actId', (req, res) => {
    dbConnection.query('SELECT * FROM ActionInstructions WHERE ActionId = ?', [req.params.actId], function(error, results, fields) {
        if (error)
            throw error;
        //console.log(results);

        res.send(JSON.stringify(results)); 
    });
});



if (env === 'production'){
    
    console.log('production');

    server = require('http').Server(app);
}
else if (env === 'development'){

    console.log('development');

	server = require('https').createServer(
    {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app);
}

server.listen(port);