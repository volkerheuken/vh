// https://abcnotation.com/wiki/abc:standard:v2.1
// https://www.abcjs.net/abcjs-editor.html
// http://www.lehrklaenge.de/PHP/Grundlagen/Notenschluessel.php
// https://soundprogramming.net/file-formats/midi-note-ranges-of-orchestral-instruments/
// https://de.wikipedia.org/wiki/Liste_musikalischer_Symbole
// https://musescore.org/sl/instruments
// https://cyrusn.github.io/note/abcjs/

// https://abcnotation.com/wiki/abc:standard:v2.1
const ocjeneSubgrid = [
	["cl_OcjeneSheet", "right", "start"],
	["cl_OcjeneLevelHeader", "left", "end"],
	["cl_OcjeneLevelselect1", "left"],
	["cl_OcjeneLevelselect2", "left"],
	["cl_OcjeneSongHeader", "left", "end"],
	["cl_OcjeneRhytmusHeader", "left", "end"],
	["cl_OcjeneMelodieHeader", "left", "end"],
	["cl_OcjeneNotenwert1", "left"],
	["cl_OcjeneNotenwert2", "left"],
	["cl_OcjeneNotenwert4", "left"],
	["cl_OcjeneNotenwert8", "left"],
	["cl_OcjeneNotenwert16", "left"],
	["cl_OcjeneNotenwert32", "left"],
	["cl_OcjeneDotted", "left"],
	["cl_OcjeneTriplet", "left"],
	["cl_OcjeneBarOverflowStop", "left"],
	["cl_OcjeneMetronome", "left"],
	["cl_OcjeneShowText", "left"],
	["cl_OcjeneTextLanguage", "left"],
	["cl_OcjeneInstrument", "left"],
	["cl_OcjeneInterval", "left"],
	["cl_OcjeneClefs", "left"],
	["cl_OcjeneKeySignature", "left"],
	["cl_OcjeneKey", "left"],
	["cl_OcjeneKeyOnly", "left"],
	["cl_OcjeneTimeSignature", "left"],
	["cl_OcjeneTempo", "left"],
	["cl_OcjeneBars", "left"],
	["cl_OcjeneLimitRange", "left"],
	["cl_OcjeneRests", "left"],
	["cl_OcjeneGenerate", "left", "end"],
];

const ocjeneOptions = {
	get div() {
		return "idCanv_ocjeneSheet";
	},
	get audio() {
		return "#idCanv_ocjeneAudio";
	},
	division: 576,
	notenwerte: {
		selected: [],
		selectedOrig: [0, 1, 1, 1, 0, 0], //1/1, 1/2, 1/4, 1/8, 1/16, 1/32
		quaternote: 144,
		noteArrays: {
			base: [576, 288, 144, 72, 36, 18],
			triplet: [null, 192, 96, 48, 24, 12],
			dotted: [null, 432, 216, 108, 54, 27],
		},
		get min() {
			return this.selected.findLastIndex((i) => i > 0);
		},
	},
	dotted: {
		state: false,
		stateOrig: false,
		probability: 0.15,
		val: 0,
		valOrig: 0,
		min: 0,
		max: 20,
	},
	triplet: {
		state: false,
		stateOrig: true,
		probability: 0.15,
		val: 0,
		valOrig: 0,
		min: 0,
		max: 20,
	},
	rests: {
		val: 0,
		valOrig: 0,
		min: 0,
		max: 50,
	},
	timeSignature: {
		index: 0,
		indexOrig: 3,
		get currSignature() {
			return ocjeneOptions.definitions.timeSignatures[this.index];
		},
	},
	interval: {
		val: 0,
		valOrig: 4,
	},
	tempo: {
		val: 0,
		valOrig: 95,
		min: 60,
		max: 210,
	},
	bars: {
		val: 0,
		valOrig: 8,
		max: 16,
	},
	barOverflowStop: {
		state: true,
		stateOrig: true,
	},
	metronome: {
		state: false,
		stateOrig: false,
		val: 0,
		valOrig: 0,
		min: 0,
		max: 2,
	},
	showText: {
		state: false,
		stateOrig: false,
	},
	textLanguage: {
		index: 0,
		indexOrig: 5, //navigator.language == "de"
		name(index = null) {
			const id = index == null ? this.index : index;
			let code = Object.keys(ocjeneOptions.definitions.notes.textLanguage)[id];
			return Data_Country_CodesIso639.get(code);
		},
		val(index = null) {
			const id = index == null ? this.index : index;
			return Object.keys(ocjeneOptions.definitions.notes.textLanguage)[id];
		},
	},
	clef: {
		index: 0,
		indexOrig: 0,
		name(index = null) {
			if (index == null) return Object.keys(ocjeneOptions.definitions.clefs)[this.index];
			return Object.keys(ocjeneOptions.definitions.clefs)[index];
		},
		val(index = null) {
			if (index == null) {
				return ocjeneOptions.definitions.clefs[Object.keys(ocjeneOptions.definitions.clefs)[this.index]];
			}
			return ocjeneOptions.definitions.clefs[Object.keys(ocjeneOptions.definitions.clefs)[this.index]];
		},
	},
	keySignatures: {
		index: 0,
		indexOrig: 0,
	},
	keys: {
		index: 0,
		indexOrig: 0,
		get current() {
			return ocjeneOptions.definitions.keys[ocjeneOptions.keys.index][ocjeneOptions.keySignatures.index];
		},
		get shiftDir() {
			return ocjeneOptions.keys.index <= 7 ? -1 : 1;
		},
	},
	keyOnly: {
		state: true,
		stateOrig: true,
	},
	limitRange: {
		state: true,
		stateOrig: true,
		base: 69,
	},
	variables: {
		rangeOffset: {
			val: 8,
			valOrig: 8,
		},
		firstPitchIterations: {
			val: 0,
			valOrig: 8,
		},
	},
	definitions: {
		notes: {
			abcJSBasenotes: ["C", "D", "E", "F", "G", "A", "B", "^C", "^D", "^F", "^G", "^A", "_D", "_E", "_G", "_A", "_B"],
			A: [
				"A,,,,",
				"^A,,,,",
				"B,,,,",
				"C,,,",
				"^C,,,",
				"D,,,",
				"^D,,,",
				"E,,,",
				"F,,,",
				"^F,,,",
				"G,,,",
				"^G,,,",
				"A,,,",
				"^A,,,",
				"B,,,",
				"C,,",
				"^C,,",
				"D,,",
				"^D,,",
				"E,,",
				"F,,",
				"^F,,",
				"G,,",
				"^G,,",
				"A,,",
				"^A,,",
				"B,,",
				"C,",
				"^C,",
				"D,",
				"^D,",
				"E,",
				"F,",
				"^F,",
				"G,",
				"^G,",
				"A,",
				"^A,",
				"B,",
				"C",
				"^C",
				"D",
				"^D",
				"E",
				"F",
				"^F",
				"G",
				"^G",
				"A",
				"^A",
				"B",
				"c",
				"^c",
				"d",
				"^d",
				"e",
				"f",
				"^f",
				"g",
				"^g",
				"a",
				"^a",
				"b",
				"c'",
				"^c'",
				"d'",
				"^d'",
				"e'",
				"f'",
				"^f'",
				"g'",
				"^g'",
				"a'",
				"^a'",
				"b'",
				"c''",
				"^c''",
				"d''",
				"^d''",
				"e''",
				"f''",
				"^f''",
				"g''",
				"^g''",
				"a''",
				"^a''",
				"b''",
				"c'''",
			],
			B: [
				"A,,,,",
				"_B,,,,",
				"B,,,,",
				"C,,,",
				"_D,,,",
				"D,,,",
				"_E,,,",
				"E,,,",
				"F,,,",
				"_G,,,",
				"G,,,",
				"_A,,,",
				"A,,,",
				"_B,,,",
				"B,,,",
				"C,,",
				"^C,,",
				"D,,",
				"_E,,",
				"E,,",
				"F,,",
				"_G,,",
				"G,,",
				"_A,,",
				"A,,",
				"_B,,",
				"B,,",
				"C,",
				"_D,",
				"D,",
				"_E,",
				"E,",
				"F,",
				"_G,",
				"G,",
				"_A,",
				"A,",
				"_B,",
				"B,",
				"C",
				"_D",
				"D",
				"_E",
				"E",
				"F",
				"_G",
				"G",
				"_A",
				"A",
				"_B",
				"B",
				"c",
				"_d",
				"d",
				"_e",
				"e",
				"f",
				"_g",
				"g",
				"_a",
				"a",
				"_b",
				"b",
				"c'",
				"_d'",
				"d'",
				"_e'",
				"e'",
				"f'",
				"_g'",
				"g'",
				"_a'",
				"a'",
				"_b'",
				"b'",
				"c''",
				"_d''",
				"d''",
				"_e''",
				"e''",
				"f''",
				"_g''",
				"g''",
				"_a''",
				"a''",
				"_b''",
				"b''",
				"c'''",
			],
			midi: [
				21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93,
				94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108,
			],
			textLanguage: {
				//Data_Country_CodesIso639
				en: ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"],
				nl: ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"],
				"zh-cn": ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"],
				"zh-tw": ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"],
				"zh-hk": ["C", "D", "E", "F", "G", "A", "B", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "Bb"],
				de: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				da: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				nb: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				sv: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				pl: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				sk: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				cs: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				sr: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				hr: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				hu: ["C", "D", "E", "F", "G", "A", "H", "C#", "D#", "F#", "G#", "A#", "Db", "Eb", "Gb", "Ab", "H"],
				fr: ["do", "ré", "mi", "fa", "sol", "la", "si", "do dièse", "ré dièse", "fa dièse", "sol dièse", "la dièse", "ré bémol", "mi bémol", "sol bémol", "la bémol", "si bémol"],
				it: ["do", "ré", "mi", "fa", "sol", "la", "si", "do dièse", "ré diesis", "fa diesis", "sol diesis", "la diesis", "ré bemolle", "mi bemolle", "sol bemolle", "la bemolle", "si bemolle"],
				es: ["do", "ré", "mi", "fa", "sol", "la", "si", "do sostenido", "ré sostenido", "fa sostenido", "sol sostenido", "la sostenido", "ré bemol", "mi bemol", "sol bemol", "la bemol", "si bemol"],
				ro: ["do", "ré", "mi", "fa", "sol", "la", "si", "do diez", "ré diez", "fa diez", "sol diez", "la diez", "ré bemol", "mi bemol", "sol bemol", "la bemol", "si bemol"],
				lv: ["do", "ré", "mi", "fa", "sol", "la", "si", "do diez", "ré diez", "fa diez", "sol diez", "la diez", "ré bemol", "mi bemol", "sol bemol", "la bemol", "si bemol"],
				pt: ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si", "Dó sustenido", "Ré sustenido", "Fá sustenido", "Sol sustenido", "Lá sustenido", "Si sustenido", "Ré bemol", "Mi bemol", "Sol bemol", "Lá bemol", "Si bemol"],
				bg: ["до", "ре", "ми", "фа", "сол", "ла", "си", "д диезо", "ре диез", "фа диез", "сол диез", "ла диез", "ре бемол", "ми бемол", "сол бемол", "ла бемол", "си бемол"],
				ru: ["до", "ре", "ми", "фа", "соль", "ля", "си", "до диез", "ре диез", "фа диез", "соль диез", "ля диез", "ре бемоль", "ми бемоль", "соль бемоль", "ля бемоль", "си бемоль"],
				el: ["Ντο", "Ρε", "Μι", "Φα", "Σολ", "Λα", "Σι", "Ντο δίεση", "Ρε δίεση", "Φα δίεση", "Σολ δίεση", "Λα δίεση", "Ρε ύφεση", "Μι ύφεση", "Σολ ύφεση", "Λα ύφεση", "Σι ύφεση"],
				ja: ["ハ", "ニ", "ホ", "ヘ", "ト", "イ", "ロ", "嬰ハ", "嬰ニ", "嬰ヘ", "嬰ト", "嬰イ", "変ニ", "変ホ", "変ト", "変イ", "変ロ"],
			},
			getTextLanguageArray(index) {
				const code = Object.keys(this.textLanguage)[index];
				return this.textLanguage[code];
			},
			getTextLanguageNoteIndex(note) {
				return this.abcJSBasenotes.indexOf(note);
			},
			get ABCJSnotes() {
				const p = ocjeneOptions.keys.index <= 7 ? "A" : "B";
				return this[p];
			},
		},
		clefs: {
			Violin: "treble",
			Sopran: "alto1",
			Mezzosopran: "alto2",
			Alto: "alto",
			Tenor: "tenor",
			Bariton: "bass3",
			Bass: "bass",
		},
		timeSignatures: [
			[2, 2],
			[2, 4],
			[3, 4],
			[4, 4],
			[5, 4],
			[3, 8],
			[6, 8],
			[7, 8],
			[9, 8],
			[12, 8],
		],
		keySignatures: ["Dur", "Moll"],
		keys: [
			["C", "Am", []],
			["G", "Em", [6]],
			["D", "Bm", [6, 1]],
			["A", "F#m", [6, 1, 8]],
			["E", "C#m", [6, 1, 8, 3]],
			["B", "G#m", [6, 1, 8, 3, 10]],
			["F#", "D#m", [6, 1, 8, 3, 10]],
			["C#", "A#m", [6, 1, 8, 3, 10]],
			["F", "Dm", [10]],
			["Bb", "Gm", [10, 3]],
			["Eb", "Cm", [10, 3, 8]],
			["Ab", "Fm", [10, 3, 8, 1]],
			["Db", "Bbm", [10, 3, 8, 1, 6]],
			["Gb", "Ebm", [10, 3, 8, 1, 6]],
			["Cb", "Abm", [10, 3, 8, 1, 6]],
		],
		accidentals: [1, 3, 6, 8, 10],
		notAccidentals: [0, 2, 4, 5, 7, 9, 11],
		get keyAccidentals() {
			return ocjeneOptions.definitions.keys[ocjeneOptions.keys.index][2];
		},
	},
};

const ocjeneInstruments = {
	index: 0,
	indexOrig: 0,
	get instrument() {
		return this.data[this.index];
	},
	get firstPitch() {
		return randomObjectCentered(this.getRange.lower, this.getRange.upper, ocjeneOptions.variables.firstPitchIterations.val);
	},
	get getRange() {
		if (!ocjeneOptions.limitRange.state) {
			return this.instrument.range;
		}
		const base = ocjeneOptions.limitRange.base - 3 * ocjeneOptions.clef.index;
		return {
			lower: Math.max(this.instrument.range.lower, base - ocjeneOptions.variables.rangeOffset.val),
			upper: Math.min(this.instrument.range.upper, base + ocjeneOptions.variables.rangeOffset.val),
		};
	},
	// midi: [
	// 	[0, "acoustic_grand_piano"],
	// 	[1, "bright_acoustic_piano"],
	// 	[2, "electric_grand_piano"],
	// 	[3, "honkytonk_piano"],
	// 	[4, "electric_piano_1"],
	// 	[5, "electric_piano_2"],
	// 	[6, "harpsichord"],
	// 	[7, "clavinet"],
	// 	[8, "celesta"],
	// 	[9, "glockenspiel"],
	// 	[10, "music_box"],
	// 	[11, "vibraphone"],
	// 	[12, "marimba"],
	// 	[13, "xylophone"],
	// 	[14, "tubular_bells"],
	// 	[15, "dulcimer"],
	// 	[16, "drawbar_organ"],
	// 	[17, "percussive_organ"],
	// 	[18, "rock_organ"],
	// 	[19, "church_organ"],
	// 	[20, "reed_organ"],
	// 	[21, "accordion"],
	// 	[22, "harmonica"],
	// 	[23, "tango_accordion"],
	// 	[24, "acoustic_guitar_nylon"],
	// 	[25, "acoustic_guitar_steel"],
	// 	[26, "electric_guitar_jazz"],
	// 	[27, "electric_guitar_clean"],
	// 	[28, "electric_guitar_muted"],
	// 	[29, "overdriven_guitar"],
	// 	[30, "distortion_guitar"],
	// 	[31, "guitar_harmonics"],
	// 	[32, "acoustic_bass"],
	// 	[33, "electric_bass_finger"],
	// 	[34, "electric_bass_pick"],
	// 	[35, "fretless_bass"],
	// 	[36, "slap_bass_1"],
	// 	[37, "slap_bass_2"],
	// 	[38, "synth_bass_1"],
	// 	[39, "synth_bass_2"],
	// 	[40, "violin"],
	// 	[41, "viola"],
	// 	[42, "cello"],
	// 	[43, "contrabass"],
	// 	[44, "tremolo_strings"],
	// 	[45, "pizzicato_strings"],
	// 	[46, "orchestral_harp"],
	// 	[47, "timpani"],
	// 	[48, "string_ensemble_1"],
	// 	[49, "string_ensemble_2"],
	// 	[50, "synth_strings_1"],
	// 	[51, "synth_strings_2"],
	// 	[52, "choir_aahs"],
	// 	[53, "voice_oohs"],
	// 	[54, "synth_choir"],
	// 	[55, "orchestra_hit"],
	// 	[56, "trumpet"],
	// 	[57, "trombone"],
	// 	[58, "tuba"],
	// 	[59, "muted_trumpet"],
	// 	[60, "french_horn"],
	// 	[61, "brass_section"],
	// 	[62, "synth_brass_1"],
	// 	[63, "synth_brass_2"],
	// 	[64, "soprano_sax"],
	// 	[65, "alto_sax"],
	// 	[66, "tenor_sax"],
	// 	[67, "baritone_sax"],
	// 	[68, "oboe"],
	// 	[69, "english_horn"],
	// 	[70, "bassoon"],
	// 	[71, "clarinet"],
	// 	[72, "piccolo"],
	// 	[73, "flute"],
	// 	[74, "recorder"],
	// 	[75, "pan_flute"],
	// 	[76, "blown_bottle"],
	// 	[77, "shakuhachi"],
	// 	[78, "whistle"],
	// 	[79, "ocarina"],
	// 	[80, "lead_1_square"],
	// 	[81, "lead_2_sawtooth"],
	// 	[82, "lead_3_calliope"],
	// 	[83, "lead_4_chiff"],
	// 	[84, "lead_5_charang"],
	// 	[85, "lead_6_voice"],
	// 	[86, "lead_7_fifths"],
	// 	[87, "lead_8_bass_lead"],
	// 	[88, "pad_1_new_age"],
	// 	[89, "pad_2_warm"],
	// 	[90, "pad_3_polysynth"],
	// 	[91, "pad_4_choir"],
	// 	[92, "pad_5_bowed"],
	// 	[93, "pad_6_metallic"],
	// 	[94, "pad_7_halo"],
	// 	[95, "pad_8_sweep"],
	// 	[96, "fx_1_rain"],
	// 	[97, "fx_2_soundtrack"],
	// 	[98, "fx_3_crystal"],
	// 	[99, "fx_4_atmosphere"],
	// 	[100, "fx_5_brightness"],
	// 	[101, "fx_6_goblins"],
	// 	[102, "fx_7_echoes"],
	// 	[103, "fx_8_scifi"],
	// 	[104, "sitar"],
	// 	[105, "banjo"],
	// 	[106, "shamisen"],
	// 	[107, "koto"],
	// 	[108, "kalimba"],
	// 	[109, "bagpipe"],
	// 	[110, "fiddle"],
	// 	[111, "shanai"],
	// 	[112, "tinkle_bell"],
	// 	[113, "agogo"],
	// 	[114, "steel_drums"],
	// 	[115, "woodblock"],
	// 	[116, "taiko_drum"],
	// 	[117, "melodic_tom"],
	// 	[118, "synth_drum"],
	// 	[119, "reverse_cymbal"],
	// 	[120, "guitar_fret_noise"],
	// 	[121, "breath_noise"],
	// 	[122, "seashore"],
	// 	[123, "bird_tweet"],
	// 	[124, "telephone_ring"],
	// 	[125, "helicopter"],
	// 	[126, "applause"],
	// 	[127, "gunshot"],
	// 	[128, "percussion"],
	// ],
	data: [
		{
			Name: "Klavier",
			group: "Strings",
			midiInstrumentIndex: 0,
			range: {
				lower: 33,
				upper: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Geige",
			group: "Strings",
			midiInstrumentIndex: 40,
			range: {
				lower: 55,
				upper: 103,
			},
			clef: "Violin",
		},
		{
			Name: "Viola",
			group: "Strings",
			midiInstrumentIndex: 41,
			range: {
				lower: 48,
				upper: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Cello",
			group: "Strings",
			midiInstrumentIndex: 42,
			range: {
				lower: 36,
				upper: 76,
			},
			clef: "Violin",
		},
		{
			Name: "Kontrabass",
			group: "Strings",
			midiInstrumentIndex: 43,
			range: {
				lower: 28,
				upper: 67,
			},
			clef: "Bass",
		},
		{
			Name: "Bassgitarre",
			group: "Strings",
			midiInstrumentIndex: 32,
			range: {
				lower: 28,
				upper: 67,
			},
			clef: "Bass",
		},
		{
			Name: "Gitarre",
			group: "Strings",
			midiInstrumentIndex: 24,
			range: {
				lower: 40,
				upper: 88,
			},
			clef: "Violin",
		},
		{
			Name: "Tuba",
			group: "Brass",
			midiInstrumentIndex: 58,
			range: {
				lower: 28,
				upper: 58,
			},
			clef: "Bass",
		},
		{
			Name: "Bassposaune",
			group: "Brass",
			midiInstrumentIndex: 57,
			range: {
				lower: 34,
				upper: 67,
			},
			clef: "Bass",
		},
		{
			Name: "Posaune",
			group: "Brass",
			midiInstrumentIndex: 57,
			range: {
				lower: 40,
				upper: 72,
			},
			clef: "Bass",
		},
		{
			Name: "Flügelhorn",
			group: "Brass",
			midiInstrumentIndex: 57,
			range: {
				lower: 34,
				upper: 77,
			},
			clef: "Violin",
		},
		{
			Name: "Trompete",
			group: "Brass",
			midiInstrumentIndex: 56,
			range: {
				lower: 55,
				upper: 82,
			},
			clef: "Violin",
		},
		{
			Name: "Piccoloflöte",
			group: "Woodwinds",
			midiInstrumentIndex: 72,
			range: {
				lower: 74,
				upper: 102,
			},
			clef: "Violin",
		},
		{
			Name: "Flöte",
			group: "Woodwinds",
			midiInstrumentIndex: 74,
			range: {
				lower: 60,
				upper: 96,
			},
			clef: "Violin",
		},
		{
			Name: "Oboe",
			group: "Woodwinds",
			midiInstrumentIndex: 68,
			range: {
				lower: 58,
				upper: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Altflöte",
			group: "Woodwinds",
			midiInstrumentIndex: 68,
			range: {
				lower: 55,
				upper: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Englischhorn",
			group: "Woodwinds",
			midiInstrumentIndex: 69,
			range: {
				lower: 52,
				upper: 81,
			},
			clef: "Violin",
		},
		{
			Name: "Klarinette",
			group: "Woodwinds",
			midiInstrumentIndex: 71,
			range: {
				lower: 50,
				upper: 94,
			},
			clef: "Violin",
		},
		{
			Name: "Bassklarinette",
			group: "Woodwinds",
			midiInstrumentIndex: 71,
			range: {
				lower: 38,
				upper: 77,
			},
			clef: "Violin",
		},
		{
			Name: "Fagott",
			group: "Woodwinds",
			midiInstrumentIndex: 70,
			range: {
				lower: 34,
				upper: 75,
			},
			clef: "Bass",
		},
		{
			Name: "Kontrafagott",
			group: "Woodwinds",
			midiInstrumentIndex: 70,
			range: {
				lower: 22,
				upper: 53,
			},
			clef: "Bass",
		},
		{
			Name: "Sopranblockflöte",
			group: "Woodwinds",
			midiInstrumentIndex: 74,
			range: {
				lower: 72,
				upper: 98,
			},
			clef: "Violin",
		},
		{
			Name: "Altblockflöte",
			group: "Woodwinds",
			midiInstrumentIndex: 74,
			range: {
				lower: 65,
				upper: 91,
			},
			clef: "Violin",
		},
		{
			Name: "Tenorblockflöte",
			group: "Woodwinds",
			midiInstrumentIndex: 74,
			range: {
				lower: 60,
				upper: 86,
			},
			clef: "Violin",
		},
		{
			Name: "Bassblockflöte",
			group: "Woodwinds",
			midiInstrumentIndex: 74,
			range: {
				lower: 53,
				upper: 79,
			},
			clef: "Bass",
		},
		{
			Name: "Baritonsaxophon",
			group: "Woodwinds",
			midiInstrumentIndex: 67,
			range: {
				lower: 36,
				upper: 69,
			},
			clef: "Violin",
		},
		{
			Name: "Tenorsaxophon",
			group: "Woodwinds",
			midiInstrumentIndex: 66,
			range: {
				lower: 44,
				upper: 76,
			},
			clef: "Violin",
		},
		{
			Name: "Altsaxophon",
			group: "Woodwinds",
			midiInstrumentIndex: 65,
			range: {
				lower: 49,
				upper: 81,
			},
			clef: "Violin",
		},
		{
			Name: "Sopranosaxophon",
			group: "Woodwinds",
			midiInstrumentIndex: 64,
			range: {
				lower: 56,
				upper: 88,
			},
			clef: "Violin",
		},
		{
			Name: "Glockenspiel",
			group: "Percussion",
			midiInstrumentIndex: 9,
			range: {
				lower: 79,
				upper: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Xylophon",
			group: "Percussion",
			midiInstrumentIndex: 13,
			range: {
				lower: 65,
				upper: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Vibraphon",
			group: "Percussion",
			midiInstrumentIndex: 11,
			range: {
				lower: 53,
				upper: 89,
			},
			clef: "Violin",
		},
		{
			Name: "Marimba",
			group: "Percussion",
			midiInstrumentIndex: 12,
			range: {
				lower: 45,
				upper: 96,
			},
			clef: "Violin",
		},
		{
			Name: "Bass Marimba",
			group: "Percussion",
			midiInstrumentIndex: 12,
			range: {
				lower: 33,
				upper: 81,
			},
			clef: "Violin",
		},
		{
			Name: "Celesta",
			group: "Percussion",
			midiInstrumentIndex: 8,
			range: {
				lower: 60,
				upper: 108,
			},
			clef: "Violin",
		},
		{
			Name: "Röhrenglocken",
			group: "Percussion",
			midiInstrumentIndex: 14,
			range: {
				lower: 60,
				upper: 77,
			},
			clef: "Violin",
		},
		{
			Name: "Pauken",
			group: "Percussion",
			midiInstrumentIndex: 47,
			range: {
				lower: 40,
				upper: 55,
			},
			clef: "Bass",
		},
		{
			Name: "Cembalo",
			group: "Percussion",
			midiInstrumentIndex: 6,
			range: {
				lower: 29,
				upper: 89,
			},
			clef: "Violin",
		},
		{
			Name: "Harfe",
			group: "Percussion",
			midiInstrumentIndex: 46,
			range: {
				lower: 24,
				upper: 103,
			},
			clef: "Violin",
		},
	],
};

const ocjeneSong = {
	spread: 4,
	title: "",
	author: "",
	get header() {
		const config = {
			T: `${firstLetterCap(this.title)}`, //Title --- shot bars:    \n%%barnumbers 1
			C: `Musik: ${this.author}`, //Author
			// S: `${new Date().getFullYear()}, Khage`, // copyright
			M: ocjeneOptions.timeSignature.currSignature.join("/"), //Taktart
			L: `1/${ocjeneOptions.division}`, // kleinster Notenwert
			Q: `1/4=${ocjeneOptions.tempo.val}`, // tempo
			K: `${ocjeneOptions.keys.current} clef=${ocjeneOptions.clef.val()}`, //  Tonart, Reihenfolge wichtig!
		};
		const options = ["%score Melody"];
		const text =
			Object.entries(config)
				.map(([key, value]) => `${key}:${value}\n`)
				.join("") +
			options.join("\n") +
			"\n";
		return text;
	},
	get songlength() {
		return ocjeneOptions.bars.val * this.barLength;
	},
	get remainingSongLength() {
		return this.songlength - this.currentSongLength;
	},
	currentSongLength: 0,
	get barLength() {
		return ocjeneOptions.timeSignature.currSignature[0] * (ocjeneOptions.division / ocjeneOptions.timeSignature.currSignature[1]);
	},
	get remainingBarLength() {
		return this.barLength - (ocjeneSong.currentSongLength % this.barLength);
	},
	noteData: [],
	abcJSSong: "",
	abcJSText: "",
	getData() {
		let song = "";
		let text = "";
		for (let n of ocjeneSong.noteData) {
			song += n.abcJSPitch;
			text += n.translateText();
		}
		song += "|]";
		text += "]";
		ocjeneSong.abcJSSong = song;
		ocjeneSong.abcJSText = text;
	},
	abcCanvas: null,
	synthControl: null,
	synthOptions: {
		displayLoop: true,
		displayRestart: true,
		displayPlay: true,
		displayProgress: true,
		displayWarp: false,
		get program() {
			return ocjeneInstruments.instrument.midiInstrumentIndex;
		},
		get drumIntro() {
			return 0; //ocjeneOptions.metronome.val;
		},
		get drum() {
			if (!ocjeneOptions.metronome.state) return null;
			const metronomePattern = [
				"dddd 76 77 77 77 70 50 60 40", // 2/2
				"dd 76 77 70 40", // 2/4
				"ddd 76 77 77 70 50 40", // 3/4
				"dddd 76 77 77 77 70 40 50 40", // 4/4
				"ddddd 76 77 77 77 77 70 40 40 60 40", // 5/4
				"d72d72d72 76 77 77 70 50 40", // 3/8
				"d72d72d72d72d72d72 76 77 77 76 77 77 70 50 40 50 50 40", // 6/8
				"d72d72d72d72d72d72d72 76 77 77 76 77 76 77 70 50 40 50 40 50 40", // 7/8
				"d72d72d72d72d72d72d72d72d72 76 77 77 76 77 77 76 77 77 70 50 40 50 50 40 50 50 40", // 9/8
				"d72d72d72d72d72d72d72d72d72d72d72d72 76 77 77 76 77 77 76 77 77 76 77 77 70 50 40 50 50 40 50 50 40 50 50 40", // 12/8
			];
			return metronomePattern[ocjeneOptions.timeSignature.index];
		},
	},
	midiBuffer: null,
	cursorControl: new ocjeneCursorControl(),
	startTune() {
		ocjeneSong.synthControl.disable(true);
		ocjeneSong.midiBuffer = new ABCJS.synth.CreateSynth();
		ocjeneSong.midiBuffer
			.init({
				visualObj: ocjeneSong.abcCanvas,
			})
			.then(function (response) {
				if (ocjeneSong.synthControl) {
					ocjeneSong.synthControl
						.setTune(ocjeneSong.abcCanvas, false, ocjeneSong.synthOptions)
						.then(function (response) {
							// console.log("Audio successfully loaded.", response);
						})
						.catch(function (error) {
							console.warn("Audio problem:", error);
						});
				}
			})
			.catch(function (error) {
				console.warn("Audio problem:", error);
			});
	},
};

class ocjeneNote {
	constructor(type, duration, timeStamp, tripletIndex, splitIndex = null, splitMidiPitch = null) {
		this.abcJSPitch = null;
		this.midiPitch = null;
		this.resolved = false;
		this.type = type;
		this.duration = duration;
		this.timeStamp = timeStamp;
		this.tripletIndex = tripletIndex;
		this.splitIndex = splitIndex;
		this.spaceStembar = false;
		this.slur = null;
		this.addToSongData();
		this.createPitch(splitMidiPitch);
		this.checkSplit();
		this.checkSpace();
		this.translatePitch();
	}
	pitchIndex() {
		return this.midiPitch % 12;
	}
	addToSongData() {
		if (this.splitIndex == null) {
			ocjeneSong.noteData.push(this);
			ocjeneSong.currentSongLength += this.duration;
		} else {
			ocjeneSong.noteData.splice(this.splitIndex, 1, this);
		}
	}
	getDataIndex() {
		return ocjeneSong.noteData.findIndex((obj) => obj === this);
	}
	getDurationIndex() {
		return ocjeneOptions.notenwerte.noteArrays[this.type].indexOf(this.duration);
	}
	checkSplit() {
		if (this.type == "triplet") return;
		if (!ocjeneOptions.barOverflowStop.state && this.isCrossingBar()) {
			const barStamp = (this.getBar() + 1) * ocjeneSong.barLength;
			const tsEnd = this.timeStamp + this.duration;
			const newDuration = barStamp - this.timeStamp;
			const addedNoteDuration = tsEnd - barStamp;
			// console.log("split");
			this.split(newDuration, addedNoteDuration);
			return;
		}

		if (this.getDurationIndex() < 3) {
			if (this.timeStamp % ocjeneOptions.notenwerte.quaternote != 0) {
				const newDuration = this.timeStamp % ocjeneOptions.notenwerte.quaternote;
				const addedNoteDuration = this.duration - newDuration;
				this.split(newDuration, addedNoteDuration);
				return;
			}
		}
	}
	split(newDuration, addedNoteDuration) {
		this.duration = newDuration;
		this.slur = true;
		let ts = this.timeStamp + newDuration;
		new ocjeneNote(this.type, addedNoteDuration, ts, 0, this.getDataIndex() + 1, this.midiPitch);
	}
	checkSpace() {
		const dIndex = this.getDurationIndex();
		if (dIndex < 3) return;
		if (this.type == "triplet") return;
		if (this.midiPitch == null) return (this.spaceStembar = true);

		const num = ocjeneOptions.timeSignature.currSignature[0];
		const den = ocjeneOptions.timeSignature.currSignature[1];
		let splitTime;
		let dIndexMultiplyer = dIndex - 2;
		if (dIndex == 3 && den % num == 0) dIndexMultiplyer = dIndex - 1;
		if ((num * den) % 3 == 0) {
			splitTime = this.duration * 3 * dIndexMultiplyer;
		} else {
			splitTime = this.duration * 2 * dIndexMultiplyer;
		}
		if (this.timeStamp % splitTime == 0) this.spaceStembar = true;
	}
	getBar(offset = 0) {
		return Math.floor((this.timeStamp + offset) / ocjeneSong.barLength);
	}
	isCrossingBar() {
		return this.getBar() != this.getBar(this.duration - 1);
	}
	isOnNewBar() {
		if (this.timeStamp == 0) return false;
		let a = this.timeStamp % ocjeneSong.barLength == 0;
		return this.timeStamp % ocjeneSong.barLength == 0;
	}

	static isAccidental(pitch) {
		return ocjeneOptions.definitions.accidentals.includes(pitch % 12);
	}
	static getBaseKey(pitch) {
		let state = ocjeneNote.isAccidental(pitch);
		if (!state) return pitch;
		return (pitch += ocjeneOptions.keys.shiftDir);
	}
	static isBaseKey(pitch) {
		let base = ocjeneNote.getBaseKey(pitch);
		return pitch == base;
	}

	createPitch(splitMidiPitch) {
		if (splitMidiPitch) {
			this.midiPitch = splitMidiPitch;
			return;
		}
		const lastNoteIndex = ocjeneSong.noteData.findLastIndex((n) => n.midiPitch != null);
		if (lastNoteIndex == -1) {
			this.midiPitch = ocjeneInstruments.firstPitch;
		} else {
			const prevPitch = ocjeneSong.noteData[lastNoteIndex].midiPitch;
			const interval = randomObject(ocjeneOptions.interval.val * -1, ocjeneOptions.interval.val);
			const nextPitch = prevPitch + interval;
			if (nextPitch < ocjeneInstruments.getRange.lower) this.midiPitch = prevPitch + Math.abs(interval);
			else if (nextPitch > ocjeneInstruments.getRange.upper) this.midiPitch = prevPitch - Math.abs(interval);
			else this.midiPitch = nextPitch;
		}
		// correct Pitch if "keyOnly"
		if (ocjeneOptions.keyOnly.state) {
			this.midiPitch = ocjeneNote.getBaseKey(this.midiPitch);
		}
		this.createRest();
	}

	createRest() {
		const prevPitch = this.getDataIndex() == 0 ? ocjeneSong.noteData[0].midiPitch : ocjeneSong.noteData[this.getDataIndex() - 1].midiPitch;
		if (prevPitch == null) return;
		if (Math.random() * 100 < ocjeneOptions.rests.val) this.midiPitch = null;
	}

	translatePitch() {
		const midiIndex = ocjeneOptions.definitions.notes.midi.indexOf(this.midiPitch);
		let pitch = this.midiPitch == null ? "z" : ocjeneOptions.definitions.notes.ABCJSnotes[midiIndex];
		let duration = this.duration;

		let prefix = this.isOnNewBar() ? " |" : "";
		prefix += this.spaceStembar ? " " : "";
		let postfix = this.slur ? "-" : "";
		if (this.type == "triplet") {
			const durationIndex = this.getDurationIndex();
			prefix += this.tripletIndex == 0 ? " (3" : "";
			postfix = this.tripletIndex == 2 ? " " : "";
			duration = ocjeneOptions.notenwerte.noteArrays.base[durationIndex];
		}
		if (this.resolved) {
			pitch = pitch.replace(/[\^_]/, "");
			pitch = `=${pitch}`;
		}
		this.abcJSPitch = `${prefix}${pitch}${duration}${postfix}`;
	}
	translateText() {
		if (this.midiPitch == null) return "";
		if (this.getDataIndex() > 0 && !this.isOnNewBar() && ocjeneSong.noteData[this.getDataIndex() - 1].slur == true) return "* ";

		// clean Notetext
		const midiIndex = ocjeneOptions.definitions.notes.midi.indexOf(this.midiPitch);
		let text = ocjeneOptions.definitions.notes.ABCJSnotes[midiIndex].toUpperCase();
		text = text.replace(/[',]/g, "");
		const index = ocjeneOptions.definitions.notes.getTextLanguageNoteIndex(text);
		const arr = ocjeneOptions.definitions.notes.getTextLanguageArray(ocjeneOptions.textLanguage.index);
		return `${arr[index]} `;
	}
}
let failSafe = 10;
function ocjeneGenerate() {
	// console.clear();
	btnColor("idBtn_ocjeneGenerate", null);
	ocjeneSong.title = "Notenübeng 1"; //randomObject(netsaonaOptions.data.RandomWord);
	ocjeneSong.author = "Volker H."; //randomObject(netsaonaOptions.data.Name);
	ocjeneSong.noteData = [];
	ocjeneSong.currentSongLength = 0;

	let failSafeCurr = 10;
	while (ocjeneSong.currentSongLength < ocjeneSong.songlength) {
		let fail = {};
		if (Math.random() * 100 < ocjeneOptions.triplet.val) {
			let arr = ocjeneOptions.notenwerte.noteArrays.triplet.slice();
			fail = ocjeneCreateNote(arr, "triplet");
		} else if (Math.random() * 100 < ocjeneOptions.dotted.val) {
			let arr = ocjeneOptions.notenwerte.noteArrays.dotted.slice();
			fail = ocjeneCreateNote(arr, "dotted");
		} else {
			let arr = ocjeneOptions.notenwerte.noteArrays.base.slice();
			fail = ocjeneCreateNote(arr, "base");
		}
		if (fail != null) {
			failSafeCurr--;
			if (failSafeCurr <= 0) {
				failSafe--;
				console.log("impossible!!!", fail, ocjeneSong.currentSongLength, ocjeneSong.remainingSongLength);
				ocjeneGenerate();
				// alert("Taktart kann nicht mit gewählter Taktzahl und gewählten Notenlängen errreicht werden.");
				return;
			}
		}
	}
	ocjeneCleanAfterGeneration();
	ocjeneDraw();
	// console.log(ocjeneSong.abcJSSong);
	failSafe = 10;
}

function ocjeneCreateNote(arr, type) {
	let possibleNotes = [];
	const min = ocjeneOptions.notenwerte.min;
	let indices = [];
	for (let i = 0; i <= min; i++) {
		if (ocjeneOptions.notenwerte.selected[i]) indices.push(i);
	}
	for (let i of indices) {
		if (type == "triplet" && (arr[i] == null || i == min)) continue;
		if (type == "dotted" && (arr[i] == null || i == min)) continue;
		possibleNotes.push(arr[i]);
	}
	let mult = type == "triplet" ? 3 : 1;
	mult = type == "dotted" ? 2 : 1;

	possibleNotes = possibleNotes.filter((n) => n * mult <= ocjeneSong.remainingSongLength);
	if (ocjeneOptions.barOverflowStop.state) possibleNotes = possibleNotes.filter((n) => n * mult <= ocjeneSong.remainingBarLength);
	if (possibleNotes.length == 0) return { type: type, l: ocjeneSong.remainingBarLength };
	//more doubled 1/16 and 1/32
	ocjeneIncreasePossibilities(type, possibleNotes);
	const duration = randomObject(possibleNotes);
	new ocjeneNote(type, duration, ocjeneSong.currentSongLength, 0);
	if (type == "triplet") {
		new ocjeneNote(type, duration, ocjeneSong.currentSongLength, 1);
		new ocjeneNote(type, duration, ocjeneSong.currentSongLength, 2);
	}
	return null;
}

function ocjeneCleanAfterGeneration() {
	if (ocjeneOptions.keyOnly.state) return;
	let bars = [[]];
	for (let n of ocjeneSong.noteData) {
		let b = n.getBar();
		if (bars[b] == undefined) bars[b] = [];
		bars[b].push([n, null]);
	}
	for (let b = 0; b < bars.length; b++) {
		const bar = bars[b];
		for (let i = 0; i < bar.length; i++) {
			let flag_untouched = true;
			const notePitch = bar[i][0].pitchIndex();
			const isBaseKey = ocjeneNote.isBaseKey(notePitch);
			const isFromKey = ocjeneOptions.definitions.keyAccidentals.some((acc) => acc == notePitch);

			for (let prevIndex = i - 1; prevIndex >= 0; prevIndex--) {
				const noteBase = ocjeneNote.getBaseKey(notePitch);
				const prevPitch = bar[prevIndex][0].pitchIndex();
				const prevBase = ocjeneNote.getBaseKey(prevPitch);
				if (noteBase != prevBase) continue;

				// same - Base         -- do nothing if its null, set to null if it is resolved
				if (notePitch == prevPitch && isBaseKey) {
					if (isFromKey) flag_untouched = false;
					break;
				}
				// same - Accidential   -- shift to avoid accidential and keep shifting --> depending on the current key
				if (notePitch == prevPitch && !isBaseKey) {
					if (isFromKey) {
						bar[i][1] = "shift";
						flag_untouched = false;
					} else {
						if (bar[prevIndex][1] == null) bar[i][1] = "shift";
					}
					break;
				}
				// different - Base       -- resolve after accidential and keep shifting
				if (notePitch != prevPitch && isBaseKey) {
					if (isFromKey) flag_untouched = false;
					bar[i][1] = "resolved";
					break;
				}
				// different - Accidential -- do nothing
				if (notePitch != prevPitch && !isBaseKey) {
					if (isFromKey) {
						bar[i][1] = "shift";
						flag_untouched = false;
					}
					break;
				}
			}
			if (flag_untouched && isFromKey) bar[i][1] = isBaseKey ? "resolved" : "shift";
		}
	}
	for (let bar of bars) {
		for (let i = 0; i < bar.length; i++) {
			if (bar[i][1] == null) continue;
			if (bar[i][1] == "resolved") bar[i][0].resolved = true;
			if (bar[i][1] == "shift") bar[i][0].midiPitch += ocjeneOptions.keys.shiftDir;
			bar[i][0].translatePitch();
		}
	}
	// console.log(bars);
}

function ocjeneIncreasePossibilities(type, possibleNotes) {
	if (type != "base") return;
	if (ocjeneSong.noteData.length < 2) return;
	let prev1 = ocjeneSong.noteData[ocjeneSong.noteData.length - 1];
	if (type != prev1.type) return;
	let prev2 = ocjeneSong.noteData[ocjeneSong.noteData.length - 2];
	if (prev1.getDurationIndex() > 2 && prev1.duration != prev2.duration) {
		possibleNotes.push(prev1.duration);
		possibleNotes.push(prev1.duration);
	}
}

function ocjeneCursorControl() {
	this.onReady = function () {};
	this.onStart = function () {
		var svg = document.querySelector(`#idCanv_ocjeneSheet svg`);
		var cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
		cursor.setAttribute("class", "cl_abcCursor");
		cursor.setAttributeNS(null, "x1", 0);
		cursor.setAttributeNS(null, "y1", 0);
		cursor.setAttributeNS(null, "x2", 0);
		cursor.setAttributeNS(null, "y2", 0);
		svg.appendChild(cursor);
	};
	this.beatSubdivisions = 2;
	this.onBeat = function (beatNumber, totalBeats, totalTime) {};
	this.onEvent = function (ev) {
		if (ev.measureStart && ev.left === null) return; // this was the second part of a tie across a measure line. Just ignore it.
		let lastSelection = document.querySelectorAll(`#${ocjeneOptions.div} svg .cl_abcHighlight`);
		for (let k = 0; k < lastSelection.length; k++) {
			lastSelection[k].classList.remove("cl_abcHighlight");
		}
		for (let i = 0; i < ev.elements.length; i++) {
			const note = ev.elements[i];
			for (let j = 0; j < note.length; j++) {
				note[j].classList.add("cl_abcHighlight");
			}
		}
		const cursor = document.querySelector(`#${ocjeneOptions.div} svg .cl_abcCursor`);
		if (cursor) {
			cursor.setAttribute("x1", ev.left - 2);
			cursor.setAttribute("x2", ev.left - 2);
			cursor.setAttribute("y1", ev.top);
			cursor.setAttribute("y2", ev.top + ev.height);
		}
	};
	this.onFinished = function () {
		const els = document.querySelectorAll("svg .cl_abcHighlight");
		for (let i = 0; i < els.length; i++) {
			els[i].classList.remove("cl_abcHighlight");
		}
		const cursor = document.querySelector(`#${ocjeneOptions.div} svg .cl_abcCursor`);
		if (cursor) {
			cursor.setAttribute("x1", 0);
			cursor.setAttribute("x2", 0);
			cursor.setAttribute("y1", 0);
			cursor.setAttribute("y2", 0);
		}
	};
}

function ocjeneDraw() {
	if (ocjeneSong.synthControl) {
		ocjeneSong.synthControl.pause();
		ocjeneSong.synthControl.restart();
	}
	ocjeneSong.getData();
	let text = ocjeneOptions.showText.state ? `w: ${ocjeneSong.abcJSText}` : "";
	const res = `${ocjeneSong.header}${ocjeneSong.abcJSSong}\n${text}`;
	const drawOptions = {
		print: false, // show in DINA4 format
		staffwidth: getCssRoot("CardsMinWidth", true, true), // width 600
		wrap: {
			minSpacing: 1.8,
			maxSpacing: 2.7,
			preferredMeasuresPerLine: ocjeneSong.spread,
		},
	};

	ocjeneSong.abcCanvas = ABCJS.renderAbc(ocjeneOptions.div, res, drawOptions)[0];
	if (!ABCJS.synth.supportsAudio()) {
		console.log("Audio is not supported in this browser.");
		return;
	}

	ocjeneSong.synthControl = new ABCJS.synth.SynthController();
	ocjeneSong.synthControl.load(ocjeneOptions.audio, ocjeneSong.cursorControl, ocjeneSong.synthOptions);
	ocjeneSong.startTune();
}

function createOcjene(preset = null) {
	dbIDStyle("idCanv_ocjeneSheet").backgroundColor = "#FFFFF3";
	dbIDStyle("idCanv_ocjeneSheet").color = "#000000";

	ocjeneOptions.variables.firstPitchIterations.val = preset === null ? ocjeneOptions.variables.firstPitchIterations.valOrig : ocjeneSettings.get("firstPitchIterations");

	ocjeneOptions.tempo.val = preset === null ? ocjeneOptions.tempo.valOrig : ocjeneSettings.get("tempo");
	resetInput("idVin_ocjeneTempo", ocjeneOptions.tempo.val, {
		min: ocjeneOptions.tempo.min,
		max: ocjeneOptions.tempo.max,
	});

	ocjeneOptions.bars.val = preset === null ? ocjeneOptions.bars.valOrig : ocjeneSettings.get("bars");
	resetInput("idVin_ocjeneBars", ocjeneOptions.bars.val, {
		max: ocjeneOptions.bars.max,
	});

	ocjeneOptions.interval.val = preset === null ? ocjeneOptions.interval.valOrig : ocjeneSettings.get("interval");
	resetInput("idVin_ocjeneInterval", ocjeneOptions.interval.val, {
		max: ocjeneOptions.bars.max,
	});

	ocjeneOptions.timeSignature.index = preset === null ? ocjeneOptions.timeSignature.indexOrig : ocjeneSettings.get("timeSignature");
	const selSignature = dbID("idSel_ocjeneTimeSignature");
	clearFirstChild("idSel_ocjeneTimeSignature");
	for (const [index, opt] of ocjeneOptions.definitions.timeSignatures.entries()) {
		const option = document.createElement("OPTION");
		option.textContent = opt.join("/");
		option.value = opt.join("/");
		if (index == ocjeneOptions.timeSignature.index) option.selected = true;
		selSignature.appendChild(option);
	}

	ocjeneOptions.notenwerte.selected = preset === null ? ocjeneOptions.notenwerte.selectedOrig.slice() : ocjeneSettings.get("notenwerte");
	const notenwertCB = dbCL("cl_ocjeneNotenwerte", null);
	for (let i = 0; i < notenwertCB.length; i++) {
		notenwertCB[i].checked = ocjeneOptions.notenwerte.selected[i];
		notenwertCB[i].setAttribute("data-index", i);
	}
	// ocjeneOptions.notenwerte.createDivisions();

	ocjeneInstruments.index = ocjeneInstruments.indexOrig;
	const selInstruemnts = dbID("idSel_ocjeneInstrument");
	clearFirstChild("idSel_ocjeneInstrument");
	let groups = {};
	for (const vals of Object.values(ocjeneInstruments.data)) {
		if (groups[vals.group] === undefined) {
			groups[vals.group] = [vals];
		} else {
			groups[vals.group].push(vals);
		}
	}
	for (let [name, arr] of Object.entries(groups)) {
		let optGroup = document.createElement("optgroup");
		optGroup.label = name;
		for (let opt of arr) {
			const option = document.createElement("OPTION");
			option.textContent = opt.Name;
			option.value = opt.Name;
			optGroup.appendChild(option);
		}
		selInstruemnts.appendChild(optGroup);
	}

	ocjeneOptions.clef.index = preset === null ? ocjeneOptions.clef.indexOrig : ocjeneSettings.get("clef");
	const selClefs = dbID("idSel_ocjeneClefs");
	clearFirstChild("idSel_ocjeneClefs");
	for (let i = 0; i < Object.keys(ocjeneOptions.definitions.clefs).length; i++) {
		const option = document.createElement("OPTION");
		option.textContent = ocjeneOptions.clef.name(i);
		option.value = ocjeneOptions.clef.val(i);
		if (i == ocjeneOptions.clef.index) {
			option.selected = true;
		}
		selClefs.appendChild(option);
	}

	ocjeneOptions.keySignatures.index = ocjeneOptions.keySignatures.indexOrig;
	ocjeneOptions.keys.index = preset === null ? ocjeneOptions.keys.indexOrig : ocjeneSettings.get("keys");
	const selKeySignatures = dbID("idSel_ocjeneKeySignature");
	clearFirstChild("idSel_ocjeneKeySignature");
	for (const [index, opt] of ocjeneOptions.definitions.keySignatures.entries()) {
		const option = document.createElement("OPTION");
		option.textContent = opt;
		option.value = opt;
		if (index == ocjeneOptions.keys.index) option.selected = true;
		selKeySignatures.appendChild(option);
	}
	ocjenePopulateKeys(); // this needs to be below the KeySignatre definition!!

	ocjeneOptions.keyOnly.state = preset === null ? ocjeneOptions.keyOnly.stateOrig : ocjeneSettings.get("keyOnly");
	dbID("idCb_ocjeneKeyOnly").checked = ocjeneOptions.keyOnly.state;

	ocjeneOptions.dotted.val = preset === null ? ocjeneOptions.dotted.valOrig : ocjeneSettings.get("dotted");
	resetInput("idVin_ocjeneDotted", ocjeneOptions.dotted.val, {
		min: ocjeneOptions.dotted.min,
		max: ocjeneOptions.dotted.max,
	});

	ocjeneOptions.triplet.val = preset === null ? ocjeneOptions.triplet.valOrig : ocjeneSettings.get("triplet");
	resetInput("idVin_ocjeneTriplet", ocjeneOptions.triplet.val, {
		min: ocjeneOptions.triplet.min,
		max: ocjeneOptions.triplet.max,
	});

	ocjeneOptions.barOverflowStop.state = preset === null ? ocjeneOptions.barOverflowStop.stateOrig : ocjeneSettings.get("barOverflowStop");
	dbID("idCb_ocjeneBarOverflowStop").checked = ocjeneOptions.barOverflowStop.state;

	ocjeneOptions.metronome.state = preset === null ? ocjeneOptions.metronome.stateOrig : ocjeneSettings.get("metronome");
	dbID("idCb_ocjeneMetronome").checked = ocjeneOptions.metronome.state;
	// ocjeneOptions.metronome.val = ocjeneOptions.metronome.valOrig;
	// resetInput("idVin_ocjeneMetronome", ocjeneOptions.metronome.val, {
	// 	min: ocjeneOptions.metronome.min,
	// 	max: ocjeneOptions.metronome.max,
	// });

	ocjeneOptions.limitRange.state = preset === null ? ocjeneOptions.limitRange.stateOrig : ocjeneSettings.get("limitRange");
	ocjeneOptions.variables.rangeOffset.val = preset === null ? ocjeneOptions.variables.rangeOffset.valOrig : ocjeneSettings.get("rangeOffset");
	dbID("idCb_ocjeneLimitRange").checked = ocjeneOptions.limitRange.state;

	ocjeneOptions.showText.state = preset === null ? ocjeneOptions.showText.stateOrig : ocjeneSettings.get("showText");
	dbID("idCb_ocjeneShowText").checked = ocjeneOptions.showText.state;

	ocjeneOptions.textLanguage.index = preset === null ? ocjeneOptions.textLanguage.indexOrig : ocjeneSettings.get("textLanguage");
	const textLanguage = dbID("idSel_ocjeneTextLanguage");
	clearFirstChild("idSel_ocjeneTextLanguage");
	for (let i = 0; i < Object.keys(ocjeneOptions.definitions.notes.textLanguage).length; i++) {
		const option = document.createElement("OPTION");
		option.textContent = ocjeneOptions.textLanguage.name(i);
		option.value = ocjeneOptions.textLanguage.val(i);
		if (i == ocjeneOptions.textLanguage.index) {
			option.selected = true;
		}
		textLanguage.appendChild(option);
	}

	ocjeneOptions.rests.val = preset === null ? ocjeneOptions.rests.valOrig : ocjeneSettings.get("rests");
	resetInput("idVin_ocjeneRests", ocjeneOptions.rests.val, {
		min: ocjeneOptions.rests.min,
		max: ocjeneOptions.rests.max,
	});

	setTimeout(ocjeneGenerate, 300);
	// if (globalValues.hostDebug || preset) {
	//   setTimeout(ocjeneGenerate, 300)
	// } else {
	//   btnColor("idBtn_ocjeneGenerate", "positive");
	// }
}

function ocjenePopulateKeys() {
	let selKey = dbID("idSel_ocjeneKey");
	clearFirstChild("idSel_ocjeneKey");
	for (const [index, opt] of ocjeneOptions.definitions.keys.entries()) {
		const option = document.createElement("OPTION");
		option.textContent = opt[ocjeneOptions.keySignatures.index];
		option.value = opt[ocjeneOptions.keySignatures.index];
		if (index == 0 && ocjeneOptions.keys.index == null) {
			option.selected = true;
		} else if (index == ocjeneOptions.keys.index) {
			option.selected = true;
		}
		selKey.appendChild(option);
	}
}

function ocjeneNotenwert(obj) {
	const index = obj.dataset.index;
	ocjeneOptions.notenwerte.selected[index] = obj.checked;
	ocjeneInputChange();
}

function ocjeneTimeSignature(obj) {
	ocjeneOptions.timeSignature.index = obj.selectedIndex;
	ocjeneInputChange();
}

function ocjeneInstrument(obj) {
	ocjeneInstruments.index = obj.selectedIndex;
	ocjeneOptions.clef.index = Object.keys(ocjeneOptions.definitions.clefs).indexOf(ocjeneInstruments.instrument.clef);
	dbID("idSel_ocjeneClefs").selectedIndex = ocjeneOptions.clef.index;
	ocjeneInputChange();
}

function ocjeneInterval(obj) {
	ocjeneOptions.interval.val = utilsNumberFromInput(obj);
	ocjeneInputChange();
}

function ocjeneClefs(obj) {
	ocjeneOptions.clef.index = obj.selectedIndex;
	ocjeneDraw();
}

function ocjeneKeySignature(obj) {
	ocjeneOptions.keySignatures.index = obj.selectedIndex;
	ocjenePopulateKeys();
	ocjeneInputChange();
}

function ocjeneKey(obj) {
	ocjeneOptions.keys.index = obj.selectedIndex;
	ocjeneInputChange();
}

function ocjeneKeyOnly(obj) {
	ocjeneOptions.keyOnly.state = obj.checked;
	ocjeneInputChange();
}

function ocjeneDotted(obj) {
	ocjeneOptions.dotted.val = utilsNumberFromInput(obj);
	ocjeneInputChange();
}

function ocjeneTriplet(obj) {
	ocjeneOptions.triplet.val = utilsNumberFromInput(obj);
	ocjeneInputChange();
}

function ocjeneShowText(obj) {
	ocjeneOptions.showText.state = obj.checked;
	ocjeneDraw();
}

function ocjeneTextLanguage(obj) {
	ocjeneOptions.textLanguage.index = obj.selectedIndex;
	ocjeneDraw();
}

function ocjeneTempo(obj) {
	ocjeneOptions.tempo.val = utilsNumberFromInput(obj);
	ocjeneDraw();
}

function ocjeneBars(obj) {
	ocjeneOptions.bars.val = utilsNumberFromInput(obj);
	ocjeneInputChange();
}

function ocjeneBarOverflowStop(obj) {
	ocjeneOptions.barOverflowStop.state = obj.checked;
	ocjeneInputChange();
}
function ocjeneMetronome(obj) {
	ocjeneOptions.metronome.state = obj.checked;
	ocjeneDraw();
}

function ocjeneLimitRange(obj) {
	ocjeneOptions.limitRange.state = obj.checked;
	ocjeneInputChange();
}

function ocjeneRests(obj) {
	ocjeneOptions.rests.val = utilsNumberFromInput(obj);
	ocjeneInputChange();
}

function ocjeneInputChange() {
	btnColor("idBtn_ocjeneGenerate", "positive");
}

function ocjeneRandom(obj) {
	ocjeneSettings.level = Number(obj.dataset.level);
	createOcjene(true);
}

const ocjeneSettings = {
	level: 1,
	get(fn) {
		return this.data[fn];
	},
	data: {
		get tempo() {
			if (ocjeneSettings.level == 1) return randomObject(90, 110);
			if (ocjeneSettings.level == 2) return ocjeneOptions.tempo.valOrig;
			if (ocjeneSettings.level == 3) return randomObject(70, 135);
			if (ocjeneSettings.level == 4) return randomObject(60, 170);
		},
		get bars() {
			if (ocjeneSettings.level == 1) return 4;
			if (ocjeneSettings.level == 2) return ocjeneOptions.bars.valOrig;
			if (ocjeneSettings.level == 3) return 8;
			if (ocjeneSettings.level == 4) return 16;
		},
		get barOverflowStop() {
			if (ocjeneSettings.level == 1) return true;
			if (ocjeneSettings.level == 2) return ocjeneOptions.barOverflowStop.stateOrig;
			if (ocjeneSettings.level == 3) return false;
			if (ocjeneSettings.level == 4) return false;
		},
		get metronome() {
			if (ocjeneSettings.level == 1) return true;
			if (ocjeneSettings.level == 2) return ocjeneOptions.metronome.stateOrig;
			if (ocjeneSettings.level == 3) return false;
			if (ocjeneSettings.level == 4) return false;
		},
		get showText() {
			if (ocjeneSettings.level == 1) return true;
			if (ocjeneSettings.level == 2) return ocjeneOptions.showText.stateOrig;
			if (ocjeneSettings.level == 3) return false;
			if (ocjeneSettings.level == 4) return false;
		},
		get textLanguage() {
			if (ocjeneSettings.level == 1) return 5;
			if (ocjeneSettings.level == 2) return ocjeneOptions.textLanguage.indexOrig;
			if (ocjeneSettings.level == 3) return 0;
			if (ocjeneSettings.level == 4) return 16;
		},
		get interval() {
			if (ocjeneSettings.level == 1) return 5;
			if (ocjeneSettings.level == 2) return ocjeneOptions.interval.valOrig;
			if (ocjeneSettings.level == 3) return 7;
			if (ocjeneSettings.level == 4) return 8;
		},
		get timeSignature() {
			if (ocjeneSettings.level == 1) return randomObject([2, 3]);
			if (ocjeneSettings.level == 2) return ocjeneOptions.timeSignature.indexOrig;
			if (ocjeneSettings.level == 3) return randomObject([1, 2, 3, 5, 7]);
			if (ocjeneSettings.level == 4) return randomObject(ocjeneOptions.definitions.timeSignatures.length);
		},
		get notenwerte() {
			if (ocjeneSettings.level == 1) return [1, 1, 1, 0, 0];
			if (ocjeneSettings.level == 2) return ocjeneOptions.notenwerte.selectedOrig;
			if (ocjeneSettings.level == 3) return [1, 1, 1, 1, 0];
			if (ocjeneSettings.level == 4) return [0, 1, 1, 1, 1];
		},
		get clef() {
			if (ocjeneSettings.level == 1) return 0;
			if (ocjeneSettings.level == 2) return ocjeneOptions.clef.indexOrig;
			if (ocjeneSettings.level == 3) return randomObject([0, 6]);
			if (ocjeneSettings.level == 4) return randomObject([0, 6]);
		},
		get keys() {
			if (ocjeneSettings.level == 1) return randomObject([0, 1, 8]);
			if (ocjeneSettings.level == 2) return ocjeneOptions.keys.indexOrig;
			if (ocjeneSettings.level == 3) return randomObject([0, 1, 2, 8, 9]);
			if (ocjeneSettings.level == 4) return randomObject(ocjeneOptions.definitions.keys.length);
		},
		get keyOnly() {
			if (ocjeneSettings.level == 1) return true;
			if (ocjeneSettings.level == 2) return ocjeneOptions.keyOnly.stateOrig;
			if (ocjeneSettings.level == 3) return false;
			if (ocjeneSettings.level == 4) return false;
		},
		get dotted() {
			if (ocjeneSettings.level == 1) return 0;
			if (ocjeneSettings.level == 2) return ocjeneOptions.dotted.valOrig;
			if (ocjeneSettings.level == 3) return 10;
			if (ocjeneSettings.level == 4) return 15;
		},
		get triplet() {
			if (ocjeneSettings.level == 1) return 0;
			if (ocjeneSettings.level == 2) return ocjeneOptions.triplet.valOrig;
			if (ocjeneSettings.level == 3) return 10;
			if (ocjeneSettings.level == 4) return 15;
		},
		get rests() {
			if (ocjeneSettings.level == 1) return 0;
			if (ocjeneSettings.level == 2) return ocjeneOptions.rests.valOrig;
			if (ocjeneSettings.level == 3) return 15;
			if (ocjeneSettings.level == 4) return 30;
		},
		get limitRange() {
			if (ocjeneSettings.level == 1) return true;
			if (ocjeneSettings.level == 2) return ocjeneOptions.limitRange.stateOrig;
			if (ocjeneSettings.level == 3) return true;
			if (ocjeneSettings.level == 4) return false;
		},
		//variables
		get rangeOffset() {
			if (ocjeneSettings.level == 1) return 8;
			if (ocjeneSettings.level == 2) return ocjeneOptions.variables.rangeOffset.valOrig;
			if (ocjeneSettings.level == 3) return 10;
			if (ocjeneSettings.level == 4) return 24;
		},
		get firstPitchIterations() {
			if (ocjeneSettings.level == 1) return 20;
			if (ocjeneSettings.level == 2) return ocjeneOptions.variables.firstPitchIterations.valOrig;
			if (ocjeneSettings.level == 3) return 6;
			if (ocjeneSettings.level == 4) return 4;
		},
	},
};
