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
let showCastDetail = [];
const newShows = getAllShows();
let mainUrl = "https://api.tvmaze.com/shows/82/episodes";
let castUrl = "https://api.tvmaze.com/shows/82?embed=cast";
const randomCard = document.getElementById("random-card");
const popUpInfo = document.getElementById("popup-info");
const showDetailWithCast = document.getElementById("main-show-cast");

function setup() {
  loadEpisode(mainUrl);
  loadCastForEpisode(castUrl);
  displayShowList(newShows);
  randomFile(newShows);
 // whoCast(newShows);
}

//<----------------------------------------fetch data------------------------------------->
const loadEpisode = async (url) => {
  try {
    const res = await fetch(url);

    showEpisodes = await res.json();
    displayEpisodes(showEpisodes);
    displayEpisodeList(showEpisodes);
    totalSeason(showEpisodes);
  } catch (err) {
    console.error(err);
  }
};

//<--------------------------------fetch cast data------------------------------>

const loadCastForEpisode = async (url) => {
  try {
    const respond = await fetch(url);
    showCastDetail = await respond.json();
    whoCast(showCastDetail);
  } catch (error) {
    console.log(error);
  }
};

const whoCast = (show) => {
  let castNames = show._embedded.cast;

  let allCastName = castNames.map((character) => {
    return character.person.name;
  });

  let message = ``;
  if (show) {
    let name = show.name ? show.name : "";
    let image = show.image ? show.image : null;
    let imageMedium = image ? image.medium : "";
    let summary = show.summary ? show.summary : "";
    let language = show.language ? show.language : "";
    let genres = show.genres ? show.genres : "";
    let rating = show.rating ? show.rating : null;
    let ratingAverage = rating ? rating.average : "";

    message = `
    <h1>${name}</h1>
				<div class="cast-title">
					<img src="${imageMedium}"></img>
					<div class="menu">
						<p>${summary}</p>
					</div>
				</div>
			    <h2>Language: ${language}</h2>
			    <h3>Genres: ${genres.join(" |")}</h3>
			    <p>Rating: ${ratingAverage}</p>
          <p><b>Cast</b>: ${allCastName.join(" | ")}</p>
		`;
  }

  return (showDetailWithCast.innerHTML = message);
};
//<------------------this function will calculate total seasons ----------------------------------->
const seasons = document.getElementById("totalSeasons");

const totalSeason = (episodes) => {
  let allSeasons = episodes.map((episode) => {
    return episode.season;
  });

  let removesDuplicate = allSeasons.reduce(function (a, b) {
    if (a.indexOf(b) < 0) a.push(b);
    return a;
  }, []);

  const seasonList = removesDuplicate
    .map((seasonNumber) => {
      return `<option value="${seasonNumber}"> SEASON ${seasonNumber}</option>`;
    })
    .join();
  seasons.innerHTML = seasonList;
};
//<-------------------------function for display episode according season--------------------------->
function sortSeason() {
  let selectedSeason = seasons.value;
  const filterSelectedSeason = showEpisodes.filter((episode) => {
    return episode.season.toString().includes(selectedSeason);
  });
  displayEpisodes(filterSelectedSeason);
}

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
  let selectedCast = `https://api.tvmaze.com/shows/${showOptionValue.value}?embed=cast`;
  loadCastForEpisode(selectedCast);
//  let a = newShows.forEach((show)=>{
//     if(showOptionValue.value === show.id.toString()){
//      return whoCast(show);
//     }
//   })
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

//<-----------------------function to create card for each show------------------------------>
const createCardForEachShow = (categoriesShows) => {
  //Create empty container https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
  const containerFragment = new DocumentFragment();
  categoriesShows.forEach((show) => {
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
      cast = `https://api.tvmaze.com/shows/${show.id}?embed=cast`;
      loadCastForEpisode(cast);
      // whoCast(show);
      url = `https://api.tvmaze.com/shows/${show.id}/episodes`;
      loadEpisode(url);
    });
    btnDiv.append(playBtn, btnTag, addBtn);
    secTag.append(imgTag, btnDiv);
    mainDiv.appendChild(secTag);
    containerFragment.appendChild(mainDiv);
  });
  return containerFragment;
};

//<--search all shows on search bar (will display only shows matching with title and genres)------>
searchBar.addEventListener("keyup", (e) => {
  allShowPopUp.innerHTML = "";
  const searchString = e.target.value.toLowerCase().trim();

  const filteredEpisodes = newShows.filter((show) => {
    return show.name.toLowerCase().includes(searchString);
  });
  const allShowsCard = createCardForEachShow(filteredEpisodes);
  allShowPopUp.appendChild(allShowsCard);
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

//<---------Code below this is Create Category for all show (carousel slider)-------------------->
//<------------------function to catagories shows according to the type-------------->
const findTypeOfShow = (type) => {
  return newShows.filter((show) => show.type.includes(type));
};

//<------function to catagories shows according to the genres------------>
const findGenres = (genres) => {
  return newShows.filter((show) => show.genres.includes(genres));
};

// <------------------------Top rated series by rating-------------------------------->
const topRated = newShows.filter((category) => {
  const network = `${category.rating.average}`;
  if (network >= 9) {
    return category;
  }
});
const topRatedContainer = document.getElementById("top-rated");
const topCard = createCardForEachShow(topRated);
topRatedContainer.appendChild(topCard);
//<-----------------------------British films and Tv series------------------------------->
const findGB = newShows.filter((category) => {
  const network = `${
    category.network !== null ? category.network.country.code : ""
  }`;
  if (network === "GB") {
    return category;
  }
});

const gbContainer = document.getElementById("british");
const gbCard = createCardForEachShow(findGB);
gbContainer.appendChild(gbCard);

//<-----------------------------------------animated series------------------------------->
const findAnime = findTypeOfShow("Animation");
const animeContainer = document.getElementById("animation-series");
const animeCard = createCardForEachShow(findAnime);
animeContainer.appendChild(animeCard);

//<---------------------------------------Documentary------------------------>
let findDocumentary = findTypeOfShow("Documentary");
const documentaryContainer = document.getElementById("documentary-series");
const documentaryCard = createCardForEachShow(findDocumentary);
documentaryContainer.appendChild(documentaryCard);

//<-----------------------------------------dramas---------------------------->
let findDramas = findGenres("Drama");
const dramaContainer = document.getElementById("drama");
const dramaCard = createCardForEachShow(findDramas);
dramaContainer.appendChild(dramaCard);

//<------------------------------------------action----------------------------->
let findAction = findGenres("Action");
const actionContainer = document.getElementById("action");
const actionCard = createCardForEachShow(findAction);
actionContainer.appendChild(actionCard);

//<----------------------------------------comedy--------------------------->
let findComedy = findGenres("Comedy");
const comedyContainer = document.getElementById("comedy");
const comedyCard = createCardForEachShow(findComedy);
comedyContainer.appendChild(comedyCard);

//<-------------------------------------sci-fi------------------------------->
let findSciFi = findGenres("Science-Fiction");
const sciFiContainer = document.getElementById("sci-fi");
const sciCard = createCardForEachShow(findSciFi);
sciFiContainer.appendChild(sciCard);

//<-------------------------------------romance--------------------------->
let findRomance = findGenres("Romance");
const romanceContainer = document.getElementById("romance");
const romCard = createCardForEachShow(findRomance);
romanceContainer.appendChild(romCard);

//<-------------------------------------Crime--------------------------->
let findCrime = findGenres("Crime");
const crimeContainer = document.getElementById("crime");
const crimeCard = createCardForEachShow(findCrime);
crimeContainer.appendChild(crimeCard);

//<-------------------------------------thriller--------------------------->
let findThriller = findGenres("Thriller");
const thrillerContainer = document.getElementById("thriller");
const thrillCard = createCardForEachShow(findThriller);
thrillerContainer.appendChild(thrillCard);

//------------------------------reality show ------------------------>
let findReality = findTypeOfShow("Reality");
const realityContainer = document.getElementById("reality");
const realityCard = createCardForEachShow(findReality);
realityContainer.appendChild(realityCard);

//------------------------------international show ------------------------>

let findInternational = newShows.filter((show) => {
  if (show.language !== "English") {
    return show;
  }
});
const internationalContainer = document.getElementById("international");
const intCard = createCardForEachShow(findInternational);
internationalContainer.appendChild(intCard);
//<----------------------------------------end of code for slider-------------------->

window.onload = setup;

//-------------------------------//
