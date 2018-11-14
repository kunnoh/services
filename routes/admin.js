const express = require('express');
const router = express.Router();
//const rbac = require('../controller/rbac');
const Service = require('../models/Servces');



router.get('/', function(req, res){
    res.render('admindash');
});


//get registered service-owners
router.get('/service-owner', function(req, res){
    Service.find({}, function(err, services){
        if(err){
            console.log(err);
            console.log('errors in querying for services');
        } else {
            res.render('serviceOwner', {title: 'Sokokapu Services',services: services}); 
        }
    });
    
});

//edit registered service owners
router.post('/service-owner', function(req, res){
    
});

//get service providers
router.get('/service-provider', function(req, res){
    res.render('serviceProvider');
});

//get services customers
router.get('/customers', function(req, res){
    res.render('customers');
});


//get services categories
router.get('/category', function(req, res){
    Service.find({}, function(err, services){
        if(err){
            console.log(err);
        } else {
            res.render('category', {title: 'Sokokapu Services', services:services});
        }
    });
});


module.exports = router;