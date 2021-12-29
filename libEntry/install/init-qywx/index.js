import NetWork from '../../../src/lib/network.js';
let agentConfigApi = "teas/wework/agent_js_init_data"
function scriptCreator(url) {
      const sdk = document.createElement('script');
      sdk.src = url;
      document.head.appendChild(sdk);
}
function startAgentConfig(url) {
    console.log('当前店铺已接入企业微信')
    let params = {
        page_url: url,
    };
    NetWork.get(
        agentConfigApi,
        params,
        res => {
            const { code, data } = res;
            window.__qywx_corp_id = data.corpid;
            if (code === 0) {
                const params = {
                    corpid: data.corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
                    agentid: data.agentid, // 必填，企业微信的应用id （e.g. 1000247）
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature,// 必填，签名，见附录-JS-SDK使用权限签名算法
                    jsApiList: ['selectExternalContact'], //必填a
                    success: function () {
                        if (window.WWOpenData){
                            if (window.WWOpenData.checkSession) {
                                window.WWOpenData.checkSession({
                                    success() {
                                        console.info('open-data 登录态校验成功');
                                    },
                                    fail() {
                                        console.error('open-data 登录态过期');
                                    },
                                });
                            }
                            if (window.WWOpenData.on) {
                                /**
                                 * ww-open-data 元素数据发生变更时触发
                                 */
                                window.WWOpenData.on('update', () => {
                                    console.log('渲染数据发生变更!!!!!!!!!!!');
                                });
                                /**
                                 * ww-open-data 获取数据失败时触发
                                 */
                                window.WWOpenData.on('error', (e) => {
                                    console.log(JSON.stringify(e),'获取数据失败');
                                });
                            }
                        }
                    },
                    fail: function (res) {
                        console.log(JSON.stringify(res),'agentConfig失败！！！！！');
                        if (res.errMsg.indexOf('function not exist') > -1) {
                            alert('版本过低请升级');
                        }
                    },
                };
                wx.agentConfig(params);
            }
        }
    );
}

function agentConfigInit(){
    const userAgent = window && window.navigator && window.navigator.userAgent;
    // 安卓环境
    const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
    // 企业微信浏览器
    const isEnterpriseBrowser = /wxwork/.test(userAgent);
    if (isAndroid && isEnterpriseBrowser) {
        scriptCreator('https://res.wx.qq.com/open/js/jweixin-1.2.0.js');
    }
    scriptCreator('https://open.work.weixin.qq.com/wwopen/js/jwxwork-1.0.0.js');
    const { origin, pathname, search } = window.location;
    startAgentConfig(origin + pathname + search);
}

function startQywxInit(){
    console.log('进入agentConfig！！！！')
    // 企学院企业微信环境
    if(window.__shop_type && window.__shop_type == 1){
    agentConfigApi = "training_api/v2/qywx/agent_js_init_data"
    agentConfigInit()
    }

    // 知识店铺企业微信环境
    if(window.__org_type && window.__org_type == 1){
    agentConfigInit()
    }
}



export default {
    init:startQywxInit
};
