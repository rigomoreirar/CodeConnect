import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import fs from 'fs';
import cors from 'cors';

import ROUTES from 'ROUTES.MJS';

import HttpError from './models/http-error.mjs';

const app = express();

app.use(cors());

app.use(bodyParser.json());


// Needs to be modified to k3s only access and logging

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

// This are routes endpoints

app.use('/api/ROUTES', ROUTES);


// err handling, more err logic needed 
app.use((req, res, next) => {
    const error = new HttpError(`Could not find the requested route: ${req.method} ${req.originalUrl}`, 404);
    console.error(`Route not found: ${req.method} ${req.originalUrl}`);
    if (req.body) {
        console.error('Request body:', req.body);
    }
    if (req.query) {
        console.error('Query parameters:', req.query);
    }
    return next(error);
});


app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res
    .status(error.code || 500)
    .json({message: error.message || 'An unkown error ocurred!'});
});

mongoose.connect(
    `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.CONNECTION_STRING}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000);
})
.catch(err => console.error('Could not connect to MongoDB', err));



