const https = require('https');
//const moment = require('moment');
const http = require('http');
const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");
const Promise = require('promise');
const distance = require('google-distance-matrix');
const customer = require('./customer.js');
const pub = require('./pubsub.js');
var srs = require('secure-random-string');
const router = express.Router();
const app = express();
require('dotenv').config()
const axios = require('axios');
const req = require("express/lib/request");
const {
	Console
} = require('console');
var moment = require('moment-timezone');

var fs = require('fs');



var mysql = require('mysql');

// for(var i = 0 ; i < 10; i++)
// {
//     customer.createCustomer("test"+i.toString(),i);
// }

// var result = srs({length: 56,alphanumeric: true});
// console.log(result);
// customer.getCustomer("999");

//  async function test()
// {
// 	var a = await customer.getCustomerName("haSeIpOUgKAp63HZAQ2GZgu5tlGZDF3nNW9S4MhQrwlKZEI9TyvizBcD");
// 	console.log("++" + a);
// }
// test();

// setup connection to Cloud SQL
var con = mysql.createConnection({
	host: "35.189.56.73",
	user: "root",
	password: "root",
	database: "courrio"
});

// connect to Cloud SQL
con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});


app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());


// Listen to notification sent from Tookan and distribute to client's webhook
router.post('/webhook', (request, response) => {
	//console.log("receive webhook" +JSON.stringify(request.body) );
	//console.log(request.body);
	//pub.publish(request.body);
	axios
	.post('http://34.116.81.190/push_webhook', request.body)
	.then(res => {
		response.statusCode = 200;
		response.send("ok");
	})
	.catch(error => {
		console.error(error)
		response.statusCode = 401;
		response.send(error);
	})
});

// courrio set webhook url API
router.post('/set_webhookurl', async (request, response) => {
	var promise = customer.checkAPIKey(request.body["api_key"]);

	await Promise.all([promise])
		.then(async results => {

			console.log("set webhook url: " + request.body["order_ids"]);

			// fetch customer id from api key
			// set webhook url in db

		})
		.catch(function(err) {
			console.log(err);
			response.statusCode = 200;
			response.send(err.toString());
			return;
		});


});

// get price
router.post('/price', async (request, response) => {
	axios
		.post('http://34.87.232.250/price', {
			"api_key": request.body["api_key"],
			"delivery_code": request.body["delivery_code"],
			"pickup_address": request.body["pickup_address"],
			"delivery_address": request.body["delivery_address"],
			"weight": request.body["weight"],
			"customer_number": request.body["customer_number"],
			"volume": request.body["volume"],
			"rate_code": request.body["rate_code"]
		})
		.then(res => {


			response.status(res.status);
			response.send(res.data);


		})
		.catch(error => {
			console.error(error)
			response.statusCode = 401;
			response.send(error);
		})

});

// get price
router.post('/push_webhook', async (request, response) => {
	axios
		.post('http://34.116.81.190/webhook')
		.then(res => {

		})
		.catch(error => {
			console.error(error)
			response.statusCode = 401;
			response.send(error);
		})

});



// courrio rate API
router.get('/rate', (request, response) => {

	console.log("set webhook url: " + request.body["order_ids"]);

	// fetch customer id from api key
	// set webhook url in db

});

// courrio edit order API
router.post('/edit_order', async (request, response) => {
	var promise = customer.checkAPIKey(request.body["api_key"]);

	await Promise.all([promise])
		.then(async results => {

			// measure latency from the moment courrio receive api request until receive respond from tookan
			var startDate = moment();

			console.log("Editing order: " + request.body["job_id"]);

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
					"job_pickup_datetime": request.body["datetime"],

					"job_pickup_address": request.body["address"],
					"customer_address": request.body["address"],
					"job_id": request.body["job_id"]

				})
				.then(res => {
					var endDate = moment();
					var secondsDiff = endDate.diff(startDate, "seconds")
					console.log(secondsDiff + " seconds")

					if (res.data["status"] == "101") {
						response.status(res.status);
						response.send(res.data["message"]);
					} else if (res.data["status"] == "201") {
						response.status(res.status);
						response.send(res.data["message"]);
					} else {
						response.status(res.status);
						response.send(res.data["message"]);
					}

				})
				.catch(error => {
					console.error(error)
					response.statusCode = 401;
					response.send(error);
				})


		})
		.catch(function(err) {
			console.log(err);
			response.statusCode = 200;
			response.send(err.toString());
			return;
		});

});

//courrio delete order API
router.post('/delete_order', async (request, response) => {
	var promise = customer.checkAPIKey(request.body["api_key"]);

	await Promise.all([promise])
		.then(async results => {

			// measure latency from the moment courrio receive api request until receive respond from tookan
			var startDate = moment();

			console.log("Delete order: " + request.body["order_ids"]);

			// fetch job id from order id from courrio DB

			axios
				.post('https://api.tookanapp.com/v2/delete_task', {
					api_key: request.body["tookan_api_key"],
					"job_id": request.body["job_id"]
				})
				.then(res => {
					var endDate = moment();
					var secondsDiff = endDate.diff(startDate, "seconds")
					console.log(secondsDiff + " seconds")

					if (res.data["status"] == "101") {
						response.status(res.status);
						response.send(res.data["message"]);
					} else if (res.data["status"] == "201") {
						response.status(res.status);
						response.send(res.data["message"]);
					} else {
						response.status(res.status);
						response.send(res.data["message"]);
					}

				})
				.catch(error => {
					console.error(error)
					response.statusCode = 401;
					response.send(error);
				})

		})
		.catch(function(err) {
			console.log(err);
			response.statusCode = 200;
			response.send(err.toString());
			return;
		});


});

//courrio get order API
router.post('/order_status', async (request, response) => {
	var promise = customer.checkAPIKey(request.body["api_key"]);

	await Promise.all([promise])
		.then(async results => {

			// measure latency from the moment courrio receive api request until receive respond from tookan
			var startDate = moment();

			// fetch rate card from db

			console.log("Requesting for order: " + request.body["order_ids"]);

			axios
				.post('https://api.tookanapp.com/v2/get_job_details_by_order_id', {
					api_key: request.body["tookan_api_key"],
					"order_ids": [request.body["order_ids"]],
					"include_task_history": 0
				})
				.then(res => {
					var endDate = moment();
					var secondsDiff = endDate.diff(startDate, "seconds")
					console.log(secondsDiff + " seconds")

					if (res.data["status"] == "101") {
						response.status(res.status);
						response.send(res.data["message"]);
					} else if (res.data["status"] == "201") {
						response.status(res.status);
						response.send(res.data["message"]);
					} else {
						response.status(res.status);
						response.send(res.data["data"]);
					}

				})
				.catch(error => {
					console.error(error)
					response.statusCode = 401;
					response.send(error);
				})

		})
		.catch(function(err) {

			console.log(err);
			response.statusCode = 200;
			response.send(err.toString());
			return;
		});



});


function checkIfAfterCutOffIsWeekend(deliveryDate,satDel,sunDel)
{
	var tempDate = deliveryDate.clone();

	var dayOfWeekBeforeDeliveryDays = tempDate.format('dddd');
	console.log("order date: " + dayOfWeekBeforeDeliveryDays);
	if((dayOfWeekBeforeDeliveryDays === 'Saturday' && satDel=="Y" )|| (dayOfWeekBeforeDeliveryDays === 'Sunday' && sunDel=="Y"))
	{
		console.log("added additional days for after hours");
		return true;
	}
	else if((dayOfWeekBeforeDeliveryDays !== 'Saturday')|| (dayOfWeekBeforeDeliveryDays !== 'Sunday'))
	{
		console.log("added additional days for after hours");
		return true;
	}
	else
	{
		console.log("no additional days for after hours");
		return false;
	}
	
}

function checkIfNextDayIsWeekend(deliveryDate,deliveryDays,satDel,sunDel)
{
	var daysToAdd=0;
	var tempDate = deliveryDate.clone();
	for (let i = 0; i < deliveryDays; i++) 
	{
		var dayOfWeekBeforeDeliveryDays = tempDate.format('dddd');
		console.log(dayOfWeekBeforeDeliveryDays);
		if((dayOfWeekBeforeDeliveryDays === 'Saturday' && satDel=="N" )|| (dayOfWeekBeforeDeliveryDays === 'Sunday' && sunDel=="N"))
		{
			daysToAdd+=1;
			deliveryDays+=1;
		}

		tempDate = tempDate.add(1, "days");
	}
	
	console.log("Additional days for weekend " + daysToAdd);
	return daysToAdd;

}


function computeDeliveryDate(rate, fixedDeadline, orderCutOff, deliveryDeadline,daysToDelivery, orderDate,satDel,sunDel) {
	// same day delivery and delivery dateline set to 1700
	console.log(rate + " , " + fixedDeadline + " , " + orderDate.format('MMMM DD YYYY, h:mm:ss a') + ", " + orderCutOff)


	var cutoff;
	var timeSplit = orderCutOff.split(":")

	//check if order is before cutoff
	console.log("Original days to delivery " + daysToDelivery);
	var cutoff = moment();
	cutoff.set('year', orderDate.format('YYYY'));
	cutoff.set('month', parseInt(orderDate.format('MM'))-1);  // April
	cutoff.set('date', orderDate.format('DD'));
	cutoff.set('hour', timeSplit[0]);
	cutoff.set('minute', timeSplit[1]);

	console.log("orderDate time"+ orderDate.format("YYYY-MM-DD HH:mm:ss"));
	console.log("cutoff time"+ cutoff.format("YYYY-MM-DD HH:mm:ss"));

	var deliveryDate = moment();
	deliveryDate.set('year', orderDate.format('YYYY'));
	deliveryDate.set('month',  parseInt(orderDate.format('MM'))-1);  // April
	deliveryDate.set('date', orderDate.format('DD'));
	deliveryDate.set('hour', 17);
	deliveryDate.set('minute', 0);
	deliveryDate.set('second', 0);

	console.log("Original deliveryDate " + deliveryDate.format("YYYY-MM-DD HH:mm:ss"))
	var isBefore = moment(orderDate.format("YYYY-MM-DD HH:mm:ss")).isBefore(cutoff);

	if (isBefore) {
		deliveryDate = deliveryDate.add(1, "days");
		daysToDelivery+= checkIfNextDayIsWeekend(deliveryDate,daysToDelivery,satDel,sunDel)-1;
		deliveryDate = deliveryDate.add(daysToDelivery, "days");
		console.log(deliveryDate.format("YYYY-MM-DD HH:mm:ss"));
		console.log("Order placed before cut off time : Order is placed as next day")
		return deliveryDate;
	} else {

		// add 1 day because its next day
		if(checkIfAfterCutOffIsWeekend(deliveryDate,satDel,sunDel))
			deliveryDate = deliveryDate.add(2, "days");
		else
			deliveryDate = deliveryDate.add(1, "days");

		daysToDelivery+= checkIfNextDayIsWeekend(deliveryDate,daysToDelivery,satDel,sunDel)-1;
		deliveryDate = deliveryDate.add(daysToDelivery, "days");
		console.log(deliveryDate.format("YYYY-MM-DD HH:mm:ss"));
		console.log("Order placed after cut off time : Order is placed as next day")

		return deliveryDate;
		//throw "Order is after cut off time";
	}

	//return moment(orderDate, "YYYY-MM-DD").tz("Australia/Sydney").add(1,"days").format("YYYY-MM-DD HH:mm:ss");
}

router.post('/test_schedule', async (request, response) => {
	// get ratecard
	var rateCode = request.body["rate_code"];
	var rateCard = await customer.getRateCard(rateCode);

	// compute delivery date based on ratecard
	var orderDate = moment(request.body["order_date"],"YYYY-MM-DD HH:mm:ss")

	var deliveryDate;
	try {
		deliveryDate = computeDeliveryDate(rateCard["Delivery Type"], rateCard["Fixed Delivery Deadline"], rateCard["Order Cutoff"], rateCard["Delivery Deadline Home"], parseInt(rateCard["Days from Order to Delivery"]),orderDate,rateCard["Saturday Deliveries"],rateCard["Sunday Deliveries"]);
		response.statusCode = 200;
		response.send({"delivery_date": deliveryDate});
	} catch (err) {
		response.statusCode = 401;
		response.send("error");
		throw err;

	}
});

// courrio bulk order API
router.post('/new_order', async (request, response) => {
	var promise = customer.checkAPIKey(request.body["api_key"]);

	await Promise.all([promise])
		.then(async results => {

			// get ratecard
			var rateCode = request.body["rate_code"];
			var rateCard = await customer.getRateCard(rateCode);
			var customer_name = await customer.getCustomerName(request.body["api_key"]);

			// measure latency from the moment courrio receive api request until receive respond from tookan
			var startDate = moment().tz("Australia/Sydney").set({
				"hour": 17,
				"minute": 0,
				"second": 0
			});
			// add order date to sql
			// get customer number from api
			// add signature required to db
			// add total packages 2
			console.log("Received new order");

			// compute delivery date based on ratecard
			var orderDate = moment().tz("Australia/Sydney");
	
			console.log("orderdate" + orderDate.format("YYYY-MM-DD HH:mm:ss"))
			// simulate date
			var simDate = moment();
			simDate.set('year', 2022);
			simDate.set('month', 1);  // April
			simDate.set('date', 24);
			simDate.set('hour', 23);
			simDate.set('minute', 30);
			simDate.set('second', 00);
			simDate.set('millisecond', 000);
	
			var deliveryDate;
			try {
				deliveryDate = computeDeliveryDate(rateCard["Delivery Type"], rateCard["Fixed Delivery Deadline"], rateCard["Order Cutoff"], rateCard["Delivery Deadline Home"], parseInt(rateCard["Days from Order to Delivery"]),orderDate,rateCard["Saturday Deliveries"],rateCard["Sunday Deliveries"]);
			} catch (err) {
				throw err;
			}


			console.log(deliveryDate);
			// format pickup orders from customers
			var promiseList = []
			var pickup_orders = []

			for (let i = 0; i < request.body["pickup_address"].length; i++) {

				var promise = new Promise(function(resolve, reject) {

					var insert_sql = "INSERT INTO orders (order_ids) VALUES (0)";

					con.query(insert_sql, function(err, result) {
						if (err) reject(err);
						console.log("Order addded: " + result.insertId);

						pickup_orders.push({
							"address": request.body["pickup_address"][i]["street"] + " " + request.body["pickup_address"][i]["suburb"] + " " + request.body["pickup_address"][i]["state"] + " " + request.body["pickup_address"][i]["post_code"] + " " +
								request.body["pickup_address"][i]["country"],
							"time": deliveryDate.format("YYYY-MM-DD HH:mm:ss"),
							"phone": request.body["pickup_address"][i]["phone"],
							"name": request.body["pickup_address"][i]["name"],
							"email": request.body["pickup_address"][i]["pickup_email"],
							"template_name": "Tyroola_Pickup",
							"template_data": [{
									"label": "Pickup_After",
									"data": request.body["pickup_address"][i]["pickup_after"]
								},
								{
									"label": "Pickup_Reference",
									"data": request.body["pickup_address"][i]["pickup_reference"]
								},
								{
									"label": "Business_Hours",
									"data": request.body["pickup_address"][i]["pickup_email"]
								},
								{
									"label": "Comment",
									"data": request.body["pickup_address"][i]["pickup_email"]
								},
								{
									"label": "Job_Description",
									"data": request.body["job_description"]
								}
							],
							"tracking_link": 1,
							"order_id": result.insertId
						})
						resolve();
					});

				}).catch(function(rej) {
					console.log(rej);
				});;
				promiseList.push(promise);
			}


			// format delivery orders from customers
			var delivery_orders = []
			for (let i = 0; i < request.body["delivery_address"].length; i++) {

				var promise = new Promise(function(resolve, reject) {

					var insert_sql = "INSERT INTO orders (order_ids) VALUES (0)";
					con.query(insert_sql, function(err, result) {

						if (err) reject(err);

						console.log("Order addded: " + result.insertId);

						delivery_orders.push({
							"address": request.body["delivery_address"][i]["street"] + " " + request.body["delivery_address"][i]["suburb"] + " " + request.body["delivery_address"][i]["state"] + " " + request.body["delivery_address"][i]["post_code"] + " " +
								request.body["delivery_address"][i]["country"],
							"time": deliveryDate.format("YYYY-MM-DD HH:mm:ss"),
							"phone": request.body["delivery_address"][i]["phone"],
							"name": request.body["delivery_address"][i]["name"],
							"email": request.body["delivery_address"][i]["pickup_email"],
							"template_name": "Tyroola_Delivery",
							"template_data": [{
									"label": "Authority_To_Leave",
									"data": request.body["delivery_address"][i]["authority_to_leave"]
								},
								{
									"label": "Delivery_Instructions",
									"data": request.body["delivery_address"][i]["delivery_instructions"]
								},
								{
									"label": "Volume",
									"data": request.body["delivery_address"][i]["delivery_instructions"]
								},
								{
									"label": "Route_Distance",
									"data": request.body["delivery_address"][i]["delivery_instructions"]
								},
								{
									"label": "Billable",
									"data": request.body["delivery_address"][i]["delivery_instructions"]
								},
								{
									"label": "Rate_Card",
									"data": request.body["delivery_address"][i]["delivery_instructions"]
								},
								{
									"label": "Courrio_Customer_Num",
									"data": request.body["delivery_address"][i]["delivery_instructions"]
								},
								{
									"label": "Courrio_Cust_Name",
									"data": request.body["delivery_address"][i]["delivery_instructions"]
								},
								{
									"label": "Job_Price_Ex_GST",
									"data": request.body["delivery_address"][i]["delivery_instructions"]
								},
								{
									"label": "Job_Description",
									"data": request.body["delivery_address"][i]["delivery_instructions"]
								}
							
							],
							"tracking_link": 1,
							"order_id": result.insertId
						})

						resolve();
					});

				}).catch(function(rej) {
					console.log(rej);
				});;


				promiseList.push(promise);
			}


			//create promise for price request
			//todo : price is only for 1 pickup and 1 destination
			var full_delivery_address = request.body["delivery_address"][0]["street"] + ", " + request.body["delivery_address"][0]["suburb"] + ", " + request.body["delivery_address"][0]["state"] + ", " + request.body["delivery_address"][0]["country"] + " " + request.body["delivery_address"][0]["post_code"] 
			var full_pickup_address = request.body["pickup_address"][0]["street"] + ", " + request.body["pickup_address"][0]["suburb"] + ", " + request.body["pickup_address"][0]["state"] + ", " + request.body["pickup_address"][0]["country"] + " " + request.body["pickup_address"][0]["post_code"]
			console.log(full_pickup_address)
			console.log(full_delivery_address)
			var totalDist;
			var totalPrice;
			var pricePromise = new Promise(async function(resolve, reject) {
				console.log("Getting price...")
				await axios
				.post('http://34.87.232.250/price', {
					//api_key: process.env.API_KEY,
					api_key: request.body["api_key"],
					delivery_code: request.body["delivery_code"],
					pickup_address: full_pickup_address,
					delivery_address: full_delivery_address,
					weight: request.body["weight"],
					volume: request.body["volume"],
					rate_code: request.body["rate_code"]
				})
				.then(res => {
	
					totalPrice = res.data["price"]
					totalDist = res.data["total_dist"] 
					resolve()
				})
				.catch(error => {
					console.error(error)
					response.statusCode = 401;
					response.send(error);
	
				})

			}).catch(function(rej) {
				console.log(rej);
			});;
			promiseList.push(pricePromise);

			console.log("Waiting for orders to be processed..");

			await Promise.all(promiseList)
				.then(async results => {

					//TODO rework for multiple delivery destination

					//volume
					delivery_orders[0]["template_data"][2]["data"]=request.body["volume"];
					//distance
					delivery_orders[0]["template_data"][3]["data"]=totalDist;
					//Billable
					delivery_orders[0]["template_data"][4]["data"]=1;
					//Rate_Card
					delivery_orders[0]["template_data"][5]["data"]=request.body["rate_code"];
					//Courrio_Customer_Num
					delivery_orders[0]["template_data"][6]["data"]=request.body["customer_number"];
					//Courrio cust name
					delivery_orders[0]["template_data"][7]["data"]=customer_name;
					//Job Price Ex GST
					delivery_orders[0]["template_data"][8]["data"]=totalPrice;
					//Job Descro[topm]
					delivery_orders[0]["template_data"][9]["data"]=request.body["job_description"];

					console.log("All promised completed");
					console.log("Price is " + totalPrice);
					console.log("Distance is" + totalDist);
					//call create_multiple_tasks tookan api 
					await axios
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
							deliveries: delivery_orders
						})
						.then(res => {
							var endDate = moment();
							var secondsDiff = endDate.diff(startDate, "seconds")
							console.log(secondsDiff + " seconds");

							if (res.data["status"] == "101") {
								response.status(res.status);
								response.send(res.data["message"]);
							} else if (res.data["status"] == "201") {
								response.status(res.status);
								response.send(res.data["message"]);
							} else {

								var message = {
									"order_number": request.body["order_number"],
									"pickups": res.data["data"]["pickups"],
									"delivery": res.data["data"]["deliveries"],
									"price" : totalPrice,
									"route_distance" : totalDist,
									"volume": request.body["volume"],
									"job_description": request.body["job_description"]
								}
								response.status(res.status);
								response.send(message);
							}

						})
						.catch(error => {
							console.error(error)
							response.statusCode = 401;
							response.send(error);
						})


					// response.status(200);
					// response.send("ok");
				});

		})
		.catch(function(err) {
			console.log(err);
			response.statusCode = 400;
			response.send(err.toString());
			return;
		});

});

app.use("/", router);
var options = {

	key: fs.readFileSync("./ssl/STAR_courrio_com_key.txt"),
  
	cert: fs.readFileSync("./ssl/star.courrio.com.crt"),
  
  };
  

http.createServer(app).listen(80);
https.createServer(options,app).listen(443)
