const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const {ObjectID} = require('mongodb');
const todos = [
  {
    _id : new ObjectID(),
    text : "Eat the pancakes"
  },
  {
    _id : new ObjectID(),
    text : "Drink the milk",
    completed : true,
    completedAt : 333
  }
]
beforeEach((done) => {
    Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST /todos' , () => {
  it('Should create a todo' , (done) => {
    var text = "Take a nap";

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err,res) => {
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create any invalid todos' , (done) => {

    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err , res) => {
        if(err) throw new Error(err);

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });

  });
});

describe("GET /todos" ,() => {
  it('Expecting todos list from mongoDB' ,(done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(2);
      })
      .end(done);
  })
});

describe('GET /todos/:id' ,() => {
  it('should return todo doc' ,(done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(todos[0].test)
      })
      .end(done);
  });

  it('should return 404 if todo not found' , (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids' ,(done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id' , () => {

  it('should return 404 if ObjectID invlaid' , (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id' , () => {
  it('should update the todo' , (done) => {
    var hexId = todos[0]._id.toHexString();
    const newText = "This is new mode";
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed : true,
        text : newText
      })
      .expect((res) => {
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.completed).toBe(true);
      })
      .expect(200)
      .end(done);
  });
  it('should clear completedAt when todo is not completed' , (done) => {
    var hexId = todos[1]._id.toHexString();
    const newText = "This is new mode";
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed : false,
        text : newText
      })
      .expect((res) => {
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .expect(200)
      .end(done);
  });
});
