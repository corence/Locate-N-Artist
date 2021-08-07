//get user's top artist
export const getTopArtists = async () => {
    const result = await fetch('/topArtists')
    .catch(err => {
      console.error("Error:", err);
      res.send("Error:" + err);
    });

    const data = await result.json();
    console.log(data);

    return data;
}

//append new btn and img to new div
export const appendArtistInfo = (artName, imgUrl, index) => {
    //create new div element
    let div = document.createElement("DIV");
    div.setAttribute("id", `div${index}`);
    div.setAttribute("class", "artist-div");

    //create new button element
    let btn = document.createElement("BUTTON");
    btn.setAttribute("id", `btn${index}`);
    btn.setAttribute("class", "artist-btn");
    btn.innerHTML = artName;

    //create new img element
    let img = document.createElement("IMG");

    img.setAttribute("src", imgUrl);
    img.setAttribute("id", `img${index}`);
    img.setAttribute("class", "artist-img");
    img.setAttribute("alt", "Artist Image");

    //append btn and img to div
    div.appendChild(btn);
    div.appendChild(img);

    //append div to document
    document.body.appendChild(div);
}

//append 5 previously created div to new main div
export const appendMainDiv = () => {
    let div;

    //create mainDiv element
    let mainDiv = document.createElement("DIV");
    mainDiv.setAttribute("class", "main-div");

    for (let i = 0; i < 5; i++)
    {
        div = document.getElementById(`div${i+1}`);

        //append each child div to mainDiv
        mainDiv.appendChild(div);
    }
    //append mainDiv to body
    document.body.appendChild(mainDiv);
}

//update button borderColor upon click
export const updateButton = (el) => {
    for (let i = 0; i < 5; i++)
    {
        document.getElementById(`btn${i+1}`).style.borderColor = "black";
    }

    document.getElementById(el).style.borderColor = "red";
}