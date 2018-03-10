(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
exports.endianness = function () { return 'LE' };

exports.hostname = function () {
    if (typeof location !== 'undefined') {
        return location.hostname
    }
    else return '';
};

exports.loadavg = function () { return [] };

exports.uptime = function () { return 0 };

exports.freemem = function () {
    return Number.MAX_VALUE;
};

exports.totalmem = function () {
    return Number.MAX_VALUE;
};

exports.cpus = function () { return [] };

exports.type = function () { return 'Browser' };

exports.release = function () {
    if (typeof navigator !== 'undefined') {
        return navigator.appVersion;
    }
    return '';
};

exports.networkInterfaces
= exports.getNetworkInterfaces
= function () { return {} };

exports.arch = function () { return 'javascript' };

exports.platform = function () { return 'browser' };

exports.tmpdir = exports.tmpDir = function () {
    return '/tmp';
};

exports.EOL = '\n';

exports.homedir = function () {
	return '/'
};

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
const { detect } = require('detect-browser');
const browser = detect();


var agents = require('browser-agents');
console.log(agents.Chrome.random());
console.log(agents.Opera.random());
agents.Safari.random();
agents.Firefox.random();
agents.IE.random();



// handle the case where we don't detect the browser
if (browser) {
    console.log(browser.name);
    console.log(browser.version);

    //        var result = browser();
       var status = "<span style='color:red'>Fail</span>";

       if( (browser.name==='chrome' && parseInt(browser.version)>=30) ||
           (browser.name==='firefox' && parseInt(browser.version)>=27) ||
           (browser.name==='edge' && parseInt(browser.version)>=11) ||
           (browser.name==='ie' && parseInt(browser.version)>=11) ||
           (browser.name==='safari' && parseInt(browser.version)>=7) ||
           (browser.name==='safari mobile'  && parseInt(browser.version)>=5)
       ){
           status = "<span style='color:green'>Pass</span>";

       }

       var root = document.getElementById('root');
       root.innerHTML = '<p>' + JSON.stringify(browser) + '</p>' + '<p> Status = ' + status + '</p>';

}



},{"browser-agents":5,"detect-browser":6}],4:[function(require,module,exports){
module.exports={"IE":{"9.0":"Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; WOW64; Trident/5.0; BOIE9;RURU)","11.0":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; Trident/7.0; ASU2JS; rv:11.0) like Gecko","6.0":"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; GTB0.0; .NET CLR 1.0.3705; .NET CLR 1.1.4322; Media Center PC 4.0; .NET CLR 2.0.50727)","7.0":"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.1; WOW64; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3)","8.0":"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; GTB7.5; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; OfficeLiveConnector.1.5; OfficeLivePatch.1.3; .NET4.0C; .NET4.0E)","10.0":"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; tb-webde/2.6.3)","5.5":"Mozilla/4.0 (compatible; MSIE 5.5; Windows 95; BCD2000)","999.1":"Mozilla/4.0 (compatible; MSIE 999.1; Unknown)","5.01":"Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0; byond_3.5)","4.01":"Mozilla/4.0 (compatible; MSIE 4.01; Windows CE; Smartphone; 240x320)","5.0":"Mozilla/4.0 (compatible; MSIE 5.0b1; Mac_PowerPC)","4.0":"Mozilla/4.0 (compatible; MSIE 4.0; Windows NT; ....../1.0 )","5.23":"Mozilla/4.0 (compatible; MSIE 5.23; Mac_PowerPC)","5.16":"Mozilla/4.0 (compatible; MSIE 5.16; Mac_PowerPC)","5.17":"Mozilla/4.0 (compatible; MSIE 5.17; Mac_PowerPC)","1.8":"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; User-agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; http://bsalsa.com) ; User-agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; http://bsalsa.com) (Mozilla/5.0 (Windows; U; Windows NT 5.1; en; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11))","5.21":"Mozilla/4.0 (compatible; MSIE 5.21; Mac_PowerPC)","2.0":"Mozilla/1.22 (compatible; MSIE 2.0; Windows 95)","6.01":"Mozilla/4.0 (compatible; MSIE 6.01; Windows NT 5.1)","6.5":"Mozilla/4.0 (compatible; MSIE 6.5; Windows NT 5.1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)","3.02":"Mozilla/2.0 (compatible; MSIE 3.02; Windows NT)","7.00":"Mozilla/4.0 (compatible; MSIE 7.00; Windows NT 5.1; SV1; MEGAUPLOAD 1.0)","888.0":"Mozilla/222.0 (MSIE 888.0)","5.13":"Mozilla/4.0 (compatible; MSIE 5.13; Mac_PowerPC)","5.22":"Mozilla/4.0 (compatible; MSIE 5.22; Mac_PowerPC)","6.1":"Mozilla/4.0 (compatible; MSIE 6.1; Windows XP)"},"Safari":{"3.1":"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_8; en-us) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/3.1.1 Safari/525.18","5.0":"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.20 (KHTML, like Gecko) Version/5.0.4 Safari/533.20","3.2":"Mozilla/5.0 (Windows; U; Windows NT 5.1; ja-JP) AppleWebKit/525.28.3 (KHTML, like Gecko) Version/3.2.3 Safari/525.29","4.0":"Mozilla/5.0 (Linux; U; Linux 2.6;  de; TOSHIBA_AC_AND_AZ) AppleWebKit/530.17(KHTML, like Gecko) Version/4.0 Safari/530.17","6.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/536.26.17 (KHTML like Gecko) Version/6.0.2 Safari/536.26.17","5.1":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/534.59.10 (KHTML, like Gecko) Version/5.1.9 Safari/534.57.2","8.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/600.7.7 (KHTML, like Gecko) Version/8.0.7 Safari/600.7.7","7.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9) AppleWebKit/537.71 (KHTML, like Gecko) Version/7.0 Safari/537.71 GM_UserLogon","3.0":"Mozilla/5.0 (Macintosh; U; Intel Mac OS X; en-gb) AppleWebKit/523.10.6 (KHTML, like Gecko) Version/3.0.4 Safari/523.10.6","4.1":"Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_7; en-us) AppleWebKit/533.4 (KHTML, like Gecko) Version/4.1 Safari/533.4","0.0":"Mozilla/5.0 (SMART-TV; Linux; Tizen 2.3) AppleWebkit/538.1 (KHTML, like Gecko) SamsungBrowser/1.0 TV Safari/538.1","6.1":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.78.2 (KHTML, like Gecko) Version/6.1.6 Safari/537.78.2","7.1":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.4.10 (KHTML, like Gecko) Version/7.1.4 Safari/537.85.13","9.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/600.8.9 (KHTML, like Gecko) Version/9.0.3 Safari/601.4.4","6.2":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/600.6.3 (KHTML, like Gecko) Version/6.2.6 Safari/537.85.15","5.2":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8) AppleWebKit/536.8.5 (KHTML, like Gecko) Version/5.2 Safari/536.8.5","1.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.78.2 (KHTML, like Gecko) Version/1.0 Safari/1","9.1":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/601.5.10 (KHTML, like Gecko) Version/9.1 Safari/601.5.10"},"Chrome":{"36.0":"Mozilla/5.0 (X11; CrOS x86_64 5841.83.0) AppleWebKit/537.36 (KHTML like Gecko) Chrome/36.0.1985.138 Safari/537.36","35.0":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.132 Safari/537.36","32.0":"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.18 (KHTML, like Gecko) Chrome/32.0.1667.0 Safari/537.18","12.0":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/534.30 (KHTML, like Gecko) Chrome/12.0.742.4 Safari/534.30","9.0":"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/534.13 (KHTML, like Gecko) Chrome/9.0.597.15 Safari/534.13","10.0":"Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.205 Safari/534.16","26.0":"Mozilla/5.0 (Linux; Android 4.1.2; Archos 80 Xenon Build/JZO54K) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.58 Safari/537.31","8.0":"Mozilla/5.0 (Linux; U; Linux Ventana; en-us; Transformer TF101G Build/HTJ85B) AppleWebKit/534.13 (KHTML, like Gecko) Chrome/8.0 Safari/534.13","31.0":"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Safari/537.36","11.0":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.34 Safari/534.24 XiaoMi/MiuiBrowser/1.0","22.0":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.2 (KHTML, like Gecko) Chrome/22.0 Safari/537.2","3.0":"Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/531.0 (KHTML, like Gecko) Chrome/3.0.195.0 Safari/531.0 SE 2.X","5.0":"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.9 (KHTML, like Gecko) Chrome/5.0 Safari/532.9","6.0":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/533.8 (KHTML, like Gecko) Chrome/6.0.397.0 Safari/533.8","27.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/537.36 (KHTML, like Gecko, Google-Publisher-Plugin) Chrome/27.0.1453 Safari/537.36","39.0":"Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36","7.0":"Mozilla/5.0 (Windows; U; Windows NT 6.2; en-US) AppleWebKit/534.7 (KHTML, like Gecko) Chrome/7.0.517.41 Safari/534.7","23.0":"Mozilla/5.0 (X11; FreeBSD; U; Viera; cs-CZ) AppleWebKit/537.11 (KHTML, like Gecko) Viera/3.3.3 Chrome/23.0.1271.97 Safari/537.11","24.0":"Mozilla/5.0 (X11; U; Unix; en-US) AppleWebKit/537.15 (KHTML, like Gecko) Chrome/24.0.1295.0 Safari/537.15 Surf/0.6","30.0":"Mozilla/5.0 (Linux; Android 4.4.2; A1-810 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Safari/537.36","21.0":"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.0 AOL/9.7 AOLBuild/4343.3029.gb Safari/537.1","28.0":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.94 Safari/537.36","1.0":"Mozilla/5.0 (Windows; U; Windows NT 6.1;de) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/1.0.154.43 Safari/525.19","4.1":"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.1.249.1025 Safari/532.5","33.0":"Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; SAMSUNG-SM-N900A Build/KOT49H) AppleWebKit/537.16 (KHTML, like Gecko) Version/4.0 Safari/537.16 Chrome/33.0.0.0","4.0":"Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US) AppleWebKit/532.2 (KHTML, like Gecko) Chrome/4.0.222.12 Safari/532.2","47.0":"Mozilla/5.0 (Linux; Android 5.0.2; SM-T535 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Safari/537.36","20.0":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/536.8 (KHTML, like Gecko) Chrome/20.0.1105.2 Safari/536.8","19.0":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/536.5 (KHTML, like Gecko) Chrome/19.0.1084.9 Safari/536.5","25.0":"Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.2 Safari/537.22","38.0":"Mozilla/5.0 (Linux; Android 5.0.2; SAMSUNG SM-T805 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/3.0 Chrome/38.0.2125.102 Safari/537.36","15.0":"Mozilla/5.0 (Windows NT 5.0) AppleWebKit/5351 (KHTML, like Gecko) Chrome/15.0.849.0 Safari/5351","18.0":"Mozilla/5.0 (Linux; Android 4.0.4; MID Build/IMM76D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19","40.0":"Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.93 Safari/537.36","41.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36 davecampbell","16.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_3) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.77 Safari/535.7","14.0":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/5321 (KHTML, like Gecko) Chrome/14.0.867.0 Safari/5321","17.0":"Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US) AppleWebKit/534.31 (KHTML, like Gecko) Chrome/17.0.558.0 Safari/534.31 UCBrowser/57B75BEEF","34.0":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.118 Safari/537.36","37.0":"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 AOL/9.7 AOLBuild/4343.4025.de Safari/537.36","2.0":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/530.9 (KHTML, like Gecko) Chrome/2.0.180.0 Safari/530.9","43.0":"Mozilla/5.0 (Linux; Android 5.0.2; SM-T810 Build/LRX22G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.93 Safari/537.36","0.2":"Mozilla/5.0 (Windows; U; Windows NT 5.1; de) AppleWebKit/525.13 (KHTML, like Gecko) Chrome/0.2.149.27 Safari/525.13","29.0":"Mozilla/5.0 (X11; FreeBSD amd64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.62 Safari/537.36","42.0":"Mozilla/5.0 (Linux; Android 5.0.2; P022 Build/LRX22G; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/42.0.2311.138 Safari/537.36","46.0":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Dragon/46.9.15.424 Chrome/46.0.2490.86 Safari/537.36","45.0":"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.0.10802 Safari/537.36","13.0":"Mozilla/5.0 (X11; FreeBSD i386) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/13.0.782.112 Safari/535.1","0.3":"Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/0.3.154.9 Safari/525.19","48.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36","44.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36","0.4":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/0.4.154.33 Safari/525.19","31.1":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.1.0.0 Safari/537.36","24.2":"Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.2.0.0 Safari/537.17","23.2":"Mozilla/5.0 (Windows NT 6.0; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.2.0.0 Safari/537.11","27.1":"Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.1.0.0 Safari/537.36","49.0":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.47 Safari/537.36","23.4":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.4.0.0 Safari/537.11","25.1":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.1.0.0 Safari/537.22","26.2":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.2.2.0 Safari/537.31","27.2":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.2.0.0 Safari/537.36","28.1":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.1.0.0 Safari/537.36","29.1":"Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.1.0.0 Safari/537.36","26.4":"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.4.9999.1836 Safari/537.31 BDSpark/26.4","9.1":"Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/540.0 (KHTML,like Gecko) Chrome/9.1.0.0 Safari/540.0","46.2":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/52.2.90 Chrome/46.2.2490.90 Safari/537.36","43.2357":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.2357.124 Safari/537.36","47.4":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.4.2526.80 Safari/537.36","50.0":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2655.0 Safari/537.36"},"Firefox":{"14.0":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:14.0; WUID=dec302e0359dca729fc03b1e5e0b9724; WTB=161) Gecko/20100101 Firefox/14.0.1","2.0":"Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.1.11) Gecko/20130101 Firefox/2.0.0.11","3.0":"Mozilla/5.0 (Windows; U; Windows NT 5.0; en-GB; rv:1.9.0.19) Gecko/2010031422 Firefox/3.0.19","7.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:7.0.1) Gecko/20100101 Firefox/7.0.1","4.0":"Mozilla/5.0 (X11; Linux i686; MW65549; rv:2.0.1) Gecko/20100101 Firefox/4.0.1","3.6":"Mozilla/5.0 (Windows NT 5.0; en-US; rv:1.9.1.20) Gecko/20151109 Firefox/3.6.16","5.0":"Mozilla/5.0 (Windows NT 5.1) Gecko/20100101 Firefox/5.0","26.0":"Mozilla/5.0 (Windows NT 6.1; rv:26.0) Gecko/20100101 Firefox/26.0 IceDragon/26.0.0.2","12.0":"Mozilla/5.0 (Windows NT 5.1; rv:12.0) Gecko/20120403211507 Firefox/12.0","38.0":"\"Mozilla/5.0 (Windows NT 6.1; rv:38.0) Gecko/20100101 Firefox/38.0\"","31.0":"Mozilla/5.0 (X11; FreeBSD amd64; rv:31.0) Gecko/20100101 Firefox/31.0","11.0":"Mozilla/5.0 (Windows NT 6.1; rv:11.0) Gecko/20100101 Firefox/11.0 CometBird/11.0","32.0":"Mozilla/5.0 (Windows NT 6.1; rv:32.0.3) Gecko/20100101 Firefox/32.0.3 anonymized by Abelssoft 1788018586","28.0":"Mozilla/5.0 (Windows NT 6.3; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0 DT-Browser/DTB7.028.0028","30.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:30.0) Gecko/20100101 Firefox/30.0","23.0":"Mozilla/5.0 (Windows NT 6.1; rv:23.0; WUID=bf19fbc4a944f1db2c5020ffe8c3c372; WTB=3869) Gecko/20100101 Firefox/23.0","8.0":"Mozilla/5.0 (Windows NT 5.2; WOW64; rv:8.0.1) Gecko/20100101 Firefox/8.0.1","16.0":"Mozilla/5.0 (Windows NT 6.2; Win64; x64; rv:16.0) Gecko/16.0 Firefox/16.0","40.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:40.0) Gecko/20100101 Firefox/40.0","20.0":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0 AlexaToolbar/amznf-3.0.20121130","29.0":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20120101 Firefox/29.0","27.0":"Mozilla/5.0 (Windows NT 5.2; rv:27.0) Gecko/20100101 Firefox/27.0","35.0":"Mozilla/5.0 (X11; Fedora ; Linux x86_64; rv:35.0) Gecko/20100101 Firefox/35.0","9.0":"Mozilla/5.0 (Windows NT 6.2; rv:9.0.1) Gecko/20100101 Firefox/9.0.1","18.0":"Mozilla/5.0 (MY-masking-agent; rv:18.0) Gecko/20100101 Firefox/18.0","19.0":"Mozilla/5.0 (X11; Linux i686) Firefox/19.0","33.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0","21.0":"Mozilla/5.0 (Windows; U; Windows NT 6.1; nl; rv:1.9.2) Gecko/20100115 Firefox/21.0 EBwrkprd","43.0":"Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:43.0) Gecko/20100101 Firefox/43.0.4 Waterfox/43.0.4","22.0":"Mozilla/5.0 (Windows NT 6.0; rv:22.0) Gecko/20100101 Firefox/22.0 DT-Browser/DTB7.022.0018","37.0":"37.0) Gecko/20100101 Firefox/37.0 Authentic8/1.0","34.0":"Mozilla/5.0 (X11; FreeBSD amd64; rv:34.0) Gecko/20100101 Firefox/34.0","39.0":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:39.0) Gecko/20100101 Firefox/39.0 DT-Browser/DTB7.39.0.14_01","24.0":"Mozilla/5.0 (X11; Linux i686 on x86_64; rv:24.0) Gecko/20140708 Firefox/24.0","25.0":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:25.0) Gecko/20100101 Firefox/25.0 YB/7.4.2","17.0":"Mozilla/5.0 (X11; U; Linux i686; de-DE; rv:99.0) Gecko/201212231 Firefox/17.0.11","15.0":"Mozilla/5.0 (X11; Linux i686; MW65549; rv:15.0) Gecko/20100101 Firefox/15.0","13.0":"Mozilla/5.0 (X11; Xen/BSD; rv:13.0) Gecko/20100101 Firefox/13.0","36.0":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:35.0) Gecko/20100101 Firefox/36.0","41.0":"Mozilla/5.0 (X11; Fedora; Linux i686; rv:41.0) Gecko/20100101 Firefox/41.0","42.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:42.0) Gecko/20100101 Firefox/42.0","10.0":"Mozilla/5.0 (X11; Linux i686; rv:10.0.12) Gecko/20130109 Firefox/10.0.12","3.5":"Mozilla/5.0 (eagle01;Windows; U; Windows NT 6.1; en-US; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5","6.0":"Mozilla/5.0 (Windows NT 6.2; WOW64; rv:6.0) Gecko/20100101 Firefox/6.0","44.0":"Mozilla/5.0 (X11; Linux i686; rv:44.0) Gecko/20100101 Firefox/44.0","1.5":"Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.10) Gecko/20070216 Firefox/1.5.0.10","1.0":"Mozilla/5.0 (Windows; U; Windows NT 5.2; es-ES; rv:1.7.5) Gecko/20041108 Firefox/1.0","3.8":"Mozilla/5.0 (X11; U; Linux i686; it-IT; rv:1.9.0.2) Gecko/2008092313 Ubuntu/9.25 (jaunty) Firefox/3.8","0.9":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.7) Gecko/20040614 Firefox/0.9","1.4":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8b5) Gecko/20051006 Firefox/1.4.1","0.10":"Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.7.3) Gecko/20041001 Firefox/0.10.1","23.6":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.22) Gecko/20110902 Firefox/23.6.22 SearchToolbar/1.2","40.1":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1","45.0":"Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0","2.1":"Mozilla/5.0 (X11; U; Linux Debian; fr; rv:111) Gecko/2009 Firefox/2.1","1.9":"Mozilla/5.0 (Windows; U; Windows NT 5.0; ; rv:1.8.1.11) Gecko/20071127 Firefox/1.9.0.1","3.1":"Mozilla/5.0 (Windows; U; Windows NT 6.0; en-US; rv:1.9.2a1pre) Gecko/20090113 Firefox/3.1","0.8":"Mozilla/5.0 (X11; U; SunOS sun4v; en-US; rv:1.6) Gecko/20040211 Firefox/0.8","3.4":"Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko/2009032711 Ubuntu/8.10 (intrepid) Firefox/3.4","3.03":"Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.2) Gecko/20100123 Ubuntu/9.10 (karmic) Firefox/3.03","4.5":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:2.0.9) Gecko/20110530 Firefox/4.5.21 (.NET CLR 3.5.30729)","4.6":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:2.0.5) Gecko/20110530 Firefox/4.6.4 (.NET CLR 3.5.30729)","5.02":"Mozilla/5.0 (Windows NT 6.1; rv:5.0) Gecko/20100101 Firefox/5.02","16.1":"Mozilla/5.0 (Windows NT 5.1; rv:16.1) Gecko/20100101 Firefox/16.1 IceDragon/16.1.0.1","6.6":"Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.5.13) Gecko/20120420 Ubuntu/12.04 (quizzical) Firefox/6.6.2","27.3":"Mozilla/5.0 (Windows NT 6.1; rv:27.3) Gecko/20130101 Firefox/27.3","25.01":"Mozilla/5.0 (Windows NT 6.1; rv:10.0) Gecko/20131101 Firefox/25.01","33.1":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:33.1.1) Gecko/20100101 Firefox/33.1.1","31.3":"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:31.3) Gecko/20100101 Firefox/31.3","38.3":"Mozilla/5.0 (Windows NT 6.1; rv:38.3) Gecko/20100101 Firefox/38.3 ZSBP37","36.04":"Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/36.04","31.8":"Mozilla/5.0 (Macintosh; U; Intel Mac OS X; sk-SK; rv:31.8.0) Gecko/20121114 Firefox/31.8.0","47.0":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0","46.0":"Mozilla/5.0 (Windows NT 6.1; rv:46.0) Gecko/20100101 Firefox/46.0"},"Opera":{"9.64":"Opera/9.64 (Windows NT 5.1; U; MRA 5.7 (build 03796); MRSPUTNIK OW 2, 3, 0, 216; ru) Presto/2.1.1","12.16":"Opera/9.80 (Macintosh; Intel Mac OS X 10.11.1) Presto/2.12.388 Version/12.16","12.17":"Opera/9.80 (Windows NT 6.2; Win64; x64) Presto/2.12.388 Version/12.17","11.10":"Opera/9.80 (Series 60; Opera Mini; U; id) Presto/2.8.119 Version/11.10","10.63":"Opera/9.80 (X11; Linux x86_64; U; fr) Presto/2.6.30 Version/10.63","11.61":"Opera/9.80 (Windows NT 5.1; U; IBM EVV/3.0/EAK01AG9/LE; en) Presto/2.10.229 Version/11.61","11.00":"Mozilla/5.0 (Windows NT 5.1; U; de; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 11.00","11.60":"Opera/9.80 Boost Your Bust Review (<a href=\"http://Boostyourbustreview.tumblr.com\">just click the up coming page</a>) (Windows NT 5.1; U; en) Presto/2.10.229 Version/11.60","11.01":"Opera/9.80 (X11; FreeBSD 8.1-RELEASE i386; U; en) Presto/2.7.62 Version/11.01","12.12":"Opera/9.80 (X11; FreeBSD 9.1-RC1 amd64) Presto/2.12.388 Version/12.12","9.23":"Opera/9.23 (Windows NT 6.0; U; pl)","11.64":"Opera/9.80 (Windows NT 5.0; U; Edition Campaign 21; sv) Presto/2.10.229 Version/11.64","9.50":"HTC-P4600/1.2 Opera/9.50 (Windows NT 5.1; U; en)","10.60":"Opera/9.80 (Windows NT 6.1; U; ru) Presto/2.5.27 Version/10.60","12.02":"Opera/9.80 (Windows NT 5.0; U; en) Presto/2.10.289 Version/12.02","9.25":"Opera/9.25 (Windows 98; U; it)","11.52":"Opera/9.80 (Windows NT 5.1; U; Edition Ukraine Local; uk) Presto/2.9.168 Version/11.52","12.15":"Opera/9.80 (Windows NT 6.1; WOW64; Edition Yx 01) Presto/2.12.388 Version/12.15","9.63":"Opera/9.63 (Windows NT 5.1; U; zh-cn) Presto/2.1.1","12.00":"Opera/9.80 (Windows NT 6.1; U; es-ES) Presto/2.9 Version/12.00","11.51":"Opera/9.80 (X11; Linux i686; U; en) Presto/2.9.168 Version/11.51","9.62":"Opera/9.62 (Windows NT 5.0; U; de) Presto/2.1.1","9.27":"Opera/9.27 (Windows NT 6.1; U; cs)","10.10":"Opera/9.80 (Windows NT 5.1; U; MRA 5.10 (build 5288); ru) Presto/2.2.15 Version/10.10","11.62":"Opera/9.80 (Windows NT 5.2; WOW64; U; en) Presto/2.10.229 Version/11.62","10.62":"Mozilla/5.0 (Windows NT 5.1; U; ru; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6 Opera 10.62","9.52":"Mozilla/5.0 (Windows NT 5.1; U; ru; rv:1.8.1) Gecko/20061208 Firefox/2.0.0 Opera 9.52","9.24":"Opera/9.24 (Windows NT 6.1; U; en)","9.51":"Opera/9.51 (Windows NT 5.1; U; bg)","10.00":"Mozilla/4.0 (Windows 98; US) Opera 10.00 [en]","34.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36 OPR/34.0.2036.50","32.0":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36 OPR/32.0.1948.31","10.61":"Opera/9.80 (Windows NT 6.1; U; Edition Campaign 21; lt) Presto/2.6.30 Version/10.61","11.50":"Opera/9.80 (Windows NT 5.1; U; Edition Next; pt-BR) Presto/2.8.158 Version/11.50","12.14":"Opera/9.80 (Windows NT 6.1; WOW64; MRA 6.2 (build 7314)) Presto/2.12.388 Version/12.14","9.26":"Opera/9.26 (Windows NT 6.0; U; fi)","31.0":"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36 OPR/31.0.1889.99 (Edition Yx)","9.22":"Opera/9.22 (X11; Linux i686; U; pt-br)","9.60":"Opera/9.60 (Windows NT 5.1; U; it) Presto/2.1.1","9.21":"Opera/9.21 (Windows NT 6.0; U; de)","33.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36 OPR/33.0.1990.115","10.53":"Opera/9.80 (Windows NT 5.1; U; en-US) Presto/2.5.24 Version/10.53","30.0":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Safari/537.36 OPR/30.0.1856.92967","11.11":"Opera/9.80 (Windows NT 5.1; U; hu) Presto/2.8.131 Version/11.11","12.11":"Opera/9.80 (Windows NT 5.1; Edition Campaign 21) Presto/2.12.388 Version/12.11","9.20":"Opera/9.20 (Linux-free)","35.0":"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.109 Safari/537.36 OPR/35.0.2066.68 (Edition Campaign 37)","20.0":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36 OPR/20.0.1387.82","12.01":"Opera/9.80 (Windows NT 6.1; Win64; x64; U; ru) Presto/2.10.289 Version/12.01","9.61":"Opera/9.61 (Windows NT 5.1; U; MRA 5.6 (build 03399); MRSPUTNIK OW 2, 3, 0, 104; ru) Presto/2.1.1","9.10":"Opera/9.10 (Windows NT 5.1; U; hr)","10.51":"Opera/9.80 (Windows NT 6.1; U; uk) Presto/2.5.22 Version/10.51","9.30":"Opera/9.30 (Nintendo Wii; U; ; 3642; it)","27.0":"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.115 Safari/537.36 OPR/27.0.1689.76","22.0":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.86 Safari/537.36 OPR/22.0.1471.16 (Edition Next)","25.0":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36 OPR/25.0.1614.71","18.0":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.57 Safari/537.36 OPR/18.0.1284.49 (Edition Yx)","10.01":"Opera/9.80 (Windows NT 5.1; U; uk) Presto/2.2.15 Version/10.01","9.00":"Opera/9.00 (Macintosh; PPC Mac OS X; U; en)","9.02":"Opera/9.02 (Linux armv5tejl; U; ARCHOS; GOGI; a705; en)","12.10":"Opera/9.80 (Windows NT 5.1; Edition Yx 01) Presto/2.12.388 Version/12.10","28.0":"Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.76 Safari/537.36 OPR/28.0.1750.40 (Edition Campaign 34)","19.0":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36 OPR/19.0.1326.63","23.0":"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.143 Safari/537.36 OPR/23.0.1522.77","29.0":"Mozilla/5.0 (Linux; Android 4.4.2; Slate 21 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.107 Safari/537.36 OPR/29.0.1809.92697","10.50":"Opera/9.80 (Windows NT 5.0; U; ja) Presto/2.5.22 Version/10.50","8.51":"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 6.0; en) Opera 8.51","8.50":"Opera/8.50 (Windows NT 5.1; U; nl)","24.0":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36 OPR/24.0.1558.61 (Edition FCI)","10.54":"Opera/9.80 (Windows NT 6.1; U; de) Presto/2.5.24 Version/10.54","26.0":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 OPR/26.0.1656.60","17.0":"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.66 Safari/537.36 OPR/17.0.1241.36 (Edition Next)","8.54":"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; ru) Opera 8.54","16.0":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.76 Safari/537.36 OPR/16.0.1196.80","12.13":"Opera/9.80 (Windows NT 5.1) Presto/2.12.388 Version/12.13","21.0":"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.122 Safari/537.36 OPR/21.0.1432.57","8.01":"Opera/8.01 (Windows NT 5.1)","9.01":"Opera/9.01 (Windows NT 5.1; U; tr)","10.52":"Opera/9.80 (Windows NT 6.1; U; ru) Presto/2.5.24 Version/10.52","9.70":"Opera/9.70 (Linux i686 ; U; ; en) Presto/2.2.1,","7.02":"Mozilla/4.0 (compatible; MSIE 6.0; MSIE 5.5; Windows NT 5.0) Opera 7.02 Bork-edition [en]","8.65":"Mozilla/4.0 (compatible; MSIE 6.0; Symbian OS; Nokia 6630/3.45.113; 9399) Opera 8.65 [en]","10.20":"Opera/9.80 (Windows NT 5.1; U; pl) Presto/2.2.15 Version/10.20","9.7":"HTC_HD2_T8585 Opera/9.7 (Windows NT 5.1; U; de)","8.0":"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; en) Opera 8.0","8.53":"Mozilla/4.0 (compatible; MSIE 6.0; Windows 98; en) Opera 8.53","9.0":"Opera/9.0","8.60":"Mozilla/4.0 (compatible; MSIE 6.0; KDDI-HI3E) Opera 8.60 [ja]","7.54":"Mozilla/4.0 (compatible; MSIE 5.23; Mac_PowerPC) Opera 7.54  [en]","6.01":"Mozilla/4.0 (compatible; MSIE 5.0; Windows 95) Opera 6.01  [en]","8.02":"Mozilla/4.0 (compatible; MSIE 6.0; ; Linux armv5tejl; U) Opera 8.02 [en_US] Maemo browser 0.4.31 N770/SU-18","10.70":"Opera/9.80 (X11; Linux x86_64; U; en) Presto/2.6.37 Version/10.70","12.50":"Opera/9.80 (Windows NT 5.1; U; Edition Next; en) Presto/2.11.310 Version/12.50","15.0":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.52 Safari/537.36 OPR/15.0.1147.130","8.52":"Mozilla/4.0 (compatible; MSIE 6.0; X11; Linux i686; en) Opera 8.52","8.00":"Mozilla/5.0 (Windows NT 5.1; U; en) Opera 8.00","7.23":"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Opera 7.23  [en]","7.53":"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Opera 7.53  [en]","6.05":"Opera/6.05 (Windows 98; U)  [en]","7.21":"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1) Opera 7.21  [en]","6.06":"Opera/6.06 (Windows XP; U)  [en]","7.13":"Opera/7.13 (Linux 6.14.8_4 i986; U)  [en]","7.01":"Mozilla/5.0 (Windows NT 5.1; U) Opera 7.01  [ru]","9.5":"SAMSUNG-SGH-i900V/JBHH1 Opera 9.5 UP.Link/6.5.0.0.0","6.0":"Mozilla/4.0 (compatible; MSIE 5.0; Windows ME) Opera 6.0 � [en� [en]","9.6":"SAMSUNG-GT-I8320-Vodafone/I8320BUJC1 Linux/X2/R1 Opera/9.6 SMS-MMS/1.2.0 profile/MIDP-2.1 configuration/CLDC-1.1","9.80":"Opera/9.80 (Windows NT 5.1; U; pl) Presto/9.9.9","10.11":"Opera/9.80 (X11; Linux x86_64; U; de) Presto/2.2.15 Version/10.11","8.5":"Mozilla/4.0 (compatible; MSIE 6.0; X11; Linux armv6l; U) Opera 8.5 [sv_SE] Tablet browser 0.0.14 RX-34_2007SE_4.2007.38-2.0.TEL","10.1":"Opera/9.80 (X11; Linux i686; ADR-1102051633; U; TSB_CLOUD_COMPANION;TOSHIBA_AC_AND_AZ; it) Presto/2.5.28 Version/10.1","7.60":"Opera/7.60 (Windows NT 5.2; U)  [en] (IBM EVV/3.0/EAK01AG9/LE)","7.11":"Opera/7.11 (Windows NT 5.1; U) [en]","10.30":"Opera/9.80 (Linux mips ; U; InettvBrowser/2.2 (00014A;SonyDTV115;0002;0100) KDL40EX725; CC/DEU; en) Presto/2.5.21 Version/10.30","7.0":"Mozilla/4.0 (compatible; MSIE 6.0; MSIE 5.5; Windows NT 4.0) Opera 7.0 [en]","11.66":"Opera/9.80 (Macintosh; Intel Mac OS X 10.8.0; U; Edition MAS; en) Presto/2.10.229 Version/11.66","9.4":"Opera 9.4 (Windows NT 6.1; U; en)","12.51":"Opera/9.80 (Linux mips; ) Presto/2.12.407 Version/12.51 MB95/3.3.6.X (TOSHIBA, Si2156LG32, wired)"},"Mobile Safari":{"7.0":"Mozilla/5.0 (iPhone; CPU iPhone OS 7_0_4 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Mercury/8.9.4 Mobile/11B554a Safari/9537.53","5.0":"Mozilla/5.0(iPad; U; CPU OS 4_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8F191 Safari/6533.18.5","5.1":"Mozilla/5.0 (iPad; U; CPU OS 5_0 like Mac OS X; en-us) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3","6.0":"Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4.15.16 (KHTML, like Gecko) Version/6.0 Mobile/10A523 Safari/8536.25","4.0":"Mozilla/5.0 (iPad; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21 (KHTML, like Gecko) Version/4.0.4 Mobile/7B314 Safari/531.21","8.0":"Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko; Google Page Speed Insights) Version/8.0 Mobile/12F70 Safari/600.1.4","9.0":"Mozilla/5.0 (iPad; CPU OS 9_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) GSA/9.0.60246 Mobile/13A452 Safari/600.1.4","3.1":"Mozilla/5.0 (iPhone; U; CPU iPhone OS 2_0_1 like Mac OS X; ja-jp) AppleWebKit/525.18.1 (KHTML, like Gecko) Version/3.1.1 Mobile/5B108 Safari/525.20","3.0":"Mozilla/5.0 (iPhone; U; CPU like Mac OS X; en) AppleWebKit/420+ (KHTML, like Gecko) Version/3.0 Mobile/1A543 Safari/419.3","6.1":"Mozilla/5.0 (iPad; CPU OS 6_1_3 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) GSA/3.1.0.23513 Mobile/10B329 Safari/8536.25","7.1":"Mozilla/5.0 (iPhone; CPU iPhone OS 7_1 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) GSA/7.0.55539 Mobile/11D167 Safari/9537.53","8.1":"Mozilla/5.0 (iPad; CPU OS 8_1_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) GSA/5.1.42378 Mobile/12B466 Safari/600.1.4","8.3":"Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) GSA/6.0.51363 Mobile/12F70 Safari/600.1.4","8.2":"Mozilla/5.0 (iPad; CPU OS 8_2 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) GSA/4.1.0.31802 Mobile/12D508 Safari/9537.53","8.4":"Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) GSA/11.1.66360 Mobile/12H321 Safari/600.1.4","9.1":"Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) GSA/8.0.57838 Mobile/13B143 Safari/600.1.4","9.2":"Mozilla/5.0 (iPad; CPU OS 9_2_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) GSA/11.1.66360 Mobile/13D15 Safari/600.1.4","4.3":"Mozilla/5.0 (iPad; U; CPU OS 4_3_2 like Mac OS X) AppleWebKit/533.17.9 (KHTML, like Gecko) Mercury/7.2 Mobile/8H7 Safari/6533.18.5"},"IE Mobile":{"11.0":"Mozilla/5.0 (Mobile; Windows Phone 8.1; Android 4.0; ARM; Trident/7.0; Touch; rv:11.0; IEMobile/11.0; NOKIA; Lumia 635) like iPhone OS 7_0_3 Mac OS X AppleWebKit/537 (KHTML, like Gecko) Mobile Safari/537","10.0":"Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 635)","7.11":"SAMSUNG-SGH-I617/UCHJ1 Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.11)","7.0":"Mozilla/4.0 (compatible; MSIE 7.0; Windows Phone OS 7.0; Trident/3.1; IEMobile/7.0; HTC; 7 Mozart)","6.12":"Xda orbit; 240x320 (compatible; MSIE 6.0; Windows CE; IEMobile 6.12) Xda orbit; 240x320","8.12":"Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 8.12; MSIEMobile 6.0) T-Mobile_LEO","9.0":"Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC; HD7 T9292)","7.6":"Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.6) T-Mobile_Atlas","7.7":"Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 7.7) 320x240; VZW; Motorola-Q9m; Windows Mobile 6.0 Standard","6.9":"Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 6.9) VZW:SCH-i760 PPC 240x320","6.8":"Mozilla/4.0 (compatible; MSIE 6.0; Windows CE; IEMobile 6.8) Vodafone/1.0/HTC_Mercury/2.04.161.2"},"Firefox Mobile":{"17.0":"Mozilla/5.0 (Android; Mobile; rv:17.0) Gecko/17.0 Firefox/17.0","34.0":"Mozilla/5.0 (Android; Mobile; rv:34.0) Gecko/34.0 Firefox/34.0","19.0":"Mozilla/5.0 (Android; Mobile; rv:19.0) Gecko/19.0 Firefox/19.0","20.0":"Mozilla/5.0 (Android; Mobile; rv:20.0) Gecko/20.0 Firefox/20.0","14.0":"Mozilla/5.0 (Android; Mobile; rv:14.0) Gecko/14.0 Firefox/14.0.1","22.0":"Mozilla/5.0 (Android; Tablet; rv:22.0) Gecko/22.0 Firefox/22.0","27.0":"Mozilla/5.0 (Android; Tablet; rv:27.0) Gecko/27.0 Firefox/27.0","33.0":"Mozilla/5.0 (Android; Mobile; rv:33.0) Gecko/33.0 Firefox/33.0","35.0":"Mozilla/5.0 (Android; Mobile; rv:35.0) Gecko/35.0 Firefox/35.0","36.0":"Mozilla/5.0 (Android; Tablet; rv:36.0) Gecko/36.0 Firefox/36.0","39.0":"Mozilla/5.0 (Android; Mobile; rv:39.0) Gecko/39.0 Firefox/39.0","21.0":"Mozilla/5.0 (Android; Tablet; rv:21.0) Gecko/21.0 Firefox/21.0","28.0":"Mozilla/5.0 (Android; Mobile; rv:28.0) Gecko/28.0 Firefox/28.0","38.0":"Mozilla/5.0 (Android; Mobile; rv:38.0) Gecko/38.0 Firefox/38.0","40.0":"Mozilla/5.0 (Android; Tablet; rv:40.0) Gecko/40.0 Firefox/40.0","10.0":"Mozilla/5.0 (Android; Mobile; rv:10.0.5) Gecko/10.0.5 Firefox/10.0.5 Fennec/10.0.5","16.0":"Mozilla/5.0 (Android; Mobile; rv:16.0) Gecko/16.0 Firefox/16.0","18.0":"Mozilla/5.0 (Android; Tablet; rv:18.0) Gecko/18.0 Firefox/18.0","23.0":"Mozilla/5.0 (Android; Mobile; rv:23.0) Gecko/23.0 Firefox/23.0","30.0":"Mozilla/5.0 (Android; Mobile; rv:30.0) Gecko/30.0 Firefox/30.0","32.0":"Mozilla/5.0 (Android; Tablet; rv:32.0) Gecko/32.0 Firefox/32.0","37.0":"Mozilla/5.0 (Android; Tablet; rv:37.0) Gecko/37.0 Firefox/37.0","1.1":"Mozilla/5.0 (X11; U; Linux armv7l; fr; rv:1.9.2.5) Gecko/20100614 Firefox/3.6.5pre Fennec/1.1","4.0":"Mozilla/5.0 (Maemo; Linux armv7l; rv:2.0b7pre) Gecko/20101103 Firefox/4.0b8pre Fennec/4.0b2","26.0":"Mozilla/5.0 (Android; Tablet; rv:26.0) Gecko/26.0 Firefox/26.0","29.0":"Mozilla/5.0 (Android; Tablet; rv:29.0) Gecko/29.0 Firefox/29.0","31.0":"Mozilla/5.0 (Android; Tablet; rv:31.0) Gecko/31.0 Firefox/31.0","41.0":"Mozilla/5.0 (Android 5.1.1; Tablet; rv:41.0) Gecko/41.0 Firefox/41.0","43.0":"Mozilla/5.0 (Android 6.0.1; Tablet; rv:43.0) Gecko/43.0 Firefox/43.0","42.0":"Mozilla/5.0 (Android 5.0.1; Mobile; rv:42.0) Gecko/42.0 Firefox/42.0","44.0":"Mozilla/5.0 (Android 5.1.1; Mobile; rv:44.0) Gecko/44.0 Firefox/44.0","2.0":"Mozilla/5.0 (Windows Mobile; U; en; rv:1.8.1) Gecko/20061208 Firefox/2.0.0 Opera 10.00","9.0":"Mozilla/5.0 (Android; Linux armv7l; rv:9.0) Gecko/20111216 Firefox/9.0 Fennec/9.0","13.0":"Mozilla/5.0 (Android; Mobile; rv:13.0) Gecko/13.0 Firefox/13.0a1","15.0":"Mozilla/5.0 (Android; Tablet; rv:15.0) Gecko/15.0 Firefox/15.0.1","24.0":"Mozilla/5.0 (Android; Tablet; rv:24.0) Gecko/24.0 Firefox/24.0"},"Opera Mobile":{"9.5":"Opera/9.5 (Microsoft Windows; Windows CE; Opera Mobi/9.5; U; en) VZW:SCH-i770 PPC 320x320","10.00":"Opera/9.80 (Windows Mobile; WCE; Opera Mobi/WMD-50433; U; it) Presto/2.4.13 Version/10.00","9.7":"Opera/9.7 (WindowsMobile; PPC; Opera Mobi/35267; U; en; Presto/2.1.1)","11.00":"Opera/9.80 (S60; SymbOS; Opera Mobi/SYB-1104041444; U; tr) Presto/2.7.81 Version/11.00","12.00":"Opera/9.80 (S60; SymbOS; Opera Mobi/SYB-1204232254; U; en-GB) Presto/2.10.254 Version/12.00","12.10":"Opera/9.80 (Android 4.4.2; Linux; Opera Mobi/ADR-1309251116) Presto/2.11.355 Version/12.10","9.51":"Opera/9.51 Beta (Microsoft Windows; PPC; 240x320; Opera Mobi/1718; U; en)","10.1":"Opera/9.80 (S60; SymbOS; Opera Mobi/1209; U; de) Presto/2.5.28 Version/10.1","9.80":"Opera/9.80 (Windows NT 5.1; U; Opera Mobi; de; CEB-42)","11.10":"Opera/9.80 (Android 2.2.1; Linux; Opera Mobi/ADR-1107051709; U; en) Presto/2.8.149 Version/11.10","11.50":"Opera/9.80 (S60; SymbOS; Opera Mobi/SYB-1111011893; U; de) Presto/2.9.201 Version/11.50","22.0":"Mozilla/5.0 (Linux; Android 4.1.1; HTC One S Build/JRO03C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.138 Mobile Safari/537.36 OPR/22.0.1485.78487","26.0":"Mozilla/5.0 (Linux; Android 4.3; GT-I9300 Build/JSS15J) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.59 Mobile Safari/537.36 OPR/26.0.1656.86386","30.0":"Mozilla/5.0 (Linux; Android 5.0; SM-G900F Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.78 Mobile Safari/537.36 OPR/30.0.1856.92967","32.0":"Mozilla/5.0 (Linux; Android 5.1.1; SM-G920F Build/LMY47X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.78 Mobile Safari/537.36 OPR/32.0.1953.96473","27.0":"Mozilla/5.0 (Linux; Android 4.4.2; HUAWEI Y360-U61 Build/HUAWEIY360-U61) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.89 Mobile Safari/537.36 OPR/27.0.1698.89115"}}
},{}],5:[function(require,module,exports){
var Browsers = require('./browsers.json');

var pickOne = function (obj) {

    var list = Array.isArray(obj) ? obj : Object.keys(obj);
    var item = 'random';
    while (item === 'random') {
        item = list[Math.floor(Math.random() * list.length)];
    }

    if (typeof obj[item] === 'function') {
        return pickOne(list);
    }

    return item;
};

Object.keys(Browsers).forEach(function (browser) {

    Browsers[browser].random = function () {

        return Browsers[browser][pickOne(Browsers[browser])];
    };
});

Browsers.random = function () {

    return Browsers[pickOne(Browsers)].random();
};

module.exports = Browsers;

},{"./browsers.json":4}],6:[function(require,module,exports){
(function (process){
/**
  # detect-browser

  This is a package that attempts to detect a browser vendor and version (in
  a semver compatible format) using a navigator useragent in a browser or
  `process.version` in node.

  ## NOTE: Version 2.x release

  Release 2.0 introduces a breaking API change (hence the major release)
  which requires invocation of a `detect` function rather than just inclusion of
  the module.  PR [#46](https://github.com/DamonOehlman/detect-browser/pull/46)
  provides more context as to why this change has been made.

  ## Example Usage

  <<< examples/simple.js

  Or you can use a switch statement:

  <<< examples/switch.js

  ## Adding additional browser support

  The current list of browsers that can be detected by `detect-browser` is
  not exhaustive. If you have a browser that you would like to add support for
  then please submit a pull request with the implementation.

  Creating an acceptable implementation requires two things:

  1. A test demonstrating that the regular expression you have defined identifies
     your new browser correctly.  Examples of this can be found in the
     `test/logic.js` file.

  2. Write the actual regex to the `lib/detectBrowser.js` file. In most cases adding
     the regex to the list of existing regexes will be suitable (if usage of `detect-brower`
     returns `undefined` for instance), but in some cases you might have to add it before
     an existing regex.  This would be true for a case where you have a browser that
     is a specialised variant of an existing browser but is identified as the
     non-specialised case.

  When writing the regular expression remember that you would write it containing a
  single [capturing group](https://regexone.com/lesson/capturing_groups) which
  captures the version number of the browser.

**/

function detect() {
  var nodeVersion = getNodeVersion();
  if (nodeVersion) {
    return nodeVersion;
  } else if (typeof navigator !== 'undefined') {
    return parseUserAgent(navigator.userAgent);
  }

  return null;
}

function detectOS(userAgentString) {
  var rules = getOperatingSystemRules();
  var detected = rules.filter(function (os) {
    return os.rule && os.rule.test(userAgentString);
  })[0];

  return detected ? detected.name : null;
}

function getNodeVersion() {
  var isNode = typeof navigator === 'undefined' && typeof process !== 'undefined';
  return isNode ? {
    name: 'node',
    version: process.version.slice(1),
    os: require('os').type().toLowerCase()
  } : null;
}

function parseUserAgent(userAgentString) {
  var browsers = getBrowserRules();
  if (!userAgentString) {
    return null;
  }

  var detected = browsers.map(function(browser) {
    var match = browser.rule.exec(userAgentString);
    var version = match && match[1].split(/[._]/).slice(0,3);

    if (version && version.length < 3) {
      version = version.concat(version.length == 1 ? [0, 0] : [0]);
    }

    return match && {
      name: browser.name,
      version: version.join('.')
    };
  }).filter(Boolean)[0] || null;

  if (detected) {
    detected.os = detectOS(userAgentString);
  }

  return detected;
}

function getBrowserRules() {
  return buildRules([
    [ 'aol', /AOLShield\/([0-9\._]+)/ ],
    [ 'edge', /Edge\/([0-9\._]+)/ ],
    [ 'yandexbrowser', /YaBrowser\/([0-9\._]+)/ ],
    [ 'vivaldi', /Vivaldi\/([0-9\.]+)/ ],
    [ 'kakaotalk', /KAKAOTALK\s([0-9\.]+)/ ],
    [ 'chrome', /(?!Chrom.*OPR)Chrom(?:e|ium)\/([0-9\.]+)(:?\s|$)/ ],
    [ 'phantomjs', /PhantomJS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'crios', /CriOS\/([0-9\.]+)(:?\s|$)/ ],
    [ 'firefox', /Firefox\/([0-9\.]+)(?:\s|$)/ ],
    [ 'fxios', /FxiOS\/([0-9\.]+)/ ],
    [ 'opera', /Opera\/([0-9\.]+)(?:\s|$)/ ],
    [ 'opera', /OPR\/([0-9\.]+)(:?\s|$)$/ ],
    [ 'ie', /Trident\/7\.0.*rv\:([0-9\.]+).*\).*Gecko$/ ],
    [ 'ie', /MSIE\s([0-9\.]+);.*Trident\/[4-7].0/ ],
    [ 'ie', /MSIE\s(7\.0)/ ],
    [ 'bb10', /BB10;\sTouch.*Version\/([0-9\.]+)/ ],
    [ 'android', /Android\s([0-9\.]+)/ ],
    [ 'ios', /Version\/([0-9\._]+).*Mobile.*Safari.*/ ],
    [ 'safari', /Version\/([0-9\._]+).*Safari/ ]
  ]);
}

function getOperatingSystemRules() {
  return buildRules([
    [ 'iOS', /iP(hone|od|ad)/ ],
    [ 'Android OS', /Android/ ],
    [ 'BlackBerry OS', /BlackBerry|BB10/ ],
    [ 'Windows Mobile', /IEMobile/ ],
    [ 'Amazon OS', /Kindle/ ],
    [ 'Windows 3.11', /Win16/ ],
    [ 'Windows 95', /(Windows 95)|(Win95)|(Windows_95)/ ],
    [ 'Windows 98', /(Windows 98)|(Win98)/ ],
    [ 'Windows 2000', /(Windows NT 5.0)|(Windows 2000)/ ],
    [ 'Windows XP', /(Windows NT 5.1)|(Windows XP)/ ],
    [ 'Windows Server 2003', /(Windows NT 5.2)/ ],
    [ 'Windows Vista', /(Windows NT 6.0)/ ],
    [ 'Windows 7', /(Windows NT 6.1)/ ],
    [ 'Windows 8', /(Windows NT 6.2)/ ],
    [ 'Windows 8.1', /(Windows NT 6.3)/ ],
    [ 'Windows 10', /(Windows NT 10.0)/ ],
    [ 'Windows ME', /Windows ME/ ],
    [ 'Open BSD', /OpenBSD/ ],
    [ 'Sun OS', /SunOS/ ],
    [ 'Linux', /(Linux)|(X11)/ ],
    [ 'Mac OS', /(Mac_PowerPC)|(Macintosh)/ ],
    [ 'QNX', /QNX/ ],
    [ 'BeOS', /BeOS/ ],
    [ 'OS/2', /OS\/2/ ],
    [ 'Search Bot', /(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves\/Teoma)|(ia_archiver)/ ]
  ]);
}

function buildRules(ruleTuples) {
  return ruleTuples.map(function(tuple) {
    return {
      name: tuple[0],
      rule: tuple[1]
    };
  });
}

module.exports = {
  detect: detect,
  detectOS: detectOS,
  getNodeVersion: getNodeVersion,
  parseUserAgent: parseUserAgent
};

}).call(this,require('_process'))
},{"_process":2,"os":1}]},{},[3]);
