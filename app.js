const https = require('https');
const moment = require('moment')
const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const axios = require('axios');
const req = require("express/lib/request");

router.post('/webhook',(request,response) => {

  console.log(request.body["job_state"]);
  response.status(200);
  response.send("ok");
});

//single order api
// router.post('/order',(request,response) => {
//   //code to perform particular action.
//   //To access POST variable use req.body()methods.
  
//   console.log(request.body);
//   console.log(request.body["order_number"]);
//   axios
//     .post('https://api.tookanapp.com/v2/create_multiple_tasks', {
//       api_key: process.env.API_KEY,
//       job_description: "groceries delivery",
//       job_pickup_phone: "+1201555555",
//       job_pickup_name: "7 Eleven Store",
//       job_pickup_email: "",
//       job_pickup_address: "Pasir Ris 510561",
//       job_pickup_datetime: "2022-01-06 08:00:00",
//       pickup_custom_field_template: "Template_1",
//       pickup_meta_data: [
//         {
//           label: "Price",
//           data: "100"
//         },
//         {
//           label: "Quantity",
//           data: "100"
//         }
//       ],
//       team_id: "",
//       auto_assignment: "0",
//       has_pickup: "1",
//       has_delivery: "0",
//       layout_type: "0",
//       tracking_link: 1,
//       timezone: "800",
//       fleet_id: "",
//       p_ref_images: [
//         "http://tookanapp.com/wp-content/uploads/2015/11/logo_dark.png"
//       ],
//       notify: 1,
//       tags: "",
//       geofence: 0
//     })
//     .then(res => {
//       console.log(`statusCode: ${res.status}`)
  
//       if(res.data["status"] == "101")
//       {
//         response.status(res.status);
//         response.send(res.data["message"]);
//       }
//       else if(res.data["status"] == "201")
//       {
//         response.status(res.status);
//         response.send(res.data["message"]);
//       }
//       else
//       {
//         response.status(res.status);
//         response.send(res.data["message"]);
//       }
  
//     })
//     .catch(error => {
//       console.error(error)
//       response.statusCode = 401;
//       response.send(error);
//     })
  
  
  
  
  
//   });


//courrio edit order API
router.post('/edit_order',(request,response) => {

  var startDate = moment(); 
  
    console.log("editing order: " +  request.body["order_ids"]);
  
    // fetch job id from order id from courrio DB
  
    axios
      .post('https://api.tookanapp.com/v2/edit_task', {
        api_key: request.body["tookan_api_key"],
        "fleet_id": "19750",
        "timezone": "-660",
        "has_pickup": "1",
        "has_delivery": "1",
        "layout_type": "0",
        "time":"2022-01-08 23:24:00",

        "job_pickup_address":"he11llo",
        "customer_address": "hey1",
        "job_id":"353609637"

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
      "job_id": "2755"
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


// add router in the Express app.
app.use("/", router);

// app.listen(3000,() => {
//   console.log("Started on PORT 3000");
//   })
  
http.createServer(app).listen(80);
//https.createServer(options, app).listen(443);