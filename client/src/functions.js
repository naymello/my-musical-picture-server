//Mostra as imagens dos artistas, albuns ou músicas
export const showImages = async (type, data) => {
  if (type === 'tracks') {
    data.forEach(async (curr, i) => {
      document.getElementById(`img-${i}`).src = await curr.album.images[1].url
    })
  }
  else if (type === 'albums') {
    data.forEach(async (curr, i) => {
      document.getElementById(`img-${i}`).src = await curr.images[1].url
    })
  }
  else if (type === 'artists') {
    data.forEach(async (curr, i) => {
      document.getElementById(`img-${i}`).src = await curr.images[1].url
    })
  }
}

export const showText = async (type, timeRange, firstName, data) => {
  const domName = document.getElementById('name')
  const typeTitle = document.getElementById('type-title')
  const line1 = document.getElementById('line-1')
  const line2 = document.getElementById('line-2')
  const line3 = document.getElementById('line-3')
  const othersText = document.getElementById('others')

  //Diminui o tamanho do título caso o nome seja grande
  if (firstName.length >= 9) {
    document.getElementsByTagName('header')[0].style.fontSize = '18px'
  }

  domName.innerHTML = `${firstName}'s `

  if (timeRange === 'short') {
    typeTitle.innerHTML = `${type.slice(0, -1)} of the month`
  }
  else if (timeRange === 'medium') {
    typeTitle.innerHTML = `${type.slice(0, -1)} of the semester`
  }
  else if (timeRange === 'long') {
    typeTitle.innerHTML = `favorite ${type.slice(0, -1)}`
  }

  //Linhas adicionais

  let firstResult = data[0]

  if (type === 'tracks') {
    //O limite para ser mostrado na imagem é de 40 caracteres. A regEx tem a função de tirar tudo que não faz parte do título da música 
    //exemplo: - Remastered 2020).
    line1.innerHTML = await firstResult.name.substring(0, 40).match(/^.*?(?= -)/) || firstResult.name.substring(0, 40)
    line2.innerHTML = await firstResult.album.name
    line3.innerHTML = await firstResult.artists[0].name
  }
  else if (type === 'albums') {
    line1.innerHTML = await firstResult.name
    line2.innerHTML = await firstResult.artists[0].name
    line3.innerHTML = await firstResult.release_date.match(/^.*?(?=-)/) //RegEx para pegar apenas o ano
  }
  else if (type === 'artists') {
    line1.innerHTML = await firstResult.name
    line2.innerHTML = await firstResult.genres[0]
    line3.innerHTML = await firstResult.genres[1]
  }

  //Outros...
  othersText.innerHTML = `Other ${type}`
}

export const showCaption = async (type, data) => {
  const musicNames = document.getElementsByClassName('music-name')
  data.shift() //O primeiro item não tem legenda opcional

  for (let musicName of musicNames) {
    musicName.style.opacity = 1
  }

  if (type === 'tracks') {
    for (let i = 0; i < musicNames.length; i++) {
      musicNames[i].innerHTML = data[i].name.substring(0, 25).match(/^.*?(?= -)/) || data[i].name.substring(0, 25)
    }
  }
  else if (type === 'albums') {
    for (let i = 0; i < musicNames.length; i++) {
      musicNames[i].innerHTML = data[i].name.substring(0, 25)
    }
  }
  else if (type === 'artists') {
    for (let i = 0; i < musicNames.length; i++) {
      musicNames[i].innerHTML = data[i].name.substring(0, 25)
    }
  }
}

export const showTheme = (theme) => {
  //O tema claro (light) já é o padrão dentro do styles.scss, então não são necessárias mudanças
  if (theme !== 'light') {
    let textColor, textBgColor, bodyBgColor

    if (theme === 'dark') {
      textColor = '#FFFFFF'
      textBgColor = '#DC1F1F'
      bodyBgColor = '#000000'
    }
    else if (theme === 'colored') {
      textColor = '#F9FF3E'
      textBgColor = '#FF10A0'
      bodyBgColor = '#2929B1'
    }

    document.querySelector('.picture').style.backgroundColor = bodyBgColor

    const spanElements = document.getElementsByTagName('span')
    const bgColoredElements = document.getElementsByClassName('bg-colored-text')
    const musicNames = document.getElementsByClassName('music-name')

    for (let spanElement of spanElements) {
      spanElement.style.color = textColor
    }

    for (let bgColoredElement of bgColoredElements) {
      bgColoredElement.style.backgroundColor = textBgColor
    }

    for (let musicName of musicNames) {
      musicName.style.backgroundColor = textBgColor
      musicName.style.color = textColor
    }

    document.getElementById('bg-colored-logo').style.backgroundColor = textBgColor
  }
}