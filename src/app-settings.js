import './style.scss'

const myForm = document.getElementById('my-form')
myForm.addEventListener('submit', async event => {
    event.preventDefault() //Desativa o comportamento padrão de redirecionamento

    //Coloca em constantes as opções selecionadas pelo usuário
    export const type = document.querySelector('input[name="type"]:checked').value
    export const timeRange = document.querySelector('input[name="time-range"]:checked').value
    export const theme = document.querySelector('input[name="theme"]:checked').value
})