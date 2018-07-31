var _shareTitle = '致未来的自己一封信';
//var _logoHuawei = './../img/logo.png';
var _maskText = '让未来看看自己的过去';
var shareIni=null;
var weChatFriendsGroup = 'weChatFriendsGroup';//微信朋友圈
var weChatFriends = 'weChatFriends';//微信朋友
var QQ = 'QQ';//QQ
var TencentMicroBlog = 'TencentMicroBlog';//腾讯微博
var QQSpace = 'QQSpace';//QQ空间

/*$.ajax({
    url: host + "/api/index/index",
    data: {'url': window.location.href },
    type: "GET",
    // dataType: 'jsonp',
    success: function (res) {
        console.log(res.data);

    },
    error: function (e) {
    }
});*/

function shareInit() {
    var shareLink = 'http://hwc.vr68.com/api/index/share';
    function postSuccess(keyword) {
        $.ajax({
            type: 'POST',
            url: shareLink,
            data:{
                status: 1,
                keyword: keyword
            },
            success: function (res) {
            },
            error: function (e) {
            }
        });
        //alert('分享成功');
    }
    function postFail(keyword) {
        $.ajax({
            type: 'POST',
            url: shareLink,
            data:{
                status: 0,
                keyword: keyword
            },
            success: function (res) {
            },
            error: function (e) {
            }
        });
        //alert('分享失败');
    }
    if(!shareIni){
        throw new Error("微信配置信息获取失败");
    }

    /**
     * "wxa763aa3c0e6b1d9a"
     nonceStr
     :
     "7F1Cwpvnbz0WKWf0"
     signature
     :
     "325512f7747b46623649db4a5a7d52b22c5f47a6"
     timestamp
     :
     1529480232
     url
     :
     "http://hwc.vr68.com/huaweicloud/"
     */

    /** 通过config接口注入权限验证配置 **/
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: shareIni.appId, // 必填，公众号的唯一标识
        timestamp: shareIni.timestamp, // 必填，生成签名的时间戳
        nonceStr: shareIni.nonceStr, // 必填，生成签名的随机串
        signature: shareIni.signature,// 必填，签名
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'onMenuShareQZone'
        ] // 必填，需要使用的JS接口列表
    });
    /** 通过error接口处理失败验证 **/
    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    });

    /** 通过ready接口处理成功验证 **/
    wx.ready(function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
        // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
        // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        /**1 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口 **/
        wx.onMenuShareTimeline({
            title: _shareTitle, // 分享标题
            link: shareIni.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareIni.logo, // 分享图标
            success: function () {
                // 用户点击了分享后执行的回调函数
                postSuccess('weChatFriendsGroup');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                postFail('weChatFriendsGroup');
            }
        });

        /**2 获取“分享给朋友”按钮点击状态及自定义分享内容接口 **/
        wx.onMenuShareAppMessage({
            title: _shareTitle, // 分享标题
            desc: _maskText, // 分享描述
            link: shareIni.url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareIni.logo, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户点击了分享后执行的回调函数
                postSuccess('weChatFriends');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                postFail('weChatFriends');
            }
        });

        /**3 获取“分享到QQ”按钮点击状态及自定义分享内容接口 **/
        wx.onMenuShareQQ({
            title: _shareTitle, // 分享标题
            desc: _maskText, // 分享描述
            link: shareIni.url, // 分享链接
            imgUrl: shareIni.logo, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                postSuccess('QQ');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                postFail('QQ');
            }
        });

        /**4 获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口 **/
        wx.onMenuShareWeibo({
            title: _shareTitle, // 分享标题
            desc: _maskText, // 分享描述
            link: shareIni.url, // 分享链接
            imgUrl: shareIni.logo, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                postSuccess('TencentMicroBlog');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                postFail('TencentMicroBlog');
            }
        });

        /**5 获取“分享到QQ空间”按钮点击状态及自定义分享内容接口 **/
        wx.onMenuShareQZone({
            title: _shareTitle, // 分享标题
            desc: _maskText, // 分享描述
            link: shareIni.url, // 分享链接
            imgUrl: shareIni.logo, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
                postSuccess('QQSpace');
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                postFail('QQSpace');
            }
        });
    });


}