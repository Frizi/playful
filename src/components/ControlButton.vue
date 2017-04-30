<template>
    <button class="button" @click="$emit('click', $event)">
        <slot/>
    </button>
</template>

<script>
    export default {
    }
</script>

<style>
    .button {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: white;
        cursor: pointer;
        margin: 2px;
        border: none;
        box-shadow: 0 3px 5px black;
        transition: transform 0.1s;
    }

    .button:hover {
        background: silver;
        transition: transform 0.3s;
        transform: translateY(-2px);
    }
</style>
