define(['backbone', 'views/leader'], function(Backbone, Leader) {

  var Overview = Backbone.View.extend({
    initialize: function() {
      this.collection.on('change', this.render, this);
    },

    renderSingle: function(model) {
      if(model.get('overview')) {
        var leader = new Leader({model: model});
        this.$el.append(leader.render().el);
      }
    },

    render: function() {
      this.$el.empty();
      _.each(this.collection.models, this.renderSingle, this);
      return this;
    }
  });

  return Overview;

});
