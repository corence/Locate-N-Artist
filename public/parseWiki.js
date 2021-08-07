//find the correct article name by exhausting all possibilites
export const getCorrectName = async (artistName) => {
  const encodedName = encodeName(artistName);

  let flag = 0;
  let url;

  //if artist name needs (musician) specification
  let wikiName = encodedName + "%20(musician)";

  while (flag >= 0)
  {
    //set url for fetch
    url = `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=${wikiName}&limit=1&namespace=0&format=json`;

    const result = await fetch(url)
    .catch(err => {
      console.error('Error: ', err);
    });

    const data = await result.json();

    if(((data[1][0]) == null) || ((data[1][0]) == undefined))
    {
      //if artist name needs (rapper) specification
      if (flag == 0)
      {
        wikiName = encodedName + "%20(rapper)";
      }
      //if artist name needs (singer) specification
      else if (flag == 1)
      {
        wikiName = encodedName + "%20(singer)";
      }
      //if the artist name needs (band) specification
      else if (flag == 2)
      {
        wikiName = encodedName + "%20(band)";
      }
      //if the artist name doesn't need any specification
      else if (flag == 3)
      {
        wikiName = encodedName;
      }
      //last case, if the artist doesn't match any of the previous criteria 
      else if (flag == 4)
      {
        flag = -2;
      }

      flag++;
    }
    else
    {
      // console.log(wikiName);
      return wikiName;
    }
  }

  if (flag == -1)
  {
    console.log("Error getting selected artist");
    return null;
  }
}

//get the birthplace/origin of the artist/band using the correct article name
export const getBirthplace = async (artistName) => {
  let url;
  let flag = 0;

  // artistName = "Elvis%20Presley";
  // artistName = "Bon%20Jovi";

  while (flag == 0)
  {
    url = `https://en.wikipedia.org/w/api.php?origin=*&action=parse&page=${artistName}&format=json`;

    const result = await fetch(url)
    .catch(err => {
      console.error('Error:', err);
    });
  
    const data = await result.json();
      
    //the spelling of the spotify musician name can differ from the Wikipedia spelling of the title of the article
    //therefore...
    //if external links are null (meaning page doesn't exist due to mispelling), set artist name equal to correct Wiki article name
    if (data.parse.externallinks.length == 0)
    {
      const length = data.parse.links.length;
  
      //correct article name (found in last position of links array)
      artistName = data.parse.links[length-1]["*"];
    }
    //page found
    else
    {
      console.log(data);

      let origin = parseWiki(data);

      return origin;
    }
  }
}

//encode the artist name
const encodeName = (artistName) => {
  let name = artistName;
  let encodedName = "";

  //encode name
  for (let i = 0; i < name.length; i++)
  {
    if (name[i] == ' ')
    {
      encodedName = encodedName + "%20";
    }
    else
    {
      encodedName = encodedName + name[i];
    }
  }

  return encodedName;
}

//find the actual location of the birthplace/origin of the artist/band in the web page by parsing it
const parseWiki = (data) => {
  let html = document.createElement("html");
  html.innerHTML = data.parse.text["*"];

  let parsedHTML = html.getElementsByTagName('td');
  let arrLen = parsedHTML.length;

  //iterate through array length of parsed 'td' html tag
  for(let i = 0; i < arrLen; i++)
  {
    //check if class name is 'infobox-data'
    if (parsedHTML[i].className != "infobox-data")
    {
      continue;
    }

    let strLen = parsedHTML[i].innerText.length;
    const numbers = /^\d+$/;
    let flag = 0;
    let type = 1;
    let origin = "";

    //iterate through the length innerText searching for key phrases 
    for(let j = 0; j < strLen; j++)
    {
      //if age phrase is found by end of innerText, artist is still living (check this first)
      if ((type == 1) && (parsedHTML[i].innerText[j] == 'a') && (parsedHTML[i].innerText[j+1] == 'g') && (parsedHTML[i].innerText[j+2] == 'e'))
      {
        //loop until closing bracket found, signifying hometown is next in string
        while(parsedHTML[i].innerText[j] != ')')
        {
          j++;
        }

        origin = findBirthplace(i, j, strLen, parsedHTML);
        return origin;
      }

      //if artist is no longer living, indicated by type == 0, check for 4 consecutive numbers (birthyear) to indicate where the birthplace is in the string
      if ((type == 0) && (parsedHTML[i].innerText[j].match(numbers)) && (parsedHTML[i].innerText[j+1].match(numbers)) && (parsedHTML[i].innerText[j+2].match(numbers)) && (parsedHTML[i].innerText[j+3].match(numbers)) && (parsedHTML[i].innerText[j-1] == ' ') && (j >= 1))
      {
        origin = findBirthplace(i, j, strLen, parsedHTML);
        return origin;
      }

      if (type == -1)
      {
        origin = findBirthplace(i, j, strLen, parsedHTML);
        return origin;
      }
      
      //if age is not found, set variables to 0 and loop back through checking for 4 consecutive numbers (birthyear)
      if (j+1 == strLen)
      {
        type--;

        j = -1;
      }
    }
  }
}

//get the birthplace by parsing the string
const findBirthplace = (i, j, strLen, parsedHTML) => {
  const letters = /[a-z]/i;
    let origin = "";

    //if characters aren't letters after key is found
    while (!parsedHTML[i].innerText[j].match(letters))
    {
      j++;
    }

    //build hometown variable from innerText
    while(j != strLen)
    {
      origin = origin + parsedHTML[i].innerText[j];
      j++;
    }

    console.log(origin);
    return origin;
}