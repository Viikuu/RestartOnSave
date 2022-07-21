# RestartOnSave - restart app on change

A homemade version of Nodemon to restart long running node software whenever app is saved.

Made using Node.js.

## Table of contents

* [Inspiration](#inspiration)
* [Setup](#setup)

## Inspiration

This project is inspired by [Nodemon](https://www.npmjs.com/package/nodemon).

## Setup

To run this project, do the following steps:

* download repository files

```
 cd ../downloadLocation
 npm install
 node app.mjs yournodeapp [appProjectDirectory]
```

Where

- yournodeapp is specific localization to your app
- appProjectDirectory is your node project directory where u want to check for file changes


### Ignore files

App uses .gitignore file to set which files to ignore.

