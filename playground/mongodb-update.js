const {MongoClient , ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err , client) => {
  if(err) throw new Error("Connection failed");
  const db = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate({
    name : "Amanpreet"  }
    ,{$set :{location : "Bandra"},$inc : {age : 1}},{
      returnOriginal : false
    }).then((docs) => {
      console.log(docs);
    })
});
