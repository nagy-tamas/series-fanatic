var seriesData = require('./config/series-data'),
    utils = require('./lib/utils'),
    fs = require('fs');


if (!fs.existsSync('./config/config.js')) {
  console.error('./config/config.js cannot be found. Please make a copy of ./config/config.sample.js under that name, and edit it for your needs.');
  process.exit(-1);
}

var userConfig = require('./config/config');


var echoShowInfo = function(show) {
  console.log(
    utils.formatDate(show.episode.dateObj),
    ' - ',
    show.series,
    'S' + show.season + '#' + show.episode.no + ':',
    show.episode.title
  );
};

utils.extendWithJSONs(seriesData);

var now = new Date;
now.setTime(now.getTime() - 24 * 60 * 60 * 1000);

var shows = utils.populateEpisodes(seriesData, now, userConfig.beforeDays, userConfig.afterDays);

for (var i in shows.showsBefore) {
  echoShowInfo(shows.showsBefore[i]);
}
console.log('-------- NOW ---------');
for (var i in shows.showsAfter) {
  echoShowInfo(shows.showsAfter[i]);
}
