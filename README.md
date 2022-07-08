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

By default:

- using directory will ignore directories with names ['node_modules', 'public', '.idea', '.git', '.gitignore'] to change use Ignore files (
  #ignore files)

### Ignore files

To add ignored directories go to /src and change ignorePaths.json file and add 'dirname' as below.

```
['node_modules', 'public', '.idea', '.git', '.gitignore','dirname']
```

