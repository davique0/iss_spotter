/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request')

const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    //handles error in communication with API
    if (error) return callback(error, null);
    //even if there is not an initial error in the communications, if the response code is anything but 200 it is consider an error
    if(response.statusCode !== 200) {
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
    // console.log(coord.success)

    //error handler when success = false
    if (!coord.success) {
      const msg = `Success response: ${coord.success} when reading IP: ${coord.ip}, Server says: ${coord.message}`;
      callback(msg, null);
      return;
    };

    // console.log(coord.success)


    callback(null, {latitude: coord.latitude, longitude: coord.longitude})
  });
};

module.exports = { fetchMyIP, fetchCoordsByIP };