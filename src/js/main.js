require.config({
  shim: {
    handlebars: {
      exports: 'Handlebars'
    }
  },
  paths: {
    backbone: '../../bower_components/backbone/backbone',
    underscore: '../../bower_components/underscore/underscore',
    handlebars: '../../bower_components/handlebars/handlebars.runtime',
    jquery: '../../bower_components/jquery/dist/jquery',
    numeral: '../../bower_components/numeral/numeral',
    jst: '../../build/templates'
  }
});
