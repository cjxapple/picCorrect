/// <reference path="../typings/jquery/jquery.d.ts" />
declare namespace Common {
    interface IValue {
        x: number | string;
        y: number | string;
        value: number;
    }
    class PicCorrect {
        private disabled;
        private max;
        private callback;
        private ele;
        JqEle: JQuery;
        Value: Array<IValue>;
        /**
         * This is a constructor
         *
         * @constructor
         * @param {string} str The value of default points
         */
        constructor(str: string, disabled?: boolean, max?: number, callback?: Function);
        /**
         * Get marks point-value
         *
         * @return {Array<IValue>}
         */
        getValue(): Array<IValue>;
        /**
         * Get marks total value
         *
         * @return {number}
         */
        getTotalValue(): number;
        /**
         * Scale function can zoom picture
         *
         * @param {number} percent The Scale value, It is a %
         * @return {void}
         */
        Scale(percent: number): void;
        /**
         * Init picture correct control
         *
         * @return {void}
         */
        private init();
        /**
         * Add a mark into the picture area
         *
         * @param {Ivalue} point The value of point contains x,y,value
         * @return {void}
         */
        private addMark(point);
        /**
         * Validate number string
         */
        private validateNumber(str);
    }
}
