# node-demo
1. 安装koa脚手架—koa-generator

    npm install -g koa-generator
2. 创建koa2项目

    koa2 -e node-demo

      -e 代表使用ejs模板创建工程 

      node-demo 工程名称
3. 进入工程

    cd node-demo 
4. 安装依赖

    npm i
5. 启动项目

    npm start
6. 访问浏览器

    http:localhost:3000
7. 目录结构

```JavaScript
.
+-- bin
|   +-- www               // 项目启动必备文件,配置端口等服务信息
+-- db
|   +-- config.js         // 数据库配置信息
|   +-- seqMysqlDB.js     // sequelize 链接数据库的配置（myslq配置方式一）
|   +-- mysqlDB.js        // mysql基本配置（mysql配置方式二）
+-- models
|   +-- User.js           // User实例
+-- node_modules          // 项目依赖，安装的所有模块都会在这个文件夹下
+-- public                // 存放静态文件，如样式、图片等
|   +-- images            // 图片
|   +-- javascript        // js文件
|   +-- stylesheets       // 样式文件
+-- routers               // 存放路由文件，如果前后端分离的话只用来书写api接口使用
|   +-- index.js
|   +-- userBase.js       // 使用mysql方式二的路由的方式
|   +-- userUpgrade.js    // 使用mysql方式一的路由的方式
+-- views                 // 存放存放模板文件，就是前端页面，如果后台只是提供api的话，这个就是备用
|   +-- error.ejs
|   +-- index.ejs
+-- app.js                // 主入口文件
+-- package.json          // 存储项目名、描述、作者、依赖等等信息
+-- package-lock.json     // 存储项目依赖的版本信息，确保项目内的每个人安装的版本一致

```

---

8. 链接mysql数据库

```JavaScript
npm install mysql2 sequelize --save
```

9. 安装koa2-cors 跨域包

```JavaScript
npm install koa-cors --save
```

10. db包：

- config.js

```JavaScript
const config = {
    host: '127.0.0.1',
    username: 'root',
    password: '123456',
    database: 'test1',
    port: 3306
}

module.exports = config
```
- mysqlDB.js

```JavaScript
const mysql = require('mysql')

// 创建数据池
// const pool = mysql.createPool({
//     host: '127.0.0.1',
//     user: 'root',
//     password: '123456',
//     database: 'jxgl'
// })

// // 在数据池中进行会话操作
// pool.getConnection(function(err,connection){

//     connection.query('select * from t_jxgl_user',(error,results,fields)=>{
//         // 结束会话
//         connection.release();
//         // 如果有错误就抛出
//         if (error) throw error;
//     })

// })

function _connection(){
    let connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database: 'jxgl'
    })
    
    connection.connect();
    return connection;
}

exports.query = function(sql,params = null){
    let connection = _connection();
    return new Promise(function(resolve,reject){
        connection.query(sql,params,function(error,results,fields){
            if (error) throw error;
            resolve(results);
        });

        connection.end();
    })
}


```
- seqMysqlDB.js

```JavaScript
const Sequelize = require('sequelize');
const config = require('./config')

console.log('init sequelize...');

const sequelize = new Sequelize(config.database,config.username,config.password,{
    host: config.host, // 数据库地址
    dialect: 'mysql', // 指定数据库类型
    pool:{
        max:5, // 最大连接数量
        min:0, // 最小连接数量
        idle:10000 // 如果一个线程10s内没有被使用过的话就释放
    },
    logging: true // 显示log
})

//对连接进行测试，查看控制台
//  sequelize
//     .authenticate()
//     .then(() => {
//         console.log('******Connection has been established successfully.********');
//         console.log('******测试结束，即将退出！！！********');
//         process.exit(); //结束进程
//     })
//     .catch(err => {
//         console.error('***************Unable to connect to the database:***********', err);
//     }); 

module.exports = sequelize;
```

11. models包

User.js实例

```JavaScript
const Sequelize = require("sequelize");
const sequelize = require('../db/seqMysqlDB');

const User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING(100),
        unique: true
    },
    password: Sequelize.STRING(100),
},
{
  freezeTableName: false,
  timestamps: true
});
//timestamp字段，默认为true，表示数据库中是否会自动更新createdAt和updatedAt字段，false表示不会增加这个字段。
//freezeTableName,默认为true,会自动给表名表示为复数: user => users，为false则表示，使用我设置的表名


//创建表，默认是false，true则是删除原有表，再创建
User.sync({
    force: false,
});

module.exports = User;

```

12. /routes/userDemo.js

```JavaScript
const model = require("./model");
const Router = require("koa-router");
let router = new Router();
router.prefix('/userDemo')
let User = model.User; //获取User模型

router.get('/', async (ctx) => {
    ctx.body = '欢迎来到用户首页！'
});
//注册页
router.get('/registerPage', async (ctx) => {
    let html = `
            <div>
                <h1>Hello,Koa2! request POST</h1>
                <h2>注册页！！！</h2>
                <form method="POST"  action="/userDemo/register">
                    <p>username:</p>
                    <input name="username" /> <br/>
                    <p>password:</p>
                    <input name="password" /> <br/>
                    <button type="submit">submit</button>
                </form>
            </div>
        `;
    ctx.body = html;
});
//注册
router.post('/register', async (ctx) => {
    let registerUser = ctx.request.body;
    console.log(User)
    
    await User.create({
            username: registerUser.username,
            password: registerUser.password
        })
        .then((result) => {
            ctx.body = {
                code: 200,
                msg: '注册成功!',
                message: result
            }
        })
        .catch(err => {
            ctx.body = {
                code: 500,
                msg: '注册失败！',
                message: err
            }
        })
});
//登录页
router.get('/loginPage', async (ctx) => {
    let html = `
            <div>
                <h1>Hello,Koa2! request POST</h1>
                <h2>页！！！</h2>
                <form method="POST"  action="/userDemo/login">
                    <p>username:</p>
                    <input name="username" /> <br/>
                    <p>password:</p>
                    <input name="password" /> <br/>
                    <button type="submit">submit</button>
                </form>
            </div>
        `;
    ctx.body = html;
});
//登录
router.post('/login', async (ctx) => {
    let loginUser = ctx.request.body;
    //数据库查询
    await User.findOne({
            where: {
                username: loginUser.username,
            }
        })
        //查询值传入
        .then(async (result) => {
            //判断密码是否一致
            if (result && (result.password === loginUser.password)) {
                ctx.body = {
                    code: 200,
                    message: '登录成功',
                };
            } else {
                ctx.body = {
                    code: 500,
                    message: '用户名不存在',
                };
            }
        })
        .catch(err => {
            //findOne行为发生错误时
            ctx.body = {
                code: 500,
                message: '登录出错！',
                data: err
            };
        })

});


//查找所有
router.get('/allUser', async (ctx) => {
    try {
        let result = await User.findAll();
        if (result) {
            ctx.body = {
                code: 200,
                message: result
            }
        } else {
            ctx.body = {
                code: 500,
                message: '表中没有数据!',
            };
        }
    } catch (error) {
        ctx.body = {
            code: 500,
            message: '错误',
            data: err
        };
    }

})


module.exports = router;

```

13. app.js修改

```JavaScript
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')
const Router = require('koa-router')
const index = require('./routes/index')
const users = require('./routes/users-old')
const user = require("./routes/userDemo.js");

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})



// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(user.routes(),user.allowedMethods()) // 新增

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

// 设置跨域
app.use(cors());
module.exports = app

```

14. 运行
http://localhost:3000/userDemo/registerPage

提交submit后自动跳转http://localhost:3000/userDemo/register

进入登录页
http://localhost:3000/userDemo/loginPage

提交submit后自动跳转http://localhost:3000/userDemo/login

本项目参考博文：https://blog.csdn.net/where_slr/article/details/100580730

