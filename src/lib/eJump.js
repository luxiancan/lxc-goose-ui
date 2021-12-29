import EventBus from './eventbus';
import domain_utils from './domain_utils';

function jump(cmd, isReplace) {
  // 跳转前要执行的回调函数
  let callback = '';
  EventBus.$on('eJumpCallBack', (cb) => {
    if (typeof cb === 'function') {
      callback = cb;
    }
  });
  if (callback !== '' && typeof callback === 'function') {
    callback();
  }

  let url = '';
  // 取url类型(-1代表新的url)
  const urlType = window.location.hostname.indexOf('.h5.');
  if (cmd == null || cmd == undefined || cmd == '') {
    // 异常cmd，直接跳首页
    if (urlType === -1) {
      // 新的url首页，斜杠后面带appid
      url = `${window.location.protocol}//${window.location.hostname}/${window.APPID}`;
    } else {
      // 旧的url首页
      url = `${window.location.protocol}//${window.location.hostname}`;
    }
  } else {
    // 正常cmd，过滤掉前面的斜杠
    if (cmd !== '/' && cmd.indexOf('/') === 0) {
      cmd = cmd.substr(1);
    }
    // 取非问号参数的部分（排除后面参数干扰，用来做url识别）
    const normalUrl = cmd.split('?')[0];

    if (normalUrl.indexOf('http') === 0) {
      // cmd已经是全路径
      url = cmd;
    } else {
      // 如果不是全路径的url，则根据类型来补全url（如果是新链接，取到的url必定是带了appid的）。
      if (urlType === -1) {
        // 新的url首页，斜杠后面带appid
        url = `${window.location.protocol}//${window.location.hostname}/${window.APPID}/${cmd}`;
      } else {
        // 旧的url首页
        url = `${window.location.protocol}//${window.location.hostname}/${cmd}`;
      }
    }
    // 如果是跳转content_page页，确保没有appid
    if (normalUrl.indexOf('content_page') >= 0) {
      // 如果是跳到内容页，确保去掉了appid
      url = url.replace(`${window.APPID}/`, '');
    }

    // 如果是跳转javascript:,不修改
    if (normalUrl == 'javascript:') {
      // 如果是跳到内容页，确保去掉了appid
      url = cmd;
    }
  }

  // 服务域名转换处理
  url = domain_utils.serviceDomainTransform(cmd, url);

  // 根据是否强制访问作区分处理
  if (isReplace) {
    window.location.replace(url);
  } else {
    window.location.href = url;
  }
}

export default { jump };
