const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`);
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// setting the spotify-api goes here:
const clientId = 'c5a00d99bb284c45a3251dbc90189608';
const clientSecret = '4a19b03fee0c4cab9d399a1ec47db08a';
const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then((data) => {
    spotifyApi.setAccessToken(data.body.access_token);
  })
  .catch((error) => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
app.get('/', (req, res, next) => {
  res.render('search');
});

app.get('/artists', (req, res, next) => {
  const artist = req.query.search;
  spotifyApi.searchArtists(artist)
    .then((data) => {
      res.render('artists', { artist: data.body.artists.items });
    })
    .catch((err) => {
      console.log('The error while searching artists occurred: ', err);
    });
});

app.get('/albums', (req, res, next) => {
  const { artistID } = req.query;
  spotifyApi.getArtistAlbums(artistID)
    .then((data) => {
      res.render('albums', { albums: data.body.items });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/soundtracks', (req, res, next) => {
  const { albumsID } = req.query;
  spotifyApi.getAlbumTracks(albumsID)
    .then((data) => {
      res.render('tracks', { soundtracks: data.body.items });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
