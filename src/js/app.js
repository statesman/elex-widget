require(['collections/election', 'views/overview', 'views/detail', 'jquery'], function(Election, Overview, Detail, $) {

  $(function() {

    var election = new Election();
    var overview = new Overview({collection: election, el: '#elex-widget'});

    election.fetch({
      success: function() {
        overview.render();

        var race = election.get('od6');
        var detail = new Detail({model: race, el: '#race-detail'});
        detail.render();
      }
    });

    setInterval(function() {
      election.fetch();
    }, 5000);

  });

});
