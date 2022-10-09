const router = require('koa-router')()
const DB = require('../db/mysqlDB');

router.prefix('/users')

router.get('/userList', async function (ctx, next) {
  const sql = "select * from t_jxgl_user ";
  let results = await DB.query(sql);
  console.log(results);
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000'); //配置跨域资源共享
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.body = results;
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
