"use strict";
class userModel {
    async getUserInfoByID(id) {
        let result;
        try {
            await Db.all('SELECT id,username,imgurl FROM user where id = ?', id).then((rows) => { result = rows; });
        } catch {
            return [false, -1];
        }
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
    async isExistUsername(username) {
        let result;
        try {
            await Db.all('SELECT id,username,imgurl FROM user where username = ?', username).then((rows) => { result = rows; });
        } catch {
            return [false, -1];
        }
        if (result.length == 0) return [true, 200];
        return [false, -1];
    }
    async getUserAuthByname(id, password) {
        //未修改
        let result;

        await Db.all('SELECT * FROM user where id = ? and password = ?', [Number(id), password]).then((rows) => { result = rows; });
        console.log(password);
        if (result == "undefined" || result.length == 0 || result.length > 1) return false;
        return true;
    }
    async getUserAuth(id, password) {
        let result;

        await Db.all('SELECT * FROM user where id = ? and password = ?', [Number(id), password]).then((rows) => { result = rows; });
        console.log(password);
        if (result == "undefined" || result.length == 0 || result.length > 1) return false;
        return true;
    }
    async isAuth(req) {
        const [token] = getParamsArray(req, ["token"]);
        // 不需要安全化处理 不通过数据库
        let tokenGenerate = LoadModel("token");
        //解密两次有点浪费 已优化 不要质疑两次if
        let id = tokenGenerate.validToken(token);
        if (id <= 0) return [false, id];
        return [true, id];
    }
    async isAuthJson(req, res) {
        // 自动接管验证失败的返回 续签token未完成
        let JsonGenerator = LoadModel("JsonGenerator");
        const [result, id] = await this.isAuth(req);
        if (!result) {
            JsonGenerator.setRes([{ "status": -3, message: "未登录或登录过期" }])
            res.send(JsonGenerator.getData());
            return [false, id];
        }
        return [true, id];
    }
    async getCurrentId() {
        let result;
        try {
            await Db.all("SELECT MAX(id) FROM user").then((rows) => { result = rows; });
        } catch {
            return [false, -1];
        }

        return Object.values(result[0])[0];//一般是有的 除非没数据表
    }
    async regUser(regId, username, password) {
        let imgurl = null;//注册时设置默认头像地址
        try {
            let result = await Db.run("INSERT INTO 'user' ('id' , 'username','password','imgurl') VALUES ( ?, ?, ?, ? )", [regId, username, password, imgurl]);
            if (result.changes == 1) return [true, 200];
        } catch {
            return [false, -4];
        }
        return [false, -5];
    }
}
//需要错误处理 否则sqlite3将引发程序停止
module.exports = userModel;