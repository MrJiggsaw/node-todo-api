var mongoose = require('mongoose');

var Todo = mongoose.model('Todo' , {
  text:{
    type : String,
  },
  completed:{
    type : Boolean ,default : false
  },
  completedAt:{
    type : String,default : `${(new Date()).getHours()+':'+(new Date()).getMinutes()+":"+(new Date()).getSeconds()}`
  }
});

module.exports = {Todo};
