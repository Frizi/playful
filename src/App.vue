<template>
    <PlayerLayout flex>
        <Visualizer slot="visualizer"/>
        <PlayerControls
            slot="controls"
            @play="play"
            @pause="pause"
            :playing="isPlaying"
        />
        <Playlist
            slot="playlist"
            @drop="addSounds"
            @select="selectForPlaying"
            @delete="removeSound"
            :items="playlistItems"
            :current="currentlyPlayingItem"
        />
    </PlayerLayout>
</template>

<script>
import R from 'ramda'

import PlayerLayout from './components/PlayerLayout.vue'
import PlayerControls from './components/PlayerControls.vue'
import Visualizer from './components/Visualizer.vue'
import Playlist from './components/Playlist.vue'

import {
    isPlaying,
    playlistItems,
    currentlyPlayingItem,
    selectForPlaying,
    play,
    pause
} from './store/player'
import {addSounds, removeSound} from './store/sounds'

export default {
    components: {
        PlayerLayout,
        PlayerControls,
        Visualizer,
        Playlist
    },
    getters: {
        playlistItems,
        isPlaying,
        currentlyPlayingItem
    },
    actions: {
        addSounds,
        removeSound,
        play,
        pause,
        selectForPlaying
    }
}
</script>

<style>

html, body
{
    width: 100%;
    height: 100%;

    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
}

[row], [column] {
    display: flex;
}

[row] {
    flex-direction: row;
}

[column] {
    flex-direction: column;
}

[flex], [flexroot] {
    flex: 1 0;
}
</style>
