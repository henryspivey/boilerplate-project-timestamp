// index.js
// where your node app starts

// init project
var express = require('express');
const bodyParser = require('body-parser')
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date_string?", function(req, res, next) {
  // get the date
  const {date_string} = req.params
  console.log(date_string)
  let unix,utc;
  let message;
  let invalidDateFound = false;
  const rawDate = new Date(date_string)
  if(rawDate.toString() === 'Invalid Date') {
    message = {
      'error': 'Invalid Date'
    }
    if(!parseInt(date_string) >0) invalidDateFound = true
  }
  if(!date_string) {
    const now = new Date()
    unix = now.getTime()
    utc = now.toUTCString()
    message={'unix':unix, 'utc': utc}
  } else if(!invalidDateFound) {
    // now that we have the date_string, we just need check if it's unix
    if(date_string.search('\-') > 0) {
      // found some dash so we need to convert to utc
      utc = rawDate.toUTCString()
      unix = rawDate.getTime()
      message = {'unix':unix, 'utc': utc}
    } else {
      const parsedDate = parseInt(date_string)      
      utc = new Date(parsedDate).toUTCString()
      unix = parsedDate
      const rawDate = new Date(unix)
      message = {'unix':unix, 'utc': utc}
    } 
  }
  res.json(message)
  next()
})



// listen for requests :)
var listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
