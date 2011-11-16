// Remember, don't commit your secret keys into a public git repo!

exports.storageType = 'filesystem';  // filesystem or aws
exports.awsKey = 'your-key';				
exports.awsSecret = 'your-secret';		
exports.awsBucket = 'your-bucket';

exports.useImageMagick = false; //aka scale images

exports.numberOfImagesDisplayed = 10;
exports.numberOfImagesDisplayedForMobile = 5;

exports.uploadDir = './public/uploads/';
exports.imageName = 'image';
exports.smallImageName = 'small'

exports.redisImageList = 'images';
exports.redisTopRated = 'toplist';

exports.maxUploadSize = '2.5mb';


exports.strings = { title : 'Tosmiss (The Open Source Mobile Image Sharing System)',
                    header : 'Tosmiss',
                    newestImages : 'Newest Images',
                    topImages : 'Top Images',
                    randomImages : 'Random Images', 
                    upvoted : 'Rated Up!', 
                    downvoted : 'Rated Down!',
                    upvote : 'Upvote!',
                    downvote : 'Downvote!',
                  };