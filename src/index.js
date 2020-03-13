import './style.scss'

let accessToken = 'BQAZJ944gZah780jHyUJHc4TxZShfDaZLS_9-CcaelQHXeBTEk2lSNu0E1mH2LX0LSsc4yM951mcP6Z-xJ2rztYt_e7BPMtAPkXKNtwPrM4K-EdNHQ49u_mHtNaJYPm91vpgsVnAgcNd6bUXne6os5AXNtjszNu8esdDOVvsQewMd0DvRfC2yUOzRKyryhcyIrXLV5zWsyEjSD85VimhUuW9CiWFKpVyvRIbDjSHuA2LTpimxF8E--mTWxaS-0nDWtuUovo'

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

	let tracks = data1.items.concat(data2.items); //Junta o resutado de dois fetchs em uma só array

	let albumNames = []
	for (let i = 0; i < tracks.length; i++) { //Coloca todos os albums em uma array, 
		albumNames[i] = tracks[i].album.name
	}

	let repeatedAlbums = getRepetedAlbums(albumNames)
	let sortedAlbums = sortByMostListened(repeatedAlbums)

	console.log(sortedAlbums)

	albumNames = [... new Set(albumNames)] //Elimina os albums repetidos da array após já ter feito a contagem destes
}

//TODO: Não transformar em objeto para depois voltar para array

//Conta, na array de albums, quantas vezes cada um aparece e coloca o valor em um objeto
const getRepetedAlbums = (arr) => {
	let countedObj = arr.reduce((acc, curr) => {
		acc[curr] = ++acc[curr] || 1
		return acc
	}, {})

	return countedObj
}

//Transforma de volta em uma array e organiza esta em ordem decrescente, comparando o número de ocorrência de cada album
const sortByMostListened = (obj) => {
	const compare = (a, b) => {
		return b[1] - a[1]
	}

	let objIntoArr = Object.entries(obj)
	let sortedArr = objIntoArr.sort(compare)

	return sortedArr
}

getUserTopAlbums('medium')

//Mostra as imagens dos artistas ou músicas
const showImages = async (type, timeRange) => {
	const data = await getUserTop(type, timeRange)

	if (type === 'artists') {
		for (let i = 0; i < data.length; i++) {
			document.getElementById(`img-${i}`).src = await data[i].images[0].url
		}
	}
	else if (type === 'tracks') {
		for (let i = 0; i < data.length; i++) {
			document.getElementById(`img-${i}`).src = await data[i].album.images[0].url
		}
	}
}

showImages('tracks', 'short')