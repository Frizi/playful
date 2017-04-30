<template>
    <canvas flexroot ref="canvas" />
</template>
<script>
    export default {
        props: {
            tick: {
                type: Function,
                required: true
            }
        },
        mounted () {
            this._ctx = this.$refs.canvas.getContext('2d')
            this.startAnim()
        },

        unmount () {
            this.stopAnim()
        },

        methods: {
            startAnim () {
                if (!this._frame) {
                    this._lastT = performance.now()
                    this.frame()
                }
            },
            stopAnim () {
                if (this._frame) {
                    cancelAnimationFrame(this._frame)
                    this._frame = null
                }
            },
            frame (time) {
                const dt = time - this._lastT
                this._lastT = time
                try {
                    this._tick(dt, time)
                    this._frame = requestAnimationFrame(this.frame)
                } catch (e) {
                    this._frame = null
                    throw e
                }
            },
            _tick (dt, time) {
                const canvas = this.$refs.canvas
                const ctx = this._ctx
                const {width: w, height: h} = canvas.parentNode.getBoundingClientRect()
                if (canvas.width !== w || canvas.height !== h) {
                    canvas.width = w
                    canvas.height = h
                }
                else {
                    ctx.clearRect(0, 0, w, h)
                }

                this.tick(dt, time, ctx, w, h)
            }
        }
    }
</script>
