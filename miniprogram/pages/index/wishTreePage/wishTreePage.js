var app = getApp();

Page({
    data: {
        choose: 0,
        wishlocal: [ [ 15, 40, 0 ], [ 23, 25, 7 ], [ 24, 39, 7 ], [ 25, 53, 7 ], [ 32, 20, 7 ], [ 33, 32, 7 ], [ 34, 45, 7 ], [ 35, 59, 7 ], [ 45, 20, -7 ], [ 44, 34, -7 ], [ 43, 48, -7 ], [ 41.5, 63, -7 ], [ 52, 16, 7 ], [ 53, 30, 7 ], [ 54, 45, 7 ], [ 55, 59, 7 ], [ 55, 72, 7 ], [ 66, 10, -7 ], [ 65, 24, -7 ], [ 64, 40, -7 ], [ 63, 56, -7 ], [ 62, 70, -7 ], [ 73, 2, 0 ], [ 73, 15, 0 ], [ 73, 27, 0 ], [ 73, 39, 0 ], [ 73, 52, 0 ], [ 73, 65, 0 ], [ 73, 78, 0 ] ],
        hiddenmodalput: !0,
        tip: "许愿",
        flag: 0,
        userConfig:app.getUserConfig(),
        treeImg:app.getImgSrc('f1ef5781051336643148cdd30bd38e5.png'),
        wishPoolImg:app.getImgSrc('许愿池.png'),
        wishPoolImg1:app.getImgSrc('许愿池1.png'),
        wishImg:app.getImgSrc('心愿.png'),
        wishImg1:app.getImgSrc('心愿1.png'),
    },
    modifUserConfig(){
        let userConfig = this.data.userConfig;
        for(let key in userConfig){
            userConfig[userConfig[key].nickName] = userConfig[key];
        }
        this.setData({
            userConfig:userConfig
        })
    },
    completeWish: function(t) {
        this.setData({
            choose: 1
        });
    },
    addWish: function(t) {
        this.setData({
            choose: 0
        });
    },
    inputDetail: function(t) {
        this.setData({
            wishdetail: t.detail.value
        });
    },
    inputWish: function(t) {
        this.setData({
            wish: t.detail.value
        });
    },
    check: function(t) {
        var a = t.currentTarget.dataset.id, i = this.data.wish1;
        this.setData({
            hiddenmodalput: !1,
            flag: 1,
            wish: i[a].wish,
            wishdetail: i[a].wishdetail,
            tip: "完成心愿",
            ind: a
        }), console.log(a);
    },
    update: function(a) {
        var i = this.data.ind, e = this.data.wish1, s = this, o = e[i]._id;
        console.log(o), wx.cloud.database().collection("myWish").doc(o).update({
            data: {
                wish: e.wish,
                wishdetail: e.wishdetail,
                username: app.getShowName(),
                achive: "1",
                achivetime: app.nowtime()
            }
        }).then(function(t) {
            console.log(t), s.setData({
                hiddenmodalput: !0
            }), s.onLoad();
        });
    },
    delete: function(t) {
        var a = this.data.ind, i = this.data.wish1, e = this;
        console.log(i, a);
        var s = i[a]._id;
        console.log(s), wx.cloud.database().collection("myWish").doc(s).remove({
            success: function(t) {
                console.log("成功"), wx.showToast({
                    title: "删除成功"
                }), e.setData({
                    hiddenmodalput: !0
                }), e.onLoad();
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    deletebtn: function(t) {
        var a = t.currentTarget.dataset.id, i = this.data.wish1;
        this.setData({
            hiddenmodalput: !1,
            flag: 2,
            wish: i[a].wish,
            wishdetail: i[a].wishdetail,
            tip: "删除心愿",
            ind: a
        }), console.log(a);
    },
    addbtn: function(t) {
        this.setData({
            hiddenmodalput: !1,
            flag: 0,
            wish: "",
            wishdetail: "",
            tip: "许愿"
        });
    },
    cancel: function() {
        this.setData({
            hiddenmodalput: !0
        });
    },
    confirm: function() {
        var t = this.data, a = this;
        wx.cloud.database().collection("myWish").add({
            data: {
                wish: t.wish,
                wishdetail: t.wishdetail,
                username: t.username,
                achive: "0"
            },
            success: function(t) {
                wx.showModal({
                    title: "新建记录",
                    content: "添加成功",
                    showCancel: !1
                }), a.setData({
                    hiddenmodalput: !0
                }), a.onLoad();
            },
            fail: console.error
        });
    },
    buttonStart: function(t) {
        this.setData({
            startPoint: t.touches[0]
        });
    },
    onLoad: function(t) {
        this.modifUserConfig();
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
                name: "myWish"
            },
            success: function(t) {
                for (var i = [], e = [], s = t.result.data, o = 0; o < s.length; o++) "0" == s[o].achive ? i.push(s[o]) : e.push(s[o]);
                a.setData({
                    allWish: s,
                    wish1: i,
                    wish2: e
                }), console.log("allWish:", s, "wish1", i, "wish2", e);
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh(), this.onLoad();
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {
        var t = app.getShowName();
        return t += "又有新的心愿啦，快来看看", console.log(t), {
            title: t,
            success: function(t) {
                t.errMsg;
            },
            fail: function() {
                "shareAppMessage:fail cancel" == res.errMsg || res.errMsg;
            }
        };
    }
});