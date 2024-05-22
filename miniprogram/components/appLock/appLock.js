// components/appLock/appLock.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    size:Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showSize:0,
    chooseList:[],
    points:[],
    showBorder:[]
  },
  observers: {
    'size': function (val) {
      if(val==null){
        val = 3;
      }
      this.setData({
          showSize: val,
      })
    }
  },
  ready: function() {
    const showBorder = new Array(this.properties.size * this.properties.size).fill(false);
    this.setData({
      showBorder:showBorder
    });
},
  /**
   * 组件的方法列表
   */
  methods: {
    mouseover(e){
      let points = this.data.points;
      let x = e.touches[0].pageX;
      let y = e.touches[0].pageY;
      let id = '';
      let showBorder = this.data.showBorder;
      for(let i = 0; i < points.length; i++){
        const p = points[i];
        // const r = (p.right - p.left) / 2;
        // const x1 = (p.left + p.right) / 2;
        // const y1 = (p.top + p.bottom) / 2;
        // if(Math.pow(x1 - x,2) + Math.pow(y1 - y,2) <= Math.pow(r,2)){
        //   id = p.dataset.id;
        //   showBorder[i] = true;
        //   break;
        // }
        if(x >= p.left && x <= p.right && y <= p.bottom && y >= p.top){
          id = p.dataset.id;
          showBorder[i] = true;
          break;
        }
      }
      let chooseList = this.data.chooseList;
      if(isNaN(parseInt(id)) || chooseList.includes(id)) return;
      chooseList.push(id);
      this.setData({
        chooseList:chooseList,
        showBorder:showBorder
      })
    },
    getPoints(){
      const query = this.createSelectorQuery();
      let id = '.j-apps-lock-point'
      query.selectAll(id).boundingClientRect((res)=>{
        this.setData({
          points:res
        })
      }).exec()
    },
    mouseup(){
      this.triggerEvent("getPassword", {chooseList:this.data.chooseList});
    },
    mousedown(e){
      this.clearPoint();
      if(this.data.points.length == 0) this.getPoints();
    },
    clearPoint(){
      const showBorder = new Array(this.properties.size * this.properties.size).fill(false);
      this.setData({
        chooseList:[],
        showBorder:showBorder
      })
    }
  }
})
