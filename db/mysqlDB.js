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

