const app = getApp();
Page({
    data: {
        choose: 0,
        title: "观影清单",
        tip:'添加清单',
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
        userConfig:app.getUserConfig(),
        formData:[
            {
                name:'filmName',
                cname:'电影名字',
                value:'',
                type:'input',
                placeholder:'电影名字',
            },
            {
                name:'filmInf',
                cname:'电影简介',
                value:'',
                type:'input',
                placeholder:'电影简介',
            },
            {
                name:'nowDate',
                cname:'日期',
                value:'',
                hide:true,
                type:'date',
                placeholder:'日期',
            },
            {
                name:'nowTime',
                cname:'具体时间',
                value:'',
                hide:true,
                type:'time',
                placeholder:'具体时间',
            },
            {
                name:'feel',
                cname:'观后感',
                value:'',
                hide:true,
                type:'input',
                placeholder:'观后感',
            }
        ]
    },
    inputItem:function(e){
        let formData = this.data.formData;
        formData[e.detail.ind].value = e.detail.val;
        this.setData({
            formData:formData
        });
    },
    hideData:function(){
        let hide = ['日期','具体时间','观后感'];
        let formData = this.data.formData;
        if(this.data.choose + '' == '0'){
            formData.map(item=>{
                if(hide.includes(item.cname)) item.hide = true;
            })
        }else{
            formData.map(item=>{
                item.hide = false;
            })
        }
        this.setData({
            formData:formData
        })
    },
    changeTab: function(t) {
        var n = t.currentTarget.dataset.id, e = "观影清单",f="添加清单";
        1 == n && (e = "观影记录",f="添加记录"), this.setData({
            choose: n,
            title: e,
            tip:f
        });
        this.hideData();
    },
    add: function(t) {
        this.setData({
            hiddenmodalput: !this.data.hiddenmodalput
        });
    },
    cancel: function() {
        console.log('cancel');
        this.setData({
            hiddenmodalput: !0,
            formData:[
              {
                  name:'filmName',
                  cname:'电影名字',
                  value:'',
                  type:'input',
                  placeholder:'电影名字',
              },
              {
                  name:'filmInf',
                  cname:'电影简介',
                  value:'',
                  type:'input',
                  placeholder:'电影简介',
              },
              {
                  name:'nowDate',
                  cname:'日期',
                  value:'',
                  hide:true,
                  type:'date',
                  placeholder:'日期',
              },
              {
                  name:'nowTime',
                  cname:'具体时间',
                  value:'',
                  hide:true,
                  type:'time',
                  placeholder:'具体时间',
              },
              {
                  name:'feel',
                  cname:'观后感',
                  value:'',
                  hide:true,
                  type:'input',
                  placeholder:'观后感',
              }
          ]
        });
    },
    arr2Obj:function(formData){
        let obj = {};
        formData.map(item=>{
            obj[item.name] = item.value;
        })
        return obj;
    },
    confirm: function() {
        var t = this.data, n = this;
        let data = this.arr2Obj(this.data.formData);
        wx.cloud.database().collection("myFilm").add({
            data: {
                filmname: data.filmName,
                inf: data.filmInf,
                feel: data.feel,
                time: data.nowDate + ' ' + data.nowTime,
                username: t.username,
                watch: t.choose + ''
            },
            success: function(t) {
                wx.showModal({
                    title: "新建记录",
                    content: "添加成功",
                    showCancel: !1
                }), n.setData({
                    hiddenmodalput: !0,
                    formData:[
                      {
                          name:'filmName',
                          cname:'电影名字',
                          value:'',
                          type:'input',
                          placeholder:'电影名字',
                      },
                      {
                          name:'filmInf',
                          cname:'电影简介',
                          value:'',
                          type:'input',
                          placeholder:'电影简介',
                      },
                      {
                          name:'nowDate',
                          cname:'日期',
                          value:'',
                          hide:true,
                          type:'date',
                          placeholder:'日期',
                      },
                      {
                          name:'nowTime',
                          cname:'具体时间',
                          value:'',
                          hide:true,
                          type:'time',
                          placeholder:'具体时间',
                      },
                      {
                          name:'feel',
                          cname:'观后感',
                          value:'',
                          hide:true,
                          type:'input',
                          placeholder:'观后感',
                      }
                  ]
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
        var n = t.currentTarget.dataset.id, e = this;
        var a = this.data.allFilm[n]._id;
        wx.showModal({
            title: "删除记录",
            content: "确定删除",
            success: function(t) {
                t.confirm ? e.delData(a) : '';
            }
        });
    },
    //获取数据
    getFilmList: function(){
        app.callFunctiom('getMyType','myFilm').then(res => {
        const allFilm = res.result.data;
        this.setData({
            allFilm:allFilm
        })
        }).catch(err=>{
        console.log('err',err);
        });
    },
    delData:function(id){
        wx.showLoading({
          title: '正在删除……',
        });
        app.callFunctiom('dbDel','myFilm',id).then(res=>{
          this.getFilmList();
          app.wxShowToast('已删除','success','1000');
        }).catch(err=>{
            console.log('err',err);
          app.wxShowToast('删除失败','error','1000');
        }).finally(last=>{
          wx.hideLoading();
        })
      },
    onLoad: function(t) {
        this.setData({
            username:app.getUserInfo()
        })
        var n = this, e = this;
        this.getFilmList(), wx.getSystemInfo().then(function(t) {
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