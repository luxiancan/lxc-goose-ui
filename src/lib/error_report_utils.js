//接口文档 https://www.showdoc.cc/web/#/page/820199770406733
import param_form from './utils_param';

/**
 * 上报的地址
 * @type {string}
 */
let report_url = "https://report.h5.xeknow.com/error_report";


/**
 * 上报错误
 * @param report_data
 */
let report_error = function(report_data) {
    try {
        if(!window._eReport){
            return;
        }
        setTimeout(function () {
            let error_msg = param_form.init(report_data);
            let url = `${report_url}?${error_msg}`;
            //利用img标签跨域上报
            let _img = new Image;
            let log_name = "log_" + Math.floor(2147483648 * Math.random()).toString(36);
            window[log_name] = _img;
            _img.onload = _img.onerror = _img.onabort = function() {
                _img.onload = _img.onerror = _img.onabort = null;
                _img = window[log_name] = null;
            };
            _img.src = url;

            //设置1s超时设置，如果超过1s则中止请求（换成一个小图片）
            setTimeout(function () {
                if(_img && !_img.complete){
                    _img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUCB1jYAACAAAFAAGNu5vzAAAAAElFTkSuQmCC";
                }
            },1000);
        },2000);
    } catch (e) {
        console.log(e);
    }
};


/**
 * 埋点相关函数
 * @type {{}}
 */
//埋点开始时间集
let time_arr = {};

//设置埋点开始时间
let set_start_time = function (key) {
    try{
        time_arr[key] = parseInt(performance.now());
    }
    catch (e){
        console.log(e);
    }
};

//获取埋点结束时间
let get_end_time = function (key) {
    if(time_arr[key]){
        try{
            return parseInt(performance.now()) - time_arr[key];
        }
        catch (e){
            console.log(e);
        }
    }
    return 0;
};

/**
 * 上报对象
 * @type {{}}
 */
let report_data = {};

/**
 * 获取页面路径
 * @returns {string}
 */
let get_page_path = function () {
    if(report_data && report_data.common_data && report_data.common_data.page){
        return report_data.common_data.page;
    }
    return "";
};


/**
 * 初始化数据
 */
let init = function (obj) {
    if(Object.prototype.toString.call(obj) === '[object Object]'){
        //保存common_data和上报数据
        let temp = {};
        if(report_data && report_data.common_data){
            temp.common_data = report_data.common_data;
        }
        if(report_data && report_data.report_type){
            temp.report_type = report_data.report_type;
        }
        //轮询替换赋值
        for(let key in obj){
            if(obj.hasOwnProperty(key)){
                temp[key] = obj[key];
            }
        }
        report_data = temp;
        return true;
    }
    return false;
};

/**
 * 上报数据
 */
let report = function (obj) {
    if(get_page_path() === "alive_room"){
        init(obj);
        report_error(report_data);
    }
};



/**
 * 向外暴露接口
 */
let error_report_utils = {
    set_start_time,
    get_end_time,
    init,
    report
};


export { error_report_utils };
