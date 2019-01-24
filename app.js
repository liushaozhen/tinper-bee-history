const http = require('http');
const fs = require("fs");
const path = require('path');
const version = '1.6.9';

const callback = (err,msg)=>{
    if(err){
        console.log(`${msg}  失败`)
    }else{
        console.log(`${msg}  成功`)
    }
}

const mkdirs = function(dirpath, callback) {
    fs.exists(dirpath, function(exists) {
        if(exists) {
            callback();
        } else {
            //尝试创建父目录，然后再创建当前目录
            mkdirs(path.dirname(dirpath), function(){
                fs.mkdir(dirpath,callback);
            });
        }
    })
};

mkdirs(version);
mkdirs(`${version}/css`);

// html
http.get('http://bee.tinper.org/', function(res) {
    let html = '';
    // 获取页面数据
    res.on('data', data=> {
        html += data;
    });
    // 数据获取结束
    res.on('end', ()=>{
        html = html.replace(/href="\/css/g,`href="/tinper-bee-history/${version}/css`);
        console.log(html)
        fs.writeFile(`./${version}/index.html`, html, (err)=>{callback(err,'写入html')})
    });
}).on('error', function() {
    console.log('获取数据出错！');
});

const wirteCss = (firename)=>{
    let baseUrl = 'http://bee.tinper.org/css/';
    // css:atom-one-dark.css
    http.get(baseUrl+firename, function(res) {
        let css = '';
        // 获取页面数据
        res.on('data', function(data) {
            css += data;
        });
        // 数据获取结束
        res.on('end', function() {
            fs.writeFile(`./${version}/css/${firename}`, css, (err)=>{
                callback(err,`写入${firename}`)
            })
            
        });
    }).on('error', function() {
        console.log('获取数据出错！');
    });
}

// css
wirteCss('atom-one-dark.css');
wirteCss('layout.css');
wirteCss('md.css');
