"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
exports.getAll = async function getAll(req, res) {
    //无需鉴权
    let hotel = LoadModel("hotel");
    JsonGenerator.setRes([{ "status": 200, data: await hotel.getList() }])
    res.send(JsonGenerator.getData());
}
exports.order = async function order(req, res) {
    //无需鉴权 order应该写入数据库
    let hotel = LoadModel("hotel");
    JsonGenerator.setRes([{ "status": 200, data: {} }])
    res.send(JsonGenerator.getData());
}
exports.router = { "/hotelGetAll": exports.getAll };