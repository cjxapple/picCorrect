/// <reference path="../typings/jquery/jquery.d.ts" />

namespace Common {
    let initValue: number = 0.5;
    let stepValue: number = 0.5;
    export interface IValue {
        x: number | string;
        y: number | string;
        value: number;
    }
    export class PicCorrect {
        private disabled: boolean;
        private max: number = 0;
        private callback: Function;
        private ele: HTMLElement;
        public JqEle: JQuery;
        public Value: Array<IValue>;

        /**
         * This is a constructor
         * 
         * @constructor
         * @param {string} str The value of default points
         */
        constructor(str: string, disabled: boolean = true, max?: number, callback?: Function) {
            this.JqEle = $(str);
            this.ele = this.JqEle[0];
            this.disabled = disabled;
            if (!disabled) {///not disabled  
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
        public getValue(): Array<IValue> {
            let value = [];
            let $markset = this.JqEle.children(".img-mark")
            //if ($markset.length == 0)
            //    return null;           
            $markset.each((i, v) => {
                let point = JSON.parse($(v).attr("value"));
                value.push(point)
            });
            this.JqEle.attr("value", JSON.stringify(value));
            return value;
        }
        /**
         * Get marks total value
         * 
         * @return {number}
         */
        public getTotalValue(): number {
            let total: number = 0;
            let $markset = this.JqEle.children(".img-mark");

            $markset.each((i, v) => {
                total += (JSON.parse($(v).attr("value")) as IValue).value;
            });
            return total;
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
                        alert('已放大到原图不能再放大了。');
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
            if (this.disabled)
                return;
            this.JqEle.children("img").on("dblclick", (event) => {
                if (this.getTotalValue() + stepValue > this.max) {
                    alert( `超出该题总分${this.max.toFixed(1)}不能再增加分数。`);
                    return;
                }
                let point = {
                    x: ((event.pageX - this.JqEle.offset().left) * 1.0 / this.JqEle.outerWidth() * 100).toFixed(2),
                    y: ((event.pageY - this.JqEle.offset().top) * 1.0 / this.JqEle.outerHeight() * 100).toFixed(2),
                    value: initValue
                };
                this.addMark(point);
                if (this.callback)
                    this.callback(this.getTotalValue());
            });
            this.JqEle.children("img").on("click", ".img-mark", (event) => {
                event.stopPropagation();
            });
            this.JqEle.on("click", ".btn-mark-increase", (event) => {
                let $mark = $(event.target).parents(".img-mark")
                let $value = $mark.children(".img-mark-value");
                let point: IValue = JSON.parse($mark.attr("value"));
                let newValue: number = parseFloat($value.text()) + stepValue;
                if (this.getTotalValue() + stepValue > this.max) {
                    alert(`超出该题总分${this.max.toFixed(1)}不能再增加分数。`);
                    return;
                }
                $value.text(newValue.toFixed(1));
                point.value = newValue;
                $mark.attr("value", JSON.stringify(point));
                if (this.callback)
                    this.callback(this.getTotalValue());

            });
            this.JqEle.on("click", ".btn-mark-decrease", (event) => {
                let $mark = $(event.target).parents(".img-mark")
                let $value = $mark.children(".img-mark-value");
                let point: IValue = JSON.parse($mark.attr("value"));
                let newValue: number = parseFloat($value.text()) - stepValue;
                $value.text(newValue.toFixed(1));
                point.value = newValue;
                $mark.attr("value", JSON.stringify(point));
                if (newValue <= 0) {
                    $mark.remove();
                }
                if (this.callback)
                    this.callback(this.getTotalValue());
            });
            this.JqEle.on("click", ".img-mark-value", (event) => {
                let $span = $(event.target);
                let $input = $span.siblings("input.img-mark-value-edit");
                $input.width($span.width()).val($span.text());
                $span.hide();
                $input.show().focus().blur((event) => {
                    $span.show();
                    $input.hide();
                    if ($input.val() != "" && !this.validateNumber($input.val())) {
                        $input.val($span.text());
                        alert('只能填写数子。')
                        return;
                    }
                    let originalValue = parseFloat($span.text());
                    let newValue = parseFloat($input.val() == "" ? 0 : $input.val());
                    if (newValue > originalValue && this.getTotalValue() + newValue - originalValue > this.max) {
                        $input.val($span.text());
                        alert(`超出该题总分${this.max.toFixed(1)}不能修改分数。`);
                        return;
                    }
                    let $mark = $(event.target).parents(".img-mark")
                    let point: IValue = JSON.parse($mark.attr("value"));
                    $span.text(newValue.toFixed(1));
                    point.value = newValue;
                    $mark.attr("value", JSON.stringify(point));
                    if (newValue <= 0) {
                        $mark.remove();
                    }
                    if (this.callback)
                        this.callback(this.getTotalValue());


                });

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
                                  </a>+<span class='img-mark-value'>${parseFloat(point.value.toString()).toFixed(1)}</span><input class="img-mark-value-edit" value='${parseFloat(point.value.toString()).toFixed(1)}' /><a class='btn btn-mark-increase'>
                                    <i class='glyphicon glyphicon-plus-sign'></i>
                                  </a>
                                </div>`);
        }

        /**
         * Validate number string 
         */
        private validateNumber(str: string): boolean {
            var reg = new RegExp("^[0-9]+.?[0-9]*$");
            return reg.test(str);
        }


    }
}
