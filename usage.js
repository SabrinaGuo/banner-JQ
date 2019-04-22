(function ($) {
    'use strict';

    var ModuleName = 'banner';

    var Module = function (ele, option) {
        //拆解各個元素
        this.ele = ele; // documaent.getElementById 各元素
        this.$ele = $(ele); //JQ  
        this.$btn = $(`<div class="${option.button.class}"></div>`);//button
        // console.log(this.$btn) 
        this.option = option; //各個行為
        //狀態設定 為了那狀態四階段
        this.statusList = ['closed', 'opening', 'opened', 'closing'];
        this.status = 0; // 0 closed  1 opening  2 opened  3 opening
        // 時間設定 為了看whenTransition
        this.time;
        this.settime;

    }

    //option 一開始要執行的預設值
    Module.DEFAULTS = {
        // 設定一開始是否為開或合
        openAtStart: false, // [boolean] true | false
        // 設定啟動後是否要自動開或合，若設為false，就不要自勳開合；若為true是馬上自動開合；若為數字是幾毫秒之後開合
        autoToggle: true, // [boolean|number] true | false | 3000
        // 設定收合展開按鈕
        button: {
            closeText: '收合', // [string]
            openText: '展開', // [string]
            class: 'btn' // [string]
        },
        // 設定模組在各狀態時的class
        class: {
            closed: 'closed', // [string]
            closing: 'closing', // [string]
            opened: 'opened', // [string]
            opening: 'opening' // [string]
        },
        // 是否要有transition效果
        transition: true,
        // 當有transition時，要執行的callback function
        whenTransition: function () {
            console.log('whenTransition');
        }


    }

    //設定狀態
    Module.prototype.StatusClass = function (status) {
        return this.option.class[this.statusList[this.status]];
        // this.statusList[this.status];
        // 要去運用初始設定的class物件！
    }
    Module.prototype.NextStatus = function () {
        this.status++;
        if (this.status > (this.statusList.length - 1)) {
            this.status = 0; //4>3 ->變成0 
        }
        return this.status;
    }
    //時間系列
    Module.prototype.setInterval = function () {

        if (this.option.transition
            // && this.$ele.hasClass('transition')
        ) {
            this.time = setInterval(function () {
                this.option.whenTransition()
            }.bind(this), 100);
            // console.log(this)
        }
    }
    Module.prototype.clearIntervalTime = function () {
        clearInterval(this.time);
    }



    //設定個別動作

    Module.prototype.init = function () {
        this.$ele.append(this.$btn);//新增按鈕
        // console.log(this.status)

        // console.log(this.option.button.class)//btn
        if (this.option.openAtStart) {
            this.$btn.text(this.option.button.closeText);//收
            this.status = 2; //opened

        } else {
            this.$ele.addClass('cloesd').removeClass('opened');
            console.log(this.status)// 0
            this.$btn.text(this.option.button.openText);//開
            this.status = 0; //closed
        }
        this.$ele.addClass(this.StatusClass(this.status));

    }
    Module.prototype.openAtStart = function (isOpen) {
        if (isOpen === true) {
            this.$ele.addClass('opened').removeClass('closed');
        } else {
            this.$ele.addClass('closed').removeClass('opened');
        }
    };
    Module.prototype.autoToggle = function () {
        // console.log(autoToggle);
        if (this.option.autoToggle === true) {
            if (this.status === 2) {
                setTimeout(() => {
                    this.close()
                    this.transitionEnd();
                }, 3 * 1000)//三秒後自動關閉
            } else if (this.status === 0) {
                setTimeout(() => {
                    this.open();
                    this.transitionEnd();
                }, 3 * 1000)
            }
        }

        if (this.option.autoToggle === false) {
            return;
        }
        if (this.option.autoToggle !== Boolean) {

            if (this.status === 2) {
                setTimeout(() => {
                    this.close()
                    this.transitionEnd();
                }, this.option.autoToggle * 1000)//三秒後自動關閉
            } else if (this.status === 0) {
                setTimeout(() => {
                    this.open();
                    this.transitionEnd();
                }, this.option.autoToggle * 1000)
            }
        }

    };
    Module.prototype.open = function () {
        this.setInterval(); //啟動whenTransition
        this.$ele.removeClass(this.StatusClass(this.status)).addClass(this.StatusClass(this.NextStatus()));
        this.$btn.text(this.option.button.closeText);
        this.clearSettime();

    }
    Module.prototype.close = function () {
        this.setInterval();
        this.$ele.removeClass(this.StatusClass(this.status)).addClass(this.StatusClass(this.NextStatus()));
        this.$btn.text(this.option.button.openText);
        this.clearSettime();

    }
    Module.prototype.toggle = function () {
        // console.log(this.status)
        if (this.status === 0) {
            this.transitionEnd();
            this.open();

        } else if (this.status === 2) {
            this.transitionEnd();
            this.close();

        }
        this.clearSettiming();
    };
    // 開啟transition
    Module.prototype.Hastransition = function (trans) {
        if (trans === true) {
            this.$ele.addClass('transition');
        } else {
            this.$ele.removeClass('transition');
        }
    };

    //從ing變化成ed
    Module.prototype.transitionEnd = function () {
        if (this.status === 1) {
            this.$ele.removeClass(this.StatusClass(this.status)).addClass(this.StatusClass(this.NextStatus()));
        } else if (this.status === 3) {
            this.$ele.removeClass(this.StatusClass(this.status)).addClass(this.StatusClass(this.NextStatus()));
        }
        this.clearIntervalTime(); //停止whentransition
    }

    // jQuery.fn = jQuery.prototype / []代表ModuleName是可以改變而不會寫死
    $.fn[ModuleName] = function (option) {

        return this.each(function () {
            var $this = $(this); //=.banner
            var module = $(this).data(ModuleName);
            var opts = null;

            if (!!module) { //是否設定過 (true)  
                //兩個驚嘆號 強制轉換類型，!!是一個邏輯操作，不論它的後面接的是什麼數值，它的結果會被強制轉換成bool類型
                // 判斷裡面打 $('.banner').banner('close')是否會立即執行  
                if (typeof option === 'string'
                    //  &&  typeof options2 === 'undefined'
                ) {
                    module[option]();    // module['open']()
                } else {
                    throw 'unsupported option!';
                    //  $('.banner').banner(1234)--會顯示 不支援此設定

                }
            } else {
                opts = $.extend({},
                    Module.DEFAULTS,
                    typeof option === 'object' && option,
                );
                var module = new Module(this, opts);
                $this.data(ModuleName, module)// 將module存入後面的data，避免重複建構新的Module
                // console.log('module: ', module)
                // console.log('openAtStart: ', module.option.openAtStart)


                // 所有的事件
                // openAtStart 
                module.openAtStart(module.option.openAtStart);
                module.init();//一開始設定
                module.$btn.on('click', function () {
                    module.toggle();
                });
                module.autoToggle(module.option.autoToggle);
                module.Hastransition(module.option.transition);
                module.$ele.on('transitionend', function () {
                    module.transitionEnd();
                })
            }




        });
    };

})(jQuery);


// $('.banner').banner('toggle');

// $('.banner').banner('open');

// $('.banner').banner('close');
