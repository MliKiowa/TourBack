// 快速加载类 
"use strict";
const glob = require('glob');
const path = require('path');
function autoLoad(router, root) {
    glob.sync(`${root}/*.js`).forEach((file) => {
        // 未安全化参数请注意安全性
        let category = file.split(path.sep)[1].split(".")[0];
        let controller = require(path.join(path.dirname(root), file));

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

