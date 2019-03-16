var GGlobal = {};
GGlobal.device = "Pc";
GGlobal.android = false;
GGlobal.ios = false;
GGlobal.touchable = false;
GGlobal.Event = { "Start": "mousedown", "Move": "mousemove", "End": "mouseup" };
GGlobal.Callback = {};

(function (na) {
    if (na.indexOf("Android") > 0) {
        GGlobal.device = "Android";
        GGlobal.android = true;
        GGlobal.touchable = true;
    } else if (na.indexOf("iPhone") > 0) {
        GGlobal.device = "iPhone";
        GGlobal.ios = true;
        GGlobal.touchable = true;
    } else if (na.indexOf("iPad") > 0) {
        GGlobal.device = "iPad";
        GGlobal.ios = true;
        GGlobal.touchable = true;
    }
}(navigator.userAgent));

if (GGlobal.touchable) {
    GGlobal.Event.Start = "touchstart";
    GGlobal.Event.Move = "touchmove";
    GGlobal.Event.End = "touchend";
}

var on = function (o,evt, fn) {
    if (document.addEventListener) {
        o.addEventListener(evt, fn);
    } else if (document.attachEvent) {
        o.attachEvent(evt, fn);
    }
};

var Gesture = function () {};

Gesture.prototype = {
    init : function (o) {
        this.o = o || document;
    },
    add : function (g, c) {
        var o = this.o;
        GGlobal.Callback[g] = c;
    },
    exec : function () {
        //var _gevent = new GEvent(this.o);
        //_gevent.MinDis = this.MinDis;
        //_gevent.MaxDis = this.MaxDis;
        //_gevent.OverValue = this.OverValue;
    }
}
Gesture.GEvent = Gesture.prototype.GEvent = (function () {
    var getEvent = function (e) {
        if (e.changedTouches) {
            e = e.changedTouches[0];
        }
        return e;
    }
    var coord = {};
    return {
        mindis: -50,
        maxdis: 50,
        overvalue: 1000,
        init: function (o) {
            var _this = this;
            console.log(_this);
            _this.o = o || document;
        },
        bind: function () {
            var _this = this;

            on(_this.o, GGlobal.Event.Start, function (e) {
                //e.preventDefault();
                e = getEvent(e);
                coord.initX = e.clientX;
                coord.initY = e.clientY;

                _this.exec("TouchStart", e);
            });
            on(_this.o, GGlobal.Event.Move, function (e) {
                // e.preventDefault();
                e = getEvent(e);

            });
            on(_this.o, GGlobal.Event.End, function (e) {
                e = getEvent(e);
                var _disX = e.clientX - coord.initX;
                var _disY = e.clientY - coord.initY;
                var boolOverstep = false;
                overvalue = _this.overvalue;
                if (_disX > _this.maxdis && !boolOverstep) {
                    _this.exec("SlideRight", e);
                } else if (_disX < _this.mindis && !boolOverstep) {
                    _this.exec("SlideLeft", e);
                }
                if (_disY > _this.maxdis && !boolOverstep) {
                    _this.exec("SlideDown", e);
                } else if (_disY < _this.mindis && !boolOverstep) {
                    _this.exec("SlideUp", e);
                };
                boolOverstep = true;
            });
        },
        exec: function (c, e) {
            if (GGlobal.Callback[c]) {
                GGlobal.Callback[c].call(this, e);
            }
        }
    }
}());
