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
