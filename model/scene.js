"use strict";
class sceneModel {
    async sceneGetAll() {
        let result;
        await Db.all("SELECT * FROM scene").then((rows) => { result = rows; })
        if (result == "undefined" || result.length == 0) {
            return [];
        }
        return result;
    }
    async sceneGetByID(id) {
        let result;
        await Db.all("SELECT * FROM scene where id =?", [id]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
    async sceneLove(id) {
        let result = await Db.run('UPDATE "scene" SET "love" = (SELECT love FROM scene where id = ?) + 1 WHERE  id = ?', [id, id]);
        console.log(this.sceneGetLoveById(id),id);
        if (result.changes !== 1) {
            return false;
        }
        return true;
    }
    async getCurrentId() {
        let result;
        try {
            await Db.all("SELECT MAX(id) FROM scene").then((rows) => { result = rows; });
        } catch {
            return [false, -1];
        }
        return Object.values(result[0])[0];//一般是有的 除非没数据表
    }
    async sceneGetLoveById(id) {
        let result;
        try {
            await Db.all("SELECT love FROM scene where id = ?", id).then((rows) => { result = rows; });
        } catch {
            return [false, -1];
        }
        return Object.values(result[0])[0];//一般是有的 除非没数据表
    }
}
module.exports = sceneModel;