/////////////////////////////////////////////////////////////////
// This is a CLI tool to update a seeries' data from wikipedia //
/////////////////////////////////////////////////////////////////

var seriesData = require('./config/series-data'),
  utils =   require('./lib/utils');

var argv = require('yargs')
  .default('s', 'Family Guy')
  .argv,
  seriesName = argv.s,
  slug;

var seriesRecord = utils.findSeriesByTitle(seriesName, seriesData);
if (!seriesRecord) {
  process.exit(1);
}

slug = utils.getSlugNameFor(seriesName);

utils.updateCacheFromWiki(seriesRecord)
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
