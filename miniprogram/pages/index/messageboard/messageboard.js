// pages/index/messageboard/messageboard.js
const app = getApp();
Page({
  data: {
    inputBottom: 0,
    inputFocused: false,
    messages: [],
    userConfig:app.getUserConfig(),
    inputValue: '',
  },
handleInput(e) {
  this.setData({
    something: e.detail.value,
    inputValue: e.detail.value,
  });
},
  sendComment: function() {
    // 构建留言数据对象
    var t = this.data;
    const message = {
      username: app.getShowName(),
      something:t.something,
      achivetime: app.nowtime()
    };
    // 调用云函数将留言数据写入数据库
    wx.cloud.callFunction({
      name: 'getmessage',
      data: {
        message,
      },
      success: res => {
        console.log('留言成功:', res);
        // 将留言数据添加到 messages 数组中
        this.setData({
          messages: [...this.data.messages, message],
        });
        // 清空输入框
        this.setData({
          inputValue: '',
        });
      },
      fail: err => {
        console.error('留言失败:', err);
      },
    });
  },

  onShow: function() {
    // 监听键盘高度变化
    wx.onKeyboardHeightChange(res => {
      this.setData({
        inputBottom: res.height
      })
    })
     // 加载数据库中的留言
     this.loadMessages();
  },

  loadMessages: function() {
    wx.cloud.callFunction({
      name: 'getallmessage', // 调用新的云函数获取所有留言
      success: res => {
        console.log('获取留言成功:', res);
        this.setData({
          messages: res.result.data, // 更新 messages 数组
        });
      },
      fail: err => {
        console.error('获取留言失败:', err);
      },
    });
  },
  onHide: function() {
    wx.offKeyboardHeightChange() // 取消监听
  },

  deleteMessage: function (e) {
    const messageId = e.currentTarget.dataset.id;
    wx.cloud.callFunction({
      name: 'deletemessage',
      data: {
        id: messageId
      },
      success: res => {
        console.log('删除留言成功:', res);
        // 从 messages 数组中移除被删除的留言
        console.log(messageId);
        this.setData({
          messages: this.data.messages.filter(item => item._id !== messageId)
        });
      },
      fail: err => {
        console.error('删除留言失败:', err);
      }
    });
  },
})
