import './style.scss'

let url = window.location
let accessToken = new URLSearchParams(url.search).get('access_token')

//Pega dados na API do Spotify
const getData = async (type, timeRange, limit, offset) => {
	return fetch(`https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}_term&limit=${limit}&offset=${offset}`, {
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json"
		}
	})
}

//Pega os artistas ou músicas favoritas do usuário
const getUserTop = async (type, timeRange) => {
	let res = await getData(type, timeRange, 13, 0)
	let data = await res.json()
	return data.items
}

//Pega os albums favoritos do usuário
//(com duas requisições à API no endpoint de "top tracks", já que a API não apresenta um endpoint 
//próprio para pegar os dados de albuns favoritos)
const getUserTopAlbums = async (timeRange) => {
	let res1 = await getData('tracks', timeRange, 45, 0)
	let res2 = await getData('tracks', timeRange, 45, 45)

	let data1 = await res1.json()
	let data2 = await res2.json()

	let tracks = data1.items.concat(data2.items); //Junta o resutado de dois fetchs de tracks em uma só array

	let albums = []

	for (let i in tracks) { //Coloca todos os albums das tracks em uma array
		albums[i] = tracks[i].album
	}

	let countedAlbums = countOccurrence(albums)
	let sortedAlbums = sortByMostListened(countedAlbums)

	return sortedAlbums.slice(0, 13) //Retorna apenas os 13 albums mais ouvidos, que serão mostrados na tela
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

//Mostra as imagens dos artistas ou músicas
const showImages = async (type, timeRange) => {
	const data = await getUserTop(type, timeRange)

	if (type === 'artists') {
		data.forEach(async (curr, i) => {
			document.getElementById(`img-${i}`).src = await curr.images[0].url
		})
	}
	else if (type === 'tracks') {
		data.forEach(async (curr, i) => {
			document.getElementById(`img-${i}`).src = await curr.album.images[0].url
		})
	}
}

const showAlbumImages = async (timeRange) => {
	const data = await getUserTopAlbums(timeRange)

	data.forEach(async (curr, i) => {
		document.getElementById(`img-${i}`).src = await curr.images[0].url
	})
}

showAlbumImages('long')