"use strict";
class userModel {
    async getUserInfoByID(id) {
        console.log("埋点-2", id);
        let result;
        try {
            await Db.all('SELECT id,username,imgurl,auth FROM user where id = ?', id).then((rows) => { result = rows; });
        } catch {
            return [false, -1];
        }
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
    async getUserInfoByName(username) {
        let result;
        try {
            await Db.all('SELECT id,username,imgurl,auth FROM user where username = ?', username).then((rows) => { result = rows; });
        } catch {
            return [false, -1];
        }
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
    async isExistUsername(username) {
        let result;
        try {
            await Db.all('SELECT id,username,imgurl,auth FROM user where username = ?', username).then((rows) => { result = rows; });
        } catch {
            return false;
        }
        if (result.length == 0) return true;
        return false;
    }
    async getUserAuthByName(username, password) {
        //未修改
        let result;
        await Db.all('SELECT * FROM user where username = ? and password = ?', [username, password]).then((rows) => { result = rows; });
        if (result == "undefined" || result.length == 0 || result.length > 1) return false; //同名情况返回失败 一般不同
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
        let ret = tokenGenerate.validToken(token);
        console.log("isAuth", ret);
        let id = ret.id;
        if (ret <= 0) return [false, ret];
        return [true, ret];
    }
    async isAuthByToken(token) {
        // 不需要安全化处理 不通过数据库
        let tokenGenerate = LoadModel("token");
        //解密两次有点浪费 已优化 不要质疑两次if
        let ret = tokenGenerate.validToken(token);
        let id = ret.id;
        if (ret <= 0) return [false, ret];
        return [true, ret];
    }
    async isAuthJson(req, res) {
        // 自动接管验证失败的返回 续签token未完成
        let JsonGenerator = LoadModel("JsonGenerator");
        let tokenGenerate = LoadModel("token");
        let [result, ret] = await this.isAuth(req);
        let [token] = getParamsArray(req, ["token"]);
        if (!result) {
            if (ret == -4) {
                //刷新token
                console.log("token刷新");
                let refreshtoken = tokenGenerate.refresh(token, 3600000);
                JsonGenerator.addNode("data", { message: "token已刷新", "token": refreshtoken });
                JsonGenerator.addNode("status", -200);//刷新token
                setParam(req, "token", refreshtoken); // 彻底方法
                [result, ret] = await this.isAuth(req); //重新赋值
                console.log(JsonGenerator.getData());
                res.send(JsonGenerator.getData());
                return [false, ret];
                //防止后面程序读到旧的token
            } else {
                JsonGenerator.setRes([{ "status": -3, message: "未登录或登录过期" }])
                res.send(JsonGenerator.getData());
                return [false, ret];
            }
        }
        return [true, ret.id];
    }
    async isAuthJsonByGroup(req, res, group) {
        // 自动接管验证失败的返回 续签token未完成
        let JsonGenerator = LoadModel("JsonGenerator");
        let tokenGenerate = LoadModel("token");
        let [result, ret] = await this.isAuth(req);
        let [token] = getParamsArray(req, ["token"]);
        if (!result) {
            if (ret == -4) {
                //刷新token
                console.log("token刷新");
                let refreshtoken = tokenGenerate.refresh(token, 3600000);
                JsonGenerator.addNode("data", { message: "token已刷新", "token": refreshtoken });
                JsonGenerator.addNode("status", -200);//刷新token
                setParam(req, "token", refreshtoken); // 彻底方法
                [result, ret] = await this.isAuth(req); //重新赋值
                res.send(JsonGenerator.getData());
                return [false, ret];
                //防止后面程序读到旧的token
            } else {
                console.log("验证", result, ret);
                JsonGenerator.setRes([{ "status": -3, message: "未登录或登录过期" }])
                res.send(JsonGenerator.getData());
                return [false, -1];
            }
        }
        console.log("权限验证", group, ret)
        if (Number(group) !== ret.auth) {
            JsonGenerator.setRes([{ "status": -5, message: "你无权进行该操作" }])
            res.send(JsonGenerator.getData());
            return [false, ret];
        }
        return [true, ret];
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
    async regUser(regId, username, password, auth) {
        if (isExistUsername(username)) {
            return [false, -77];
        }
        let imgurl = null;//注册时设置默认头像地址
        try {
            let result = await Db.run("INSERT INTO 'user' ('id' , 'username','password','imgurl', 'auth') VALUES ( ?, ?, ?, ?, ?)", [regId, username, password, imgurl, auth]);
            if (result.changes == 1) return [true, 200];
        } catch {
            return [false, -4];
        }
        return [false, -5];
    }
}
//需要错误处理 否则sqlite3将引发程序停止
module.exports = userModel;