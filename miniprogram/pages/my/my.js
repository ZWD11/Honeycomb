// js
getApp();

Page({
  data: {
    userInfo: {},
    mode: [
      { icon: '/images/联系客服.png', text: '联系客服' },
      { icon: '/images/意见反馈.png', text: '意见反馈' }
    ],
    avatarUrl: '',
    nickName: '',
    contactInfo: '微信号：ZYS200219\r\nQQ号：3107412944' ,
  },
  initInfo() {
    let avatarUrl = wx.getStorageSync('avatarUrl') || '';
    let nickName = wx.getStorageSync('nickName') || '';
    let userInfo = {
      avatarUrl: avatarUrl,
      nickName: nickName
    };
    this.setData({
      userInfo: userInfo,
    })
  },
  getUserInfo(event) {
    let userInfo = event.detail.userInfo;
    console.log(userInfo);
    wx.setStorageSync('avatarUrl', userInfo.avatarUrl);
    wx.setStorageSync('nickName', userInfo.nickName);
    this.initInfo();
  },
  createCollections() {
    wx.showLoading({
      title: '初始化中',
    });
    let collections = ['myCost', 'myCostNew', 'myFilm', 'myFormList', 'myPeriod',
      'mySleepClock', 'myType', 'myWish', 'myAnniversaryDay',
      'myLoopImg', "myPassword", "mymessage", "completedChecks", "mycheck"
    ];
    let arr = [];
    for (let i = 0; i < collections.length; i++) {
      arr.push(
        wx.cloud.callFunction({
          name: 'dbCreate',
          data: {
            db: collections[i],
          }
        })
      );
    }
    Promise.all(arr)
      .then(res => {
        wx.hideLoading({});
        wx.showToast({
          title: '初始化成功',
        })
        console.log(res);
      }).catch(err => {
        wx.hideLoading({});
        wx.showToast({
          title: '初始化失败',
        })
        console.log('err', err);
      });
  },

  logout: function () {
    // 从存储中清除用户数据
    wx.removeStorageSync('avatarUrl');
    wx.removeStorageSync('nickName');

    // 更新 data 中的 userInfo（可选，用于视觉反馈）
    this.setData({
      userInfo: {}
    });
    // 显示退出成功的提示信息（可选）
    wx.showToast({
      title: '退出成功',
      icon: 'success',
      duration: 2000
    });
  },

  showContactInfo: function(event) {
    const index = event.currentTarget.dataset.index;
    let content = ";";
    if(index == 0){
      content = '微信号：ZYS200219\r\nQQ号：3107412944'; // 联系客服信息
    }else if(index == 1){
      content = '请将您的意见反馈至3107412944@qq.com'; // 意见反馈信息
    }
    wx.showModal({
      content: content,
      showCancel: false,
      confirmText: '我知道了',
    })
  },

  // wx.cloud.database();
  onLoad: function () {
    var s = this;
    this.initInfo();
  }
});
