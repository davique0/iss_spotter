const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes } = require('./iss');

let ipAddress = '';
let coordinates = {};

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }
  ipAddress = ip;
  console.log('It worked! Returned IP:' , ip);
});

fetchCoordsByIP(ipAddress, (error, coord)=> {
  if (error) {
    console.log("Something is wrong, try again! \n" , error);
    return;
  }
  coordinates = coord;
  console.log('Returned Coordinates:' , coordinates);
});

fetchISSFlyOverTimes({latitude: 43.653226, longitude: -79.3831843}, (error, flyOverTimes)=> {
  if (error) {
    console.log("There has been an error please try again! \n", error);
    return;
  }
  console.log('ISS will fly over your coordinates on: ', flyOverTimes);
});