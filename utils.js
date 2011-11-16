var config = require('./config');
var fs = require('fs');
var knox;

if (config.storageType == 'aws') {
  knox = require('knox');
}

function _endPath(between, id, size) {
  if (size == 'small' && config.useImageMagick)
	  return id + between + config.smallImageName + '.jpg';
	
	return id + between + config.imageName + '.jpg';
}

exports.randomID = function(length) {
	id = ""; 
  alphaNumeric = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  for (var i = 0; i < length; i++)
		id += alphaNumeric[Math.floor(Math.random()*62)];
	return id;
}

exports.imagePath = function(id, size) {
	return config.uploadDir + _endPath('_', id, size);	
}

exports.remoteImagePath = function(id, size) {
  return '/' + _endPath('/', id, size);	
}

exports.htmlImagePath = function(id, size) {
  var between = '_';
  if (config.storageType == 'aws')
    between = '/';
    
    
  var prefix = config.uploadDir.replace('./public', '');
  if (config.storageType == 'aws')
    prefix = 'http://' + config.awsBucket + '.s3.amazonaws.com/';
    
  return prefix + _endPath(between, id, size);	;
	
}

exports.uploadAWS = function (id) {
  var client = knox.createClient({
	    key: config.awsKey
	  , secret: config.awsSecret
	  , bucket: config.awsBucket
	});

	var stream = fs.createReadStream(exports.imagePath(id));

	client.putStream(stream, exports.remoteImagePath(id), function(err, res){
		fs.unlink(exports.imagePath(id));
	});

  if (config.useImageMagick) {
  	var stream2 = fs.createReadStream(exports.imagePath(id, 'small'));

  	client.putStream(stream2, exports.remoteImagePath(id, 'small'), function(err, res){
  		fs.unlink(exports.imagePath(id, 'small'));
  	});
  }
}