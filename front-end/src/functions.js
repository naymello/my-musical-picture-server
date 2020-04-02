let url = window.location
let accessToken = new URLSearchParams(url.search).get('access_token')

//Pega o primeiro nome do usuário na API do Spotify
const getPersonalData = () => {
  return fetch('https://api.spotify.com/v1/me', {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
}

//Pega dados referentes a top-lists na API do Spotify
const getTopLists = (type, timeRange, limit, offset) => {
  return fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}_term&limit=${limit}&offset=${offset}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  })
}

//Pega os artistas, albuns ou músicas favoritas do usuário
export const getUserTopMusic = async (type, timeRange) => {
  if (type !== 'albums') {
    let res = await getTopLists(type, timeRange, 10, 0)
    let data = await res.json()
    return data.items
  }
  else {
    //Pega albuns com duas requisições à API no endpoint de "top tracks", já que a API não apresenta um endpoint 
    //próprio para pegar os dados de albuns favoritos
    let res1 = await getTopLists('tracks', timeRange, 45, 0)
    let res2 = await getTopLists('tracks', timeRange, 45, 45)

    let data1 = await res1.json()
    let data2 = await res2.json()

    let tracks = data1.items.concat(data2.items); //Junta o resutado de dois fetchs de tracks em uma só array

    let albums = []

    for (let i in tracks) { //Coloca todos os albuns das tracks em uma array
      albums[i] = tracks[i].album
    }

    let countedAlbums = countOccurrence(albums)
    let sortedAlbums = sortByMostListened(countedAlbums)
    let topAlbums = sortedAlbums.slice(0, 10)

    return topAlbums
  }
}

//Transforma de volta em uma array e organiza esta em ordem decrescente, comparando o número de ocorrência de cada album
const sortByMostListened = (arr) => {
  //Regra que de organização que será usada no .sort()
  const compare = (a, b) => {
    return b.occurrence - a.occurrence
  }

  let sortedArr = arr.sort(compare)

  return sortedArr
}

//Remove objetos duplicados dentro das arrays retornadas da API do Spotify
const countOccurrence = (arr) => {
  let uniqueArray = []
  let hashTable = {}

  arr.forEach(item => {
    if (!hashTable[item.id]) {
      uniqueArray.push(hashTable[item.id] = { ...item, occurrence: 0 })
    }
    hashTable[item.id].occurrence++
  });

  return uniqueArray;
}

//----------------------

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

  //Diminui o tamanho do título caso o nome seja grande
  if (firstName.length >= 9) {
    document.getElementsByTagName('header')[0].style.fontSize = '18px';
  }

  const domName = document.getElementById('name')
  const typeTitle = document.getElementById('type-title')

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
    document.getElementById('line-1').innerHTML = await firstResult.name.substring(0, 40).match(/^.*?(?= -)/) ?
      firstResult.name.substring(0, 40).match(/^.*?(?= -)/) :
      firstResult.name.substring(0, 40)
    document.getElementById('line-2').innerHTML = await firstResult.album.name
    document.getElementById('line-3').innerHTML = await firstResult.artists[0].name
  }
  else if (type === 'albums') {
    document.getElementById('line-1').innerHTML = await firstResult.name
    document.getElementById('line-2').innerHTML = await firstResult.artists[0].name
    document.getElementById('line-3').innerHTML = await firstResult.release_date.match(/^.*?(?=-)/) //RegEx para pegar apenas o ano
  }
  else if (type === 'artists') {
    document.getElementById('line-1').innerHTML = await firstResult.name
    document.getElementById('line-2').innerHTML = await firstResult.genres[0]
    document.getElementById('line-3').innerHTML = await firstResult.genres[1]
  }

  //Outros...
  document.getElementById('others').innerHTML = `Other ${type}`
}

export const setTheme = (theme) => {
  //O tema claro (light) já é o padrão dentro do styles.scss, então não são necessárias mudanças
  if (theme !== 'light') {
    let textColor = ''
    let textBgColor = ''
    let bodyBgColor = ''

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

    document.body.style.backgroundColor = bodyBgColor

    const spanElements = document.getElementsByTagName('span')
    const bgColoredElements = document.getElementsByClassName('bg-colored-text')

    for (let spanElement of spanElements) {
      spanElement.style.color = textColor
    }

    for (let bgColoredElement of bgColoredElements) {
      bgColoredElement.style.backgroundColor = textBgColor
    }

    document.getElementById('bg-colored-logo').style.backgroundColor = textBgColor
  }
}

export const getFirstName = async () => {
  const res = await getPersonalData()
  const data = await res.json()
  const displayName = data.display_name
  const [firstName] = displayName.split(' ')

  return firstName
}