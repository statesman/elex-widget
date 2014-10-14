define(['handlebars'], function(Handlebars) {

  /* Usage: {{class String}} makes a string suitable to use as an HTML class */
  Handlebars.registerHelper('class', function(string) {
    if(typeof string === "undefined") {
      return null;
    }
    else {
      var str = string.replace(' ', '-').toLowerCase();
      return new Handlebars.SafeString(' ' + str);
    }
  });

});
