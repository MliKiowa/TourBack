"use strict";
//SELECT * FROM notice WHERE endtime <= date('now')
class NoticeModel {
    async getAll() {
        let result;
        //未参数化 请后期防注入
        await Db.all("SEALECT * FROM notice WHERE endtime >= date('now')").then((rows) => { result = rows; })
        if (result == "undefined" || result.length == 0) {
            return [];
        }
        return result;
    }
    async getById(id) {
        let result;
        await Db.all("SELECT * FROM notice where id =?", [id]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
    // 仅限管理员 现在权限部分未完成
    async pushNotice(anthor, message, endtime) {
        try {
            let result = await Db.run("INSERT INTO 'activity' ('id' , 'anthor','message','endtime') VALUES ((SELECT MAX(id) FROM notice), ?, ?, ?, ? )", [anthor, message, endtime]);
            if (result.changes == 1) return [true, 200];
        } catch {
            return [false, -4];
        }
        return [false, -5];
    }
    async getCurrentId() {
        let result;
        try {
            await Db.all("SELECT MAX(id) FROM notice").then((rows) => { result = rows; });
        } catch {
            return [false, -1];
        }

        return Object.values(result[0])[0];//一般是有的 除非没数据表
    }
}
module.exports = NoticeModel;