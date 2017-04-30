// @flow weak

import jsmediatags from 'jsmediatags'

const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
const bufSource = audioCtx.createBufferSource();

export const getAudioInfo = audioData  => {
    return new Promise((resolve, reject) => {
        new jsmediatags.Reader("http://www.example.com/music-file.mp3")
          .setTagsToRead(["title", "artist", "album"])
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
