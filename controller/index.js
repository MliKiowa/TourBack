"use strict";
let JsonGenerator = LoadModel("JsonGenerator");
exports.index = (req, res) => {
    res.send("Welcome Use This Api By Developer Mlikiowa");
}
exports.router = { "/index": exports.index };