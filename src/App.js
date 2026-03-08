import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// -- SUPABASE CLOUD SYNC --------------------------------------
const BUILD_ID = '2026-03-03-v14';

const PRE_LOADED_VENUES = [
  {id:'pre_001',venue:'The Comedy Store',booker:'Potsy Ponciroli',bookerLast:'',city:'Los Angeles',state:'CA',email:'info@thecomedystore.com',instagram:'thecomedystore',phone:'(323) 650-6268',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:450,notes:'8433 W Sunset Blvd, West Hollywood CA 90069. Main Room/Belly Room/Original Room',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_002',venue:'The Laugh Factory',booker:'Jamie Masada',bookerLast:'',city:'Los Angeles',state:'CA',email:'info@laughfactory.com',instagram:'thelaughfactory',phone:'(323) 656-8860',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'8001 W Sunset Blvd, Los Angeles CA 90046. Sunset Strip',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_003',venue:'The Improv',booker:'',bookerLast:'',city:'Hollywood',state:'CA',email:'info@improv.com',instagram:'improv',phone:'(323) 651-2583',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:250,notes:'8162 Melrose Ave, West Hollywood CA 90046',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_004',venue:'The Ice House',booker:'',bookerLast:'',city:'Pasadena',state:'CA',email:'info@icehousecomedy.com',instagram:'icehousecomedy',phone:'(626) 577-1894',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:200,notes:'24 N Mentor Ave, Pasadena CA 91106. Est 1960 oldest US club',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_005',venue:'Flappers Comedy Club',booker:'',bookerLast:'',city:'Burbank',state:'CA',email:'info@flapperscomedy.com',instagram:'flapperscomedy',phone:'(818) 845-9721',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:900,doorSplit:0,capacity:200,notes:'102 E Magnolia Blvd, Burbank CA 91502',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_006',venue:'Punch Line Comedy Club',booker:'',bookerLast:'',city:'San Francisco',state:'CA',email:'info@punchlinecomedyclub.com',instagram:'punchlinecomedysf',phone:'(415) 397-4337',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'444 Battery St, San Francisco CA 94111',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_007',venue:'Cobbs Comedy Club',booker:'',bookerLast:'',city:'San Francisco',state:'CA',email:'cobbs@cobbscomedyclub.com',instagram:'cobbscomedyclub',phone:'(415) 928-4320',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:400,notes:'915 Columbus Ave, San Francisco CA 94133',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_008',venue:'Punchline Comedy Club',booker:'',bookerLast:'',city:'Sacramento',state:'CA',email:'info@punchlinecomedy.com',instagram:'punchlinecomedysacramento',phone:'(916) 925-5500',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'2100 Arden Way Ste 245, Sacramento CA 95825',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_009',venue:'The Improv',booker:'',bookerLast:'',city:'Irvine',state:'CA',email:'irvine@improv.com',instagram:'improv',phone:'(949) 854-5455',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'71 Fortune Dr, Irvine CA 92618',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_010',venue:'The Improv',booker:'',bookerLast:'',city:'San Jose',state:'CA',email:'sanjose@improv.com',instagram:'improv',phone:'(408) 280-7475',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'62 S 2nd St, San Jose CA 95113',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_011',venue:'The American Comedy Co',booker:'',bookerLast:'',city:'San Diego',state:'CA',email:'info@americancomedyco.com',instagram:'americancomedyco',phone:'(619) 795-3858',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'818 Sixth Ave, San Diego CA 92101',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_012',venue:'Comedy Cellar',booker:'Noam Dworman',bookerLast:'',city:'New York',state:'NY',email:'info@comedycellar.com',instagram:'comedycellar',phone:'(212) 254-3480',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:0,doorSplit:0,capacity:100,notes:'117 MacDougal St, New York NY 10012. Village Underground sister room',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_013',venue:'Gotham Comedy Club',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@gothamcomedyclub.com',instagram:'gothamcomedyclub',phone:'(212) 367-9000',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'208 W 23rd St, New York NY 10011. Chelsea',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_014',venue:'Stand Up NY',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@standupny.com',instagram:'standupny',phone:'(212) 595-0850',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:800,doorSplit:0,capacity:175,notes:'236 W 78th St, New York NY 10024. Upper West Side',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_015',venue:'The Stand NYC',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@thestandnyc.com',instagram:'thestandnyc',phone:'(212) 677-2600',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:200,notes:'116 E 16th St, New York NY 10003. Gramercy',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_016',venue:'Carolines on Broadway',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@carolines.com',instagram:'carolinesonbroadway',phone:'(212) 757-4100',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'1626 Broadway, New York NY 10019. Times Square',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_017',venue:'New York Comedy Club',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@newyorkcomedyclub.com',instagram:'newyorkcomedyclub',phone:'(212) 696-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:700,doorSplit:0,capacity:150,notes:'241 E 24th St, New York NY 10010',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_018',venue:'Zanies Comedy Club',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'chicago@zanies.com',instagram:'zanieschicago',phone:'(312) 337-4027',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:250,notes:'1548 N Wells St, Chicago IL 60610. Old Town',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_019',venue:'Laugh Factory Chicago',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'chicago@laughfactory.com',instagram:'laughfactorychicago',phone:'(312) 595-0800',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'3175 N Broadway, Chicago IL 60657',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_020',venue:'The Improv',booker:'',bookerLast:'',city:'Schaumburg',state:'IL',email:'schaumburg@improv.com',instagram:'improv',phone:'(847) 240-2001',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'5 Woodfield Rd, Schaumburg IL 60173',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_021',venue:'The Second City',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'booking@secondcity.com',instagram:'thesecondcity',phone:'(312) 664-4032',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'1616 N Wells St, Chicago IL 60614. Old Town. Mainstage + e.t.c.',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_022',venue:'Acme Comedy Company',booker:'Louis Lee',bookerLast:'',city:'Minneapolis',state:'MN',email:'acmecomedy@gmail.com',instagram:'acmecomedyco',phone:'(612) 338-6393',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'708 N 1st St, Minneapolis MN 55401. North Loop',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_023',venue:'Helium Comedy Club',booker:'',bookerLast:'',city:'Philadelphia',state:'PA',email:'philly@heliumcomedy.com',instagram:'heliumcomedyphilly',phone:'(215) 496-9001',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'2031 Sansom St, Philadelphia PA 19103',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_024',venue:'The Stress Factory',booker:'Vinnie Brand',bookerLast:'',city:'New Brunswick',state:'NJ',email:'info@stressfactory.com',instagram:'stressfactory',phone:'(732) 545-4242',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'90 Church St, New Brunswick NJ 08901. Vinnie Brand owner',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_025',venue:'Helium Comedy Club',booker:'',bookerLast:'',city:'Portland',state:'OR',email:'portland@heliumcomedy.com',instagram:'heliumcomedyportland',phone:'(503) 477-5833',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'1510 SE 9th Ave, Portland OR 97214',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_026',venue:'Helium Comedy Club',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'stl@heliumcomedy.com',instagram:'heliumcomedystl',phone:'(314) 432-4242',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'1570 S 5th St Suite 205, St. Louis MO 63104',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_027',venue:'The Improv',booker:'',bookerLast:'',city:'Houston',state:'TX',email:'houston@improv.com',instagram:'improv',phone:'(713) 333-8800',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'7620 Katy Fwy #455, Houston TX 77024. City Centre',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_028',venue:'Addison Improv',booker:'',bookerLast:'',city:'Addison',state:'TX',email:'addison@improv.com',instagram:'improv',phone:'(972) 404-8501',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'4980 Belt Line Rd #250, Addison TX 75254',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_029',venue:'Hyenas Comedy Club',booker:'',bookerLast:'',city:'Fort Worth',state:'TX',email:'info@hyenascomedyclub.com',instagram:'hyenascomedyfw',phone:'(817) 877-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'311 E 4th St, Fort Worth TX 76102',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_030',venue:'The Improv',booker:'',bookerLast:'',city:'Orlando',state:'FL',email:'orlando@improv.com',instagram:'improv',phone:'(321) 281-8000',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'129 W Church St, Orlando FL 32801. Pointe Orlando',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_031',venue:'The Improv',booker:'',bookerLast:'',city:'Tampa',state:'FL',email:'tampa@improv.com',instagram:'improv',phone:'(813) 864-4000',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'1600 E 8th Ave Ste B-235, Tampa FL 33605. Ybor City',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_032',venue:'Miami Improv',booker:'',bookerLast:'',city:'Miami',state:'FL',email:'miami@improv.com',instagram:'miamiimprov',phone:'(305) 441-8200',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'3390 Mary St Ste 182, Coconut Grove FL 33133',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_033',venue:'The Punchline',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'info@punchline.com',instagram:'punchlineatlanta',phone:'(404) 252-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1800,doorSplit:0,capacity:350,notes:'280 Hilderbrand Dr NE, Atlanta GA 30328. Sandy Springs',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_034',venue:'Zanies Comedy Club',booker:'',bookerLast:'',city:'Nashville',state:'TN',email:'nashville@zanies.com',instagram:'zasiesnashville',phone:'(615) 269-0221',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:800,doorSplit:0,capacity:200,notes:'2025 8th Ave S, Nashville TN 37204',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_035',venue:'Comedy Works',booker:'',bookerLast:'',city:'Denver',state:'CO',email:'info@comedyworks.com',instagram:'comedyworks',phone:'(303) 595-3637',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'1226 15th St, Denver CO 80202. LoDo',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_036',venue:'Wise Guys Comedy',booker:'',bookerLast:'',city:'Salt Lake City',state:'UT',email:'wiseguys2001@gmail.com',instagram:'wiseguyscomedy',phone:'(801) 596-8600',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'194 S 400 W, Salt Lake City UT 84101. Downtown',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_037',venue:'The DC Improv',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'info@dcimprov.com',instagram:'dcimprov',phone:'(202) 296-7008',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'1140 Connecticut Ave NW, Washington DC 20036',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_038',venue:'Laugh Boston',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'boxoffice@laughboston.com',instagram:'laughboston',phone:'(617) 725-2844',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'425 Summer St, Boston MA 02210. Westin Waterfront Hotel',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_039',venue:'Funny Bone',booker:'',bookerLast:'',city:'Columbus',state:'OH',email:'talentbooking@funnybone.com',instagram:'columbusohfunnybone',phone:'(614) 471-5653',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'145 Easton Town Center, Columbus OH 43219',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_040',venue:'Funny Bone',booker:'',bookerLast:'',city:'Cleveland',state:'OH',email:'talentbooking@funnybone.com',instagram:'clevelandfunnybone',phone:'(216) 241-7425',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'2000 Sycamore St, Cleveland OH 44113. Flats East Bank',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_041',venue:'Hilarities 4th Street Theatre',booker:'',bookerLast:'',city:'Cleveland',state:'OH',email:'info@pickwickandfrolic.com',instagram:'hilaritiescomedy',phone:'(216) 736-4242',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:500,notes:'2035 E 4th St, Cleveland OH 44115. Pickwick & Frolic complex',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_042',venue:'Crackers Comedy Club',booker:'',bookerLast:'',city:'Indianapolis',state:'IN',email:'info@crackerscomedy.com',instagram:'crackerscomedy',phone:'(317) 631-3536',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'207 N Delaware St, Indianapolis IN 46204. Downtown',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_043',venue:'Helium Comedy Club',booker:'',bookerLast:'',city:'Indianapolis',state:'IN',email:'indy@heliumcomedy.com',phone:'(317) 349-4800',instagram:'heliumcomedyindy',phone:'(317) 349-4800',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'1 Virginia Ave #100, Indianapolis IN 46204. Fletcher Place',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_044',venue:'Funny Bone',booker:'',bookerLast:'',city:'Kansas City',state:'MO',email:'talentbooking@funnybone.com',instagram:'kansascityfunnybone',phone:'(816) 842-7777',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'Legends at Village West, Kansas City KS 66111',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_045',venue:'Funny Bone',booker:'',bookerLast:'',city:'Des Moines',state:'IA',email:'talentbooking@funnybone.com',instagram:'desmoinefunnybone',phone:'(515) 270-2100',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'8529 Birchwood Ct, Johnston IA 50131',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_046',venue:'The Comedy Underground',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'info@comedyunderground.com',instagram:'',phone:'(206) 628-0303',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:800,doorSplit:0,capacity:200,notes:'LIKELY CLOSED - verify before contacting. 222 S Main St, Seattle WA',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_047',venue:'The Improv',booker:'',bookerLast:'',city:'Tempe',state:'AZ',email:'tempe@improv.com',instagram:'improv',phone:'(480) 921-9877',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'930 E University Dr, Tempe AZ 85281',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_048',venue:'The Improv',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'vegas@improv.com',instagram:'vegasimprov',phone:'(702) 369-5111',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'3535 Las Vegas Blvd S #TBA, Las Vegas NV 89109. Harrahs',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_049',venue:'Yuk Yuks',booker:'',bookerLast:'',city:'Toronto',state:'ON',email:'toronto@yukyuks.com',instagram:'yukyukscomedy',phone:'(416) 967-6425',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'224 Richmond St W, Toronto ON M5V 1W2',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_050',venue:'Yuk Yuks',booker:'',bookerLast:'',city:'Vancouver',state:'BC',email:'vancouver@yukyuks.com',instagram:'yukyukscomedy',phone:'(604) 696-9857',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'2837 Cambie St, Vancouver BC V5Z 4N6',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_051',venue:'The Comedy Bar',booker:'',bookerLast:'',city:'Toronto',state:'ON',email:'info@comedybar.ca',instagram:'thecomedybar',phone:'(416) 551-6540',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:600,doorSplit:0,capacity:150,notes:'945 Bloor St W, Toronto ON M6H 1L5',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_052',venue:'Arizona State University',booker:'',bookerLast:'',city:'Tempe',state:'AZ',email:'cab@asu.edu',instagram:'asucab',phone:'(480) 965-9011',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'ASU Campus Activities Board. 1151 S Forest Ave, Tempe AZ 85281',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_053',venue:'University of Arizona',booker:'',bookerLast:'',city:'Tucson',state:'AZ',email:'uacab@email.arizona.edu',instagram:'uacab',phone:'(520) 621-2571',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'U of Arizona Campus Activities Board. 1303 E University Blvd, Tucson AZ 85721',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_054',venue:'UCLA',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'reserve@asucla.ucla.edu',instagram:'asucla',phone:'(310) 206-0832',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'ASUCLA Event Services. 308 Westwood Plaza, Los Angeles CA 90024',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_055',venue:'USC',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'studentaffairs@usc.edu',instagram:'uscstudentaffairs',phone:'(213) 740-2772',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'USC Student Affairs. University Park, Los Angeles CA 90089',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_056',venue:'UC Berkeley',booker:'',bookerLast:'',city:'Berkeley',state:'CA',email:'leadcenter@berkeley.edu',instagram:'ucberkeley',phone:'(510) 642-5171',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'UC Berkeley LEAD Center. 432 Bancroft Way, Berkeley CA 94720',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_057',venue:'UC San Diego',booker:'',bookerLast:'',city:'San Diego',state:'CA',email:'as.ucsd.edu',instagram:'asucsd',phone:'(858) 534-4494',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'AS UCSD. 9500 Gilman Dr, La Jolla CA 92093',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_058',venue:'UC Santa Barbara',booker:'',bookerLast:'',city:'Santa Barbara',state:'CA',email:'as@sa.ucsb.edu',instagram:'ucsantabarbara',phone:'(805) 893-2566',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'UCSB AS Program Board. Santa Barbara CA 93106',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_059',venue:'Stanford University',booker:'',bookerLast:'',city:'Stanford',state:'CA',email:'eventservices@stanford.edu',instagram:'stanforduniversity',phone:'(650) 725-5890',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'Stanford Event Services. 485 Jane Stanford Way, Stanford CA 94305',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_060',venue:'San Diego State University',booker:'',bookerLast:'',city:'San Diego',state:'CA',email:'studentlife@sdsu.edu',instagram:'sdsu',phone:'(619) 594-5221',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'SDSU Student Life. 5500 Campanile Dr, San Diego CA 92182',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_061',venue:'Cal Poly SLO',booker:'',bookerLast:'',city:'San Luis Obispo',state:'CA',email:'cab@calpoly.edu',instagram:'calpolyslo',phone:'(805) 756-1000',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'Cal Poly CAB. 1 Grand Ave, San Luis Obispo CA 93407',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_062',venue:'Pepperdine University',booker:'',bookerLast:'',city:'Malibu',state:'CA',email:'studentactivities@pepperdine.edu',instagram:'pepperdineuniversity',phone:'(310) 506-4000',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:500,notes:'Pepperdine SA. 24255 Pacific Coast Hwy, Malibu CA 90263',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_063',venue:'University of Colorado Boulder',booker:'',bookerLast:'',city:'Boulder',state:'CO',email:'ucb@colorado.edu',instagram:'universityofcolorado',phone:'(303) 492-6161',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'CU Boulder Programming Council. 1669 Euclid Ave, Boulder CO 80309',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_064',venue:'Colorado State University',booker:'',bookerLast:'',city:'Fort Collins',state:'CO',email:'lory@colostate.edu',instagram:'coloradostateuniv',phone:'(970) 491-6444',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'CSU Lory Student Center. 1101 Center Ave Mall, Fort Collins CO 80523',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_065',venue:'University of Connecticut',booker:'',bookerLast:'',city:'Storrs',state:'CT',email:'studentactivities@uconn.edu',instagram:'uconnstudents',phone:'(860) 486-4897',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'UConn Student Activities. 2110 Hillside Rd, Storrs CT 06269',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_066',venue:'Yale University',booker:'',bookerLast:'',city:'New Haven',state:'CT',email:'engage@yale.edu',instagram:'yale',phone:'(203) 432-4900',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'Yale Undergrad Org. 55 Whitney Ave, New Haven CT 06510',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_067',venue:'University of Florida',booker:'',bookerLast:'',city:'Gainesville',state:'FL',email:'reitz@union.ufl.edu',instagram:'uflorida',phone:'(352) 392-1671',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'UF Reitz Union. 686 Museum Rd, Gainesville FL 32611',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_068',venue:'Florida State University',booker:'',bookerLast:'',city:'Tallahassee',state:'FL',email:'sll@fsu.edu',instagram:'floridastateuniversity',phone:'(850) 644-3400',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'FSU Student Life. 108 Student Services Bldg, Tallahassee FL 32306',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_069',venue:'University of Miami',booker:'',bookerLast:'',city:'Coral Gables',state:'FL',email:'sau@miami.edu',instagram:'univofmiami',phone:'(305) 284-6399',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'U Miami SAU. 1306 Stanford Dr, Coral Gables FL 33146',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_070',venue:'University of Central Florida',booker:'',bookerLast:'',city:'Orlando',state:'FL',email:'studentinvolvement@ucf.edu',instagram:'ucfknights',phone:'(407) 823-6471',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'UCF Student Involvement. 12800 Pegasus Dr, Orlando FL 32816',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_071',venue:'University of Georgia',booker:'',bookerLast:'',city:'Athens',state:'GA',email:'tusk@uga.edu',instagram:'universityofgeorgia',phone:'(706) 542-3527',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'UGA Union. 312 Tate Student Center, Athens GA 30602',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_072',venue:'Georgia Tech',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'studentcenter@gatech.edu',instagram:'georgiatechu',phone:'(404) 894-2400',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'GT Student Center. 350 Ferst Dr NW, Atlanta GA 30332',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_073',venue:'Emory University',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'deanofstudents@emory.edu',instagram:'emoryuniversity',phone:'(404) 727-6169',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'Emory Student Programming. 201 Dowman Dr, Atlanta GA 30322',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_074',venue:'University of Illinois',booker:'',bookerLast:'',city:'Champaign',state:'IL',email:'illichathletics@illinois.edu',instagram:'illinifightingillini',phone:'(217) 333-3500',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'UIUC Programs. 1401 W Green St, Champaign IL 61820',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_075',venue:'Northwestern University',booker:'',bookerLast:'',city:'Evanston',state:'IL',email:'norris@northwestern.edu',instagram:'northwesternu',phone:'(847) 491-2330',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'Northwestern Norris Center. 1999 Campus Dr, Evanston IL 60208',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_076',venue:'DePaul University',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'studentinvolvement@depaul.edu',instagram:'depauluniversity',phone:'(312) 362-8000',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'DePaul SAO. 1 E Jackson Blvd, Chicago IL 60604',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_077',venue:'Indiana University',booker:'',bookerLast:'',city:'Bloomington',state:'IN',email:'iustudent@indiana.edu',instagram:'iubloomington',phone:'(812) 855-9452',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'IU Student Events. 900 E 7th St, Bloomington IN 47405',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_078',venue:'Purdue University',booker:'',bookerLast:'',city:'West Lafayette',state:'IN',email:'union@purdue.edu',instagram:'purdueuniversity',phone:'(765) 494-9708',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'Purdue Memorial Union. 101 N Grant St, West Lafayette IN 47907',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_079',venue:'University of Iowa',booker:'',bookerLast:'',city:'Iowa City',state:'IA',email:'imunionstudentactivities@uiowa.edu',instagram:'uiowa',phone:'(319) 335-3528',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'UI IMU Student Activities. 125 N Madison St, Iowa City IA 52242',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_080',venue:'Iowa State University',booker:'',bookerLast:'',city:'Ames',state:'IA',email:'program@iastate.edu',instagram:'iowastate',phone:'(515) 294-8681',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'ISU Program Board. 2229 Lincoln Way, Ames IA 50014',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_081',venue:'University of Kansas',booker:'',bookerLast:'',city:'Lawrence',state:'KS',email:'kuactiv@ku.edu',instagram:'universityofkansas',phone:'(785) 864-4451',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'KU Student Union. 1301 Jayhawk Blvd, Lawrence KS 66045',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_082',venue:'University of Kentucky',booker:'',bookerLast:'',city:'Lexington',state:'KY',email:'uksae@uky.edu',instagram:'universityofkentucky',phone:'(859) 257-3168',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'UK Student Activities. 400 Rose St, Lexington KY 40506',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_083',venue:'Louisiana State University',booker:'',bookerLast:'',city:'Baton Rouge',state:'LA',email:'pmac@lsu.edu',instagram:'lsu',phone:'(225) 578-5501',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'LSU Student Union. 225 LSU Student Union, Baton Rouge LA 70803',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_084',venue:'Tulane University',booker:'',bookerLast:'',city:'New Orleans',state:'LA',email:'upc@tulane.edu',instagram:'tulaneuniversity',phone:'(504) 865-5210',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'Tulane UPC. 1 McAlister Dr, New Orleans LA 70118',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_085',venue:'University of Maryland',booker:'',bookerLast:'',city:'College Park',state:'MD',email:'stamp@umd.edu',instagram:'umdterps',phone:'(301) 314-8488',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'UMD Stamp Student Union. 3972 Campus Dr, College Park MD 20742',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_086',venue:'Boston University',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'cab@bu.edu',instagram:'bostonu',phone:'(617) 353-3614',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'BU CAB. 775 Commonwealth Ave, Boston MA 02215',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_087',venue:'Harvard University',booker:'',bookerLast:'',city:'Cambridge',state:'MA',email:'osl@harvard.edu',instagram:'harvard',phone:'(617) 495-1000',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'Harvard OSL. 75 Mt Auburn St, Cambridge MA 02138',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_088',venue:'MIT',booker:'',bookerLast:'',city:'Cambridge',state:'MA',email:'studentactivities@mit.edu',instagram:'mitpics',phone:'(617) 253-4882',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'MIT Student Activities. 84 Massachusetts Ave, Cambridge MA 02139',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_089',venue:'Northeastern University',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'studentactivities@northeastern.edu',instagram:'northeasternuniversity',phone:'(617) 373-2642',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'NEU SA. 360 Huntington Ave, Boston MA 02115',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_090',venue:'UMass Amherst',booker:'',bookerLast:'',city:'Amherst',state:'MA',email:'sga@umass.edu',instagram:'umass',phone:'(413) 545-0000',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'UMass SAO. 225 Whitmore Admin, Amherst MA 01003',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_091',venue:'University of Michigan',booker:'',bookerLast:'',city:'Ann Arbor',state:'MI',email:'mux@umich.edu',instagram:'umich',phone:'(734) 763-4186',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:2000,notes:'Michigan Union. 530 S State St, Ann Arbor MI 48109',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_092',venue:'Michigan State University',booker:'',bookerLast:'',city:'East Lansing',state:'MI',email:'uabevents@uabevents.msu.edu',instagram:'msuspartans',phone:'(517) 355-8286',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'MSU UAB. 305 Auditorium Rd, East Lansing MI 48824',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_093',venue:'University of Minnesota',booker:'',bookerLast:'',city:'Minneapolis',state:'MN',email:'uma@umn.edu',instagram:'umntwincities',phone:'(612) 624-2323',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'U of MN Student Activities. 300 Washington Ave SE, Minneapolis MN 55455',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_094',venue:'University of Missouri',booker:'',bookerLast:'',city:'Columbia',state:'MO',email:'mizzou@missouri.edu',instagram:'mizzou',phone:'(573) 882-7275',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'Mizzou Student Union. Brady Commons, Columbia MO 65211',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_095',venue:'Washington University St Louis',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'stulife@wustl.edu',instagram:'washuinstitches',phone:'(314) 935-5010',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'WashU Student Life. 1 Brookings Dr, St. Louis MO 63130',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_096',venue:'University of Nebraska',booker:'',bookerLast:'',city:'Lincoln',state:'NE',email:'sab@unl.edu',instagram:'universityofnebraska',phone:'(402) 472-2454',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'UNL SAB. 200 N 11th St, Lincoln NE 68588',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_097',venue:'University of Nevada Las Vegas',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'csun@unlv.edu',instagram:'unlv',phone:'(702) 895-3901',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'UNLV CSUN. 4505 S Maryland Pkwy, Las Vegas NV 89154',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_098',venue:'Dartmouth College',booker:'',bookerLast:'',city:'Hanover',state:'NH',email:'student.assembly@dartmouth.edu',instagram:'dartmouth',phone:'(603) 646-1110',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'Dartmouth Student Assembly. 6180 Robinson Hall, Hanover NH 03755',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_099',venue:'Princeton University',booker:'',bookerLast:'',city:'Princeton',state:'NJ',email:'osa@princeton.edu',instagram:'princetonuniversity',phone:'(609) 258-3060',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'Princeton USG. 138 Frist Campus Ctr, Princeton NJ 08544',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_100',venue:'Rutgers University',booker:'',bookerLast:'',city:'New Brunswick',state:'NJ',email:'sac@rutgers.edu',instagram:'rutgersuniversity',phone:'(848) 932-4636',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'Rutgers SAC. 126 College Ave, New Brunswick NJ 08901',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_101',venue:'Cornell University',booker:'',bookerLast:'',city:'Ithaca',state:'NY',email:'campusactivities@cornell.edu',instagram:'cornellu',phone:'(607) 255-4188',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'Cornell Campus Activities. 626 Thurston Ave, Ithaca NY 14853',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_102',venue:'Columbia University',booker:'',bookerLast:'',city:'New York',state:'NY',email:'spectreserv@columbia.edu',instagram:'columbia',phone:'(212) 854-3611',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'Columbia Student Activities. 2920 Broadway, New York NY 10027',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_103',venue:'New York University',booker:'',bookerLast:'',city:'New York',state:'NY',email:'wsa@nyu.edu',instagram:'nyuniversity',phone:'(212) 998-4998',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'NYU WSA. 60 Washington Sq S, New York NY 10012',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_104',venue:'SUNY Buffalo',booker:'',bookerLast:'',city:'Buffalo',state:'NY',email:'uuab@buffalo.edu',instagram:'uofbuffalo',phone:'(716) 645-2055',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'UB UAB. Student Union 400, Buffalo NY 14260',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_105',venue:'Syracuse University',booker:'',bookerLast:'',city:'Syracuse',state:'NY',email:'scb@syr.edu',instagram:'syracuseuniversity',phone:'(315) 443-2718',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'Syracuse SCB. 303 Universal Ctr, Syracuse NY 13244',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_106',venue:'University of North Carolina',booker:'',bookerLast:'',city:'Chapel Hill',state:'NC',email:'unc_cas@unc.edu',instagram:'unc',phone:'(919) 962-1449',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'UNC Student Activities. CB 5210 Daniels Bldg, Chapel Hill NC 27599',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_107',venue:'NC State University',booker:'',bookerLast:'',city:'Raleigh',state:'NC',email:'studentinvolvement@ncsu.edu',instagram:'ncstate',phone:'(919) 515-8920',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'NC State SCI. 2100 Pullen Rd #3151, Raleigh NC 27695',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_108',venue:'Duke University',booker:'',bookerLast:'',city:'Durham',state:'NC',email:'dukestudentactivities@duke.edu',instagram:'dukeuniversity',phone:'(919) 684-4611',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'Duke Student Activities. 2127 Campus Dr, Durham NC 27708',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_109',venue:'Ohio State University',booker:'',bookerLast:'',city:'Columbus',state:'OH',email:'osuactivities@osu.edu',instagram:'theohiostateuniversity',phone:'(614) 292-4818',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:2000,notes:'OSU Student Activities. Ohio Union, 1739 N High St, Columbus OH 43210',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_110',venue:'University of Cincinnati',booker:'',bookerLast:'',city:'Cincinnati',state:'OH',email:'stuactivities@uc.edu',instagram:'uofcincy',phone:'(513) 556-6163',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'UC Student Activities. 655 Steger Center, Cincinnati OH 45221',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_111',venue:'Miami University',booker:'',bookerLast:'',city:'Oxford',state:'OH',email:'upc@miamioh.edu',instagram:'miamiohio',phone:'(513) 529-4161',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'Miami OH Programming. Armstrong Student Center, Oxford OH 45056',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_112',venue:'University of Oklahoma',booker:'',bookerLast:'',city:'Norman',state:'OK',email:'upcou@ou.edu',instagram:'ou_univ',phone:'(405) 325-3241',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'OU UPC. 900 Asp Ave, Norman OK 73019',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_113',venue:'Oklahoma State University',booker:'',bookerLast:'',city:'Stillwater',state:'OK',email:'upc@okstate.edu',instagram:'oklahomastate',phone:'(405) 744-5232',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'OSU UPC. 101 Student Union, Stillwater OK 74078',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_114',venue:'University of Oregon',booker:'',bookerLast:'',city:'Eugene',state:'OR',email:'uoprogramboard@uoregon.edu',instagram:'universityoforegon',phone:'(541) 346-4113',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'UO Program Board. EMU, 1585 E 13th Ave, Eugene OR 97403',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_115',venue:'Oregon State University',booker:'',bookerLast:'',city:'Corvallis',state:'OR',email:'mupc@oregonstate.edu',instagram:'oregonstateuniversity',phone:'(541) 737-6872',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'OSU Memorial Union. 500 SW Jefferson Ave, Corvallis OR 97331',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_116',venue:'Penn State University',booker:'',bookerLast:'',city:'University Park',state:'PA',email:'huc@psu.edu',instagram:'pennstateu',phone:'(814) 865-7517',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:2000,notes:'PSU HUB-Robeson. 255 Elm St, University Park PA 16802',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_117',venue:'University of Pennsylvania',booker:'',bookerLast:'',city:'Philadelphia',state:'PA',email:'sac@upenn.edu',instagram:'uofpenn',phone:'(215) 898-6533',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'Penn SAC. 3910 Irving St, Philadelphia PA 19104',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_118',venue:'Temple University',booker:'',bookerLast:'',city:'Philadelphia',state:'PA',email:'studentactivities@temple.edu',instagram:'templeuniversity',phone:'(215) 204-1678',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'Temple Student Activities. 1755 N 13th St, Philadelphia PA 19122',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_119',venue:'Carnegie Mellon University',booker:'',bookerLast:'',city:'Pittsburgh',state:'PA',email:'studentactivities@cmu.edu',instagram:'carnegiemellon',phone:'(412) 268-8565',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'CMU Activities Board. 5000 Forbes Ave, Pittsburgh PA 15213',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_120',venue:'University of Pittsburgh',booker:'',bookerLast:'',city:'Pittsburgh',state:'PA',email:'studentactivities@pitt.edu',instagram:'universityofpittsburgh',phone:'(412) 648-7826',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'Pitt Student Activities. 4200 5th Ave, Pittsburgh PA 15260',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_121',venue:'University of Tennessee',booker:'',bookerLast:'',city:'Knoxville',state:'TN',email:'volactivities@utk.edu',instagram:'utennesseeknoville',phone:'(865) 974-3138',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'UTK Student Activities. 1502 W Cumberland Ave, Knoxville TN 37916',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_122',venue:'Vanderbilt University',booker:'',bookerLast:'',city:'Nashville',state:'TN',email:'studentorg@vanderbilt.edu',instagram:'vanderbiltuniversity',phone:'(615) 322-7311',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'Vanderbilt VSA. 2301 Vanderbilt Pl, Nashville TN 37235',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_123',venue:'University of Texas Austin',booker:'',bookerLast:'',city:'Austin',state:'TX',email:'texasuniontickets@austin.utexas.edu',instagram:'utaustin',phone:'(512) 475-6636',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:2000,notes:'UT Austin Texas Union. 2247 Guadalupe St, Austin TX 78705',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_124',venue:'Texas A&M University',booker:'',bookerLast:'',city:'College Station',state:'TX',email:'msc@tamu.edu',instagram:'tamu',phone:'(979) 845-4741',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:2000,notes:'TAMU MSC. 275 Joe Routt Blvd, College Station TX 77843',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_125',venue:'University of Houston',booker:'',bookerLast:'',city:'Houston',state:'TX',email:'uhprogrammingboard@uh.edu',instagram:'universityofhouston',phone:'(713) 743-5105',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'UH Program Board. 4800 Calhoun Rd, Houston TX 77004',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_126',venue:'Texas Tech University',booker:'',bookerLast:'',city:'Lubbock',state:'TX',email:'studentactivities@ttu.edu',instagram:'texastechu',phone:'(806) 742-3621',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'TTU SA. 2625 16th St, Lubbock TX 79409',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_127',venue:'Baylor University',booker:'',bookerLast:'',city:'Waco',state:'TX',email:'studentactivities@baylor.edu',instagram:'bayloruniversity',phone:'(254) 710-2000',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'Baylor SUB. 1311 S 5th St, Waco TX 76798',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_128',venue:'SMU',booker:'',bookerLast:'',city:'Dallas',state:'TX',email:'psi@smu.edu',instagram:'smu',phone:'(214) 768-4400',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'SMU Student Foundation. 6425 Boaz Ln, Dallas TX 75205',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_129',venue:'University of Utah',booker:'',bookerLast:'',city:'Salt Lake City',state:'UT',email:'union@sa.utah.edu',instagram:'univofutah',phone:'(801) 581-6888',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'Utah Union. 200 S Central Campus Dr, Salt Lake City UT 84112',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_130',venue:'University of Virginia',booker:'',bookerLast:'',city:'Charlottesville',state:'VA',email:'sab@virginia.edu',instagram:'uva',phone:'(434) 924-7294',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'UVA SAB. 109 Newcomb Hall, Charlottesville VA 22904',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_131',venue:'Virginia Tech',booker:'',bookerLast:'',city:'Blacksburg',state:'VA',email:'cab@vt.edu',instagram:'virginia_tech',phone:'(540) 231-9004',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'VT CAB. 240 Squires Student Center, Blacksburg VA 24061',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_132',venue:'George Mason University',booker:'',bookerLast:'',city:'Fairfax',state:'VA',email:'cub@gmu.edu',instagram:'georgemasonuniversity',phone:'(703) 993-2909',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'GMU CUB. 4400 University Dr, Fairfax VA 22030',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_133',venue:'University of Washington',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'hublive@uw.edu',instagram:'uw',phone:'(206) 543-8740',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'UW HUB Events. 4001 E Stevens Way NE, Seattle WA 98195',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_134',venue:'Washington State University',booker:'',bookerLast:'',city:'Pullman',state:'WA',email:'aswsu@wsu.edu',instagram:'washingtonstate',phone:'(509) 335-9345',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'WSU CUB. 925 NE Campus Blvd, Pullman WA 99164',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_135',venue:'West Virginia University',booker:'',bookerLast:'',city:'Morgantown',state:'WV',email:'activities@wvu.edu',instagram:'wvumountaineers',phone:'(304) 293-2101',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'WVU Programs. 168 Willey St, Morgantown WV 26506',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_136',venue:'University of Wisconsin',booker:'',bookerLast:'',city:'Madison',state:'WI',email:'engage@union.wisc.edu',instagram:'uwmadison',phone:'(608) 265-3000',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'UW Memorial Union. 800 Langdon St, Madison WI 53706',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_137',venue:'Marquette University',booker:'',bookerLast:'',city:'Milwaukee',state:'WI',email:'engaged@marquette.edu',instagram:'marquetteuniversity',phone:'(414) 288-7250',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'Marquette CAB. 1442 W Wisconsin Ave, Milwaukee WI 53233',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_138',venue:'MGM Grand',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@mgmgrand.com',instagram:'mgmgrand',phone:'(702) 891-7777',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1700,notes:'3799 S Las Vegas Blvd, Las Vegas NV 89109. Garden Arena 17k + Grand Garden',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_139',venue:'Caesars Palace',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@caesarspalace.com',instagram:'caesarspalace',phone:'(702) 731-7110',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:10000,doorSplit:0,capacity:4300,notes:'3570 S Las Vegas Blvd, Las Vegas NV 89109. Colosseum 4k + Circus Maximus',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_140',venue:'The Venetian',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@venetianlasvegas.com',instagram:'venetianlasvegas',phone:'(702) 414-1000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1800,notes:'3355 S Las Vegas Blvd, Las Vegas NV 89109. Venetian Theatre 1800',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_141',venue:'Wynn Las Vegas',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@wynnlasvegas.com',instagram:'wynnlasvegas',phone:'(702) 770-7000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1500,notes:'3131 S Las Vegas Blvd, Las Vegas NV 89109. Encore Theater 1500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_142',venue:'Bellagio',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@bellagio.com',instagram:'bellagio',phone:'(702) 693-7111',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1200,notes:'3600 S Las Vegas Blvd, Las Vegas NV 89109. Zarkana theater',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_143',venue:'Harrahs Las Vegas',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'',instagram:'harrahslasvegas',phone:'(702) 369-5000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1000,notes:'3475 S Las Vegas Blvd, Las Vegas NV 89109. Harrahs Theatre. Book via caesarsent@caesars.com',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_144',venue:'Planet Hollywood',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@planethollywoodresort.com',instagram:'phvegas',phone:'(702) 785-5555',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2500,notes:'3667 S Las Vegas Blvd, Las Vegas NV 89109. Zappos Theater 7k',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_145',venue:'Mandalay Bay',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@mandalaybay.com',instagram:'mandalaybay',phone:'(702) 632-7777',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1800,notes:'3950 S Las Vegas Blvd, Las Vegas NV 89119. Michelob Ultra Arena 12k',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_146',venue:'South Point Hotel Casino',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'boxoffice@southpointcasino.com',instagram:'southpointhotelcasino',phone:'(702) 797-8055',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:800,notes:'9777 Las Vegas Blvd S, Las Vegas NV 89183. Showroom 400',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_147',venue:'The Orleans Casino',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@orleanscasino.com',instagram:'orleanscasino',phone:'(702) 365-7111',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:800,notes:'4500 W Tropicana Ave, Las Vegas NV 89103. Orleans Arena + Showroom',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_148',venue:'Green Valley Ranch',booker:'',bookerLast:'',city:'Henderson',state:'NV',email:'entertainment@greenvalleyranch.com',instagram:'greenvalleyranch',phone:'(702) 617-7777',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1400,notes:'2300 Paseo Verde Pkwy, Henderson NV 89052. Terra Luna venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_149',venue:'Grand Sierra Resort',booker:'',bookerLast:'',city:'Reno',state:'NV',email:'entertainment@grandsierraresort.com',instagram:'grandsierraresort',phone:'(775) 789-2000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'2500 E 2nd St, Reno NV 89595. Grand Theatre 1700',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_150',venue:'Atlantis Casino Resort',booker:'',bookerLast:'',city:'Reno',state:'NV',email:'entertainment@atlantiscasino.com',instagram:'atlantiscasinoresort',phone:'(775) 825-4700',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'3800 S Virginia St, Reno NV 89502. Showroom 500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_151',venue:'Mohegan Sun',booker:'',bookerLast:'',city:'Uncasville',state:'CT',email:'concerts@mohegansun.com',instagram:'mohegansun',phone:'(888) 226-7711',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:15000,doorSplit:0,capacity:10000,notes:'1 Mohegan Sun Blvd, Uncasville CT 06382. Arena 10k + Wolf Den + Cabaret',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_152',venue:'Foxwoods Resort Casino',booker:'',bookerLast:'',city:'Mashantucket',state:'CT',email:'entertainment@foxwoods.com',instagram:'foxwoodsresortcasino',phone:'(860) 312-3000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:8000,doorSplit:0,capacity:4000,notes:'350 Trolley Line Blvd, Mashantucket CT 06338. Fox Theater 1400',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_153',venue:'WinStar World Casino',booker:'',bookerLast:'',city:'Thackerville',state:'OK',email:'winstarboxoffice@chickasaw.net',instagram:'winstarworldcasino',phone:'(580) 276-4229',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:10000,doorSplit:0,capacity:3800,notes:'777 Casino Ave, Thackerville OK 73459. WinStar Global Event Center 12k',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_154',venue:'Seminole Hard Rock',booker:'',bookerLast:'',city:'Hollywood',state:'FL',email:'entertainment@seminolehardrockhollywood.com',instagram:'seminolehardrockhollywood',phone:'(954) 327-7625',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:12000,doorSplit:0,capacity:6000,notes:'1 Seminole Way, Hollywood FL 33314. Guitar Hotel venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_155',venue:'Seminole Hard Rock',booker:'',bookerLast:'',city:'Tampa',state:'FL',email:'entertainment@seminolehardrocktampa.com',instagram:'shrtampa',phone:'(813) 627-7625',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'5223 Orient Rd, Tampa FL 33610. Hard Rock Event Center 5500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_156',venue:'Turning Stone Resort',booker:'',bookerLast:'',city:'Verona',state:'NY',email:'entertainment@turningstone.com',instagram:'turningstone',phone:'(315) 361-7711',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2400,notes:'5218 Patrick Rd, Verona NY 13478. Showroom 2100 + Event Center',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_157',venue:'Seneca Niagara Casino',booker:'',bookerLast:'',city:'Niagara Falls',state:'NY',email:'entertainment@senecaniagaracasino.com',instagram:'senecacasinos',phone:'(716) 299-1100',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'310 4th St, Niagara Falls NY 14303. Seneca Events Center 5k',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_158',venue:'Four Winds Casino',booker:'',bookerLast:'',city:'New Buffalo',state:'MI',email:'entertainment@fourwindscasino.com',instagram:'fourwindscasino',phone:'(866) 494-6371',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'11111 Wilson Rd, New Buffalo MI 49117. Silver Creek Event Center 2600',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_159',venue:'Soaring Eagle Casino',booker:'',bookerLast:'',city:'Mt. Pleasant',state:'MI',email:'entertainment@soaringeaglecasino.com',instagram:'soaringeaglecasino',phone:'(888) 732-4537',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2600,notes:'6800 Soaring Eagle Blvd, Mt. Pleasant MI 48858. Soaring Eagle Center 5500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_160',venue:'Potawatomi Hotel Casino',booker:'',bookerLast:'',city:'Milwaukee',state:'WI',email:'entertainment@paysbig.com',instagram:'potawatomihotelcasino',phone:'(414) 645-6888',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:500,notes:'1721 W Canal St, Milwaukee WI 53233. Fire Keepers Casino 1500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_161',venue:'Ameristar Casino',booker:'',bookerLast:'',city:'Kansas City',state:'MO',email:'entertainment@ameristar.com',instagram:'amerstarkc',phone:'(816) 414-7000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'3200 N Ameristar Dr, Kansas City MO 64161. Star Pavilion 2700',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_162',venue:'Hollywood Casino',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'entertainment@hollywoodcasinostlouis.com',instagram:'hollywoodcasino',phone:'(314) 881-4400',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1000,notes:'777 Casino Center Dr, Maryland Heights MO 63043',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_163',venue:'Horseshoe Casino',booker:'',bookerLast:'',city:'Hammond',state:'IN',email:'entertainment@horseshoecasinoindiana.com',instagram:'horseshoehammond',phone:'(219) 473-7000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'777 Casino Center Dr, Hammond IN 46320. Hammond',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_164',venue:'Harrahs Joliet',booker:'',bookerLast:'',city:'Joliet',state:'IL',email:'entertainment@harrahsresorts.com',instagram:'harrahsjoliet',phone:'(815) 740-7800',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'151 N Joliet St, Joliet IL 60432. Augustus Showroom',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_165',venue:'Grand Victoria Casino',booker:'',bookerLast:'',city:'Elgin',state:'IL',email:'entertainment@grandvictoria.com',instagram:'grandvictoriacasino',phone:'(847) 468-7000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1200,notes:'250 S Grove Ave, Elgin IL 60120. Elgin',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_166',venue:'Cherokee Casino',booker:'',bookerLast:'',city:'Catoosa',state:'OK',email:'entertainment@cherokeecasino.com',instagram:'cherokeecasinohotel',phone:'(800) 760-6700',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'777 W Cherokee St, Catoosa OK 74015. Hard Rock Hotel Casino Tulsa (same complex)',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_167',venue:'Choctaw Casino',booker:'',bookerLast:'',city:'Durant',state:'OK',email:'entertainment@choctawcasinos.com',instagram:'choctawcasinoandresort',phone:'(800) 788-2464',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:3000,notes:'4216 S Hwy 69/75, Durant OK 74701. Choctaw Grand Theater 7500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_168',venue:'Sandia Resort Casino',booker:'',bookerLast:'',city:'Albuquerque',state:'NM',email:'entertainment@sandiacasino.com',instagram:'sandiacasino',phone:'(505) 796-7500',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1800,notes:'30 Rainbow Rd NE, Albuquerque NM 87113. Sandia Amphitheater 4500 + Showroom',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_169',venue:'Pechanga Resort Casino',booker:'',bookerLast:'',city:'Temecula',state:'CA',email:'entertainment@pechanga.com',instagram:'pechanga',phone:'(951) 693-1819',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1200,notes:'45000 Pechanga Pkwy, Temecula CA 92592. Pechanga Theater 1200',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_170',venue:'Morongo Casino',booker:'',bookerLast:'',city:'Cabazon',state:'CA',email:'entertainment@morongocasino.com',instagram:'morongocasino',phone:'(951) 849-3080',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'49500 Seminole Dr, Cabazon CA 92230. Morongo Theater 2000',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_171',venue:'Thunder Valley Casino',booker:'',bookerLast:'',city:'Lincoln',state:'CA',email:'entertainment@thundervalleycasino.com',instagram:'thundervalleycasino',phone:'(916) 408-7777',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'1200 Athens Ave, Lincoln CA 95648. Thunder Valley Pavilion 2500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_172',venue:'Cache Creek Casino',booker:'',bookerLast:'',city:'Brooks',state:'CA',email:'entertainment@cachecreek.com',instagram:'cachecreekcasino',phone:'(530) 796-3118',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1800,notes:'14455 CA-16, Brooks CA 95606. Cache Creek Event Center',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_173',venue:'Graton Resort Casino',booker:'',bookerLast:'',city:'Rohnert Park',state:'CA',email:'entertainment@gratonresortcasino.com',instagram:'gratonresortcasino',phone:'(707) 588-7100',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'288 Golf Course Dr W, Rohnert Park CA 94928. Graton Event Center 3800',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_174',venue:'Chumash Casino Resort',booker:'',bookerLast:'',city:'Santa Ynez',state:'CA',email:'entertainment@chumashcasino.com',instagram:'chumashcasino',phone:'(800) 248-6274',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'3400 Highway 246, Santa Ynez CA 93460. Chumash Casino Showroom 1000',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_175',venue:'Viejas Casino',booker:'',bookerLast:'',city:'Alpine',state:'CA',email:'entertainment@viejas.com',instagram:'viejascasino',phone:'(619) 445-5400',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'5000 Willows Rd, Alpine CA 91901. Viejas Entertainment',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_176',venue:'Barona Resort Casino',booker:'',bookerLast:'',city:'Lakeside',state:'CA',email:'entertainment@barona.com',instagram:'baronaresortcasino',phone:'(619) 443-2300',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'1932 Wildcat Canyon Rd, Lakeside CA 92040',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_177',venue:'Sycuan Casino Resort',booker:'',bookerLast:'',city:'El Cajon',state:'CA',email:'entertainment@sycuan.com',instagram:'sycuancasino',phone:'(619) 445-6002',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1000,notes:'5469 Casino Way, El Cajon CA 92019. Sycuan Live',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_178',venue:'Snoqualmie Casino',booker:'',bookerLast:'',city:'Snoqualmie',state:'WA',email:'entertainment@snocasino.com',instagram:'snoqualmiecasino',phone:'(425) 888-1234',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1200,notes:'37500 SE North Bend Way, Snoqualmie WA 98065. Ballroom 1800',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_179',venue:'Tulalip Resort Casino',booker:'',bookerLast:'',city:'Tulalip',state:'WA',email:'events@tulalipresorts.com',instagram:'tulalipresorts',phone:'(360) 651-1111',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'10200 Quil Ceda Blvd, Tulalip WA 98271. Orca Ballroom',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_180',venue:'Ilani Casino',booker:'',bookerLast:'',city:'Ridgefield',state:'WA',email:'entertainment@ilani.com',instagram:'ilanicasino',phone:'(360) 635-9500',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'1 Cowlitz Way, Ridgefield WA 98642. LIVE at ilani 2500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_181',venue:'Northern Quest Casino',booker:'',bookerLast:'',city:'Airway Heights',state:'WA',email:'entertainment@northernquest.com',instagram:'northernquestresort',phone:'(509) 481-6800',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'100 N Hayford Rd, Airway Heights WA 99001. Pavilion 1500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_182',venue:'Spirit Mountain Casino',booker:'',bookerLast:'',city:'Grand Ronde',state:'OR',email:'entertainment@spiritmountain.com',instagram:'spiritmountaincasino',phone:'(800) 760-7977',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:800,notes:'27100 SW Salmon River Hwy, Grand Ronde OR 97347. Spirit Mountain Concert Hall',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_183',venue:'Hard Rock Casino',booker:'',bookerLast:'',city:'Cincinnati',state:'OH',email:'entertainment@hardrockcincinnati.com',instagram:'hardrockcincinnati',phone:'(513) 386-4600',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'1000 Broadway St, Cincinnati OH 45202. Hard Rock Live',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_184',venue:'Hollywood Casino',booker:'',bookerLast:'',city:'Columbus',state:'OH',email:'entertainment@hollywoodcolumbus.com',instagram:'hollywoodcasino',phone:'(614) 308-3333',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'200 Georgesville Rd, Columbus OH 43228',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_185',venue:'MGM Northfield Park',booker:'',bookerLast:'',city:'Northfield',state:'OH',email:'entertainment@mgmnorthfieldpark.com',instagram:'mgmnorthfieldpark',phone:'(330) 908-5000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'10777 Northfield Rd, Northfield OH 44067. MGM Northfield Stage',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_186',venue:'Rivers Casino',booker:'',bookerLast:'',city:'Pittsburgh',state:'PA',email:'entertainment@riverscasinoandresort.com',instagram:'riverscasinopittsburgh',phone:'(412) 231-7777',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1200,notes:'777 Casino Dr, Pittsburgh PA 15212. Live! Entertainment',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_187',venue:'Parx Casino',booker:'',bookerLast:'',city:'Bensalem',state:'PA',email:'events@parxcasino.com',instagram:'parxcasino',phone:'(215) 639-9000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1200,notes:'2999 Street Rd, Bensalem PA 19020. Parx Casino Live',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_188',venue:'Borgata',booker:'',bookerLast:'',city:'Atlantic City',state:'NJ',email:'events@borgata.com',instagram:'borgatac',phone:'(609) 317-1000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2400,notes:'1 Borgata Way, Atlantic City NJ 08401. Event Center 2400 + Music Box 1000',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_189',venue:'Harrahs Atlantic City',booker:'',bookerLast:'',city:'Atlantic City',state:'NJ',email:'acboxoffice@harrahsresorts.com',instagram:'harrahsresorts',phone:'(609) 441-5000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'777 Harrahs Blvd, Atlantic City NJ 08401. Waterfront Theatre 1400',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_190',venue:'Hard Rock Atlantic City',booker:'',bookerLast:'',city:'Atlantic City',state:'NJ',email:'hardrockatlanticcity@hardrock.com',instagram:'hardrockatlanticcity',phone:'(609) 449-1000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:15000,doorSplit:0,capacity:7000,notes:'1000 Boardwalk, Atlantic City NJ 08401. Hard Rock Live AC 1400',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_191',venue:'MGM National Harbor',booker:'',bookerLast:'',city:'Oxon Hill',state:'MD',email:'entertainment@mgmnationalharbor.com',instagram:'mgmnationalharbor',phone:'(844) 346-4664',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:3000,notes:'101 MGM National Ave, Oxon Hill MD 20745. National Harbor Theater 3000',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_192',venue:'Live Casino',booker:'',bookerLast:'',city:'Hanover',state:'MD',email:'entertainment@livecasinohotel.com',instagram:'livecasinohotel',phone:'(443) 445-2020',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'7002 Arundel Mills Cir, Hanover MD 21076. Live! Casino Events',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_193',venue:'Harrahs Cherokee',booker:'',bookerLast:'',city:'Cherokee',state:'NC',email:'entertainment@harrahscherokee.com',instagram:'harrahscherokee',phone:'(828) 497-7777',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:3000,notes:'777 Casino Dr, Cherokee NC 28719. Event Center 3000',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_194',venue:'Beau Rivage',booker:'',bookerLast:'',city:'Biloxi',state:'MS',email:'entertainment@beaurivage.com',instagram:'beaurivageresort',phone:'(228) 386-7111',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1550,notes:'875 Beach Blvd, Biloxi MS 39530. Beau Rivage Theatre 1550',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_195',venue:'Coushatta Casino Resort',booker:'',bookerLast:'',city:'Kinder',state:'LA',email:'entertainment@coushattacasino.com',instagram:'coushattalouisiana',phone:'(800) 584-7263',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'777 Coushatta Dr, Kinder LA 70648. Grand Chenier Theater',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_196',venue:'L Auberge Casino',booker:'',bookerLast:'',city:'Lake Charles',state:'LA',email:'entertainment@lauberge.com',instagram:'laubergecasino',phone:'(337) 395-7777',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'777 Avenue LAuberge, Lake Charles LA 70601. Events Center 1500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_197',venue:'Osage Casino',booker:'',bookerLast:'',city:'Tulsa',state:'OK',email:'entertainment@osagecasinos.com',instagram:'osagecasinos',phone:'(918) 699-7777',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'951 W 36th St N, Tulsa OK 74127. Skyline Event Center',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_198',venue:'Hard Rock Hotel Casino Tulsa',booker:'',bookerLast:'',city:'Tulsa',state:'OK',email:'entertainment@hardrocktulsa.com',instagram:'hardrocktulsa',phone:'(918) 384-7900',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'777 W Cherokee St, Catoosa OK 74015. Joint Hotel Casino',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_199',venue:'Riverwind Casino',booker:'',bookerLast:'',city:'Norman',state:'OK',email:'entertainment@riverwindcasino.com',instagram:'riverwindcasino',phone:'(405) 322-6000',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'1544 State Hwy 9, Norman OK 73071. Showroom + Cooper Event Center',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_200',venue:'Wind Creek Casino',booker:'',bookerLast:'',city:'Atmore',state:'AL',email:'entertainment@windcreekstays.com',instagram:'windcreek',phone:'(866) 946-3360',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:800,notes:'303 Poarch Rd, Atmore AL 36502. Wind Creek Event Center',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_201',venue:'Talking Stick Resort',booker:'',bookerLast:'',city:'Scottsdale',state:'AZ',email:'entertainment@talkingstickresort.com',instagram:'talkingstickresort',phone:'(480) 850-7777',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:650,notes:'9800 E Indian Bend Rd, Scottsdale AZ 85256. Salt River Grand Ballroom',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_202',venue:'Wild Horse Pass',booker:'',bookerLast:'',city:'Chandler',state:'AZ',email:'entertainment@wildhorsepassdevelopment.com',instagram:'wildhorsepas',phone:'(800) 946-4452',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1100,notes:'5594 W Wild Horse Pass Blvd, Chandler AZ 85226. Rawhide Events Center',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_203',venue:'Desert Diamond Casino',booker:'',bookerLast:'',city:'Tucson',state:'AZ',email:'entertainment@desertdiamondcasino.com',instagram:'desertdiamondcasino',phone:'(520) 342-1600',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:800,notes:'7350 S Nogales Hwy, Tucson AZ 85756. Events Center 1500',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_204',venue:'The Wiltern',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'info@livenation.com',instagram:'thewiltern',phone:'(213) 380-5005',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1850,notes:'3790 Wilshire Blvd, Los Angeles CA 90010. 1850 cap. Venue booker via Live Nation SoCal',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_205',venue:'The Greek Theatre',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'info@livenation.com',instagram:'greektheatrela',phone:'(323) 665-5857',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:12000,doorSplit:0,capacity:5900,notes:'2700 N Vermont Ave, Los Angeles CA 90027. 5870 cap. Griffith Park',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_206',venue:'Hollywood Bowl',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'hbowl@laphil.org',instagram:'hollywoodbowl',phone:'(323) 850-2000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:30000,doorSplit:0,capacity:17500,notes:'2301 N Highland Ave, Los Angeles CA 90068. 17500 cap. LA Phil venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_207',venue:'Beacon Theatre',booker:'',bookerLast:'',city:'New York',state:'NY',email:'boxoffice@beacontheatre.com',instagram:'beacontheatre',phone:'(212) 465-6500',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2800,notes:'2124 Broadway, New York NY 10023. 2894 cap. MSG Entertainment',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_208',venue:'Radio City Music Hall',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@radiocitymusichal.com',instagram:'radiocity',phone:'(212) 307-7171',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:15000,doorSplit:0,capacity:6015,notes:'1260 6th Ave, New York NY 10020. 6015 cap. MSG Entertainment',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_209',venue:'Madison Square Garden',booker:'',bookerLast:'',city:'New York',state:'NY',email:'booking@msg.com',instagram:'thegarden',phone:'(212) 465-6741',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:50000,doorSplit:0,capacity:20789,notes:'4 Pennsylvania Plaza, New York NY 10001. 20789 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_210',venue:'Irving Plaza',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@livenation.com',instagram:'irvingplazanyc',phone:'(212) 777-6800',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1000,notes:'17 Irving Pl, New York NY 10003. 1000 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_211',venue:'The Anthem',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'info@theanthemdc.com',instagram:'theanthemdc',phone:'(202) 888-0020',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:12000,doorSplit:0,capacity:6000,notes:'901 Wharf St SW, Washington DC 20024. 6000 cap. I.M.P. venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_212',venue:'9:30 Club',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'info@930.com',instagram:'930club',phone:'(202) 393-0930',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1200,notes:'815 V St NW, Washington DC 20001. 1200 cap. I.M.P. venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_213',venue:'Warner Theatre',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'boxoffice@warnertheatredc.com',instagram:'warnertheatredc',phone:'(202) 783-4000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4500,doorSplit:0,capacity:1847,notes:'513 13th St NW, Washington DC 20004. 1847 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_214',venue:'DAR Constitution Hall',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'darconstitutionhall@nsdar.org',instagram:'constitutionhalldc',phone:'(202) 628-1776',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:9000,doorSplit:0,capacity:3702,notes:'1776 D St NW, Washington DC 20006. 3702 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_215',venue:'The Chicago Theatre',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'events@chicagotheatre.com',instagram:'thechicagotheatre',phone:'(312) 462-6300',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:9000,doorSplit:0,capacity:3600,notes:'175 N State St, Chicago IL 60601. 3600 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_216',venue:'House of Blues Chicago',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'info@houseofblues.com',instagram:'hobchicago',phone:'(312) 923-2000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4500,doorSplit:0,capacity:1800,notes:'329 N Dearborn St, Chicago IL 60654. 1500 cap. Live Nation',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_217',venue:'Riviera Theatre',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'info@livenation.com',instagram:'rivieratheatre',phone:'(773) 275-6800',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'4746 N Racine Ave, Chicago IL 60640. 2500 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_218',venue:'The Ryman Auditorium',booker:'',bookerLast:'',city:'Nashville',state:'TN',email:'boxoffice@ryman.com',instagram:'ryman',phone:'(615) 458-8700',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2362,notes:'116 5th Ave N, Nashville TN 37219. 2362 cap. Mother Church of Country Music',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_219',venue:'Bridgestone Arena',booker:'',bookerLast:'',city:'Nashville',state:'TN',email:'events@bridgestonearena.com',instagram:'bridgestonearena',phone:'(615) 770-2000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:20000,notes:'501 Broadway, Nashville TN 37203. 20000 cap. NHL Predators home',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_220',venue:'Red Rocks Amphitheatre',booker:'',bookerLast:'',city:'Morrison',state:'CO',email:'concessionsmgr@redrocksonline.com',instagram:'redrocksamphitheatre',phone:'(720) 497-8686',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:20000,doorSplit:0,capacity:9525,notes:'18300 W Alameda Pkwy, Morrison CO 80465. 9545 cap. AEG venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_221',venue:'Paramount Theatre',booker:'',bookerLast:'',city:'Denver',state:'CO',email:'boxoffice@paramountdenver.com',instagram:'paramountdenver',phone:'(303) 623-0106',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4500,doorSplit:0,capacity:1850,notes:'1621 Glenarm Pl, Denver CO 80202. 1870 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_222',venue:'Fillmore Auditorium',booker:'',bookerLast:'',city:'Denver',state:'CO',email:'info@fillmoredenver.com',instagram:'fillmoredenver',phone:'(303) 837-0360',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:9000,doorSplit:0,capacity:3900,notes:'1510 N Clarkson St, Denver CO 80218. 3500 cap. Live Nation',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_223',venue:'The Showbox',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'info@showboxpresents.com',instagram:'showboxseattle',phone:'(206) 628-3151',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1100,notes:'1426 1st Ave, Seattle WA 98101. 1100 cap. AEG',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_224',venue:'Paramount Theatre',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'info@stgpresents.com',instagram:'paramountseattle',phone:'(206) 682-1414',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2807,notes:'911 Pine St, Seattle WA 98101. 2807 cap. STG Presents',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_225',venue:'First Avenue',booker:'',bookerLast:'',city:'Minneapolis',state:'MN',email:'boxoffice@first-avenue.com',instagram:'firstavenue',phone:'(612) 332-1775',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1550,notes:'701 1st Ave N, Minneapolis MN 55403. 1550 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_226',venue:'State Theatre',booker:'',bookerLast:'',city:'Minneapolis',state:'MN',email:'info@hennepintheatretrust.org',instagram:'hennepintheatres',phone:'(612) 373-5600',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5500,doorSplit:0,capacity:2181,notes:'805 Hennepin Ave, Minneapolis MN 55402. 1655 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_227',venue:'Fox Theatre',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'info@foxtheatre.org',instagram:'foxtheatreatlanta',phone:'(404) 881-2100',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:12000,doorSplit:0,capacity:4665,notes:'660 Peachtree St NE, Atlanta GA 30308. 4678 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_228',venue:'Tabernacle',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'info@tabernacleatl.com',instagram:'tabernacleatl',phone:'(404) 659-9022',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2600,notes:'152 Luckie St NW, Atlanta GA 30303. 2600 cap. Live Nation',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_229',venue:'Hard Rock Live',booker:'',bookerLast:'',city:'Hollywood',state:'FL',email:'info@houseofblues.com',instagram:'hobhollywood',phone:'(954) 302-4000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:15000,doorSplit:0,capacity:7000,notes:'1 Seminole Way, Hollywood FL 33314. 7000 cap. Hard Rock',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_230',venue:'TD Garden',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'events@tdgarden.com',instagram:'tdgarden',phone:'(617) 624-1000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19580,notes:'100 Legends Way, Boston MA 02114. 19156 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_231',venue:'Wang Theatre',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'boxoffice@wangtheatre.com',instagram:'citicenterboston',phone:'(617) 482-9393',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:9000,doorSplit:0,capacity:3600,notes:'270 Tremont St, Boston MA 02116. 3600 cap. Citi Wang Theatre',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_232',venue:'House of Blues Boston',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'info@houseofblues.com',instagram:'hobboston',phone:'(888) 693-2583',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2400,notes:'15 Lansdowne St, Boston MA 02215. 2400 cap. Fenway',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_233',venue:'The Wellmont Theatre',booker:'',bookerLast:'',city:'Montclair',state:'NJ',email:'boxoffice@wellmonttheatre.com',instagram:'wellmonttheatre',phone:'(973) 783-9500',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'5 Seymour St, Montclair NJ 07042. 2500 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_234',venue:'Massey Hall',booker:'',bookerLast:'',city:'Toronto',state:'ON',email:'info@masseyhall.com',instagram:'masseyhall',phone:'(416) 872-4255',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2765,notes:'178 Victoria St, Toronto ON M5B 1T7. 2765 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_235',venue:'Stifel Theatre',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'boxoffice@stifeltheatre.com',instagram:'stifeltheatre',phone:'(314) 499-7600',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:8000,doorSplit:0,capacity:3200,notes:'1400 Market St, St. Louis MO 63103. 3200 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_236',venue:'The Pageant',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'info@thepageant.com',instagram:'thepageant',phone:'(314) 726-6161',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'6161 Delmar Blvd, St. Louis MO 63112. 2200 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_237',venue:'Saenger Theatre',booker:'',bookerLast:'',city:'New Orleans',state:'LA',email:'boxoffice@saengertheatre.com',instagram:'saengernola',phone:'(504) 525-1052',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2725,notes:'1111 Canal St, New Orleans LA 70112. 2700 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_238',venue:'Orpheum Theatre',booker:'',bookerLast:'',city:'Memphis',state:'TN',email:'boxoffice@orpheum-memphis.com',instagram:'orpheummemphis',phone:'(901) 525-3000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2100,notes:'203 S Main St, Memphis TN 38103. 2800 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_239',venue:'House of Blues Dallas',booker:'',bookerLast:'',city:'Dallas',state:'TX',email:'info@houseofblues.com',instagram:'hobdallas',phone:'(214) 978-2583',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'2200 N Lamar St, Dallas TX 75202. 1750 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_240',venue:'House of Blues Houston',booker:'',bookerLast:'',city:'Houston',state:'TX',email:'info@houseofblues.com',instagram:'hobhouston',phone:'(713) 623-3330',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2750,notes:'1204 Caroline St, Houston TX 77002. 1100 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_241',venue:'Moody Center',booker:'',bookerLast:'',city:'Austin',state:'TX',email:'info@moodycenter.org',instagram:'moodycenteratx',phone:'(512) 471-3333',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:30000,doorSplit:0,capacity:15000,notes:'2001 Robert Dedman Dr, Austin TX 78712. 15000 cap. UT venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_242',venue:'Fillmore Charlotte',booker:'',bookerLast:'',city:'Charlotte',state:'NC',email:'info@fillmorecharlottes.com',instagram:'fillmorecharlotte',phone:'(704) 549-8686',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5500,doorSplit:0,capacity:2200,notes:'1000 NC Music Factory Blvd, Charlotte NC 28206. 2500 cap. Live Nation',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_243',venue:'Stage AE',booker:'',bookerLast:'',city:'Pittsburgh',state:'PA',email:'info@stageae.com',instagram:'stageae',phone:'(412) 642-1062',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2400,notes:'400 N Shore Dr, Pittsburgh PA 15212. 2400 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_244',venue:'Barclays Center',booker:'',bookerLast:'',city:'Brooklyn',state:'NY',email:'bookings@barclayscenter.com',instagram:'barclayscenter',phone:'(917) 618-6100',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:17732,notes:'620 Atlantic Ave, Brooklyn NY 11217. 19000 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_245',venue:'The Fillmore',booker:'',bookerLast:'',city:'San Francisco',state:'CA',email:'info@livenation.com',instagram:'fillmoresf',phone:'(415) 359-9090',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1150,notes:'1805 Geary Blvd, San Francisco CA 94115. 1150 cap. Live Nation',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_246',venue:'The Warfield',booker:'',bookerLast:'',city:'San Francisco',state:'CA',email:'info@livenation.com',instagram:'thewarfieldsf',phone:'(415) 345-0900',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2300,notes:'982 Market St, San Francisco CA 94102. 2300 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_247',venue:'Fox Theater Oakland',booker:'',bookerLast:'',city:'Oakland',state:'CA',email:'info@livenation.com',instagram:'foxoakland',phone:'(510) 302-2250',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2800,notes:'1807 Telegraph Ave, Oakland CA 94612. 2800 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_248',venue:'House of Blues San Diego',booker:'',bookerLast:'',city:'San Diego',state:'CA',email:'info@houseofblues.com',instagram:'hobsandiego',phone:'(619) 299-2583',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1050,notes:'1055 5th Ave, San Diego CA 92101. 1000 cap. Gaslamp',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_249',venue:'House of Blues Las Vegas',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'info@houseofblues.com',instagram:'hobvegas',phone:'(702) 693-5000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4500,doorSplit:0,capacity:1800,notes:'3950 S Las Vegas Blvd, Las Vegas NV 89119. Mandalay Bay 2000 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_250',venue:'House of Blues Orlando',booker:'',bookerLast:'',city:'Orlando',state:'FL',email:'info@houseofblues.com',instagram:'hoborlando',phone:'(407) 934-2583',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2800,notes:'1490 Buena Vista Dr, Lake Buena Vista FL 32830. Disney Springs 2100',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_251',venue:'House of Blues Atlanta',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'info@houseofblues.com',instagram:'hobatlanta',phone:'(404) 249-6361',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1000,notes:'1055 Peachtree St NE, Atlanta GA 30309. 1000 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_252',venue:'House of Blues Los Angeles',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'info@houseofblues.com',instagram:'hobla',phone:'(323) 848-5100',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1300,notes:'8430 W Sunset Blvd, West Hollywood CA 90069. 1000 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_253',venue:'House of Blues New Orleans',booker:'',bookerLast:'',city:'New Orleans',state:'LA',email:'info@houseofblues.com',instagram:'hobnola',phone:'(504) 310-4999',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1000,notes:'225 Decatur St, New Orleans LA 70130. 1000 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_254',venue:'House of Blues Cleveland',booker:'',bookerLast:'',city:'Cleveland',state:'OH',email:'info@houseofblues.com',instagram:'hobcleveland',phone:'(216) 523-2583',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1200,notes:'308 Euclid Ave, Cleveland OH 44114. 1200 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_255',venue:'Arlene Schnitzer Concert Hall',booker:'',bookerLast:'',city:'Portland',state:'OR',email:'schnitzer@pcpa.com',instagram:'pcpa_portland',phone:'(503) 248-4335',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2776,notes:'1037 SW Broadway, Portland OR 97205. 2776 cap. Portland Center Perf Arts',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_256',venue:'Roseland Theater',booker:'',bookerLast:'',city:'Portland',state:'OR',email:'info@roselandpdx.com',instagram:'roselandportland',phone:'(503) 224-2038',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1400,notes:'8 NW 6th Ave, Portland OR 97209. 1400 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_257',venue:'The Fillmore Philadelphia',booker:'',bookerLast:'',city:'Philadelphia',state:'PA',email:'info@livenation.com',instagram:'fillmorephilly',phone:'(215) 309-0150',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'29 E Allen St, Philadelphia PA 19123. 2500 cap. Live Nation',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_258',venue:'Tower Theater',booker:'',bookerLast:'',city:'Upper Darby',state:'PA',email:'boxoffice@towerphilly.com',instagram:'towertheaterupper',phone:'(610) 352-2887',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:8000,doorSplit:0,capacity:3200,notes:'69th & Ludlow, Upper Darby PA 19082. 3000 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_259',venue:'State Farm Arena',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'events@statefarmarena.com',instagram:'statefarmarena',phone:'(404) 878-3000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:45000,doorSplit:0,capacity:21000,notes:'1 State Farm Dr, Atlanta GA 30303. 21000 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_260',venue:'Amway Center',booker:'',bookerLast:'',city:'Orlando',state:'FL',email:'events@amwaycenter.com',instagram:'amwaycenter',phone:'(407) 440-7000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:20000,notes:'400 W Church St, Orlando FL 32801. 20000 cap. NBA Magic',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_261',venue:'Amalie Arena',booker:'',bookerLast:'',city:'Tampa',state:'FL',email:'events@amaliearena.com',instagram:'amaliearena',phone:'(813) 301-6500',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:20500,notes:'401 Channelside Dr, Tampa FL 33602. 21000 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_262',venue:'Kaseya Center',booker:'',bookerLast:'',city:'Miami',state:'FL',email:'events@kaseya.com',instagram:'kaseyacenter',phone:'(786) 777-1000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19600,notes:'601 Biscayne Blvd, Miami FL 33132. 19600 cap. NBA Heat',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_263',venue:'Wells Fargo Center',booker:'',bookerLast:'',city:'Philadelphia',state:'PA',email:'events@wellsfargocenterphilly.com',instagram:'wellsfargocenterphl',phone:'(215) 336-3600',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:45000,doorSplit:0,capacity:21000,notes:'3601 S Broad St, Philadelphia PA 19148. 20000 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_264',venue:'Capital One Arena',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'events@capitalonearena.com',instagram:'capitalonearena',phone:'(202) 628-3200',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:20000,notes:'601 F St NW, Washington DC 20004. 20600 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_265',venue:'United Center',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'events@unitedcenter.com',instagram:'unitedcenter',phone:'(312) 455-4500',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:45000,doorSplit:0,capacity:20491,notes:'1901 W Madison St, Chicago IL 60612. 23500 cap. NBA Bulls',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_266',venue:'Little Caesars Arena',booker:'',bookerLast:'',city:'Detroit',state:'MI',email:'events@313presents.com',instagram:'313presents',phone:'(313) 471-7000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:45000,doorSplit:0,capacity:20000,notes:'2645 Woodward Ave, Detroit MI 48201. 20000 cap. NHL Wings',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_267',venue:'Target Center',booker:'',bookerLast:'',city:'Minneapolis',state:'MN',email:'events@targetcenter.com',instagram:'targetcenter',phone:'(612) 673-0900',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18798,notes:'600 1st Ave N, Minneapolis MN 55403. 19356 cap. NBA TWolves',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_268',venue:'Chase Center',booker:'',bookerLast:'',city:'San Francisco',state:'CA',email:'events@chasecenter.com',instagram:'chasecenter',phone:'(888) 479-4667',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18064,notes:'1 Warriors Way, San Francisco CA 94158. 18064 cap. NBA Warriors',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_269',venue:'Crypto.com Arena',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'events@cryptoarena.com',instagram:'cryptoarena',phone:'(213) 742-7340',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:45000,doorSplit:0,capacity:20000,notes:'1111 S Figueroa St, Los Angeles CA 90015. 20000 cap. NBA Lakers/Clippers',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_270',venue:'Kia Forum',booker:'',bookerLast:'',city:'Inglewood',state:'CA',email:'events@sofistadium.com',instagram:'kiaforum',phone:'(800) 745-3000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:17500,notes:'3900 W Manchester Blvd, Inglewood CA 90305. 17500 cap. AEG',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_271',venue:'Footprint Center',booker:'',bookerLast:'',city:'Phoenix',state:'AZ',email:'events@footprintcenter.com',instagram:'footprintcenter',phone:'(602) 379-7867',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18422,notes:'201 E Jefferson St, Phoenix AZ 85004. 18422 cap. NBA Suns',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_272',venue:'Toyota Center',booker:'',bookerLast:'',city:'Houston',state:'TX',email:'events@toyotacenter.com',instagram:'toyotacenter',phone:'(713) 758-7200',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18300,notes:'1510 Polk St, Houston TX 77002. 19023 cap. NBA Rockets',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_273',venue:'American Airlines Center',booker:'',bookerLast:'',city:'Dallas',state:'TX',email:'events@americanairlinescenter.com',instagram:'aacenter',phone:'(214) 222-3687',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19200,notes:'2500 Victory Ave, Dallas TX 75219. 19200 cap. NBA Mavs/NHL Stars',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_274',venue:'Moda Center',booker:'',bookerLast:'',city:'Portland',state:'OR',email:'events@rosequarter.com',instagram:'modacenter',phone:'(503) 235-8771',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19980,notes:'1 N Center Court St, Portland OR 97227. 19393 cap. NBA Blazers',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_275',venue:'Climate Pledge Arena',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'events@climatepledgearena.com',instagram:'climatepledge',phone:'(206) 217-9000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18100,notes:'334 1st Ave N, Seattle WA 98109. 17100 cap. OVG venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_276',venue:'Ball Arena',booker:'',bookerLast:'',city:'Denver',state:'CO',email:'events@ballarena.com',instagram:'ballarena',phone:'(303) 405-1111',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19199,notes:'1000 Chopper Cir, Denver CO 80204. 20000 cap. NBA Nuggets',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_277',venue:'Vivint Arena',booker:'',bookerLast:'',city:'Salt Lake City',state:'UT',email:'events@deltacenter.com',instagram:'vivintarena',phone:'(801) 325-2000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18000,notes:'301 S Temple, Salt Lake City UT 84101. 18300 cap. NBA Jazz',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_278',venue:'Gainbridge Fieldhouse',booker:'',bookerLast:'',city:'Indianapolis',state:'IN',email:'events@gainfieldhouse.com',instagram:'gainbridgefieldhouse',phone:'(317) 917-2500',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:17923,notes:'125 S Pennsylvania St, Indianapolis IN 46204. 17923 cap. NBA Pacers',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_279',venue:'Fiserv Forum',booker:'',bookerLast:'',city:'Milwaukee',state:'WI',email:'events@fiservforum.com',instagram:'fiservforum',phone:'(414) 227-0511',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:17500,notes:'1111 Vel R Phillips Ave, Milwaukee WI 53203. 17500 cap. NBA Bucks',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_280',venue:'Nationwide Arena',booker:'',bookerLast:'',city:'Columbus',state:'OH',email:'events@nationwidearena.com',instagram:'nationwidearena',phone:'(614) 246-2000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18500,notes:'200 W Nationwide Blvd, Columbus OH 43215. 19500 cap',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_281',venue:'Rocket Mortgage FieldHouse',booker:'',bookerLast:'',city:'Cleveland',state:'OH',email:'events@rocketmortgage.com',instagram:'rocketmortgagefh',phone:'(216) 420-2000',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19432,notes:'1 Center Ice, Cleveland OH 44115. 19432 cap. NBA Cavs',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_282',venue:'Enterprise Center',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'events@enterprisecenter.com',instagram:'enterprisecenter',phone:'(314) 622-5400',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19150,notes:'1401 Clark Ave, St. Louis MO 63103. 19150 cap. NHL Blues',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_283',venue:'Sprint Center',booker:'',bookerLast:'',city:'Kansas City',state:'MO',email:'events@t-mobilecenter.com',instagram:'tmobilecenter',phone:'(816) 949-7100',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19000,notes:'1407 Grand Blvd, Kansas City MO 64106. 19500 cap. T-Mobile Center',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_284',venue:'Xcel Energy Center',booker:'',bookerLast:'',city:'St. Paul',state:'MN',email:'events@xcelenergycenter.com',instagram:'xcelenergycenter',phone:'(651) 222-5600',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18400,notes:'199 Kellogg Blvd W, St. Paul MN 55102. 18568 cap. NHL Wild',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_285',venue:'PNC Arena',booker:'',bookerLast:'',city:'Raleigh',state:'NC',email:'events@lenovo.com',instagram:'pncarena',phone:'(919) 861-2300',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18680,notes:'1400 Edwards Mill Rd, Raleigh NC 27607. 19722 cap. NHL Canes',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_286',venue:'Spectrum Center',booker:'',bookerLast:'',city:'Charlotte',state:'NC',email:'events@spectrumcentercharlotte.com',instagram:'spectrumcenter',phone:'(704) 688-8600',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:20000,notes:'333 E Trade St, Charlotte NC 28202. 19077 cap. NBA Hornets',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_287',venue:'Smoothie King Center',booker:'',bookerLast:'',city:'New Orleans',state:'LA',email:'events@smoothiekingcenter.com',instagram:'smoothiekingcenter',phone:'(504) 587-3663',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18500,notes:'1501 Dave Dixon Dr, New Orleans LA 70113. 17805 cap. NBA Pelicans',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},

  // ── NEW COMEDY CLUBS v8 ──────────────────────────────────────

  // TEXAS
  {id:'pre_288',venue:'Cap City Comedy Club',booker:'',bookerLast:'',city:'Austin',state:'TX',email:'info@capcitycomedy.com',instagram:'capcitycomedy',phone:'(512) 467-2333',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:350,notes:'11506 Century Oaks Terrace Bldg B #100, Austin TX 78758. The Domain. 40yr club',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_289',venue:'The Improv',booker:'',bookerLast:'',city:'Arlington',state:'TX',email:'arlington@improv.com',instagram:'improv',phone:'(817) 635-5555',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'309 Curtis Mathes Way #147, Arlington TX 76018',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_290',venue:'San Antonio Improv',booker:'',bookerLast:'',city:'San Antonio',state:'TX',email:'sanantonio@improv.com',instagram:'improv',phone:'(210) 541-8805',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'618 NW Loop 410, San Antonio TX 78216',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_291',venue:'Comedy Mothership',booker:'',bookerLast:'',city:'Austin',state:'TX',email:'info@comedymothership.com',instagram:'comedymothership',phone:'(512) 831-5900',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:500,notes:'320 E 6th St, Austin TX 78701. Historic Ritz Theater. Joe Rogan venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:25,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},

  // SOUTHEAST / CAROLINA
  {id:'pre_292',venue:'Goodnights Comedy Club',booker:'',bookerLast:'',city:'Raleigh',state:'NC',email:'info@goodnightscomedy.com',instagram:'goodnightscomedy',phone:'(919) 828-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:260,notes:'401 Woodburn Rd, Raleigh NC 27605. Village District',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_293',venue:'The Comedy Zone',booker:'Brian Heffron',bookerLast:'',city:'Charlotte',state:'NC',email:'info@cltcomedyzone.com',instagram:'cltcomedyzone',phone:'(704) 394-9494',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'900 NC Music Factory Blvd B3, Charlotte NC 28206',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_294',venue:'The Punchline',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'info@punchline.com',instagram:'punchlineatlanta',phone:'(404) 252-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'280 Hilderbrand Dr NE, Atlanta GA 30328',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_295',venue:'Funny Bone',booker:'',bookerLast:'',city:'Virginia Beach',state:'VA',email:'talentbooking@funnybone.com',instagram:'vbfunnybone',phone:'(757) 213-5555',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'217 Central Park Ave, Virginia Beach VA 23462',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_296',venue:'Funny Bone',booker:'',bookerLast:'',city:'Richmond',state:'VA',email:'talentbooking@funnybone.com',instagram:'richmondfunnybone',phone:'(804) 521-4242',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'1720 Robin Hood Rd, Richmond VA 23220',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_297',venue:'Funny Bone',booker:'',bookerLast:'',city:'Hartford',state:'CT',email:'talentbooking@funnybone.com',instagram:'hartfordfunnybone',phone:'(860) 969-5300',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'194 Buckland Hills Dr #1270, Manchester CT 06042',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_298',venue:'Magooby\'s Joke House',booker:'',bookerLast:'',city:'Timonium',state:'MD',email:'info@magoobys.com',instagram:'magoobys',phone:'(410) 252-5653',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:350,notes:'4832 Loch Raven Blvd, Timonium MD 21093',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},

  // MIDWEST
  {id:'pre_299',venue:'Mark Ridley\'s Comedy Castle',booker:'Mark Ridley',bookerLast:'',city:'Royal Oak',state:'MI',email:'info@comedycastle.com',instagram:'comedycastlemi',phone:'(248) 542-9900',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:400,notes:'310 S Troy St, Royal Oak MI 48067. Est 1979 favorite club.',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_300',venue:'Dr. Grins Comedy Club',booker:'',bookerLast:'',city:'Grand Rapids',state:'MI',email:'info@grinstix.com',instagram:'drgrinscomedy',phone:'(616) 356-2000',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'20 Monroe Ave NW, Grand Rapids MI 49503. The B.O.B.',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_301',venue:'The Improv',booker:'',bookerLast:'',city:'Milwaukee',state:'WI',email:'milwaukee@improv.com',instagram:'improv',phone:'(414) 271-5653',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'2433 N Mayfair Rd, Wauwatosa WI 53226',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_302',venue:'The Improv',booker:'',bookerLast:'',city:'Pittsburgh',state:'PA',email:'pittsburgh@improv.com',instagram:'improv',phone:'(412) 462-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'166 E Bridge St, Carnegie PA 15106',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_303',venue:'The Improv',booker:'',bookerLast:'',city:'Rosemont',state:'IL',email:'rosemont@improv.com',instagram:'improv',phone:'(847) 675-1410',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'5 Woodfield Rd, Schaumburg IL 60173. Rosemont area',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_304',venue:'Funny Bone',booker:'',bookerLast:'',city:'Omaha',state:'NE',email:'talentbooking@funnybone.com',instagram:'omahafunnybone',phone:'(402) 493-8036',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'17070 Lakeside Hills Plaza, Omaha NE 68130',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_305',venue:'Funny Bone',booker:'',bookerLast:'',city:'Toledo',state:'OH',email:'talentbooking@funnybone.com',instagram:'toledofunnybone',phone:'(419) 535-3900',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'6401 Levis Commons Blvd, Perrysburg OH 43551',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_306',venue:'Funny Bone',booker:'',bookerLast:'',city:'Dayton',state:'OH',email:'talentbooking@funnybone.com',instagram:'daytonfunnybone',phone:'(937) 429-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'88 Plum St, Beavercreek OH 45440',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_307',venue:'Funny Bone',booker:'',bookerLast:'',city:'Cincinnati',state:'OH',email:'talentbooking@funnybone.com',instagram:'cinfunnybone',phone:'(513) 242-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'7518 Bales St, West Chester OH 45069',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_308',venue:'Funny Bone',booker:'',bookerLast:'',city:'Syracuse',state:'NY',email:'talentbooking@funnybone.com',instagram:'syracusefunnybone',phone:'(315) 474-1287',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'Delta Lake Rd, Liverpool NY 13090. Destiny USA area',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_309',venue:'Funny Bone',booker:'',bookerLast:'',city:'Albany',state:'NY',email:'talentbooking@funnybone.com',instagram:'albanyfunnybone',phone:'(518) 449-2233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'1 Crossgates Mall Rd, Albany NY 12203',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_310',venue:'Funny Bone',booker:'',bookerLast:'',city:'Orlando',state:'FL',email:'talentbooking@funnybone.com',instagram:'orlandofunnybone',phone:'(407) 599-4336',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'8445 International Dr #214, Orlando FL 32819',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_311',venue:'Funny Bone',booker:'',bookerLast:'',city:'Tampa',state:'FL',email:'talentbooking@funnybone.com',instagram:'tampafunnybone',phone:'(813) 289-4892',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:300,notes:'4150 Boy Scout Blvd Ste 790, Tampa FL 33607',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},

  // PACIFIC NORTHWEST
  {id:'pre_312',venue:'Emerald City Comedy Club',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'info@emeraldcitycomedy.com',instagram:'emeraldcitycomedy',phone:'(206) 390-9152',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:250,notes:'210 Broadway E, Seattle WA 98102. Capitol Hill active headliner club. Replaced Comedy Underground.',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_313',venue:'Laughs Comedy Club',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'info@laughscomedy.com',instagram:'laughscomedyseattle',phone:'(206) 783-6979',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:200,notes:'5220 Roosevelt Way NE, Seattle WA 98105',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_314',venue:'Harvey\'s Comedy Club',booker:'',bookerLast:'',city:'Portland',state:'OR',email:'info@harveyscomedy.com',instagram:'harveyscomedy',phone:'(503) 241-0338',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:200,notes:'436 NW 6th Ave, Portland OR 97209',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},

  // SOUTHWEST / MOUNTAIN
  {id:'pre_315',venue:'The Improv',booker:'',bookerLast:'',city:'Denver',state:'CO',email:'denver@improv.com',instagram:'improv',phone:'(303) 268-9898',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'8246 W Bowles Ave, Littleton CO 80123. Southwest Denver',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_316',venue:'Comedy Works South',booker:'',bookerLast:'',city:'Greenwood Village',state:'CO',email:'info@comedyworks.com',instagram:'comedyworks',phone:'(303) 858-6090',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:400,notes:'5345 Landmark Pl, Greenwood Village CO 80111. DTC area',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_317',venue:'Wise Guys',booker:'',bookerLast:'',city:'Ogden',state:'UT',email:'wiseguys2001@gmail.com',instagram:'wiseguyscomedy',phone:'(801) 621-5232',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:800,doorSplit:0,capacity:200,notes:'269 25th St, Ogden UT 84401',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_318',venue:'Wise Guys',booker:'',bookerLast:'',city:'West Jordan',state:'UT',email:'wiseguys2001@gmail.com',instagram:'wiseguyscomedy',phone:'(801) 282-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:800,doorSplit:0,capacity:200,notes:'3714 W 9000 S, West Jordan UT 84088',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_319',venue:'The Improv',booker:'',bookerLast:'',city:'Phoenix',state:'AZ',email:'phoenix@improv.com',instagram:'phoeniximprov',phone:'(480) 820-5500',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'930 E University Dr, Tempe AZ 85281. Tempe/Phoenix metro',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},

  // DC / MID-ATLANTIC
  {id:'pre_320',venue:'The Improv',booker:'',bookerLast:'',city:'Raleigh',state:'NC',email:'raleigh@improv.com',instagram:'improv',phone:'(919) 851-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'7416 Six Forks Rd, Raleigh NC 27615. North Hills',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_321',venue:'The Improv',booker:'',bookerLast:'',city:'Fort Lauderdale',state:'FL',email:'ftlauderdale@improv.com',instagram:'improv',phone:'(954) 981-5653',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'5700 N Andrews Way, Fort Lauderdale FL 33309',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_322',venue:'The Improv',booker:'',bookerLast:'',city:'West Palm Beach',state:'FL',email:'westpalm@improv.com',instagram:'improv',phone:'(561) 833-1812',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'550 S Rosemary Ave #250, West Palm Beach FL 33401',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},

  // NEW ENGLAND / NORTHEAST
  {id:'pre_323',venue:'Helium Comedy Club',booker:'',bookerLast:'',city:'Buffalo',state:'NY',email:'buffalo@heliumcomedy.com',instagram:'heliumcomedybuffalo',phone:'(716) 608-0670',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'30 Mississippi St, Buffalo NY 14203. Same Goodnights/Marc Grossman group',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_324',venue:'Helium Comedy Club',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'atlanta@heliumcomedy.com',instagram:'heliumcomedyatlanta',phone:'(404) 554-0299',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'5290 Peachtree Pkwy NW Ste 2A, Peachtree Corners GA 30092',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_325',venue:'The Comedy & Magic Club',booker:'',bookerLast:'',city:'Hermosa Beach',state:'CA',email:'info@comedyandmagicclub.com',instagram:'comedymagicclub',phone:'(310) 372-1193',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:250,notes:'1018 Hermosa Ave, Hermosa Beach CA 90254. Jay Leno home club. Very prestigious. Seinfeld tests material here.',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_326',venue:'Largo at the Coronet',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'info@largo-la.com',instagram:'largoatthecoronet',phone:'(310) 855-0350',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:280,notes:'366 N La Cienega Blvd, Los Angeles CA 90048. Alt comedy prestige',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_327',venue:'The Improv',booker:'',bookerLast:'',city:'Brea',state:'CA',email:'brea@improv.com',instagram:'improv',phone:'(714) 529-7878',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'180 S Brea Blvd, Brea CA 92821. Birch St Promenade',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_328',venue:'The Comedy Store San Diego',booker:'',bookerLast:'',city:'La Jolla',state:'CA',email:'sandiego@thecomedystore.com',instagram:'thecomedystore',phone:'(858) 454-9176',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'916 Pearl St, La Jolla CA 92037. Comedy Store SD sister club',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_329',venue:'Punch Line Comedy Club',booker:'',bookerLast:'',city:'Sacramento',state:'CA',email:'info@punchlinecomedy.com',instagram:'punchlinecomedysacramento',phone:'(916) 925-5500',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'2100 Arden Way #245, Sacramento CA 95825',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_330',venue:'Wiseguys',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'wiseguys2001@gmail.com',instagram:'wiseguysvegas',phone:'(702) 800-0888',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'10900 W Charleston Blvd #175, Las Vegas NV 89135',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_331',venue:'The Laughing Derby',booker:'',bookerLast:'',city:'Louisville',state:'KY',email:'info@thelaughingderby.com',instagram:'laughingderby',phone:'(502) 584-3523',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'1565 Story Ave, Louisville KY 40206',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_332',venue:'The Comedy Catch',booker:'',bookerLast:'',city:'Chattanooga',state:'TN',email:'info@thecomedycatch.com',instagram:'thecomedycatch',phone:'(423) 629-2233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'1400 Market St, Chattanooga TN 37402',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_333',venue:'Improv Comedy Club',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'chicago@improv.com',instagram:'improv',phone:'(847) 596-9900',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'5 Woodfield Rd Ste 2800, Schaumburg IL 60173',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'}
];

const SB_URL = 'https://qqgwxkxbdxjuyxhsuymj.supabase.co';

// SHARED WORKSPACE — all authorized users read/write Jason's data row.
// To add a new user: create their account in Supabase Auth, then add their
// email to AUTHORIZED_USERS below. Data always lives under OWNER_EMAIL.
const OWNER_EMAIL = 'jschucomedy@gmail.com';
const AUTHORIZED_USERS = [
  'jschucomedy@gmail.com', // Jason — owner
  // 'pej@hisemail.com',   // Pej Ahmadi — replace with his real email and uncomment
];
// AI calls are routed through /.netlify/functions/generate-email (server-side).
// No Anthropic key in the client. No FUNCTION_SECRET.
// Auth uses Supabase Auth JWTs — access_token sent as Authorization: Bearer header.
const SB_KEY = process.env.REACT_APP_SB_KEY || 'sb_publishable_SoEfhh5CMIBOHc4oGyMCpg_4oqZmyET';
// Supabase Auth client — signIn/signOut/getSession only. Data sync uses REST below.
const sbAuthClient = createSupabaseClient(SB_URL, SB_KEY);

// Supabase Auth client — used ONLY for signIn/signOut/getSession.
// Data sync uses the direct REST calls below (unchanged).
// ── SYNC ARCHITECTURE ──────────────────────────────────────────
// Cloud is source of truth. Each payload includes a version timestamp.
// Load: always apply cloud data if it exists.
// Save: upsert with new timestamp.
// Poll: load-only every 5s. Auto-save: user-change-only.
// ─────────────────────────────────────────────────────────────────

async function cloudFetch(email) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return { error: 'Bad email: ' + JSON.stringify(email) };
  }
  try {
    const url = `${SB_URL}/rest/v1/userdata?email=eq.${encodeURIComponent(email)}&select=email,data,updated_at`;
    const r = await fetch(url, {
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const txt = await r.text();
    if (!r.ok) return { error: `Fetch ${r.status}: ${txt}` };
    const rows = JSON.parse(txt);
    return { row: rows?.[0] || null };
  } catch(e) { return { error: e.message }; }
}

async function cloudPush(email, venues, templates, tours, comedians) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new Error('Bad email: ' + JSON.stringify(email));
  }
  const appState = { venues, templates, tours, comedians };
  const updated_at = new Date().toISOString();
  const writeBody = { email, data: appState, updated_at };
  const body = JSON.stringify(writeBody);
  const r = await fetch(`${SB_URL}/rest/v1/userdata?on_conflict=email`, {
    method: 'POST',
    headers: {
      'apikey': SB_KEY,
      'Authorization': `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates,return=representation'
    },
    body
  });
  const txt = await r.text();
  if (!r.ok) throw new Error(`Push ${r.status}: ${txt}`);
  const rows = JSON.parse(txt);
  return rows?.[0]?.updated_at || updated_at;
}


// -- AUTH (Supabase Auth) ---------------------------------------------
// signIn returns a session with access_token used for JWT-gated functions.
// No hardcoded credentials. No plaintext passwords in source.
async function checkCredentials(email, pw) {
  const { data, error } = await sbAuthClient.auth.signInWithPassword({
    email: email.toLowerCase().trim(),
    password: pw.trim(),
  });
  if (error || !data.session) return null;
  return data.session; // { access_token, user: { email } }
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
    address: v.address||'',
    zip: v.zip||'',
    showDate: v.showDate||'',
    lastResponse: v.lastResponse||'',
    lastResponseDate: v.lastResponseDate||'',
    merchSales: v.merchSales||[],
    dealClosedBy: v.dealClosedBy||'',
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
    id:'tmpl_jason_phil_standard',
    name:'Comedy Club – Touch 1 (Standard)',
    subject:'Phil Medina - [DATES] - [VENUE]',
    tone:'professional',
    touchNumber:1,
    venueTypes:['Comedy Club','Prestige Club','Bar/Lounge'],
    body:`Hi [BOOKER_FIRST]!

My name is Jason Schuster, and I'm reaching out regarding [DATES] availability with nationally touring headliner Phil Medina. We'd love to perform at [VENUE].

We will be traveling through your region and currently have availability between [DATES].

About Phil Medina
Phil Medina is a powerhouse headlining comedian who has performed at top clubs including the Laugh Factory, Hollywood Improv, and the Ice House. Known for his electric stage presence, Phil has headlined across the country, entertained U.S. troops, and was featured at the Netflix Is A Joke Festival in Los Angeles. He is also featured on Hulu's West Coast Comedy and Not Your Average Comedy, and continues to build strong national momentum with polished, high-energy performances that connect with wide audiences.

Phil Medina Instagram: [HEADLINER_IG]

About Jason Schuster
Jason Schuster is a bi-coastal touring comedian recognized for his sharp wit, dynamic stage presence, and spot-on impressions. He regularly performs across the country and has appeared at renowned venues including The Comedy Store, Jimmy Kimmel's Comedy Club, and Mic Drop Comedy. Jason is also a regular on social media, where his sketches and impressions reach a wide audience, and he has been featured on Kenan Presents. He performs alongside some of the biggest names in comedy and consistently delivers engaging, high-energy sets.

Jason Schuster Instagram: [MY_IG]

Please let me know if you have availability between [DATES]. I would love to connect and see if we can make something happen while routing through.

Thank you for your time, and I hope we can connect!

Best,
[MY_NAME]
jschucomedy@gmail.com`,
  },
  {
    id:'tmpl_casino',
    name:'Casino – Touch 1',
    subject:'Phil Medina - [DATES] - [VENUE] (Casino)',
    tone:'professional',
    touchNumber:1,
    venueTypes:['Casino'],
    body:`Hi [BOOKER_FIRST]!

My name is Jason Schuster, and I'm reaching out regarding [DATES] availability with nationally touring headliner Phil Medina. We'd love to bring a high-energy comedy night to [VENUE] in [CITY], [STATE].

We will be traveling through your region and currently have availability between [DATES].

About Phil Medina
Phil Medina is a powerhouse headlining comedian who has performed at top clubs including the Laugh Factory, Hollywood Improv, and the Ice House. Known for his electric stage presence, Phil has headlined across the country, entertained U.S. troops, and was featured at the Netflix Is A Joke Festival in Los Angeles. He is also featured on Hulu's West Coast Comedy and Not Your Average Comedy, and continues to build strong national momentum with polished, high-energy performances that connect with wide audiences.

Phil Medina Instagram: [HEADLINER_IG]

About Jason Schuster
Jason Schuster is a bi-coastal touring comedian recognized for his sharp wit, dynamic stage presence, and spot-on impressions. He regularly performs across the country and has appeared at renowned venues including The Comedy Store, Jimmy Kimmel's Comedy Club, and Mic Drop Comedy.

Jason Schuster Instagram: [MY_IG]

If you have availability between [DATES], I'd love to connect and discuss options (guarantee, door deal, or a structure that makes sense for your room).

Thank you for your time!

Best,
[MY_NAME]
jschucomedy@gmail.com`,
  },
  {
    id:'tmpl_college',
    name:'College/University – Touch 1',
    subject:'Phil Medina + Jason Schuster - [DATES] - [VENUE] Comedy Event',
    tone:'professional',
    touchNumber:1,
    venueTypes:['College'],
    body:`Hi [BOOKER_FIRST]!

My name is Jason Schuster, and I'm reaching out regarding [DATES] availability for a comedy event featuring nationally touring headliner Phil Medina (with me as the feature). We'd love to explore performing at [VENUE] / [CITY], [STATE] if you're booking student programming or campus events.

We'll be traveling through your region and currently have availability between [DATES].

Phil Medina Instagram: [HEADLINER_IG]
Jason Schuster Instagram: [MY_IG]

If you're booking for those dates, I'd love to connect and see what format works best (stand-up show, student event, fundraiser, etc.).

Thank you!
Best,
[MY_NAME]
jschucomedy@gmail.com`,
  },
  {
    id:'tmpl_followup_1',
    name:'Follow-Up – Touch 2 (Short/Friendly)',
    subject:'Quick follow-up - Phil Medina - [DATES]',
    tone:'friendly',
    touchNumber:2,
    venueTypes:['all'],
    body:`Hi [BOOKER_FIRST]!

Just following up on my note about bringing Phil Medina to [VENUE] while we're routing through the area.

Do you have any availability between [DATES]?

Thanks so much,
[MY_NAME]
jschucomedy@gmail.com`,
  },
  {
    id:'tmpl_followup_2',
    name:'Follow-Up – Touch 3 (Professional/Firmer)',
    subject:'Checking in - Phil Medina - [DATES] at [VENUE]',
    tone:'professional',
    touchNumber:3,
    venueTypes:['all'],
    body:`Hi [BOOKER_FIRST]!

Wanted to circle back one more time regarding [DATES] availability for Phil Medina at [VENUE].

If those dates aren't open, are there any nearby dates that would work better on your end? Happy to adjust routing if there's a good opportunity.

Thank you,
[MY_NAME]
jschucomedy@gmail.com`,
  },
  {
    id:'tmpl_followup_3',
    name:'Follow-Up – Touch 4 (Final)',
    subject:'Final check - Phil Medina - [DATES]',
    tone:'short',
    touchNumber:4,
    venueTypes:['all'],
    body:`Hi [BOOKER_FIRST]!

Last quick check-in on [DATES] for [VENUE]. If it's a "not this run," no worries at all — I'd still love to stay on your radar for future dates.

Thanks again,
[MY_NAME]
jschucomedy@gmail.com`,
  },
  {
    id:'tmpl_jason_solo',
    name:'Jason Solo – Cold Outreach',
    subject:'Jason Schuster – Touring Comedian – [VENUE] Availability',
    tone:'professional',
    touchNumber:1,
    venueTypes:['Comedy Club','Bar/Lounge'],
    body:`Hi [BOOKER_FIRST]!

My name is Jason Schuster – I'm a bi-coastal touring comedian reaching out about availability at [VENUE] for [DATES].

I'm known for sharp wit, strong stage presence, and spot-on impressions. I've performed at The Comedy Store, Jimmy Kimmel's Comedy Club, and Mic Drop Comedy, and have been featured on Kenan Presents.

Jason Schuster Instagram: [MY_IG]

I'd love to connect and see if we can make something work for [DATES].

Thanks so much!

Best,
Jason Schuster
jschucomedy@gmail.com`,
  },
  {
    id:'tmpl_existing',
    name:'Existing Relationship – New Dates',
    subject:'Back at [VENUE] – Phil Medina – [DATES]',
    tone:'friendly',
    touchNumber:1,
    venueTypes:['all'],
    body:`Hey [BOOKER_FIRST]!

Hope you've been well! It's Jason – always love working with [VENUE].

Reaching out because we're routing through your area [DATES] and would love to bring Phil Medina back. Last time was a great show and the crowd loved it.

Let me know if those dates work or if there's a better window. Always a pleasure!

Best,
Jason Schuster
jschucomedy@gmail.com`,
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
  bg:'#050508',surf:'#0c0c14',surf2:'#111119',surf3:'#181824',
  bord:'#1c1c2e',bord2:'#252538',
  acc:'#7c3aed',acc2:'#a78bfa',acc3:'#c4b5fd',
  green:'#10b981',greenDim:'#064e3b',
  yellow:'#f59e0b',yellowDim:'#451a03',
  red:'#ef4444',redDim:'#450a0a',
  blue:'#3b82f6',blueDim:'#1e3a5f',
  orange:'#f97316',pink:'#ec4899',
  txt:'#f1f0ff',muted:'#4c4c6d',muted2:'#6d6d90',muted3:'#9090b0',
  card:'rgba(255,255,255,0.03)',cardHover:'rgba(255,255,255,0.05)',
};
const font = { head:"'Syne', sans-serif", body:"'DM Mono', monospace" };
const s = {
  app:{fontFamily:font.body,background:C.bg,minHeight:'100vh',color:C.txt,width:'100%',position:'relative'},
  header:{background:'rgba(5,5,8,0.85)',backdropFilter:'blur(20px)',borderBottom:`1px solid ${C.bord}`,padding:'14px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:40},
  card:(active)=>({background:active?`rgba(124,58,237,0.08)`:C.card,border:`1px solid ${active?'rgba(124,58,237,0.3)':C.bord}`,borderRadius:14,padding:'14px 16px',marginBottom:10,cursor:'pointer',transition:'all 0.18s ease',backdropFilter:'blur(4px)'}),
  input:()=>({background:C.surf2,border:`1px solid ${C.bord2}`,borderRadius:10,padding:'13px 14px',color:C.txt,fontSize:16,width:'100%',outline:'none',fontFamily:'inherit',transition:'border-color 0.15s',WebkitAppearance:'none',appearance:'none'}),
  btn:(bg,color,border)=>({background:bg||C.surf2,color:color||C.txt,border:`1px solid ${border||C.bord2}`,borderRadius:10,padding:'11px 16px',cursor:'pointer',minHeight:46,WebkitTapHighlightColor:'transparent',fontSize:12,fontWeight:600,fontFamily:font.head,display:'flex',alignItems:'center',justifyContent:'center',gap:6,transition:'all 0.15s ease',whiteSpace:'nowrap',letterSpacing:'0.01em',userSelect:'none'}),
  pill:(active,color)=>({background:active?`${color||C.acc}22`:'transparent',color:active?(color||C.acc2):C.muted,border:`1px solid ${active?(color||C.acc)+'44':'transparent'}`,borderRadius:99,padding:'5px 14px',fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.15s',letterSpacing:'0.04em',textTransform:'uppercase'}),
  label:{fontSize:10,color:C.muted2,textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:700,marginBottom:6,display:'block'},
  section:{marginBottom:28},
  divider:{height:1,background:C.bord,margin:'20px 0'},
  badge:(color)=>({background:`${color}18`,color:color,border:`1px solid ${color}30`,borderRadius:6,padding:'2px 8px',fontSize:10,fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase',display:'inline-flex',alignItems:'center'}),
  stat:(color)=>({background:`${color||C.acc}08`,border:`1px solid ${color||C.acc}20`,borderRadius:12,padding:'14px 16px',flex:1}),
  row:{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'},
  field:(mb)=>({marginBottom:mb||12}),
  grid2:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',gap:10},
  overlay:(open)=>({position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',zIndex:100,opacity:open?1:0,pointerEvents:open?'auto':'none',transition:'opacity 0.2s'}),
  panel:(open)=>({position:'fixed',top:0,right:0,height:'100%',width:'min(480px,100vw)',maxWidth:'100vw',WebkitOverflowScrolling:'touch',overscrollBehavior:'contain',background:C.surf,borderLeft:`1px solid ${C.bord2}`,zIndex:101,overflowY:'auto',padding:'20px 16px 100px',transform:open?'translateX(0)':'translateX(100%)',transition:'transform 0.28s cubic-bezier(0.4,0,0.2,1)'}),
  handle:{width:4,height:32,background:C.bord2,borderRadius:2,margin:'0 auto 16px'},
  header:{background:C.surf,borderBottom:`1px solid ${C.bord}`,padding:'12px 16px',position:'sticky',top:0,zIndex:40},
  content:{flex:1,overflowY:'auto'},
  modal:{position:'fixed',inset:0,background:'rgba(0,0,0,0.75)',backdropFilter:'blur(8px)',zIndex:200,display:'flex',alignItems:'center',justifyContent:'center',padding:16},
  modalBox:{background:C.surf,border:`1px solid ${C.bord2}`,borderRadius:18,padding:28,width:'100%',maxWidth:560,maxHeight:'90vh',overflowY:'auto'},
  divider:{height:1,background:C.bord,margin:'16px 0'},
  sectionTitle:{fontSize:10,color:C.muted2,textTransform:'uppercase',letterSpacing:'0.1em',fontWeight:700,marginBottom:8,marginTop:16},
  select:{background:C.surf2,border:`1px solid ${C.bord2}`,borderRadius:10,padding:'12px 14px',color:C.txt,fontSize:16,width:'100%',outline:'none',fontFamily:'inherit'},
  nav:{display:'flex',justifyContent:'space-around',overflowX:'auto',WebkitOverflowScrolling:'touch',scrollbarWidth:'none',alignItems:'center',background:C.surf,borderTop:`1px solid ${C.bord}`,padding:'8px 0',paddingBottom:'max(8px,env(safe-area-inset-bottom))',position:'fixed',bottom:0,left:0,right:0,zIndex:50},
  navBtn:(active)=>({background:'none',border:'none',color:active?C.acc2:C.muted,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'4px 12px',fontFamily:'inherit'}),
};

// -- UTILITIES ------------------------------------------------
function copyText(text,label,toast2){try{navigator.clipboard.writeText(text);}catch{const t=document.createElement('textarea');t.value=text;t.style.cssText='position:fixed;opacity:0';document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);}toast2&&toast2(`${label} copied OK`);}
function formatCurrency(n){if(!n&&n!==0)return' - ';return'$'+Number(n).toLocaleString();}
function daysUntil(d){if(!d)return null;return Math.ceil((new Date(d)-new Date())/(1000*60*60*24));}
function isOverdue(d){const x=daysUntil(d);return x!==null&&x<0;}
function fillTemplate(template,venue,dates=''){
  // Accept either a full template object or a plain string
  const text = typeof template === 'string' ? template : template?.body;
  if(!text) return '';
  const HEADLINER_IG='https://www.instagram.com/comicphilmedina?igsh=eHQ3OXg4Mmw2dnpu';
  const MY_IG='https://www.instagram.com/jschucomedy?igsh=MTg2N3R4dWhkaWc4bw%3D%3D&utm_source=qr';
  return text
    .replace(/\[VENUE\]/g,venue.venue||'your venue')
    .replace(/\[BOOKER_FIRST\]/g,venue.booker||'there')
    .replace(/\[CITY\]/g,venue.city||'')
    .replace(/\[STATE\]/g,venue.state||'')
    .replace(/\[DATES\]/g,dates||'[dates TBD]')
    .replace(/\[MY_NAME\]/g,'Jason Schuster')
    .replace(/\[HEADLINER_NAME\]/g,'Phil Medina')
    .replace(/\[HEADLINER_IG\]/g,HEADLINER_IG)
    .replace(/\[MY_IG\]/g,MY_IG)
    .replace(/\[SCHOOL\/UNIVERSITY\]/g,venue.venue||'your campus');
}

// ── EXPORT / PRINT ENGINE ────────────────────────────────────
// Uses browser print dialog (Save as PDF on desktop, Share on iOS).
// No external library needed. Clean printable HTML injected into a new window.

function printExport(type, data) {
  const { tours, venues, year } = data;
  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 0 });
  const fmtDate = (d) => d ? new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
  const now = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  let title = '';
  let html = '';

  if (type === 'pnl') {
    // ── P&L STATEMENT ──────────────────────────────────────────
    title = `StageBoss P&L — ${year}`;

    // Collect all confirmed/completed venues with guarantee
    const confirmed = venues
      .filter(v => ['Confirmed','Advancing','Completed'].includes(v.status) && (v.guarantee > 0 || v.paid))
      .sort((a, b) => (a.confirmedViaEmailDate || '').localeCompare(b.confirmedViaEmailDate || ''));

    // Collect tour dates too
    const tourShows = [];
    tours.forEach(t => {
      (t.dates || []).filter(d => ['Confirmed','Completed'].includes(d.status) && d.guarantee > 0)
        .forEach(d => tourShows.push({ ...d, tourName: t.name }));
    });

    const totalConfirmed = confirmed.reduce((a, v) => a + Number(v.guarantee || 0), 0);
    const totalPaid = confirmed.filter(v => v.paid).reduce((a, v) => a + Number(v.guarantee || 0), 0);
        const totalMerch = confirmed.reduce((a, v) => a + Number(v.settlement?.merchNet || 0), 0);
    const totalUnpaid = totalConfirmed - totalPaid;
    const totalTour = tourShows.reduce((a, d) => a + Number(d.guarantee || 0), 0);
    const grandTotal = totalConfirmed + totalTour;

    const rows = confirmed.map(v => `
      <tr>
        <td>${fmtDate(v.confirmedViaEmailDate || v.showDate || '')}</td>
        <td><strong>${v.venue}</strong></td>
        <td>${v.city}, ${v.state}</td>
        <td>${v.package || 'Jason + Phil'}</td>
        <td>${v.dealType || v.agreementType || '—'}</td>
        <td class="money">${fmt(v.guarantee)}</td>
        <td class="money" style="color:#00b894">${v.settlement?.merchNet > 0 ? '$'+Number(v.settlement.merchNet).toLocaleString() : '—'}</td>
        <td class="${v.paid ? 'paid' : 'unpaid'}">${v.paid ? '✓ Paid' : 'Pending'}</td>
      </tr>`).join('');

    const tourRows = tourShows.length ? tourShows.map(d => `
      <tr class="tour-row">
        <td>${fmtDate(d.date)}</td>
        <td><strong>${d.venue || 'TBD'}</strong> <span class="tag">${d.tourName}</span></td>
        <td>${d.city || ''}, ${d.state || ''}</td>
        <td>${d.package || 'Jason + Phil'}</td>
        <td>Tour Date</td>
        <td class="money">${fmt(d.guarantee)}</td>
        <td class="${d.paid ? 'paid' : 'unpaid'}">${d.paid ? '✓ Paid' : 'Pending'}</td>
      </tr>`).join('') : '';

    html = `
      <div class="header">
        <div class="logo">StageBoss</div>
        <div>
          <h1>Profit & Loss Statement</h1>
          <div class="subtitle">Jason Schuster / Phil Medina · ${year} · Generated ${now}</div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-label">Total Gross</div>
          <div class="summary-value green">${fmt(grandTotal)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Collected</div>
          <div class="summary-value">${fmt(totalPaid)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Outstanding</div>
          <div class="summary-value orange">${fmt(totalUnpaid)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total Shows</div>
          <div class="summary-value">${confirmed.length + tourShows.length}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Merch Revenue</div>
          <div class="summary-value green">${fmt(totalMerch)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total w/ Merch</div>
          <div class="summary-value green">${fmt(grandTotal + totalMerch)}</div>
        </div>
      </div>

      ${confirmed.length > 0 ? `
      <h2>Confirmed Shows</h2>
      <table>
        <thead>
          <tr><th>Date</th><th>Venue</th><th>Location</th><th>Package</th><th>Deal</th><th>Guarantee</th><th>Merch</th><th>Status</th></tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr><td colspan="5"><strong>Subtotal</strong></td><td class="money"><strong>${fmt(totalConfirmed)}</strong></td><td class="money" style="color:#00b894"><strong>${totalMerch > 0 ? '$'+totalMerch.toLocaleString() : '—'}</strong></td><td></td></tr>
        </tfoot>
      </table>` : '<p class="empty">No confirmed shows yet.</p>'}

      ${tourShows.length > 0 ? `
      <h2>Tour Dates</h2>
      <table>
        <thead>
          <tr><th>Date</th><th>Venue</th><th>Location</th><th>Package</th><th>Type</th><th>Guarantee</th><th>Status</th></tr>
        </thead>
        <tbody>${tourRows}</tbody>
        <tfoot>
          <tr><td colspan="5"><strong>Tour Subtotal</strong></td><td class="money"><strong>${fmt(totalTour)}</strong></td><td></td></tr>
        </tfoot>
      </table>` : ''}

      <div class="grand-total">
        <span>Grand Total</span>
        <span class="green">${fmt(grandTotal)}</span>
      </div>`;

  } else if (type === 'tour') {
    // ── TOUR SCHEDULE ──────────────────────────────────────────
    const tour = data.tour;
    title = `${tour.name} — Tour Schedule`;
    const sortedDates = (tour.dates || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const totalGross = sortedDates.reduce((a, d) => a + Number(d.guarantee || 0), 0);
    const confirmed = sortedDates.filter(d => d.status === 'Confirmed').length;

    const rows = sortedDates.map((d, idx) => `
      <tr class="${d.status === 'Confirmed' ? 'confirmed' : d.status === 'Hold' ? 'hold' : ''}">
        <td class="num">${idx + 1}</td>
        <td>${fmtDate(d.date)}</td>
        <td><strong>${d.venue || 'TBD'}</strong></td>
        <td>${d.city || ''}${d.state ? ', ' + d.state : ''}</td>
        <td><span class="status-badge ${(d.status||'').toLowerCase()}">${d.status || 'Lead'}</span></td>
        <td class="money">${d.guarantee > 0 ? fmt(d.guarantee) : '—'}</td>
        <td>${d.dealType || '—'}</td>
        <td>${d.notes || ''}</td>
      </tr>`).join('');

    html = `
      <div class="header">
        <div class="logo">StageBoss</div>
        <div>
          <h1>${tour.name}</h1>
          <div class="subtitle">Tour Schedule · ${tour.startDate || ''} – ${tour.endDate || ''} · Generated ${now}</div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card"><div class="summary-label">Total Dates</div><div class="summary-value">${sortedDates.length}</div></div>
        <div class="summary-card"><div class="summary-label">Confirmed</div><div class="summary-value green">${confirmed}</div></div>
        <div class="summary-card"><div class="summary-label">Projected Gross</div><div class="summary-value green">${fmt(totalGross)}</div></div>
        <div class="summary-card"><div class="summary-label">Avg Per Show</div><div class="summary-value">${sortedDates.length ? fmt(Math.round(totalGross / sortedDates.length)) : '—'}</div></div>
      </div>

      <table>
        <thead>
          <tr><th>#</th><th>Date</th><th>Venue</th><th>Location</th><th>Status</th><th>Guarantee</th><th>Deal</th><th>Notes</th></tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="5"><strong>Total</strong></td>
            <td class="money"><strong>${fmt(totalGross)}</strong></td>
            <td colspan="2"></td>
          </tr>
        </tfoot>
      </table>`;

  } else if (type === 'forecast') {
    // ── TOUR FORECAST ──────────────────────────────────────────
    const tour = data.tour;
    title = `${tour.name} — Forecast`;
    const sortedDates = (tour.dates || []).slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const byStatus = (s) => sortedDates.filter(d => d.status === s);
    const sumG = (arr) => arr.reduce((a, d) => a + Number(d.guarantee || 0), 0);

    const confirmedShows = byStatus('Confirmed');
    const holdShows = byStatus('Hold');
    const leadShows = [...byStatus('Lead'), ...byStatus('Negotiating'), ...byStatus('Contacted')];

    html = `
      <div class="header">
        <div class="logo">StageBoss</div>
        <div>
          <h1>${tour.name} — Revenue Forecast</h1>
          <div class="subtitle">${tour.startDate || ''} – ${tour.endDate || ''} · Generated ${now}</div>
        </div>
      </div>

      <div class="summary-grid">
        <div class="summary-card"><div class="summary-label">Confirmed Revenue</div><div class="summary-value green">${fmt(sumG(confirmedShows))}</div></div>
        <div class="summary-card"><div class="summary-label">On Hold</div><div class="summary-value orange">${fmt(sumG(holdShows))}</div></div>
        <div class="summary-card"><div class="summary-label">In Pipeline</div><div class="summary-value">${fmt(sumG(leadShows))}</div></div>
        <div class="summary-card"><div class="summary-label">Best Case Total</div><div class="summary-value">${fmt(sumG(sortedDates))}</div></div>
      </div>

      <h2>Confirmed — ${fmt(sumG(confirmedShows))}</h2>
      ${confirmedShows.length ? `<table>
        <thead><tr><th>Date</th><th>Venue</th><th>Location</th><th>Guarantee</th></tr></thead>
        <tbody>${confirmedShows.map(d=>`<tr class="confirmed"><td>${fmtDate(d.date)}</td><td>${d.venue||'TBD'}</td><td>${d.city||''}, ${d.state||''}</td><td class="money">${fmt(d.guarantee)}</td></tr>`).join('')}</tbody>
      </table>` : '<p class="empty">No confirmed shows yet.</p>'}

      <h2>On Hold — ${fmt(sumG(holdShows))}</h2>
      ${holdShows.length ? `<table>
        <thead><tr><th>Date</th><th>Venue</th><th>Location</th><th>Potential</th></tr></thead>
        <tbody>${holdShows.map(d=>`<tr class="hold"><td>${fmtDate(d.date)}</td><td>${d.venue||'TBD'}</td><td>${d.city||''}, ${d.state||''}</td><td class="money">${fmt(d.guarantee)}</td></tr>`).join('')}</tbody>
      </table>` : '<p class="empty">No holds.</p>'}

      <h2>Pipeline — ${fmt(sumG(leadShows))}</h2>
      ${leadShows.length ? `<table>
        <thead><tr><th>Date</th><th>Venue</th><th>Location</th><th>Status</th><th>Potential</th></tr></thead>
        <tbody>${leadShows.map(d=>`<tr><td>${fmtDate(d.date)}</td><td>${d.venue||'TBD'}</td><td>${d.city||''}, ${d.state||''}</td><td>${d.status||'Lead'}</td><td class="money">${fmt(d.guarantee)}</td></tr>`).join('')}</tbody>
      </table>` : '<p class="empty">No pipeline dates.</p>'}`;
  }

  // ── PRINT WINDOW ──────────────────────────────────────────────
  const win = window.open('', '_blank');
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', Arial, sans-serif; font-size: 12px; color: #1a1a2e; background: #fff; padding: 32px; }
    .header { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #7c3aed; }
    .logo { background: linear-gradient(135deg, #7c3aed, #ec4899); color: #fff; font-weight: 900; font-size: 18px; padding: 8px 14px; border-radius: 10px; letter-spacing: -0.5px; flex-shrink: 0; }
    h1 { font-size: 22px; font-weight: 800; color: #1a1a2e; letter-spacing: -0.5px; }
    h2 { font-size: 14px; font-weight: 700; color: #7c3aed; margin: 24px 0 10px; text-transform: uppercase; letter-spacing: 0.05em; }
    .subtitle { font-size: 11px; color: #6b6b90; margin-top: 4px; }
    .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 28px; }
    .summary-card { background: #f8f7ff; border: 1px solid #e8e3ff; border-radius: 10px; padding: 14px; }
    .summary-label { font-size: 10px; color: #6b6b90; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-bottom: 4px; }
    .summary-value { font-size: 20px; font-weight: 800; color: #1a1a2e; }
    .summary-value.green { color: #00b894; }
    .summary-value.orange { color: #e17055; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; }
    th { background: #f0edff; color: #4a4a8a; font-weight: 700; text-align: left; padding: 8px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
    td { padding: 8px 10px; border-bottom: 1px solid #f0eeff; vertical-align: top; }
    tr:hover td { background: #faf9ff; }
    td.money { text-align: right; font-weight: 600; font-variant-numeric: tabular-nums; }
    td.paid { color: #00b894; font-weight: 600; }
    td.unpaid { color: #e17055; }
    td.num { color: #9090b0; width: 30px; }
    tfoot td { border-top: 2px solid #7c3aed; border-bottom: none; padding-top: 10px; font-weight: 700; }
    .grand-total { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #7c3aed, #ec4899); color: #fff; padding: 16px 20px; border-radius: 12px; margin-top: 20px; font-size: 18px; font-weight: 800; }
    .grand-total .green { color: #fff; }
    .tag { background: #e8e3ff; color: #7c3aed; font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 600; margin-left: 6px; }
    .status-badge { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; }
    .status-badge.confirmed { background: #d4f5ea; color: #00b894; }
    .status-badge.hold { background: #fff3e0; color: #f39c12; }
    .status-badge.lead { background: #f0edff; color: #7c3aed; }
    tr.confirmed td { background: #f7fffe; }
    tr.hold td { background: #fffdf5; }
    tr.tour-row td { background: #faf7ff; }
    .empty { color: #9090b0; font-style: italic; margin: 8px 0 20px; }
    .green { color: #00b894; }
    .orange { color: #e17055; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e8e3ff; font-size: 10px; color: #9090b0; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 20px; }
      .no-print { display: none !important; }
      @page { margin: 0.5in; }
    }
  </style>
</head>
<body>
  ${html}
  <div class="footer">
    <span>StageBoss · jschucomedy@gmail.com</span>
    <span>Generated ${now}</span>
  </div>
  <div class="no-print" style="margin-top:32px;text-align:center;">
    <button onclick="window.print()" style="background:linear-gradient(135deg,#7c3aed,#ec4899);color:#fff;border:none;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;">
      🖨️ Save as PDF / Print
    </button>
    <button onclick="window.close()" style="background:#f0edff;color:#7c3aed;border:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;margin-left:12px;font-family:inherit;">
      Close
    </button>
    <p style="margin-top:12px;font-size:11px;color:#9090b0;">On desktop: File → Save as PDF &nbsp;|&nbsp; On iPhone: tap Share → Save to Files</p>
  </div>
</body>
</html>`);
  win.document.close();
  win.focus();
}

// ── GMAIL OPENER ─────────────────────────────────────────────
// On iOS: uses googlegmail:// scheme to open Gmail app directly.
// On desktop: uses https://mail.google.com compose URL.
function openGmail(to, subject, body) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const su = encodeURIComponent(subject);
  const bd = encodeURIComponent(body);
  const toEnc = encodeURIComponent(to);
  if (isMobile) {
    // Try Gmail app first, fall back to web Gmail if not installed
    const appUrl = `googlegmail://co?to=${toEnc}&subject=${su}&body=${bd}`;
    const webUrl = `https://mail.google.com/mail/?view=cm&to=${toEnc}&su=${su}&body=${bd}`;
    // Use a short timeout fallback — if app doesn't open, open web
    const fallback = setTimeout(() => { window.open(webUrl, '_blank'); }, 1000);
    window.location.href = appUrl;
    // Clear fallback if app opened (page will blur)
    window.addEventListener('blur', () => clearTimeout(fallback), { once: true });
  } else {
    const url = `https://mail.google.com/mail/u/0/?authuser=jschucomedy%40gmail.com&view=cm&to=${toEnc}&su=${su}&body=${bd}`;
    window.open(url, '_blank');
  }
}

// ── DEAL CALCULATOR ──────────────────────────────────────────
function calcDeal(d) {
  if(!d) return {};
  const type=d.dealType||'Flat Guarantee',guarantee=parseFloat(d.guarantee)||0,
    doorSplit=parseFloat(d.doorSplit)||50,ticketPrice=parseFloat(d.ticketPrice)||20,
    capacity=parseInt(d.capacity)||0,sellThrough=parseFloat(d.sellThrough)||85,
    agentPct=(parseFloat(d.agentCommission)||10)/100,
    managerPct=(parseFloat(d.managerCommission)||15)/100,
    philPct=(parseFloat(d.philSplit)||50)/100,
    ccFees=0.035,showExpenses=parseFloat(d.showExpenses)||0,
    bonusThreshold=parseFloat(d.bonusThreshold)||0,
    bonusSplit=(parseFloat(d.bonusSplit)||80)/100,
    tierOneGross=parseFloat(d.tierOneGross)||0,
    tierOneSplit=(parseFloat(d.tierOneSplit)||50)/100,
    tierTwoSplit=(parseFloat(d.tierTwoSplit)||80)/100,
    split=doorSplit/100;
  const totalTickets=Math.round(capacity*(sellThrough/100));
  const grossRevenue=totalTickets*ticketPrice;
  const netAfterCC=grossRevenue*(1-ccFees);
  let talentGross=0;
  if(type==='Flat Guarantee') talentGross=guarantee;
  else if(type==='Door Split') talentGross=netAfterCC*split;
  else if(type==='Versus Deal') talentGross=Math.max(guarantee,netAfterCC*split);
  else if(type==='Tiered Split'){
    if(netAfterCC<=tierOneGross) talentGross=netAfterCC*tierOneSplit;
    else talentGross=(tierOneGross*tierOneSplit)+((netAfterCC-tierOneGross)*tierTwoSplit);
    talentGross=Math.max(guarantee,talentGross);
  } else if(type==='Percentage of Gross') talentGross=grossRevenue*split;
  let bonus=0;
  if(bonusThreshold>0&&grossRevenue>bonusThreshold) bonus=(grossRevenue-bonusThreshold)*bonusSplit;
  talentGross+=bonus;
  const agentCut=talentGross*agentPct,managerCut=talentGross*managerPct;
  const afterReps=talentGross-agentCut-managerCut;
  const philCut=afterReps*philPct;
  const jasonNet=afterReps-philCut-showExpenses;
  return {totalTickets,grossRevenue,netAfterCC,talentGross,bonus,agentCut,managerCut,afterReps,philCut,jasonNet,showExpenses};
}
function fmt$(n){return '$'+Math.abs(Math.round(n||0)).toLocaleString();}
function fmtPct(n){return Math.round((n||0))+'%';}
function getSequenceSuggestion(v){
  const touch=(v.contactLog||[]).length+1;
  const isEx=v.relationship==='existing';
  if(touch===1)return isEx?'Use Existing Relationship template':'Use Jason + Phil Standard';
  if(touch===2)return'Use Follow-Up template';
  if(touch>=3)return touch>=4?'Consider Breakup Email':'Use Follow-Up template';
  return'';
}
function buildGoogleCalendarUrl(venue, dateStr=null){
  const showD = dateStr || venue.showDate || '';
  const title = encodeURIComponent(`${venue.venue} — ${venue.package||'Jason & Phil'}`);
  const loc   = encodeURIComponent(`${venue.address?venue.address+', ':''}${venue.city||''}, ${venue.state||''} ${venue.zip||''}`.trim());
  const details = encodeURIComponent(
    `Venue: ${venue.venue}\nBooker: ${(venue.booker||'')+' '+(venue.bookerLast||'')}\nGuarantee: $${venue.guarantee||0}\nDeal: ${venue.dealType||''}\nEmail: ${venue.email||''}\nPhone: ${venue.phone||''}`
  );
  if(!showD) return null;
  try{
    const d = new Date(showD+'T12:00:00');
    if(isNaN(d)) return null;
    const fmt = (dt) => dt.toISOString().replace(/-/g,'').replace(/:/g,'').split('.')[0]+'Z';
    const start = fmt(d);
    const endD = new Date(d); endD.setHours(d.getHours()+2);
    const end = fmt(endD);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${loc}`;
  }catch{return null;}
}

function buildOutlookCalendarUrl(venue, dateStr=null){
  const showD = dateStr || venue.showDate || '';
  if(!showD) return null;
  try{
    const d = new Date(showD+'T12:00:00');
    if(isNaN(d)) return null;
    const endD = new Date(d); endD.setHours(d.getHours()+2);
    const fmt = (dt) => dt.toISOString().replace(/\.\d{3}Z$/,'');
    const title = encodeURIComponent(`${venue.venue} — ${venue.package||'Jason & Phil'}`);
    const loc = encodeURIComponent(`${venue.city||''}, ${venue.state||''}`);
    const body = encodeURIComponent(`Guarantee: $${venue.guarantee||0} | Booker: ${venue.booker||''} | ${venue.email||''}`);
    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${fmt(d)}&enddt=${fmt(endD)}&location=${loc}&body=${body}&path=/calendar/action/compose&rru=addevent`;
  }catch{return null;}
}

function downloadICS(events){
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','CALSCALE:GREGORIAN','PRODID:-//StageBoss//EN'];
  events.forEach(ev=>{
    if(!ev.date) return;
    try{
      const d = new Date(ev.date+'T12:00:00');
      if(isNaN(d)) return;
      const fmt=(dt)=>dt.toISOString().replace(/-/g,'').replace(/:/g,'').split('.')[0]+'Z';
      const endD=new Date(d);endD.setHours(d.getHours()+2);
      lines.push('BEGIN:VEVENT');
      lines.push('DTSTART:'+fmt(d));
      lines.push('DTEND:'+fmt(endD));
      lines.push('SUMMARY:'+ev.venue+(ev.tourName?' ['+ev.tourName+']':''));
      lines.push('LOCATION:'+(ev.city||'')+', '+(ev.state||''));
      lines.push('DESCRIPTION:Guarantee: $'+(ev.guarantee||0)+' | '+(ev.dealType||''));
      lines.push('END:VEVENT');
    }catch{}
  });
  lines.push('END:VCALENDAR');
  const blob=new Blob([lines.join('\r\n')],{type:'text/calendar'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='StageBoss-Shows.ics';a.click();
  URL.revokeObjectURL(url);
}

// -- SUB-COMPONENTS -------------------------------------------
function Toast({msg}){if(!msg)return null;return<div style={{position:'fixed',top:72,left:'50%',transform:'translateX(-50%)',background:C.surf3,border:`1px solid ${C.acc}`,borderRadius:10,padding:'10px 18px',fontSize:12,color:C.txt,zIndex:999,whiteSpace:'nowrap',pointerEvents:'none',fontFamily:font.body}}>{msg}</div>;}
function Panel({open,onClose,title,badge,children}){return<><div onClick={onClose} style={s.overlay(open)}/><div style={s.panel(open)}><div style={{padding:'12px 16px 0',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,background:C.surf,zIndex:10,borderBottom:`1px solid ${C.bord}`,marginBottom:2}}><div style={{flex:1,minWidth:0}}><div style={{fontFamily:font.head,fontWeight:800,fontSize:18,lineHeight:1.2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</div>{badge&&<div style={{marginTop:4}}>{badge}</div>}</div><button onClick={onClose} style={{width:44,height:44,minHeight:44,borderRadius:'50%',background:C.surf2,border:'none',color:C.muted2,fontSize:20,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,WebkitTapHighlightColor:'transparent',marginLeft:8}}>✕</button></div><div style={{padding:'16px 16px',paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 80px)'}}>{children}</div></div></>;}
function StatusPill({status,small}){const color=PIPE_COLORS[status]||C.muted;return<span style={{...s.pill(`${color}18`,color,`${color}40`),fontSize:small?9:10}}>{status}</span>;}
function WarmthDot({warmth}){const color=WARMTH_COLORS[warmth]||C.muted;return<span style={{display:'inline-flex',alignItems:'center',gap:4,fontSize:10,color,fontFamily:font.body}}><span style={{width:6,height:6,borderRadius:'50%',background:color,display:'inline-block'}}/>{warmth}</span>;}
function ToggleGroup({options,value,onChange,color=C.acc}){return<div style={{display:'flex',background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:10,overflow:'hidden',marginBottom:14}}>{options.map(opt=><button key={opt.id||opt} onClick={()=>onChange(opt.id||opt)} style={{flex:1,padding:'9px 6px',textAlign:'center',fontSize:11,fontFamily:font.head,fontWeight:700,cursor:'pointer',color:value===(opt.id||opt)?color:C.muted,background:value===(opt.id||opt)?`${color}18`:'transparent',border:'none',transition:'all 0.15s'}}>{opt.label||opt}</button>)}</div>;}

// -- LOGIN -----------------------------------------------------
function LoginScreen({onLogin}){
  const[email,setEmail]=useState('');const[pw,setPw]=useState('');const[err,setErr]=useState('');const[loading,setLoading]=useState(false);
  async function attempt(){
    setLoading(true);setErr('');
    try{
      const session=await checkCredentials(email,pw);
      if(session){
        onLogin(session); // passes full {access_token, user:{email}} to App()
      }else{
        setErr('Incorrect email or password.');
        setLoading(false);
      }
    }catch(e){
      setErr('Login error — please try again.');
      setLoading(false);
    }
  }
  return(<div style={{fontFamily:font.body,background:C.bg,minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24}}>
    <style>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Syne:wght@700;800;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{margin:0;background:${C.bg};font-family:'DM Sans',system-ui,sans-serif;color:${C.txt};-webkit-font-smoothing:antialiased;}
  input,select,textarea{-webkit-appearance:none;font-family:inherit;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:${C.bord2};border-radius:4px;}
  ::-webkit-scrollbar-thumb:hover{background:${C.muted};}
  ::selection{background:${C.acc};color:#fff;}
`}</style>
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

class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state={err:null,info:null}; }
  componentDidCatch(err,info){ this.setState({err,info}); }
  render(){
    if(this.state.err){
      return <div style={{background:'#050508',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24,fontFamily:'monospace'}}>
        <div style={{background:'#1a0a0a',border:'1px solid #ef4444',borderRadius:12,padding:24,maxWidth:600,width:'100%'}}>
          <div style={{color:'#ef4444',fontWeight:700,fontSize:16,marginBottom:12}}>💥 StageBoss Runtime Error</div>
          <div style={{color:'#fca5a5',fontSize:13,marginBottom:16,whiteSpace:'pre-wrap'}}>{this.state.err.toString()}</div>
          <div style={{color:'#6d6d90',fontSize:11,whiteSpace:'pre-wrap',overflowX:'auto'}}>{this.state.info?.componentStack?.slice(0,500)}</div>
          <button onClick={()=>window.location.reload()} style={{marginTop:16,background:'#7c3aed',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',cursor:'pointer',fontFamily:'monospace'}}>Reload</button>
        </div>
      </div>;
    }
    return this.props.children;
  }
}
// ════════════════════════════════════════════════════════════
// ANALYTICS TAB COMPONENT
// ════════════════════════════════════════════════════════════
function AnalyticsTab({venues, tours, bestTimeData={}}){
  const C = {
    bg:'#07070f', surf:'#10101e', surf2:'#16162e', bord:'#2a2a50',
    acc:'#7c3aed', acc2:'#a78bfa', green:'#00b894', pink:'#ec4899',
    yellow:'#f9ca24', muted:'#7070a0', txt:'#e8e8ff', red:'#e17055',
    blue:'#0ea5e9', orange:'#fd9644',
  };

  // ── DATA CRUNCHING ──────────────────────────────────────
  const confirmed = venues.filter(v=>['Confirmed','Advancing','Completed'].includes(v.status));
  const allVenues = venues;
  const thisYear = new Date().getFullYear().toString();

  // Revenue by month — uses SHOW DATE (when money happens), not confirmation date
  const revenueByMonth = Array(12).fill(0).map((_,i)=>({month:i,guarantee:0,merch:0,label:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}));
  confirmed.forEach(v=>{
    // Prefer showDate (actual performance date) over confirmedViaEmailDate
    const d=v.showDate||v.confirmedViaEmailDate||'';
    if(d.startsWith(thisYear)){
      const m=parseInt(d.split('-')[1])-1;
      if(m>=0&&m<12){
        revenueByMonth[m].guarantee+=parseFloat(v.guarantee)||0;
        revenueByMonth[m].merch+=parseFloat(v.settlement?.merchNet)||0;
      }
    }
  });
  // Also pull in tour dates by their actual show date
  tours.forEach(t=>{
    (t.dates||[]).forEach(d=>{
      if(!d.date||!d.date.startsWith(thisYear)) return;
      if(!['Confirmed','Advancing','Completed'].includes(d.status)) return;
      const m=parseInt(d.date.split('-')[1])-1;
      if(m>=0&&m<12){
        revenueByMonth[m].guarantee+=parseFloat(d.guarantee)||0;
        revenueByMonth[m].merch+=parseFloat(d.settlement?.merchNet)||0;
      }
    });
  });

  // Revenue by state
  const byState={};
  confirmed.forEach(v=>{
    if(!v.state) return;
    if(!byState[v.state]) byState[v.state]={state:v.state,total:0,shows:0};
    byState[v.state].total+=parseFloat(v.guarantee)||0;
    byState[v.state].shows++;
  });
  const topStates=Object.values(byState).sort((a,b)=>b.total-a.total).slice(0,8);

  // Revenue by venue type
  const byType={};
  confirmed.forEach(v=>{
    const t=v.venueType||'Club';
    if(!byType[t]) byType[t]={type:t,total:0,shows:0};
    byType[t].total+=parseFloat(v.guarantee)||0;
    byType[t].shows++;
  });
  const topTypes=Object.values(byType).sort((a,b)=>b.total-a.total);

  // Outreach conversion rate
  const leads=allVenues.filter(v=>v.status!=='Lost').length;
  const converted=confirmed.length;
  const convRate=leads>0?Math.round((converted/leads)*100):0;

  // Average deal size
  const avgDeal=converted>0?Math.round(confirmed.reduce((a,v)=>a+(parseFloat(v.guarantee)||0),0)/converted):0;

  // Template response rate
  const templateHits={};
  allVenues.forEach(v=>{
    (v.contactLog||[]).forEach(log=>{
      const tmpl=log.template||log.subject||'Unknown';
      if(!templateHits[tmpl]) templateHits[tmpl]={name:tmpl,sent:0,responded:0};
      templateHits[tmpl].sent++;
    });
  });
  // Count responded venues per template
  allVenues.filter(v=>['Responded','Negotiating','Hold','Confirmed','Advancing','Completed'].includes(v.status)).forEach(v=>{
    const firstLog=(v.contactLog||[])[0];
    if(firstLog){
      const tmpl=firstLog.template||firstLog.subject||'Unknown';
      if(templateHits[tmpl]) templateHits[tmpl].responded++;
    }
  });
  const topTemplates=Object.values(templateHits).filter(t=>t.sent>0).sort((a,b)=>b.sent-a.sent).slice(0,6);

  // Tour profitability
  const tourProfit=tours.map(t=>{
    const gross=(t.dates||[]).reduce((a,d)=>a+(parseFloat(d.guarantee)||0),0);
    const expenses=(parseFloat(t.budget?.travel)||0)+(parseFloat(t.budget?.lodging)||0)+(parseFloat(t.budget?.misc)||0);
    return {name:t.name,gross,expenses,net:gross-expenses,dates:(t.dates||[]).length};
  }).filter(t=>t.gross>0);

  // Booking velocity — avg days from first contact to confirmed
  const velocities=confirmed.filter(v=>(v.contactLog||[]).length>0&&v.confirmedViaEmailDate).map(v=>{
    const firstContact=new Date((v.contactLog||[])[0]?.date||v.confirmedViaEmailDate);
    const confirmed2=new Date(v.confirmedViaEmailDate);
    return Math.round((confirmed2-firstContact)/(1000*60*60*24));
  }).filter(d=>d>=0&&d<365);
  const avgVelocity=velocities.length>0?Math.round(velocities.reduce((a,b)=>a+b,0)/velocities.length):null;

  // Totals
  const totalRevenue=confirmed.reduce((a,v)=>a+(parseFloat(v.guarantee)||0),0);
  const totalMerch=confirmed.reduce((a,v)=>a+(parseFloat(v.settlement?.merchNet)||0),0);
  const maxMonth=Math.max(...revenueByMonth.map(m=>m.guarantee+m.merch),1);
  const maxState=topStates.length>0?topStates[0].total:1;

  // ── STYLES ──────────────────────────────────────────────
  const card=(border=C.bord)=>({background:C.surf,border:`1px solid ${border}`,borderRadius:14,padding:'16px',marginBottom:16});
  const sectionTitle={fontSize:10,fontWeight:700,letterSpacing:'0.15em',color:C.acc2,marginBottom:12,textTransform:'uppercase'};
  const statBox=(col)=>({background:C.surf2,border:`1px solid ${col}30`,borderRadius:10,padding:'12px',textAlign:'center',flex:1});

  const fmtK=(n)=>n>=1000?`$${(n/1000).toFixed(1)}k`:`$${n.toLocaleString()}`;

  return (<div>
    {/* HEADER */}
    <div style={{marginBottom:20}}>
      <div style={{fontFamily:'Bebas Neue,Impact,sans-serif',fontWeight:900,fontSize:22,letterSpacing:-0.5,marginBottom:4}}>Analytics</div>
      <div style={{fontSize:12,color:C.muted}}>Business intelligence for your touring career · {thisYear}</div>
    </div>

    {/* TOP STATS ROW */}
    <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
      {[
        ['Total Revenue',fmtK(totalRevenue),C.green],
        ['Merch Revenue',fmtK(totalMerch),C.acc2],
        ['Confirmed Shows',confirmed.length,C.pink],
        ['Avg Deal Size',fmtK(avgDeal),C.yellow],
        ['Conversion Rate',convRate+'%',C.blue],
        ['Avg Days to Book',avgVelocity!=null?avgVelocity+'d':'—',C.orange],
      ].map(([lbl,val,col])=><div key={lbl} style={statBox(col)}>
        <div style={{fontFamily:'Bebas Neue,Impact,sans-serif',fontSize:22,color:col,fontWeight:900,lineHeight:1}}>{val}</div>
        <div style={{fontSize:9,color:C.muted,marginTop:4,fontWeight:600,letterSpacing:'0.05em'}}>{lbl}</div>
      </div>)}
    </div>

    {/* REVENUE BY MONTH */}
    <div style={card()}>
      <div style={sectionTitle}>📅 Revenue by Month — {thisYear}</div>
      <div className="sb-analytics-chart"><div style={{display:'flex',gap:4,alignItems:'flex-end',height:100,minWidth:280}}>
        {revenueByMonth.map((m,i)=>{
          const total=m.guarantee+m.merch;
          const pct=total>0?Math.max(4,(total/maxMonth)*100):4;
          const isThisMonth=i===new Date().getMonth();
          return <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
            <div style={{fontSize:8,color:total>0?C.green:C.muted,fontWeight:700}}>{total>0?fmtK(total):''}</div>
            <div style={{width:'100%',height:pct+'%',borderRadius:'4px 4px 0 0',
              background:isThisMonth?`linear-gradient(0deg,${C.acc},${C.pink})`:`linear-gradient(0deg,${C.green}88,${C.green}44)`,
              border:isThisMonth?`1px solid ${C.acc2}`:'none',
              minHeight:4,position:'relative'}}/>
            <div style={{fontSize:8,color:isThisMonth?C.acc2:C.muted,fontWeight:isThisMonth?700:400}}>{m.label}</div>
          </div>;
        })}
      </div></div>
      {totalRevenue===0&&<div style={{textAlign:'center',color:C.muted,fontSize:11,marginTop:8}}>No confirmed shows yet — data will appear as you confirm bookings</div>}
    </div>

    {/* REVENUE BY STATE */}
    {topStates.length>0&&<div style={card()}>
      <div style={sectionTitle}>📍 Top Markets by Revenue</div>
      {topStates.map((s2,i)=>{
        const pct=Math.round((s2.total/maxState)*100);
        const colors=[C.green,C.acc2,C.pink,C.yellow,C.blue,C.orange,C.green,C.acc2];
        const col=colors[i%colors.length];
        return <div key={s2.state} style={{marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
            <span style={{fontSize:12,fontWeight:700}}>{s2.state} <span style={{fontSize:10,color:C.muted,fontWeight:400}}>· {s2.shows} show{s2.shows!==1?'s':''}</span></span>
            <span style={{fontSize:12,fontWeight:700,color:col}}>{fmtK(s2.total)}</span>
          </div>
          <div style={{background:C.bord,borderRadius:99,height:6,overflow:'hidden'}}>
            <div style={{width:pct+'%',height:'100%',borderRadius:99,background:`linear-gradient(90deg,${col},${col}88)`,transition:'width 0.6s ease'}}/>
          </div>
        </div>;
      })}
    </div>}

    {/* VENUE TYPE BREAKDOWN */}
    {topTypes.length>0&&<div style={card()}>
      <div style={sectionTitle}>🏛 Revenue by Venue Type</div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {topTypes.map((t,i)=>{
          const colors=[C.green,C.acc2,C.pink,C.yellow,C.blue,C.orange];
          const col=colors[i%colors.length];
          return <div key={t.type} style={{background:`${col}12`,border:`1px solid ${col}30`,borderRadius:10,padding:'10px 14px',flex:1,minWidth:100}}>
            <div style={{fontSize:16,fontFamily:'Bebas Neue,Impact,sans-serif',color:col,fontWeight:900}}>{fmtK(t.total)}</div>
            <div style={{fontSize:10,color:C.txt,fontWeight:700,marginTop:2}}>{t.type}</div>
            <div style={{fontSize:9,color:C.muted}}>{t.shows} show{t.shows!==1?'s':''} · avg {fmtK(Math.round(t.total/t.shows))}</div>
          </div>;
        })}
      </div>
    </div>}

    {/* OUTREACH CONVERSION FUNNEL */}
    <div style={card()}>
      <div style={sectionTitle}>🎯 Outreach Conversion Funnel</div>
      {[
        ['Total Venues',allVenues.length,C.muted,100],
        ['Contacted',allVenues.filter(v=>v.status!=='Lead').length,C.acc2,Math.round((allVenues.filter(v=>v.status!=='Lead').length/Math.max(allVenues.length,1))*100)],
        ['Responded',allVenues.filter(v=>['Responded','Negotiating','Hold','Confirmed','Advancing','Completed'].includes(v.status)).length,C.yellow,Math.round((allVenues.filter(v=>['Responded','Negotiating','Hold','Confirmed','Advancing','Completed'].includes(v.status)).length/Math.max(allVenues.length,1))*100)],
        ['Confirmed',confirmed.length,C.green,convRate],
      ].map(([label,count,col,pct])=><div key={label} style={{marginBottom:10}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
          <span style={{fontSize:12,fontWeight:700}}>{label}</span>
          <span style={{fontSize:12,color:col,fontWeight:700}}>{count} venues <span style={{fontSize:10,color:C.muted}}>({pct}%)</span></span>
        </div>
        <div style={{background:C.bord,borderRadius:99,height:8,overflow:'hidden'}}>
          <div style={{width:pct+'%',height:'100%',borderRadius:99,background:`linear-gradient(90deg,${col},${col}88)`,transition:'width 0.6s ease'}}/>
        </div>
      </div>)}
    </div>

    {/* TEMPLATE RESPONSE RATES */}
    {topTemplates.length>0&&<div style={card()}>
      <div style={sectionTitle}>✉️ Outreach by Template</div>
      {topTemplates.map((t,i)=>{
        const rate=t.sent>0?Math.round((t.responded/t.sent)*100):0;
        const col=rate>=30?C.green:rate>=15?C.yellow:C.muted;
        const name=t.name.length>35?t.name.slice(0,35)+'…':t.name;
        return <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:`1px solid ${C.bord}`}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:700}}>{name}</div>
            <div style={{fontSize:10,color:C.muted}}>{t.sent} sent · {t.responded} responded</div>
          </div>
          <div style={{background:`${col}18`,border:`1px solid ${col}40`,borderRadius:20,padding:'3px 10px',fontSize:11,fontWeight:700,color:col,minWidth:44,textAlign:'center'}}>{rate}%</div>
        </div>;
      })}
      {topTemplates.length===0&&<div style={{color:C.muted,fontSize:11}}>Send outreach emails to start tracking response rates</div>}
    </div>}

    {/* BEST TIME TO CONTACT */}
    {Object.keys(bestTimeData).length>0&&<div style={card()}>
      <div style={sectionTitle}>⏰ Best Time to Send</div>
      <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Days and times you've sent the most outreach</div>
      {(()=>{
        const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const dayCounts={};
        const hourCounts={};
        Object.entries(bestTimeData).forEach(([key,count])=>{
          const [day,hour]=key.split(':');
          dayCounts[day]=(dayCounts[day]||0)+count;
          hourCounts[hour]=(hourCounts[hour]||0)+count;
        });
        const topDay=Object.entries(dayCounts).sort((a,b)=>b[1]-a[1])[0];
        const topHour=Object.entries(hourCounts).sort((a,b)=>b[1]-a[1])[0];
        const maxDay=Math.max(...Object.values(dayCounts));
        return<div>
          <div style={{display:'flex',gap:4,alignItems:'flex-end',height:50,marginBottom:8}}>
            {days.map(d=>{
              const count=dayCounts[d]||0;
              const h=maxDay>0?Math.round((count/maxDay)*50):0;
              return<div key={d} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                <div style={{width:'100%',height:h||2,background:topDay&&topDay[0]===d?C.acc2:C.bord,borderRadius:'2px 2px 0 0',minHeight:2}}/>
                <div style={{fontSize:8,color:count>0?C.muted2:C.muted}}>{d}</div>
              </div>;
            })}
          </div>
          {topDay&&<div style={{fontSize:12,color:C.txt,marginTop:4}}>
            Best day: <strong style={{color:C.acc2}}>{topDay[0]}</strong>
            {topHour&&<> · Best time: <strong style={{color:C.acc2}}>{parseInt(topHour[0])>12?parseInt(topHour[0])-12+'pm':topHour[0]+'am'}</strong></>}
          </div>}
        </div>;
      })()}
    </div>}

    {/* TOUR PROFITABILITY */}
    {tourProfit.length>0&&<div style={card()}>
      <div style={sectionTitle}>🗺 Tour Profitability</div>
      {tourProfit.map((t,i)=>{
        const margin=t.gross>0?Math.round((t.net/t.gross)*100):0;
        const col=margin>=60?C.green:margin>=30?C.yellow:C.red;
        return <div key={i} style={{background:C.surf2,borderRadius:10,padding:'12px',marginBottom:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
            <div>
              <div style={{fontSize:13,fontWeight:700}}>{t.name}</div>
              <div style={{fontSize:10,color:C.muted}}>{t.dates} date{t.dates!==1?'s':''}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:15,fontWeight:800,color:C.green}}>{fmtK(t.gross)}</div>
              <div style={{fontSize:9,color:C.muted}}>gross</div>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            {[['Gross',t.gross,C.green],['Expenses',t.expenses,C.red],['Net',t.net,col]].map(([lbl,val,c])=><div key={lbl} style={{flex:1,background:`${c}10`,border:`1px solid ${c}25`,borderRadius:8,padding:'6px 8px',textAlign:'center'}}>
              <div style={{fontSize:12,fontWeight:700,color:c}}>{fmtK(val)}</div>
              <div style={{fontSize:9,color:C.muted}}>{lbl}</div>
            </div>)}
            <div style={{flex:1,background:`${col}10`,border:`1px solid ${col}25`,borderRadius:8,padding:'6px 8px',textAlign:'center'}}>
              <div style={{fontSize:12,fontWeight:700,color:col}}>{margin}%</div>
              <div style={{fontSize:9,color:C.muted}}>Margin</div>
            </div>
          </div>
        </div>;
      })}
    </div>}

    {/* BOOKING VELOCITY */}
    <div style={card()}>
      <div style={sectionTitle}>⚡ Booking Velocity</div>
      <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
        <div style={statBox(C.blue)}>
          <div style={{fontSize:24,fontWeight:900,color:C.blue,fontFamily:'Bebas Neue,Impact,sans-serif'}}>{avgVelocity!=null?avgVelocity+'d':'—'}</div>
          <div style={{fontSize:9,color:C.muted,marginTop:4}}>AVG DAYS TO BOOK</div>
          <div style={{fontSize:9,color:C.muted,marginTop:2}}>First contact → confirmed</div>
        </div>
        <div style={statBox(C.acc2)}>
          <div style={{fontSize:24,fontWeight:900,color:C.acc2,fontFamily:'Bebas Neue,Impact,sans-serif'}}>{allVenues.filter(v=>v.status==='Lead').length}</div>
          <div style={{fontSize:9,color:C.muted,marginTop:4}}>COLD LEADS</div>
          <div style={{fontSize:9,color:C.muted,marginTop:2}}>Not yet contacted</div>
        </div>
        <div style={statBox(C.orange)}>
          <div style={{fontSize:24,fontWeight:900,color:C.orange,fontFamily:'Bebas Neue,Impact,sans-serif'}}>{allVenues.filter(v=>['Contacted','Follow-Up','Responded','Negotiating'].includes(v.status)).length}</div>
          <div style={{fontSize:9,color:C.muted,marginTop:4}}>IN PIPELINE</div>
          <div style={{fontSize:9,color:C.muted,marginTop:2}}>Active conversations</div>
        </div>
        <div style={statBox(C.yellow)}>
          <div style={{fontSize:24,fontWeight:900,color:C.yellow,fontFamily:'Bebas Neue,Impact,sans-serif'}}>{allVenues.filter(v=>v.status==='Hold').length}</div>
          <div style={{fontSize:9,color:C.muted,marginTop:4}}>ON HOLD</div>
          <div style={{fontSize:9,color:C.muted,marginTop:2}}>Waiting on confirmation</div>
        </div>
      </div>
    </div>

    {/* MERCH ANALYTICS */}
    {totalMerch>0&&<div style={card(`${C.acc2}30`)}>
      <div style={sectionTitle}>👕 Merch Analytics</div>
      <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:12}}>
        {[
          ['Total Merch Revenue',fmtK(totalMerch),C.acc2],
          ['Avg Per Show',fmtK(Math.round(totalMerch/Math.max(confirmed.filter(v=>v.settlement?.merchNet>0).length,1))),C.pink],
          ['Shows w/ Merch',confirmed.filter(v=>v.settlement?.merchNet>0).length,C.green],
        ].map(([lbl,val,col])=><div key={lbl} style={statBox(col)}>
          <div style={{fontSize:20,fontWeight:900,color:col,fontFamily:'Bebas Neue,Impact,sans-serif'}}>{val}</div>
          <div style={{fontSize:9,color:C.muted,marginTop:4}}>{lbl}</div>
        </div>)}
      </div>
      <div style={{fontSize:11,color:C.muted}}>Merch represents {totalRevenue>0?Math.round((totalMerch/(totalRevenue+totalMerch))*100):0}% of total revenue</div>
    </div>}


    {/* ── REVENUE PROJECTIONS ── */}
    {(()=>{
      const now = new Date();
      const WEIGHTS = {'Negotiating':0.80,'Responded':0.45,'Follow-Up':0.25,'Contacted':0.12,'Lead':0.05,'Hold':0.60,'Advancing':0.90,'Confirmed':1.0,'Completed':1.0};
      const HORIZON_MONTHS = {'3mo':3,'6mo':6,'12mo':12};

      // Build month buckets for each horizon
      function buildProjection(horizonKey) {
        const months = HORIZON_MONTHS[horizonKey];
        const buckets = Array(months).fill(0).map((_,i)=>{
          const d = new Date(now.getFullYear(), now.getMonth()+i, 1);
          return {
            label: d.toLocaleString('default',{month:'short'}) + (d.getFullYear()!==now.getFullYear()?` '${String(d.getFullYear()).slice(2)}`:''),
            year: d.getFullYear(), month: d.getMonth(),
            confirmed: 0, pipeline: 0, tours: 0
          };
        });

        // Confirmed standalone venues (actual show date)
        venues.filter(v=>['Confirmed','Advancing'].includes(v.status)&&v.showDate).forEach(v=>{
          const d = new Date(v.showDate);
          const bi = buckets.findIndex(b=>b.year===d.getFullYear()&&b.month===d.getMonth());
          if(bi>=0) buckets[bi].confirmed += parseFloat(v.guarantee)||0;
        });

        // Pipeline venues weighted by close probability (use targetDates or nextFollowUp for timing)
        venues.filter(v=>!['Confirmed','Advancing','Completed','Lost'].includes(v.status)&&(v.guarantee||v.avgDeal||avgDeal)).forEach(v=>{
          const weight = WEIGHTS[v.status]||0.05;
          const dealSize = parseFloat(v.guarantee)||avgDeal||0;
          const projected = dealSize * weight;
          if(projected < 1) return;
          // Try to place in the right month from targetDates
          let placed = false;
          if(v.targetDates){
            const monthNames = ['january','february','march','april','may','june','july','august','september','october','november','december'];
            buckets.forEach((b,bi)=>{
              const label = b.label.toLowerCase();
              const mname = monthNames[b.month];
              if(v.targetDates.toLowerCase().includes(mname)||v.targetDates.toLowerCase().includes(b.label.toLowerCase().slice(0,3))){
                buckets[bi].pipeline += projected;
                placed = true;
              }
            });
          }
          if(!placed&&v.nextFollowUp){
            const d = new Date(v.nextFollowUp);
            const bi = buckets.findIndex(b=>b.year===d.getFullYear()&&b.month===d.getMonth());
            if(bi>=0){ buckets[bi].pipeline += projected; placed = true; }
          }
          if(!placed&&buckets.length>0){
            // spread across middle of horizon if no date info
            const mid = Math.floor(buckets.length/2);
            buckets[mid].pipeline += projected/2;
            if(mid+1<buckets.length) buckets[mid+1].pipeline += projected/2;
          }
        });

        // Tour dates
        tours.forEach(t=>{
          (t.dates||[]).forEach(d=>{
            if(!d.date) return;
            const dt = new Date(d.date);
            const bi = buckets.findIndex(b=>b.year===dt.getFullYear()&&b.month===dt.getMonth());
            if(bi>=0){
              const guarantee = parseFloat(d.guarantee)||0;
              const weight = WEIGHTS[d.status]||0.6;
              if(d.status==='Confirmed'||d.status==='Completed') buckets[bi].confirmed += guarantee;
              else buckets[bi].tours += guarantee * weight;
            }
          });
        });

        return buckets;
      }

      const horizons = ['3mo','6mo','12mo'];
      const labels = {'3mo':'3 Months','6mo':'6 Months','12mo':'12 Months'};

      // Use a simple inline toggle — track with a data attr trick using useState via ref
      // We'll render all three and show/hide with CSS — simpler approach
      const [projHorizon, setProjHorizon] = React.useState('6mo');
      const buckets = buildProjection(projHorizon);
      const totalConfirmed = buckets.reduce((a,b)=>a+b.confirmed,0);
      const totalPipeline = buckets.reduce((a,b)=>a+b.pipeline,0);
      const totalTours = buckets.reduce((a,b)=>a+b.tours,0);
      const grandTotal = totalConfirmed + totalPipeline + totalTours;
      const maxBar = Math.max(...buckets.map(b=>b.confirmed+b.pipeline+b.tours), 1);

      return <div style={card(`${C.acc}30`)}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12,flexWrap:'wrap',gap:8}}>
          <div style={sectionTitle}>📈 REVENUE PROJECTIONS</div>
          <div style={{display:'flex',gap:4}}>
            {horizons.map(h=>(
              <button key={h} onClick={()=>setProjHorizon(h)} style={{background:projHorizon===h?C.acc:'transparent',color:projHorizon===h?'#fff':C.muted,border:`1px solid ${projHorizon===h?C.acc:C.bord}`,borderRadius:6,padding:'4px 10px',fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:'inherit'}}>
                {labels[h]}
              </button>
            ))}
          </div>
        </div>

        {/* Summary totals */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(100px,1fr))',gap:8,marginBottom:16}}>
          {[
            ['Confirmed','#00b894',totalConfirmed,'Hard bookings + confirmed tour dates'],
            ['Pipeline','#a78bfa',totalPipeline,'Weighted by close probability'],
            ['Tour Holds','#f9ca24',totalTours,'Unconfirmed tour dates weighted'],
            ['Total Projected','#ec4899',grandTotal,'Best estimate for the period'],
          ].map(([lbl,col,val,tip])=>(
            <div key={lbl} style={{background:`${col}10`,border:`1px solid ${col}25`,borderRadius:10,padding:'10px 12px',textAlign:'center'}}>
              <div style={{fontSize:18,fontWeight:900,color:col,fontFamily:"'Syne',sans-serif"}}>{fmtK(val)}</div>
              <div style={{fontSize:8,color:C.muted,marginTop:2,textTransform:'uppercase',letterSpacing:'0.08em'}}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Month-by-month stacked bars */}
        <div className="sb-analytics-chart">
          <div style={{display:'flex',gap:3,alignItems:'flex-end',height:90,minWidth:Math.max(280,buckets.length*44)}}>
            {buckets.map((b,i)=>{
              const total = b.confirmed+b.pipeline+b.tours;
              const pct = total>0?Math.max(4,(total/maxBar)*100):2;
              const cPct = total>0?(b.confirmed/total)*pct:0;
              const tPct = total>0?(b.tours/total)*pct:0;
              const pPct = pct - cPct - tPct;
              return <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                <div style={{fontSize:7,color:total>0?C.green:C.muted,fontWeight:700}}>{total>0?fmtK(total):''}</div>
                <div style={{width:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end',height:72}}>
                  {b.pipeline>0&&<div style={{width:'100%',height:pPct+'%',background:`${C.acc2}99`,minHeight:b.pipeline>0?2:0,borderRadius:cPct>0||tPct>0?'0':'3px 3px 0 0'}}/>}
                  {b.tours>0&&<div style={{width:'100%',height:tPct+'%',background:`${C.yellow}99`,minHeight:b.tours>0?2:0}}/>}
                  {b.confirmed>0&&<div style={{width:'100%',height:cPct+'%',background:C.green,minHeight:b.confirmed>0?2:0,borderRadius:'0 0 0 0'}}/>}
                  {total===0&&<div style={{width:'100%',height:4,background:C.bord,borderRadius:2}}/>}
                </div>
                <div style={{fontSize:7,color:C.muted,fontWeight:500,textAlign:'center'}}>{b.label}</div>
              </div>;
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{display:'flex',gap:12,marginTop:10,flexWrap:'wrap'}}>
          {[['Confirmed',C.green],['Tour Holds',C.yellow],['Pipeline',C.acc2]].map(([lbl,col])=>(
            <div key={lbl} style={{display:'flex',alignItems:'center',gap:4}}>
              <div style={{width:8,height:8,borderRadius:2,background:col}}/>
              <span style={{fontSize:9,color:C.muted}}>{lbl}</span>
            </div>
          ))}
        </div>

        {/* Probability key */}
        <div style={{marginTop:12,padding:'10px 12px',background:C.surf2,borderRadius:8}}>
          <div style={{fontSize:9,color:C.muted2,fontWeight:700,letterSpacing:'0.08em',marginBottom:6}}>PIPELINE CLOSE PROBABILITIES USED</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {[['Negotiating','80%',C.green],['Hold','60%',C.yellow],['Responded','45%',C.blue],['Follow-Up','25%',C.acc2],['Contacted','12%',C.muted],['Lead','5%',C.muted]].map(([s,p,col])=>(
              <div key={s} style={{fontSize:8,color:col}}>
                <span style={{fontWeight:700}}>{s}</span> {p}
              </div>
            ))}
          </div>
        </div>
      </div>;
    })()}

    {(confirmed.length===0&&tours.length===0)&&<div style={{textAlign:'center',padding:'40px 20px',color:C.muted}}>
      <div style={{fontSize:32,marginBottom:12}}>📊</div>
      <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>Analytics will populate as you use StageBoss</div>
      <div style={{fontSize:12}}>Confirm shows, build tours, and log outreach to start seeing your data here.</div>
    </div>}
  </div>);
}


function App(){
  // session: { email, access_token } — email used for sync, access_token for JWT-gated functions
  const[session,setSession]=useState(()=>{
    try{
      const stored=localStorage.getItem('sb_session');
      return stored?JSON.parse(stored):null;
    }catch{return null;}
  });

  // On mount: restore session from Supabase if still valid
  useEffect(()=>{
    const isAuthorized = (email) => AUTHORIZED_USERS.map(e=>e.toLowerCase()).includes(email.toLowerCase().trim());
    sbAuthClient.auth.getSession().then(({data})=>{
      if(data?.session){
        const email = data.session.user.email;
        if(!isAuthorized(email)){ sbAuthClient.auth.signOut(); return; }
        const s={email, access_token:data.session.access_token};
        setSession(s);
        try{localStorage.setItem('sb_session',JSON.stringify(s));}catch{}
      }
    });
    // Listen for auth state changes (token refresh, sign-out)
    const{data:{subscription}}=sbAuthClient.auth.onAuthStateChange((_event,s)=>{
      if(s){
        const email = s.user.email;
        if(!isAuthorized(email)){ sbAuthClient.auth.signOut(); return; }
        const updated={email, access_token:s.access_token};
        setSession(updated);
        try{localStorage.setItem('sb_session',JSON.stringify(updated));}catch{}
      } else {
        setSession(null);
        try{localStorage.removeItem('sb_session');}catch{}
      }
    });
    return()=>subscription.unsubscribe();
  },[]);

  if(!session) return <LoginScreen onLogin={s=>{
    // s is the full Supabase session object from signInWithPassword
    const email = s.user.email.toLowerCase().trim();
    if(!AUTHORIZED_USERS.map(e=>e.toLowerCase()).includes(email)){
      sbAuthClient.auth.signOut();
      alert('Access denied. Contact Jason to request access.');
      return;
    }
    const stored={email, access_token:s.access_token};
    setSession(stored);
    try{
      localStorage.setItem('sb_session',JSON.stringify(stored));
      localStorage.removeItem('sb_venues');
      localStorage.removeItem('sb_templates');
      localStorage.removeItem('sb_tours');
    }catch{}
  }}/>;

  return <StageBoss
    user={session.email}
    accessToken={session.access_token}
    onLogout={()=>{
      sbAuthClient.auth.signOut();
      setSession(null);
      try{localStorage.removeItem('sb_session');}catch{}
    }}
  />;
}

// -- STAGEBOSS ------------------------------------------------
function StageBoss({user,onLogout,accessToken}){
  // getToken: returns current Supabase access_token for JWT-gated API calls.
  // If the session has expired, Supabase auto-refreshes via onAuthStateChange in App().
  // If still null after refresh, shows "please log in again" to the user.
  async function getToken(){
    const{data}=await sbAuthClient.auth.getSession();
    return data?.session?.access_token || accessToken || null;
  }

  const[venues,setVenues]=useState(()=>{
    try{const c=localStorage.getItem('sb_cache');if(c){const p=JSON.parse(c);if(p.venues?.length)return p.venues.map(migrateVenue);}}catch{}
    return [];
  });
  const[templates,setTemplates]=useState([]);
  const[photos]=useState(DEFAULT_PHOTOS);
  const[tours,setTours]=useState([]);
  const[comedians,setComedians]=useState(()=>{
    try{const c=localStorage.getItem('sb_cache');if(c){const p=JSON.parse(c);if(p.comedians?.length) return p.comedians;}}catch{}
    try{const s=localStorage.getItem('sb_comedians');if(s) return JSON.parse(s);}catch(e){}
    return [
      {id:'c_jason',name:'Jason Schuster',role:'Headliner',defaultFee:0,active:true,bookouts:[],notes:''},
      {id:'c_phil',name:'Phil Medina',role:'Headliner',defaultFee:0,active:true,bookouts:[],notes:''},
    ];
  });
  const[rosterOpen,setRosterOpen]=useState(false);
  const[editComedianId,setEditComedianId]=useState(null);
  const[tab,setTab]=useState('today');
  const[search,setSearch]=useState('');
  const[statusFilter,setStatusFilter]=useState('All');
  const[stateFilter,setStateFilter]=useState('All');
  const[cityFilter,setCityFilter]=useState('All');
  const[toast,setToast]=useState('');
  const[activeFilter,setActiveFilter]=useState('All');
  const[hotSheet,setHotSheet]=useState(false);
  const[dmOpen,setDmOpen]=useState(null);
  const[researchOpen,setResearchOpen]=useState(null);
  const[researchResult,setResearchResult]=useState('');
  const[researchLoading,setResearchLoading]=useState(false);
  const[winsHistory,setWinsHistory]=useState([]);
  const[bestTimeData,setBestTimeData]=useState({});
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
  const[editTourDateId,setEditTourDateId]=useState(null); // {tourId, dateId}
  const[expandTourId,setExpandTourId]=useState(null);
  const[tourBreakdownId,setTourBreakdownId]=useState(null);
  const[importOpen,setImportOpen]=useState(false);
  const[confirmDelete,setConfirmDelete]=useState(null);
  const[composeOpts,setComposeOpts]=useState({});
  const[dbSearch,setDbSearch]=useState('');
  const[dbStateFilter,setDbStateFilter]=useState('All');
  const[dbTypeFilter,setDbTypeFilter]=useState('All');
  const[nv,setNv]=useState({venue:'',booker:'',bookerLast:'',city:'',state:'',address:'',zip:'',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:'',doorSplit:'',capacity:'',notes:'',referralSource:'',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20});
  const fileRef=useRef(null);
  const importRef=useRef(null);
  const[aiOpen,setAiOpen]=useState(false);
  const[aiVenueId,setAiVenueId]=useState(null);
  const[aiLoading,setAiLoading]=useState(false);
  const[aiResult,setAiResult]=useState('');
  const[aiDraft,setAiDraft]=useState({});
  const[dealVenue,setDealVenue]=useState(null);
  const[showDealBuilder,setShowDealBuilder]=useState(false);
  const[routeStops,setRouteStops]=useState([]);
  const[voiceActive,setVoiceActive]=useState(false);
  const[voiceTarget,setVoiceTarget]=useState(null);
  const[stateFilter2,setStateFilter2]=useState('All');
  const recognitionRef=useRef(null);
  const[syncing,setSyncing]=useState(false);
  const[lastSync,setLastSync]=useState(null);
  const[cloudVersion,setCloudVersion]=useState(null);
  const[syncError,setSyncError]=useState(null);
  const[debugPanel,setDebugPanel]=useState(false);
  const[lastPushStatus,setLastPushStatus]=useState('never');
  const[lastFetchStatus,setLastFetchStatus]=useState('never');
  const[cloudVenueCount,setCloudVenueCount]=useState(null);

  const syncTimeout=useRef(null);
  const dirtyRef=useRef(false);
  const localVersionRef=useRef(null);
  const cloudInitialized=useRef(false);

  // ── CLOUD SYNC ──────────────────────────────────────────────────
  // Safe merge: never replace local with empty/invalid cloud data
  // Local cache for instant load
  const saveLocal = (venues, templates, tours, comedians) => {
    try { localStorage.setItem('sb_cache', JSON.stringify({venues,templates,tours,comedians,ts:Date.now()})); } catch{}
  };
  const loadLocal = () => {
    try { const c=localStorage.getItem('sb_cache'); return c?JSON.parse(c):null; } catch{ return null; }
  };

  const applyCloudData = useCallback((data, cloudVer) => {
    if (!data) return false;
    const hasVenues = data.venues && data.venues.length > 0;
    const hasTemplates = data.templates && data.templates.length > 0;
    // If cloud has venues, use them
    if (hasVenues) {
      setVenues(data.venues.map(migrateVenue));
    } else {
      // First time user - seed with pre-loaded directory
      console.log('[SYNC] No cloud venues - seeding with pre-loaded directory');
      setVenues(PRE_LOADED_VENUES.map(migrateVenue));
    }
    if (hasTemplates) setTemplates(data.templates); else setTemplates(DEFAULT_TEMPLATES);
    setTours(data.tours || []);
    if (data.comedians?.length) setComedians(data.comedians);
    setCloudVersion(cloudVer);
    cloudInitialized.current = true;
    return true;
  }, []);

  useEffect(()=>{
    if(SB_URL==='https://placeholder.supabase.co') return;
    let active = true;

    async function pollCloud() {
      if (!active) return;
      const result = await cloudFetch(OWNER_EMAIL);
      if (!active) return;
      if (result.error) {
        setSyncError(result.error);
        setLastFetchStatus('error: '+result.error);
        return;
      }
      setSyncError(null);
      const row = result.row;
      const cloudVenues = row?.data?.venues?.length ?? 0;
      setCloudVenueCount(cloudVenues);
      setLastFetchStatus('ok @ '+new Date().toLocaleTimeString()+' ('+cloudVenues+' venues)');
      if (row && row.data) {
        const cloudVer = row.updated_at || '';
        const localVer = localVersionRef.current || '';
        if (!localVer || cloudVer > localVer) {
          const applied = applyCloudData(row.data, cloudVer);
          if (applied) {
            setLastSync(new Date());
            dirtyRef.current = false;
          }
        }
      } else if (row === null && !cloudInitialized.current) {
        // No row in cloud yet - seed with pre-loaded directory
        console.log('[SYNC] No cloud row - seeding with pre-loaded directory');
        setVenues(PRE_LOADED_VENUES.map(migrateVenue));
        cloudInitialized.current = true;
        dirtyRef.current = true; // trigger save to cloud
        setLastSync(new Date());
      }
    }

    setSyncing(true);
    pollCloud().then(()=>setSyncing(false));
    const interval = setInterval(pollCloud, 5000);
    return () => { active = false; clearInterval(interval); };
  },[user]);

  // Cache locally for instant reload
  useEffect(()=>{ if(venues.length>0) saveLocal(venues,templates,tours,comedians); },[venues,templates,tours,comedians]);

  // Auto-save: fires 1s after user changes data
  useEffect(()=>{
    if(SB_URL==='https://placeholder.supabase.co') return;
    if(!lastSync) return; // wait for initial cloud load
    dirtyRef.current = true;
    clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(async()=>{
      if(!dirtyRef.current) return;
      const version = new Date().toISOString();
      localVersionRef.current = version;
      dirtyRef.current = false;
      setSyncing(true);
      try {
        const returnedAt = await cloudPush(OWNER_EMAIL, venues, templates, tours, comedians);
        localVersionRef.current = returnedAt || version;
        setLastSync(new Date());
        setLastPushStatus('ok @ '+new Date().toLocaleTimeString()+' ('+venues.length+' venues)');
        setSyncError(null);
      } catch(e) { 
        console.error('[SYNC] Auto-save failed:', e.message);
        setLastPushStatus('error: '+e.message);
        setSyncError(e.message);
        dirtyRef.current = true;
        // Retry after 5 seconds
        setTimeout(()=>{ if(dirtyRef.current) dirtyRef.current=true; }, 5000);
      }
      setSyncing(false);
    }, 1000);
    return()=>clearTimeout(syncTimeout.current);
  },[venues,templates,tours,comedians]);;

  // -- AI OUTREACH WRITER (secure - calls server-side Netlify Function) ------
  async function generateAIOutreach(venueId, templateId, dates){
    const v = venues.find(x => x.id === venueId);
    if (!v) return;
    setAiVenueId(venueId); setAiOpen(true); setAiLoading(true); setAiResult('');

    const touchHistory = (v.contactLog || []).slice(-5);
    const touchNum = touchHistory.length + 1;

    // Pick best template if none selected
    let tmpl = templateId ? templates.find(t => t.id === templateId) : null;
    if (!tmpl) {
      if (touchNum === 2) tmpl = templates.find(t => t.id === 'tmpl_followup_1');
      else if (touchNum === 3) tmpl = templates.find(t => t.id === 'tmpl_followup_2');
      else if (touchNum >= 4) tmpl = templates.find(t => t.id === 'tmpl_followup_3');
      else if (v.venueType === 'Casino') tmpl = templates.find(t => t.id === 'tmpl_casino');
      else if (v.venueType === 'College') tmpl = templates.find(t => t.id === 'tmpl_college');
      else tmpl = templates.find(t => t.id === 'tmpl_jason_phil_standard');
    }

    const token1 = await getToken();
    if (!token1) { setAiResult('Session expired. Please log out and log in again.'); setAiLoading(false); return; }
    try {
      const res = await fetch('/.netlify/functions/generate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token1,
        },
        body: JSON.stringify({
          venue: v,
          template: tmpl ? { subject: tmpl.subject, body: fillTemplate(tmpl, v, dates || '') } : null,
          tone: aiDraft.tone || 'professional',
          dates: dates || aiDraft.dates || '',
          touchHistory,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setAiResult('Error: ' + (data.error || 'Unknown error. Try again.'));
        setAiLoading(false);
        return;
      }

      // Store subject separately for Gmail
      setAiDraft(prev => ({ ...prev, subject: data.subject, generated: data.subject + '\n\n' + data.body }));
      setAiResult(data.subject + '\n\n' + data.body);

    } catch (err) {
      setAiResult('Connection error. Check your internet and try again.');
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
    openGmail(v.email||'', 'Phil Medina - Availability - '+v.venue, aiResult);
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
  const upd=useCallback((id,fields)=>{
    // Track wins when status changes to Confirmed
    if(fields.status==='Confirmed'){
      setVenues(vs=>{
        const v=vs.find(x=>x.id===id);
        if(v&&v.status!=='Confirmed'){
          setWinsHistory(wh=>[{id:Date.now(),venue:v.venue,city:v.city,state:v.state,guarantee:v.guarantee||fields.guarantee||0,date:new Date().toISOString().split('T')[0]},...wh.slice(0,19)]);
        }
        return vs.map(x=>x.id===id?{...x,...fields}:x);
      });
    } else {
      setVenues(vs=>vs.map(v=>v.id===id?{...v,...fields}:v));
    }
  },[]);

  // Auto follow-up scheduling based on touch sequence
  const AUTO_FOLLOWUP_DAYS={1:5,2:7,3:10,4:14};
  const logTouch=useCallback((id,method='Email',note='')=>{
    setVenues(vs=>vs.map(v=>{
      if(v.id!==id) return v;
      const entry={date:new Date().toISOString().split('T')[0],method,note};
      const newLog=[...(v.contactLog||[]),entry];
      const touchNum=newLog.length;
      const daysOut=AUTO_FOLLOWUP_DAYS[touchNum]||14;
      const nextDate=new Date(Date.now()+daysOut*24*60*60*1000).toISOString().split('T')[0];
      return{...v,contactLog:newLog,nextFollowUp:nextDate};
    }));
    toast2(`✓ Touch logged — follow-up auto-scheduled`);
  },[toast2]);
  const getV=(id)=>venues.find(v=>v.id===id);

  // ── BOUNCE TRACKER ──────────────────────────────────────────────────────
  const markBounced=useCallback((id)=>{
    setVenues(vs=>vs.map(v=>v.id===id?{...v,emailBounced:true,emailBouncedDate:new Date().toISOString().split('T')[0]}:v));
    toast2('⚠️ Email marked as bounced');
  },[toast2]);
  const clearBounce=useCallback((id)=>{
    setVenues(vs=>vs.map(v=>v.id===id?{
      ...v,
      emailBounced:false,
      emailBouncedDate:'',
      contactLog:[], // reset sequence so next email starts at Touch 1
      status:'Lead', // reset status back to lead
      warmth: v.warmth === 'Hot' || v.warmth === 'Warm' ? 'Cold' : v.warmth,
    }:v));
    toast2('✓ Bounce cleared — sequence reset to Touch 1');
  },[toast2]);

  // Auto-mark known bounced emails on first load
  const KNOWN_BOUNCED=[
    'entertainment@winstar.com','indy@heliumcomedy.com','stl@heliumcomedy.com',
    'kc@improv.com','entertainment@paysbig.com','schaumburg@improv.com',
    'info@secondcity.com','entertainment@mohegansun.com','dsm@funnybone.com',
    'info@acmecomedyco.com','info@laughboston.com','info@comedyunderground.com',
    'entertainment@tulalipresorts.com','info@wiseguyscomedy.com',
    'entertainment@parxcasino.com'
  ];
  useEffect(()=>{
    setVenues(vs=>vs.map(v=>
      KNOWN_BOUNCED.includes((v.email||'').toLowerCase().trim())&&!v.emailBounced
        ?{...v,emailBounced:true,emailBouncedDate:'2025-01-01'}
        :v
    ));
  }, []);

  const dv=detailId?getV(detailId):null;
  const cv=composeId?getV(composeId):null;
  const deal=dealId?getV(dealId):null;
  const clV=checklistId?getV(checklistId):null;
  const stlV=settlementId?getV(settlementId):null;
  const srV=showReportId?getV(showReportId):null;
  const editTpl=editTemplateId?templates.find(t=>t.id===editTemplateId):null;
  const editTour=editTourId?tours.find(t=>t.id===editTourId):null;
  const co=composeId?(composeOpts[composeId]||{templateId:'tmpl_jason_phil_standard',customDates:'',customNote:''}):{};
  function setCo(id,fields){setComposeOpts(p=>({...p,[id]:{...(p[id]||{templateId:'tmpl_jason_phil_standard',customDates:'',customNote:''}), ...fields}}));}

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
  // Deal expiry: Negotiating/Responded with no activity 14+ days
  const expiringDeals=useMemo(()=>venues.filter(v=>{
    if(!['Negotiating','Responded'].includes(v.status)) return false;
    const log=v.contactLog||[];
    if(!log.length) return false;
    const lastTouch=new Date(log[log.length-1].date);
    const daysSince=Math.floor((Date.now()-lastTouch)/(1000*60*60*24));
    return daysSince>=14;
  }),[venues]);
  // Booking momentum score (0-100)
  const momentumScore=useMemo(()=>(v)=>{
    let score=0;
    const log=v.contactLog||[];
    if(log.length>0){const last=new Date(log[log.length-1].date);const days=Math.floor((Date.now()-last)/(1000*60*60*24));score+=Math.max(0,30-days*2);}
    if(v.warmth==='Hot') score+=25;
    else if(v.warmth==='Warm') score+=15;
    else if(v.warmth==='Established') score+=20;
    if(v.status==='Negotiating') score+=25;
    else if(v.status==='Responded') score+=15;
    else if(v.status==='Follow-Up') score+=8;
    if(log.length>=2) score+=10;
    if(v.email) score+=5;
    if(v.booker) score+=5;
    return Math.min(100,score);
  },[venues]);
  // Response rate by template
  const templateStats=useMemo(()=>{
    const stats={};
    venues.forEach(v=>{
      (v.contactLog||[]).forEach(entry=>{
        if(entry.template){
          if(!stats[entry.template]) stats[entry.template]={sent:0,responded:0};
          stats[entry.template].sent++;
          if(['Responded','Negotiating','Confirmed'].includes(v.status)) stats[entry.template].responded++;
        }
      });
    });
    return stats;
  },[venues]);

  // State and city options derived from venues
  const stateOptions = useMemo(()=>{
    const states = [...new Set(venues.map(v=>v.state).filter(Boolean))].sort();
    return ['All', ...states];
  }, [venues]);

  const cityOptions = useMemo(()=>{
    const cities = [...new Set(
      venues
        .filter(v => stateFilter==='All' || v.state===stateFilter)
        .map(v=>v.city).filter(Boolean)
    )].sort();
    return ['All', ...cities];
  }, [venues, stateFilter]);

  const filtered=useMemo(()=>{
    const q=search.toLowerCase();
    return venues.filter(v=>{
      const mq=!q||v.venue.toLowerCase().includes(q)||v.city.toLowerCase().includes(q)||(v.booker||'').toLowerCase().includes(q)||(v.state||'').toLowerCase().includes(q);
      const ms=statusFilter==='All'||v.status===statusFilter;
      const mst=stateFilter==='All'||v.state===stateFilter;
      const mct=cityFilter==='All'||v.city===cityFilter;
      return mq&&ms&&mst&&mct;
    });
  },[venues,search,statusFilter,stateFilter,cityFilter]);

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
    setNv({venue:'',booker:'',bookerLast:'',city:'',state:'',address:'',zip:'',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:'',doorSplit:'',capacity:'',notes:'',referralSource:'',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20});
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
  function saveTour(tour){
    // Save the tour
    if(tour.id&&tours.find(t=>t.id===tour.id)){
      setTours(ts=>ts.map(t=>t.id===tour.id?tour:t));
    } else {
      setTours(ts=>[...ts,{...tour,id:Date.now().toString()}]);
    }
    // Auto-add new venues from tour dates to venue list as Leads
    const newVenues = [];
    (tour.dates||[]).forEach(d => {
      if(!d.venue||!d.venue.trim()) return; // skip blank
      const alreadyExists = venues.some(v =>
        v.venue.toLowerCase().trim() === d.venue.toLowerCase().trim() &&
        (v.city||'').toLowerCase().trim() === (d.city||'').toLowerCase().trim()
      );
      if(!alreadyExists){
        newVenues.push({
          id: 'td_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),
          venue: d.venue.trim(),
          city: d.city||'',
          state: d.state||'',
          address: d.address||'',
          zip: d.zip||'',
          email: '',
          phone: '',
          instagram: '',
          booker: '',
          bookerLast: '',
          preferredContact: 'Email',
          venueType: 'Comedy Club',
          relationship: 'new',
          warmth: 'Cold',
          status: d.status||'Lead',
          guarantee: 0,
          dealType: d.dealType||'Flat Guarantee',
          targetDates: d.date||'',
          notes: 'Added from tour: ' + tour.name,
          contactLog: [],
          contractStatus: 'None',
          depositPaid: false,
          package: 'Jason + Phil',
          agreementType: 'Email Agreement',
          confirmedViaEmailDate: '',
          emailThreadURL: '',
          emailThreadText: '',
          emailAgreementNotes: '',
          termsLocked: false,
          checklist: null,
          expectedPaymentTiming: 'Night of show',
          paid: false,
          paidDate: '',
          settlement: null,
          showReport: null,
          rebookDate: '',
          history: '',
          referralSource: 'Tour Date',
          nextFollowUp: '',
          agentCommission: 10,
          managerCommission: 15,
          lodging: 'Hotel',
          merchAllowed: true,
          isTourDate: true,
        });
      }
    });
    if(newVenues.length > 0){
      setVenues(vs => [...vs, ...newVenues]);
      toast2(`[OK] Tour saved · ${newVenues.length} new venue${newVenues.length>1?'s':''} added to your list`);
    } else {
      toast2('Tour saved OK');
    }
    setEditTourId(null);
  }

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
  const mailto=cv?.email?true:null; // openGmail used directly in onClick below
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
        /* ── MOBILE FIRST ── */
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;touch-action:manipulation;}
        .sb-desktop-wrap{display:flex;min-height:100vh;}
        .sb-sidebar{display:none;}
        .sb-main{flex:1;min-width:0;}

        /* iOS input zoom prevention — font-size must be 16px+ */
        input,select,textarea{font-size:16px!important;-webkit-appearance:none;}

        /* iOS momentum scroll */
        .sb-main,.sb-panel-inner,
        [style*="overflow-y:auto"],[style*="overflowY:'auto'"]{
          -webkit-overflow-scrolling:touch;
        }

        /* hide scrollbars on nav */
        .sb-mobile-nav::-webkit-scrollbar{display:none;}
        .sb-mobile-nav{-ms-overflow-style:none;scrollbar-width:none;}

        /* ── BOTTOM NAV ── */
        .sb-mobile-nav{
          display:flex;
          position:fixed;
          bottom:0;left:0;right:0;
          background:rgba(7,7,15,0.97);
          border-top:1px solid rgba(124,58,237,0.2);
          padding:4px 0 env(safe-area-inset-bottom,8px);
          z-index:90;
          gap:0;
          justify-content:space-around;
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
        }
        .sb-nav-btn{
          flex:1;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:2px;
          padding:6px 2px;
          background:none;
          border:none;
          cursor:pointer;
          min-height:52px;
          position:relative;
        }
        .sb-nav-btn.active::after{
          content:'';
          position:absolute;
          bottom:0;left:50%;
          transform:translateX(-50%);
          width:20px;height:2px;
          background:linear-gradient(90deg,#7c3aed,#ec4899);
          border-radius:1px 1px 0 0;
        }

        /* ── TAP TARGETS ── */
        button{min-height:44px;display:inline-flex;align-items:center;justify-content:center;}
        a{display:inline-flex;align-items:center;justify-content:center;}

        /* ── CARD TOUCH FEEDBACK ── */
        .sb-card{transition:transform 0.12s,opacity 0.12s;}
        .sb-card:active{transform:scale(0.97);opacity:0.85;}

        /* ── GRID FIXES: never go below 1 col on mobile ── */
        .sb-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
        @media(max-width:380px){
          .sb-grid2{grid-template-columns:1fr;}
        }

        /* ── PANELS: full screen on mobile ── */
        .sb-panel{
          position:fixed;top:0;right:0;
          height:100%;
          width:100vw!important;
          max-width:100vw!important;
          overflow-y:auto;
          -webkit-overflow-scrolling:touch;
          overscroll-behavior:contain;
        }
        .sb-panel-content{
          padding:16px 16px 120px;
        }

        /* ── ANALYTICS CHARTS: prevent overflow ── */
        .sb-analytics-chart{
          overflow-x:auto;
          -webkit-overflow-scrolling:touch;
        }

        /* ── CONTENT PADDING (account for fixed nav) ── */
        .sb-content-pad{padding:12px 12px 100px;}

        /* ── SAFE AREA SUPPORT ── */
        @supports(padding-bottom:env(safe-area-inset-bottom)){
          .sb-mobile-nav{padding-bottom:calc(env(safe-area-inset-bottom) + 4px);}
          .sb-content-pad{padding-bottom:calc(env(safe-area-inset-bottom) + 90px);}
        }

        @media(min-width:768px){
          .sb-sidebar{
            display:flex;flex-direction:column;
            width:228px;min-width:228px;
            background:linear-gradient(180deg,#0a0a14 0%,#080810 100%);
            border-right:1px solid rgba(124,58,237,0.12);
            position:fixed;top:0;left:0;height:100vh;
            padding:20px 16px 24px;overflow-y:auto;
            z-index:50;box-shadow:4px 0 32px rgba(0,0,0,0.4);
          }
          .sb-main{margin-left:228px;padding-bottom:20px;}
          .sb-mobile-header{display:none!important;}
          .sb-mobile-nav{display:none!important;}
          .sb-panel{width:min(480px,100vw)!important;max-width:480px!important;}
          .sb-content{padding-bottom:20px!important;}
          button,a{min-height:unset;}
          .sb-grid2{grid-template-columns:1fr 1fr;}
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
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
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
      {confirmDelete&&<><div onClick={()=>setConfirmDelete(null)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:400}}/><div style={{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',background:C.surf,border:`1px solid ${C.red}`,borderRadius:18,padding:28,zIndex:401,width:'calc(100% - 48px)',maxWidth:340,textAlign:'center'}}><div style={{fontSize:32,marginBottom:12}}>[trash]</div><div style={{fontFamily:font.head,fontWeight:800,fontSize:18,marginBottom:8}}>Delete Venue?</div><div style={{fontSize:13,color:C.muted,marginBottom:24,lineHeight:1.5}}>Permanently remove <strong style={{color:C.txt}}>{venues.find(v=>v.id===confirmDelete)?.venue}</strong>?</div><div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}><button onClick={()=>setConfirmDelete(null)} style={s.btn(C.surf2,C.txt,C.bord)}>Cancel</button><button onClick={()=>{setVenues(vs=>vs.filter(v=>v.id!==confirmDelete));setDetailId(null);setConfirmDelete(null);toast2('Venue removed');}} style={s.btn('rgba(225,112,85,0.15)',C.red,'rgba(225,112,85,0.4)')}>Delete</button></div></div></>}

      <div className="sb-desktop-wrap">

      {/* DESKTOP SIDEBAR */}
      <div className="sb-sidebar">
        <div onClick={()=>setTab('today')} style={{cursor:'pointer',marginBottom:24,paddingTop:4}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:2}}>
            <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#6c5ce7,#a29bfe)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:12,color:'#fff',fontFamily:font.head,flexShrink:0,letterSpacing:'-0.5px'}}>SB</div>
            <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:21,letterSpacing:-0.5,lineHeight:1.1,whiteSpace:'nowrap'}}>Stage<span style={{background:'linear-gradient(135deg,#a78bfa,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Boss</span></div>
          </div>
          <div style={{fontSize:9,color:C.muted,letterSpacing:1.5,textTransform:'uppercase',marginTop:3,paddingLeft:2}}>Booking Command Center</div>
        </div>
        {/* Sidebar nav */}
        {[
          ['today','📋','Today','Dashboard'],
          ['venues','🏛️','Venues','CRM Pipeline'],
          ['outreach','✉️','Outreach','Email & Contact'],
          ['tours','🚌','Tours','Routing & P&L'],
          ['calendar','📅','Calendar','Schedule'],
          ['analytics','📊','Analytics','Revenue & Stats'],
          ['smartboss','🧠','SmartBoss AI','Tour Intelligence'],
        ].map(([t,icon,label,sub])=>(
          <div key={t} onClick={()=>setTab(t)} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',borderRadius:11,marginBottom:3,cursor:'pointer',background:tab===t?'rgba(124,58,237,0.12)':'transparent',border:`1px solid ${tab===t?'rgba(124,58,237,0.35)':'transparent'}`,color:tab===t?C.acc3:C.muted,transition:'all 0.15s ease',position:'relative'}}>
            <span style={{fontSize:16,width:20,textAlign:'center',flexShrink:0}}>{icon}</span>
            <div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:tab===t?700:500,fontSize:13,lineHeight:1}}>{label}</div>
              <div style={{fontSize:9,color:tab===t?C.acc2:C.muted,marginTop:1,letterSpacing:'0.04em'}}>{sub}</div>
            </div>
            {tab===t&&<div style={{position:'absolute',left:0,top:'50%',transform:'translateY(-50%)',width:3,height:20,background:'linear-gradient(180deg,#a78bfa,#ec4899)',borderRadius:'0 3px 3px 0'}}/>}
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
          <button onClick={async()=>{
            setSyncing(true);
            try{
              const returnedAt=await cloudPush(OWNER_EMAIL,venues,templates,tours,comedians);
              localVersionRef.current=returnedAt||new Date().toISOString();
              setLastSync(new Date());
              setSyncError(null);
              setLastPushStatus('manual ok @ '+new Date().toLocaleTimeString());
              toast2('Saved to cloud!');
            }catch(e){setSyncError(e.message);setLastPushStatus('error: '+e.message);toast2('Sync failed: '+e.message);}
            setSyncing(false);
          }} style={{...s.btn('rgba(0,184,148,0.1)',C.green,'rgba(0,184,148,0.25)'),flex:1,fontSize:10}}>
            {syncing?'Syncing...':'Sync Now'}
          </button>
        </div>
        <div style={{fontSize:9,textAlign:'center',marginBottom:4,color:syncError?C.red:C.muted,cursor:'pointer'}} onClick={()=>setDebugPanel(v=>!v)}>
          {syncError?'⚠ Sync error (tap for details)':'✓ Sync: '+(lastSync?lastSync.toLocaleTimeString():'never')} {debugPanel?'▲':'▼'}
        </div>
        {debugPanel&&<div style={{background:'#0a0a18',border:'1px solid #2d2d50',borderRadius:6,padding:8,marginBottom:6,fontSize:9,color:C.muted,lineHeight:1.8}}>
          <div style={{color:C.acc2,fontWeight:700,marginBottom:4}}>🔧 SYNC DEBUG</div>
          <div><b>Build:</b> {BUILD_ID}</div>
          <div><b>Email:</b> {user}</div>
          <div><b>SB:</b> {SB_URL.slice(8,30)}...</div>
          <div><b>Local venues:</b> {venues.length}</div>
          <div><b>Cloud venues:</b> {cloudVenueCount??'unknown'}</div>
          <div><b>Last push:</b> {lastPushStatus}</div>
          <div><b>Last fetch:</b> {lastFetchStatus}</div>
          <div><b>Cloud ver:</b> {cloudVersion?new Date(cloudVersion).toLocaleTimeString():'none'}</div>
          {syncError&&<div style={{color:C.red,wordBreak:'break-all',marginTop:4}}><b>Error:</b> {syncError}</div>}
        </div>}
        <button onClick={()=>{
            ['sb_user','sb_venues','sb_templates','sb_tours'].forEach(k=>{try{localStorage.removeItem(k);}catch{}});
            window.location.reload();
          }} style={{...s.btn('none',C.yellow,C.bord),width:'100%',fontSize:11,marginBottom:6}}>Reset Cache</button>
          <button onClick={onLogout} style={{...s.btn('none',C.muted,C.bord),width:'100%',fontSize:11}}>Sign Out</button>
      </div>

      {/* MAIN CONTENT */}
      <div className="sb-main">

      {/* HEADER */}
      <div className="sb-mobile-header" style={s.header}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
          <div onClick={()=>setTab('today')} style={{cursor:'pointer'}}>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <div style={{width:36,height:36,borderRadius:8,background:'linear-gradient(135deg,#6c5ce7,#a29bfe)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:12,color:'#fff',fontFamily:font.head,flexShrink:0,letterSpacing:'-0.5px'}}>SB</div>
              <div style={{fontFamily:font.head,fontWeight:800,fontSize:24,letterSpacing:-1,lineHeight:1}}>Stage<span style={{color:C.acc2}}>Boss</span></div>
            </div>
            <div style={{fontSize:9,color:C.muted,letterSpacing:2,textTransform:'uppercase',marginTop:3}}>Comedy Booking Command Center</div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <button onClick={async()=>{setSyncing(true);try{const r=await cloudPush(OWNER_EMAIL,venues,templates,tours,comedians);localVersionRef.current=r||new Date().toISOString();setLastSync(new Date());toast2('Synced!');}catch(e){toast2('Failed: '+e.message);}setSyncing(false);}} style={{padding:'6px 10px',borderRadius:8,border:'1px solid rgba(0,184,148,0.4)',background:'rgba(0,184,148,0.1)',color:C.green,fontSize:10,cursor:'pointer',fontFamily:font.body,marginRight:6}}>{syncing?'...':'Sync'}</button>
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
        {tab==='today'&&<div style={{padding:'14px 14px 100px',overflowY:'auto',WebkitOverflowScrolling:'touch'}}>
          {/* HEADER */}
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:font.head,fontWeight:900,fontSize:22,letterSpacing:-0.5,marginBottom:2}}>
              {(()=>{const h=new Date().getHours();return h<12?'Good morning':h<17?'Good afternoon':'Good evening';})()}, Jason 👋
            </div>
            <div style={{fontSize:12,color:C.muted3}}>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</div>
          </div>

          {/* INCOME GOAL BANNER */}
          {(()=>{
            const thisYear=new Date().getFullYear().toString();
            const confirmed=venues.filter(v=>{
              if(!['Confirmed','Advancing','Completed'].includes(v.status)) return false;
              // Filter to current year using confirmedViaEmailDate, showDate, or include if no date set
              const d=v.confirmedViaEmailDate||v.showDate||'';
              return !d||d.startsWith(thisYear);
            });
            const projectedGross=confirmed.reduce((a,v)=>a+(parseFloat(v.guarantee)||0),0);
            const merchTotal=confirmed.reduce((a,v)=>a+(parseFloat(v.settlement?.merchNet)||0),0);
            const totalRevenue=projectedGross+merchTotal;
            const pct=totalRevenue>0?Math.min(100,Math.round((totalRevenue/Math.max(totalRevenue*1.25,10000))*100)):0;
            return <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(236,72,153,0.06))',border:`1px solid ${C.acc}30`,borderRadius:14,padding:16,marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:8}}>
                <div>
                  <div style={{fontSize:10,color:C.acc2,letterSpacing:'0.1em',textTransform:'uppercase',fontWeight:700}}>Revenue Tracker — {new Date().getFullYear()}</div>
                  <div style={{fontFamily:font.head,fontWeight:900,fontSize:24,color:C.green}}>${projectedGross.toLocaleString()}</div>
                  <div style={{fontSize:11,color:C.muted3}}>{confirmed.length} confirmed shows{merchTotal>0?` · $${merchTotal.toLocaleString()} merch`:''}</div>
                </div>
                <div style={{fontSize:24,fontWeight:900,fontFamily:font.head,color:pct>=100?C.green:C.acc2}}>{pct>0?pct+'%':'—'}</div>
              </div>
              <div style={{background:C.bord,borderRadius:99,height:6,overflow:'hidden'}}>
                <div style={{background:`linear-gradient(90deg,${C.acc},${C.green})`,height:'100%',width:pct+'%',borderRadius:99,transition:'width 0.5s ease'}}/>
              </div>
              <button onClick={()=>setRosterOpen(true)}
                style={{marginTop:8,background:'linear-gradient(135deg,#10101e,#16162e)',color:'#a78bfa',border:'1px solid #2a2a50',borderRadius:8,padding:'10px 16px',fontSize:12,fontWeight:700,cursor:'pointer',width:'100%'}}>
                🎭 Comedian Roster &amp; Bookouts
              </button>
              <button onClick={()=>printExport('pnl',{tours,venues,year:new Date().getFullYear()})}
                style={{marginTop:12,background:'linear-gradient(135deg,#7c3aed,#ec4899)',color:'#fff',border:'none',borderRadius:8,padding:'8px 16px',fontSize:11,fontWeight:700,cursor:'pointer',width:'100%'}}>
                📊 Export P&amp;L Statement
              </button>
            </div>;
          })()}

          {/* DEAL EXPIRY WARNINGS */}
          {expiringDeals.length>0&&<div style={{background:'rgba(249,202,36,0.07)',border:'1px solid rgba(249,202,36,0.25)',borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:10,color:C.yellow,letterSpacing:'0.1em',textTransform:'uppercase',fontWeight:700,marginBottom:8}}>🔥 Deals Going Cold · {expiringDeals.length}</div>
            {expiringDeals.map(v=>{
              const log=v.contactLog||[];
              const last=new Date(log[log.length-1].date);
              const days=Math.floor((Date.now()-last)/(1000*60*60*24));
              return<div key={v.id} onClick={()=>setComposeId(v.id)} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:`1px solid rgba(249,202,36,0.1)`,cursor:'pointer'}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{v.venue}</div>
                  <div style={{fontSize:11,color:C.muted3}}>{v.status} · No contact for {days} days</div>
                </div>
                <span style={{fontSize:11,color:C.yellow,fontWeight:700}}>Follow Up →</span>
              </div>;
            })}
          </div>}

          {/* WINS FEED */}
          {winsHistory.length>0&&<div style={{background:'rgba(0,184,148,0.06)',border:'1px solid rgba(0,184,148,0.2)',borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:10,color:C.green,letterSpacing:'0.1em',textTransform:'uppercase',fontWeight:700,marginBottom:8}}>🏆 Recent Wins</div>
            {winsHistory.slice(0,3).map(w=><div key={w.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:`1px solid rgba(0,184,148,0.1)`}}>
              <div>
                <div style={{fontSize:13,fontWeight:600}}>{w.venue} ✓</div>
                <div style={{fontSize:11,color:C.muted3}}>{w.city}, {w.state} · {w.date}</div>
              </div>
              {w.guarantee>0&&<span style={{fontSize:13,color:C.green,fontWeight:700}}>{fmt$(w.guarantee)}</span>}
            </div>)}
          </div>}

          {/* DAILY CONTACT LIST */}
          {(()=>{
            const today=new Date();
            today.setHours(0,0,0,0);
            const priorityScore=(v)=>{
              let score=0;
              if(v.nextFollowUp&&new Date(v.nextFollowUp)<=today) score+=100;
              const w={'Hot':40,'Warm':20,'Established':30,'Cold':5};
              score+=w[v.warmth]||0;
              const p={'Negotiating':35,'Responded':30,'Follow-Up':25,'Contacted':15,'Lead':5,'Hold':10};
              score+=p[v.status]||0;
              return score;
            };
            const due=venues.filter(v=>v.status!=='Completed'&&v.status!=='Lost'&&(
              !v.nextFollowUp||(new Date(v.nextFollowUp)<=new Date())
            )).sort((a,b)=>priorityScore(b)-priorityScore(a)).slice(0,5);
            if(!due.length) return null;
            return <div style={{marginBottom:16}}>
              <div style={{fontSize:10,color:C.orange,letterSpacing:'0.1em',textTransform:'uppercase',fontWeight:700,marginBottom:10}}>⚡ Contact Today · {due.length}</div>
              {due.map(v=>{
                const touches=(v.contactLog||[]).length;
                const tmpl=touches>0?DEFAULT_TEMPLATES.find(t=>t.id==='tmpl_followup_1'):DEFAULT_TEMPLATES[0];
                return <div key={v.id} style={{background:C.surf,border:`1px solid ${C.bord}`,borderLeft:`3px solid ${PIPE_COLORS[v.status]||C.acc}`,borderRadius:12,padding:'12px 14px',marginBottom:8}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13}}>{v.venue}</div>
                      <div style={{fontSize:11,color:C.muted3}}>{v.city}, {v.state} · {v.status} · Touch #{touches+1}</div>
                    </div>
                    <div style={{display:'flex',gap:6,flexShrink:0}}>
                      <button onClick={()=>{setComposeId(v.id);}} style={{...s.btn(C.acc,C.txt,'transparent'),fontSize:11,padding:'5px 10px',fontWeight:700}}>✉️ Compose</button>
                      <button onClick={()=>setDetailId(v.id)} style={{...s.btn(C.surf2,C.muted3,C.bord2),fontSize:11,padding:'5px 10px'}}>View</button>
                    </div>
                  </div>
                </div>;
              })}
            </div>;
          })()}

          {/* STAT CARDS */}
          <div style={{...s.grid2,marginBottom:16}}>
            {[
              {label:'Total Venues',value:venues.length,color:C.acc2,icon:'🏛️'},
              {label:'In Pipeline',value:venues.filter(v=>!['Lead','Lost','Completed'].includes(v.status)).length,color:C.green,icon:'📈'},
              {label:'Confirmed',value:venues.filter(v=>v.status==='Confirmed'||v.status==='Advancing').length,color:C.yellow,icon:'✅'},
              {label:'Follow Up',value:venues.filter(v=>v.nextFollowUp&&isOverdue(v.nextFollowUp)).length,color:C.orange,icon:'⚡'},
            ].map(stat=>(
              <div key={stat.label} style={{...s.stat(stat.color),textAlign:'center'}}>
                <div style={{fontSize:22,marginBottom:4}}>{stat.icon}</div>
                <div style={{fontFamily:font.head,fontWeight:900,fontSize:26,color:stat.color}}>{stat.value}</div>
                <div style={{fontSize:10,color:C.muted3,textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:600}}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div style={{...s.grid2}}>
            {[
              {label:'Add Venue',icon:'➕',color:C.acc,action:()=>setAddOpen(true)},
              {label:'Browse 150+',icon:'🏛️',color:C.blue,action:()=>setDbOpen(true)},
              {label:'Plan Tour',icon:'🗺️',color:C.green,action:()=>setTab('tours')},
              {label:'View Calendar',icon:'📅',color:C.yellow,action:()=>setTab('calendar')},
            ].map(a=>(
              <button key={a.label} onClick={a.action} style={{...s.btn(a.color+'15',a.color,a.color+'40'),padding:'14px 10px',flexDirection:'column',gap:6,fontSize:11,fontWeight:700,borderRadius:12,height:70}}>
                <span style={{fontSize:22}}>{a.icon}</span>{a.label}
              </button>
            ))}
          </div>
        </div>}

                {tab==='venues'&&<>
          <div style={{padding:'20px 20px 0',borderBottom:`1px solid ${C.bord}`,paddingBottom:16}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:900,fontSize:22,letterSpacing:-0.5}}>Venues</div>
                <div style={{fontSize:11,color:C.muted3,marginTop:2}}>{venues.length} total · {venues.filter(v=>v.status!=='Lead'&&v.status!=='Lost').length} active</div>
              </div>
              <button onClick={()=>setAddOpen(true)} style={{...s.btn('linear-gradient(135deg,#7c3aed,#ec4899)',C.txt,'transparent'),padding:'10px 18px',fontSize:12,fontWeight:700,boxShadow:'0 4px 20px rgba(124,58,237,0.3)'}}>
                + Add Venue
              </button>
            </div>
            <input style={{...s.input(),background:C.surf2,marginBottom:8}} placeholder="🔍  Search venues, cities, bookers, states..." value={search} onChange={e=>setSearch(e.target.value)}/>
            <div style={{display:'flex',gap:6,marginBottom:10}}>
              <select value={stateFilter} onChange={e=>{setStateFilter(e.target.value);setCityFilter('All');}} style={{...s.select,flex:1,padding:'7px 10px',fontSize:12}}>
                {stateOptions.map(s=><option key={s} value={s}>{s==='All'?'All States':s}</option>)}
              </select>
              <select value={cityFilter} onChange={e=>setCityFilter(e.target.value)} style={{...s.select,flex:1,padding:'7px 10px',fontSize:12}} disabled={stateFilter==='All'}>
                {cityOptions.map(c=><option key={c} value={c}>{c==='All'?'All Cities':c}</option>)}
              </select>
              {(stateFilter!=='All'||cityFilter!=='All')&&<button onClick={()=>{setStateFilter('All');setCityFilter('All');}} style={{...s.btn(C.orange+'20',C.orange,C.orange+'40'),padding:'7px 10px',fontSize:11,fontWeight:700,flexShrink:0}}>✕ Reset</button>}
            </div>
            <div style={{display:'flex',gap:6,overflowX:'auto',scrollbarWidth:'none',paddingBottom:2}}>
              {['All',...PIPELINE].map(st=>{
                const color=PIPE_COLORS[st]||C.acc;
                const active=st===statusFilter;
                const count=st==='All'?venues.length:venues.filter(v=>v.status===st).length;
                return <div key={st} onClick={()=>setStatusFilter(st)} style={{...s.pill(active,color),display:'flex',alignItems:'center',gap:5}}>
                  {st} {count>0&&<span style={{fontSize:9,opacity:0.7}}>{count}</span>}
                </div>;
              })}
            </div>
          </div>
          <div style={{padding:'12px 20px 40px',overflowY:'auto'}}>
            {filtered.map(v=>{
              const pcolor=PIPE_COLORS[v.status]||C.muted;
              const overdue=v.nextFollowUp&&isOverdue(v.nextFollowUp);
              const touchCount=(v.contactLog||[]).length;
              const warmthColor={'Cold':C.blue,'Warm':C.yellow,'Hot':C.orange,'Established':C.green}[v.warmth]||C.muted;
              return <div key={v.id} className="sb-card" onClick={()=>setDetailId(v.id)} style={{background:C.surf,border:`1px solid ${C.bord}`,borderLeft:`3px solid ${pcolor}`,borderRadius:12,padding:'14px 16px',marginBottom:8,cursor:'pointer',position:'relative'}}>
                {overdue&&<div style={{position:'absolute',top:10,right:10,width:8,height:8,borderRadius:'50%',background:C.red,boxShadow:`0 0 8px ${C.red}`}}/>}
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:8}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:14,color:C.txt,marginBottom:3,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{v.venue}</div>
                    <div style={{fontSize:12,color:C.muted3,marginBottom:8}}>{v.city}, {v.state}{v.venueType&&<span style={{color:C.muted,marginLeft:4}}>· {v.venueType}</span>}</div>
                    <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                      <span style={s.badge(pcolor)}>{v.status}</span>
                      {v.warmth&&<span style={s.badge(warmthColor)}>{v.warmth}</span>}
                      {v.capacity>0&&<span style={{fontSize:10,color:C.muted2,fontWeight:500}}>Cap: {v.capacity.toLocaleString()}</span>}
                      {v.guarantee>0&&['Confirmed','Advancing','Completed'].includes(v.status)&&<span style={{fontSize:10,color:C.green,fontWeight:600}}>${v.guarantee.toLocaleString()}</span>}
                      {touchCount>0&&<span style={{fontSize:10,color:C.muted2}}>💬 {touchCount} touch{touchCount!==1?'es':''}</span>}
                    </div>
                  </div>
                  <div style={{flexShrink:0,textAlign:'right'}}>
                    {v.booker&&<div style={{fontSize:11,color:C.muted3,marginBottom:2}}>{v.booker}</div>}
                    {v.nextFollowUp&&<div style={{fontSize:10,color:overdue?C.red:C.muted2,fontWeight:overdue?700:400}}>{overdue?'⚡ Overdue':new Date(v.nextFollowUp).toLocaleDateString()}</div>}
                  </div>
                </div>
              </div>;
            })}
          </div>
        </>}

        {/* == CALENDAR TAB == */}
        {tab==='calendar'&&<CalendarTab venues={venues} tours={tours} onVenueClick={id=>setDetailId(id)} onChecklist={id=>setChecklistId(id)} toast2={toast2} comedians={comedians}/>}

        {/* == OUTREACH TAB == */}
        {tab==='outreach'&&<div style={{padding:'14px 14px 100px'}}>
          {/* OUTREACH HEADER */}
          <div style={{marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:4}}>
              <div style={{fontFamily:font.head,fontWeight:900,fontSize:22,letterSpacing:-0.5}}>Outreach</div>
              <button onClick={()=>setHotSheet(h=>!h)} style={{...s.btn(hotSheet?'rgba(249,202,36,0.2)':C.surf2,hotSheet?C.yellow:C.muted,hotSheet?'rgba(249,202,36,0.4)':C.bord),padding:'6px 12px',fontSize:11,fontWeight:700,flexShrink:0}}>{hotSheet?'🔥 Hot Sheet ON':'🔥 Hot Sheet'}</button>
            </div>
            <div style={{fontSize:12,color:C.muted3}}>{hotSheet?'Live deals only — Responding & Negotiating':'Email your venue contacts with AI-powered drafts'}</div>
            {venues.filter(v=>v.emailBounced).length>0&&(
              <div style={{marginTop:10,background:'rgba(225,112,85,0.08)',border:'1px solid rgba(225,112,85,0.25)',borderRadius:10,padding:'10px 14px',display:'flex',alignItems:'center',gap:10}}>
                <span style={{fontSize:16}}>⚠️</span>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:'#e17055'}}>{venues.filter(v=>v.emailBounced).length} venues with bounced emails</div>
                  <div style={{fontSize:11,color:C.muted3}}>Marked in red below — update their email before sending</div>
                </div>
              </div>
            )}
          </div>

          {/* HOT SHEET VIEW */}
          {hotSheet&&<div style={{marginBottom:16}}>
            <div style={{fontSize:10,color:C.yellow,letterSpacing:'0.1em',textTransform:'uppercase',fontWeight:700,marginBottom:10}}>🔥 Live Deals — Close These Now</div>
            {venues.filter(v=>['Negotiating','Responded','Hold'].includes(v.status)).sort((a,b)=>(b.guarantee||0)-(a.guarantee||0)).map(v=>{
              const score=momentumScore(v);
              const log=v.contactLog||[];
              const lastDate=log.length?log[log.length-1].date:null;
              const daysSince=lastDate?Math.floor((Date.now()-new Date(lastDate))/(1000*60*60*24)):null;
              return<div key={v.id} onClick={()=>setComposeId(v.id)} style={{...s.card(),padding:'12px 14px',marginBottom:8,cursor:'pointer',borderColor:'rgba(249,202,36,0.2)'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{v.venue}</div>
                    <div style={{fontSize:11,color:C.muted3}}>{v.city}, {v.state} · {v.status} · {log.length} touches</div>
                    {daysSince!==null&&<div style={{fontSize:10,color:daysSince>14?C.red:daysSince>7?C.yellow:C.green,marginTop:2}}>{daysSince===0?'Contacted today':`Last contact: ${daysSince}d ago`}</div>}
                  </div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:4}}>
                    {v.guarantee>0&&<span style={{fontSize:12,color:C.green,fontWeight:700}}>{fmt$(v.guarantee)}</span>}
                    <div style={{display:'flex',alignItems:'center',gap:4}}>
                      <div style={{width:40,height:4,background:C.bord,borderRadius:2,overflow:'hidden'}}>
                        <div style={{height:'100%',width:score+'%',background:score>70?C.green:score>40?C.yellow:C.orange,borderRadius:2}}/>
                      </div>
                      <span style={{fontSize:9,color:C.muted}}>{score}</span>
                    </div>
                  </div>
                </div>
              </div>;
            })}
            {venues.filter(v=>['Negotiating','Responded','Hold'].includes(v.status)).length===0&&
              <div style={{textAlign:'center',padding:'20px 0',color:C.muted,fontSize:13}}>No active deals yet — keep outreaching!</div>}
          </div>}

          {/* VENUE LIST FOR OUTREACH */}
          {!hotSheet&&<>
          <div style={{fontSize:11,color:C.muted2,letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:700,marginBottom:12}}>All Venues by Priority</div>
          {['Hot','Warm','Cold','Established'].map(warmth=>{
            const group=venues.filter(v=>v.warmth===warmth).sort((a,b)=>{
              const overA=a.nextFollowUp&&isOverdue(a.nextFollowUp)?-1:0;
              const overB=b.nextFollowUp&&isOverdue(b.nextFollowUp)?-1:0;
              return overA-overB;
            });
            if(!group.length) return null;
            const wColor={'Hot':C.orange,'Warm':C.yellow,'Cold':C.blue,'Established':C.green}[warmth]||C.muted;
            return<div key={warmth} style={{marginBottom:16}}>
              <div style={{...s.badge(wColor),marginBottom:8,fontSize:11}}>{warmth} · {group.length}</div>
              {group.map(v=>{
                const overdue=v.nextFollowUp&&isOverdue(v.nextFollowUp);
                const bounced=v.emailBounced;
                return<div key={v.id} style={{...s.card(),padding:'12px 16px',marginBottom:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between',borderColor:bounced?'rgba(225,112,85,0.4)':undefined,background:bounced?'rgba(225,112,85,0.04)':undefined}}
                  onClick={()=>setComposeId(v.id)}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,display:'flex',alignItems:'center',gap:6}}>
                      {v.venue}
                      {bounced&&<span style={{fontSize:9,fontWeight:700,color:'#e17055',background:'rgba(225,112,85,0.15)',border:'1px solid rgba(225,112,85,0.3)',borderRadius:4,padding:'1px 5px',letterSpacing:'0.05em'}}>BOUNCED</span>}
                    </div>
                    <div style={{fontSize:11,color:C.muted3}}>{v.city}, {v.state} · {v.status} · {(v.contactLog||[]).length} touches</div>
                    {bounced&&v.email&&<div style={{fontSize:10,color:'#e17055',marginTop:2}}>✗ {v.email}</div>}
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    {overdue&&<span style={s.badge(C.red)}>⚡ Due</span>}
                    {bounced&&<span style={{...s.badge('#e17055'),fontSize:9}}>⚠️ Fix Email</span>}
                    <span style={{fontSize:18,color:C.acc2}}>›</span>
                  </div>
                </div>;
              })}
            </div>;
          })}
          </>
          }
        </div>}

        {tab==='tours'&&<div style={{padding:'14px 14px 100px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
            <div>
              <div style={{fontFamily:font.head,fontWeight:900,fontSize:22,letterSpacing:-0.5}}>Tours & Route Planner</div>
              <div style={{fontSize:12,color:C.muted3,marginTop:2}}>{tours.length} tour{tours.length!==1?'s':''} · {routeStops.length} stops in current route</div>
            </div>
            <button onClick={()=>{setEditTourId(null);setTourOpen(true);}} style={{...s.btn('linear-gradient(135deg,#7c3aed,#ec4899)',C.txt,'transparent'),padding:'10px 18px',fontWeight:700,fontSize:12,boxShadow:'0 4px 20px rgba(124,58,237,0.3)'}}>+ New Tour</button>
          </div>
          {/* ROUTE PLANNER */}
          <div style={{background:C.surf,border:`1px solid ${C.bord}`,borderRadius:14,padding:18,marginBottom:20}}>
            <div style={{fontSize:11,color:C.muted2,letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:700,marginBottom:12}}>🗺️ Route Planner</div>
            {routeStops.length===0?(
              <div style={{textAlign:'center',padding:'16px 0',color:C.muted3}}>
                <div style={{fontSize:11}}>Open any venue → tap "Add to Route" to build your route</div>
              </div>
            ):(
              <div>
                {routeStops.map((stop,i)=>(
                  <div key={stop.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:`1px solid ${C.bord}`}}>
                    <div style={{width:22,height:22,borderRadius:'50%',background:`${C.acc}20`,border:`1px solid ${C.acc}50`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:C.acc2,flexShrink:0}}>{i+1}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600}}>{stop.venue}</div>
                      <div style={{fontSize:11,color:C.muted3}}>{stop.city}, {stop.state}{stop.guarantee>0?' · '+fmt$(stop.guarantee):''}</div>
                    </div>
                    <button onClick={()=>setRouteStops(prev=>prev.filter((_,j)=>j!==i))} style={{...s.btn(C.surf2,C.red,C.bord2),padding:'4px 8px',fontSize:10}}>✕</button>
                  </div>
                ))}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12,paddingTop:10,borderTop:`1px solid ${C.bord}`}}>
                  <div style={{fontSize:12,color:C.green,fontWeight:600}}>
                    Total Guaranteed: {fmt$(routeStops.reduce((a,b)=>a+(parseFloat(b.guarantee)||0),0))} · {routeStops.length} shows
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>window.open('https://www.google.com/maps/dir/'+routeStops.map(s=>encodeURIComponent(s.city+', '+s.state)).join('/'))} style={{...s.btn(C.blue,C.txt,'transparent'),fontWeight:700,fontSize:11}}>🗺️ Google Maps</button>
                    <button onClick={()=>setRouteStops([])} style={{...s.btn(C.surf2,C.muted,C.bord2),fontSize:11}}>Clear</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {tours.length===0&&<div style={{textAlign:'center',padding:'40px 20px',color:C.muted}}><div style={{fontSize:36,marginBottom:12}}>[bus]</div><div style={{marginBottom:16}}>No tours yet</div><button onClick={()=>{setEditTourId(null);setTourOpen(true);}} style={{...s.btn(C.acc,'#fff',null),display:'inline-flex',width:'auto',padding:'12px 20px'}}>Create First Tour</button></div>}
          {tours.map(tour=>{
            const totalGuarantee=(tour.dates||[]).reduce((a,d)=>a+(Number(d.guarantee)||0),0);
            const totalExpenses=(Number(tour.travelBudget)||0)+(Number(tour.lodgingBudget)||0)+(Number(tour.miscBudget)||0);
            const netRevenue=totalGuarantee*0.75-totalExpenses;
            const isExpanded=expandTourId===tour.id;
            const sortedDates=(tour.dates||[]).slice().sort((a,b)=>new Date(a.date)-new Date(b.date));
            return<div key={tour.id} style={{...s.card(),cursor:'default'}}>
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
                          {d.city&&sortedDates[i+1]&&sortedDates[i+1].city&&<a href={'https://www.google.com/maps/dir/'+encodeURIComponent(d.address?d.address+(d.zip?' '+d.zip:'')+', '+d.city+', '+d.state:d.city+(d.state?','+d.state:''))+'/'+encodeURIComponent(sortedDates[i+1].address?sortedDates[i+1].address+', '+sortedDates[i+1].city+', '+sortedDates[i+1].state:sortedDates[i+1].city+(sortedDates[i+1].state?','+sortedDates[i+1].state:''))} target="_blank" rel="noopener noreferrer" style={{fontSize:9,padding:'2px 7px',borderRadius:6,background:'rgba(108,92,231,0.1)',color:C.acc2,border:'1px solid rgba(108,92,231,0.3)',textDecoration:'none',cursor:'pointer'}}>Map to next stop</a>}
                        </div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();setEditTourDateId({tourId:tour.id,dateId:d.id});}} style={{...s.btn(C.surf2,C.acc2,C.bord),fontSize:10,padding:'5px 10px',flexShrink:0,minHeight:36}}>✏️</button>
                    </div>
                  </div>
                ))}
                {sortedDates.filter(d=>d.city).length>1&&<a href={'https://www.google.com/maps/dir/'+sortedDates.filter(d=>d.city).map(d=>encodeURIComponent(d.city+(d.state?','+d.state:''))).join('/')} target="_blank" rel="noopener noreferrer" style={{display:'block',marginTop:12,padding:'8px 12px',borderRadius:8,background:'rgba(108,92,231,0.1)',border:'1px solid rgba(108,92,231,0.3)',color:C.acc2,textDecoration:'none',textAlign:'center',fontSize:11,fontFamily:font.head,fontWeight:700}}>View Full Route on Google Maps</a>}
              <div style={{display:'flex',gap:8,marginTop:14}}>
                <button onClick={e=>{e.stopPropagation();printExport('tour',{tour,tours,venues,year:new Date().getFullYear()});}}
                  style={{flex:1,background:'rgba(0,184,148,0.12)',color:'#00b894',border:'1px solid rgba(0,184,148,0.3)',borderRadius:8,padding:'8px 10px',fontSize:11,fontWeight:700,cursor:'pointer'}}>
                  📋 Tour Schedule
                </button>
                <button onClick={e=>{e.stopPropagation();printExport('forecast',{tour,tours,venues,year:new Date().getFullYear()});}}
                  style={{flex:1,background:'rgba(108,92,231,0.1)',color:'#7c3aed',border:'1px solid rgba(108,92,231,0.3)',borderRadius:8,padding:'8px 10px',fontSize:11,fontWeight:700,cursor:'pointer'}}>
                  📈 Revenue Forecast
                </button>
              </div>
              </div>}
            </div>;
          })}
        </div>}



      {/* == TOUR DATE EDIT PANEL == */}
      {editTourDateId&&(()=>{
        const td_tour=tours.find(t=>t.id===editTourDateId.tourId);
        if(!td_tour) return null;
        const td_date=td_tour.dates?.find(d=>d.id===editTourDateId.dateId);
        if(!td_date) return null;
        function updTourDate(fields){
          const newDates=td_tour.dates.map(d=>d.id===editTourDateId.dateId?{...d,...fields}:d);
          saveTour({...td_tour,dates:newDates});
        }
        const d=td_date;
        return <Panel open={!!editTourDateId} onClose={()=>setEditTourDateId(null)} title={d.venue||'Edit Show Date'}>
          <div style={{fontSize:10,color:C.muted,marginBottom:16}}>{td_tour.name} · tap a field to edit · saves instantly</div>

          <div style={s.field()}><label style={s.label}>Venue</label><input style={s.input()} value={d.venue||''} onChange={e=>updTourDate({venue:e.target.value})} placeholder="Venue name"/></div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>City</label><input style={s.input()} value={d.city||''} onChange={e=>updTourDate({city:e.target.value})}/></div>
            <div style={s.field()}><label style={s.label}>State</label><input style={s.input()} value={d.state||''} onChange={e=>updTourDate({state:e.target.value})}/></div>
          </div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>Address</label><input style={s.input()} value={d.address||''} onChange={e=>updTourDate({address:e.target.value})}/></div>
            <div style={s.field()}><label style={s.label}>Zip</label><input style={s.input()} value={d.zip||''} onChange={e=>updTourDate({zip:e.target.value})}/></div>
          </div>
          <div style={s.field()}><label style={s.label}>📅 Show Date</label><input type="date" style={s.input()} value={d.date||''} onChange={e=>updTourDate({date:e.target.value})}/></div>

          <div style={{height:1,background:C.bord,margin:'4px 0 14px'}}/>

          <div style={s.field()}><label style={s.label}>Deal Type</label>
            <select style={s.select} value={d.dealType||'Flat Guarantee'} onChange={e=>updTourDate({dealType:e.target.value})}>
              <option>Flat Guarantee</option><option>Versus Deal</option><option>Door Deal</option><option>Guarantee + Bonus</option><option>Free Show</option>
            </select>
          </div>
          {(d.dealType==='Flat Guarantee'||d.dealType==='Guarantee + Bonus'||d.dealType==='Versus Deal'||!d.dealType)&&
            <div style={s.field()}><label style={s.label}>Guarantee ($)</label><input type="number" style={s.input()} value={d.guarantee||''} placeholder="0" onChange={e=>updTourDate({guarantee:Number(e.target.value)||0})}/></div>}
          {d.dealType==='Versus Deal'&&<div style={s.field()}><label style={s.label}>Venue Minimum ($)</label><input type="number" style={s.input()} value={d.venueMin||''} onChange={e=>updTourDate({venueMin:Number(e.target.value)||0})}/></div>}
          {d.dealType==='Door Deal'&&<div style={s.field()}><label style={s.label}>Door Split (e.g. 70/30)</label><input style={s.input()} value={d.doorSplit||''} onChange={e=>updTourDate({doorSplit:e.target.value})}/></div>}
          {d.dealType==='Guarantee + Bonus'&&<div style={s.field()}><label style={s.label}>Bonus Threshold / Notes</label><input style={s.input()} value={d.bonusNotes||''} onChange={e=>updTourDate({bonusNotes:e.target.value})}/></div>}
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>Ticket Price ($)</label><input type="number" style={s.input()} value={d.ticketPrice||''} onChange={e=>updTourDate({ticketPrice:Number(e.target.value)||0})}/></div>
            <div style={s.field()}><label style={s.label}>Shows</label><input type="number" style={s.input()} value={d.showCount||1} onChange={e=>updTourDate({showCount:Number(e.target.value)||1})}/></div>
          </div>
          <div style={s.field()}><label style={s.label}>Status</label>
            <select style={s.select} value={d.status||'Hold'} onChange={e=>updTourDate({status:e.target.value})}>
              <option>Hold</option><option>Confirmed</option><option>Advancing</option><option>Completed</option><option>Cancelled</option>
            </select>
          </div>
          <div style={s.field()}><label style={s.label}>Deal Notes</label><input style={s.input()} value={d.notes||''} placeholder="Full terms, notes..." onChange={e=>updTourDate({notes:e.target.value})}/></div>

          <div style={{height:1,background:C.bord,margin:'4px 0 14px'}}/>

          {/* COMEDIAN PAYOUTS */}
          <div style={{fontSize:10,color:C.acc2,fontWeight:700,letterSpacing:'0.1em',marginBottom:10}}>🎭 COMEDIAN PAYOUTS</div>
          {comedians.filter(c=>c.active).map(co=>{
            const payout=(d.comedianPayouts||[]).find(p=>p.comedianId===co.id)||{comedianId:co.id,name:co.name,role:co.role,projected:co.defaultFee||0,actual:0,onThisDate:co.role==='Headliner'};
            return <div key={co.id} style={{marginBottom:10,padding:10,background:C.surf2,borderRadius:8}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:payout.onThisDate?8:0}}>
                <input type="checkbox" checked={!!payout.onThisDate} onChange={e=>{
                  const payouts=(d.comedianPayouts||[]).filter(p=>p.comedianId!==co.id);
                  updTourDate({comedianPayouts:[...payouts,{...payout,onThisDate:e.target.checked}]});
                }}/>
                <span style={{fontWeight:700,fontSize:12}}>{co.name}</span>
                <span style={{fontSize:10,color:C.muted}}>{co.role}</span>
              </div>
              {payout.onThisDate&&<div style={s.grid2}>
                <div style={s.field()}><label style={s.label}>Projected ($)</label><input type="number" style={s.input()} value={payout.projected||''} placeholder="0" onChange={e=>{
                  const payouts=(d.comedianPayouts||[]).filter(p=>p.comedianId!==co.id);
                  updTourDate({comedianPayouts:[...payouts,{...payout,projected:Number(e.target.value)||0}]});
                }}/></div>
                <div style={s.field()}><label style={s.label}>Actual Paid ($)</label><input type="number" style={s.input()} value={payout.actual||''} placeholder="0" onChange={e=>{
                  const payouts=(d.comedianPayouts||[]).filter(p=>p.comedianId!==co.id);
                  updTourDate({comedianPayouts:[...payouts,{...payout,actual:Number(e.target.value)||0}]});
                }}/></div>
              </div>}
              {co.bookouts?.some(b=>d.date&&d.date>=b.start&&d.date<=b.end)&&
                <div style={{background:'rgba(225,112,85,0.1)',border:'1px solid rgba(225,112,85,0.3)',borderRadius:6,padding:'4px 8px',fontSize:10,color:C.red,marginTop:4}}>
                  🚫 {co.name} is blacked out on this date
                </div>}
            </div>;
          })}

          <div style={{height:1,background:C.bord,margin:'4px 0 14px'}}/>

          {/* WEBSITE PUBLISHING */}
          <div style={{fontSize:10,color:C.acc2,fontWeight:700,letterSpacing:'0.1em',marginBottom:10}}>🌐 WEBSITE PUBLISHING</div>
          <div style={{background:C.surf2,borderRadius:10,padding:'12px 14px',marginBottom:12}}>
            {/* Master toggle */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.txt}}>Publish to websites</div>
                <div style={{fontSize:10,color:C.muted}}>Master switch — shows date on selected sites</div>
              </div>
              <div onClick={()=>updTourDate({websitePublish:!d.websitePublish})}
                style={{width:44,height:24,borderRadius:12,background:d.websitePublish?'#7c3aed':'rgba(255,255,255,0.12)',cursor:'pointer',position:'relative',transition:'background 0.2s',flexShrink:0}}>
                <div style={{position:'absolute',top:3,left:d.websitePublish?22:3,width:18,height:18,borderRadius:9,background:'#fff',transition:'left 0.2s'}}/>
              </div>
            </div>

            {d.websitePublish&&<>
              {/* Site selectors */}
              <div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:'0.08em'}}>SHOW ON:</div>
              <div style={{display:'flex',gap:8,marginBottom:12}}>
                {[{key:'jason',label:"Jason's Site"},{key:'phil',label:"Phil's Site"}].map(site=>{
                  const active=(d.websiteSites||[]).includes(site.key);
                  return <div key={site.key} onClick={()=>{
                    const cur=d.websiteSites||[];
                    updTourDate({websiteSites:active?cur.filter(x=>x!==site.key):[...cur,site.key]});
                  }} style={{flex:1,padding:'8px 10px',borderRadius:8,border:`1px solid ${active?'#7c3aed':'rgba(255,255,255,0.12)'}`,background:active?'rgba(124,58,237,0.12)':'transparent',cursor:'pointer',textAlign:'center',fontSize:11,fontWeight:active?700:400,color:active?'#a78bfa':C.muted,transition:'all 0.15s'}}>
                    {site.label}
                  </div>;
                })}
              </div>

              {/* Public fields */}
              <div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:'0.08em'}}>PUBLIC INFO:</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
                {[
                  {key:'websiteShowDate',label:'Date',default:true},
                  {key:'websiteShowVenue',label:'Venue',default:true},
                  {key:'websiteShowCity',label:'City',default:true},
                  {key:'websiteShowTickets',label:'Ticket Link'},
                  {key:'websiteShowPrice',label:'Price'},
                ].map(field=>{
                  const on=field.key in d ? d[field.key] : (field.default!==false);
                  return <div key={field.key} onClick={()=>updTourDate({[field.key]:!on})}
                    style={{padding:'5px 10px',borderRadius:6,border:`1px solid ${on?'rgba(0,184,148,0.4)':'rgba(255,255,255,0.1)'}`,background:on?'rgba(0,184,148,0.08)':'transparent',cursor:'pointer',fontSize:10,fontWeight:on?700:400,color:on?C.green:C.muted,transition:'all 0.15s'}}>
                    {on?'✓ ':''}{field.label}
                  </div>;
                })}
              </div>

              {/* Ticket URL */}
              <div style={s.field()}><label style={s.label}>Ticket URL</label>
                <input style={s.input()} value={d.websiteTicketUrl||''} placeholder="https://ticketmaster.com/..." onChange={e=>updTourDate({websiteTicketUrl:e.target.value})}/>
              </div>

              {/* Public price (can differ from ticket price) */}
              <div style={s.field()}><label style={s.label}>Public Price (shown on site)</label>
                <input style={s.input()} value={d.websitePrice||''} placeholder="e.g. 25 or 20-35" onChange={e=>updTourDate({websitePrice:e.target.value})}/>
              </div>

              {/* Site notes */}
              <div style={s.field()}><label style={s.label}>Notes for Website</label>
                <input style={s.input()} value={d.websiteNotes||''} placeholder="e.g. VIP meet & greet available" onChange={e=>updTourDate({websiteNotes:e.target.value})}/>
              </div>

              <div style={{fontSize:10,color:C.muted,marginTop:4}}>
                💡 Ticket URL and Price are only shown if those toggles above are enabled
              </div>
            </>}
          </div>

          <button onClick={()=>setEditTourDateId(null)} style={{...s.btn('linear-gradient(135deg,#7c3aed,#ec4899)','#fff',null),width:'100%',marginTop:8}}>
            ✓ Done
          </button>
        </Panel>;
      })()}

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
            <div style={{...s.grid2,gap:8,marginBottom:16}}>
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

        {/* == ANALYTICS TAB == */}
        {tab==='smartboss'&&<SmartBossAI venues={venues} tours={tours} comedians={comedians}/>}
        {tab==='analytics'&&<div style={{padding:'14px 14px 100px',overflowY:'auto',WebkitOverflowScrolling:'touch'}}>
          <AnalyticsTab venues={venues} tours={tours} bestTimeData={bestTimeData} />
        </div>}

      </div>{/* end content */}

      </div>{/* end sb-main */}
      </div>{/* end sb-desktop-wrap */}

      {/* NAV - mobile only */}
      <nav className="sb-mobile-nav" style={s.nav}>
        {[['today','🏠','Today'],['venues','🏛️','Venues'],['outreach','✉️','Outreach'],['tours','🗺️','Tours'],['calendar','📅','Cal'],['analytics','📊','Stats'],['smartboss','🧠','AI']].map(([t,icon,label])=>(
          <button key={t} onClick={()=>setTab(t)} className={`sb-nav-btn${tab===t?' active':''}`} style={{color:tab===t?C.acc2:C.muted,fontFamily:'inherit'}}>
            <span style={{fontSize:20,lineHeight:1}}>{icon}</span>
            <span style={{fontSize:9,fontWeight:tab===t?700:500,letterSpacing:'0.03em',marginTop:1}}>{label}</span>
          </button>
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
            <div style={{...s.grid2,gap:6}}>
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
          <div style={{...s.grid2,gap:6,marginBottom:16}}>{PIPELINE.map(st=>{const color=PIPE_COLORS[st]||C.muted;const active=dv.status===st;return<div key={st} onClick={()=>{upd(dv.id,{status:st});toast2(`Status: ${st}`);}} style={{padding:'8px 10px',borderRadius:9,border:`1px solid ${active?color:C.bord}`,background:active?`${color}18`:C.surf2,color:active?color:C.muted,textAlign:'center',cursor:'pointer',fontSize:10,fontFamily:font.body}}>{st}</div>;})}</div>
          <div style={s.sectionTitle}>[temp] Warmth</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:16}}>{WARMTH.map(w=>{const color=WARMTH_COLORS[w];const active=dv.warmth===w;return<div key={w} onClick={()=>upd(dv.id,{warmth:w})} style={{padding:'7px 4px',borderRadius:9,border:`1px solid ${active?color:C.bord}`,background:active?`${color}18`:C.surf2,color:active?color:C.muted,textAlign:'center',cursor:'pointer',fontSize:10,fontFamily:font.body}}>{w}</div>;})}</div>
          <div style={s.sectionTitle}>[person] Booker</div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>First Name</label><input style={s.input(12)} defaultValue={dv.booker||''} onChange={e=>upd(dv.id,{booker:e.target.value})} placeholder="Jamie"/></div>
            <div style={s.field()}><label style={s.label}>Last Name</label><input style={s.input(12)} defaultValue={dv.bookerLast||''} onChange={e=>upd(dv.id,{bookerLast:e.target.value})} placeholder="Smith"/></div>
          </div>
          <div style={s.sectionTitle}>[phone] Contact</div>
          <div style={{marginBottom:16}}>
            {dv.emailBounced&&<div style={{background:'rgba(225,112,85,0.08)',border:'1px solid rgba(225,112,85,0.3)',borderRadius:8,padding:'10px 12px',marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:'#e17055'}}>⚠️ Email Bounced</div>
                <div style={{fontSize:11,color:C.muted3}}>Update the email address before sending again</div>
              </div>
              <button onClick={()=>clearBounce(dv.id)} style={{fontSize:10,padding:'4px 10px',borderRadius:6,border:'1px solid rgba(0,184,148,0.4)',background:'rgba(0,184,148,0.1)',color:'#00b894',cursor:'pointer',whiteSpace:'nowrap'}}>✓ Mark Fixed</button>
            </div>}
            {[
              {label:'Email', field:'email', type:'email', placeholder:'booking@venue.com'},
              {label:'Phone', field:'phone', type:'tel', placeholder:'+1 (555) 000-0000'},
              {label:'Instagram', field:'instagram', type:'text', placeholder:'@venuebooker'},
              {label:'Address', field:'address', type:'text', placeholder:'123 Main St'},
            ].map(({label,field,type,placeholder})=>(
              <div key={field} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0',borderBottom:`1px solid ${C.bord}`}}>
                <span style={{fontSize:10,color:C.muted,width:72,flexShrink:0,letterSpacing:1,textTransform:'uppercase'}}>{label}</span>
                <input
                  type={type}
                  defaultValue={dv[field]||''}
                  placeholder={placeholder}
                  onBlur={e=>{
                    if(e.target.value!==dv[field]){
                      upd(dv.id,{[field]:e.target.value});
                      if(field==='email'&&dv.emailBounced&&e.target.value!==dv.email) clearBounce(dv.id);
                      toast2(`✓ ${label} updated`);
                    }
                  }}
                  style={{flex:1,background:'transparent',border:'none',borderBottom:`1px dashed ${C.bord}`,color:field==='email'&&dv.emailBounced?'#e17055':C.txt,fontSize:13,padding:'2px 4px',outline:'none',fontFamily:'inherit',minWidth:0}}
                />
                {dv[field]&&<button onClick={()=>copyText(dv[field],label,toast2)} style={{padding:'3px 10px',borderRadius:6,border:`1px solid ${C.bord}`,background:'none',color:C.muted,fontSize:10,cursor:'pointer',flexShrink:0}}>copy</button>}
                {field==='email'&&dv.emailBounced&&<span style={{fontSize:9,color:'#e17055',flexShrink:0}}>⚠️</span>}
              </div>
            ))}
            {dv.email&&!dv.emailBounced&&<div style={{padding:'8px 0',display:'flex',justifyContent:'flex-end'}}><button onClick={()=>markBounced(dv.id)} style={{fontSize:10,padding:'3px 10px',borderRadius:6,border:'1px solid rgba(225,112,85,0.3)',background:'rgba(225,112,85,0.06)',color:'#e17055',cursor:'pointer'}}>⚠️ Mark Email Bounced</button></div>}
          </div>
          <div style={s.field()}><label style={s.label}>Address</label><input style={s.input(12)} defaultValue={dv.address||''} placeholder="123 Main St" onBlur={e=>upd(dv.id,{address:e.target.value})}/></div>
          <div style={s.field()}><label style={s.label}>Zip Code</label><input style={s.input(12)} defaultValue={dv.zip||''} placeholder="90028" onBlur={e=>upd(dv.id,{zip:e.target.value})}/></div>
          <div style={s.field()}><label style={s.label}>Target Dates</label><input style={s.input(12)} defaultValue={dv.targetDates||''} onChange={e=>upd(dv.id,{targetDates:e.target.value})} placeholder="June 21-24"/></div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>📅 Show Date</label><input type="date" style={s.input(12)} value={dv.showDate||''} onChange={e=>upd(dv.id,{showDate:e.target.value})}/></div>
            <div style={s.field()}><label style={s.label}>Next Follow-Up</label><input type="date" style={s.input(12)} value={dv.nextFollowUp||''} onChange={e=>upd(dv.id,{nextFollowUp:e.target.value})}/></div>
          </div>
          <div style={s.field()}><label style={s.label}>History / Previous Shows</label><input style={s.input(12)} defaultValue={dv.history||''} onChange={e=>upd(dv.id,{history:e.target.value})} placeholder="Sold out March 2024..."/></div>
          <div style={s.field()}><label style={s.label}>Referral Source</label><input style={s.input(12)} defaultValue={dv.referralSource||''} onChange={e=>upd(dv.id,{referralSource:e.target.value})} placeholder="Who introduced you?"/></div>

          {/* EMAIL THREAD TRACKING */}
          <div style={{fontSize:10,color:C.acc2,fontWeight:700,letterSpacing:'0.1em',margin:'10px 0 8px'}}>🧵 EMAIL THREAD</div>
          <div style={{display:'flex',gap:8,alignItems:'flex-end',marginBottom:8}}>
            <div style={{flex:1,...s.field(),marginBottom:0}}><label style={s.label}>Gmail Thread URL</label><input style={s.input(12)} defaultValue={dv.emailThreadURL||''} placeholder="Paste Gmail thread link here..." onBlur={e=>upd(dv.id,{emailThreadURL:e.target.value})}/></div>
            {dv.emailThreadURL&&<button onClick={()=>window.open(dv.emailThreadURL,'_blank')} style={{...s.btn(C.surf2,C.acc2,C.bord),whiteSpace:'nowrap',flexShrink:0,marginBottom:1}}>📧 Open Thread</button>}
          </div>
          {dv.emailThreadURL&&<div style={{background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.2)',borderRadius:8,padding:'8px 12px',marginBottom:8}}>
            <div style={{fontSize:10,color:C.acc2,fontWeight:700,marginBottom:4}}>LAST RESPONSE</div>
            <input style={{...s.input(11),marginBottom:6}} placeholder="What did they say? (e.g. Interested, send avails)" defaultValue={dv.lastResponse||''} onBlur={e=>upd(dv.id,{lastResponse:e.target.value,lastResponseDate:new Date().toISOString().split('T')[0]})}/>
            {dv.lastResponseDate&&<div style={{fontSize:10,color:C.muted}}>Last updated: {dv.lastResponseDate}</div>}
          </div>}
          <div style={{gap:8,display:'flex',flexWrap:'wrap',marginBottom:12}}>
            <button onClick={()=>{setDetailId(null);setTimeout(()=>setComposeId(dv.id),200);}} style={{...s.btn('linear-gradient(135deg,#7c3aed,#6d28d9)',C.txt,'transparent'),fontWeight:700}}>✉️ Compose Email</button>
            <button onClick={()=>{setDealVenue({...dv});setShowDealBuilder(true);setDetailId(null);}} style={{...s.btn('linear-gradient(135deg,#059669,#047857)',C.txt,'transparent'),fontWeight:700}}>💰 Deal Builder</button>
            <button onClick={()=>{setRouteStops(prev=>{const already=prev.find(s=>s.id===dv.id);if(already){toast2('Already in route');return prev;}return [...prev,dv];});toast2(`${dv.venue} added to route!`);}} style={{...s.btn(C.surf2,C.blue,C.bord2),fontWeight:600}}>🗺️ Add to Route</button>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginBottom:10}}>
            {!dv.checklist&&['Hold','Confirmed','Advancing'].includes(dv.status)&&<button onClick={()=>{upd(dv.id,{checklist:createChecklist()});toast2('[OK] Checklist created!');}} style={{...s.btn('rgba(0,184,148,0.1)',C.green,'rgba(0,184,148,0.25)'),flex:1}}>[list] Create Checklist</button>}
            {dv.checklist&&<button onClick={()=>{setDetailId(null);setTimeout(()=>setChecklistId(dv.id),250);}} style={{...s.btn('rgba(0,184,148,0.1)',C.green,'rgba(0,184,148,0.25)'),flex:1}}>[list] Checklist ({checklistPct(dv.checklist)}%)</button>}
            {dv.paid&&<button onClick={()=>{setDetailId(null);setTimeout(()=>setSettlementId(dv.id),250);}} style={{...s.btn(C.surf2,C.acc2,C.bord),flex:1}}>[chart] Settlement</button>}
          </div>
          {(dv.contactLog||[]).length>0&&<><div style={s.divider}/><div style={s.sectionTitle}>[scroll] Contact History</div>{[...(dv.contactLog||[])].reverse().map((entry,i)=><div key={i} style={{padding:'8px 10px',background:C.surf2,borderRadius:8,marginBottom:6,fontSize:11}}><div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}><span style={{color:C.acc2}}>{entry.method}</span><span style={{color:C.muted}}>{entry.date}</span></div><div style={{color:C.muted2}}>{entry.note}</div></div>)}</>}
          <div style={s.divider}/>
          <div style={s.field()}><label style={s.label}>Notes</label><textarea style={{...s.input(),resize:'none',minHeight:70}} defaultValue={dv.notes||''} onChange={e=>upd(dv.id,{notes:e.target.value})} placeholder="Deal notes, follow-up details..."/></div>
          <div style={s.field()}>
            <label style={s.label}>Deal Closed By</label>
            <select style={s.select} value={dv.dealClosedBy||''} onChange={e=>upd(dv.id,{dealClosedBy:e.target.value})}>
              <option value=''>— Not yet closed —</option>
              <option value='Jason'>Jason</option>
              <option value='Pej'>Pej</option>
              <option value='Jason + Pej'>Jason + Pej</option>
            </select>
            {dv.dealClosedBy==='Pej'&&dv.guarantee>0&&<div style={{marginTop:6,padding:'6px 10px',background:'rgba(162,155,254,0.08)',border:'1px solid rgba(162,155,254,0.2)',borderRadius:8,fontSize:11,color:'#a29bfe'}}>Pej commission (15%): <strong>${(dv.guarantee*0.15).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0})}</strong></div>}
            {dv.dealClosedBy==='Jason + Pej'&&dv.guarantee>0&&<div style={{marginTop:6,padding:'6px 10px',background:'rgba(162,155,254,0.08)',border:'1px solid rgba(162,155,254,0.2)',borderRadius:8,fontSize:11,color:'#a29bfe'}}>Joint deal — commission split TBD · Total 15%: <strong>${(dv.guarantee*0.15).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:0})}</strong></div>}
          </div>
          <div style={s.divider}/>
          <button onClick={()=>setConfirmDelete(dv.id)} style={{...s.btn('rgba(225,112,85,0.1)',C.red,'rgba(225,112,85,0.3)'),width:'100%'}}>Delete Venue</button>
        </>}
      </Panel>

      {/* == COMPOSE PANEL == */}
      <Panel open={!!cv} onClose={()=>setComposeId(null)} title={cv?.venue||''}>
        {cv&&<>
          <div style={s.sectionTitle}>[list] Template</div>
          {/* SEQUENCE QUICK SELECT */}
          {(()=>{
            const touches=(cv.contactLog||[]).length;
            const nextTouch=touches+1;
            const seqMap={1:'tmpl_jason_phil_standard',2:'tmpl_followup_1',3:'tmpl_followup_2',4:'tmpl_followup_3'};
            if(cv.venueType==='Casino') seqMap[1]='tmpl_casino';
            if(cv.venueType==='College') seqMap[1]='tmpl_college';
            return <div style={{marginBottom:10}}>
              <div style={{fontSize:10,color:C.muted3,textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700,marginBottom:6}}>Quick Touch Select</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {[1,2,3,4].map(n=>{
                  const isNext=n===nextTouch;
                  const isPast=n<nextTouch;
                  return <button key={n} onClick={()=>setCo(cv.id,{templateId:seqMap[n]||'tmpl_jason_phil_standard'})}
                    style={{...s.btn(isNext?C.acc:isPast?C.surf3:C.surf2,isNext?'#fff':isPast?C.muted:C.txt,isNext?'transparent':C.bord),fontSize:11,padding:'5px 12px',fontWeight:isNext?700:400}}>
                    Touch {n}{isNext?' ← Next':''}
                  </button>;
                })}
              </div>
            </div>;
          })()}
          <div style={{fontSize:10,color:C.muted3,textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700,marginBottom:6}}>Template</div>
          <select style={{...s.select,marginBottom:14}} value={co.templateId} onChange={e=>setCo(cv.id,{templateId:e.target.value})}>{templates.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <div style={s.field()}><label style={s.label}>Target Dates</label><input style={s.input(12)} value={co.customDates||''} onChange={e=>setCo(cv.id,{customDates:e.target.value})} placeholder="e.g. June 21-24"/></div>
          {(()=>{
            if(!co.customDates) return null;
            const warnings=comedians.filter(c=>c.active&&(c.bookouts||[]).some(b=>{
              // Simple text match — flag if any bookout month/year appears in target dates string
              const bStart=new Date(b.start);
              const bEnd=new Date(b.end);
              const txt=co.customDates.toLowerCase();
              const months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
              const bMonths=[];
              for(let d=new Date(bStart);d<=bEnd;d.setDate(d.getDate()+1)){
                bMonths.push(months[d.getMonth()]);
              }
              return bMonths.some(m=>txt.includes(m))||b.start.slice(0,7)===new Date().toISOString().slice(0,7);
            }));
            if(!warnings.length) return null;
            return <div style={{background:'rgba(225,112,85,0.1)',border:'1px solid rgba(225,112,85,0.3)',borderRadius:8,padding:'8px 12px',marginBottom:8}}>
              <div style={{fontSize:10,color:C.red,fontWeight:700,marginBottom:4}}>🚫 BOOKOUT CONFLICTS</div>
              {warnings.map(c=>{
                const bo=(c.bookouts||[]).find(b=>b.start);
                return <div key={c.id} style={{fontSize:11,color:C.red}}>{c.name} — {bo?.reason||'Unavailable'} ({bo?.start} to {bo?.end})</div>;
              })}
            </div>;
          })()}
          <div style={s.field()}><label style={s.label}>Personal Note</label><textarea style={{...s.input(12),resize:'none',minHeight:56}} value={co.customNote||''} onChange={e=>setCo(cv.id,{customNote:e.target.value})} placeholder="A personal note, compliment, mutual contact..."/></div>
          <div style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:14,padding:14,marginBottom:12}}>
            <div style={s.sectionTitle}>[email] Generated Email</div>
            <div style={{background:C.bg,border:`1px solid ${C.bord}`,borderRadius:10,padding:12,marginBottom:10}}>
              <div style={{fontSize:10,color:C.muted,marginBottom:4,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                <span>To: {cv.email||'No email on file'}</span>
                {cv.emailBounced&&<span style={{fontSize:9,fontWeight:700,color:'#e17055',background:'rgba(225,112,85,0.15)',border:'1px solid rgba(225,112,85,0.3)',borderRadius:4,padding:'1px 6px'}}>⚠️ EMAIL BOUNCED</span>}
                {cv.email&&(
                  cv.emailBounced
                    ?<button onClick={()=>clearBounce(cv.id)} style={{fontSize:9,padding:'2px 7px',borderRadius:4,border:'1px solid rgba(0,184,148,0.4)',background:'rgba(0,184,148,0.1)',color:'#00b894',cursor:'pointer'}}>✓ Mark Fixed</button>
                    :<button onClick={()=>markBounced(cv.id)} style={{fontSize:9,padding:'2px 7px',borderRadius:4,border:'1px solid rgba(225,112,85,0.3)',background:'rgba(225,112,85,0.08)',color:'#e17055',cursor:'pointer'}}>⚠️ Mark Bounced</button>
                )}
              </div>
              <div style={{fontSize:12,color:C.acc2,marginBottom:8,fontWeight:500}}>Subject: {filledSubject}</div>
              <div style={{fontSize:11,color:'#9090b0',lineHeight:1.8,whiteSpace:'pre-wrap',maxHeight:220,overflowY:'auto'}}>{fullBody}</div>
            </div>
            {currentTemplate?.photoLinks?.length>0&&<div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:1,textTransform:'uppercase'}}>[photo] Press Kit Links Included</div>{currentTemplate.photoLinks.map((p,i)=><div key={i} style={{fontSize:11,color:C.acc2,marginBottom:3}}>* {p.label}</div>)}</div>}
            {cv&&<button onClick={()=>{
              const touches=(cv.contactLog||[]).length;
              const isNew=touches===0;
              const targetDates=co.customDates||cv.targetDates||'flexible';
              const booker=(cv.booker||'there')+(cv.bookerLast?' '+cv.bookerLast:'');
              const prompt='You are Jason Schuster, comedian and tour manager for Phil Medina, a nationally touring headliner.\n\nVenue: '+cv.venue+'\nCity: '+cv.city+', '+cv.state+'\nBooker: '+booker+'\nTouch #: '+(touches+1)+'\nRelationship: '+(isNew?'First ever contact - brand new cold outreach':'Existing contact - touch #'+(touches+1)+', reached out '+touches+' time'+(touches===1?'':'s')+' before')+'\nWarmth: '+(cv.warmth||'Cold')+'\nStatus: '+cv.status+'\nTarget dates: '+targetDates+'\nNotes: '+(cv.history||cv.notes||'none')+'\n\nPhil Medina credits: Laugh Factory, Hollywood Improv, Ice House Comedy Club, Netflix Is A Joke Fest, Hulu West Coast Comedy.\nJason Schuster credits: Comedy Store, Jimmy Kimmel Comedy Club, Kenan Presents.\n\n'+(isNew?'Write a warm professional first-touch cold outreach. Brief and friendly, not pushy.':'Write a natural follow-up referencing prior outreach. Persistent but friendly, different opener each time.')+'\n\nWrite ONLY the email body under 120 words. Sign: Jason Schuster / jschucomedy@gmail.com';
              toast2('Generating AI draft...');
              fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:400,messages:[{role:'user',content:prompt}]})})
              .then(r=>r.json()).then(d=>{
                const body=d?.content?.[0]?.text?.trim()||'';
                if(body){setComposeOpts(o=>({...o,aiNote:body,filledBody:body}));toast2('AI draft ready!');}
                else throw new Error('empty');
              }).catch(()=>{
                const b=(cv.booker||'there');
                const draft=isNew
                  ?`Hi ${b},\n\nI hope you\'re doing well! I\'m Jason Schuster — I manage Phil Medina, a nationally touring headliner with credits at the Laugh Factory, Hollywood Improv, and Netflix Is A Joke Fest.\n\nWe\'re building Phil\'s touring schedule and would love to explore a date at ${cv.venue}${targetDates!=='flexible'?' around '+targetDates:''}.\n\nWould you be open to a quick chat?\n\nBest,\nJason Schuster\njschucomedy@gmail.com`
                  :`Hi ${b},\n\nFollowing up on my previous note about Phil Medina at ${cv.venue}. Phil is touring strong right now and I think he\'d do great numbers in your room.\n\nStill looking at dates${targetDates!=='flexible'?' around '+targetDates:''} — would love to make this work!\n\nBest,\nJason Schuster\njschucomedy@gmail.com`;
                setComposeOpts(o=>({...o,aiNote:draft,filledBody:draft}));toast2('Draft ready!');
              });
            }} style={{...s.btn('rgba(108,92,231,0.15)',C.acc2,'rgba(108,92,231,0.4)'),width:'100%',marginBottom:8,fontSize:12,fontWeight:600}}>✨ AI Draft Email (relationship-aware)</button>}
            <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
              {mailto&&cv?.emailBounced&&<div style={{background:'rgba(225,112,85,0.1)',border:'1px solid rgba(225,112,85,0.3)',borderRadius:8,padding:'10px 12px',fontSize:12,color:'#e17055',textAlign:'center'}}>⚠️ Email bounced — update the address before sending</div>}
              {mailto&&!cv?.emailBounced&&<button onClick={()=>{
  // Track best time to contact
  const now=new Date();
  const dayName=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][now.getDay()];
  const hour=now.getHours();
  setBestTimeData(prev=>{
    const key=dayName+':'+hour;
    return{...prev,[key]:(prev[key]||0)+1};
  });
  // Use auto follow-up scheduling
  logTouch(cv.id,'Email','Outreach email sent via Gmail - '+co.templateId);
  upd(cv.id,{status:cv.status==='Lead'?'Contacted':cv.status});
  toast2('Opening Gmail...');
  openGmail(cv?.email||'',filledSubject,fullBody);
}} style={{...s.btn(C.acc,'#fff',null),width:'100%',flex:1}}>📧 Open Gmail</button>}
              <button onClick={()=>copyText(`Subject: ${filledSubject}\n\n${fullBody}`,'Email',toast2)} style={{...s.btn(C.surf2,C.txt,C.bord),flex:'0 0 auto',padding:'12px 14px'}}>Copy</button>
            </div>
          </div>
          <button onClick={()=>setTemplateOpen(true)} style={{...s.btn(C.surf2,C.acc2,C.bord),width:'100%',marginBottom:8}}>? Edit Templates</button>

          {/* INSTAGRAM DM DRAFT */}
          <div style={{background:'rgba(236,72,153,0.06)',border:'1px solid rgba(236,72,153,0.2)',borderRadius:12,padding:14,marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div style={{fontSize:11,color:C.pink,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase'}}>📸 Instagram DM Draft</div>
              <button onClick={()=>{
                const b=(cv.booker||'there');
                const td=co.customDates||cv.targetDates||'upcoming dates';
                const dm=`Hey${cv.booker?' '+cv.booker:''}! I'm Jason Schuster, manager for Phil Medina. He's a nationally touring headliner — Laugh Factory, Hollywood Improv, Netflix Is A Joke Fest. We'd love to bring him to ${cv.venue}${td!=='upcoming dates'?' around '+td:''}. Would you be open to chatting? 🎤`;
                copyText(dm,'DM',toast2);
                if(cv.instagram){window.open('https://instagram.com/'+cv.instagram.replace('@',''),'_blank');}
              }} style={{...s.btn('rgba(236,72,153,0.15)',C.pink,'rgba(236,72,153,0.3)'),fontSize:10,padding:'4px 10px',fontWeight:700}}>
                {cv?.instagram?'Copy + Open IG':'Copy DM'}
              </button>
            </div>
            <div style={{fontSize:11,color:C.muted2,lineHeight:1.6}}>
              {`Hey${cv?.booker?' '+cv.booker:''}! I'm Jason Schuster, manager for Phil Medina. He's a nationally touring headliner — Laugh Factory, Hollywood Improv, Netflix Is A Joke Fest. We'd love to bring him to ${cv?.venue||'your venue'}${co.customDates?' around '+co.customDates:''}. Would you be open to chatting? 🎤`}
            </div>
            {!cv?.instagram&&<div style={{fontSize:10,color:C.muted,marginTop:6}}>💡 Add Instagram handle to the venue to open their profile automatically</div>}
          </div>

          {/* VENUE RESEARCH */}
          <div style={{background:'rgba(14,165,233,0.06)',border:'1px solid rgba(14,165,233,0.2)',borderRadius:12,padding:14,marginBottom:8}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:researchOpen===cv?.id?8:0}}>
              <div style={{fontSize:11,color:C.blue,fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase'}}>🔍 Venue Research</div>
              <button onClick={()=>{
                if(researchOpen===cv?.id){setResearchOpen(null);return;}
                setResearchOpen(cv.id);
                setResearchResult('');
                setResearchLoading(true);
                const prompt=`Research this comedy venue and provide a brief intel report:\n\nVenue: ${cv.venue}\nCity: ${cv.city}, ${cv.state}\nVenue Type: ${cv.venueType||'Comedy Club'}\n\nProvide:\n1. Typical comedian tier they book (local/regional/national/headliner)\n2. Estimated typical guarantee range\n3. Any known booker preferences or booking style\n4. Best approach for first outreach\n5. One specific talking point that would resonate with this venue\n\nKeep it under 150 words. Be specific and actionable.`;
                fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-haiku-4-5-20251001',max_tokens:300,messages:[{role:'user',content:prompt}]})})
                .then(r=>r.json()).then(d=>{setResearchResult(d?.content?.[0]?.text||'No data found');setResearchLoading(false);})
                .catch(()=>{setResearchResult(`${cv.venue} is a ${cv.venueType||'comedy venue'} in ${cv.city}, ${cv.state}. ${cv.capacity?`Capacity: ${cv.capacity}.`:''} ${cv.guarantee?`Typical guarantee around ${fmt$(cv.guarantee)}.`:''} Approach: professional first-touch email referencing Phil's touring credits. Best angle: emphasize his draw and ability to sell tickets.`);setResearchLoading(false);});
              }} style={{...s.btn(researchOpen===cv?.id?'rgba(14,165,233,0.2)':C.surf2,C.blue,researchOpen===cv?.id?'rgba(14,165,233,0.4)':C.bord),fontSize:10,padding:'4px 10px',fontWeight:700}}>
                {researchOpen===cv?.id?'Close':'Research'}
              </button>
            </div>
            {researchOpen===cv?.id&&<div style={{fontSize:12,color:C.muted2,lineHeight:1.7,whiteSpace:'pre-wrap'}}>
              {researchLoading?'🔍 Researching...':researchResult}
            </div>}
          </div>

          {/* MOMENTUM SCORE */}
          {cv&&(()=>{const score=momentumScore(cv);return<div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:8,marginBottom:8}}>
            <div style={{flex:1}}>
              <div style={{fontSize:10,color:C.muted,textTransform:'uppercase',letterSpacing:'0.08em',fontWeight:700}}>Booking Momentum</div>
              <div style={{fontSize:11,color:C.muted2,marginTop:2}}>{score>=70?'Strong — push to close':score>=40?'Building — keep touching':'Low — warm this up first'}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:font.head,fontWeight:900,fontSize:22,color:score>=70?C.green:score>=40?C.yellow:C.orange}}>{score}</div>
              <div style={{fontSize:9,color:C.muted}}>/ 100</div>
            </div>
            <div style={{width:6,height:40,background:C.bord,borderRadius:3,overflow:'hidden'}}>
              <div style={{width:'100%',height:score+'%',background:score>=70?C.green:score>=40?C.yellow:C.orange,borderRadius:3,marginTop:(100-score)+'%'}}/>
            </div>
          </div>;})()} 

          <button onClick={()=>{logTouch(cv.id,'Email','Marked as contacted');upd(cv.id,{status:'Contacted'});toast2('✓ Contacted + follow-up auto-scheduled');}} style={s.btn('rgba(0,184,148,0.1)',C.green,'rgba(0,184,148,0.25)')}>✓ Mark Contacted + Auto-Schedule Follow-Up</button>
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
          <div style={{fontSize:10,color:C.acc2,fontWeight:700,letterSpacing:'0.1em',marginBottom:6,marginTop:4}}>👕 MERCH</div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>Item Type</label><select style={s.select} defaultValue={stlV.settlement?.merchType||'Shirts'} onChange={e=>upd(stlV.id,{settlement:{...stlV.settlement,merchType:e.target.value}})}><option>Shirts</option><option>Hats</option><option>Bundles</option><option>Specials</option><option>Other</option></select></div>
            <div style={s.field()}><label style={s.label}>Units Sold</label><input type="number" style={s.input()} defaultValue={stlV.settlement?.merchUnits||''} placeholder="0" onBlur={e=>{const units=Number(e.target.value)||0;const price=Number(stlV.settlement?.merchPrice)||0;upd(stlV.id,{settlement:{...stlV.settlement,merchUnits:units,merchNet:units*price}});}} /></div>
          </div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>Price Per Unit ($)</label><input type="number" style={s.input()} defaultValue={stlV.settlement?.merchPrice||''} placeholder="0" onBlur={e=>{const price=Number(e.target.value)||0;const units=Number(stlV.settlement?.merchUnits)||0;upd(stlV.id,{settlement:{...stlV.settlement,merchPrice:price,merchNet:units*price}});}} /></div>
            <div style={s.field()}><label style={s.label}>Merch Total ($)</label><div style={{...s.input(),display:'flex',alignItems:'center',color:C.green,fontWeight:700}}>${((stlV.settlement?.merchUnits||0)*(stlV.settlement?.merchPrice||0)).toLocaleString()}</div></div>
          </div>
          <div style={s.field()}><label style={s.label}>Settlement Notes</label><textarea style={{...s.input(12),resize:'none',minHeight:70}} defaultValue={stlV.settlement?.notes||''} onChange={e=>upd(stlV.id,{settlement:{...(stlV.settlement||{}),notes:e.target.value}})} placeholder="How did it go?"/></div>
          {stlV.settlement?.actualNetPaid>0&&<div style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:10,padding:'10px 14px',marginBottom:14}}>
            <div style={{fontFamily:font.head,fontWeight:700,fontSize:12,marginBottom:6}}>Variance vs Projected</div>
            <div style={{fontFamily:font.head,fontWeight:800,fontSize:22,color:stlV.settlement.actualNetPaid>=stlV.guarantee*0.75?C.green:C.red}}>{stlV.settlement.actualNetPaid>=stlV.guarantee*0.75?'+':''}{formatCurrency(stlV.settlement.actualNetPaid-(stlV.guarantee*0.75))}</div>
          </div>}
          <button onClick={()=>{setSettlementId(null);toast2('Settlement saved OK');}} style={{...s.btn(C.acc,'#fff',null),width:'100%'}}>Save Settlement</button>
        </>}
      </Panel>

      {/* == SHOW REPORT PANEL == */}
      <Panel open={!!srV} onClose={()=>setShowReportId(null)} title="🎤 Show Report">
        {srV&&<>
          <div style={{background:`linear-gradient(135deg,rgba(124,58,237,0.1),rgba(0,184,148,0.06))`,border:`1px solid ${C.bord}`,borderRadius:10,padding:'10px 14px',marginBottom:14}}>
            <div style={{fontWeight:700,fontSize:14}}>{srV.venue}</div>
            <div style={{fontSize:11,color:C.muted}}>{srV.city}, {srV.state}{srV.showDate?` · ${srV.showDate}`:''}</div>
          </div>

          <div style={{fontSize:10,color:C.acc2,fontWeight:700,letterSpacing:'0.1em',marginBottom:8}}>📊 SHOW STATS</div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>Attendance</label><input type="number" style={s.input()} placeholder="150" defaultValue={srV.showReport?.attendance||''} onBlur={e=>upd(srV.id,{showReport:{...(srV.showReport||{}),attendance:Number(e.target.value)||0}})}/></div>
            <div style={s.field()}><label style={s.label}>Set Length (min)</label><input type="number" style={s.input()} placeholder="45" defaultValue={srV.showReport?.setLength||''} onBlur={e=>upd(srV.id,{showReport:{...(srV.showReport||{}),setLength:Number(e.target.value)||0}})}/></div>
          </div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>👕 Merch Units Sold</label><input type="number" style={s.input()} placeholder="0" defaultValue={srV.showReport?.merchUnits||''} onBlur={e=>{const units=Number(e.target.value)||0;const price=Number(srV.showReport?.merchPrice)||20;upd(srV.id,{showReport:{...(srV.showReport||{}),merchUnits:units,merchRevenue:units*price}});}} /></div>
            <div style={s.field()}><label style={s.label}>Price Per Item ($)</label><input type="number" style={s.input()} placeholder="20" defaultValue={srV.showReport?.merchPrice||20} onBlur={e=>{const price=Number(e.target.value)||0;const units=Number(srV.showReport?.merchUnits)||0;upd(srV.id,{showReport:{...(srV.showReport||{}),merchPrice:price,merchRevenue:units*price}});}} /></div>
          </div>
          {(srV.showReport?.merchUnits>0)&&<div style={{background:'rgba(0,184,148,0.08)',border:'1px solid rgba(0,184,148,0.2)',borderRadius:8,padding:'8px 12px',marginBottom:8,fontSize:12,color:C.green,fontWeight:700}}>
            👕 Merch Total: ${((srV.showReport?.merchUnits||0)*(srV.showReport?.merchPrice||20)).toLocaleString()}
          </div>}

          <div style={{fontSize:10,color:C.acc2,fontWeight:700,letterSpacing:'0.1em',marginBottom:8,marginTop:4}}>⭐ RATINGS</div>
          {[['attendanceRating','Crowd Size'],['crowdQuality','Crowd Energy'],['bookerProfessionalism','Booker Professionalism']].map(([field,label])=><div key={field} style={s.field()}>
            <label style={s.label}>{label}</label>
            <div style={{display:'flex',gap:8}}>{[1,2,3,4,5].map(n=><div key={n} onClick={()=>upd(srV.id,{showReport:{...(srV.showReport||{}),[field]:n}})} style={{flex:1,padding:'10px 4px',borderRadius:8,border:'1px solid',borderColor:(srV.showReport?.[field]||0)>=n?C.yellow:C.bord,background:(srV.showReport?.[field]||0)>=n?'rgba(253,203,110,0.1)':'none',textAlign:'center',cursor:'pointer',fontSize:16}}>⭐</div>)}</div>
          </div>)}

          <div style={{fontSize:10,color:C.acc2,fontWeight:700,letterSpacing:'0.1em',marginBottom:8,marginTop:4}}>📝 NOTES</div>
          <div style={s.field()}><label style={s.label}>Show Notes / Highlights</label><textarea style={{...s.input(),resize:'none',minHeight:70}} placeholder="Best bit that killed, crowd energy, anything notable..." defaultValue={srV.showReport?.showNotes||''} onBlur={e=>upd(srV.id,{showReport:{...(srV.showReport||{}),showNotes:e.target.value}})}/></div>
          <div style={s.field()}><label style={s.label}>Rebook Notes</label><input style={s.input()} placeholder="Ask for weekend headliner spot next time..." defaultValue={srV.showReport?.rebookNotes||''} onBlur={e=>upd(srV.id,{showReport:{...(srV.showReport||{}),rebookNotes:e.target.value}})}/></div>

          <div style={{fontSize:10,color:C.acc2,fontWeight:700,letterSpacing:'0.1em',marginBottom:8,marginTop:4}}>🔄 REBOOK</div>
          <div style={s.grid2}>
            <div style={s.field()}><label style={s.label}>Payment Speed</label><ToggleGroup options={['Night-of','Within week','Late']} value={srV.showReport?.paySpeed||'Night-of'} onChange={v=>upd(srV.id,{showReport:{...(srV.showReport||{}),paySpeed:v}})}/></div>
            <div style={s.field()}><label style={s.label}>Want to Return?</label><ToggleGroup options={['Yes','Renegotiate','No']} value={srV.showReport?.wantToReturn||'Yes'} onChange={v=>upd(srV.id,{showReport:{...(srV.showReport||{}),wantToReturn:v}})}/></div>
          </div>
          <div style={s.field()}><label style={s.label}>Ideal Rebook Window</label><select style={s.select} value={srV.showReport?.rebookWindow||'6 months'} onChange={e=>upd(srV.id,{showReport:{...(srV.showReport||{}),rebookWindow:e.target.value}})}>{['3 months','6 months','12 months','Never'].map(w=><option key={w}>{w}</option>)}</select></div>
          <button onClick={()=>{const months=parseInt(srV.showReport?.rebookWindow)||6;const rd=new Date();rd.setMonth(rd.getMonth()+months);upd(srV.id,{rebookDate:rd.toISOString().split('T')[0],status:'Completed'});setShowReportId(null);toast2('[OK] Report saved · rebook reminder set!');}} style={{...s.btn(C.acc,'#fff',null),width:'100%'}}>Save Report + Set Rebook Reminder</button>
        </>}
      </Panel>


      {/* == COMEDIAN ROSTER PANEL == */}
      <Panel open={rosterOpen} onClose={()=>{setRosterOpen(false);setEditComedianId(null);}} title="🎭 Comedian Roster & Bookouts">
        <div style={{fontSize:11,color:C.muted,marginBottom:16}}>Manage your touring comedians, fees, and availability blackouts.</div>

        {/* ADD NEW COMEDIAN */}
        <button onClick={()=>{
          const nc={id:'c_'+Date.now(),name:'',role:'Feature',defaultFee:0,active:true,bookouts:[],notes:''};
          setComedians(cs=>[...cs,nc]);
          setEditComedianId(nc.id);
        }} style={{...s.btn('linear-gradient(135deg,#7c3aed,#ec4899)','#fff',null),width:'100%',marginBottom:16}}>+ Add Comedian</button>

        {comedians.map(co=>{
          const isEditing=editComedianId===co.id;
          const totalPaid=venues.reduce((a,v)=>{
            const p=(v.settlement?.comedianPayouts||[]).find(p2=>p2.comedianId===co.id);
            return a+(p?Number(p.actual)||0:0);
          },0)+tours.reduce((a,t)=>{
            return a+(t.dates||[]).reduce((a2,d)=>{
              const p=(d.comedianPayouts||[]).find(p2=>p2.comedianId===co.id);
              return a2+(p?Number(p.actual)||0:0);
            },0);
          },0);

          // Check upcoming bookouts
          const today=new Date().toISOString().split('T')[0];
          const upcomingBookouts=(co.bookouts||[]).filter(b=>b.end>=today);

          return <div key={co.id} style={{background:C.surf2,border:`1px solid ${isEditing?C.acc:C.bord}`,borderRadius:12,padding:14,marginBottom:12}}>
            {/* Header row */}
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:isEditing?12:0}}>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:`linear-gradient(135deg,${C.acc},${C.pink})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'#fff',flexShrink:0}}>
                  {(co.name||'?')[0].toUpperCase()}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{co.name||'New Comedian'}</div>
                  <div style={{fontSize:10,color:C.muted}}>{co.role}{totalPaid>0?` · $${totalPaid.toLocaleString()} paid out`:''}</div>
                </div>
              </div>
              <div style={{display:'flex',gap:6,alignItems:'center'}}>
                {upcomingBookouts.length>0&&<span style={{background:'rgba(225,112,85,0.15)',color:C.red,border:'1px solid rgba(225,112,85,0.3)',borderRadius:10,padding:'2px 8px',fontSize:9,fontWeight:700}}>{upcomingBookouts.length} BOOKOUT{upcomingBookouts.length>1?'S':''}</span>}
                <button onClick={()=>setEditComedianId(isEditing?null:co.id)} style={{...s.btn(C.surf,C.acc2,C.bord),fontSize:11,padding:'4px 10px'}}>{isEditing?'Done':'Edit'}</button>
                {co.id!=='c_jason'&&co.id!=='c_phil'&&<button onClick={()=>{if(window.confirm('Remove '+co.name+'?'))setComedians(cs=>cs.filter(c=>c.id!==co.id));}} style={{...s.btn('rgba(225,112,85,0.1)',C.red,'rgba(225,112,85,0.3)'),fontSize:11,padding:'4px 10px'}}>✕</button>}
              </div>
            </div>

            {isEditing&&<>
              <div style={s.grid2}>
                <div style={s.field()}><label style={s.label}>Name</label><input style={s.input(12)} value={co.name} onChange={e=>setComedians(cs=>cs.map(c=>c.id===co.id?{...c,name:e.target.value}:c))}/></div>
                <div style={s.field()}><label style={s.label}>Role</label><select style={s.select} value={co.role} onChange={e=>setComedians(cs=>cs.map(c=>c.id===co.id?{...c,role:e.target.value}:c))}><option>Headliner</option><option>Feature</option><option>Opener</option><option>Guest</option><option>Host/MC</option></select></div>
              </div>
              <div style={s.grid2}>
                <div style={s.field()}><label style={s.label}>Default Fee ($)</label><input type="number" style={s.input(12)} value={co.defaultFee||''} placeholder="0" onChange={e=>setComedians(cs=>cs.map(c=>c.id===co.id?{...c,defaultFee:Number(e.target.value)||0}:c))}/></div>
                <div style={s.field()}><label style={s.label}>Active</label><ToggleGroup options={['Yes','No']} value={co.active?'Yes':'No'} onChange={v=>setComedians(cs=>cs.map(c=>c.id===co.id?{...c,active:v==='Yes'}:c))}/></div>
              </div>
              <div style={s.field()}><label style={s.label}>Notes</label><input style={s.input(12)} value={co.notes||''} placeholder="Any notes about this comedian..." onChange={e=>setComedians(cs=>cs.map(c=>c.id===co.id?{...c,notes:e.target.value}:c))}/></div>

              {/* BOOKOUTS */}
              <div style={{fontSize:10,color:C.red,fontWeight:700,letterSpacing:'0.1em',margin:'10px 0 8px'}}>🚫 BLACKOUT DATES</div>
              {(co.bookouts||[]).map((b,bi)=><div key={bi} style={{display:'flex',gap:6,alignItems:'center',marginBottom:6}}>
                <input type="date" style={{...s.input(11),flex:1}} value={b.start} onChange={e=>setComedians(cs=>cs.map(c=>c.id===co.id?{...c,bookouts:c.bookouts.map((bk,i)=>i===bi?{...bk,start:e.target.value}:bk).sort((a,b)=>a.start&&b.start?a.start.localeCompare(b.start):a.start?-1:1)}:c))}/>
                <span style={{color:C.muted,fontSize:11}}>to</span>
                <input type="date" style={{...s.input(11),flex:1}} value={b.end} onChange={e=>setComedians(cs=>cs.map(c=>c.id===co.id?{...c,bookouts:c.bookouts.map((bk,i)=>i===bi?{...bk,end:e.target.value}:bk)}:c))}/>
                <select style={{...s.select,fontSize:10,flex:1}} value={b.reason||'Other gig'} onChange={e=>setComedians(cs=>cs.map(c=>c.id===co.id?{...c,bookouts:c.bookouts.map((bk,i)=>i===bi?{...bk,reason:e.target.value}:bk)}:c))}><option>Other gig</option><option>Vacation</option><option>Personal</option><option>Filming</option><option>Unavailable</option></select>
                <button onClick={()=>setComedians(cs=>cs.map(c=>c.id===co.id?{...c,bookouts:c.bookouts.filter((_,i)=>i!==bi)}:c))} style={{...s.btn('rgba(225,112,85,0.1)',C.red,'rgba(225,112,85,0.3)'),padding:'4px 8px',fontSize:12}}>✕</button>
              </div>)}
              <button onClick={()=>setComedians(cs=>cs.map(c=>c.id===co.id?{...c,bookouts:[...(c.bookouts||[]),{start:'',end:'',reason:'Other gig'}]}:c))} style={{...s.btn(C.surf,C.muted,C.bord),fontSize:11,width:'100%'}}>+ Add Blackout Date Range</button>
            </>}
          </div>;
        })}
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
          {templates.map(t=><div key={t.id} style={{...s.card(),marginBottom:8}}>
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
        <TourEditor tour={editTour} onSave={saveTour} onCancel={()=>{setTourOpen(false);setEditTourId(null);}} venues={venues} comedians={comedians}/>
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
        <div style={s.field()}><label style={s.label}>Address</label><input style={s.input()} placeholder="123 Main St" value={nv.address} onChange={e=>setNv(p=>({...p,address:e.target.value}))}/></div>
        <div style={s.field()}><label style={s.label}>Zip Code</label><input style={s.input()} placeholder="90028" value={nv.zip||''} onChange={e=>setNv(p=>({...p,zip:e.target.value}))}/></div>
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
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap',marginTop:8}}>
          <button onClick={addVenue} style={s.btn(C.acc,'#fff',null)}>Add Venue</button>
          <button onClick={()=>setAddOpen(false)} style={s.btn(C.surf2,C.txt,C.bord)}>Cancel</button>
        </div>
      </Panel>

      {/* ── DEAL BUILDER MODAL ── */}
      {showDealBuilder&&dealVenue&&(()=>{
        const dv2=dealVenue;
        const calc=calcDeal(dv2);
        const updateDV=(k,v)=>setDealVenue(prev=>({...prev,[k]:v}));
        return<div style={s.modal} onClick={e=>{if(e.target===e.currentTarget)setShowDealBuilder(false);}}>
          <div style={{...s.modalBox,maxWidth:680}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div>
                <div style={{fontFamily:font.head,fontWeight:900,fontSize:20}}>💰 Deal Builder</div>
                <div style={{fontSize:12,color:C.muted3,marginTop:2}}>{dv2.venue} · {dv2.city}, {dv2.state}</div>
              </div>
              <button onClick={()=>setShowDealBuilder(false)} style={{...s.btn(C.surf2,C.muted,C.bord2),width:32,height:32,padding:0,borderRadius:8}}>✕</button>
            </div>

            {/* DEAL TYPE */}
            <div style={{marginBottom:16}}>
              <label style={s.label}>Deal Type</label>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {['Flat Guarantee','Door Split','Versus Deal','Tiered Split','Percentage of Gross'].map(t=>(
                  <div key={t} onClick={()=>updateDV('dealType',t)} style={s.pill(dv2.dealType===t,C.acc)}>{t}</div>
                ))}
              </div>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16}}>
              {(dv2.dealType==='Flat Guarantee'||dv2.dealType==='Versus Deal'||dv2.dealType==='Tiered Split')&&(
                <div><label style={s.label}>Guarantee ($)</label>
                <input style={s.input()} type="number" value={dv2.guarantee||''} onChange={e=>updateDV('guarantee',e.target.value)} placeholder="2500"/></div>
              )}
              {dv2.dealType!=='Flat Guarantee'&&(
                <div><label style={s.label}>{dv2.dealType==='Percentage of Gross'?'% of Gross':'Door Split %'}</label>
                <input style={s.input()} type="number" value={dv2.doorSplit||''} onChange={e=>updateDV('doorSplit',e.target.value)} placeholder="50"/></div>
              )}
              <div><label style={s.label}>Ticket Price ($)</label>
              <input style={s.input()} type="number" value={dv2.ticketPrice||''} onChange={e=>updateDV('ticketPrice',e.target.value)} placeholder="20"/></div>
              <div><label style={s.label}>Capacity</label>
              <input style={s.input()} type="number" value={dv2.capacity||''} onChange={e=>updateDV('capacity',e.target.value)} placeholder="300"/></div>
              <div><label style={s.label}>Sell-Through %</label>
              <input style={s.input()} type="number" value={dv2.sellThrough||85} onChange={e=>updateDV('sellThrough',e.target.value)} placeholder="85"/></div>
            </div>

            {dv2.dealType==='Tiered Split'&&(
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:16,background:C.surf2,borderRadius:10,padding:12}}>
                <div><label style={s.label}>Tier 1 Gross Cap ($)</label>
                <input style={s.input()} type="number" value={dv2.tierOneGross||''} onChange={e=>updateDV('tierOneGross',e.target.value)} placeholder="3000"/></div>
                <div><label style={s.label}>Tier 1 Split %</label>
                <input style={s.input()} type="number" value={dv2.tierOneSplit||50} onChange={e=>updateDV('tierOneSplit',e.target.value)} placeholder="50"/></div>
                <div><label style={s.label}>Tier 2 Split %</label>
                <input style={s.input()} type="number" value={dv2.tierTwoSplit||80} onChange={e=>updateDV('tierTwoSplit',e.target.value)} placeholder="80"/></div>
              </div>
            )}

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:12,marginBottom:20}}>
              <div><label style={s.label}>Agent % </label>
              <input style={s.input()} type="number" value={dv2.agentCommission||10} onChange={e=>updateDV('agentCommission',e.target.value)}/></div>
              <div><label style={s.label}>Manager %</label>
              <input style={s.input()} type="number" value={dv2.managerCommission||15} onChange={e=>updateDV('managerCommission',e.target.value)}/></div>
              <div><label style={s.label}>Phil Split %</label>
              <input style={s.input()} type="number" value={dv2.philSplit||50} onChange={e=>updateDV('philSplit',e.target.value)}/></div>
              <div><label style={s.label}>Show Expenses ($)</label>
              <input style={s.input()} type="number" value={dv2.showExpenses||''} onChange={e=>updateDV('showExpenses',e.target.value)} placeholder="0"/></div>
            </div>

            {/* P&L RESULTS */}
            <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(236,72,153,0.05))',border:`1px solid ${C.acc}30`,borderRadius:14,padding:20,marginBottom:16}}>
              <div style={{fontSize:11,color:C.acc2,letterSpacing:'0.08em',textTransform:'uppercase',fontWeight:700,marginBottom:14}}>📊 P&L Projection</div>
              <div style={{...s.grid2,gap:12}}>
                {[
                  {label:'Est. Tickets Sold',value:calc.totalTickets?.toLocaleString()||'-',color:C.txt},
                  {label:'Gross Revenue',value:fmt$(calc.grossRevenue),color:C.txt},
                  {label:'Talent Payout',value:fmt$(calc.talentGross),color:C.green},
                  {label:'Agent Cut',value:fmt$(calc.agentCut),color:C.red},
                  {label:'Manager Cut',value:fmt$(calc.managerCut),color:C.red},
                  {label:'After Reps',value:fmt$(calc.afterReps),color:C.txt},
                  {label:"Phil's Share",value:fmt$(calc.philCut),color:C.blue},
                  {label:'Show Expenses',value:fmt$(calc.showExpenses),color:C.red},
                ].map(r=>(
                  <div key={r.label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0',borderBottom:`1px solid ${C.bord}`}}>
                    <span style={{fontSize:12,color:C.muted3}}>{r.label}</span>
                    <span style={{fontSize:13,fontWeight:600,color:r.color}}>{r.value}</span>
                  </div>
                ))}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12,padding:'12px 0 0',borderTop:`2px solid ${C.acc}30`}}>
                <span style={{fontFamily:font.head,fontWeight:700,fontSize:14,color:C.txt}}>🎯 Jason's Net</span>
                <span style={{fontFamily:font.head,fontWeight:900,fontSize:24,color:calc.jasonNet>=0?C.green:C.red}}>{fmt$(calc.jasonNet)}</span>
              </div>
            </div>

            <div style={{display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button onClick={()=>setShowDealBuilder(false)} style={s.btn(C.surf2,C.muted,C.bord2)}>Cancel</button>
              <button onClick={()=>{
                setVenues(vs=>vs.map(v=>v.id===dv2.id?{...dv2}:v));
                setShowDealBuilder(false);
                toast2('Deal saved!');
              }} style={{...s.btn('linear-gradient(135deg,#10b981,#059669)',C.txt,'transparent'),fontWeight:700}}>
                💾 Save Deal to Venue
              </button>
            </div>
          </div>
        </div>;
      })()}

      {/* ── ROUTE PLANNER MODAL ── */}
      {routeStops.length>0&&(()=>{
        const totalMiles=routeStops.reduce((a,b,i)=>i===0?0:a+((b.miles)||0),0);
        const totalHours=routeStops.reduce((a,b,i)=>i===0?0:a+((b.hours)||0),0);
        const fuelCost=totalMiles*0.22; // ~$0.22/mile average
        const totalGuarantee=routeStops.reduce((a,b)=>a+(parseFloat(b.guarantee)||0),0);
        const profitPerMile=totalMiles>0?(totalGuarantee-fuelCost)/totalMiles:0;
        return<div style={{position:'fixed',bottom:0,left:228,right:0,background:C.surf,borderTop:`1px solid ${C.bord}`,padding:'12px 20px',zIndex:100,display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:C.muted2,marginBottom:2}}>🗺️ Route Summary · {routeStops.length} stops</div>
            <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
              <span style={{fontSize:12,color:C.txt}}><b>{Math.round(totalMiles).toLocaleString()}</b> mi</span>
              <span style={{fontSize:12,color:C.txt}}><b>{Math.round(totalHours)}h</b> drive</span>
              <span style={{fontSize:12,color:C.red}}><b>{fmt$(fuelCost)}</b> fuel est.</span>
              <span style={{fontSize:12,color:C.green}}><b>{fmt$(totalGuarantee)}</b> guaranteed</span>
              <span style={{fontSize:12,color:profitPerMile>=5?C.green:C.yellow}}><b>{fmt$(profitPerMile)}/mi</b> profit</span>
            </div>
          </div>
          <button onClick={()=>{
            const stops=routeStops.map(s=>`${s.venue}, ${s.city}, ${s.state}`).join(' to ');
            window.open('https://www.google.com/maps/dir/'+routeStops.map(s=>encodeURIComponent(`${s.city}, ${s.state}`)).join('/'));
          }} style={{...s.btn(C.blue,C.txt,'transparent'),fontWeight:700}}>🗺️ Open in Maps</button>
          <button onClick={()=>setRouteStops([])} style={s.btn(C.surf2,C.muted,C.bord2)}>Clear Route</button>
        </div>;
      })()}


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
function CalendarTab({venues,tours=[],onVenueClick,onChecklist,toast2,comedians=[]}){
  const [calView,setCalView] = React.useState('list'); // 'list' | 'month'
  const [calMonth,setCalMonth] = React.useState(new Date().getMonth());
  const [calYear,setCalYear]   = React.useState(new Date().getFullYear());

  // ── BUILD EVENT LIST ──────────────────────────────────
  // Standalone confirmed venues with a showDate
  const venueEvents = venues
    .filter(v=>['Hold','Confirmed','Advancing','Completed'].includes(v.status)&&(v.showDate||v.targetDates))
    .map(v=>({
      id:v.id, type:'venue', venue:v.venue, city:v.city, state:v.state,
      date:v.showDate||'', targetDates:v.targetDates||'',
      status:v.status, guarantee:v.guarantee, dealType:v.dealType,
      booker:v.booker, bookerLast:v.bookerLast, email:v.email, phone:v.phone,
      address:v.address, zip:v.zip, package:v.package,
      lodging:v.lodging, contractStatus:v.contractStatus, checklist:v.checklist,
      depositAmount:v.depositAmount, depositPaid:v.depositPaid, depositDue:v.depositDue,
      showCount:v.showCount, agreementType:v.agreementType, isTourDate:false,
    }));

  // Tour dates
  const tourEvents = [];
  tours.forEach(t=>{
    (t.dates||[]).filter(d=>['Confirmed','Hold','Advancing','Completed'].includes(d.status||'Hold')).forEach(d=>{
      tourEvents.push({
        id:t.id+'_'+d.id, type:'tour', venue:d.venue||'TBD',
        city:d.city||'', state:d.state||'', date:d.date||'',
        status:d.status||'Hold', guarantee:d.guarantee||0,
        dealType:d.dealType||'', address:d.address||'', zip:d.zip||'',
        package:t.name, tourName:t.name, tourId:t.id, isTourDate:true,
        comedianPayouts: d.comedianPayouts||[],
      });
    });
  });

  const allEvents = [...venueEvents,...tourEvents]
    .sort((a,b)=>(a.date||'zzz').localeCompare(b.date||'zzz'));

  // Group by month-year for list view
  const grouped = {};
  allEvents.forEach(ev=>{
    let key = 'Undated';
    if(ev.date){
      try{
        const d=new Date(ev.date+'T12:00:00');
        key=d.toLocaleDateString('en-US',{month:'long',year:'numeric'});
      }catch{}
    } else if(ev.targetDates){
      const m=MONTHS.find(m2=>ev.targetDates.includes(m2));
      if(m) key=m+' '+new Date().getFullYear();
    }
    if(!grouped[key]) grouped[key]=[];
    grouped[key].push(ev);
  });
  const sortedMonths=Object.keys(grouped).sort((a,b)=>{
    if(a==='Undated') return 1; if(b==='Undated') return -1;
    return new Date(a)-new Date(b);
  });

  // Month grid data
  const daysInMonth=(m,y)=>new Date(y,m+1,0).getDate();
  const firstDayOfMonth=(m,y)=>new Date(y,m,1).getDay();
  const eventsByDate={};
  allEvents.forEach(ev=>{
    if(ev.date) eventsByDate[ev.date]=(eventsByDate[ev.date]||[]).concat(ev);
  });

  const MONTH_NAMES=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const allConfirmed=venues.filter(v=>['Confirmed','Advancing','Completed'].includes(v.status));
  const totalGuarantee=allConfirmed.reduce((a,v)=>a+(Number(v.guarantee)||0),0);

  // Tour ICS bulk download
  function downloadTourICS(tour){
    const evs=(tour.dates||[]).filter(d=>d.date).map(d=>({
      date:d.date, venue:d.venue||'TBD', city:d.city||'', state:d.state||'',
      guarantee:d.guarantee||0, dealType:d.dealType||'', tourName:tour.name,
    }));
    downloadICS(evs);
    toast2&&toast2('📅 Tour exported to calendar!');
  }

  function downloadAllICS(){
    const evs=allEvents.filter(ev=>ev.date).map(ev=>({
      date:ev.date, venue:ev.venue, city:ev.city, state:ev.state,
      guarantee:ev.guarantee||0, dealType:ev.dealType||'', tourName:ev.tourName||'',
    }));
    downloadICS(evs);
    toast2&&toast2('📅 All shows exported to calendar!');
  }

  return <div style={{padding:16,paddingBottom:80}}>

    {/* HEADER */}
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
      <div>
        <div style={{fontFamily:font.head,fontWeight:900,fontSize:22,letterSpacing:-0.5,marginBottom:2}}>Calendar</div>
        <div style={{fontSize:12,color:C.muted3}}>{allEvents.length} show{allEvents.length!==1?'s':''} scheduled</div>
      </div>
      <div style={{display:'flex',gap:6}}>
        <button onClick={()=>setCalView('list')} style={{...s.btn(calView==='list'?C.acc:C.surf2,calView==='list'?'#fff':C.muted,C.bord),padding:'6px 12px',fontSize:11}}>≡ List</button>
        <button onClick={()=>setCalView('month')} style={{...s.btn(calView==='month'?C.acc:C.surf2,calView==='month'?'#fff':C.muted,C.bord),padding:'6px 12px',fontSize:11}}>⬛ Month</button>
      </div>
    </div>

    {/* STATS ROW */}
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:14}}>
      {[[allEvents.length,'📅','Scheduled'],[allConfirmed.length,'✅','Confirmed'],['$'+Number(totalGuarantee).toLocaleString(),'💰','Guaranteed']].map(([v,icon,l])=>(
        <div key={l} style={{background:C.surf,border:`1px solid ${C.bord}`,borderRadius:10,padding:'10px 8px',textAlign:'center'}}>
          <div style={{fontSize:18}}>{icon}</div>
          <div style={{fontFamily:font.head,fontWeight:800,fontSize:14,color:C.acc2}}>{v}</div>
          <div style={{fontSize:9,color:C.muted,marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>

    {/* EXPORT ALL BUTTON */}
    {allEvents.filter(e=>e.date).length>0&&<div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
      <button onClick={downloadAllICS} style={{...s.btn('linear-gradient(135deg,#0ea5e9,#0284c7)','#fff',null),flex:1,fontSize:11}}>
        📥 Export All Shows (.ics — works with Apple/Google/Outlook)
      </button>
    </div>}

    {/* TOUR QUICK-ADD SECTION */}
    {tours.filter(t=>(t.dates||[]).some(d=>d.date)).length>0&&<div style={{background:C.surf,border:`1px solid ${C.bord}`,borderRadius:12,padding:14,marginBottom:14}}>
      <div style={{fontSize:10,color:C.acc2,fontWeight:700,letterSpacing:'0.1em',marginBottom:10}}>🗺 ADD TOUR TO CALENDAR</div>
      {tours.filter(t=>(t.dates||[]).some(d=>d.date)).map(t=>{
        const dated=(t.dates||[]).filter(d=>d.date);
        const firstDate=dated.length?dated[0].date:'';
        const lastDate=dated.length?dated[dated.length-1].date:'';
        const gross=dated.reduce((a,d)=>a+(Number(d.guarantee)||0),0);
        return <div key={t.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:`1px solid ${C.bord}`}}>
          <div>
            <div style={{fontWeight:700,fontSize:13}}>{t.name}</div>
            <div style={{fontSize:10,color:C.muted}}>{dated.length} dates{firstDate?` · ${firstDate} → ${lastDate}`:''} · ${Number(gross).toLocaleString()}</div>
          </div>
          <button onClick={()=>downloadTourICS(t)} style={{...s.btn(C.surf2,C.acc2,C.bord),fontSize:11,padding:'6px 12px',flexShrink:0}}>
            📥 .ics
          </button>
        </div>;
      })}
    </div>}

    {/* MONTH GRID VIEW */}
    {calView==='month'&&<div style={{marginBottom:16}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <button onClick={()=>{let m=calMonth-1,y=calYear;if(m<0){m=11;y--;}setCalMonth(m);setCalYear(y);}} style={{...s.btn(C.surf2,C.txt,C.bord),padding:'4px 12px'}}>‹</button>
        <div style={{fontFamily:font.head,fontWeight:800,fontSize:16}}>{MONTH_NAMES[calMonth]} {calYear}</div>
        <button onClick={()=>{let m=calMonth+1,y=calYear;if(m>11){m=0;y++;}setCalMonth(m);setCalYear(y);}} style={{...s.btn(C.surf2,C.txt,C.bord),padding:'4px 12px'}}>›</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2,marginBottom:4}}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=><div key={d} style={{textAlign:'center',fontSize:9,color:C.muted,fontWeight:700,padding:'4px 0'}}>{d}</div>)}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:2}}>
        {Array(firstDayOfMonth(calMonth,calYear)).fill(null).map((_,i)=><div key={'e'+i}/>)}
        {Array(daysInMonth(calMonth,calYear)).fill(null).map((_,i)=>{
          const day=i+1;
          const dateStr=`${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const dayEvents=eventsByDate[dateStr]||[];
          const isToday=dateStr===new Date().toISOString().split('T')[0];
          return <div key={day} onClick={()=>{if(dayEvents.length)dayEvents.forEach(ev=>ev.id&&onVenueClick&&onVenueClick(ev.type==='venue'?ev.id:null));}}
            style={{minHeight:44,borderRadius:6,border:`1px solid ${dayEvents.length?C.acc:C.bord}`,background:dayEvents.length?'rgba(124,58,237,0.08)':isToday?C.surf2:C.surf,padding:'4px',cursor:dayEvents.length?'pointer':'default',position:'relative'}}>
            <div style={{fontSize:10,color:isToday?C.acc2:dayEvents.length?C.txt:C.muted,fontWeight:isToday||dayEvents.length?700:400}}>{day}</div>
            {dayEvents.slice(0,2).map((ev,ei)=><div key={ei} style={{fontSize:8,background:PIPE_COLORS[ev.status]||C.acc,color:'#fff',borderRadius:3,padding:'1px 3px',marginTop:1,overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{ev.venue}</div>)}
            {dayEvents.length>2&&<div style={{fontSize:8,color:C.acc2,fontWeight:700}}>+{dayEvents.length-2}</div>}
          </div>;
        })}
      </div>
    </div>}

    {/* LIST VIEW */}
    {calView==='list'&&<div>
      {allEvents.length===0&&<div style={{textAlign:'center',padding:'40px 20px',color:C.muted}}>
        <div style={{fontSize:36,marginBottom:12}}>📅</div>
        <div style={{fontSize:14,fontWeight:700,marginBottom:8}}>No shows scheduled yet</div>
        <div style={{fontSize:12}}>Set a Show Date on any confirmed venue or add tour dates to see them here.</div>
      </div>}
      {sortedMonths.map(month=><div key={month} style={{marginBottom:24}}>
        <div style={{fontFamily:font.head,fontWeight:700,fontSize:13,color:C.acc2,letterSpacing:1.5,textTransform:'uppercase',marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <span>{month}</span>
          <span style={{fontSize:10,color:C.muted,fontWeight:400}}>{grouped[month].length} show{grouped[month].length!==1?'s':''}</span>
        </div>
        {grouped[month].map(v=>{
          const pcolor=PIPE_COLORS[v.status]||C.muted;
          const gcalUrl=buildGoogleCalendarUrl(v, v.date||null);
          const outlookUrl=buildOutlookCalendarUrl(v, v.date||null);
          return <div key={v.id} style={{background:C.surf,border:`1px solid ${C.bord}`,borderLeft:`3px solid ${pcolor}`,borderRadius:12,padding:'14px 14px',marginBottom:10,cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <div style={{flex:1,cursor:'pointer'}} onClick={()=>v.type==='venue'&&onVenueClick&&onVenueClick(v.id)}>
                <div style={{fontFamily:font.head,fontWeight:700,fontSize:15,marginBottom:3}}>
                  {v.venue}{v.isTourDate&&<span style={{fontSize:10,background:'rgba(124,58,237,0.15)',color:C.acc2,borderRadius:10,padding:'2px 7px',marginLeft:6}}>{v.tourName}</span>}
                </div>
                <div style={{fontSize:11,color:C.muted,marginBottom:4}}>
                  {v.city}{v.state?', '+v.state:''}
                  {v.date&&<span style={{marginLeft:8,color:C.acc2,fontWeight:600}}>📅 {new Date(v.date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span>}
                  {!v.date&&v.targetDates&&<span style={{marginLeft:8,color:C.muted}}>~ {v.targetDates}</span>}
                </div>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',alignItems:'center'}}>
                  <span style={{fontSize:10,padding:'3px 9px',borderRadius:20,background:`${pcolor}18`,color:pcolor,border:`1px solid ${pcolor}30`}}>{v.status}</span>
                  {v.guarantee>0&&<span style={{fontSize:11,color:C.green,fontFamily:font.head,fontWeight:700}}>{formatCurrency(v.guarantee)}</span>}
                  {v.isTourDate&&v.comedianPayouts?.length>0&&<span style={{fontSize:10,color:C.pink}}>
                    -{formatCurrency(v.comedianPayouts.filter(p=>p.onThisDate).reduce((a,p)=>a+(Number(p.actual)||Number(p.projected)||0),0))} payouts
                  </span>}
                  {v.agreementType&&<span style={{fontSize:9,padding:'2px 7px',borderRadius:20,background:'rgba(253,203,110,0.1)',color:C.yellow,border:'1px solid rgba(253,203,110,0.3)'}}>{v.agreementType}</span>}
                </div>
              </div>
            </div>

            {/* CALENDAR ADD BUTTONS */}
            {v.date&&<div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:8}}>
              {gcalUrl&&<a href={gcalUrl} target="_blank" rel="noreferrer" style={{textDecoration:'none'}}>
                <button style={{...s.btn('rgba(66,133,244,0.1)','#4285f4','rgba(66,133,244,0.3)'),fontSize:10,padding:'5px 10px'}}>📅 Google Cal</button>
              </a>}
              {outlookUrl&&<a href={outlookUrl} target="_blank" rel="noreferrer" style={{textDecoration:'none'}}>
                <button style={{...s.btn('rgba(0,114,239,0.1)','#0072ef','rgba(0,114,239,0.3)'),fontSize:10,padding:'5px 10px'}}>📅 Outlook</button>
              </a>}
              <button onClick={()=>{downloadICS([{date:v.date,venue:v.venue,city:v.city,state:v.state,guarantee:v.guarantee||0,dealType:v.dealType||'',tourName:v.tourName||''}]);toast2&&toast2('📅 Event downloaded!');}} style={{...s.btn('rgba(0,184,148,0.1)',C.green,'rgba(0,184,148,0.3)'),fontSize:10,padding:'5px 10px'}}>📥 Apple / .ics</button>
            </div>}

            <div style={{background:C.surf2,borderRadius:8,padding:'8px 10px',marginBottom:8}}>
              <div style={{fontSize:11,color:C.muted}}>
                {v.booker&&<span style={{marginRight:10}}>👤 {v.booker} {v.bookerLast||''}</span>}
                {v.dealType&&<span>{v.dealType}</span>}
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6}}>
              {[['Deal',v.dealType||'—'],['Lodging',v.lodging||'—'],['Contract',v.contractStatus||'—']].map(([l,val])=>(
                <div key={l} style={{background:C.bg,borderRadius:6,padding:'5px 8px'}}>
                  <div style={{fontSize:8,color:C.muted,textTransform:'uppercase',letterSpacing:1}}>{l}</div>
                  <div style={{fontSize:10,fontWeight:600}}>{val}</div>
                </div>
              ))}
            </div>
            {v.checklist&&<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 10px',background:C.surf2,borderRadius:8,marginTop:8,cursor:'pointer'}} onClick={()=>onChecklist&&onChecklist(v.id)}>
              <span style={{fontSize:11,color:C.muted}}>📋 Checklist</span>
              <span style={{fontSize:11,fontFamily:font.head,fontWeight:700,color:checklistPct(v.checklist)===100?C.green:C.yellow}}>{checklistPct(v.checklist)}%</span>
            </div>}
            {v.depositAmount>0&&!v.depositPaid&&v.depositDue&&<div style={{marginTop:8,padding:'6px 10px',background:'rgba(225,112,85,0.1)',border:'1px solid rgba(225,112,85,0.2)',borderRadius:8,fontSize:11,color:C.red}}>⚠️ Deposit {formatCurrency(v.depositAmount)} due {v.depositDue}</div>}
          </div>;
        })}
      </div>)}
    </div>}
  </div>;
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
    <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
      <button onClick={()=>onSave({...template,id:template.id==='new'?Date.now().toString():template.id,name,subject,body,photoLinks})} style={s.btn(C.acc,'#fff',null)}>Save Template</button>
      <button onClick={onCancel} style={s.btn(C.surf2,C.txt,C.bord)}>Cancel</button>
    </div>
  </>;
}

// -- TOUR EDITOR ----------------------------------------------
// ─────────────────────────────────────────────────────────────────────────────
// SMARTBOSS AI — Tour Intelligence Engine
// Reads all tours, venues, dates, gaps → AI-powered routing & booking advice
// ─────────────────────────────────────────────────────────────────────────────
function SmartBossAI({venues=[], tours=[], comedians=[]}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('year'); // 'chat' | 'plan' | 'year'
  const [planConfig, setPlanConfig] = useState({
    comedian: '', region: 'Nationwide', venueType: 'Comedy Club',
    weeks: '4', startAfter: '', focus: 'Max Revenue',
    avoidDates: '', notes: ''
  });
  const [planResult, setPlanResult] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [expandedMonth, setExpandedMonth] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({behavior:'smooth'}); }, [messages]);

  // ── Build rich context snapshot of everything Jason has booked ──
  function buildTourContext() {
    const now = new Date();
    const confirmedVenues = venues.filter(v => ['Confirmed','Advancing','Negotiating'].includes(v.status));
    const bookedCities = [...new Set(confirmedVenues.map(v => `${v.city}, ${v.state}`))];
    const bookedStates = [...new Set(confirmedVenues.map(v => v.state))];
    const uncontactedClubs = venues.filter(v => v.status === 'Lead' && v.venueType === 'Comedy Club');
    const respondingVenues = venues.filter(v => v.status === 'Responding');

    // Parse all tour dates into a flat timeline
    const allShowDates = [];
    tours.forEach(t => {
      (t.dates || []).forEach(d => {
        if (d.date) allShowDates.push({
          tourName: t.name,
          date: d.date,
          venue: d.venue,
          city: d.city,
          state: d.state,
          guarantee: d.guarantee || 0,
          status: d.status || 'Hold',
        });
      });
    });
    allShowDates.sort((a,b) => a.date.localeCompare(b.date));

    // Find calendar gaps (windows of 5+ days with no shows)
    const gaps = [];
    for (let i = 0; i < allShowDates.length - 1; i++) {
      const d1 = new Date(allShowDates[i].date);
      const d2 = new Date(allShowDates[i+1].date);
      const diff = Math.round((d2 - d1) / 86400000);
      if (diff >= 5) {
        gaps.push({
          from: allShowDates[i].date,
          to: allShowDates[i+1].date,
          days: diff,
          afterCity: `${allShowDates[i].city}, ${allShowDates[i].state}`,
          beforeCity: `${allShowDates[i+1].city}, ${allShowDates[i+1].state}`,
        });
      }
    }

    // Revenue analysis
    const totalBooked = confirmedVenues.reduce((a,v) => a + (v.guarantee || 0), 0);
    const tourRevenue = tours.reduce((a,t) => {
      return a + (t.dates||[]).reduce((b,d) => b + (d.guarantee||0), 0);
    }, 0);

    // States never played
    const allStates = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'];
    const neverPlayed = allStates.filter(s => !bookedStates.includes(s));

    // Comedian roster
    const rosterNames = comedians.filter(c => c.active).map(c => `${c.name} (${c.role})`);

    return {
      summary: {
        totalTours: tours.length,
        totalConfirmedShows: confirmedVenues.length,
        totalBookedRevenue: totalBooked,
        tourPipelineRevenue: tourRevenue,
        citiesBooked: bookedCities.length,
        statesBooked: bookedStates.length,
        statesNeverPlayed: neverPlayed,
        openLeads: uncontactedClubs.length,
        responding: respondingVenues.length,
      },
      tours: tours.map(t => ({
        name: t.name,
        dates: `${t.startDate||'?'} to ${t.endDate||'?'}`,
        shows: (t.dates||[]).length,
        cities: (t.dates||[]).map(d => `${d.city||'?'}, ${d.state||'?'} (${d.date||'?'}) - ${d.venue||'?'} $${d.guarantee||0} [${d.status||'Hold'}]`),
        gross: (t.dates||[]).reduce((a,d)=>a+(d.guarantee||0),0),
      })),
      calendarGaps: gaps,
      upcomingShows: allShowDates.filter(d => d.date >= now.toISOString().slice(0,10)).slice(0,20),
      pastShows: allShowDates.filter(d => d.date < now.toISOString().slice(0,10)).slice(-15),
      confirmedCities: bookedCities,
      respondingVenues: respondingVenues.map(v => `${v.venue}, ${v.city} ${v.state}`),
      roster: rosterNames,
      topUncontactedClubs: uncontactedClubs
        .sort((a,b) => (b.capacity||0) - (a.capacity||0))
        .slice(0,30)
        .map(v => `${v.venue} - ${v.city}, ${v.state} (cap:${v.capacity||'?'}, guar:$${v.guarantee||0})`),
    };
  }

  const SYSTEM_PROMPT = `You are SmartBoss — the most sophisticated AI touring agent and booking intelligence system ever built for the comedy industry. You work exclusively for Jason Schu, a full-time comedy manager who books non-stop touring for Phil Medina and other comedians.

Your job is to think like a veteran touring agent with 20 years of experience. You understand:
- How to build logistically efficient tour routing (minimize dead miles, cluster nearby cities)
- The comedy touring calendar (avoid Super Bowl weekend, major holidays, college finals, etc.)
- Which markets are underserved vs oversaturated
- How to anchor a tour around a big confirmed date and fill in the surrounding markets
- Regional touring logic (e.g. if you're in Denver, hit Salt Lake City + Albuquerque on the same run)
- Venue tier strategy: comedy clubs → theaters → casinos as headliner grows
- College vs club touring differences
- How to stack a week efficiently: Thurs/Fri/Sat at one club, then Sun/Mon drive to next market
- Weekend shows pay more; weeknight shows at secondary clubs fill gaps
- The importance of not over-touring the same market (allow 6-12 month market reset)

When analyzing tours and suggesting next steps, you:
1. Look at ALL existing confirmed shows and find the geographic/date gaps
2. Recommend cities that make geographic routing sense between confirmed dates
3. Flag calendar gaps that are long enough to squeeze in 2-3 more shows
4. Suggest the single best market to hit next based on where they already are
5. Give specific venue recommendations from the CRM database
6. Warn about potential conflicts (same market too soon, radius clauses, etc.)
7. Think about the full year arc — which quarters are booked, which are open

You speak like a smart, direct industry insider. No fluff. Be specific with city names, venue names, dates, and dollar amounts. When you suggest a route, lay it out day-by-day.`;

  async function sendMessage(userMsg) {
    if (!userMsg.trim()) return;
    const ctx = buildTourContext();
    const contextBlock = `\n\n=== JASON'S CURRENT BOOKING STATE ===\n${JSON.stringify(ctx, null, 2)}\n=== END CONTEXT ===\n`;

    const newMessages = [...messages, {role:'user', content: userMsg}];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const session = await sbAuthClient.auth.getSession();
      const token = session?.data?.session?.access_token || '';
      const res = await fetch('/.netlify/functions/smartboss', {
        method: 'POST',
        headers: {'Content-Type':'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({
          system: SYSTEM_PROMPT + contextBlock,
          messages: newMessages.map(m => ({role: m.role, content: m.content})),
          max_tokens: 1800,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      const reply = data.content?.find(c => c.type === 'text')?.text || 'No response.';
      setMessages(prev => [...prev, {role:'assistant', content: reply}]);
    } catch(e) {
      setMessages(prev => [...prev, {role:'assistant', content: `⚠️ ${e.message || 'Connection error. Try again.'}`}]);
    }
    setLoading(false);
  }

  async function generateTourPlan() {
    const ctx = buildTourContext();
    setPlanLoading(true);
    setPlanResult(null);

    const prompt = `You are a comedy touring expert. Generate a ${planConfig.weeks}-week tour plan.

PARAMETERS:
- Comedian: ${planConfig.comedian || 'Phil Medina'}
- Region: ${planConfig.region}
- Venue Type: ${planConfig.venueType}
- Strategy: ${planConfig.focus}
- Start After: ${planConfig.startAfter || 'ASAP'}
- Avoid: ${planConfig.avoidDates || 'none'}
- Notes: ${planConfig.notes || 'none'}

CURRENT BOOKING STATE:
- Confirmed shows: ${ctx.summary.totalConfirmedShows}
- Cities already booked: ${ctx.confirmedCities.slice(0,10).join(', ') || 'none yet'}
- Calendar gaps: ${ctx.calendarGaps.slice(0,5).map(g=>g.days+' days between '+g.afterCity+' and '+g.beforeCity).join('; ') || 'none found'}
- Top uncontacted venues in region: ${ctx.topUncontactedClubs.slice(0,10).join(' | ')}
- States never played: ${ctx.summary.statesNeverPlayed.slice(0,15).join(', ')}

Return ONLY a valid JSON object — no markdown, no backticks, no extra text before or after. Exact structure:
{
  "tourName": "string",
  "region": "string",
  "estimatedGross": number,
  "totalShows": number,
  "summary": "2-3 sentence overview",
  "routeLogic": "brief routing explanation",
  "warnings": ["warning1"],
  "weeks_breakdown": [
    {
      "week": 1,
      "dates": "date range",
      "weekRevenue": number,
      "travelNote": "logistics note",
      "shows": [
        {
          "day": "Mon Jun 1",
          "city": "string",
          "state": "string",
          "venueRecommendation": "venue name",
          "venueType": "Comedy Club",
          "guarantee": number,
          "notes": "brief note",
          "priority": "High"
        }
      ]
    }
  ],
  "marketsToPrioritize": ["city1","city2"],
  "nextSteps": ["action1","action2","action3"]
}`;

    try {
      const session = await sbAuthClient.auth.getSession();
      const token = session?.data?.session?.access_token || '';
      const res = await fetch('/.netlify/functions/smartboss', {
        method: 'POST',
        headers: {'Content-Type':'application/json', 'Authorization': `Bearer ${token}`},
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: [{role:'user', content: prompt}],
          max_tokens: 4000,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');
      const raw = data.content?.find(c => c.type === 'text')?.text || '{}';
      let clean = raw.replace(/```json|```/g,'').trim();
      // Repair truncated JSON — AI can cut off before closing all brackets
      function repairJSON(str) {
        try { return JSON.parse(str); } catch {}
        let fixed = str.replace(/,\s*$/, '').replace(/,\s*([}\]])/g,'$1');
        const opens = (fixed.match(/\[/g)||[]).length - (fixed.match(/\]/g)||[]).length;
        const objOpens = (fixed.match(/\{/g)||[]).length - (fixed.match(/\}/g)||[]).length;
        for(let i=0;i<opens;i++) fixed += ']';
        for(let i=0;i<objOpens;i++) fixed += '}';
        try { return JSON.parse(fixed); } catch {}
        return null;
      }
      const plan = repairJSON(clean);
      if(!plan) throw new Error('Response was malformed. Please try again.');
      setPlanResult(plan);
    } catch(e) {
      setPlanResult({error: `Failed to generate plan: ${e.message || 'Try again.'}`});
    }
    setPlanLoading(false);
  }

  const quickPrompts = [
    {icon:'🗺️', label:'Find my calendar gaps', msg:'Look at my current tour dates and find all the calendar gaps where I could squeeze in more shows. List them with dates, how many days are open, and what cities make geographic sense to fill them.'},
    {icon:'📍', label:'Best next market', msg:'Based on where I\'m currently booked, what single city should I target next for booking? Give me the top 3 venues in that city from my CRM and a suggested outreach strategy.'},
    {icon:'🏆', label:'Underserved states', msg:'Which states have I never performed in that represent the best untapped opportunity? Rank them by potential revenue and tell me the top venues to approach there.'},
    {icon:'🚗', label:'Optimize a tour route', msg:'Look at my existing confirmed shows and suggest the most logistically efficient order to route them — minimize unnecessary backtracking and dead miles. Show me the day-by-day optimal sequence.'},
    {icon:'💰', label:'Revenue gap analysis', msg:'How much revenue am I leaving on the table in the next 90 days? What would it take to fill those open dates and what would the estimated gross be?'},
    {icon:'📅', label:'Best months to book', msg:'Looking at my historical booking patterns and upcoming calendar, which months have the most open dates? What\'s my current revenue trajectory vs. where I could be if those dates were filled?'},
    {icon:'🎓', label:'College tour strategy', msg:'Design a college circuit strategy — which campuses should I target, when is the optimal booking window (fall vs spring), and what\'s the right pitch for campus activity boards?'},
    {icon:'🎰', label:'Casino circuit', msg:'Map out a casino circuit tour — which tribal and commercial casinos in the database should I prioritize, what are typical guarantees, and how do I sequence them geographically?'},
  ];

  const C2 = {
    bg: 'rgba(10,10,20,0.95)',
    surf: 'rgba(20,20,35,0.9)',
    surf2: 'rgba(28,28,45,0.95)',
    acc: '#7c3aed',
    acc2: '#a78bfa',
    green: '#00b894',
    yellow: '#ffd700',
    pink: '#ec4899',
    txt: '#f0f0ff',
    muted: 'rgba(200,200,255,0.45)',
    bord: 'rgba(124,58,237,0.25)',
  };

  function MsgBubble({msg}) {
    const isUser = msg.role === 'user';
    // Parse response to render structured sections nicely
    const lines = msg.content.split('\n');
    return (
      <div style={{display:'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap:10, marginBottom:16, alignItems:'flex-start'}}>
        {!isUser && <div style={{width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0}}>🧠</div>}
        <div style={{
          maxWidth:'82%',
          background: isUser ? 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(236,72,153,0.2))' : C2.surf2,
          border: `1px solid ${isUser ? 'rgba(124,58,237,0.4)' : C2.bord}`,
          borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
          padding:'12px 14px',
          fontSize:13,
          color: C2.txt,
          lineHeight:1.6,
          whiteSpace:'pre-wrap',
          fontFamily:'system-ui,-apple-system,sans-serif',
        }}>
          {msg.content}
        </div>
      </div>
    );
  }

  function PlanCard({week}) {
    const isOpen = activeCard === week.week;
    return (
      <div style={{background: C2.surf2, border:`1px solid ${C2.bord}`, borderRadius:14, marginBottom:10, overflow:'hidden'}}>
        <div onClick={()=>setActiveCard(isOpen ? null : week.week)}
          style={{padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer'}}>
          <div>
            <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:15, letterSpacing:0.5, color: C2.acc2}}>WEEK {week.week} — {week.dates}</div>
            <div style={{fontSize:11, color: C2.muted, marginTop:2}}>{week.shows?.length||0} shows · ${(week.weekRevenue||0).toLocaleString()} est.</div>
          </div>
          <div style={{fontSize:18, color: C2.acc2}}>{isOpen ? '▲' : '▼'}</div>
        </div>
        {isOpen && <div style={{borderTop:`1px solid ${C2.bord}`, padding:'12px 14px'}}>
          {week.travelNote && <div style={{background:'rgba(124,58,237,0.08)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:8, padding:'8px 10px', marginBottom:10, fontSize:11, color: C2.acc2}}>
            ✈️ {week.travelNote}
          </div>}
          {(week.shows||[]).map((show,i) => (
            <div key={i} style={{display:'flex', gap:10, marginBottom:10, alignItems:'flex-start'}}>
              <div style={{width:4, borderRadius:2, alignSelf:'stretch', background: show.priority==='High' ? C2.green : show.priority==='Medium' ? C2.yellow : C2.muted, flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2}}>
                  <span style={{fontSize:12, fontWeight:700, color: C2.txt}}>{show.day} — {show.city}, {show.state}</span>
                  <span style={{fontSize:12, fontWeight:700, color: C2.green}}>${(show.guarantee||0).toLocaleString()}</span>
                </div>
                <div style={{fontSize:11, color: C2.acc2, marginBottom:2}}>🏛️ {show.venueRecommendation} <span style={{color:C2.muted}}>({show.venueType})</span></div>
                {show.notes && <div style={{fontSize:11, color: C2.muted}}>{show.notes}</div>}
              </div>
            </div>
          ))}
        </div>}
      </div>
    );
  }

  return (
    <div style={{display:'flex', flexDirection:'column', height:'calc(100vh - 120px)', padding:'14px 14px 0', overflow:'hidden'}}>
      {/* Header */}
      <div style={{marginBottom:14, flexShrink:0}}>
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:4}}>
          <div style={{width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#7c3aed,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20}}>🧠</div>
          <div>
            <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:22, letterSpacing:-0.5, color:'#f0f0ff', lineHeight:1}}>SmartBoss AI</div>
            <div style={{fontSize:10, color:'rgba(167,139,250,0.8)', letterSpacing:'0.12em', textTransform:'uppercase'}}>Tour Intelligence Engine</div>
          </div>
          <div style={{marginLeft:'auto', display:'flex', gap:6}}>
            {['year','chat','plan'].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{
                padding:'6px 12px', borderRadius:20, fontSize:11, fontWeight:700, cursor:'pointer',
                border:`1px solid ${mode===m ? '#7c3aed' : 'rgba(124,58,237,0.25)'}`,
                background: mode===m ? 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(236,72,153,0.2))' : 'rgba(20,20,35,0.9)',
                color: mode===m ? '#a78bfa' : 'rgba(200,200,255,0.45)',
              }}>{m==='chat' ? '💬 Chat' : m==='plan' ? '🗺️ Plan' : '📆 Year'}</button>
            ))}
          </div>
        </div>

        {/* Live stats bar */}
        {(() => {
          const ctx = buildTourContext();
          return (
            <div style={{display:'flex', gap:8, overflowX:'auto', paddingBottom:4}}>
              {[
                ['Tours', ctx.summary.totalTours, '#7c3aed'],
                ['Confirmed', ctx.summary.totalConfirmedShows, '#00b894'],
                ['Cities', ctx.summary.citiesBooked, '#a78bfa'],
                ['States', ctx.summary.statesBooked, '#ffd700'],
                ['Gaps', ctx.calendarGaps.length, ctx.calendarGaps.length > 2 ? '#ec4899' : '#00b894'],
                ['Open Leads', ctx.summary.openLeads, 'rgba(200,200,255,0.45)'],
              ].map(([l,v,c])=>(
                <div key={l} style={{background: C2.surf2, border:`1px solid ${C2.bord}`, borderRadius:10, padding:'6px 12px', flexShrink:0, textAlign:'center'}}>
                  <div style={{fontSize:16, fontFamily:'Bebas Neue,Impact,sans-serif', color:c, lineHeight:1}}>{v}</div>
                  <div style={{fontSize:9, color: C2.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginTop:1}}>{l}</div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* ── YEAR AT A GLANCE MODE ── */}
      {mode === 'year' && (()=>{
        const now = new Date();
        const viewYear = now.getFullYear();

        // Build flat list of all show dates across tours + confirmed venues
        const allEvents = [];
        tours.forEach(t => {
          (t.dates||[]).forEach(d => {
            if (d.date) allEvents.push({
              date: d.date, venue: d.venue||'', city: d.city||'', state: d.state||'',
              guarantee: d.guarantee||0, status: d.status||'Hold', tourName: t.name,
              source: 'tour',
            });
          });
        });
        venues.filter(v=>v.targetDates&&['Confirmed','Negotiating','Advancing'].includes(v.status)).forEach(v=>{
          const dates = v.targetDates.split(',').map(s=>s.trim()).filter(Boolean);
          dates.forEach(d=>{
            if(/^\d{4}-\d{2}-\d{2}$/.test(d)) allEvents.push({
              date: d, venue: v.venue, city: v.city, state: v.state,
              guarantee: v.guarantee||0, status: v.status, tourName:'CRM',
              source: 'venue',
            });
          });
        });
        allEvents.sort((a,b)=>a.date.localeCompare(b.date));

        // Build month map: month 0-11 -> array of events
        const byMonth = Array.from({length:12},()=>[]);
        allEvents.forEach(e=>{
          const d = new Date(e.date+'T12:00:00');
          if (d.getFullYear()===viewYear) byMonth[d.getMonth()].push(e);
        });

        // Quarter stats
        const quarters = [
          {label:'Q1', months:[0,1,2], color:'#7c3aed'},
          {label:'Q2', months:[3,4,5], color:'#ec4899'},
          {label:'Q3', months:[6,7,8], color:'#00b894'},
          {label:'Q4', months:[9,10,11], color:'#ffd700'},
        ];
        const qStats = quarters.map(q=>({
          ...q,
          shows: q.months.reduce((a,m)=>a+byMonth[m].length,0),
          revenue: q.months.reduce((a,m)=>a+byMonth[m].reduce((b,e)=>b+e.guarantee,0),0),
          confirmed: q.months.reduce((a,m)=>a+byMonth[m].filter(e=>e.status==='Confirmed').length,0),
        }));

        const totalShows = allEvents.filter(e=>new Date(e.date+'T12:00:00').getFullYear()===viewYear).length;
        const totalRevenue = allEvents.filter(e=>new Date(e.date+'T12:00:00').getFullYear()===viewYear).reduce((a,e)=>a+e.guarantee,0);
        const openMonths = byMonth.filter((m,i)=>m.length===0&&i>=now.getMonth()).length;

        const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        const statusColor = s => s==='Confirmed'?'#00b894':s==='Hold'?'#ffd700':s==='Negotiating'?'#a78bfa':s==='Advancing'?'#74b9ff':'rgba(200,200,255,0.4)';
        // Week grid: build 52-week strip
        const jan1 = new Date(viewYear, 0, 1);
        const eventByWeek = {};
        allEvents.forEach(e=>{
          const d = new Date(e.date+'T12:00:00');
          if (d.getFullYear()!==viewYear) return;
          const weekNum = Math.floor((d - jan1) / (7*86400000));
          if (!eventByWeek[weekNum]) eventByWeek[weekNum] = [];
          eventByWeek[weekNum].push(e);
        });

        return (
          <div style={{flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', paddingBottom:80}}>

            {/* Year headline stats */}
            <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.08))', border:'1px solid rgba(124,58,237,0.3)', borderRadius:16, padding:'14px', marginBottom:14}}>
              <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:18, letterSpacing:-0.5, color:'#f0f0ff', marginBottom:10}}>{viewYear} FULL YEAR OVERVIEW</div>
              <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8}}>
                {[
                  ['Shows', totalShows, '#a78bfa'],
                  ['Est. Revenue','$'+(totalRevenue/1000).toFixed(1)+'k','#00b894'],
                  ['Open Months', openMonths, openMonths>3?'#e17055':'#ffd700'],
                  ['Avg/Month', totalShows>0?'$'+Math.round(totalRevenue/12).toLocaleString():'$0','#74b9ff'],
                ].map(([l,v,c])=>(
                  <div key={l} style={{background:'rgba(10,10,20,0.4)', borderRadius:10, padding:'8px 6px', textAlign:'center'}}>
                    <div style={{fontSize:17, fontFamily:'Bebas Neue,Impact,sans-serif', color:c, lineHeight:1}}>{v}</div>
                    <div style={{fontSize:9, color:'rgba(200,200,255,0.45)', textTransform:'uppercase', letterSpacing:'0.08em', marginTop:2}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 52-week heat strip */}
            <div style={{background:'rgba(20,20,35,0.9)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:14, padding:'12px 14px', marginBottom:14}}>
              <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:13, letterSpacing:0.5, color:'rgba(167,139,250,0.8)', marginBottom:8}}>52-WEEK ACTIVITY STRIP</div>
              <div style={{display:'flex', gap:2, flexWrap:'wrap'}}>
                {Array.from({length:53},(_,w)=>{
                  const evts = eventByWeek[w]||[];
                  const hasConfirmed = evts.some(e=>e.status==='Confirmed');
                  const hasHold = evts.some(e=>e.status==='Hold');
                  const isPast = (new Date(jan1.getTime()+w*7*86400000)) < now;
                  // Month label every ~4.3 weeks
                  const monthIdx = Math.floor(w / 4.33);
                  const bg = evts.length===0 ? (isPast?'rgba(255,255,255,0.04)':'rgba(124,58,237,0.08)')
                    : hasConfirmed ? '#00b894'
                    : hasHold ? '#ffd700'
                    : '#a78bfa';
                  return (
                    <div key={w} title={evts.length>0?evts.map(e=>`${e.date} ${e.venue} ${e.city}`).join('\n'):`Week ${w+1} — no shows`}
                      style={{
                        width:14, height:14, borderRadius:3,
                        background: bg,
                        opacity: isPast&&evts.length===0?0.3:1,
                        cursor: evts.length>0?'pointer':'default',
                        border: evts.length>0?`1px solid ${hasConfirmed?'rgba(0,184,148,0.5)':'rgba(255,215,0,0.4)'}` : '1px solid transparent',
                      }}
                    />
                  );
                })}
              </div>
              <div style={{display:'flex', gap:12, marginTop:8, flexWrap:'wrap'}}>
                {[['Confirmed','#00b894'],['Hold','#ffd700'],['Other/Negotiating','#a78bfa'],['Open','rgba(124,58,237,0.08)']].map(([l,c])=>(
                  <div key={l} style={{display:'flex', alignItems:'center', gap:4, fontSize:10, color:'rgba(200,200,255,0.45)'}}>
                    <div style={{width:10,height:10,borderRadius:2,background:c,border:'1px solid rgba(255,255,255,0.1)'}}/>
                    {l}
                  </div>
                ))}
              </div>
            </div>

            {/* Quarter breakdown */}
            <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:13, letterSpacing:0.5, color:'rgba(167,139,250,0.8)', marginBottom:8}}>QUARTER BREAKDOWN</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14}}>
              {qStats.map(q=>{
                const fill = Math.min(100, (q.shows/Math.max(1,Math.max(...qStats.map(x=>x.shows))))*100);
                return (
                  <div key={q.label} style={{background:'rgba(20,20,35,0.9)', border:`1px solid ${q.shows>0?q.color+'44':'rgba(124,58,237,0.2)'}`, borderRadius:14, padding:'12px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6}}>
                      <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:16, color:q.color}}>{q.label}</div>
                      <div style={{fontSize:10, color:'rgba(200,200,255,0.45)'}}>{MONTH_SHORT[quarters[qStats.indexOf(q)].months[0]]}–{MONTH_SHORT[quarters[qStats.indexOf(q)].months[2]]}</div>
                    </div>
                    <div style={{fontSize:18, fontFamily:'Bebas Neue,Impact,sans-serif', color:'#f0f0ff', marginBottom:2}}>{q.shows} <span style={{fontSize:11, color:'rgba(200,200,255,0.45)', fontFamily:'system-ui'}}>shows</span></div>
                    <div style={{fontSize:12, color:q.color, fontWeight:700, marginBottom:6}}>${q.revenue.toLocaleString()}</div>
                    {/* Bar */}
                    <div style={{height:4, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden'}}>
                      <div style={{height:'100%', width:fill+'%', background:q.color, borderRadius:2, transition:'width 0.6s'}}/>
                    </div>
                    {q.shows===0 && <div style={{marginTop:6, fontSize:10, color:'#e17055', fontWeight:700}}>⚠️ OPEN — NOTHING BOOKED</div>}
                    {q.confirmed>0 && <div style={{marginTop:4, fontSize:10, color:'#00b894'}}>{q.confirmed} confirmed ✓</div>}
                  </div>
                );
              })}
            </div>

            {/* Month-by-month list */}
            <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:13, letterSpacing:0.5, color:'rgba(167,139,250,0.8)', marginBottom:8}}>MONTH-BY-MONTH</div>
            {MONTHS.map((mName, mi)=>{
              const events = byMonth[mi];
              const isPastMonth = mi < now.getMonth() && viewYear === now.getFullYear();
              const isCurrentMonth = mi === now.getMonth() && viewYear === now.getFullYear();
              const monthRev = events.reduce((a,e)=>a+e.guarantee,0);
              const isOpen = expandedMonth === mi;
              const hasShows = events.length > 0;
              const borderColor = hasShows ? (events.some(e=>e.status==='Confirmed')?'rgba(0,184,148,0.3)':'rgba(255,215,0,0.25)') : isPastMonth ? 'rgba(255,255,255,0.06)' : 'rgba(225,112,85,0.2)';

              return (
                <div key={mi} style={{background:'rgba(20,20,35,0.9)', border:`1px solid ${borderColor}`, borderRadius:12, marginBottom:8, overflow:'hidden', opacity: isPastMonth&&!hasShows?0.5:1}}>
                  <div onClick={()=>setExpandedMonth(isOpen?null:mi)} style={{padding:'10px 14px', display:'flex', alignItems:'center', gap:10, cursor:'pointer'}}>
                    {/* Month indicator */}
                    <div style={{width:40, textAlign:'center', flexShrink:0}}>
                      <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:18, lineHeight:1, color: isCurrentMonth?'#a78bfa':isPastMonth?'rgba(200,200,255,0.3)':'#f0f0ff'}}>{MONTH_SHORT[mi]}</div>
                      <div style={{fontSize:9, color:'rgba(200,200,255,0.3)', marginTop:1}}>{viewYear}</div>
                    </div>
                    {/* Status bar */}
                    <div style={{flex:1}}>
                      {hasShows ? (
                        <>
                          <div style={{display:'flex', gap:4, marginBottom:3, flexWrap:'wrap'}}>
                            {events.slice(0,4).map((e,i)=>(
                              <div key={i} style={{background:statusColor(e.status)+'22', border:`1px solid ${statusColor(e.status)}55`, borderRadius:6, padding:'2px 6px', fontSize:9, color:statusColor(e.status)}}>
                                {new Date(e.date+'T12:00:00').getDate()} {e.city||e.venue}
                              </div>
                            ))}
                            {events.length>4&&<div style={{fontSize:9, color:'rgba(200,200,255,0.4)', padding:'2px 4px'}}>+{events.length-4} more</div>}
                          </div>
                          <div style={{fontSize:10, color:'rgba(200,200,255,0.5)'}}>{events.length} show{events.length!==1?'s':''} · <span style={{color:'#00b894', fontWeight:700}}>${monthRev.toLocaleString()}</span></div>
                        </>
                      ) : (
                        <div style={{fontSize:11, color: isPastMonth?'rgba(200,200,255,0.25)':'#e17055', fontWeight: isPastMonth?400:700}}>
                          {isPastMonth ? 'No shows recorded' : '⚠️ NOTHING BOOKED — OPEN WINDOW'}
                        </div>
                      )}
                    </div>
                    <div style={{fontSize:14, color:'rgba(167,139,250,0.5)', flexShrink:0}}>{isOpen?'▲':'▼'}</div>
                  </div>

                  {isOpen && (
                    <div style={{borderTop:'1px solid rgba(124,58,237,0.15)', padding:'10px 14px'}}>
                      {hasShows ? events.map((e,i)=>(
                        <div key={i} style={{display:'flex', gap:10, alignItems:'center', marginBottom:8, paddingBottom:8, borderBottom: i<events.length-1?'1px solid rgba(255,255,255,0.04)':'none'}}>
                          <div style={{width:28, height:28, borderRadius:8, background:statusColor(e.status)+'22', border:`1px solid ${statusColor(e.status)}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
                            <span style={{fontSize:11, fontFamily:'Bebas Neue,Impact,sans-serif', color:statusColor(e.status)}}>{new Date(e.date+'T12:00:00').getDate()}</span>
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12, fontWeight:700, color:'#f0f0ff'}}>{e.venue||'TBD'} — {e.city}, {e.state}</div>
                            <div style={{fontSize:10, color:'rgba(200,200,255,0.4)'}}>{e.date} · {e.tourName} · <span style={{color:statusColor(e.status)}}>{e.status}</span></div>
                          </div>
                          <div style={{fontSize:13, fontWeight:700, color:'#00b894', flexShrink:0}}>${(e.guarantee||0).toLocaleString()}</div>
                        </div>
                      )) : (
                        <div style={{padding:'8px 0'}}>
                          <div style={{fontSize:11, color:'#e17055', marginBottom:8}}>This month has no bookings. SmartBoss suggests:</div>
                          <button onClick={()=>{setMode('chat'); setTimeout(()=>sendMessage(`I have nothing booked in ${mName} ${viewYear}. What cities and venues should I target to fill this month? Give me a specific outreach plan.`),200);}} style={{
                            background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:8,
                            padding:'8px 12px', fontSize:11, color:'#a78bfa', cursor:'pointer', width:'100%', textAlign:'left',
                          }}>🧠 Ask SmartBoss: "What should I book for {mName}?"</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* CTA if many open months */}
            {openMonths >= 3 && (
              <div style={{background:'rgba(225,112,85,0.08)', border:'1px solid rgba(225,112,85,0.3)', borderRadius:14, padding:'14px', marginBottom:14, textAlign:'center'}}>
                <div style={{fontSize:18, marginBottom:6}}>⚠️</div>
                <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:15, color:'#e17055', marginBottom:4}}>
                  {openMonths} MONTHS STILL OPEN IN {viewYear}
                </div>
                <div style={{fontSize:11, color:'rgba(200,200,255,0.5)', marginBottom:10}}>
                  At your current booking pace — leaving significant revenue on the table.
                </div>
                <div style={{display:'flex', gap:8}}>
                  <button onClick={()=>setMode('plan')} style={{flex:1, padding:'10px', background:'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(236,72,153,0.2))', border:'1px solid rgba(124,58,237,0.4)', borderRadius:10, color:'#a78bfa', fontSize:11, fontWeight:700, cursor:'pointer'}}>
                    🗺️ Generate Tour Plan
                  </button>
                  <button onClick={()=>{setMode('chat'); setTimeout(()=>sendMessage(`I have ${openMonths} open months in ${viewYear}. Build me a strategy to fill them. What's the most efficient route and which markets should I prioritize first?`),200);}} style={{flex:1, padding:'10px', background:'rgba(20,20,35,0.9)', border:'1px solid rgba(124,58,237,0.25)', borderRadius:10, color:'rgba(167,139,250,0.8)', fontSize:11, fontWeight:700, cursor:'pointer'}}>
                    💬 Ask SmartBoss
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ── CHAT MODE ── */}
      {mode === 'chat' && <div style={{display:'flex', flexDirection:'column', flex:1, overflow:'hidden'}}>
        {/* Messages */}
        <div style={{flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', paddingBottom:8}}>
          {messages.length === 0 && (
            <div>
              <div style={{textAlign:'center', padding:'20px 0 16px', color: C2.muted, fontSize:12}}>
                Ask SmartBoss anything about your tours, routing, markets, and strategy.
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16}}>
                {quickPrompts.map((p,i) => (
                  <button key={i} onClick={()=>sendMessage(p.msg)} style={{
                    background: C2.surf2, border:`1px solid ${C2.bord}`, borderRadius:12,
                    padding:'10px 12px', textAlign:'left', cursor:'pointer', color: C2.txt,
                  }}>
                    <div style={{fontSize:18, marginBottom:4}}>{p.icon}</div>
                    <div style={{fontSize:11, fontWeight:700, color: C2.acc2, lineHeight:1.3}}>{p.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m,i) => <MsgBubble key={i} msg={m}/>)}
          {loading && (
            <div style={{display:'flex', gap:10, marginBottom:16, alignItems:'flex-start'}}>
              <div style={{width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#ec4899)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0}}>🧠</div>
              <div style={{background: C2.surf2, border:`1px solid ${C2.bord}`, borderRadius:'4px 18px 18px 18px', padding:'14px 16px'}}>
                <div style={{display:'flex', gap:5, alignItems:'center'}}>
                  {[0,1,2].map(i=><div key={i} style={{width:7, height:7, borderRadius:'50%', background:'#a78bfa', animation:`pulse 1.2s ease-in-out ${i*0.2}s infinite`}}/>)}
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef}/>
        </div>

        {/* Input */}
        <div style={{flexShrink:0, paddingBottom:14, paddingTop:8}}>
          {messages.length > 0 && (
            <div style={{display:'flex', gap:6, overflowX:'auto', marginBottom:8, paddingBottom:2}}>
              {[
                {icon:'🗺️', label:'Find gaps', msg:'Find my calendar gaps and what I can fill'},
                {icon:'📍', label:'Best next city', msg:'What\'s the best next city to book right now?'},
                {icon:'💡', label:'Tour suggestion', msg:'Suggest a 2-week tour I could build right now around my existing confirmed dates'},
                {icon:'⚠️', label:'Warnings', msg:'Any routing conflicts or market oversaturation warnings I should know about?'},
              ].map((p,i)=>(
                <button key={i} onClick={()=>sendMessage(p.msg)} style={{
                  flexShrink:0, background: C2.surf, border:`1px solid ${C2.bord}`,
                  borderRadius:20, padding:'5px 12px', fontSize:11, color: C2.acc2,
                  cursor:'pointer', whiteSpace:'nowrap',
                }}>{p.icon} {p.label}</button>
              ))}
            </div>
          )}
          <div style={{display:'flex', gap:8, alignItems:'flex-end'}}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(input); }}}
              placeholder="Ask SmartBoss about routing, markets, dates, strategy..."
              rows={2}
              style={{
                flex:1, background: C2.surf2, border:`1px solid ${C2.bord}`,
                borderRadius:14, padding:'12px 14px', color: C2.txt, fontSize:13,
                fontFamily:'system-ui,-apple-system,sans-serif', resize:'none',
                outline:'none', lineHeight:1.4,
              }}
            />
            <button
              onClick={()=>sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{
                width:46, height:46, borderRadius:14, flexShrink:0,
                background: loading || !input.trim() ? 'rgba(124,58,237,0.2)' : 'linear-gradient(135deg,#7c3aed,#ec4899)',
                border:`1px solid ${loading || !input.trim() ? C2.bord : 'transparent'}`,
                color:'#fff', fontSize:20, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>↑</button>
          </div>
          <div style={{display:'flex', justifyContent:'space-between', marginTop:6}}>
            <div style={{fontSize:10, color: C2.muted}}>Press Enter to send · Shift+Enter for new line</div>
            {messages.length > 0 && <button onClick={()=>setMessages([])} style={{fontSize:10, color: C2.muted, background:'none', border:'none', cursor:'pointer'}}>Clear chat</button>}
          </div>
        </div>
      </div>}

      {/* ── PLAN MODE ── */}
      {mode === 'plan' && <div style={{flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', paddingBottom:80}}>
        {!planResult && <>
          <div style={{background: C2.surf2, border:`1px solid ${C2.bord}`, borderRadius:16, padding:'16px 14px', marginBottom:14}}>
            <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:16, letterSpacing:0.5, color: C2.acc2, marginBottom:12}}>🗺️ TOUR BLUEPRINT GENERATOR</div>
            <div style={{fontSize:12, color: C2.muted, marginBottom:14, lineHeight:1.5}}>SmartBoss will analyze your entire booking history, find calendar gaps, and generate a day-by-day tour plan with specific venue recommendations, estimated revenue, and routing logic.</div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10}}>
              <div>
                <div style={{fontSize:10, color: C2.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4}}>Comedian</div>
                <input value={planConfig.comedian} onChange={e=>setPlanConfig(p=>({...p,comedian:e.target.value}))}
                  placeholder="Phil Medina"
                  style={{width:'100%', background:'rgba(10,10,20,0.6)', border:`1px solid ${C2.bord}`, borderRadius:8, padding:'8px 10px', color: C2.txt, fontSize:12, boxSizing:'border-box'}}/>
              </div>
              <div>
                <div style={{fontSize:10, color: C2.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4}}>Tour Length</div>
                <select value={planConfig.weeks} onChange={e=>setPlanConfig(p=>({...p,weeks:e.target.value}))}
                  style={{width:'100%', background:'rgba(10,10,20,0.6)', border:`1px solid ${C2.bord}`, borderRadius:8, padding:'8px 10px', color: C2.txt, fontSize:12}}>
                  {['1','2','3','4','6','8'].map(w=><option key={w} value={w}>{w} Week{w>1?'s':''}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:10, color: C2.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4}}>Region</div>
                <select value={planConfig.region} onChange={e=>setPlanConfig(p=>({...p,region:e.target.value}))}
                  style={{width:'100%', background:'rgba(10,10,20,0.6)', border:`1px solid ${C2.bord}`, borderRadius:8, padding:'8px 10px', color: C2.txt, fontSize:12}}>
                  {['Nationwide','Southeast','Northeast','Midwest','Southwest','West Coast','Texas Circuit','College Circuit','Casino Circuit','Pacific Northwest'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:10, color: C2.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4}}>Venue Focus</div>
                <select value={planConfig.venueType} onChange={e=>setPlanConfig(p=>({...p,venueType:e.target.value}))}
                  style={{width:'100%', background:'rgba(10,10,20,0.6)', border:`1px solid ${C2.bord}`, borderRadius:8, padding:'8px 10px', color: C2.txt, fontSize:12}}>
                  {['Comedy Club','Theater','Casino','University','Mixed (All Types)','Clubs + Theaters','Casinos Only','Colleges Only'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <div style={{fontSize:10, color: C2.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4}}>Start After</div>
                <input type="date" value={planConfig.startAfter} onChange={e=>setPlanConfig(p=>({...p,startAfter:e.target.value}))}
                  style={{width:'100%', background:'rgba(10,10,20,0.6)', border:`1px solid ${C2.bord}`, borderRadius:8, padding:'8px 10px', color: C2.txt, fontSize:12, boxSizing:'border-box'}}/>
              </div>
              <div>
                <div style={{fontSize:10, color: C2.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4}}>Strategy</div>
                <select value={planConfig.focus} onChange={e=>setPlanConfig(p=>({...p,focus:e.target.value}))}
                  style={{width:'100%', background:'rgba(10,10,20,0.6)', border:`1px solid ${C2.bord}`, borderRadius:8, padding:'8px 10px', color: C2.txt, fontSize:12}}>
                  {['Max Revenue','New Markets','Fill Calendar Gaps','Cluster Nearby Cities','Anchor + Fill','Build Fan Base','Casino Heavy'].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div>
              <div style={{fontSize:10, color: C2.muted, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4}}>Avoid Dates / Notes</div>
              <input value={planConfig.avoidDates} onChange={e=>setPlanConfig(p=>({...p,avoidDates:e.target.value}))}
                placeholder="e.g. Avoid March 15-20, no more LA this quarter..."
                style={{width:'100%', background:'rgba(10,10,20,0.6)', border:`1px solid ${C2.bord}`, borderRadius:8, padding:'8px 10px', color: C2.txt, fontSize:12, boxSizing:'border-box'}}/>
            </div>
          </div>

          <button onClick={generateTourPlan} disabled={planLoading} style={{
            width:'100%', padding:'16px', borderRadius:14, fontSize:14, fontWeight:700,
            background: planLoading ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg,#7c3aed,#ec4899)',
            border:'none', color:'#fff', cursor: planLoading ? 'not-allowed' : 'pointer',
            fontFamily:'Bebas Neue,Impact,sans-serif', letterSpacing:1, marginBottom:14,
          }}>
            {planLoading ? '🧠 Generating Tour Plan...' : '🗺️ GENERATE TOUR BLUEPRINT'}
          </button>

          {planLoading && <div style={{textAlign:'center', padding:'30px 0'}}>
            <div style={{fontSize:32, marginBottom:12, animation:'spin 2s linear infinite', display:'inline-block'}}>🧠</div>
            <div style={{color: C2.acc2, fontSize:13, fontWeight:700, marginBottom:6}}>Analyzing your booking history...</div>
            <div style={{color: C2.muted, fontSize:11}}>Finding gaps · Mapping routes · Calculating revenue · Building your plan</div>
          </div>}
        </>}

        {planResult && !planResult.error && <>
          {/* Plan Header */}
          <div style={{background:'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(236,72,153,0.1))', border:'1px solid rgba(124,58,237,0.4)', borderRadius:16, padding:'16px 14px', marginBottom:14}}>
            <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:22, letterSpacing:-0.5, color:'#f0f0ff', marginBottom:4}}>{planResult.tourName}</div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:10}}>
              {[['Shows',planResult.totalShows,'#a78bfa'],['Est. Gross','$'+(planResult.estimatedGross||0).toLocaleString(),'#00b894'],['Weeks',planResult.weeks,'#ffd700']].map(([l,v,c])=>(
                <div key={l} style={{background:'rgba(10,10,20,0.4)', borderRadius:10, padding:'8px', textAlign:'center'}}>
                  <div style={{fontSize:18, fontFamily:'Bebas Neue,Impact,sans-serif', color:c, lineHeight:1}}>{v}</div>
                  <div style={{fontSize:9, color:'rgba(200,200,255,0.45)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:1}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:12, color:'rgba(200,200,255,0.7)', lineHeight:1.6, marginBottom:8}}>{planResult.summary}</div>
            <div style={{fontSize:11, color:'rgba(167,139,250,0.8)', lineHeight:1.5}}><strong style={{color:'#a78bfa'}}>Route Logic:</strong> {planResult.routeLogic}</div>
          </div>

          {/* Warnings */}
          {(planResult.warnings||[]).length > 0 && <div style={{background:'rgba(225,112,85,0.08)', border:'1px solid rgba(225,112,85,0.3)', borderRadius:12, padding:'10px 14px', marginBottom:14}}>
            <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:13, letterSpacing:0.5, color:'#e17055', marginBottom:6}}>⚠️ WARNINGS</div>
            {planResult.warnings.map((w,i)=><div key={i} style={{fontSize:11, color:'rgba(225,112,85,0.8)', marginBottom:3}}>• {w}</div>)}
          </div>}

          {/* Gaps found */}
          {(planResult.gapsFound||[]).length > 0 && <div style={{background:'rgba(0,184,148,0.06)', border:'1px solid rgba(0,184,148,0.2)', borderRadius:12, padding:'10px 14px', marginBottom:14}}>
            <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:13, letterSpacing:0.5, color:'#00b894', marginBottom:6}}>💰 GAPS FOUND</div>
            {planResult.gapsFound.map((g,i)=><div key={i} style={{marginBottom:6}}>
              <div style={{fontSize:11, color:'#00b894', fontWeight:700}}>{g.gap}</div>
              <div style={{fontSize:11, color:'rgba(200,200,255,0.6)'}}>{g.opportunity}</div>
            </div>)}
          </div>}

          {/* Week by week */}
          <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:15, letterSpacing:0.5, color: C2.acc2, marginBottom:10}}>📅 WEEK-BY-WEEK BREAKDOWN</div>
          {(planResult.weeks_breakdown||[]).map(w=><PlanCard key={w.week} week={w}/>)}

          {/* Priority markets */}
          {(planResult.marketsToPrioritize||[]).length > 0 && <div style={{background: C2.surf2, border:`1px solid ${C2.bord}`, borderRadius:12, padding:'10px 14px', marginBottom:14}}>
            <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:13, letterSpacing:0.5, color: C2.acc2, marginBottom:8}}>🎯 MARKETS TO PRIORITIZE</div>
            <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
              {planResult.marketsToPrioritize.map((m,i)=>(
                <span key={i} style={{background:'rgba(124,58,237,0.15)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:20, padding:'4px 10px', fontSize:11, color: C2.acc2}}>{m}</span>
              ))}
            </div>
          </div>}

          {/* Next steps */}
          {(planResult.nextSteps||[]).length > 0 && <div style={{background:'rgba(0,184,148,0.06)', border:'1px solid rgba(0,184,148,0.2)', borderRadius:12, padding:'10px 14px', marginBottom:14}}>
            <div style={{fontFamily:'Bebas Neue,Impact,sans-serif', fontSize:13, letterSpacing:0.5, color:'#00b894', marginBottom:8}}>✅ NEXT STEPS FOR JASON</div>
            {planResult.nextSteps.map((s,i)=>(
              <div key={i} style={{display:'flex', gap:8, marginBottom:6, alignItems:'flex-start'}}>
                <div style={{width:18, height:18, borderRadius:'50%', background:'rgba(0,184,148,0.2)', border:'1px solid rgba(0,184,148,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, color:'#00b894', flexShrink:0, marginTop:1}}>{i+1}</div>
                <div style={{fontSize:12, color:'rgba(200,200,255,0.75)', lineHeight:1.5}}>{s}</div>
              </div>
            ))}
          </div>}

          <button onClick={()=>setPlanResult(null)} style={{
            width:'100%', padding:'12px', borderRadius:12, fontSize:12, fontWeight:700,
            background: C2.surf2, border:`1px solid ${C2.bord}`, color: C2.muted,
            cursor:'pointer', fontFamily:'system-ui',
          }}>← Build Another Plan</button>
        </>}

        {planResult?.error && <div style={{textAlign:'center', padding:'30px', color:'#e17055'}}>{planResult.error}</div>}
      </div>}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

function TourEditor({tour,onSave,onCancel,comedians=[]}){
  const[name,setName]=useState(tour?.name||'');
  const[startDate,setStartDate]=useState(tour?.startDate||'');
  const[endDate,setEndDate]=useState(tour?.endDate||'');
  const[travelBudget,setTravelBudget]=useState(tour?.travelBudget||'');
  const[lodgingBudget,setLodgingBudget]=useState(tour?.lodgingBudget||'');
  const[miscBudget,setMiscBudget]=useState(tour?.miscBudget||'');
  const[dates,setDates]=useState(tour?.dates||[]);
  const[notes,setNotes]=useState(tour?.notes||'');
  function addDate(){setDates(d=>[...d,{id:Date.now(),venue:'',city:'',state:'',address:'',zip:'',date:'',showCount:1,guarantee:0,dealType:'Flat Guarantee',status:'Hold',notes:''}]);}
  function updDate(id,fields){setDates(d=>d.map(x=>x.id===id?{...x,...fields}:x));}
  function removeDate(id){setDates(d=>d.filter(x=>x.id!==id));}
  const totalGuarantee=dates.reduce((a,d)=>a+(Number(d.guarantee)||0),0);
  const totalExpenses=(Number(travelBudget)||0)+(Number(lodgingBudget)||0)+(Number(miscBudget)||0);
  const totalProjectedPayouts=dates.reduce((a,d)=>a+(d.comedianPayouts||[]).filter(p=>p.onThisDate).reduce((a2,p)=>a2+(Number(p.projected)||0),0),0);
  const totalActualPayouts=dates.reduce((a,d)=>a+(d.comedianPayouts||[]).filter(p=>p.onThisDate).reduce((a2,p)=>a2+(Number(p.actual)||0),0),0);
  const netEst=totalGuarantee-totalExpenses-totalProjectedPayouts;
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
      <div style={s.grid2}>{[['Gross',formatCurrency(totalGuarantee),C.green],['Expenses',formatCurrency(totalExpenses),C.red],['Payouts',formatCurrency(totalProjectedPayouts),C.pink],['Your Net',formatCurrency(netEst),netEst>=0?C.green:C.red]].map(([l,v,color])=><div key={l}><div style={{fontSize:9,color:C.muted,textTransform:'uppercase',letterSpacing:1,marginBottom:2}}>{l}</div><div style={{fontSize:14,fontFamily:font.head,fontWeight:800,color}}>{v}</div></div>)}</div>
      {totalActualPayouts>0&&<div style={{marginTop:8,fontSize:11,color:C.muted}}>Actual paid out: <span style={{color:C.pink,fontWeight:700}}>{formatCurrency(totalActualPayouts)}</span> · Actual net: <span style={{color:C.green,fontWeight:700}}>{formatCurrency(totalGuarantee-totalExpenses-totalActualPayouts)}</span></div>}
    </div>
    <div style={{fontFamily:font.head,fontWeight:700,fontSize:13,marginBottom:10}}>[date] Show Dates</div>
    {dates.map(d=><div key={d.id} style={{background:C.surf2,border:`1px solid ${C.bord}`,borderRadius:12,padding:12,marginBottom:10}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span style={{fontSize:12,fontFamily:font.head,fontWeight:700}}>{d.venue||'New Show'}</span><button onClick={()=>removeDate(d.id)} style={{background:'none',border:'none',color:C.red,cursor:'pointer',fontSize:14}}>x</button></div>
      <div style={s.grid2}>
        <div style={{marginBottom:8}}><label style={s.label}>Venue</label><input style={s.input(11)} value={d.venue} onChange={e=>updDate(d.id,{venue:e.target.value})} placeholder="Comedy Store"/></div>
        <div style={{marginBottom:8}}><label style={s.label}>Address</label><input style={s.input(11)} value={d.address||''} onChange={e=>updDate(d.id,{address:e.target.value})} placeholder="123 Main St"/></div>
        <div style={{marginBottom:8}}><label style={s.label}>Zip Code</label><input style={s.input(11)} value={d.zip||''} onChange={e=>updDate(d.id,{zip:e.target.value})} placeholder="90028"/></div>
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

      {/* COMEDIAN PAYOUTS FOR THIS DATE */}
      <div style={{marginTop:8}}>
        <div style={{fontSize:9,color:C.acc2,fontWeight:700,letterSpacing:'0.1em',marginBottom:6}}>🎭 COMEDIAN PAYOUTS</div>
        {comedians.filter(c=>c.active).map(co=>{
          const payout=(d.comedianPayouts||[]).find(p=>p.comedianId===co.id)||{comedianId:co.id,name:co.name,role:co.role,projected:co.defaultFee||0,actual:0,onThisDate:co.role==='Headliner'};
          return <div key={co.id} style={{display:'flex',gap:6,alignItems:'center',marginBottom:4}}>
            <label style={{...s.label,marginBottom:0,minWidth:100,flexShrink:0}}>{co.name}</label>
            <input type="checkbox" checked={!!payout.onThisDate} onChange={e=>{
              const payouts=(d.comedianPayouts||[]).filter(p=>p.comedianId!==co.id);
              updDate(d.id,{comedianPayouts:[...payouts,{...payout,onThisDate:e.target.checked}]});
            }} style={{flexShrink:0}}/>
            <span style={{fontSize:9,color:C.muted,flexShrink:0}}>{co.role}</span>
            {payout.onThisDate&&<>
              <input type="number" style={{...s.input(10),flex:1}} placeholder="Projected $" value={payout.projected||''} onChange={e=>{
                const payouts=(d.comedianPayouts||[]).filter(p=>p.comedianId!==co.id);
                updDate(d.id,{comedianPayouts:[...payouts,{...payout,projected:Number(e.target.value)||0}]});
              }}/>
              <input type="number" style={{...s.input(10),flex:1}} placeholder="Actual $" value={payout.actual||''} onChange={e=>{
                const payouts=(d.comedianPayouts||[]).filter(p=>p.comedianId!==co.id);
                updDate(d.id,{comedianPayouts:[...payouts,{...payout,actual:Number(e.target.value)||0}]});
              }}/>
            </>}
          </div>;
        })}
        {/* Bookout warnings */}
        {comedians.filter(c=>c.active&&d.date&&(c.bookouts||[]).some(b=>d.date>=b.start&&d.date<=b.end)).map(co=>(
          <div key={co.id} style={{background:'rgba(225,112,85,0.1)',border:'1px solid rgba(225,112,85,0.3)',borderRadius:6,padding:'4px 8px',fontSize:10,color:C.red,marginTop:4}}>
            🚫 {co.name} is blacked out on {d.date} — {(co.bookouts||[]).find(b=>d.date>=b.start&&d.date<=b.end)?.reason||'Unavailable'}
          </div>
        ))}
      </div>
    </div>)}
    <button onClick={addDate} style={{...s.btn(C.surf2,C.txt,C.bord),width:'100%',marginBottom:16}}>+ Add Show Date</button>
    <div style={s.field()}><label style={s.label}>Tour Notes</label><textarea style={{...s.input(12),resize:'none',minHeight:60}} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Routing notes, contacts..."/></div>
    <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
      <button onClick={()=>onSave({...tour,id:tour?.id||Date.now().toString(),name,startDate,endDate,travelBudget,lodgingBudget,miscBudget,dates,notes})} style={s.btn(C.acc,'#fff',null)}>Save Tour</button>
      <button onClick={onCancel} style={s.btn(C.surf2,C.txt,C.bord)}>Cancel</button>
    </div>
  </>;
}

export default function WrappedApp(){ return <ErrorBoundary><App/></ErrorBoundary>; }
