var request = require('request');
var moment = require('moment');

var ORION_URL = 'http://localhost:1026/v2';

module.exports = {
  updatePlaceTemperature: function(idplace, temperature) {
    return new Promise(function(resolve, reject) {
      request({
        url: ORION_URL + '/entities/' + idplace + '/attrs/' + 'temperature',
        method: 'PUT',
        json: {'value':temperature,'type':'Float','metadata':{'modifiedAt':{'value':moment().format(),'type':'DateTime'}}}
      }, function(error, request, body){
        if (request && request.statusCode != 204) {
          reject(error);
        }
        resolve(request);
      });
    });
  },
  createPlace: function(idplace, description, locationArray) {
    return new Promise(function(resolve, reject) {
      request({
        url: ORION_URL + '/entities',
        method: 'POST',
        json: {
                "id": idplace,
                "type": "Place",
                "description": {
                  "value": description,
                  "type": "String"
                },
                "location": {
                  "value": locationArray.toString(),
                  "type": "geo:point"
                },
                "temperature": {
                  "value": 0,
                  "type": "Float",
                  "metadata": {
                    "modifiedAt": {
                      "value": moment().format(),
                      "type": "DateTime"
                    }
                  }
                }
              }
      }, function(error, request, body){
        if (error) {
          console.log("Place " + idplace + " creation failed!!!");
          reject(error);
        }
        console.log("Place " + idplace + " created!!!");
        resolve(request);
      });
    });
  }
};
