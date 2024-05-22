
Component({
    properties: {
        originImgUrls:Array
    },
    data: {
        imgUrls:[], 
        indicatorDots: !0,
        autoplay: !0,
        circular: !0,
        interval: 5e3,
        duration: 1e3,
        circular:true
    },
    methods: {
        delImg:function(e){
            this.triggerEvent("delImg", {id:e.target.dataset.id,img:e.target.dataset.img});
        }
    },
    observers: {
        'originImgUrls': function (val) {
          if(val==null) return;
          if (val.length > 0) {
            this.setData({
                imgUrls: val,
            })
          }
        }
      },
});