<template>
    <div row flexroot>
        <div flex column class="control-pane">
            <div flex column>
                <slot name="visualizer"/>
            </div>
            <div row>
                <slot name="controls"/>
            </div>
        </div>
        <div flex column class="browser-pane">
            <slot name="playlist"/>
        </div>
    </div>
</template>
<style scoped>

.control-pane {
    background: #050942;
}

.browser-pane {
    background: #12186c;
}
</style>
