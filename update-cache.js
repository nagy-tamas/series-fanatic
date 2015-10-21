var db = require('./db/db'),
  utils = require('./lib/utils'),
  fs = require('fs'),
  request = require('request'),
  cheerio = require('cheerio');

var argv = require('yargs')
  .default('s', 'Family Guy')
  .argv;

var writeJSON = function(fileName, data, cb) {
  fs.writeFile(fileName, JSON.stringify(data, null, 2), function(err) {
    if(err) {
      console.log(err);
    } else {
      cb();
    }
  });
};

var parseWiki = function(series, cb) {
  var ret = {}, $;

  request(series.url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      $ = cheerio.load(body);
      var ret = [], season;

      $('h3').each(function(i, el) {
        var title = $(el).text().trim(), $table, $tds;

        if (title.indexOf('Season ') === 0) {
          $table = $(el).nextAll('table').eq(0);
          title = /Season (\d+)+/.exec(title)[1];

          season = {
            season: title,
            episodes: []
          };

          if ($table.length !== 1) {
            console.error('Something wrong with the page', series, title);
          }

          $table.find('.vevent').each(function(i, tr) {
            var $tds = $(tr).find('td'),
              episodeNo = $tds.eq(0).text().trim(),
              episode = $tds.eq(1).text().trim(),
              date = $tds.eq(4).text().trim();

            // removing "" -s around it
            episode = episode.slice(1, -1);

            // October 4, 2015 (2015-10-04) -> 2015-10-04
            date = /.\((.*?)\).*/.exec(date)[1];
            season.episodes.push({
              no: episodeNo,
              title: episode,
              date: date
            });
            // console.log(title, episodeNo, date, new Date(date));
          });

          ret.push(season);
        }
      });

      cb(ret);
    }
  });

  return '';
}

parseWiki(db.findByTitle(argv.s), function(json) {
  writeJSON('./db/' + utils.slugName(argv.s) + '.json', json, function() {
    console.log('Everything worked out fine.');
  });
});
