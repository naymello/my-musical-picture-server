import './functions.js'
import { getUserTopMusic, showImages, showText, setTheme, getFirstName } from './functions.js'
import './style.scss'

let firstName = ((async () => {
    firstName = await getFirstName();
})()).catch(console.error) //Await não pode ser usado no top-level
const type = 'tracks'
const timeRange = 'short'
const theme = 'colored'

getUserTopMusic(type, timeRange)
    .then(data => {
        showImages(type, data)
        showText(type, timeRange, firstName, data)
    }, err => console.log(err))

setTheme(theme)

