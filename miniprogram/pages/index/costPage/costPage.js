var t = require("../../../@babel/runtime/helpers/interopRequireDefault"), e = t(require("../../../@babel/runtime/helpers/toConsumableArray")), a = t(require("../../../@babel/runtime/helpers/defineProperty"));
const app = getApp();
function o(t, e) {
    var a = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(t);
        e && (o = o.filter(function(e) {
            return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })), a.push.apply(a, o);
    }
    return a;
}

function n(t) {
    for (var e = 1; e < arguments.length; e++) {
        var n = null != arguments[e] ? arguments[e] : {};
        e % 2 ? o(Object(n), !0).forEach(function(e) {
            (0, a.default)(t, e, n[e]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : o(Object(n)).forEach(function(e) {
            Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e));
        });
    }
    return t;
}

Page({
    data: {
        hiddenmodalput: !0,
        place: "",
        selected: {},//添加记录中选中的
        selected1:{},//搜索框中tag选中的
        allTime: [],
        dateCost: [],
        selectdateCost:[],
        selectCost:[],
        searchdate:'',//搜索日期
        selecttag:[
            {_id: "1", typename: "标签", detail: "标签"},
            {_id: "2", typename: "时间", detail: "标签"},
        ],
        tagind:0,
        tagdetail:[
        ],//搜索标签
        showNum:15,//显示条数
        canshowMore:1,
        userConfig:app.getUserConfig(),
        allCostImg:app.getImgSrc('消费总额.png'),
        costHistory:app.getImgSrc('消费记录.png'),
    },
    getAllTime: function() {
        for (var t = this.data.allCost, e = [], a = 0; a < t.length; a++) e.push(t[a].time.substring(0, 10));
        this.setData({
            allTime: e
        }), console.log(e);
    },
    showDetail: function(t) {
        var e = t.target.dataset.id;
        console.log(t.target.dataset.id, this.data.allType[e]);
        var a = this.data.allType[e];
        this.setData({
            hiddenmodalput: !1,
            tip: "修改标签",
            mark: a.detail,
            theme: a.typename
        });
    },
    change: function(t) {
        console.log(t);
        this.setData({
            selected: n({}, t.detail)
        });
    },
    change1: function(t) {
        console.log(t);
        this.setData({
            selected1: n({}, t.detail)
        });
    },
    close: function() {
        this.selectComponent("#select").close();
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
    inputPrice: function(t) {
        this.setData({
            price: t.detail.value
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
    changeDate1: function(t) {
        this.setData({
            searchdate: t.detail.value
        });
    },
    inputMark: function(t) {
        this.setData({
            mark: t.detail.value
        });
    },
    addCost: function(t) {
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
        var e = this.data;
        wx.cloud.database().collection("myCost").add({
            data: {
                ctype: e.selected.name,
                place: e.place,
                price: e.price,
                time: e.nowdate + " " + e.nowtime,
                username: t.data.username,
                mark: e.theme
            },
            success: function(e) {
                wx.showModal({
                    title: "新建记录",
                    content: "添加成功",
                    showCancel: !1
                }), t.onLoad();
            },
            fail: console.error
        });
    },
    delCost: function(t) {
        console.log(t);
        var e = t.currentTarget.dataset.id, a = this;
        console.log(t.target.dataset.id, this.data.allCost[e]);
        var o = this.data.allCost[e]._id;
        wx.showModal({
            title: "删除记录",
            content: "确定删除",
            success: function(t) {
                t.confirm ? (console.log("用户点击确定"), wx.cloud.database().collection("myCost").doc(o).remove({
                    success: function(t) {
                        console.log("成功"), wx.showToast({
                            title: "删除成功"
                        }), a.onLoad();
                    },
                    fail: function(t) {
                        console.log(t);
                    }
                })) : t.cancel && console.log("用户点击取消");
            }
        });
    },
    place: function(t) {
        var e = this;
        wx.getLocation({
            type: "wgs84",
            success: function(t) {
                console.log(t), e.setData({
                    latitude: t.latitude,
                    longitude: t.longitude
                });
            },
            fail: function(t) {
                console.log(t);
            }
        }), wx.chooseLocation({
            success: function(t) {
                console.log(t), e.setData({
                    place: t.address
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    searchbtn(e){
        wx.showLoading({
          title: 'search……',
        })
        let allCost = this.data.allCost,
            selected1 = this.data.selected1,
            tj = '',
            selectCost = [],
            dateCost = [],
            datelist = [];
        if(selected1.id == 1){
            tj = this.selectComponent('#tagdetail').data.current.name;
        }else if(selected1.id == 2){
            tj = this.data.searchdate;
        }
        if(tj == '标签名' || tj == ''){
            this.setData({
                selectCost:allCost,
                selectdateCost:this.data.dateCost,
            })
            // this.showMore(this.data.allCost);
            wx.hideLoading({
              success: (res) => {
                // console.log(tj,datelist,dateCost);
              },
            })
            return;
        }
        this.setData({
            canshowMore:0,
        })
        for(let i = 0; i < allCost.length;i++){
            //按标签筛选
            if(selected1.id == 1 && allCost[i].ctype == tj){
                selectCost.push(allCost[i]);
                let ind = datelist.indexOf(allCost[i].date);
                if(ind > -1){
                    dateCost[ind].price += parseFloat(allCost[i].price);
                }else{
                    datelist.push(allCost[i].date);
                    let tmp = {"date":allCost[i].date,
                                "price":parseFloat(allCost[i].price)};
                    dateCost.push(tmp); 
                }
            }else if(selected1.id == 2 && allCost[i].date == tj){//按时间筛选
                selectCost.push(allCost[i]);
                let ind = datelist.indexOf(allCost[i].date);
                if(ind > -1){
                    dateCost[ind].price += parseFloat(allCost[i].price);
                }else{
                    datelist.push(allCost[i].date);
                    let tmp = {"date":allCost[i].date,
                                "price":parseFloat(allCost[i].price)};
                    dateCost.push(tmp); 
                }
            }
        }
        for(let i = 0; i < dateCost.length;i++){
            dateCost[i].price = dateCost[i].price.toFixed(2);
        }
        this.setData({
            selectCost:selectCost,
            selectdateCost:dateCost
        })
        wx.hideLoading({
          success: (res) => {
            console.log(tj,datelist,dateCost);
          },
        })
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
                name: "myCost"
            },
            success: function(t) {
                for (var o = t.result.data, n = [], s = {}, l = 0, i = 0; i < o.length; i++) {
                    var c = o[i].time.substring(0, 10);
                    l += parseFloat(o[i].price), n.push(c), o[i].date = n[i];
                }
                n = (0, e.default)(new Set(n)), console.log("sumCost", l);
                for (var r = 0; r < o.length; r++) {
                    var d = o[r].time.substring(0, 10);
                    s[d] ? s[d] += parseFloat(o[r].price) : s[d] = parseFloat(o[r].price), s[d] = s[d];
                }
                for (var u = {}, h = 0; h < n.length; h++) {
                    var p = {};
                    p.date = n[h], p.price = s[n[h]], u[h] = p, u[h].price = u[h].price.toFixed(2);
                }
                
                console.log("dateCost", s, u), a.setData({
                    allCost: o,
                    dateCost: u,
                    selectCost:o,
                    selectdateCost:u
                }), console.log("allCost:", t.result.data);
                // a.showMore(o);
            }
        }), wx.cloud.callFunction({
            name: "getMyType",
            data: {
                name: "myType"
            },
            success: function(t) {
                a.setData({
                    allType: t.result.data,
                    tagdetail:t.result.data,
                }), console.log("allType:", t.result.data);
            }
        });
    }, 
    showMore: function(allcost){
        let a = this;
        let showNum = a.data.showNum,
        selectCost = a.data.selectCost,
        selectdateCost = [],
        datelist = [],
        o = allcost;
        for(let j = selectCost.length; j < showNum; j++){
            selectCost.push(o[j]);
            if(datelist.indexOf(o[j].date) != -1){
                let price = parseFloat(selectdateCost[datelist.indexOf(o[j].date)].price) 
                + 
                parseFloat(o[j].price);
                selectdateCost[datelist.indexOf(o[j].date)].price = price.toFixed(2);
                
            }else{
                datelist.push(o[j].date);
                let tmp = {};
                tmp.date = o[j].date;
                tmp.price = parseFloat(o[j].price).toFixed(2);
                selectdateCost.push(tmp);
            }
        }
        a.setData({
            selectdateCost:selectdateCost,
            selectCost:selectCost,
        })
        },
    onPullDownRefresh: function() {
        console.log("111"), this.onLoad();
    },
    onReachBottom: function() {
        // let showNum = this.data.showNum,
        //     allcost = this.data.allCost,
        //     canshowMore = this.data.canshowMore;
        //     console.log(canshowMore);
        // if(canshowMore == 1){
        //     this.setData({
        //         showNum:showNum + 15
        //     })
        //     this.showMore(allcost);
        // }
    }
});