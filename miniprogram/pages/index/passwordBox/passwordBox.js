// miniprogram/pages/index/passwordBox/passwordBox.js
const app = getApp();
const ase = require('../../../utils/ase');

Page({

  /**
   * 页面的初始数据
   */
    
  data: {
    nickName:app.getShowName(),
    isFirst:true,
    topTip:'请输入密码',
    firstPassword:'',
    isPass:false,
    secretKey:'十六位十六进制数作为秘钥',
    formData:[
      {
          name:'platform',
          cname:'平台|软件',
          value:'',
          type:'input',
          placeholder:'平台|软件',
      },
        {
            name:'account',
            cname:'账号',
            value:'',
            type:'input',
            placeholder:'账号',
        },
        {
            name:'password',
            cname:'密码',
            value:'',
            type:'input',
            placeholder:'密码',
        },
        {
            name:'mark',
            cname:'备注',
            value:'',
            type:'textarea',
            placeholder:'备注',
        },
        {
            name:'secretKey',
            cname:'秘钥',
            value:'',
            type:'input',
            placeholder:'请输入秘钥',
            hide:true
        },
    ],
    tip:'添加信息',
    hiddenmodalput:true,
    passwordList:[],
    showPasswordList:[],
    showPasswordListKeys:[]
  },
   // 输入框获取焦点时禁用页面滚动
   onPasswordFocus() {
    document.body.style.overflow = 'hidden';
  },

  // 输入框失去焦点时恢复页面滚动
  onPasswordBlur() {
    document.body.style.overflow = 'auto';
  },
  inputItem:function(e){
      let formData = this.data.formData;
      formData[e.detail.ind].value = e.detail.val;
      this.setData({
          formData:formData
      });
  },
  cancel: function() {
      this.setData({
          hiddenmodalput: !0
      });
      this.clearFormData();
  },
  passwordComfirm:function(){
    const data = this.data.formData;
    const platform = data[0].value;
    const account = data[1].value;
    const password = data[2].value;
    const mark = data[3].value;
    if(platform.trim() == ''){
      wx.showToast({
        title: '请输入平台',
        icon:'none'
      });
      return;
    }
    if(account.trim() == ''){
      wx.showToast({
        title: '请输入账号',
        icon:'none'
      });
      return;
    }
    if(password.trim() == ''){
      wx.showToast({
        title: '请输入密码',
        icon:'none'
      });
      return;
    }

    let para = JSON.parse(JSON.stringify(this.data.passwordList));
    delete para._id;
    let key = platform + '|@_@|' + account;
    key = key.replace(/\./g,'文字点');
    para[key] = ase.Encrypt(password + '|@_@|' + mark,this.data.secretKey);
    this.updatePasswordList(para);
    this.setData({
        hiddenmodalput: !0
    });
    this.clearFormData();
  },
  secretKeyComfirm: function(){
    const secretKey = this.data.formData[4].value;
    if(secretKey.trim().length != 16){
      wx.showToast({
        title: '请输入16位秘钥',
        icon:'none'
      });
      return;
    }
    let para = JSON.parse(JSON.stringify(this.data.passwordList));
    delete para._id;
    delete para.password;
    for(const key in para){
        let val = ase.Decrypt(para[key],this.data.secretKey);
        para[key] = ase.Encrypt(val,secretKey);
    }
    this.updatePasswordList(para);
    wx.setStorageSync('secretKey', secretKey);
    this.setData({
        hiddenmodalput: !0,
        secretKey:secretKey
    });
    this.clearFormData();
  },
  confirm: function() {
    switch(this.data.tip){
      case '请输入密码':
        this.passwordComfirm();
        break;
      case '设置秘钥':
        this.secretKeyComfirm();
        break;
      case '修改信息':
        this.passwordComfirm();
        break;
      case '添加信息':
        this.passwordComfirm();
        break;
    }
  },
  updatePasswordList:function(para,operate = 'dbUpdate'){
    app.callFunctiom(operate,'myPassword',this.data.nickName,para).then(res1=>{
      this.getMyPassword();
    }).catch(err1 => {
      console.log('err',err1);
    })
  },
  clearFormData: function(){
    let formData = this.data.formData;
    for(let i = 0; i < formData.length; i++){
      formData[i].value = '';
    }
    this.setData({
        formData:formData
    });
  },
  addPassword: function(){
    this.setHide(['secretKey'],true);
    let formData = this.data.formData;
    formData[0].disabled = false;
    formData[1].disabled = false;
    this.setData({
        hiddenmodalput: false,
        tip:'添加信息',
        formData:formData
    });
  },
  setKey:function(e){
    this.setHide(['secretKey'],false);
    let formData = this.data.formData;
    formData[4].value = this.data.secretKey;
    this.setData({
        hiddenmodalput: false,
        tip:'设置秘钥',
        formData:formData
    });
  },
  setHide: function(nameList = [],flag = true){
    let formData = this.data.formData;
    for(let i = 0; i < formData.length; i++){
      if(nameList.includes(formData[i].name)) formData[i].hide = flag;
      else formData[i].hide = !flag;
    }
    this.setData({
        formData:formData
    });
  },
  getShowPasswordList: function(passwordList){
    const showPasswordList = {};
    for(const k in passwordList){
      if(k == '_id' || k == 'password') continue;
      const key = k.split('|@_@|');
      const val = ase.Decrypt(passwordList[k],this.data.secretKey).split('|@_@|');
      let list = showPasswordList[key[0]] || [];
      list.push({
        account:key[1],
        showAccount:key[1].replace(/文字点/g,'.'),
        password:val[0],
        mark:val[1] || ''
      })
      showPasswordList[key[0]] = list;
    }
    this.setData({
      showPasswordList:showPasswordList,
      showPasswordListKeys:Object.keys(showPasswordList)
    })
  },
  deletePasswort:function(e){
    let type = e.currentTarget.dataset.type;
    let content = '确定' + (type == 'type' ? 
                        '删除 ' + e.currentTarget.dataset.name + ' 所有密码？' : 
                        '删除账号 ' + e.currentTarget.dataset.account + ' 的信息？');
    wx.showModal({
        title: '删除密码',
        content: content,
        success: (t) => {
            t.confirm ? this.confirmDel(e) : '';
        }
    });
  },
  confirmDel: function(e){
    let type = e.currentTarget.dataset.type;
    let para = JSON.parse(JSON.stringify(this.data.passwordList));
    delete para._id;
    const name = e.currentTarget.dataset.name;
    const account = e.currentTarget.dataset.account || '';
    switch(type){
      case 'type':
        for(let k in para){
          if(k.split('|@_@|')[0] == name) delete para[k];
        }
        break;
      case 'item':
        let key = name + '|@_@|' + account;
        delete para[key];
        break;
    }
    this.updatePasswordList(para,'dbSet');
  },
  editPassword:function(e){
    this.setHide(['secretKey'],true);
    let formData = this.data.formData;
    formData[0].value = e.currentTarget.dataset.name;
    formData[1].value = e.currentTarget.dataset.item.showAccount;
    formData[2].value = e.currentTarget.dataset.item.password;
    formData[3].value = e.currentTarget.dataset.item.mark;
    formData[0].disabled = true;
    formData[1].disabled = true;
    this.setData({
        hiddenmodalput: false,
        formData:formData,
        tip:'修改信息'
    });
  },
   getMyPassword: function(){
     const nickName = this.data.nickName;
    app.callFunctiom('getMyType','myPassword',this.data.nickName).then(res => {
      res = res.result.data.filter(item=>{
        return item._id == nickName;
      })[0];
      this.getShowPasswordList(res);
      this.setData({
        topTip:res.password ? '请输入密码' : '请先设置密码',
        passwordList:res,
        isFirst:false
      })
    }).catch(err=>{
      console.log('err',err);
      this.setData({
        topTip:'请先设置密码',
      })
    });
  },
  changeDbPassword(){
    let para = JSON.parse(JSON.stringify(this.data.passwordList));
    delete para._id;
    const _this = this;
    para.password = this.data.firstPassword;
    app.callFunctiom('dbUpdate','myPassword',this.data.nickName,para).then(res1=>{
      _this.getMyPassword();
    }).catch(err1 => {
      console.log('err',err1);
    })
  },
  setPassword(){
    if(!this.data.isFirst) this.changeDbPassword();
    const _this = this;
    const data = '{\"_id\":\"' + this.data.nickName + '\",\"password\":\"' + this.data.firstPassword + '\"}';
    let para = JSON.parse(data);
    app.callFunctiom('dbAdd','myPassword','',para).then(res=>{
      _this.getMyPassword();
    }).catch(err=>{
      console.log('err',err);
    });
  },
  changePassword(e){
    this.setData({
      topTip:'请输入原始密码',
    })
  },
  getPassword(e){
    let chooseList = e.detail.chooseList.join('-');
    if(chooseList == '') return;
    let firstPassword = '';
    let topTip = this.data.topTip;
    let isPass = false;
    this.selectComponent('#password-lock').clearPoint();
    switch(this.data.topTip){
      case '请先设置密码':
        firstPassword = chooseList;
        topTip = '再次输入密码';
        break;
      case '再次输入密码':
        if(chooseList != this.data.firstPassword){
          wx.showToast({
            title: '两次输入密码不一致，请重新输入',
            icon:'none'
          });
          firstPassword='';
          topTip='请先设置密码';
        }else{
          this.setPassword();
          topTip='请输入密码';
        }
        break;
      case '请输入原始密码':
        firstPassword = '';
        if(chooseList != this.data.passwordList.password){
          wx.showToast({
            title: '密码错误，请重新输入',
            icon:'none'
          });
          topTip = '请输入原始密码';
        }else{
          topTip = '请先设置密码';
        }
        break;
      case '请输入密码':
        if(chooseList != this.data.passwordList.password){
          wx.showToast({
            title: '密码错误，请重新输入',
            icon:'none'
          });
        }else{
          firstPassword = '';
          topTip = '请输入密码';
          isPass = true;
        }
        break;
    }
    this.setData({
      firstPassword:firstPassword,
      topTip:topTip,
      isPass:isPass
    })
  },
  initData: function(){
    const secretKey = wx.getStorageSync('secretKey') || 'JYeontu666668888';
    this.setData({
      secretKey:secretKey
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData();
    this.getMyPassword();
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