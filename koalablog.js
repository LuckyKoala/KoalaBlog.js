#!/usr/bin/env node
//加载库
const express = require('express');
const router = express.Router();
const nunjucks = require('nunjucks');
const marked = require('marked');
const markdown = require('nunjucks-markdown');
const request = require('request');
//创建对象
const app = express();
//配置nunjucks环境
const env = nunjucks.configure('views', {
    autoescape: true,
    express: app
});
//配置markdown渲染器
markdown.register(env, marked);
//设置静态文件目录
app.use(express.static('static'));
//body-parser
app.use(express.json());

//加载命令行参数
const optionDefinitions = [
  { name: 'port', alias: 'p', type: Number, defaultValue: 3001 },
];
const options = require('command-line-args')(optionDefinitions);

function getJson(url, callback) {
    request(url, function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        if(!error && response.statusCode == 200) {
            callback(JSON.parse(body));
        } else {
            res.send('Error');
        }
    });
}

const apiPrefix = 'http://localhost:3000';

//前台
app.get('/', (req, res) => {
    getJson(apiPrefix+'/api/blogs', (blogs) => res.render('list.html', { blogs }));
});

app.get('/blogs/:key', function (req, res) {
    getJson(apiPrefix+'/api/blogs/'+req.params.key, (blog) => res.render('detail.html', { blog }));
});

app.get('/manage/blogs', function(req, res) {
    return res.render('manage_blog.html');
});

app.get('/manage/blogs/new', function(req, res) {
    return res.render('edit_blog.html', {
        id: '',
        action: apiPrefix+'/api/blogs'
    });
});

app.get('/manage/blogs/update/:key', function(req, res) {
    return res.render('edit_blog.html', {
        id: req.params.key,
        action: apiPrefix+'/api/blogs/'+req.params.key
    });
});

//监听指定端口并输出提示语句
app.listen(options['port'], () => console.log(`Example app listening on \
    port ${options['port']}! \nPress Ctrl+C to stop the program.` ));
