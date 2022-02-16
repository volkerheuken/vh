window.onload = mainSetup;
const globalValues = {
  prevSection: "",
  nextSection: null,
  get defaultStart() {
    const text = (!["local", "127.0.0.1"].some(s => window.location.hostname.includes(s))) ? "Home" : "Ensembles";
    return dbID(`idDiv_navBar_${text}`);
  },
  navClick(site) {
    navClick(dbID(`idDiv_navBar_${site}`));
  }
}

function mainSetup() {
  //add the Grid-Area-Names to all divs inside the sections
  colToggleColormode();
  createContactData();
  createNews();
  createKonzerte();
  createEnsembles();
  createDisko();
  createButtons(FooterButtons, "idDiv_footerCredits", 0.5)
  navClick(globalValues.defaultStart);
  handleTabletChange(checkMediaQuery); // Initial check
}

function createContactData() {
  for (const [key, value] of Object.entries(Contact)) {
    const html = document.querySelectorAll(`[data-${key}]`)
    for (const inst of html) {
      if (key.includes("Ref")) {
        inst.href = value;
      } else {
        inst.textContent = value;
      }
    }
  }
}

function navClick(obj = null) {
  if (obj == null) return
  globalValues.nextSection = obj.dataset.type;
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
    let selected;
    for (let item of mainGridItems) {
      prevID = `id_${globalValues.prevSection}`
      nextID = `id_${globalValues.nextSection}`
      item.setAttribute("hidden", true);
      if (nextID === item.id) {
        selected = item;
      }
    }
    selected.removeAttribute("hidden");
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

function createNews() {
  const parent = dbID("id_NewsListe");
  parent.innerHTML = "";
  for (let news of News) {
    const newsContainer = document.createElement("div");
    parent.appendChild(newsContainer)
    const spacer = document.createElement("h2");
    spacer.classList.add("cl_gridLine");
    newsContainer.appendChild(spacer)

    const text = document.createElement("p");
    text.textContent = news.text;
    text.classList.add("cl_newsGrid_text");
    if (news.hasOwnProperty("link") && news.link != "") {
      text.classList.add("cl_newsGrid_link");
      text.onclick = () => {
        const type = Object.keys(news.link)[0];
        if (type === "local") globalValues.navClick(news.link.local)
        if (type === "url") window.open(news.link.url)
      }
    }
    newsContainer.appendChild(text)
  }
}

function createKonzerte() {
  function checkUTC(UTC) {
    if (oldOnTop) {
      return UTC >= new Date()
    }
    return UTC < new Date()
  }
  const oldOnTop = true;
  let parent = dbID(`id_KonzertListe`);
  parent.innerHTML = "";
  let lastYear = 0;
  let pastConcertTitle = false;
  const konzertListe = sortArrayByKey(Konzerte, "datum", !oldOnTop);
  for (const [index, konzert] of konzertListe.entries()) {
    //convert date to usable UTC and a formated String
    const d = new Date(Date.parse(konzert.datum.replace(/\./g, "/")));
    konzert.UTC = d;
    const convDate = convertDate(d, true)
    konzert.date = convDate;
    const year = d.getFullYear();
    if (index == 0 && checkUTC(konzert.UTC)) {
      pastConcertTitle = true;
    }
    if (!pastConcertTitle && checkUTC(konzert.UTC)) {
      pastConcertTitle = true;
      const spacer = document.createElement("h2");
      spacer.classList.add("cl_konzertFullRow", "cl_gridLine");
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
      Location.title = `Öffnet die Website von\n"${konzert.Location}"`
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

function createDisko() {
  //select Section (parent)
  const diskoPreview = dbID(`id_Disko_Preview`)
  diskoPreview.innerHTML = "";
  //container for all Cards, they overlay
  const cardContainer = dbID(`id_Disko_Cards`)
  cardContainer.innerHTML = "";
  const diskoListe = sortArrayByKey(Disko, "datum", true);
  for (const [index, data] of diskoListe.entries()) {
    // create images with container
    const diskoPreviewContainer = document.createElement("div");
    diskoPreviewContainer.setAttribute("uiSize", "small");
    diskoPreviewContainer.classList.add("cl_diskoPreview");
    const diskoPreviewImage = document.createElement("img");
    diskoPreviewImage.src = `Images/Disko/${data.picName}`;
    //create actual Card
    const card = createSingleCard(data, index, "Disko");
    card.id = `id_diskoCard_card${index}`
    card.classList.add("cl_cardDisko");
    cardContainer.appendChild(card);
    //logic to show the card
    diskoPreviewContainer.onclick = () => {
      const state = card.classList.contains("cl_cardDiskoActive");
      diskoHideCard();
      if (!state) card.classList.add("cl_cardDiskoActive");
    }
    diskoPreviewContainer.appendChild(diskoPreviewImage);
    diskoPreview.appendChild(diskoPreviewContainer);
  }
  //activate first Card
  const randIndex = Math.floor(Math.random() * Disko.length);
  dbID(`id_diskoCard_card${randIndex}`).classList.add("cl_cardDiskoActive");
}

function diskoHideCard() {
  for (const item of dbCL("cl_cardDisko")) {
    item.classList.remove("cl_cardDiskoActive");
  }
}

function createEnsembles() {
  const parent = dbCL(`cl_Ensembles`)[0];
  parent.innerHTML = "";
  Ensembles.forEach((data, index) => {
    const card = createSingleCard(data, index, "Ensembles");
    parent.appendChild(card)
  });
}

function createSingleCard(data, index = 0, type) {
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
    cardContainer.appendChild(links);
    createButtons(data.links, links)
  }
  return cardContainer;
}

function createButtons(btnsArr, parentID, size = null) {
  let parent = dbID(parentID);
  // parent.innerHTML = "";
  btnsArr.forEach((arr, index) => {
    const type = arr.type;
    const link = arr.link;
    const linkBtn = document.createElement("img");
    if (size === null) {
      linkBtn.classList.add("cl_cardImageLink");
    } else {
      linkBtn.classList.add("cl_footerImageLink");
    }
    if (type == "link") {
      linkBtn.src = `https://www.google.com/s2/favicons?domain=${link}`
    } else {
      linkBtn.src = `Images/Icons/i_${type}.svg`
    }
    linkBtn.onclick = () => {
      if (type === "order") {
        window.location.href = `${Contact.mailRef}?subject=${"CD Bestellung"}&body=${encodeURI(link)}`;
      } else {
        window.open(link)
      }
    }
    parent.appendChild(linkBtn);
  });

}

function sendWA() {
  let url = `https://wa.me/${Contact.phone}`
  window.open(url);
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

ColorScheme.darkmodeOn = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
darkModeMediaQuery.addListener((e) => {
  ColorScheme.darkmodeOn = e.matches;
  colToggleColormode();
});

function colToggleColormode(btn = null) {
  if (btn != null) ColorScheme.darkmodeOn = !ColorScheme.darkmodeOn;
  let colBG, colTxt, mainTxt;
  if (ColorScheme.darkmodeOn) {
    const bg = ColorScheme.darkmode.bgcBackground;
    const txt = ColorScheme.darkmode.txtBackground;
    const mTxt = ColorScheme.darkmode.txtMain;
    colBG = `${bg[0]} ${bg[1]}% ${bg[2]}%`
    colTxt = `${txt[0]} ${txt[1]}% ${txt[2]}%`
    mainTxt = `${mTxt[0]} ${mTxt[1]}% ${mTxt[2]}%`
    if (dbID("idImg_footer_Spacer")) {
      dbID("idImg_footer_Spacer").src = "Images/Icons/opt-sun.svg";
      dbIDStyle("idImg_footer_Spacer").filter = "invert(100%)";
    }
  } else {
    const bg = ColorScheme.lightmode.bgcBackground;
    const txt = ColorScheme.lightmode.txtBackground;
    const mTxt = ColorScheme.lightmode.txtMain;
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
  setCssRoot(`filter`, ColorScheme.darkmodeOn ? 1 : 0);
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
