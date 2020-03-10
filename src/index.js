import './style.scss'

let accessToken = 'BQDvMhn50-urFD5ckdPTsFs9z2kx0y6rKePGr5qSLVUzSLk35729KEQq9DsRElMLAwV-uT4ku1mhsuOwVjoGCLOx4cOvLtVE3xWhhlgK-aVPjwNGBZgwEewBtDqzlkwylR_0_kct7rVxO7fQdNvODGfBExGq8Nd-xw4o8Xcz1etnxnDxRawuF-wlfK6XAxxRqbjcA5HLNHdYNHTdNBI3W710F99oTu1f8I4dpy9hvNguc9sNc_IwOAGGelzB_weLXbl2HCE'

//Pega os artistas preferidos do usuário
const getUserTopArtists = async (timeRange) => {
	const res = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}_term&limit=13&offset=0`, {
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json"
		}
	})
	const data = await res.json()
	return data.items
}

//console.log(getUserTopArtists('short').then(data => console.log(data[0].name)))

//Mostra as imagens
const getImages = async () => {
	const artists = await getUserTopArtists('short')
	const imageURLs = await artists[0].images[0].url
	console.log(imageURLs)
}

getImages()