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
    } else {
      this.restore();
      if (currentIndex == 7) {
        var ncom = comCur;
        if (this.touchEndPosX - this.touchInitPosX > 10) {
          ncom > 0 && ncom--;
        } else if (this.touchInitPosX - this.touchEndPosX > 10) {
          ncom < comdata.length - 1 && ncom++;
        } else {
          ncom++;
          if (ncom >= comdata.length) {
            ncom = 0;
          }
          switchCom(ncom)
        }
        ;
        ncom != comCur && switchCom(ncom);
      }
      ;
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

// 切换评论内容
var comCur = 0, comtimer1 = 0, comtimer2 = 0;
function switchCom(i) {
  if (i == null) {
    // 初始化评论区
    comCur = 0;
    $('.bg_fans_title').innerHTML = comdata[0][0];
    $('.bg_fans_from').innerHTML = comdata[0][1];
    $('.bg_fans_content').innerHTML = comdata[0][2];
  } else if (comCur != i) {
    if (mi2a) {
      comCur = i;
      var com = comdata[comCur];
      $('.bg_fans_title').innerHTML = com[0];
      $('.bg_fans_from').innerHTML = com[1];
      $('.bg_fans_content').innerHTML = com[2];
      $('#fans_com_dot .current').className = '';
      $$('#fans_com_dot li')[comCur].className = 'current';
    } else if (comtimer2 == 0) {
      comCur = i;
      $('#fans_com').className = 'fade_out_in';
      comtimer1 = setTimeout(function () {
        var com = comdata[comCur];

        $('.bg_fans_title').innerHTML = com[0];
        $('.bg_fans_from').innerHTML = com[1];
        $('.bg_fans_content').innerHTML = com[2];
        $('#fans_com_dot .current').className = '';
        $$('#fans_com_dot li')[comCur].className = 'current';
      }, 300);
      comtimer2 = setTimeout(function () {
        $('#fans_com').className = '';
        comtimer1 = comtimer2 = 0;
      }, 600);
    }
  }
  ;
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

var tj = {
  pv: function () {
    this.checkping(function () {
      pgvMain("", {
        virtualDomain: ( window.tj_param && tj_param.virtualDomain ) || 'y.qq.com',
        virtualURL: ( window.tj_param && tj_param.virtualURL ) || '',
        ADTAG: ( window.tj_param && tj_param.ADTAG ) || '',
        repeat: false, //同一页面内 是否允许重复上报
        useRefUrl: true,
        careSameDomainRef: true
      });
    })
  },
  sendClick: function (type) {
    if (type) {
      this.checkping(function () {
        pgvSendClick({
          virtualDomain: ( window.tj_param && tj_param.virtualDomain ) || 'y.qq.com',
          virtualURL: ( window.tj_param && tj_param.virtualURL ) || '',
          hottag: type.toUpperCase()
        });
      })
    }
  },
  checkping: function (callback) {
    if (typeof pgvMain == 'function') {
      callback && callback()
    } else {
      loadUrl('http://imgcache.gtimg.cn/music/mobile/act/yysdtp/ping.js?max_age=2592000', function () {
        callback && callback();
      })
    }
  }
}
function weixinReady() {

  if (!window.share) {
    return;
  }
  initBtnShare();
  //朋友圈
  WeixinJSBridge.on("menu:share:timeline", function (e) {
    var data = {
      img_url: share.img,
      img_width: "173",
      img_height: "173",
      link: share.link + '?ADTAG=weixin',
      desc: share.desc,
      title: share.title
    };
    WeixinJSBridge.invoke("shareTimeline", data, function (res) {
      WeixinJSBridge.log(res.err_msg)
    });
  });
  //微博
  WeixinJSBridge.on("menu:share:weibo", function () {
    WeixinJSBridge.invoke("shareWeibo", {
      "content": share.title + ' - ' + share.desc,
      "url": share.link + '?ADTAG=weixin'
    }, function (res) {
      WeixinJSBridge.log(res.err_msg);
    });

  });
  //朋友
  WeixinJSBridge.on('menu:share:appmessage', function (argv) {
    var data = {
      img_url: share.img,
      img_width: "173",
      img_height: "173",
      link: share.link + '?ADTAG=weixin',
      desc: share.desc,
      title: share.title
    };
    WeixinJSBridge.invoke("sendAppMessage", data, function (res) {
      WeixinJSBridge.log(res.err_msg)
    });

  });
  if ($('#share_btn_tip')) {
    $('#share_btn_tip').style.top = '14px'
    $('#arrow_top').style.display = 'block'
  }
}

function musicappReady() {
  initBtnShare();
  var bridge = WebViewJavascriptBridge;
  if (window.M) {
    M.bridge = WebViewJavascriptBridge;
  }
  var data = {
    "appid": "wx5aa333606550dfd5",
    "img_url": share.img,
    "img_width": "173",
    "img_height": "173",
    "link": share.link + '?ADTAG=musicapp',
    "desc": share.desc,
    "title": share.title
  };
  if (navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
    var a = $('#audio');
    a.pause();
    a.parentElement.removeChild(a);
    $('#btn_audio').style.display = '';
    $('#btn_audio').ontouchstart = function () {
      M.bridge.callHandler('23', {
        "k1": 0,
        "k2": "1338414",
        "k3": "",
        "k4": "",
        "k5": "",
        "k6": "",
        "k7": ""
      }, function () {
      });
    }
    M.bridge.callHandler('share', data, function () {
    });
    $('#btn_share').style.display = 'block';
    $('#btn_share').removeEventListener('click');
    $('#btn_share').ontouchstart = function (e) {
      e.preventDefault();
      bridge.callHandler('callshare', data, function (r) {
        if (r.code == 0) {
          tj.sendClick('APPPAGESHARE.' + ( window.tj_param && tj_param.pagename ) + '.TYPE' + r.sharetype);
        }
      });
      tj.sendClick('APPPAGESHARE.' + ( window.tj_param && tj_param.pagename ) + '.CLICK');
    }
  } else {
    $('#arrow_top').style.display = 'block';
    $('#share_btn_tip').style.top = '14px';
    bridge.callHandler('share', data, function () {
    });
    $('#share_btn_tip').style.display = 'block';
    setTimeout(function () {
      $('#share_btn_tip').style.display = 'none';
    }, 3000);
  }
  if (window.devicePixelRatio >= 3) {
    $('body').style.fontSize = '12px';
  }
}

//微信分享
if (typeof WeixinJSBridge == 'undefined') {
  document.addEventListener('WeixinJSBridgeReady', weixinReady);
} else {
  weixinReady();
}
//music分享
if (typeof WebViewJavascriptBridge == 'undefined') {
  document.addEventListener('WebViewJavascriptBridgeReady', musicappReady);
} else {
  musicappReady();
}
//手Q分享
;
(function (e, t) {
  "use strict";
  function f(e, t) {
    e = String(e).split("."), t = String(t).split(".");
    try {
      for (var n = 0, r = Math.max(e.length, t.length); n < r; n++) {
        var i = isFinite(e[n]) && Number(e[n]) || 0, s = isFinite(t[n]) && Number(t[n]) || 0;
        if (i < s) return -1;
        if (i > s) return 1
      }
    } catch (o) {
      return -1
    }
    return 0
  }

  function l(e) {
    var t = e.split("."), n = window;
    return t.forEach(function (e) {
      !n[e] && ( n[e] = {} ), n = n[e]
    }), n
  }

  function c(e, t, n) {
    var r = typeof e == "function" ? e : window[e];
    if (!r) return null;
    var s = h(e), o = "__MQQ_CALLBACK_" + s;
    return window[o] = function () {
      var e = i.call(arguments);
      p(s, e, t, n), t && delete window[o]
    }, o
  }

  function h(e) {
    var t = u++;
    return e && ( a[t] = e ), t
  }

  function p(e, t, n, r) {
    var i = a[e];
    i ? r ? setTimeout(function () {
      i.apply(null, t)
    }, 0) : i.apply(null, t) : console.log("mqqapi: not found such callback: " + e), n && delete a[e]
  }

  function d() {
    var e = i.call(arguments), t = e.length && e[e.length - 1];
    return typeof t == "function" ? t(null) : null
  }

  function v(e, t) {
    var r = null, i = e.lastIndexOf("."), s = l(e.substring(0, i));
    t.iOS && n.iOS ? r = t.iOS : t.android && n.android ? r = t.android : t.browser && ( r = t.browser ), s[e.substring(i + 1)] = r || d
  }

  function m(e, r) {
    var i = document.createElement("iframe");
    i.style.cssText = "display:none;width:0px;height:0px;";
    var s = function () {
      g(r, {r: -201, result: "error"})
    };
    n.iOS && ( i.onload = s, i.src = e );
    var o = document.body || document.documentElement;
    o.appendChild(i), n.android && ( i.onload = s, i.src = e );
    var u = n.__RETURN_VALUE;
    return n.__RETURN_VALUE = t, setTimeout(function () {
      i.parentNode.removeChild(i)
    }, 0), u
  }

  function g(e, t) {
    var r;
    n.iOS ? r = i.call(arguments, 1) : n.android && ( r = [t.result] ), p(e, r)
  }

  function y(e, t, r, s) {
    if (!e || !t) return null;
    var o, u, a, l;
    r = i.call(arguments, 2), s = r.length && r[r.length - 1], s && typeof s == "function" ? r.pop() : typeof s == "undefined" ? r.pop() : s = null;
    if (n.android && f(n.QQVersion, "4.5") < 0) {
      if (window[e] && window[e][t]) {
        var c = window[e][t].apply(window[e], r);
        return s ? s(c) : c
      }
      s && s(n.ERROR_NO_SUCH_METHOD)
    } else if (n.iOS) {
      o = "jsbridge://" + encodeURIComponent(e) + "/" + encodeURIComponent(t);
      for (u = 0, a = r.length, l; u < a; u++) l = r[u], typeof l == "object" && ( l = JSON.stringify(l) ), u === 0 ? o += "?p=" : o += "&p" + u + "=", o += encodeURIComponent(String(l));
      n.android && ( o += "#" + h(s) );
      var p = m(o);
      if (n.iOS) return p = p ? p.result : null, typeof s == "function" ? s(p) : p
    } else if (n.android) {
      var d = h(s);
      o = "jsbridge://" + encodeURIComponent(e) + "/" + encodeURIComponent(t) + "/" + d;
      for (u = 0, a = r.length, l; u < a; u++) l = r[u], typeof l == "object" && ( l = JSON.stringify(l) ), o += "/" + encodeURIComponent(String(l));
      m(o, d)
    }
    return null
  }

  function b(e) {
    var t, n, r, i = e.indexOf("?"), s = e.substring(i + 1).split("&"), o = {};
    for (t = 0; t < s.length; t++) i = s[t].indexOf("="), n = s[t].substring(0, i), r = s[t].substring(i + 1), o[n] = decodeURIComponent(r);
    return o
  }

  function w(e) {
    var t = [];
    for (var n in e) t.push(encodeURIComponent(String(n)) + "=" + encodeURIComponent(String(e[n])));
    return t.join("&")
  }

  function E(e, t, n, r, s) {
    var o = i.call(arguments);
    typeof o[o.length - 1] == "function" ? ( s = o[o.length - 1], o.pop() ) : s = null, o.length === 4 ? r = o[o.length - 1] : r = {}, s && ( r.callback_type = "javascript", r.callback_name = c(function (e) {
      s(b(e))
    }) ), r.src_type = "web", r.version || ( r.version = 1 );
    var u = e + "://" + encodeURIComponent(t) + "/" + encodeURIComponent(n) + "?" + w(r);
    m(u)
  }

  var n = window[e] = window[e] || {}, r = navigator.userAgent, i = Array.prototype.slice, s = /(iPad|iPhone|iPod).*? QQ\/([\d\.]+)/, o = /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/, u = 1, a = {};
  n.iOS = s.test(r), n.android = o.test(r), n.iOS && n.android && ( n.iOS = !1 ), n.version = "20140416001", n.ERROR_NO_SUCH_METHOD = "no such method", !n.android && !n.iOS && console.log("mqqapi: not android or ios"), n.compare = function (e) {
    return f(n.QQVersion, e)
  }, n.android && ( n.QQVersion = function (e) {
    return e && e[3] || e[1] || 0
  }(r.match(o)), window.JsBridge || ( window.JsBridge = {} ), window.JsBridge.callMethod = y, window.JsBridge.callback = g, window.JsBridge.compareVersion = n.compare ), n.iOS && ( window.iOSQQApi = n, n.__RETURN_VALUE = t, n.QQVersion = function (e) {
    return e && e[2] || 0
  }(r.match(s)) ), n.build = v, n.invoke = y, n.invokeSchema = E, n.callback = c, n.mapQuery = b, n.toQuery = w
})("mqq"), mqq.build("mqq.data.setShareInfo", {
  iOS: function (e, t) {
    return mqq.invoke("data", "setShareInfo", {params: e}, t)
  }, android: function (e, t) {
    mqq.invoke("QQApi", "setShareInfo", e, t)
  }
});
if (mqq && mqq.data) {
  mqq.data.setShareInfo({
    share_url: share.link + '?ADTAG=sq',
    title: share.title,
    desc: share.desc,
    image_url: share.img
  });
  initBtnShare();
  if ($('#share_btn_tip')) {
    $('#share_btn_tip').style.top = '14px'
    $('#arrow_top').style.display = 'block'
  }
}

if (window.tj_param) {
  if (navigator.userAgent.indexOf('QQMUSIC') >= 0) {
    tj_param.ADTAG = 'inMusicApp'
  } else if (navigator.userAgent.indexOf('MicroMessenger') >= 0 || getParam('mmkey')) {
    tj_param.ADTAG = 'inWeixin'
  } else if (navigator.userAgent.indexOf('QQ/') >= 0) {
    tj_param.ADTAG = 'inSQApp'
  } else {
    tj_param.ADTAG = 'inOther'
  }
}

window.addEventListener('load', function () {
  tj.pv();
}, false);

var tj_param = {
  virtualDomain: 'y.qq.com',
  ADTAG: '',
  pagename: 'year10_03' //按钮通用统计用 标识页面名称 比如 apppageshare.yuetan.click
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
  '<div class="box left height50" >\
        <p class="desc">他是用生命歌唱陕派摇滚blues的“醉侠”，一位大隐隐于市的唱作人。一顶黑帽，立体而有故事的胡子，诠释了陕派音乐人极富辨识度的脸。82年开始弹吉他，85年开始写歌，自学了鼓、贝斯、键盘， 80年代中期，全国刮起了迪斯科风潮，他也曾疯狂追赶潮流，并在陕西首届迪斯科大奖赛上获得了第三名。94年的时候，他已经怀揣300多首歌的手稿了。他说，正是因为他把写歌当作写日记，每一首歌都像是自己的孩子，今天，他带着陕派摇滚布鲁斯狂人的头衔震撼回归，陕派崛起，他的风格不可忽略，他，是西安老钱。</p>\
  </div>\
  <div class="bg"></div>',
  //4
  '<div class="box right height50" >\
        <p class="desc">他，把秦歌当作毕生奉献，拥有职业艺人般的素养，他出生在祖传的唢呐世家，是地道的陕西人，对音乐的痴情，使他从艺术学校的一名教师转变为歌手，他发有十余张秦歌专辑，他的歌曲遍布陕西大街小巷，歌词幽默而风趣，曲风自成一体传唱度极高，为陕派音乐推广立下汗马功劳，他是作曲、作词兼演唱的艺人、陕西省秦歌研究会会长，中国秦歌第一人，他，就是十三狼。他的歌曲将秦人、秦地、秦风有机融合，将十三朝古都的文明历史和悠久文化，蕴含在饱含热血的秦歌当中，是陕派音乐人的先行者。</p>\
  </div>\
  <div class="bg"></div>',
  //5
  '<div class="box up50 height50" >\
        <p class="desc">他们，陕西音乐圈的一股流行力量， 2013全球华语金曲奖优秀新乐队的得主，他们的作品质朴而细腻，广见于电台广播和影视剧。他们的《西大街的夜晚》翻唱版本多达百种，遍布城市角角落落，城外那一弯护城河水就是他们的性格：安静而清澈，静静的轻抚着这片黄土地的彼岸，摇曳着关于音乐的梦。西安的点点滴滴，都被他们记录在歌曲里面，歌曲无不折射出陕派音乐人的细腻情愫和语言特点。他们是陕西四大方言法宝级乐队的流行新生力量，他们是默默坚守陕派音乐的歌者，是未来陕西方言音乐的发扬者，<span class="high-light">他们是玄乐队！</span></p>\
  </div>\
  <div class="bg"></div>',
  //6
  '<div class="box left height50" >\
        <p class="desc">来自天山脚下的他，有点像最早在天山南北的艺人，拥有火一样的热情，喷泉般不停息的灵感，骆驼刺红柳一样倔强而旺盛的生命力，他音乐风格无法固定，他永远在创新，永远在突破，永远在变幻莫测的舞台上给你不一样的惊喜，他的现场令人折服令人震撼，他的态度令人敬畏，他的音乐素养让人大叹不已，他有什么样的情绪就写什么样的歌，以至于我们不仅能听到bluse、punk、pop以及我们所知道的各种前卫音乐形式，他是新疆人，却把一脉热血倾洒在陕西的黄土地上，他是让人致敬的新一代陕派音乐人，他，是阿里。</p>\
  </div>\
  <div class="bg"></div>',
  //7
  '<a href="http://item.damai.cn/74549.html"><div class="bg order"></div></a>'
];

var comdata = [[
  '<p>贴身感受你的心</p>',
  '<p>来自大xiiong</p>',
  '<p>你的歌写进了你的爱情里有的悲伤有的痛苦有的欢快，但你的歌让我贴身感受到了你的心情，那么的追求着自己完美爱情的人，我很佩服，就像歌词的你不停地在骚动，大爱陈奕迅！</p>'
], [
  '<p>感恩有你十年陪伴！</p>',
  '<p>来自少年无知</p>',
  '<p>从《爱情转移》起有一个人我看见他唱歌会尖叫、会感动、会流泪，听你的歌、了解你的故事，许多次深夜窝在被窝里偷偷的哭，你唱的歌太动人，叫我怎么能不爱你？谢谢你的浮夸，谢谢你的好久不见，谢谢你的淘汰，谢谢你的不要说话，谢谢你的最佳损友，感谢你让我在最坏的时候听最好的歌，感恩有你十年陪伴！</p>'
], [
  '<p>这是我们都爱的陈胖子</p>',
  '<p>来自鹿儿么么</p>',
  '<p>他不是很帅，顶着一头乱糟糟的卷发，胳膊腿都吃的肥肥的，笑起来有酒窝，却傻傻的像小孩，不爱他的人也许能说出一千条他的缺点，可是这些，我都爱。未来等他变老的时候，就让心中的旋律带着我回到从前第一次在耳机里放你的歌时，那个无限温情的光景……</p>'
], [
  '<p>每个人都有一首陈奕迅</p>',
  '<p>来自贾小琼</p>',
  '<p>我爱你，没有十年。我爱过很多的人，但你确是很难割舍的那个。每个人都有一首陈奕迅，在我难过的时候你给我最多安慰你就是我的陈奕迅。无奈你我牵过手没线索。</p>'
]];
//初始化
var items = '<div id="current" class="item item-0" style="-webkit-transform:translate3d(0,0,0)">' + data[0] + '</div><div id="next" class="item item-1" style="-webkit-transform:translate3d(0,100%,0)">' + data[1] + '</div>';

allItems = data.length;

/*逻辑部分*/
//预加载
function preloading() {
  var imgurls = [
    'assets/images/cover.jpg',
    'assets/images/menu.jpg',
    'assets/images/wangjianfang.jpg',
    'assets/images/laoqian.jpg',
    'assets/images/shisanlang.jpg',
    'assets/images/xuanyuedui.jpg',
    'assets/images/ali.jpg',
    'assets/images/order.jpg',
    'assets/images/small_icons.png'
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


$('#arr').onclick = function () {
  nextImg()
}

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
var g_coder = (function () {
  var _this = this;
  var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = Base64._utf8_encode(input);
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ( ( chr1 & 3 ) << 4 ) | ( chr2 >> 4 );
        enc3 = ( ( chr2 & 15 ) << 2 ) | ( chr3 >> 6 );
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
          enc3 = enc4 = 64
        } else {
          if (isNaN(chr3)) {
            enc4 = 64
          }
        }
        output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4)
      }
      return output
    }, decode: function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = Base64._keyStr.indexOf(input.charAt(i++));
        enc2 = Base64._keyStr.indexOf(input.charAt(i++));
        enc3 = Base64._keyStr.indexOf(input.charAt(i++));
        enc4 = Base64._keyStr.indexOf(input.charAt(i++));
        chr1 = ( enc1 << 2 ) | ( enc2 >> 4 );
        chr2 = ( ( enc2 & 15 ) << 4 ) | ( enc3 >> 2 );
        chr3 = ( ( enc3 & 3 ) << 6 ) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2)
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3)
        }
      }
      output = Base64._utf8_decode(output);
      return output
    }, _utf8_encode: function (string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c)
        } else {
          if (( c > 127 ) && ( c < 2048 )) {
            utftext += String.fromCharCode(( c >> 6 ) | 192);
            utftext += String.fromCharCode(( c & 63 ) | 128)
          } else {
            utftext += String.fromCharCode(( c >> 12 ) | 224);
            utftext += String.fromCharCode(( ( c >> 6 ) & 63 ) | 128);
            utftext += String.fromCharCode(( c & 63 ) | 128)
          }
        }
      }
      return utftext
    }, _utf8_decode: function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;
      while (i < utftext.length) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++
        } else {
          if (( c > 191 ) && ( c < 224 )) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(( ( c & 31 ) << 6 ) | ( c2 & 63 ));
            i += 2
          } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(( ( c & 15 ) << 12 ) | ( ( c2 & 63 ) << 6 ) | ( c3 & 63 ));
            i += 3
          }
        }
      }
      return string
    }
  };
  return {Base64: Base64}
})();
function playmv(vid, name, sid) {
  if (M.bridge) {
    M.bridge.callHandler('19', {
      'k2': vid,
      "k3": g_coder.Base64.encode(name),
      "k7": g_coder.Base64.encode(sid)
    }, function () {
    });
    if (!navigator.userAgent.match(/iPhone|iPod|iPad/i)) {
      $('#audio').pause();
    }
  } else {
    location.href = 'http://y.qq.com/w/mv.html?vid=' + vid;
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

  if (comdata.length) {
    data[7] = data[7].replace('<!--fans_com_dot--%>', _fli(comdata.length))
      .replace('<!--bg_fans_title--%>', comdata[0][0])
      .replace('<!--bg_fans_from--%>', comdata[0][1])
      .replace('<!--bg_fans_content--%>', comdata[0][2]);
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