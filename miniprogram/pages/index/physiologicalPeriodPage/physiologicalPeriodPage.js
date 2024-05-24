
var e = getApp();

Page({
  data: {
    flag: 0,
    choose: 0,
    flagImg: e.getImgSrc('标记.png'),
    flagImg1: e.getImgSrc('标记1.png'),
    allImg: e.getImgSrc('汇总.png'),
    allImg1: e.getImgSrc('汇总1.png'),
    formData: [
      {
        value: '请选择',
        type: 'text',
      }
    ],
    title: '添加标记',
    hiddenmodalput: true,
    cancelText: '少量',
    confirmText: '大量',
    selectdate: '',  // 选中日期
    periodLength: 28, // 默认生理间隔天数
    predictDate: '' // 预计下次经期日期
  },
  
  // 输入生理间隔天数
  bindPeriodLengthInput: function (e) {
    this.setData({
      periodLength: parseInt(e.detail.value) || 28 // 如果输入为空，则默认为28天
    });
    this.predictNextPeriodDate();
  },

  // 预测下次经期日期
  predictNextPeriodDate: function () {
    let lastDate = new Date(this.data.lastday.replace(/-/g, '/'));
    let periodLength = this.data.periodLength;
    lastDate.setDate(lastDate.getDate() + periodLength);

    let year = lastDate.getFullYear();
    let month = lastDate.getMonth() + 1;
    let day = lastDate.getDate();

    this.setData({
      predictDate: `${year}-${month}-${day}`
    });
  },
  select: function (e) {
    this.setData({
      selectdate: e.detail
    });

    let calendarDate = wx.getStorageSync("calendarDate");
    if (-1 == calendarDate.indexOf(e.detail)) {
      this.setData({
        title: "添加标记"
      });
    } else {
      this.setData({
        title: "删除标记"
      });
    }
  },
  calendarBtn: function (e) {
    let calendarDate = wx.getStorageSync("calendarDate");
    let selectdate = this.data.selectdate;
    if (-1 == calendarDate.indexOf(selectdate)) {
      this.doAddFlag();
    } else {
      this.doDelFlag();
    }
  },
  doAddFlag: function () {
    this.setData({
      hiddenmodalput: false
    })
  },
  cancel: function () {
    let data = {
      date: this.data.selectdate,
      username: this.data.username,
      flag: 0
    };
    this.addToDataBase(data);
  },
  confirm: function () {
    let data = {
      date: this.data.selectdate,
      username: this.data.username,
      flag: 1
    };
    this.addToDataBase(data);
  },
  addToDataBase: function (data) {
    let a = this;
    wx.cloud.database().collection("myPeriod").add({
      data: data,
      success: function (e) {
        wx.showModal({
          title: "新建记录",
          content: "添加成功",
          showCancel:
          !1
        }), a.hideModal(), a.onLoad(), a.selectComponent("#calendar").thisMonth(), a.setData({
          title: "删除标记"
        });
      },
      fail: console.error
    });
  },
  hideModal: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  doDelFlag: function (e) {
    var t = this.data, a = this, n = this.data.selectdate, o = wx.getStorageSync("calendarDate");
    wx.showModal({
      cancelColor: "red",
      cancelText: "取消",
      confirmColor: "green",
      confirmText: "删除",
      content: n,
      showCancel: !0,
      title: "删除标记",
      success: function (e) {
        if (e.confirm) {
          var t = wx.cloud.database();
          var c = a.data.myPeriod[o.indexOf(n)]._id;
          t.collection("myPeriod").doc(c).remove({
            success: function (e) {
              wx.showModal({
                title: "删除记录",
                content: "删除成功",
                showCancel: !1
              }), a.hideModal(), a.onLoad(), a.selectComponent("#calendar").thisMonth(), a.setData({
                title: "添加标记"
              });
            },
            fail: console.error
          }), o.splice(o.indexOf(n), 1), wx.setStorage({
            key: "calendarDate",
            data: o
          });
        } else e.cancel && console.log("用户点击取消");
      },
      fail: function (e) { },
      complete: function (e) { }
    });
  },
  changeTab: function (e) {
    var t = e.currentTarget.dataset.id, a = "添加标记";
    1 == t && (a = "添加标记"), this.setData({
      choose: t,
      title: a
    });
  },
  onLoad: function (t) {
    var a = this, n = this;
    wx.getStorage({
      key: "username",
      success: function (e) {
        n.setData({
          username: e.data
        });
      },
      fail: function (e) {
        console.log(e);
      }

    }), wx.cloud.callFunction({
      name: "getMyType",
      data: {
        name: "myPeriod"
      },
      success: function (t) {
        const isLargeDate = [];
        let lastDate = null;
        for (var o = [], c = 0; c < t.result.data.length; c++) {
          o.push(t.result.data[c].date);
          if (t.result.data[c].flag) isLargeDate.push(t.result.data[c].date);
          lastDate = t.result.data[c].date;
        }
        wx.setStorage({
          key: "calendarDate",
          data: o
        });
        wx.setStorage({
          key: "isLargeDate",
          data: isLargeDate
        });
        var l = t.result.data;
        l = l.sort(function (e, t) {
          return e.date.replace(/-/g, "") - t.date.replace(/-/g, "");
        });
        var s = new Date(l[l.length - 1].date.replace(/-/g, "/")),
          i = new Date(),
          d = i.getFullYear(),
          r = i.getMonth() + 1,
          u = i.getDate(),
          f = new Date(d + "/" + r + "/" + u),
          g = Math.abs(s.getTime() - f.getTime()),
          h = parseInt(g / 864e5);
        n.setData({
          myPeriod: l,
          lastday: l[l.length - 1].date,
          distance: h
        });
        if (lastDate) {
          n.setData({
            lastday: lastDate
          });
          n.predictNextPeriodDate();
        }
        for (var m = [], w = l[0].date, x = 1, D = 0; D < l.length; D++) D == l.length - 1 || e.nextdate(l[D].date) != l[D + 1].date ? (m.push({}),
          m[m.length - 1].date = w + " ~ " + l[D].date,
          m[m.length - 1].num = x, w = l[D + 1] && l[D + 1].date, x = 1) : x++;
        m = m.reverse(), a.setData({
          huizong: m
        });

      }
    });
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { }
});
