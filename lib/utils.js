'use strict';
/*eslint global module:2*/
var fs = require('fs'),
    request = require('request'),
    cheerio = require('cheerio'),
    _ = require('lodash');

var fns = {
  getSlugNameFor: function(str) {
    var slug = str.replace(/\s+/g, '-').toLowerCase();
    return slug;
  },

  extendWithJSONs: function(series) {
    for (var ser in series) {
      var fileName = './cache/' + fns.getSlugNameFor(ser) + '.json';
      if (!fs.existsSync(fileName)) {
        console.error('json for "', ser, '" not exists. Filename should be: ', fileName);
        continue;
      }

      series[ser].jsonData = require('./.' + fileName);
    }
  },

  writeJSON: function(fileName, jsonData) {
    return new Promise(function (fulfill, reject) {
      fs.writeFile(fileName, JSON.stringify(jsonData, null, 2), function(err) {
        if (err) {
          reject()
        } else {
          fulfill();
        }
      });
    });
  },

  findSeriesByTitle: function(title, series) {
    var hit = _.find(series, function(value, key, fullObj) {
      return key === title;
    });

    if (!hit) {
      console.error('Couldn\'t find this show in the db:', title);
      return '';
    }
    return hit;
  },

  loadUrl: function(url) {

    return new Promise(function (fulfill, reject) {
      request(url, function (error, response, body) {
        if (error || response.statusCode != 200) {
          throw new Error(error);
        }

        fulfill(cheerio.load(body));
      });
    });
  },

  parseStandardWikiTable: function($, $table) {
    var episodes = [];

    $table.find('.vevent').each(function(i, tr) {
      var $tds = $(tr).find('td'),
        episodeNo = $tds.eq(0).text().trim(),
        episode = $tds.eq(1).text().trim(),
        date = $tds.eq(4).text().trim();

      // removing "" -s around it
      episode = episode.slice(1, -1);

      // October 4, 2015 (2015-10-04) -> 2015-10-04
      var convertedDate = /.\((.*?)\).*/.exec(date);

      episodes.push({
        no: episodeNo,
        title: episode,
        date: convertedDate ? convertedDate[1] : 'N/A'
      });
      // console.log(title, episodeNo, date, new Date(date));
    });

    return episodes;
  },

  parseDetailedWikiTable: function($, $table) {
    var episodes = [];

    $table.find('.vevent').each(function(i, tr) {
      var $tds = $(tr).find('td'),
        episodeNo = $(tr).find('th').text().trim(),
        episode = $tds.eq(0).text().trim(),
        date = $tds.eq(3).text().trim();

      // removing "" -s around it
      episode = episode.slice(1, -1);

      // October 4, 2015 (2015-10-04) -> 2015-10-04
      var convertedDate = /.\((.*?)\).*/.exec(date);

      episodes.push({
        no: episodeNo,
        title: episode,
        date: convertedDate ? convertedDate[1] : 'N/A'
      });
      // console.log(title, episodeNo, date, new Date(date));
    });

    return episodes;
  },

  extractDataFromWikiPage: function(seriesData, $) {
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
          throw new Error('Something wrong with the page', series, title);
        }

        if (!seriesData.wikiTable) {
          season.episodes = fns.parseStandardWikiTable($, $table);
        } else if (seriesData.wikiTable === 'detailed') {
          season.episodes = fns.parseDetailedWikiTable($, $table);
        }

        ret.push(season);
      }
    });

    return ret;
  },

  updateCacheFromWiki: function(seriesData) {
    return fns.loadUrl(seriesData.wikiUrl)
      .then(function($) {
        return fns.extractDataFromWikiPage(seriesData, $);
      });
  },

  populateEpisodes: function(series, date, beforeDays, afterDays) {
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
 },

  formatDate: function(date) {
    var month = date.getMonth() + 1,
      day = date.getDay(),
      dayText = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];

    return date.getFullYear() + '-' +
      (month < 10 ? '0' + month : month) + '-' +
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
      ' (' + dayText + ')';
  }

}

module.exports = fns;
