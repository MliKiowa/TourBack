"use strict";
let user = LoadModel("user");
let JsonGenerator = LoadModel("JsonGenerator");
//引入基础组件
exports.userLogin = async function login(req, res) {
    let tokenGenerate = LoadModel("token");
    let [id, username, password] = getParamsArray(req, ["id", "username", "password"]);
    if (password == undefined) {
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "密码是否为空" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    let userInfo;
    //优先使用username 其次useid
    if (typeof (username) !== "undefined" && toString(username).length > 0) {
        if (!await user.getUserAuthByName(username, password)) {
            JsonGenerator.setRes([{ "status": -1 }, { data: { message: "请检查账号或密码是否错误" } }]);
            res.send(JsonGenerator.getData());
            return;
        }
        userInfo = await user.getUserInfoByName(username);
        console.log(userInfo);
        id = userInfo[1].id;
    } else {
        //默认逻辑
        if (id !== id && id > 0 || !await user.getUserAuth(id, password)) {
            JsonGenerator.setRes([{ "status": -1 }, { data: { message: "请检查账号或密码是否错误" } }]);
            res.send(JsonGenerator.getData());
            return;
        }
        userInfo = await user.getUserInfoByID(id);
    }



    console.log(userInfo);
    if (userInfo[0]) {
        JsonGenerator.setRes([{ "status": 200 }, { data: [{ message: "登录成功", token: tokenGenerate.generate(Number(id), 3600000, userInfo[1].auth) }] }]);
    } else {
        JsonGenerator.setRes([{ "status": -1 }, { data: { message: "数据库缺少用户信息" } }]);
    }

    res.send(JsonGenerator.getData());
}
exports.userInfo = async function userInfo(req, res) {
    // 已优化版本
    let [result, id] = await user.isAuthJson(req, res);
    if (!result) return;
    let [ret, jsondata] = await user.getUserInfoByID(id);
    if (!ret) {
        JsonGenerator.setRes([{ "status": -7 }, { data: { message: "数据处理失败或者用户不存在" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": (jsondata == 'undefined' ? ret : 200) }, { data: jsondata }]);
    res.send(JsonGenerator.getData());
    return;
}
exports.userInfoByID = async function userInfoByID(req, res) {
    // 已优化版本
    let [id] = getParamsArray(req, ["id"]);
    id = Number(id);
    if (id !== id || id < 1) {
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    let [ret, jsondata] = await user.getUserInfoByID(id);
    if (!ret) {
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "数据处理失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": (jsondata == 'undefined' ? ret : 200) }, { data: jsondata }]);
    res.send(JsonGenerator.getData());
}
exports.userReg = async function userReg(req, res) {
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
        if (code == -77) {
            JsonGenerator.setRes([{ "status": code }, { data: { message: "账号注册失败,该昵称已经存在" } }]);
            res.send(JsonGenerator.getData());
            return;
        } else {
            JsonGenerator.setRes([{ "status": code }, { data: { message: "账号注册失败,数据写入失败" } }]);
            res.send(JsonGenerator.getData());
            return;
        }

    }
    JsonGenerator.setRes([{ "status": 200 }, { data: { message: "账号注册成功", id: regId, username: username, token: tokenGenerate.generate(regId, 3600000, 0) } }]);
    // 注册赋予登录
    res.send(JsonGenerator.getData());
}

exports.router = { "/userLogin": exports.userLogin, "/userInfo": exports.userInfo, "/userReg": exports.userReg, "/userGetInfo/:id": exports.userInfoByID };