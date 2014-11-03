from __future__ import division
from gspread import Client
import simplejson as json
from ConfigParser import ConfigParser
from elections import AP


# Get config from file
cfg = ConfigParser()
cfg.readfp(open('config.cfg'))


def parse(sheet, state):
  """
  A function to parse a spreadsheet into a race list that can be
  formatted into JSON and fed to the home page widget.
  """

  print "Processing results for " + sheet.title

  # Set up our race result dict
  result = {'race': sheet.title}

  # Add the short/long names if they exist
  longName = sheet.acell('i5').value
  if longName != "":
    result['raceLong'] = longName
  else:
    result['raceLong'] = sheet.title

  # Get reporting
  result['status'] = sheet.acell('g2').value

  # Set a template value, if one exists
  tpl = sheet.acell('h2').value
  if tpl != "":
    result['type'] = tpl

  # Set a val that notes if the race should show in overviews
  overview = sheet.acell('i2').value
  if overview != "":
    overview_count = int(overview)
    result['overview'] = True
  else:
    overview_count = 0

  # Calculate total votes cast
  votes_cast = sheet.col_values(5)
  total_cast = 0
  for cast in votes_cast[1:]:
    total_cast = total_cast + int(cast)
  result['totalcast'] = total_cast

  # Get the data source
  source = sheet.acell('j2').value
  if source != "":
    result['dataSource'] = source

  # Add an ID for the race, which is also its sheet ID
  result['sheet'] = sheet.id

  # Include whether the race is partisan
  result['partisanRace'] = sheet.acell('k2').value == "Yes"

  # Include the group name if there is one
  group = sheet.acell('h5').value
  if group != "":
    result['group'] = group.lower()

  # Include the subtitle if it exists
  subtitle = sheet.acell('j5').value
  if subtitle != "":
    result['subtitle'] = subtitle

  # Get all spreadsheet data
  opts = sheet.get_all_records()

  # Walk through each option and build a results dictionary, which
  # will be added to a list of results
  opt_results = []

  use_ap = sheet.acell('g8').value
  # Use AP for results
  if use_ap == "Yes":
    race_number = sheet.acell('h8').value
    sorted_opts = get_ap_results(state, race_number)
    for opt in sorted_opts:
      report_results(opt['name'], opt['count'], opt['percent'])
  # Use the spreadsheet for results
  else:
    for opt in opts:
      if opt['Name'] != "":
        opt_result = {}
        opt_result['name'] = opt['Name']
        if opt['Short name'] == "":
          opt_result['shortName'] = opt['Name']
        else:
          opt_result['shortName'] = opt['Short name']
        votes = int(opt['Votes'])
        opt_result['count'] = votes
        if total_cast == 0:
          opt_result['percent'] = 0
        else:
          opt_result['percent'] = round(votes / total_cast * 100, 2)
        if opt['Profile'] != "":
          opt_result['profile'] = opt['Profile']
        if opt['Party'] == "":
          opt_result['party'] = None
        else:
          opt_result['party'] = opt['Party']
        opt_results.append(opt_result)

        report_results(opt_result['name'], opt_result['count'], opt_result['percent'])

    # Sort the ballot options by vote count
    sorted_opts = sorted(opt_results, key=lambda k: k['count'], reverse=True)

  print ''

  # Flag each result that should show in the overview
  for opt_result in sorted_opts[:overview_count]:
    opt_result['showInOverview'] = True

  # Add a boolean to the first value if the race has been called
  if sheet.acell('g5').value == "Yes":
    sorted_opts[0]['winner'] = True

  result['options'] = sorted_opts

  return result


def report_results(opt, count, percent):
  """
  Write the results for a single candidate to the console
  """
  print '- ' + opt + ': ' + str(count) + ' (' + str(percent) + '%)'


def get_ap_results(state, race_number):
  """
  Fetch Associated Press results from the AP's election service by race number
  """
  race = state.filter_races(ap_race_number=race_number)[0]
  results = []
  for result in race.state.results:
    results.append({
      'name': result.candidate.name,
      'count': result.vote_total,
      'percent': result.vote_total_percent,
      'party': result.candidate.party,
      'shortName': result.candidate.abbrev_name
    })

  return results


# Get config info
username = cfg.get('google', 'username')
password = cfg.get('google', 'password')
sheet_key = cfg.get('google', 'spreadsheet')

# Login to Google
c = Client(auth=(username, password))
c.login()

# Connect to AP and get the state file
ap_username = cfg.get('ap', 'username')
ap_password = cfg.get('ap', 'password')
ap_state_code = cfg.get('ap', 'state')
client = AP(ap_username, ap_password)
state = client.get_state(ap_state_code)

# Get our election results spreadsheet
s = c.open_by_key(sheet_key)

# Loop through all worksheets in the spreadsheet, parse them
# and add them to a results list
results = []
for sheet in s.worksheets():
  results.append(parse(sheet, state))

# Write it all out to JSON
json_result = json.dumps(results)
json_out = open('data.json', 'w')
json_out.write(json_result)
json_out.close()

print 'Writing JSON results'
print json_result
