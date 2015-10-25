'use strict';

var fs = require('fs'),
    cheerio = require('cheerio'),
    _ = require('lodash');

var fns = {

  getCellText: function($td) {
    $td.find('sup').remove();
    return $td.text().trim();
  },

  parseStandardWikiTable: function($, $table) {
    var episodes = [];

    $table.find('.vevent').each(function(i, tr) {
      var $tds = $(tr).find('td'),
        episodeNo = fns.getCellText($tds.eq(0)),
        episodeTitle = fns.getCellText($tds.eq(1)),
        date = fns.getCellText($tds.eq(4));

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

  parseDetailedWikiTable: function($, $table) {
    var episodes = [];

    $table.find('.vevent').each(function(i, tr) {
      var $tds = $(tr).find('td'),
        episodeNo = fns.getCellText($(tr).find('th')),
        episodeTitle = fns.getCellText($tds.eq(0)),
        date = fns.getCellText($tds.eq(3));

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

  extractDataFromWikiPage: function(seriesData, body, $) {
    var ret = [], season, $ = cheerio.load(body);

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
  }

}

module.exports = fns;
