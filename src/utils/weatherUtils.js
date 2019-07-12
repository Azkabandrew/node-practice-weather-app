const request = require('request');

const getForecast = (latitude, longitude, callback) => {
    const url = getDarkSkyRequest(latitude, longitude);
    request({ url , json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather services!', undefined);
        } else if (body.error) {
            callback('Unable to find location', undefined);
        } else {
            callback(undefined, getSummary(body.currently));
        }
    })
};

const getSummary = ({summary, temperature, precipProbability, humidity}) =>  `${summary}. It is currently ${temperature}` +
    ` degrees outside with a ${precipProbability}% chance of rain.` +
    ` The humidity is ${humidity*100}%.`;


const getDarkSkyRequest = (latitude, longitude) => {
    const darkSkyEndpoint = 'https://api.darksky.net/forecast/';
    const apiKey = '974043215bc5b11c02335b1e391ccfde';
    return darkSkyEndpoint + apiKey + '/' + latitude + ',' + longitude;
};

module.exports = getForecast;