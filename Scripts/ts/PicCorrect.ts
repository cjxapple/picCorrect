/// <reference path="../typings/jquery/jquery.d.ts" />

namespace Common {
    interface IValue {
        x: number|string;
        y: number|string;
        value: number|string;
    }
    export class PicCorrect {
        private ele: HTMLElement;
        public JqEle: JQuery;
        public Value: Array<IValue>;

        /**
         * This is a constructor
         * 
         * @constructor
         * @param {string} str The value of default points
         */
        constructor(str: string) {
            this.JqEle = $(str);
            this.ele = this.JqEle[0];
            this.init();
        }
        /**
         * Get marks point-value
         * 
         * @return {Array<IValue>}
         */
        public getValue(): Array<IValue> {
            let $markset = this.JqEle.children(".img-mark")
            if ($markset.length == 0)
                return null;
            let value = [];
            $markset.each((i, v) => {
                let point = JSON.parse($(v).attr("value"));
                value.push(point)
            });
            this.JqEle.attr("value", JSON.stringify(value));
            return value;
        }
        /**
         * Scale function can zoom picture
         * 
         * @param {number} percent The Scale value, It is a %
         * @return {void} 
         */
        public Scale(percent: number) {
            let oimg: any = this.JqEle.children("img")[0];

            let srcHeight: number = oimg.naturalHeight;
            let srcWidth: number = oimg.naturalWidth;

            let maxHeight = parseInt(this.JqEle.css("max-height"));
            let maxWidth = parseInt(this.JqEle.css("max-width"));

            if (percent > 0) {

                if (srcWidth / srcHeight > 1) {///natural width longer than height
                    if (srcWidth == maxWidth) {
                        alert('can not scale anymore');
                        return
                    }
                    if ((srcWidth - maxWidth) / srcWidth * 100 < percent) {
                        maxHeight *= (1 + (srcWidth - maxWidth) / srcWidth);
                        maxWidth = srcWidth;
                    } else {
                        maxHeight *= (1 + percent / 100);
                        maxWidth *= (1 + percent / 100);
                    }
                }
                else {
                    if (srcHeight == maxHeight) {
                        alert('can not scale anymore');
                        return
                    }
                    if ((srcHeight - maxHeight) / srcHeight * 100 < percent) {
                        maxWidth *= (1 + (srcHeight - maxHeight) / srcHeight);
                        maxHeight = srcHeight;
                    } else {
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
        }
        /**
         * Init picture correct control
         * 
         * @return {void}
         */
        private init() {
            this.Value = [];

            if (this.JqEle.attr("value") != "") {
                let value: Array<IValue> = JSON.parse(this.JqEle.attr("value"));

                $.each(value, (i, v) => {
                    this.addMark(v);
                });

            }
            this.JqEle.children("img").on("click", (event) => {
                let point = {
                    x: ((event.pageX - this.JqEle.offset().left) * 1.0 / this.JqEle.outerWidth() * 100).toFixed(2),
                    y: ((event.pageY - this.JqEle.offset().top) * 1.0 / this.JqEle.outerHeight() * 100).toFixed(2),
                    value: 1
                };
                //this.Value.push(value);
                this.addMark(point);
            });
            this.JqEle.children("img").on("click", ".img-mark", (event) => {
                event.stopPropagation();
            });
            this.JqEle.on("click", ".btn-mark-increase", (event) => {
                let $mark = $(event.target).parents(".img-mark")
                let $value = $mark.children(".img-mark-value");
                let point: IValue = JSON.parse($mark.attr("value"));
                $value.text(parseInt($value.text()) + 1);
                point.value = parseInt($value.text())
                $mark.attr("value", JSON.stringify(point));

            });
            this.JqEle.on("click", ".btn-mark-decrease", (event) => {
                let $mark = $(event.target).parents(".img-mark")
                let $value = $mark.children(".img-mark-value");
                let point: IValue = JSON.parse($mark.attr("value"));
                $value.text(parseInt($value.text()) - 1);
                point.value = parseInt($value.text())
                $mark.attr("value", JSON.stringify(point));
                if ($value.text() == "0") {
                    $mark.remove();
                }
            });
        }
        /**
         * Add a mark into the picture area
         * 
         * @param {Ivalue} point The value of point contains x,y,value
         * @return {void}
         */
        private addMark(point: IValue) {
            //this.JqEle.append("<div class='img-mark' value='" + JSON.stringify(point) + "' style='left:" + point.x + "%;top:" + point.y + "%'><a class='btn btn-mark-decrease'><i class='glyphicon glyphicon-minus-sign'></i></a>+<span class='img-mark-value'>" + point.value + "</span><a class='btn btn-mark-increase'><i class='glyphicon glyphicon-plus-sign'></i></a></div>");
            this.JqEle.append(`<div class='img-mark'
                                    value='${JSON.stringify(point)}'
                                    style='left:${point.x}%; top:${point.y}%;'>
                                  <a class='btn btn-mark-decrease'>
                                    <i class='glyphicon glyphicon-minus-sign'></i>
                                  </a>+<span class='img-mark-value'>${point.value}</span><a class='btn btn-mark-increase'>
                                    <i class='glyphicon glyphicon-plus-sign'></i>
                                  </a>
                                </div>`);
        }


    }
}
