require(['collections/election', 'views/overview', 'jquery'], function(Election, Overview, $) {

  $(function() {

    var election = new Election();
    var overview = new Overview({collection: election, el: '#elex-widget'});
    election.fetch({
      success: function() {
        overview.render();
      }
    });

  });

});
