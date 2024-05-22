// components/modalDialog/modalDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    formData:Array,
    hiddenmodalput:Boolean,
    tip:String,
    cancelText:String,
    confirmText:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    showFormData:[]
  },
  observers: {
    'formData': function (val) {
      if(val==null) return;
      this.setData({
        showFormData: val,
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    inputItem:function(e){
      let ind = e.target.dataset.ind;
      let val = e.detail.value;
      this.triggerEvent("inputItem", {ind:ind,val:val});
    },
    confirm:function(){
      console.log(this.data.confirmText);
      this.triggerEvent("confirm",{});
    },
    cancel:function(){
      console.log(this.data.cancelText);
      this.triggerEvent("cancel",{});
    },
    hideModal:function(){
      this.triggerEvent("hideModal",{});
    }

  }
})
