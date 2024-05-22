// miniprogram/pages/index/toCostNew/toCostNew.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flagImg:app.getImgSrc('钱.png'),
    username:'',
    allData:[],
    formList:[],
    cost:{},
    selectdate:'',
    allCost:0,
    chooseTabbar:'0',
    allCostList:{},
    bearCostList:{},
    peachCostList:{},
    userConfig:app.getUserConfig(),
    tabbar:[],
    hiddenmodalput:true,
    theme:'',
    mark:'',
    tip:'添加表单',
    addItemName:''
  },
  initData(){
    this.setData({
      formList:[],
      cost:{}
    })
  },
  //获取tabbar
  getTabBar(){
    const userConfig = this.data.userConfig;
    let tabbar = [];
    for(let key in userConfig){
      let tmp = {
        id:tabbar.length + 1,
        name:userConfig[key].nickName,
        icon:userConfig[key].icon
      }
      tabbar.push({...tmp});
    }
    tabbar.push({
      id:3,
      name:'乖乖',
      icon:app.getImgSrc('情侣.png'),
    });
    this.setData({
      tabbar:tabbar
    })
  },
  //调用云函数
  callFunctiom(name,db,_id,data){
    // console.log("name,db,_id,data",name,db,_id,data);
    return wx.cloud.callFunction({
      name: name,
      data:{
        db: db,
        _id:_id,
        data: data,
      }
    })
  },
  tabClick(e){
    let id = e.target.dataset.id;
    // console.log(e);
      this.setData({
        chooseTabbar:id
      })
    if(id == 1){
      this.setData({
        cost:this.data.bearCostList,
      })
    }else if(id == 2){
      this.setData({
        cost:this.data.peachCostList,
      })
    }else{
      this.calAllCostList();
      this.setData({
        cost:this.data.allCostList,
      })
    }
    this.calAllCost();
    this.refleshForm();
  },
  //刷新页面
  reflesh(){
    this.onLoad();
  },
  //刷新表单
  refleshForm(){
    let cost = this.data.cost;
    let sortBy = ['早餐','午餐','晚餐','宵夜','其它','其他'];
    let allData = [... this.data.allData];
    for(let i = 0; i < allData.length; i++){
      if(allData[i]._id != '其它') allData[i] = allData[i]._id;
    }
    allData.push('其它');
    let formList = [];
    for(let key in cost){
      let temp = {_id:'',list:[]};
      temp._id = key;
      for(let k in cost[key]){
        if(k !== 'cost') temp.list.push(k);
      }
      temp.list = temp.list.sort((a,b)=>{
        return sortBy.indexOf(a) - sortBy.indexOf(b);
      })
      formList.push({...temp});
    }
    formList = formList.sort((a,b)=>{
      return allData.indexOf(a._id) - allData.indexOf(b._id);
    })
    this.setData({
      formList:formList
    })
  },
  //wxShowToast
  wxShowToast(title='成功',icon='success',duration='1000'){
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  },
  //自定义添加
  addItem(e){
    let cost = this.data.cost;
    let money = this.data.mark;
    let item = this.data.theme;
    let addItem = this.data.addItemName;
    let formList = this.data.formList;
    let ind = -1;
    for(let i = 0; i < formList.length; i++){
      if(formList[i]._id == addItem){
        ind = i;
        break;
      }
    }
    cost[addItem].cost = parseFloat(cost[addItem].cost) + parseFloat(money);
    cost[addItem].cost = cost[addItem].cost.toFixed(2);
    cost[addItem][item] = money;
    formList[ind].list.push(item);
    this.setData({
      hiddenmodalput:true,
      cost:cost,
      formList:formList
    })
  },
  showAddFormItemModal(e){
    this.setData({
      hiddenmodalput:false,
      addItemName:e.target.dataset.id
    });
  },
  //取消项目弹窗
  cancel(e){
    this.setData({
      hiddenmodalput:true
    })
  },
  inputTheme: function(t) {
    this.setData({
        theme: t.detail.value
    });
  },
  inputMark: function(t) {
    this.setData({
        mark: t.detail.value
    });
  },
  //页面跳转
  toUrl: function(e) {
    let url = e.target.dataset.url;
    wx.navigateTo({
      url: url
    });
  },
  //监听输入框
  onChange(e) {
    let value = e.detail.value;
    let prop = e.currentTarget.dataset.prop;
    let id = e.currentTarget.dataset.id; 
    let cost = this.data.cost;
    cost[id][prop] = value;
    cost[id].cost = 0;
    for(let key in cost[id]){
      if(key != 'cost'){
        cost[id].cost = parseFloat(cost[id].cost) + (parseFloat(cost[id][key]) || 0);
        if(cost[id].cost != 0) cost[id].cost = cost[id].cost.toFixed(2);
      }
    }
    // console.log(prop)   //data-prop 绑定的字符串，以此来确定改变的是哪个变量
    this.setData({
      cost: cost
    })
    this.calAllCost();
  },
  bindblur(e){
    let value = e.detail.value;
    let prop = e.currentTarget.dataset.prop;
    let id = e.currentTarget.dataset.id; 
    let cost = this.data.cost;
    // console.log('bindblur',e);
    if(isNaN(value) || (value == '')){
      cost[id][prop] = 0;
      this.setData({
        cost: cost
      })
    }
    this.calAllCost();
  },

  calAllCost(){
    // console.log('calAllCost');
    let allCost = 0,
    cost = this.data.cost;
    for(let key in cost){
      allCost = parseFloat(allCost) + (parseFloat(cost[key].cost) || 0);
    }
    if(allCost != 0) allCost = allCost.toFixed(2);
    this.setData({
      allCost: allCost
    })
  },

  calAllCostList(){
    // console.log('calAllCostList');
    let allCostList = this.data.allCostList;
    let bear = this.data.bearCostList;
    let peach = this.data.peachCostList;
    for(let k in allCostList){
      Object.assign(allCostList[k],peach[k],bear[k]);
    }
    // console.log('-----allCostList-',allCostList);
    for(let key in allCostList){
      for(let key1 in allCostList[key]){
        allCostList[key][key1] = parseFloat(bear[key][key1] || 0) + parseFloat(peach[key][key1] || 0);
        allCostList[key][key1] = allCostList[key][key1].toFixed(2);
      }
    }
    this.setData({
      allCostList:allCostList
    })
    if(this.data.chooseTabbar == 3){
      this.setData({
        cost: allCostList
      })
      this.calAllCost();
    }
  },

  //获取选择日期的数据
  getCostData(selectdate){
    wx.showLoading({
      title: '获取数据中……',
    })
    let _this = this;
    // this.initData();
    this.callFunctiom('dbGet','myCostNew',selectdate,{}).then(res=>{
      // console.log('getCostData',res);
      let result = res.result;
      if(result != null){
        _this.formatFormCost(this.data.allData,result.data.cost||{},3);
        _this.formatFormCost(this.data.allData,result.data.bearCost||{},1);
        _this.formatFormCost(this.data.allData,result.data.peachCost||{},2);
      }else{
        _this.formatFormCost(this.data.allData,{},1);
        _this.formatFormCost(this.data.allData,{},2);
        _this.formatFormCost(this.data.allData,{},3);
      }
    }).catch(err=>{
      console.log('err',err);
      this.formatFormCost(this.data.allData,{},3);
      _this.formatFormCost(this.data.allData,{},2);
      _this.formatFormCost(this.data.allData,{},3);
    }).finally(p=>{
      this.calAllCost();
      this.refleshForm();
      setTimeout(() => {
        wx.hideLoading();
        this.calAllCostList();
      }, 200);
    })
    this.setData({
        selectdate: selectdate
    });
  },
  //日期选中回调
  select: function(e) {
    let selectdate = e.detail;
    this.getCostData(selectdate);
},
  //保存改变数据
  saveCost(){
    let cost = this.data.cost;
    let nowtime = app.nowtime();
    let para = {};
    let para1 = {};
    para.bearCost = this.data.bearCostList;
    para.peachCost = this.data.peachCostList;
    para.allCostList = this.data.allCostList;
    para1.bearCost = this.data.bearCostList;
    para1.peachCost = this.data.peachCostList;
    para1.allCostList = this.data.allCostList;
    para._id = this.data.selectdate;
    wx.showLoading({
      title: '正在保存……',
    })
    //云函数调用
    this.callFunctiom('dbAdd','myCostNew',para._id,para).then(res=>{
      //调用成功
      if(res.result == null){
        this.callFunctiom('dbSet','myCostNew',para._id,para1).then(res=>{
          // this.wxShowToast('已保存','success','1000');
        }).catch(err1=>{
          console.log("err1",err1);
          // this.wxShowToast('保存失败','error','1000');
        })
      }else{
        // this.wxShowToast('已保存','success','1000');
      }
    }).catch(err => {
      this.callFunctiom('dbSet','myCostNew',para._id,para1).then(res=>{
        // console.log('1111111',res);
      })
    }).finally(p=>{
      wx.hideLoading()
    })
  },

  //折叠面板
  showContent(e){
    let index = e.currentTarget.dataset.index;
    let delBtnList = this.data.delBtnList;
    delBtnList[index] = !delBtnList[index];
    this.setData({
      delBtnList:delBtnList
    })
  },
  //获取用户信息
  getUserInfo(){
    const userConfig = this.data.userConfig;
    let ind = 0;
    for(let key in userConfig){
      ind++;
      if(key == app.getUserInfo()) break;
    }
    this.setData({
      username: app.getUserInfo(),
      chooseTabbar: ind.toString()
    })
  },
  //需要排除的key
  exceptionKey(exception = ["_openid","username","_id","detail"], key){
    for(let j = 0; j < exception.length; j++){
      if(key == exception[j]){
        return true;
      }
    }
    return false;
  },
  //格式化消费信息
  formatFormCost(data,cost,flag){
    //需要排除的key
    let exception = ["_openid","username","_id","detail"];
    for(let i = 0; i < data.length; i++){
      let costTemp = {};
      costTemp.cost = 0;
      //初始化表单为0
      for(let key in data[i]){
        if(!this.exceptionKey(exception,key)){
          costTemp[key] = 0;
        }
      }
      //新增项
      if(cost[data[i]._id] == undefined){
        cost[data[i]._id] = costTemp;
      }else{
        for(let key in costTemp){
          cost[data[i]._id][key] = (parseFloat(costTemp[key]) + parseFloat(cost[data[i]._id][key])) || 0;
          cost[data[i]._id][key] = cost[data[i]._id][key].toFixed(2);
        }
      }
    }
    if(flag == 1){
      this.setData({
        bearCostList:cost
      })
    }else if(flag == 2){
      this.setData({
        peachCostList:cost
      })
    }else{
      this.setData({
        allCostList:cost
      })
    }
    // console.log("flag=",flag,'chooseTabbar=',this.data.chooseTabbar);
    if(flag == this.data.chooseTabbar){
      this.setData({
        cost:cost
      })
    }
  },
  //格式化列表
  formatFormList(data){
    // console.log('--------------',data);
    let delBtnList = [];
    let exception = ["_openid","username","_id","detail"];
    let newData = [];
    for(let i = 0; i < data.length; i++){
      delBtnList.push(false);
      let list = [],temp = {};
      for(let key in data[i]){
        if(this.exceptionKey(exception,key)){
          temp[key] = data[i][key];
        }else{
          if(key == '早餐') list.unshift(key);
          else list.push(key);
        }
      }
      temp.list = list;
      newData.push(temp);
    }
    this.setData({
      formList:newData,
      delBtnList:delBtnList
    })
        wx.hideLoading();
  },

  getFormList(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: "getMyType",
      data: {
          name: "myFormList"
      },
      success: res => {
        this.setData({
          allData:res.result.data
        });
        this.formatFormList(res.result.data);
      },
      fail:err=>{
        wx.hideLoading();
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
    this.getFormList();
    let nowtime = app.nowtime();
    nowtime = nowtime.substring(0,10);
    // this.getCostData(nowtime);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getTabBar();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})