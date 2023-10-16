"use strict";
class hotelModel {
    async getAll() {
        let result;
        await Db.all("SELECT * FROM hotel").then((rows) => { result = rows; })
        if (result == "undefined" || result.length == 0) {
            return [];
        }

        return result;
    }
    async getById(id) {
        let result;
        await Db.all("SELECT * FROM hotel where id =?", [id]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
    async order() {
        //添加到我的预定
        return;
    }
}
module.exports = hotelModel;