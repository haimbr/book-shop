const path = require('path');
const express = require('express');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
require('./db/mongoose');
const userRouter = require('./routers/user');
const bookRouter = require('./routers/book');
const Book = require('./models/bookModel');
const { auth, checkUser } = require('./middleware/auth');

const app = express();
const port = process.env.PORT;

 
// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))
app.use(cookieParser());
app.use(express.json());


app.get('*', checkUser);
app.use(userRouter);
app.use(bookRouter);


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
