"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
let commentModel = LoadModel("comment");
exports.getCommentAll = async function love(req, res) {
    //无需权限
}
exports.pushComment = async function pushComment(req, res) {
    let [result, userid] = await user.isAuthJson(req, res);
    if (!result) return;
    const [type,id] = getParamsArray(req, ["type","id","content"]);
    //验证权限 获取参数
    return;
}
exports.delComment = async function delComment(req, res) {
    let [result, userid] = await user.isAuthJson(req, res);
    if (!result) return;
    const [type,id] = getParamsArray(req, ["type","id"]);
    //验证登录权限 获取参数
    //验证评论归属权
    return;
}
exports.router = { "getCommentAll": exports.getCommentAll, "pushComment": exports.pushComment, "delComment": exports.delComment };
