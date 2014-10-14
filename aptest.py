from elections import AP

client = AP("txauseln", "txauseln")

tx = client.get.state('TX')
