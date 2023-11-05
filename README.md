# What Is It?
一个旅游网页的后端

# 评价
1.sqlite3的库太烂，其实应该选用betterSqlite库 同步Api，避免异步问题，同时性能更高，没错，该同步库比异步库更安全更快速。

2.对于错误处理和统一RestApi处理部分这部分确实我写的太烂，但是NodeJs我还是第一次写后端，感觉处理起来如果使用中间件统一鉴权的同时，使用统一的错误拦截效率更高。

3.关于NodeJs弱类型的大坑，JS利用到服务端果然是离谱，undefined null NaN等层出不穷，推荐Ts

4.鉴权JWT方案过于麻烦，自写又太累，但是本项目Token方案属于是勉强能用，速度也还行，但是距离真实应用还差很多

总结：推荐TS+BetterSqlite+JWT 效率更高

# DEV README

安装依赖请注意

npm install sqlite3 --python="../Python.exe"

//SQLite3 For Node 需要进行编译
