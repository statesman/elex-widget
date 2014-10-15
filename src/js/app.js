require(['collections/election', 'views/overview', 'views/detail', 'jquery', 'pym'], function(Election, Overview, Detail, $, pym) {

  var pymChild = new pym.Child();

  $(function() {

    var election = new Election();
    var overview = new Overview({collection: election, el: '#elex-widget'});

    election.fetch({
      success: function() {
        overview.render();
        pymChild.sendHeight();

        var race = election.get('od6');
        var detail = new Detail({model: race, el: '#race-detail'});
        detail.render();
        pymChild.sendHeight();
      }
    });

    setInterval(function() {
      election.fetch();
    }, 5000);

  });

});
