import './style.scss'

let accessToken = 'BQCHElAopeFD2XZIcaKAREjMFX5IKO5ZCbU6FcBBUzor4S-lwswieiTtvQLTUfcGd3hyWgtQ9tIhdPT8W_ve99U7sKljOsppg4jdmC-D4mtshhqIoGrni3z-L7FhEW4IWqcdYi4QAqd0Zr8mVWt0lhjD9o0QWtD7ub9zpjzPm3mnv5dWiZw5eaQPI8lyTIUSoCteD51TvJfozEW8-A3p2Il2CWntqhrzEDc9tNCUucCoDKGAJaSkaS9P4KStf_ovpw6KI4s'

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
// (com duas requisições à API em favor da precisão dos dados, já que a API não apresenta um endpoint 
// próprio para pegar os dados de albuns favoritos)
const getUserTopAlbums = async (timeRange) => {
	let res1 = await getData('tracks', timeRange, 45, 0)
	let res2 = await getData('tracks', timeRange, 45, 45)

	let data1 = await res1.json()
	let data2 = await res2.json()

	let items = data1.items.concat(data2.items); //Junta o resutado de dois fetchs em uma só array

	let albums = []
	for (let i = 0; i < items.length; i++) {
		albums[i] = items[i].album.name
	}

	getRepetedAlbums(albums)
}

//Conta, na array de albums, quantas vezes cada um aparece
const getRepetedAlbums = (arr) => {
	let acc = arr.reduce((acc, val) => acc.set(val, 1 + (acc.get(val) || 0)), new Map());
	console.log(acc);
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