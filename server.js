var schedule = require('node-schedule');
var request = require('request');
var places = require('./places');

// Place configuration
var PLACE_ID = "Place1"
var PLACE_DESCRIPTION = "Santa Cruz de Tenerife"
var PLACE_LATLON = [28.4718594,-16.2557392];

// Weather service configurarion
var APIKEY = "70ea1b52f9f60506240faf2f4a4f130a"
var WEATHER_URI = "https://api.forecast.io/forecast/" + APIKEY + "/" + PLACE_LATLON.toString();
var SCHEDULER = '*/30 * * * * *';

var j = schedule.scheduleJob(SCHEDULER, function(){
  request(WEATHER_URI, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var weatherJson = JSON.parse(body);
      if (weatherJson.currently &&
        weatherJson.currently.temperature &&
        weatherJson.currently.time) {

        // get temperature
        var temperatureF = parseFloat(weatherJson.currently.temperature);
        var temperatureC = (temperatureF - 32) * (5/9);
        temperatureC = temperatureC.toFixed(2);

        // get time
        var time = new Date(weatherJson.currently.time * 1000);

        console.log(time + " : " + temperatureC);

        //TODO: update entity in context broker
        places.updatePlaceTemperature(PLACE_ID, temperatureC).then(function(req1) {
          console.log('OK PUT ' + PLACE_ID + ' - ' + temperatureC);
        }).catch(function(error) {
            places.createPlace(PLACE_ID, PLACE_DESCRIPTION, PLACE_LATLON).then(function(req2) {
              places.updatePlaceTemperature(PLACE_ID, temperatureC).then(function(req3) {
              }).catch(function(error){
                console.log("ERROR: Could not update Place " + PLACE_ID);
              });
            }).catch(function(error) {
              console.log("ERROR: Could not create Place " + PLACE_ID);
            });
        });
      }
    }
  });
});
