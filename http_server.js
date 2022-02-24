var https = require('https');

var fs = require('fs');

var https_options = {

  key: fs.readFileSync("/ssl/STAR_courrio_com_key.txt"),

  cert: fs.readFileSync("/ssl/star.courrio.com.crt"),

};