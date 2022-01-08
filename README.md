# custom_tookan
*Instructions*

```
sudo TOOKAN_API_KEY=<YOUR-TOOKAN-API-KEY> GOOGLE_API_KEY=<YOUR-GOOGLE-API-KEY> node app.js
```

http://api.courrio.com/new_order

```
{
    "tookan_api_key": <YOUR-TOOKAN-API-KEY>,
	"api_key":  <CUSTOMER-API-KEY>,
	"shipping_method": "Next Day",
    "signature_required": false,
    "total_packages": "2",
	"pickup_address": [{
			"name": "Big tyre company",
			"pickup_contact": "John Smith",
			"phone": "0212345678",
			"street": "5 Wallace Street",
			"suburb": "Sydney",
			"state": "NSW",
			"post_code": "2000",
			"country": "Australia",
			"pickup_email": "service@bigtyre.com.au",
			"pickup_instructions": "Ask for Amanda",
			"pickup_after": "pickup_latest",
			"pickup_reference": "W0221234",
			"order_number": "BX335684063"
		}
	],
	"delivery_address": [{
			"name": "My Corporation",
			"contact": "Bill Bloggs",
			"phone": "0212345678",
			"street": "20 Park Street",
			"suburb": "Sydney",
			"state": "NSW",
			"post_code": "2000",
			"country": "Australia",
			"email": "service@mycorp.com.au",
			"delivery_instructions": "Leave at door",
			"authority_to_leave": "No Authority to Leave",
			"deliver_after": "deliver_latest",
            "deliver_latest": " ",
            "order_number": "BX335684063"
		},
        {
			"name": "My Corporation",
			"contact": "Bill Bloggs",
			"phone": "0212345678",
			"street": "Kingsgrove",
			"suburb": "Sydney",
			"state": "NSW",
			"post_code": "2208",
			"country": "Australia",
			"email": "service@mycorp.com.au",
			"delivery_instructions": "Leave at door",
			"authority_to_leave": "No Authority to Leave",
			"deliver_after": "deliver_latest",
            "deliver_latest": " ",
            "order_number": "BX335684063"
		}
	]
}
```