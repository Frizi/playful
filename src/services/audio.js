// @flow weak

import { Reader } from 'jsmediatags'

const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
const bufSource = audioCtx.createBufferSource();

type AudioTags = {
    tags: {
        album: string,
        artist: string,
        title: string
    }
}

export const getAudioInfo = (audioFile: File) : Promise<AudioTags> => {
    return new Promise((resolve, reject) => {
        new Reader(audioFile)
            .setTagsToRead(["title", "artist", "album"])
            .read({ onSuccess: resolve })
    })
}

export const decodeFile = audioData => {
    audioCtx.decodeAudioData(audioData)
}

export const playSound = (decodedAudio) => {
    bufSource.buffer = decodedAudio.buffer
    bufSource.start(0)
}

export const stopPlaying = () => {
    bufSource.stop(0)
}
