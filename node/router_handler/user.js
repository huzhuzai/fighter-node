// 导入数据库操作模块
const db = require("../db/index");

// 导入bcryptjs包 数据加密处理
const bcrypt = require("bcryptjs");

// 导入生成token的包
const jwt = require("jsonwebtoken");
// 导入token配置文件
const config = require("../config");

// 用户注册的处理函数
exports.regUser = (req, res) => {
  // 获取客户提交到服务器的用户信息
  const userinfo = req.body;
  console.log(req.body);
  // 对表单中提交的数据进行合法性验证
  if (!userinfo.username || !userinfo.password) {
    return res.send({ status: 1, message: "用户名或密码不合法" });
  }
  // 定义SQL语句，查询用户名是否被占用
  const sqlStr = "select * from ev_users where username=?";
  db.query(sqlStr, userinfo.username, (err, results) => {
    // 执行SQL语句失败
    if (err) {
      // return res.send({ status: 1, message: err.message });
      return res.cc(err);
    }

    // 判断用户名是否呗占用
    if (results.length > 0) {
      // return res.send({ status: 1, message: "用户名被占用，请更换" });
      return res.cc("用户名被占用，请更换");
    }
    // 用户名可以使用时 调用bcrypt.hashSync(密码，长度)对密码进行加密
    userinfo.password = bcrypt.hashSync(userinfo.password, 10);

    // 定义插入的SQL语句
    const sql = "insert into ev_users set ?";
    db.query(
      sql,
      { username: userinfo.username, password: userinfo.password },
      (err, results) => {
        // 判断sql语句是否执行成功
        // if (err) return res.send({ status: 1, message: err.message });
        if (err) return res.cc(err);

        // 判断影响行数是否为1（对数据库操作了几行）
        if (results.affectedRows !== 1)
          // return res.send({ status: 1, message: "注册用户失败" });
          return res.cc("注册用户失败");

        // 注册用户成功
        // res.send({ status: 0, message: "注册成功" });
        res.cc("注册成功", 0);
      }
    );
  });

  //   res.send("reguser OK");
};

// 用户登录的处理函数
exports.login = (req, res) => {
  // 接收表单数据
  const userinfo = req.body;
  console.log(req.body);
  // 定义Sql语句
  const sql = "select * from ev_users where username=?";
  // 执行SQL语句，根据用户名查询用户的信息
  db.query(sql, userinfo.username, (err, results) => {
    console.log(results);
    // 执行SQL语句失败
    if (err) return res.cc(err);
    // 执行SQL语句成功，但获取数据条数不等于 1
    if (results.length !== 1) return res.cc("登录失败");
    // todo: 判断密码是否正确
    // bcrypt.compareSync(用户提交的密码,数据库中的密码)，使用这个方法来对比用户输入与数据库中的密码
    const compareResult = bcrypt.compareSync(
      userinfo.password,
      results[0].password
    );
    //如果对比结果为false 则证明密码输入错误
    if (!compareResult) return res.cc("登录失败");

    // todo:在服务器端生成 TOKEN 的字符串
    const user = { ...results[0], password: "", user_pic: "" };
    // 生成 Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: "10h", // token 有效期为 10 个小时
    });
    // 调用res.send() 将token响应给客户端
    res.send({
      status: 0,
      message: "登录成功",
      token: "Bearer " + tokenStr,
    });
  });
};
