from __future__ import division
from gspread import Client
import simplejson as json
from ConfigParser import ConfigParser

def parse(sheet):
  """
  A function to parse a spreadsheet into a race list that can be
  formatted into JSON and fed to the home page widget.
  """

  print "Processing results for " + sheet.title

  # Set up our race result dict
  result = {'race': sheet.title}

  # Add the short/long names if they exist
  longName = sheet.acell('h5').value
  if longName != "":
    result['raceLong'] = longName
  else:
    result['raceLong'] = sheet.title

  # Get reporting
  result['status'] = sheet.acell('f2').value

  # Set a template value, if one exists
  tpl = sheet.acell('g2').value
  if tpl != "":
    result['type'] = tpl

  # Set a val that notes if the race should show in overviews
  overview = sheet.acell('h2').value
  if overview != "":
    overview_count = int(overview)
    result['overview'] = True
  else:
    overview_count = 0

  # Calculate total votes cast
  votes_cast = sheet.col_values(4)
  total_cast = 0
  for cast in votes_cast[1:]:
    total_cast = total_cast + int(cast)
  result['totalcast'] = total_cast

  # Get the data source
  source = sheet.acell('i2').value
  if source != "":
    result['dataSource'] = source

  # Add an ID for the race, which is also its sheet ID
  result['sheet'] = sheet.id

  # Include whether the race is partisan
  result['partisanRace'] = sheet.acell('j2').value == "Yes"

  # Include the group name if there is one
  group = sheet.acell('g5').value
  if group != "":
    result['group'] = group.lower()

  # Include the subtitle if it exists
  subtitle = sheet.acell('i5').value
  if subtitle != "":
    result['subtitle'] = subtitle

  # Get all spreadsheet data
  opts = sheet.get_all_records()

  # Walk through each option and build a results dictionary, which
  # will be added to a list of results
  opt_results = []
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
      opt_result['percent'] = round(votes / total_cast * 100, 2)
      if opt['Party'] == "":
        opt_result['party'] = None
      else:
        opt_result['party'] = opt['Party']
      opt_results.append(opt_result)

      print '- ' + opt_result['name'] + ': ' + str(opt_result['count']) + ' (' + str(opt_result['percent']) + '%)'

  print ''

  # Sort the ballot options by vote count
  sorted_opts = sorted(opt_results, key=lambda k: k['count'], reverse=True)

  # Flag each result that should show in the overview
  for opt_result in sorted_opts[:overview_count]:
    opt_result['showInOverview'] = True

  # Add a boolean to the first value if the race has been called
  if sheet.acell('f5').value == "Yes":
    sorted_opts[0]['winner'] = True

  result['options'] = sorted_opts

  return result

# Get config info
cfg = ConfigParser()
cfg.readfp(open('config.cfg'))
username = cfg.get('google', 'username')
password = cfg.get('google', 'password')
sheet_key = cfg.get('google', 'spreadsheet')

# Login to Google
c = Client(auth=(username, password))
c.login()

# Get our election results spreadsheet
s = c.open_by_key(sheet_key)

# Loop through all worksheets in the spreadsheet, parse them
# and add them to a results list
results = []
for sheet in s.worksheets():
  results.append(parse(sheet))

# Write it all out to JSON
json_result = json.dumps(results)
json_out = open('data.json', 'w')
json_out.write(json_result)
json_out.close()

print 'Writing JSON results'
print json_result
