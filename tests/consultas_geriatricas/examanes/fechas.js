const moment = require('moment')
const fs = require('fs');
var initialDate = "2021-04-14";
var daysToAdd = 1800;

var resDays = [];
for(var i = 0; i < daysToAdd; i++){
    initialDate = moment(initialDate).add(i, 'days').format("YYYY-MM-DD")
    resDays.push(initialDate)
    initialDate = "2021-04-14";
}

let jsonDays = JSON.stringify(resDays)
console.log(jsonDays)