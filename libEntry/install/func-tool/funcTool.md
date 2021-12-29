# 业务功能函数组件文档
功能函数组件含一些业务侧常用的功能函数

## 功能函数清单
| 功能函数名 | 主要用途 |使用方式 |
| :-----| :----: | :----:|
| getAuthCategory | 查询小程序类目资质情况，业务侧针对资质不同，做过滤处理| 调用该函数，以promise返回资质类目信息。getAuthCategory().then((res)=>{}) 接口文档地址:http://doc.xiaoeknow.com/web/#/505?page_id=9468|
| navigateTo | 公共跳转方法，小程序环境下有小程序匹配页面则跳转至小程序页面，否则跳转h5| 传入跳转路径参数即可 navigateTo(url,isTab) url:h5页面路径 isTab：是否为tab页，默认false,isRedirect是否用wx.miniProgram.redirectTo 方式跳转，默认为false，用wx.miniProgram.navigateTo|
| navigateBack | 公共返回前一页方法，基于`wx.miniProgram.navigateBack`封装| 传入跳转路径参数即可 navigateBack({delta,success,fail,complete}) delta:默认为1，success:可选，fail：可选，默认失败跳回首页，complete可选 |
| redirectTo | 公共返回前一页方法，基于`wx.miniProgram.redirectTo`封装| 传入跳转路径参数即可 redirectTo({url,success,fail,complete}) url，success:可选，fail：可选，默认失败跳回首页，complete可选 |