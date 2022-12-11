const express = require('express')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
const Blog = require('./models/mySchema')

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.qrdg3nu.mongodb.net/myData?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(port, () => {
            console.log(`Example app listening on http://localhost:${port}`)
        })
    })
    .catch((err) => console.log(err))

const path = require('path')
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
const connectLivereload = require("connect-livereload");
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

app.get('/', (req, res) => {
    Blog.find()
        .then((result) => {
            res.render('index', {articles: result})
        })
        .catch((err) => {
            console.log(err)
        })
})

app.post('/create', (req, res) => {
    const blog = new Blog(req.body)

    blog.save()
        .then((result) => {
            res.redirect('/')
        })
        .catch((err) => {
            console.log(err)
        })
})

app.use((req, res, next) => {
    res.render('404')
})