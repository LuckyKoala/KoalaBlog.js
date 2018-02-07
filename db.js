const cloneDeep = require('lodash/cloneDeep')
const Promise = require('promise')
const r = require('rethinkdbdash')({
    db: 'blog'
})

function DB(username='LK', password='123456') {
    //Note: must invoke init first
}

DB.prototype.reset = function() {
    return this.init(true)
}

DB.prototype.init = function(dropIfExists=false) {
    return new Promise((resolve, reject) => this.init0(dropIfExists, resolve, reject))
}

DB.prototype.init0 = function(dropIfExists=false, resolve, reject) {
    if(dropIfExists) {
        r.dbList().contains('blog')
            .do(function(exists) {
                return r.branch(
                    exists,
                    r.dbDrop('blog'),
                    'database blog not exists yet'
                )
            }).run()
            .then(ret => r.dbCreate('blog'))
            .then(ret => r.tableCreate('posts'))
            .then(resolve, reject)
    } else {
        r.dbList().contains('blog')
            .do(function(exists) {
                return r.branch(
                    exists,
                    'database blog exists',
                    r.dbCreate("blog")
                )
            }).run()
            .then(ret => r.tableList().contains('posts')
                .do(function(exists) {
                    return r.branch(
                        exists,
                        'table posts exists',
                        r.tableCreate("posts")
                    )
                }).run())
            .then(resolve, reject)
    }
}

DB.prototype.list = function(successCallback, failureCallback) {
    successCallback = successCallback || function(value) {
        console.log(value)
    }
    failureCallback = failureCallback || function(error) {
        console.log(error)
    }

    r.table('posts').run().then(successCallback, failureCallback)
}

DB.prototype.new = function(title, content, summary, successCallback, failureCallback) {
    successCallback = successCallback || function(value) {
        console.log(value)
    }
    failureCallback = failureCallback || function(error) {
        console.log(error)
    }

    r.table('posts').insert({
        'title': title,
        'summary': summary || 'No summary',
        'content': content
    }).run().then(result => successCallback(result["generated_keys"][0]), failureCallback)
}

DB.prototype.find = function(key, successCallback, failureCallback) {
    successCallback = successCallback || function(value) {
        console.log(value)
    }
    failureCallback = failureCallback || function(error) {
        console.log(error)
    }

    r.table("posts").get(key).run().then(successCallback, failureCallback)
}

DB.prototype.delete = function(key, successCallback, failureCallback) {
    successCallback = successCallback || function(value) {
        console.log(value)
    }
    failureCallback = failureCallback || function(error) {
        console.log(error)
    }

    r.table("posts").get(key).delete().run().then(result => {
        if(result["deleted"]==1) successCallback(result)
        else failureCallback(result)
    }, failureCallback)
}

DB.prototype.update = function(key, title, content, summary, successCallback, failureCallback) {
    successCallback = successCallback || function(value) {
        console.log(value)
    }
    failureCallback = failureCallback || function(error) {
        console.log(error)
    }

    r.table("posts").get(key).update({
        'title': title,
        'summary': summary,
        'content': content
    }).run().then(result => {
        if(result["replaced"]==3) successCallback(result)
        else failureCallback(result)
    }, failureCallback)
}


module.exports = DB;