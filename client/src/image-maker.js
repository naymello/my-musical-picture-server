import { showImages, showText, showTheme, showCaption } from './functions.js'
import './picture.scss'

const url = window.location

const type = new URLSearchParams(url.search).get('type')
const timeRange = new URLSearchParams(url.search).get('time_range')
const theme = new URLSearchParams(url.search).get('theme')
const captions = new URLSearchParams(url.search).get('captions')

const makeImage = async () => {
  const topMusicRes = await fetch(`/topmusic?type=${type}&time_range=${timeRange}`)
  const userTopMusic = await topMusicRes.json()

  const firstNameRes = await fetch('/name')
  const userFirstName = await firstNameRes.json()

  if ((!userTopMusic[9]) && (timeRange !== 'long')) {
    alert('There\'s no enough data in this time range to make the picture. Try selecting a longer time range (e.g. \'All time\').')
    return window.history.back()
  }
  else if ((!userTopMusic[9]) && (timeRange === 'long')) {
    alert('There\'s no enough data in this Spotify account to make the picture.')
    return window.location = '/'
  }

  showImages(type, userTopMusic)
  showText(type, timeRange, userFirstName, userTopMusic)
  showTheme(theme)

  if (captions === 'yes') {
    showCaption(type, userTopMusic)
  }
}

makeImage()