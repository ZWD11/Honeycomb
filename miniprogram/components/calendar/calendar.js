const app = getApp();
Component({
    properties: {
        defaultValue: {
            type: String,
            value: ""
        },
        weekText: {
            type: Array,
            value: [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ]
        },
        lastMonth: {
            type: String,
            value: "◀"
        },
        nextMonth: {
            type: String,
            value: "▶"
        }
    },
    data: {
        thisMonthDays: [],
        empytGridsBefore: [],
        empytGridsAfter: [],
        title: "",
        format: "",
        showmeeting: !0,
        year: 0,
        month: 0,
        date: 0,
        toggleType: "large",
        scrollLeft: 0,
        YEAR: 0,
        MONTH: 0,
        DATE: 0,
        flagImgSrc:app.getImgSrc('桃子.png'),
        flagImgSrc1:app.getImgSrc('苹果.png')
    },
    ready: function() {
        this.today(), console.log("加载日历组件");
    },
    methods: {
        toggleType: function() {
            this.setData({
                showmeeting: !this.data.showmeeting
            }), this.setData({
                toggleType: "mini" == this.data.toggleType ? "large" : "mini"
            }), this.display(this.data.year, this.data.month, this.data.date);
        },
        scrollCalendar: function(t, a, e) {
            var s = this, i = 0;
            wx.getSystemInfo({
                success: function(h) {
                    0 == e ? (i = 0, t == s.data.YEAR && a == s.data.MONTH && (i = 45 * s.data.DATE - h.windowWidth / 2 - 22.5)) : i = 45 * e - h.windowWidth / 2 - 22.5, 
                    s.setData({
                        scrollLeft: i
                    });
                }
            });
        },
        display: function(t, a, e) {
            this.setData({
                year: t,
                month: a,
                date: e,
                title: t + "年" + this.zero(a) + "月"
            }), this.createDays(t, a), this.createEmptyGrids(t, a), this.scrollCalendar(t, a, e);
        },
        refreshPage: function() {
            var t = (this.data.defaultValue ? new Date(this.data.defaultValue) : new Date()).getFullYear(), a = this.data.month, e = this.data.date;
            this.display(t, a, e), this.createDays(t, a);
        },
        today: function() {
            var t = this.data.defaultValue ? new Date(this.data.defaultValue) : new Date(), a = t.getFullYear(), e = t.getMonth() + 1, s = t.getDate(), i = a + "-" + this.zero(e) + "-" + this.zero(s);
            this.setData({
                format: i,
                select: i,
                year: a,
                month: e,
                date: s,
                YEAR: a,
                MONTH: e,
                DATE: s
            }), this.display(a, e, s), this.triggerEvent("select", i);
        },
        select: function(t) {
            var a = t.currentTarget.dataset.date, e = this.data.year + "-" + this.zero(this.data.month) + "-" + this.zero(a), s = this.data.year + "年" + this.zero(this.data.month) + "月", i = this.data.year, h = this.data.month;
            this.setData({
                title: s,
                select: e,
                date: a
            }), this.triggerEvent("select", e), this.scrollCalendar(i, h, a);
        },
        lastMonth: function() {
            var t = 1 == this.data.month ? 12 : this.data.month - 1, a = 1 == this.data.month ? this.data.year - 1 : this.data.year;
            this.display(a, t, 0);
        },
        nextMonth: function() {
            var t = 12 == this.data.month ? 1 : this.data.month + 1, a = 12 == this.data.month ? this.data.year + 1 : this.data.year;
            this.display(a, t, 0);
        },
        thisMonth: function() {
            var t = this.data.month, a = this.data.year;
            this.display(a, t, 0);
        },
        getThisMonthDays: function(t, a) {
            return new Date(t, a, 0).getDate();
        },
        createDays: function(t, a) {
            const isLargeDate = wx.getStorageSync("isLargeDate");
            for (var e = [], s = this.getThisMonthDays(t, a), i = wx.getStorageSync("calendarDate"), h = 1; h <= s; h++) {
                var n = 0;
                let isLarge = 0;
                null != i && i.indexOf(t + "-" + this.zero(a) + "-" + this.zero(h)) > -1 && (n = 1), 
                null != isLargeDate && isLargeDate.indexOf(t + "-" + this.zero(a) + "-" + this.zero(h)) > -1 && (isLarge = 1), 
                e.push({
                    date: h,
                    dateFormat: this.zero(h),
                    monthFormat: this.zero(a),
                    flag: n,
                    isLarge:isLarge,
                    week: this.data.weekText[new Date(Date.UTC(t, a - 1, h)).getDay()]
                });
            }
            this.setData({
                thisMonthDays: e
            });
        },
        createEmptyGrids: function(t, a) {
            for (var e = new Date(Date.UTC(t, a - 1, 1)).getDay(), s = [], i = [], h = 0 == e ? 7 : e, n = this.getThisMonthDays(t, a), r = a - 1 < 0 ? this.getThisMonthDays(t - 1, 12) : this.getThisMonthDays(t, a - 1), o = 1; o <= h; o++) s.push(r - (h - o));
            for (var d = 42 - n - h - 7 >= 0 ? 42 - n - h - 7 : 42 - n - h, l = 1; l <= d; l++) i.push(l);
            this.setData({
                empytGridsAfter: i,
                empytGridsBefore: s
            });
        },
        zero: function(t) {
            return t >= 10 ? t : "0" + t;
        }
    }
});