// @flow
import localforage from 'localforage'
import Vue from 'vue'
import {v4 as uuid} from 'uuid'

import type { Module } from '../revuex'
import { createModule } from '../revuex'

import { getAudioInfo } from '../services/audio'

type SoundInfo = {|
    title: string,
    artist: string,
    album: string,
    duration: number
|}

type State = {|
    sounds: {[string]: File},
    soundInfos: {[string]: SoundInfo},
    decodedSounds: {[string]: Blob},
|}

const state: State = {
    sounds: {},
    soundInfos: {},
    decodedSounds: {}
}

const {getter, action, mutation, dispatch} : Module<State> = createModule(state, 'sounds')
localforage.getItem('files').then(files => files && dispatch(receiveSounds, files))

/*
 * getters
 */

type SoundInfoFn = string => {raw: ?File, info: ?SoundInfo}
export const singleSoundInfoFn = getter((state): SoundInfoFn =>
    (id) => ({
        raw: state.sounds[id],
        info: state.soundInfos[id]
    })
)

/*
 * actions
 */

export const receiveSounds = action(({commit, dispatch}, sounds) => {
    commit(LOAD_SOUNDS, sounds)
    Object.keys(sounds).forEach(id => {
        dispatch(fetchSoudnInfo, id)
    })
})

export const addSounds = action(({commit, dispatch}, newFiles) => {
    newFiles.forEach(file => {
        const id = commit(ADD_FILE, file)
        commit(player_ADD_TO_PLAYLIST, id)
        dispatch(fetchSoudnInfo, id)
    })
})

export const fetchSoudnInfo = action(({commit, state}, id) => {
    const sound = state.sounds[id]
    if (sound) {
        getAudioInfo(sound)
            .then(({tags}) => {
                commit(SET_SOUND_INFO, {id, tags})
            })
    }
})

export const removeSound = action(({state, commit}, id) => {
    if (id in state.sounds) {
        commit(PRUNE_FILE, id)
        commit(player_REMOVE_FROM_PLAYLIST, id)
    }
})

/*
 * mutations
 */

 import {
     ADD_TO_PLAYLIST as player_ADD_TO_PLAYLIST,
     REMOVE_FROM_PLAYLIST as player_REMOVE_FROM_PLAYLIST
 } from './player.js'

const ADD_FILE = mutation((state, file: Blob) => {
    const id = uuid()
    Vue.set(state.sounds, id, file)
    localforage.setItem('files', state.sounds)
    return id
})

const PRUNE_FILE = mutation((state, id: string) => {
    Vue.delete(state.sounds, id)
    Vue.delete(state.soundInfos, id)
    Vue.delete(state.decodedSounds, id)
    localforage.setItem('files', state.sounds)
})

const LOAD_SOUNDS = mutation((state, data) => {
    state.sounds = data
    state.soundInfos = {}
    state.decodedSounds = {}
})

const SET_SOUND_INFO = mutation((state, {id, tags}) => {
    Vue.set(state.soundInfos, id, {
        title: tags.title,
        artist: tags.artist,
        album: tags.album,
        duration: 0
    })
})
