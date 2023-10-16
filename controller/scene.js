"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
exports.getAll = async function getAll(req, res) {
    // 无需鉴权
    let scene = LoadModel("scene");
    JsonGenerator.setRes([{ "status": 200, data: await scene.getList() }])
    res.send(JsonGenerator.getData());
}
exports.love = async function love(req, res) {
    let scene = LoadModel("scene");
    let [result, _] = await user.isAuthJson(req, res);
    if (!result) return;
    const [id] = getParamsArray(req, ["id"]);
    id = Number(id);
    if (id = undefined || id !== id || id == 0) {
        JsonGenerator.setRes([{ "status": -1 }, { data: { message: "活动ID输入错误" } }])
        res.send(JsonGenerator.getData());
        return;
    }
    if (!scene(id)) {
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "数据写入异常" } }])
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { message: "点赞成功" }])
    res.send(JsonGenerator.getData());
}
exports.router = { "/sceneGetAll": exports.getAll };