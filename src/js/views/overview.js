define(['backbone', 'views/leader', 'modules/window'], function(Backbone, Leader, win) {

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
      win.sendHeight();
      return this;
    }
  });

  return Overview;

});
