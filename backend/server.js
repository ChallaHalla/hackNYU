const express = require('express');
const session = require('express-session');
const db = require('./db');
const mongoose = require('mongoose');
const path = require('path');
const fn = path.join(__dirname, 'config.json');
const app = express();

const Community = mongoose.model('Community');
const Event = mongoose.model('Event');
const User = mongoose.model('User');

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'local session secret',
    resave: false,
    saveUninitialized: true,
  })
);

// get users
app.get('/api/users', (req, res) => {
  let query = {};
  User.find().populate('events').populate('communities').exec((err, varToStoreResult) =>{
    res.json(varToStoreResult);
  });
});

//get user
app.get('/api/user', (req, res) => {
  if(req.query.userId !== undefined){
    User.findOne({_id: req.query.userId}).populate('events').populate('communities').exec((err, varToStoreResult) =>{
      console.log(varToStoreResult);
      res.json(varToStoreResult);
    });
  }
});

//create users
app.post('/api/user', (req, res) => {
  const user = new User({
    name: req.body.name,
    communities: [req.body.community],
    events: [],
  });
  user.save().then((user) => {
    req.session.userId = user._id;
    res.end();
  });
});

// get communities
app.get('/api/community', (req, res) => {
  let query = {};
  Community.find(query, (err, varToStoreResult, count) => {
    res.json(varToStoreResult);
  });
});

//create communities
app.post('/api/community', (req, res) => {
  community = new Community({
    name: req.body.name,
    users: [],
    events: [],
  });
  community.save(() => {
    res.end();
  });
});

// add to community
app.post('/api/community/add', (req, res) => {
  Community.findOne(
    { _id: req.session.communityId },
    (err, varToStoreResult) => {
      let community = varToStoreResult;
      User.findOne({ _id: req.session.userId }, (err, varToStoreResult) => {
        let user = varToStoreResult;
        community.users.push(user);
        community.save(() => {
          res.end();
        });
      });
    }
  );
});

// get events
app.get('/api/events', (req, res) => {
  let query = {};
  Event.find().populate('attendees').populate('yesList').populate('noList').exec((err, varToStoreResult) => {
    res.json(varToStoreResult);
  });
});

// get events
app.get('/api/event', (req, res) => {
  let query = {_id: req.query.id};
  let event;
  if(req.query.id !== undefined){
    Event.findOne(query).populate('attendees').populate('yesList').populate('noList').exec((err, varToStoreResult)=>{
      res.json(varToStoreResult);
    });
  }
});

//create events
app.post('/api/events', (req, res) => {
<<<<<<< HEAD
  Community.findOne(
    { _id: req.session.communityId },
    (err, varToStoreResult) => {
      let community = varToStoreResult;
      User.findOne({ _id: req.session.userId }, (err, varToStoreResult) => {
        let user = varToStoreResult;
        event = new Event({
          name: req.body.name,
          descr: req.body.descr,
          published: false,
          creator: user,
          yesList: [],
          noList: [],
          attendees: [],
        });
        community.events.push(event);
        event.save(() => {
          res.end();
        });
=======
  Community.findOne({ _id: req.body.communityId }, (err, varToStoreResult) =>{
    let community = varToStoreResult;
    User.findOne( { _id: req.body.userId }, (err, varToStoreResult) => {
      let user =  varToStoreResult;
      event = new Event({
        name: req.body.name,
        desc: req.body.desc,
        published: false,
        creator: user,
        yesList: [],
        noList: [],
        attendees:[],
      });
      community.events.push(event);
      event.save(() => {
        res.end();
>>>>>>> api updated for mongo populate function
      });
    }
  );
});

//event vote
app.post('/api/vote', (req, res) => {
  let user;
  User.findOne({ _id: req.body.userId }, (err, varToStoreResult, count) => {
    user = varToStoreResult;
    let event;
    Event.findOne({ _id: req.body.eventId }, (err, varToStoreResult) => {
      event = varToStoreResult;
<<<<<<< HEAD
    }).then(() => {
      if (req.body.vote === 'yes') {
        event.yesList.push(user);
      } else if (req.body.vote === 'no') {
        event.noList.push(user);
=======
    }).then(() =>{
      // true is vote yes false is vote no
      if(req.body.vote){
        event.yesList.push(user._id);
      } else{
        event.noList.push(user._id);
>>>>>>> api updated for mongo populate function
      }
      console.log(event);
      event.save(() => {
        res.end();
      });
    });
  });
});

// publish event
app.post('/api/publishEvent', (req, res) => {
  Event.findOne({ _id: req.body.eventId }, (err, varToStoreResult) => {
    let event = varToStoreResult;
    event.published = true;
    event.save(() => {
      req.end();
    });
  });
});

// add guest
app.post('/api/event/addGuest', (req, res) => {
  Event.findOne({ _id: req.body.eventId }, (err, varToStoreResult) => {
    let event = varToStoreResult;
    User.findOne({ _id: req.body.userId }, (err, varToStoreResult) => {
      let user = varToStoreResult;
      // perhaps check if user exists in array before pushing
      event.attendees.push(user._id);
      console.log(event);
<<<<<<< HEAD
      event.save(() => {
=======
      event.save(()=>{
        console.log("guest added");
>>>>>>> api updated for mongo populate function
        res.end();
      });
    });
  });
});

<<<<<<< HEAD
app.get('*', express.static('../hack-nyu/build'));
=======


// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '/../hack-nyu/public/index.html'));
// });
>>>>>>> api updated for mongo populate function

app.listen(3001);
