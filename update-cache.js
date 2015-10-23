/////////////////////////////////////////////////////////////////
// This is a CLI tool to update a seeries' data from wikipedia //
/////////////////////////////////////////////////////////////////

var db = require('./db/db'),
  utils = require('./lib/utils');

var argv = require('yargs')
  .default('s', 'Family Guy')
  .argv,
  seriesName = argv.s;

utils.parseWiki(db.findByTitle(seriesName))
  .then(function(json) {
    utils.writeJSON('./db/' + utils.getSlugNameFor(seriesName) + '.json', json);
  })
  .then(function() {
    console.log('Everything worked out fine,', utils.getSlugNameFor(seriesName), '\s cache was updated.');
  })
  .catch(function(err) {
    console.error('Some error happened during updating:', seriesName, ', halted. Details:');
    console.error(err);
  });
