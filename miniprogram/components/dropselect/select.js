var t = require("../../@babel/runtime/helpers/interopRequireDefault")(require("../../@babel/runtime/helpers/defineProperty"));

function e(t) {
    if ("undefined" == typeof Symbol || null == t[Symbol.iterator]) {
        if (Array.isArray(t) || (t = function(t, e) {
            if (!t) return;
            if ("string" == typeof t) return r(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            "Object" === n && t.constructor && (n = t.constructor.name);
            if ("Map" === n || "Set" === n) return Array.from(n);
            if ("Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return r(t, e);
        }(t))) {
            var e = 0, n = function() {};
            return {
                s: n,
                n: function() {
                    return e >= t.length ? {
                        done: !0
                    } : {
                        done: !1,
                        value: t[e++]
                    };
                },
                e: function(t) {
                    throw t;
                },
                f: n
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var i, a, o = !0, u = !1;
    return {
        s: function() {
            i = t[Symbol.iterator]();
        },
        n: function() {
            var t = i.next();
            return o = t.done, t;
        },
        e: function(t) {
            u = !0, a = t;
        },
        f: function() {
            try {
                o || null == i.return || i.return();
            } finally {
                if (u) throw a;
            }
        }
    };
}

function r(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var r = 0, n = new Array(e); r < e; r++) n[r] = t[r];
    return n;
}

function n(t, e) {
    var r = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
        var n = Object.getOwnPropertySymbols(t);
        e && (n = n.filter(function(e) {
            return Object.getOwnPropertyDescriptor(t, e).enumerable;
        })), r.push.apply(r, n);
    }
    return r;
}

Component({
    properties: {
        options: {
            type: Array,
            value: []
        },
        defaultOption: {
            type: Object,
            value: {
                id: "000",
                name: "标签名"
            }
        },
        key: {
            type: String,
            value: "id"
        },
        text: {
            type: String,
            value: "name"
        }
    },
    data: {
        result: [],
        isShow: !1,
        current: {}
    },
    methods: {
        optionTap: function(e) {
            var r = e.target.dataset;
            this.setData({
                current: r,
                isShow: !1
            }), this.triggerEvent("change", function(e) {
                for (var r = 1; r < arguments.length; r++) {
                    var i = null != arguments[r] ? arguments[r] : {};
                    r % 2 ? n(Object(i), !0).forEach(function(r) {
                        (0, t.default)(e, r, i[r]);
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : n(Object(i)).forEach(function(t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(i, t));
                    });
                }
                return e;
            }({}, r));
        },
        openClose: function() {
            this.setData({
                isShow: !this.data.isShow
            });
        },
        close: function() {
            this.setData({
                isShow: !1
            });
        }
    },
    lifetimes: {
        attached: function() {
            var t = [];
            if ("id" !== this.data.key || "name" !== this.data.text) {
                var r, n = e(this.data.options);
                try {
                    for (n.s(); !(r = n.n()).done; ) {
                        var i = r.value, a = i[this.data.key], o = i[this.data.text];
                        t.push({
                            id: a,
                            name: o
                        });
                    }
                } catch (t) {
                    n.e(t);
                } finally {
                    n.f();
                }
            }
            this.setData({
                current: Object.assign({}, this.data.defaultOption),
                result: t
            });
        }
    }
});