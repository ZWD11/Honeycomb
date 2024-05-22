const app = getApp();
require("../../common/wxcharts");

Page({
    data: {
        tabind: 0,
        tabinf: [ {
            img: app.getImgSrc('标记.png'),
            img1: app.getImgSrc('标记1.png'),
            id: 0,
            title: "页面0"
        }, {
            img: app.getImgSrc('标记.png'),
            img1: app.getImgSrc('标记1.png'),
            id: 1,
            title: "页面1"
        }, {
            img: app.getImgSrc('标记.png'),
            img1: app.getImgSrc('标记1.png'),
            id: 2,
            title: "页面2"
        }, {
            img: app.getImgSrc('标记.png'),
            img1: app.getImgSrc('标记1.png'),
            id: 3,
            title: "页面3"
        } ]
    },
    changeTabs: function(d) {
        this.setData({
            tabind: d.detail.ind
        });
    },
    onLoad: function(d) {},
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});