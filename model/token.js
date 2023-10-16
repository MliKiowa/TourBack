"use strict";
class TokenManger {
    constructor() {
        this.key = '37725295ea78b626';
        this.iv = 'efcf77768be478cb';
        //key iv 为加密关键参数 算法 aes-128-cbc 
        this.crypto = require('crypto');
    }
    encode(src, key, iv) {
        let sign = "";
        const cipher = this.crypto.createCipheriv("aes-128-cbc", key, iv);
        sign += cipher.update(src, "utf8", "hex");
        sign += cipher.final("hex");
        return sign;
    }
    decode(sign, key, iv) {
        let src = "";
        const cipher = this.crypto.createDecipheriv("aes-128-cbc", key, iv);
        src += cipher.update(sign, "hex", "utf8");
        src += cipher.final("utf8");
        return src;
    }
    generate(userid, time) {
        // 生成时间
        let endtime = Date.now() + time;
        let data = Buffer.from(JSON.stringify({ ver: 1, id: userid, retime: endtime })).toString("base64");
        // json 编码原文 接下来按标准情况加密
        return this.encode(data, this.key, this.iv);;
    }
    validToken(token) {
        // 验证Token
        //解出原文
        let jsontext = Buffer.from(this.decode(token, this.key, this.iv), "base64").toString("utf8");
        try {
            var tjson = JSON.parse(jsontext);
            if (Date.now() > tjson.retime) {
                // 超过时间有效期 允许续期
                return -4;
            }
        } catch {
            return -1;
        }
        return Number(tjson.id);
    }
}

module.exports = TokenManger;