var moment;

moment = require('moment');

module.exports = function(_) {
  _.mixin({

    /*
      DISPLAY/OUTPUT FORMAT METHODS
     */
    date: function(dateString, format) {
      if (!dateString) {
        dateString = new Date();
      }
      if (!format) {
        format = "MM/DD/YYYY hh:mm:ss a";
      }
      return moment(dateString).format(format);
    },
    calendar: function(dateString) {
      return moment(dateString).calendar();
    },
    age: function(dateString) {
      return moment(dateString).fromNow();
    },
    utc_date: function(dateString) {
      return moment.utc(dateString);
    },
    pretty_date: function(dateString) {
      return _.date(dateString, "dddd, MMMM Do YYYY, h:mm:ss a ZZ");
    },
    pretty_utc_date: function(dateString) {
      return _.pretty_date(_.utc_date(dateString));
    },
    dayOfMonth: function(dateString) {
      return _.date(dateString, "D");
    },
    date2d: function(dateString) {
      return _.date(dateString, "DD");
    },
    month2d: function(dateString) {
      return _.date(dateString, "MM");
    },
    monthAbbr: function(dateString) {
      return _.date(dateString, "MMM");
    },
    monthFull: function(dateString) {
      return _.date(dateString, "MMMM");
    },
    year: function(dateString) {
      return _.date(dateString, "YYYY");
    },

    /*
      PARSING METHODS
     */
    parse_date: function(dateString, format) {
      return moment(dateString, format);
    },
    parse_unix_timestamp: function(unix_timestamp) {
      var timestamp;
      timestamp = moment(parseInt(unix_timestamp));
      if (timestamp.isBefore('1986-12-02')) {
        return timestamp = moment(parseInt(unix_timestamp * 1000));
      } else {
        return timestamp;
      }
    }
  });
  return _;
};
