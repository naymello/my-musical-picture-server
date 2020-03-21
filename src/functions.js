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

//Pega os artistas, albuns ou músicas favoritas do usuário
export const getUserTopMusic = async (type, timeRange) => {
	if (!(type === 'albums')) {
		let res = await getData(type, timeRange, 10, 0)
		let data = await res.json()
		return data.items
	}
	else {
		//Pega albuns com duas requisições à API no endpoint de "top tracks", já que a API não apresenta um endpoint 
		//próprio para pegar os dados de albuns favoritos
		let res1 = await getData('tracks', timeRange, 45, 0)
		let res2 = await getData('tracks', timeRange, 45, 45)

		let data1 = await res1.json()
		let data2 = await res2.json()

		let tracks = data1.items.concat(data2.items); //Junta o resutado de dois fetchs de tracks em uma só array

		let albums = []

		for (let i in tracks) { //Coloca todos os albuns das tracks em uma array
			albums[i] = tracks[i].album
		}

		let countedAlbums = countOccurrence(albums)
		let sortedAlbums = sortByMostListened(countedAlbums)

		return sortedAlbums.slice(0, 10) //Retorna apenas os 10 albuns mais ouvidos, que serão mostrados na tela
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

//Mostra as imagens dos artistas, albuns ou músicas
export const showImages = async (type, data) => {
	if (type === 'tracks') {
		data.forEach(async (curr, i) => {
			document.getElementById(`img-${i}`).src = await curr.album.images[0].url
		})
	}
	else if (type === 'albums') {
		data.forEach(async (curr, i) => {
			document.getElementById(`img-${i}`).src = await curr.images[0].url
		})
	}
	else if (type === 'artists') {
		data.forEach(async (curr, i) => {
			document.getElementById(`img-${i}`).src = await curr.images[0].url
		})
	}
}

export const showText = async (type, timeRange, firstName, data) => {
	//Título
	document.getElementById('name').innerHTML = `${firstName}'s `

	if (timeRange === 'short') {
		document.getElementById('type-title').innerHTML = `${type.slice(0, -1)} of the month`
	}
	else if (timeRange === 'medium') {
		document.getElementById('type-title').innerHTML = `${type.slice(0, -1)} of the semester`
	}
	else if (timeRange === 'long') {
		document.getElementById('type-title').innerHTML = `favorite ${type.slice(0, -1)}`
	}

	//Linhas adicionais

	let firstResult = data[0]

	if (type === 'tracks') {
		document.getElementById('line-1').innerHTML = await (firstResult.name).match(/^.*?(?= -)/)
		//RegEx para tirar tudo depois do '-', já que as informações como '- Remastered 2020' mais poluem do que são úteis
		document.getElementById('line-2').innerHTML = await firstResult.album.name
		document.getElementById('line-3').innerHTML = await firstResult.artists[0].name
	}
	else if (type === 'albums') {
		document.getElementById('line-1').innerHTML = await firstResult.name
		document.getElementById('line-2').innerHTML = await firstResult.artists[0].name
		document.getElementById('line-3').innerHTML = await (firstResult.release_date).match(/^.*?(?=-)/) //Regex para pegar apenas o ano
	}
	else if (type === 'artists') {
		document.getElementById('line-1').innerHTML = await firstResult.name
		document.getElementById('line-2').innerHTML = await firstResult.genres[0]
		document.getElementById('line-3').innerHTML = await firstResult.genres[1]
	}

	//Outros...
	document.getElementById('others').innerHTML = `Other ${type}`
}