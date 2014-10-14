define(['backbone', 'views/leader'], function(Backbone, Leader) {

  var Overview = Backbone.View.extend({
    renderSingle: function(model) {
      var leader = new Leader({model: model});
      this.$el.append(leader.render().el);
    },

    render: function() {
      _.each(this.collection.models, this.renderSingle, this);
      return this;
    }
  });

  return Overview;

});
