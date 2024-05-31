const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sendMagicLinkEmail } = require('../utils/mailer');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../db/users.json');

const readData = () => {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
};

const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

app.use(express.json())
  
router.post('/login', async (req, res) => {
    const users = readData();
    const user = users.find(u => u.email === req.body.email);

    if (user != null) {
        try {
            const token = jwt.sign({ userId: user.id}, process.env.JWT_SECRET, {
                expiresIn: "10m"
            });
            await sendMagicLinkEmail({ email: user.email, token });
        } catch (e) {
            return res.send("Error logging in. Please try again.");
        }
    } else {
        return res.status(404).send('Incorrect email address');
    }

    res.send("Check your email to finish logging in");
});

router.get('/verify', (req, res) => {
    const { token } = req.query;
    const users = readData();
    if (token == null) return res.sendStatus(401);

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = users.find(u => u.id === decodedToken.userId);
        res.redirect(`/?user=${user.id}`);
    } catch (error) {
        res.status(401);
    }
});

router.get('/address/:id', (req, res) => {
    const users = readData();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    return res.send(users[userIndex].address);
})

router.put('/add-address/:id', async (req, res) => {
    const { address } = req.body;
    const users = readData();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const response = await fetch(`https://mempool.space/api/address/${address}`);

    if (!response.ok) {
        return res.status(response.status).json({ error: 'Invalid Bitcoin Address'});
    }

    users[userIndex].address = address;
    writeData(users);
    res.sendStatus(200);
});

router.get('/', (req, res) => {
  res.json({ message: 'Hello World!'});
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);