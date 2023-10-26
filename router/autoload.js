// 快速加载类 
/*
"use strict";
const glob = require('glob');
const path = require('path');
function autoLoad(router, root) {
    glob.sync(`${root}/*.js`).forEach((file) => {
        // 未安全化参数请注意安全性
        let category = file.split(path.sep)[1].split(".")[0];
        let controller = require(path.join(path.dirname(root), 'controller' + path.sep + category));

        let routerTable = controller.router;//获取路由配置表
        let methods = Object.keys(routerTable);//配置表KEY导出

        function applyMethod(name, body) {
            router.use(name, body);
        }
        methods.forEach(function (methodName) {
            let methodBody = routerTable[methodName]; //获取处理函数
            applyMethod(methodName, methodBody);//绑定路由
        });

    });
}
module.exports = autoLoad;
*/
///www/server/nodejs/v20.0.0/bin/node app.js
// 快速加载类 
"use strict";
const glob = require('glob');
const path = require('path');
function autoLoad(router, root) {
    glob.sync(`${root}/*.js`).forEach((file) => {
        // 未安全化参数请注意安全性
        //console.log(file.split(path.sep));
        let categoryinit = file.split(path.sep);
        //console.log(categoryinit,categoryinit.length);
        let category = categoryinit[categoryinit.length-1].split(".")[0];
        console.log(category);
        let controller = require(path.join(path.dirname(root), 'controller' + path.sep + category));

        let routerTable = controller.router;//获取路由配置表
        let methods = Object.keys(routerTable);//配置表KEY导出

        function applyMethod(name, body) {
            router.use(name, body);
        }
        methods.forEach(function (methodName) {
            let methodBody = routerTable[methodName]; //获取处理函数
            applyMethod(methodName, methodBody);//绑定路由
        });

    });
}
module.exports = autoLoad;