(function ($) {
    'use strict';

    var ModuleName = 'banner';

    var Module = function (ele, option) {
        //拆解各個元素
        this.ele = ele; // documaent.getElementById 各元素
        this.$ele = $(ele); //JQ  
        this.$btn = $(`<div class="${option.button.class}"></div>`);//button
        this.option = option; //各個行為
        this.imgs = $(".img");
        // console.log(this.$btn)

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

    //設定個別動作

    Module.prototype.openAtStart = function (isOpen) {

        if (isOpen === true) {
            this.$ele.addClass('opened').removeClass('closed');

        } else {
            this.$ele.addClass('closed').removeClass('opened');

        }
    };
    Module.prototype.init = function () {
        this.$ele.append(this.$btn);//新增按鈕

        // console.log(this.option.button.class)//btn
        if (this.option.openAtStart) {
            this.$btn.text(this.option.button.closeText);//收
            this.imgs.removeClass('up').addClass('down');
        } else {
            this.$ele.addClass('closed').removeClass('opened');
            this.$btn.text(this.option.button.openText);//開
            this.imgs.removeClass('down').addClass('up');
        }


    }
    Module.prototype.open = function () {
        this.$ele.addClass('opened').removeClass('closed');
        this.$btn.text(this.option.button.closeText);
        this.imgs.removeClass('up').addClass('down');

    }
    Module.prototype.close = function () {
        this.$ele.addClass('closed').removeClass('opened');
        this.$btn.text(this.option.button.openText);
        this.imgs.removeClass('down').addClass('up');
    }
    Module.prototype.toggle = function () {
        if (this.$ele.hasClass("closed")) {
            this.open();
        } else if (this.$ele.hasClass("opened")) {
            this.close();
        }
    };
    Module.prototype.autoToggle = function (autoToggle) {
        // console.log(autoToggle);
        if (autoToggle === true) {

            setTimeout(() => {
                this.$ele.addClass('closed');
                this.$ele.removeClass('opened');
            }, 3 * 1000)//三秒後自動關閉

        }

        if (autoToggle === false) {
            return;
        }
        if (autoToggle !== Boolean) {

            setTimeout(() => {
                this.$ele.addClass('closed');
                this.$ele.removeClass('opened');
            }, autoToggle * 1000)
        }

    };
    Module.prototype.transition = function (trans) {
        if (trans === true) {
            this.$ele.addClass('transition');
            this.imgs.addClass('transition');

        } else {
            this.$ele.removeClass('transition');
            this.imgs.removeClass('transition');
        }
    };

    // jQuery.fn = jQuery.prototype / []代表ModuleName是可以改變而不會寫死
    $.fn[ModuleName] = function (option) {

        return this.each(function () {
            var $this = $(this); //=.banner
            var module = $(this).data(ModuleName);
            var opts = null;

            if (!!module) {
                // 判斷裡面打 $('.banner').banner('close')是否會立即執行  
                if (typeof option === 'string'
                    //  &&  typeof options2 === 'undefined'
                ) {
                    // module['open']()
                    module[option]();
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
                module.transition(module.option.transition);
            }




        });
    };

})(jQuery);


// $('.banner').banner('toggle');

// $('.banner').banner('open');

// $('.banner').banner('close');