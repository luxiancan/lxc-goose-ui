export const TYPE_IMAGE_TEXT = 1; // 图文
export const TYPE_AUDIO = 2; // 音频
export const TYPE_VIDEO = 3; // 视频
export const TYPE_ALIVE = 4; // 直播
export const TYPE_MEMBER = 5; // 会员
export const TYPE_COLUMN = 6; // 专栏
export const TYPE_TOPIC = 8; // 大专栏
export const TYPE_BOOK = 20; // 电子书
export const TYPE_CAMP = 25; // 训练营
export const TYPE_SMALL_CLASS = 31; // 小班课
export const TYPE_BIG_CLASS = 35; // 班课
export const TYPE_COMMUNITY = 7; // 社群
export const TYPE_ACTIVITY = 9; // 活动
export const TYPE_ENTITY_GOODS = 21; // 实物
export const TYPE_PRACTICE = 34; //练习
export const TYPE_COURSE_OFFLINE = 29; // 线下课
export const TYPE_CLOCK = 16; // 打卡


// 资源类型key-value
export const RESOURCE_TYPES = {
  [TYPE_IMAGE_TEXT]: 'text',
  [TYPE_AUDIO]: 'audio',
  [TYPE_VIDEO]: 'video',
  [TYPE_ALIVE]: 'alive',
  [TYPE_MEMBER]: 'member',
  [TYPE_COLUMN]: 'column',
  [TYPE_TOPIC]: 'topic',
  [TYPE_BOOK]: 'book',
  [TYPE_CAMP]: 'camp',
  [TYPE_SMALL_CLASS]: 'small_class',
  [TYPE_BIG_CLASS]: 'big_class',
  [TYPE_COMMUNITY]:'community',
  [TYPE_ACTIVITY]:'activity',
  [TYPE_ENTITY_GOODS]:'entity_goods',
  [TYPE_PRACTICE]:'practice',
  [TYPE_COURSE_OFFLINE]:'course_offline',
  [TYPE_CLOCK]:'xiaoe_clock'
};


export const mapPath ={
     'v1/course/audio':'/page/home/content/content_audio/content_audio',
     'content_page/audio':'/page/home/content/content_audio/content_audio',
     'content_page/entity_goods':'/packageCommodity/page/content_entity_goods/content_entity_goods',
     'v1/entity/':'/packageCommodity/page/content_entity_goods/content_entity_goods',
     'content_page/video':'/page/home/content/content_video/content_video',
     'v1/course/video':'/page/home/content/content_video/content_video',
     'content_page/punch_card':'/packagePunch/page/participate/participate',
     'page/customerService/customerService':'/page/customerService/customerService',
     '#/diaryDetail':'/packagePunch/page/common_page/diary_detail/diary_detail',
     '#/calendarDetail':'/packagePunch/page/calendar/calendar_theme_detail/calendar_theme_detail',
     '#/calendar':'/packagePunch/page/calendar/calendar/calendar',
     '#/homeworkDetail':'/packagePunch/page/homework/homework_detail/homework_detail',
     '/clock/mine_other':'/packagePunch/page/common_page/mine_other/mine_other',
     'homepage/index':'/page/home/home_index/home_index',
     'homepage/10':'/page/home/home_index/home_index',
     'homepage/30':'/page/userInfo/mine',
     'homepage/20':'/page/home/message/message',
     'v1/usercenter/super_vip/index':'/page/superVip/index',
     'content_page/xiaoe_clock':'/packagePunch/page/participate/participate',
     'xiaoe_clock/calendar_clock':'/packagePunch/page/calendar/calendar_punch/calendar_punch',
     'xiaoe_clock/homework_clock':'/packagePunch/page/homework/homework_punch/homework_punch',
     'xiaoe_clock/breakthrough_clock':'/packagePunch/page/breakthrough/breakthrough_punch/breakthrough_punch',
     'page/download/download':'/page/download/download',
     'mp/micro_page':'/page/home/micro_page/micro_page'
}

// 根据不同类型资源给出不同的关键字段参数
export const RES_PARAMS = {
     'xiaoe_clock':'activity_id',
     'xiaoe_clock/clock/mine_other':'user_id'
}

// 根据不同key，获取链接参数
export const key_PARAMS = {
     '#/diaryDetail':'diary_id',
     '#/calendar':'activity_id',
     '#/homeworkDetail':'homework_id',
     '#/calendarDetail':'theme_id',
     '/clock/mine_other':'user_id'
}


export default {
    mapPath,
    RESOURCE_TYPES,
    RES_PARAMS,
    key_PARAMS
}