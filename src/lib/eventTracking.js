const getQueryString = (name) => {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

export const sensorsReport = (eventName, options) => {
  try {
    const sharer_id = getQueryString('share_user_id') || '';
    const from_share = !!sharer_id;
    const trackData = Object.assign({
      c_user_id: window.USERID,
      app_id: window.APPID,
      sharer_id,
      from_share,
    }, options)
    window.console.log('--------埋点上报--------');
    window.console.log(options);
    window.sensors.track(eventName, trackData);
  } catch (err) {
    console.log(err);
  }
};


export default {
    sensorsReport
};
