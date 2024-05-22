// pages/index/checklist/checklist.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choose: 0,
    tip: '添加打卡清单',
    btnTop: 0,
    btnLeft: 0,
    windowHeight: "",
    windowWidth: "",
    hiddenmodalput: !0,
    completedChecks: [],
    addImg1: app.getImgSrc('添加1.png'),
    watchImg: app.getImgSrc('打卡项目.png'),
    watchImg1: app.getImgSrc('打卡项目1.png'),
    watchHistoryImg: app.getImgSrc('历史观看.png'),
    watchHistoryImg1: app.getImgSrc('历史观看1.png'),
    formData: [
      {
        name: 'checkname',
        cname: '打卡项目',
        value: '',
        type: 'input',
        placeholder: '打卡项目',
      },
      {
        name: 'checkInf',
        cname: '打卡描述',
        value: '',
        type: 'input',
        placeholder: '打卡描述',
      }
    ]
  },
  inputItem: function (e) {
    let formData = this.data.formData;
    formData[e.detail.ind].value = e.detail.val;
    this.setData({
      formData: formData
    });
  },
  addNewItem: function (t) {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    });
  },
  cancel: function () {
    console.log('cancel');
    this.setData({
      hiddenmodalput: !0,
      formData: [
        {
          name: 'checkname',
          cname: '打卡项目',
          value: '', // 清空 value
          type: 'input',
          placeholder: '打卡项目',
        },
        {
          name: 'checkInf',
          cname: '打卡描述',
          value: '', // 清空 value
          type: 'input',
          placeholder: '打卡描述',
        }
      ]
    });
  },
  arr2Obj: function (formData) {
    let obj = {};
    formData.map(item => {
      obj[item.name] = item.value;
    })
    return obj;
  },
  confirm: function () {
    var t = this.data, n = this;
    let data = this.arr2Obj(this.data.formData);
    wx.cloud.database().collection("mycheck").add({
      data: {
        check: data.checkname,
        inf: data.checkInf,
        username: app.getShowName(),
        time: app.nowtime()
      },
      success: function (t) {
        wx.showModal({
          title: "新建记录",
          content: "添加成功",
          showCancel: !1
        }), 
        // 清空输入框
        n.setData({
          hiddenmodalput: !0,
          formData: [
            {
              name: 'checkname',
              cname: '打卡项目',
              value: '', // 清空 value
              type: 'input',
              placeholder: '打卡项目',
            },
            {
              name: 'checkInf',
              cname: '打卡描述',
              value: '', // 清空 value
              type: 'input',
              placeholder: '打卡描述',
            }
          ]
        }), 
        n.onLoad();
      },
      fail: console.error
    });
  },
  history: function (t) {
    this.setData({
      choose: 1
    });
  },
  project: function (t) {
    this.setData({
      choose: 0
    });
  },
  completeCheck: function (event) {
    const index = event.currentTarget.dataset.id;
    const completedCheck = this.data.allcheck.splice(index, 1)[0]; // Remove from allcheck
    this.setData({
      allcheck: this.data.allcheck,
      completedChecks: [...this.data.completedChecks, completedCheck] // Add to completedChecks
    });

    // 在 "mycheck" 集合中删除该项目
    wx.cloud.database().collection("mycheck").doc(completedCheck._id).remove({
      success: function (res) {
        console.log('Check removed from "mycheck" collection:', res);
      },
      fail: console.error
    });

    console.log('data的值：', completedCheck);
    delete completedCheck._id;
    delete completedCheck._openid;
    // 保存完成的打卡项目到数据库
    wx.cloud.database().collection("completedChecks").add({
      data: completedCheck,
      success: function (res) {
        console.log('Completed check saved to database:', res);
      },
      fail: console.error
    });
  },
  // 获取数据
  getFilmList: function () {
    let that = this;
    // 获取未完成的打卡项目
    app.callFunctiom('getMyType', 'mycheck').then(res => {
      const allcheck = res.result.data;
      console.log("获取未完成的项目成功");
      that.setData({
        allcheck: allcheck
      })
    }).catch(err => {
      console.log('err', err);
    });
    // 获取已完成的打卡项目
    app.callFunctiom('getMyType', 'completedChecks').then(res => {
      const completedChecks = res.result.data;
      console.log("获取已完成的项目成功")
      that.setData({
        completedChecks: completedChecks
      })
    }).catch(err => {
      console.log('err', err);
    });
  },
  deleteItem: function (event) {
    const itemId = event.currentTarget.dataset.id;
    const that = this;
    wx.showModal({
      title: '确认删除',
      content: '您确定要删除该项目吗？',
      success(res) {
        if (res.confirm) {
          // 从数据库中删除
          wx.cloud.database().collection("mycheck").doc(itemId).remove({
            success: res => {
              console.log('Check removed from database:', res);
              // 从页面中移除
              const updatedAllcheck = that.data.allcheck.filter(item => item._id !== itemId);
              that.setData({
                allcheck: updatedAllcheck
              });
            },
            fail: console.error
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (t) {
    this.setData({
      username: app.getUserInfo()
    })
    var n = this, e = this;
    this.getFilmList(), wx.getSystemInfo().then(function (t) {
      var e = t.windowHeight, a = t.windowWidth, o = e - 134;
      n.setData({
        windowHeight: e,
        windowWidth: a,
        btnLeft: a - 45,
        btnTop: o
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
