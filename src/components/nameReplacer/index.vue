<template>
  <span>
    <span v-if="!isAuthShop">{{ name }}</span>
    <span v-else-if="orgType == 999">
      <ww-open-data
        :openid="id"
        :type="nameTypes[type]"
        v-if="type == 0"
      ></ww-open-data>
      <ww-open-data
        :openid="id"
        :type="nameTypes[type]"
        v-else-if="type == 1"
      ></ww-open-data>
      <span v-else-if="isGetUserInfo && type == 2">
        <ww-open-data
          :openid="employId"
          :type="nameTypes[type]"
          v-if="hasOpenID"
        ></ww-open-data>
        <span v-else>
          {{ standbyText }}
        </span>
      </span>
      <span v-else-if="type == 3">
        <span v-if="hasName">
          {{ name }}
        </span>
        <span v-else-if="isGetUserInfo">
          {{ standbyText }}
        </span>
      </span>
    </span>
    <span v-else-if="orgType == 1">
      <ww-open-data
        :corpid="corpid"
        v-if="nameObj.isOpenId"
        :openid="nameObj.name"
        :type="nameTypes[type]"
      ></ww-open-data>
      <span v-else>
        {{ nameObj.name }}
      </span>
    </span>
  </span>
</template>

<script>
import NetWork from "@/lib/network";
const FETCH_API = "/training/employee/info/v2";
const ALIVE_FETCH_API = "_alive/employee/info/v2";
export default {
  name: "SsNameReplacer",
  data() {
    return {
      nameTypes: {
        0: "userName",
        1: "departmentName",
        2: "userName",
        3: "userName",
      },
      isAuthShop: false, // 是否为企业微信环境
      isGetUserInfo: false, // 是否完成通过user_id拿用户信息的请求
      hasOpenID: false,
      hasName: false,
      employId: "", // 姓名的openID
      standbyText: "", // 备用的展示文案
      orgType: "",
      nameObj: {},
    };
  },
  props: {
    id: {
      // shop_type为1是传(type 0 传eployId（openid） type 1 传departmentId（openid）type 2 传userID 3 传userID)
      type: [String, Number],
    },
    type: {
      // 需要展示的名称类型  0 姓名 1 部门名称 2 通过userid拿openID 再走通讯录组件流程 3 如果有名字展示名字 没有名字展示openID
      type: [String, Number],
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    isAuth: {
      type: Boolean,
      default: undefined,
    },
    api: {
      type: String,
      default: undefined,
    },
    alive: {
      type: Boolean,
      default: false,
    },
    appid: {
      type: String,
      default: undefined,
    },
  },
  mounted() {
    // 这里不能使用created 不然nuxt的项目会出问题，因为nuxt,会在客服端和服务端都会跑一遍created钩子，但是这里面使用了window，在服务端拿的时候是获取不到值的
    this.nameRepalcerInit();
  },
  computed: {
    corpid() {
      return window.__qywx_corp_id
    },
  },
  methods: {
    nameRepalcerInit() {
      if (this.isAuth !== undefined) {
        // 先去判断外部有没有传isAuth字段，如果有就以外面的为准，没有就去判断window.__shop_type
        if (this.isAuth === true) {
          this.isAuthShop = true;
        }
        // shop_type为1 已授权企业微信的企学院 org_type为1 已授权企业微信的知识店铺
      } else if (window.__shop_type == 1 || window.__org_type == 1) {
        this.isAuthShop = true;
        if(window.__shop_type == 1){
          this.orgType = '999'; // 企业微信的企学院orgType
        }else{
          this.orgType = String(window.__org_type);
        }
        this.orgTypeHandler(this.orgType)
      }
    },
    orgTypeHandler(orgType){
      if(orgType == 999){
          this.qywxTrainingShopHandler(this.type);
      }else if(orgType == 1){
          this.qywxShopHandler();
      }else{
         this.isAuthShop = false;
      }
    },
    // 企学院企业微信环境
    qywxTrainingShopHandler(type) {
      // type为0和1时，则传进来的id为openID 可直接使用 且需要进行绑定
      if (type == 0 || type == 1) {
        WWOpenData.bind(document.querySelector("ww-open-data"));
      }
      // type为 2 或 3时 则传进来的时userID 需要通过接口去换取openID
      if (type == 2 || type == 3) {
        if (type == 3 && this.name) {
          // 特殊情况，如果type为3时且名字已经存在则直接展示名字
          this.hasName = true;
        } else {
          // 如果传进来的名字不存在则去拿用户信息
          this.getUserInfoByUserID();
        }
      }
    },
    // 知识店铺企业微信环境
    qywxShopHandler() {
      this.nameObj = this.openIdParser(this.name);
      console.log(this.nameObj,'--------nameObj---------')
    },
    openIdParser(name) {
      console.log(name,'name in goose!!!!!!!')
      let reg = /##.*?##/g;
      let temp = name.match(reg);
      if (temp) {
        const openIdStr = temp[0];
        const openId = openIdStr.slice(2, openIdStr.length - 2);
        return {
          name: openId,
          isOpenId: true,
        };
      } else {
        return {
          name,
          isOpenId: false,
        };
      }
    },
    // 将openID本地化
    localizeOpenID(key, openID) {
      const qywx_open_ids = localStorage.getItem("qywx_open_ids");
      if (qywx_open_ids) {
        const data = JSON.parse(qywx_open_ids);
        data[key] = openID;
        localStorage.setItem("qywx_open_ids", JSON.stringify(data));
      } else {
        const temp = {};
        temp[key] = openID;
        localStorage.setItem("qywx_open_ids", JSON.stringify(temp));
      }
    },
    // 获取当前用户在本地的储存的openID
    getOpenIDLocalized(key) {
      const qywx_open_ids = localStorage.getItem("qywx_open_ids");
      if (qywx_open_ids) {
        const data = JSON.parse(qywx_open_ids);
        if (data[key]) {
          return data[key];
        }
      }
    },
    // 激活本地的openID用于wwopendata
    openIdEmiter(openID) {
      this.employId = openID;
      this.hasOpenID = true;
      this.isGetUserInfo = true;
    },
    // 通过userID换取用户信息（接口会返回openID，用于通讯录展示组件去微信服务器换取名字）
    getUserInfoByUserID() {
      const openID = this.getOpenIDLocalized(this.id);
      if (openID) {
        this.openIdEmiter(openID);
        return;
      }
      let params = {
        uid: [this.id],
      };
      if (window.appId) {
        params.app_id = window.appId;
      }
      if (this.appid) {
        params.app_id = this.appid;
      }
      let apiStr = FETCH_API;
      if (this.alive) {
        apiStr = ALIVE_FETCH_API;
      }
      if (this.api) {
        apiStr = this.api;
      }
      NetWork.get(apiStr, params, (res) => {
        const { code, data, msg } = res;
        if (code === 0) {
          this.employId = data.users[0].employee_id;
          this.standbyText =
            data.users[0].user_name || this.name || data.users[0].employee_id;
          if (this.employId) {
            this.hasOpenID = true;
            this.localizeOpenID(this.id, this.employId);
          }
        } else {
          this.standbyText = this.name;
        }
        this.isGetUserInfo = true;
        if (this.type == 2 && this.hasOpenID === true) {
          // type为2时，且拥有openID, 则进行数据绑定
          WWOpenData.bind(document.querySelector("ww-open-data"));
        }
      });
    },
  },
};
</script>