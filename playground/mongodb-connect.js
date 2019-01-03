const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err , client) => {
  if (err){
    return console.log('Unable to connect to Mongo');
  }
    console.log('Connected successfully');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //   text : "Get Food from shop",
    //   completed : false
    // } , (err , result) => {
    //   if(err){
    //     return console.log('Insertion Failed');
    //   }
    //     console.log(JSON.stringify(result.ops , 2));
    // });

    db.collection('Users').insertOne({
      username : 'Block',
      password : 'asd23234asd23',
      location: 'Mumbai'
    } , (err , result) => {
      if(err){
        return console.log('Insertion failed');
      }
      console.log(JSON.stringify(result.ops , 2));
    });
    client.close();
});
