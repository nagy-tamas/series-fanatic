var db = require('./db/db'),
  utils = require('./lib/utils'),
  _ = require('lodash'),
  fs = require('fs'),
  beforeDays = 7,
  afterDays = 7;

var getJSONs = function(series) {
  var files = fs.readdirSync('./db');

  for (var ser in series) {
    var fileName = './db/' + utils.slugName(ser) + '.json';
    if (!fs.existsSync(fileName)) {
      console.error('json for "', ser, '" not exists. Filename should be: ', fileName);
      continue;
    }

    series[ser].json = fileName;
  }
};

var includeJSONs = function(series) {
  for (var ser in series) {
    if (series[ser].json) {
      series[ser].jsonData = require(series[ser].json);
    }
  }
};

var checkDates = function(series, date) {
  var showsBefore = [], showsAfter = [],
    beforeDate = date.getTime() - beforeDays * 1000 * 24 * 60 * 60,
    afterDate = date.getTime() + afterDays * 1000 * 24 * 60 * 60,
    nowDate = date.getTime();

  _.each(series, function(data, key) {
    if (data.jsonData) {
      _.each(data.jsonData, function(season) {
        _.each(season.episodes, function(episode) {
          episode.dateObj = new Date(episode.date);
          if (episode.dateObj.getTime() > beforeDate && episode.dateObj.getTime() < nowDate) {
            showsBefore.push({ series: key, season: season.season, episode: episode});
          } else {
            if (episode.dateObj.getTime() > nowDate && episode.dateObj.getTime() < afterDate)
            showsAfter.push({ series: key, season: season.season, episode: episode});
          }
        });
      });
    }
  });

  return {
    showsBefore: _.sortBy(showsBefore, function(n) {
      return n.episode.dateObj.getTime();
    }),
    showsAfter: _.sortBy(showsAfter, function(n) {
      return n.episode.dateObj.getTime();
    })
  };
};

var formatDate = function(date) {
  var month = date.getMonth() + 1,
    day = date.getDay(),
    dayText = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];

  return date.getFullYear() + '-' +
    (month < 10 ? '0' + month : month) + '-' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    ' (' + dayText + ')';
};

var writeShowInfo = function(show) {
  console.log(
    formatDate(show.episode.dateObj),
    ' - ',
    show.series,
    'S' + show.season + '#' + show.episode.no + ':',
    show.episode.title
  );
};

getJSONs(db.series);
includeJSONs(db.series);

var shows = checkDates(db.series, new Date);

for (var i in shows.showsBefore) {
  writeShowInfo(shows.showsBefore[i]);
}
console.log('-------- NOW ---------');
for (var i in shows.showsBefore) {
  writeShowInfo(shows.showsAfter[i]);
}
