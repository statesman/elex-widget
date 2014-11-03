# Statesman.com election results widget

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

This repo contains the code for our election night home page results display for the 2014 general election. It's a Backbone app with an overview view that shows top candidates in all races for which we have data with bar charts for each race and a detail view that pops up below the overview and contains precise totals and all candidates.

The widget is designed to be run in an `iframe`. Because the height of the document changes as the detail view is opened and based on how many candidates/races are shown in the overview [pym.js](http://blog.apps.npr.org/pym.js/) is required.

New results are fetched in the background and the widget updates in place thanks to [`Backbone.fetch`](http://backbonejs.org/#Collection-fetch), which runs at a configurable interval using `setInterval`, which is initialized in [the router ](https://github.com/statesman/elex/blob/80be36263c67adb6af7e081d376d1797be19e582/src/js/modules/router.js#L49-L53).

There are few customizations in the code for the 2014 general (there is some custom work on the overview widget to accommodate the city council race) so the widget should be reusable with minimal additional effort.

## Setup

1. Clone the repo.
2. Copy the Google Spreadsheet and fill in local candidates, putting one candidate in each row and includes the below fields:
  - *Short name* is optional and is used in the overview view
  - *Party* is optional
  - *Profile* is an optional link to a URL that will be used in the detail view as a hyperlink from the candidate's name
  - *Votes* needs to have a value at all times, even if that value is zero
3. Each race also has several display options and some metadata that is set on a per-race basis:
  - *Status* is displayed below each race. It's an open text field but is intended to be used to say something like "20% of precincts reporting"
  - *Template* tells Backbone [which of the templates](src/templates) to use in the overview
  - *Show in overview* is how many candidates from the race should be shown in the overview. Candidates in the overview will always be sorted by vote total from highest to lowest
  - *Source* is optional and will show in the detail view. It's automatically preprended with "Source:"
  - *Partisan* turns toggles the blue/red color coding of the bars in the overview and the display of party affiliation next to each candidate
  - *Called*, when set to yes, displays a green check mark next to the winning candidate
  - *Group* can be used to simplify the detail view. Any race with the same string in the *Group* field will be shown on the same tabbed detail view with the name of the race and the *Subtitle* as the tab link/title.
4. After setting up the spreadsheet, copy `data/config.cfg.sample` to `data/config.cfg`. Fill in:
  - your Google account credentials
  - the key for the spreadsheet to pull results from.
  - a user name and password for the AP elections service
  - the state to pull from when querying AP
5. Install [dependencies](data/requirements.txt) for the scraper using `pip`

## Usage

#### Updating results

Anything (names, party affiliation, vote totals, overview count, etc.) can be changed at anytime.

To make the changes visible in the widget, simply run `data/data.py`, which will re-scrape the Google spreadsheet and write a new `data.json` file. Next time the user polls for updates `Backbone.sync` will merge in the changes.

#### Embedding

The widget can be embedded by including [pym.js](http://blog.apps.npr.org/pym.js/) (which is located in [`bower_components/`](bower_components/pym.js/src)) and a `<div>` that will be filled with the `<iframe>`. For additional information about embedding see the [pym.js documentation](http://blog.apps.npr.org/pym.js/). See the example below:

```html
<div id="elex-widget"></div>
<script src="path/to/pym.js"></script>
<script>
  var pymParent = new pym.Parent(
    'elex-widget',
    '/path/to/widget.html'
  );
</script>
```

## Developing

JavaScript and CSS for distribution are built using Grunt and front-end packages are managed with Bower so you'll need both to do any serious development on the project.

Once you have both installed, be sure to run `npm install` in the project root to install the required Grunt modules.


The default `grunt` task will open a lightweight development server (with LiveReload) and transpile CSS, lint, JavaScript, etc. as changes are made. `grunt build` will build production-ready JavaScript and CSS but stop short of launching the development server.

## Copyright

Code and content are &copy; Statesman Media.
