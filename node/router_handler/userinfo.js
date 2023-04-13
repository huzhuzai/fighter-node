// 导入数据库操作模块
const db = require("../db/index");

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 定义查询用户信息的SQL语句
  const sql = `select id,username from ev_users where id=?`;
  // res.send(req._parsedOriginalUrl);
  // 调用db.query() 执行SQL语句
  db.query(sql, 1, (err, results) => {
    // 1. 执行 SQL 语句失败
    if (err) return res.cc(err);

    // 2. 执行 SQL 语句成功，但是查询到的数据条数不等于 1
    if (results.length !== 1) return res.cc("获取用户信息失败！");

    // 3. 将用户信息响应给客户端
    res.send({
      status: 0,
      message: "获取用户基本信息成功！",
      data: results[0],
    });
  });
};
