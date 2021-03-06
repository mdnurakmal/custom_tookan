const {
  Firestore
} = require('@google-cloud/firestore');

// Create a new client
const firestore = new Firestore();

async function createCustomer(name, customer_number) {

  const res = await firestore.collection('customers').add({
      "api_key": "NA",
      "webhook_url": "Webhook",
  });

  const detailRef = firestore.collection('customers');

  // await detailRef.doc(res.id).collection('details').doc("webhook").set({
  //     "val": 'webhook_url' + customer_number.toString(),
  // });

  await detailRef.doc(res.id).collection('details').doc("customer_name").set({
    "val": "Customer name"
});


  await detailRef.doc(res.id).collection('details').doc("customer_number").set({
      "val": "123456",
  });
}

async function getCustomerName(apikey) {


    const customersRef = firestore.collection('customers');
    const snapshot = await customersRef.where('api_key', '==', apikey).get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }
    else
    {
      const detailsRef = firestore.collection("customers/"+snapshot.docs[0].id+"/details");
      const snapshotDetails = await detailsRef.get();
      if (snapshotDetails.empty) {
          console.log('No matching documents.');
          return;
      }
      else
      {
        console.log(snapshotDetails.docs[0].data()["val"])
        return snapshotDetails.docs[0].data()["val"];
      }
    } 
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
  getRateCard,
};