const {MongoClient , ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp' , (err , client) => {
  if(err) throw new Error('Connection Failed');
  const db = client.db('TodoApp');

  db.collection('Users').deleteMany({username:'Block',username:'Rohan'}).then((result) => {
    console.log(result);
  });
  // db.collection('Users').findOneAndDelete({
  //   _id : new ObjectID('5c2e5759efc51341f8dc31f5')
  // }).then((value) => {
  //   console.log(value);
  //});
  //db.close();
});
