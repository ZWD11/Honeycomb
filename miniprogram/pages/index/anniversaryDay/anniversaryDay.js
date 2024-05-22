const app = getApp();

Page({
    data: {
        tabind: 0,
        tabinf: [ {
            img: app.getImgSrc('日期1.png'),
            img1: app.getImgSrc('日期.png'),
            id: 0,
            title: "查看"
        }, {
            img: app.getImgSrc('添加日期1.png'),
            img1: app.getImgSrc('添加日期.png'),
            id: 1,
            title: "添加"
        }],
        nowtime:'',
        nowdate:'',
        title:'',
        descript:'',
        allDayList:[],
        timer:[]
    },
    changeTabs: function(d) {
        this.setData({
            tabind: d.detail.ind
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
    inputTitle: function(t) {
      this.setData({
          title: t.detail.value
      });
    },
    inputDescript: function(t) {
      this.setData({
          descript: t.detail.value
      });
    },
    reset: function(t){
      const _this = this;
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'重置',
        content: "确定清空？",
        success: function(t){
          if(t.confirm){
            _this.resetData();
          }
        }
      })
    },
    wxShowToast: function(title='成功',icon='success',duration='1000'){
      wx.showToast({
        title: title,
        icon: icon,
        duration: parseInt(duration)
      })
    },
    add: function(t){
      const params = {
        title:this.data.title.trim(),
        descript:this.data.descript.trim(),
        date:this.data.nowdate.trim(),
        time:this.data.nowtime.trim(),
      };
      if(params.title.length == 0){
        this.wxShowToast('请输入主题','none','1000');
        return;
      }
      if(params.descript.length == 0){
        this.wxShowToast('请输入描述','none','1000');
        return;
      }
      if(params.date.length == 0){
        this.wxShowToast('请选择日期','none','1000');
        return;
      }
      if(params.time.length == 0){
        this.wxShowToast('请选择时间','none','1000');
        return;
      }
      wx.showLoading({
        title: '正在保存……',
      });
      this.callFunctiom('dbAdd','myAnniversaryDay',params).then(res=>{
        this.wxShowToast('已添加','success','1000');
        this.getDayList();
      }).catch(err=>{
        this.wxShowToast('添加失败','error','1000');
      }).finally(last=>{
        wx.hideLoading();
        this.resetData();
        this.getDayList();
      })
    },
    delItem:function(e){
      console.log(e);
      let ind = e.currentTarget.dataset.ind;
      let id = e.currentTarget.dataset.id;
      const _this = this;
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'删除',
        content: "确定删除？",
        success: function(t){
          if(t.confirm){
            _this.delData(id);
          }
        }
      })
    },
    delData:function(id){
      wx.showLoading({
        title: '正在删除……',
      });
      this.callFunctiom('dbDel','myAnniversaryDay',{id}).then(res=>{
        this.getDayList();
      }).catch(err=>{
        this.wxShowToast('删除失败','error','1000');
      }).finally(last=>{
        this.wxShowToast('已删除','success','1000');
        wx.hideLoading();
      })
    },
    resetData:function(){
      this.setData({
        nowtime:'',
        nowdate:'',
        title:'',
        descript:''
      });
    },
    getDayList:function(){
      wx.showLoading({
        title: '正在获取数据……',
      });
      this.callFunctiom('getMyType','myAnniversaryDay').then(res=>{
        if(res.result != null){
          const allDayList = res.result.data;
          this.formatData(allDayList);
        }
      }).catch(err=>{
        this.wxShowToast('获取失败','error','1000');
      }).finally(last=>{
        wx.hideLoading();
      })
    },
    cleatTimer:function(){
      let timer = this.data.timer;
      timer.map(item=>{
        clearTimeout(item);
      })
    },
    formatData:function(allDayList){
      this.cleatTimer();
      let timer = [];
      for(let i = 0; i < allDayList.length; i++){
        let preDay = new Date(allDayList[i].date + ' ' + allDayList[i].time).getTime();
        let nowDay = new Date().getTime();
        let Difference_In_Time = nowDay - preDay; 
        allDayList[i].Difference_In_Time = Difference_In_Time;
        let days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
        Difference_In_Time %= 1000 * 3600 * 24;
        let hours = Math.floor(Difference_In_Time / (3600 * 1000) );
        Difference_In_Time %= 1000 * 3600;
        let  minutes = Math.floor(Difference_In_Time / (60 * 1000) );
        Difference_In_Time %= 1000 * 60;
        let seconds = Math.floor(Difference_In_Time / 1000);
        allDayList[i].days = days;
        allDayList[i].hours = hours;
        allDayList[i].minutes = minutes;
        allDayList[i].seconds = seconds;
        allDayList[i].formatDate = days + '天 ' 
                                + (hours > 9 ? hours : ('0' + hours))
                                + ':' + (minutes > 9 ? minutes : ('0' + minutes))
                                + ':' + (seconds > 9 ? seconds : ('0' + seconds));
        timer.push(setTimeout(() => {
          this.formatData(allDayList);
        }, 1000));
      }
      allDayList = allDayList.sort((a,b)=>{
        return b.Difference_In_Time - a.Difference_In_Time;
      })
      this.setData({
        allDayList:allDayList,
        timer:timer
      })
    },
    //调用云函数
    callFunctiom(name,db,data = {}){
      // console.log("name,db,_id,data",name,db,_id,data);
      return wx.cloud.callFunction({
        name: name,
        data:{
          db: db,
          data: data,
          name:db,
          _id:data.id
        }
      })
    },
    onLoad: function() {
      this.getDayList();
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {
      this.cleatTimer();
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});