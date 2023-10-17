"use strict";
class commentModel {
    async getCommentAll(type, fromid) {
        //type 0 活动 1 景区 2 酒店
        let result;
        await Db.all("SELECT * FROM comment where type = ? and fromid = ?", [type, fromid]).then((rows) => { result = rows; })
        if (result == undefined || result.length == 0) {
            return [false, []];
        }
        return [true, result];
    }
    async getCommentByID(id) {
        //type 0 活动 1 景区 2 酒店
        let result;
        try {
            await Db.all("SELECT * FROM comment where id = ? ", id).then((rows) => { result = rows; })
        } catch {
            return [false, -1];
        }
        console.log(id);
        if (result.length == 0 || result.length > 1) return [false, -2];
        return [true, result[0]];
    }
    async getCurrentId() {
        let result;
        //一般都有
        await Db.all("SELECT MAX(id) FROM comment").then((rows) => { result = rows; });
        return Object.values(result[0])[0];
    }
    async pushComment(userid, content, type, fromid) {
        let result;
        let typeTable = ["activity", "scene", "hotel"];
        if (fromid < 0 || fromid > 2) {
            //超出范围
            return [false, -103];
        }
        let tableName = typeTable[type];
        //获取需要验证的fromid表位置
        await Db.all("SELECT * FROM " + tableName + " where id = ?", fromid).then((rows) => { result = rows; });
        if (result == "undefined" || result.length == 0) {
            // 未找到fromid
            return [false, -103];
        }
        //未参数化 请后期防注入

        //参数处理
        let id = await this.getCurrentId() + 1;
        let info = await LoadModel("user").getUserInfoByID(userid);
        if (info.username !== undefined) {
            //未能获取通过ID获取到Username结果
            return [false, -102];
        }
        let username = info[1].username;
        //获取当前时间
        let daytime = (new Date()).Format('yyyy-MM-dd');
        result = await Db.run("INSERT INTO 'comment' ('id', 'userid', 'username', 'time', 'content', 'type', 'fromid') VALUES ( ? , ? , ? , ? , ? , ? , ? )", [id, userid, username, daytime, content, type, fromid]);
        if (result.changes !== 1) {
            return [false, -101];
        }

        return [true, 200];
    }
    async delCommentByID(id) {
        let result = await Db.run("DELETE FROM 'comment' WHERE id = ?", id);
        if (result.changes !== 1) return [false, -101];
        return [true, 200];
    }
}
module.exports = commentModel;

