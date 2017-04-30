<template>
    <AutosizedCanvas :tick="tick" />
</template>
<script>
    import AutosizedCanvas from './AutosizedCanvas.vue'

    export default {
        components: {
            AutosizedCanvas
        },
        methods: {
            tick (dt, time, ctx, w, h) {
                const bounce = (max, val) => Math.abs((val % (max * 2)) - max)
                ctx.fillStyle = "red"
                ctx.fillRect(bounce(w-15, time / 2), bounce(h-15, time / 2), 15, 15)
            }
        }
    }
</script>
