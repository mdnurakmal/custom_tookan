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


var mysql = require('mysql');

// for(var i = 0 ; i < 10; i++)
// {
//     customer.createCustomer("test"+i.toString(),i);
// }

// var result = srs({length: 56,alphanumeric: true});
// console.log(result);
// customer.getCustomer("999");

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
	console.log("receive webhook");
	//console.log(request.body);
	pub.publish(request.body);
	response.status(200);
	response.send("ok");
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


function computeDeliveryDate(rate, fixedDeadline, orderCutOff, deliveryDeadline,daysToDelivery, orderDate) {
	// same day delivery and delivery dateline set to 1700
	console.log(rate + " , " + fixedDeadline + " , " + orderDate.format('MMMM Do YYYY, h:mm:ss a') + ", " + orderCutOff)
	console.log("days to delivery: " + daysToDelivery);
	var deliveryDate;
	var cutoff;
	var timeSplit = orderCutOff.split(":")[0];

	//check if order is before cutoff

	cutoff = moment().tz("Australia/Sydney").set({
		"hour": timeSplit[0],
		"minute": timeSplit[1],
		"second": 0
	});
	
	deliveryDate = moment().tz("Australia/Sydney").set({
		"hour": 17,
		"minute": 0,
		"second": 0
	});


	var isBefore = moment(orderDate).isBefore(cutoff);

	if (isBefore) {
		console.log("order is before cut off");
		deliveryDate = deliveryDate.add(daysToDelivery, "days");
		return deliveryDate;
	} else {
		deliveryDate = deliveryDate.add(1+daysToDelivery, "days");
		console.log(deliveryDate.format("YYYY-MM-DD HH:mm:ss"));
		console.log("Order placed after cut off time : Order is placed as next day")
		return deliveryDate;
		//throw "Order is after cut off time";
	}

	//return moment(orderDate, "YYYY-MM-DD").tz("Australia/Sydney").add(1,"days").format("YYYY-MM-DD HH:mm:ss");
}

// courrio bulk order API
router.post('/new_order', async (request, response) => {
	var promise = customer.checkAPIKey(request.body["api_key"]);

	await Promise.all([promise])
		.then(async results => {

			// get ratecard
			var rateCode = request.body["rate_code"];
			var rateCard = await customer.getRateCard(rateCode);

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
			var deliveryDate;
			try {
				deliveryDate = computeDeliveryDate(rateCard["Delivery Type"], rateCard["Fixed Delivery Deadline"], rateCard["Order Cutoff"], rateCard["Delivery Deadline Home"], rateCard["Days from Order to Delivery"],orderDate);
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
			var full_delivery_address = request.body["delivery_address"][0]["street"] + ", " + request.body["delivery_address"][0]["suburb"] + ", " + request.body["delivery_address"][0]["state"] + ", " + request.body["delivery_address"][0]["country"] + ", " + request.body["delivery_address"][0]["post_code"] 
			var full_pickup_address = request.body["pickup_address"][0]["street"] + ", " + request.body["pickup_address"][0]["suburb"] + ", " + request.body["pickup_address"][0]["state"] + ", " + request.body["pickup_address"][0]["country"] + ", " + request.body["pickup_address"][0]["post_code"]
			console.log(full_pickup_address)
			console.log(full_delivery_address)
			var totalDist;
			var totalPrice;
			var pricePromise = new Promise(async function(resolve, reject) {
				console.log("getting price")
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
					console.log()
					totalPrice = res.data["data"]["price"]
					totalDist = res.data["data"]["total_dist"] 
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

					console.log("All promised completed");
					console.log("Price is " + price);
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
									"price" : price,
									"route_distance" : totalDist,
									"volume": request.body["volume"]
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

http.createServer(app).listen(80);
//https.createServer(options, app).listen(443);