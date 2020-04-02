import './functions.js'
import { getUserTopMusic, showImages, showText, setTheme, getFirstName } from './functions.js'
import './picture.scss'

let firstName = ((async () => {
  firstName = await getFirstName();
})()).catch(console.error) //Await não pode ser usado no top-level
const type = 'artists'
const timeRange = 'long'
const theme = 'dark'

getUserTopMusic(type, timeRange)
  .then(data => {
    showImages(type, data)
    showText(type, timeRange, firstName, data)
  }, err => console.log(err))

setTheme(theme)
