var express = require('express');
var bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');

var port = 3000;
var app = express();

app.use(bodyParser.json());

app.post('/todos' , (req , res) => {
  var todo = new Todo({
    text : req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  } ,(err) => {
    res.status(400).send(err);
  });
});


app.listen(port , () => {
  console.log(`Started on port ${port}`);
});
