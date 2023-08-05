const idNameList = ["Startzeit", "Titel", "Location", "Stadt", "link"];

window.onload = loadKonzerte;

function loadKonzerte() {
	if (!["local", "127.0.0.1"].some((s) => window.location.hostname.includes(s))) {
		dbID("howTo").textContent = "";
		return;
	}
	KonzertList();
}

let upcommingKonzertList = [];
let change = null;
//--------------------------

function addKonzert() {
	let newInput = {
		datum: dbID("datum").value.replace(/\-/g, "."),
		Startzeit: dbID("Startzeit").value || "tba",
		Titel: dbID("Titel").value || "tba",
		Location: dbID("Location").value || "tba",
		Stadt: dbID("Stadt").value || "tba",
		link: dbID("link").value || "",
	};
	if (change == null) {
		Konzerte.push(newInput);
	} else {
		const index = Konzerte.findIndex((obj) => obj.datum == change.datum && obj.Titel == change.Titel);
		Konzerte[index] = newInput;
		change = null;
	}
	KonzertList();
}

function changeKonzerte(konzert) {
	let date = new Date(konzert.datum.replace(/\./g, "-"));
	dbID("datum").valueAsDate = date;
	dbID("Startzeit").value = konzert.Startzeit;
	dbID("Titel").value = konzert.Titel;
	dbID("Location").value = konzert.Location;
	dbID("Stadt").value = konzert.Stadt;
	dbID("link").value = konzert.link;
	change = konzert;
}

function deleteKonzerte(konzert) {
	if (change != null) return;
	const index = Konzerte.findIndex((obj) => obj.datum == konzert.datum && obj.Titel == konzert.Titel);
	Konzerte.splice(index, 1);
	KonzertList();
}

function saveKonzert() {
	console.log("save");
	let a = document.createElement("a");
	const data = `const Konzerte = ${JSON.stringify(Konzerte)};`;
	let file = new Blob([data], { type: "application/javascript" });
	a.href = URL.createObjectURL(file);
	a.download = "KonzertData.js";
	a.click();
}

//--------------------------
function KonzertList() {
	const spacer = document.createElement("h2");
	spacer.classList.add("cl_konzertFullRow", "cl_gridLine");

	function checkUTC(UTC) {
		const day = 86400000;
		return UTC.getTime() + day >= new Date().getTime();
	}
	let parent = dbID(`Konzerte`);
	parent.innerHTML = "";

	input = dbID(`Input`);
	input.innerHTML = "";
	const title = document.createElement("h2");
	title.textContent = "Neue Konzerte eintragen";
	title.classList.add("cl_konzertFullRow");
	parent.appendChild(title);

	let inputParent = document.createElement("div");
	parent.appendChild(inputParent);

	// Date
	let date = document.createElement("input");
	date.id = "datum";
	date.type = "date";
	date.valueAsDate = new Date();
	inputParent.appendChild(date);

	for (let id of idNameList) {
		let input = document.createElement("input");
		input.id = id;
		input.placeholder = id;
		inputParent.appendChild(input);
	}

	inputParent.appendChild(spacer);

	let inputAdd = document.createElement("button");
	inputAdd.innerHTML = "Eintragen";
	inputAdd.onclick = () => addKonzert();
	inputParent.appendChild(inputAdd);
	let inputSave = document.createElement("button");
	inputSave.innerHTML = "Datei Speichern";
	inputSave.onclick = () => saveKonzert();
	inputParent.appendChild(inputSave);

	// populate List
	let splitIndex = null;
	let prevList = sortArrayByKey(Konzerte, "datum", false);
	upcommingKonzertList = [];
	for (const [index, konzert] of prevList.entries()) {
		const d = new Date(Date.parse(konzert.datum.replace(/\./g, "/")));
		if (checkUTC(d)) {
			splitIndex = index;
			break;
		}
	}
	if (splitIndex != null) {
		upcommingKonzertList = prevList.splice(splitIndex);
		// upcomming shows
		konzertEntry(parent, upcommingKonzertList, true);
	} else {
		const noShows = document.createElement("h2");
		noShows.classList.add("cl_konzertFullRow");
		noShows.textContent = "keine anstehenden Veranstaltungen";
		parent.appendChild(noShows);
	}
	// line
	const spacer1 = spacer.cloneNode(true);
	parent.appendChild(spacer1);
	const spacer2 = spacer.cloneNode(true);
	parent.appendChild(spacer2);
	// prev shows
	prevList.reverse();
	// konzertEntry(parent, prevList.slice(0, 10), false);
	konzertEntry(parent, prevList, false);
}

function konzertEntry(parent, list, type) {
	const title = document.createElement("h2");
	title.textContent = type ? "anstehende Veranstaltungen" : "vergangene Veranstaltungen";
	title.classList.add("cl_konzertFullRow");
	parent.appendChild(title);

	for (const [index, konzert] of list.entries()) {
		konzert.UTC = new Date(Date.parse(konzert.datum.replace(/\./g, "/")));
		const convDate = convertDate(konzert.UTC, true);
		konzert.date = convDate;
		const date = document.createElement("p");
		date.textContent = konzert.date;
		date.style.cursor = "alias";
		date.onclick = () => {
			changeKonzerte(konzert);
		};
		parent.appendChild(date);
		const Startzeit = document.createElement("p");
		Startzeit.textContent = konzert.Startzeit.length == 2 ? `${konzert.Startzeit} h` : konzert.Startzeit;
		parent.appendChild(Startzeit);
		const Titel = document.createElement("p");
		Titel.textContent = konzert.Titel;
		Titel.style.cursor = "not-allowed";
		Titel.onclick = () => {
			deleteKonzerte(konzert);
		};
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

function firstLetterCap(s) {
	if (s == "") return s;
	if (typeof s != "string") return s;
	return s[0].toUpperCase() + s.slice(1);
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
