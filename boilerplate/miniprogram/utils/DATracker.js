var ArrayProto=Array.prototype,FuncProto=Function.prototype,ObjProto=Object.prototype,slice=ArrayProto.slice,toString=ObjProto.toString,hasOwnProperty=ObjProto.hasOwnProperty;var nativeForEach=ArrayProto.forEach,nativeIndexOf=ArrayProto.indexOf,nativeIsArray=Array.isArray,breaker={};var _={};if(!Array.indexOf){Array.prototype.indexOf=function(el){for(var i=0,n=this.length;i<n;i++){if(this[i]===el){return i}}return -1}}_.checkTime=function(timeString){var date=timeString+"";var reg=/^(\d{4})-(\d{2})-(\d{2})$/;if(date){if(!reg.test(date)){return false}else{return true}}else{return false}};_.each=function(obj,iterator,context){if(obj===null||obj===undefined){return}if(nativeForEach&&obj.forEach===nativeForEach){obj.forEach(iterator,context)}else{if(obj.length===+obj.length){for(var i=0,l=obj.length;i<l;i++){if(i in obj&&iterator.call(context,obj[i],i,obj)===breaker){return}}}else{for(var key in obj){if(hasOwnProperty.call(obj,key)){if(iterator.call(context,obj[key],key,obj)===breaker){return}}}}}};_.extend=function(obj){_.each(slice.call(arguments,1),function(source){for(var prop in source){if(source[prop]!==void 0){obj[prop]=source[prop]}}});return obj};_.isArray=nativeIsArray||function(obj){return Object.prototype.toString.apply(obj)==="[object Array]"};_.isObject=function(obj){return(obj===Object(obj)&&!_.isArray(obj))};_.isUndefined=function(obj){return obj===void 0};_.truncate=function(obj,length){var ret;if(typeof(obj)==="string"){ret=obj.slice(0,length)}else{if(_.isArray(obj)){ret=[];_.each(obj,function(val){ret.push(_.truncate(val,length))})}else{if(_.isObject(obj)){ret={};_.each(obj,function(val,key){ret[key]=_.truncate(val,length)})}else{ret=obj}}}return ret};_.base64Encode=function(data){var b64="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var o1,o2,o3,h1,h2,h3,h4,bits,i=0,ac=0,enc="",tmp_arr=[];if(!data){return data}data=_.utf8Encode(data);do{o1=data.charCodeAt(i++);o2=data.charCodeAt(i++);o3=data.charCodeAt(i++);bits=o1<<16|o2<<8|o3;h1=bits>>18&63;h2=bits>>12&63;h3=bits>>6&63;h4=bits&63;tmp_arr[ac++]=b64.charAt(h1)+b64.charAt(h2)+b64.charAt(h3)+b64.charAt(h4)}while(i<data.length);enc=tmp_arr.join("");switch(data.length%3){case 1:enc=enc.slice(0,-2)+"==";break;case 2:enc=enc.slice(0,-1)+"=";break}return enc};_.utf8Encode=function(string){string=(string+"").replace(/\r\n/g,"\n").replace(/\r/g,"\n");var utftext="",start,end;var stringl=0,n;start=end=0;stringl=string.length;for(n=0;n<stringl;n++){var c1=string.charCodeAt(n);var enc=null;if(c1<128){end++}else{if((c1>127)&&(c1<2048)){enc=String.fromCharCode((c1>>6)|192,(c1&63)|128)}else{enc=String.fromCharCode((c1>>12)|224,((c1>>6)&63)|128,(c1&63)|128)}}if(enc!==null){if(end>start){utftext+=string.substring(start,end)}utftext+=enc;start=end=n+1}}if(end>start){utftext+=string.substring(start,string.length)}return utftext};_.sha1=function(str){var hexcase=0;var b64pad="";var chrsz=8;function hex_sha1(s){return binb2hex(core_sha1(str2binb(s),s.length*chrsz))}function b64_sha1(s){return binb2b64(core_sha1(str2binb(s),s.length*chrsz))}function str_sha1(s){return binb2str(core_sha1(str2binb(s),s.length*chrsz))}function hex_hmac_sha1(key,data){return binb2hex(core_hmac_sha1(key,data))}function b64_hmac_sha1(key,data){return binb2b64(core_hmac_sha1(key,data))}function str_hmac_sha1(key,data){return binb2str(core_hmac_sha1(key,data))}function sha1_vm_test(){return hex_sha1("abc")=="a9993e364706816aba3e25717850c26c9cd0d89d"}function core_sha1(x,len){x[len>>5]|=128<<(24-len%32);x[((len+64>>9)<<4)+15]=len;var w=Array(80);var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;var e=-1009589776;for(var i=0;i<x.length;i+=16){var olda=a;var oldb=b;var oldc=c;var oldd=d;var olde=e;for(var j=0;j<80;j++){if(j<16){w[j]=x[i+j]}else{w[j]=rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1)}var t=safe_add(safe_add(rol(a,5),sha1_ft(j,b,c,d)),safe_add(safe_add(e,w[j]),sha1_kt(j)));e=d;d=c;c=rol(b,30);b=a;a=t}a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);e=safe_add(e,olde)}return Array(a,b,c,d,e)}function sha1_ft(t,b,c,d){if(t<20){return(b&c)|((~b)&d)}if(t<40){return b^c^d}if(t<60){return(b&c)|(b&d)|(c&d)}return b^c^d}function sha1_kt(t){return(t<20)?1518500249:(t<40)?1859775393:(t<60)?-1894007588:-899497514}function core_hmac_sha1(key,data){var bkey=str2binb(key);if(bkey.length>16){bkey=core_sha1(bkey,key.length*chrsz)}var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++){ipad[i]=bkey[i]^909522486;opad[i]=bkey[i]^1549556828}var hash=core_sha1(ipad.concat(str2binb(data)),512+data.length*chrsz);return core_sha1(opad.concat(hash),512+160)}function safe_add(x,y){var lsw=(x&65535)+(y&65535);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&65535)}function rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt))}function str2binb(str){var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz){bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(24-i%32)}return bin}function binb2str(bin){var str="";var mask=(1<<chrsz)-1;for(var i=0;
    i<bin.length*32;i+=chrsz){str+=String.fromCharCode((bin[i>>5]>>>(24-i%32))&mask)}return str}function binb2hex(binarray){var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++){str+=hex_tab.charAt((binarray[i>>2]>>((3-i%4)*8+4))&15)+hex_tab.charAt((binarray[i>>2]>>((3-i%4)*8))&15)}return str}function binb2b64(binarray){var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3){var triplet=(((binarray[i>>2]>>8*(3-i%4))&255)<<16)|(((binarray[i+1>>2]>>8*(3-(i+1)%4))&255)<<8)|((binarray[i+2>>2]>>8*(3-(i+2)%4))&255);for(var j=0;j<4;j++){if(i*8+j*6>binarray.length*32){str+=b64pad}else{str+=tab.charAt((triplet>>6*(3-j))&63)}}}return str}return hex_sha1(str)};_.UUID=(function(){var callback=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c=="x"?r:(r&3|8);return v.toString(16)})};return callback})();_.HTTPBuildQuery=function(formdata,arg_separator){var use_val,use_key,tmp_arr=[];if(_.isUndefined(arg_separator)){arg_separator="&"}_.each(formdata,function(val,key){use_val=encodeURIComponent(val.toString());use_key=encodeURIComponent(key);tmp_arr[tmp_arr.length]=use_key+"="+use_val});return tmp_arr.join(arg_separator)};_.isJSONString=function(str){try{JSON.parse(str)}catch(e){return false}return true};_.localStorage={setStorage:function(){},getStorage:function(){return wx.getStorageSync("DATracker_wechat")||""},_state:{},toState:function(t){var e=null;_.isJSONString(t)?(e=JSON.parse(t),e.deviceUdid?this._state=e:this.set("deviceUdid",_.UUID())):this.set("deviceUdid",_.UUID())},set:function(t,e){this._state=this._state||{};this._state[t]=e;return this.save()},get:function(t){return this._state[t]||""},save:function(){var saveComplete={isOk:true,errorMsg:""};try{var str=JSON.stringify(this._state);wx.setStorageSync("DATracker_wechat",str);if(str!==this.getStorage()){saveComplete.isOk=false;saveComplete.errorMsg="保存后，重新获取不一致"}}catch(error){saveComplete.isOk=false;saveComplete.errorMsg=error}return saveComplete},init:function(){var t=this.getStorage();t?this.toState(t):this.set("deviceUdid",_.UUID())}};_.console=function(){if("object"==typeof console&&console.log){try{return console.log.apply(console,arguments)}catch(t){console.log(arguments[0])}}};_.info={callback:function(){},properties:{},getSystem:function(){var self=this;var properties=self.properties;function getNetWork(){wx.getNetworkType({success:function(res){properties.networkType=res.networkType},complete:other})}function other(){wx.getSystemInfo({success:function(res){properties.deviceModel=res.model;properties.screenWidth=Number(res.windowWidth);properties.screenHeight=Number(res.windowHeight);properties.deviceOs=res.system.split(" ")[0];properties.deviceOsVersion=res.system.split(" ")[1],properties.devicePlatform=res.platform;properties.weixinVersion=res.version;properties.localeLanguage=res.language},complete:self.setStatusComplete.bind(self)})}getNetWork()},setStatusComplete:function(){_.localStorage.set("deviceProperties",this.properties);this.callback(this.properties)}};
    

    var lLIBVERSION = '1.1.1';
    var SDKTYPE = 'MiniProgram';
    
    _.localStorage.init();
    
    function on(obj, event, callFn) {
        if(obj[event]) {
            var fn = obj[event];
            obj[event] = function(obj) {
                callFn.call(this, obj, event);
                fn.call(this, obj);
            };
        } else {
            obj[event] = function(obj) {
                callFn.call(this, obj, event);
            };
        }
    }
    
    //默认事件类型
    var DATATYPE = 'e';
    /**
     * 内置事件
     */
    var DEFAULTEVENTID = {
        //表示会话开始事件
        'da_session_start': {
            'dataType': 'ie'
        },
        //表示会话结束事件
        'da_session_close': {
            'dataType': 'ie'
        },
        //通过用户登陆传入的 userId 信息来映射设备 ID, 用户登出事件
        'da_u_login': {
            'dataType': 'ie'
        },
        //用户登录事件
        'da_u_logout': {
            'dataType': 'ie'
        },
        //用户 ID 关联 绑定输入的 newUserId 和已有 userID，用户注册等同一用户 userId 变动场景。
        'da_u_signup': {
            'dataType': 'ie'
        },
        //用户属性设置内部事件
        'da_user_profile': {
            'dataType': 'ie'
        },
        //页面浏览事件，浏览是一大类用户交互集合，设计特定 dataType = “pv”
        'da_screen': {
            'dataType': 'pv'
        },
        //应用激活事件，应用第一次打开时发送
        'da_activate': {
            'dataType': 'ie'
        },
        // 发送数据异常错误
        'da_send_error': {
            'dataType': 'ie'
        }
    };
    /**
     * 开发约定： 对外 api 格式 :  mm_dd_ww()
     * 内部api 格式 : mmDdWw()
     * 
     */
    var DATracker = {
        config: {
            apiHost: 'https://hubble.netease.com',
            appKey: '',
            userId: '',
            sessionStartTime: '',
            persistedTime: '',
            //最后一次触发事件，事件名称和触发时间
            lastEvent: {
                eventId: '',
                time: ''
            },
            //系统信息
            systemInfo: {},
            deviceUdid: '',
            debug: false,
            //传入的字符串最大长度限制
            maxStringLength: 255,
            trackLinksTimeout:    300,
            costTime: {},
            appVersion: '',
            //重新定义埋点的数据发送函数
            //fn ：重写发送的数据函数
            //start : 设置为true后，fn即启动，默认为false
            sendConfig: {
                start: false,
                //params: url, method, success, fail, data
                fn: function(params) {}
            },
            // 发送数据异常上报开关，默认为false
            sendError: false
        },
        //获取系统信息完成标志,默认 false，未完成
        getSystemInfoComplete: false,
        //发送事件队列集合
        queue: [],
        disabledEvents: [],
        /**
         * 信息保存到本地
         * 若失败，尝试保存，最多尝试2次
         */
        set() {
            var self = this;
            var count = 0;
            var saveLocal = function() {
                var saveComplete = _.localStorage.set('config', JSON.stringify(self['config']));
                var errorMsg = saveComplete.errorMsg;
                // 当保存数据到本地失败后，重试后还失败上报异常数据
                if (!saveComplete.isOk) {
                    if(2 > count) {
                        count++;
                        saveLocal();
                    } else {
                        // 尝试2次还是失败时，上报异常数据
                        if (typeof errorMsg !== 'object') {
                            errorMsg = {
                                errorMsg: errorMsg
                            };
                        }
                        self.daSendError(errorMsg);
                    }
                }
            };
            saveLocal();
        },
        init(appKey, config) {
            var localConfig = _.localStorage.get('config');
            if(_.isJSONString(localConfig)) {
                localConfig = JSON.parse(localConfig);
                _.extend(this['config'], localConfig || {});
            }
            _.extend(this['config'], config || {});
            this.getSystem();
            this.setConfig('appKey', appKey);
            this.daActivate();
        },
        /**
         * 获取配置信息
         */
        getConfig(propName) {
            return this['config'][propName];
        },
        /**
         * 设置配置信息
         */
        setConfig(propName, propVal) {
            this['config'][propName] = propVal;
        },
        /**
         * 设置配置信息，有就不设置
         */
        setConfigOnce(propName, propVal) {
            if(!this['config'][propName]) {
                this.setConfig(propName, propVal);
                this.set();
            }
        },
        /**
         * 获取本地标识
         */
        getDeviceUdid() {
            var localDeviceUdid = this.getConfig('deviceUdid');
            if(!localDeviceUdid) {
                localDeviceUdid = _.localStorage.get('deviceUdid');
                this.setConfig('deviceUdid', localDeviceUdid );
                this.set();
            }
            return localDeviceUdid;
        },
        /**
         * 获取用户useId
         */
        getUserId() {
            return this.getConfig('userId');
        },
        /**
         * 获取系统信息
         */
        getSystem() {
            var self = this;
            _.info.callback = function(systemInfo) {
                self.getSystemInfoComplete = true;
                self.setConfig('systemInfo', systemInfo);
                self.set();
                if(self.queue.length > 0) {
                    _.each(self.queue, function(t) {
                        self.send.apply(self, Array.prototype.slice.call(t));
                    });
                    self.queue = [];
                }
            };
            _.info.getSystem();
        },
        // 设置当前页路径，不带参数
        setRoute(route) {
            //临时设置 route地址，不保存到本地
            this['config']['route'] = route;
        },
        getRoute() {
            return this['config']['route'];
        },
        // 设置当前页url，带参数
        setUrl(route) {
            // 保存到本地
            var pageParameter = this.getPageParameter();
            route = route ? route : this.getRoute();
            if (pageParameter) {
                this['config']['url'] = route + pageParameter;
            } else {
                this['config']['url'] = route;
            }
            // this.set();
        },
        getUrl(route) {
            return this['config']['url']; 
        },
        setReferrer(referrer) {
            referrer = typeof referrer !== 'undefined' ? referrer : this.getUrl();
            this.setOldReferrer(this['config']['referrer']);
            this['config']['referrer'] = referrer;
        },
        setOldReferrer(referrer) {
            if (this['config']['oldReferrer'] !== referrer) {
                this['config']['oldReferrer'] = referrer;
            }
        },
        // 当后台切换到前台时，调用
        repeatSetReferrer() {
            this['config']['referrer'] = this['config']['oldReferrer'];
        },
        getReferrer() {
           return this['config']['referrer'];
        },
        // 获取当前页面参数
        getPageParameter() {
            var currentPages = getCurrentPages();
            var route = this.getRoute();
            var obj = {};
            var str = '';
            for (var i = 0; i < currentPages.length; i += 1) {
                if (currentPages[i].route === route) {
                    obj = currentPages[i].options;
                    break;
                }
            }
            for(var key in obj) {
                if (obj.hasOwnProperty(key)) {
                  if (str === '') {
                      str = '?' + key + '=' + obj[key];
                  } else {
                     str += '&' + key + '=' + obj[key];
                  }
                }
            }
            return str;
         },
        /**
         * session 开始
         */
        sessionStart() {
            //如果上次的session close未发送，再次发送
            if(this.getConfig('sessionUuid')) {
                this.sessionClose();
            }
            this.setConfig('sessionUuid', _.UUID());
            this.setConfig('sessionStartTime', new Date().getTime());
            this.track('da_session_start');
        },
        /**
         * session 结束
         */
        sessionClose() {
            var sessionStartTime = this.getConfig('sessionStartTime');
            var lastEvent = this.getConfig('lastEvent') || {
                time: new Date().getTime(),
                eventId: ''
            };
            var sessionCloseTime = lastEvent.time;
            var sessionTotalLength = sessionCloseTime - sessionStartTime;
            this.track('da_session_close', {
                sessionCloseTime: sessionCloseTime,
                sessionTotalLength: sessionTotalLength
            });
            this.setConfig('sessionUuid', '');
        },
        /**
         * da_activate事件
         */
        daActivate() {
            var localDeviceUdid = this.getConfig('deviceUdid');
            if(!localDeviceUdid) {
                localDeviceUdid = _.localStorage.get('deviceUdid');
                this.setConfig('deviceUdid', localDeviceUdid );
                this.track('da_activate');
                this.set();
            }
        },
        /**
         * 上报异常数据事件 da_send_error
         * @param {Object} error
         */
        daSendError(error) {
            if (!error) {
                this.track('da_send_error', error);
            }
        },
        setEventTimer(eventName, timestamp) {
            var timers = this.getConfig('costTime') || {};
            timers[eventName] = timestamp;
            this.setConfig('costTime', timers);
        },
        removeEventTimer(eventName) {
            var timers = this.getConfig('costTime') || {};
            var timestamp = timers[eventName];
            if(!_.isUndefined(timestamp)) {
                delete timers[eventName];
                this.setConfig('costTime', timers);
            }
            return timestamp;
        },
        /**
         * 统计事件耗时(ms)，参数为事件名称。触发一次后移除该事件的耗时监听
         */
        time_event(eventName) {
            if(_.isUndefined(eventName)) {
                _.console('必须传入事件名称');
                return;
            }
            this.setEventTimer(eventName, new Date().getTime());
        },   
        /**
         * pv
         */
        track_pageview(properties) {
            this.track('da_screen', properties || {});
        },
        /**
         * 用户注册
         */
        signup(userId) {
            var oldUserId = this.getConfig('userId');
            oldUserId = oldUserId == undefined ? '' : oldUserId;
            if(oldUserId == userId){
                return;
            }
            this.setConfig('userId', userId);
            this.set();
            this.track('da_u_signup',{
                "oldUserId": oldUserId,
                "newUserId": userId
            });
        },
        /**
         * 用户登录记住用户名
         * @param {String|Number} 用户唯一标识
         */
        login(userId) {
            this.signup(userId);
            this.track('da_u_login');
        },
        /**
         * 用户退出，清除用户id
         */
        logout(callback) {
            this.setConfig('userId', '');
            this.set();
            var hasCalled = false;
            function trackCallback() {
                if(!hasCalled) {
                    hasCalled = true;
                    if(typeof callback === 'function') {
                        callback();
                    }
                }
            }
            //如果没有回调成功，设置超时回调
            setTimeout(trackCallback, this.getConfig('trackLinksTimeout'));
            var data = this.track('da_u_logout', {}, trackCallback);
            return data;
        },
        /**
         * 数据发送
         */
        send(data, callback) {
            if (!this.getSystemInfoComplete) return (this.queue.push(arguments), !1);
            var count = 0;
            var url = this.getConfig('apiHost') + '/track/w/';
            var systemInfo = this.getConfig('systemInfo');
            var basicInfo = {
                'deviceOs': systemInfo.deviceOs,
                'deviceOsVersion': systemInfo.deviceOsVersion,
                'devicePlatform': systemInfo.devicePlatform,
                'weixinVersion': systemInfo.weixinVersion,
                'screenWidth':  systemInfo.screenWidth,
                'screenHeight': systemInfo.screenHeight,
                'deviceModel':  systemInfo.deviceModel,
                'networkType': systemInfo.networkType,
                'localeLanguage': systemInfo.localeLanguage,
                'appVersion': this.getConfig('appVersion')
            };
            _.extend(data.data, basicInfo);
            var truncatedData = _.truncate(data['data'], this.getConfig('maxStringLength'));
            var jsonData      = JSON.stringify(truncatedData);
            var encodedData   = _.base64Encode(jsonData);
            var appkeyData = _.sha1(this.getConfig('appKey'));
            if(this.getConfig('debug')) {
                _.console(truncatedData);
            }
            data['data'] = encodedData;  
            data['_'] = new Date().getTime().toString();
            data['appKey'] = appkeyData;
            url += '?' + _.HTTPBuildQuery(data);
            var sendData = function() {
                wx.request({
                    url: url,
                    method: "GET",
                    success: function(res) {
                        if(typeof callback === 'function') {
                            callback(res, data);
                        }
                    },
                    fail: function() {
                        _.console("发送错误，重新发送"); 
                        if(2 > count) {
                            count++;
                            sendData()
                        }
                    }
                });
            };
            if( this.getConfig('sendConfig').start ) {
                if(typeof this.getConfig('sendConfig').fn === 'function') {
                    var successFn = function(res) {
                        if(typeof callback === 'function') {
                            callback(res, truncatedData);
                        }
                    };
                    var failFn = function(e) {
                        _.console("发送错误，重新发送");
                    };
                    this.getConfig('sendConfig').fn({url: url, method: 'GET', success: successFn, fail: failFn, data: _.HTTPBuildQuery(data)});
                }
            } else {
                sendData();
            }
        },
        /**
         * 发送事件
         */
        track(eventName, properties, callback) {
            properties = properties || {};
            var dataType = DATATYPE;
            var otherProperties = {};
            var userSetProperties =  JSON.parse( JSON.stringify(properties) );
            //事件耗时(ms)
            var startTimestamp = this.removeEventTimer(eventName);
            if(!_.isUndefined(startTimestamp)) {
                otherProperties['costTime'] = new Date().getTime() - startTimestamp;
            }
            //如果是内置事件,事件类型重新设置
            if(DEFAULTEVENTID[eventName]) {
                dataType = DEFAULTEVENTID[eventName].dataType;
            }
            //时间
            var time = new Date().getTime();
            //事件为 da_session_close
            //自定义属性中删除不需要的属性
            if(eventName == 'da_session_close') {
                time = properties.sessionCloseTime;
                delete userSetProperties['sessionCloseTime'];
                delete userSetProperties['sessionTotalLength'];
            }
            //事件为 da_session_start
            if(eventName == 'da_session_start') {
                time = this.getConfig('sessionStartTime');
            }
    
            this.setConfigOnce('persistedTime', time);
            var systemInfo = this.getConfig('systemInfo');
            var data = {
                'dataType': dataType,
                'eventId': eventName,
                'appKey': this.getConfig('appKey'),
                'sessionUuid': this.getConfig('sessionUuid'),
                'userId': this.getConfig('userId'),
                'currentUrl': this.getUrl(),
                'sdkVersion': lLIBVERSION,
                'sdkType': SDKTYPE,
                'sessionTotalLength': properties.sessionTotalLength,
                'time': time,
                'persistedTime': this.getConfig('persistedTime'),
                'deviceUdid': this.getDeviceUdid(),
                'urlPath': this.getRoute(),
                'referrer': this.getReferrer(),
                'attributes': userSetProperties
            };
            if(!_.isUndefined(otherProperties['costTime'])) {
                data['costTime'] = otherProperties['costTime'];
            }
            this.send({'data': data}, callback);
    
            //最后一次触发的事件，解决
            //session_close 事件的时间计算
            if(['da_session_close','da_session_start'].indexOf(eventName) === -1) {
                this.setConfig('lastEvent', {
                    eventId: eventName,
                    time: time
                });
            }
        },
        /**
         * 发送用户属性
         * 
         * peopleSet.set('gender', '男');
         * or
         * peopleSet.set({'gender':'男'});
         */
        peopleSet(properties, to, callback) {
            var data = {
                'dataType': 'ie',
                'appKey': this.getConfig('appKey'),
                'deviceUdid': this.getDeviceUdid(),
                'userId': this.getConfig('userId'),
                'time': new Date().getTime(),
                'sdkType': SDKTYPE,
                'eventId': 'da_user_profile',
                'persistedTime': this.getConfig('persistedTime')
            };
            var $set = {
                '$userProfile': {
                    '$type': 'profile_set'
                }
            };
            if(_.isObject(properties)) {
                _.each(properties, function(v, k) {
                    $set['$userProfile'][k] = v;
                }, this);
                callback = to;
            } else {
                $set['$userProfile'][prop] = to;
            }
            data['attributes'] = $set;
            this.send({'data': data}, callback);
        },
        /**
         * 用户属性
         */
        people: {
            /**
             * 设置自定义用户属性
             */
            set(properties, to, callback) {
                DATracker.peopleSet(properties, to, callback);
            },
            /**
             * 设置: 姓名
             */
            set_realname(realname) {
                DATracker.peopleSet({"$realName" : realname});
            },
            /**
             * 设置: 国家
             */
            set_country(country) {
                DATracker.peopleSet({"$country" : country});
            },
            /**
             * 设置：省份
             */
            set_province(province) {
                DATracker.peopleSet({"$region" : province});
            },
            /**
             * 设置：城市
             */
            set_city(city) {
                DATracker.peopleSet({"$city" : city});
            },
            /**
             * 设置：性别  0-女，1-男，2-未知
             */
            set_gender(gender) {
                if ([0,1,2].indexOf(gender) > -1) {
                    DATracker.peopleSet({"$gender" : gender});
                }
            },
            /**
             * 设置：生日
             */
            set_birthday(birthday) {
                if(!_.checkTime(birthday)) return; 
                DATracker.peopleSet({"$birthday" : birthday});
            },
            /**
             * 大集合：账户 + 姓名 + 生日 + 性别
             */
            set_populationWithAccount(account, realname, birthday, gender) {
                if(!account || !realname || !birthday || [0,1,2].indexOf(gender) === -1) return;
                if(!_.checkTime(birthday)) return; 
                //生日合法检测，yy-MM-dd
                DATracker.peopleSet({'$account': account, "$realName" : realname, "$birthday": birthday, "$gender": gender});
            },
            /**
             * 国家 + 省份 + 城市
             */
            set_location(country, region, city) {
                if(!country || !region || !city) return;
                DATracker.peopleSet({"$country" : country, "$region": region, "$city": city});
            }
        }
    };
    
    //当应用初始化时触发该方法
    function appLaunch() {
        this['DATracker'] = DATracker;
        DATracker.setReferrer('');
        DATracker.setOldReferrer('');
    }
    
    function appShow() {
        // 后台切换到前台，page隐藏重新设置的referrer是本页 currentUrl，这时候 referrer是不对的，需要判断重新设置
        DATracker.repeatSetReferrer();
        DATracker.sessionStart();
        DATracker.set();
    }
    
    function appHide() {
        DATracker.sessionClose();
        DATracker.set();
    }
    
    //当页面显示时触发该方法
    // __route__  参考： http://www.jb51.net/article/110067.htm
    function pageOnshow() {
        var self = this;
        var route = ("string" == typeof self.__route__) ? self.__route__ : "";
        DATracker.setRoute(route);
        DATracker.setUrl();
        var onPageShow = function() {
            if(DATracker.config.onPageShow) {
                DATracker.config.onPageShow(DATracker, route, self);
            } else {
                DATracker.track_pageview();
            }
        };
        onPageShow();
    }
    
    // 当页面离开时触发，设置referrer
    function onHide() {
       DATracker.setReferrer();
       DATracker.set();
    }
    
    function onUnload() {
      DATracker.setReferrer();
      DATracker.set();
    }
    
    var p = App;
    var v = Page;
    //重新定义 App
    App = function(obj) {
        //添加监听，重新定义 onLaunch、onShow、onHide
        on(obj, "onLaunch", appLaunch);
        on(obj, "onShow", appShow);
        on(obj, "onHide", function() {});
        //实例化App
        p(obj);
    };
    //重新定义 Page
    Page = function(obj) {
        //添加监听，重新定义 onLoad、onUnload、onShow、onHide
        on(obj, "onLoad", function() {});
        on(obj, "onUnload", onUnload);
        on(obj, "onShow", pageOnshow); 
        on(obj, "onHide", onHide);
        //实例化Page
        v(obj);
    };
    
    
    export default DATracker;