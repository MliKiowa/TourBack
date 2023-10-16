"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
let hotel = LoadModel("hotel");

exports.getAll = async function getAll(req, res) {
    //无需鉴权
    JsonGenerator.setRes([{ "status": 200, data: await hotel.getList() }])
    res.send(JsonGenerator.getData());
}
exports.order = async function order(req, res) {
    let [result, userid] = await user.isAuthJson(req, res);
    if (!result) return;
    //权限验证完成
    JsonGenerator.setRes([{ "status": 200, data: {} }])
    res.send(JsonGenerator.getData());
}
exports.router = { "/hotelGetAll": exports.getAll };