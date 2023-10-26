"use strict";
let path = require('path');
let express = require('express')
let routes = express.Router();
let autoload = require("./autoload");
autoload(routes,path.join(ProjectPath, "controller"));
//API Routers 自动加载

module.exports = routes;
