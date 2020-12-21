const player = document.getElementById('player')
const progressRange = player.querySelector('#progress-range')
const buttonPrev = player.querySelector('#button-prev')
const buttonPlay = player.querySelector('#button-play')
const buttonNext = player.querySelector('#button-next')
const startTime = player.querySelector('#progress-start-time')
const endTime = player.querySelector('#progress-end-time')
const audio = player.querySelector('#audio')
const image = document.getElementById('image')
const title = document.getElementById('title')

const sources = ['black-merc', 'i-fly-in-clouds', 'kosandra']

let src
let activeIdx = 0

const renderImage = () => {
  image.innerHTML = ''

  const img = document.createElement('img')
  img.setAttribute('src', `images/${sources[activeIdx]}.jpg`)
  image.insertAdjacentElement('beforeend', img)
}
renderImage()

const setSound = () => {
  audio.setAttribute('src', `sounds/${sources[activeIdx]}.mp3`)
}
setSound()

const updateTitle = () => {
  title.textContent = sources[activeIdx].replaceAll('-', ' ')
}
updateTitle()

const pause = () => {
  buttonPlay.setAttribute('src', 'images/icons/play.svg')
  audio.pause()
}
const play = () => {
  buttonPlay.setAttribute('src', 'images/icons/stop.svg')
  audio.play()
}
const updateSrc = () => {
  src = buttonPlay.getAttribute('src').slice(13).split('.')[0]
}

const togglePlay = () => {
  src === 'stop' ? pause() : play()

  updateSrc()
}
buttonPlay.addEventListener('click', togglePlay)

audio.volume = 0.01

const loadedDataHandler = () => {
  const dur = audio.duration
  const soundTime = Math.floor(dur)
  const minutes = Math.floor(soundTime / 60)
  const seconds = Math.floor(soundTime % 60)

  startTime.textContent = '00:00'
  endTime.textContent = `0${minutes}:${seconds}`

  progressRange.setAttribute('max', dur)
  progressRange.value = 0
}
audio.addEventListener('loadeddata', loadedDataHandler)

const formatTime = time => (time < 10 ? `0${time}` : time)
const timeUpdateHandler = () => {
  let currentSeconds = Math.round(audio.currentTime)
  const currentMinutes = Math.floor(currentSeconds / 60)

  if (currentSeconds > 60) {
    currentSeconds = currentSeconds - 60 * currentMinutes
  }

  if (currentSeconds) {
    startTime.textContent = `${formatTime(currentMinutes)}:${formatTime(
      currentSeconds,
    )}`
  }

  const percent = (100 * audio.currentTime) / audio.duration
  progressRange.setAttribute('value', percent)
}
audio.addEventListener('timeupdate', timeUpdateHandler)

const changeHandler = e => (audio.currentTime = e.target.value)
progressRange.addEventListener('change', changeHandler)

const nextHandler = () => {
  pause()
  updateSrc()

  if (activeIdx <= sources.length - 2) {
    activeIdx++
    renderImage()
    setSound()
    updateTitle()
  }
}
buttonNext.addEventListener('click', nextHandler)

const prevHandler = () => {
  pause()
  updateSrc()

  if (activeIdx >= 1) {
    activeIdx--
    renderImage()
    setSound()
    updateTitle()
  }
}
buttonPrev.addEventListener('click', prevHandler)
