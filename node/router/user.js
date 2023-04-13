const express = require("express");
const router = express.Router();

// 导入用户路由处理函数对应的模块
const user_handler = require("../router_handler/user");

// 1. 导入验证表单数据的中间件
const expressJoi = require("@escook/express-joi");
// 2. 导入需要的验证规则对象
const { reg_login_schema } = require("../schema/user");

// 注册新用户
router.post("/reguser", expressJoi(reg_login_schema), user_handler.regUser);
// 登录
router.post("/login", expressJoi(reg_login_schema), user_handler.login);
// 获取用户基本信息

// ------- 下面是配置的游戏列表路由部分，懒得往下细分模块了 -----------
// 导入数据库操作模块
const gmdb = require("../db/gamedb");
// 获取所有游戏栏目数据
router.get("/gamelist", (req, res) => {
  const sql = "select * from gamelist";
  gmdb.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      res.send({ status: 0, data: results });
    }
  });
});

// ------- 搜索接口部分----------------------------------------------
router.get("/serch", (req, res) => {
  let gn = req.query.gamename;

  const sql = `select * from gamelist where gamename="${gn}"`;
  const gm = req.body.gamename;

  gmdb.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
      res.send({ status: 0, data: results });
    }
  });
});

// 共享router对象出去
module.exports = router;
