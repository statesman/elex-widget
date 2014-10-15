from __future__ import division
from gspread import Client
import simplejson as json
from ConfigParser import ConfigParser

def parse(sheet):
  """
  A function to parse a spreadsheet into a race list that can be
  formatted into JSON and fed to the home page widget.
  """

  # Set up our race result dict
  result = {'race': sheet.title}

  # Get reporting
  result['status'] = sheet.acell('f2').value

  # Set a template value, if one exists
  tpl = sheet.acell('g2').value
  if tpl != "":
    result['type'] = tpl

  # Set a val that notes if the race should show in overviews
  overview = sheet.acell('h2').value
  if overview != "":
    result['overview'] = True

  # Calculate total votes cast
  votes_cast = sheet.col_values(4)
  total_cast = 0
  for cast in votes_cast[1:]:
    total_cast = total_cast + int(cast)
  result['totalcast'] = total_cast

  # Add an ID for the race, which is also its sheet ID
  result['sheet'] = sheet.id

  # Get all spreadsheet data
  opts = sheet.get_all_records()

  # Walk through each option and build a results dictionary, which
  # will be added to a list of results
  opt_results = []
  for opt in opts:
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

  result['options'] = opt_results

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

print json_result
