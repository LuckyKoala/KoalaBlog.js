//加载库
const cookieSession = require('cookie-session')
const express = require('express')
const router = express.Router();
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
//body-parser
app.use(express.json())
//配置cookieSession
app.use(cookieSession({
    name: 'session',
    keys: ['happy coding', 'secret safe', 'under protect']
}))
//前台
app.get('/', (req, res) => {
    db.list()
        .then(blogs => res.render('list.html', {
            blogs: blogs
        }))
        .catch(console.log)
})

app.get('/blogs/:key', function (req, res) {
    db.find(req.params.key)
        .then(blog => res.render('detail.html', {
            blog: blog
        }))
        .catch(console.log)
})

/*
app.get('/user/login', function(req, res) {
    return res.render('login.html')
})

app.get('/user/logout', function(req, res) {
    req.session.username = null
    return res.redirect('/')
})
*/

app.get('/manage/blogs', function(req, res) {
    return res.render('manage_blog.html')
})

app.get('/manage/blogs/new', function(req, res) {
    return res.render('edit_blog.html', {
        id: '',
        action: '/api/blogs',
        method: 'POST'
    })
})

app.get('/manage/blogs/update/:blog_key', function(req, res) {
    return res.render('edit_blog.html', {
        id: req.params.blog_key,
        action: '/api/blogs/'+req.params.blog_key,
        method: 'POST'
    })
})

//后台(API)

/*
router.param('blog_key', function(req, res, next, key) {
    db.find(req.params.key)
        .then(blog => {
            req.blog = blog
            next()
        })
        .catch(console.log)
});
*/

app.get('/api', function(req, res) {
    return res.json({
        "create_blog": {
            "url": "/api/blogs",
            "method": "POST"
        },
        "list_blogs": {
            "url": "/api/blogs",
            "method": "GET"
        },
        "blog_detail": {
            "url": "/api/blogs/:blog_key",
            "method": "GET"
        },
        "delete_blogs": {
            "url": "/api/blogs/:blog_key",
            "method": "DELETE"
        },
        "update_blogs": {
            "url": "/api/blogs",
            "method": "POST"
        }
    })
})
  
router.route('/api/blogs/:blog_key')
    .all(function(req, res, next) {
        next();
    })
    .get(function(req, res, next) {
        db.find(req.params.key)
            .then(blog => res.json(blog))
            .catch(any => res.json({'error': 'Blog not exists'}))
    })
    .post(function(req, res, next) {
        db.update(req.params.key, req.body)
            .then(any => res.json({
                'message': 'Blog updated',
                'key': req.params.key
            }))
            //FIXME potential repressed the real error
            .catch(any => res.json({'error': 'Not Found'}))
    })
    .delete(function(req, res, next) {
        db.delete(req.params.key)
            .then(any => res.json({'message': 'Blog deleted'}))
            .catch(any => res.json({'error': 'Not Found'}))
    })
    .put(function(req, res, next) {
        next(new Error('not implemented'))
    });

router.route('/api/blogs')
    .all(function(req, res, next) {
        next();
    })
    .get(function(req, res, next) {
        db.list()
            .then(blogs => res.json(blogs))
            .catch(console.log)
    })
    .post(function(req, res, next) {
        db.new(req.body)
            .then(key => res.json({
                'message': 'New blog created',
                'key': key
            }))
            //FIXME potential repressed the real error
            .catch(any => res.json({'error': 'Not Found'}))
    })
    .delete(function(req, res, next) {
        //TODO maybe delete all posts
        next(new Error('not implemented'))
    })
    .put(function(req, res, next) {
        next(new Error('not implemented'))
    });    


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
    db.new({
        title: '第一篇博客', 
        content: content,
        summary: 'No summary'
    }).then(key => db.update(key, {
        title: '第一篇博客', 
        content: '编辑后的内容',
        summary: 'No summary'
    }))
    db.new({
        title: '第二篇博客', 
        content: content
    }).then(key => db.delete(key)) //测试 文章删除
    db.new({
        title: '第三篇博客', 
        content: content
    })
    db.new({
        title: '第四篇博客', 
        content: content
    })
    db.new({
        title: '第五篇博客', 
        content: content
    })
    //测试 markdown文档
    db.new({
        title: 'Markdown文章', 
        content: '[Blog](http://twodam.net) `hi`'
    })

    //监听3000端口并输出提示语句
    app.listen(3000, () => console.log('Example app listening on port 3000!'))
}).catch(err => console.log(err))