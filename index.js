//加载库
const cookieSession = require('cookie-session')
const express = require('express')
const nunjucks = require('nunjucks')
const marked = require('marked');
const forEach = require('lodash/forEach')
const update = require('lodash/update')
const markdown = require('nunjucks-markdown')
//加载自定义模块
const DB = require('./db')
//创建对象
const app = express()
const db = new DB()
//配置nunjucks环境
const env = nunjucks.configure('views', {
    autoescape: true, 
    express: app
})
//配置markdown渲染器
markdown.register(env, marked);
//设置静态文件目录
app.use(express.static('static'))
//配置cookieSession
app.use(cookieSession({
    name: 'session',
    keys: ['happy coding', 'secret safe', 'under protect']
}))
//前台
app.get('/', (req, res) => {
    db.list(blogs => res.render('list.html', {
        blogs: blogs
    }), error => console.log(error))
})

app.get('/blogs/:key', function (req, res) {
    db.find(req.params.key, blog => res.render('detail.html', {
        blog: blog
    }))
})

//后台

db.reset().then(ret => {
    //测试 文本
    const content = `
        Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor
        incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
        nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat.
        Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat
        nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.
    `
    //测试 文章更新
    db.new('第一篇博客', content, 'No summary', key => db.update(key, '第一篇博客', '编辑后的内容', ' asd '))
    db.new('第二篇博客', content)
    db.new('第三篇博客', content)
    db.new('第四篇博客', content)
    db.new('第五篇博客', content)
    //测试 文章删除及其他功能对逻辑删除的支持（例如文章详情的导航）
    //db.delete(1)
    //db.delete(3)
    //测试 markdown文档
    db.new('Markdown文章', '[Blog](http://twodam.net) `hi`')

    //监听3000端口并输出提示语句
    app.listen(3000, () => console.log('Example app listening on port 3000!'))
}).catch(err => console.log(err))