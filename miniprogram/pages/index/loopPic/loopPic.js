const app = getApp()

Page({
  data: {
    logged: false,
    takeSession: false,
    requestResult: '',
    imgUrls: [],
    imgList:[]
  },

  onLoad: function() {
    this.getImgList();
  },
  //获取上传的图片
  getImgList: function(){
    //获取数据库中轮播图的url
    app.callFunctiom('getMyType','myLoopImg').then(res => {
      this.setData({
        imgUrls:res.result.data
      })
    }).catch(err=>{
      console.log('err',err);
    });
  },

  //删除数据库轮播图数据并删除文件
  delImg:function(e){
    const id = e.detail.id;
    const img = e.detail.img;
    const _this = this;
    wx.showModal({
      cancelColor: '#FF0000',
      title:'删除',
      content: "确定删除？",
      success: function(t){
        if(t.confirm){
          _this.delData(id);
          _this._removeFile(img);
        }
      }
    })
  },
  //删除数据库轮播图数据
  delData:function(id){
    wx.showLoading({
      title: '正在删除……',
    });
    app.callFunctiom('dbDel','myLoopImg',id).then(res=>{
      // console.log('re',res);
      this.getImgList();
      app.wxShowToast('已删除','success','1000');
    }).catch(err=>{
      app.wxShowToast('删除失败','error','1000');
    }).finally(last=>{
      wx.hideLoading();
    })
  },
  //删除文件
  _removeFile(img){
    wx.cloud.deleteFile({
      fileList:[img],
      success(res){
        // console.log(res,'删除文件')
      },
      fail(err){
        console.log(err)
      }
    })
  },
  // 上传图片
  doUpload: function () {
    const that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // console.log(res)
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        const timestamp = (new Date()).valueOf();//新建日期对象并变成时间戳
        const imgPath = "loopImg_"+timestamp+".jpg"; // 上传至云端的路径
        wx.cloud.uploadFile({
          cloudPath: '记账本/' + imgPath,
          filePath: filePath, // 小程序临时文件路径
          success: res => {
            // console.log('[上传文件] 成功：', res);
            const url = res.fileID;
            const data = {
              uploadTime:app.nowtime(),
              img:url
            }
            //数据库保存图片数据
            app.callFunctiom('dbAdd','myLoopImg','',data).then(res => {
              // console.log(res);
              that.getImgList();
            }).catch(err=>{
              console.log(err);
            });
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
