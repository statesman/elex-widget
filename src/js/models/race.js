define(['backbone'], function(Backbone) {

  var Race = Backbone.Model.extend({
    initialize: function() {
      console.log('initializing model');
    },

    defaults: {
      'type': 'bars'
    }
  });

  return Race;

});
