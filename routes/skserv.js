const express = require('express');
const router = express.Router();


//connect to model
var Service = require('../models/Servces');
const User = require('../models/user');

const isAuthenticated = function(req, res, next){
  // if user is authenticated in the session, call the next() to call the next request handler 
// Passport adds this method to request object. A middleware is allowed to add properties to
// request and response objects

if(req.isAuthenticated()){
   return next();
} else{
  req.flash('danger', 'please login');
    // if the user is not authenticated then redirect him to the login page
  res.redirect('/login');
}
};

router.get('/', isAuthenticated, function(req, res){
  Service.find({}, function(err, services){
    if(err){
      console.log(err);
    } else {
      //console.log(services);
      res.render('services',
    { 
    title: 'Sokokapu services',
    services: services
      });
    }
  });
});

router.get('/services/add', isAuthenticated, function(req, res, next){
  res.render('addService');
});

//get single service and edit
router.get('/services/:id', isAuthenticated, function(req, res, next){
  Service.findById(req.params.id, function(err, service){
     if(err){
      console.log(err);
     }else{
      User.findById(service.username, function(err, user){
        if(service.uniqId != req.user._id){
          req.flash('danger', 'not authorized');
          res.redirect('/skserv');
        } else {
              res.render('editService',{title: 'Edit Service',
              service:service});
              //console.log(service);
        }

      });
       
     }
  });
});


//update edited service
router.post('/services/:id', isAuthenticated, function(req, res, next){
  console.log('updating db');
  
  Service.findById(req.params.id, function(err, service){
    if(err){
     console.log(err);
    }else{
      res.render('editService',{title: 'Edit Service',
      service:service});
      //console.log(service);
      if(service){
        service.firstName =req.body.firstName;
        service.lastName=req.body.lastName;
        service.location = req.body.location;
        service.save();

      }
      else{
        console.log('service not edited');
      }
      
    }
 });
});

//add service in db

router.post('/services', isAuthenticated, function(req, res){
  var service = new Service({
    category: req.body.category,
    uniqId: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    location: req.body.location
  });
  service.save()
  .then(result => {console.log(result);
  })
  .catch(err => console.log(err));
  console.log('service added');
  next();
function next(){
  res.redirect('/skserv')};
  return;
});
//delete service
router.delete('/services/:id', isAuthenticated, function(req, res){
  let query = {_id:req.params.id};
  Service.findById(query, function(err, service){
    if(err){
     console.log(err);
    }else{
     User.findById(service.username, function(err, user){
       if(service.uniqId != req.user._id){
         res.status(500).send();
         res.redirect('/skserv');
       } else {
        Service.deleteOne(query, function(err){
          if(err){
            console.log(err);
          }
          res.send('Success');
          req.flash('success', 'service deleted');
        });
       }

     });
      
    }
 });
  
});
module.exports = router;
