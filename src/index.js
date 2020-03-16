import './style.scss'

let accessToken = 'BQAbtYzwyStx0bf-xzIWUkV7qc_ydZw5wWxGXsCrEHbnL7ZXpGSGsXI2DdklBV-BZMESOK83Qk-j_CE1aymd3x30cDvYL0cdRatWRTMEh90q0315OUiePIRSA33RWjCzT-d9WlGPp8ljCkIE4Vmg2K9kQGndfUCYTDmtHM6puKjm4WLqxFhB_fE37_8DJiczfIYYceXAbDu_6qSLgrPc4wNqiRjiZghgjkWBv9SBc1rRL4Rsno5X36h24a3TB5HDPEGzJDI'

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

	let albums = [] //Objetos completos
	let albumNames = [] //Apenas os nomes

	for (let i = 0; i < tracks.length; i++) { //Coloca todos os albums em uma array,
		albums[i] = tracks[i].album
		albumNames[i] = tracks[i].album.name
	}

	let repeatedAlbums = countRepetedAlbums(albumNames)
	let sortedAlbums = sortByMostListened(repeatedAlbums)
	console.log(sortedAlbums)

	albums = removeDuplicates(albums)
	console.log(albums)
}

//TODO: Não transformar em objeto para depois voltar para array

//Conta, na array de albums, quantas vezes cada um aparece e coloca o valor em um objeto
const countRepetedAlbums = (arr) => {
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

const removeDuplicates = (arr) => {
	let uniqueList = new Set()
	uniqueList = arr.filter(item => {
		if (!uniqueList.has(item['id'])) {
			uniqueList.add(item['id'])
			return true
		}
	})

	return uniqueList
}

getUserTopAlbums('short')

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