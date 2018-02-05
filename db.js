const cloneDeep = require('lodash/cloneDeep');

function DB(username='LK', password='123456') {
    this.blogs = []
    this.owner = {
        'username': username,
        'password': password
    }
}

DB.prototype.loginWith = function(username, password) {
    return username == this.owner['username'] && 
        password == this.owner['password']
}

DB.prototype.isOwner = function(username) {
    return username == this.owner['username']
}

DB.prototype.setOwner = function(username, password) {
    this.owner = {
        'username': username,
        'password': password
    }
}

DB.prototype.new = function(title, content) {
    const index = this.blogs.length.toString()
    this.blogs.push({
        'title': title,
        'content': content,
        'deleted': false,
        'id': index
    })
    return index
}

DB.prototype.list = function() {
    const blogs = cloneDeep(this.blogs)
    return blogs.filter(v => !v['deleted'])
}

DB.prototype.find0 = function(index, inc=0) {
    if(index < this.blogs.length && index >= 0) {
        const blog = this.blogs[index]
        if(!blog['deleted']) {
            return blog
        } else if(inc != 0) {
            /*
            如果指定增量，则递归查找
            （使逻辑删除后，文章的导航功能仍能正常运行）
            尾递归  
            */
            return this.find0(index+inc, inc)
        }
    }
    return false
}

DB.prototype.find = function(index, inc=0) {
    const blog = this.find0(index, inc)
    if(blog) return cloneDeep(blog)
    return false
}

DB.prototype.delete = function(index) {
    // 逻辑删除
    let blog = this.find0(index)
    if(blog) {
        blog['deleted'] = true
        return true
    }
    return false
}

DB.prototype.update = function(index, title, content) {
    let blog = this.find0(index)
    if(blog) {
        blog['title'] = title
        blog['content'] = content
        return true
    }
    return false
}

module.exports = DB;