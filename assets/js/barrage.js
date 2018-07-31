function BarrageMethod() {
  // 弹幕文本
  this.text_ = [];

  this.boxIndex = 0; // 动画盒子索引

  this.app_; // 定时器变量

  this.htmlTemp_ = '';

  this.sorcketUrl = 'ws://139.159.233.59:2346';

  this.websocket;
}

BarrageMethod.prototype = {
  startNO:0,
  constructor: BarrageMethod,

  init: function () {
    this.receiveMessage();
  },

  htmlDiv: function (index) {
    return '<div style="display: inline-block" class="barrageBox barrageBox' + index + '" data-status="1"><div style="display: inline-block" class="barrageWrap"></div></div>'
  },

  RandomNum: function (Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    /*if (Math.round(Rand * Range) == 0) {
      return Min + 1;
    }*/
    var num = Min + Math.round(Rand * Range);
    return num;
  },
  update:function(){
    var barrageHeight_ = $('.barrageParent').height();
    var i=this.startNO;
    var l=this.startNO+10;
    l=(l>this.boxIndex?this.boxIndex:l);
    /*var i=0;
    var l=this.boxIndex;*/
    for (i; i < l; i++) {
      var element_ = $(document).find('.barrageBox'+i);
      var elementPrev_ = element_.prev();
      var width_ = element_.height()+barrageHeight_;
      var time_ = (width_ + barrageHeight_)*2;
      // var time_ = (width_ + 5112)*.1;
      if (elementPrev_.length > 0) {
        if (parseInt(elementPrev_.offset().top) < barrageHeight_ - elementPrev_.height() && element_.attr('data-status') == 1) {
          element_.attr('data-status', 0);
          element_.css({
            'transition': 'transform '+time_+'ms linear',
            'transform': 'translate3d(-50%,-'+width_+'px,0)'
          });
          (function(index,removeTime,that_){
            setTimeout(function () {
              that_.startNO++;
              var removeElement_ = $(document).find('.barrageBox'+index);
              removeElement_.remove();
              that_=null;
            },removeTime);
          })(i,time_,this);
        }
      } else {
        if(element_.attr('data-status') == 1) {

          element_.attr('data-status', 0);
          element_.css({
            'transition': 'transform '+time_+'ms linear',
            'transform': 'translate3d(-50%,-'+width_+'px,0)'
          });
          (function(index,removeTime,that_){
            setTimeout(function () {
              that_.startNO++;
              var removeElement_ = $(document).find('.barrageBox'+index);
              removeElement_.remove();
              that_=null;
            },removeTime);
          })(i,time_,this);
        }
      }
    }
  },

  innerBarrage: function (text) {
    var textLen = text.length;
    $('.barrageParent').append(this.htmlDiv(this.boxIndex));
    var boxInner = $(document).find('.barrageBox' + this.boxIndex + ' .barrageWrap');
    for (var i = 0; i < textLen; i++) {
      var mLeft_ = this.RandomNum(50, 220);
      var mTop_ = this.RandomNum(80, 300);
      var classInd = this.RandomNum(1, 6); //弹幕背景

      if(textLen < 2) {
        boxInner.append('<div class="barrage barrage' + classInd + '"><div class="barrageChild" style="top: ' + mTop_ + 'px;left: ' + this.RandomNum(-900, 900)+'px;">' +
            '<h5 class="font-ssb barrageUser">' + text[i].nickname + '</h5>' +
            '<div class="avatarBox pa"><img src="' + text[i].head_image + '"></div>' +
            '<p>' + text[i].content + '</p></div></div>');
      }else if(textLen < 3 && textLen >=2) {
        boxInner.append('<div class="barrage barrage' + classInd + '"><div class="barrageChild" style="top: ' + mTop_ + 'px;left: ' + this.RandomNum(-400, 400)+'px;">' +
            '<h5 class="font-ssb barrageUser">' + text[i].nickname + '</h5>' +
            '<div class="avatarBox pa"><img src="' + text[i].head_image + '"></div>' +
            '<p>' + text[i].content + '</p></div></div>');
      }else {
        boxInner.append('<div class="barrage barrage' + classInd + '" style="padding-left: ' + mLeft_ + 'px;"><div class="barrageChild" style="top: ' + mTop_ + 'px;">' +
            '<h5 class="font-ssb barrageUser">' + text[i].nickname + '</h5>' +
            '<div class="avatarBox pa"><img src="' + text[i].head_image + '"></div>' +
            '<p>' + text[i].content + '</p></div></div>');
      }
    }
    this.boxIndex += 1;
  },

  receiveMessage: function () {
    var that = this;
    this.websocket = new WebSocket(this.sorcketUrl);
    var heartCheck = {
      timeout: 60000,//60ms
      timeoutObj: null,
      serverTimeoutObj: null,
      reset: function(){
        clearTimeout(this.timeoutObj);
        clearTimeout(this.serverTimeoutObj);
        this.start();
      },
      start: function(){
        var self = this;
        this.timeoutObj = setTimeout(function(){
          self.serverTimeoutObj = setTimeout(function(){
            self.websocket.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
          }, self.timeout)
        }, this.timeout)
      }
    }

    this.websocket.onopen = function () {
      heartCheck.start();
    };
    this.websocket.onmessage = function (event) {
      that.text_ = JSON.parse(event.data);
      that.innerBarrage(that.text_);
      heartCheck.reset();
    };

    this.websocket.onclose = function () {
      reconnect();
    };
    this.websocket.onerror = function () {
      reconnect();
    };

   /* this.websocket = new WebSocket(this.sorcketUrl);
    this.websocket.onopen = function(evt) {
      console.log(evt)
    };
    this.websocket.onclose = function(evt) {
      console.log(evt+' -onclose')
    };
    this.websocket.onmessage = function(evt) {
      that.text_ = JSON.parse(evt.data);
      that.innerBarrage(that.text_);
    };
    this.websocket.onerror = function(evt) {
      console.log(evt+' -onerror')
    };*/
  }
}
var enabled=true;
var barrageMethod = new BarrageMethod();
barrageMethod.init();

//var interval_=setInterval(function(){
//  barrageMethod.update();
//},100);
function enterframe(){
  requestAnimationFrame(enterframe);
  if(!enabled)return;
  barrageMethod.update();
}
enterframe();


$('.submitBtn').click(function () {
  barrageMethod.innerBarrage();
});