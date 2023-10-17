"use strict";
class JsonGenerator {
    constructor() {
        this.data = {};
    }
    inArray(indata) {
        console.log("数据输入",indata);
        this.data = { ...this.data, ...indata };
    }
    addNode(name, data) {
        console.log("数据输入",name,data);
        this.data[name] = data;
    }
    getData() {
        return this.data;
    }
    setRes(indata) {
        console.log("数据输入",...indata);
        if (indata instanceof Array) {
            for (var key in indata) {
                if (indata[key] instanceof Object) {
                    this.data = {  ...this.data ,...indata[key]};
                } else {
                    this.data = [ ...this.data,indata[key]];
                }
            }
        }
    }
}
module.exports = JsonGenerator;
// - 1 失败
// 200 OK