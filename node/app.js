// 导入express
const express = require("express");
// 创建 express 的服务器实例
const app = express();
const joi = require("joi");

app.use(express.static("./public"));
// 导入配置跨域中间件
const cors = require("cors");
app.use(cors());

// 配置解析表单数据的中间件,这个中间件只能解析application/x-www-form-urlencoded格式的数据
app.use(express.urlencoded({ extended: false }));

// 在路由之前，封装res.cc函数
app.use((req, res, next) => {
  // status 默认值为 1 表示失败    err 的值，可能是错误对象，也可能是错误描述字符串
  res.cc = function (err, status = 1) {
    res.send({ status, message: err instanceof Error ? err.message : err });
  };
  next();
});

// 在路由之前配置解析token的中间件
const expressJWT = require("express-jwt");
const config = require("./config");

// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(
  expressJWT({ secret: config.jwtSecretKey }).unless({
    path: /^[\/api]|[\/static]/,
  })
);

// 导入并使用用户路由模块
const userRouter = require("./router/user");
app.use("/api", userRouter);
// 导入并使用用户信息路由模块
const userInfoRouter = require("./router/userinfo");
app.use("/my", userInfoRouter);

// 定义错误级别的中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err);
  // 身份认证失败错误
  if (err.name == "UnauthorizedError") return res.cc("身份认证失败");
  // 未知错误
  res.cc(err);
});

// 调用 app.listen 方法，启动服务
app.listen(3001, function () {
  console.log("api server running at http://127.0.0.1:3001");
});
