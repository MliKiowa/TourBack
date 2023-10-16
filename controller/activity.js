"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
let user = LoadModel("user");
let activity = LoadModel("activity");
exports.activityGetAll = async function activityGetAll(req, res) {
    //无需鉴权
    JsonGenerator.setRes([{ "status": 200 }, { data: await activity.getAll() }])
    res.send(JsonGenerator.getData());
}
exports.pushActivity = async function pushActivity(req, res) {
    // 创建活动 
    // 验证权限
    let [result, ret] = await user.isAuthJsonByGroup(req, res, 1);
    if (!result) return;

    let data = getParamsArray(req, ["phone", "name", "price", "location", "desc", "headimg", "endtime"]);
    // 以下处理参数
    for (var key in data) {
        if (data[key] == undefined || toString(data[key]).length == 0) {
            JsonGenerator.setRes([{ "status": -2 }, { data: { message: "参数获取失败" } }]);
            res.send(JsonGenerator.getData());
            return;
        }
    }
    const [retresult, retdata] = await activity.pushActivity(data[0], data[1], data[2], data[3], data[4], data[5], data[6]);
    if (!retresult) {
        JsonGenerator.setRes([{ "status": retdata }, { data: { message: "数据写入失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { data: { message: "活动添加成功" } }]);
    res.send(JsonGenerator.getData());
}
exports.router = { "/activityGetAll": exports.activityGetAll, "/pushActivity": exports.pushActivity };