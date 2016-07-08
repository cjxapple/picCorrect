/// <reference path="../typings/jquery/jquery.d.ts" />
var Common;
(function (Common) {
    var initValue = 0.5;
    var stepValue = 0.5;
    var PicCorrect = (function () {
        /**
         * This is a constructor
         *
         * @constructor
         * @param {string} str The value of default points
         */
        function PicCorrect(str, disabled, max, callback) {
            if (disabled === void 0) { disabled = true; }
            this.max = 0;
            this.JqEle = $(str);
            this.ele = this.JqEle[0];
            this.disabled = disabled;
            if (!disabled) {
                if (callback)
                    this.callback = callback;
                if (max)
                    this.max = max;
            }
            this.init();
        }
        /**
         * Get marks point-value
         *
         * @return {Array<IValue>}
         */
        PicCorrect.prototype.getValue = function () {
            var value = [];
            var $markset = this.JqEle.children(".img-mark");
            //if ($markset.length == 0)
            //    return null;           
            $markset.each(function (i, v) {
                var point = JSON.parse($(v).attr("value"));
                value.push(point);
            });
            this.JqEle.attr("value", JSON.stringify(value));
            return value;
        };
        /**
         * Get marks total value
         *
         * @return {number}
         */
        PicCorrect.prototype.getTotalValue = function () {
            var total = 0;
            var $markset = this.JqEle.children(".img-mark");
            $markset.each(function (i, v) {
                total += JSON.parse($(v).attr("value")).value;
            });
            return total;
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
                        alert('已放大到原图不能再放大了。');
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
            if (this.disabled)
                return;
            this.JqEle.children("img").on("dblclick", function (event) {
                if (_this.getTotalValue() + stepValue > _this.max) {
                    alert("\u8D85\u51FA\u8BE5\u9898\u603B\u5206" + _this.max.toFixed(1) + "\u4E0D\u80FD\u518D\u589E\u52A0\u5206\u6570\u3002");
                    return;
                }
                var point = {
                    x: ((event.pageX - _this.JqEle.offset().left) * 1.0 / _this.JqEle.outerWidth() * 100).toFixed(2),
                    y: ((event.pageY - _this.JqEle.offset().top) * 1.0 / _this.JqEle.outerHeight() * 100).toFixed(2),
                    value: initValue
                };
                _this.addMark(point);
                if (_this.callback)
                    _this.callback(_this.getTotalValue());
            });
            this.JqEle.children("img").on("click", ".img-mark", function (event) {
                event.stopPropagation();
            });
            this.JqEle.on("click", ".btn-mark-increase", function (event) {
                var $mark = $(event.target).parents(".img-mark");
                var $value = $mark.children(".img-mark-value");
                var point = JSON.parse($mark.attr("value"));
                var newValue = parseFloat($value.text()) + stepValue;
                if (_this.getTotalValue() + stepValue > _this.max) {
                    alert("\u8D85\u51FA\u8BE5\u9898\u603B\u5206" + _this.max.toFixed(1) + "\u4E0D\u80FD\u518D\u589E\u52A0\u5206\u6570\u3002");
                    return;
                }
                $value.text(newValue.toFixed(1));
                point.value = newValue;
                $mark.attr("value", JSON.stringify(point));
                if (_this.callback)
                    _this.callback(_this.getTotalValue());
            });
            this.JqEle.on("click", ".btn-mark-decrease", function (event) {
                var $mark = $(event.target).parents(".img-mark");
                var $value = $mark.children(".img-mark-value");
                var point = JSON.parse($mark.attr("value"));
                var newValue = parseFloat($value.text()) - stepValue;
                $value.text(newValue.toFixed(1));
                point.value = newValue;
                $mark.attr("value", JSON.stringify(point));
                if (newValue <= 0) {
                    $mark.remove();
                }
                if (_this.callback)
                    _this.callback(_this.getTotalValue());
            });
            this.JqEle.on("click", ".img-mark-value", function (event) {
                var $span = $(event.target);
                var $input = $span.siblings("input.img-mark-value-edit");
                $input.width($span.width()).val($span.text());
                $span.hide();
                $input.show().focus().blur(function (event) {
                    $span.show();
                    $input.hide();
                    if ($input.val() != "" && !_this.validateNumber($input.val())) {
                        $input.val($span.text());
                        alert('只能填写数子。');
                        return;
                    }
                    var originalValue = parseFloat($span.text());
                    var newValue = parseFloat($input.val() == "" ? 0 : $input.val());
                    if (newValue > originalValue && _this.getTotalValue() + newValue - originalValue > _this.max) {
                        $input.val($span.text());
                        alert("\u8D85\u51FA\u8BE5\u9898\u603B\u5206" + _this.max.toFixed(1) + "\u4E0D\u80FD\u4FEE\u6539\u5206\u6570\u3002");
                        return;
                    }
                    var $mark = $(event.target).parents(".img-mark");
                    var point = JSON.parse($mark.attr("value"));
                    $span.text(newValue.toFixed(1));
                    point.value = newValue;
                    $mark.attr("value", JSON.stringify(point));
                    if (newValue <= 0) {
                        $mark.remove();
                    }
                    if (_this.callback)
                        _this.callback(_this.getTotalValue());
                });
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
            this.JqEle.append("<div class='img-mark'\n                                    value='" + JSON.stringify(point) + "'\n                                    style='left:" + point.x + "%; top:" + point.y + "%;'>\n                                  <a class='btn btn-mark-decrease'>\n                                    <i class='glyphicon glyphicon-minus-sign'></i>\n                                  </a>+<span class='img-mark-value'>" + parseFloat(point.value.toString()).toFixed(1) + "</span><input class=\"img-mark-value-edit\" value='" + parseFloat(point.value.toString()).toFixed(1) + "' /><a class='btn btn-mark-increase'>\n                                    <i class='glyphicon glyphicon-plus-sign'></i>\n                                  </a>\n                                </div>");
        };
        /**
         * Validate number string
         */
        PicCorrect.prototype.validateNumber = function (str) {
            var reg = new RegExp("^[0-9]+.?[0-9]*$");
            return reg.test(str);
        };
        return PicCorrect;
    }());
    Common.PicCorrect = PicCorrect;
})(Common || (Common = {}));
//# sourceMappingURL=PicCorrect.js.map