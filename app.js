const https = require('https');
const moment = require('moment');
const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const router = express.Router();
const app = express();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "35.189.56.73",
  user: "root",
  password: "root",
  database: "courrio"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var insert_sql = "INSERT INTO orders (order_ids) VALUES (0)";
  con.query(insert_sql, function (err, result) {
    if (err) throw err;
    console.log("1 order inserted");
  });

  var query_sql = "SELECT last_insert_id();";
  con.query(query_sql, function (err, result) {
    if (err) throw err;
    console.log("result" + result["insertId"]);
  });
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const axios = require('axios');
const req = require("express/lib/request");

router.post('/webhook',(request,response) => {
  console.log(request.body["job_state"]);
  response.status(200);
  response.send("ok");
});

// courrio set webhook url API
router.post('/set_webhookurl',(request,response) => {

    console.log("set webhook url: " +  request.body["order_ids"]);
  
    // fetch customer id from api key
    // set webhook url in db

});

router.get('/rate',(request,response) => {

  console.log("set webhook url: " +  request.body["order_ids"]);

  // fetch customer id from api key
  // set webhook url in db

});

// courrio edit order API
router.post('/edit_order',(request,response) => {

    var startDate = moment(); 
  
    console.log("editing order: " +  request.body["order_ids"]);
  
    // fetch job id from order id from courrio DB
    // fetch whether its a pickup or delivery and change time accordingly
    axios
      .post('https://api.tookanapp.com/v2/edit_task', {
        api_key: request.body["tookan_api_key"],
        "fleet_id": "19750",
        "timezone": "-660",
        "has_pickup": "1",
        "has_delivery": "1",
        "layout_type": "0",
        "job_pickup_datetime":request.body["datetime"],

        "job_pickup_address":request.body["address"],
        "customer_address": request.body["job_pickup_address"],
        "job_id":request.body["order_ids"]

      })
      .then(res => {
        var endDate = moment(); 
        var secondsDiff = endDate.diff(startDate,"seconds")
        console.log(secondsDiff + " seconds")
  
        console.log(`statusCode: ${res.status}`)
    
        if(res.data["status"] == "101")
        {
          response.status(res.status);
          response.send(res.data["message"]);
        }
        else if(res.data["status"] == "201")
        {
          response.status(res.status);
          response.send(res.data["message"]);
        }
        else
        {
          response.status(res.status);
          response.send(res.data["message"]);
        }
    
      })
      .catch(error => {
        console.error(error)
        response.statusCode = 401;
        response.send(error);
      })
    
});

//courrio delete order API
router.post('/delete_order',(request,response) => {

  var startDate = moment(); 

  console.log("delete order: " +  request.body["order_ids"]);

  // fetch job id from order id from courrio DB

  axios
    .post('https://api.tookanapp.com/v2/delete_task', {
      api_key: request.body["tookan_api_key"],
      "job_id": request.body["order_ids"]
    })
    .then(res => {
      var endDate = moment(); 
      var secondsDiff = endDate.diff(startDate,"seconds")
      console.log(secondsDiff + " seconds")

      console.log(`statusCode: ${res.status}`)
  
      if(res.data["status"] == "101")
      {
        response.status(res.status);
        response.send(res.data["message"]);
      }
      else if(res.data["status"] == "201")
      {
        response.status(res.status);
        response.send(res.data["message"]);
      }
      else
      {
        response.status(res.status);
        response.send(res.data["message"]);
      }
  
    })
    .catch(error => {
      console.error(error)
      response.statusCode = 401;
      response.send(error);
    })
  
});

//courrio get order API
router.post('/order_status',(request,response) => {

  var startDate = moment(); 

  // fetch rate card from db

  console.log("requesting for order: " +  request.body["order_ids"]);

  axios
    .post('https://api.tookanapp.com/v2/get_job_details_by_order_id', {
      api_key: request.body["tookan_api_key"],
      "order_ids": [ request.body["order_ids"]
      ],
      "include_task_history": 0
    })
    .then(res => {
      var endDate = moment(); 
      var secondsDiff = endDate.diff(startDate,"seconds")
      console.log(secondsDiff + " seconds")

      console.log(`statusCode: ${res.status}`)
  
      if(res.data["status"] == "101")
      {
        response.status(res.status);
        response.send(res.data["message"]);
      }
      else if(res.data["status"] == "201")
      {
        response.status(res.status);
        response.send(res.data["message"]);
      }
      else
      {
        response.status(res.status);
        response.send(res.data["data"]);
      }
  
    })
    .catch(error => {
      console.error(error)
      response.statusCode = 401;
      response.send(error);
    })
  
});

// courrio bulk order API
router.post('/new_order',(request,response) => {

  var startDate = moment(); 
  // add order date to sql
  // get customer number from api
  // add signature required to db
  // add total packages 2
  console.log("Received new order: " + startDate.format());

  // format pickup orders from customers
  var pickup_orders = []
  for (let i = 0; i < request.body["pickup_address"].length; i++) {
    pickup_orders.push(
      {
        "address": request.body["pickup_address"][i]["street"] +" "+ request.body["pickup_address"][i]["suburb"] +" "+ request.body["pickup_address"][i]["state"] +" "+ request.body["pickup_address"][i]["post_code"] +" "+ 
        request.body["pickup_address"][i]["country"],
        "time": "2022-01-08 17:24:00",
        "phone": request.body["pickup_address"][i]["phone"],
        "name": request.body["pickup_address"][i]["name"],
        "email":  request.body["pickup_address"][i]["pickup_email"],
        "order_id": request.body["pickup_address"][i]["order_number"]
      }
    )
  }

  // format delivery orders from customers
  var delivery_orders = []
  for (let i = 0; i < request.body["delivery_address"].length; i++) {
    delivery_orders.push(
      {
        "address": request.body["delivery_address"][i]["street"] +" "+ request.body["delivery_address"][i]["suburb"] +" "+ request.body["delivery_address"][i]["state"] +" "+ request.body["delivery_address"][i]["post_code"] +" "+ 
        request.body["delivery_address"][i]["country"],
        "time": "2022-01-08 17:24:00",
        "phone": request.body["delivery_address"][i]["phone"],
        "name": request.body["delivery_address"][i]["name"],
        "email":  request.body["delivery_address"][i]["pickup_email"],
        "order_id": request.body["delivery_address"][i]["order_number"]
      }
    )
  }

// call create_multiple_tasks tookan api 
axios
  .post('https://api.tookanapp.com/v2/create_multiple_tasks', {
    //api_key: process.env.API_KEY,
    api_key: request.body["tookan_api_key"],
    fleet_id: 19750,
    timezone: -660,
    has_pickup: 1,
    has_delivery: 1,
    layout_type: 0,
    geofence: 0,
    team_id: "",
    auto_assignment: 0,
    tags: "",
    pickups: pickup_orders,
    deliveries:delivery_orders
  })
  .then(res => {
    var endDate = moment(); 
    var secondsDiff = endDate.diff(startDate,"seconds")
    console.log(secondsDiff + " seconds")
    console.log(`statusCode: ${res.status}`)

    if(res.data["status"] == "101")
    {
      response.status(res.status);
      response.send(res.data["message"]);
    }
    else if(res.data["status"] == "201")
    {
      response.status(res.status);
      response.send(res.data["message"]);
    }
    else
    {
      response.status(res.status);
      response.send(res.data["message"]);
    }

  })
  .catch(error => {
    console.error(error)
    response.statusCode = 401;
    response.send(error);
  })

});

app.use("/", router);
  
http.createServer(app).listen(80);
//https.createServer(options, app).listen(443);