const fetch = require('node-fetch')
const serverData = require('./server')

let accessToken

const setAccessToken = () => {
  accessToken = serverData.access_token
}

/*******
 * Funções de fetch na API
 *******/

//Pega o dados sobre o usuário na API do Spotify
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

/*******
 * Funções que retornam dados específicos da API
 *******/

//Pega nos dados do usuário o primeiro nome
const getFirstName = async () => {
  const res = await getPersonalData()
  const data = await res.json()
  const displayName = data.display_name
  const [firstName] = displayName.split(' ')

  return firstName
}

//Pega os artistas, albuns ou músicas favoritas do usuário
const getUserTopMusic = async (type, timeRange) => {
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

    let tracks = data1.items.concat(data2.items) //Junta o resutado de dois fetchs de tracks em uma só array

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

/*******
 * Funções de organização de dados da API
 *******/

//Conta a ocorrência de cada objeto dentro da array retornada
const countOccurrence = (arr) => {
  let uniqueArray = []
  let hashTable = {}

  arr.forEach(item => {
    if (!hashTable[item.id]) {
      uniqueArray.push(hashTable[item.id] = { ...item, occurrence: 0 })
    }
    hashTable[item.id].occurrence++
  })

  return uniqueArray
}

//Organiza a array de objetos pela ocorrência (ordem decrescente)
const sortByMostListened = (arr) => {
  const compare = (a, b) => {
    return b.occurrence - a.occurrence
  }

  let sortedArr = arr.sort(compare)

  return sortedArr
}

exports.getFirstName = getFirstName
exports.getUserTopMusic = getUserTopMusic
exports.setAccessToken = setAccessToken