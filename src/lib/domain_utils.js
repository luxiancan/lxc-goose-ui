//域名判定工具

//服务域名关键词
const serviceDomain = "service";
//能够判定是服务域名的字符串
const serviceJudgeStr = "//"+serviceDomain+".";
//必须跳转到服务域名的路由
const serviceRoute = ["search"];

//是否是服务域名
function isServiceDomain() {
    let origin = window.location.origin;
    if(origin.indexOf(serviceJudgeStr)>-1){
        return true;
    }
    return false;
}

//服务域名url转换成个人模式域名url
function serviceToPersonal(url) {
    if(url && window && window.APPID){
        let repalceStr = "//"+window.APPID+".";
        url = url.replace(serviceJudgeStr,repalceStr);
    }
    return url;
}


/**
 * 是否是必须跳转到服务域名的路由
 * @param cmd 跳转路由
 * @returns {boolean}
 */
function isServiceRoute(cmd) {

    //有斜杠则截掉斜杠
    let index1 = cmd.indexOf("/");
    if(index1 === 0){
        cmd = cmd.substr(index1+1);
    }
    //有问号则截掉问号
    let index2 = cmd.indexOf("?");
    if(index2 > 0){
        cmd = cmd.substr(0,index2);
    }

    if(serviceRoute.indexOf(cmd) > -1){
        return true;
    }
    return false;
}


//获取服务域名
function getServiceUrl(cmd) {
    let origin = window.location.origin;
    let result = "";
    //正常cmd，过滤掉前面的斜杠
    if (cmd !== '/' && cmd.indexOf("/") === 0) {
        cmd = cmd.substr(1);
    }

    if(origin.indexOf(".inside.")>-1){
        //主干环境
        result = "http://"+serviceDomain+".h5.inside.xiaoeknow.com/"+window.APPID + "/" + cmd;
    } else if(origin.indexOf(".test.")>-1){
        //测试环境
        result = "http://"+serviceDomain+".h5.test.xiaoeknow.com/"+window.APPID + "/" + cmd;
    }
    else{
        //正式环境
        result = "https://"+serviceDomain+".h5.xiaoeknow.com/"+window.APPID + "/" + cmd;
    }

    return result;
}


/**
 * 服务域名转换
 * @param cmd 路由
 * @param url 输入url
 * @returns {*}
 */
function serviceDomainTransform(cmd,url) {
    if(url){
        //如果路由必须跳转到服务域名，则转换为服务域名（如跳转到搜索页）

        //正常cmd，过滤掉前面的斜杠
        if (cmd && cmd !== '/' && cmd.indexOf("/") === 0) {
            cmd = cmd.substr(1);
        }

        if(cmd && isServiceRoute(cmd)){
            url = getServiceUrl(cmd,url);
        }
        //否则如果当前是服务域名，则替换为个人模式域名（如搜索页跳转到个人模式的链接）
        else if(isServiceDomain()){
            url = serviceToPersonal(url);
        }
        //其他不转换
    }
    return url;
}

export default {
  isServiceDomain,
  serviceDomainTransform
}
