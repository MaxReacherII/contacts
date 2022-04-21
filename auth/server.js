const emailRegEx = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/gm
const DB = './db.json';
const Users = './users.json';
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const fs = require('fs')

const server = jsonServer.create()
const router = jsonServer.router(DB)

server.use(bodyParser.urlencoded({extended: true}))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = 'ForTheHorde!'
const expiresIn = '1h'

function createToken(payload){
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

function verifyToken(token){
    return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

function isAuthenticated({email, password}){
    return JSON.parse(fs.readFileSync(Users, 'UTF-8')).users.findIndex(user => user.email === email && user.password === password) !== -1
}

server.post('/auth/register', (req, res) => {
    console.log("register endpoint called; request body:");
    console.log(req.body);
    const {email, password} = req.body;

    if(isAuthenticated({email, password}) === true) {
        const status = 409;
        const message = 'User already exists';
        return res.status(status).send({status: status, message: message});
    }

    if (password.length < 8) {
        const status = 400
        const message = 'Password must be at least 8 characters'
        res.status(status).json({status, message})
        return
    }

    if (!email.match(emailRegEx)) {
        const status = 400
        const message = 'Invalid email format'
        res.status(status).json({status, message})
        return
    }


    fs.readFile(Users, (err, data) => {
        if (err) {
            const status = 401
            const message = err
            res.status(status).json({status, message})
            return
        };

        var dataObj = JSON.parse(data.toString());

        var last_item_id
        try{
            last_item_id = dataObj.users[dataObj.users.length-1].id
        } catch(e) {
            last_item_id = 0
        }

        dataObj.users.push({id: last_item_id + 1, email: email, password: password});
        fs.writeFile(Users, JSON.stringify(dataObj), (err, result) => {
            if (err) {
                const status = 401
                const message = err
                res.status(status).json({status, message})
                return
            }
        });
    });

    const access_token = createToken({email, password})
    console.log("Access Token:" + access_token);
    res.status(200).json({access_token})
})

server.post('/auth/login', (req, res) => {
    console.log("login endpoint called; request body:");
    console.log(req.body);
    const {email, password} = req.body;
    if (isAuthenticated({email, password}) === false) {
        const status = 400
        const message = 'Incorrect email or password'
        res.status(status).json({status, message})
        return
    }
    const access_token = createToken({email, password})
    console.log("Access Token:" + access_token);
    res.status(200).json({access_token, email})
})

server.use(/^(?!\/auth).*$/,  (req, res, next) => {
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 400
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