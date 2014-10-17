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

  /* Usage: {{shortnum Number}} returns a shortened string representation of  */
  /* an integer using numeral.js */
  Handlebars.registerHelper('shortnum', function(num) {
    var format;
    if(num >= 1000000) {
      format = '0.0a';
    }
    else if(num >= 100000) {
      format = '0a';
    }
    else if(num >= 1000) {
      format = '0.0a';
    }
    else {
      format = '0';
    }
    var num = numeral(num);
    return new Handlebars.SafeString(num.format(format));
  });

  /* Usage: {{longnum Number}} returns a formatted long integer using numeral.js */
  Handlebars.registerHelper('longnum', function(num) {
    var num = numeral(num);
    return new Handlebars.SafeString(num.format('0,0'));
  });

});
