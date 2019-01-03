const { MongoClient , ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err , client) => {
  if (err){
    return console.log('Connection Failed');
  }
  const db = client.db('TodoApp');
  db.collection('Users').find({username:'Amanpreet'}).toArray().then((docs) => {
    console.log(JSON.stringify(docs , 2));
  },(err) => {
    console.log('Fetch Fail');
  });
  client.close();
});
