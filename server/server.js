var express = require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/users');
const {authenticate} = require('./middleware/authenticate');

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

app.patch('/todos/:id' , (req ,res) => {
  var id = req.params.id;
  var body = _.pick(req.body , ['text' , 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }
  else{
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id , {$set : body} , {new : true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send()
  });
});
/////////////////////USERS////////////////////////
app.post('/users/' , (req , res) => {
  var body = _.pick(req.body , ['email' , 'password']);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth' , token).send(user);
  }).catch((err) => {
    res.status(400).send(err);
  });
});


app.get('/users/me' ,authenticate, (req,res) => {
  res.send(req.user);
});

app.listen(port , () => {
  console.log(`Started on port ${port}`);
});

module.exports= {app}
