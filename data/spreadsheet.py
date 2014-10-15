from gspread import Client
import simplejson as json
import ConfigParser

# Get config info
cfg = ConfigParser.ConfigParser()
cfg.readfp(open('config.cfg'))
username = cfg.get('google', 'username')
password = cfg.get('google', 'password')
sheet_key = cfg.get('google', 'spreadsheet')

# Login to Google
c = Client(auth=(username, password))
c.login()

# Get our election results spreadsheet
s = c.open_by_key(sheet_key)

# Get the gov results
sheet = s.get_worksheet(0)
opts = sheet.get_all_records()

# Get reporting
status = sheet.acell('f2').value

# Walk through each option and build a results dictionary, which
# will be added to a list of results
result = {'race': sheet.title, 'reporting': status}
opt_results = []
for opt in opts:
  opt_result = {}
  opt_result['name'] = opt['Name']
  opt_result['shortName'] = opt['Short name']
  opt_result['count'] = opt['Votes']
  opt_result['party'] = opt['Party']
  opt_results.append(opt_result)

result['options'] = opt_results

# Write it all out to JSON
json_result = json.dumps(result)
json_out = open('data.json', 'w')
json_out.write(json_result)
json_out.close()

print json_result
