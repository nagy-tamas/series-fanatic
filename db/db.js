var _ = require('lodash');

var series = {
  'Family Guy': {
    url: 'https://en.wikipedia.org/wiki/List_of_Family_Guy_episodes'
  },
  'The Big Bang Theory': {
    url: 'https://en.wikipedia.org/wiki/List_of_The_Big_Bang_Theory_episodes'
  },
  'American Horror Story': {
    url: 'https://en.wikipedia.org/wiki/List_of_American_Horror_Story_episodes'
  },
  'Halt and Catch Fire': { // fix
    url: 'https://en.wikipedia.org/wiki/List_of_Halt_and_Catch_Fire_episodes'
  },
  'Mike & Molly': {
    url: 'http://en.wikipedia.org/wiki/List_of_Mike_%26_Molly_episodes'
  },
  'Modern Family': {
    url: 'http://en.wikipedia.org/wiki/List_of_Modern_Family_episodes'
  },
  'Mr. Robot': { // fix
    url: 'https://en.wikipedia.org/wiki/Mr._Robot_(TV_series)'
  },
  'Once upon a Time': { // fix
    url: 'http://en.wikipedia.org/wiki/List_of_Once_Upon_a_Time_episodes'
  },
  'South Park': {
    url: 'http://en.wikipedia.org/wiki/List_of_South_Park_episodes'
  },
  'Silicon Valley': {
    url: 'http://en.wikipedia.org/wiki/List_of_Silicon_Valley_episodes'
  },
  'The Simpsons': {
    url: 'http://en.wikipedia.org/wiki/List_of_The_Simpsons_episodes'
  },
  'The Walking Dead': {
    url: 'http://en.wikipedia.org/wiki/List_of_The_Walking_Dead_episodes'
  },
  'Game of Thrones': {
    url: 'https://en.wikipedia.org/wiki/List_of_Game_of_Thrones_episodes'
  }
};

module.exports = {
  series: series,
  findByTitle: function(title) {
    var hit = _.find(series, function(value, key, fullObj) {
      return key === title;
    });

    if (!hit) {
      console.error('Can\' find this show:', title);
      return '';
    }
    return hit;
  }

};
