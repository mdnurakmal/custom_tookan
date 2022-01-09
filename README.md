
# Instructions

```
GOOGLE_APPLICATION_CREDENTIALS=./key.json
sudo GOOGLE_API_KEY=<YOUR-GOOGLE-API-KEY> node app.js
```

# New Order API (1 Pickup to X Delivery)
http://api.courrio.com/new_order

Request Body
```
{
   "tookan_api_key":"<YOUR-TOOKAN-API-KEY>",
   "api_key":"<CUSTOMER-API-KEY>",
   "shipping_method":"Next Day",
   "signature_required":false,
   "total_packages":"2",
   "pickup_address":[
      {
         "name":"xxxx company",
         "pickup_contact":"xxxxx",
         "phone":"xxxxxx",
         "street":"5 Wallace Street",
         "suburb":"Sydney",
         "state":"NSW",
         "post_code":"2000",
         "country":"Australia",
         "pickup_email":"service@xxxxx.com.au",
         "pickup_instructions":"Ask for xxxxx",
         "pickup_after":"pickup_latest",
         "pickup_reference":"W0221234",
         "order_number":"xxxxxx"
      }
   ],
   "delivery_address":[
      {
         "name":"My Corporation",
         "contact":"xxxxxx",
         "phone":"xxxxxx",
         "street":"20 Park Street",
         "suburb":"Sydney",
         "state":"NSW",
         "post_code":"2000",
         "country":"Australia",
         "email":"service@mycorp.com.au",
         "delivery_instructions":"Leave at door",
         "authority_to_leave":"No Authority to Leave",
         "deliver_after":"deliver_latest",
         "deliver_latest":" ",
         "order_number":"xxxxxx"
      },
      {
         "name":"My Corporation",
         "contact":"xxxxx",
         "phone":"xxxxxx",
         "street":"Kingsgrove",
         "suburb":"Sydney",
         "state":"NSW",
         "post_code":"2208",
         "country":"Australia",
         "email":"service@xxxxxx.com.au",
         "delivery_instructions":"Leave at door",
         "authority_to_leave":"No Authority to Leave",
         "deliver_after":"deliver_latest",
         "deliver_latest":" ",
         "order_number":"xxxxxx"
      }
   ]
}
```
Result
```
Successful
```
# Edit Order API
http://api.courrio.com/edit_order

Request Body
```
{
    "tookan_api_key":"<YOUR-TOOKAN-API-KEY>",
    "api_key":"<CUSTOMER-API-KEY>",
    "datetime":"2022-01-09 08:24:00",
    "address":"xxxx",
    "order_ids":"xxxxx"
}
```

Result
```
The task has been updated
```

# Order Status API
http://api.courrio.com/order_status

Request Body
```
{
    "tookan_api_key":"<YOUR-TOOKAN-API-KEY>",
    "api_key":"<CUSTOMER-API-KEY>",
    "order_ids": "xxxxx"
}
```

Result
```

```

# Delete Order API
http://api.courrio.com/delete_order

Request Body
```
{
    "tookan_api_key":"<YOUR-TOOKAN-API-KEY>",
    "api_key":"<CUSTOMER-API-KEY>",
    "order_ids": "xxxx"
}
```

Result
```
The task has been deleted
```