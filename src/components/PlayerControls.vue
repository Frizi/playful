<template>
    <div flexroot row class="controls">
        <ControlButton @click="$emit('back', $event)">
            <Icon name="step-backward"/>
        </ControlButton>
        <ControlButton v-if="!playing" @click="$emit('play', $event)">
            <Icon name="play"/>
        </ControlButton>
        <ControlButton v-else @click="$emit('pause', $event)">
            <Icon name="pause"/>
        </ControlButton>
        <ControlButton @click="$emit('back', $event)">
            <Icon name="step-forward"/>
        </ControlButton>
    </div>
</template>

<script>
    import 'vue-awesome/icons/step-backward'
    import 'vue-awesome/icons/play'
    import 'vue-awesome/icons/pause'
    import 'vue-awesome/icons/step-forward'
    import Icon from 'vue-awesome/components/Icon'

    import ControlButton from './ControlButton.vue'
    export default {
        components: {
            ControlButton,
            Icon
        },
        props: {
            playing: Boolean
        }
    }
</script>

<style>

.controls {
    padding: 20px;
    border-top: 1px solid blue;
}

</style>
