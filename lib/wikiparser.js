'use strict';

var fs = require('fs'),
    cheerio = require('cheerio'),
    _ = require('lodash');

var fns = {

  getCellText: function($td) {
    $td.find('sup').remove();
    return $td.text().trim();
  },

  getDatasFromRow: function($, $table, format) {
    var episodes = [];

    $table.find('.vevent').each(function(i, tr) {
      var $cells = $(tr).find('td, th'),
        episodeNo = fns.getCellText($cells.eq(format.indexOf('episodeNo'))),
        episodeTitle = fns.getCellText($cells.eq(format.indexOf('episodeTitle'))),
        date = fns.getCellText($cells.eq(format.indexOf('date')));

      // removing "" -s around it
      episodeTitle = episodeTitle.slice(1, -1);

      // October 4, 2015 (2015-10-04) -> 2015-10-04
      var convertedDate = /.\((.*?)\).*/.exec(date);

      episodes.push({
        no: episodeNo,
        title: episodeTitle,
        date: convertedDate ? convertedDate[1] : 'N/A'
      });
      // console.log(title, episodeNo, date, new Date(date));
    });

    return episodes;
  },

  extractSeason: function($, $header, seriesData, title, seasonNo) {
    var $table = $header.nextAll('table').eq(0);

    if ($table.length !== 1) {
      throw new Error('Something wrong with the page', series, title);
    }

    var season = {
      season: seasonNo,
      episodes: []
    };

    if (seriesData.rowFormat) {
      season.episodes = fns.getDatasFromRow($, $table, seriesData.rowFormat);
    } else {
      season.episodes = fns.getDatasFromRow($, $table,
        ['totalNo', 'episodeNo', 'episodeTitle', null, null, 'date']);
    }

    return season
  },

  extractDataFromWikiPage: function(seriesData, body, $) {
    var ret = [], season, $ = cheerio.load(body),
      seasonTitle = false, seasonNo;

    $('h3').each(function(i, el) {
      var title = $(el).text().trim();

      if (title.indexOf('Season ') === 0) {
        seasonTitle = true;
        seasonNo = /Season (\d+)+/.exec(title)[1];

        ret.push(fns.extractSeason($, $(el), seriesData, title, seasonNo));
      }
    });

    if (!seasonTitle) {
      $('h2').each(function(i, el) {
        var title = $(el).text().trim();

        if (title.indexOf('Episodes') === 0) {
          ret.push(fns.extractSeason($, $(el), seriesData, title, 1));
        }
      });
    }

    return ret;
  }

}

module.exports = fns;
