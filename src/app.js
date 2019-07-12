const path = require('path');
const express = require('express');
const getForecast = require('./utils/weatherUtils');
const findGeocode = require('./utils/geocodeUtils');
const hbs = require('hbs');

const log = console.log;

const app = express();
const port = process.env.PORT || 3000

// Define paths for Express config
const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialPaths = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPaths);

// Setup static directory to serve
app.use(express.static(publicPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Andrew'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Andrew Phung'
    });
});

app.get('/help', (req, res) => {
   res.render('help', {
       title: 'Welcome to the help page',
       description: 'Find some help here',
       name: 'Andrew Phung'
   });
});

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        res.send({
            error: 'You must provide an address!'
        });
        return;
    }

    findGeocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            });
        }

        getForecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                });
            }

            res.send({
                address: address,
                location: location,
                forecast: forecastData
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        res.send({
            error: 'You must provide a search term!'
        });
        return;
    }

    log(req.query);
    res.send({
        products: []
    });
});

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: '404',
        name: 'Andrew Phung',
        errorMsg: 'Help article not found.',
    });
});

app.get('*', (req, res) => {
    res.render('error', {
        title: '404',
        name: 'Andrew Phung',
        errorMsg: 'Page not found!',
    });
});

app.listen(port, () => {
    log(`Server started on port ${port}.`);
});