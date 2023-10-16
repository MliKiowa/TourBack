"use strict";
class JsonGenerator {
    constructor() {
        this.data = new Array();
    }
    inArray(indata) {
        this.data = { ...this.data, ...indata };
    }
    addNode(Name, data) {
        this.data[Name] = data;
    }
    getData() {
        return this.data;
    }
    setRes(indata) {
        if (indata instanceof Array) {
            for (var key in indata) {
                if (indata[key] instanceof Object) {
                    this.data = { ...this.data, ...indata[key] };
                } else {
                    this.data = [...this.data, indata[key]];
                }
            }
        }
    }
}
module.exports = JsonGenerator;
// - 1 失败
// 200 OK