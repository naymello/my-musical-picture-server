import './landing.scss'

const navButton = document.querySelector('.hamburger')
const [nav] = document.getElementsByTagName('nav')
const [ul] = document.getElementsByTagName('ul')
const [body] = document.getElementsByTagName('body')

navButton.addEventListener('click', () => {
  navButton.classList.toggle('active')
  nav.classList.toggle('active')
  ul.classList.toggle('active')
  body.classList.toggle('no-scroll')
})