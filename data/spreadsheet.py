from __future__ import division
from gspread import Client
import simplejson as json
from ConfigParser import ConfigParser

def parse(sheet):
  """
  A function to parse a spreadsheet into a race list that can be
  formatted into JSON and fed to the home page widget.
  """

  # Get all spreadsheet data
  opts = sheet.get_all_records()

  # Get reporting
  status = sheet.acell('f2').value

  # Calculate total votes cast
  votes_cast = sheet.col_values(4)
  total_cast = 0
  for cast in votes_cast[1:]:
    total_cast = total_cast + int(cast)

  # Walk through each option and build a results dictionary, which
  # will be added to a list of results
  result = {'race': sheet.title, 'reporting': status, 'cast': total_cast}
  opt_results = []
  for opt in opts:
    opt_result = {}
    votes = int(opt['Votes'])
    opt_result['name'] = opt['Name']
    opt_result['shortName'] = opt['Short name']
    opt_result['count'] = votes
    opt_result['percent'] = round(votes / total_cast * 100, 2)
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
