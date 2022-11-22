/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    //handles error in communication with API
    if (error) return callback(error, null);
    //even if there is not an initial error in the communications, if the response code is anything but 200 it is consider an error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const ipAddress = JSON.parse(body);
    //if everything is fine error us null adn enter our IP as second argument
    callback(null, ipAddress.ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) return callback(error, null);

    const coord = JSON.parse(body);

    //error handler when success = false
    if (!coord.success) {
      const msg = `Success response: ${coord.success} when reading IP: ${coord.ip}, Server says: ${coord.message}`;
      callback(msg, null);
      return;
    }

    callback(null, {latitude: coord.latitude, longitude: coord.longitude});
  });
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {

    if (error) return callback(error, null);

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS flying times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    if (body === 'invalid coordinates') {
      let msg = "invalid coordinates, please check and try again";
      callback(msg, null);
    }

    const flyTimes = JSON.parse(body);

    callback(null, flyTimes.response);
  });
};
/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = (callback => {
  fetchMyIP((error, ip) => {
    if (error) return callback(error, null);

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) return callback(error, null);

      fetchISSFlyOverTimes(coords, (error, flyTimes) => {
        if (error) return callback(error, null);
        //converting the array of objects into readable dates, Unix Time to today's time
        callback(null, flyTimes);
      });
    });
  });
});

module.exports = { nextISSTimesForMyLocation };