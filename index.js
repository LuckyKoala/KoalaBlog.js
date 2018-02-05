//加载库
const cookieSession = require('cookie-session')
const express = require('express')
const nunjucks = require('nunjucks')
const marked = require('marked');
const forEach = require('lodash/forEach');
const update = require('lodash/update');
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
    res.render('list.html', {
        blogs: db.list()
    })
})
app.get('/blogs/:index(\\d+)', function (req, res) {
    const index = req.params.index
    //previous = db.find(index-1, -1)
    //next = db.find(index+1, +1)
    const blog = db.find(index)
    res.render('detail.html', {
        blog: blog
    })
    //曾出现BUG: 文章详情页渲染不了markdown文档
})

//后台

//测试 文本
const content = `
    Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor
    incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
    nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat.
    Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat
    nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in
    culpa qui officia deserunt mollit anim id est laborum.
`
db.new('第一篇博客', content)
db.new('第二篇博客', content)
db.new('第三篇博客', content)
db.new('第四篇博客', content)
db.new('第五篇博客', content)
//测试 文章更新
db.update(0, '第一篇博客', ' 编辑后的内容 ')
//测试 文章删除及其他功能对逻辑删除的支持（例如文章详情的导航）
db.delete(1)
db.delete(3)
//测试 markdown文档
db.new('Markdown文章', '[Blog](http://twodam.net) `hi`')
console.log(marked(' 编辑后的内容 '))
//监听3000端口并输出提示语句
app.listen(3000, () => console.log('Example app listening on port 3000!'))