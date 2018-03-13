# Introduction

Blog written by JavaScript.

## Download KoalaBlog.js and its dependency

```
git clone git@github.com:LuckyKoala/KoalaBlog.js.git
npm install
```

## Install RethinkDB server

Check documention on [Official Site](https://www.rethinkdb.com/docs/install/)

# Usage

## Run RethinkDB server

Run command `rethinkdb` in the directory where you want to store your data.

## Run KoalaBlog

```
chmod a+x koalablog.js
./koalablog.js -p 3000 #Run at port 3000.
./koalablog.js -p 3000 --reset #Run at port 3000 and reset database.
./koalablog.js -p 3000 --token '233' #Run at port 3000 and use token '233'.
./koalablog.js --debug #Run with debug mode enabled.
```

# Features

* Control pane for creating, editing and deleting posts.
* View all posts or detail of specified post.
* RESTful API.
* Simple CLI for setting port number and enabling debug mode.
* Token is required for operation that will change database.
