const express = require(`express`);
const logger = require(`morgan`);
const dotenv = require('dotenv');

dotenv.config();

const usersRouter = require(`./routes/users`);
const postsRouter = require(`./routes/posts`);
const commentsRouter = require(`./routes/comments`);

let app = express();

const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
    res.setHeader('Access-Control-Max-Age', '1000');
    next();
};


app.use(allowCrossDomain);

app.use(logger(`dev`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(`/users`, usersRouter);
app.use(`/posts`, postsRouter);
app.use(`/comments`, commentsRouter);

module.exports = app;
