function ocjeneOpenSettings() {
	dbID(Settings).showModal();
}
function ocjeneCloseSettings() {
	dbID(Settings).close();
}
function dbCLStyle(id, loc = 0) {
  console.log(id);
	if (loc === null) {
		let ret = [];
		for (const s of document.getElementsByClassName(id)) {
			ret.push(s.style);
		}
		return ret;
	}
	return document.getElementsByClassName(id)[loc].style;
}
function ocjeneGridAreas() {
	for (const content of ocjeneSubgrid) {
		dbCLStyle(content[0]).gridArea = content[0];
		if (content[1]) dbCLStyle(content[0]).justifySelf = content[1];
		if (content[2]) dbCLStyle(content[0]).alignSelf = content[2];
	}
}

function htmlAltTag() {
	// needed to display local files in Firefox when the imgSrc is set inside css
	setAlt("trash");
	setAlt("oAdd");
	setAlt("oSub");

	function setAlt(name) {
		const t = dbCL(`img_${name}`, null);
		for (let e of t) {
			e.alt = `${name}.svg`;
		}
	}
}
function utilsVinChange(id, v) {
	let obj = null;
	let siblingList = Array.from(id.parentNode.children);
	for (let i = siblingList.indexOf(id) - 1; i >= 0; i--) {
		if (siblingList[i].type != "button") {
			obj = siblingList[i];
			break;
		}
	}
	if (obj == null) {
		console.log("not found");
		return;
	}
	if (obj.disabled) return;
	const dir = Number(v);

	if (obj.type == "time") evaluateTime();
	if (obj.type == "number") evaluateNumber();

	obj.dispatchEvent(new Event("input"));
	obj.focus();

	function evaluateTime() {
		const h = Number(obj.value.slice(0, 2));
		const m = Number(obj.value.slice(3, 5));
		let time = m + h * 60;
		time += time % 5 == 0 ? dir * 5 : dir;
		const t = utilsMinutesToObj(time);
		obj.value = `${t.h}:${t.m}`;
	}
	function evaluateNumber() {
		if (dir == 0) {
			const time = new Date().getTime();
			obj.setAttribute("data-ts", time);
			if (Number(obj.value) === 0 || Number(obj.value) === Number(obj.min)) {
				obj.value = "";
				return;
			}
			obj.value = obj.min || 0;
			return;
		}

		const time = new Date().getTime();
		let skip = false;
		if (obj.hasAttribute("data-ts")) {
			if (time - obj.dataset.ts < 1500) skip = true;
		}
		obj.setAttribute("data-ts", time);
		const actual = obj.value == "" && obj.placeholder != "" ? Number(obj.placeholder) : Number(obj.value);
		const num = skip && actual % 5 == 0 ? actual + dir * 5 : actual + dir;
		const min = obj.hasAttribute("min") && dir < 1 ? Number(obj.min) : null;
		const max = obj.hasAttribute("max") && dir > 0 ? Number(obj.max) : null;
		obj.value = valueConstrain(num, min, max);
	}
}
function valueConstrain(val, min = null, max = null) {
	if (min == null && max == null) return val;
	if (min != null && max != null) return Math.max(Math.min(val, max), min);
	if (min == null && max != null) return Math.min(val, max);
	if (min != null && max == null) return Math.max(val, min);
}
function resetInput(id, ph, opts = null) {
	const obj = dbID(id);
	if (obj.type == "checkbox") {
		obj.checked = ph;
		return ph;
	}
	obj.value = "";
	obj.placeholder = ph;
	if (opts != null) {
		for (let [key, val] of Object.entries(opts)) {
			obj[key] = val;
		}
	}
	return Number(obj.placeholder);
}
function clearFirstChild(id) {
	const obj = typeof id == "string" ? dbID(id) : id;
	while (obj.firstChild) {
		obj.removeChild(obj.firstChild);
	}
	return obj;
}
function btnColor(id, opt = null) {
	const obj = dbID(id);
	if (opt === null) obj.removeAttribute("data-btnstatus");
	else if (opt === "positive") obj.dataset.btnstatus = "btnPositive";
	else if (opt === "negative") obj.dataset.btnstatus = "btnNegative";
	else if (opt === "colored") obj.dataset.btnstatus = "btnBasecolor";
}
function arrayFromNumber(obj, num = null) {
	if (num == null && typeof obj == "number") return [...Array(obj).keys()];
	if (typeof obj == "number" && typeof num == "number") {
		let min = Math.min(obj, num);
		let max = Math.max(obj, num);
		let arr = [];
		for (let i = min; i <= max; i++) {
			arr.push(i);
		}
		return arr;
	}
}
function randomIndex(obj) {
	if (typeof obj == "string") return Math.floor(Math.random() * obj.length);
	if (Array.isArray(obj)) return Math.floor(Math.random() * obj.length);
	return Math.floor(Math.random() * Object.keys(obj).length);
}
function randomObject(obj, top = null) {
	// takes a single Number, an Array or an Object
	if (typeof obj == "number") return randomObject(arrayFromNumber(obj, top));
	if (typeof obj == "string") return obj[randomIndex(obj)];
	if (Array.isArray(obj) && obj.length <= 0) return null;
	if (Array.isArray(obj)) return obj[randomIndex(obj)];
	const objKeys = Object.keys(obj);
	return obj[objKeys[randomIndex(objKeys)]];
}
function firstLetterCap(s) {
	if (s == "") return s;
	if (typeof s != "string") return s;
	return s[0].toUpperCase() + s.slice(1);
}
function utilsNumberFromInput(id, failSafeVal = null, noPlaceholder = null) {
	const obj = dbID(id);
	if (!isNaN(obj.valueAsNumber)) return obj.valueAsNumber;
	if (failSafeVal != null) return failSafeVal;
	if (noPlaceholder != null) return null;
	return Number(obj.placeholder);
}

// -------------------------- Random Data for Ocjene ------------------------

const Data_Country_CodesIso639 = new Map([
	["auto", "Automatic"],
	["af", "Afrikaans"],
	["sq", "Albanian"],
	["am", "Amharic"],
	["ar", "Arabic"],
	["hy", "Armenian"],
	["az", "Azerbaijani"],
	["eu", "Basque"],
	["be", "Belarusian"],
	["bn", "Bengali"],
	["bs", "Bosnian"],
	["bg", "Bulgarian"],
	["ca", "Catalan"],
	["ceb", "Cebuano"],
	["ny", "Chichewa"],
	["zh-cn", "Chinese s."],
	["zh-tw", "Taiwan t."],
	["zh-hk", "Hongkong t."],
	["co", "Corsican"],
	["hr", "Croatian"],
	["cs", "Czech"],
	["da", "Danish"],
	["nl", "Dutch"],
	["en", "English"],
	["eo", "Esperanto"],
	["et", "Estonian"],
	["tl", "Filipino"],
	["fi", "Finnish"],
	["fr", "French"],
	["fy", "Frisian"],
	["gl", "Galician"],
	["ka", "Georgian"],
	["de", "German"],
	["el", "Greek"],
	["gu", "Gujarati"],
	["ht", "Haitian Creole"],
	["ha", "Hausa"],
	["haw", "Hawaiian"],
	["he", "Hebrew"],
	["hi", "Hindi"],
	["hmn", "Hmong"],
	["hu", "Hungarian"],
	["is", "Icelandic"],
	["ig", "Igbo"],
	["id", "Indonesian"],
	["ga", "Irish"],
	["it", "Italian"],
	["ja", "Japanese"],
	["jw", "Javanese"],
	["kn", "Kannada"],
	["kk", "Kazakh"],
	["km", "Khmer"],
	["ko", "Korean"],
	["ku", "Kurdish (Kurmanji)"],
	["ky", "Kyrgyz"],
	["lo", "Lao"],
	["la", "Latin"],
	["lv", "Latvian"],
	["lt", "Lithuanian"],
	["lb", "Luxembourgish"],
	["mk", "Macedonian"],
	["mg", "Malagasy"],
	["ms", "Malay"],
	["ml", "Malayalam"],
	["mt", "Maltese"],
	["mi", "Maori"],
	["mr", "Marathi"],
	["mn", "Mongolian"],
	["my", "Myanmar (Burmese)"],
	["ne", "Nepali"],
	["nb", "Norwegian"],
	["ps", "Pashto"],
	["fa", "Persian"],
	["pl", "Polish"],
	["pt", "Portuguese"],
	["ma", "Punjabi"],
	["ro", "Romanian"],
	["ru", "Russian"],
	["sm", "Samoan"],
	["gd", "Scots Gaelic"],
	["sr", "Serbian"],
	["st", "Sesotho"],
	["sn", "Shona"],
	["sd", "Sindhi"],
	["si", "Sinhala"],
	["sk", "Slovak"],
	["sl", "Slovenian"],
	["so", "Somali"],
	["es", "Spanish"],
	["su", "Sundanese"],
	["sw", "Swahili"],
	["sv", "Swedish"],
	["tg", "Tajik"],
	["ta", "Tamil"],
	["te", "Telugu"],
	["th", "Thai"],
	["tr", "Turkish"],
	["uk", "Ukrainian"],
	["ur", "Urdu"],
	["uz", "Uzbek"],
	["vi", "Vietnamese"],
	["cy", "Welsh"],
	["xh", "Xhosa"],
	["yi", "Yiddish"],
	["yo", "Yoruba"],
	["zu", "Zulu]"],
]);
