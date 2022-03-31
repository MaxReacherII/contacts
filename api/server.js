const jsonData = './db.json';
const jsonUsers = './users.json';

const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router(jsonData)

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = 'ForTheHorde!'
const expiresIn = '1h'

// Create a token from a payload
function createToken(payload){
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token
function verifyToken(token){
    return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}){
    return JSON.parse(fs.readFileSync(jsonUsers, 'UTF-8')).users.findIndex(user => user.email === email && user.password === password) !== -1
}

// Register New User
server.post('/auth/register', (req, res) => {
    console.log("register endpoint called; request body:");
    console.log(req.body);
    const {email, password} = req.body;

    if(isAuthenticated({email, password}) === true) {
        const status = 409;
        const message = 'User already exists';
        return res.status(status).send({status: status, message: message});
    }

    fs.readFile(jsonUsers, (err, data) => {
        if (err) {
            const status = 401
            const message = err
            res.status(status).json({status, message})
            return
        };

        // Get current users data
        var dataObj = JSON.parse(data.toString());

        // Get the id of last user
        var last_item_id
        try{
            last_item_id = dataObj.users[dataObj.users.length-1].id
        } catch(e) {
            last_item_id = 0
        }

        //Add new user
        dataObj.users.push({id: last_item_id + 1, email: email, password: password}); //add some data
        fs.writeFile(jsonUsers, JSON.stringify(dataObj), (err, result) => {  // WRITE
            if (err) {
                const status = 401
                const message = err
                res.status(status).json({status, message})
                return
            }
        });
    });

// Create token for new user
    const access_token = createToken({email, password})
    console.log("Access Token:" + access_token);
    res.status(200).json({access_token})
})

// Login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
    console.log("login endpoint called; request body:");
    console.log(req.body);
    const {email, password} = req.body;
    if (isAuthenticated({email, password}) === false) {
        const status = 403
        const message = 'Incorrect email or password'
        res.status(status).json({status, message})
        return
    }
    const access_token = createToken({email, password})
    console.log("Access Token:" + access_token);
    res.status(200).json({access_token})
})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401
        const message = 'Error in authorization format'
        res.status(status).json({status, message})
        return
    }
    try {
        let verifyTokenResult;
        verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

        if (verifyTokenResult instanceof Error) {
            const status = 401
            const message = 'Access token not provided'
            res.status(status).json({status, message})
            return
        }
        next()
    } catch (err) {
        const status = 401
        const message = 'Error access_token is revoked'
        res.status(status).json({status, message})
    }
})

server.use(router)

server.listen(4000, () => {
    console.log('Run Auth API Server')
})