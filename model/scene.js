"use strict";
class sceneModel {
    async getAll() {
        let result;
        await Db.all("SELECT * FROM scene").then((rows) => { result = rows; })
        if (result == "undefined" || result.length == 0) {
            return [];
        }
        return result;
    }
    async getById(id) {
        let result;
        await Db.all("SELECT * FROM scene where id =?", [id]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
    async love(id) {
        let result = await Db.run('UPDATE "scene" SET "love" = (SELECT love FROM scene where id = ?) + 1 WHERE  id = ?', id);
        if (result.change !== 1) {
            return false;
        }
        return true;
    }
}
module.exports = sceneModel;