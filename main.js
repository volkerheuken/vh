window.onload = mainSetup;
const globalValues = {
	prevSection: "",
	nextSection: null,
	get defaultStart() {
		const text = !["local", "127.0.0.1"].some((s) => window.location.hostname.includes(s)) ? "Home" : "Ocjene";
		return dbID(`idDiv_navBar_${text}`);
	},
	navClick(site) {
		navClick(dbID(`idDiv_navBar_${site}`));
	},
};

function mainSetup() {
	//add the Grid-Area-Names to all divs inside the sections
	colToggleColormode();
	navClick(globalValues.defaultStart);
	htmlAltTag();
	createButtons(FooterButtons, "idDiv_footerCredits", 0.5);
	ocjeneGridAreas();
	createContactData();
	createNews();
	createKonzerte();
	createEnsembles();
	createDisko();
	createOcjene(true);
	handleTabletChange(checkMediaQuery); // Initial check
}

function htmlAltTag() {
	setAlt("trash");
	setAlt("oAdd");
	setAlt("oSub");

	function setAlt(name) {
		const obj = dbCL(`img_${name}`, null);
		for (let imgObj of obj) {
			imgObj.alt = `${name}.svg`;
		}
	}
}

function createContactData() {
	for (const [key, value] of Object.entries(Contact)) {
		const html = document.querySelectorAll(`[data-${key}]`);
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
	if (obj == null) return;
	globalValues.nextSection = obj.dataset.type;
	if (globalValues.prevSection != globalValues.nextSection) {
		let selectedID = `idDiv_navBar_${globalValues.nextSection}`;
		//set the CSS-Active class to highlight the clicked Menu
		const clArr = dbCL("cl_navElements", null);
		for (const item of clArr) {
			if (item.id === selectedID) {
				item.classList.add("navbarActive");
				dbID("idDiv_navBar_Menu").innerHTML = `&#9776;  ${item.textContent}`;
			} else {
				item.classList.remove("navbarActive");
			}
		}
		//hide all Grid-Items except the selected
		const mainGridItems = document.querySelectorAll("section");
		let selected;
		for (let item of mainGridItems) {
			item.setAttribute("hidden", true);
			item.removeAttribute("visible");
			nextID = `id_${globalValues.nextSection}`;
			if (nextID === item.id) {
				selected = item;
			}
		}
		selected.setAttribute("visible", true);
		selected.removeAttribute("hidden");
	}
	//always scroll to the top
	const scrollOptions = {
		top: 0,
		behavior: "smooth",
	};
	document.body.scrollTo(scrollOptions); // For Safari
	document.documentElement.scrollTo(scrollOptions); // For Safari
	globalValues.prevSection = globalValues.nextSection;
	globalValues.nextSection = null;
	dbID("idNav_navElements").classList.remove("navbarDropActive");
}

function createNews() {
	const parent = dbID("id_NewsListe");
	parent.innerHTML = "";
	for (let news of News) {
		const newsContainer = document.createElement("div");
		parent.appendChild(newsContainer);
		const spacer = document.createElement("h2");
		spacer.classList.add("cl_gridLine");
		newsContainer.appendChild(spacer);

		const text = document.createElement("span");
		text.textContent = news.text;
		text.classList.add("cl_newsGrid_text");
		if (news.hasOwnProperty("link") && news.link != "") {
			text.classList.add("cl_newsGrid_link");
			text.onclick = () => {
				const type = Object.keys(news.link)[0];
				if (type === "local") globalValues.navClick(news.link.local);
				if (type === "url") window.open(news.link.url);
			};
		}
		newsContainer.appendChild(text);
	}
}

function createKonzerte() {
	function checkUTC(UTC) {
		const day = 86400000;
		return UTC.getTime() + day >= new Date().getTime();
	}
	let parent = dbID(`id_KonzertListe`);
	parent.innerHTML = "";
	let splitIndex = null;
	let prevList = sortArrayByKey(Konzerte, "datum", false);
	let upcommingList;
	for (const [index, konzert] of prevList.entries()) {
		const d = new Date(Date.parse(konzert.datum.replace(/\./g, "/")));
		if (checkUTC(d)) {
			splitIndex = index;
			break;
		}
	}
	if (splitIndex != null) {
		upcommingList = prevList.splice(splitIndex);
		// upcomming shows
		konzertEntry(parent, upcommingList, true);
	} else {
		const noShows = document.createElement("h2");
		noShows.classList.add("cl_konzertFullRow");
		noShows.textContent = "keine anstehenden Veranstaltnugen";
		parent.appendChild(noShows);
	}
	// line
	const spacer = document.createElement("h2");
	spacer.classList.add("cl_konzertFullRow", "cl_gridLine");
	parent.appendChild(spacer);
	const spacer2 = spacer.cloneNode(true);
	parent.appendChild(spacer2);
	// prev shows
	prevList.reverse();
	konzertEntry(parent, prevList.slice(0, 10), false);
}

function konzertEntry(parent, list, type) {
	let lastYear = 0;
	const title = document.createElement("h2");
	title.textContent = type ? "anstehende Veranstaltungen" : "vergangene Veranstaltungen";
	title.classList.add("cl_konzertFullRow");
	parent.appendChild(title);

	for (const [index, konzert] of list.entries()) {
		konzert.UTC = new Date(Date.parse(konzert.datum.replace(/\./g, "/")));
		const convDate = convertDate(konzert.UTC, true);
		const year = konzert.UTC.getFullYear();
		konzert.date = convDate;
		const date = document.createElement("p");
		date.textContent = konzert.date;
		parent.appendChild(date);
		const Startzeit = document.createElement("p");
		Startzeit.textContent = konzert.Startzeit.length == 2 ? `${konzert.Startzeit} h` : konzert.Startzeit;
		parent.appendChild(Startzeit);
		const Titel = document.createElement("p");
		Titel.textContent = konzert.Titel;
		parent.appendChild(Titel);
		const Location = document.createElement("p");
		Location.textContent = konzert.Location;
		if (konzert.UTC >= new Date() && konzert.link != undefined && konzert.link != "") {
			Location.classList.add("highlight");
			Location.title = `Öffnet die Website von\n"${konzert.Location}"`;
			Location.onclick = () => {
				window.open(konzert.link);
			};
		}
		parent.appendChild(Location);
		const Stadt = document.createElement("p");
		Stadt.textContent = konzert.Stadt;
		parent.appendChild(Stadt);
	}
}

function createDisko() {
	//select Section (parent)
	const diskoPreview = dbID(`id_Disko_Preview`);
	diskoPreview.innerHTML = "";
	//container for all Cards, they overlay
	const cardContainer = dbID(`id_Disko_Cards`);
	cardContainer.innerHTML = "";
	const diskoListe = sortArrayByKey(Disko, "datum", true);
	for (const [index, data] of diskoListe.entries()) {
		// create images with container
		const diskoPreviewContainer = document.createElement("div");
		diskoPreviewContainer.classList.add("cl_diskoPreview");
		const diskoPreviewImage = document.createElement("img");
		diskoPreviewImage.src = `Images/Disko/${data.picName}`;
		diskoPreviewImage.classList.add("cl_diskoPreviewImg");

		//create actual Card
		const card = createSingleCard(data, index, "Disko");
		card.id = `id_diskoCard_card${index}`;
		card.classList.add("cl_cardDisko");
		cardContainer.appendChild(card);
		//logic to show the card
		diskoPreviewContainer.onclick = () => {
			for (const item of dbCL("cl_cardDisko", null)) {
				item.classList.remove("cl_cardDiskoActive");
			}
			card.classList.add("cl_cardDiskoActive");
		};
		diskoPreviewContainer.appendChild(diskoPreviewImage);
		diskoPreview.appendChild(diskoPreviewContainer);
	}
	//activate first Card
	const randIndex = Math.floor(Math.random() * Disko.length);
	dbID(`id_diskoCard_card${randIndex}`).classList.add("cl_cardDiskoActive");
}

function createEnsembles() {
	const parent = dbCL(`cl_Ensembles`);
	parent.innerHTML = "";
	Ensembles.forEach((data, index) => {
		const card = createSingleCard(data, index, "Ensembles");
		parent.appendChild(card);
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
	title.setAttribute("uiTextAlign", "block");
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
		const text = document.createElement("span");
		text.classList.add("cl_cardText");
		text.textContent = data.description;
		cardContainer.appendChild(text);
	}

	//Besetzung
	if (data.cast) {
		const cast = document.createElement("div");
		cast.classList.add("cl_cardCast");
		cast.style.gridArea = "cardCast";
		for (let c = 0; c < data.cast.length; c++) {
			const member = document.createElement("p");
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
		createButtons(data.links, links);
	}
	return cardContainer;
}

function createButtons(btnsArr, parentID, size = null) {
	let parent = dbID(parentID);
	parent.innerHTML = "";
	const spacer = document.createElement("div");
	parent.appendChild(spacer);
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
			linkBtn.src = `https://www.google.com/s2/favicons?domain=${link}`;
		} else {
			linkBtn.src = `Images/Icons/i_${type}.svg`;
		}
		linkBtn.onclick = () => {
			if (type === "order") {
				window.location.href = `${Contact.mailRef}?subject=${"CD Bestellung"}&body=${encodeURI(link)}`;
			} else {
				window.open(link);
			}
		};
		parent.appendChild(linkBtn);
	});
}

//------------ Helperfunctions --------------
function getCssRoot(object, number = false, toPX = false) {
	//  getCssRoot("navbarHeight", return only number=true)
	const obj = `--${object}`;
	let valToConvert = getComputedStyle(document.body)
		.getPropertyValue(obj)
		.replace(/s|px|rem/g, "");
	//toPX = false
	if (toPX == true && object != "fs-Base") {
		const size = getComputedStyle(document.body).getPropertyValue("--fs-Base").replace(/px/g, "");
		return Number(size * valToConvert);
	}
	//number = false
	if (number == true) {
		return Number(valToConvert);
	}
	return getComputedStyle(document.body).getPropertyValue(obj).trim();
}

function setCssRoot(object, value, dim = "") {
	//  setCssRoot("navbarHeight", 100, "px")
	document.styleSheets[0].cssRules[0].style.setProperty(`--${object}`, `${value}${dim}`);
}

function dbID(id) {
	if (id instanceof Object) return id;
	return document.getElementById(id);
}

function dbIDStyle(id) {
	if (id instanceof Object) return id.style;
	return document.getElementById(id).style;
}

function dbCL(id, loc = 0) {
	if (loc === null) {
		return document.getElementsByClassName(id);
	}
	return document.getElementsByClassName(id)[loc];
}

function dbCLStyle(id, loc = 0) {
	if (loc === null) {
		let ret = [];
		for (const s of document.getElementsByClassName(id)) {
			ret.push(s.style);
		}
		return ret;
	}
	return document.getElementsByClassName(id)[loc].style;
}
function deepClone(data) {
	if (data === null || data === undefined) return data;
	return JSON.parse(JSON.stringify(data));
}
function convertDate(date, fourDigitYear = false) {
	const day = date.getDate().toString().padStart(2, 0);
	const month = (date.getMonth() + 1).toString().padStart(2, 0);
	const year = fourDigitYear ? date.getFullYear() : parseInt(date.getFullYear().toString().substr(2, 2), 10);
	return `${day}.${month}.${year}`;
}

function sortArrayByKey(arr, key, inverse = false) {
	let array = Array.from(arr);
	return array.sort(function (a, b) {
		if (typeof a[key] == "number" && typeof b[key] == "number") {
			if (inverse) {
				return b[key] - a[key];
			} else {
				return a[key] - b[key];
			}
		} else {
			const x = a[key];
			const y = b[key];
			if (inverse) {
				return x < y ? 1 : x > y ? -1 : 0;
			} else {
				return x < y ? -1 : x > y ? 1 : 0;
			}
		}
	});
}

ColorScheme.darkmodeOn = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
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
		colBG = `${bg[0]} ${bg[1]}% ${bg[2]}%`;
		colTxt = `${txt[0]} ${txt[1]}% ${txt[2]}%`;
		mainTxt = `${mTxt[0]} ${mTxt[1]}% ${mTxt[2]}%`;
		if (dbID("idImg_footer_Spacer")) {
			dbID("idImg_footer_Spacer").src = "Images/Icons/opt-sun.svg";
			dbIDStyle("idImg_footer_Spacer").filter = "invert(100%)";
		}
	} else {
		const bg = ColorScheme.lightmode.bgcBackground;
		const txt = ColorScheme.lightmode.txtBackground;
		const mTxt = ColorScheme.lightmode.txtMain;
		colBG = `${bg[0]} ${bg[1]}% ${bg[2]}%`;
		colTxt = `${txt[0]} ${txt[1]}% ${txt[2]}%`;
		mainTxt = `${mTxt[0]} ${mTxt[1]}% ${mTxt[2]}%`;
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
	dbID("idNav_navElements").classList.add("navbarDropActive");
}

const checkMediaQuery = window.matchMedia("(max-width: 850px)");
checkMediaQuery.addEventListener("change", handleTabletChange);

function handleTabletChange(e) {
	const w = e.matches ? 80 : 300;
	let s = dbCL("cl_spotifySmall");
	s.style.width = `${w / 2}px`;
	let iframe = `<iframe id="spotify" src="https://open.spotify.com/embed/artist/7pv0ZlsoLsO02h38vM8wVq" width="${w}px" height="80" frameBorder="0" allowtransparency="false" allow="encrypted-media"></iframe>`;
	s.innerHTML = iframe;
}
