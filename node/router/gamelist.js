const express = require("express");
const router = express.Router();
// 导入数据库操作模块
const gmdb = require("../db/gamedb");
router.get("/gamelist", (req, res) => {
  const sql = "select * from gamelist";
  gmdb.query(sql, (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log(results);
    }
  });
});
