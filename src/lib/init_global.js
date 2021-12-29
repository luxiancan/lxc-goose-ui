// 全局变量名
const globalVal = ['APPID', 'USERID', 'USERIP', 'MACHINEIP', 'WXNICKNAME', 'WXAVATAR'];

function initCommonData(commonData,isInitUserInfo = true) {
    let notInitGroups = [];
    if( !isInitUserInfo ){
        notInitGroups = ['USERID', 'USERIP', 'MACHINEIP'];
    }
    // 初始化错误上报
    if (!window.e_report) {
        window.e_report = () => {};
    }

    // 初始化全局变量
    if (commonData && typeof commonData === 'object') {
        globalVal.forEach(key => {
            if (commonData.hasOwnProperty(key) && !notInitGroups.includes(key)) {
                window[key] = commonData[key];
            }
        });
    }
}

export default {
    init: initCommonData
};
