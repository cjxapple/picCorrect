/// <reference path="../typings/jquery/jquery.d.ts" />
var Common;
(function (Common) {
    var PicCorrect = (function () {
        /**
         * This is a constructor
         *
         * @constructor
         * @param {string} str The value of default points
         */
        function PicCorrect(str) {
            this.JqEle = $(str);
            this.ele = this.JqEle[0];
            this.init();
        }
        /**
         * Get marks point-value
         *
         * @return {Array<IValue>}
         */
        PicCorrect.prototype.getValue = function () {
            var $markset = this.JqEle.children(".img-mark");
            if ($markset.length == 0)
                return null;
            var value = [];
            $markset.each(function (i, v) {
                var point = JSON.parse($(v).attr("value"));
                value.push(point);
            });
            this.JqEle.attr("value", JSON.stringify(value));
            return value;
        };
        /**
         * Scale function can zoom picture
         *
         * @param {number} percent The Scale value, It is a %
         * @return {void}
         */
        PicCorrect.prototype.Scale = function (percent) {
            var oimg = this.JqEle.children("img")[0];
            var srcHeight = oimg.naturalHeight;
            var srcWidth = oimg.naturalWidth;
            var maxHeight = parseInt(this.JqEle.css("max-height"));
            var maxWidth = parseInt(this.JqEle.css("max-width"));
            if (percent > 0) {
                if (srcWidth / srcHeight > 1) {
                    if (srcWidth == maxWidth) {
                        alert('can not scale anymore');
                        return;
                    }
                    if ((srcWidth - maxWidth) / srcWidth * 100 < percent) {
                        maxHeight *= (1 + (srcWidth - maxWidth) / srcWidth);
                        maxWidth = srcWidth;
                    }
                    else {
                        maxHeight *= (1 + percent / 100);
                        maxWidth *= (1 + percent / 100);
                    }
                }
                else {
                    if (srcHeight == maxHeight) {
                        alert('can not scale anymore');
                        return;
                    }
                    if ((srcHeight - maxHeight) / srcHeight * 100 < percent) {
                        maxWidth *= (1 + (srcHeight - maxHeight) / srcHeight);
                        maxHeight = srcHeight;
                    }
                    else {
                        maxHeight *= (1 + percent / 100);
                        maxWidth *= (1 + percent / 100);
                    }
                }
            }
            else {
                maxHeight *= (1 + percent / 100);
                maxWidth *= (1 + percent / 100);
            }
            $("#ctl-pic-correct").css("max-height", maxHeight.toFixed(0) + "px");
            $("#ctl-pic-correct").css("max-width", maxWidth.toFixed(0) + "px");
            $("#ctl-pic-correct img").css("max-height", maxHeight.toFixed(0) + "px");
            $("#ctl-pic-correct img").css("max-width", maxWidth.toFixed(0) + "px");
        };
        /**
         * Init picture correct control
         *
         * @return {void}
         */
        PicCorrect.prototype.init = function () {
            var _this = this;
            this.Value = [];
            if (this.JqEle.attr("value") != "") {
                var value = JSON.parse(this.JqEle.attr("value"));
                $.each(value, function (i, v) {
                    _this.addMark(v);
                });
            }
            this.JqEle.children("img").on("click", function (event) {
                var point = {
                    x: ((event.pageX - _this.JqEle.offset().left) * 1.0 / _this.JqEle.outerWidth() * 100).toFixed(2),
                    y: ((event.pageY - _this.JqEle.offset().top) * 1.0 / _this.JqEle.outerHeight() * 100).toFixed(2),
                    value: 1
                };
                //this.Value.push(value);
                _this.addMark(point);
            });
            this.JqEle.children("img").on("click", ".img-mark", function (event) {
                event.stopPropagation();
            });
            this.JqEle.on("click", ".btn-mark-increase", function (event) {
                var $mark = $(event.target).parents(".img-mark");
                var $value = $mark.children(".img-mark-value");
                var point = JSON.parse($mark.attr("value"));
                $value.text(parseInt($value.text()) + 1);
                point.value = parseInt($value.text());
                $mark.attr("value", JSON.stringify(point));
            });
            this.JqEle.on("click", ".btn-mark-decrease", function (event) {
                var $mark = $(event.target).parents(".img-mark");
                var $value = $mark.children(".img-mark-value");
                var point = JSON.parse($mark.attr("value"));
                $value.text(parseInt($value.text()) - 1);
                point.value = parseInt($value.text());
                $mark.attr("value", JSON.stringify(point));
                if ($value.text() == "0") {
                    $mark.remove();
                }
            });
        };
        /**
         * Add a mark into the picture area
         *
         * @param {Ivalue} point The value of point contains x,y,value
         * @return {void}
         */
        PicCorrect.prototype.addMark = function (point) {
            //this.JqEle.append("<div class='img-mark' value='" + JSON.stringify(point) + "' style='left:" + point.x + "%;top:" + point.y + "%'><a class='btn btn-mark-decrease'><i class='glyphicon glyphicon-minus-sign'></i></a>+<span class='img-mark-value'>" + point.value + "</span><a class='btn btn-mark-increase'><i class='glyphicon glyphicon-plus-sign'></i></a></div>");
            this.JqEle.append("<div class='img-mark'\n                                    value='" + JSON.stringify(point) + "'\n                                    style='left:" + point.x + "%; top:" + point.y + "%;'>\n                                  <a class='btn btn-mark-decrease'>\n                                    <i class='glyphicon glyphicon-minus-sign'></i>\n                                  </a>+<span class='img-mark-value'>" + point.value + "</span><a class='btn btn-mark-increase'>\n                                    <i class='glyphicon glyphicon-plus-sign'></i>\n                                  </a>\n                                </div>");
        };
        return PicCorrect;
    }());
    Common.PicCorrect = PicCorrect;
})(Common || (Common = {}));
//# sourceMappingURL=PicCorrect.js.map