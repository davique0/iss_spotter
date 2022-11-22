const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, flyOverTimes) => {
  if (error) return console.log(`it didn't work`, error);

  console.log(flyOverTimes);
});