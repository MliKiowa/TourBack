"use strict";
class recommendModel {
    async recommendSceneGetAll(){
        let result;
        await Db.all("SELECT * FROM sysconfig where  name = 'recommendScene'").then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -6];
        return [true, result[0]];
    }
    async recommendActivityGetAll(){
        let result;
        await Db.all("SELECT * FROM sysconfig where  name = 'recommendActivity'").then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -6];
        return [true, result[0]];
    }
}
module.exports = recommendModel;