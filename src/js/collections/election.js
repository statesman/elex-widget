define(['backbone', 'models/race'], function(Backbone, Race) {

  var Election = Backbone.Collection.extend({
    model: Race,

    url: 'data/data.json'
  });

  return Election;

});
