// miniprogram/pages/index/sleepClock/sleepStatistical/sleepStatistical.js
const app = getApp();
var wxcharts = require('../../../common/wxcharts.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bear:[],
    peach:[],
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
    allClock:[],
    username:app.getUserInfo()
  },
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
              min: 0
          },
          width: i,
          height: 300
      });
  },
  drawImg(series,categories){
    let canvasId = 'lineCanvas',title="打卡时间";
    console.log(series,categories);
    // let series = [{
    //   name: '成交量',
    //   data:['111','123','432'],
    //   color: "#2E3E5B"
    // }];
    // let categories = ['篮球','羽毛球','乒乓球'];
    this.lineCharts(series, canvasId, categories, title)
  },
  changeTabs(e){
    const ind = e.detail.ind;
    if(ind == 1){
      wx.navigateTo({
        url: '../sleepClock',
      })
    }
  },
  formatClock(data){
    let bear = [],peach = [],date = [];
    for(let i = 0; i < data.length && i < 7; i++){
      let a = '',b = '';
      if(data[i]['熊先生']){
        a = data[i]['熊先生'].split(' ')[1].split(':');
      }
      if(data[i]['桃小姐']){
        b = data[i]['桃小姐'].split(' ')[1].split(':');
      }
      date.push(data[i]['_id']);
      a ? bear.push((parseInt(a[0]) + (parseInt(a[1]) / 60) + (parseInt(a[2]) / 3600)).toFixed(2)) : '';
      b ? peach.push((parseInt(b[0]) + (parseInt(b[1]) / 60) + (parseInt(b[2]) / 3600)).toFixed(2)) : '';
    }
    let series = [{
      name: '熊先生',
      data:bear,
      color: "#2E3E5B"
    },{
      name: '桃小姐',
      data:peach,
      color: "pink"
    }];
    // console.log(series,date);
    this.drawImg(series,date);
  },
  getAllClock(){
    wx.cloud.callFunction({
      name: "getMyType",
      data: {
          name: "mySleepClock",
          order:'_id',
          orderRule:'asc'
      },
      success: res => {
        console.log(res);
        this.formatClock(res.result.data);
        this.setData({
          allClock:res.result.data
        })
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
    this.getAllClock();
    this.drawImg();
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