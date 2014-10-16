define(['backbone', 'collections/election', 'views/overview', 'views/detail'], function(Backbone, Election, Overview, Detail) {

  var App = Backbone.Router.extend({

    initialize: function() {
      Backbone.history.start();
    },

    routes: {
      '': 'overview',
      'details/:race': 'details'
    },

    overview: function() {
      this.election = new Election();
      var overview = new Overview({collection: this.election, el: '#elex-widget'});
      this.election.fetch({
        success: function() {
          overview.render();
        }
      });
      var self = this;
      setInterval(function() {
        self.election.fetch();
      }, 5000);
    },

    details: function(raceId) {
      var race = this.election.get(raceId);
      var detail = new Detail({model: race, el: '#race-detail'});
      detail.render();
    }

  });

  return App;

});
