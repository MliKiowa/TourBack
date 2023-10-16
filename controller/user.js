"use strict";
let user = LoadModel("user");
let JsonGenerator = LoadModel("JsonGenerator");
//引入基础组件
exports.login = async function login(req, res) {
    let tokenGenerate = LoadModel("token");
    const [id, password] = getParamsArray(req, ["id", "password"]);
    if (Number(id) == !Number(id) || password == undefined) {
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查账号或密码是否为空" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    if (!await user.getUserAuth(id, password)) {
        JsonGenerator.setRes([{ "status": -1 }, { data: { message: "请检查账号或密码是否错误" } }]);
    } else {
        //3600000 = 1H
        JsonGenerator.setRes([{ "status": 200 }, { data: [{ message: "登录成功", token: tokenGenerate.generate(Number(id), 3600000) }] }]);
    }
    res.send(JsonGenerator.getData());
}
exports.info = async function info(req, res) {
    // 已优化版本
    let [result, id] = await user.isAuthJson(req, res);
    if (!result) return;
    let jsondata = await user.getUserInfoByID(id);
    JsonGenerator.setRes([{ "status": (jsondata == 'undefined' ? -1 : 200) }, { result: jsondata }]);
    res.send(JsonGenerator.getData());
}
exports.reg = async function regUser(req, res) {
    //(SELECT MAX(id) FROM user) + 1 计算当前ID
    let tokenGenerate = LoadModel("token");
    let regId = await user.getCurrentId() + 1;
    const [username, password] = getParamsArray(req, ["username", "password"]);
    if (username == undefined || password == undefined) {
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查账号名或密码是否为空" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    if (username.length == 0 || password.length <= 6) {
        JsonGenerator.setRes([{ "status": -3 }, { data: { message: "请检查账号名与密码长度是否合法" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    const [_, code] = await user.regUser(regId, username, password, 0);
    console.log(code);
    if (code < 0) {
        JsonGenerator.setRes([{ "status": code }, { data: { message: "账号注册失败,数据写入失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { data: { message: "账号注册成功", id: regId, username: username, token: tokenGenerate.generate(regId, 0, 3600000) } }]);
    // 注册赋予登录
    res.send(JsonGenerator.getData());
}

exports.router = { "/userlogin": exports.login, "/userinfo": exports.info, "/reg": exports.reg };