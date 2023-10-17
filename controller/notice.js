"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
let notice = LoadModel("notice");
let userModel = LoadModel("user");
exports.noticeGetAll = async function noticeGetAll(req, res) {
    //无需鉴权
    let notice = LoadModel("notice");
    JsonGenerator.setRes([{ "status": 200, data: await notice.noticeGetAll() }])
    res.send(JsonGenerator.getData());
}
exports.noticeGetByID = async function noticeGetByID(req, res) {
    let [id] = getParamsArray(req, ["id"]);
    id = Number(id);
    if (id == undefined || id !== id || id == 0) {
        JsonGenerator.setRes([{ "status": -1 }, { data: { message: "活动ID输入错误" } }])
        res.send(JsonGenerator.getData());
        return;
    }
    let [ret, data] = await notice.noticeGetByID(id);
    if (!ret) {
        JsonGenerator.setRes([{ "status": data, data: { message: "数据读取失败" } }])
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200, data: data }])
    res.send(JsonGenerator.getData());
}
exports.noticePush = async function noticePush(req, res) {
    let [result, ret] = await userModel.isAuthJsonByGroup(req, res, 1);
    if (!result) return;

    let data = getParamsArray(req, ["message", "endtime"]);
    // 以下处理参数
    for (var key in data) {
        if (data[key] == undefined || toString(data[key]).length == 0) {
            JsonGenerator.setRes([{ "status": -3 }, { data: { message: "参数获取失败" } }]);
            res.send(JsonGenerator.getData());
            return;
        }
    }
    const [retresult, retdata] = await notice.noticePush(ret.id,data[0],data[1]);
    if (!retresult) {
        JsonGenerator.setRes([{ "status": retdata }, { data: { message: "数据写入失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { data: { message: "公告添加成功" } }]);
    res.send(JsonGenerator.getData());
}
exports.router = { "/noticeGetAll": exports.noticeGetAll, "/noticeGetByID": exports.noticeGetByID, "/noticePush": exports.noticePush };