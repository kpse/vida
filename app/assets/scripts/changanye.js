var isAd2 = /android\s*2\./i.test(navigator.userAgent);
var mi2a = /mi 2a/i.test(navigator.userAgent);
var share = {
    title: '陕派摇滚&长安夜',
    link: 'http://114.215.129.240/changanye',
    desc: '陕派摇滚&长安夜介绍及订票信息',
    img: 'http://114.215.129.240/assets/images/rock.jpg'
};
function $(o) {
    return document.querySelector(o)
};
function $$(o) {
    return document.querySelectorAll(o)
};

//触屏事件
var touchSlider = {
    init: function () {
        this.touchInitPosX = 0; //手指初始位置
        this.touchEndPosX = 0; //手指初始位置
        this.touchInitPos = 0; //手指初始位置
        this.startPos = 0; //移动开始的位置
        this.totalDist = 0, //移动的总距离
            this.deltaX1 = 0; //每次移动的正负
        this.deltaX2 = 0; //每次移动的正负
        var self = this;
        $('body').addEventListener('touchstart', function (e) {
            self.touchstart(e);
        }, false);
        $('body').addEventListener('touchmove', function (e) {
            self.touchmove(e);
        }, false);
        $('body').addEventListener('touchend', function (e) {
            self.touchend(e);
        }, false);
        $('body').addEventListener('touchcancel', function (e) {
            itemReset();
        }, false);
    },
    touchstart: function (e) {
        if (e.touches.length !== 1) {
            return;
        } //如果大于1个手指，则不处理
        this.touchEndPosX = this.touchInitPosX = e.touches[0].pageX; // 每次move的触点位置
        this.touchInitPos = e.touches[0].pageY; // 每次move的触点位置
        this.deltaX1 = this.touchInitPos; //touchstart的时候的原始位置
        this.startPos = 0;
        this.startPosPrev = -displayHeight;
        this.startPosNext = displayHeight;
        this.hasPrev = !!$('#prev');
        this.hasNext = !!$('#next');
        //手指滑动的时候禁用掉动画
        if (this.hasNext) {
            $('#next').className += ' touchmove';
        }
        $('#current').className += ' touchmove';
        if (this.hasPrev) {
            $('#prev').className += ' touchmove';
        }
    },
    touchmove: function (e) {
        if (e.touches.length !== 1) {
            return;
        }
        this.touchEndPosX = e.touches[0].pageX;
        var currentX = e.touches[0].pageY;
        this.deltaX2 = currentX - this.deltaX1; //记录当次移动的偏移量
        this.totalDist = this.startPos + currentX - this.touchInitPos;
        var pos = '0,' + this.totalDist + 'px';
        $('#current').style.WebkitTransform = 'translate3d(' + pos + ', 0)';
        this.startPos = this.totalDist;

        //处理上一张和下一张
        if (this.totalDist < 0) { //露出下一张
            if (this.hasNext) {
                this.totalDist2 = this.startPosNext + currentX - this.touchInitPos;
                var pos2 = '0,' + this.totalDist2 + 'px';
                $('#next').style.WebkitTransform = 'translate3d(' + pos2 + ', 0)';
                this.startPosNext = this.totalDist2;
            }
        } else { //露出上一张
            if (this.hasPrev) {
                this.totalDist2 = this.startPosPrev + currentX - this.touchInitPos;
                var pos2 = '0,' + this.totalDist2 + 'px';
                $('#prev').style.WebkitTransform = 'translate3d(' + pos2 + ', 0)';
                this.startPosPrev = this.totalDist2;
            }
        }

        this.touchInitPos = currentX;
    },
    touchend: function (e) {
        if (this.hasPrev) {
            $('#prev').className = $('#prev').className.replace(/\s*\btouchmove\b/g, '');
        }
        $('#current').className = $('#current').className.replace(/\s*\btouchmove\b/g, '');
        if (this.hasNext) {
            $('#next').className = $('#next').className.replace(/\s*\btouchmove\b/g, '');
        }
        if (this.deltaX2 < -25) {
            nextImg();
        } else if (this.deltaX2 > 25) {
            prevImg();
        }

        this.deltaX2 = 0;
    },
    restore: function () { //touch未遂 复位
        itemReset();
    }
}

//3个大图复位
function itemReset() {
    $('#current').style.WebkitTransform = 'translate3d(0,0, 0)';
    if ($('#prev')) {
        $('#prev').style.WebkitTransform = 'translate3d(0,-' + displayHeight + 'px, 0)';
    }
    if ($('#next')) {
        $('#next').style.WebkitTransform = 'translate3d(0,' + displayHeight + 'px, 0)';
    }
}

function prevImg() {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        itemReset();
        return false;
    }

    var nextIndex = currentIndex + 1 > allItems - 1 ? 0 : currentIndex + 1;

    $('#current').style.WebkitTransform = 'translate3d(0,' + displayHeight + 'px,0)';
    if ($('#next')) {
        $('#wrap').removeChild($('#next'));
    }
    $('#current').id = 'next';
    $('#prev').style.WebkitTransform = 'translate3d(0,0,0)';
    $('#prev').id = 'current';

    setTimeout(function () {
        // $('#current').innerHTML=data[currentIndex];
        if ($('.play')) {
            $('.play').className = $('.play').className.replace(/\s*\bplay\b/g, '');
        }
        $('#current').className += ' play';
    }, 400)

    if (typeof ( slideCallback ) == 'function') {
        slideCallback(currentIndex)
    }

    var prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
        prevIndex = allItems - 1;
        return false;
    } else if (nextIndex == allItems - 1) {
        $('#arr').style.display = '';
    }

    addFrame(prevIndex, 'prev');
}
function nextImg() {
    if (currentIndex < allItems - 1) {
        currentIndex++;
    } else {
        itemReset();
        return false;
    }

    var prevIndex = currentIndex === 0 ? allItems - 1 : currentIndex - 1;

    $('#current').style.WebkitTransform = 'translate3d(0,-' + displayHeight + 'px,0)';
    if ($('#prev')) {
        $('#wrap').removeChild($('#prev'));
    }
    $('#current').id = 'prev';
    $('#next').style.WebkitTransform = 'translate3d(0,0,0)';
    $('#next').id = 'current';

    setTimeout(function () {
        //$('#current').innerHTML=data[currentIndex];
        if ($('.play')) {
            $('.play').className = $('.play').className.replace(/\s*\bplay\b/g, '');
        }
        $('#current').className += ' play';
    }, 400)

    if (typeof ( slideCallback ) == 'function') {
        slideCallback(currentIndex)
    }

    var nextIndex = currentIndex + 1;
    if (nextIndex >= allItems) {
        $('#arr').style.display = 'none';
        return false;
    }

    addFrame(nextIndex, 'next');
}
function addFrame(index, pos) {
    var addItem = document.createElement('div');
    addItem.className = 'item item-' + index;
    addItem.id = pos;
    addItem.style.WebkitTransform = 'translate3d(0,' + ( pos == 'prev' ? '-' : '' ) + displayHeight + 'px,0)';
    addItem.innerHTML = data[index];
    if (pos == 'prev') {
        $('#wrap').insertBefore(addItem, $('#current'));
    } else {
        $('#wrap').appendChild(addItem);
    }
}


//界面尺寸发生变化重置
function initDisplay(e) {
    if ($('#wrap').offsetWidth != displayWidth) { //ios
        displayWidth = $('#wrap').offsetWidth;
        displayHeight = $('#wrap').offsetHeight;

        if (( /iPhone/ ).test(navigator.userAgent)) {
            if (window.orientation == 90 || window.orientation == -90) {
                displayHeight = window.screen.width - 51;
            } else {
                displayHeight = window.screen.height - 64;
            }

            $('#wrap').style.height = displayHeight + 'px';
            if ($('#current img').offsetHeight / $('#current img').offsetWidth >= displayHeight / displayWidth) {
                $('#current img').style.height = displayHeight + 'px';
            } else {
                $('#current img').style.width = displayWidth + 'px';
            }

            setTimeout(function () {
                window.scrollTo(0, 1);
            }, 1);
        }
        itemReset();
    } else { //

        setTimeout(function () {
            if ($('#wrap').offsetWidth != displayWidth) {
                displayWidth = $('#wrap').offsetWidth;
                displayHeight = $('#wrap').offsetHeight;
                itemReset();
            } else {
                setTimeout(function () {
                    displayWidth = $('#wrap').offsetWidth;
                    displayHeight = $('#wrap').offsetHeight;
                    itemReset();
                }, 500)
            }
        }, 300)
    }
}

var currentIndex = 0;
var allItems = 0; //总图片数据

var displayWidth = document.documentElement.clientWidth; //图片区域最大宽度
var displayHeight = document.documentElement.clientHeight; //图片区域最大高度

window.addEventListener('orientationchange resize', initDisplay, false);
document.addEventListener('touchmove', function (e) {
    e.preventDefault();
}, false);

//以下为统计和分享
function initBtnShare() {
    $('#btn_share').style.display = 'block';
    $('#btn_share').addEventListener('click', function () {
        $('#share_btn_tip').style.display = 'block';
        setTimeout(function () {
            $('#share_btn_tip').style.display = 'none';
        }, 3000)
        tj.sendClick('act.year10.y06.clickshare');
        return false;
    }, false);
}

function getParam(name, url) {
    var r = new RegExp("(\\?|#|&)" + name + "=(.*?)(#|&|$)")
    var m = ( url || location.href ).match(r);
    return ( m ? m[2] : '' );
}

function loadUrl(url, callback, charset) {
    var isCSS = /\.css(?:\?|#|$)/i.test(url);
    var node = document.createElement(isCSS ? "link" : "script")

    if (charset) {
        node.charset = charset;
    }

    node.onload = node.onerror = node.onreadystatechange = function () {
        if (/^(?:loaded|complete|undefined)$/.test(node.readyState)) {

            // Ensure only run once and handle memory leak in IE
            node.onload = node.onerror = node.onreadystatechange = null

            // Remove the script to reduce memory leak
            if (!isCSS) {
                document.body.removeChild(node)
            }

            // Dereference the node
            node = null

            callback && callback()
        }
    }

    if (isCSS) {
        node.rel = "stylesheet"
        node.href = url
    } else {
        node.async = true
        node.src = url
    }
    document.body.appendChild(node);
}

//模板
var data = [
    //0
    '<div class="bg"></div>',
    //1
    '<div class="bg"></div>',
    //2
    '<div class="box up" >\
          <p class="desc">他，陕西著名音乐人，歌手，陕派摇滚音乐的开创者之一，中国梦之声全国30强，城墙的颜色就是他的性格：厚重而包容，悠远而沉默。长安城过去从不缺英雄，但是缺未来的精神，他的歌曲《长安城》到《长安夜》，他的音乐对这座城的爱是婉转而动听，含蓄而柔美，长安的风韵在他的宽厚的嗓音中，像酒，绵长有味，像城，往事千年。他是最能代表陕西内敛、厚重的那种性格的音乐人。他是陕西四大方言法宝级乐队的摇滚中坚力量，他是不善言谈的思想者，他是低调内敛的长安汉，他是长安秦腔摇滚的灵魂人物，<span class="high-light">他是王建房！</span></p>\
    </div>\
    <div class="bg"></div>',
    //3
    '<div class="box up" >\
          <p class="desc">他是用生命歌唱陕派摇滚blues的“醉侠”，一位大隐隐于市的唱作人。一顶黑帽，立体而有故事的胡子，诠释了陕派音乐人极富辨识度的脸。82年开始弹吉他，85年开始写歌，自学了鼓、贝斯、键盘， 80年代中期，全国刮起了迪斯科风潮，他也曾疯狂追赶潮流，并在陕西首届迪斯科大奖赛上获得了第三名。94年的时候，他已经怀揣300多首歌的手稿了。他说，正是因为他把写歌当作写日记，每一首歌都像是自己的孩子，今天，他带着陕派摇滚布鲁斯狂人的头衔震撼回归，陕派崛起，他的风格不可忽略，<span class="high-light">他，是西安老钱。</span></p>\
    </div>\
    <div class="bg"></div>',
    //4
    '<div class="box up" >\
          <p class="desc">他，把秦歌当作毕生奉献，拥有职业艺人般的素养，他出生在祖传的唢呐世家，是地道的陕西人，对音乐的痴情，使他从艺术学校的一名教师转变为歌手，他发有十余张秦歌专辑，他的歌曲遍布陕西大街小巷，歌词幽默而风趣，曲风自成一体传唱度极高，为陕派音乐推广立下汗马功劳，他是作曲、作词兼演唱的艺人、陕西省秦歌研究会会长，中国秦歌第一人，他，就是十三狼。他的歌曲将秦人、秦地、秦风有机融合，将十三朝古都的文明历史和悠久文化，蕴含在饱含热血的秦歌当中，是陕派音乐人的先行者。</p>\
    </div>\
    <div class="bg"></div>',
    //5
    '<div class="box up" >\
          <p class="desc">他们，陕西音乐圈的一股流行力量， 2013全球华语金曲奖优秀新乐队的得主，他们的作品质朴而细腻，广见于电台广播和影视剧。他们的《西大街的夜晚》翻唱版本多达百种，遍布城市角角落落，城外那一弯护城河水就是他们的性格：安静而清澈，静静的轻抚着这片黄土地的彼岸，摇曳着关于音乐的梦。西安的点点滴滴，都被他们记录在歌曲里面，歌曲无不折射出陕派音乐人的细腻情愫和语言特点。他们是陕西四大方言法宝级乐队的流行新生力量，他们是默默坚守陕派音乐的歌者，是未来陕西方言音乐的发扬者，<span class="high-light">他们是玄乐队！</span></p>\
    </div>\
    <div class="bg"></div>',
    //6
    '<div class="box up" >\
          <p class="desc">来自天山脚下的他，有点像最早在天山南北的艺人，拥有火一样的热情，喷泉般不停息的灵感，骆驼刺红柳一样倔强而旺盛的生命力，他音乐风格无法固定，他永远在创新，永远在突破，永远在变幻莫测的舞台上给你不一样的惊喜，他的现场令人折服令人震撼，他的态度令人敬畏，他的音乐素养让人大叹不已，他有什么样的情绪就写什么样的歌，以至于我们不仅能听到bluse、punk、pop以及我们所知道的各种前卫音乐形式，他是新疆人，却把一脉热血倾洒在陕西的黄土地上，他是让人致敬的新一代陕派音乐人，<span class="high-light">他，是阿里。</span></p>\
    </div>\
    <div class="bg"></div>',
    //7
    '<a href="http://item.damai.cn/74549.html"><div class="bg order"></div></a>'
];


//初始化
var items = '<div id="current" class="item item-0" style="-webkit-transform:translate3d(0,0,0)">' + data[0] + '</div><div id="next" class="item item-1" style="-webkit-transform:translate3d(0,100%,0)">' + data[1] + '</div>';

allItems = data.length;

/*逻辑部分*/
//预加载
function preloading() {
    var imgurls = [
        'assets/images/cover.jpg',
        'http://vida.qiniudn.com/menu.jpg',
        'http://vida.qiniudn.com/wangjianfang.jpg',
        'http://vida.qiniudn.com/laoqian.jpg',
        'http://vida.qiniudn.com/shisanlang.jpg',
        'http://vida.qiniudn.com/xuanyuedui.jpg',
        'http://vida.qiniudn.com/ali.jpg',
        'http://vida.qiniudn.com/order.jpg',
        'http://vida.qiniudn.com/small_icons.png'
    ];
    var imgs = [], loaded = 0;
    for (var i = 0; i < imgurls.length; i++) {
        imgs[i] = new Image();
        imgs[i].src = imgurls[i];
    }
}

function pageinit() {
    $('#wrap').innerHTML = items;
    $('#arr').style.display = 'block';
    setTimeout(function () {
        $('#current').className += ' play';
    }, 100)
    touchSlider.init();
}

//万一进度条卡那了 20秒后直接显示
var fallback = setTimeout(pageinit, 20 * 1000);

//进入页面loading
function loading() {
    $('#loading').style.opacity = 1;
    var imgurls = [
        'assets/images/cover.jpg',
        'assets/images/small_icons.png'
    ];
    var imgs = [], loaded = 0;
    for (var i = 0; i < imgurls.length; i++) {
        imgs[i] = new Image();
        imgs[i].src = imgurls[i];
        imgs[i].onload = imgs[i].onerror = imgs[i].onabort = function (e) {
            loaded++;
            if (this.src === imgurls[0] && e.type === 'load') {
                clearTimeout(fallback)
                ct_cover.init(this, function (cover) {
                    ct_cover.remove();
                });
            }
            checkloaded();
        }
    }

    var timer = setTimeout(function () {
        $('#loading').style.opacity = 1;
    }, 500);

    function checkloaded() {
        $('#loading div').style.width = loaded / imgurls.length * 100 + '%';
        if (loaded == imgurls.length) {
            if (timer) {
                clearTimeout(timer)
            }
            if (fallback) {
                clearTimeout(fallback)
            }
            pageinit();
            imgs = null;
            preloading();
        }
    }
}

var audioInit = 0
function slideCallback(index) {
    if (index > 0 && !audioInit) {
        initAudio();
        audioInit = true;
    }
    if (index == 0) {
        $('.mod_control').className += ' firstScr'
    } else {
        $('.mod_control').className = 'mod_control'
    }
    if ($('.mod_control .current')) {
        $('.mod_control .current').className = '';
    }
    $$('.mod_control .mod_tag li')[index].className = 'current';
}

$('#audio').addEventListener('pause', function () {
    $('#btn_audio').className = 'audio_btn icon_sound_off'
}, false);

$('#audio').addEventListener('playing', function () {
    $('#btn_audio').className = 'audio_btn icon_sound_on';
}, false);

var M = M || {};

function initAudio() {
    if (!M.bridge || !navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
        $('#btn_audio').style.display = '';
        $('#btn_audio').ontouchstart = function (e) {
            e.preventDefault();
            if (/_off/.test(this.className)) {
                $('#audio').play();
                this.className = 'audio_btn icon_sound_on';
            } else {
                $('#audio').pause();
                this.className = 'audio_btn icon_sound_off';
            }
            return false;
        }
        $('#audio').play();
    }
};


// 封面动画
var ct_cover = (function () {
    var c = $('#cover'),
        c_bg = null,
        c_light = null,
        td = 20,
        tc = 75,
        ctx = null,
        isOpening = 0,
        pos = 0,
        light = [],
        pi2 = Math.PI * 2, width, height, img_bg;

    function refrush() {
        c_bg.style.marginRight = c_bg.style.marginRight == '1px' ? '0px' : '1px';
    };
    function remove() {
        if (c) {
            c.parentElement.removeChild(c);
            c = null;
        }
        setTimeout(function () {
            $('.mod_control').style.display = '';
        }, 0);
    };
    function createLight(x, y, s) {
        var t = {
            x: x == null ? parseInt(Math.random() * width) : x,
            y: y == null ? parseInt(Math.random() * height) : y,
            g: {}
        };
        s || ( s = parseInt(( Math.random() * .5 + .1 ) * tc) );
        var or = parseInt(50 + Math.random() * 60), d = parseInt(20 + Math.random() * 5);
        for (var j = s + 1, m = s + d; j < m; j++) {
            var p = j - s, r = p < d / 3 ? 3 * or * p / d : 1.5 * or * ( d - p ) / d, g = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
            g.addColorStop(0, 'rgba(255,255,255,0.7)');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            t.g[j] = [r, g];
        }
        return t;
    };
    function _ani() {
        pos++;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(33,33,33,' + (.8 * ( pos > tc / 2 ? 1 - pos / tc : pos / tc ) ) + ')';
        ctx.fillRect(0, 0, width, height);
        for (var i = 0, l = light.length; i < l; i++) {
            var t = light[i], g = t.g[pos];
            if (g) {
                ctx.fillStyle = g[1];
                ctx.beginPath();
                ctx.moveTo(t.x, t.y);
                ctx.arc(t.x, t.y, g[0], 0, pi2, true);
                ctx.closePath();
                ctx.fill();
            }
        }
        refrush();
        if (pos < tc) {
            setTimeout(_ani, td);
        } else {
            remove();
        }
    };
    function _init() {
        c.width = c_bg.width = c_light.width = width = displayWidth = document.documentElement.clientWidth;
        c.height = c_bg.height = c_light.height = height = displayHeight = document.documentElement.clientHeight;
        ctx = c_bg.getContext('2d');
        if (img_bg.width / width > img_bg.height / height) {
            width = img_bg.width * height / img_bg.height;
        } else {
            height = img_bg.height * width / img_bg.width;
        }
        ctx.drawImage(img_bg, 0, 0, width, height);
        c_bg.className = 'bg';
        ctx = c_light.getContext('2d');
    };
    return {
        remove: remove,
        init: function (img) {
            this.inited = 1;
            c_bg = document.createElement('canvas');
            c_light = document.createElement('canvas');
            img_bg = img;
            _init();
            c.appendChild(c_bg);
            c.appendChild(c_light);
            for (var i = 0, l = 6 + parseInt(Math.random() * 3); i < l; i++) {
                light.push(createLight());
            }
            refrush();
            setTimeout(function () {
                c.addEventListener('touchstart', function touchend(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isOpening) {
                        isOpening = 1;
                        light.unshift(createLight(e.touches[0].pageX, e.touches[0].pageY, 1));
                        c_bg.style.webkitTransform = 'scale(0.7)';
                        c_bg.style.opacity = '0';
                        _ani();
                    }
                }, true);
                c.addEventListener('touchmove', function touchend(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }, true);
            }, 0);
        },
        reload: function () {
            _init();
            refrush();
        }
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    isAd2 && ( $('#btn_audio').style.display = 'none' );
    loading();
    function _fli(l) {
        var h = '';
        for (var i = 1; i <= l; i++) {
            h += '<li' + ( i == 1 ? ' class="current"' : '' ) + '><span>' + i + '</span></li>';
        }
        return h;
    }

    $('#mod-tag-page').innerHTML = _fli(data.length);

    var counter = 0;
    var timer = setInterval(function () {
        if (displayWidth != document.documentElement.clientWidth || displayHeight != document.documentElement.clientHeight) {
            displayWidth = document.documentElement.clientWidth;
            displayHeight = document.documentElement.clientHeight;
            clearInterval(timer);
            ct_cover.inited && ct_cover.reload();
        } else {
            counter++;
            if (counter > 20) {
                clearInterval(timer);
            }
        }
    }, 100);
}, false);


window.addEventListener('load', function () {
    initAudio();
    audioInit = true;
}, false);

$('#arr').onclick = function () {
    nextImg();
};

$('#btn_audio').onclick = function (e) {
    e.preventDefault();
    if (/_off/.test(this.className)) {
        $('#audio').play();
        this.className = 'audio_btn icon_sound_on';
    } else {
        $('#audio').pause();
        this.className = 'audio_btn icon_sound_off';
    }
    return false;
}