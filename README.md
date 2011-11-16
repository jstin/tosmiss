## What is Tosmiss all about?

Tosmiss (The Open Source Mobile Image Sharing System) is a web server and mobile phone client that allows anyone to easily create their own image sharing website.

Tosmiss runs on [node.js](http://nodejs.org), uses [redis](http://redis.io) as a data store, and is super lightweight. 

Everything is easily configurable in the file `config.js`.

## Demo?

http://knowyourbro.com
http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=447715111&mt=8

## What is in this repo?

This repo contains the web server. Get the iPhone client at (https://github.com/jstin/Tosmiss-iPhone).

## What dependencies does Tosmiss have? 

Tosmiss requires [node.js](http://nodejs.org) 4.0+, [npm](http://npmjs.org/), [redis](http://redis.io), and (optionally) [ImageMagick](http://www.imagemagick.org).

The following npm modules are used:

- connect
- connect-form
- connect-redis
- express
- imagemagick (optionally)
- jade
- knox (optionally)
- redis

# Server Configuration

From a fresh Ubuntu install, run the following commands:
	
	sudo apt-get update && sudo apt-get upgrade -y
	sudo apt-get install build-essential patch zlib1g-dev libssl-dev libreadline5-dev
	sudo apt-get install git-core

Install [node.js](http://nodejs.org)

	cd /tmp
	wget http://nodejs.org/dist/node-v0.4.11.tar.gz
	tar xvzf node-v0.4.11.tar.gz
	cd node-v0.4.11/
	mkdir ~/local
	./configure --prefix=$HOME/local/node
	make
	make install
	echo 'export PATH=$HOME/local/node/bin:$PATH' >> ~/.profile
	echo 'export NODE_PATH=$HOME/local/node:$HOME/local/node/lib/node_modules' >> ~/.profile
	source ~/.profile
	
Install [npm](http://npmjs.org/)

	curl http://npmjs.org/install.sh | sh
	
Install [redis](http://redis.io)

	cd ~/local
	wget http://redis.googlecode.com/files/redis-2.2.12.tar.gz
	tar xzf redis-2.2.12.tar.gz
	cd redis-2.2.12
	make
	
Launch redis in the background

	src/redis-server &

Start a new shell...
Now get the source!! And install the npm dependencies with the handy packages.sh!!

	cd ~
	git clone git://github.com/jstin/Tosmiss.git
	cd Tosmiss
	./packages.sh 
	
**Start the server!! :-D**

	sudo ~/local/node/bin/node main.js
	
Note, we run as sudo because this is directly on port 80. Have fun!

	