<template>
  <div class="container">
    <h4 :style="{ marginLeft: '10px' }">凑团</h4>
    <team-buy-list
      :isShow="true"
      :currentStatus="currentStatus"
      :stopTime="team_buy_data.buy_stop_at"
      :joinTeamList="team_buy_data.list"
      :teamTotal="team_buy_data.total"
      :teamPrice="team_buy_data.group_price"
      :teamBuyNum="team_buy_data.sum_num"
      :isJoinTeam="team_buy_data.complete"
      :teamBuyId="team_buy_data.team_buy_id"
      :resourceId="resource_info.resource_id"
      :resourceType="resource_info.resource_type"
      :shareType="shareType"
      :shareUserId="shareUserId"
    ></team-buy-list>
  </div>
</template>

<script>
import TeamBuyList from "../components/teamBuyList";
export default {
  components: {
    TeamBuyList
  },
  data() {
    return {
      currentStatus: 1,
      isTeamBuy: true,
      is_show_all: false,
      shareType: "",
      shareUserId: "",
      teambuy_notify: false,
      teambuy_remain: "",
      resource_info: {
        activity_state: 0,
        already_purchased: 0,
        audio_length: 0,
        content: "",
        content_url: "",
        course_offline_type: 2,
        enrollment_start_at: "",
        enrollment_state: 0,
        finish_count: 0,
        has_buy: 0,
        has_stock: false,
        img_url:
          "http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/kg7mpt970sj7wqx9x25c.jpg",
        img_url_compressed:
          "http://wechatapppro-1252524126.file.myqcloud.com/appAKLWLitn7978/image/kg7mpt970sj7wqx9x25c.jpg",
        is_can_buy: 0,
        is_free: 0,
        is_range_price: 0,
        is_related: 0,
        is_stop_sell: 0,
        is_try: 0,
        is_valid: 1,
        limit_purchase_num: "",
        line_price: 0,
        max_price: 0,
        min_price: 0,
        need_user_info: 0,
        noCollect: true,
        patch_img_url: "",
        patch_img_url_compressed: "",
        payment_type: 2,
        periodical_count: 0,
        price: 20,
        product_id: "",
        purchase_count: 0,
        range_price: "",
        recycle_bin_state: 0,
        resource_id: "cz_5f86adbcd2677_yQ1RkuSbcA",
        resource_type: 29,
        sign_up_full: 0,
        state: 0,
        stock: 59,
        summary: "法十大",
        takegoods_url: "",
        time_left: -2122,
        title: "拼团课程",
        try_audio_m3u8_url: "",
        try_audio_url: "",
        try_content: "",
        use_svip_price: false,
        view_count: 0
      },
      team_buy_data: {
        is_teamBuy: 1,
        complete: 1,
        task_id: "t_5f86af0fc6bdb_UkajfNb2",
        team_buy_id: "tb_5f86adf0288ad_ZLrMAbeY",
        captain_price: 1,
        target_url:
          "/content_page/eyJ0eXBlIjoxMywicmVzb3VyY2VfdHlwZSI6IjI5IiwicmVzb3VyY2VfaWQiOiJjel81Zjg2YWRiY2QyNjc3X3lRMVJrdVNiY0EiLCJwcm9kdWN0X2lkIjoiY3pfNWY4NmFkYmNkMjY3N195UTFSa3VTYmNBIiwiYXBwX2lkIjoiYXBwQUtMV0xpdG43OTc4IiwidGVhbV9idXlfaWQiOiJ0Yl81Zjg2YWRmMDI4OGFkX1pMck1BYmVZIiwidGFza19pZCI6InRfNWY4NmFmMGZjNmJkYl9Va2FqZk5iMiJ9",
        list: [
          {
            task_id: "t_5f86af0fc6bdb_UkajfNb2",
            captain_user_id: "u_5ea15a529b7bb_6O1jjCqHfx",
            num: 2,
            stop_at: 1602748560,
            payment_type: 13,
            wx_avatar:
              "http://wechatavator-1252524126.file.myqcloud.com/appAKLWLitn7978/image/compress/u_5ea15a529b7bb_6O1jjCqHfx.png",
            wx_avatar_wx:
              "http://thirdwx.qlogo.cn/mmopen/vi_32/zsBrmyxmwWgg3ljwMht00ciaX3vicEGm3c2OSpV7NsdGNhdWy1V7pJROSzros8LUZeNkePbQXsRsLAwEEUVdicjUQ/132",
            url:
              "/content_page/eyJ0eXBlIjoxMywicmVzb3VyY2VfdHlwZSI6IjI5IiwicmVzb3VyY2VfaWQiOiJjel81Zjg2YWRiY2QyNjc3X3lRMVJrdVNiY0EiLCJwcm9kdWN0X2lkIjoiY3pfNWY4NmFkYmNkMjY3N195UTFSa3VTYmNBIiwiYXBwX2lkIjoiYXBwQUtMV0xpdG43OTc4IiwidGVhbV9idXlfaWQiOiJ0Yl81Zjg2YWRmMDI4OGFkX1pMck1BYmVZIiwidGFza19pZCI6InRfNWY4NmFmMGZjNmJkYl9Va2FqZk5iMiJ9"
          }
        ],
        total: 1,
        group_price: 10,
        sum_num: 3,
        buy_stop_at: 1604116800,
        specs_info: [
          {
            specs_id: "goods_code_5f86adbcdb231_1dwfYD",
            group_specs_price: 10,
            captain_specs_price: 1,
            spec_desc: "1课时",
            price: 20,
            stock: 30,
            now_stock: 29
          },
          {
            specs_id: "goods_code_5f86adbcdb246_8QYTLp",
            group_specs_price: 20,
            captain_specs_price: 1,
            spec_desc: "2课时",
            price: 30,
            stock: 30,
            now_stock: 30
          }
        ],
        is_join: 1,
        course_offline_type: 2
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 60%;
  background-color: grey;
}
</style>
