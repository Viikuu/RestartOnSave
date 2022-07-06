# RestartOnSave - simple app which restarts our program on save
A homemade version of Nodemon to restart long running node software on change in program file or given directory with posibility to ignore files in it.
  Made using :
* Node.js 


## Table of contents
* [General info](#general-info)
* [Inspiration](#inspiration)
* [Setup](#setup)


## General info
This app is simple automatic restart on files change program.
	
## Inspiration
This project functionality was inspired by [Nodemon tool](https://www.npmjs.com/package/nodemon).
## Setup
To run this project, do the following steps:
*download repository files

```
$ cd ../downloadLocation
$ npm install
$ node app.js param1 param2
```
Where 
- param1 is your node app specific localisation which u want to run
- param2 is your node app directory where u want to check for file changes

By default:
- u can use only one parameter (param1) to restart it on changes.
- using directory will ignore directories with names [".idea","node_modules","public"] to change use Ignore files (#ignore files)

### Ignore files
To add ignored directories go to /src and change ignorePaths.json file and add dir name as below. 
```
"[\"node_modules\",\"public\",\".idea\",\"filename\" ]"
```

