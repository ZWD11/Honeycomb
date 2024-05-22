var e = require("../../@babel/runtime/helpers/interopRequireDefault")(require("../../@babel/runtime/helpers/defineProperty")), a = require("../common/wxcharts"), t = getApp();

Page({
    data: {
        byType: [],
        byPeople: []
    },
    pieCharts: function(e, t) {
        var n = 320;
        try {
            n = wx.getSystemInfoSync().windowWidth;
        } catch (e) {
            console.error("getSystemInfoSync failed!");
        }
        new a({
            animation: !0,
            canvasId: t,
            type: "pie",
            series: e,
            width: n,
            height: 300,
            dataLabel: !0
        });
    },
    columnCharts: function(a, t, n) {
        new Charts({
            canvasId: t,
            dataPointShape: !1,
            type: "column",
            legend: !1,
            categories: n,
            xAxis: {
                disableGrid: !0,
                type: "calibration"
            },
            series: [ {
                name: "成交量",
                data: a,
                color: "#2E3E5B"
            } ],
            yAxis: (0, e.default)({
                disableGrid: !1,
                gridColor: "#ffffff",
                fontColor: "#ffffff",
                min: 0,
                max: _this.data.max,
                disabled: !0
            }, "fontColor", "#ff6700"),
            dataItem: {
                color: "#ff6700"
            },
            width: code_w,
            height: code_h,
            extra: {
                column: {
                    width: 15
                }
            }
        });
    },
    lineCharts: function(e, t, n, r) {
        var i = 320;
        try {
            i = wx.getSystemInfoSync().windowWidth;
        } catch (e) {
            console.error("getSystemInfoSync failed!");
        }
        new a({
            canvasId: t,
            type: "line",
            categories: n,
            series: e,
            yAxis: {
                title: r,
                format: function(e) {
                    return e.toFixed(2);
                },
                min: 0
            },
            width: i,
            height: 300
        });
    },
    onLoad: function(e) {},
    onReady: function() {},
    onShow: function() {
        var e = this;
        wx.cloud.callFunction({
            name: "getMyType",
            data: {
                name: "myCost"
            },
            success: function(a) {
                var n = a.result.data, r = [], i = [], o = [], s = [], d = [], f = [], l = [], p = {}, c = [], u = [], h = {}, m = [];
                p.name = "all", p.format = function(e) {
                    return e.toFixed(2) + "元";
                }, p.data = [], h.name = "all", h.format = function(e) {
                    return e.toFixed(2) + "元";
                }, h.data = [];
                console.log()
                for (var x = 0; x < n.length; x++) {
                    var y = {}, g = {};
                    -1 == r.indexOf(n[x].ctype) ? (y.name = n[x].ctype, r.push(n[x].ctype), y.data = parseFloat(n[x].price), 
                    i.push(y)) : i[r.indexOf(n[x].ctype)].data += parseFloat(n[x].price), y = {}, g = {}, 
                    -1 == o.indexOf(n[x].username) ? (g.name = t.getUserConfig()[n[x].username].nickName, 
                    o.push(n[x].username), g.data = parseFloat(n[x].price), s.push(g)) : s[o.indexOf(n[x].username)].data += parseFloat(n[x].price), 
                    y = {}, g = {};
                    var v = "第" + t.getWeek(new Date(n[x].time)) + "周";
                    if (-1 == d.indexOf(v) ? (d.push(v), p.data.push(parseFloat(n[x].price))) : p.data[d.indexOf(v)] += parseFloat(n[x].price), 
                    -1 == l.indexOf(n[x].username)) l.push(n[x].username), y.format = function(e) {
                        return e.toFixed(2) + "元";
                    }, y.data = [], y.data[d.indexOf(v)] = y.data[d.indexOf(v)] ? y.data[d.indexOf(v)] + parseFloat(n[x].price) : parseFloat(n[x].price), 
                    y.name = t.getUserConfig()[n[x].username].nickName, f.push(y); else {
                        var F = l.indexOf(n[x].username);
                        f[F].data[d.indexOf(v)] = f[F].data[d.indexOf(v)] >= 0 ? f[F].data[d.indexOf(v)] + parseFloat(n[x].price) : parseFloat(n[x].price);
                    }
                    if (y = {}, g = {}, v = n[x].time.slice(0, 7), -1 == c.indexOf(v) ? (c.push(v), 
                    h.data.push(parseFloat(n[x].price))) : h.data[c.indexOf(v)] += parseFloat(n[x].price), 
                    -1 == m.indexOf(n[x].username)) m.push(n[x].username), y.format = function(e) {
                        return e.toFixed(2) + "元";
                    }, y.data = [], y.data[c.indexOf(v)] = y.data[c.indexOf(v)] ? y.data[c.indexOf(v)] + parseFloat(n[x].price) : parseFloat(n[x].price), 
                    y.name = t.getUserConfig()[n[x].username].nickName, u.push(y); else {
                        var O = m.indexOf(n[x].username);
                        u[O].data[c.indexOf(v)] = u[O].data[c.indexOf(v)] >= 0 ? u[O].data[c.indexOf(v)] + parseFloat(n[x].price) : parseFloat(n[x].price);
                    }
                }
                for (var w = 0; w < i.length; w++) i[w].datas = i[w].data.toFixed(2);
                for (var b = 0; b < s.length; b++) s[b].datas = s[b].data.toFixed(2);
                d = d.reverse(), f.push(p);
                for (var C = 0; C < f.length; C++) f[C].data = f[C].data.reverse();
                c = c.reverse(), u.push(h);
                for (var S = 0; S < u.length; S++) u[S].data = u[S].data.reverse();
                e.pieCharts(i, "pieCanvas"), e.pieCharts(s, "pieCanvas1"), e.lineCharts(f, "lineCanvas", d, "消费(元)"), 
                e.lineCharts(u, "lineCanvas1", c, "消费(元)"), console.log("byType", i), console.log("byPeople", s), 
                console.log("byWeeks", f, d), console.log("byMonths", h, c), e.setData({
                    byType: i,
                    byPeople: s
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});