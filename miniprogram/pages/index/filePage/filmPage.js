const app = getApp();
Page({
    data: {
        choose: 0,
        title: "观影清单",
        btnTop: 0,
        btnLeft: 0,
        windowHeight: "",
        windowWidth: "",
        hiddenmodalput: !0,
        addImg1:app.getImgSrc('添加1.png'),
        watchImg:app.getImgSrc('观看.png'),
        watchImg1:app.getImgSrc('观看1.png'),
        watchHistoryImg:app.getImgSrc('历史观看.png'),
        watchHistoryImg1:app.getImgSrc('历史观看1.png'),

    },
    changeTab: function(t) {
        var n = t.currentTarget.dataset.id, e = "观影清单";
        1 == n && (e = "观影记录"), this.setData({
            choose: n,
            title: e
        });
    },
    add: function(t) {
        this.setData({
            hiddenmodalput: !this.data.hiddenmodalput
        });
    },
    inputFilmname: function(t) {
        this.setData({
            filmname: t.detail.value
        });
    },
    inputInf: function(t) {
        this.setData({
            inf: t.detail.value
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
    inputFeel: function(t) {
        this.setData({
            feel: t.detail.value
        });
    },
    cancel: function() {
        this.setData({
            hiddenmodalput: !0
        });
    },
    confirm: function() {
        var t = this.data, n = this;
        wx.cloud.database().collection("myFilm").add({
            data: {
                filmname: t.filmname,
                inf: t.inf,
                feel: t.feel,
                time: " ",
                username: t.username,
                watch: "0"
            },
            success: function(t) {
                wx.showModal({
                    title: "新建记录",
                    content: "添加成功",
                    showCancel: !1
                }), n.setData({
                    hiddenmodalput: !0
                }), n.onLoad();
            },
            fail: console.error
        });
    },
    buttonStart: function(t) {
        this.setData({
            startPoint: t.touches[0]
        });
    },
    buttonMove: function(t) {
        var n = this.data, e = n.startPoint, a = n.btnTop, o = n.btnLeft, i = n.windowWidth, l = n.windowHeight, s = n.isIpx, c = t.touches[t.touches.length - 1], d = c.clientX - e.clientX, u = c.clientY - e.clientY;
        e = c, (o += d) + 45 >= i && (o = i - 45), o <= 0 && (o = 0);
        var h = 100;
        (a += u) + (h = s ? 134 : 100) >= l && (a = l - h), a <= 43 && (a = 43), this.setData({
            btnTop: a,
            btnLeft: o,
            startPoint: e
        });
    },
    buttonEnd: function(t) {},
    del: function(t) {
        console.log(t);
        var n = t.currentTarget.dataset.id, e = this;
        console.log(t.target.dataset.id, this.data.allFilm[n]);
        var a = this.data.allFilm[n]._id;
        wx.showModal({
            title: "删除记录",
            content: "确定删除",
            success: function(t) {
                t.confirm ? (console.log("用户点击确定"), wx.cloud.database().collection("myFilm").doc(a).remove({
                    success: function(t) {
                        console.log("成功"), wx.showToast({
                            title: "删除成功"
                        }), e.onLoad();
                    },
                    fail: function(t) {
                        console.log(t);
                    }
                })) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    onLoad: function(t) {
        var n = this, e = this;
        wx.getStorage({
            key: "username",
            success: function(t) {
                e.setData({
                    username: t.data
                });
            },
            fail: function(t) {
                console.log(t), e.setData({
                    hiddenmodalput: !1
                });
            }
        }), wx.cloud.callFunction({
            name: "getMyType",
            data: {
                name: "myFilm"
            },
            success: function(t) {
                e.setData({
                    allFilm: t.result.data
                }), console.log("allFilm:", t.result.data);
            }
        }), wx.getSystemInfo().then(function(t) {
            console.log(t);
            var e = t.windowHeight, a = t.windowWidth, o = e - 134;
            n.setData({
                windowHeight: e,
                windowWidth: a,
                btnLeft: a - 45,
                btnTop: o
            });
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});