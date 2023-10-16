"use strict";
let test = new TokenManger();
let token = test.generate(1, 3600000);
console.log(token);
console.log(test.validToken(token));