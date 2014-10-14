require(['collections/election', 'views/overview', 'results', 'jquery'], function(Election, Overview, results, $) {

  $(function() {

    var election = new Election();
    election.reset(results);

    var overview = new Overview({collection: election, el: '#elex-widget'});
    overview.render();

  });

});
