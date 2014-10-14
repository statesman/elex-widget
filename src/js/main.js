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
    helpers: '../templates/helpers',
    jst: '../../build/templates'
  }
});
