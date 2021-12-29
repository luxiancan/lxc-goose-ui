<template>
    <entity-gift :count="3" :courseCount="2"></entity-gift>
</template>

<script>
import './testAssets/common.css'
import entityGift from '@/components/entityGift'

export default {
    name: 'ssEntityGift',
    components: {
        entityGift
    }
};
</script>

<style>
</style>