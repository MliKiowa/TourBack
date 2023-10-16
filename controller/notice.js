"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
exports.getAll = async function getAll(req, res) {
    //无需鉴权
    let notice = LoadModel("notice");
    JsonGenerator.setRes([{ "status": 200, data: await notice.getList() }])
    res.send(JsonGenerator.getData());
}
exports.router = { "/noticeGetAll": exports.getAll };