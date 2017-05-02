// @flow
import localforage from 'localforage'
import type {Module}
from '../revuex'
import {createModule} from '../revuex'

type State = {
    playlistIds: string[],
    lastSeekTime: number,
    lastSeekPosition: number,
    volume: number,
    currentSoundId: ?string,
    isPlaying: boolean
}

const state : State = {
    playlistIds: [],
    lastSeekTime: 0,
    lastSeekPosition: 0,
    volume: 0,
    currentSoundId: null,
    isPlaying: false
}

localforage.getItem('playlist').then(list => list && dispatch(receivePlaylist, list))

const {getter, action, mutation, dispatch} : Module <State> = createModule(state, 'sounds')

/*
 * getters
 */

import {singleSoundInfoFn as soundsSingleSoundInfoFn} from './sounds'

type PlaylistItem = {|
    id: string,
    label: string,
    duration: ?number
|}

export const isPlaying = getter(state => state.isPlaying)

export const currentlyPlayingItem = getter(state => {
    const currentId = state.currentSoundId
    const playlist = playlistItems()
    return playlist.find(p => p.id === currentId)
})

export const playlistItems = getter((state) : PlaylistItem[] => {
    const getSoundInfo = soundsSingleSoundInfoFn()
    return state.playlistIds.map(id => {
        const data = getSoundInfo(id)
        if (data.info) {
            return {
                id,
                label: `${data.info.artist} - ${data.info.title}`,
                duration: data.info.duration
            }
        }
        if (data.raw) {
            return {id, label: data.raw.name, duration: null}
        }
        return null
    }).filter(Boolean)
})

/*
  * actions
  */

export const selectForPlaying = action(({commit}, id) => commit(SET_ACTIVE, id))

const receivePlaylist = action(({
    commit
}, playlist) => {
    commit(RECEIVE_PLAYLIST, playlist)
})

export const play = action(({commit}) => commit(TOGGLE_PLAY, true))
export const pause = action(({commit}) => commit(TOGGLE_PLAY, false))

/*
 * mutations
 */

const TOGGLE_PLAY = mutation((state, isPlaying: boolean) => {
    state.isPlaying = isPlaying
})

const SET_ACTIVE = mutation((state, id: string) => {
    state.currentSoundId = id
})

const RECEIVE_PLAYLIST = mutation((state, playlist) => {
    state.playlistIds = playlist
})

/* interface with sounds module */

export const ADD_TO_PLAYLIST = mutation((state, id : string) => {
    if (state.playlistIds.indexOf(id) < 0) {
        state.playlistIds.push(id)
        localforage.setItem('playlist', state.playlistIds)
    }
})

export const REMOVE_FROM_PLAYLIST = mutation((state, id : string) => {
    const index = state.playlistIds.indexOf(id)
    if (index >= 0) {
        state.playlistIds.splice(index, 1)
    }
})
