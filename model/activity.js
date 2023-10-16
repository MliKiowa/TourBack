"use strict";
class activityModel {
    async getAll() {
        let result;
        await Db.all("SELECT * FROM activity").then((rows) => { result = rows; })
        if (result == "undefined" || result.length == 0) {
            return [];
        }
        return result;
    }
    async getById(id) {
        let result;
        await Db.all("SELECT * FROM activity where id =?", [id]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
}
module.exports = activityModel;