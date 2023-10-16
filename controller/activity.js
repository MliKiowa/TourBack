"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
exports.activityGetAll = async function activityGetAll(req, res) {
    //无需鉴权
    let activity = LoadModel("activity");
    JsonGenerator.setRes([{ "status": 200 }, { data: await activity.getAll() }])
    res.send(JsonGenerator.getData());
}
exports.pushActivity = async function pushActivity(req, res) {
    //创建活动
}
exports.router = { "/activityGetAll": exports.activityGetAll, "/pushActivity": exports.pushActivity };