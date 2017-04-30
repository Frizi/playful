<template>
    <div row class="playlist-item" :class="{active}">
        <div flex class="label" @click="$emit('click', $event)">
            {{ item.label }}
        </div>
        <button type="button" @click="$emit('delete')">delete</button>
    </div>
</template>
<script>
    export default {
        props: {
            item: Object,
            active: Boolean
        }
    }
</script>
<style scoped>
.playlist-item {
    color: white;
    padding: 8px 15px;
}

.playlist-item + .playlist-item {
    border-top: 1px solid black;
}

.playlist-item.active {
    color: black;
    background: white;
}

.label {
    cursor: pointer;
}
</style>
