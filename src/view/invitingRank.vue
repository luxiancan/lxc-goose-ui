<template>
    <div>
        <inviting-entrance scene="liveRoomLandscape" :myRank="20" :myInviteCount="18" :hasActivity="hasActivity" :topInviters="topInviters" :totalInviterCount="10" :float="false"></inviting-entrance>
        <inviting-entrance scene="detailPage" :hasActivity="hasActivity" :topInviters="topInviters" :totalInviterCount="10"></inviting-entrance>
        <inviting-entrance scene="liveRoomVertical" :hasActivity="hasActivity" :topInviters="topInviters" :totalInviterCount="10"></inviting-entrance>
        <inviting-rank :hasActivity="hasActivity"></inviting-rank>
    </div>
</template>

<script>
import InvitingEntrance from '@/components/invitingEntrance';
import InvitingRank from '@/components/invitingRank';

export default {
    components: {
        InvitingEntrance,
        InvitingRank
    },
    data() {
        return {
            hasActivity: true,
            topInviters: [
                {
                    share_user_id: 'u_5851248361892_tkRA9cHP',
                    invite_count: 356,
                    wx_nickname: '阿吉店吉',
                    wx_avatar:
            'http://wechatappdev-1252524126.file.myqcloud.com/appnJALKqkS7963/image/compress/aDVwZXJzb25hbGNlbnRlci1hbGl2ZWg1LXVfNTg1MTI0ODM2MTg5Ml90a1JBOWNIUC1XTlBvdzd0eg.jpeg'
                },
                {
                    share_user_id: 'u_5de88f6a8fbc9_MT07ookv1L',
                    invite_count: 195,
                    wx_nickname: '助教老师-佳佳',
                    wx_avatar:
            'http://wechatappdev-1252524126.file.myqcloud.com/appnJALKqkS7963/image/compress/aDVwZXJzb25hbGNlbnRlci1hbGl2ZWg1LXVfNWRlODhmNmE4ZmJjOV9NVDA3b29rdjFMLXFFRzdNR0w5.jpeg'
                },
                {
                    share_user_id: 'u_5ba3a9573266e_rjQ4ASaQRH',
                    invite_count: 71,
                    wx_nickname: '妍妍是朵小红花',
                    wx_avatar:
            'http://wechatappdev-1252524126.file.myqcloud.com/appnJALKqkS7963/image/compress/aDVwZXJzb25hbGNlbnRlci1hbGl2ZWg1LXVfNWJhM2E5NTczMjY2ZV9yalE0QVNhUVJILVRvb3NBSWZr.jpeg'
                },
            ]
        };
    },
        
}
</script>

<style lang="sass" scoped>

</style>