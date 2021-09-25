//Global variable to reuse again in many function.
const episodeList = document.getElementById("root2");
const allShowPopUp = document.getElementById("root");
const searchBar = document.getElementById("search-input");
const searchBar2 = document.getElementById("search-input2");
const currentEpisodes = document.getElementById("available");
const selectEpi = document.getElementById("selectEpisode");
const selectShow = document.getElementById("selectShow");
const input = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
let showEpisodes = [];
const newShows = getAllShows();
let mainUrl = "https://api.tvmaze.com/shows/82/episodes";
const randomCard = document.getElementById("random-card");
const popUpInfo = document.getElementById("popup-info");

function setup() {
  loadEpisode(mainUrl);
  displayShowList(newShows);
  randomFile(newShows);
}

//<----------------------------------------fetch data------------------------------------->
const loadEpisode = async (url) => {
  try {
    const res = await fetch(url);

    showEpisodes = await res.json();
    displayEpisodes(showEpisodes);
    displayEpisodeList(showEpisodes);
  } catch (err) {
    console.error(err);
  }
};

//<--------------------------------this function will Create card for each episode----------------------->
const displayEpisodes = (episodes) => {
  const htmlString = episodes
    .map((episode) => {
      return `
            <div class="each-episode-detail">
                <img src="${
                  episode.image !== null ? episode.image.medium : ""
                }" alt="Image of ${
        episode.name
      } scene on episode S${episode.season
        .toString()
        .padStart(2, 0)}E${episode.number.toString().padStart(2, 0)}"></img>
                <div class="menu">
                <div class="title-and-time">
                <h1>${episode.name}</br>
                S${episode.season.toString().padStart(2, 0)}E${episode.number
        .toString()
        .padStart(2, 0)}</h1>
        <h3>${episode.runtime} m</h3>
        <a href="${
          episode.url
        }" target="_blank"><i class="fa fa-play-circle" style="font-size:48px;color:red"></i></a>
        </div>
                <p>${episode.summary !== null ? episode.summary : ""}</p>
              </div>  
            </div>
        `;
    })
    .join("");
  episodeList.innerHTML = htmlString;
};

// <-----------------------------------Create option tag for select episode list--------------------->
const displayEpisodeList = (episodeList) => {
  const listOption = episodeList
    .map((episode) => {
      return `<option value="${episode.name}">${episode.season
        .toString()
        .padStart(2, 0)}E${episode.number.toString().padStart(2, 0)}-${
        episode.name
      }</option>`;
    })
    .join("");
  selectEpi.innerHTML = listOption;
};

// <-----------------------------------Create option tag for select new shows--------------------->
const displayShowList = (showsList) => {
  const showsOption = showsList.map((show) => {
    return `${show.name}<option value="${show.id}"><a href="#hiddenArea3">${show.name}</a></option>`;
  });
  showsOption.sort();

  selectShow.innerHTML = showsOption;
};

//<----------this function will display the episode that user choose from episode list-(option tag)------------->
function selectFilter() {
  const usersOptionValue = document.getElementById("selectEpisode");
  let selectedValue = usersOptionValue.value;
  const filterUserSelectedEpisode = showEpisodes.filter((episode) => {
    return episode.name.includes(selectedValue);
  });
  displayEpisodes(filterUserSelectedEpisode);
}

//<----------------------this function will display the show that user choose-------------->
function selectShowFunction() {
  const showOptionValue = document.getElementById("selectShow");
  let selectedValue = `https://api.tvmaze.com/shows/${showOptionValue.value}/episodes`;
  loadEpisode(selectedValue);
}

// <-----------This function will display the episode according to alphabet on search bar------->
searchBar2.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase().trim();

  const filteredEpisodes = showEpisodes.filter((episode) => {
    const summaryCheck = `${episode.summary !== null ? episode.summary : ""}`;
    return (
      episode.name.toLowerCase().includes(searchString) ||
      summaryCheck.toLowerCase().includes(searchString)
    );
  });
  displayEpisodes(filteredEpisodes);
  currentEpisodes.innerText = `Displaying ${filteredEpisodes.length}/${showEpisodes.length} episodes`;
  if (filteredEpisodes.length >= 1) {
    currentEpisodes.innerHTML = `<h1>Explore titles related to: '${searchString}'</h1>
     <h4>Found ${filteredEpisodes.length} matches from ${showEpisodes.length} episodes</h4>`;
  } else {
    currentEpisodes.innerHTML = ` <h1>Your search for '${searchString}' did not have any matches</h1>
 <ul>
   <li>Try different keywords</li>
   <li>Try using a film or TV programme title</li>
   <li>Try a genres such as comedy,horror or drama</li>
 </ul>`;
  }
});

//<--search all shows on search bar (will display only shows matching with title and genres)------>
searchBar.addEventListener("keyup", (e) => {
  allShowPopUp.innerHTML = "";
  const searchString = e.target.value.toLowerCase().trim();

  const filteredEpisodes = newShows.filter((show) => {
    return show.name.toLowerCase().includes(searchString);
  });
  console.log(filteredEpisodes);
  filteredEpisodes.forEach((show) => {
    const mainDiv = document.createElement("div");
    mainDiv.className = "show-hover-card";
    const secTag = document.createElement("section");
    secTag.className = "show-hover-item show-hover-card";
    const imgTag = document.createElement("img");
    imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
    imgTag.alt = `Image of cover poster of ${show.name}`;
    const btnDiv = document.createElement("div");
    btnDiv.className = "show-hover-content";
    const playBtn = document.createElement("button");
    const linkPage = document.createElement("a");
    linkPage.href = show.url;
    linkPage.target = "_blank";
    linkPage.innerText = "Play";
    playBtn.appendChild(linkPage);
    const addBtn = document.createElement("button");
    addBtn.innerText = "Add";
    const btnTag = document.createElement("button");
    const aTag = document.createElement("a");
    aTag.href = "#hiddenArea3";
    aTag.innerText = "info";
    btnTag.appendChild(aTag);
    btnTag.addEventListener("click", () => {
      url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
      loadEpisode(url);
    });
    btnDiv.append(playBtn, btnTag, addBtn);
    secTag.append(imgTag, btnDiv);
    mainDiv.appendChild(secTag);
    allShowPopUp.appendChild(mainDiv);
  });
});

const onclickResetPage = () => {
  allShowPopUp.innerHTML = "";
};

// <---search bar anime function--->
const expand = () => {
  searchBtn.classList.toggle("close");
  input.classList.toggle("square");
  currentEpisodes.innerText = "";
  displayEpisodes(showEpisodes);
};

searchBtn.addEventListener("click", expand);

//<----------------create random card ----------------->

const createRandomCard = (show) => {
  let htmlElement = ` <div> <img src="${
    show.image !== null ? show.image.original : ""
  }" width="80%" height="1000px" alt="Cover poster of ${
    show.name
  }" id="randomCard-img">
      <div id="randomCard-info">
      <h1 id="randomCard-title">${show.name}</h1>
      <p><span id="span">Language: ${show.language}</span></br>
      ${show.genres}</br>Rating: ${show.rating.average}</p>
      <div id="btn-flex">
      <button id="watch-now"><a href="${
        show.url
      }" target="_blank"><div class="play"></div>Watch Now</a></button>
         <div class="box">
	<a class="info-btn-popup" href="#popup1"><i class="fa fa-info-circle" style="font-size:24px"></i>More info</a>
</div>
     </div> </div></div>`;

  let popupInfo = `${show.summary !== null ? show.summary : ""}`;
  popUpInfo.innerHTML = popupInfo;
  randomCard.innerHTML = htmlElement;
};

const randomFile = (showFile) => {
  let chooseRandomShow = showFile[Math.floor(Math.random() * showFile.length)];
  createRandomCard(chooseRandomShow);
};

//<----------------------------------create category first slider------------------->

const categoryContainer = document.getElementById("my-img");

let allImg = newShows.filter((category) => {
  let network = `${category.rating.average}`;
  if (network >= 9) {
    return category;
  }
});

let findImg = allImg.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  categoryContainer.appendChild(mainDiv);
});

//<---------Code below this is Create Category for all show (carousel slider)-------------------->
//<------------------function to catagories shows according to the type-------------->
const findTypeOfShow = (type) => {
  return newShows.filter((show) => show.type.includes(type));
};

//<------function to catagories shows according to the genres------------>
const findGenres = (genres) => {
  return newShows.filter((show) => show.genres.includes(genres));
};

//<-----------------------------British films and Tv series------------------------------->
let findGB = newShows.filter((category) => {
  let network = `${
    category.network !== null ? category.network.country.code : ""
  }`;
  if (network === "GB") {
    return category;
  }
});

const gbContainer = document.getElementById("british");

findGB.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  gbContainer.appendChild(mainDiv);
});

//<-----------------------------------------animated series------------------------------->
let findAnime = findTypeOfShow("Animation");
const animeContainer = document.getElementById("animation-series");
findAnime.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  animeContainer.appendChild(mainDiv);
});

//<---------------------------------------Documentary------------------------>
let findDocumentary = findTypeOfShow("Documentary");
const documentaryContainer = document.getElementById("documentary-series");
findDocumentary.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  documentaryContainer.appendChild(mainDiv);
});

//<-----------------------------------------dramas---------------------------->
let findDramas = findGenres("Drama");
const dramaContainer = document.getElementById("drama");
findDramas.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  dramaContainer.appendChild(mainDiv);
});

//<------------------------------------------action----------------------------->
let findAction = findGenres("Action");
const actionContainer = document.getElementById("action");
findAction.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  actionContainer.appendChild(mainDiv);
});

//<----------------------------------------comedy--------------------------->
let findComedy = findGenres("Comedy");
const comedyContainer = document.getElementById("comedy");
findComedy.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  comedyContainer.appendChild(mainDiv);
});

//<-------------------------------------sci-fi------------------------------->
let findSciFi = findGenres("Science-Fiction");
const sciFiContainer = document.getElementById("sci-fi");
findSciFi.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  sciFiContainer.appendChild(mainDiv);
});

//<-------------------------------------romance--------------------------->
let findRomance = findGenres("Romance");
const romanceContainer = document.getElementById("romance");
findRomance.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  romanceContainer.appendChild(mainDiv);
});

//<-------------------------------------Crime--------------------------->
let findCrime = findGenres("Crime");
const crimeContainer = document.getElementById("crime");
findCrime.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  crimeContainer.appendChild(mainDiv);
});

//<-------------------------------------thriller--------------------------->
let findThriller = findGenres("Thriller");
const thrillerContainer = document.getElementById("thriller");
findThriller.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  thrillerContainer.appendChild(mainDiv);
});

//------------------------------reality show ------------------------>
let findReality = findTypeOfShow("Reality");
const realityContainer = document.getElementById("reality");
findReality.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  realityContainer.appendChild(mainDiv);
});

//------------------------------international show ------------------------>

let findInternational = newShows.filter((show) => {
  if (show.language !== "English") {
    return show;
  }
});
const internationalContainer = document.getElementById("international");
findInternational.forEach((show) => {
  const mainDiv = document.createElement("div");
  mainDiv.className = "show-hover-card2";
  const secTag = document.createElement("section");
  secTag.className = "show-hover-item show-hover-card2";
  const imgTag = document.createElement("img");
  imgTag.src = `${show.image !== null ? show.image.medium : ""}`;
  imgTag.alt = show.name;
  const btnDiv = document.createElement("div");
  btnDiv.className = "show-hover-content";
  const playBtn = document.createElement("button");
  const linkPage = document.createElement("a");
  linkPage.href = show.url;
  linkPage.target = "_blank";
  linkPage.innerText = "Play";
  playBtn.appendChild(linkPage);
  const addBtn = document.createElement("button");
  addBtn.innerText = "Add";
  const btnTag = document.createElement("button");
  const aTag = document.createElement("a");
  aTag.href = "#hiddenArea3";
  aTag.innerText = "info";
  btnTag.appendChild(aTag);
  btnTag.addEventListener("click", () => {
    url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
    loadEpisode(url);
  });
  btnDiv.append(playBtn, btnTag, addBtn);
  secTag.append(imgTag, btnDiv);
  mainDiv.appendChild(secTag);
  internationalContainer.appendChild(mainDiv);
});

let slider = tns({
  container: ".my-slider",
  items: 7,
  gutter: 20,
  slideBy: "page",
  autoplay: false,
  controlsPosition: "bottom",
  navPosition: "bottom",
  mouseDrag: true,
  autoplay: true,
  autoplayButtonOutput: false,
  controlsContainer: "#custom-control",
  responsive: {
    320: {
      items: 1,
      nav: false,
    },
    430: {
      items: 4,
      nav: false,
    },
    770: {
      items: 5,
      nav: true,
    },
    1440: {
      items: 7,
    },
  },
});

window.onload = setup;

//-------------------------------//
