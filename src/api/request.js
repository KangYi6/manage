
//封装请求参数
// import http from './http.js'
import md5 from 'blueimp-md5'
import axios from 'axios';
import router from '../router';
const http = axios.create({
    timeout: 600000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截
http.interceptors.request.use(config => {
    //请求头设置
    let user = JSON.parse(localStorage.getItem('user'))
    if (user == null && router.history.current.name!='登录') {
        router.replace({ path: '/' })
    }
    // config.headers.Authorization = token
    return config
})

// 响应拦截
http.interceptors.response.use(res => {
return res.data
})
async function request({ method = "get", url, data = {}, params = {} }) {
    //是否有服务器时间
    let serverTime = localStorage.getItem('serverTime');
    if (!serverTime) {
        //先获取一下服务器时间
        await http({method:'GET',url:this.$baseURL+'/manage/server/gettime.html'}).then(res=>{
            localStorage.setItem('serverTime',res.time); //服务器时间
            localStorage.setItem('clientTime',Math.round(new Date().getTime()/1000).toString()) //客户端时间
        })
    }
    //先检查一下token是否过期
    if ((Number(Math.round(new Date().getTime()/1000).toString()) - Number(localStorage.getItem('tokenTime'))) > 5400) {
        //重新获取
        let user = localStorage.getItem('user');
        if (user !== 'undefined' && user != null) {
            if (user) {
                user = JSON.parse(user)
                let appid = user.u_appid
                let secret = user.u_secret
                let getTokenData = reqdata({appid:appid,secret:secret});
                await http({method:'post',url:this.$baseURL+'/manage/login/getToken.html',data:getTokenData}).then(res=>{
                // console.log(res.data);
                user.token = res.data
                console.log(res.data)
                // localStorage.setItem('user',user);
                sessionStorage.setItem('token',JSON.parse(JSON.stringify(user.token)))
                // console.log(user);
                console.log(JSON.parse(JSON.stringify(user.token)));
                // localStorage.setItem('user',JSON.stringify(user))
                localStorage.setItem('tokenTime',res.time);
            })
            }
        }
    }
    let Reqdata = reqdata(data);
    // let req=reqdata(data);
    //判断请求方式为GET时添加参数，data设为空
    if(method=="GET"){
        Reqdata={}
        params=reqdata(params)
    }else if(url==this.$baseURL + "/manage/upload/image.html" || url==this.$baseURL+'/manage/upload/courseware.html'){
        params=reqdata(params)
        Reqdata=data
    }
    console.log(data)
    // console.log(params)
    return http({method:method,url:url,data:Reqdata,params:params})
}


// 配置参数
function reqdata(data){
    //配置公共参数
    let token = sessionStorage.getItem('token')
    if (token === 'undefined' || token == null) {
        data.token = '';
    } else {
        // token = JSON.parse(token)
        data.token = token
    }
    // console.log(data);
    //data.timestamp = Math.round(new Date().getTime()/1000).toString()
    data.timestamp = Number(Math.round(new Date().getTime()/1000).toString()) - Number(localStorage.getItem('clientTime')) + Number(localStorage.getItem('serverTime'))
    data.nonce = randomString(12)
    data.paltform = 'userAiadmin'
    data.version = 'v1.0'
    data.device = browserJudge()
    data.signature = md5(objKeySort(data).toUpperCase())
    return data
}
// 随机字符串
function randomString(length) {
    var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var result = ''
    for (var i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)]
    }
    return result
}
// 业务参数以字母升序（A-Z），并拼接成字符串
function objKeySort(arys) { 
    //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
    var newkey = Object.keys(arys).sort();　　 
    var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    var str = '';
    for(var i = 0; i < newkey.length; i++) {
        if (newkey[i] == 'signature') {
            continue;
        }
        //遍历newkey数组
        newObj[newkey[i]] = arys[newkey[i]]; 
        //向新创建的对象中按照排好的顺序依次增加键值对
        str += newkey[i]+"="+arys[newkey[i]]+'&'
    }
    str += 'key=thedream';
    return str;
}
function macInfo(){
    var locator = new ActiveXObject ("WbemScripting.SWbemLocator");
    var service = locator.ConnectServer(".");
    var properties = service.ExecQuery("Select * from Win32_NetworkAdapterConfiguration Where IPEnabled = True");
    var e = new Enumerator (properties);
    var p = e.item();
    var mac = p.MACAddress;
    return mac;
}
function browserJudge() {
    var document = window.document,
        navigator = window.navigator,
        agent = navigator.userAgent.toLowerCase(),
        //IE8+支持.返回浏览器渲染当前文档所用的模式
        //IE6,IE7:undefined.IE8:8(兼容模式返回7).IE9:9(兼容模式返回7||8)
        //IE10:10(兼容模式7||8||9)
        IEMode = document.documentMode,
        //chorme
        chrome = window.chrome || false,
        System = {
            //user-agent
            agent: agent,
            //是否为IE
            isIE: /msie/.test(agent),
            //Gecko内核
            isGecko: agent.indexOf("gecko") > 0 && agent.indexOf("like gecko") < 0,
            //webkit内核
            isWebkit: agent.indexOf("webkit") > 0,
            //是否为标准模式
            isStrict: document.compatMode === "CSS1Compat",
            //是否支持subtitle
            supportSubTitle: function () {
                return "track" in document.createElement("track");
            },
            //是否支持scoped
            supportScope: function () {
                return "scoped" in document.createElement("style");
            },
            //获取IE的版本号
            ieVersion: function () {
                try {
                    return agent.match(/msie ([\d.]+)/)[1] || 0;
                } catch (e) {
                    console.log("error");
                    return IEMode;
                }
            },
            //Opera版本号
            operaVersion: function () {
                try {
                    if (window.opera) {
                        return agent.match(/opera.([\d.]+)/)[1];
                    } else if (agent.indexOf("opr") > 0) {
                        return agent.match(/opr\/([\d.]+)/)[1];
                    }
                } catch (e) {
                    console.log("error");
                    return 0;
                }
            },
            //描述:version过滤.如31.0.252.152 只保留31.0
            versionFilter: function () {
                if (arguments.length === 1 && typeof arguments[0] === "string") {
                    var version = arguments[0];
                    start = version.indexOf(".");
                    if (start > 0) {
                        end = version.indexOf(".", start + 1);
                        if (end !== -1) {
                            return version.substr(0, end);
                        }
                    }
                    return version;
                } else if (arguments.length === 1) {
                    return arguments[0];
                }
                return 0;
            }
        };

    try {
        //浏览器类型(IE、Opera、Chrome、Safari、Firefox)
        System.type = System.isIE ? "IE" :
            window.opera || (agent.indexOf("opr") > 0) ? "Opera" :
                (agent.indexOf("chrome") > 0) ? "Chrome" :
                    //safari也提供了专门的判定方式
                    window.openDatabase ? "Safari" :
                        (agent.indexOf("firefox") > 0) ? "Firefox" :
                            'unknow';

        //版本号
        System.version = (System.type === "IE") ? System.ieVersion() :
            (System.type === "Firefox") ? agent.match(/firefox\/([\d.]+)/)[1] :
                (System.type === "Chrome") ? agent.match(/chrome\/([\d.]+)/)[1] :
                    (System.type === "Opera") ? System.operaVersion() :
                        (System.type === "Safari") ? agent.match(/version\/([\d.]+)/)[1] :
                            "0";

        //浏览器外壳
        System.shell = function () {
            //遨游浏览器
            if (agent.indexOf("maxthon") > 0) {
                System.version = agent.match(/maxthon\/([\d.]+)/)[1] || System.version;
                return "傲游浏览器";
            }
            //QQ浏览器
            if (agent.indexOf("qqbrowser") > 0) {
                System.version = agent.match(/qqbrowser\/([\d.]+)/)[1] || System.version;
                return "QQ浏览器";
            }

            //搜狗浏览器
            if (agent.indexOf("se 2.x") > 0) {
                return '搜狗浏览器';
            }

            //Chrome:也可以使用window.chrome && window.chrome.webstore判断
            if (chrome && System.type !== "Opera") {
                var external = window.external,
                    clientInfo = window.clientInformation,
                    //客户端语言:zh-cn,zh.360下面会返回undefined
                    clientLanguage = clientInfo.languages;

                //猎豹浏览器:或者agent.indexOf("lbbrowser")>0
                if (external && 'LiebaoGetVersion' in external) {
                    return '猎豹浏览器';
                }
                //百度浏览器
                if (agent.indexOf("bidubrowser") > 0) {
                    System.version = agent.match(/bidubrowser\/([\d.]+)/)[1] ||
                        agent.match(/chrome\/([\d.]+)/)[1];
                    return "百度浏览器";
                }
                //360极速浏览器和360安全浏览器
                if (System.supportSubTitle() && typeof clientLanguage === "undefined") {
                    //object.key()返回一个数组.包含可枚举属性和方法名称
                    var storeKeyLen = Object.keys(chrome.webstore).length,
                        v8Locale = "v8Locale" in window;
                    return storeKeyLen > 1 ? '360极速浏览器' : '360安全浏览器';
                }
                return "Chrome";
            }
            return System.type;
        };

        //浏览器名称(如果是壳浏览器,则返回壳名称)
        System.name = System.shell();
        //对版本号进行过滤过处理
        System.version = System.versionFilter(System.version);

    } catch (e) {
        // console.log("error");
    }
    return System.type + ' ' + System.version
}


export default request