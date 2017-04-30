<template>
    <div column flexroot class="playlist"
        @dragover="dragOver"
        @dragleave="dragEnd"
        @drop="onDrop"
    >
        <PlaylistItem
            v-for="item in items"
            @click="$emit('select', item.id)"
            @delete="$emit('delete', item.id)" :key="item.id" :item="item" :active="item === current"
        />
        <div class="dropzone" v-if="showDropzone">
            Drop files here
        </div>
    </div>
</template>
<script>
    import PlaylistItem from './PlaylistItem.vue'
    export default {
        props: {
            items: Array,
            current: Object
        },
        data () {
            return {
                showDropzone: false
            }
        },
        components: {
            PlaylistItem
        },
        methods: {
            dragOver (e) {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                this.showDropzone = true
            },
            dragEnd (e) {
                e.preventDefault();
                e.stopPropagation();
                this.showDropzone = false
            },

            onDrop (e) {
                e.preventDefault()
                e.stopPropagation()
                this.showDropzone = false
                this.$emit('drop', [...e.dataTransfer.files])
            }
        }
    }
</script>
<style scoped>

.playlist {
    position: relative;
}

.dropzone {
    position: absolute;
    left: 5px;
    right: 5px;
    top: 5px;
    bottom: 5px;
    border: 2px dashed red;
    background: rgba(255, 0, 0, 0.5);
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
