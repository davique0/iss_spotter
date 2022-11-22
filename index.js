const { fetchMyIP, fetchCoordsByIP } = require('./iss');

fetchMyIP((error, ip) => {
  if (error) {
    console.log("It didn't work!" , error);
    return;
  }

  console.log('It worked! Returned IP:' , ip);
});

fetchCoordsByIP("76.67.105.66", (error, coord)=> {
  if (error) {
    console.log("Something is wrong, try again! \n" , error);
    return;
  }

  console.log('Returned Coordinates:' , coord);
});