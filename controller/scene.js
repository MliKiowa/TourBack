"use strict";

let userModel = LoadModel("user");
let JsonGenerator = LoadModel("JsonGenerator");
let sceneModel = LoadModel("scene");

exports.sceneGetAll = async function sceneGetAll(req, res) {
    // 无需鉴权
    JsonGenerator.setRes([{ "status": 200, data: await sceneModel.sceneGetAll() }])
    res.send(JsonGenerator.getData());
}
exports.sceneLove = async function sceneLove(req, res) {
    let [result, data] = await userModel.isAuthJson(req, res);
    if (!result) return;
    let [id] = getParamsArray(req, ["id"]);
    id = Number(id);
    if (id == undefined || id !== id || id == 0) {
        JsonGenerator.setRes([{ "status": -1 }, { data: { message: "活动ID输入错误" } }])
        res.send(JsonGenerator.getData());
        return;
    }
    if (!sceneModel.sceneLove(id)) {
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "数据写入异常" } }])
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { message: "点赞成功" }])
    res.send(JsonGenerator.getData());
}
exports.router = { "/sceneGetAll": exports.sceneGetAll,"/sceneLove": exports.sceneLove };