const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const router = express.Router();
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const axios = require('axios')

router.post('/webhook',(request,response) => {

  console.log(response.data);
  response.status(200);
  response.send("ok");
});

router.post('/order',(request,response) => {
//code to perform particular action.
//To access POST variable use req.body()methods.

axios
  .post('https://api.tookanapp.com/v2/create_task', {
    api_key: "",
    job_description: "groceries delivery",
    job_pickup_phone: "+1201555555",
    job_pickup_name: "7 Eleven Store",
    job_pickup_email: "",
    job_pickup_address: "Pasir Ris 510561",
    job_pickup_datetime: "2021-12-31 22:00:00",
    pickup_custom_field_template: "Template_1",
    pickup_meta_data: [
      {
        label: "Price",
        data: "100"
      },
      {
        label: "Quantity",
        data: "100"
      }
    ],
    team_id: "",
    auto_assignment: "0",
    has_pickup: "1",
    has_delivery: "0",
    layout_type: "0",
    tracking_link: 1,
    timezone: "800",
    fleet_id: "",
    p_ref_images: [
      "http://tookanapp.com/wp-content/uploads/2015/11/logo_dark.png"
    ],
    notify: 1,
    tags: "",
    geofence: 0
  })
  .then(res => {
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

app.listen(3000,() => {
  console.log("Started on PORT 3000");
  })
  