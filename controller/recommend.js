"use strict";
//推荐信息
let JsonGenerator = LoadModel("JsonGenerator");
let recommend = LoadModel("recommend");
exports.recommendSceneGetAll = async function recommendScene(req, res) {
    JsonGenerator.setRes([{ "status": 200 }, { data: await recommend.recommendSceneGetAll() }])
    res.send(JsonGenerator.getData());
}
exports.recommendActivityGetAll = async function recommendActivity(req, res) {
    JsonGenerator.setRes([{ "status": 200 }, { data: await recommend.recommendActivity() }])
    res.send(JsonGenerator.getData());
}
exports.router = { "/recommendSceneGetAll": exports.recommendSceneGetAll, "/recommendActivityGetAll": exports.recommendActivityGetAll };