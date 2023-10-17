"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
let commentModel = LoadModel("comment");
let userModel = LoadModel("user");
exports.getCommentAll = async function getCommentAll(req, res) {
    let [type, id] = getParamsArray(req, ["type", "id"]);
    type = Number(type);
    let fromid = Number(id);
    if (type !== type || fromid !== fromid || type < 0 || id < 0) {
        //参数异常
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数是否正确" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    const [result, data] = await commentModel.getCommentAll(type, fromid);
    if (!result) {
        JsonGenerator.setRes([{ "status": -3 }, { data: { message: "读取数据失败" } }]);
        res.send(JsonGenerator.getData(type, fromid));
        return;
    }
    JsonGenerator.setRes([{ "status": -3 }, { data: data }]);
    res.send(JsonGenerator.getData());
}
exports.getCommentByID = async function getCommentByID(req, res) {
    let [id] = getParamsArray(req, ["id"]);
    id = Number(id);
    if (id == undefined || id !== id || id == 0) {
        JsonGenerator.setRes([{ "status": -1 }, { data: { message: "活动ID输入错误" } }])
        res.send(JsonGenerator.getData());
        return;
    }
    let [ret, data] = await commentModel.getCommentByID(id);
    if (!ret) data = {};
    JsonGenerator.setRes([{ "status": 200, data: data }])
    res.send(JsonGenerator.getData());
}
exports.pushComment = async function pushComment(req, res) {
    let [result, userid] = await userModel.isAuthJson(req, res);
    if (!result) return;
    let data;

    let [type, id, content] = getParamsArray(req, ["type", "id", "content"]);
    // 验证权限 获取参数
    type = Number(type);
    id = Number(id);//特指fromid 区别userid
    if (type !== type || id !== id || type < 0 || id < 0 || content == undefined || toString(content).length == 0) {
        //参数异常
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数是否正确" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    // pushComment 写入数据
    let [ret, code] = await commentModel.pushComment(userid, content, type, id);
    // 覆盖
    if (!ret) {
        JsonGenerator.setRes([{ "status": code }, { data: { message: "数据写入失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { data: { message: "评论成功" } }]);
    res.send(JsonGenerator.getData());
}
exports.delComment = async function delComment(req, res) {
    //管理员删除判断未完成
    let [result, userid] = await userModel.isAuthJson(req, res);
    if (!result) return;
    let [id] = getParamsArray(req, ["id"]);
    //验证登录权限 获取参数
    //验证评论归属权
    id = Number(id);
    if (id !== id || id < 0) {
        //参数异常
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数是否正确" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    let commentUserid = await commentModel.getCommentByID(id);
    if (!commentUserid[0]) {
        JsonGenerator.setRes([{ "status": -106 }, { data: { message: "信息读取失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    console.log(userid,commentUserid[1].userid);
    if (userid !== Number(userid,commentUserid[1].userid)) {
        JsonGenerator.setRes([{ "status": -107 }, { data: { message: "你无权删除" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    let [retbool, retcode] = await commentModel.delCommentByID(id);
    if (!retbool) {
        JsonGenerator.setRes([{ "status": retcode }, { data: { message: "评论删除失败或者你无权删除" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { data: { message: "评论删除成功" } }]);
    res.send(JsonGenerator.getData());
}
exports.router = { "/getCommentAll": exports.getCommentAll, "/getCommentByID": exports.getCommentByID, "/pushComment": exports.pushComment, "/delComment": exports.delComment };
