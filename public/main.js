import { 
    getTopArtists,
    appendArtistInfo,
    appendMainDiv,
    updateButton
} from "./artistSection.js";

import { appendForm, appendMap } from "./mapSection.js";

import { getCorrectName, getBirthplace } from "./parseWiki.js";

document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete")
  {
    initApp();
  }
});

const initApp = () => {
  getTopArtists().then(data => {
    appendAll(data);
  });
}

const appendAll = (artistData) => {
  for (let i = 0; i < 5; i++)
  {
    appendArtistInfo(artistData.result.items[i].name, artistData.result.items[i].images[0].url, i+1);

    document.getElementById(`btn${i+1}`).addEventListener("click", function () { retrieveBirthplace(artistData.result.items[i].name); });
    document.getElementById(`btn${i+1}`).addEventListener("click", function () { updateButton(`btn${i+1}`); });
  }
  
  //append artist section of page to main div
  appendMainDiv();

  //append form to map section of page
  appendForm();
}

const retrieveBirthplace = (artistName) => {
  getCorrectName(artistName).then(artistName => {
    getBirthplace(artistName).then(birthplace => {
      //if button clicked, append map
      document.getElementById("submit-btn").onclick = function () {
        appendMap(birthplace);
      }
    });
  });
}