"use strict";
class hotelModel {
    async hotelGetAll() {
        let result;
        await Db.all("SELECT * FROM hotel").then((rows) => { result = rows; })
        if (result == "undefined" || result.length == 0) return [];
        return result;
    }
    async hotelGetById(id) {
        let result;
        await Db.all("SELECT * FROM hotel where id =?", [id]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
    async orderIsCreat(userid) {
        let result;
        console.log(userid);
        await Db.all("SELECT * FROM 'order' where userid = ?", userid).then((rows) => { result = rows; })
        if (result.length == 0) {
            // 创建      
            result = await Db.run("INSERT INTO 'order' ('userid', 'config') VALUES (?, ?)", [userid, JSON.stringify({ order: 0, fromid: 0 })]);
            if (result.change !== 1) return [false, -6];
        } else if (result.length > 0) {
            return [true, 200];
        }
        return [true, 200]
    }
    async orderSet(userid, fromid) {
        //添加到我的预定 fromid酒店id
        const [retresult, retdata] = await this.orderIsCreat(userid);

        if (!retresult) return [false, -5];
        let result = await Db.run('UPDATE "order" SET "config" = ? WHERE userid = ?', [JSON.stringify({ order: 1, fromid: fromid }), userid]);
        //console.log(result);
        if (result.changes !== 1) return [false, -7];
        return [true, 200];
    }
    async orderCancel(userid) {
        //取消我的预定
        const [retresult, retdata] = await this.orderIsCreat(userid);
        if (!retresult) return [false, -5];
        let result = await Db.run('UPDATE "order" SET "config" = ? WHERE userid = ?', [JSON.stringify({ order: 0, fromid: 0 }), userid]);
        if (result.changes !== 1) return [false, -7];
        return [true, 200];
    }
    async orderGet(userid) {
        //获取我的预定
        let result;
        const [retresult, retdata] = await this.orderIsCreat(userid);
        if (!retresult) return [false, -5];
        await Db.all("SELECT * FROM 'order' where userid =?", [userid]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -6];
        return [true, result[0]];
    }
}
module.exports = hotelModel;