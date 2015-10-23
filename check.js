var seriesData = require('./config/series-data'),
    userConfig = require('./config/config'),
    utils = require('./lib/utils');

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

var shows = utils.populateEpisodes(seriesData, new Date, userConfig.beforeDays, userConfig.afterDays);

for (var i in shows.showsBefore) {
  echoShowInfo(shows.showsBefore[i]);
}
console.log('-------- NOW ---------');
for (var i in shows.showsAfter) {
  echoShowInfo(shows.showsAfter[i]);
}
