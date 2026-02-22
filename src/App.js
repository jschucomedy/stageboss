import { useState, useEffect, useCallback, useMemo, useRef } from "react";

// -- SUPABASE CLOUD SYNC --------------------------------------
const SB_URL = 'https://qqgwxkxbdxjuyxhsuymj.supabase.co';
// Anthropic API key - add yours here
const ANTHROPIC_KEY = process.env.REACT_APP_ANTHROPIC_KEY || '';
const SB_KEY = 'sb_publishable_SoEfhh5CMIBOHc4oGyMCpg_4oqZmyET';
async function cloudLoad(email) {
  try {
    const r = await fetch(`${SB_URL}/rest/v1/userdata?email=eq.${encodeURIComponent(email)}&select=data`, {
      headers: {'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`}
    });
    const rows = await r.json();
    return rows?.[0]?.data || null;
  } catch { return null; }
}
async function cloudSave(email, data) {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/userdata?email=eq.${encodeURIComponent(email)}`, {
      headers: {'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`}
    });
    const rows = await res.json();
    if(rows && rows.length > 0) {
      await fetch(`${SB_URL}/rest/v1/userdata?email=eq.${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: {'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({data, updated_at: new Date().toISOString()})
      });
    } else {
      await fetch(`${SB_URL}/rest/v1/userdata`, {
        method: 'POST',
        headers: {'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json'},
        body: JSON.stringify({email, data, updated_at: new Date().toISOString()})
      });
    }
    return true;
  } catch(e) { console.error('Sync error:',e); return false; }
}

// -- AUTH -----------------------------------------------------
const _a = [
  { e: 'jschucomedy@gmail.com',     p: btoa('MainEvent27') },
  { e: 'comicphilmedina@gmail.com', p: btoa('MainEvent27') },
];
async function checkCredentials(email, pw) {
  const e = email.toLowerCase().trim().replace(/\s/g,'');
  return _a.find(u => u.e === e && atob(u.p) === pw.trim()) || null;
}

// -- SCHEMA + MIGRATION ---------------------------------------
const SCHEMA_VERSION = 4;
const DEFAULT_CHECKLIST_ITEMS = [
  { id: 'guarantee', label: 'Guarantee confirmed', done: false },
  { id: 'dates',     label: 'Show dates confirmed', done: false },
  { id: 'deposit',   label: 'Deposit sorted (if applicable)', done: false },
  { id: 'ticket',    label: 'Ticket link live', done: false },
  { id: 'artwork',   label: 'Artwork approved / promo assets sent', done: false },
  { id: 'lodging',   label: 'Lodging confirmed', done: false },
  { id: 'rider',     label: 'Tech/rider needs sent', done: false },
  { id: 'settlement',label: 'Settlement terms clarified', done: false },
];
function createChecklist() { return DEFAULT_CHECKLIST_ITEMS.map(i=>({...i,done:false})); }
function checklistPct(cl) { if(!cl||!cl.length) return 0; return Math.round(cl.filter(i=>i.done).length/cl.length*100); }
function migrateVenue(v) {
  return {
    ...v,
    agreementType: v.agreementType||'Email Agreement',
    confirmedViaEmailDate: v.confirmedViaEmailDate||'',
    emailThreadURL: v.emailThreadURL||'',
    emailThreadText: v.emailThreadText||'',
    emailAgreementNotes: v.emailAgreementNotes||'',
    termsLocked: v.termsLocked||false,
    checklist: v.checklist||null,
    expectedPaymentTiming: v.expectedPaymentTiming||'Night of show',
    paid: v.paid||false,
    paidDate: v.paidDate||'',
    settlement: v.settlement||null,
    showReport: v.showReport||null,
    rebookDate: v.rebookDate||'',
    package: v.package||'Jason + Phil',
  };
}
function migrateData(raw) {
  if(!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const arr = Array.isArray(parsed) ? parsed : (parsed.venues||[]);
    return arr.map(migrateVenue);
  } catch { return []; }
}

// -- CONSTANTS ------------------------------------------------
const PIPELINE = ['Lead','Contacted','Follow-Up','Responded','Negotiating','Hold','Confirmed','Advancing','Completed','Lost'];
const PIPE_COLORS = {'Lead':'#5a5a7a','Contacted':'#4ca8ff','Follow-Up':'#c084fc','Responded':'#4cffa0','Negotiating':'#ffc44c','Hold':'#ff9f43','Confirmed':'#4cffa0','Advancing':'#00d2d3','Completed':'#636e72','Lost':'#ff5c5c'};
const DEAL_TYPES = ['Flat Guarantee','Door Deal','Versus Deal','Guarantee + Bonus','Guarantee + %'];
const VENUE_TYPES = ['Comedy Club','Bar/Lounge','Theater','Casino','College','Festival','Corporate','Prestige Club'];
const WARMTH = ['Cold','Warm','Hot','Established'];
const WARMTH_COLORS = {'Cold':'#4ca8ff','Warm':'#ffc44c','Hot':'#ff5c5c','Established':'#4cffa0'};
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// -- DEFAULT TEMPLATES ----------------------------------------
const DEFAULT_TEMPLATES = [
  {
    id: 'jason-phil-standard', name: 'Jason + Phil  -  Standard', situation: 'new-date',
    subject: 'Phil Medina  -  Availability [DATES]  -  [VENUE]',
    body: `Hi [BOOKER_FIRST]!\n\nMy name is Jason Schuster, and I'm reaching out regarding [DATES] availability with nationally touring headliner Phil Medina. We would love to bring our show to [VENUE] while routing through your area.\n\nWe currently have availability between [DATES] and are actively booking this run.\n\nAbout Phil Medina\n\nPhil Medina is a high-energy, nationally touring headliner who has performed at top clubs including the Laugh Factory, Hollywood Improv, and the Ice House. He has entertained U.S. troops, appeared at the Netflix Is A Joke Festival in Los Angeles, and is featured on Hulu's West Coast Comedy and Not Your Average Comedy. Phil continues to build strong national momentum and consistently delivers with audiences nationwide.\n\nPhil Medina Instagram: https://www.instagram.com/comicphilmedina\n\nAbout Jason Schuster\n\nJason Schuster is a bi-coastal touring comedian known for his sharp wit, strong stage presence, and spot-on impressions. He has performed at The Comedy Store, Jimmy Kimmel's Comedy Club, and Mic Drop Comedy, and has been featured on Kenan Presents. Jason tours regularly across the country and brings a fun, high-energy performance that plays well in club environments.\n\nJason Schuster Instagram: https://www.instagram.com/jschucomedy\n\nPlease let me know if you might have availability between [DATES]. I'd love to connect and see if we can make something happen.\n\nAppreciate your time and hope to speak soon.\n\nBest,\nJason Schuster`,
    photoLinks: [{ label: 'Phil Medina Press Kit', url: 'https://www.instagram.com/comicphilmedina' },{ label: 'Jason Schuster Press Kit', url: 'https://www.instagram.com/jschucomedy' }],
  },
  {
    id: 'jason-solo', name: 'Jason Solo Tour', situation: 'new-date',
    subject: 'Jason Schuster  -  Touring Comedian  -  [VENUE] Availability',
    body: `Hi [BOOKER_FIRST]!\n\nMy name is Jason Schuster  -  I'm a bi-coastal touring comedian reaching out about availability at [VENUE] for [DATES].\n\nI'm known for sharp wit, strong stage presence, and spot-on impressions. I've performed at The Comedy Store, Jimmy Kimmel's Comedy Club, and Mic Drop Comedy, and have been featured on Kenan Presents.\n\nJason Schuster Instagram: https://www.instagram.com/jschucomedy\n\nI'd love to connect and see if we can make something work for [DATES].\n\nThanks so much!\n\nBest,\nJason Schuster`,
    photoLinks: [{ label: 'Jason Schuster Press Kit', url: 'https://www.instagram.com/jschucomedy' }],
  },
  {
    id: 'follow-up', name: 'Follow-Up', situation: 'follow-up',
    subject: 'Following Up  -  [VENUE]  -  Phil Medina',
    body: `Hi [BOOKER_FIRST],\n\nJust following up on my previous message  -  didn't want it to get buried!\n\nWe're still very interested in bringing Phil Medina to [VENUE] for [DATES]. Phil is building serious momentum and the clubs that get in early tend to get the best dates.\n\nWould love to connect  -  even a quick reply to let me know your timeline would be helpful.\n\nThanks again!\n\nBest,\nJason Schuster`,
    photoLinks: [],
  },
  {
    id: 'existing-relationship', name: 'Existing Relationship', situation: 'new-date',
    subject: 'Back at [VENUE]  -  Phil Medina  -  [DATES]',
    body: `Hey [BOOKER_FIRST]!\n\nHope you've been well! It's Jason  -  always love working with [VENUE].\n\nReaching out because we're routing through your area [DATES] and would love to bring Phil Medina back. Last time was a great show and the crowd loved it.\n\nLet me know if those dates work or if there's a better window. Always a pleasure!\n\nBest,\nJason Schuster`,
    photoLinks: [{ label: 'Phil Medina Instagram', url: 'https://www.instagram.com/comicphilmedina' }],
  },
];

const DEFAULT_PHOTOS = [
  { id: 'p1', label: 'Phil  -  Covina Center Marquee', url: '', description: 'Marquee shot' },
  { id: 'p2', label: 'Phil  -  Netflix Is A Joke Fest', url: '', description: 'Festival shot' },
  { id: 'p3', label: 'Phil  -  Levity Live Billboard', url: '', description: 'Billboard' },
  { id: 'p4', label: 'Jason  -  Magoobys', url: '', description: 'Stage shot' },
  { id: 'p5', label: 'Jason  -  Laugh Factory', url: '', description: 'Club shot' },
];

// -- VENUE DATABASE (150+) ------------------------------------
const VENUE_DATABASE = [
  {venue:'The Comedy Store',city:'Los Angeles',state:'CA',capacity:400,booker:'',email:'booking@thecomedystore.com',instagram:'@thecomedystore',venueType:'Prestige Club'},
  {venue:'The Hollywood Improv',city:'Los Angeles',state:'CA',capacity:350,booker:'',email:'booking@improv.com',instagram:'@hollywoodimprov',venueType:'Prestige Club'},
  {venue:'The Ice House',city:'Pasadena',state:'CA',capacity:300,booker:'',email:'info@icehousecomedy.com',instagram:'@icehousecomedy',venueType:'Comedy Club'},
  {venue:'Levity Live',city:'Oxnard',state:'CA',capacity:300,booker:'',email:'booking@levitylive.com',instagram:'@levitylive',venueType:'Comedy Club'},
  {venue:'Cobbs Comedy Club',city:'San Francisco',state:'CA',capacity:225,booker:'',email:'info@cobbscomedyclub.com',instagram:'@cobbscomedyclub',venueType:'Comedy Club'},
  {venue:'Punch Line SF',city:'San Francisco',state:'CA',capacity:200,booker:'Chris',email:'booking@punchlinecomedyclub.com',instagram:'@punchlinecomedyclub',venueType:'Comedy Club'},
  {venue:'Punch Line Sacramento',city:'Sacramento',state:'CA',capacity:200,booker:'',email:'booking@punchlinecomedyclub.com',instagram:'@punchlinecomedy',venueType:'Comedy Club'},
  {venue:'The Laugh Factory LA',city:'Los Angeles',state:'CA',capacity:300,booker:'',email:'booking@laughfactory.com',instagram:'@laughfactory',venueType:'Comedy Club'},
  {venue:'Laugh Factory Long Beach',city:'Long Beach',state:'CA',capacity:250,booker:'',email:'longbeach@laughfactory.com',instagram:'@laughfactory',venueType:'Comedy Club'},
  {venue:'Laugh Factory San Diego',city:'San Diego',state:'CA',capacity:250,booker:'',email:'sandiego@laughfactory.com',instagram:'@laughfactory',venueType:'Comedy Club'},
  {venue:"Jimmy Kimmel's Comedy Club",city:'Las Vegas',state:'NV',capacity:300,booker:'',email:'booking@jimmykimmelscomedyclub.com',instagram:'@jimmykimmelscomedyclub',venueType:'Prestige Club'},
  {venue:'The Comedy & Magic Club',city:'Hermosa Beach',state:'CA',capacity:400,booker:'',email:'info@comedyandmagicclub.com',instagram:'@comedyandmagicclub',venueType:'Prestige Club'},
  {venue:'The Brea Improv',city:'Brea',state:'CA',capacity:300,booker:'',email:'brea@improv.com',instagram:'@breaimprov',venueType:'Comedy Club'},
  {venue:'Ontario Improv',city:'Ontario',state:'CA',capacity:300,booker:'',email:'ontario@improv.com',instagram:'@ontarioimprov',venueType:'Comedy Club'},
  {venue:'Irvine Improv',city:'Irvine',state:'CA',capacity:300,booker:'',email:'irvine@improv.com',instagram:'@irvineimprov',venueType:'Comedy Club'},
  {venue:'San Jose Improv',city:'San Jose',state:'CA',capacity:300,booker:'',email:'sanjose@improv.com',instagram:'@sanjoseimprov',venueType:'Comedy Club'},
  {venue:'Mic Drop Comedy',city:'Los Angeles',state:'CA',capacity:150,booker:'',email:'info@micdropcomedy.com',instagram:'@micdropcomedy',venueType:'Comedy Club'},
  {venue:'Covina Center for the Performing Arts',city:'Covina',state:'CA',capacity:1000,booker:'',email:'booking@covinacenter.org',instagram:'@covinacenter',venueType:'Theater'},
  {venue:"Caroline's on Broadway",city:'New York',state:'NY',capacity:300,booker:'',email:'booking@carolines.com',instagram:'@carolinesonbroadway',venueType:'Prestige Club'},
  {venue:'New York Comedy Club',city:'New York',state:'NY',capacity:150,booker:'',email:'booking@newyorkcomedyclub.com',instagram:'@newyorkcomedyclub',venueType:'Comedy Club'},
  {venue:'Gotham Comedy Club',city:'New York',state:'NY',capacity:300,booker:'',email:'booking@gothamcomedyclub.com',instagram:'@gothamcomedyclub',venueType:'Prestige Club'},
  {venue:'The Comedy Cellar',city:'New York',state:'NY',capacity:120,booker:'',email:'info@comedycellar.com',instagram:'@comedycellar',venueType:'Prestige Club'},
  {venue:'Stand Up NY',city:'New York',state:'NY',capacity:175,booker:'',email:'booking@standupny.com',instagram:'@standupny',venueType:'Comedy Club'},
  {venue:'Broadway Comedy Club',city:'New York',state:'NY',capacity:200,booker:'',email:'booking@broadwaycomedyclub.com',instagram:'@broadwaycomedyclub',venueType:'Comedy Club'},
  {venue:'Laugh Factory Chicago',city:'Chicago',state:'IL',capacity:250,booker:'',email:'chicago@laughfactory.com',instagram:'@laughfactory',venueType:'Comedy Club'},
  {venue:'Zanies Comedy Club Chicago',city:'Chicago',state:'IL',capacity:200,booker:'',email:'chicago@zanies.com',instagram:'@zaniescomedy',venueType:'Comedy Club'},
  {venue:'The Second City',city:'Chicago',state:'IL',capacity:300,booker:'',email:'casting@secondcity.com',instagram:'@thesecondcity',venueType:'Prestige Club'},
  {venue:'Cap City Comedy Club',city:'Austin',state:'TX',capacity:300,booker:'Sarah',email:'booking@capcitycomedy.com',instagram:'@capcitycomedy',venueType:'Comedy Club'},
  {venue:'Houston Improv',city:'Houston',state:'TX',capacity:300,booker:'',email:'houston@improv.com',instagram:'@houstonimprov',venueType:'Comedy Club'},
  {venue:'Dallas Improv',city:'Dallas',state:'TX',capacity:300,booker:'',email:'dallas@improv.com',instagram:'@dallasimprov',venueType:'Comedy Club'},
  {venue:'San Antonio Improv',city:'San Antonio',state:'TX',capacity:300,booker:'',email:'sanantonio@improv.com',instagram:'@sanantoniomprov',venueType:'Comedy Club'},
  {venue:"Hyena's Comedy Club Dallas",city:'Dallas',state:'TX',capacity:250,booker:'',email:'booking@hyenascomedynightclub.com',instagram:'@hyenascomedy',venueType:'Comedy Club'},
  {venue:'Tampa Improv',city:'Tampa',state:'FL',capacity:300,booker:'',email:'tampa@improv.com',instagram:'@tampaimprov',venueType:'Comedy Club'},
  {venue:'Orlando Improv',city:'Orlando',state:'FL',capacity:300,booker:'',email:'orlando@improv.com',instagram:'@orlandoimprov',venueType:'Comedy Club'},
  {venue:'Miami Improv',city:'Miami',state:'FL',capacity:300,booker:'',email:'miami@improv.com',instagram:'@miamiimprov',venueType:'Comedy Club'},
  {venue:'Fort Lauderdale Improv',city:'Fort Lauderdale',state:'FL',capacity:300,booker:'',email:'ftlauderdale@improv.com',instagram:'@ftlauderdaleimprov',venueType:'Comedy Club'},
  {venue:'Side Splitters Comedy Club',city:'Tampa',state:'FL',capacity:250,booker:'',email:'booking@sidesplitterscomedy.com',instagram:'@sidesplitterscomedy',venueType:'Comedy Club'},
  {venue:'Tempe Improv',city:'Tempe',state:'AZ',capacity:300,booker:'',email:'tempe@improv.com',instagram:'@tempeimprov',venueType:'Comedy Club'},
  {venue:'Stand Up Live Phoenix',city:'Phoenix',state:'AZ',capacity:300,booker:'',email:'phoenix@standuplive.com',instagram:'@standuplive',venueType:'Comedy Club'},
  {venue:'Stand Up Live Tucson',city:'Tucson',state:'AZ',capacity:250,booker:'',email:'tucson@standuplive.com',instagram:'@standuplive',venueType:'Comedy Club'},
  {venue:'Comedy Works Denver',city:'Denver',state:'CO',capacity:250,booker:'',email:'booking@comedyworks.com',instagram:'@comedyworksdenver',venueType:'Prestige Club'},
  {venue:'Comedy Works South',city:'Greenwood Village',state:'CO',capacity:400,booker:'',email:'south@comedyworks.com',instagram:'@comedyworksdenver',venueType:'Comedy Club'},
  {venue:'Denver Improv',city:'Denver',state:'CO',capacity:300,booker:'',email:'denver@improv.com',instagram:'@denverimprov',venueType:'Comedy Club'},
  {venue:'Tacoma Comedy Club',city:'Tacoma',state:'WA',capacity:250,booker:'',email:'booking@tacomacomedyclub.com',instagram:'@tacomacomedyclub',venueType:'Comedy Club'},
  {venue:'Spokane Comedy Club',city:'Spokane',state:'WA',capacity:250,booker:'',email:'booking@spokanecomedyclub.com',instagram:'@spokanecomedyclub',venueType:'Comedy Club'},
  {venue:'Helium Comedy Club Portland',city:'Portland',state:'OR',capacity:250,booker:'',email:'portland@heliumcomedy.com',instagram:'@heliumcomedy',venueType:'Comedy Club'},
  {venue:'Hilarities Comedy Club',city:'Cleveland',state:'OH',capacity:350,booker:'',email:'booking@hilarities.com',instagram:'@hilaritiescomedyclub',venueType:'Comedy Club'},
  {venue:'Columbus Funny Bone',city:'Columbus',state:'OH',capacity:300,booker:'',email:'columbus@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Cincinnati Funny Bone',city:'Cincinnati',state:'OH',capacity:300,booker:'',email:'cincinnati@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Helium Comedy Club Philadelphia',city:'Philadelphia',state:'PA',capacity:250,booker:'',email:'philly@heliumcomedy.com',instagram:'@heliumcomedy',venueType:'Comedy Club'},
  {venue:'Pittsburgh Funny Bone',city:'Pittsburgh',state:'PA',capacity:300,booker:'',email:'pittsburgh@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Magoobys Joke House',city:'Baltimore',state:'MD',capacity:300,booker:'',email:'booking@magoobys.com',instagram:'@magoobys',venueType:'Comedy Club'},
  {venue:'Atlanta Improv',city:'Atlanta',state:'GA',capacity:300,booker:'',email:'atlanta@improv.com',instagram:'@atlantaimprov',venueType:'Comedy Club'},
  {venue:'Punchline Atlanta',city:'Atlanta',state:'GA',capacity:250,booker:'',email:'booking@punchlineatlanta.com',instagram:'@punchlineatlanta',venueType:'Comedy Club'},
  {venue:'Charlotte Comedy Zone',city:'Charlotte',state:'NC',capacity:300,booker:'',email:'charlotte@comedyzone.com',instagram:'@comedyzone',venueType:'Comedy Club'},
  {venue:'Raleigh Comedy Zone',city:'Raleigh',state:'NC',capacity:300,booker:'',email:'raleigh@comedyzone.com',instagram:'@comedyzone',venueType:'Comedy Club'},
  {venue:'DC Improv',city:'Washington',state:'DC',capacity:300,booker:'',email:'booking@dcimprov.com',instagram:'@dcimprov',venueType:'Comedy Club'},
  {venue:'Laugh Boston',city:'Boston',state:'MA',capacity:300,booker:'',email:'booking@laughboston.com',instagram:'@laughboston',venueType:'Comedy Club'},
  {venue:'The Wilbur',city:'Boston',state:'MA',capacity:1000,booker:'',email:'booking@thewilbur.com',instagram:'@thewilbur',venueType:'Theater'},
  {venue:'Ann Arbor Comedy Showcase',city:'Ann Arbor',state:'MI',capacity:250,booker:'',email:'booking@aacomedy.com',instagram:'@aacomedyshowcase',venueType:'Comedy Club'},
  {venue:'Acme Comedy Company',city:'Minneapolis',state:'MN',capacity:300,booker:'',email:'booking@acmecomedycompany.com',instagram:'@acmecomedyco',venueType:'Comedy Club'},
  {venue:'Funny Bone St. Louis',city:'St. Louis',state:'MO',capacity:300,booker:'',email:'stlouis@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Stanford & Sons Comedy Club',city:'Kansas City',state:'MO',capacity:250,booker:'',email:'booking@stanfordandsons.com',instagram:'@stanfordandsons',venueType:'Comedy Club'},
  {venue:'Milwaukee Improv',city:'Milwaukee',state:'WI',capacity:300,booker:'',email:'milwaukee@improv.com',instagram:'@milwaukeeimprov',venueType:'Comedy Club'},
  {venue:'Crackers Comedy Club Indianapolis',city:'Indianapolis',state:'IN',capacity:250,booker:'',email:'booking@crackerscomedy.com',instagram:'@crackerscomedy',venueType:'Comedy Club'},
  {venue:'Zanies Nashville',city:'Nashville',state:'TN',capacity:200,booker:'',email:'nashville@zanies.com',instagram:'@zaniescomedy',venueType:'Comedy Club'},
  {venue:'Improv Nashville',city:'Nashville',state:'TN',capacity:300,booker:'',email:'nashville@improv.com',instagram:'@nashvilleimprov',venueType:'Comedy Club'},
  {venue:'Stress Factory Comedy Club',city:'New Brunswick',state:'NJ',capacity:300,booker:'',email:'booking@stressfactory.com',instagram:'@stressfactory',venueType:'Comedy Club'},
  {venue:'StarDome Comedy Club',city:'Birmingham',state:'AL',capacity:300,booker:'',email:'booking@stardome.com',instagram:'@stardomecomedy',venueType:'Comedy Club'},
  {venue:'New Orleans Improv',city:'New Orleans',state:'LA',capacity:300,booker:'',email:'neworleans@improv.com',instagram:'@neworleansimprov',venueType:'Comedy Club'},
  {venue:'Loony Bin Comedy Club OKC',city:'Oklahoma City',state:'OK',capacity:250,booker:'',email:'okc@loonybincomedy.com',instagram:'@loonybincomedy',venueType:'Comedy Club'},
  {venue:'Funny Bone Omaha',city:'Omaha',state:'NE',capacity:300,booker:'',email:'omaha@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Funny Bone Des Moines',city:'Des Moines',state:'IA',capacity:300,booker:'',email:'desmoines@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Wiseguys Comedy Salt Lake',city:'Salt Lake City',state:'UT',capacity:300,booker:'',email:'slc@wiseguyscomedy.com',instagram:'@wiseguyscomedy',venueType:'Comedy Club'},
  {venue:'Wiseguys Comedy Ogden',city:'Ogden',state:'UT',capacity:250,booker:'',email:'ogden@wiseguyscomedy.com',instagram:'@wiseguyscomedy',venueType:'Comedy Club'},
  {venue:'Honolulu Comedy Club',city:'Honolulu',state:'HI',capacity:200,booker:'',email:'booking@honolulucomedyclub.com',instagram:'@honolulucomedy',venueType:'Comedy Club'},
  // CASINOS
  {venue:'Pechanga Resort Casino',city:'Temecula',state:'CA',capacity:1200,booker:'',email:'entertainment@pechanga.com',instagram:'@pechanga',venueType:'Casino'},
  {venue:'Agua Caliente Casino',city:'Rancho Mirage',state:'CA',capacity:600,booker:'',email:'entertainment@hotwatercasino.com',instagram:'@aguacalientecasino',venueType:'Casino'},
  {venue:'Morongo Casino',city:'Cabazon',state:'CA',capacity:500,booker:'',email:'entertainment@morongocasino.com',instagram:'@morongocasino',venueType:'Casino'},
  {venue:'San Manuel Casino',city:'Highland',state:'CA',capacity:800,booker:'',email:'entertainment@sanmanuel.com',instagram:'@sanmanuelcasino',venueType:'Casino'},
  {venue:"Jimmy Kimmel's Comedy Club",city:'Las Vegas',state:'NV',capacity:300,booker:'',email:'booking@jimmykimmelscomedyclub.com',instagram:'@jimmykimmelscomedyclub',venueType:'Prestige Club'},
  {venue:"Brad Garrett's Comedy Club",city:'Las Vegas',state:'NV',capacity:300,booker:'',email:'info@bradgarrettscomedyclub.com',instagram:'@bradgarrettscomedyclub',venueType:'Comedy Club'},
  {venue:'Foxwoods Resort Casino',city:'Mashantucket',state:'CT',capacity:1400,booker:'',email:'entertainment@foxwoods.com',instagram:'@foxwoods',venueType:'Casino'},
  {venue:'Mohegan Sun',city:'Uncasville',state:'CT',capacity:10000,booker:'',email:'entertainment@mohegansun.com',instagram:'@mohegansun',venueType:'Casino'},
  {venue:'Soaring Eagle Casino',city:'Mount Pleasant',state:'MI',capacity:800,booker:'',email:'entertainment@soaringeaglecasino.com',instagram:'@soaringeagle',venueType:'Casino'},
  {venue:'Hollywood Casino Columbus',city:'Columbus',state:'OH',capacity:500,booker:'',email:'entertainment@hollywoodcolumbus.com',instagram:'@hollywoodcasinocolumbus',venueType:'Casino'},
  {venue:'Wind Creek Casino',city:'Bethlehem',state:'PA',capacity:700,booker:'',email:'entertainment@windcreekbethlehem.com',instagram:'@windcreekcasino',venueType:'Casino'},
  {venue:'Turning Stone Resort Casino',city:'Verona',state:'NY',capacity:5000,booker:'',email:'entertainment@turningstone.com',instagram:'@turningstone',venueType:'Casino'},
  {venue:'Mystic Lake Casino',city:'Prior Lake',state:'MN',capacity:600,booker:'',email:'entertainment@mysticlake.com',instagram:'@mysticlake',venueType:'Casino'},
  {venue:"Harrah's Cherokee",city:'Cherokee',state:'NC',capacity:800,booker:'',email:'entertainment@harrahscherokee.com',instagram:'@harrahscherokee',venueType:'Casino'},
  {venue:'Hard Rock Hollywood',city:'Hollywood',state:'FL',capacity:5500,booker:'',email:'entertainment@hardrockholly.com',instagram:'@hardrockhollywood',venueType:'Casino'},
  {venue:'Potawatomi Casino',city:'Milwaukee',state:'WI',capacity:500,booker:'',email:'entertainment@paysbig.com',instagram:'@potawatomicasino',venueType:'Casino'},
  // COLLEGES
  {venue:'UCLA Campus Events',city:'Los Angeles',state:'CA',capacity:500,booker:'',email:'entertainment@asucla.ucla.edu',instagram:'@uclaevents',venueType:'College'},
  {venue:'USC Student Affairs',city:'Los Angeles',state:'CA',capacity:500,booker:'',email:'entertainment@usc.edu',instagram:'@uscstudentaffairs',venueType:'College'},
  {venue:'NYU Programming Board',city:'New York',state:'NY',capacity:400,booker:'',email:'studentactivities@nyu.edu',instagram:'@nyustudentlife',venueType:'College'},
  {venue:'Michigan State University',city:'East Lansing',state:'MI',capacity:600,booker:'',email:'entertainment@msu.edu',instagram:'@msuentertainment',venueType:'College'},
  {venue:'University of Texas Austin',city:'Austin',state:'TX',capacity:600,booker:'',email:'entertainment@utexas.edu',instagram:'@utaustinevents',venueType:'College'},
  {venue:'Ohio State University',city:'Columbus',state:'OH',capacity:700,booker:'',email:'entertainment@osu.edu',instagram:'@osuevents',venueType:'College'},
  {venue:'University of Florida',city:'Gainesville',state:'FL',capacity:600,booker:'',email:'entertainment@ufl.edu',instagram:'@ufentertainment',venueType:'College'},
  {venue:'University of Arizona',city:'Tucson',state:'AZ',capacity:500,booker:'',email:'entertainment@arizona.edu',instagram:'@uofaevents',venueType:'College'},
  {venue:'Colorado State University',city:'Fort Collins',state:'CO',capacity:500,booker:'',email:'entertainment@colostate.edu',instagram:'@csuevents',venueType:'College'},
  {venue:'University of Washington',city:'Seattle',state:'WA',capacity:600,booker:'',email:'entertainment@uw.edu',instagram:'@uwentertainment',venueType:'College'},
  // -- EXPANDED DATABASE ----------------------------------------
  // MORE COMEDY CLUBS
  {venue:'Helium Comedy Club Buffalo',city:'Buffalo',state:'NY',capacity:250,booker:'',email:'buffalo@heliumcomedy.com',instagram:'@heliumcomedy',venueType:'Comedy Club'},
  {venue:'Funny Bone Virginia Beach',city:'Virginia Beach',state:'VA',capacity:300,booker:'',email:'vabeach@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Funny Bone Hampton Roads',city:'Hampton',state:'VA',capacity:280,booker:'',email:'hampton@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'The Comedy Zone Jacksonville',city:'Jacksonville',state:'FL',capacity:270,booker:'',email:'jax@comedyzone.com',instagram:'@comedyzone',venueType:'Comedy Club'},
  {venue:'Penguin Comedy Club',city:'Tulsa',state:'OK',capacity:220,booker:'',email:'booking@penguincomedy.com',instagram:'@penguincomedy',venueType:'Comedy Club'},
  {venue:'Loony Bin Tulsa',city:'Tulsa',state:'OK',capacity:250,booker:'',email:'tulsa@loonybincomedy.com',instagram:'@loonybincomedy',venueType:'Comedy Club'},
  {venue:'Funny Bone Toledo',city:'Toledo',state:'OH',capacity:280,booker:'',email:'toledo@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Jukebox Comedy Club',city:'Peoria',state:'IL',capacity:200,booker:'',email:'booking@jukeboxcomedy.com',instagram:'@jukeboxcomedy',venueType:'Comedy Club'},
  {venue:'Comedy Off Broadway',city:'Lexington',state:'KY',capacity:250,booker:'',email:'booking@comedyoffbroadway.com',instagram:'@comedyoffbroadway',venueType:'Comedy Club'},
  {venue:'Laughing Skull Lounge',city:'Atlanta',state:'GA',capacity:100,booker:'',email:'booking@laughingskulllounge.com',instagram:'@laughingskulllounge',venueType:'Comedy Club'},
  {venue:'The Comedy Spot',city:'Scottsdale',state:'AZ',capacity:120,booker:'',email:'booking@thecomedyspot.net',instagram:'@thecomedyspot',venueType:'Comedy Club'},
  {venue:'Helium Comedy Club St. Louis',city:'St. Louis',state:'MO',capacity:300,booker:'',email:'stlouis@heliumcomedy.com',instagram:'@heliumcomedy',venueType:'Comedy Club'},
  {venue:'Funny Bone Baton Rouge',city:'Baton Rouge',state:'LA',capacity:280,booker:'',email:'batonrouge@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'River City Comedy Festival',city:'Louisville',state:'KY',capacity:400,booker:'',email:'booking@rivercitycomedy.com',instagram:'@rivercitycomedy',venueType:'Comedy Club'},
  {venue:'Funny Stop Comedy Club',city:'Cuyahoga Falls',state:'OH',capacity:200,booker:'',email:'booking@funnystop.com',instagram:'@funnystop',venueType:'Comedy Club'},
  {venue:'The Comedy Bar Chicago',city:'Chicago',state:'IL',capacity:150,booker:'',email:'booking@thecomedybar.com',instagram:'@comedybarchicago',venueType:'Comedy Club'},
  {venue:'Flappers Comedy Club',city:'Burbank',state:'CA',capacity:200,booker:'',email:'booking@flapperscomedy.com',instagram:'@flapperscomedy',venueType:'Comedy Club'},
  {venue:'The Laugh Factory Las Vegas',city:'Las Vegas',state:'NV',capacity:300,booker:'',email:'vegas@laughfactory.com',instagram:'@laughfactory',venueType:'Comedy Club'},
  {venue:'Improv Addison',city:'Addison',state:'TX',capacity:300,booker:'',email:'addison@improv.com',instagram:'@addisonimprov',venueType:'Comedy Club'},
  {venue:'Funny Bone Richmond',city:'Richmond',state:'VA',capacity:280,booker:'',email:'richmond@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Funny Bone Albany',city:'Albany',state:'NY',capacity:280,booker:'',email:'albany@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'River City Improv',city:'Memphis',state:'TN',capacity:180,booker:'',email:'booking@rivercityimprov.com',instagram:'@rivercityimprov',venueType:'Comedy Club'},
  {venue:'The Comedy Zone Columbia',city:'Columbia',state:'SC',capacity:200,booker:'',email:'columbia@comedyzone.com',instagram:'@comedyzone',venueType:'Comedy Club'},
  {venue:'Improv Comedy Club Oklahoma City',city:'Oklahoma City',state:'OK',capacity:300,booker:'',email:'okc@improv.com',instagram:'@okcimprov',venueType:'Comedy Club'},
  {venue:'Zanies Comedy Rosemont',city:'Rosemont',state:'IL',capacity:280,booker:'',email:'rosemont@zanies.com',instagram:'@zaniescomedy',venueType:'Comedy Club'},
  {venue:'Improv Comedy Club Pittsburgh',city:'Pittsburgh',state:'PA',capacity:300,booker:'',email:'pittsburgh@improv.com',instagram:'@pittsburghimprov',venueType:'Comedy Club'},
  {venue:'Comedy On State',city:'Madison',state:'WI',capacity:200,booker:'',email:'booking@comedyonstate.com',instagram:'@comedyonstate',venueType:'Comedy Club'},
  {venue:'Charleston Funny Bone',city:'Charleston',state:'WV',capacity:250,booker:'',email:'charleston@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Improv Comedy Club Providence',city:'Providence',state:'RI',capacity:250,booker:'',email:'providence@improv.com',instagram:'@providenceimprov',venueType:'Comedy Club'},
  {venue:'Vermont Comedy Club',city:'Burlington',state:'VT',capacity:150,booker:'',email:'booking@vermontcomedyclub.com',instagram:'@vtcomedyclub',venueType:'Comedy Club'},
  {venue:'The Comedy Attic',city:'Bloomington',state:'IN',capacity:175,booker:'',email:'booking@thecomedyattic.com',instagram:'@thecomedyattic',venueType:'Comedy Club'},
  {venue:'Funny Bone Dayton',city:'Dayton',state:'OH',capacity:270,booker:'',email:'dayton@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Levity Live West Nyack',city:'West Nyack',state:'NY',capacity:280,booker:'',email:'westnyack@levitylive.com',instagram:'@levitylive',venueType:'Comedy Club'},
  {venue:'Comedy Zone Greensboro',city:'Greensboro',state:'NC',capacity:250,booker:'',email:'greensboro@comedyzone.com',instagram:'@comedyzone',venueType:'Comedy Club'},
  {venue:'Roanoke Comedy Zone',city:'Roanoke',state:'VA',capacity:220,booker:'',email:'roanoke@comedyzone.com',instagram:'@comedyzone',venueType:'Comedy Club'},
  {venue:'Helium Comedy Club Cincinnati',city:'Cincinnati',state:'OH',capacity:280,booker:'',email:'cincinnati@heliumcomedy.com',instagram:'@heliumcomedy',venueType:'Comedy Club'},
  {venue:'Helium Comedy Club Portland',city:'Portland',state:'OR',capacity:280,booker:'',email:'portland2@heliumcomedy.com',instagram:'@heliumcomedy',venueType:'Comedy Club'},
  {venue:"Laff's Comedy Caffe",city:'Tucson',state:'AZ',capacity:200,booker:'',email:'booking@laffstucson.com',instagram:'@laffscomedy',venueType:'Comedy Club'},
  {venue:'The Loft Comedy Club',city:'Bozeman',state:'MT',capacity:120,booker:'',email:'booking@theloftbozeman.com',instagram:'@loftcomedy',venueType:'Comedy Club'},
  {venue:'Portland Funny Bone',city:'Portland',state:'ME',capacity:220,booker:'',email:'portland@funnybone.com',instagram:'@funnybone',venueType:'Comedy Club'},
  {venue:'Joke Joint Comedy Club',city:'Jackson',state:'MS',capacity:180,booker:'',email:'booking@jokejoint.com',instagram:'@jokejoint',venueType:'Comedy Club'},
  {venue:'Creek and the Cave',city:'New York',state:'NY',capacity:80,booker:'',email:'booking@creeklic.com',instagram:'@creekandthecave',venueType:'Comedy Club'},
  {venue:'The Comedy Zone Wilmington',city:'Wilmington',state:'NC',capacity:200,booker:'',email:'wilmington@comedyzone.com',instagram:'@comedyzone',venueType:'Comedy Club'},
  {venue:'Improv Tempe',city:'Tempe',state:'AZ',capacity:280,booker:'',email:'tempe2@improv.com',instagram:'@tempeimprov',venueType:'Comedy Club'},
  {venue:'Acme Comedy Club Minneapolis',city:'Minneapolis',state:'MN',capacity:300,booker:'',email:'acme@acmecomedyco.com',instagram:'@acmecomedyco',venueType:'Comedy Club'},
  // MORE CASINOS
  {venue:'Mohegan Sun Pocono',city:'Wilkes-Barre',state:'PA',capacity:900,booker:'',email:'entertainment@mohegansunpocono.com',instagram:'@mohegansunpocono',venueType:'Casino'},
  {venue:'Seneca Niagara Casino',city:'Niagara Falls',state:'NY',capacity:700,booker:'',email:'entertainment@senecaniagaracasino.com',instagram:'@senecaniagaracasino',venueType:'Casino'},
  {venue:'Snoqualmie Casino',city:'Snoqualmie',state:'WA',capacity:600,booker:'',email:'entertainment@snocasino.com',instagram:'@snoqualimiecasino',venueType:'Casino'},
  {venue:'Tulalip Resort Casino',city:'Tulalip',state:'WA',capacity:700,booker:'',email:'entertainment@tulalipresorts.com',instagram:'@tulalipresorts',venueType:'Casino'},
  {venue:'Graton Resort Casino',city:'Rohnert Park',state:'CA',capacity:1200,booker:'',email:'entertainment@gratonresortcasino.com',instagram:'@gratonresort',venueType:'Casino'},
  {venue:'Thunder Valley Casino',city:'Lincoln',state:'CA',capacity:800,booker:'',email:'entertainment@thundervalleyresort.com',instagram:'@thundervalley',venueType:'Casino'},
  {venue:'Viejas Casino',city:'Alpine',state:'CA',capacity:800,booker:'',email:'entertainment@viejas.com',instagram:'@viejascasino',venueType:'Casino'},
  {venue:'Barona Resort Casino',city:'Lakeside',state:'CA',capacity:700,booker:'',email:'entertainment@barona.com',instagram:'@baronacasino',venueType:'Casino'},
  {venue:'Pala Casino Spa Resort',city:'Pala',state:'CA',capacity:800,booker:'',email:'entertainment@palacasino.com',instagram:'@palacasino',venueType:'Casino'},
  {venue:'Talking Stick Resort',city:'Scottsdale',state:'AZ',capacity:800,booker:'',email:'entertainment@talkingstickresort.com',instagram:'@talkingstick',venueType:'Casino'},
  {venue:'WinStar World Casino',city:'Thackerville',state:'OK',capacity:2000,booker:'',email:'entertainment@winstar.com',instagram:'@winstarworldcasino',venueType:'Casino'},
  {venue:'Choctaw Casino Durant',city:'Durant',state:'OK',capacity:700,booker:'',email:'entertainment@choctawcasinos.com',instagram:'@choctawcasinos',venueType:'Casino'},
  {venue:'River Spirit Casino Resort',city:'Tulsa',state:'OK',capacity:900,booker:'',email:'entertainment@riverspirit.com',instagram:'@riverspirit',venueType:'Casino'},
  {venue:'Isle of Capri Casino',city:'Bettendorf',state:'IA',capacity:800,booker:'',email:'entertainment@isleofcapricasino.com',instagram:'@isleofcapri',venueType:'Casino'},
  {venue:'Prairie Meadows Casino',city:'Altoona',state:'IA',capacity:900,booker:'',email:'entertainment@prairiemeadows.com',instagram:'@prairiemeadows',venueType:'Casino'},
  {venue:'Ho-Chunk Casino',city:'Wisconsin Dells',state:'WI',capacity:900,booker:'',email:'entertainment@hochunkcasino.com',instagram:'@hochunkcasino',venueType:'Casino'},
  {venue:'Oneida Casino',city:'Green Bay',state:'WI',capacity:700,booker:'',email:'entertainment@oneidacasino.com',instagram:'@oneidacasino',venueType:'Casino'},
  {venue:'Four Winds Casino South Bend',city:'South Bend',state:'IN',capacity:700,booker:'',email:'entertainment@fourwindscasino.com',instagram:'@fourwindscasino',venueType:'Casino'},
  {venue:'MGM Grand Detroit',city:'Detroit',state:'MI',capacity:1100,booker:'',email:'entertainment@mgmgranddetroit.com',instagram:'@mgmgranddetroit',venueType:'Casino'},
  {venue:'MotorCity Casino Hotel',city:'Detroit',state:'MI',capacity:900,booker:'',email:'entertainment@motorcitycasino.com',instagram:'@motorcitycasino',venueType:'Casino'},
  {venue:'Soaring Eagle Casino',city:'Mount Pleasant',state:'MI',capacity:800,booker:'',email:'entertainment@soaringeaglecasino.com',instagram:'@soaringeagle',venueType:'Casino'},
  {venue:'Turning Stone Resort Casino',city:'Verona',state:'NY',capacity:5000,booker:'',email:'entertainment@turningstone.com',instagram:'@turningstone',venueType:'Casino'},
  {venue:'Mystic Lake Casino',city:'Prior Lake',state:'MN',capacity:600,booker:'',email:'entertainment@mysticlake.com',instagram:'@mysticlake',venueType:'Casino'},
  {venue:'Potawatomi Casino',city:'Milwaukee',state:'WI',capacity:500,booker:'',email:'entertainment@paysbig.com',instagram:'@potawatomicasino',venueType:'Casino'},
  {venue:'Wind Creek Casino',city:'Bethlehem',state:'PA',capacity:700,booker:'',email:'entertainment@windcreekbethlehem.com',instagram:'@windcreekcasino',venueType:'Casino'},
  {venue:'Hard Rock Hollywood',city:'Hollywood',state:'FL',capacity:5500,booker:'',email:'entertainment@hardrockholly.com',instagram:'@hardrockhollywood',venueType:'Casino'},
  {venue:"Harrah's Cherokee",city:'Cherokee',state:'NC',capacity:800,booker:'',email:'entertainment@harrahscherokee.com',instagram:'@harrahscherokee',venueType:'Casino'},
  {venue:'Hollywood Casino Columbus',city:'Columbus',state:'OH',capacity:500,booker:'',email:'entertainment@hollywoodcolumbus.com',instagram:'@hollywoodcasinocolumbus',venueType:'Casino'},
  {venue:'Mohegan Sun',city:'Uncasville',state:'CT',capacity:10000,booker:'',email:'entertainment@mohegansun.com',instagram:'@mohegansun',venueType:'Casino'},
  {venue:'Foxwoods Resort Casino',city:'Mashantucket',state:'CT',capacity:1400,booker:'',email:'entertainment@foxwoods.com',instagram:'@foxwoods',venueType:'Casino'},
  // MORE THEATERS
  {venue:'The Paramount Theatre Seattle',city:'Seattle',state:'WA',capacity:2800,booker:'',email:'booking@stgpresents.org',instagram:'@theparamountseattle',venueType:'Theater'},
  {venue:'Ryman Auditorium',city:'Nashville',state:'TN',capacity:2300,booker:'',email:'booking@ryman.com',instagram:'@rymanauditorium',venueType:'Theater'},
  {venue:'The Fillmore SF',city:'San Francisco',state:'CA',capacity:1150,booker:'',email:'booking@thefillmore.com',instagram:'@thefillmore',venueType:'Theater'},
  {venue:'House of Blues Dallas',city:'Dallas',state:'TX',capacity:1750,booker:'',email:'dallas@houseofblues.com',instagram:'@hobdallas',venueType:'Theater'},
  {venue:'House of Blues Chicago',city:'Chicago',state:'IL',capacity:1800,booker:'',email:'chicago@houseofblues.com',instagram:'@hobchicago',venueType:'Theater'},
  {venue:'The Tabernacle Atlanta',city:'Atlanta',state:'GA',capacity:2600,booker:'',email:'booking@tabernacleatl.com',instagram:'@tabernacle_atl',venueType:'Theater'},
  {venue:'The Orpheum Theatre Minneapolis',city:'Minneapolis',state:'MN',capacity:2600,booker:'',email:'booking@hennepintheatretrust.org',instagram:'@orpheummpls',venueType:'Theater'},
  {venue:'Pabst Theater',city:'Milwaukee',state:'WI',capacity:1400,booker:'',email:'booking@pabsttheater.org',instagram:'@pabsttheater',venueType:'Theater'},
  {venue:'The Midland Theatre KC',city:'Kansas City',state:'MO',capacity:3200,booker:'',email:'booking@themidlandkc.com',instagram:'@themidlandkc',venueType:'Theater'},
  {venue:'The Fox Theatre Atlanta',city:'Atlanta',state:'GA',capacity:4600,booker:'',email:'booking@foxtheatre.org',instagram:'@foxtheatre',venueType:'Theater'},
  {venue:'Carolina Theatre Durham',city:'Durham',state:'NC',capacity:1100,booker:'',email:'booking@carolinatheatre.org',instagram:'@carolinatheatre',venueType:'Theater'},
  {venue:'Boch Center Wang Theatre',city:'Boston',state:'MA',capacity:3600,booker:'',email:'booking@bochcenter.org',instagram:'@bochcenter',venueType:'Theater'},
  {venue:'Buell Theatre Denver',city:'Denver',state:'CO',capacity:2800,booker:'',email:'booking@denvercenter.org',instagram:'@denvercenter',venueType:'Theater'},
  {venue:'Tennessee Performing Arts Center',city:'Nashville',state:'TN',capacity:2470,booker:'',email:'booking@tpac.org',instagram:'@tpac',venueType:'Theater'},
  {venue:'Cerritos Center for the Arts',city:'Cerritos',state:'CA',capacity:1600,booker:'',email:'booking@cerritoscenter.com',instagram:'@cerritoscenter',venueType:'Theater'},
  // MORE COLLEGES
  {venue:'Penn State University',city:'State College',state:'PA',capacity:800,booker:'',email:'entertainment@psu.edu',instagram:'@pennstate',venueType:'College'},
  {venue:'Indiana University',city:'Bloomington',state:'IN',capacity:700,booker:'',email:'entertainment@iu.edu',instagram:'@iubloomington',venueType:'College'},
  {venue:'Purdue University',city:'West Lafayette',state:'IN',capacity:700,booker:'',email:'entertainment@purdue.edu',instagram:'@purdue',venueType:'College'},
  {venue:'University of Michigan',city:'Ann Arbor',state:'MI',capacity:800,booker:'',email:'entertainment@umich.edu',instagram:'@uofmichigan',venueType:'College'},
  {venue:'University of Wisconsin Madison',city:'Madison',state:'WI',capacity:750,booker:'',email:'entertainment@wisc.edu',instagram:'@uwmadison',venueType:'College'},
  {venue:'University of Minnesota',city:'Minneapolis',state:'MN',capacity:700,booker:'',email:'entertainment@umn.edu',instagram:'@umnews',venueType:'College'},
  {venue:'University of Iowa',city:'Iowa City',state:'IA',capacity:600,booker:'',email:'entertainment@uiowa.edu',instagram:'@uiowa',venueType:'College'},
  {venue:'Iowa State University',city:'Ames',state:'IA',capacity:650,booker:'',email:'entertainment@iastate.edu',instagram:'@iowastate',venueType:'College'},
  {venue:'Kansas State University',city:'Manhattan',state:'KS',capacity:600,booker:'',email:'entertainment@ksu.edu',instagram:'@kstateuniversity',venueType:'College'},
  {venue:'University of Kansas',city:'Lawrence',state:'KS',capacity:650,booker:'',email:'entertainment@ku.edu',instagram:'@universityofkansas',venueType:'College'},
  {venue:'University of Missouri',city:'Columbia',state:'MO',capacity:700,booker:'',email:'entertainment@missouri.edu',instagram:'@mizzou',venueType:'College'},
  {venue:'University of Kentucky',city:'Lexington',state:'KY',capacity:700,booker:'',email:'entertainment@uky.edu',instagram:'@universityofky',venueType:'College'},
  {venue:'University of Tennessee',city:'Knoxville',state:'TN',capacity:750,booker:'',email:'entertainment@utk.edu',instagram:'@uoftennessee',venueType:'College'},
  {venue:'Vanderbilt University',city:'Nashville',state:'TN',capacity:500,booker:'',email:'entertainment@vanderbilt.edu',instagram:'@vanderbiltu',venueType:'College'},
  {venue:'University of Alabama',city:'Tuscaloosa',state:'AL',capacity:700,booker:'',email:'entertainment@ua.edu',instagram:'@uofalabama',venueType:'College'},
  {venue:'Auburn University',city:'Auburn',state:'AL',capacity:650,booker:'',email:'entertainment@auburn.edu',instagram:'@auburnuniversity',venueType:'College'},
  {venue:'Louisiana State University',city:'Baton Rouge',state:'LA',capacity:750,booker:'',email:'entertainment@lsu.edu',instagram:'@lsu',venueType:'College'},
  {venue:'University of Mississippi',city:'Oxford',state:'MS',capacity:600,booker:'',email:'entertainment@olemiss.edu',instagram:'@olemiss',venueType:'College'},
  {venue:'University of Arkansas',city:'Fayetteville',state:'AR',capacity:650,booker:'',email:'entertainment@uark.edu',instagram:'@uofarkansas',venueType:'College'},
  {venue:'Oklahoma State University',city:'Stillwater',state:'OK',capacity:650,booker:'',email:'entertainment@okstate.edu',instagram:'@okstate',venueType:'College'},
  {venue:'University of Oklahoma',city:'Norman',state:'OK',capacity:700,booker:'',email:'entertainment@ou.edu',instagram:'@uofoklahoma',venueType:'College'},
  {venue:'Texas A&M University',city:'College Station',state:'TX',capacity:800,booker:'',email:'entertainment@tamu.edu',instagram:'@texasamuniversity',venueType:'College'},
  {venue:'Texas Tech University',city:'Lubbock',state:'TX',capacity:650,booker:'',email:'entertainment@ttu.edu',instagram:'@texastech',venueType:'College'},
  {venue:'University of Colorado Boulder',city:'Boulder',state:'CO',capacity:700,booker:'',email:'entertainment@colorado.edu',instagram:'@cuboulder',venueType:'College'},
  {venue:'University of Utah',city:'Salt Lake City',state:'UT',capacity:700,booker:'',email:'entertainment@utah.edu',instagram:'@universityofutah',venueType:'College'},
  {venue:'Brigham Young University',city:'Provo',state:'UT',capacity:800,booker:'',email:'entertainment@byu.edu',instagram:'@byu',venueType:'College'},
  {venue:'University of Nevada Las Vegas',city:'Las Vegas',state:'NV',capacity:700,booker:'',email:'entertainment@unlv.edu',instagram:'@unlv',venueType:'College'},
  {venue:'Arizona State University',city:'Tempe',state:'AZ',capacity:900,booker:'',email:'entertainment@asu.edu',instagram:'@arizonastateuniversity',venueType:'College'},
  {venue:'Oregon State University',city:'Corvallis',state:'OR',capacity:650,booker:'',email:'entertainment@oregonstate.edu',instagram:'@oregonstate',venueType:'College'},
  {venue:'University of Oregon',city:'Eugene',state:'OR',capacity:700,booker:'',email:'entertainment@uoregon.edu',instagram:'@uoregon',venueType:'College'},
  {venue:'Washington State University',city:'Pullman',state:'WA',capacity:650,booker:'',email:'entertainment@wsu.edu',instagram:'@wsupullman',venueType:'College'},
  {venue:'Boise State University',city:'Boise',state:'ID',capacity:600,booker:'',email:'entertainment@boisestate.edu',instagram:'@boisestate',venueType:'College'},
  {venue:'University of Wyoming',city:'Laramie',state:'WY',capacity:500,booker:'',email:'entertainment@uwyo.edu',instagram:'@uwyoming',venueType:'College'},
  {venue:'North Dakota State University',city:'Fargo',state:'ND',capacity:600,booker:'',email:'entertainment@ndsu.edu',instagram:'@ndsu',venueType:'College'},
  {venue:'University of Nebraska',city:'Lincoln',state:'NE',capacity:700,booker:'',email:'entertainment@unl.edu',instagram:'@unlsocial',venueType:'College'},
  {venue:'University of New Mexico',city:'Albuquerque',state:'NM',capacity:650,booker:'',email:'entertainment@unm.edu',instagram:'@unm',venueType:'College'},
  {venue:'University of Hawaii',city:'Honolulu',state:'HI',capacity:600,booker:'',email:'entertainment@hawaii.edu',instagram:'@uhmanoa',venueType:'College'},
  {venue:'Boston University',city:'Boston',state:'MA',capacity:700,booker:'',email:'entertainment@bu.edu',instagram:'@bostonu',venueType:'College'},
  {venue:'University of Massachusetts Amherst',city:'Amherst',state:'MA',capacity:750,booker:'',email:'entertainment@umass.edu',instagram:'@umass',venueType:'College'},
  {venue:'University of Connecticut',city:'Storrs',state:'CT',capacity:700,booker:'',email:'entertainment@uconn.edu',instagram:'@uconn',venueType:'College'},
  {venue:'University of Vermont',city:'Burlington',state:'VT',capacity:550,booker:'',email:'entertainment@uvm.edu',instagram:'@uvmvermont',venueType:'College'},
  {venue:'Rutgers University',city:'New Brunswick',state:'NJ',capacity:750,booker:'',email:'entertainment@rutgers.edu',instagram:'@rutgersuniversity',venueType:'College'},
  {venue:'University of Delaware',city:'Newark',state:'DE',capacity:600,booker:'',email:'entertainment@udel.edu',instagram:'@udelaware',venueType:'College'},
  {venue:'University of Maryland',city:'College Park',state:'MD',capacity:750,booker:'',email:'entertainment@umd.edu',instagram:'@umaryland',venueType:'College'},
  {venue:'Virginia Tech',city:'Blacksburg',state:'VA',capacity:700,booker:'',email:'entertainment@vt.edu',instagram:'@vatech',venueType:'College'},
  {venue:'University of Virginia',city:'Charlottesville',state:'VA',capacity:700,booker:'',email:'entertainment@virginia.edu',instagram:'@uva',venueType:'College'},
  {venue:'University of North Carolina',city:'Chapel Hill',state:'NC',capacity:750,booker:'',email:'entertainment@unc.edu',instagram:'@unc',venueType:'College'},
  {venue:'Clemson University',city:'Clemson',state:'SC',capacity:700,booker:'',email:'entertainment@clemson.edu',instagram:'@clemsonuniversity',venueType:'College'},
  {venue:'University of Georgia',city:'Athens',state:'GA',capacity:750,booker:'',email:'entertainment@uga.edu',instagram:'@universityofga',venueType:'College'},
  {venue:'Florida State University',city:'Tallahassee',state:'FL',capacity:750,booker:'',email:'entertainment@fsu.edu',instagram:'@floridastate',venueType:'College'},
  {venue:'University of Central Florida',city:'Orlando',state:'FL',capacity:800,booker:'',email:'entertainment@ucf.edu',instagram:'@ucf',venueType:'College'},
  {venue:'University of South Florida',city:'Tampa',state:'FL',capacity:700,booker:'',email:'entertainment@usf.edu',instagram:'@usflorida',venueType:'College'},
];

// -- DESIGN TOKENS --------------------------------------------
const C = {
  bg:'#07070f',surf:'#0d0d1a',surf2:'#13131f',surf3:'#1a1a2a',
  bord:'#1e1e35',acc:'#6c5ce7',acc2:'#a29bfe',green:'#00b894',
  yellow:'#fdcb6e',red:'#e17055',blue:'#74b9ff',purple:'#a29bfe',
  txt:'#e8e8f5',muted:'#4a4a6a',muted2:'#6a6a8a',
};
const font = { head:"'Syne', sans-serif", body:"'DM Mono', monospace" };
const s = {
  app:{fontFamily:font.body,background:C.bg,minHeight:'100vh',color:C.txt,width:'100%',position:'relative'},
  header:{background:C.bg,borderBottom:`1px solid ${C.bord}`,padding:'14px 18px 12px',position:'sticky',top:0,zIndex:50},
  content:{paddingBottom:90},
  nav:{position:'fixed',bottom:0,left:0,width:'100%',background:'rgba(7,7,15,0.97)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderTop:`1px solid ${C.bord}`,display:'flex',zIndex:100},
  navBtn:(a)=>({flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'9px 4px',border:'none',background:'none',color:a?C.acc2:C.muted,cursor:'pointer',fontSize:9,letterSpacing:1,textTransform:'uppercase',fontFamily:font.body,gap:4,transition:'color 0.15s'}),
  card:{background:C.surf,border:`1px solid ${C.bord}`,borderRadius:14,padding:'14px 16px',cursor:'pointer',marginBottom:10,position:'relative',overflow:'hidden',transition:'border-color 0.15s'},
  pill:(bg,color,border)=>({fontSize:10,padding:'3px 9px',borderRadius:20,background:bg,color,border:`1px solid ${border||bg}`,letterSpacing:0.5,display:'inline-block',whiteSpace:'nowrap'}),
  btn:(bg,color,border)=>({padding:'12px 16px',borderRadius:11,border:border?`1px solid ${border}`:'none',background:bg,color,fontSize:13,fontFamily:font.head,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,transition:'all 0.15s',flex:1}),
  input:(size=13)=>({width:'100%',background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:10,padding:'11px 13px',fontSize:size,fontFamily:font.body,color:C.txt,outline:'none',display:'block'}),
  select:{width:'100%',background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:10,padding:'11px 13px',fontSize:13,fontFamily:font.body,color:C.txt,outline:'none',display:'block'},
  label:{fontSize:10,color:C.muted2,letterSpacing:1.5,textTransform:'uppercase',marginBottom:6,display:'block'},
  field:(mb=14)=>({marginBottom:mb}),
  overlay:(o)=>({position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:200,opacity:o?1:0,pointerEvents:o?'all':'none',transition:'opacity 0.25s'}),
  panel:(o)=>({position:'fixed',bottom:0,left:'50%',transform:`translateX(-50%) translateY(${o?0:100}%)`,width:'100%',maxWidth:640,background:C.surf,borderRadius:'22px 22px 0 0',borderTop:`1px solid ${C.bord}`,zIndex:201,transition:'transform 0.38s cubic-bezier(0.32,0.72,0,1)',maxHeight:'90vh',overflowY:'auto',paddingBottom:28}),
  handle:{width:38,height:4,background:C.bord,borderRadius:2,margin:'12px auto 0'},
  sectionTitle:{fontFamily:font.head,fontWeight:700,fontSize:13,color:C.txt,marginBottom:10,display:'flex',alignItems:'center',gap:8},
  divider:{height:1,background:C.bord,margin:'16px 0'},
  row:{display:'flex',gap:10},
  grid2:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10},
};

// -- UTILITIES ------------------------------------------------
function copyText(text,label,toast2){try{navigator.clipboard.writeText(text);}catch{const t=document.createElement('textarea');t.value=text;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);}toast2&&toast2(`${label} copied OK`);}
function formatCurrency(n){if(!n&&n!==0)return' - ';return'$'+Number(n).toLocaleString();}
function daysUntil(d){if(!d)return null;return Math.ceil((new Date(d)-new Date())/(1000*60*60*24));}
function isOverdue(d){const x=daysUntil(d);return x!==null&&x<0;}
function fillTemplate(template,venue,dates=''){
  const bookerFirst=venue.booker||'there';
  const bookerFull=venue.bookerLast?`${venue.booker} ${venue.bookerLast}`:venue.booker||'there';
  const filledDates=dates||venue.targetDates||'[DATES]';
  return template.replace(/\[VENUE\]/g,venue.venue||'[VENUE]').replace(/\[BOOKER_FIRST\]/g,bookerFirst).replace(/\[BOOKER_FULL\]/g,bookerFull).replace(/\[BOOKER\]/g,bookerFirst).replace(/\[CITY\]/g,venue.city||'[CITY]').replace(/\[STATE\]/g,venue.state||'[STATE]').replace(/\[DATES\]/g,filledDates).replace(/\[EMAIL\]/g,venue.email||'[EMAIL]').replace(/\[CAPACITY\]/g,venue.capacity||'[CAPACITY]');
}
function getSequenceSuggestion(v){
  const touch=(v.contactLog||[]).length+1;
  const isEx=v.relationship==='existing';
  if(touch===1)return isEx?'Use Existing Relationship template':'Use Jason + Phil Standard';
  if(touch===2)return'Use Follow-Up template';
  if(touch>=3)return touch>=4?'Consider Breakup Email':'Use Follow-Up template';
  return'';
}
function buildGoogleCalendarUrl(venue){
  const title=encodeURIComponent(`${venue.venue}  -  Phil Medina`);
  const location=encodeURIComponent(`${venue.city}, ${venue.state}`);
  const details=encodeURIComponent(`Venue: ${venue.venue}\nBooker: ${venue.booker||''}${venue.bookerLast?' '+venue.bookerLast:''}\nEmail: ${venue.email||''}\nDeal: ${venue.dealType||''} ${venue.guarantee?' -  $'+venue.guarantee:''}\nContract: ${venue.contractStatus||''}\nLodging: ${venue.lodging||''}`);
  const raw=venue.targetDates||'';
  const monthMatch=MONTHS.find(m=>raw.includes(m));
  if(!monthMatch)return null;
  try{
    const d=new Date(`${monthMatch} 1, 2025`);
    const start=d.toISOString().replace(/-/g,'').split('T')[0];
    const end=new Date(d);end.setDate(end.getDate()+3);
    const endStr=end.toISOString().replace(/-/g,'').split('T')[0];
    return`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${endStr}&details=${details}&location=${location}`;
  }catch{return null;}
}

// -- SUB-COMPONENTS -------------------------------------------
function Toast({msg}){if(!msg)return null;return<div style={{position:'fixed',top:72,left:'50%',transform:'translateX(-50%)',background:C.surf3,border:`1px solid ${C.acc}`,borderRadius:10,padding:'10px 18px',fontSize:12,color:C.txt,zIndex:999,whiteSpace:'nowrap',pointerEvents:'none',fontFamily:font.body}}>{msg}</div>;}
function Panel({open,onClose,title,badge,children}){return<><div onClick={onClose} style={s.overlay(open)}/><div style={s.panel(open)}><div style={s.handle}/><div style={{padding:'16px 20px 0',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><div><div style={{fontFamily:font.head,fontWeight:800,fontSize:20,lineHeight:1.2}}>{title}</div>{badge&&<div style={{marginTop:6}}>{badge}</div>}</div><button onClick={onClose} style={{width:30,height:30,borderRadius:'50%',background:C.surf2,border:'none',color:C.muted2,fontSize:16,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>x</button></div><div style={{padding:'14px 20px'}}>{children}</div></div></>;} 
function StatusPill({status,small}){const color=PIPE_COLORS[status]||C.muted;return<span style={{...s.pill(`${color}18`,color,`${color}40`),fontSize:small?9:10}}>{status}</span>;}
function WarmthDot({warmth}){const color=WARMTH_COLORS[warmth]||C.muted;return<span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:10,color,fontFamily:font.body}}><span style={{width:6,height:6,borderRadius:'50%',background:color,display:'inline-block'}}/>{warmth}</span>;}
function ToggleGroup({options,value,onChange,color=C.acc}){return<div style={{display:'flex',background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:10,overflow:'hidden',marginBottom:14}}>{options.map(opt=><button key={opt.id||opt} onClick={()=>onChange(opt.id||opt)} style={{flex:1,padding:'9px 6px',textAlign:'center',fontSize:11,fontFamily:font.head,fontWeight:700,cursor:'pointer',color:value===(opt.id||opt)?color:C.muted,background:value===(opt.id||opt)?`${color}18`:'transparent',border:'none',transition:'all 0.15s'}}>{opt.label||opt}</button>)}</div>;}

// -- LOGIN -----------------------------------------------------
function LoginScreen({onLogin}){
  const[email,setEmail]=useState('');const[pw,setPw]=useState('');const[err,setErr]=useState('');const[loading,setLoading]=useState(false);
  async function attempt(){setLoading(true);setErr('');try{const match=await checkCredentials(email,pw);if(match){onLogin(email.toLowerCase().trim().replace(/\s/g,''));}else{setErr('Incorrect email or password.');setLoading(false);}}catch{setErr('Login error  -  please try again.');setLoading(false);}}
  return(<div style={{fontFamily:font.body,background:C.bg,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');*{box-sizing:border-box;}body{margin:0;background:${C.bg};}input,select,textarea{-webkit-appearance:none;}`}</style>
    <div style={{width:'100%',maxWidth:360}}>
      <div style={{textAlign:'center',marginBottom:44}}>
        <div style={{fontFamily:font.head,fontWeight:800,fontSize:38,color:C.txt,letterSpacing:-1,lineHeight:1}}>Stage<span style={{color:C.acc2}}>Boss</span></div>
        <div style={{fontSize:11,color:C.muted,letterSpacing:2,textTransform:'uppercase',marginTop:8}}>Comedy Booking Command Center</div>
        <div style={{width:48,height:3,background:`linear-gradient(90deg,${C.acc},${C.acc2})`,borderRadius:2,margin:'18px auto 0'}}/>
      </div>
      <div style={{background:C.surf,border:`1px solid ${C.bord}`,borderRadius:20,padding:28}}>
        <div style={{fontFamily:font.head,fontWeight:700,fontSize:17,marginBottom:22}}>Sign In</div>
        <div style={s.field()}><label style={s.label}>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==='Enter'&&attempt()} placeholder="your@gmail.com" autoCapitalize="none" autoCorrect="off" autoComplete="email" spellCheck="false" style={s.input()}/></div>
        <div style={s.field(20)}><label style={s.label}>Password</label><input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&attempt()} placeholder="**********" autoCapitalize="none" autoCorrect="off" autoComplete="current-password" style={s.input()}/></div>
        {err&&<div style={{background:'rgba(225,112,85,0.1)',border:'1px solid rgba(225,112,85,0.3)',borderRadius:8,padding:'10px 12px',fontSize:12,color:C.red,marginBottom:16}}>{err}</div>}
        <button onClick={attempt} disabled={loading} style={{...s.btn(loading?'#3d3270':C.acc,'#fff',null),width:'100%',opacity:loading?0.7:1}}>{loading?'Signing in...':'Sign In ->'}</button>
      </div>
    </div>
  </div>);
}

// -- MAIN APP -------------------------------------------------
export default function App(){
  const[user,setUser]=useState(()=>{try{return localStorage.getItem('sb_user')||null;}catch{return null;}});
  if(!user)return<LoginScreen onLogin={u=>{try{localStorage.setItem('sb_user',u);}catch{}setUser(u);}}/>;
  return<StageBoss user={user} onLogout={()=>{try{localStorage.removeItem('sb_user');}catch{}setUser(null);}}/>;
}

// -- STAGEBOSS ------------------------------------------------
function StageBoss({user,onLogout}){
  const[venues,setVenues]=useState(()=>{try{return migrateData(localStorage.getItem('sb_venues'));}catch{return[];}});
  const[templates,setTemplates]=useState(()=>{try{const s=localStorage.getItem('sb_templates');return s?JSON.parse(s):DEFAULT_TEMPLATES;}catch{return DEFAULT_TEMPLATES;}});
  const[photos]=useState(DEFAULT_PHOTOS);
  const[tours,setTours]=useState(()=>{try{const s=localStorage.getItem('sb_tours');return s?JSON.parse(s):[];}catch{return[];}});
  const[tab,setTab]=useState('today');
  const[search,setSearch]=useState('');
  const[statusFilter,setStatusFilter]=useState('All');
  const[toast,setToast]=useState('');
  const[activeFilter,setActiveFilter]=useState('All');
  // panel states
  const[detailId,setDetailId]=useState(null);
  const[composeId,setComposeId]=useState(null);
  const[dealId,setDealId]=useState(null);
  const[checklistId,setChecklistId]=useState(null);
  const[settlementId,setSettlementId]=useState(null);
  const[showReportId,setShowReportId]=useState(null);
  const[moneyOpen,setMoneyOpen]=useState(false);
  const[addOpen,setAddOpen]=useState(false);
  const[dbOpen,setDbOpen]=useState(false);
  const[templateOpen,setTemplateOpen]=useState(false);
  const[editTemplateId,setEditTemplateId]=useState(null);
  const[tourOpen,setTourOpen]=useState(false);
  const[editTourId,setEditTourId]=useState(null);
  const[expandTourId,setExpandTourId]=useState(null);
  const[tourBreakdownId,setTourBreakdownId]=useState(null);
  const[importOpen,setImportOpen]=useState(false);
  const[confirmDelete,setConfirmDelete]=useState(null);
  const[composeOpts,setComposeOpts]=useState({});
  const[dbSearch,setDbSearch]=useState('');
  const[dbStateFilter,setDbStateFilter]=useState('All');
  const[dbTypeFilter,setDbTypeFilter]=useState('All');
  const[nv,setNv]=useState({venue:'',booker:'',bookerLast:'',city:'',state:'',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:'',doorSplit:'',capacity:'',notes:'',referralSource:'',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20});
  const fileRef=useRef(null);
  const importRef=useRef(null);
  const[aiOpen,setAiOpen]=useState(false);
  const[aiVenueId,setAiVenueId]=useState(null);
  const[aiLoading,setAiLoading]=useState(false);
  const[aiResult,setAiResult]=useState('');
  const[voiceActive,setVoiceActive]=useState(false);
  const[voiceTarget,setVoiceTarget]=useState(null);
  const[stateFilter2,setStateFilter2]=useState('All');
  const recognitionRef=useRef(null);
  const[syncing,setSyncing]=useState(false);
  const[lastSync,setLastSync]=useState(null);
  const syncTimeout=useRef(null);

  // Cloud load on mount + poll every 20s for real-time sync
  useEffect(()=>{
    async function loadCloud(){
      setSyncing(true);
      const data=await cloudLoad(user);
      if(data){
        if(data.venues) setVenues(data.venues.map(migrateVenue));
        if(data.templates) setTemplates(data.templates);
        if(data.tours) setTours(data.tours);
        setLastSync(new Date());
      }
      setSyncing(false);
    }
    if(SB_URL!=='https://placeholder.supabase.co'){
      loadCloud();
      // Poll every 20 seconds for changes from other devices
      const pollInterval=setInterval(loadCloud, 20000);
      return ()=>clearInterval(pollInterval);
    }
  },[user]);

  // Auto-save to cloud on changes (debounced 3s)
  useEffect(()=>{
    if(SB_URL==='https://placeholder.supabase.co') return;
    clearTimeout(syncTimeout.current);
    syncTimeout.current=setTimeout(async()=>{
      setSyncing(true);
      await cloudSave(user,{venues,templates,tours});
      setLastSync(new Date());
      setSyncing(false);
    },1500);
    return()=>clearTimeout(syncTimeout.current);
  },[venues,templates,tours,user]);

  // -- AI OUTREACH WRITER --------------------------------------
  async function generateAIOutreach(venueId){
    const v=venues.find(x=>x.id===venueId);
    if(!v)return;
    setAiVenueId(venueId);setAiOpen(true);setAiLoading(true);setAiResult('');
    const touches=(v.contactLog||[]).length;
    const touchNum=touches+1;
    const isFollowUp=touches>0;
    const prompt='You are Jason Schuster, a bi-coastal touring comedian and tour manager for Phil Medina. Write a SHORT, natural, human booking outreach email. DO NOT sound like a form letter.\n\nVenue: '+v.venue+'\nCity: '+v.city+', '+v.state+'\nBooker: '+(v.booker||'their booker')+(v.bookerLast?' '+v.bookerLast:'')+'\nVenue type: '+(v.venueType||'comedy club')+'\nCapacity: '+(v.capacity||'unknown')+'\nRelationship: '+(v.relationship||'new contact')+'\nTouch number: '+touchNum+'\nTarget dates: '+(v.targetDates||'flexible')+'\nDeal preference: '+(v.dealType||'Flat Guarantee')+'\nHistory: '+(v.history||'none')+'\n\nPHIL MEDINA credits: Laugh Factory, Hollywood Improv, Ice House, Netflix Is A Joke Fest, Hulu West Coast Comedy Special.\nJASON SCHUSTER credits: Comedy Store, Jimmy Kimmels Comedy Club, Kenan Presents.\n\n'+(isFollowUp?'This is follow-up #'+touchNum+'. Be brief, reference the previous outreach, keep it warm and persistent.':'This is first contact. Be warm, professional, and concise.')+'\n\nRules:\n- Under 150 words\n- Natural tone, not corporate\n- Mention Phil AND Jason by name\n- End with clear availability ask\n- Sign as Jason Schuster\n\nWrite ONLY the email body, no subject line.';
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':ANTHROPIC_KEY,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:600,messages:[{role:'user',content:prompt}]})});
      const data=await res.json();
      const text=data.content?.map(b=>b.text||'').join('');
      if(text){
        setAiResult(text);
      } else {
        const errMsg=data.error?.message||JSON.stringify(data);
        setAiResult('Error: '+errMsg);
      }
    }catch(err){
      setAiResult(ANTHROPIC_KEY==='YOUR_ANTHROPIC_KEY_HERE'?'Add your Anthropic API key to the code first. Go to console.anthropic.com to get one.':'Could not generate email. Check your connection and API key.');
    }
    setAiLoading(false);
  }

  function copyAiResult(){
    if(!aiResult)return;
    try{navigator.clipboard.writeText(aiResult);}catch{const t=document.createElement('textarea');t.value=aiResult;document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);}
    toast2('AI email copied OK');
  }

  function openAiInGmail(){
    const v=venues.find(x=>x.id===aiVenueId);
    if(!v||!aiResult)return;
    const gmailUrl='https://mail.google.com/mail/u/0/?authuser=jschucomedy%40gmail.com&view=cm&to='+encodeURIComponent(v.email||'')+'&su='+encodeURIComponent('Phil Medina - Availability - '+v.venue)+'&body='+encodeURIComponent(aiResult);
    window.open(gmailUrl,'_blank');
    // Also copy to clipboard as fallback
    setTimeout(()=>{
      try{navigator.clipboard.writeText('To: '+v.email+'\nSubject: Phil Medina - Availability - '+v.venue+'\n\n'+aiResult);}catch{}
      toast2('Email opened + copied to clipboard');
    },500);
  }
  // -- VOICE TO TEMPLATE ----------------------------------------
  function startVoice(target,currentVal,onResult){
    const SpeechRecog=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecog){
      const typed=window.prompt('Speak-to-text not available. Type here instead:',currentVal||'');
      if(typed!==null) onResult((currentVal?currentVal+' ':'')+typed);
      return;
    }
    if(recognitionRef.current){recognitionRef.current.stop();recognitionRef.current=null;setVoiceTarget(null);return;}
    const r=new SpeechRecog();
    r.continuous=false;
    r.interimResults=false;
    r.lang='en-US';
    r.maxAlternatives=1;
    r.onstart=()=>{setVoiceTarget(target);toast2('Listening... speak now');};
    r.onresult=e=>{
      const transcript=Array.from(e.results).map(r=>r[0].transcript).join(' ').trim();
      onResult((currentVal?currentVal+' ':'')+transcript);
      toast2('Got it!');
    };
    r.onerror=e=>{
      toast2('Mic error: '+e.error+'. Try allowing microphone access.');
      setVoiceTarget(null);
      recognitionRef.current=null;
    };
    r.onend=()=>{setVoiceTarget(null);recognitionRef.current=null;};
    recognitionRef.current=r;
    try{r.start();}catch(e){toast2('Could not start mic. Check browser permissions.');}
  }

  function exportData(){
    const data={
      version:SCHEMA_VERSION,
      exportDate:new Date().toISOString(),
      venues,
      templates,
      tours,
    };
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url;
    a.download=`StageBoss-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast2('[OK] Backup exported!');
  }

  function importData(e){
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      try{
        const data=JSON.parse(ev.target.result);
        if(data.venues){
          setVenues(data.venues.map(migrateVenue));
          toast2(`[OK] ${data.venues.length} venues restored!`);
        }
        if(data.templates) setTemplates(data.templates);
        if(data.tours) setTours(data.tours);
        toast2('[OK] Backup restored successfully!');
      }catch{
        toast2('[error] Invalid backup file');
      }
    };
    reader.readAsText(file);
    e.target.value='';
  }

  useEffect(()=>{try{localStorage.setItem('sb_venues',JSON.stringify(venues));}catch{}},[venues]);
  useEffect(()=>{try{localStorage.setItem('sb_templates',JSON.stringify(templates));}catch{}},[templates]);
  useEffect(()=>{try{localStorage.setItem('sb_tours',JSON.stringify(tours));}catch{}},[tours]);

  const toast2=useCallback((msg)=>{setToast(msg);setTimeout(()=>setToast(''),2500);},[]);
  const upd=useCallback((id,fields)=>setVenues(vs=>vs.map(v=>v.id===id?{...v,...fields}:v)),[]);
  const getV=(id)=>venues.find(v=>v.id===id);

  const dv=detailId?getV(detailId):null;
  const cv=composeId?getV(composeId):null;
  const deal=dealId?getV(dealId):null;
  const clV=checklistId?getV(checklistId):null;
  const stlV=settlementId?getV(settlementId):null;
  const srV=showReportId?getV(showReportId):null;
  const editTpl=editTemplateId?templates.find(t=>t.id===editTemplateId):null;
  const editTour=editTourId?tours.find(t=>t.id===editTourId):null;
  const co=composeId?(composeOpts[composeId]||{templateId:'jason-phil-standard',customDates:'',customNote:''}):{};
  function setCo(id,fields){setComposeOpts(p=>({...p,[id]:{...(p[id]||{templateId:'jason-phil-standard',customDates:'',customNote:''}), ...fields}}));}

  // -- Analytics --
  const stats=useMemo(()=>{
    const confirmed=venues.filter(v=>['Confirmed','Advancing','Completed'].includes(v.status));
    const totalGross=confirmed.reduce((a,v)=>a+(Number(v.guarantee)||0),0);
    return{total:venues.length,leads:venues.filter(v=>v.status==='Lead').length,active:venues.filter(v=>['Contacted','Follow-Up','Responded','Negotiating','Hold'].includes(v.status)).length,confirmed:confirmed.length,totalGross,netEst:totalGross*0.75,byStatus:PIPELINE.reduce((a,st)=>{a[st]=venues.filter(v=>v.status===st).length;return a;},{})};
  },[venues]);

  const todayActions=useMemo(()=>{
    const today=new Date();today.setHours(0,0,0,0);
    return venues.filter(v=>{if(!v.nextFollowUp)return false;const d=new Date(v.nextFollowUp);d.setHours(0,0,0,0);return d.getTime()===today.getTime();}).sort((a,b)=>new Date(a.nextFollowUp)-new Date(b.nextFollowUp));
  },[venues]);

  const overdueActions=useMemo(()=>{
    const today=new Date();today.setHours(0,0,0,0);
    return venues.filter(v=>{if(!v.nextFollowUp)return false;const d=new Date(v.nextFollowUp);d.setHours(0,0,0,0);return d<today;});
  },[venues]);

  const depositsDue=useMemo(()=>venues.filter(v=>{if(!v.depositAmount||v.depositPaid||!v.depositDue)return false;const days=daysUntil(v.depositDue);return days!==null&&days>=0&&days<=14;}),[venues]);

  const needsPaidMark=useMemo(()=>venues.filter(v=>{if(v.paid||!v.targetDates)return false;return['Confirmed','Advancing','Completed'].includes(v.status);}),[venues]);

  const filtered=useMemo(()=>{
    const q=search.toLowerCase();
    return venues.filter(v=>{
      const mq=!q||v.venue.toLowerCase().includes(q)||v.city.toLowerCase().includes(q)||(v.booker||'').toLowerCase().includes(q)||(v.state||'').toLowerCase().includes(q);
      const ms=statusFilter==='All'||v.status===statusFilter;
      const mst=stateFilter2==='All'||v.state===stateFilter2;
      return mq&&ms&&mst;
    });
  },[venues,search,statusFilter]);

  const dbFiltered=useMemo(()=>{
    const q=dbSearch.toLowerCase();
    const existingEmails=new Set(venues.map(v=>v.email?.toLowerCase()).filter(Boolean));
    return VENUE_DATABASE.filter(v=>{
      const mq=!q||v.venue.toLowerCase().includes(q)||v.city.toLowerCase().includes(q)||v.state.toLowerCase().includes(q);
      const ms=dbStateFilter==='All'||v.state===dbStateFilter;
      const mt=dbTypeFilter==='All'||v.venueType===dbTypeFilter;
      return mq&&ms&&mt&&!existingEmails.has(v.email?.toLowerCase());
    });
  },[dbSearch,dbStateFilter,dbTypeFilter,venues]);

  function addFromDb(dbVenue){
    const v={...dbVenue,id:Date.now()+Math.random(),status:'Lead',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:0,doorSplit:0,depositAmount:0,depositPaid:false,depositDue:'',balanceDue:'',balancePaid:false,ticketPrice:20,estimatedGross:0,actualWalk:0,showCount:3,showDates:[],contractStatus:'None',radiusClause:'',flightDetails:'',bonusTier:'',notes:'',referralSource:'',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,contactLog:[],bookerLast:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'};
    setVenues(vs=>[v,...vs]);toast2(`[OK] ${dbVenue.venue} added`);
  }

  function addVenue(){
    if(!nv.venue.trim()){toast2('Venue name required');return;}
    const v={...nv,id:Date.now(),status:'Lead',notes:nv.notes||'',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',capacity:parseInt(nv.capacity)||0,guarantee:parseFloat(nv.guarantee)||0,doorSplit:parseFloat(nv.doorSplit)||0,agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'};
    setVenues(vs=>[v,...vs]);
    setNv({venue:'',booker:'',bookerLast:'',city:'',state:'',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:'',doorSplit:'',capacity:'',notes:'',referralSource:'',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20});
    setAddOpen(false);toast2(`[OK] ${v.venue} added`);
  }

  function handleCSVImport(e){
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const lines=ev.target.result.split('\n').filter(l=>l.trim());
      const headers=lines[0].split(',').map(h=>h.trim().toLowerCase().replace(/['"]/g,''));
      const imported=[];
      for(let i=1;i<lines.length;i++){
        const cols=lines[i].split(',').map(c=>c.trim().replace(/^["']|["']$/g,''));
        const row={};headers.forEach((h,idx)=>row[h]=cols[idx]||'');
        const venue=row.venue||row['venue name']||row.name||row.club||'';
        if(!venue)continue;
        imported.push({id:Date.now()+i,venue,booker:row.booker||row['booker name']||row['first name']||'',bookerLast:row['last name']||row.bookerlast||'',city:row.city||'',state:row.state||'',email:row.email||'',instagram:row.instagram||'',phone:row.phone||'',capacity:parseInt(row.capacity)||0,venueType:row['venue type']||row.type||'Comedy Club',status:'Lead',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:parseFloat(row.guarantee)||0,doorSplit:0,depositAmount:0,depositPaid:false,depositDue:'',balanceDue:'',balancePaid:false,ticketPrice:20,estimatedGross:0,actualWalk:0,showCount:3,showDates:[],contractStatus:'None',radiusClause:'',flightDetails:'',bonusTier:'',notes:row.notes||'',referralSource:'',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,contactLog:[],preferredContact:'Email',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'});
      }
      setVenues(vs=>[...imported,...vs]);setImportOpen(false);toast2(`[OK] ${imported.length} venues imported!`);
    };
    reader.readAsText(file);
  }

  function saveTemplate(tpl){if(tpl.id&&templates.find(t=>t.id===tpl.id)){setTemplates(ts=>ts.map(t=>t.id===tpl.id?tpl:t));}else{setTemplates(ts=>[...ts,{...tpl,id:Date.now().toString()}]);}setEditTemplateId(null);toast2('Template saved OK');}
  function deleteTemplate(id){setTemplates(ts=>ts.filter(t=>t.id!==id));toast2('Template deleted');}
  function saveTour(tour){if(tour.id&&tours.find(t=>t.id===tour.id)){setTours(ts=>ts.map(t=>t.id===tour.id?tour:t));}else{setTours(ts=>[...ts,{...tour,id:Date.now().toString()}]);}setEditTourId(null);toast2('Tour saved OK');}

  const currentTemplate=cv?(templates.find(t=>t.id===co.templateId)||templates[0]):null;
  const filledSubject=cv&&currentTemplate?fillTemplate(currentTemplate.subject,cv,co.customDates):'';
  const filledBody=cv&&currentTemplate?fillTemplate(currentTemplate.body+(co.customNote?`\n\n${co.customNote}`:''),cv,co.customDates):'';
  const photoLinksText=currentTemplate?.photoLinks?.length?'\n\n -  Press Kit  - \n'+currentTemplate.photoLinks.map(p=>`${p.label}: ${p.url}`).join('\n'):'';
  const fullBody=filledBody+photoLinksText;
  // Gmail needs CRLF (%0D%0A) for line breaks to render correctly in mailto links
  function formatForMailto(text) {
    return text
      .split('\n')
      .map(line => encodeURIComponent(line))
      .join('%0D%0A');
  }
  const mailto=cv?.email?`https://mail.google.com/mail/u/0/?authuser=jschucomedy%40gmail.com&view=cm&to=${encodeURIComponent(cv.email)}&su=${encodeURIComponent(filledSubject)}&body=${encodeURIComponent(fullBody)}`:null;
  const dbStates=['All',...new Set(VENUE_DATABASE.map(v=>v.state).sort())];
  const myVenueStates=['All',...new Set(venues.map(v=>v.state).filter(Boolean).sort())];
  const dbTypes=['All',...VENUE_TYPES];

  // ============ RENDER ============
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;
  return(
    <div style={s.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;}body{margin:0;background:${C.bg};}
        input,select,textarea{-webkit-appearance:none;color-scheme:dark;}
        input:focus,select:focus,textarea:focus{border-color:${C.acc}!important;outline:none;}
        ::-webkit-scrollbar{width:6px;height:6px;}::-webkit-scrollbar-track{background:${C.surf};}::-webkit-scrollbar-thumb{background:${C.bord};border-radius:3px;}
        a{text-decoration:none;}
        @media(min-width:768px){
          body{background:#04040a;}
          body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(108,92,231,0.1) 0%,transparent 60%);pointer-events:none;}
        }
      `}</style>
      <Toast msg={toast}/>
      <style>{`
        .sb-desktop-wrap { display:flex; min-height:100vh; }
        .sb-sidebar { display:none; }
        .sb-main { flex:1; min-width:0; }
        @media(min-width:768px){
          .sb-sidebar {
            display:flex;
            flex-direction:column;
            width:220px;
            min-width:220px;
            background:#0a0a18;
            border-right:1px solid #1e1e35;
            position:fixed;
            top:0;
            left:0;
            height:100vh;
            padding:24px 16px;
            overflow-y:auto;
            z-index:50;
          }
          .sb-main { margin-left:220px; padding-bottom:20px; }
          .sb-mobile-header { display:none !important; }
          .sb-mobile-nav { display:none !important; }
          .sb-content { padding-bottom:20px !important; }
        }
      `}</style>

      {/* AI OUTREACH PANEL */}
      {aiOpen&&<><div onClick={()=>{setAiOpen(false);setAiResult('');}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:400}}/><div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:C.surf,border:`1px solid ${C.acc}`,borderRadius:20,padding:24,zIndex:401,width:'calc(100% - 32px)',maxWidth:520,maxHeight:'85vh',overflowY:'auto'}}>
        <div style={{fontFamily:font.head,fontWeight:800,fontSize:18,marginBottom:4}}>AI Outreach Writer</div>
        <div style={{fontSize:11,color:C.muted,marginBottom:16}}>{venues.find(v=>v.id===aiVenueId)?.venue}  -  {venues.find(v=>v.id===aiVenueId)?.city}, {venues.find(v=>v.id===aiVenueId)?.state}</div>
        {aiLoading&&<div style={{textAlign:'center',padding:'32px 0'}}>
          <div style={{fontSize:32,marginBottom:12,animation:'spin 1s linear infinite'}}>[loading]</div>
          <div style={{fontSize:13,color:C.muted}}>Writing your personalized email...</div>
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>}
        {!aiLoading&&aiResult&&<>
          <div style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:12,padding:14,fontSize:12,color:C.txt,lineHeight:1.7,whiteSpace:'pre-wrap',marginBottom:16,maxHeight:300,overflowY:'auto'}}>{aiResult}</div>
          <div style={s.row}>
            <button onClick={copyAiResult} style={s.btn(C.surf2,C.txt,C.bord)}>[list] Copy</button>
            {venues.find(v=>v.id===aiVenueId)?.email&&<button onClick={openAiInGmail} style={s.btn(C.acc,'#fff',null)}>[email] Open Gmail</button>}
          </div>
          <button onClick={()=>generateAIOutreach(aiVenueId)} style={{...s.btn(C.surf2,C.muted,C.bord),width:'100%',marginTop:10,fontSize:11}}>retry Regenerate</button>
        </>}
        <button onClick={()=>{setAiOpen(false);setAiResult('');}} style={{...s.btn('none',C.muted,C.bord),width:'100%',marginTop:12,fontSize:11}}>Close</button>
      </div></>}

      {/* VOICE INDICATOR */}
      {voiceActive&&<div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:C.surf,border:`2px solid ${C.red}`,borderRadius:20,padding:'24px 32px',zIndex:500,textAlign:'center'}}>
        <div style={{fontSize:40,marginBottom:8}}>mic</div>
        <div style={{fontFamily:font.head,fontWeight:700,color:C.red}}>Listening...</div>
        <div style={{fontSize:11,color:C.muted,marginTop:4}}>Speak now</div>
      </div>}

      {/* CONFIRM DELETE */}
      {confirmDelete&&<><div onClick={()=>setConfirmDelete(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:400}}/><div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:C.surf,border:`1px solid ${C.red}`,borderRadius:18,padding:28,zIndex:401,width:'calc(100% - 48px)',maxWidth:340,textAlign:'center'}}><div style={{fontSize:32,marginBottom:12}}>[trash]</div><div style={{fontFamily:font.head,fontWeight:800,fontSize:18,marginBottom:8}}>Delete Venue?</div><div style={{fontSize:13,color:C.muted,marginBottom:24,lineHeight:1.5}}>Permanently remove <strong style={{color:C.txt}}>{venues.find(v=>v.id===confirmDelete)?.venue}</strong>?</div><div style={s.row}><button onClick={()=>setConfirmDelete(null)} style={s.btn(C.surf2,C.txt,C.bord)}>Cancel</button><button onClick={()=>{setVenues(vs=>vs.filter(v=>v.id!==confirmDelete));setDetailId(null);setConfirmDelete(null);toast2('Venue removed');}} style={s.btn('rgba(225,112,85,0.15)',C.red,'rgba(225,112,85,0.4)')}>Delete</button></div></div></>}

      <div className="sb-desktop-wrap">

      {/* DESKTOP SIDEBAR */}
      <div className="sb-sidebar">
        <div onClick={()=>setTab('today')} style={{cursor:'pointer',marginBottom:28}}>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:2}}>
            <div style={{width:34,height:34,borderRadius:9,background:'linear-gradient(135deg,#6c5ce7,#a29bfe)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:14,color:'#fff',fontFamily:font.head,flexShrink:0,letterSpacing:-0.5}}>SB</div>
            <div style={{fontFamily:font.head,fontWeight:800,fontSize:22,letterSpacing:-1,lineHeight:1}}>Stage<span style={{color:C.acc2}}>Boss</span></div>
          </div>
          <div style={{fontSize:9,color:C.muted,letterSpacing:2,textTransform:'uppercase',marginTop:4}}>Booking Command Center</div>
        </div>
        {/* Sidebar nav */}
        {[['today','[list]','Today'],['venues','[venue]','Venues'],['calendar','[cal]','Calendar'],['outreach','[email]','Outreach'],['tours','[bus]','Tours']].map(([t,icon,label])=>(
          <div key={t} onClick={()=>setTab(t)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:10,marginBottom:4,cursor:'pointer',background:tab===t?`${C.acc}18`:'none',border:tab===t?`1px solid ${C.acc}40`:'1px solid transparent',color:tab===t?C.acc2:C.muted,transition:'all 0.15s'}}>
            <span style={{fontSize:18}}>{icon}</span>
            <span style={{fontFamily:font.head,fontWeight:700,fontSize:13}}>{label}</span>
            {t==='today'&&todayActions.length>0&&<span style={{marginLeft:'auto',fontSize:10,background:C.red,color:'#fff',borderRadius:20,padding:'2px 7px',fontFamily:font.head,fontWeight:700}}>{todayActions.length}</span>}
          </div>
        ))}
        <div style={{height:1,background:C.bord,margin:'16px 0'}}/>
        {/* Sidebar stats */}
        <div style={{fontSize:10,color:C.muted,letterSpacing:1.5,textTransform:'uppercase',marginBottom:10}}>Pipeline</div>
        {[['Venues',stats.total,C.txt],['Active',stats.active,C.yellow],['Confirmed',stats.confirmed,C.green],['Net Est.',formatCurrency(stats.netEst),C.acc2]].map(([l,v,color])=>(
          <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:`1px solid ${C.bord}`}}>
            <span style={{fontSize:11,color:C.muted}}>{l}</span>
            <span style={{fontFamily:font.head,fontWeight:700,fontSize:13,color}}>{v}</span>
          </div>
        ))}
        <div style={{height:1,background:C.bord,margin:'16px 0'}}/>
        <button onClick={()=>setAddOpen(true)} style={{...s.btn(C.acc,'#fff',null),width:'100%',marginBottom:8}}>+ Add Venue</button>
        <button onClick={exportData} style={{...s.btn('rgba(0,184,148,0.15)',C.green,'rgba(0,184,148,0.3)'),width:'100%',marginBottom:8,fontSize:12}}>[save] Export Backup</button>
        <button onClick={()=>importRef.current?.click()} style={{...s.btn(C.surf2,C.muted,C.bord),width:'100%',marginBottom:8,fontSize:12}}>[folder] Import Backup</button>
        <input ref={importRef} type="file" accept=".json" style={{display:'none'}} onChange={importData}/>
        <div style={{display:'flex',gap:6,marginBottom:6}}>
          <button onClick={async()=>{setSyncing(true);await cloudSave(user,{venues,templates,tours});setLastSync(new Date());setSyncing(false);toast2('Synced!');}} style={{...s.btn('rgba(0,184,148,0.1)',C.green,'rgba(0,184,148,0.25)'),flex:1,fontSize:10}}>
            {syncing?'Syncing...':'Sync Now'}
          </button>
        </div>
        <div style={{fontSize:9,color:C.muted,textAlign:'center',marginBottom:8}}>{lastSync?'Last sync: '+lastSync.toLocaleTimeString():'Not synced yet'}</div>
        <button onClick={onLogout} style={{...s.btn('none',C.muted,C.bord),width:'100%',fontSize:11}}>Sign Out</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="sb-main">

      {/* HEADER */}
      <div className="sb-mobile-header" style={s.header}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div onClick={()=>setTab('today')} style={{cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:30,height:30,borderRadius:8,background:'linear-gradient(135deg,#6c5ce7,#a29bfe)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:13,color:'#fff',fontFamily:font.head,flexShrink:0}}>SB</div>
              <div style={{fontFamily:font.head,fontWeight:800,fontSize:24,letterSpacing:-1,lineHeight:1}}>Stage<span style={{color:C.acc2}}>Boss</span></div>
            </div>
            <div style={{fontSize:9,color:C.muted,letterSpacing:2,textTransform:'uppercase',marginTop:3}}>Comedy Booking Command Center</div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={async()=>{setSyncing(true);await cloudSave(user,{venues,templates,tours});setLastSync(new Date());setSyncing(false);toast2('Synced to cloud!');}} style={{padding:'6px 10px',borderRadius:8,border:'1px solid rgba(0,184,148,0.4)',background:'rgba(0,184,148,0.1)',color:C.green,fontSize:10,cursor:'pointer',fontFamily:font.body,marginRight:6}}>{syncing?'...':'Sync'}</button>
            <button onClick={onLogout} style={{padding:'6px 10px',borderRadius:8,border:`1px solid ${C.bord}`,background:'none',color:C.muted,fontSize:10,cursor:'pointer',fontFamily:font.body}}>OUT</button>
            <button onClick={()=>setAddOpen(true)} style={{width:36,height:36,borderRadius:'50%',background:C.acc,border:'none',color:'#fff',fontSize:22,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',flexShrink:0}}>+</button>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
          {[[stats.total,C.txt,'Venues'],[stats.active,C.yellow,'Active'],[stats.confirmed,C.green,'Booked'],[formatCurrency(stats.netEst),C.acc2,'Net Est.']].map(([val,color,label],i)=>(
            <div key={i} style={{background:C.surf,border:`1px solid ${C.bord}`,borderRadius:10,padding:'8px 6px',textAlign:'center'}}>
              <div style={{fontFamily:font.head,fontWeight:800,fontSize:i===3?14:22,lineHeight:1,color}}>{val}</div>
              <div style={{fontSize:9,color:C.muted,letterSpacing:1,textTransform:'uppercase',marginTop:2}}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="sb-content" style={s.content}>

        {/* == TODAY TAB == */}
        {tab==='today'&&<div style={{padding:16}}>
          <div style={{display:'flex',gap:6,marginBottom:16,overflowX:'auto',scrollbarWidth:'none'}}>
            {['All','Follow-ups','Money','Tours'].map(f=><div key={f} onClick={()=>setActiveFilter(f)} style={{flexShrink:0,padding:'5px 14px',borderRadius:20,fontSize:10,border:'1px solid',borderColor:activeFilter===f?C.acc:C.bord,background:activeFilter===f?`${C.acc}18`:'none',color:activeFilter===f?C.acc2:C.muted,cursor:'pointer',fontFamily:font.body}}>{f}</div>)}
          </div>
          {(activeFilter==='All'||activeFilter==='Follow-ups')&&<>
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:13,color:todayActions.length?C.red:C.green,marginBottom:10}}>{todayActions.length?`[bell] ${todayActions.length} Follow-Up${todayActions.length>1?'s':''} Due`:'[OK] No Follow-Ups Due'}</div>
            {todayActions.map(v=><div key={v.id} style={{...s.card,borderLeft:`3px solid ${C.red}`}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div><div style={{fontFamily:font.head,fontWeight:700,fontSize:14,marginBottom:4}}>{v.venue}</div><div style={{fontSize:11,color:C.muted,marginBottom:6}}>{v.city}, {v.state}{v.booker?` . ${v.booker}`:''}</div><div style={{display:'flex',gap:6,flexWrap:'wrap'}}><StatusPill status={v.status}/><WarmthDot warmth={v.warmth}/></div></div>
                <div style={{display:'flex',flexDirection:'column',gap:6}}><button onClick={()=>setComposeId(v.id)} style={{...s.btn(C.acc,'#fff',null),padding:'8px 12px',fontSize:11,flex:'none'}}>[email] Compose</button><button onClick={()=>setDetailId(v.id)} style={{...s.btn('none',C.muted2,C.bord),padding:'6px 10px',fontSize:10,flex:'none'}}>Details</button></div>
              </div>
              <div style={{marginTop:8,padding:'6px 10px',background:C.surf2,borderRadius:8,fontSize:11,color:C.muted2}}>Touch #{(v.contactLog||[]).length+1} . {getSequenceSuggestion(v)}</div>
            </div>)}
            {overdueActions.length>0&&<><div style={{fontFamily:font.head,fontWeight:700,fontSize:11,color:C.red,letterSpacing:1,textTransform:'uppercase',marginBottom:8,marginTop:4}}>[warn] Overdue ({overdueActions.length})</div>{overdueActions.map(v=><div key={v.id} onClick={()=>setDetailId(v.id)} style={{...s.card,borderLeft:`3px solid ${C.red}`,opacity:0.85}}><div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:3}}>{v.venue}</div><div style={{fontSize:11,color:C.muted}}>{v.city}, {v.state} . Was due {v.nextFollowUp}</div></div>)}</>}
            <div style={s.divider}/>
          </>}
          {(activeFilter==='All'||activeFilter==='Money')&&<>
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:13,color:C.yellow,marginBottom:10}}>[money] Money Alerts</div>
            {depositsDue.map(v=><div key={v.id} onClick={()=>setDealId(v.id)} style={{...s.card,borderLeft:`3px solid ${C.yellow}`}}><div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:3}}>{v.venue}</div><div style={{fontSize:11,color:C.muted,marginBottom:4}}>{v.city}, {v.state}</div><div style={{fontSize:12,color:C.yellow}}>[warn] Deposit {formatCurrency(v.depositAmount)} due {v.depositDue}</div></div>)}
            {needsPaidMark.length>0&&<>{needsPaidMark.map(v=><div key={v.id} style={{...s.card,borderLeft:`3px solid ${C.green}`}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div><div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:3}}>{v.venue}</div><div style={{fontSize:11,color:C.muted}}>{v.targetDates} . {formatCurrency(v.guarantee)}</div></div><button onClick={()=>{upd(v.id,{paid:true,paidDate:new Date().toISOString().split('T')[0]});toast2('[OK] Marked paid!');setShowReportId(v.id);}} style={{...s.btn(C.green,'#fff',null),flex:'none',padding:'8px 14px',fontSize:11}}>Mark Paid</button></div></div>)}</>}
            {depositsDue.length===0&&needsPaidMark.length===0&&<div style={{fontSize:12,color:C.muted,marginBottom:12}}>No money alerts right now OK</div>}
            <div style={s.divider}/>
          </>}
          <div style={{...s.grid2,marginBottom:10}}>
            <button onClick={()=>setDbOpen(true)} style={s.btn(C.surf2,C.txt,C.bord)}>[venue] Browse Clubs</button>
            <button onClick={()=>setImportOpen(true)} style={s.btn(C.surf2,C.txt,C.bord)}>[folder] Import CSV</button>
          </div>
          <div style={{...s.grid2,marginBottom:10}}>
            <button onClick={()=>setTemplateOpen(true)} style={s.btn(C.surf2,C.txt,C.bord)}>[email] Templates</button>
            <button onClick={()=>setMoneyOpen(true)} style={s.btn(C.surf2,C.txt,C.bord)}>$ Money Timeline</button>
          </div>
          <div style={{...s.grid2,marginBottom:16}}>
            <button onClick={exportData} style={{...s.btn('rgba(0,184,148,0.15)',C.green,'rgba(0,184,148,0.3)'),fontSize:12}}>[save] Export Backup</button>
            <button onClick={()=>importRef.current?.click()} style={{...s.btn(C.surf2,C.muted,C.bord),fontSize:12}}>[folder] Import Backup</button>
          </div>
          {(activeFilter==='All'||activeFilter==='Money')&&<>
            <div style={s.divider}/>
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:12}}>[money] Revenue</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
              {[['Guaranteed',formatCurrency(stats.totalGross),C.green],['Net (after 25%)',formatCurrency(stats.netEst),C.acc2],['Confirmed',stats.confirmed,C.yellow],['Pipeline',stats.leads+stats.active,C.blue]].map(([l,v,color],i)=><div key={i} style={{background:C.surf,border:`1px solid ${C.bord}`,borderRadius:12,padding:'12px 14px'}}><div style={{fontSize:10,color:C.muted,marginBottom:4,letterSpacing:1,textTransform:'uppercase'}}>{l}</div><div style={{fontFamily:font.head,fontWeight:800,fontSize:20,color}}>{v}</div></div>)}
            </div>
          </>}
          {activeFilter==='All'&&<><div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:12}}>[chart] Pipeline</div>{PIPELINE.filter(st=>stats.byStatus[st]>0).map(st=>{const pct=Math.round((stats.byStatus[st]/Math.max(venues.length,1))*100)||1;const color=PIPE_COLORS[st]||C.muted;return<div key={st} style={{marginBottom:8}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}><span style={{fontSize:11,color}}>{st}</span><span style={{fontFamily:font.head,fontWeight:700,fontSize:13,color}}>{stats.byStatus[st]}</span></div><div style={{height:5,background:C.surf2,borderRadius:3,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:color,borderRadius:3}}/></div></div>;})}
          </>}
        </div>}

        {/* == VENUES TAB == */}
        {tab==='venues'&&<>
          <div style={{padding:'14px 16px 8px'}}><input style={s.input()} placeholder="Search venues, cities, bookers..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <div style={{display:'flex',gap:8,padding:'0 16px 12px',overflowX:'auto',scrollbarWidth:'none'}}>
            {['All',...PIPELINE].map(st=>{const color=PIPE_COLORS[st]||C.txt;const active=st===statusFilter;return<div key={st} onClick={()=>setStatusFilter(st)} style={{flexShrink:0,padding:'5px 12px',borderRadius:20,fontSize:10,border:'1px solid',borderColor:active?color:C.bord,background:active?`${color}18`:'none',color:active?color:C.muted,cursor:'pointer',whiteSpace:'nowrap',fontFamily:font.body}}>{st==='All'?`All (${venues.length})`:st}</div>;})}
          </div>
          <div style={{padding:'0 16px 10px',display:'flex',gap:8,alignItems:'center'}}>
            <select value={stateFilter2} onChange={e=>setStateFilter2(e.target.value)} style={{...s.select,fontSize:11,padding:'7px 10px',flex:1,maxWidth:160}}>
              {myVenueStates.map(st=><option key={st} value={st}>{st==='All'?`All States (${venues.length})`:st}</option>)}
            </select>
            <button onClick={()=>toast2('Tap AI Write on any venue card')} style={{...s.btn(C.acc,'#fff',null),fontSize:11,padding:'7px 14px',flex:'none',whiteSpace:'nowrap'}}>AI Write</button>
          </div>
          <div style={{padding:'0 16px'}}>
            {venues.length===0&&<div style={{textAlign:'center',padding:'40px 20px'}}><div style={{fontSize:36,marginBottom:12}}>[venue]</div><div style={{color:C.muted,marginBottom:16}}>No venues yet</div><button onClick={()=>setDbOpen(true)} style={{...s.btn(C.acc,'#fff',null),display:'inline-flex',width:'auto',padding:'12px 20px'}}>Browse 500+ Clubs </button></div>}
            {filtered.map(v=>{const pcolor=PIPE_COLORS[v.status]||C.muted;const isEx=v.relationship==='existing';const overdue=v.nextFollowUp&&isOverdue(v.nextFollowUp);
              return<div key={v.id} onClick={()=>setDetailId(v.id)} style={{...s.card,borderLeft:`3px solid ${pcolor}`}}>
                {overdue&&<div style={{position:'absolute',top:8,right:8,width:8,height:8,borderRadius:'50%',background:C.red,boxShadow:`0 0 6px ${C.red}`}}/>}
                <div style={{fontFamily:font.head,fontWeight:700,fontSize:14,marginBottom:4,paddingRight:16,display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>{v.venue}<span style={{fontSize:10,background:isEx?'rgba(108,92,231,0.15)':'rgba(116,185,255,0.1)',color:isEx?C.acc2:C.blue,border:`1px solid ${isEx?'rgba(108,92,231,0.3)':'rgba(116,185,255,0.2)'}`,padding:'1px 7px',borderRadius:20}}>{isEx?'[star]':'[new]'}</span></div>
                <div style={{fontSize:11,color:C.muted,marginBottom:8}}>{v.city}, {v.state}{v.booker?` . ${v.booker}${v.bookerLast?' '+v.bookerLast:''}`:''}{v.capacity?` . ${v.capacity} cap`:''}</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
                    <StatusPill status={v.status}/><WarmthDot warmth={v.warmth||'Cold'}/>
                    {v.agreementType&&['Confirmed','Advancing'].includes(v.status)&&<span style={{fontSize:9,padding:'2px 7px',borderRadius:20,background:v.agreementType==='Contract'?'rgba(0,184,148,0.1)':'rgba(253,203,110,0.1)',color:v.agreementType==='Contract'?C.green:C.yellow,border:`1px solid ${v.agreementType==='Contract'?'rgba(0,184,148,0.25)':'rgba(253,203,110,0.25)'}`}}>{v.agreementType==='Contract'?'[doc]':'[email]'}</span>}
                    {v.checklist&&<span style={{fontSize:9,color:checklistPct(v.checklist)===100?C.green:C.yellow}}>OK{checklistPct(v.checklist)}%</span>}
                  </div>
                  {v.guarantee>0&&<span style={{fontSize:11,color:C.green,fontFamily:font.head,fontWeight:700}}>{formatCurrency(v.guarantee)}</span>}
                </div>
                {v.targetDates&&<div style={{marginTop:6,fontSize:10,color:C.muted2}}>[date] {v.targetDates}</div>}
                <div style={{marginTop:8,display:'flex',gap:6}}>
                  <button onTouchEnd={e=>{e.preventDefault();e.stopPropagation();generateAIOutreach(v.id);}} onClick={e=>{e.stopPropagation();generateAIOutreach(v.id);}} style={{fontSize:10,padding:'4px 10px',borderRadius:8,background:'rgba(108,92,231,0.12)',border:`1px solid rgba(108,92,231,0.3)`,color:C.acc2,cursor:'pointer',fontFamily:font.body}}>AI Write</button>
                  {v.email&&<button onClick={e=>{e.stopPropagation();setComposeId(v.id);}} style={{fontSize:10,padding:'4px 10px',borderRadius:8,background:'rgba(116,185,255,0.08)',border:`1px solid rgba(116,185,255,0.2)`,color:C.blue,cursor:'pointer',fontFamily:font.body}}>Email</button>}
                </div>
              </div>;
            })}
          </div>
        </>}

        {/* == CALENDAR TAB == */}
        {tab==='calendar'&&<CalendarTab venues={venues} tours={tours} onVenueClick={id=>setDetailId(id)} onChecklist={id=>setChecklistId(id)} toast2={toast2}/>}

        {/* == OUTREACH TAB == */}
        {tab==='outreach'&&<div style={{padding:16}}>
          <div style={{fontSize:10,color:C.muted,letterSpacing:1.5,textTransform:'uppercase',marginBottom:16}}>Tap venue to compose with your real templates</div>
          {venues.length===0&&<div style={{textAlign:'center',padding:'40px 20px',color:C.muted}}>Add venues first to compose outreach</div>}
          {['existing','new'].map(rel=>{
            const group=venues.filter(v=>v.relationship===rel).sort((a,b)=>{const p={'Hot':0,'Warm':1,'Established':2,'Cold':3};return(p[a.warmth]||3)-(p[b.warmth]||3);});
            if(!group.length)return null;
            return<div key={rel}>
              <div style={{fontFamily:font.head,fontWeight:700,fontSize:11,color:rel==='existing'?C.acc2:C.blue,letterSpacing:1.5,textTransform:'uppercase',marginBottom:10}}>{rel==='existing'?'[star] Existing':'[new] New Prospects'} ({group.length})</div>
              {group.map(v=>{const pcolor=PIPE_COLORS[v.status]||C.muted;return<div key={v.id} onClick={()=>setComposeId(v.id)} style={{...s.card,borderLeft:`3px solid ${pcolor}`}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}><div style={{flex:1}}><div style={{fontFamily:font.head,fontWeight:700,fontSize:14,marginBottom:3}}>{v.venue}</div><div style={{fontSize:11,color:C.muted,marginBottom:6}}>{v.city}, {v.state}{v.booker?` . ${v.booker}${v.bookerLast?' '+v.bookerLast:''}`:''}</div><div style={{display:'flex',gap:6,flexWrap:'wrap'}}><StatusPill status={v.status} small/><WarmthDot warmth={v.warmth||'Cold'}/>{(v.contactLog||[]).length>0&&<span style={{fontSize:9,color:C.muted}}>Touch #{(v.contactLog||[]).length}</span>}</div></div><span style={{fontSize:11,color:C.acc2,flexShrink:0,marginLeft:10}}>Compose </span></div></div>;})}
              <div style={{height:12}}/>
            </div>;
          })}
        </div>}

        {/* == TOURS TAB == */}
        {tab==='tours'&&<div style={{padding:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:16}}>[bus] Tours</div>
            <button onClick={()=>{setEditTourId(null);setTourOpen(true);}} style={{...s.btn(C.acc,'#fff',null),padding:'8px 16px',flex:'none',fontSize:12}}>+ New Tour</button>
          </div>
          {tours.length===0&&<div style={{textAlign:'center',padding:'40px 20px',color:C.muted}}><div style={{fontSize:36,marginBottom:12}}>[bus]</div><div style={{marginBottom:16}}>No tours yet</div><button onClick={()=>{setEditTourId(null);setTourOpen(true);}} style={{...s.btn(C.acc,'#fff',null),display:'inline-flex',width:'auto',padding:'12px 20px'}}>Create First Tour</button></div>}
          {tours.map(tour=>{
            const totalGuarantee=(tour.dates||[]).reduce((a,d)=>a+(Number(d.guarantee)||0),0);
            const totalExpenses=(Number(tour.travelBudget)||0)+(Number(tour.lodgingBudget)||0)+(Number(tour.miscBudget)||0);
            const netRevenue=totalGuarantee*0.75-totalExpenses;
            const isExpanded=expandTourId===tour.id;
            const sortedDates=(tour.dates||[]).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
            return<div key={tour.id} style={{...s.card,cursor:'default'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}} onClick={()=>setExpandTourId(isExpanded?null:tour.id)}>
                <div style={{cursor:'pointer'}}>
                  <div style={{fontFamily:font.head,fontWeight:700,fontSize:16,marginBottom:4}}>{tour.name}</div>
                  <div style={{fontSize:11,color:C.muted}}>{tour.startDate} - {tour.endDate} &middot; {(tour.dates||[]).length} shows</div>
                </div>
                <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:6}}>
                  <span style={{...s.pill(`${C.green}18`,C.green,`${C.green}40`),fontSize:11,fontFamily:font.head,fontWeight:700}}>{formatCurrency(totalGuarantee)}</span>
                  <span style={{fontSize:10,color:C.muted}}>{isExpanded?'[collapse]':'[tap to expand]'}</span>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:10}}>
                {[['Gross',formatCurrency(totalGuarantee),C.green],['Expenses',formatCurrency(totalExpenses),C.red],['Net Est.',formatCurrency(netRevenue),netRevenue>=0?C.green:C.red]].map(([l,v,color])=><div key={l} style={{background:C.surf2,borderRadius:8,padding:'8px 10px'}}><div style={{fontSize:9,color:C.muted,letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>{l}</div><div style={{fontSize:13,fontFamily:font.head,fontWeight:700,color}}>{v}</div></div>)}
              </div>
              <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap'}}>
                <button onClick={e=>{e.stopPropagation();setEditTourId(tour.id);setTourOpen(true);}} style={{...s.btn(C.surf2,C.txt,C.bord),flex:1,fontSize:11,padding:'6px 8px'}}>Edit</button>
                <button onClick={e=>{e.stopPropagation();setTourBreakdownId(tour.id);}} style={{...s.btn('rgba(108,92,231,0.1)',C.acc2,'rgba(108,92,231,0.3)'),flex:1,fontSize:11,padding:'6px 8px'}}>Breakdown</button>
                <button onClick={e=>{e.stopPropagation();const idx=tours.findIndex(t=>t.id===tour.id);if(idx>0){const t=[...tours];[t[idx-1],t[idx]]=[t[idx],t[idx-1]];setTours(t);}}} style={{...s.btn(C.surf2,C.txt,C.bord),fontSize:11,padding:'6px 10px'}}>Up</button>
                <button onClick={e=>{e.stopPropagation();const idx=tours.findIndex(t=>t.id===tour.id);if(idx<tours.length-1){const t=[...tours];[t[idx],t[idx+1]]=[t[idx+1],t[idx]];setTours(t);}}} style={{...s.btn(C.surf2,C.txt,C.bord),fontSize:11,padding:'6px 10px'}}>Down</button>
                <button onClick={e=>{e.stopPropagation();if(window.confirm('Delete '+tour.name+'?')){setTours(prev=>prev.filter(t=>t.id!==tour.id));toast2('Tour deleted');}}} style={{...s.btn('rgba(255,71,87,0.1)',C.red,'rgba(255,71,87,0.3)'),fontSize:11,padding:'6px 10px'}}>Delete</button>
              </div>
              {isExpanded&&sortedDates.length>0&&<div style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:10,padding:'12px',marginTop:4}}>
                <div style={{fontSize:10,color:C.muted,letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Full Tour Route</div>
                {sortedDates.map((d,i)=>(
                  <div key={d.id||i} style={{marginBottom:i<sortedDates.length-1?12:0}}>
                    <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0,paddingTop:2}}>
                        <div style={{width:12,height:12,borderRadius:'50%',background:d.status==='Confirmed'?C.green:C.yellow,border:`2px solid ${C.surf}`}}/>
                        {i<sortedDates.length-1&&<div style={{width:2,height:24,background:C.bord,margin:'3px 0'}}/>}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,color:C.txt}}>{d.venue||'TBD'}</div>
                        <div style={{fontSize:10,color:C.muted}}>{d.city}{d.state?', '+d.state:''} &middot; {d.date||'TBD'} &middot; {formatCurrency(d.guarantee)}</div>
                        <div style={{display:'flex',gap:6,marginTop:4,flexWrap:'wrap'}}>
                          <span style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:d.status==='Confirmed'?`${C.green}18`:C.surf,color:d.status==='Confirmed'?C.green:C.muted,border:`1px solid ${d.status==='Confirmed'?C.green:C.bord}`}}>{d.status||'Hold'}</span>
                          {d.city&&sortedDates[i+1]&&sortedDates[i+1].city&&<a href={'https://www.google.com/maps/dir/'+encodeURIComponent(d.city+(d.state?','+d.state:''))+'/'+encodeURIComponent(sortedDates[i+1].city+(sortedDates[i+1].state?','+sortedDates[i+1].state:''))} target="_blank" rel="noopener noreferrer" style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:'rgba(108,92,231,0.1)',color:C.acc2,border:'1px solid rgba(108,92,231,0.3)',textDecoration:'none',cursor:'pointer'}}>Map to next stop</a>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {sortedDates.filter(d=>d.city).length>1&&<a href={'https://www.google.com/maps/dir/'+sortedDates.filter(d=>d.city).map(d=>encodeURIComponent(d.city+(d.state?','+d.state:''))).join('/')} target="_blank" rel="noopener noreferrer" style={{display:'block',marginTop:12,padding:'8px 12px',borderRadius:8,background:'rgba(108,92,231,0.1)',border:'1px solid rgba(108,92,231,0.3)',color:C.acc2,textDecoration:'none',textAlign:'center',fontSize:11,fontFamily:font.head,fontWeight:700}}>View Full Route on Google Maps</a>}
              </div>}
            </div>;
          })}
        </div>}


      {/* TOUR BREAKDOWN PANEL */}
      {tourBreakdownId&&(()=>{
        const bt=tours.find(t=>t.id===tourBreakdownId);
        if(!bt) return null;
        const btDates=(bt.dates||[]).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
        const totalGross=btDates.reduce((a,d)=>a+(Number(d.guarantee)||0),0);
        const totalTravel=Number(bt.travelBudget)||0;
        const totalLodging=Number(bt.lodgingBudget)||0;
        const totalMisc=Number(bt.miscBudget)||0;
        const totalExp=totalTravel+totalLodging+totalMisc;
        const netEst=totalGross-totalExp;
        const confirmedShows=btDates.filter(d=>d.status==='Confirmed').length;
        const holdShows=btDates.filter(d=>d.status==='Hold').length;
        const confirmedRev=btDates.filter(d=>d.status==='Confirmed').reduce((a,d)=>a+(Number(d.guarantee)||0),0);
        const avgPerShow=btDates.length?Math.round(totalGross/btDates.length):0;
        return<div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.7)',zIndex:200,overflowY:'auto',padding:'16px'}} onClick={()=>setTourBreakdownId(null)}>
          <div style={{background:C.surf,borderRadius:16,maxWidth:600,margin:'0 auto',padding:20}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div style={{fontFamily:font.head,fontWeight:800,fontSize:18}}>{bt.name}</div>
              <button onClick={()=>setTourBreakdownId(null)} style={{background:'none',border:'none',color:C.muted,fontSize:20,cursor:'pointer'}}>x</button>
            </div>
            <div style={{fontSize:11,color:C.muted,marginBottom:16}}>{bt.startDate} - {bt.endDate} &middot; {btDates.length} shows &middot; {confirmedShows} confirmed, {holdShows} holds</div>

            {/* Revenue Summary */}
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,color:C.acc2,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Revenue Summary</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:16}}>
              {[['Total Gross',formatCurrency(totalGross),C.green],['Confirmed Rev',formatCurrency(confirmedRev),C.green],['Total Expenses',formatCurrency(totalExp),C.red],['Net Estimate',formatCurrency(netEst),netEst>=0?C.green:C.red],['Avg Per Show',formatCurrency(avgPerShow),C.yellow],['Shows Booked',btDates.length+' total',C.txt]].map(([l,v,color])=>(
                <div key={l} style={{background:C.surf2,borderRadius:10,padding:'10px 12px'}}>
                  <div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:3}}>{l}</div>
                  <div style={{fontSize:14,fontFamily:font.head,fontWeight:700,color}}>{v}</div>
                </div>
              ))}
            </div>

            {/* Expenses Breakdown */}
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,color:C.acc2,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Expenses</div>
            <div style={{background:C.surf2,borderRadius:10,padding:'12px 14px',marginBottom:16}}>
              {[['Travel',totalTravel],['Lodging',totalLodging],['Misc',totalMisc]].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:`1px solid ${C.bord}`}}>
                  <span style={{fontSize:12,color:C.muted}}>{l}</span>
                  <span style={{fontSize:12,fontFamily:font.head,fontWeight:700,color:C.txt}}>{formatCurrency(v)}</span>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',padding:'8px 0 0'}}>
                <span style={{fontSize:12,fontFamily:font.head,fontWeight:700}}>Total</span>
                <span style={{fontSize:12,fontFamily:font.head,fontWeight:700,color:C.red}}>{formatCurrency(totalExp)}</span>
              </div>
            </div>

            {/* Show by Show */}
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,color:C.acc2,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Show by Show</div>
            <div style={{marginBottom:16}}>
              {btDates.map((d,i)=>(
                <div key={d.id||i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid ${C.bord}`}}>
                  <div>
                    <div style={{fontSize:12,fontFamily:font.head,fontWeight:700}}>{d.venue||'TBD'}</div>
                    <div style={{fontSize:10,color:C.muted}}>{d.city}{d.state?', '+d.state:''} &middot; {d.date||'TBD'}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:13,fontFamily:font.head,fontWeight:700,color:C.green}}>{formatCurrency(d.guarantee)}</div>
                    <span style={{fontSize:9,padding:'2px 6px',borderRadius:6,background:d.status==='Confirmed'?`${C.green}18`:C.surf2,color:d.status==='Confirmed'?C.green:C.yellow,border:`1px solid ${d.status==='Confirmed'?C.green:C.bord}`}}>{d.status||'Hold'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Forecast */}
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,color:C.acc2,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>AI Forecast</div>
            <div style={{background:'rgba(108,92,231,0.08)',border:'1px solid rgba(108,92,231,0.2)',borderRadius:10,padding:'12px 14px',marginBottom:16}}>
              <div style={{fontSize:11,color:C.txt,lineHeight:1.6}}>
                {confirmedShows===0&&<div style={{color:C.yellow,marginBottom:6}}>No confirmed shows yet - all projections based on holds.</div>}
                <div style={{marginBottom:4}}>Projected gross if all holds confirm: <strong style={{color:C.green}}>{formatCurrency(totalGross)}</strong></div>
                <div style={{marginBottom:4}}>Conservative estimate (confirmed only): <strong style={{color:C.green}}>{formatCurrency(confirmedRev)}</strong></div>
                <div style={{marginBottom:4}}>Break-even point: <strong style={{color:C.yellow}}>{formatCurrency(totalExp)}</strong> in gross needed</div>
                <div style={{marginBottom:4}}>Current net margin: <strong style={{color:netEst>=0?C.green:C.red}}>{totalGross>0?Math.round((netEst/totalGross)*100):0}%</strong></div>
                {netEst<0&&<div style={{color:C.red,marginTop:6}}>Warning: Projected at a loss. Consider reducing expenses or adding shows.</div>}
                {netEst>0&&netEst/totalGross>0.4&&<div style={{color:C.green,marginTop:6}}>Strong margin! This tour is trending profitable.</div>}
              </div>
            </div>

            {/* Notes */}
            {bt.notes&&<><div style={{fontFamily:font.head,fontWeight:700,fontSize:12,color:C.acc2,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Tour Notes</div>
            <div style={{background:C.surf2,borderRadius:10,padding:'12px 14px',fontSize:12,color:C.txt,marginBottom:16}}>{bt.notes}</div></>}

            <button onClick={()=>{setTourBreakdownId(null);setEditTourId(bt.id);setTourOpen(true);}} style={{...s.btn(C.acc,'#fff',null),width:'100%'}}>Edit Tour Details</button>
          </div>
        </div>;
      })()}
      </div>{/* end content */}

      </div>{/* end sb-main */}
      </div>{/* end sb-desktop-wrap */}

      {/* NAV - mobile only */}
      <nav className="sb-mobile-nav" style={s.nav}>
        {[['tours','[bus]','Tours'],['venues','[venue]','Venues'],['calendar','[cal]','Cal'],['outreach','[email]','Outreach'],['today','[list]','Today']].map(([t,icon,label])=>(
          <button key={t} onClick={()=>setTab(t)} style={s.navBtn(tab===t)}><span style={{fontSize:18,lineHeight:1}}>{icon}</span>{label}</button>
        ))}
      </nav>

      {/* == DETAIL PANEL == */}
      <Panel open={!!dv} onClose={()=>setDetailId(null)} title={dv?.venue||''} badge={dv&&<div style={{display:'flex',gap:6,flexWrap:'wrap'}}><StatusPill status={dv.status}/><WarmthDot warmth={dv.warmth||'Cold'}/></div>}>
        {dv&&<>
          <div style={{fontSize:12,color:C.muted,marginBottom:14}}>{dv.city}, {dv.state}{dv.booker?` . ${dv.booker}${dv.bookerLast?' '+dv.bookerLast:''}`:''}{dv.capacity?` . ${dv.capacity} cap`:''}</div>
          {dv.history&&<div style={{background:'rgba(108,92,231,0.08)',border:'1px solid rgba(108,92,231,0.2)',borderRadius:10,padding:'10px 12px',marginBottom:14,fontSize:12,color:'#b0a0f0'}}>[pin] {dv.history}</div>}
          {/* Agreement summary for confirmed */}
          {['Confirmed','Advancing'].includes(dv.status)&&<div style={{background:'rgba(108,92,231,0.08)',border:'1px solid rgba(108,92,231,0.25)',borderRadius:12,padding:'12px 14px',marginBottom:14}}>
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,color:C.acc2,marginBottom:8}}>{dv.agreementType==='Contract'?'[doc] Contract Booking':'[email] Email Agreement Booking'}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
              {[['Deal',dv.dealType||' - '],['Guarantee',formatCurrency(dv.guarantee)],['Shows',dv.showCount||' - '],['Dates',dv.targetDates||' - '],['Lodging',dv.lodging||' - '],['Confirmed',dv.confirmedViaEmailDate||' - ']].map(([l,v2])=><div key={l}><div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:1}}>{l}</div><div style={{fontSize:12,color:C.txt}}>{v2}</div></div>)}
            </div>
            {dv.termsLocked&&<div style={{marginTop:8,fontSize:10,color:C.green}}>[lock] Terms locked</div>}
          </div>}
          {/* Checklist */}
          {dv.checklist&&<div style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:10,padding:'10px 14px',marginBottom:14}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}><div style={{fontSize:12,fontFamily:font.head,fontWeight:700}}>[list] Show Checklist</div><div style={{fontSize:11,color:checklistPct(dv.checklist)===100?C.green:C.yellow,fontFamily:font.head,fontWeight:700}}>{checklistPct(dv.checklist)}%</div></div>
            <div style={{height:4,background:C.bord,borderRadius:2,overflow:'hidden',marginBottom:8}}><div style={{height:'100%',width:`${checklistPct(dv.checklist)}%`,background:checklistPct(dv.checklist)===100?C.green:C.yellow,borderRadius:2,transition:'width 0.4s'}}/></div>
            <button onClick={()=>{setDetailId(null);setTimeout(()=>setChecklistId(dv.id),250);}} style={{fontSize:11,color:C.acc2,background:'none',border:'none',cursor:'pointer',fontFamily:font.body,padding:0}}>View / edit checklist </button>
          </div>}
          <div style={s.sectionTitle}>[chart] Pipeline</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:16}}>{PIPELINE.map(st=>{const color=PIPE_COLORS[st]||C.muted;const active=dv.status===st;return<div key={st} onClick={()=>{upd(dv.id,{status:st});toast2(`Status: ${st}`);}} style={{padding:'8px 10px',borderRadius:9,border:`1px solid ${active?color:C.bord}`,background:active?`${color}18`:C.surf2,color:active?color:C.muted,textAlign:'center',cursor:'pointer',fontSize:10,fontFamily:font.body}}>{st}</div>;})}</div>
          <div style={s.sectionTitle}>[temp] Warmth</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:16}}>{WARMTH.map(w=>{const color=WARMTH_COLORS[w];const active=dv.warmth===w;return<div key={w} onClick={()=>upd(dv.id,{warmth:w})} style={{padding:'7px 4px',borderRadius:9,border:`1px solid ${active?color:C.bord}`,background:active?`${color}18`:C.surf2,color:active?color:C.muted,textAlign:'center',cursor:'pointer',fontSize:10,fontFamily:font.body}}>{w}</div>;})}</div>
          <div style={s.sectionTitle}>[person] Booker</div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>First Name</label><input style={s.input(12)} defaultValue={dv.booker||''} onChange={e=>upd(dv.id,{booker:e.target.value})} placeholder="Jamie"/></div>
            <div style={s.field()}><label style={s.label}>Last Name</label><input style={s.input(12)} defaultValue={dv.bookerLast||''} onChange={e=>upd(dv.id,{bookerLast:e.target.value})} placeholder="Smith"/></div>
          </div>
          <div style={s.sectionTitle}>[phone] Contact</div>
          <div style={{marginBottom:16}}>{[['Email',dv.email],['Instagram',dv.instagram],['Phone',dv.phone]].map(([l,val])=>val?<div key={l} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0',borderBottom:`1px solid ${C.bord}`}}><span style={{fontSize:10,color:C.muted,width:72,flexShrink:0,letterSpacing:1,textTransform:'uppercase'}}>{l}</span><span style={{fontSize:13,flex:1,wordBreak:'break-all'}}>{val}</span><button onClick={()=>copyText(val,l,toast2)} style={{padding:'3px 10px',borderRadius:6,border:`1px solid ${C.bord}`,background:'none',color:C.muted,fontSize:10,cursor:'pointer'}}>copy</button></div>:null)}</div>
          <div style={s.field()}><label style={s.label}>Target Dates</label><input style={s.input(12)} defaultValue={dv.targetDates||''} onChange={e=>upd(dv.id,{targetDates:e.target.value})} placeholder="June 21-24"/></div>
          <div style={s.field()}><label style={s.label}>Next Follow-Up</label><input type="date" style={s.input(12)} value={dv.nextFollowUp||''} onChange={e=>upd(dv.id,{nextFollowUp:e.target.value})}/></div>
          <div style={s.field()}><label style={s.label}>History / Previous Shows</label><input style={s.input(12)} defaultValue={dv.history||''} onChange={e=>upd(dv.id,{history:e.target.value})} placeholder="Sold out March 2024..."/></div>
          <div style={s.field()}><label style={s.label}>Referral Source</label><input style={s.input(12)} defaultValue={dv.referralSource||''} onChange={e=>upd(dv.id,{referralSource:e.target.value})} placeholder="Who introduced you?"/></div>
          <div style={{...s.row,marginBottom:10}}>
            <button onClick={()=>{setDetailId(null);setTimeout(()=>setComposeId(dv.id),200);}} style={s.btn(C.acc,'#fff',null)}>[email] Compose</button>
            <button onClick={()=>{setDetailId(null);setTimeout(()=>setDealId(dv.id),200);}} style={s.btn(C.surf2,C.txt,C.bord)}>[money] Deal</button>
          </div>
          <div style={{...s.row,marginBottom:10}}>
            {!dv.checklist&&['Hold','Confirmed','Advancing'].includes(dv.status)&&<button onClick={()=>{upd(dv.id,{checklist:createChecklist()});toast2('[OK] Checklist created!');}} style={{...s.btn('rgba(0,184,148,0.1)',C.green,'rgba(0,184,148,0.25)'),flex:1}}>[list] Create Checklist</button>}
            {dv.checklist&&<button onClick={()=>{setDetailId(null);setTimeout(()=>setChecklistId(dv.id),250);}} style={{...s.btn('rgba(0,184,148,0.1)',C.green,'rgba(0,184,148,0.25)'),flex:1}}>[list] Checklist ({checklistPct(dv.checklist)}%)</button>}
            {dv.paid&&<button onClick={()=>{setDetailId(null);setTimeout(()=>setSettlementId(dv.id),250);}} style={{...s.btn(C.surf2,C.acc2,C.bord),flex:1}}>[chart] Settlement</button>}
          </div>
          {(dv.contactLog||[]).length>0&&<><div style={s.divider}/><div style={s.sectionTitle}>[scroll] Contact History</div>{[...(dv.contactLog||[])].reverse().map((entry,i)=><div key={i} style={{padding:'8px 10px',background:C.surf2,borderRadius:8,marginBottom:6,fontSize:11}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}><span style={{color:C.acc2}}>{entry.method}</span><span style={{color:C.muted}}>{entry.date}</span></div><div style={{color:C.muted2}}>{entry.note}</div></div>)}</>}
          <div style={s.divider}/>
          <div style={s.field()}><label style={s.label}>Notes</label><textarea style={{...s.input(),resize:'none',minHeight:70}} defaultValue={dv.notes||''} onChange={e=>upd(dv.id,{notes:e.target.value})} placeholder="Deal notes, follow-up details..."/></div>
          <div style={s.divider}/>
          <button onClick={()=>setConfirmDelete(dv.id)} style={{...s.btn('rgba(225,112,85,0.1)',C.red,'rgba(225,112,85,0.3)'),width:'100%'}}>Delete Venue</button>
        </>}
      </Panel>

      {/* == COMPOSE PANEL == */}
      <Panel open={!!cv} onClose={()=>setComposeId(null)} title={cv?.venue||''}>
        {cv&&<>
          <div style={s.sectionTitle}>[list] Template</div>
          <select style={{...s.select,marginBottom:14}} value={co.templateId} onChange={e=>setCo(cv.id,{templateId:e.target.value})}>{templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <div style={s.field()}><label style={s.label}>Target Dates</label><input style={s.input(12)} value={co.customDates||''} onChange={e=>setCo(cv.id,{customDates:e.target.value})} placeholder="e.g. June 21-24"/></div>
          <div style={s.field()}><label style={s.label}>Personal Note</label><textarea style={{...s.input(12),resize:'none',minHeight:56}} value={co.customNote||''} onChange={e=>setCo(cv.id,{customNote:e.target.value})} placeholder="A personal note, compliment, mutual contact..."/></div>
          <div style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:14,padding:14,marginBottom:12}}>
            <div style={s.sectionTitle}>[email] Generated Email</div>
            <div style={{background:C.bg,border:`1px solid ${C.bord}`,borderRadius:10,padding:12,marginBottom:10}}>
              <div style={{fontSize:10,color:C.muted,marginBottom:4}}>To: {cv.email||'No email on file'}</div>
              <div style={{fontSize:12,color:C.acc2,marginBottom:8,fontWeight:500}}>Subject: {filledSubject}</div>
              <div style={{fontSize:11,color:'#9090b0',lineHeight:1.8,whiteSpace:'pre-wrap',maxHeight:220,overflowY:'auto'}}>{fullBody}</div>
            </div>
            {currentTemplate?.photoLinks?.length>0&&<div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:1,textTransform:'uppercase'}}>[photo] Press Kit Links Included</div>{currentTemplate.photoLinks.map((p,i)=><div key={i} style={{fontSize:11,color:C.acc2,marginBottom:3}}>* {p.label}</div>)}</div>}
            {cv&&<button onClick={()=>{
              const touches=(cv.contactLog||[]).length;
              const isNew=touches===0;
              const prompt='You are Jason Schuster, comedian and tour manager for Phil Medina. Write a SHORT natural booking email.\n\nVenue: '+cv.venue+'\nCity: '+cv.city+', '+cv.state+'\nBooker: '+(cv.booker||'their booker')+(cv.bookerLast?' '+cv.bookerLast:'')+'\nRelationship: '+(isNew?'brand new contact, first outreach':'existing contact, touch #'+(touches+1))+'\nPrevious contacts: '+touches+'\nHistory: '+(cv.history||'none')+'\nWarmth: '+(cv.warmth||'Cold')+'\nStatus: '+cv.status+'\nTarget dates: '+(cv.targetDates||'flexible')+'\n\nPhil Medina credits: Laugh Factory, Hollywood Improv, Ice House, Netflix Is A Joke Fest, Hulu West Coast Comedy.\nJason Schuster credits: Comedy Store, Jimmy Kimmel Comedy Club, Kenan Presents.\n\n'+(isNew?'First outreach - warm, professional, brief.':'Follow-up - reference previous outreach, stay persistent but friendly.')+'\n\nWrite ONLY the email body under 120 words. Sign as Jason Schuster.';
              if(!ANTHROPIC_KEY||ANTHROPIC_KEY==='YOUR_ANTHROPIC_KEY_HERE'){toast2('Add your Anthropic API key to App.js line 6');return;}
              fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json','x-api-key':ANTHROPIC_KEY,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:400,messages:[{role:'user',content:prompt}]})})
              .then(r=>r.json()).then(d=>{const txt=d.content?.[0]?.text||'';if(txt){setComposeOpts(o=>({...o,customNote:txt}));toast2('AI draft ready!');}else{toast2('AI error: '+(d.error?.message||'check API key'));}})
              .catch(e=>toast2('AI error: '+e.message));
              toast2('Generating AI draft...');
            }} style={{...s.btn('rgba(108,92,231,0.1)',C.acc2,'rgba(108,92,231,0.3)'),width:'100%',marginBottom:8,fontSize:12}}>AI Draft Email (relationship-aware)</button>}
            <div style={s.row}>
              {mailto&&<button onClick={()=>{upd(cv.id,{status:cv.status==='Lead'?'Contacted':cv.status,nextFollowUp:new Date(Date.now()+7*24*60*60*1000).toISOString().split('T')[0]});const entry={date:new Date().toISOString().split('T')[0],method:'Email',note:'Outreach email sent via Gmail'};setVenues(vs=>vs.map(v=>v.id===cv.id?{...v,contactLog:[...(v.contactLog||[]),entry]}:v));toast2('Opening Gmail...');const gmailUrl='https://mail.google.com/mail/u/0/?authuser=jschucomedy%40gmail.com&view=cm&to='+encodeURIComponent(cv?.email||'')+'&su='+encodeURIComponent(filledSubject)+'&body='+encodeURIComponent(fullBody);window.open(gmailUrl,'_blank');}} style={{...s.btn(C.acc,'#fff',null),width:'100%',flex:1}}>[email] Open Gmail</button>}
              <button onClick={()=>copyText(`Subject: ${filledSubject}\n\n${fullBody}`,'Email',toast2)} style={{...s.btn(C.surf2,C.txt,C.bord),flex:'0 0 auto',padding:'12px 14px'}}>Copy</button>
            </div>
          </div>
          <button onClick={()=>setTemplateOpen(true)} style={{...s.btn(C.surf2,C.acc2,C.bord),width:'100%',marginBottom:10}}>? Edit Templates</button>
          <button onClick={()=>{upd(cv.id,{status:'Contacted',nextFollowUp:new Date(Date.now()+7*24*60*60*1000).toISOString().split('T')[0]});const entry={date:new Date().toISOString().split('T')[0],method:'Email',note:'Marked as contacted'};setVenues(vs=>vs.map(v=>v.id===cv.id?{...v,contactLog:[...(v.contactLog||[]),entry]}:v));toast2('OK Contacted  -  follow-up set');}} style={s.btn('rgba(0,184,148,0.1)',C.green,'rgba(0,184,148,0.25)')}>OK Mark Contacted + Set Follow-Up</button>
        </>}
      </Panel>

      {/* == DEAL PANEL == */}
      <Panel open={!!deal} onClose={()=>setDealId(null)} title={`${deal?.venue||''}  -  Deal`}>
        {deal&&<>
          <div style={s.field()}><label style={s.label}>Agreement Type</label><ToggleGroup options={[{id:'Email Agreement',label:'[email] Email Agmt'},{id:'Contract',label:'[doc] Contract'}]} value={deal.agreementType||'Email Agreement'} onChange={v=>upd(deal.id,{agreementType:v})}/></div>
          {(deal.agreementType==='Email Agreement'||!deal.agreementType)&&<>
            <div style={s.field()}><label style={s.label}>Confirmed Via Email Date</label><input type="date" style={s.input()} value={deal.confirmedViaEmailDate||''} onChange={e=>upd(deal.id,{confirmedViaEmailDate:e.target.value})}/></div>
            <div style={s.field()}><label style={s.label}>Email Thread URL (optional)</label><input style={s.input(12)} value={deal.emailThreadURL||''} onChange={e=>upd(deal.id,{emailThreadURL:e.target.value})} placeholder="Gmail link to confirmation thread"/></div>
            <div style={s.field()}><label style={s.label}>Paste Email Agreement Text</label><textarea style={{...s.input(11),resize:'none',minHeight:80}} value={deal.emailThreadText||''} onChange={e=>upd(deal.id,{emailThreadText:e.target.value})} placeholder="Paste the confirmation email here for your records..."/></div>
          </>}
          {['Confirmed','Advancing'].includes(deal.status)&&<div style={{background:deal.termsLocked?'rgba(0,184,148,0.08)':'rgba(253,203,110,0.08)',border:`1px solid ${deal.termsLocked?'rgba(0,184,148,0.2)':'rgba(253,203,110,0.2)'}`,borderRadius:10,padding:'10px 14px',marginBottom:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><div style={{fontSize:12,fontFamily:font.head,fontWeight:700,color:deal.termsLocked?C.green:C.yellow}}>{deal.termsLocked?'[lock] Terms Locked':'[unlock] Terms Unlocked'}</div><div style={{fontSize:10,color:C.muted,marginTop:2}}>{deal.termsLocked?'Tap to unlock and edit':'Lock to prevent accidental edits'}</div></div>
            <button onClick={()=>upd(deal.id,{termsLocked:!deal.termsLocked})} style={{padding:'8px 14px',borderRadius:8,border:'none',background:deal.termsLocked?C.green:C.yellow,color:'#000',fontSize:11,cursor:'pointer',fontFamily:font.head,fontWeight:700}}>{deal.termsLocked?'Unlock':'Lock'}</button>
          </div>}
          <div style={s.field()}><label style={s.label}>Deal Type</label><select style={s.select} value={deal.dealType||'Flat Guarantee'} onChange={e=>upd(deal.id,{dealType:e.target.value})}>{DEAL_TYPES.map(d=><option key={d}>{d}</option>)}</select></div>
          {/* Dynamic deal fields based on deal type */}
          {(deal.dealType==='Flat Guarantee'||deal.dealType==='Guarantee + Bonus'||!deal.dealType)&&<div style={s.field()}><label style={s.label}>Guarantee ($)</label><input type="number" style={s.input()} value={deal.guarantee||''} onChange={e=>upd(deal.id,{guarantee:parseFloat(e.target.value)||0})} placeholder="3500"/></div>}
          {deal.dealType==='Versus Deal'&&<><div style={s.field()}><label style={s.label}>Guarantee ($)</label><input type="number" style={s.input()} value={deal.guarantee||''} onChange={e=>upd(deal.id,{guarantee:parseFloat(e.target.value)||0})} placeholder="3500"/></div><div style={s.grid2}><div style={s.field()}><label style={s.label}>GBOR % (your share)</label><input type="number" style={s.input()} value={deal.gborPct||''} onChange={e=>upd(deal.id,{gborPct:parseFloat(e.target.value)||0})} placeholder="85"/></div><div style={s.field()}><label style={s.label}>Admin Fee / Minimum ($)</label><input type="number" style={s.input()} value={deal.venueMinimum||''} onChange={e=>upd(deal.id,{venueMinimum:parseFloat(e.target.value)||0})} placeholder="4500"/></div></div><div style={{background:'rgba(162,155,254,0.08)',border:'1px solid rgba(162,155,254,0.2)',borderRadius:10,padding:'10px 12px',marginBottom:14,fontSize:11,color:C.acc2}}>Versus deal: you get whichever is more  -  the guarantee OR your GBOR% after the admin fee.</div></>}
          {deal.dealType==='Door Deal'&&<><div style={s.grid2}><div style={s.field()}><label style={s.label}>Your Door % (after expenses)</label><input type="number" style={s.input()} value={deal.doorPct||''} onChange={e=>upd(deal.id,{doorPct:parseFloat(e.target.value)||0})} placeholder="80"/></div><div style={s.field()}><label style={s.label}>Venue Expenses Off Top ($)</label><input type="number" style={s.input()} value={deal.doorExpenses||''} onChange={e=>upd(deal.id,{doorExpenses:parseFloat(e.target.value)||0})} placeholder="300"/></div></div><div style={{background:'rgba(253,203,110,0.08)',border:'1px solid rgba(253,203,110,0.2)',borderRadius:10,padding:'10px 12px',marginBottom:14,fontSize:11,color:C.yellow}}>Door deal: venue deducts expenses first, then you split the remainder at your %.</div></>}
          {deal.dealType==='Guarantee + Bonus'&&<div style={s.field()}><label style={s.label}>Bonus Threshold / Notes</label><input style={s.input()} value={deal.bonusNotes||''} onChange={e=>upd(deal.id,{bonusNotes:e.target.value})} placeholder="e.g. +$500 if over 200 tickets sold"/></div>}
          <div style={s.field()}><label style={s.label}>Full Deal Terms (plain text)</label><textarea style={{...s.input(12),resize:'none',minHeight:60}} value={deal.dealNotes||''} onChange={e=>upd(deal.id,{dealNotes:e.target.value})} placeholder="e.g. 100% door after sales tax + staffing. Porch Stage: 80/20 after $300, includes sound engineer."/></div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}># Shows</label><input type="number" style={s.input()} value={deal.showCount||''} onChange={e=>upd(deal.id,{showCount:parseInt(e.target.value)||0})} placeholder="4"/></div>
            <div style={s.field()}><label style={s.label}>Ticket Price ($)</label><input type="number" style={s.input()} value={deal.ticketPrice||''} onChange={e=>upd(deal.id,{ticketPrice:parseFloat(e.target.value)||0})} placeholder="25"/></div>
          </div>
          <div style={s.field()}><label style={s.label}>Target Dates</label><input style={s.input()} value={deal.targetDates||''} onChange={e=>upd(deal.id,{targetDates:e.target.value})} placeholder="June 21-24"/></div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>Deposit ($)</label><input type="number" style={s.input()} value={deal.depositAmount||''} onChange={e=>upd(deal.id,{depositAmount:parseFloat(e.target.value)||0})}/></div>
            <div style={s.field()}><label style={s.label}>Deposit Due</label><input type="date" style={s.input()} value={deal.depositDue||''} onChange={e=>upd(deal.id,{depositDue:e.target.value})}/></div>
          </div>
          <div style={s.field()}><label style={s.label}>Contract Status</label><select style={s.select} value={deal.contractStatus||'None'} onChange={e=>upd(deal.id,{contractStatus:e.target.value})}>{['None','Draft','Sent','Signed','Cancelled'].map(d=><option key={d}>{d}</option>)}</select></div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>Lodging</label><select style={s.select} value={deal.lodging||'Hotel'} onChange={e=>upd(deal.id,{lodging:e.target.value})}>{['Hotel','Comedy Condo','Airbnb','None'].map(d=><option key={d}>{d}</option>)}</select></div>
            <div style={s.field()}><label style={s.label}>Merch Cut (%)</label><input type="number" style={s.input()} value={deal.merchCut||''} onChange={e=>upd(deal.id,{merchCut:parseFloat(e.target.value)||0})} placeholder="20"/></div>
          </div>
          {deal.guarantee>0&&<div style={{background:'rgba(0,184,148,0.08)',border:'1px solid rgba(0,184,148,0.2)',borderRadius:12,padding:'12px 14px',marginBottom:16}}>
            <div style={s.sectionTitle}>$ Estimated Net</div>
            <div style={s.grid2}>{[['Gross',formatCurrency(deal.guarantee)],['Agent (10%)',formatCurrency(deal.guarantee*0.10)],['Manager (15%)',formatCurrency(deal.guarantee*0.15)],['Your Net',formatCurrency(deal.guarantee*0.75)]].map(([l,v])=><div key={l}><div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:2}}>{l}</div><div style={{fontSize:13,fontFamily:font.head,fontWeight:700,color:l==='Your Net'?C.green:C.txt}}>{v}</div></div>)}</div>
          </div>}
          <button onClick={()=>{setDealId(null);toast2('Deal saved OK');}} style={{...s.btn(C.acc,'#fff',null),width:'100%'}}>Save Deal</button>
        </>}
      </Panel>

      {/* == CHECKLIST PANEL == */}
      <Panel open={!!clV} onClose={()=>setChecklistId(null)} title={clV?`${clV.venue}  -  Checklist`:''}>
        {clV&&<>
          <div style={{fontSize:11,color:C.muted,marginBottom:14}}>Track every detail before show day</div>
          <div style={{marginBottom:16}}>
            {(clV.checklist||[]).map((item,i)=><div key={item.id} onClick={()=>{const nc=[...clV.checklist];nc[i]={...item,done:!item.done};upd(clV.id,{checklist:nc});}} style={{display:'flex',alignItems:'center',gap:12,padding:'11px 14px',background:item.done?'rgba(0,184,148,0.06)':C.surf2,border:`1px solid ${item.done?'rgba(0,184,148,0.2)':C.bord}`,borderRadius:10,marginBottom:8,cursor:'pointer',transition:'all 0.15s'}}>
              <div style={{width:20,height:20,borderRadius:'50%',border:`2px solid ${item.done?C.green:C.bord}`,background:item.done?C.green:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{item.done&&<span style={{color:'#000',fontSize:11,fontWeight:700}}>OK</span>}</div>
              <span style={{fontSize:13,color:item.done?C.muted:C.txt,textDecoration:item.done?'line-through':'none'}}>{item.label}</span>
            </div>)}
          </div>
          <div style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:10,padding:'10px 14px',marginBottom:14,textAlign:'center'}}>
            <div style={{fontFamily:font.head,fontWeight:800,fontSize:28,color:checklistPct(clV.checklist)===100?C.green:C.yellow}}>{checklistPct(clV.checklist)}%</div>
            <div style={{fontSize:11,color:C.muted}}>complete</div>
          </div>
          <button onClick={()=>{upd(clV.id,{checklist:createChecklist()});toast2('Checklist reset');}} style={{...s.btn(C.surf2,C.muted,C.bord),width:'100%'}}>Reset Checklist</button>
        </>}
      </Panel>

      {/* == SETTLEMENT PANEL == */}
      <Panel open={!!stlV} onClose={()=>setSettlementId(null)} title={stlV?`${stlV.venue}  -  Settlement`:''}>
        {stlV&&<>
          <div style={{background:'rgba(0,184,148,0.08)',border:'1px solid rgba(0,184,148,0.2)',borderRadius:12,padding:'12px 14px',marginBottom:14}}>
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,color:C.acc2,marginBottom:8}}>Projected</div>
            <div style={s.grid2}>{[['Gross',formatCurrency(stlV.guarantee)],['Your Net',formatCurrency(stlV.guarantee*0.75)]].map(([l,v2])=><div key={l}><div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:2}}>{l}</div><div style={{fontSize:14,fontFamily:font.head,fontWeight:700,color:C.txt}}>{v2}</div></div>)}</div>
          </div>
          <div style={s.field()}><label style={s.label}>Actual Net Paid ($)</label><input type="number" style={s.input()} defaultValue={stlV.settlement?.actualNetPaid||''} onChange={e=>upd(stlV.id,{settlement:{...(stlV.settlement||{}),actualNetPaid:parseFloat(e.target.value)||0}})} placeholder="What you actually walked out with"/></div>
          <div style={s.field()}><label style={s.label}>Actual Gross / Door ($)</label><input type="number" style={s.input()} defaultValue={stlV.settlement?.actualGross||''} onChange={e=>upd(stlV.id,{settlement:{...(stlV.settlement||{}),actualGross:parseFloat(e.target.value)||0}})} placeholder="Total door revenue"/></div>
          <div style={s.field()}><label style={s.label}>Merch Net ($)</label><input type="number" style={s.input()} defaultValue={stlV.settlement?.actualMerchNet||''} onChange={e=>upd(stlV.id,{settlement:{...(stlV.settlement||{}),actualMerchNet:parseFloat(e.target.value)||0}})} placeholder="Your merch take"/></div>
          <div style={s.field()}><label style={s.label}>Settlement Notes</label><textarea style={{...s.input(12),resize:'none',minHeight:70}} defaultValue={stlV.settlement?.notes||''} onChange={e=>upd(stlV.id,{settlement:{...(stlV.settlement||{}),notes:e.target.value}})} placeholder="How did it go?"/></div>
          {stlV.settlement?.actualNetPaid>0&&<div style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:10,padding:'10px 14px',marginBottom:14}}>
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,marginBottom:6}}>Variance vs Projected</div>
            <div style={{fontFamily:font.head,fontWeight:800,fontSize:22,color:stlV.settlement.actualNetPaid>=stlV.guarantee*0.75?C.green:C.red}}>{stlV.settlement.actualNetPaid>=stlV.guarantee*0.75?'+':''}{formatCurrency(stlV.settlement.actualNetPaid-(stlV.guarantee*0.75))}</div>
          </div>}
          <button onClick={()=>{setSettlementId(null);toast2('Settlement saved OK');}} style={{...s.btn(C.acc,'#fff',null),width:'100%'}}>Save Settlement</button>
        </>}
      </Panel>

      {/* == SHOW REPORT PANEL == */}
      <Panel open={!!srV} onClose={()=>setShowReportId(null)} title="mic Show Report">
        {srV&&<>
          <div style={{fontSize:11,color:C.muted,marginBottom:14}}>30-second post-show rating</div>
          {[['attendanceRating','Crowd Size'],['crowdQuality','Crowd Energy'],['bookerProfessionalism','Booker Professionalism']].map(([field,label])=><div key={field} style={s.field()}>
            <label style={s.label}>{label}</label>
            <div style={{display:'flex',gap:8}}>{[1,2,3,4,5].map(n=><div key={n} onClick={()=>upd(srV.id,{showReport:{...(srV.showReport||{}),[field]:n}})} style={{flex:1,padding:'10px 4px',borderRadius:8,border:'1px solid',borderColor:(srV.showReport?.[field]||0)>=n?C.yellow:C.bord,background:(srV.showReport?.[field]||0)>=n?'rgba(253,203,110,0.1)':'none',textAlign:'center',cursor:'pointer',fontSize:16}}>[star]</div>)}</div>
          </div>)}
          <div style={s.field()}><label style={s.label}>Payment Speed</label><ToggleGroup options={['Night-of','Within week','Late']} value={srV.showReport?.paySpeed||'Night-of'} onChange={v=>upd(srV.id,{showReport:{...(srV.showReport||{}),paySpeed:v}})}/></div>
          <div style={s.field()}><label style={s.label}>Want to Return?</label><ToggleGroup options={['Yes','Renegotiate','No']} value={srV.showReport?.wantToReturn||'Yes'} onChange={v=>upd(srV.id,{showReport:{...(srV.showReport||{}),wantToReturn:v}})}/></div>
          <div style={s.field()}><label style={s.label}>Ideal Rebook Window</label><select style={s.select} value={srV.showReport?.rebookWindow||'6 months'} onChange={e=>upd(srV.id,{showReport:{...(srV.showReport||{}),rebookWindow:e.target.value}})}>{['3 months','6 months','12 months','Never'].map(w=><option key={w}>{w}</option>)}</select></div>
          <button onClick={()=>{const months=parseInt(srV.showReport?.rebookWindow)||6;const rd=new Date();rd.setMonth(rd.getMonth()+months);upd(srV.id,{rebookDate:rd.toISOString().split('T')[0],status:'Completed'});setShowReportId(null);toast2('[OK] Report saved  -  rebook reminder set!');}} style={{...s.btn(C.acc,'#fff',null),width:'100%'}}>Save Report + Set Rebook Reminder</button>
        </>}
      </Panel>

      {/* == MONEY TIMELINE PANEL == */}
      <Panel open={moneyOpen} onClose={()=>setMoneyOpen(false)} title="$ Money Timeline">
        <MoneyTimeline venues={venues} onMarkPaid={(id)=>{upd(id,{paid:true,paidDate:new Date().toISOString().split('T')[0]});setMoneyOpen(false);setTimeout(()=>setShowReportId(id),300);toast2('[OK] Marked paid!');}}/>
      </Panel>

      {/* == VENUE DATABASE PANEL == */}
      <Panel open={dbOpen} onClose={()=>setDbOpen(false)} title="[loc] Venue Database">
        <div style={{fontSize:11,color:C.muted,marginBottom:12}}>{VENUE_DATABASE.length} venues . tap to add</div>
        <input style={{...s.input(12),marginBottom:10}} placeholder="Search venue, city, state..." value={dbSearch} onChange={e=>setDbSearch(e.target.value)}/>
        <div style={s.grid2}>
          <div style={s.field()}><select style={s.select} value={dbStateFilter} onChange={e=>setDbStateFilter(e.target.value)}>{dbStates.map(st=><option key={st}>{st}</option>)}</select></div>
          <div style={s.field()}><select style={s.select} value={dbTypeFilter} onChange={e=>setDbTypeFilter(e.target.value)}>{dbTypes.map(t=><option key={t}>{t}</option>)}</select></div>
        </div>
        <div style={{fontSize:10,color:C.muted,marginBottom:10}}>{dbFiltered.length} results</div>
        <div style={{maxHeight:400,overflowY:'auto'}}>
          {dbFiltered.map((v,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${C.bord}`}}>
            <div style={{flex:1}}><div style={{fontFamily:font.head,fontWeight:600,fontSize:13}}>{v.venue}</div><div style={{fontSize:11,color:C.muted}}>{v.city}, {v.state} . {v.venueType}{v.capacity?` . ${v.capacity} cap`:''}</div>{v.email&&<div style={{fontSize:10,color:C.muted2,marginTop:2}}>{v.email}</div>}</div>
            <button onClick={()=>addFromDb(v)} style={{flexShrink:0,padding:'6px 14px',borderRadius:8,background:C.acc,border:'none',color:'#fff',fontSize:11,cursor:'pointer',fontFamily:font.head,fontWeight:700,marginLeft:10}}>Add</button>
          </div>)}
        </div>
      </Panel>

      {/* == TEMPLATES PANEL == */}
      <Panel open={templateOpen} onClose={()=>{setTemplateOpen(false);setEditTemplateId(null);}} title="[email] Email Templates">
        {!editTemplateId?<>
          <div style={{fontSize:11,color:C.muted,marginBottom:14}}>Use [VENUE] [BOOKER_FIRST] [DATES] [CITY] [STATE] as placeholders</div>
          {templates.map(t=><div key={t.id} style={{...s.card,marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><div style={{fontFamily:font.head,fontWeight:700,fontSize:14,marginBottom:3}}>{t.name}</div><div style={{fontSize:10,color:C.muted}}>{t.subject.substring(0,50)}...</div></div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>setEditTemplateId(t.id)} style={{padding:'6px 12px',borderRadius:8,background:C.acc,border:'none',color:'#fff',fontSize:11,cursor:'pointer',fontFamily:font.head,fontWeight:700}}>Edit</button>
                {!DEFAULT_TEMPLATES.find(d=>d.id===t.id)&&<button onClick={()=>deleteTemplate(t.id)} style={{padding:'6px 10px',borderRadius:8,background:'none',border:`1px solid ${C.red}`,color:C.red,fontSize:11,cursor:'pointer'}}>x</button>}
              </div>
            </div>
          </div>)}
          <button onClick={()=>setEditTemplateId('new')} style={{...s.btn(C.acc,'#fff',null),width:'100%',marginTop:8}}>+ New Template</button>
        </>:<TemplateEditor template={editTemplateId==='new'?{id:'new',name:'',subject:'',body:'',photoLinks:[]}:editTpl} onSave={saveTemplate} onCancel={()=>setEditTemplateId(null)}/>}
      </Panel>

      {/* == TOUR PANEL == */}
      <Panel open={tourOpen} onClose={()=>{setTourOpen(false);setEditTourId(null);}} title={editTour?editTour.name:'[bus] New Tour'}>
        <TourEditor tour={editTour} onSave={saveTour} onCancel={()=>{setTourOpen(false);setEditTourId(null);}} venues={venues}/>
      </Panel>

      {/* == IMPORT PANEL == */}
      <Panel open={importOpen} onClose={()=>setImportOpen(false)} title="[folder] Import Venues">
        <div style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:12,padding:16,marginBottom:16}}>
          <div style={{fontFamily:font.head,fontWeight:700,fontSize:14,marginBottom:8}}>CSV Format</div>
          <div style={{fontSize:11,color:C.muted,marginBottom:10,lineHeight:1.7}}>Column headers your CSV should have:</div>
          <div style={{background:C.bg,borderRadius:8,padding:'10px 12px',fontSize:11,fontFamily:font.body,color:C.acc2,lineHeight:1.8}}>venue, booker, city, state, email, instagram, phone, capacity, venue type, notes</div>
          <div style={{fontSize:10,color:C.muted,marginTop:8}}>Export Gmail contacts or Google Sheet as CSV and import directly.</div>
        </div>
        <input ref={fileRef} type="file" accept=".csv" style={{display:'none'}} onChange={handleCSVImport}/>
        <button onClick={()=>fileRef.current?.click()} style={{...s.btn(C.acc,'#fff',null),width:'100%'}}>[folder] Choose CSV File</button>
      </Panel>

      {/* == ADD VENUE PANEL == */}
      <Panel open={addOpen} onClose={()=>setAddOpen(false)} title="Add Venue">
        <div style={s.grid2}>
          <div style={s.field()}><label style={s.label}>Venue Name</label><input style={s.input()} placeholder="The Comedy Store" value={nv.venue} onChange={e=>setNv(n=>({...n,venue:e.target.value}))}/></div>
          <div style={s.field()}><label style={s.label}>Booker First</label><input style={s.input()} placeholder="Jamie" value={nv.booker} onChange={e=>setNv(n=>({...n,booker:e.target.value}))}/></div>
        </div>
        <div style={s.field()}><label style={s.label}>Booker Last Name</label><input style={s.input()} placeholder="Smith" value={nv.bookerLast||''} onChange={e=>setNv(n=>({...n,bookerLast:e.target.value}))}/></div>
        <div style={s.grid2}>
          <div style={s.field()}><label style={s.label}>City</label><input style={s.input()} placeholder="Los Angeles" value={nv.city} onChange={e=>setNv(n=>({...n,city:e.target.value}))}/></div>
          <div style={s.field()}><label style={s.label}>State</label><input style={s.input()} placeholder="CA" maxLength={2} value={nv.state} onChange={e=>setNv(n=>({...n,state:e.target.value.toUpperCase()}))}/></div>
        </div>
        <div style={s.field()}><label style={s.label}>Email</label><input type="email" style={s.input()} placeholder="booking@venue.com" value={nv.email} onChange={e=>setNv(n=>({...n,email:e.target.value}))}/></div>
        <div style={s.grid2}>
          <div style={s.field()}><label style={s.label}>Instagram</label><input style={s.input()} placeholder="@venue" value={nv.instagram} onChange={e=>setNv(n=>({...n,instagram:e.target.value}))}/></div>
          <div style={s.field()}><label style={s.label}>Capacity</label><input type="number" style={s.input()} placeholder="300" value={nv.capacity} onChange={e=>setNv(n=>({...n,capacity:e.target.value}))}/></div>
        </div>
        <div style={s.grid2}>
          <div style={s.field()}><label style={s.label}>Venue Type</label><select style={s.select} value={nv.venueType} onChange={e=>setNv(n=>({...n,venueType:e.target.value}))}>{VENUE_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
          <div style={s.field()}><label style={s.label}>Deal Type</label><select style={s.select} value={nv.dealType} onChange={e=>setNv(n=>({...n,dealType:e.target.value}))}>{DEAL_TYPES.map(d=><option key={d}>{d}</option>)}</select></div>
        </div>
        <div style={s.field()}><label style={s.label}>Relationship</label><ToggleGroup options={[{id:'existing',label:'[star] Existing'},{id:'new',label:'[new] New'}]} value={nv.relationship} onChange={rel=>setNv(n=>({...n,relationship:rel}))}/></div>
        <div style={s.field()}><label style={s.label}>Warmth</label><ToggleGroup options={WARMTH} value={nv.warmth} onChange={w=>setNv(n=>({...n,warmth:w}))}/></div>
        <div style={s.grid2}>
          <div style={s.field()}><label style={s.label}>Guarantee ($)</label><input type="number" style={s.input()} placeholder="1500" value={nv.guarantee} onChange={e=>setNv(n=>({...n,guarantee:e.target.value}))}/></div>
          <div style={s.field()}><label style={s.label}>Target Dates</label><input style={s.input()} placeholder="June 21-24" value={nv.targetDates} onChange={e=>setNv(n=>({...n,targetDates:e.target.value}))}/></div>
        </div>
        <div style={s.field()}><label style={s.label}>Next Follow-Up</label><input type="date" style={s.input()} value={nv.nextFollowUp} onChange={e=>setNv(n=>({...n,nextFollowUp:e.target.value}))}/></div>
        <div style={{...s.row,marginTop:8}}>
          <button onClick={addVenue} style={s.btn(C.acc,'#fff',null)}>Add Venue</button>
          <button onClick={()=>setAddOpen(false)} style={s.btn(C.surf2,C.txt,C.bord)}>Cancel</button>
        </div>
      </Panel>

    </div>
  );
}

// -- MONEY TIMELINE -------------------------------------------
function MoneyTimeline({venues,onMarkPaid}){
  const[window2,setWindow2]=useState(30);
  const today=new Date();today.setHours(0,0,0,0);
  const cutoff=new Date();cutoff.setDate(cutoff.getDate()+window2);
  const depositItems=venues.filter(v=>{if(!v.depositAmount||v.depositPaid||!v.depositDue)return false;const d=new Date(v.depositDue);return d>=today&&d<=cutoff;}).sort((a,b)=>new Date(a.depositDue)-new Date(b.depositDue));
  const showItems=venues.filter(v=>['Confirmed','Advancing'].includes(v.status)&&v.guarantee>0);
  const totalExpected=showItems.reduce((a,v)=>a+(Number(v.guarantee)||0)*0.75,0);
  const totalPaid=showItems.filter(v=>v.paid).reduce((a,v)=>a+(Number(v.guarantee)||0)*0.75,0);
  return(<div>
    <div style={{display:'flex',gap:8,marginBottom:16}}>{[30,60,90].map(d=><button key={d} onClick={()=>setWindow2(d)} style={{flex:1,padding:'9px',borderRadius:8,border:'1px solid',borderColor:window2===d?C.acc:C.bord,background:window2===d?`${C.acc}18`:'none',color:window2===d?C.acc2:C.muted,fontSize:11,cursor:'pointer',fontFamily:font.head,fontWeight:700}}>{d} Days</button>)}</div>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>{[['Expected',formatCurrency(totalExpected),C.green],['Paid',formatCurrency(totalPaid),C.acc2],['Pending',formatCurrency(totalExpected-totalPaid),C.yellow]].map(([l,v,color])=><div key={l} style={{background:C.surf,border:`1px solid ${C.bord}`,borderRadius:10,padding:'10px 8px',textAlign:'center'}}><div style={{fontSize:9,color:C.muted,letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>{l}</div><div style={{fontFamily:font.head,fontWeight:800,fontSize:15,color}}>{v}</div></div>)}</div>
    {depositItems.length>0&&<><div style={{fontFamily:font.head,fontWeight:700,fontSize:12,color:C.yellow,marginBottom:10}}>[warn] Deposits Due</div>{depositItems.map(v=><div key={v.id} style={{background:C.surf,border:`1px solid rgba(253,203,110,0.3)`,borderRadius:12,padding:'12px 14px',marginBottom:8}}><div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:3}}>{v.venue}</div><div style={{fontSize:11,color:C.muted,marginBottom:4}}>{v.city}, {v.state} . Due {v.depositDue}</div><div style={{fontSize:13,color:C.yellow,fontFamily:font.head,fontWeight:700}}>{formatCurrency(v.depositAmount)} deposit</div></div>)}</>}
    <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,color:C.green,marginBottom:10,marginTop:16}}>mic Show Payments</div>
    {showItems.length===0&&<div style={{fontSize:12,color:C.muted,padding:'20px 0',textAlign:'center'}}>No confirmed shows yet</div>}
    {showItems.map(v=><div key={v.id} style={{background:C.surf,border:`1px solid ${v.paid?'rgba(0,184,148,0.3)':C.bord}`,borderRadius:12,padding:'12px 14px',marginBottom:8}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:6}}><div><div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:2}}>{v.venue}</div><div style={{fontSize:11,color:C.muted}}>{v.targetDates||'Dates TBD'}</div></div><div style={{textAlign:'right'}}><div style={{fontSize:13,fontFamily:font.head,fontWeight:700,color:v.paid?C.green:C.txt}}>{formatCurrency(v.guarantee*0.75)}</div><div style={{fontSize:9,color:C.muted}}>net est.</div></div></div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><span style={{fontSize:10,padding:'3px 9px',borderRadius:20,background:v.paid?'rgba(0,184,148,0.1)':'rgba(253,203,110,0.1)',color:v.paid?C.green:C.yellow,border:`1px solid ${v.paid?'rgba(0,184,148,0.3)':'rgba(253,203,110,0.3)'}`}}>{v.paid?`[OK] Paid ${v.paidDate||''}`:`[wait] ${v.expectedPaymentTiming||'Night of show'}`}</span>{!v.paid&&<button onClick={()=>onMarkPaid(v.id)} style={{padding:'6px 14px',borderRadius:8,background:C.green,border:'none',color:'#000',fontSize:11,cursor:'pointer',fontFamily:font.head,fontWeight:700}}>Mark Paid</button>}</div>
    </div>)}
  </div>);
}

// -- CALENDAR TAB ---------------------------------------------
function CalendarTab({venues,tours=[],onVenueClick,onChecklist,toast2}){
  const calEvents=venues.filter(v=>v.targetDates&&['Hold','Confirmed','Advancing','Completed'].includes(v.status));
  // Add confirmed tour show dates to calendar
  const tourEvents=[];
  tours.forEach(t=>{(t.dates||[]).filter(d=>['Confirmed','Hold'].includes(d.status)).forEach(d=>{tourEvents.push({id:t.id+'_'+d.id,venue:d.venue||'TBD',city:d.city||'',state:d.state||'',status:d.status,guarantee:d.guarantee,targetDates:d.date,isTourDate:true,tourName:t.name});});});
  const allEvents=[...calEvents,...tourEvents];
  const grouped={};
  allEvents.forEach(v=>{const monthMatch=MONTHS.find(m=>(v.targetDates||'').includes(m));const key=monthMatch||'Undated';if(!grouped[key])grouped[key]=[];grouped[key].push(v);});
  const sortedMonths=Object.keys(grouped).sort((a,b)=>{const ai=MONTHS.indexOf(a);const bi=MONTHS.indexOf(b);if(ai===-1)return 1;if(bi===-1)return -1;return ai-bi;});
  const allConfirmed=venues.filter(v=>['Confirmed','Advancing'].includes(v.status));
  const totalGuarantee=allConfirmed.reduce((a,v)=>a+(Number(v.guarantee)||0),0);
  return(<div style={{padding:16}}>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
      {[[allEvents.length,'[cal]','On Calendar'],[allConfirmed.length,'[OK]','Confirmed'],['$'+Number(totalGuarantee).toLocaleString(),'[money]','Locked In']].map(([val,icon,label])=><div key={label} style={{background:C.surf,border:`1px solid ${C.bord}`,borderRadius:10,padding:'10px 8px',textAlign:'center'}}><div style={{fontSize:18,marginBottom:2}}>{icon}</div><div style={{fontFamily:font.head,fontWeight:800,fontSize:16,color:C.txt}}>{val}</div><div style={{fontSize:9,color:C.muted,letterSpacing:1,textTransform:'uppercase',marginTop:2}}>{label}</div></div>)}
    </div>
    {allEvents.length===0&&<div style={{textAlign:'center',padding:'40px 20px',color:C.muted}}><div style={{fontSize:36,marginBottom:12}}>[cal]</div><div>No dates on calendar yet.</div><div style={{fontSize:12,marginTop:8}}>Mark venues as Hold, Confirmed, or Advancing.</div></div>}
    {sortedMonths.map(month=><div key={month} style={{marginBottom:24}}>
      <div style={{fontFamily:font.head,fontWeight:700,fontSize:13,color:C.acc2,letterSpacing:1.5,textTransform:'uppercase',marginBottom:10,display:'flex',alignItems:'center',gap:8}}><div style={{width:3,height:16,background:C.acc,borderRadius:2}}/>{month}</div>
      {grouped[month].map(v=>{
        const pcolor=PIPE_COLORS[v.status]||C.muted;
        const gcalUrl=buildGoogleCalendarUrl(v);
        return<div key={v.id} style={{background:C.surf,border:`1px solid ${C.bord}`,borderLeft:`3px solid ${pcolor}`,borderRadius:14,padding:'14px 16px',marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
            <div style={{flex:1,cursor:'pointer'}} onClick={()=>onVenueClick(v.id)}>
              <div style={{fontFamily:font.head,fontWeight:700,fontSize:15,marginBottom:3}}>{v.venue}{v.isTourDate&&<span style={{fontSize:9,marginLeft:6,padding:'2px 6px',borderRadius:10,background:'rgba(108,92,231,0.15)',color:'#a29bfe',border:'1px solid rgba(108,92,231,0.3)'}}>{v.tourName}</span>}</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:6}}>{v.city}{v.state?', '+v.state:''}{!v.isTourDate&&v.booker?` . ${v.booker}${v.bookerLast?' '+v.bookerLast:''}`:''}</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                <span style={{fontSize:10,padding:'3px 9px',borderRadius:20,background:`${pcolor}18`,color:pcolor,border:`1px solid ${pcolor}40`}}>{v.status}</span>
                {v.showCount>0&&<span style={{fontSize:10,color:C.muted}}>{v.showCount} shows</span>}
                {v.guarantee>0&&<span style={{fontSize:11,color:C.green,fontFamily:font.head,fontWeight:700}}>{formatCurrency(v.guarantee)}</span>}
                {v.agreementType&&<span style={{fontSize:9,padding:'2px 7px',borderRadius:20,background:'rgba(253,203,110,0.08)',color:C.yellow,border:'1px solid rgba(253,203,110,0.2)'}}>{v.agreementType==='Contract'?'[doc] Contract':'[email] Email Agmt'}</span>}
              </div>
            </div>
            {gcalUrl&&<a href={gcalUrl} target="_blank" rel="noreferrer" style={{flexShrink:0,marginLeft:10}}><button style={{padding:'8px 10px',borderRadius:10,background:'rgba(66,133,244,0.15)',border:'1px solid rgba(66,133,244,0.3)',color:'#4285f4',fontSize:10,cursor:'pointer',fontFamily:font.body,display:'flex',flexDirection:'column',alignItems:'center',gap:2,lineHeight:1}}><span style={{fontSize:16}}>[cal]</span><span>+GCal</span></button></a>}
          </div>
          <div style={{background:C.surf2,borderRadius:8,padding:'8px 10px',marginBottom:8}}><div style={{fontSize:11,color:C.txt}}>[date] {v.targetDates}</div></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:v.checklist?8:0}}>
            {[['Deal',v.dealType||' - '],['Lodging',v.lodging||' - '],['Contract',v.contractStatus||' - ']].map(([l,val])=><div key={l} style={{background:C.surf2,borderRadius:8,padding:'6px 8px'}}><div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:2}}>{l}</div><div style={{fontSize:11,color:C.txt}}>{val}</div></div>)}
          </div>
          {v.checklist&&<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 10px',background:C.surf2,borderRadius:8,cursor:'pointer'}} onClick={()=>onChecklist&&onChecklist(v.id)}>
            <span style={{fontSize:11,color:C.muted}}>[list] Checklist</span>
            <span style={{fontSize:11,fontFamily:font.head,fontWeight:700,color:checklistPct(v.checklist)===100?C.green:C.yellow}}>{checklistPct(v.checklist)}%</span>
          </div>}
          {v.depositAmount>0&&!v.depositPaid&&v.depositDue&&<div style={{marginTop:8,padding:'6px 10px',background:'rgba(225,112,85,0.08)',border:'1px solid rgba(225,112,85,0.2)',borderRadius:8,fontSize:11,color:C.red}}>[warn] Deposit {formatCurrency(v.depositAmount)} due {v.depositDue}</div>}
        </div>;
      })}
    </div>)}
  </div>);
}

// -- TEMPLATE EDITOR ------------------------------------------
function TemplateEditor({template,onSave,onCancel}){
  const[name,setName]=useState(template?.name||'');
  const[subject,setSubject]=useState(template?.subject||'');
  const[body,setBody]=useState(template?.body||'');
  const[photoLinks,setPhotoLinks]=useState(template?.photoLinks||[]);
  function addPhotoLink(){setPhotoLinks(p=>[...p,{label:'',url:''}]);}
  function updPhotoLink(i,field,val){setPhotoLinks(p=>p.map((l,idx)=>idx===i?{...l,[field]:val}:l));}
  function removePhotoLink(i){setPhotoLinks(p=>p.filter((_,idx)=>idx!==i));}
  return<>
    <div style={{fontSize:10,color:C.muted,marginBottom:12,lineHeight:1.6}}>Placeholders: <span style={{color:C.acc2}}>[VENUE] [BOOKER_FIRST] [BOOKER_FULL] [DATES] [CITY] [STATE]</span></div>
    <div style={s.field()}><label style={s.label}>Template Name</label><input style={s.input()} value={name} onChange={e=>setName(e.target.value)} placeholder="Jason + Phil  -  Standard"/></div>
    <div style={s.field()}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <label style={s.label}>Subject Line</label>
        <button onClick={()=>{
  if(!('webkitSpeechRecognition'in window)&&!('SpeechRecognition'in window)){alert('Voice not supported. Use Chrome on desktop or Safari on iPhone.');return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const rec=new SR();rec.continuous=false;rec.interimResults=false;rec.lang='en-US';
  rec.onresult=(e)=>{const t=e.results[0][0].transcript;setSubject(prev=>prev?prev+' '+t:t);};
  rec.onerror=(e)=>{alert('Voice error: '+e.error+'. Make sure microphone is allowed.');};
  rec.start();
}} style={{fontSize:10,padding:'4px 10px',borderRadius:8,background:'rgba(225,112,85,0.1)',border:`1px solid rgba(225,112,85,0.3)`,color:C.red,cursor:'pointer',fontFamily:font.body,display:'flex',alignItems:'center',gap:4}}>mic Subject</button>
      </div>
      <input style={s.input()} value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Phil Medina  -  [DATES]  -  [VENUE]"/>
    </div>
    <div style={s.field()}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
        <label style={s.label}>Email Body</label>
        <button onClick={()=>{
  if(!('webkitSpeechRecognition'in window)&&!('SpeechRecognition'in window)){alert('Voice not supported. Use Chrome on desktop or Safari on iPhone.');return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const rec=new SR();rec.continuous=true;rec.interimResults=false;rec.lang='en-US';
  rec.onresult=(e)=>{Array.from(e.results).filter(r=>r.isFinal).forEach(r=>{const t=r[0].transcript;setBody(prev=>prev?prev+' '+t:t);});};
  rec.onerror=(e)=>{alert('Voice error: '+e.error+'. Make sure microphone is allowed.');};
  rec.start();
  setTimeout(()=>rec.stop(),30000);
}} style={{fontSize:10,padding:'4px 10px',borderRadius:8,background:'rgba(225,112,85,0.1)',border:`1px solid rgba(225,112,85,0.3)`,color:C.red,cursor:'pointer',fontFamily:font.body,display:'flex',alignItems:'center',gap:4}}>mic Body (30s)</button>
      </div>
      <textarea style={{...s.input(12),resize:'vertical',minHeight:300,lineHeight:1.7}} value={body} onChange={e=>setBody(e.target.value)} placeholder="Write your full email here. Use [VENUE], [BOOKER_FIRST], [DATES] as placeholders."/>
    </div>
    <div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:6}}>[photo] Press Kit Links</div>
    <div style={{fontSize:10,color:C.muted,marginBottom:10}}>Appended to the bottom of every email</div>
    {photoLinks.map((link,i)=><div key={i} style={{display:'flex',gap:8,marginBottom:8,alignItems:'center'}}>
      <input style={{...s.input(11),flex:1}} value={link.label} onChange={e=>updPhotoLink(i,'label',e.target.value)} placeholder="Phil Press Kit"/>
      <input style={{...s.input(11),flex:2}} value={link.url} onChange={e=>updPhotoLink(i,'url',e.target.value)} placeholder="https://..."/>
      <button onClick={()=>removePhotoLink(i)} style={{flexShrink:0,padding:'8px',background:'none',border:`1px solid ${C.red}`,borderRadius:8,color:C.red,cursor:'pointer',fontSize:12}}>x</button>
    </div>)}
    <button onClick={addPhotoLink} style={{...s.btn(C.surf2,C.txt,C.bord),width:'100%',marginBottom:16}}>+ Add Press Kit Link</button>
    <div style={s.row}>
      <button onClick={()=>onSave({...template,id:template.id==='new'?Date.now().toString():template.id,name,subject,body,photoLinks})} style={s.btn(C.acc,'#fff',null)}>Save Template</button>
      <button onClick={onCancel} style={s.btn(C.surf2,C.txt,C.bord)}>Cancel</button>
    </div>
  </>;
}

// -- TOUR EDITOR ----------------------------------------------
function TourEditor({tour,onSave,onCancel}){
  const[name,setName]=useState(tour?.name||'');
  const[startDate,setStartDate]=useState(tour?.startDate||'');
  const[endDate,setEndDate]=useState(tour?.endDate||'');
  const[travelBudget,setTravelBudget]=useState(tour?.travelBudget||'');
  const[lodgingBudget,setLodgingBudget]=useState(tour?.lodgingBudget||'');
  const[miscBudget,setMiscBudget]=useState(tour?.miscBudget||'');
  const[dates,setDates]=useState(tour?.dates||[]);
  const[notes,setNotes]=useState(tour?.notes||'');
  function addDate(){setDates(d=>[...d,{id:Date.now(),venue:'',city:'',state:'',date:'',showCount:1,guarantee:0,dealType:'Flat Guarantee',status:'Hold',notes:''}]);}
  function updDate(id,fields){setDates(d=>d.map(x=>x.id===id?{...x,...fields}:x));}
  function removeDate(id){setDates(d=>d.filter(x=>x.id!==id));}
  const totalGuarantee=dates.reduce((a,d)=>a+(Number(d.guarantee)||0),0);
  const totalExpenses=(Number(travelBudget)||0)+(Number(lodgingBudget)||0)+(Number(miscBudget)||0);
  const netEst=totalGuarantee*0.75-totalExpenses;
  return<>
    <div style={s.field()}><label style={s.label}>Tour Name</label><input style={s.input()} value={name} onChange={e=>setName(e.target.value)} placeholder="Summer 2025  -  Phil Medina Tour"/></div>
    <div style={s.grid2}>
      <div style={s.field()}><label style={s.label}>Start Date</label><input type="date" style={s.input()} value={startDate} onChange={e=>setStartDate(e.target.value)}/></div>
      <div style={s.field()}><label style={s.label}>End Date</label><input type="date" style={s.input()} value={endDate} onChange={e=>setEndDate(e.target.value)}/></div>
    </div>
    <div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:10}}>$ Budget</div>
    <div style={s.grid2}>
      <div style={s.field()}><label style={s.label}>Travel ($)</label><input type="number" style={s.input()} value={travelBudget} onChange={e=>setTravelBudget(e.target.value)} placeholder="1200"/></div>
      <div style={s.field()}><label style={s.label}>Lodging ($)</label><input type="number" style={s.input()} value={lodgingBudget} onChange={e=>setLodgingBudget(e.target.value)} placeholder="800"/></div>
    </div>
    <div style={s.field()}><label style={s.label}>Misc ($)</label><input type="number" style={s.input()} value={miscBudget} onChange={e=>setMiscBudget(e.target.value)} placeholder="300"/></div>
    <div style={{background:'rgba(0,184,148,0.08)',border:'1px solid rgba(0,184,148,0.2)',borderRadius:12,padding:'12px 14px',marginBottom:16}}>
      <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,marginBottom:8}}>[chart] Tour P&L</div>
      <div style={s.grid2}>{[['Gross',formatCurrency(totalGuarantee),C.green],['Expenses',formatCurrency(totalExpenses),C.red],['Net Est.',formatCurrency(netEst),netEst>=0?C.green:C.red],['Shows',dates.length,C.yellow]].map(([l,v,color])=><div key={l}><div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:2}}>{l}</div><div style={{fontSize:14,fontFamily:font.head,fontWeight:800,color}}>{v}</div></div>)}</div>
    </div>
    <div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:10}}>[date] Show Dates</div>
    {dates.map(d=><div key={d.id} style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:12,padding:12,marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:12,fontFamily:font.head,fontWeight:700}}>{d.venue||'New Show'}</span><button onClick={()=>removeDate(d.id)} style={{background:'none',border:'none',color:C.red,cursor:'pointer',fontSize:14}}>x</button></div>
      <div style={s.grid2}>
        <div style={{marginBottom:8}}><label style={s.label}>Venue</label><input style={s.input(11)} value={d.venue} onChange={e=>updDate(d.id,{venue:e.target.value})} placeholder="Comedy Store"/></div>
        <div style={{marginBottom:8}}><label style={s.label}>Date</label><input type="date" style={s.input(11)} value={d.date} onChange={e=>updDate(d.id,{date:e.target.value})}/></div>
      </div>
      <div style={s.grid2}>
        <div style={{marginBottom:8}}><label style={s.label}>City, State</label><input style={s.input(11)} value={`${d.city}${d.state?', '+d.state:''}`} onChange={e=>{const parts=e.target.value.split(',');updDate(d.id,{city:(parts[0]||'').trim(),state:(parts[1]||'').trim()});}} placeholder="Los Angeles, CA"/></div>
        <div style={{marginBottom:8}}>
          <label style={s.label}>Deal Type</label>
          <select style={{...s.select,fontSize:11,padding:'8px 10px'}} value={d.dealType||'Flat Guarantee'} onChange={e=>updDate(d.id,{dealType:e.target.value})}>
            <option>Flat Guarantee</option>
            <option>Door Deal</option>
            <option>Versus Deal</option>
            <option>Guarantee + Bonus</option>
          </select>
        </div>
      </div>
      {/* Deal-specific fields */}
      {(d.dealType==='Flat Guarantee'||d.dealType==='Guarantee + Bonus'||d.dealType==='Versus Deal'||!d.dealType)&&<div style={{marginBottom:8}}><label style={s.label}>Guarantee ($)</label><input type="number" style={s.input(11)} value={d.guarantee||''} onChange={e=>updDate(d.id,{guarantee:parseFloat(e.target.value)||0})} placeholder="2000"/></div>}
      {d.dealType==='Versus Deal'&&<><div style={{marginBottom:8}}><label style={s.label}>Venue Minimum ($)</label><input type="number" style={s.input(11)} value={d.venueMinimum||''} onChange={e=>updDate(d.id,{venueMinimum:parseFloat(e.target.value)||0})} placeholder="4500 admin fee"/></div><div style={{marginBottom:8}}><label style={s.label}>GBOR % (your share)</label><input type="number" style={s.input(11)} value={d.gborPct||''} onChange={e=>updDate(d.id,{gborPct:parseFloat(e.target.value)||0})} placeholder="85"/></div></>}
      {d.dealType==='Door Deal'&&<><div style={{marginBottom:8}}><label style={s.label}>Door Split (e.g. 70/30 or 80/20)</label><div style={{display:'flex',alignItems:'center',gap:6}}><input type="number" style={{...s.input(11),flex:1}} value={d.doorPctArtist||''} onChange={e=>{const v=parseFloat(e.target.value)||0;updDate(d.id,{doorPctArtist:v,doorPct:v});}} placeholder="70"/><span style={{color:C.muted,fontSize:12}}>/</span><input type="number" style={{...s.input(11),flex:1}} value={d.doorPctVenue||''} onChange={e=>updDate(d.id,{doorPctVenue:parseFloat(e.target.value)||0})} placeholder="30"/></div><div style={{fontSize:10,color:C.muted,marginTop:3}}>{d.doorPctArtist||0}% artist / {d.doorPctVenue||0}% venue</div></div><div style={{marginBottom:8}}><label style={s.label}>Venue Expenses Off Top ($)</label><input type="number" style={s.input(11)} value={d.doorExpenses||''} onChange={e=>updDate(d.id,{doorExpenses:parseFloat(e.target.value)||0})} placeholder="300 (staffing, sound, etc)"/></div></>}
      {d.dealType==='Guarantee + Bonus'&&<div style={{marginBottom:8}}><label style={s.label}>Bonus Threshold / Notes</label><input style={s.input(11)} value={d.bonusNotes||''} onChange={e=>updDate(d.id,{bonusNotes:e.target.value})} placeholder="e.g. +$500 if over 200 tickets"/></div>}
      <div style={{marginBottom:8}}><label style={s.label}>Ticket Price ($)</label><input type="number" style={s.input(11)} value={d.ticketPrice||''} onChange={e=>updDate(d.id,{ticketPrice:parseFloat(e.target.value)||0})} placeholder="25"/></div>
      <div style={{marginBottom:8}}><label style={s.label}>Deal Notes (full terms)</label><input style={s.input(11)} value={d.dealNotes||''} onChange={e=>updDate(d.id,{dealNotes:e.target.value})} placeholder="e.g. 100% door after tax + staffing, Porch Stage 80/20 after $300"/></div>
      <div style={s.grid2}>
        <div style={{marginBottom:0}}><label style={s.label}>Shows</label><input type="number" style={s.input(11)} value={d.showCount||''} onChange={e=>updDate(d.id,{showCount:parseInt(e.target.value)||1})} placeholder="4"/></div>
        <div style={{marginBottom:0}}><label style={s.label}>Status</label><select style={s.select} value={d.status||'Hold'} onChange={e=>updDate(d.id,{status:e.target.value})}>{['Hold','Confirmed','Cancelled'].map(x=><option key={x}>{x}</option>)}</select></div>
      </div>
    </div>)}
    <button onClick={addDate} style={{...s.btn(C.surf2,C.txt,C.bord),width:'100%',marginBottom:16}}>+ Add Show Date</button>
    <div style={s.field()}><label style={s.label}>Tour Notes</label><textarea style={{...s.input(12),resize:'none',minHeight:60}} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Routing notes, contacts..."/></div>
    <div style={s.row}>
      <button onClick={()=>onSave({...tour,id:tour?.id||Date.now().toString(),name,startDate,endDate,travelBudget,lodgingBudget,miscBudget,dates,notes})} style={s.btn(C.acc,'#fff',null)}>Save Tour</button>
      <button onClick={onCancel} style={s.btn(C.surf2,C.txt,C.bord)}>Cancel</button>
    </div>
  </>;
}
