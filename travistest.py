from xml.etree import ElementTree

doc = ElementTree.parse( 'travis.xml' )

election = doc.find( 'County/Election' )

# Store some totals here
total = 0

# Loop over
for contest in election.findall( 'ElectionTally/PrecinctTally/SplitTally/ContestTally' ):
  if contest.attrib[ 'contestName' ] == "UNITED STATES SENATOR - DEM":
    for cast in contest.findall( 'CastVoteTally' ):
      if cast.attrib[ 'choice' ] == "1":
        total += int(cast.attrib[ 'count' ])

print total
