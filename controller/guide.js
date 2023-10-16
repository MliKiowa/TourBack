let JsonGenerator = LoadModel("JsonGenerator");
let guide = LoadModel("guide");
exports.getGuideAll = async function getGuideAll(req, res) {
    const [id] = getParamsArray(req, ["id"]);
    id = Number(id);
    if (id !== id || id < 0) {
        //参数异常
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数是否正确" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    const [result, data] = guide.getGuideAll();
    if (!result) {
        JsonGenerator.setRes([{ "status": -3 }, { data: { message: "读取数据失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": -3 }, { data: data }]);
    res.send(JsonGenerator.getData());
}
exports.pushGuide = async function pushGuide(req, res) {
    let [result, userid] = await user.isAuthJson(req, res);
    if (!result) return;
    let data;

    const [type, id, content] = getParamsArray(req, ["type", "id", "content"]);
    // 验证权限 获取参数
    type = Number(type);
    id = Number(id);//特指fromid 区别userid
    if (type !== type || id !== id || type < 0 || id < 0 || content == undefined || toString(content).length == 0) {
        //参数异常
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数是否正确" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    //  写入数据
    [result, code] = guide.pushGuide(userid, content, type, id);
    // 覆盖
    if (!result) {
        JsonGenerator.setRes([{ "status": code }, { data: { message: "数据写入失败" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": -3 }, { data: data }]);
    res.send(JsonGenerator.getData());
}
exports.delGuide = async function delGuide(req, res) {
    let [result, userid] = await user.isAuthJson(req, res);
    if (!result) return;
    const [type, data] = getParamsArray(req, ["type", "id"]);
    //验证登录权限 获取参数
    //验证评论归属权
    type = Number(type);
    id = Number(id);
    if (type !== type || id !== id || type < 0 || id < 0) {
        //参数异常
        JsonGenerator.setRes([{ "status": -2 }, { data: { message: "请检查参数是否正确" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    [result, data] = guide.getByID().userid
    if (result || result.userid !== Number(userid)) {
        JsonGenerator.setRes([{ "status": -1 }, { data: { message: "评论写入失败或者你无权删除" } }]);
        res.send(JsonGenerator.getData());
        return;
    }
    JsonGenerator.setRes([{ "status": 200 }, { data: { message: "评论删除成功" } }]);
    res.send(JsonGenerator.getData());
}
exports.router = { "/getGuideAll": exports.getGuideAll, "/pushGuide": exports.pushGuide, "/delGuide": exports.delGuide };
// 攻略获取 从数据中获取