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
    async pushActivity(phone, name, price, location, desc, headimg) {
        try {
            let result = await Db.run("INSERT INTO 'activity' ('id' , 'phone','name','price','location','desc','headimg') VALUES ((SELECT MAX(id) FROM activity), ?, ?, ?, ?, ?, ? )", [phone, name, price, location, desc, headimg]);
            if (result.changes == 1) return [true, 200];
        } catch {
            return [false, -4];
        }
        return [false, -5];
    }
    async getCurrentId() {
        let result;
        try {
            await Db.all("SELECT MAX(id) FROM activity").then((rows) => { result = rows; });
        } catch {
            return [false, -1];
        }

        return Object.values(result[0])[0];//一般是有的 除非没数据表
    }
}

module.exports = activityModel;