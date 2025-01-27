<script>
	import Mecca from '$svgs/Mecca.svelte';
	import Madinah from '$svgs/Madinah.svelte';
	import CrossSolid from '$svgs/CrossSolid.svelte';
	import SortAscending from '$svgs/SortAscending.svelte';
	import SortDescending from '$svgs/SortDescending.svelte';
	import Eye from '$svgs/Eye.svelte';
	import EyeCrossed from '$svgs/EyeCrossed.svelte';
	import Bookmark from '$svgs/Bookmark.svelte';
	import Notes from '$svgs/Notes.svelte';
	import ContinueReading from '$svgs/ContinueReading.svelte';
	import Tooltip from '$ui/FlowbiteSvelte/tooltip/Tooltip.svelte';
	import { updateSettings } from '$utils/updateSettings';
	import { quranMetaData, juzMeta, mostRead } from '$data/quranMeta';
	import { __lastRead, __favouriteChapters, __userBookmarks, __userNotes, __timeSpecificChapters, __siteNavigationModalVisible, __quranNavigationModalVisible, __homepageExtrasPanelVisible } from '$utils/stores';
	import { term } from '$utils/terminologies';
	import { staticEndpoint } from '$data/websiteSettings';
	import { disabledClasses } from '$data/commonClasses';

	const svgData = `<path class="opacity-15" d="M21.77,8.948a1.238,1.238,0,0,1-.7-1.7,3.239,3.239,0,0,0-4.315-4.316,1.239,1.239,0,0,1-1.7-.7,3.239,3.239,0,0,0-6.1,0,1.238,1.238,0,0,1-1.7.7A3.239,3.239,0,0,0,2.934,7.249a1.237,1.237,0,0,1-.7,1.7,3.24,3.24,0,0,0,0,6.1,1.238,1.238,0,0,1,.705,1.7A3.238,3.238,0,0,0,7.25,21.066a1.238,1.238,0,0,1,1.7.7,3.239,3.239,0,0,0,6.1,0,1.238,1.238,0,0,1,1.7-.7,3.239,3.239,0,0,0,4.316-4.315,1.239,1.239,0,0,1,.7-1.7,3.239,3.239,0,0,0,0-6.1Z" />`;
	const continueReadingButtonClasses = `inline-flex items-center rounded-full px-4 py-2 space-x-2 justify-center text-sm ${window.theme('hoverBorder')} ${window.theme('bgSecondaryLight')}`;
	const cardGridClasses = 'grid md:grid-cols-2 lg:grid-cols-3 gap-3';
	const cardInnerClasses = `flex justify-between md:text-left transition text-sm rounded-xl p-5 hover:cursor-pointer ${window.theme('hoverBorder')} ${window.theme('bgSecondaryLight')} ${window.theme('hover')}`;
	const commontabClasses = 'px-2 md:px-3 py-2 text-xs md:text-md border-b-4 cursor-pointer';
	const tabDefaultBorder = `${commontabClasses} border-transparent`;
	const tabActiveBorder = `${commontabClasses} ${window.theme('border')}`;

	let divisionsActiveTab = 1; // Default to chapters tab
	let extrasActiveTab = 1; // Default to bookmarks
	let divisionsSortIsAscending = true;
	let chapterListOrder = [...quranMetaData];
	let juzListOrder = [...juzMeta];
	let fullQuranData;

	// Fetch full Quran data (uthmani) for bookmarked verses
	$: if (extrasActiveTab === 1 && totalBookmarks > 0) {
		fullQuranData = (async () => {
			try {
				const response = await fetch(`${staticEndpoint}/full-quran/uthmani.json`);
				const data = await response.json();
				return data.data;
			} catch (error) {
				// ...
			}
		})();
	}

	$: lastReadExists = $__lastRead.hasOwnProperty('chapter');
	$: totalBookmarks = $__userBookmarks.length;
	$: totalNotes = Object.keys($__userNotes).length;

	// Ensure chapter icons are visible if panel changes
	$: if (divisionsActiveTab) renderChapterIcons();

	// Remove 'invisible' class from chapter icons once fonts are loaded
	document.fonts.ready.then(() => {
		document.querySelectorAll('.chapter-icons').forEach((element) => {
			element.classList.remove('invisible');
		});
	});

	function sortDivisions() {
		divisionsSortIsAscending = !divisionsSortIsAscending;
		chapterListOrder = divisionsSortIsAscending ? [...quranMetaData] : [...quranMetaData].reverse();
		juzListOrder = divisionsSortIsAscending ? [...juzMeta] : [...juzMeta].reverse();

		// Ensure chapter icons are visible after sorting
		renderChapterIcons();
	}

	// Function to remove the invisibility of chapter icons after a short time
	function renderChapterIcons() {
		setTimeout(() => {
			document.querySelectorAll('.chapter-icons').forEach((element) => {
				element.classList.remove('invisible');
			});
		}, 10);
	}

	const summary = {
		'1': {
			name: 'Al-Fatiha',
			meaning: 'The Opening',
			description: "A concise chapter that serves as an introduction to the Quran, highlighting God's sovereignty, mercy, and the request for guidance along the straight path. It is a prayer for spiritual help."
		},
		'2': {
			name: 'Al-Baqarah',
			meaning: 'The Cow',
			description: 'The longest chapter of the Quran, it addresses a wide range of topics including faith, law, guidance for humanity, and stories of past prophets such as Adam, Ibrahim (Abraham), Musa (Moses), and Isa (Jesus). It emphasizes the importance of belief in the unseen, obedience to God, and maintaining a righteous path.'
		},
		'3': {
			name: 'Aali-Imran',
			meaning: 'The Family of Imran',
			description: 'Focuses on the stories of Maryam (Mary) and Isa (Jesus), and discusses the similarities between Islam and Christianity. It emphasizes the importance of monotheism, and the chapter addresses issues related to faith, unity, and belief in the unseen.'
		},
		'4': {
			name: 'An-Nisa',
			meaning: 'The Women',
			description: 'Deals extensively with issues regarding women, family, and inheritance laws. It also highlights the importance of justice, equal rights, and the role of women in society. The chapter discusses the treatment of orphans and addresses the ethical principles of war and peace.'
		},
		'5': {
			name: 'Al-Maidah',
			meaning: 'The Table Spread',
			description: 'This chapter discusses dietary laws, the story of the table spread sent to Isa (Jesus), and the importance of fulfilling promises. It also emphasizes community ethics, justice, and the relationship between the believers and God.'
		},
		'6': {
			name: "Al-An'am",
			meaning: 'The Cattle',
			description: "This chapter discusses monotheism, the rejection of idolatry, and the importance of following divine guidance. It also contains narratives of past prophets, including their struggles against idolatry and their communities' responses."
		},
		'7': {
			name: "Al-A'raf",
			meaning: 'The Heights',
			description: "Narrates the stories of various prophets, including Nuh (Noah), Hud, Salih, Ibrahim, Musa (Moses), and Lut (Lot), emphasizing moral lessons, divine warnings, and the consequences of rejecting God's guidance."
		},
		'8': {
			name: 'Al-Anfal',
			meaning: 'The Spoils of War',
			description: "Focuses on the ethics of war, including the distribution of spoils, the importance of unity among believers, and the lessons learned from the Battle of Badr. The chapter stresses faith, sacrifice, and the importance of trusting God's will."
		},
		'9': {
			name: 'At-Tawbah',
			meaning: 'The Repentance',
			description: 'Discusses repentance and the importance of turning back to God after committing sins. It also addresses the treatment of non-believers, the obligations of the Muslim community, and the Battle of Tabuk.'
		},
		'10': {
			name: 'Yunus',
			meaning: 'Jonah',
			description: "Highlights the stories of Prophet Yunus (Jonah), who was sent to the people of Nineveh. It emphasizes the themes of patience, repentance, and the mercy of God. The chapter also reminds of the importance of trusting God's plan, even in times of adversity."
		},
		'11': {
			name: 'Hud',
			meaning: 'Hud',
			description: "Narrates the stories of the prophets Hud, Salih, Ibrahim, Lut, and Shu'ayb, emphasizing their call to their people to worship the one true God and the consequences of their rejection. The chapter highlights divine justice and mercy."
		},
		'12': {
			name: 'Yusuf',
			meaning: 'Joseph',
			description: "Tells the story of Prophet Yusuf (Joseph), his trials, his betrayal by his brothers, and his rise to power in Egypt. The chapter emphasizes patience, forgiveness, and trust in God's wisdom."
		},
		'13': {
			name: "Ar-Ra'd",
			meaning: 'The Thunder',
			description: "Focuses on the signs of God’s existence in nature, such as thunder and lightning, as well as the fate of past nations that rejected God's messages. The chapter highlights the importance of faith, patience, and the eventual triumph of truth over falsehood."
		},
		'14': {
			name: 'Ibrahim',
			meaning: 'Abraham',
			description: 'Tells the story of Prophet Ibrahim (Abraham), his prayers for his descendants, and the divine tests he underwent. It highlights themes of gratitude, trust in God, and the consequences of disbelief.'
		},
		'15': {
			name: 'Al-Hijr',
			meaning: 'The Rocky Tract',
			description: "Mentions the stories of past prophets such as Ibrahim, Lut, Shu'ayb, and Salih, and their people's refusal to accept the divine message. The chapter emphasizes the importance of faith, patience, and the consequences of rejecting God's guidance."
		},
		'16': {
			name: 'An-Nahl',
			meaning: 'The Bee',
			description: "Discusses the signs of God in nature, including the bees and their role in pollination. The chapter also highlights the importance of gratitude towards God and acknowledges the divine wisdom in creation. It stresses the theme of God's mercy and guidance."
		},
		'17': {
			name: 'Al-Isra',
			meaning: 'The Night Journey',
			description: 'Describes the miraculous night journey (Isra) and ascension (Miraj) of Prophet Muhammad. It also discusses the Quran’s divine origin, and the moral and social issues related to the rejection of truth.'
		},
		'18': {
			name: 'Al-Kahf',
			meaning: 'The Cave',
			description: 'Narrates the story of the People of the Cave (Ahl al-Kahf), a group of young men who sought refuge in a cave to escape religious persecution. The chapter emphasizes the importance of faith and patience, and it also discusses the story of Musa (Moses) and Khidr, as well as the story of Dhul-Qarnayn.'
		},
		'19': {
			name: 'Maryam',
			meaning: 'Mary',
			description: 'Focuses on the story of Maryam (Mary), the mother of Isa (Jesus), and highlights her piety, purity, and devotion to God. It also narrates the miraculous birth of Isa, his prophethood, and his message.'
		},
		'20': {
			name: 'Ta-Ha',
			meaning: 'Ta-Ha',
			description: 'Details the story of Prophet Musa (Moses), his mission to Pharaoh, and the miracles he performed. The chapter emphasizes divine support for the prophets, the importance of obedience to God, and the ultimate triumph of truth.'
		},
		'21': {
			name: 'Al-Anbiya',
			meaning: 'The Prophets',
			description: 'Narrates the stories of various prophets, including Nuh (Noah), Ibrahim (Abraham), Musa (Moses), and others. The chapter emphasizes their struggles, the importance of patience, and the lessons to be learned from their lives.'
		},
		'22': {
			name: 'Al-Hajj',
			meaning: 'The Pilgrimage',
			description: 'Discusses the rituals of Hajj (pilgrimage), the significance of sacrifice, and the importance of unity among believers. The chapter also reflects on the themes of faith, submission to God, and the consequences of disbelief.'
		},
		'23': {
			name: "Al-Mu'minun",
			meaning: 'The Believers',
			description: 'Describes the qualities of true believers, including their humility, commitment to prayer, and dedication to righteousness. It also discusses the fate of past nations and their rejection of divine guidance.'
		},
		'24': {
			name: 'An-Nur',
			meaning: 'The Light',
			description: 'Addresses social and legal issues such as modesty, family relations, the punishment for adultery, and the concept of privacy. The chapter stresses the importance of moral behavior, integrity, and community responsibility.'
		},
		'25': {
			name: 'Al-Furqan',
			meaning: 'The Criterion',
			description: "Emphasizes the Quran’s role as the criterion for truth, highlighting the qualities of the disbelievers who rejected the message. The chapter contrasts the believers' righteousness with the behavior of the opponents of Islam."
		},
		'26': {
			name: "Ash-Shu'ara",
			meaning: 'The Poets',
			description: 'Narrates the stories of various prophets, including Nuh, Ibrahim, Musa, and others, and emphasizes the consequences of rejecting divine guidance. The chapter also discusses the role of the poets and their impact on society.'
		},
		'27': {
			name: 'An-Naml',
			meaning: 'The Ants',
			description: 'Focuses on the stories of Prophet Sulaiman (Solomon) and other prophets, highlighting their wisdom, divine guidance, and miracles. The chapter emphasizes the importance of humility and gratitude towards God.'
		},
		'28': {
			name: 'Al-Qasas',
			meaning: 'The Narration',
			description: 'Details the life of Prophet Musa (Moses), his mission to Pharaoh, and his eventual exodus with the Israelites. The chapter highlights themes of justice, faith, and the divine support of the prophets.'
		},
		'29': {
			name: 'Al-Ankabut',
			meaning: 'The Spider',
			description: 'Discusses the trials faced by believers, the stories of past prophets, and the importance of patience in the face of adversity. It emphasizes the transient nature of life and the need for reliance on God.'
		},
		'30': {
			name: 'Ar-Rum',
			meaning: 'The Romans',
			description: "Mentions the defeat and subsequent victory of the Romans, reflecting on the signs of God's existence and the inevitability of His power. The chapter also discusses the themes of resurrection and divine judgment."
		},
		'31': {
			name: 'Luqman',
			meaning: 'Luqman',
			description: 'The chapter discusses the wise advice of Luqman to his son, emphasizing the importance of gratitude to God, the value of knowledge, and the moral responsibilities of an individual. It highlights themes of monotheism, humility, and respect for parents.'
		},
		'32': {
			name: 'As-Sajda',
			meaning: 'The Prostration',
			description: "This chapter emphasizes the importance of prostration in worship and the submission to God's will. It discusses the signs of God in creation and the consequences of disbelief, urging people to reflect on God's sovereignty and mercy."
		},
		'33': {
			name: 'Al-Ahzab',
			meaning: 'The Confederates',
			description: 'Describes the Battle of the Trench (Ahzab) where the Muslims defended Medina against a coalition of enemies. The chapter highlights themes of unity, loyalty, the role of the Prophet’s wives, and the concept of jihad in the path of God.'
		},
		'34': {
			name: 'Saba',
			meaning: 'Sheba',
			description: "Narrates the story of the Queen of Sheba and the wisdom of Prophet Sulaiman (Solomon). It discusses the blessings of God, the dangers of pride, and the importance of recognizing God's sovereignty and mercy."
		},
		'35': {
			name: 'Fatir',
			meaning: 'The Originator',
			description: "This chapter discusses the signs of God's creation, His power, and the beauty of nature. It emphasizes the importance of gratitude, recognizing God’s blessings, and the consequences of ingratitude and rejection of faith."
		},
		'36': {
			name: 'Ya-Sin',
			meaning: 'Ya-Sin',
			description: 'A central chapter in the Quran that highlights the importance of the Quran as a divine revelation. It narrates the stories of past prophets, such as the people of the town that rejected the message of God, and emphasizes the importance of faith and resurrection.'
		},
		'37': {
			name: 'As-Saffat',
			meaning: 'Those who set the Ranks',
			description: 'Describes the ranks of angels who carry out God’s commands, the stories of various prophets like Ibrahim (Abraham), Musa (Moses), and others, and the fate of the disbelievers who rejected their messages. The chapter emphasizes the significance of following divine guidance.'
		},
		'38': {
			name: 'Sad',
			meaning: 'Sad',
			description: 'Narrates the stories of Prophet Dawud (David), Sulaiman (Solomon), and others, focusing on their wisdom, devotion, and the challenges they faced. It discusses the themes of divine justice, the consequences of sin, and the importance of repentance.'
		},
		'39': {
			name: 'Az-Zumar',
			meaning: 'The Groups',
			description: 'Describes the day of judgment, the fate of the righteous and the wicked, and the importance of worshipping God alone. The chapter emphasizes the significance of repentance, faith, and the reality of the afterlife.'
		},
		'40': {
			name: 'Ghafir',
			meaning: 'The Forgiver',
			description: "Focuses on God’s forgiveness, mercy, and the consequences of arrogance and denial. The chapter includes the story of a believer from Pharaoh's people who secretly embraced Islam, highlighting themes of faith, trust in God, and the consequences of disbelief."
		},
		'41': {
			name: 'Fussilat',
			meaning: 'Explained in Detail',
			description: "Discusses the clear signs of God's existence and authority. It focuses on the rejection of the Quran by disbelievers and the signs in nature that testify to God's power. The chapter calls for patience, righteousness, and turning to God in times of adversity."
		},
		'42': {
			name: 'Ash-Shura',
			meaning: 'The Consultation',
			description: "Highlights the importance of mutual consultation and cooperation in decision-making. It emphasizes the unity of faith, the need for justice, and God's guidance to those who believe. It also includes discussions on the moral and ethical responsibilities of the believers."
		},
		'43': {
			name: 'Az-Zukhruf',
			meaning: 'The Gold Adornments',
			description: 'This chapter criticizes the excessive focus on material wealth and worldly pleasures, encouraging believers to seek the lasting rewards of the afterlife. It also emphasizes the importance of belief in the unseen and the rejection of idolatry.'
		},
		'44': {
			name: 'Ad-Dukhan',
			meaning: 'The Smoke',
			description: 'Describes a time when a smoke will cover the earth as a sign of the impending day of judgment. The chapter warns against the arrogance and rejection of the divine message, emphasizing the consequences of disbelief and the fate of those who oppose God.'
		},
		'45': {
			name: 'Al-Jathiya',
			meaning: 'The Crouching',
			description: "Describes the consequences of rejecting God's guidance and the eventual judgment of humanity. The chapter encourages people to reflect on the signs of God's creation and to embrace faith in the face of adversity."
		},
		'46': {
			name: 'Al-Ahqaf',
			meaning: 'The Wind-Curved Sandhills',
			description: "Narrates the story of the people of 'Ad, a nation that was destroyed due to their arrogance and rejection of the message of the prophet Hud. The chapter highlights the themes of divine punishment, the importance of repentance, and the consequences of turning away from God."
		},
		'47': {
			name: 'Muhammad',
			meaning: 'Muhammad',
			description: 'Focuses on the qualities of true believers, the importance of faith, and the battle between truth and falsehood. The chapter also discusses the conduct of the Muslims in times of war and peace and emphasizes the importance of following the Prophet Muhammad’s teachings.'
		},
		'48': {
			name: 'Al-Fath',
			meaning: 'The Victory',
			description: 'Describes the victory of the Muslims in the Treaty of Hudaybiyyah and emphasizes the significance of patience, unity, and the fulfillment of promises. It also stresses the importance of humility, gratitude, and the blessings of God for the believers.'
		},
		'49': {
			name: 'Al-Hujurat',
			meaning: 'The Rooms',
			description: 'Deals with the ethics of community life, including guidance on how believers should interact with each other, avoid gossip, and maintain harmony within the Muslim community. It emphasizes respect, trust, and mutual cooperation.'
		},
		'50': {
			name: 'Qaf',
			meaning: 'Qaf',
			description: "Emphasizes the resurrection and the afterlife, reminding disbelievers of the consequences of their rejection. The chapter also discusses God's power in creation and the importance of recognizing His signs in the natural world."
		},
		'51': {
			name: 'Adh-Dhariyat',
			meaning: 'The Winnowing Winds',
			description: 'This chapter discusses the themes of resurrection, the fate of the disbelievers, and the ultimate triumph of truth. It also reflects on the signs of God in the natural world and encourages reflection on His wisdom and power.'
		},
		'52': {
			name: 'At-Tur',
			meaning: 'The Mount',
			description: "Mentions the fate of disbelievers who reject God's guidance and the rewards of the righteous. The chapter emphasizes the reality of the Day of Judgment and calls on people to reflect on the signs of God in creation."
		},
		'53': {
			name: 'An-Najm',
			meaning: 'The Star',
			description: 'Discusses the revelation of the Quran, the journey of the Prophet Muhammad, and the rejection faced by the disbelievers. The chapter also emphasizes the importance of following divine guidance and the consequences of straying from the truth.'
		},
		'54': {
			name: 'Al-Qamar',
			meaning: 'The Moon',
			description: "Describes the signs of the coming of the Day of Judgment, including the splitting of the moon. It highlights the fate of past nations who rejected God's message and the consequences of disbelief."
		},
		'55': {
			name: 'Ar-Rahman',
			meaning: 'The Beneficent',
			description: "Emphasizes the mercy and generosity of God, listing His blessings and gifts to humanity. The chapter encourages gratitude and recognition of God's favors, reminding people of their dependence on Him."
		},
		'56': {
			name: "Al-Waqi'a",
			meaning: 'The Inevitable',
			description: 'Describes the Day of Judgment, categorizing people into three groups based on their deeds: the righteous, the companions of the right, and the disbelievers. The chapter emphasizes the inevitability of the final reckoning.'
		},
		'57': {
			name: 'Al-Hadid',
			meaning: 'The Iron',
			description: "Focuses on the power of iron, which is a sign of God's strength and creation. The chapter emphasizes the importance of charity, faith, and the support of the poor and needy. It highlights the virtues of righteousness and the blessings of God's guidance."
		},
		'58': {
			name: 'Al-Mujadila',
			meaning: 'The Pleading Woman',
			description: "This chapter discusses a woman who pleads her case before the Prophet Muhammad regarding her marital dispute. It emphasizes the importance of justice, the rights of women, and the proper conduct in family relations. It also highlights the concept of consultation and the importance of seeking God's guidance in all matters."
		},
		'59': {
			name: 'Al-Hashr',
			meaning: 'The Exile',
			description: "Focuses on the exile of the Jewish tribe Banu Nadir from Medina. The chapter discusses the consequences of treachery and betrayal, and the importance of unity among the believers. It highlights the qualities of true believers and the importance of reflecting on God's power and signs."
		},
		'60': {
			name: 'Al-Mumtahina',
			meaning: 'She that is to be examined',
			description: 'Addresses the treatment of non-Muslims, especially in the context of marriage and alliances. It emphasizes the importance of loyalty to God and His Messenger, while also recognizing the potential for peaceful coexistence with people of other faiths.'
		},
		'61': {
			name: 'As-Saff',
			meaning: 'The Ranks',
			description: "Highlights the importance of unity, discipline, and commitment within the Muslim community. It emphasizes the need to stand in ranks like soldiers in the cause of God, and it underscores the mission of the Prophet Muhammad to deliver God's message to humanity."
		},
		'62': {
			name: "Al-Jumu'a",
			meaning: 'The Friday',
			description: "This chapter emphasizes the importance of the Friday prayer (Jumu'a) as a weekly communal worship. It also stresses the value of knowledge, reflection on God's signs, and the prioritization of faith over worldly distractions."
		},
		'63': {
			name: 'Al-Munafiqun',
			meaning: 'The Hypocrites',
			description: 'Describes the characteristics of hypocrites (those who outwardly profess faith but secretly oppose it) and warns against their deceit. The chapter emphasizes the importance of sincerity in faith and the dangers of hypocrisy.'
		},
		'64': {
			name: 'At-Taghabun',
			meaning: 'The Mutual Disillusion',
			description: 'Focuses on the realities of the Day of Judgment when individuals will be held accountable for their deeds. The chapter highlights the importance of righteousness, repentance, and the need for humility before God.'
		},
		'65': {
			name: 'At-Talaq',
			meaning: 'The Divorce',
			description: 'Discusses the laws of divorce, the rights of women, and the ethical treatment of spouses. The chapter stresses the importance of mutual respect, fairness, and reconciliation in family life.'
		},
		'66': {
			name: 'At-Tahrim',
			meaning: 'The Prohibition',
			description: 'Narrates an incident involving the Prophet Muhammad’s wives and addresses issues related to personal conduct, the consequences of breaking promises, and the importance of maintaining righteousness in all aspects of life.'
		},
		'67': {
			name: 'Al-Mulk',
			meaning: 'The Sovereignty',
			description: 'Highlights the sovereignty of God over all creation and reflects on the signs of His power in nature. The chapter encourages reflection on the greatness of God and the importance of using the blessings He provides in a responsible way.'
		},
		'68': {
			name: 'Al-Qalam',
			meaning: 'The Pen',
			description: "Describes the trials faced by the Prophet Muhammad, including the accusations made against him by the disbelievers. It emphasizes the Prophet’s noble character, patience, and the importance of adhering to God's guidance despite opposition."
		},
		'69': {
			name: 'Al-Haqqah',
			meaning: 'The Inevitable',
			description: 'Describes the Day of Judgment in vivid terms, focusing on the certainty and severity of the event. The chapter warns disbelievers of their fate and encourages believers to remain steadfast in their faith.'
		},
		'70': {
			name: "Al-Ma'arij",
			meaning: 'The Ascending Stairways',
			description: 'Discusses the inevitable reality of the Day of Judgment and describes the stages of ascension that souls undergo. It highlights the traits of those who will be saved and the consequences faced by the disbelievers.'
		},
		'71': {
			name: 'Nuh',
			meaning: 'Noah',
			description: 'Details the story of Prophet Nuh (Noah), his call to his people to worship God alone, their rejection of him, and their eventual destruction by the flood. The chapter emphasizes the importance of patience, perseverance, and trust in God.'
		},
		'72': {
			name: 'Al-Jinn',
			meaning: 'The Jinn',
			description: "Describes the nature of the jinn, their ability to listen to revelations, and their response to the message of the Quran. The chapter emphasizes the power of God's message, which reaches both humans and jinn, and stresses the importance of submission to God's will."
		},
		'73': {
			name: 'Al-Muzzammil',
			meaning: 'The Enshrouded One',
			description: 'Refers to the Prophet Muhammad being instructed to pray during the night as an act of worship. The chapter encourages personal devotion and patience in the face of trials, and stresses the importance of spiritual discipline.'
		},
		'74': {
			name: 'Al-Muddathir',
			meaning: 'The Cloaked One',
			description: "Describes the call of the Prophet Muhammad to rise and warn the people of the consequences of their actions. It emphasizes the urgency of delivering God's message and remaining firm in the face of opposition."
		},
		'75': {
			name: 'Al-Qiyama',
			meaning: 'The Resurrection',
			description: 'Describes the reality of the Day of Resurrection, when all people will be resurrected and judged. The chapter emphasizes the certainty of the afterlife and calls people to reflect on their deeds and their consequences.'
		},
		'76': {
			name: 'Al-Insan',
			meaning: 'Man',
			description: 'Focuses on the creation of man and the guidance provided to him by God. The chapter highlights the traits of the righteous, the rewards they will receive, and the consequences of ingratitude and disobedience.'
		},
		'77': {
			name: 'Al-Mursalat',
			meaning: 'The Emissaries',
			description: "Describes the angels sent by God to carry out His commands, especially in relation to the final judgment. It emphasizes the reality of the Day of Judgment and the fate of those who rejected God's message."
		},
		'78': {
			name: 'An-Naba',
			meaning: 'The Tidings',
			description: "Describes the great news of the coming of the Day of Judgment, the resurrection, and the recompense of the righteous and the wicked. The chapter calls people to reflect on the signs of God's creation and the certainty of the coming of the final reckoning."
		},
		'79': {
			name: "An-Nazi'at",
			meaning: 'Those who drag forth',
			description: 'Describes the angels who pull out the souls of the disbelievers and the fate that awaits them on the Day of Judgment. The chapter emphasizes the certainty of the resurrection and the consequences of disbelief.'
		},
		'80': {
			name: 'Abasa',
			meaning: 'He Frowned',
			description: 'Recounts an incident when the Prophet Muhammad frowned and turned away from a blind man who sought his attention. The chapter emphasizes the importance of being inclusive, showing kindness, and focusing on the spiritual needs of others.'
		},
		'81': {
			name: 'At-Takwir',
			meaning: 'The Overthrowing',
			description: 'Describes the cosmic events that will occur on the Day of Judgment, such as the sun being folded up and the stars falling. The chapter emphasizes the reality and inevitability of the Day of Judgment.'
		},
		'82': {
			name: 'Al-Infitar',
			meaning: 'The Cleaving',
			description: 'Describes the splitting of the sky and the earth as signs of the coming judgment. The chapter emphasizes the accountability of each individual for their actions and the rewards or punishments that await them.'
		},
		'83': {
			name: 'Al-Mutaffifin',
			meaning: 'Defrauding',
			description: 'Condemns those who cheat others in trade and the consequences they will face on the Day of Judgment. It highlights the importance of fairness, honesty, and integrity in all dealings.'
		},
		'84': {
			name: 'Al-Inshiqaq',
			meaning: 'The Splitting Open',
			description: "Describes the splitting of the sky and the earth as part of the events of the Day of Judgment. The chapter emphasizes the fate of those who have lived righteous lives and those who have opposed God's message."
		},
		'85': {
			name: 'Al-Burooj',
			meaning: 'The Mansions of the Stars',
			description: 'Describes the punishment of those who persecuted the early believers, particularly the story of the people of the ditch. The chapter emphasizes the protection of the righteous and the eventual triumph of justice.'
		},
		'86': {
			name: 'At-Tariq',
			meaning: 'The Morning Star',
			description: "Describes the great power of God, who is the ultimate creator and sustainer of the universe. The chapter urges people to reflect on God's signs and the eventual fate of those who reject the truth."
		},
		'87': {
			name: "Al-A'la",
			meaning: 'The Most High',
			description: 'Describes the greatness of God and the natural signs of His creation. The chapter encourages gratitude and praise for God and stresses the importance of worship and seeking guidance from Him.'
		},
		'88': {
			name: 'Al-Ghashiyah',
			meaning: 'The Overwhelming',
			description: 'Describes the overwhelming events of the Day of Judgment and the differing fates of the righteous and the wicked. The chapter highlights the consequences of disbelief and the rewards for the righteous.'
		},
		'89': {
			name: 'Al-Fajr',
			meaning: 'The Dawn',
			description: "Highlights the significance of the dawn and the various signs of God's power in creation. It discusses the fate of the disbelievers, the punishment they will face, and the rewards for those who are righteous and obedient to God."
		},
		'90': {
			name: 'Al-Balad',
			meaning: 'The City',
			description: 'Focuses on the challenges and difficulties faced by people in their lives, encouraging them to strive in the path of goodness and righteousness. It underscores the importance of charity, good deeds, and perseverance in facing hardships.'
		},
		'91': {
			name: 'Ash-Shams',
			meaning: 'The Sun',
			description: "Uses the imagery of the sun and other natural elements to describe the soul's potential for purity and corruption. The chapter emphasizes the role of the soul in achieving righteousness or falling into evil, highlighting the consequences of one's choices."
		},
		'92': {
			name: 'Al-Lail',
			meaning: 'The Night',
			description: 'Contrasts the deeds of the righteous and the wicked, highlighting that those who strive in the path of righteousness will be rewarded, while those who disbelieve and oppose God will face consequences. It stresses the importance of good actions and charity.'
		},
		'93': {
			name: 'Ad-Duhaa',
			meaning: 'The Morning Hours',
			description: "A chapter of reassurance to the Prophet Muhammad, emphasizing God's continued support and care for him. It encourages gratitude for God's blessings and stresses the importance of helping those in need."
		},
		'94': {
			name: 'Ash-Sharh',
			meaning: 'The Relief',
			description: "Describes the relief and comfort granted to the Prophet Muhammad after his difficulties and trials. It highlights God's mercy and the importance of patience, gratitude, and continued effort in the path of faith."
		},
		'95': {
			name: 'At-Tin',
			meaning: 'The Fig',
			description: 'Uses the symbolism of the fig and the olive to represent purity, goodness, and righteousness. It encourages believers to live lives of virtue and emphasizes the importance of choosing the right path for salvation.'
		},
		'96': {
			name: 'Al-Alaq',
			meaning: 'The Clot',
			description: "Discusses the creation of man from a clot of blood, emphasizing God's power in creation and the importance of seeking knowledge. It also reflects on the arrogance of those who oppose God's message and the importance of humility."
		},
		'97': {
			name: 'Al-Qadr',
			meaning: 'The Night of Decree',
			description: "Describes the significance of Laylat al-Qadr (the Night of Decree), a night in the month of Ramadan when the Quran was revealed. The chapter emphasizes the greatness of this night and the importance of seeking God's mercy during it."
		},
		'98': {
			name: 'Al-Bayyina',
			meaning: 'The Clear Proof',
			description: 'Highlights the clarity of the Quran as the ultimate proof for the truth of Islam. The chapter calls for believers to follow the clear guidance provided by God and emphasizes the consequences for those who reject the truth.'
		},
		'99': {
			name: 'Az-Zalzalah',
			meaning: 'The Earthquake',
			description: "Describes the earth's shaking on the Day of Judgment and the accountability of people for their deeds. The chapter emphasizes the inevitability of the reckoning and the results of people's actions."
		},
		'100': {
			name: 'Al-Adiyat',
			meaning: 'The Courser',
			description: 'Describes the powerful and swift horses used in battle, drawing a parallel to human behavior. It emphasizes the heedlessness of people toward their actions, urging them to reflect on their deeds in preparation for the Day of Judgment.'
		},
		'101': {
			name: "Al-Qari'ah",
			meaning: 'The Striking Calamity',
			description: "Describes the Day of Judgment as a time of severe calamity. It focuses on the consequences for both the righteous and the wicked, emphasizing the urgency of reflecting on one's actions and the reality of the afterlife."
		},
		'102': {
			name: 'At-Takathur',
			meaning: 'The Rivalry in Worldly Increase',
			description: 'Condemns the pursuit of worldly wealth and possessions at the cost of neglecting the afterlife. It encourages reflection on the purpose of life and warns against being consumed by materialism.'
		},
		'103': {
			name: 'Al-Asr',
			meaning: 'The Time',
			description: 'Highlights the importance of time and the fleeting nature of life. It calls for belief in God, righteous deeds, patience, and encouraging truth and perseverance, emphasizing that all of humanity is in loss except those who embody these qualities.'
		},
		'104': {
			name: 'Al-Humazah',
			meaning: 'The Slanderer',
			description: 'Condemns the behavior of those who slander and backbite others. The chapter warns of the consequences of pride, materialism, and arrogance, emphasizing the need for humility and good character.'
		},
		'105': {
			name: 'Al-Fil',
			meaning: 'The Elephant',
			description: "Narrates the story of the army of the elephant, which tried to destroy the Kaaba in Mecca but was thwarted by God's divine intervention. The chapter emphasizes God's protection and power."
		},
		'106': {
			name: 'Quraish',
			meaning: 'The Quraish',
			description: "Addresses the tribe of Quraish, urging them to acknowledge God's blessings, particularly His protection of their trade routes. It emphasizes the importance of gratitude and recognizing God's favors."
		},
		'107': {
			name: "Al-Ma'un",
			meaning: 'The Small Kindnesses',
			description: 'Describes the failure of those who do not perform acts of charity and kindness, particularly toward the poor and needy. The chapter encourages empathy, generosity, and awareness of the suffering of others.'
		},
		'108': {
			name: 'Al-Kawthar',
			meaning: 'The Abundance',
			description: 'Describes the immense blessings and favors that God has granted to the Prophet Muhammad, including the river Kawthar in paradise. The chapter encourages gratitude and devotion to God.'
		},
		'109': {
			name: 'Al-Kafirun',
			meaning: 'The Disbelievers',
			description: 'Outlines the stance of the disbelievers who reject faith and emphasizes the clear division between those who believe in God and those who do not. The chapter affirms the importance of steadfast belief in monotheism.'
		},
		'110': {
			name: 'An-Nasr',
			meaning: 'The Divine Support',
			description: "Describes the victory and support that God granted to the Muslims, particularly after the conquest of Mecca. The chapter encourages repentance, gratitude, and devotion in light of God's help."
		},
		'111': {
			name: 'Al-Masad',
			meaning: 'The Palm Fiber',
			description: "Condemns the behavior of Abu Lahab, an opponent of the Prophet Muhammad, and his wife. The chapter warns of the consequences of opposing God's message and emphasizes the importance of righteousness."
		},
		'112': {
			name: 'Al-Ikhlas',
			meaning: 'The Sincerity',
			description: "Affirms the absolute oneness of God, rejecting any form of polytheism. It is a declaration of God's singularity and purity, emphasizing His unique and incomparable nature."
		},
		'113': {
			name: 'Al-Falaq',
			meaning: 'The Daybreak',
			description: "Seeks refuge in God from the evil of external threats, such as envy, harm, and dark forces. The chapter calls for protection from all forms of evil and encourages trust in God's protection."
		},
		'114': {
			name: 'An-Nas',
			meaning: 'The People',
			description: "Seeks refuge in God from the evil of harmful whispers and the dangers of external and internal negative influences. It emphasizes the importance of seeking God's refuge and trusting in His protection from harm."
		}
	};
</script>

<div id="homepage-tabs" style="margin-top: 0px;">
	<div class="border-b {window.theme('border')} mt-4"></div>

	<div id="extras-tabs" class="flex items-center justify-between">
		<div class="flex flex-row justify-center">
			<div class="flex text-sm font-medium text-center justify-center space-x-1 md:space-x-4 rounded-full py-2 {!$__homepageExtrasPanelVisible && disabledClasses}">
				<button on:click={() => (extrasActiveTab = 1)} class="{extrasActiveTab === 1 ? tabActiveBorder : tabDefaultBorder} flex flex-row space-x-1 items-center truncate" data-umami-event="Bookmarks Tab Button">
					<span>Bookmarks</span>
					<span>{totalBookmarks > 0 ? `(${totalBookmarks})` : ''}</span>
				</button>
				<button on:click={() => (extrasActiveTab = 2)} class="{extrasActiveTab === 2 ? tabActiveBorder : tabDefaultBorder} flex flex-row space-x-1 items-center truncate" data-umami-event="Notes Tab Button">
					<span>Notes</span>
					<span>{totalNotes > 0 ? `(${totalNotes})` : ''}</span>
				</button>
				<button on:click={() => (extrasActiveTab = 3)} class={extrasActiveTab === 3 ? tabActiveBorder : tabDefaultBorder} data-umami-event="Suggestions Tab Button">Suggestions</button>
			</div>
		</div>

		<button
			class="inline-flex p-2 rounded-full items-center {window.theme('hoverBorder')} {window.theme('bgSecondaryLight')}"
			on:click={() => {
				updateSettings({ type: 'homepageExtrasPanelVisible', value: !$__homepageExtrasPanelVisible });
			}}
			data-umami-event="Toggle Panel Button"
		>
			<svelte:component this={$__homepageExtrasPanelVisible ? EyeCrossed : Eye} size={4} />
		</button>
		<Tooltip arrow={false} type="light" placement="top" class="z-30 w-max hidden md:block font-normal">{$__homepageExtrasPanelVisible ? 'Hide Panel' : 'Show Panel'}</Tooltip>
	</div>

	<div id="extras-panel" class="mb-4 pt-1 {$__homepageExtrasPanelVisible ? 'block' : 'hidden'}">
		<!-- bookmarks tab -->
		<div class="bookmarks-tab-panels space-y-12 {extrasActiveTab === 1 ? 'block' : 'hidden'}" id="bookmarks-tab-panel" role="tabpanel" aria-labelledby="bookmarks-tab">
			<div id="bookmark-cards" class="flex flex-col space-y-4">
				{#if totalBookmarks === 0}
					<div class="flex flex-row justify-start text-xs md:text-sm opacity-70 px-2">
						<span>You haven't bookmarked any {term('verse')} yet! Start by clicking on the <Bookmark classes="inline mt-[-4px]" /> icon for an {term('verse')}. It's a perfect way to return to the {term('verses')} that resonate with you. </span>
					</div>
				{:else}
					<div class="{cardGridClasses} grid-cols-2 md:!grid-cols-4">
						{#each $__userBookmarks as bookmark}
							{@const [bookmarkChapter, bookmarkVerse] = bookmark.split(':').map(Number)}

							<div class="flex flex-row space-x-2">
								<a href="{bookmarkChapter}?startVerse={bookmarkVerse}" class="!justify-start {cardInnerClasses} w-full flex-col">
									<div class="text-sm truncate max-w-[28vw] md:max-w-[115px]">{quranMetaData[bookmarkChapter].transliteration} ({bookmark})</div>

									{#if extrasActiveTab === 1 && totalBookmarks > 0}
										<div class="text-sm truncate text-right direction-rtl arabic-font-1 opacity-70">
											{#await fullQuranData then data}
												<div class="truncate max-w-[28vw] md:max-w-[115px]">{data[`${bookmarkChapter}:${bookmarkVerse}`]}</div>
											{:catch error}
												<p></p>
											{/await}
										</div>
									{/if}
								</a>

								<!-- delete bookmark button -->
								<button
									on:click={() => {
										const userResponse = confirm(`Are you sure you want to delete this bookmark (${bookmark})?`);
										if (userResponse) {
											updateSettings({ type: 'userBookmarks', key: bookmark });
											window.umami.track('Delete Bookmark Icon');
										}
									}}
									class="pointer h-7 w-7 opacity-100"
									style="margin-left: -20px; margin-top: -5px;"
									title="Delete bookmark"
								>
									<CrossSolid size={7} />
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- notes tab -->
		<div class="notes-tab-panels space-y-12 {extrasActiveTab === 2 ? 'block' : 'hidden'}" id="notes-tab-panel" role="tabpanel" aria-labelledby="notes-tab">
			<div id="notes-cards" class="flex flex-col space-y-4">
				{#if totalNotes === 0}
					<div class="flex flex-row justify-start text-xs md:text-sm opacity-70 px-2">
						<span>You haven't saved any notes yet! Start jotting down your thoughts by clicking the <Notes classes="inline mt-[-4px]" /> icon. It's like creating your own personal treasure chest of wisdom. </span>
					</div>
				{:else}
					<div class="{cardGridClasses} grid-cols-2 md:!grid-cols-4">
						{#each Object.entries($__userNotes) as [verse, note]}
							<a href="{verse.split(':')[0]}?startVerse={verse.split(':')[1]}" class="!justify-start {cardInnerClasses} w-full flex-col">
								<div class="text-sm truncate max-w-[30vw] md:max-w-[115px]">{quranMetaData[verse.split(':')[0]].transliteration} ({verse})</div>
								<span class="text-xs truncate opacity-70">{note.note}</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- suggestions tab -->
		<div class="space-y-12 {extrasActiveTab === 3 ? 'block' : 'hidden'}" id="suggestions-tab-panel" role="tabpanel" aria-labelledby="suggestions-tab">
			<div id="suggestions-chapters" class="flex flex-col space-y-4">
				<div class="{cardGridClasses} grid-cols-1">
					{#each Object.entries(mostRead) as [id, item]}
						<a href={item.url} class="!justify-start {cardInnerClasses} flex-col">
							<span class="text-sm">{quranMetaData[item.chapter].transliteration} ({item.verses})</span>
							<div class="block text-xs opacity-70">{item.title}</div>
						</a>
					{/each}
				</div>

				<div class="px-2 text-xs opacity-70">Suggestions listed here are based on the most frequently read chapters and verses by muslim audience, as well as virtues derived from Hadiths. While some Hadiths highlighting these virtues may be considered weak by some scholars, using them for beneficial knowledge is also a widely accepted opinion.</div>
			</div>
		</div>
	</div>

	<div class="border-b {window.theme('border')}"></div>

	<div id="quran-division-tabs" class="mt-4">
		<div class="flex flex-row items-center justify-between">
			<div class="flex text-sm font-medium text-center justify-center space-x-1 md:space-x-4 rounded-full py-2">
				<button on:click={() => (divisionsActiveTab = 1)} class="{divisionsActiveTab === 1 ? tabActiveBorder : tabDefaultBorder} flex flex-row space-x-2 items-center" data-umami-event="Chapters Tab Button">
					<span>{term('chapters')}</span>
				</button>
				<button on:click={() => (divisionsActiveTab = 2)} class="{divisionsActiveTab === 2 ? tabActiveBorder : tabDefaultBorder} flex flex-row space-x-2 items-center" data-umami-event="Juz Tab Button">
					<span>{term('juzs')}</span>
				</button>
			</div>

			<button class="inline-flex p-2 rounded-full items-center {window.theme('hoverBorder')} {window.theme('bgSecondaryLight')}" on:click={() => sortDivisions()} data-umami-event="Homepage Divisions Sort Button">
				<svelte:component this={divisionsSortIsAscending ? SortDescending : SortAscending} size={4} />
			</button>
			<Tooltip arrow={false} type="light" placement="top" class="z-30 w-max hidden md:block font-normal">{divisionsSortIsAscending ? 'Sort Descending' : 'Sort Ascending'}</Tooltip>
		</div>
	</div>

	<div id="quran-divisions-panel" class="mb-6">
		<!-- chapters tab -->
		{#if divisionsActiveTab === 1}
			<div id="chapters-tab-panel" role="tabpanel" aria-labelledby="chapters-tab">
				<!-- continue readin button -->
				{#if lastReadExists}
					{@const lastReadChapter = $__lastRead.chapter}
					{@const lastReadVerse = $__lastRead.verse}
					<a href="/{lastReadChapter}?startVerse={lastReadVerse}" class="{continueReadingButtonClasses} mb-2 truncate w-full" on:click={() => window.umami.track('Continue Chapter Button')}>
						<span class="invisible chapter-icons mb-1 text-2xl md:text-3xl" style="color: {window.theme('icon')}">{@html `&#xE9${quranMetaData[lastReadChapter].icon};`}</span>
						<span class="truncate">
							Continue Reading:
							{quranMetaData[lastReadChapter].transliteration}, {lastReadChapter}:{lastReadVerse}
						</span>
					</a>
				{/if}

				<div class="{cardGridClasses} grid-cols-1">
					{#each chapterListOrder as { id }, i}
						{#if id > 0}
							<a href="/{id}">
								<div class="{cardInnerClasses} flex-col" style="min-height: 100%; justify-content: flex-start;">
									<div class="flex justify-between md:text-left flex-row text-center items-center">
										<div class="flex flex-row space-x-2">
											<div class="flex items-center">
												<!-- chapter number star -->
												<svg class="w-10 h-10 rounded-full flex items-center justify-center" fill={window.theme('icon')} viewBox="0 0 24 24">
													{@html svgData}
													<text x="50%" y="53%" text-anchor="middle" stroke={window.theme('icon')} stroke-width="0.5px" dy=".3em" class="text" style="font-size: 7px;">{id}</text>
												</svg>
											</div>

											<div class="text-left">
												<!-- chapter name and icon -->
												<div class="flex flex-row items-center space-x-1 justify-start truncate">
													<div>{quranMetaData[id].transliteration}</div>
													<div><svelte:component this={quranMetaData[id].revelation === 1 ? Mecca : Madinah} /></div>
													<Tooltip arrow={false} type="light" placement="top" class="z-30 hidden md:block font-normal">{quranMetaData[id].revelation === 1 ? term('meccan') : term('medinan')} revelation</Tooltip>
												</div>

												<!-- chapter translation -->
												<div class="block text-xs truncate opacity-70">
													{quranMetaData[id].translation}
												</div>

												<!-- chapter verses -->
												<div class="block text-xs opacity-70">
													{quranMetaData[id].verses}
													{term('verses')}
												</div>
											</div>
										</div>

										<div class="invisible chapter-icons justify-items-end text-5xl" style="color: {window.theme('icon')}">{@html `&#xE9${quranMetaData[id].icon};`}</div>
									</div>

									<div class="text-xs opacity-70 pt-4 px-2">{summary[id].description}</div>
								</div>
							</a>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		<!-- juz tab -->
		{#if divisionsActiveTab === 2}
			<div id="juz-tab-panel" role="tabpanel" aria-labelledby="juz-tab">
				{#if lastReadExists}
					{@const lastReadChapter = $__lastRead.chapter}
					{@const lastReadVerse = $__lastRead.verse}
					{@const lastReadJuz = $__lastRead.juz}
					<a href="/juz/{lastReadJuz}?startKey={lastReadChapter}:{lastReadVerse}" class="{continueReadingButtonClasses} mb-2 truncate w-full" on:click={() => window.umami.track('Continue Juz Button')}>
						<span class="invisible chapter-icons mb-1 text-2xl md:text-3xl" style="color: {window.theme('icon')}">{@html `&#xE9${quranMetaData[lastReadChapter].icon};`}</span>
						<span>
							Continue Reading: {term('juz')}
							{lastReadJuz}, {lastReadChapter}:{lastReadVerse}
						</span>
					</a>
				{/if}

				<div class="{cardGridClasses} grid-cols-1">
					{#each juzListOrder as juz}
						<a href="/juz/{juz.juz}">
							<div class="{cardInnerClasses} flex-row text-center items-center">
								<div class="flex flex-row space-x-2">
									<div class="flex items-center">
										<!-- chapter number star -->
										<svg class="w-10 h-10 rounded-full flex items-center justify-center" fill={window.theme('icon')} viewBox="0 0 24 24">
											{@html svgData}
											<text x="50%" y="53%" text-anchor="middle" stroke={window.theme('icon')} stroke-width="0.5px" dy=".3em" class="text" style="font-size: 7px;">{juz.juz}</text>
										</svg>
									</div>

									<div class="text-left">
										<div class="flex flex-row items-center space-x-1 justify-start truncate">
											<div>{juz.name}</div>
										</div>

										<div class="block text-xs truncate opacity-70">
											{juz.from} - {juz.to}
										</div>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>
