"use strict";
// 引入 sqlite3 模块
const sqlite3 = require('sqlite3').verbose();

// 定义一个 promise 风格的 sqlite3 操作类
class SQLite {
  // 构造函数，接收数据库文件名作为参数
  constructor(filename) {
    // 创建一个数据库对象
    this.db = new sqlite3.Database(filename, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log('Connected to the database.');
      }
    });
  }

  // 关闭数据库连接的方法
  close() {
    // 返回一个 promise 对象
    return new Promise((resolve, reject) => {
      // 调用数据库对象的 close 方法
      this.db.close((err) => {
        if (err) {
          // 如果出错，调用 reject 函数
          reject(err.message);
        } else {
          // 如果成功，调用 resolve 函数
          resolve('Closed the database connection.');
        }
      });
    });
  }

  // 执行 sql 语句的方法，接收 sql 和 params 作为参数
  run(sql, params = []) {
    console.log(sql);
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve(this);
        }
      });
    });
  }

  // 查询所有数据的方法，接收 sql 和 params 作为参数
  all(sql, params = []) {
    // 返回一个 promise 对象
    console.log(sql);
    return new Promise((resolve, reject) => {
      // 调用数据库对象的 all 方法
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          // 如果出错，调用 reject 函数
          reject(err.message);
        } else {
          // 如果成功，调用 resolve 函数，并传入 rows 数组（包含查询结果）
          resolve(rows);
        }
      });
    });
  }

  // 查询一条数据的方法，接收 sql 和 params 作为参数
  get(sql, params = []) {
    // 返回一个 promise 对象
    return new Promise((resolve, reject) => {
      // 调用数据库对象的 get 方法
      this.db.get(sql, params, (err, row) => {
        if (err) {
          // 如果出错，调用 reject 函数
          reject(err.message);
        } else {
          // 如果成功，调用 resolve 函数，并传入 row 对象（包含查询结果）
          resolve(row);
        }
      });
    });
  }
}

// 导出 SQLite 类
module.exports = SQLite;
