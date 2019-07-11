const request = require('request');

const findGeocode = (address, callback) => {
    const url = getMapboxRequest(address);
    request({ url, json: true}, (error, { body }) => {
        if (error) {
            callback('Unable to connect to location services!', undefined);
        } else if (body.message === 'Not Found' || body.features.length === 0) {
            callback('Unable to find location.', undefined);
        } else {
            const features = body.features[0];
            const longitude = features.center[0];
            const latitude = features.center[1];
            const location = features.place_name;
            callback(undefined, {
                latitude: latitude,
                longitude:longitude,
                location: location});
        }
    });
}

const getMapboxRequest = (address) => {
    const mapBoxEndpoint = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    const mapBoxToken = '?access_token=pk.eyJ1IjoiYW5kcmV3cGh1bmciLCJhIjoiY2p4OWRkOGtvMGw4NTNydDh4amk2eW1jNSJ9.fdO0LPOIRDCCRi6UNEQB4g';
    const cityToSearch = `${encodeURIComponent(address)}.json`;
    const mapBoxLimit = '&limit=1';

    return mapBoxEndpoint + cityToSearch + mapBoxToken + mapBoxLimit;
}

module.exports = findGeocode;