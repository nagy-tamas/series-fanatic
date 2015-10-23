/////////////////////////////////////////////////////////////////
// This is a CLI tool to update a series' data from wikipedia //
/////////////////////////////////////////////////////////////////

var seriesData = require('./config/series-data'),
    userConfig = require('./config/config'),
    utils =   require('./lib/utils'),
    _ = require('lodash');

var argv = require('yargs')
  // could be a series' name, 'all' for everything, or 'favs' for the interested ones
  .default('shows', 'favs')
  .argv,
  seriesNames,
  slug;

if (argv.shows === 'all') {
  seriesNames = _.pluck(seriesData, 'key');
} else if (argv.shows === 'favs') {
  seriesNames = userConfig.interestedIn
} else {
  seriesNames = [argv.shows];
}

var processSeries = function(seriesName) {
  console.log('Updating cache for', seriesName, '...');

  var seriesRecord = utils.findSeriesByTitle(seriesName, seriesData);
  if (!seriesRecord) {
    process.exit(1);
  }

  slug = utils.getSlugNameFor(seriesName);

  return utils.updateCacheFromWiki(seriesRecord)
    .then(function(json) {
      return utils.writeJSON('./cache/' + slug + '.json', json);
    })
    .then(function() {
      console.log('Everything worked out fine, the ', slug, ' cache was updated.');
    })
    .catch(function(err) {
      console.error('Some error happened during updating:', seriesName, ', halted. Details:');
      console.error(err);
    });
};

var promisesChain = processSeries(seriesNames[0]);
for (var i = 1; i < seriesNames.length; i++) {
  (function(i) {
    promisesChain = promisesChain.then(function() {
      return processSeries(seriesNames[i]);
    });
  })(i);
}
