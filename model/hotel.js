"use strict";
class hotelModel {
    async getAll() {
        let result;
        await Db.all("SELECT * FROM hotel").then((rows) => { result = rows; })
        if (result == "undefined" || result.length == 0) return [];
        return result;
    }
    async getById(id) {
        let result;
        await Db.all("SELECT * FROM hotel where id =?", [id]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -1];
        return [true, result[0]];
    }
    async orderIsCreat(userid) {
        let result;
        await Db.all("SELECT * FROM order where userid =?", [userid]).then((rows) => { result = rows; })
        if (result.length == 0) {
            // 创建
            result = await Db.run("INSERT INTO order ('userid', 'order') VALUES (?, ?)", [userid, JSON.stringify({ order: 1, fromid: fromid })]);
            if (result.change !== 1) return [false, -6];
        } else if (result.length > 0) {
            return [false, -5];
        }
        return [true, 200]
    }
    async order(userid, fromid) {
        //添加到我的预定 fromid酒店id
        const [retresult, retdata] = this.orderIsCreat(userid);
        if (!retresult) return [false, -5];
        result = await Db.run('UPDATE "order" SET "order" = ? WHERE userid = ?', [JSON.stringify({ order: 1, fromid: fromid }), userid]);
        if (result.change !== 1) return [false, -7];
        return [true, 200];
    }
    async orderCancel(userid) {
        //取消我的预定
        const [retresult, retdata] = this.orderIsCreat(userid);
        if (!retresult) return [false, -5];
        result = await Db.run('UPDATE "order" SET "config" = ? WHERE userid = ?', [JSON.stringify({ order: 0, fromid: 0 }), userid]);
        if (result.change !== 1) return [false, -7];
        return [true, 200];
    }
    async orderGet(userid) {
        //获取我的预定
        let result;
        const [retresult, retdata] = this.orderIsCreat(userid);
        if (!retresult) return [false, -5];
        await Db.all("SELECT * FROM order where userid =?", [userid]).then((rows) => { result = rows; })
        if (result.length == 0 || result.length > 1) return [false, -6];
        return [true, result[0]];
    }
}
module.exports = hotelModel;