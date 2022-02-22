const {
  Firestore
} = require('@google-cloud/firestore');

// Create a new client
const firestore = new Firestore();

async function createCustomer(name, customer_number) {

  const res = await firestore.collection('customers').add({
      "api_key": "NA",
  });

  const detailRef = firestore.collection('customers');

  await detailRef.doc(res.id).collection('details').doc("webhook").set({
      "val": 'webhook_url' + customer_number.toString(),
  });

  await detailRef.doc(res.id).collection('details').doc("customer_name").set({
    "val": "Customer name"
});


  await detailRef.doc(res.id).collection('details').doc("customer_number").set({
      "val": "123456",
  });




  // Obtain a document reference.
  //const document = firestore.doc('customers/');

  //    // Enter new data into the document.
  //    await document.set({
  //      title: 'Welcome to Firestore',
  //      body: 'Hello World',
  //    });
  //    console.log('Entered new data into the document');

  //    // Update an existing document.
  //    await document.update({
  //      body: 'My first Firestore app',
  //    });
  //    console.log('Updated an existing document');

  //    // Read the document.
  //    const doc = await document.get();
  //    console.log('Read the document');

}
async function getCustomerName(apikey) {
  firestore.collection("customers").where("api_key", "==", apikey)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());

            console.log(doc.data()["details"]);
              return doc.data()["details"];
          
   
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });



}

async function getCustomer(id) {
  const customersRef = firestore.collection('customers');
  const snapshot = await customersRef.where('customer_number', '==', id.toString()).get();
  if (snapshot.empty) {
      console.log('No matching documents.');
      return;
  }

  snapshot.forEach(async doc => {
      console.log(doc.id, '=>', doc.data());
      await getDetails('customers/' + doc.id + "/details")
  });
}

async function getDetails(detailCollection) {
  const detailRef = firestore.collection(detailCollection);
  const snapshot = await detailRef.get();
  if (snapshot.empty) {
      console.log('No matching details.');
      return;
  }

  snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());

  });
}

async function getRateCard(ratecard) {
  const customersRef = firestore.collection('pricing');
  const snapshot = await customersRef.where('Rate Code', '==', ratecard.toString()).get();
  if (snapshot.empty) {
      console.log('No matching documents.');
      return;
  }
  
  return snapshot.docs[0].data();
}

function checkAPIKey(key) {
  var promise = new Promise(async function(resolve, reject) {
      const firestore = new Firestore();
      const customersRef = firestore.collection('customers');
      const snapshot = await customersRef.where('api_key', '==', key.toString()).get();
      if (snapshot.empty) {

          reject('No matching API KEY.');

      }
      resolve("Key found");
  });

  return promise;
}



module.exports = {
  createCustomer,
  getCustomerName,
  getCustomer,
  checkAPIKey,
  getRateCard
};