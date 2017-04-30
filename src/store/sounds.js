// @flow
import localforage from 'localforage'
import Vue from 'vue'
import {v4 as uuid} from 'uuid'

import type { Module } from '../revuex'
import { createModule } from '../revuex'

type SoundInfo = {|
    title: string,
    artist: string,
    album: string,
    duration: Number
|}

type State = {|
    sounds: {[string]: Blob},
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


type SoundInfoFn = string => {raw: ?Blob, info: ?SoundInfo}
export const singleSoundInfoFn = getter((state): SoundInfoFn =>
    (id) => ({
        raw: state.sounds[id],
        info: state.soundInfos[id]
    })
)

/*
 * actions
 */

export const receiveSounds = action(({commit}, files) => {
    commit(LOAD_SOUNDS, files)
})

export const addSounds = action(({commit}, newFiles) => {
    newFiles.forEach(file => {
        const id = commit(ADD_FILE, file)
        commit(player_ADD_TO_PLAYLIST, id)
    })
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
})

const LOAD_SOUNDS = mutation((state, data) => {
    state.sounds = data
    state.soundInfos = {}
    state.decodedSounds = {}
})
