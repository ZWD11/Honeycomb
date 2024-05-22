// miniprogram/pages/index/toCostNew/formList/formList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput:true,
    hiddenmodalput1:true,
    theme:'',
    mark:'',
    tip:'添加表单',
    username:'',
    formList:'',
    delBtnList:[],
    delBtnShow:false,
    item:'',
    addItemId:'',
    addItemIndex:''
  },
  //wxShowToast
  wxShowToast(title='成功',icon='success',duration='1000'){
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  },
  //调用云函数
  callFunctiom(name,db,_id,data){
    return wx.cloud.callFunction({
      name: name,
      data:{
        db: db,
        _id:_id,
        data: data,
      }
    })
  },
  showDelFormItem(){
    this.setData({
      delBtnShow:!this.data.delBtnShow
    })
  },
  showContent(e){
    let index = e.currentTarget.dataset.index;
    let delBtnList = this.data.delBtnList;
    delBtnList[index] = !delBtnList[index];
    this.setData({
      delBtnList:delBtnList
    })
  },
  deleteItem(e){
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let _this = this;
    wx.showModal({
      title: '删除',
      content: '确定删除\"'+ id +'\"',
      success (res) {
        if (res.confirm) {
          wx.showLoading({title: '正在删除...',});
          _this.callFunctiom('dbDel','myFormList',id,{}).then(res=>{
            let delBtnList = _this.data.delBtnList;
            let formList = _this.data.formList;
            delBtnList.splice(index,1);
            formList.splice(index,1);
            _this.setData({
              delBtnList:delBtnList,
              formList:formList
            })
            _this.wxShowToast('已删除','success','1000');
          }).catch(err => {
            console.log("dbDel",err);
            _this.wxShowToast('删除失败','error','1000');
          }).finally(t=>{
            wx.hideLoading({});
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  //添加表单弹窗
  showAddFormItem(){
    this.setData({
      hiddenmodalput:false
    })
  },
  //添加项目弹窗
  showAddFormItemItem(e){
    // console.log(e);
    this.setData({
      addItemId:e.currentTarget.dataset.id,
      addItemIndex:e.currentTarget.dataset.index
    })
    this.setData({
      hiddenmodalput1:false
    })
  },

  removeItem(e){
    const _this = this;
    let formList = this.data.formList;
    let addItemId = e.currentTarget.dataset.id,
        addItemIndex = e.currentTarget.dataset.index,
        addItemIndex2 = e.currentTarget.dataset.index2,
        item = e.currentTarget.dataset.item;
    let para = this.data.allData[addItemIndex];
    delete para[item];
    delete para._openid;
    delete para._id;
    console.log(para);
    wx.showModal({
      title: '移除项目',
      content: '确定移除'+ item +'',
      success (res) {
        if (res.confirm) {
          _this.callFunctiom('dbSet','myFormList',addItemId,para).then(res=>{
            formList[addItemIndex].list.splice(addItemIndex2,1);
            _this.setData({
              formList:formList
            })
            _this.wxShowToast('已移除','success','1000');
          }).catch(err=>{
            console.log('err',err);
            _this.wxShowToast('移除失败','error','1000');
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //取消表单弹窗
  cancelAddFormItem(){
    this.setData({
      hiddenmodalput:true
    })
  },

  //取消项目弹窗
  cancelAddFormItemItem(e){
    this.setData({
      hiddenmodalput1:true
    })
  },
  //添加表单
  confirmAddFormItem(e){
    wx.showLoading({
      title: '请稍等……',
    });
    let _this = this;
    let para = {
      _id:this.data.theme,
      detail: this.data.mark,
      username: this.data.username
    };
    this.callFunctiom('dbAdd','myFormList','',para).then(res=>{
      wx.showModal({
          title: "添加表单",
          content: "已成功添加到表单列表中",
          showCancel: !1
      });
      _this.setData({
        hiddenmodalput:true,
        theme:''
      });
      let formList = _this.data.formList,
          delBtnList = _this.data.delBtnList;
      formList.push(para);
      delBtnList.push(false);
      _this.setData({
        formList:formList,
        delBtnList:delBtnList
      })
      wx.hideLoading({});
      // _this.getFormList();

    }).catch(err=>{
      console.log('confirmAddFormItem->dbAdd',err);
      _this.wxShowToast('添加失败','error','1000');
    })
  },
  //添加项目
  confirmAddFormItemItem(e){
    let formList = this.data.formList;
    let item = this.data.item;
    let addItemId = this.data.addItemId;
    let addItemIndex = this.data.addItemIndex;
    let para = {};
    para[item] = item;
    // console.log('item',item,'addItemId',addItemId,'addItemIndex',addItemIndex);
    this.callFunctiom('dbUpdate','myFormList',addItemId,para).then(res=>{
      formList[addItemIndex].list.push(item);
      this.setData({
        formList:formList
      })
      _this.wxShowToast('添加成功','success','1000');
    }).catch(err=>{
      console.log('confirmAddFormItemItem->dbUpdate',err);
      _this.wxShowToast('添加失败','error','1000');
    })
    this.setData({
      hiddenmodalput1:true,
      item:''
    })
  },
  
  inputItem: function(t) {
    this.setData({
      item: t.detail.value
    });
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

  formatFormList(data){
    let delBtnList = [];
    let exception = ["_openid","username","_id","detail"];
    let newData = [];
    for(let i = 0; i < data.length; i++){
      delBtnList.push(false);
      let list = [],temp = {};
      for(let key in data[i]){
        let flag = false;
        for(let j = 0; j < exception.length; j++){
          if(key == exception[j]){
            flag = true;
            break;
          }
        }
        if(flag){
          temp[key] = data[i][key];
        }else{
          list.push(key);
        }
      }
      temp.list = list;
      newData.push(temp);
    }
    console.log(newData);
    this.setData({
      formList:newData,
      delBtnList:delBtnList
    })
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
        // console.log('getFormList',res.result.data);
        this.setData({
          allData:res.result.data
        });
        this.formatFormList(res.result.data);
        wx.hideLoading();
      },
      fail:err=>{
        wx.hideLoading();
      }
    })
  },

  getUserInfo(){
    var a = this;
    wx.getStorage({
      key: "username",
      success: function(t) {
          console.log(t.data), a.setData({
              username: t.data
          });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
    this.getFormList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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