module.exports = {
  slugName: function(str) {
    var slug = str.replace(/\s+/g, '-').toLowerCase();
    return slug;
  }
};
