"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
let notice = LoadModel("notice");
exports.noticeGetAll = async function noticeGetAll(req, res) {
    //无需鉴权
    let notice = LoadModel("notice");
    JsonGenerator.setRes([{ "status": 200, data: await notice.noticeGetAll() }])
    res.send(JsonGenerator.getData());
}
exports.noticePush = async function noticePush(req, res) {
    let [result, ret] = await user.isAuthJsonByGroup(req, res, 1);
    if (!result) return;

    let data = getParamsArray(req, ["anthor", "message", "endtime"]);
    // 以下处理参数
    for (var key in data) {
        if (data[key] == undefined || toString(data[key]).length == 0) {
            JsonGenerator.setRes([{ "status": -3 }, { data: { message: "参数获取失败" } }]);
            res.send(JsonGenerator.getData());
            return;
        }
    }
    const [retresult, retdata] = notice.noticePush(...data);
    if (!retresult) {
        JsonGenerator.setRes([{ "status": retdata }, { data: { message: "数据写入失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { data: { message: "公告添加成功" } }]);
    res.send(JsonGenerator.getData());
}
exports.router = { "/noticeGetAll": exports.noticePush, "/noticePush": exports.noticePush };