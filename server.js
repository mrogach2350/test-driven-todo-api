// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
    
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/todo-app-demo');

// configure bodyParser (for receiving form data)
app.use(bodyParser.urlencoded({ extended: true }));

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

// our database is an array for now with some hardcoded values
var todos = [
  { _id: 1, task: 'Laundry', description: 'Wash clothes' },
  { _id: 2, task: 'Grocery Shopping', description: 'Buy dinner for this week' },
  { _id: 3, task: 'Homework', description: 'Make this app super awesome!' }
];

function newId(){
  return todos.length + 1;
}

// function findQuery(query){
//   var found= [];
//   for (var i = 0; i < todos.length; i ++){
//     if(todos[i].task.toLowerCase().include(query)){
//       found.push(todos[i]);
//     }
//   }
// }
/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 *
 * The comments below give you an idea of the expected functionality
 * that you need to build. These are basic descriptions, for more
 * specifications, see the todosTest.js file and the outputs of running
 * the tests to see the exact details. BUILD THE FUNCTIONALITY IN THE
 * ORDER THAT THE TESTS DICTATE.
 */

app.get('/api/todos/search', function search(req, res) {
  var query =req.query.q;
  console.log(query);
  var found= [];
  for (var i = 0; i < todos.length; i ++){
    if(todos[i].task == query){
      found.push(todos[i]);
    }
  }
  toSend = {todos: found};
  console.log(toSend);
  res.json(toSend);
});

app.get('/api/todos', function index(req, res) {
  var toSend = {'todos': todos};
  res.send(toSend);
});

app.post('/api/todos', function create(req, res) {
  var newTodo = {
    _id: newId(),
    task: req.body.task,
    description: req.body.description
  }
  todos.unshift(newTodo);
  res.send(newTodo);
});

app.get('/api/todos/:id', function show(req, res) {
  var num = req.params.id;
  var sendThis;
  for(var i = 0; i< todos.length; i++){
    if (todos[i]._id == num){
      sendThis = todos[i];
    }
  }
  res.send(sendThis);
});

app.put('/api/todos/:id', function update(req, res) {
  var thisTodo = {};
  for (var i = 0; i < todos.length; i ++){
    if(todos[i]._id == req.params.id){
      thisTodo = todos[i];
    }
  }
  thisTodo.task = req.body.task;
  thisTodo.description = req.body.description;
  res.send(thisTodo);
});

app.delete('/api/todos/:id', function destroy(req, res) {
  for (var i = 0; i < todos.length; i ++){
    if(todos[i]._id == req.params.id){
      todos.splice(i,i)
    }
  }
  res.send(todos);
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(3000, function() {
  console.log('Server running on http://localhost:3000');
});
