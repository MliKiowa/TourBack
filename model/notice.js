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
}
module.exports = NoticeModel;