// miniprogram/pages/index/sleepClock/sleepClock.js
const app = getApp();
var wxcharts = require('../../common/wxcharts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startBgSrc:app.getImgSrc('星星.gif'),
    userConfig:app.getUserConfig(),
    hour:'',
    minutes:'',
    second:'',
    preTime:'获取中……',
    selectInd:0,
    tabinf:[
      {
        id:0,
        img:app.getImgSrc('睡觉1.png'),
        img1:app.getImgSrc('睡觉.png'),
        title:'打卡'
      },
      {
        id:1,
        img:app.getImgSrc('统计1.png'),
        img1:app.getImgSrc('统计.png'),
        title:'统计'
      }
    ],
    username:app.getUserInfo(),
    bear:[],
    peach:[],
    allClock:[],
    categories:[],
    series:[],
    showDays:7,//统计天数
    showDayLists:[
      {
        name:"近7天",
        value:7,
      },
      {
        name:"近15天",
        value:15
      },
      {
        name:"近30天",
        value:30
      }
    ]
  },
  //修改统计时间天数
  changShowDays(e){
    let item = e.target.dataset.item;
    this.setData({
      showDays:item
    })
    this.formatClock();
    this.drawImg();
  },
  //获取最近一次打卡时间
  getPreTime(){
    wx.cloud.callFunction({
      name: "getMyType",
      data: {
          name: "mySleepClock",
          order:'_id'
      },
      success: res => {
        console.log(res);
        let d = res.result.data,preTime = '';
        for(let i = 0; i < d.length; i++){
          if(d[i][app.getShowName()]){
            preTime = d[i][app.getShowName()];
            break;
          }
        }
        this.setData({
          preTime:preTime
        })
      },
      fail: err => {
        console.log('err',err);
      }
    })
  },
  //获取现在时间
  getNowTime(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let second = date.getSeconds();
    // console.log(this.addZero(hour) + ':' + this.addZero(minutes) + ':' + this.addZero(second));
    this.setData({
      hour:this.addZero(hour),
      minutes:this.addZero(minutes),
      second:this.addZero(second)
    })
    this.refleshTime(hour,minutes,second);
  },
  //刷新时间
  refleshTime(hour,minutes,second){
    second = parseInt(second) + 1;
    if(second >= 60){
      second -= 60;
      minutes = parseInt(minutes) + 1;
      if(minutes >= 60){
        minutes -= 60;
        hour = parseInt(hour) + 1;
        if(hour == 24) hour = 0;
      }
    }
    this.setData({
      hour:this.addZero(hour),
      minutes:this.addZero(minutes),
      second:this.addZero(second)
    })
    setTimeout(() => {
      this.refleshTime(hour,minutes,second);
    }, 1000);
  },
  //数字补零
  addZero(str){
    if(str < 10){
      str = '0' + str;
    }
    return str;
  },
  //判断时间
  judgeDay(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let second = date.getSeconds();
    let res = '';
    if(hour > 20){
      res = year + '-' + this.addZero(month) + '-' + this.addZero(day);
      // res += this.addZero(hour) + ':' + this.addZero(minutes) + ':' + this.addZero(second);
      return res;
    }
    if(hour < 6){
      res = year + '-' + this.addZero(month) + '-' + this.addZero(day);
      res = app.getYesterday(res);
      // res += ' ' + this.addZero(hour) + ':' + this.addZero(minutes) + ':' + this.addZero(second);
      return res;
    }
    return false;
  },
  //打卡
  clock(){
    const _this = this;
    let date = this.judgeDay();
    if(this.judgeDay() == false){
      wx.showToast({
        title: '当前不是打卡时间',
        icon: 'error'
      })
      return;
    }
    let data = '{\"_id\":\"' + date + '\",\"' + app.getShowName() + '\":\"' + app.nowtime() + '\"}';
    wx.showModal({
      title: '打卡',
      content: '确定打卡吗？',
      success (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在打卡……',
          })
          let para = JSON.parse(data);
          app.callFunctiom('dbAdd','mySleepClock','',para).then(res=>{
            // console.log('res',res);
            if(res.result == null){
              data = '{\"' + app.getShowName() + '\":\"' + app.nowtime() + '\"}';
              para = JSON.parse(data);
              app.callFunctiom('dbUpdate','mySleepClock',date,para).then(res1=>{     
                wx.showToast({
                  title: '打卡成功',
                })
                _this.getAllClock();
                _this.setData({
                  preTime:app.nowtime()
                })
              }).catch(err1 => {
                wx.showToast({
                  title: '打卡失败',
                  icon: 'none'
                })
                console.log('err',err1);
              })
            }else{
              wx.showToast({
                title: '打卡成功',
              })
              _this.setData({
                preTime:app.nowtime()
              })
            }
          }).catch(err=>{
            wx.showToast({
              title: '打卡失败',
              icon: 'none'
            })
            console.log('err',err);
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  //切换tab页
  changeTabs(e){
    const ind = e.detail.ind;
    this.setData({
      selectInd:ind
    })
    if(ind == 1){
      this.drawImg(this.data.series,this.data.categories);
    }
    // console.log(e);
  },
  //折线图
  lineCharts: function(series, canvasId, categories, title) {
    var i = 320;
    try {
        i = wx.getSystemInfoSync().windowWidth;
    } catch (e) {
        console.error("getSystemInfoSync failed!");
    }
    new wxcharts({
        canvasId: canvasId,
        type: "line",
        categories: categories,
        series: series,
        yAxis: {
            title: title,
            format: function(e) {
                return e.toFixed(2);
            },
            min: 0,
            max: 24
        },
        width: i,
        height: 300
    });
},
//绘制折线图
drawImg(series = this.data.series,categories = this.data.categories){
  let canvasId = 'lineCanvas',title="打卡时间";
  // console.log(series,categories);
  this.lineCharts(series, canvasId, categories, title)
},
//格式化打卡列表
//未打卡的日期置为-1
formatClock(){
  let data = [... this.data.allClock];
  data.reverse();
  let bear = [],peach = [],date = [];
  let userConfig = this.data.userConfig;
  let users = Object.keys(userConfig);
  let usersData = [];
  for(let i = 0; i < users.length; i++) usersData.push([]);
  console.log('---------',users,usersData);
  for(let i = 0; i < data.length && i < this.data.showDays; i++){
    for(let j = 0; j < users.length; j++){
      if(data[i][userConfig[users[j]].nickName]){
        let a = data[i][userConfig[users[j]].nickName].split(' ')[1].split(':');
        a ? usersData[j].unshift((parseInt(a[0]) + (parseInt(a[1]) / 60) + (parseInt(a[2]) / 3600)).toFixed(2)) : '';
      }else{
        usersData[j].unshift(-1);
      }
    }
    date.unshift(data[i]['_id']);
  }
  let series = [];
  for(let j = 0; j < users.length; j++){
    let tmp = {
      name:userConfig[users[j]].nickName,
      data:usersData[j],
      color:userConfig[users[j]].color
    }
    series.push({... tmp});
  }
  this.setData({
    series:series,
    categories:date
  })
},
//获取所有打卡时间
getAllClock(){
  wx.cloud.callFunction({
    name: "getMyType",
    data: {
        name: "mySleepClock",
        order:'_id',
        orderRule:'asc'
    },
    success: res => {
      // console.log(res);
      let d = res.result.data,preTime = '';
      for(let i = d.length - 1; i >= 0; i--){
        if(d[i][app.getShowName()]){
          preTime = d[i][app.getShowName()];
          break;
        }
      }
      this.setData({
        preTime:preTime,
        allClock:res.result.data
      })
      this.formatClock();
    },
    fail: err => {
      console.log('err',err);
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '获取数据中',
    })
    this.getNowTime();
    // this.getPreTime();
    this.getAllClock();
    wx.hideLoading({
      success: (res) => {},
    })
    // console.log('getTomorrow',app.getTomorrow('2021-12-32'));
    // console.log('getToday',app.getToday('yyyy-mm-dd hh:MM:ss'));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})