const expect = require('expect');

const {Todo} = require('./../server/models/todo');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');

Todo.findByIdAndRemove().then((res) => {
  console.log(res);
});
