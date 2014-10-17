define(['handlebars', 'numeral'], function(Handlebars, numeral) {

  /* Usage: {{class String}} makes a string suitable to use as an HTML class */
  Handlebars.registerHelper('class', function(string) {
    if(!string) {
      return null;
    }
    else {
      var re = new RegExp(' ', 'g');
      var str = string.replace(re, '-').toLowerCase();
      return new Handlebars.SafeString(' ' + str);
    }
  });

  /* Usage: {{icon String}} makes a string suitable to use as an HTML class */
  Handlebars.registerHelper('icon', function(string) {
    if(!string) {
      return null;
    }
    else {
      var str = string.toLowerCase();
      return new Handlebars.SafeString('<i class="icon-' + str + '"></i>');
    }
  });

  /* Usage: {{shortpercent Number}} returns a shortened string representation of  */
  /* an integer using numeral.js */
  Handlebars.registerHelper('shortPercent', function(num) {
    var num = numeral(num);
    return new Handlebars.SafeString(num.format('0'));
  });

  /* Usage: {{longnum Number}} returns a formatted long integer using numeral.js */
  Handlebars.registerHelper('longnum', function(num) {
    var num = numeral(num);
    return new Handlebars.SafeString(num.format('0,0'));
  });

  /* Usage: {{labelClass percent "outside" OR "inside"}} returns a hidden class if the bar label should be hidden */
  Handlebars.registerHelper('labelClass', function(percent, position) {
    if(position === "outside") {
      if (percent > 30) {
        return " hidden";
      }
      else {
        return null;
      }
    }
    else if(position === "inside") {
      if (percent <= 30) {
        return " hidden";
      }
      else {
        return null;
      }
    }
  });

});
