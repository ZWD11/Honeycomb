var t = getApp();

Page({
    data: {
        myType: [],
        allType: {},
        hiddenmodalput: !0,
        tip: "新添标签",
        flagImg1:t.getImgSrc('标签1.png'),
        addImg:t.getImgSrc('添加.png'),
    },
    getMyType: function() {
        for (var t = this.data.allType, a = [], e = 0; e < t.length; e++) a.push(t[e].typename);
        this.setData({
            myType: a,
            allType: t
        });
    },
    showDetail: function(t) {
        var a = t.target.dataset.id;
        console.log(t.target.dataset.id, this.data.allType[a]);
        var e = this.data.allType[a];
        this.setData({
            hiddenmodalput: !1,
            tip: "修改标签",
            mark: e.detail,
            theme: e.typename
        });
    },
    addType: function(t) {
        this.setData({
            hiddenmodalput: !this.data.hiddenmodalput,
            tip: "新添标签",
            mark: "",
            theme: ""
        });
    },
    inputTheme: function(t) {
        this.setData({
            theme: t.detail.value
        });
    },
    changeTime: function(t) {
        this.setData({
            nowtime: t.detail.value
        });
    },
    changeDate: function(t) {
        this.setData({
            nowdate: t.detail.value
        });
    },
    inputMark: function(t) {
        this.setData({
            mark: t.detail.value
        });
    },
    createMeeting: function(t) {
        this.setData({
            hiddenmodalput: !this.data.hiddenmodalput,
            nowdate: this.data.selectVal
        });
    },
    cancel: function() {
        this.setData({
            hiddenmodalput: !0
        });
    },
    confirm: function() {
        var t = this;
        this.setData({
            hiddenmodalput: !0
        });
        this.data.myType.indexOf(this.data.theme) > -1 ? (console.log("标签已存在"), wx.showModal({
            title: "提示",
            content: "改标签已存在",
            showCancel: !1
        })) : wx.cloud.database().collection("myType").add({
            data: {
                typename: this.data.theme,
                detail: this.data.mark,
                username: t.data.username
            },
            success: function(a) {
                wx.showModal({
                    title: "新建标签",
                    content: "已成功添加到标签列表中",
                    showCancel: !1
                }), t.onLoad();
            },
            fail: console.error
        });
    },
    delType: function(t) {
        var a = t.target.dataset.id, e = this;
        console.log(t.target.dataset.id, this.data.allType[a]);
        var n = this.data.allType[a], o = n._id;
        wx.showModal({
            title: "删除标签--#" + n.typename,
            content: "确定删除",
            success: function(t) {
                t.confirm ? (console.log("用户点击确定"), wx.cloud.database().collection("myType").doc(o).remove({
                    success: function(t) {
                        console.log("成功"), wx.showToast({
                            title: "删除成功"
                        }), e.onLoad();
                    }
                })) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(t) {
        var a = this;
        wx.getStorage({
            key: "username",
            success: function(t) {
                console.log(t.data), a.setData({
                    username: t.data
                });
            },
            fail: function(t) {
                console.log(t), a.setData({
                    hiddenmodalput: !1
                });
            }
        }), wx.cloud.callFunction({
            name: "getMyType",
            data: {
                name: "myType"
            },
            success: function(t) {
                a.setData({
                    allType: t.result.data
                }), console.log("allType:", t.result.data), a.getMyType();
            }
        });
    },
    onReady: function() {
        this.setData({
            nowdate: t.nowtime("y") + "-" + t.nowtime("M") + "-" + t.nowtime("d"),
            nowtime: t.nowtime("h") + ":" + t.nowtime("m")
        });
    },
    onShow: function() {
        console.log(this.data.myType, this.data.allType);
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});