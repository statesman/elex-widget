define(['backbone', 'models/race'], function(Backbone, Race) {

  var Election = Backbone.Collection.extend({
    initialize: function() {
      console.log('initializing collection');
    },

    model: Race
  });

  return Election;

});
