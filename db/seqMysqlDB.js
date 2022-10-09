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