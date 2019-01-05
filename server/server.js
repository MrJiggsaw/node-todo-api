var express = require('express');
var bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');

var {ObjectID} = require('mongodb');

var port = process.env.PORT || 3000;
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

app.get('/todos' ,(req, res) => {
  Todo.find().then((todos) => {
    res.send(todos)
  } , (err) => {
    res.status(400).send('Not Found');
  });
});

app.get('/todos/:id' , (req , res) => {
  var id  = req.params.id;
  if (!ObjectID.isValid(id)){
    res.status(404).send('Id Invalid.Check Again');
  }
  Todo.findById(id).then((todo) => {
    if (todo){
      return res.send({todo});
    }
    res.status(404).send();
  }, (err) => {
    if(err) return res.status(400).send();
  });
});

app.delete('/todos/:id' , (req , res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }
  id = ObjectID(id);
  Todo.deleteOne({_id : id}).then((todo) => {
    if(!todo) {
      return res.status(404).send();
    }
    res.status(200).send(todo);
  } , (err) => {
    if(err){
    res.status(404).send('Todo not found');}
  })
});

app.listen(port , () => {
  console.log(`Started on port ${port}`);
});

module.exports= {app}
