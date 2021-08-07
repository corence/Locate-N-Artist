const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

//spotify variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
var redirect_uri = "http://localhost:8888/callback";

var access_token = "";
var refresh_token = "";

//spotify urls
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";

//google maps key
const GOOGLE_KEY = process.env.GOOGLE_KEY;

//spotify scopes
const scopes = [
  "user-top-read"
];

//middleware
const app = express();
app.use(express.static("public"));

//login route
app.get('/login', (req, res) => {
  let url = AUTHORIZE;
  url += "?client_id=" + CLIENT_ID;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(redirect_uri);
  url += "&show_dialog=true";
  url += "&scope=" + scopes;

  //redirect formed url to spotify authorization page
  res.redirect(url);
});

//callback route
app.get('/callback', (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const body = "grant_type=authorization_code" + "&code=" + code + "&redirect_uri=" + encodeURI(redirect_uri);

  if (error) {
    console.error("Callback Error: ", error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  //get access token
  getAToken(res, body);
});

//topArtists route
app.get('/topArtists', async (req, res) => {
  let url = "https://api.spotify.com/v1/me/top/artists";

  url = url + "?limit=5";

  const result = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization' : 'Bearer ' + access_token
    }
  })
  //error
  .catch(error => {
    console.error("Error: ", error);
    res.send("Error: " + error);
  });

  //success
  if (result.status == 200)
  {
    const data = await result.json();

    res.json({
      status: 'success',
      result: data
    });
  }
  //refresh token
  else if (result.status == 401)
  {
    const body = "grant_type=refresh_token" + "&refresh_token=" + refresh_token + "&client_id=" + CLIENT_ID;

    //get new access token
    getAToken(res, body);
  }
});

//get access/refresh token
const getAToken = async (res, tokenBody) => {
  const tokenResult = await fetch(TOKEN, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/x-www-form-urlencoded',
      'Authorization' : 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
    },
    body: tokenBody
  })
  .catch(error => {
    console.error("Error getting Tokens: ", error);
    res.send("Error getting Tokens: " + error);
  });

  //await json
  const data = await tokenResult.json();

  //store access, refresh tokens
  if (data.access_token != undefined)
  {
    access_token = data.access_token;
  }

  if (data.refresh_token != undefined)
  {
    refresh_token = data.refresh_token;
  }

  //send user to main html page
  res.sendFile(path.join(__dirname + '/public/index.html'));
}

//googleKey route
app.get('/googleKey', (req, res) => {
  res.json( {google_key: GOOGLE_KEY} );
});

//listen on port 8888
app.listen(8888, () =>
  console.log("HTTP Server up. Now go to http://localhost:8888/login in your browser.")
);