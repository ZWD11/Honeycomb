var userConfig = require('./config/userConfig.js');
var configIndex = require('./config/index.js').configIndex;
App({
    onLaunch: function() {
        wx.cloud ? wx.cloud.init({
            traceUser: !0
        }) : console.error("请使用 2.2.3 或以上的基础库以使用云能力"), this.globalData = {};
    },
    getWeek: function(e) {
        var t = e, a = t.getDay() || 7;
        t.setDate(t.getDate() - a + 1 + 5);
        var r = new Date(t.getFullYear(), 0, 1), n = r.getDay(), g = 1;
        0 != n && (g = 7 - n + 1), r = new Date(t.getFullYear(), 0, 1 + g);
        var u = Math.ceil((t.valueOf() - r.valueOf()) / 864e5);
        return Math.ceil(u / 7) + 1;
    },
    nextdate: function(e) {
        var t = e;
        t = t.replace(/-/g, "/");
        var a = new Date(t);
        return a.setDate(a.getDate() + 1), a.getFullYear() + "-" + (a.getMonth() + 1 < 10 ? "0" + (a.getMonth() + 1) : a.getMonth() + 1) + "-" + (a.getDate() < 10 ? "0" + a.getDate() : a.getDate());
    },
    nowtime: function(e) {
        var t = Date.parse(new Date());
        t /= 1e3;
        var a = new Date(1e3 * t), r = a.getFullYear();
        if ("y" == e) return r;
        var n = a.getMonth() + 1 < 10 ? "0" + (a.getMonth() + 1) : a.getMonth() + 1;
        if ("M" == e) return n;
        var g = a.getDate() < 10 ? "0" + a.getDate() : a.getDate();
        if ("d" == e) return g;
        var u = a.getHours() < 10 ? "0" + a.getHours() : a.getHours();
        if ("h" == e) return u;
        var o = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
        if ("m" == e) return o;
        var i = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
        return "s" == e ? i : "t" == e ? r + "-" + n + "-" + g : "st" == e ? r + "/" + n + "/" + g : r + "-" + n + "-" + g + " " + u + ":" + o + ":" + i;
    },
    wxShowToast(title='成功',icon='success',duration='1000'){
        wx.showToast({
          title: title,
          icon: icon,
          duration: parseInt(duration)
        })
      },
    //调用云函数
    callFunctiom(name,db,_id = '',data = {}){
        // console.log("name,db,_id,data",name,db,_id,data);
        return wx.cloud.callFunction({
        name: name,
        data:{
            name:db,
            db: db,
            _id:_id,
            data: data,
        }
        })
    },
    //获取图片路径
    getImgSrc(str){
        return  configIndex.imageSrc + str;
    },
    //获取用户信息
    getUserInfo(){
        let user = wx.getStorageSync('username');
        return user;
    },
    //获取昵称
    getShowName(){
        let user = this.getUserInfo();
        return  userConfig.userConfig[user].nickName;
    },
    //获取姓名
    getUserName(name){
        let users = userConfig.userConfig;
        for(let key in users){
            if(user[key].nickName == name){
                return key;
            }
        }
        return '';
    },
    getUserConfig(){
        return userConfig.userConfig;
    },
    /**
     * 判断润年
     * @param {string} year 需要判断的年份
     * @return {Boolean}
     */
    isLeap(year) {
        if((year%4==0 && year%100!=0)||(year%400==0)){
            return true;
        }
        return false;
    },
    /**
 * 获取月份天数
 * @param {string} year  年份
 * @param {string} month 月份
 * @return {string}
 */
    getMonthDays(year,month) {
        month = parseInt(month) - 1;
        if(month < 0 || month > 11) return ''
        let months = [31,28,31,30,31,30,31,31,30,31,30,31];
        if(this.isLeap(year)){
            months[1] = 29;
        }
        return months[month];
    },
    //补零
    addZero(str){
      if(str < 10){
        str = '0' + str;
      }
      return str;
    },
    //获取上一天日期
    getYesterday(str){
        let date = str.split('-');
        let year = parseInt(date[0]),
            month = parseInt(date[1]),
            day = parseInt(date[2]);
        if(month > 12 || month < 1 || day > this.getMonthDays(year,month)) return '日期不合法';
        day -= 1;
        if(day > 0){
            return year + '-' + this.addZero(month) + '-' + this.addZero(day);
        }
        month -= 1;
        if(month > 0){
            return year + '-' + this.addZero(month) + '-' + this.getMonthDays(year,month);
        }
        year -= 1;
        return year + '-' + 12 + '-' + this.getMonthDays(year,12);
    },
    //获取下一天日期
    getTomorrow(str){
        let date = str.split('-');
        let year = parseInt(date[0]),
            month = parseInt(date[1]),
            day = parseInt(date[2]);
        if(month > 12 || month < 1 || day > this.getMonthDays(year,month)) return '日期不合法';
        day += 1;
        if(day <= this.getMonthDays(year,month)){
            return year + '-' + this.addZero(month) + '-' + this.addZero(day);
        }
        month += 1;
        if(month < 13){
            return year + '-' + this.addZero(month) + '-' + '01';
        }
        year += 1;
        return year + '-' + '01' + '-' + '01';
    },
    //获取今天日期
    getToday (str) {
        const date = new Date();
        const year = date.getFullYear(),
              month = this.addZero(date.getMonth() + 1),
              day = this.addZero(date.getDate()),
              hour = this.addZero(date.getHours()),
              minute = this.addZero(date.getMinutes()),
              second = this.addZero(date.getSeconds());
        let res = '';
        switch (str){
          case "yyyy-mm-dd":
            res = year + '-' + month + '-' + day;
            break;
          case "mm-dd-yyyy":
            res = month + '-' + day + '-' + year;
            break;
          case "yyyy-mm-dd hh:MM:ss":
            res = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            break;
          case "hh:MM:ss":
            res = hour + ':' + minute + ':' + second;
            break;
          case "yyyy":
            res = year;
            break;
          case "mm-dd":
            res = month + '-' + day;
            break;
          default:
            res = '参数错误';
            break;
        }
        return res;
      },
});