/**
 *   Updates a set of strings to those defined by a given language in config.
 *   @param  {string} langauge [description]
 */
function updateLanguageStrings(language) {
	IDsToUpdate.forEach(update => {
		var elm = document.getElementById(update.id);
		if(languages[language]) {
			elm.innerHTML = languages[language][update.text];
		}
	});
}

// Informationa bout which elements contain translatable strings.
const IDsToUpdate = [
	{
		id: 'close-options',
		text: 'close'
	}
];

const german = [
	{
		greeting: "Guten Morgen",
		start: 6,
		end: 11
	},
	{
		greeting: "Guten Nachmittag",
		start: 14,
		end: 18
	},
	{
		greeting: "Guten Abend",
		start: 19,
		end: 23
	}
];
german.default = "Hallo";
german.close = 'Schließen';

const english = [
	{
		greeting: "Good morning",
		start: 6,
		end: 11
	},
	{
		greeting: "Good afternoon",
		start: 14,
		end: 18
	},
	{
		greeting: "Good evening",
		start: 19,
		end: 23
	}
];
english.default = "Hello";
english.close = 'Close';

const dutch = [
	{
		greeting: "Goedemorgen",
		start: 6,
		end: 11
	},
	{
		greeting: "Goedmiddag",
		start: 14,
		end: 18
	},
	{
		greeting: "Goedeavond",
		start: 19,
		end: 23
	}
];
dutch.default = "Hallo";
dutch.close = 'Dichtbij';

const french = [
	{
		greeting: "Bonjour",
		start: 6,
		end: 11
	},
	{
		greeting: "Bonjour",
		start: 14,
		end: 18
	},
	{
		greeting: "Bonsoir",
		start: 19,
		end: 23
	}
];
french.default = "Salut";
french.close = 'Fermer';

const chinesePinjin = [
	{
		greeting: "Zǎoshang hǎo",
		start: 6,
		end: 11
	},
	{
		greeting: "Xiàwǔ hǎo",
		start: 14,
		end: 18
	},
	{
		greeting: "Wǎnshàng hǎo",
		start: 19,
		end: 23
	}
];
chinesePinjin.default = 'Nǐ hǎo';
chinesePinjin.close = 'Guānbì';

const chinese = [
	{
		greeting: "早上好",
		start: 6,
		end: 11
	},
	{
		greeting: "下午好",
		start: 14,
		end: 18
	},
	{
		greeting: "晚上好",
		start: 19,
		end: 23
	}
];
chinese.default = '你好';
chinese.close = '关闭';

const languages = {
	german: german,
	english: english,
	dutch: dutch,
	french: french,
	chinesePinjin: chinesePinjin,
	chinese: chinese
}
