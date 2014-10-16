define(['backbone', 'collections/election', 'views/overview', 'views/detail', 'jquery', 'modules/window', 'views/group'], function(Backbone, Election, Overview, Detail, $, win, Group) {

  // A class that can handle view-swapping
  var ViewPane = function(el){
    this.$el = $(el);
    this.show = function(currentView) {
      this.close();
      currentView.render();
      this.$el.html(currentView.el);
      win.sendHeight();
      this.view = currentView;
    };
    this.close = function() {
      if(typeof this.view !== "undefined") {
        if(this.view.close) {
          this.view.close();
        }
        this.$el.empty();
      }
    }
  };

  var App = Backbone.Router.extend({

    initialize: function() {
      Backbone.history.start();
      this.detailPane = new ViewPane('#race-detail');
    },

    routes: {
      '': 'overview',
      'details/:race': 'details',
      'group/:group(/:race)': 'groupDetail',
      'embed/:race': 'embed'
    },

    overview: function() {
      if(typeof this.detailPane !== "undefined") {
        this.detailPane.close();
      }
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
      var detail = new Detail({model: race});
      this.detailPane.show(detail);
    },

    _getGroup: function(groupName) {
      var filtered = this.election.filter(function(race) {
        return race.get('group') === groupName;
      });
      var newCollection = new Election();
      newCollection.reset(filtered);
      return newCollection;
    },

    groupDetail: function(groupName, raceId) {
      var newCollection = this._getGroup(groupName);
      var group = new Group({collection: newCollection, active: raceId});
      this.detailPane.show(group);
    },

    embed: function(raceId) {
      var election = new Election();

      election.fetch({
        success: function() {
          var race = election.get(raceId);
          var detail = new Detail({model: race});
          detail.render();
          $('#embed').html(detail.el);
        }
      });
    }

  });

  return App;

});
