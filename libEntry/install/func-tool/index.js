import {ajax} from '@xiaoe/js-tools';
import eJump from '@/lib/eJump.js';
import { mapPath,RESOURCE_TYPES,RES_PARAMS,key_PARAMS } from './utils/mapRoute';
import base64 from 'base-64';

export const getAuthCategory = ()=>{
   return ajax({
           url: '/wxa/necessaryCategoryInfo',
           params: {},
        })
}

const getQueryStr = (url,key)=> { 
    if ( url.indexOf('?')>-1 ){
        let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        let r = url.split('?')[1].match(reg);
        if (r != null) {return unescape(r[2]);} return null;
    }else{
        return null
    }   
}

// 获取pathUrl
const getPathUrl = (url)=> { 
    if( url ){
        let paramsIndex = url.indexOf('?');
        let path = paramsIndex > -1 ? url.substring(0,paramsIndex) : url;
        return path;
    }else{
        return null
    }
    
}

const getResInfo = (url)=>{
    let resourceInfo = {};
    let pathUrl = getPathUrl(url) || url;

    if( url && pathUrl.indexOf('v1/course/') >-1 ){

        resourceInfo.resource_id = (pathUrl.split('/').pop() || '').split('?').shift(); 
        resourceInfo.type = getQueryStr(url,'type') || '';   
        let resType = pathUrl.split('v1/course/').pop().split('/').shift();
        resourceInfo.res_type = resType || '';
        resourceInfo.product_id = getQueryStr(url,'pro_id') || '';
        let ct_app_id = getQueryStr(url,'ct_app_id') || '';
        resourceInfo.content_app_id = ct_app_id ? base64.decode(ct_app_id) : '';

    }else if( url && pathUrl.indexOf('content_page/') > -1){
          // 解析base64 
          let baseCode = '';
          let path = url.split('content_page/')[1];
          baseCode = path.split('?').shift();
          baseCode = JSON.parse(base64.decode(baseCode)) || {};
          
          if( baseCode['resource_id'] ){
             resourceInfo.resource_id = baseCode['resource_id'] || '';
          }
             
          if( baseCode['product_id'] ){
             resourceInfo.product_id = baseCode['product_id'] || '';
          }

          if( !resourceInfo.resource_id ){
              resourceInfo.resource_id = baseCode['product_id'] || '';
          }

          resourceInfo.type = baseCode['type'] || 2 ;
          resourceInfo.resource_type = baseCode['resource_type'] || '' ;
          resourceInfo.content_app_id = baseCode['content_app_id'] || '' ;

    } else if (url && pathUrl.indexOf('v1/usercenter/super_vip/index') > -1) {
          // 超级会员
          let path = url.split('v1/usercenter/super_vip/index/')[1];
          let id = path.split('?').shift();
          resourceInfo.resource_id = id;
    }else if (url && pathUrl.indexOf('xiaoe_clock/') > -1 && url.indexOf('#/') <0) {
          // 打卡相关
          let id = (url.split('#/').shift() || '').split('/').pop();
          if( url.indexOf('xiaoe_clock/clock/mine_other')>-1 ){
             id = getQueryStr(url,'user_id');
          }
          
          resourceInfo.resource_id = id;
    }else if( url && (pathUrl.indexOf('v1/entity/') > -1 || pathUrl.indexOf('v1/goods/goods_detail/') > -1)){
        resourceInfo.resource_id = (pathUrl.split('/').pop() || '').split('?').shift(); 

    }else if(url && /\/mp\/.*/.test(pathUrl)){ // 获取微页面id
        let baseCode = '';
        let path = pathUrl.split('/mp/')[1];
        baseCode = path.split('?').shift();
        baseCode = JSON.parse(base64.decode(baseCode)) || {};
        resourceInfo.resource_id = baseCode['id'];

    }else {
        for(let key in key_PARAMS){
            if( url && url.indexOf(key) > -1 ){
                resourceInfo.resource_id = getQueryStr(url,key_PARAMS[key]) || '';
                return resourceInfo;
            }
        }
    }
    return resourceInfo;
}

const toCommonPage = (url,isTab = false)=>{
    // 其他不在映射里的路径跳到小程序的统一分享页
    let reg = /^(http|https):\/\/([\w.]+\/?)\S*/;
    let h5Url = url;
    // 是否是全路径
    if( !reg.test(h5Url) ){
        h5Url = /^\//.test(h5Url) ? `${location.protocol}//${location.hostname}${h5Url}` : `${location.hostname}/${h5Url}`
    }
    
    if( isTab ){
        wx.miniProgram && wx.miniProgram.switchTab({
            url:`/page/share/share?h5_url=${base64.encode(JSON.stringify(h5Url))}`
         })
    }else{
       wx.miniProgram && wx.miniProgram.navigateTo({
          url:`/page/share/share?h5_url=${base64.encode(JSON.stringify(h5Url))}`
       })
    }
    
}

export const navigateTo = (url,isTab = false,isRedirect= false)=>{
    let h5Jump = eJump.jump; // 通用h5的跳转
    let route = url;
    let matchIndex = 0;

    // 微信小程序环境 小程序3.0
    if( window.wx && window.wx.CLIENT_ENV === 'wx_miniProgram' ){
        let mapRoute = mapPath;
        let indexUrl = `${location.protocol}//${location.hostname}`;
        let h5Path = getPathUrl(route) || route;
        let isDomain = ( h5Path ===  indexUrl ) || ( h5Path === `${indexUrl}/`) ; 
        let isMicroPage = /\/mp\/.*/.test(h5Path);      
        if( url === '/' || isDomain ){
            route = '/homepage/index'
        }else if(isMicroPage){
            // 微页面
            route = 'mp/micro_page';
        }
        console.log('paths-------',route,h5Path)
        // 跳转方法
        let jumpMethods = wx.miniProgram.navigateTo;
        if( isRedirect){
            jumpMethods = wx.miniProgram.redirectTo;
        }
             
        // 遍历映射路由表
        for( let key in mapRoute ){
            // 查询路由里有无key值
            let h5Params = encodeURIComponent(url);
            let isBaseDetail = h5Path.indexOf('/content_page/') >-1 ;
            if( route && ( route.indexOf(key) > -1 || isBaseDetail)){
                matchIndex++;
                // 如果是详情页相关路径，处理后再跳转
                let isV1Course = h5Path.indexOf('/v1/course/') >-1;
                let { resource_id='',type='',res_type='',product_id='',resource_type ='',content_app_id=''} = getResInfo(url);
                let mapUrl = mapRoute[key];
                
                if( isV1Course || isBaseDetail){             
                    let routeKey = 'content_page/';
                    if( isV1Course ){
                        routeKey = `v1/course/${res_type}`;
                    }else{
                        routeKey = `content_page/${(RESOURCE_TYPES[resource_type]) || ''}`;
                    }

                    if( mapRoute[routeKey]){
                        let resKey = RES_PARAMS[ RESOURCE_TYPES[resource_type] ] || 'id';
                        let path = `${mapRoute[routeKey]}?${resKey}=${resource_id}&type=${type}`; 
                        path =  product_id ? `${path}&pro_id=${product_id}` : path; 
                        path =  content_app_id ? `${path}&content_app_id=${content_app_id}` : path;
                        path = `${path}&h5Url=${h5Params}`;
                        console.log('h5resourcepath-------',path)
                        // 跳转至小程序对应页面 
                        wx.miniProgram && jumpMethods({
                            url: path
                        })
                        return;
                    }else{
                        toCommonPage(route,isTab);
                        return;
                    }
                    
                }else if( h5Path.indexOf('v1/entity/') >-1){
                    // 增加参数
                    // 获取option参数
                    let paramIndex =  url.indexOf('?');
                    let originParam = paramIndex > -1 ? url.substring(paramIndex+1) : '';
                    let jumpUrl = resource_id ? `${mapUrl}?id=${resource_id}&${originParam}&h5Url=${h5Params}` : `${mapUrl}&${originParam}`;
                    let isEntityCoupon = /v1\/entity\/coupon\/.*\?type=/.test(route);
                    let toMiniProgram = true;
                    if( /v1\/entity\/.*\?type=/.test(route) === false || isEntityCoupon ){
                        jumpUrl = route;
                        toMiniProgram = false;
                    }
                    console.log('v1/entity/--jumpUrl---',jumpUrl,toMiniProgram,route)
                    if( toMiniProgram ){
                        if( isTab ){
                            wx.miniProgram && wx.miniProgram.switchTab({
                                url: jumpUrl
                            })
                            return;
                        }else{
                            wx.miniProgram && jumpMethods({
                                url: jumpUrl
                            })
                            return;
                        }
                    }else{
                        // 有价优惠券跳转h5,去除兜底
                        if( isEntityCoupon){     
                            if( isRedirect === false ){
                                h5Jump(jumpUrl);
                            }                                                 
                        }else{
                            toCommonPage(jumpUrl,isTab);
                        }         
                        return;
                    }

                }else{
                    // 其他key值匹配映射直接跳转
                    let resType = RESOURCE_TYPES[resource_type] || '';
                    // 打卡参数用activity_id，其他默认用id
                    if( h5Path.indexOf('xiaoe_clock/')> -1 &&  route.indexOf('#/')< 0){
                        if( h5Path.indexOf('xiaoe_clock/clock/mine_other') > -1){
                            resType = 'xiaoe_clock/clock/mine_other';
                        }else{
                            resType = 'xiaoe_clock';
                        }

                    }

                    let resKey = RES_PARAMS[ resType ] || 'id';                   
                    let jumpUrl = resource_id ? `${mapUrl}?${resKey}=${resource_id}` : mapUrl;

              
                    // 消息推送日历打卡日历页面把h5的参数追加过来
                    if( route && route.indexOf('?')>-1 && route.indexOf('#/calendar?')>-1 ){
                        let h5ParamsStr = url.split('#/calendar?')[1];
                        jumpUrl = jumpUrl.indexOf('?')>-1 ? `${jumpUrl}&${h5ParamsStr}` : `${jumpUrl}`;
                    }else if( route.indexOf('#/calendarDetail?theme_id')>-1){
                        jumpUrl = `${jumpUrl}?id=${getQueryStr(url,'theme_id')}`
                    }
                    

                    console.log('jumpUrl----------',jumpUrl,'route----------\n',route)
                   
                    if( isTab ){
                        wx.miniProgram && wx.miniProgram.switchTab({
                            url: jumpUrl
                        })
                        return;
                    }else{
                        wx.miniProgram && jumpMethods({
                            url: jumpUrl
                        })
                        return;
                    }
                                                
                }
            }
        }
        // 未匹配到key
        if( matchIndex === 0 ){
            toCommonPage(route,isTab);
        }
       
    }else{
        h5Jump(url);
    }
    
}

export const navigateBack = ({delta = 1,success='',fail='',complete=''})=>{
    window.wx && wx.miniProgram && wx.miniProgram.navigateBack({
        delta,
        success:function(){
            if( typeof(success) === 'function'){
                success();
            }
        },
        fail: function () {
            if( typeof(fail) === 'function'){
                fail();
            }else{
                 // 失败回跳首页
                 navigateTo('/')
            }          
        },
        complete:function(){
            if( typeof(complete) === 'function'){
                complete();
            }
        }
    });
}

// 小程序内关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。在小程序插件中使用时，只能在当前插件的页面中调用
export const redirectTo = ({url = '',success='',fail='',complete=''})=>{
    window.wx && wx.miniProgram && wx.miniProgram.redirectTo({
        url,
        success:function(){
            if( typeof(success) === 'function'){
                success();
            }
        },
        fail: function () {
            if( typeof(fail) === 'function'){
                fail();
            }else{
                 // 失败回跳首页
                 navigateTo('/')
            }          
        },
        complete:function(){
            if( typeof(complete) === 'function'){
                complete();
            }
        }
    })
}

export default {
    getAuthCategory,
    navigateTo,
    navigateBack,
    redirectTo
};