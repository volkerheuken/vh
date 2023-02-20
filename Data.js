const Contact = {
	name: "Volker Heuken",
	mail: "mail@volkerheuken.com",
	phone: "+4915778220214",
	phoneString: "0157 78220214",
	street: "Oststrasse 78",
	zip: "04229",
	city: "Leipzig",
	get mailRef() {
		return `mailto:${this.mail}`;
	},
	get mailText() {
		return `Mail: ${this.mail}`;
	},
	get cityFull() {
		return `${this.zip} ${this.city}`;
	},
	get phoneText() {
		return `Phone :${this.phone}`;
	},
	get phoneRef() {
		return `tel:${this.phone}`;
	},
};

const News = [
	{
		text: "Neue Veröffentlichung: Hörspiel für Kinder Peterchens Mondfahrt",
		get link() {
			// bei link zu einer anderen seite das hier benutzen
			return { url: "https://www.buchfunk.de/peterchens-mondfahrt/" };
		},
	},
	// {
	//   text: "",
	//   get link() {
	//     bei link auf VolkerHeuken.com das hier benutzen ("local" statt "url")
	//     return {
	//       local: "Disko"
	//     };
	//   }
	// },
];

const Konzerte = [
	//Datum: Jahr, Monat, Tag als: YYYY,MM,DD
	{
		datum: "2023.03.26",
		Startzeit: "20:00",
		Titel: "Damian Dalla Torre Happy Floating",
		Location: "Weltecho",
		Stadt: "Chemnitz",
		link: "",
	},
	{
		datum: "2023.02.11",
		Startzeit: "20:00",
		Titel: "Johannes Moritz Anamorphosis",
		Location: "Alte Rösterei",
		Stadt: "Plauen",
	},
	{
		datum: "2023.02.12",
		Startzeit: "20:00",
		Titel: "Johannes Moritz Anamorphosis",
		Location: "Saxstall",
		Stadt: "Pohrsdorf",
	},{
		datum: "2023.02.17",
		Startzeit: "20:00",
		Titel: "Volker Heuken Sextett",
		Location: "Jazzstudio e.V",
		Stadt: "Nürnberg",
	},
	{
		datum: "2023.02.18",
		Startzeit: "20:00",
		Titel: "Volker Heuken Sextett",
		Location: "Wendlandjazz",
		Stadt: "Gedelitz",
	},
	{
		datum: "2023.03.03",
		Startzeit: "20:00",
		Titel: "Damian Dalla Torre Happy Floating",
		Location: "Nato",
		Stadt: "Leipzig",
		link: "",
	},
	{
		datum: "2023.03.04",
		Startzeit: "20:00",
		Titel: "Damian Dalla Torre Happy Floating",
		Location: "Pierre Grasse",
		Stadt: "Halle Saale",
		link: "",
	},
	{
		datum: "2023.03.05",
		Startzeit: "20:00",
		Titel: "Damian Dalla Torre Happy Floating",
		Location: "Franz Mehlhose",
		Stadt: "Erfurt",
		link: "",
	},
	{
		datum: "2023.03.07",
		Startzeit: "20:00",
		Titel: "Damian Dalla Torre Happy Floating",
		Location: "Jazzlab",
		Stadt: "Hamburg",
		link: "",
	},
	{
		datum: "2023.03.09",
		Startzeit: "20:00",
		Titel: "Damian Dalla Torre Happy Floating",
		Location: "Milla Club",
		Stadt: "München",
		link: "",
	},
	{
		datum: "2023.03.30",
		Startzeit: "19:30",
		Titel: "Heuken / Stadtfeld / Heigenhuber",
		Location: "Horns Erben",
		Stadt: "Leipzig",
		link: "",
	},
	{
		datum: "2023.04.13",
		Startzeit: "20:00",
		Titel: "Johannes Moritz Anamorphosis",
		Location: "Weltecho",
		Stadt: "Chemnitz",
		link: "",
	},
	{
		datum: "2023.04.14",
		Startzeit: "20:00",
		Titel: "Johannes Moritz Anamorphosis",
		Location: "BLECH",
		Stadt: "Halle Saale",
		link: "",
	},
	{
		datum: "2023.04.15",
		Startzeit: "20:00",
		Titel: "Johannes Moritz Anamorphosis",
		Location: "Nato",
		Stadt: "Leipzig",
		link: "",
	},
	{
		datum: "2023.04.21",
		Startzeit: "20:00",
		Titel: "Hypochondrische Ängste",
		Location: "Leipjazzig Festival Schille",
		Stadt: "Leipzig",
		link: "",
	},
	{
		datum: "2023.04.22",
		Startzeit: "14 / 16",
		Titel: "Peterchens Mondfahrt",
		Location: "Kulturhof Gohlis",
		Stadt: "Leipzig",
		link: "",
	},
	{
		datum: "2023.05.06",
		Startzeit: "20:00",
		Titel: "VOLGA",
		Location: "Weltecho",
		Stadt: "Chemnitz",
		link: "",
	},
	{
		datum: "2023.05.14",
		Startzeit: "20:00",
		Titel: "Johannes Moritz Anamorphosis",
		Location: "Industriesalon",
		Stadt: "Berlin",
		link: "",
	},
	{
		datum: "2022.12.10",
		Startzeit: "21:00",
		Titel: "Die Hypochondrischen Ängste",
		Location: "Donau 115",
		Stadt: "Berlin",
		link: "",
	},
  {
		datum: "2022.12.10",
		Startzeit: "21:00",
		Titel: "Die Hypochondrischen Ängste",
		Location: "Donau 115",
		Stadt: "Berlin",
		link: "",
	},
	{
		datum: "2022.12.03",
		Startzeit: "20:00",
		Titel: "Mareike Wiening Oktett",
		Location: "Stadtgarten",
		Stadt: "Köln",
		link: "",
	},
	{
		datum: "2022.11.15",
		Startzeit: "17:00",
		Titel: "Peterchens Mondfahrt",
		Location: "Bahnhof Fischbach",
		Stadt: "Friedrichshafen",
		link: "https://www.bahnhof-fischbach.de/programm/peterchens-mondfahrt-theater",
	},
	{
		datum: "2022.11.13",
		Startzeit: "20:00",
		Titel: "Last Exit Schönefeld",
		Location: "Schille, Leipjazzigfestival",
		Stadt: "Leipzig",
		link: "",
	},
	{
		datum: "2022.11.10",
		Startzeit: "20:00",
		Titel: "Antonia Hausmann & Volker Heuken",
		Location: "tba",
		Stadt: "Düren",
		link: "",
	},
	{
		datum: "2022.11.09",
		Startzeit: "20:00",
		Titel: "Antonia Hausmann & Volker Heuken",
		Location: "tba",
		Stadt: "Bamberg",
		link: "",
	},
	{
		datum: "2022.10.28",
		Startzeit: "21:00",
		Titel: "Volker Heuken Solo",
		Location: "Kunstnacht, Christuskirche",
		Stadt: "Leverkusen",
		link: "",
	},
	{
		datum: "2022.10.29",
		Startzeit: "19:30",
		Titel: "Die Hypochondrischen Ängste",
		Location: "Jazztage Leipzig",
		Stadt: "Leipzig",
		link: "",
	},
	{
		datum: "2022.10.23",
		Startzeit: "15:00",
		Titel: "Peterchens Mondfahrt",
		Location: "Turbinenhaus",
		Stadt: "Naumburg",
		link: "",
	},
	{
		datum: "2022.10.16",
		Startzeit: "14:00",
		Titel: "Peterchens Mondfahrt",
		Location: "UT Connewitz",
		Stadt: "Leipzig",
		link: "",
	},
	{
		datum: "2022.10.13",
		Startzeit: "20:00",
		Titel: "Die Hypochondrischen Ängste",
		Location: "Pierre Grasse",
		Stadt: "Halle a.d Saale",
		link: "",
	},
	{
		datum: "2022.10.09",
		Startzeit: "16:00",
		Titel: "Peterchens Mondfahrt",
		Location: "Mandau Jazz Festival",
		Stadt: "Zittau",
		link: "",
	},
	{
		datum: "2022.03.14",
		Startzeit: "20",
		Titel: "Damian Dalla Torre Happy Floating",
		Location: "Basis",
		Stadt: "Schlanders (IT)",
	},
	{
		datum: "2022.03.30",
		Startzeit: "20",
		Titel: "Johannes Moritz Anamorphosis",
		Location: "Horns Erben",
		Stadt: "Leipzig",
	},
	{
		datum: "2022.06.10",
		Startzeit: "20",
		Titel: "Damian Dalla Torre Happy Floating",
		Location: "Mon Ami",
		Stadt: "Weimar",
		link: "https://www.monami-weimar.de/",
	},
];

const Ensembles = [
	{
		title: `Volker Heuken Sextett`,
		picName: "E_VolkerHeukenSextett.png",
		cast: ["Christopher Kunz - tenor", "Antonia Hausmann - posaune", "Volker Heuken - vibraphon", "Lukas Grossmann - piano", "Alex Bayer - bass", "Jan F. Brill - drums"],
		description: `
      Volker Heukens Kompositionen erzeugen mit Phantasie und Raffinesse dichte Stimmungen von arkadischer Lyrik über geistreiche Eleganz bis zum explosiven Gewitter. Mit großer Klarheit verwebt sein traumwandlerisch eingespieltes Sextett diese Stimmungen zu dichten Atmosphären und bietet dem Hörer die Erfahrung eines großen dramatischen Prozesses.
      `,
		links: [
			{
				type: "youtube",
				link: "https://www.youtube.com/watch?v=lxNepHJrEcw",
			},
			{
				type: "spotify",
				link: "https://open.spotify.com/artist/7pv0ZlsoLsO02h38vM8wVq",
			},
			{
				type: "amazon",
				link: "https://www.amazon.de/Siblings-Volker-Heuken-Sextett/dp/B07XV71C1X/ref=sr_1_1?__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&keywords=volker+heuken+sextett&qid=1579020409&sr=8-1",
			},
		],
	},
	{
		title: `Antonia Hausmann & Volker Heuken`,
		picName: "E_AntoniaundVolker.png",
		cast: ["Antonia Hausmann - posaune", "Volker Heuken - vibraphon"],
		description: `
    Antonias und Volkers Wege kreuzen sich seit Jahren immer wieder an verschiedenen Punkten ihres künstlerischen Schaffens. In unterschiedlichsten Besetzungen und Formationen treffen die beiden preisgekrönten Protagonisten der kreativen Leipziger Szene aufeinander. Jedoch nie so innig wie in diesem Projekt. Ihr ungewöhnliches Duo ist intim und furios zugleich, ist sanft und energiegeladen, es erzählt Geschichten und eröffnet Räume. 
    Die beiden verbinden ihre musikalischen Stimmen zu einer erstaunlich farbenreichen Sprache. Alle Ecken und Winkel ihrer kleinen Besetzung werden ausgeleuchtet und die Instrumente auf jeden erdenkliche Art modifiziert, um das größtmögliche Spektrum an Timbres und Ideen aus Vibraphon und Posaune herauskitzeln. Am Ende hört das Publikum jedoch eines: Tiefes Vertrauen in den Duo-Partner und eine langjährige Freundschaft.
    
      `,
		links: [
			{
				type: "youtube",
				link: "https://www.youtube.com/watch?v=-YI3zIt-iss",
			},
			{
				type: "youtube",
				link: "https://www.youtube.com/watch?v=3uScnBRGeds",
			},
		],
	},
	{
		title: `Volga`,
		picName: "E_Volga.png",
		cast: ["Volker Heuken - vibraphon", "Olga Reznichenko - piano"],
		description: `In die renommierten Fußstapfen des ikonesken Duos von Gary Burton und Chick Corea tretend, gestalten die Pianistin Olga Reznichenko und der Vibraphonist Volker Heuken die Klanggestalt dieser seltenen Instrumentenkonstellation neu. Dabei spielen die beiden Musiker mit der Gegenüberstellung von konvergenten Klang und der gezielten Kontrastierung. Neben eigenen Kompositionen widmet sich VOLGA auch Stücken aus dem reichhaltigen Vorrat an Werken von anderen Musikern,
    die für die beiden Wahl - Leipziger von persönlicher Bedeutung sind. Neben Richie Beirach und Chick Corea sind auch weniger bekannte Komponisten wie Chris Beier zu hören.VOLGA ist lyrisch verspielt,
    improvisatorisch frei, aber auch vehement energisch.`,
		links: [
			{
				type: "soundcloud",
				link: "https://soundcloud.com/olga-reznichenko/sets/volga",
			},
			{
				type: "youtube",
				link: "https://www.facebook.com/seppmaiers2raumwohnung/videos/223780339769397",
			},
		],
	},
	{
		title: `Heuken/Stadtfeld/Heigenhuber`,
		picName: "E_HeukenStadtfeldHeigenhuber.png",
		cast: ["Volker Heuken - vibraphon", "Lorenz Heigenhuber - bass", "Max Stadtfeld - drums, glockenspiel"],
		description: `Ein äußerst ungewöhnliches Trio. Das Nischeninstrument Vibraphon kommt im Jazz immer nur am Rande vor. Hier steht es allerdings im Mittelpunkt. Mal als Melodie-, mal als Harmonieinstrument aber immer als Dreh und Angelpunkt dieses Leipziger Trios. Die Band erforscht zum einen mehr oder weniger bekannte Songs aus Jazz und Pop, zum anderen widmet es sich den Kompositionen von Volker Heuken und Max Stadtfeld, die eindeutig aus der Sprache des Jazz kommen, aber auch Ausflüchte unternehmen in konzipierte Improvisationen, Neue Musik oder konzeptionelle Komposition. 2019 gewann das Trio den Leipziger Jazznachwuchspreis.`,
		links: [
			{
				type: "youtube",
				link: "https://www.youtube.com/watch?v=_OJRoj2s9BY",
			},
			{
				type: "bandcamp",
				link: "https://heuken-stadtfeld-heigenhuber.bandcamp.com/releases",
			},
		],
	},
	{
		title: `Shepherd Moon`,
		picName: "E_ShepherdMoon.png",
		cast: ["Volker Heuken - vibraphon", "Peter Fulda - piano", "Anton Mangold - harp", "Lorenz Heigenhuber - bass", "Max Stadtfeld - drums"],
		description: `Mit aussergewöhnlicher Klanggestalt und hochmoderner Ensemblekultur erforscht Volker Heukens neues Quintett galaktische Sphären. Die bizarren Schäfermonde des Saturn bieten die Triebkräfte der vielgestaltigen und fein balancierten Musik von Volker Heukens Suite "Shepherd Moon". Peter Fuldas Suite "The Eclipse" wagt dagegen einen Blick auf Syzygien und Blutmonde. Beide Werke entlocken der Besetzung mit drei Harmonieinstrumenten unerhörte und vielschichtige Klangwelten.`,
		links: [
			{
				type: "youtube",
				link: "https://www.youtube.com/watch?v=ilXAYWhwWu8&feature=youtu.be",
			},
		],
	},
];

const Disko = [
	{
		title: `Volker Heuken\nShepherd Moon`,
		datum: "2020",
		picName: "D_ShepherdMoon.png",
		cast: ["Volker Heuken - vibraphon", "Peter Fulda - piano", "Anton Mangold - harp", "Lorenz Heigenhuber - bass", "Max Stadtfeld - drums"],
		description: `
      Erschienen 2020 bei Label11 aus Nürnberg. Aufgenommen im August 2019 beim Zikaden Festival.
      `,
		links: [
			{
				type: "order",
				link: `Hallo Volker,\n\nich hätte gerne ein Exemplar der CD "Shepherd Moon".\n\nMeine Adresse lautet:\nName:\nStrasse:\nOrt:\n\nGruß`,
			},
		],
	},
	{
		title: `Heuken/Stadtfeld/Heigenhuber\nHallungen Tapes`,
		datum: "2019",
		picName: "D_HallungenTapes.png",
		cast: ["Volker Heuken - vibraphon", "Lorenz Heigenhuber - bass", "Max Stadtfeld - drums, glockenspiel"],
		description: `Aufgenommen im Mai 2019 in Hallungen im Harz. Aufnahme und Mix von Nico Teichmann. Erhältlich nur auf Bandcamp.`,
		links: [
			{
				type: "bandcamp",
				link: "https://heuken-stadtfeld-heigenhuber.bandcamp.com/releases",
			},
		],
	},
	{
		title: `Volker Heuken Sextett\nSiblings`,
		datum: "2019",
		picName: "D_Siblings.png",
		cast: ["Julian Bossert - alt", "Antonia Hausmann - posaune", "Volker Heuken - vibraphon", "Lukas Grossmann - piano", "Alex Bayer - bass", "Jan F. Brill - drums"],
		description: `Erschienen 2019 beim Label "Float Music" aus Köln. Aufgenommen im Dezember 2018 beim BR Studio Franken.`,
		links: [
			{
				type: "order",
				link: `Hallo Volker,\n\nich hätte gerne ein Exemplar der CD "Siblings".\n\nMeine Adresse lautet:\nName:\nStrasse:\nOrt:\n\nGruß`,
			},
		],
	},
	{
		title: `Volker Heuken Sextett\nPortugal`,
		datum: "2016",
		picName: "D_Portugal.png",
		cast: ["Julian Bossert - alt", "Antonia Hausmann - posaune", "Volker Heuken - vibraphon", "Lukas Grossmann - piano", "Alex Bayer - bass", "Jan F. Brill - drums"],
		description: `
      Erschienen 2016 beim Label 11 in Nürnberg. Aufgenommen im April 2016 im realistic sound Studio in München.
      `,
		links: [
			{
				type: "order",
				link: `Hallo Volker,\n\nich hätte gerne ein Exemplar der CD "Portugal".\n\nMeine Adresse lautet:\nName:\nStrasse:\nOrt:\n\nGruß`,
			},
		],
	},
	{
		title: `Peterchens Mondfahrt\nJazz für Kids`,
		datum: "2022",
		picName: "peterchens_mondfahrt.jpg",
		cast: ["Stefan Kaminsky - Sprecher", "Damian dalla Torre - sax, flute", "Volker Heuken - vibraphon", "Carl Wittig - bass", "Johannes Koch - drums"],
		description: `
      Erschienen 2022 beim Buchfunk in Leipzig. Ein Hörspiel für Kinder, das entstanden ist aus dem Live-Programm "Peterchens Mondfahrt" für die Leipziger Jazztage 2019.
      Regie führte Fritz Dittmann, Stefan Kaminsky und Volker Heuken.`,
		links: [
			{
				type: "link",
				link: "https://www.buchfunk.de/peterchens-mondfahrt/",
				// link: `Hallo Volker,\n\nich hätte gerne ein Exemplar der CD "Peterchens Mondfahrt".\n\nMeine Adresse lautet:\nName:\nStrasse:\nOrt:\n\nGruß`
			},
		],
	},
	{
		title: `LAMA Life`,
		datum: "2016",
		picName: "D_Lama.png",
		cast: ["Joachim Lenhardt - tenor", "Volker Heuken - vibraphon", "Alex Bayer- bass", "Jan F. Brill - drums"],
		description: `Ein Live - Mitschnitt bei der Konzertreihe Brozzijazz in Nürnberg. Stücke von Thelonious Monk und Ornette Coleman. Aufgenommen und gemixt von Michael Fingerhut.`,
		links: [
			{
				type: "order",
				link: `Hallo Volker,\n\nich hätte gerne ein Exemplar der CD "LAMA Life".\n\nMeine Adresse lautet:\nName:\nStrasse:\nOrt:\n\nGruß`,
			},
		],
	},
];

const FooterButtons = [
	{
		type: "youtube",
		link: "https://www.youtube.com/channel/UCPhhYnZ7kK19wJyedkR9C3g",
	},
	{
		type: "spotify",
		link: "https://open.spotify.com/artist/7pv0ZlsoLsO02h38vM8wVq",
	},
	{
		type: "soundcloud",
		link: "https://soundcloud.com/volker-heuken",
	},
	{
		type: "bandcamp",
		link: "https://heuken-stadtfeld-heigenhuber.bandcamp.com/releases",
	},
	{
		type: "instagram",
		link: "https://www.instagram.com/heukenvolker/",
	},
	{
		type: "facebook",
		link: "https://www.facebook.com/volker.heuken",
	},
];

// Colors for the niceness of the page
const ColorScheme = {
	lightmode: {
		txtMain: [0, 100, 0], // Akzentfarbe light:'#c2bebc'
		bgcBackground: [0, 0, 99], //light:'#e6e6e6'
		txtBackground: [0, 100, 0],
	},
	darkmode: {
		txtMain: [0, 100, 100], // Akzentfarbe dark: '#c2bebc'
		bgcBackground: [60, 0, 10], // General Background dark: '#1a1a1a'
		txtBackground: [0, 100, 100],
	},
	darkmodeOn: false,
};
