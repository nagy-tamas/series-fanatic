var _ = require('lodash');

module.exports = {
  // remove the ones you don't care about
  interestedIn: ['American Horror Story', 'Family Guy', 'The Big Bang Theory',
    'Halt and Catch Fire', 'Mike & Molly', 'Modern Family', 'Mr. Robot',
    'Once upon a Time', 'South Park', 'Silicon Valley', 'The Simpsons',
    'The Walking Dead', 'Game of Thrones'],

  // time intervals to list episodes before and after NOW
  beforeDays: 7,
  afterDays: 10
};
