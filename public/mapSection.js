//append form to webpage
export const appendForm = () => {
    let mainDiv = document.createElement("DIV");
    mainDiv.setAttribute("id", "map-div");

    let formDiv = document.createElement("DIV");
    formDiv.setAttribute("id", "form-div");

    let form = document.createElement("FORM");
    form.setAttribute("name", "search");
    form.setAttribute("id", "form");
    form.setAttribute("onsubmit", "return false");

    let input1 = document.createElement("INPUT");
    input1.setAttribute("type", "text");
    input1.setAttribute("id", "input-text");
    input1.setAttribute("placeholder", "Your location");

    let input2 = document.createElement("INPUT");
    input2.setAttribute("type", "submit");
    input2.setAttribute("value", "submit");
    input2.setAttribute("id", "submit-btn");

    //append inputs to form, append form to div
    form.appendChild(input1);
    form.appendChild(input2);

    formDiv.appendChild(form);
    mainDiv.appendChild(formDiv);

    //append div to body
    document.body.appendChild(mainDiv);

    //add event listener on click
    document.getElementById("form").addEventListener("submit", btnErrorHandle);
}

//append map to webpage
export const appendMap = async (origin) => {
  let insertedContent = document.getElementById("iframe-div");

  if (insertedContent)
  {
    insertedContent.parentNode.removeChild(insertedContent);
  }

  let error = btnErrorHandle();

  //if there is an error, do not continue appending map
  if (error == 0)
  {
    return;
  }

  let iframeDiv = document.createElement("DIV");
  iframeDiv.setAttribute("id", "iframe-div");

  let src = await buildSRC(origin);

  let iframe = document.createElement("IFRAME");
  iframe.setAttribute("src", src);
  iframe.setAttribute("id", "map-if");
  iframe.setAttribute("height", "500");
  iframe.setAttribute("width", "700");
  iframe.setAttribute("frameborder", "0");

  iframeDiv.appendChild(iframe);

  document.getElementById("map-div").appendChild(iframeDiv);
}

//check if artist selected when form is submitted
export const btnErrorHandle = () => {
  let count = 0;

  //checks if artist is selected
  for (let i = 0; i < 5; i++)
  {
    if (document.getElementById(`btn${i+1}`).style.borderColor == "red")
    {
      count++;
    }
  }

  let insertedContent;

  //removes artist error paragraph if already exists
  insertedContent = document.getElementById("art-err");

  if (insertedContent)
  {
    insertedContent.parentNode.removeChild(insertedContent);
  }

  //removes location error paragraph if already exists
  insertedContent = document.getElementById("loc-err");

  if (insertedContent)
  {
    insertedContent.parentNode.removeChild(insertedContent);
  }

  //artist selected
  if (count >= 1)
  {
    let input = document.getElementById("input-text").value;

    //no input
    if (!input)
    {
      let p = "<p id='loc-err' class='new-p'>Error! Please enter a location.</p>"
      document.getElementById("submit-btn").insertAdjacentHTML("afterend", p);      
      
      document.getElementById("form-div").style.paddingBottom = "3px";

      return 0;
    }
  }
  //artist not selected
  else if (count == 0)
  {
    let p = "<p id='art-err' class='new-p'>Error! Please select an artist before submitting.</p>"
    document.getElementById("submit-btn").insertAdjacentHTML("afterend", p);

    document.getElementById("form-div").style.paddingBottom = "3px";

    return 0;
  }

  document.getElementById("form-div").style.paddingBottom = "53px"

  return 1;
}

//build iframe src
const buildSRC = async (origin) => {
  //fetch google api key from server
  const getKey = await fetch('/googleKey')
  .catch(err => {
  console.error("Error:", err);
  res.send("Error:" + err);
  });

  const data = await getKey.json();
  const key = data.google_key;  

  let destination = origin;
  let input = document.getElementById("input-text").value;

  let src = "https://www.google.com/maps/embed/v1/directions";
  src += "?key=" + key;

  let encodedOrigin = encodeLocation(input);
  src += "&origin=" + encodedOrigin;

  let encodedDestination = encodeLocation(destination);
  src += "&destination=" + encodedDestination;

  console.log(src);

  return src;
}

//encode the artist name
const encodeLocation = (location) => {
  let encodedLocation = "";

  //encode name
  for (let i = 0; i < location.length; i++)
  {
    if (location[i] == ' ')
    {
      encodedLocation = encodedLocation + '+';
    }
    else
    {
      encodedLocation = encodedLocation + location[i];
    }
  }

  return encodedLocation;
}