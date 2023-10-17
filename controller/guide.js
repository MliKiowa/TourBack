let JsonGenerator = LoadModel("JsonGenerator");
let guide = LoadModel("guide");
let userModel = LoadModel("user");
exports.guideGetAll = async function guideGetAll(req, res) {
    let [result, data] = await guide.getGuideAll();
    if (!result) {
        JsonGenerator.setRes([{ "status": -3 }, { data: { message: "读取数据失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { data: data }]);
    res.send(JsonGenerator.getData());
}
exports.guideGetByID = async function guideGetByID(req, res) {
    let [id] = getParamsArray(req, ["id"]);
    id = Number(id);
    if (id !== id || id < 1) {
        //参数异常
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数是否正确" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    let [result, data] = await guide.getGuideByID(id);
    if (!result) {
        JsonGenerator.setRes([{ "status": -3 }, { data: { message: "读取数据失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { data: data }]);
    res.send(JsonGenerator.getData());
}
exports.guidePush = async function guidePush(req, res) {
    let [result, userid] = await userModel.isAuthJson(req, res);
    if (!result) return;
    let [content] = getParamsArray(req, ["content"]);
    // 验证权限 获取参数
    if (content == undefined || toString(content).length == 0) {
        //参数异常
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数是否正确" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    //  写入数据
    [result, code] = await guide.guidePush(userid, content);
    // 覆盖
    if (!result) {
        JsonGenerator.setRes([{ "status": code }, { data: { message: "数据写入失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": -3 }, { data: { message: "攻略提交成功" } }]);
    res.send(JsonGenerator.getData());
}
exports.guideDel = async function guideDel(req, res) {
    let [result, userid] = await userModel.isAuthJson(req, res);
    if (!result) return;
    let [id] = getParamsArray(req, ["id"]);
    //验证登录权限 获取参数
    //验证评论归属权
    id = Number(id);
    if (id !== id || id < 1) {
        //参数异常
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数是否正确" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    let commentUserid = await guide.getGuideByID(id);
    console.log(commentUserid);
    if (!commentUserid[0]) {
        JsonGenerator.setRes([{ "status": -106 }, { data: { message: "信息读取失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    if (userid !== Number(userid,commentUserid[1].userid)) {
        JsonGenerator.setRes([{ "status": -107 }, { data: { message: "你无权删除" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    let [retbool, retcode] = await guide.guideDelByID(id);
    if (!retbool) {
        JsonGenerator.setRes([{ "status": retcode }, { data: { message: "删除失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { data: { message: "删除成功" } }]);
    res.send(JsonGenerator.getData());
}
exports.router = { "/guideGetAll": exports.guideGetAll, "/guideGetByID": exports.guideGetByID, "/guidePush": exports.guidePush, "/guideDel": exports.guideDel };
// 攻略获取 从数据中获取