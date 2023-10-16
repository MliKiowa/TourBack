"use strict";
class guideModel {
    async getGuideAll() {
        let result;
        await Db.all("SELECT * FROM guide",).then((rows) => { result = rows; })
        if (result == "undefined" || result.length == 0) {
            return [false, []];
        }
        return [true, result];
    }
    async getGuideByID(id) {
        //type 0 活动 1 景区 2 酒店
        let result;
        try {
            await Db.all("SELECT * FROM guide where id = ?", id).then((rows) => { result = rows; })
        } catch {
            return [false, -1];
        }
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
    async getCurrentId() {
        let result;
        //一般都有
        await Db.all("SELECT MAX(id) FROM guide").then((rows) => { result = rows; });
        return Object.values(result[0])[0];
    }
    async pushComment(userid, content, type, fromid) {
        //参数处理
        let id = await this.getCurrentId() + 1;
        let info = await LoadModel("user").getUserInfoByID(userid);
        if (info.username !== undefined) {
            //未能获取通过ID获取到Username结果
            return [false, -102];
        }
        let username = info.username;
        let result = await Db.run("INSERT INTO 'guide' ('id', 'anthorid', 'descript', 'anthorname') VALUES ( ? , ? , ? , ? , ? , ? , ? )", [id, userid, content, username]);
        if (result.change !== 1) {
            return [false, -101];
        }
        return [true, 200];
    }
    async delGuideByID(id) {
        let result = await Db.run("DELETE FROM 'guide' WHERE id = ?", id);
        if (result.change !== 1) return [false, -101];
        return [true, 200];
    }
}
module.exports = guideModel;
