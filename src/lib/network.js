/**
 * Created by vince on 17/2/17.
 */
let baseUrl = null;

import $ from 'n-zepto';
import domain_utils from './domain_utils';
import { error_report_utils } from './error_report_utils.js';

//1、cmd路由，不要带斜杠，直接写业务路由
//2、数据传进来一个js对象{}
//3、回调参数（serverData(object)）
/**
 *
 * @param cmd 请求路由
 * @param bizdata 请求参数
 * @param callback 请求逻辑回调（回调提供给业务逻辑使用）
 * @param type 请求数据类型
 */

const request = function (cmd, bizdata, callback, type) {
    if (baseUrl == null) {
        //如果基url为空，从url取一下
        baseUrl = window.location.origin;
        // 本地开发时，去除添加appid的逻辑
        if( baseUrl.indexOf("localhost:") == -1 ){
            if (baseUrl.indexOf(".h5.") == -1) {
                //找不到 .h5. 表示这是一个新地址，需要补充appid
                baseUrl = baseUrl + "/" + window.APPID;
            }
            //服务域名
            else if(domain_utils.isServiceDomain()){
                baseUrl = baseUrl + "/" + window.APPID;
            }
        }
        


    }

    type = type ? type : 'json';

    //设置开始时间用以计算接口时间
    let timestamp = new Date().getTime();
    error_report_utils.set_start_time(timestamp);

    $.ajax({
        type: 'POST',
        url: baseUrl + "/" + cmd,
        dataType: type,
        timeout: 60000,
        data: {
            bizData: bizdata
        },
        success: function (serverData,status,xhr) {
            try{
                //上报接口质量
                let api_is_success = (serverData && serverData.code === 0) ? 1:0;
                error_report_utils.report({
                    report_type:2,
                    api_data:{
                        api_type:"ajax",
                        api_url:cmd,
                        api_is_success:api_is_success,
                        api_params:bizdata,
                        api_time: error_report_utils.get_end_time(timestamp),
                        api_code:xhr.status,
                        api_msg:(api_is_success === 1) ? "" : serverData,
                    }
                });
            }
            catch (e){
                console.log(e);
            }
            typeof callback === 'function' && callback(serverData);
        },
        error: function (xhr, errorType, error) {
            try{
                //上报接口质量
                error_report_utils.report({
                    report_type:2,
                    api_data:{
                        api_type:"ajax",
                        api_url:cmd,
                        api_is_success:0 ,
                        api_params:bizdata,
                        api_time: error_report_utils.get_end_time(timestamp),
                        api_code:xhr.status,
                        api_msg:error,
                    }
                });
            }
            catch (e){
                console.log(e);
            }
            //ajax错误
            typeof callback === 'function' && callback({
                code: -10
            });
        }
    });
};

/**
 * 用于付费问答音频问题错误上报（慎用）
 * @author tonychen
 * @param cmd
 * @param bizdata
 * @param callback
 * @param type
 */
const get = function (cmd, bizdata, callback, type) {
    if (cmd === 'wx_voice_error_report') {
        baseUrl = '182.254.245.226:6996/wx_voice_error_report';
    } else {
        baseUrl = null;
    }
    if (baseUrl == null) {
        //如果基url为空，从url取一下
        baseUrl = window.location.origin;
    }

    type = type ? type : 'json';

    //设置开始时间用以计算接口时间
    let timestamp = new Date().getTime();
    error_report_utils.set_start_time(timestamp);
    $.ajax({
        url: baseUrl + "/" + cmd,
        dataType: type,
        timeout: 60000,
        data: bizdata,
        success: function (serverData,status,xhr) {
            try{
                //上报接口质量
                let api_is_success = (serverData && serverData.code === 0) ? 1:0;
                error_report_utils.report({
                    report_type:2,
                    api_data:{
                        api_type:"ajax",
                        api_url:cmd,
                        api_is_success:api_is_success,
                        api_params:bizdata,
                        api_time: error_report_utils.get_end_time(timestamp),
                        api_code:xhr.status,
                        api_msg:(api_is_success === 1) ? "" : serverData,
                    }
                });
            }
            catch (e){
                console.log(e);
            }
            typeof callback === 'function' && callback(serverData);
        },
        error: function (xhr, errorType, error) {
            try{
                //上报接口质量
                error_report_utils.report({
                    report_type:2,
                    api_data:{
                        api_type:"ajax",
                        api_url:cmd,
                        api_is_success:0 ,
                        api_params:bizdata,
                        api_time: error_report_utils.get_end_time(timestamp),
                        api_code:xhr.status,
                        api_msg:error,
                    }
                });
            }
            catch (e){
                console.log(e);
            }
            //ajax错误
            typeof callback === 'function' && callback({
                code: -10
            });
        }
    });
};

export default {
  request,
  get
}
