Component({
    properties: {
        tabinf: {
            type: Array,
            value: []
        },
        color:{
            type:String,
            value:'blue'
        },
        color1:{
            type:String,
            value:'grey'
        },
        defaultInd:{
            type:Number,
            value:0
        }
    },
    data: {
        tabind: 0
    },
    onLoad: function (options) {
        console.log(tabinf);
        this.setData({
            tabind:this.properties.defaultInd
        })
    },
    methods: {
        changeTab: function(t) {
            var a = t.currentTarget.dataset.id;
            this.setData({
                tabind: a
            }), this.triggerEvent("changeTabs", {
                ind: a
            });
        }
    }
});