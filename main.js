window.onload = mainSetup;
const globalValues = {
  prevSection: "",
  nextSection: null
}

function mainSetup() {
  //add the Grid-Area-Names to all divs inside the sections
  colToggleColormode();
  createCardSection("Ensembles");
  createCardSection("Medien");
  createKonzerte();
  createButtons(FooterButtons, "idDiv_footerCredits", 0.5)
  navClick();
  handleTabletChange(checkMediaQuery); // Initial check
}

function navClick(obj = null) {
  globalValues.nextSection = (obj != null) ? obj.dataset.type : "Ensembles"; // default  first Site
  // set "gridColumns-num" so the Grid stays centered
  // if (["Ensembles", "Medien"].includes(globalValues.nextSection)) {
  //   const Data = eval(globalValues.nextSection);
  //   setCssRoot(`gridColumns-num`, 4) // Data.length + 1);
  // } else {
  //   setCssRoot(`gridColumns-num`, 3); //default length
  // }

  if (globalValues.prevSection != globalValues.nextSection) {
    let selectedID = `idDiv_navBar_${globalValues.nextSection}`;
    //set the CSS-Active class to highlight the clicked Menu
    const clArr = dbCL("cl_navElements")
    for (const item of clArr) {
      if (item.id === selectedID) {
        item.classList.add("navbarActive");
        dbID("idDiv_navBar_Menu").innerHTML = `&#9776;  ${item.textContent}`;
      } else {
        item.classList.remove("navbarActive");
      }
    }

    //hide all Grid-Items except the selected
    const mainGridItems = document.querySelectorAll("section")
    for (let i = 0; i < mainGridItems.length; i++) {
      const item = mainGridItems[i];
      prevID = `id_${globalValues.prevSection}`
      nextID = `id_${globalValues.nextSection}`
      const state = (nextID === item.id) ? true : false;
      item.style.display = state ? "flex" : "none";
      item.pointerEvents = state ? "auto" : "none";
    }
  }
  //always scroll to the top
  const scrollOptions = {
    top: 0,
    behavior: 'smooth'
  };
  document.body.scrollTo(scrollOptions); // For Safari
  document.documentElement.scrollTo(scrollOptions); // For Safari
  globalValues.prevSection = globalValues.nextSection;
  globalValues.nextSection = null;
  dbID("idNav_navElements").classList.remove("navbarDropActive")
}


function createKonzerte() {
  let parent = dbID(`id_KonzertListe`);
  parent.innerHTML = "";
  let lastYear = 0;
  let pastConcertTitle = false;
  const konzertListe = sortArrayByKey(Konzerte, "datum", true);
  for (let konzert of konzertListe) {
    //convert date to usable UTC and a formated String
    const d = new Date(Date.parse(konzert.datum.replace(/\./g, "/")));
    konzert.UTC = d;
    const convDate = convertDate(d, true)
    konzert.date = convDate;
    const year = d.getFullYear();


    if (konzert.UTC < new Date() && !pastConcertTitle) {
      pastConcertTitle = true;
      const spacer = document.createElement("h2");
      spacer.classList.add("cl_konzertFullRow", "cl_Line");
      parent.appendChild(spacer)
      const pastC = document.createElement("h2");
      pastC.textContent = ` `;
      pastC.classList.add("cl_konzertFullRow");
      parent.appendChild(pastC)
    }
    if (lastYear != year) {
      lastYear = year;
      const h2Year = document.createElement("h2");
      h2Year.textContent = `Spielzeit ${lastYear}`;
      h2Year.classList.add("cl_konzertFullRow");
      parent.appendChild(h2Year)
    }

    const date = document.createElement("p");
    date.textContent = konzert.date;
    parent.appendChild(date)
    const Startzeit = document.createElement("p");
    Startzeit.textContent = (konzert.Startzeit.length == 2) ? `${konzert.Startzeit} h` : konzert.Startzeit;
    parent.appendChild(Startzeit)
    const Titel = document.createElement("p");
    Titel.textContent = konzert.Titel;
    parent.appendChild(Titel)
    const Location = document.createElement("p");
    Location.textContent = konzert.Location;
    // Link zur Veranstaltung nur wenn bevorstehend, da alte Links ggf. verschwinden und man dann auf einer fehlerseite raus kommt, was echt uncool ist.
    if (d >= new Date() && konzert.link != undefined && konzert.link != "") {
      Location.classList.add("highlight");
      Location.onclick = () => {
        window.open(konzert.link);
      }
    }
    parent.appendChild(Location)
    const Stadt = document.createElement("p");
    Stadt.textContent = konzert.Stadt;
    parent.appendChild(Stadt)
  }
}

function createCardSection(type = null) {
  if (type === null) return
  const Data = eval(type);
  const parent = dbID(`id_Content_${type}`)
  parent.innerHTML = "";
  Data.forEach((data, index) => {
    createSingleCard(data, index, parent, type);
  });
}

function createSingleCard(data, index = 0, parent, type) {
  const cardContainer = document.createElement("div");
  cardContainer.classList.add("cl_card");

  //Title
  const title = document.createElement("h3");
  title.classList.add("cl_cardTitle");
  title.style.gridArea = "cardTitle";
  title.innerText = data.title;
  title.setAttribute("uiTextAlign", "left");
  cardContainer.appendChild(title);

  //Datum
  if (data.datum) {
    const date = document.createElement("p");
    date.classList.add("cl_cardDate");
    date.style.gridArea = "cardDate";
    date.textContent = data.datum;
    cardContainer.appendChild(date);
  }

  //Image
  if (data.picName) {
    const imageParent = document.createElement("div");
    imageParent.classList.add("cl_cardImageParent");
    imageParent.style.gridArea = "cardImageParent";
    const imageMain = document.createElement("img");
    imageMain.classList.add("cl_cardImage");
    imageMain.src = `Images/${type}/${data.picName}`;
    imageParent.appendChild(imageMain);
    cardContainer.appendChild(imageParent);
  }

  // Text
  if (data.description) {
    const text = document.createElement("div");
    text.classList.add("cl_cardText");
    text.style.gridArea = "cardText";
    text.textContent = data.description;
    text.setAttribute("uiTextAlign", "left");
    cardContainer.appendChild(text);
  }

  //Besetzung
  if (data.cast) {
    const cast = document.createElement("div");
    cast.classList.add("cl_cardCast");
    cast.style.gridArea = "cardCast";
    for (let c = 0; c < data.cast.length; c++) {
      const member = document.createElement("span");
      member.textContent = data.cast[c];
      member.style.fontStyle = "italic";
      member.setAttribute("uiTextAlign", "left");
      cast.appendChild(member);
    }
    cardContainer.appendChild(cast);
  }
  if (data.links && data.links.length > 0) {
    const links = document.createElement("div");
    links.classList.add("cl_cardLinks");
    links.style.gridArea = "cardLinks";
    cardContainer.appendChild(links);
    createButtons(data.links, links)
  }
  parent.appendChild(cardContainer)
}

function createButtons(btnsArr, parentID, size = null) {
  let parent = dbID(parentID);
  parent.innerHTML = "";
  btnsArr.forEach((arr, index) => {
    const type = arr.type;
    const link = arr.link;
    const linkBtn = document.createElement("img");
    if (size === null) {
      linkBtn.classList.add("cl_cardImageLink");
    } else {
      linkBtn.classList.add("cl_footerImageLink");
    }
    linkBtn.src = `Images/Icons/i_${type}.svg`
    linkBtn.onclick = () => {
      if (type === "order") {
        window.location.href = `mailto:VolkerHeuken@web.de?subject=${"CD Bestellung"}&body=${encodeURI(link)}`;
      } else {
        window.open(link)
      }
    }
    parent.appendChild(linkBtn);
  });
}


function sendWA() {
  let url = "https://wa.me/4915778220214?text="
  let name = dbID("idVin_Kontakt_Name").value.trim();
  let text = dbID("idArea_Kontakt_Nachricht").value.trim();
  while (name == "") {
    name = prompt("Bitte gib deinen Name ein.").trim();
    dbID("idVin_Kontakt_Name").value = name;
  }
  while (text == "") {
    text = prompt("Bitte gib einen Text ein.").trim();
    dbID("idArea_Kontakt_Nachricht").value = text;
  }
  if (name != "" && text != "") {
    const msgText = `${url}${name}:${text}`
    const msgTextEnc = encodeURI(msgText);
    window.open(msgTextEnc);
    dbID("idVin_Kontakt_Name").value = "";
    dbID("idArea_Kontakt_Nachricht").value = "";
  }
}

//------------ Helperfunctions --------------
function getCssRoot(object, number = false, toPX = false) { //  getCssRoot("navbarHeight", return only number=true)
  const obj = `--${object}`;
  let valToConvert = getComputedStyle(document.body).getPropertyValue(obj).replace(/s|px|rem/g, "");
  //toPX = false
  if (toPX == true && object != "fontSize") {
    const size = getComputedStyle(document.body).getPropertyValue("--fontSize").replace(/px/g, "");
    return Number(size * valToConvert);
  }
  //number = false
  if (number == true) {
    return Number(valToConvert);
  }
  return getComputedStyle(document.body).getPropertyValue(obj).trim();
};

function setCssRoot(object, value, dim = "") { //  setCssRoot("navbarHeight", 100, "px")
  document.styleSheets[0].cssRules[0].style.setProperty(`--${object}`, `${value}${dim}`);
};

function dbID(id) {
  if (id instanceof Object) return id
  return document.getElementById(id);
};

function dbCL(id) {
  return document.getElementsByClassName(id);
};

function dbIDStyle(id) {
  return dbID(id).style;
};

function dbCLStyle(id) {
  return dbCL(id).style;
};

function convertDate(d, fourDigitYear = false) {
  const date = d //new Date(Date.parse(d.replace(/\./g, "/")))
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = fourDigitYear ? date.getFullYear() : parseInt(date.getFullYear().toString().substr(2, 2), 10);
  return `${day}.${month}.${year}`;
}

function sortArrayByKey(arr, key, inverse = false) {
  let array = Array.from(arr);
  return array.sort(function(a, b) {
    if (typeof a[key] == "number" && typeof b[key] == "number") {
      if (inverse) {
        return (b[key] - a[key]);
      } else {
        return (a[key] - b[key]);
      }
    } else {
      const x = a[key];
      const y = b[key];
      if (inverse) {
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
      } else {
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      };
    };
  });
};

// Colors for the niceness of the page
const colScheme = {
  lightmode: {
    txtMain: [0, 100, 0], // Akzentfarbe light:'#c2bebc'
    bgcBackground: [0, 0, 99], //light:'#e6e6e6'
    txtBackground: [0, 100, 0]
  },
  darkmode: {
    txtMain: [0, 100, 100], // Akzentfarbe dark: '#c2bebc'
    bgcBackground: [60, 0, 10], // General Background dark: '#1a1a1a'
    txtBackground: [0, 100, 100]
  },
  darkmodeOn: false
}

colScheme.darkmodeOn = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addListener((e) => {
  colScheme.darkmodeOn = e.matches;
  colToggleColormode();
});

function colToggleColormode(btn = null) {
  if (btn != null) colScheme.darkmodeOn = !colScheme.darkmodeOn;
  let colBG, colTxt, mainTxt;
  if (colScheme.darkmodeOn) {
    const bg = colScheme.darkmode.bgcBackground;
    const txt = colScheme.darkmode.txtBackground;
    const mTxt = colScheme.darkmode.txtMain;
    colBG = `${bg[0]} ${bg[1]}% ${bg[2]}%`
    colTxt = `${txt[0]} ${txt[1]}% ${txt[2]}%`
    mainTxt = `${mTxt[0]} ${mTxt[1]}% ${mTxt[2]}%`
    if (dbID("idImg_footer_Spacer")) {
      dbID("idImg_footer_Spacer").src = "Images/Icons/opt-sun.svg";
      dbIDStyle("idImg_footer_Spacer").filter = "invert(100%)";
    }
  } else {
    const bg = colScheme.lightmode.bgcBackground;
    const txt = colScheme.lightmode.txtBackground;
    const mTxt = colScheme.lightmode.txtMain;
    colBG = `${bg[0]} ${bg[1]}% ${bg[2]}%`
    colTxt = `${txt[0]} ${txt[1]}% ${txt[2]}%`
    mainTxt = `${mTxt[0]} ${mTxt[1]}% ${mTxt[2]}%`
    if (dbID("idImg_footer_Spacer")) {
      dbID("idImg_footer_Spacer").src = "Images/Icons/opt-moon.svg";
      dbIDStyle("idImg_footer_Spacer").filter = "invert(0%)";
    }
  }
  setCssRoot(`bgcBackground`, colBG);
  setCssRoot(`txtBackground`, colTxt);
  setCssRoot(`txtMain`, mainTxt);
  setCssRoot(`filter`, colScheme.darkmodeOn ? 1 : 0);
}

//----- Toggle Navbar Dropdown -----------s
function navbarDropdownClick() {
  dbID("idNav_navElements").classList.add("navbarDropActive")
}

const checkMediaQuery = window.matchMedia('(max-width: 800px)')

function handleTabletChange(e) {
  const w = (e.matches) ? 80 : 300;
  let s = dbCL("cl_spotifySmall")[0];
  s.style.width = `${w / 2}px`;
  let iframe = '<iframe id="spotify" src="https://open.spotify.com/embed/artist/7pv0ZlsoLsO02h38vM8wVq" width="' + w + '"px height="80" frameBorder="1" allowtransparency="false" allow="encrypted-media"></iframe>'
  s.innerHTML = iframe;
}
checkMediaQuery.addListener(handleTabletChange)
