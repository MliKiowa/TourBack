"use strict";

let userModel = LoadModel("user");
let JsonGenerator = LoadModel("JsonGenerator");
let hotel = LoadModel("hotel");

exports.hotelGetAll = async function hotelGetAll(req, res) {
    //无需鉴权
    JsonGenerator.setRes([{ "status": 200, data: await hotel.hotelGetAll() }])
    res.send(JsonGenerator.getData());
}
exports.orderSet = async function orderSet(req, res) {
    let [result, userid] = await userModel.isAuthJson(req, res);
    if (!result) return;
    //权限验证完成
    let [id] = getParamsArray(req, ["id"]);
    id = Number(id);
    if (id !== id || id < 1) {
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    const [retresult, retdata] = await hotel.orderSet(userid, id);
    if (!retresult) {
        JsonGenerator.setRes([{ "status": -3 }, { data: { message: "数据写入失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200, data: { message: "预定成功" } }])
    res.send(JsonGenerator.getData());
}
exports.orderCancel = async function orderSet(req, res) {
    let [result, userid] = await userModel.isAuthJson(req, res);
    if (!result) return;
    //权限验证完成
    const [retresult, retdata] = await hotel.orderCancel(userid);
    if (!retresult) {
        JsonGenerator.setRes([{ "status": -3 }, { data: { message: "数据写入失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200, data: { message: "预定取消成功" } }])
    res.send(JsonGenerator.getData());
}
exports.orderGet = async function orderSet(req, res) {
    let [result, userid] = await userModel.isAuthJson(req, res);
    if (!result) return;
    //权限验证完成
    let [ret, data] = await hotel.orderGet(userid);
    if(!ret){
        JsonGenerator.setRes([{ "status": -3 }, { data: { message: "数据写入失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200, data: data }])
    res.send(JsonGenerator.getData());
}
exports.router = { "/hotelGetAll": exports.hotelGetAll, "/orderSet": exports.orderSet, "/orderCancel": exports.orderCancel, "/orderGet": exports.orderGet };