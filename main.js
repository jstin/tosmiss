//------------------------------------------------------------
// Setup -
// -- Load modules and get config
//------------------------------------------------------------

var config = require('./config');
var im;

if (config.useImageMagick) {
  im = require('imagemagick');
}

var utils = require('./utils');
var net = require('net');
var express = require('express');
var fs = require('fs');
var form = require('connect-form');
var redis = require('redis').createClient();
var connect = require('connect')
var RedisStore = require('connect-redis')(connect);


//------------------------------------------------------------
// Express app -
// -- The actual http server
//------------------------------------------------------------


var app = express.createServer(form({ keepExtensions: true }));

app.configure(function(){
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'yoursecret-abcdefghijk-elemeno-p', store : new RedisStore({db : 1}) }));
  app.use(express.methodOverride());
  app.use(express.limit(config.maxUploadSize));
  app.use(express.bodyParser());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.set('view engine', 'jade');

app.helpers({
		imageURL: function(id, size){
			return utils.htmlImagePath(id, size);
		}
});

app.dynamicHelpers({
		rejects: function(req, res){
			return req.session.rejects;
		},
		positiveRated: function(req, res){
			return req.session.positiveRated;
		},
		negativeRated: function(req, res){
			return req.session.negativeRated;
		},
  	strings: function(req, res){
  		return config.strings;
  	}
});

app.get('/', function(req, res) {
  
  redis.llen(config.redisImageList, function (err, len) {
    redis.lindex(config.redisImageList, Math.floor(Math.random()*len), function (err, rand) {
      redis.lrange(config.redisImageList, 0, config.numberOfImagesDisplayed, function (err, newest) {
        redis.zrevrangebyscore(config.redisTopRated, '+inf', 0, 'LIMIT', 0, config.numberOfImagesDisplayed, function (err, topRated) {
          res.render('index', {locals : {newest : newest, topRated : topRated, rand : rand }});
        });
      });
    });
  });
  
});

app.get('/random', function(req, res) {
  redis.llen(config.redisImageList, function (err, len) {
    redis.lindex(config.redisImageList, Math.floor(Math.random()*len), function (err, rand) {
      res.render('rand', { layout : false, locals : { rand : rand }});
    });
  });
});

app.get('/mobile/new', function(req, res) {
  
    redis.lrange(config.redisImageList, 0, config.numberOfImagesDisplayedForMobile, function (err, im) {
        res.render('mobileindex', {locals : {images : im }, layout : 'mobile' });
    });
  
});


app.get('/mobile/top', function(req, res) {
  
    redis.zrevrangebyscore(config.redisTopRated, '+inf', 0, 'LIMIT', 0, config.numberOfImagesDisplayedForMobile, function (err, t) {
        res.render('mobileindex', {locals : {images : t }, layout : 'mobile' });
    });
  
});

app.get('/mobile/random', function(req, res) {
  
    redis.llen(config.redisImageList, function (err, len) {
      redis.lindex(config.redisImageList, Math.floor(Math.random()*len), function (err, rand) {
        res.render('mobilerand', { layout : 'mobile', locals : { rand : rand }});
      });
    });
  
});

app.get('/ping', function(req, res) {
  res.end('pong');
});

app.post('/image', function(req, res, next) {
  req.form.complete(function(err, fields, files){
      if (err) {
        next(err);
      } 
      else {
        
        var id = Date.now() + '_' + utils.randomID(5);
              
        fs.renameSync(files['theimage'].path, utils.imagePath(id));
        
        if (config.useImageMagick) {
          im.resize({
            srcPath: utils.imagePath(id),
            dstPath: utils.imagePath(id, 'small'),
            width:   300
          }, function(err, stdout, stderr){
            if (err) throw err
            console.log('resized image.jpg ')
    			
    			  if (config.storageType == 'aws')
    			    utils.uploadAWS(id);
    			    
        });
        
        redis.lpush(config.redisImageList, id);
        res.end('success');
      }
      else if (config.storageType == 'aws') {
		    utils.uploadAWS(id);
		    
		    redis.lpush(config.redisImageList, id);
        res.end('success');
	    }
	    else {
	      redis.lpush(config.redisImageList, id);
        res.end('success');
	    }
      
      
    }
  });  
});

app.post('/upvote/:id', function(req, res, next) {
  redis.zincrby(config.redisTopRated, 1, req.params.id);
  if (!req.session.positiveRated)
    req.session.positiveRated = [];
    
  req.session.positiveRated.push(req.params.id);
  res.redirect('back');
});

app.post('/downvote/:id', function(req, res, next) {
  redis.zincrby(config.redisTopRated, -1, req.params.id);
  if (!req.session.negativeRated)
    req.session.negativeRated = [];
    
  req.session.negativeRated.push(req.params.id);
  res.redirect('back');
});

app.listen(80);
