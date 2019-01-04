const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {
    text : "Eat the pancakes"
  },
  {
    text : "Drink the milk"
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
})
