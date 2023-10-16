"use strict";
global.ProjectPath = __dirname;
require("./model/helper");

let express = require("express");
let app = express();
//解析Post请求
app.use(require("body-parser").urlencoded({ extended: false }));
//后期改造restful风格
global.Db = LoadModel("SQLite","db.db");
let routerApi = require("./router/index");

app.use("/api", routerApi);
app.listen(3000);
