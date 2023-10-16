"use strict";
class recommendModel {
    async recommendSceneGetAll(){
        await Db.all("SELECT * FROM sysconfig where  name = recommendScene", [userid]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -6];
        return [true, result[0]];
    }
    async recommendActivityGetAll(){
        await Db.all("SELECT * FROM sysconfig where  name = recommendActivity", [userid]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -6];
        return [true, result[0]];
    }
}
module.exports = recommendModel;