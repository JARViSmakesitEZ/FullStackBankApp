const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/bankDB');
const app = express();

/*ACCOUNT INFORMATION*/
let bal;
let un;
let transacs;
let withd = 7000;
let dep = 50000;
let dat = '28/09/2023';
/*ACCOUNT INFORMATION*/

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const bankSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: [true, 'why no name bro?give name'],
  },
  balance: {
    type: Number,
  },
  password: {
    type: Number,
  },
  email: {
    type: String,
  },
  transactions: {
    type: Array,
  },
});

const User = mongoose.model('User', bankSchema);

const port = 3000;
const staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(staticPath, 'main_page', 'index.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(staticPath, 'signup_page', 'index.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(staticPath, 'login_page', 'index.html'));
});
app.get('/home', (req, res) => {
  res.sendFile(path.join(staticPath, 'home_page', 'index.html'));
});

app.post('/check', (req, res) => {
  // retrieveLoginInfo();
  const name = req.body['username'];
  const pwd = req.body['password'];
  const query = {
    username: name,
    password: pwd,
  };
  console.log(query);
  User.findOne({ $and: [query] })
    .then(docs => {
      if (docs) {
        // Handle the case where a document is found
        // return true;
        // console.log(docs);
        getDetails(docs);
        // console.log(name);
        // console.log(balance);
        // console.log(transactions);
        // res.sendFile(`${staticPath}/home_page/index.html`);
        res.render('temp.ejs', {
          name: 'jamal',
          balance: bal,
          withdrawalValue: withd,
          depositValue: dep,
          date: dat,

          // transactions: transacs,
        });
      } else {
        res.sendFile(path.join(staticPath, 'main_page', 'index.html'));
      }
    })
    .catch(err => {
      console.log(err);
    });
  // if (validateUser(name, pwd) == true) {
  //   res.sendFile(`${staticPath}/home_page/index.html`);
  // } else {
  //   res.sendFile(path.join(staticPath, 'main_page', 'index.html'));
  // }
});

app.post('/newuser', (req, res) => {
  const name = req.body['name'];
  const email = req.body['email'];
  const password = req.body['password'];
  const balance = req.body['balance'];
  addNewUser(name, email, password, balance);
});

app.listen(port, () => {
  console.log(`listening to port ${port}...`);
});

function validateUser(name, pwd) {
  const query = {
    username: name,
    password: pwd,
  };
  console.log(query);
  User.findOne({ $and: [query] })
    .then(docs => {
      if (docs) {
        // Handle the case where a document is found
        return true;
      }
    })
    .catch(err => {
      console.log(err);
    });
  return false;
}

function addNewUser(un, mail, pwd, amount) {
  const user = new User({
    username: un,
    email: mail,
    password: pwd,
    balance: amount,
  });
  user.save();
}

function getDetails(docs) {
  bal = docs['balance'];
  un = docs['username'];
  transacs = docs['transactions'];
}
