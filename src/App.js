import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// -- SUPABASE CLOUD SYNC --------------------------------------
const BUILD_ID = '2026-02-23-v10';

const PRE_LOADED_VENUES = [
  {id:'pre_001',venue:'The Comedy Store',booker:'Potsy Ponciroli',bookerLast:'',city:'Los Angeles',state:'CA',email:'info@thecomedystore.com',instagram:'',phone:'(323) 650-6268',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:450,notes:'Main Room Belly Room Original Room',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_002',venue:'The Laugh Factory',booker:'Jamie Masada',bookerLast:'',city:'Los Angeles',state:'CA',email:'info@laughfactory.com',instagram:'',phone:'(323) 656-8860',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'Sunset Strip',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_003',venue:'The Improv',booker:'',bookerLast:'',city:'Hollywood',state:'CA',email:'info@improv.com',instagram:'',phone:'(323) 651-2583',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:250,notes:'Melrose Ave',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_004',venue:'The Ice House',booker:'',bookerLast:'',city:'Pasadena',state:'CA',email:'info@icehousecomedy.com',instagram:'',phone:'(626) 577-1894',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:200,notes:'Oldest comedy club in US',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_005',venue:'Flappers Comedy Club',booker:'',bookerLast:'',city:'Burbank',state:'CA',email:'info@flapperscomedy.com',instagram:'',phone:'(818) 845-9721',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:900,doorSplit:0,capacity:200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_006',venue:'Punch Line Comedy Club',booker:'',bookerLast:'',city:'San Francisco',state:'CA',email:'info@punchlinecomedyclub.com',instagram:'',phone:'(415) 397-4337',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_007',venue:'Cobbs Comedy Club',booker:'',bookerLast:'',city:'San Francisco',state:'CA',email:'cobbs@cobbscomedyclub.com',instagram:'',phone:'(415) 928-4320',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:400,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_008',venue:'Punchline Comedy Club',booker:'',bookerLast:'',city:'Sacramento',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_009',venue:'The Improv',booker:'',bookerLast:'',city:'Irvine',state:'CA',email:'irvine@improv.com',instagram:'',phone:'(949) 854-5455',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_010',venue:'The Improv',booker:'',bookerLast:'',city:'San Jose',state:'CA',email:'sanjose@improv.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_011',venue:'The American Comedy Co',booker:'',bookerLast:'',city:'San Diego',state:'CA',email:'info@americancomedyco.com',instagram:'',phone:'(619) 795-3858',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_012',venue:'Comedy Cellar',booker:'Noam Dworman',bookerLast:'',city:'New York',state:'NY',email:'info@comedycellar.com',instagram:'',phone:'(212) 254-3480',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:0,doorSplit:0,capacity:100,notes:'Village Underground very prestigious',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_013',venue:'Gotham Comedy Club',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@gothamcomedyclub.com',instagram:'',phone:'(212) 367-9000',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'Chelsea',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_014',venue:'Stand Up NY',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@standupny.com',instagram:'',phone:'(212) 595-0850',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:800,doorSplit:0,capacity:175,notes:'Upper West Side',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_015',venue:'The Stand NYC',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@thestandnyc.com',instagram:'',phone:'(212) 677-2600',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:200,notes:'Gramercy',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_016',venue:'Carolines on Broadway',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@carolines.com',instagram:'',phone:'(212) 757-4100',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'Times Square',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_017',venue:'New York Comedy Club',booker:'',bookerLast:'',city:'New York',state:'NY',email:'info@newyorkcomedyclub.com',instagram:'',phone:'(212) 696-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:700,doorSplit:0,capacity:150,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_018',venue:'Zanies Comedy Club',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'chicago@zanies.com',instagram:'',phone:'(312) 337-4027',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:250,notes:'Wells St',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_019',venue:'Laugh Factory Chicago',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'chicago@laughfactory.com',instagram:'',phone:'(312) 595-0800',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_020',venue:'The Improv',booker:'',bookerLast:'',city:'Schaumburg',state:'IL',email:'schaumburg@improv.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_021',venue:'The Second City',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'info@secondcity.com',instagram:'',phone:'(312) 664-4032',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'Iconic improv venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_022',venue:'Acme Comedy Company',booker:'',bookerLast:'',city:'Minneapolis',state:'MN',email:'info@acmecomedyco.com',instagram:'',phone:'(612) 338-6393',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_023',venue:'Helium Comedy Club',booker:'',bookerLast:'',city:'Philadelphia',state:'PA',email:'philly@heliumcomedy.com',instagram:'',phone:'(215) 496-9001',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_024',venue:'The Stress Factory',booker:'Vinnie Brand',bookerLast:'',city:'New Brunswick',state:'NJ',email:'info@stressfactory.com',instagram:'',phone:'(732) 545-4242',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_025',venue:'Helium Comedy Club',booker:'',bookerLast:'',city:'Portland',state:'OR',email:'portland@heliumcomedy.com',instagram:'',phone:'(503) 477-5833',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_026',venue:'Helium Comedy Club',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'stl@heliumcomedy.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_027',venue:'The Improv',booker:'',bookerLast:'',city:'Houston',state:'TX',email:'houston@improv.com',instagram:'',phone:'(713) 333-8800',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_028',venue:'Addison Improv',booker:'',bookerLast:'',city:'Addison',state:'TX',email:'addison@improv.com',instagram:'',phone:'(972) 404-8501',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1200,doorSplit:0,capacity:300,notes:'Dallas area',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_029',venue:'Hyenas Comedy Club',booker:'',bookerLast:'',city:'Fort Worth',state:'TX',email:'info@hyenascomedyclub.com',instagram:'',phone:'(817) 877-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_030',venue:'The Improv',booker:'',bookerLast:'',city:'Orlando',state:'FL',email:'orlando@improv.com',instagram:'',phone:'(321) 281-8000',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'CityWalk',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_031',venue:'The Improv',booker:'',bookerLast:'',city:'Tampa',state:'FL',email:'tampa@improv.com',instagram:'',phone:'(813) 864-4000',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_032',venue:'Miami Improv',booker:'',bookerLast:'',city:'Miami',state:'FL',email:'miami@improv.com',instagram:'',phone:'(305) 441-8200',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_033',venue:'The Punchline',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'info@punchline.com',instagram:'',phone:'(404) 252-5233',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1800,doorSplit:0,capacity:350,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_034',venue:'Zanies Comedy Club',booker:'',bookerLast:'',city:'Nashville',state:'TN',email:'nashville@zanies.com',instagram:'',phone:'(615) 269-0221',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:800,doorSplit:0,capacity:200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_035',venue:'Comedy Works',booker:'',bookerLast:'',city:'Denver',state:'CO',email:'info@comedyworks.com',instagram:'',phone:'(303) 595-3637',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'South and Downtown locations',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_036',venue:'Wise Guys Comedy',booker:'',bookerLast:'',city:'Salt Lake City',state:'UT',email:'info@wiseguyscomedy.com',instagram:'',phone:'(801) 596-8600',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_037',venue:'The DC Improv',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'info@dcimprov.com',instagram:'',phone:'(202) 296-7008',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_038',venue:'Laugh Boston',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'info@laughboston.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_039',venue:'Funny Bone',booker:'',bookerLast:'',city:'Columbus',state:'OH',email:'columbus@funnybone.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_040',venue:'Funny Bone',booker:'',bookerLast:'',city:'Cleveland',state:'OH',email:'cleveland@funnybone.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_041',venue:'Hilarities 4th Street Theatre',booker:'',bookerLast:'',city:'Cleveland',state:'OH',email:'info@pickwickandfrolic.com',instagram:'',phone:'(216) 241-7425',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_042',venue:'Crackers Comedy Club',booker:'',bookerLast:'',city:'Indianapolis',state:'IN',email:'info@crackerscomedy.com',instagram:'',phone:'(317) 631-3536',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_043',venue:'Helium Comedy Club',booker:'',bookerLast:'',city:'Indianapolis',state:'IN',email:'indy@heliumcomedy.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_044',venue:'The Improv',booker:'',bookerLast:'',city:'Kansas City',state:'MO',email:'kc@improv.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_045',venue:'Funny Bone',booker:'',bookerLast:'',city:'Des Moines',state:'IA',email:'dsm@funnybone.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_046',venue:'The Comedy Underground',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'info@comedyunderground.com',instagram:'',phone:'(206) 628-0303',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:800,doorSplit:0,capacity:200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_047',venue:'The Improv',booker:'',bookerLast:'',city:'Tempe',state:'AZ',email:'tempe@improv.com',instagram:'',phone:'(480) 921-9877',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:250,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_048',venue:'The Improv',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'vegas@improv.com',instagram:'',phone:'(702) 369-5111',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'Harrahs',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_049',venue:'Yuk Yuks',booker:'',bookerLast:'',city:'Toronto',state:'ON',email:'toronto@yukyuks.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_050',venue:'Yuk Yuks',booker:'',bookerLast:'',city:'Vancouver',state:'BC',email:'vancouver@yukyuks.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_051',venue:'The Comedy Bar',booker:'',bookerLast:'',city:'Toronto',state:'ON',email:'info@comedybar.ca',instagram:'',phone:'',preferredContact:'Email',venueType:'Comedy Club',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:600,doorSplit:0,capacity:150,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_052',venue:'Arizona State University',booker:'',bookerLast:'',city:'Tempe',state:'AZ',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'Large state school great programming',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_053',venue:'University of Arizona',booker:'',bookerLast:'',city:'Tucson',state:'AZ',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_054',venue:'UCLA',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_055',venue:'USC',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_056',venue:'UC Berkeley',booker:'',bookerLast:'',city:'Berkeley',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_057',venue:'UC San Diego',booker:'',bookerLast:'',city:'San Diego',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_058',venue:'UC Santa Barbara',booker:'',bookerLast:'',city:'Santa Barbara',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_059',venue:'Stanford University',booker:'',bookerLast:'',city:'Stanford',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_060',venue:'San Diego State University',booker:'',bookerLast:'',city:'San Diego',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_061',venue:'Cal Poly SLO',booker:'',bookerLast:'',city:'San Luis Obispo',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_062',venue:'Pepperdine University',booker:'',bookerLast:'',city:'Malibu',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1000,doorSplit:0,capacity:500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_063',venue:'University of Colorado Boulder',booker:'',bookerLast:'',city:'Boulder',state:'CO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_064',venue:'Colorado State University',booker:'',bookerLast:'',city:'Fort Collins',state:'CO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_065',venue:'University of Connecticut',booker:'',bookerLast:'',city:'Storrs',state:'CT',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_066',venue:'Yale University',booker:'',bookerLast:'',city:'New Haven',state:'CT',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_067',venue:'University of Florida',booker:'',bookerLast:'',city:'Gainesville',state:'FL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_068',venue:'Florida State University',booker:'',bookerLast:'',city:'Tallahassee',state:'FL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_069',venue:'University of Miami',booker:'',bookerLast:'',city:'Coral Gables',state:'FL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_070',venue:'University of Central Florida',booker:'',bookerLast:'',city:'Orlando',state:'FL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_071',venue:'University of Georgia',booker:'',bookerLast:'',city:'Athens',state:'GA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_072',venue:'Georgia Tech',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_073',venue:'Emory University',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_074',venue:'University of Illinois',booker:'',bookerLast:'',city:'Champaign',state:'IL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_075',venue:'Northwestern University',booker:'',bookerLast:'',city:'Evanston',state:'IL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_076',venue:'DePaul University',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_077',venue:'Indiana University',booker:'',bookerLast:'',city:'Bloomington',state:'IN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_078',venue:'Purdue University',booker:'',bookerLast:'',city:'West Lafayette',state:'IN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_079',venue:'University of Iowa',booker:'',bookerLast:'',city:'Iowa City',state:'IA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_080',venue:'Iowa State University',booker:'',bookerLast:'',city:'Ames',state:'IA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_081',venue:'University of Kansas',booker:'',bookerLast:'',city:'Lawrence',state:'KS',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_082',venue:'University of Kentucky',booker:'',bookerLast:'',city:'Lexington',state:'KY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_083',venue:'Louisiana State University',booker:'',bookerLast:'',city:'Baton Rouge',state:'LA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_084',venue:'Tulane University',booker:'',bookerLast:'',city:'New Orleans',state:'LA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_085',venue:'University of Maryland',booker:'',bookerLast:'',city:'College Park',state:'MD',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_086',venue:'Boston University',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_087',venue:'Harvard University',booker:'',bookerLast:'',city:'Cambridge',state:'MA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_088',venue:'MIT',booker:'',bookerLast:'',city:'Cambridge',state:'MA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_089',venue:'Northeastern University',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_090',venue:'UMass Amherst',booker:'',bookerLast:'',city:'Amherst',state:'MA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_091',venue:'University of Michigan',booker:'',bookerLast:'',city:'Ann Arbor',state:'MI',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:2000,notes:'Huge programming budget',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_092',venue:'Michigan State University',booker:'',bookerLast:'',city:'East Lansing',state:'MI',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_093',venue:'University of Minnesota',booker:'',bookerLast:'',city:'Minneapolis',state:'MN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_094',venue:'University of Missouri',booker:'',bookerLast:'',city:'Columbia',state:'MO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_095',venue:'Washington University St Louis',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_096',venue:'University of Nebraska',booker:'',bookerLast:'',city:'Lincoln',state:'NE',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_097',venue:'University of Nevada Las Vegas',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_098',venue:'Dartmouth College',booker:'',bookerLast:'',city:'Hanover',state:'NH',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_099',venue:'Princeton University',booker:'',bookerLast:'',city:'Princeton',state:'NJ',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_100',venue:'Rutgers University',booker:'',bookerLast:'',city:'New Brunswick',state:'NJ',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_101',venue:'Cornell University',booker:'',bookerLast:'',city:'Ithaca',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_102',venue:'Columbia University',booker:'',bookerLast:'',city:'New York',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_103',venue:'New York University',booker:'',bookerLast:'',city:'New York',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_104',venue:'SUNY Buffalo',booker:'',bookerLast:'',city:'Buffalo',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_105',venue:'Syracuse University',booker:'',bookerLast:'',city:'Syracuse',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_106',venue:'University of North Carolina',booker:'',bookerLast:'',city:'Chapel Hill',state:'NC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_107',venue:'NC State University',booker:'',bookerLast:'',city:'Raleigh',state:'NC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_108',venue:'Duke University',booker:'',bookerLast:'',city:'Durham',state:'NC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_109',venue:'Ohio State University',booker:'',bookerLast:'',city:'Columbus',state:'OH',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:2000,notes:'Massive student body',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_110',venue:'University of Cincinnati',booker:'',bookerLast:'',city:'Cincinnati',state:'OH',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_111',venue:'Miami University',booker:'',bookerLast:'',city:'Oxford',state:'OH',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_112',venue:'University of Oklahoma',booker:'',bookerLast:'',city:'Norman',state:'OK',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_113',venue:'Oklahoma State University',booker:'',bookerLast:'',city:'Stillwater',state:'OK',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_114',venue:'University of Oregon',booker:'',bookerLast:'',city:'Eugene',state:'OR',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_115',venue:'Oregon State University',booker:'',bookerLast:'',city:'Corvallis',state:'OR',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_116',venue:'Penn State University',booker:'',bookerLast:'',city:'University Park',state:'PA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_117',venue:'University of Pennsylvania',booker:'',bookerLast:'',city:'Philadelphia',state:'PA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_118',venue:'Temple University',booker:'',bookerLast:'',city:'Philadelphia',state:'PA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_119',venue:'Carnegie Mellon University',booker:'',bookerLast:'',city:'Pittsburgh',state:'PA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_120',venue:'University of Pittsburgh',booker:'',bookerLast:'',city:'Pittsburgh',state:'PA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_121',venue:'University of Tennessee',booker:'',bookerLast:'',city:'Knoxville',state:'TN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_122',venue:'Vanderbilt University',booker:'',bookerLast:'',city:'Nashville',state:'TN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_123',venue:'University of Texas Austin',booker:'',bookerLast:'',city:'Austin',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_124',venue:'Texas A&M University',booker:'',bookerLast:'',city:'College Station',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_125',venue:'University of Houston',booker:'',bookerLast:'',city:'Houston',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_126',venue:'Texas Tech University',booker:'',bookerLast:'',city:'Lubbock',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_127',venue:'Baylor University',booker:'',bookerLast:'',city:'Waco',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_128',venue:'SMU',booker:'',bookerLast:'',city:'Dallas',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_129',venue:'University of Utah',booker:'',bookerLast:'',city:'Salt Lake City',state:'UT',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_130',venue:'University of Virginia',booker:'',bookerLast:'',city:'Charlottesville',state:'VA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_131',venue:'Virginia Tech',booker:'',bookerLast:'',city:'Blacksburg',state:'VA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_132',venue:'George Mason University',booker:'',bookerLast:'',city:'Fairfax',state:'VA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_133',venue:'University of Washington',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_134',venue:'Washington State University',booker:'',bookerLast:'',city:'Pullman',state:'WA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_135',venue:'West Virginia University',booker:'',bookerLast:'',city:'Morgantown',state:'WV',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_136',venue:'University of Wisconsin',booker:'',bookerLast:'',city:'Madison',state:'WI',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_137',venue:'Marquette University',booker:'',bookerLast:'',city:'Milwaukee',state:'WI',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'University/College',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:1500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_138',venue:'MGM Grand',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@mgmgrand.com',instagram:'',phone:'(702) 891-7777',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1700,notes:'Hollywood Theatre',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_139',venue:'Caesars Palace',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@caesars.com',instagram:'',phone:'(702) 731-7333',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:10000,doorSplit:0,capacity:4300,notes:'The Colosseum',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_140',venue:'The Venetian',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@venetian.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_141',venue:'Wynn Las Vegas',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@wynnlasvegas.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_142',venue:'Bellagio',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@bellagio.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_143',venue:'Harrahs Las Vegas',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1000,notes:'Improv is here',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_144',venue:'Planet Hollywood',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_145',venue:'Mandalay Bay',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_146',venue:'South Point Hotel Casino',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'entertainment@southpointcasino.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_147',venue:'The Orleans Casino',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_148',venue:'Green Valley Ranch',booker:'',bookerLast:'',city:'Henderson',state:'NV',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1400,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_149',venue:'Grand Sierra Resort',booker:'',bookerLast:'',city:'Reno',state:'NV',email:'entertainment@grandsierraresort.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_150',venue:'Atlantis Casino Resort',booker:'',bookerLast:'',city:'Reno',state:'NV',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_151',venue:'Mohegan Sun',booker:'',bookerLast:'',city:'Uncasville',state:'CT',email:'entertainment@mohegansun.com',instagram:'',phone:'(888) 226-7711',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:15000,doorSplit:0,capacity:10000,notes:'Multiple venues',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_152',venue:'Foxwoods Resort Casino',booker:'',bookerLast:'',city:'Mashantucket',state:'CT',email:'entertainment@foxwoods.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:8000,doorSplit:0,capacity:4000,notes:'Multiple venues',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_153',venue:'WinStar World Casino',booker:'',bookerLast:'',city:'Thackerville',state:'OK',email:'entertainment@winstar.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:10000,doorSplit:0,capacity:3800,notes:'Worlds largest casino',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_154',venue:'Seminole Hard Rock',booker:'',bookerLast:'',city:'Hollywood',state:'FL',email:'entertainment@seminolehardrock.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:12000,doorSplit:0,capacity:6000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_155',venue:'Seminole Hard Rock',booker:'',bookerLast:'',city:'Tampa',state:'FL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_156',venue:'Turning Stone Resort',booker:'',bookerLast:'',city:'Verona',state:'NY',email:'entertainment@turningstone.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2400,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_157',venue:'Seneca Niagara Casino',booker:'',bookerLast:'',city:'Niagara Falls',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_158',venue:'Four Winds Casino',booker:'',bookerLast:'',city:'New Buffalo',state:'MI',email:'entertainment@fourwindscasino.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_159',venue:'Soaring Eagle Casino',booker:'',bookerLast:'',city:'Mt. Pleasant',state:'MI',email:'entertainment@soaringeaglecasino.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2600,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_160',venue:'Potawatomi Hotel Casino',booker:'',bookerLast:'',city:'Milwaukee',state:'WI',email:'entertainment@paysbig.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:500,notes:'Northern Lights Theater',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_161',venue:'Ameristar Casino',booker:'',bookerLast:'',city:'Kansas City',state:'MO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_162',venue:'Hollywood Casino',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_163',venue:'Horseshoe Casino',booker:'',bookerLast:'',city:'Hammond',state:'IN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_164',venue:'Harrahs Joliet',booker:'',bookerLast:'',city:'Joliet',state:'IL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_165',venue:'Grand Victoria Casino',booker:'',bookerLast:'',city:'Elgin',state:'IL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_166',venue:'Cherokee Casino',booker:'',bookerLast:'',city:'Catoosa',state:'OK',email:'entertainment@cherokeecasino.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_167',venue:'Choctaw Casino',booker:'',bookerLast:'',city:'Durant',state:'OK',email:'entertainment@choctawcasinos.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:3000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_168',venue:'Sandia Resort Casino',booker:'',bookerLast:'',city:'Albuquerque',state:'NM',email:'entertainment@sandiacasino.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_169',venue:'Pechanga Resort Casino',booker:'',bookerLast:'',city:'Temecula',state:'CA',email:'entertainment@pechanga.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_170',venue:'Morongo Casino',booker:'',bookerLast:'',city:'Cabazon',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_171',venue:'Thunder Valley Casino',booker:'',bookerLast:'',city:'Lincoln',state:'CA',email:'entertainment@thundervalleyresort.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_172',venue:'Cache Creek Casino',booker:'',bookerLast:'',city:'Brooks',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:1800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_173',venue:'Graton Resort Casino',booker:'',bookerLast:'',city:'Rohnert Park',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_174',venue:'Chumash Casino Resort',booker:'',bookerLast:'',city:'Santa Ynez',state:'CA',email:'entertainment@chumashcasino.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_175',venue:'Viejas Casino',booker:'',bookerLast:'',city:'Alpine',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_176',venue:'Barona Resort Casino',booker:'',bookerLast:'',city:'Lakeside',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_177',venue:'Sycuan Casino Resort',booker:'',bookerLast:'',city:'El Cajon',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_178',venue:'Snoqualmie Casino',booker:'',bookerLast:'',city:'Snoqualmie',state:'WA',email:'entertainment@snocasino.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_179',venue:'Tulalip Resort Casino',booker:'',bookerLast:'',city:'Tulalip',state:'WA',email:'entertainment@tulalipresorts.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_180',venue:'Ilani Casino',booker:'',bookerLast:'',city:'Ridgefield',state:'WA',email:'entertainment@ilaniresort.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_181',venue:'Northern Quest Casino',booker:'',bookerLast:'',city:'Airway Heights',state:'WA',email:'entertainment@northernquest.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_182',venue:'Spirit Mountain Casino',booker:'',bookerLast:'',city:'Grand Ronde',state:'OR',email:'entertainment@spiritmountain.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_183',venue:'Hard Rock Casino',booker:'',bookerLast:'',city:'Cincinnati',state:'OH',email:'entertainment@hardrockcincinnati.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_184',venue:'Hollywood Casino',booker:'',bookerLast:'',city:'Columbus',state:'OH',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_185',venue:'MGM Northfield Park',booker:'',bookerLast:'',city:'Northfield',state:'OH',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_186',venue:'Rivers Casino',booker:'',bookerLast:'',city:'Pittsburgh',state:'PA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_187',venue:'Parx Casino',booker:'',bookerLast:'',city:'Bensalem',state:'PA',email:'entertainment@parxcasino.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_188',venue:'Borgata',booker:'',bookerLast:'',city:'Atlantic City',state:'NJ',email:'entertainment@theborgata.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2400,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_189',venue:'Harrahs Atlantic City',booker:'',bookerLast:'',city:'Atlantic City',state:'NJ',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_190',venue:'Hard Rock Atlantic City',booker:'',bookerLast:'',city:'Atlantic City',state:'NJ',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:15000,doorSplit:0,capacity:7000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_191',venue:'MGM National Harbor',booker:'',bookerLast:'',city:'Oxon Hill',state:'MD',email:'entertainment@nationalharbor.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:3000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_192',venue:'Live Casino',booker:'',bookerLast:'',city:'Hanover',state:'MD',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_193',venue:'Harrahs Cherokee',booker:'',bookerLast:'',city:'Cherokee',state:'NC',email:'entertainment@caesars.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:3000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_194',venue:'Beau Rivage',booker:'',bookerLast:'',city:'Biloxi',state:'MS',email:'entertainment@beaurivage.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1550,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_195',venue:'Coushatta Casino Resort',booker:'',bookerLast:'',city:'Kinder',state:'LA',email:'entertainment@coushatta.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_196',venue:'L Auberge Casino',booker:'',bookerLast:'',city:'Lake Charles',state:'LA',email:'entertainment@llaubergecasino.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_197',venue:'Osage Casino',booker:'',bookerLast:'',city:'Tulsa',state:'OK',email:'entertainment@osagecasinos.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_198',venue:'Hard Rock Hotel Casino Tulsa',booker:'',bookerLast:'',city:'Tulsa',state:'OK',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_199',venue:'Riverwind Casino',booker:'',bookerLast:'',city:'Norman',state:'OK',email:'entertainment@riverwind.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_200',venue:'Wind Creek Casino',booker:'',bookerLast:'',city:'Atmore',state:'AL',email:'entertainment@windcreekhospitality.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_201',venue:'Talking Stick Resort',booker:'',bookerLast:'',city:'Scottsdale',state:'AZ',email:'entertainment@talkingstickresort.com',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2000,doorSplit:0,capacity:650,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_202',venue:'Wild Horse Pass',booker:'',bookerLast:'',city:'Chandler',state:'AZ',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1100,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_203',venue:'Desert Diamond Casino',booker:'',bookerLast:'',city:'Tucson',state:'AZ',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Casino',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_204',venue:'The Wiltern',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1850,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_205',venue:'The Greek Theatre',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:12000,doorSplit:0,capacity:5900,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_206',venue:'Hollywood Bowl',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:30000,doorSplit:0,capacity:17500,notes:'Summer only',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_207',venue:'Beacon Theatre',booker:'',bookerLast:'',city:'New York',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_208',venue:'Radio City Music Hall',booker:'',bookerLast:'',city:'New York',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:15000,doorSplit:0,capacity:6015,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_209',venue:'Madison Square Garden',booker:'',bookerLast:'',city:'New York',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:50000,doorSplit:0,capacity:20789,notes:'Iconic',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_210',venue:'Irving Plaza',booker:'',bookerLast:'',city:'New York',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_211',venue:'The Anthem',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:12000,doorSplit:0,capacity:6000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_212',venue:'9:30 Club',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_213',venue:'Warner Theatre',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4500,doorSplit:0,capacity:1847,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_214',venue:'DAR Constitution Hall',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:9000,doorSplit:0,capacity:3702,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_215',venue:'The Chicago Theatre',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:9000,doorSplit:0,capacity:3600,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_216',venue:'House of Blues Chicago',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4500,doorSplit:0,capacity:1800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_217',venue:'Riviera Theatre',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_218',venue:'The Ryman Auditorium',booker:'',bookerLast:'',city:'Nashville',state:'TN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2362,notes:'Historic venue',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_219',venue:'Bridgestone Arena',booker:'',bookerLast:'',city:'Nashville',state:'TN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:20000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_220',venue:'Red Rocks Amphitheatre',booker:'',bookerLast:'',city:'Morrison',state:'CO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:20000,doorSplit:0,capacity:9525,notes:'Iconic outdoor',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_221',venue:'Paramount Theatre',booker:'',bookerLast:'',city:'Denver',state:'CO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4500,doorSplit:0,capacity:1850,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_222',venue:'Fillmore Auditorium',booker:'',bookerLast:'',city:'Denver',state:'CO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:9000,doorSplit:0,capacity:3900,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_223',venue:'The Showbox',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1100,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_224',venue:'Paramount Theatre',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2807,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_225',venue:'First Avenue',booker:'',bookerLast:'',city:'Minneapolis',state:'MN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4000,doorSplit:0,capacity:1550,notes:'Prince played here',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_226',venue:'State Theatre',booker:'',bookerLast:'',city:'Minneapolis',state:'MN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5500,doorSplit:0,capacity:2181,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_227',venue:'Fox Theatre',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:12000,doorSplit:0,capacity:4665,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_228',venue:'Tabernacle',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2600,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_229',venue:'Hard Rock Live',booker:'',bookerLast:'',city:'Hollywood',state:'FL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:15000,doorSplit:0,capacity:7000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_230',venue:'TD Garden',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19580,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_231',venue:'Wang Theatre',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:9000,doorSplit:0,capacity:3600,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_232',venue:'House of Blues Boston',booker:'',bookerLast:'',city:'Boston',state:'MA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2400,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_233',venue:'The Wellmont Theatre',booker:'',bookerLast:'',city:'Montclair',state:'NJ',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_234',venue:'Massey Hall',booker:'',bookerLast:'',city:'Toronto',state:'ON',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2765,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_235',venue:'Stifel Theatre',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:8000,doorSplit:0,capacity:3200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_236',venue:'The Pageant',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_237',venue:'Saenger Theatre',booker:'',bookerLast:'',city:'New Orleans',state:'LA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2725,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_238',venue:'Orpheum Theatre',booker:'',bookerLast:'',city:'Memphis',state:'TN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2100,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_239',venue:'House of Blues Dallas',booker:'',bookerLast:'',city:'Dallas',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_240',venue:'House of Blues Houston',booker:'',bookerLast:'',city:'Houston',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2750,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_241',venue:'Moody Center',booker:'',bookerLast:'',city:'Austin',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:30000,doorSplit:0,capacity:15000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_242',venue:'Fillmore Charlotte',booker:'',bookerLast:'',city:'Charlotte',state:'NC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5500,doorSplit:0,capacity:2200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_243',venue:'Stage AE',booker:'',bookerLast:'',city:'Pittsburgh',state:'PA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2400,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_244',venue:'Barclays Center',booker:'',bookerLast:'',city:'Brooklyn',state:'NY',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:17732,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_245',venue:'The Fillmore',booker:'',bookerLast:'',city:'San Francisco',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1150,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_246',venue:'The Warfield',booker:'',bookerLast:'',city:'San Francisco',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:5000,doorSplit:0,capacity:2300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_247',venue:'Fox Theater Oakland',booker:'',bookerLast:'',city:'Oakland',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_248',venue:'House of Blues San Diego',booker:'',bookerLast:'',city:'San Diego',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1050,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_249',venue:'House of Blues Las Vegas',booker:'',bookerLast:'',city:'Las Vegas',state:'NV',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:4500,doorSplit:0,capacity:1800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_250',venue:'House of Blues Orlando',booker:'',bookerLast:'',city:'Orlando',state:'FL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2800,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_251',venue:'House of Blues Atlanta',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_252',venue:'House of Blues Los Angeles',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1300,notes:'Sunset Strip',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_253',venue:'House of Blues New Orleans',booker:'',bookerLast:'',city:'New Orleans',state:'LA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:2500,doorSplit:0,capacity:1000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_254',venue:'House of Blues Cleveland',booker:'',bookerLast:'',city:'Cleveland',state:'OH',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3000,doorSplit:0,capacity:1200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_255',venue:'Arlene Schnitzer Concert Hall',booker:'',bookerLast:'',city:'Portland',state:'OR',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:7000,doorSplit:0,capacity:2776,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_256',venue:'Roseland Theater',booker:'',bookerLast:'',city:'Portland',state:'OR',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:3500,doorSplit:0,capacity:1400,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_257',venue:'The Fillmore Philadelphia',booker:'',bookerLast:'',city:'Philadelphia',state:'PA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:6000,doorSplit:0,capacity:2500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_258',venue:'Tower Theater',booker:'',bookerLast:'',city:'Upper Darby',state:'PA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:8000,doorSplit:0,capacity:3200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_259',venue:'State Farm Arena',booker:'',bookerLast:'',city:'Atlanta',state:'GA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:45000,doorSplit:0,capacity:21000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_260',venue:'Amway Center',booker:'',bookerLast:'',city:'Orlando',state:'FL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:20000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_261',venue:'Amalie Arena',booker:'',bookerLast:'',city:'Tampa',state:'FL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:20500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_262',venue:'Kaseya Center',booker:'',bookerLast:'',city:'Miami',state:'FL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19600,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_263',venue:'Wells Fargo Center',booker:'',bookerLast:'',city:'Philadelphia',state:'PA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:45000,doorSplit:0,capacity:21000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_264',venue:'Capital One Arena',booker:'',bookerLast:'',city:'Washington',state:'DC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:20000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_265',venue:'United Center',booker:'',bookerLast:'',city:'Chicago',state:'IL',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:45000,doorSplit:0,capacity:20491,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_266',venue:'Little Caesars Arena',booker:'',bookerLast:'',city:'Detroit',state:'MI',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:45000,doorSplit:0,capacity:20000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_267',venue:'Target Center',booker:'',bookerLast:'',city:'Minneapolis',state:'MN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18798,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_268',venue:'Chase Center',booker:'',bookerLast:'',city:'San Francisco',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18064,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_269',venue:'Crypto.com Arena',booker:'',bookerLast:'',city:'Los Angeles',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:45000,doorSplit:0,capacity:20000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_270',venue:'Kia Forum',booker:'',bookerLast:'',city:'Inglewood',state:'CA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:17500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_271',venue:'Footprint Center',booker:'',bookerLast:'',city:'Phoenix',state:'AZ',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18422,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_272',venue:'Toyota Center',booker:'',bookerLast:'',city:'Houston',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18300,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_273',venue:'American Airlines Center',booker:'',bookerLast:'',city:'Dallas',state:'TX',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19200,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_274',venue:'Moda Center',booker:'',bookerLast:'',city:'Portland',state:'OR',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19980,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_275',venue:'Climate Pledge Arena',booker:'',bookerLast:'',city:'Seattle',state:'WA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18100,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_276',venue:'Ball Arena',booker:'',bookerLast:'',city:'Denver',state:'CO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19199,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_277',venue:'Vivint Arena',booker:'',bookerLast:'',city:'Salt Lake City',state:'UT',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_278',venue:'Gainbridge Fieldhouse',booker:'',bookerLast:'',city:'Indianapolis',state:'IN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:17923,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_279',venue:'Fiserv Forum',booker:'',bookerLast:'',city:'Milwaukee',state:'WI',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:17500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_280',venue:'Nationwide Arena',booker:'',bookerLast:'',city:'Columbus',state:'OH',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_281',venue:'Rocket Mortgage FieldHouse',booker:'',bookerLast:'',city:'Cleveland',state:'OH',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19432,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_282',venue:'Enterprise Center',booker:'',bookerLast:'',city:'St. Louis',state:'MO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19150,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_283',venue:'Sprint Center',booker:'',bookerLast:'',city:'Kansas City',state:'MO',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:19000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_284',venue:'Xcel Energy Center',booker:'',bookerLast:'',city:'St. Paul',state:'MN',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18400,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_285',venue:'PNC Arena',booker:'',bookerLast:'',city:'Raleigh',state:'NC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18680,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_286',venue:'Spectrum Center',booker:'',bookerLast:'',city:'Charlotte',state:'NC',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:20000,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'},
  {id:'pre_287',venue:'Smoothie King Center',booker:'',bookerLast:'',city:'New Orleans',state:'LA',email:'',instagram:'',phone:'',preferredContact:'Email',venueType:'Theater/Arena',relationship:'new',warmth:'Cold',history:'',targetDates:'',dealType:'Flat Guarantee',guarantee:40000,doorSplit:0,capacity:18500,notes:'',referralSource:'Directory',nextFollowUp:'',agentCommission:10,managerCommission:15,lodging:'Hotel',merchAllowed:true,merchCut:20,status:'Lead',contactLog:[],contractStatus:'None',depositPaid:false,balancePaid:false,actualWalk:0,estimatedGross:0,showCount:3,showDates:[],ticketPrice:20,depositAmount:0,depositDue:'',balanceDue:'',radiusClause:'',flightDetails:'',bonusTier:'',agreementType:'Email Agreement',confirmedViaEmailDate:'',emailThreadURL:'',emailThreadText:'',emailAgreementNotes:'',termsLocked:false,checklist:null,expectedPaymentTiming:'Night of show',paid:false,paidDate:'',settlement:null,showReport:null,rebookDate:'',package:'Jason + Phil'}
];

const SB_URL = 'https://qqgwxkxbdxjuyxhsuymj.supabase.co';
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

async function cloudPush(email, venues, templates, tours) {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    throw new Error('Bad email: ' + JSON.stringify(email));
  }
  const appState = { venues, templates, tours };
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
function AnalyticsTab({venues, tours}){
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
    sbAuthClient.auth.getSession().then(({data})=>{
      if(data?.session){
        const s={email:data.session.user.email, access_token:data.session.access_token};
        setSession(s);
        try{localStorage.setItem('sb_session',JSON.stringify(s));}catch{}
      }
    });
    // Listen for auth state changes (token refresh, sign-out)
    const{data:{subscription}}=sbAuthClient.auth.onAuthStateChange((_event,s)=>{
      if(s){
        const updated={email:s.user.email, access_token:s.access_token};
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
    const stored={email:s.user.email, access_token:s.access_token};
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
  const saveLocal = (venues, templates, tours) => {
    try { localStorage.setItem('sb_cache', JSON.stringify({venues,templates,tours,ts:Date.now()})); } catch{}
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
    setCloudVersion(cloudVer);
    cloudInitialized.current = true;
    return true;
  }, []);

  useEffect(()=>{
    if(SB_URL==='https://placeholder.supabase.co') return;
    let active = true;

    async function pollCloud() {
      if (!active) return;
      const result = await cloudFetch(user);
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
  useEffect(()=>{ if(venues.length>0) saveLocal(venues,templates,tours); },[venues,templates,tours]);

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
        const returnedAt = await cloudPush(user, venues, templates, tours);
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
  },[venues,templates,tours]);;

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
              const returnedAt=await cloudPush(user,venues,templates,tours);
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
            <button onClick={async()=>{setSyncing(true);try{const r=await cloudPush(user,venues,templates,tours);localVersionRef.current=r||new Date().toISOString();setLastSync(new Date());toast2('Synced!');}catch(e){toast2('Failed: '+e.message);}setSyncing(false);}} style={{padding:'6px 10px',borderRadius:8,border:'1px solid rgba(0,184,148,0.4)',background:'rgba(0,184,148,0.1)',color:C.green,fontSize:10,cursor:'pointer',fontFamily:font.body,marginRight:6}}>{syncing?'...':'Sync'}</button>
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
          <div style={{marginBottom:20}}>
            <div style={{fontFamily:font.head,fontWeight:900,fontSize:22,letterSpacing:-0.5,marginBottom:4}}>Outreach</div>
            <div style={{fontSize:12,color:C.muted3}}>Email your venue contacts with AI-powered drafts</div>
          </div>

          {/* VENUE LIST FOR OUTREACH */}
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
                return<div key={v.id} style={{...s.card(),padding:'12px 16px',marginBottom:6,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between'}}
                  onClick={()=>setComposeId(v.id)}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600}}>{v.venue}</div>
                    <div style={{fontSize:11,color:C.muted3}}>{v.city}, {v.state} · {v.status} · {(v.contactLog||[]).length} touches</div>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    {overdue&&<span style={s.badge(C.red)}>⚡ Due</span>}
                    <span style={{fontSize:18,color:C.acc2}}>›</span>
                  </div>
                </div>;
              })}
            </div>;
          })}
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
        {tab==='analytics'&&<div style={{padding:'14px 14px 100px',overflowY:'auto',WebkitOverflowScrolling:'touch'}}>
          <AnalyticsTab venues={venues} tours={tours} />
        </div>}

      </div>{/* end content */}

      </div>{/* end sb-main */}
      </div>{/* end sb-desktop-wrap */}

      {/* NAV - mobile only */}
      <nav className="sb-mobile-nav" style={s.nav}>
        {[['today','🏠','Today'],['venues','🏛️','Venues'],['outreach','✉️','Outreach'],['tours','🗺️','Tours'],['calendar','📅','Cal'],['analytics','📊','Stats']].map(([t,icon,label])=>(
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
          <div style={{marginBottom:16}}>{[['Email',dv.email],['Instagram',dv.instagram],['Phone',dv.phone],['Address',dv.address?(dv.address+(dv.zip?' '+dv.zip:'')):'']].map(([l,val])=>val?<div key={l} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0',borderBottom:`1px solid ${C.bord}`}}><span style={{fontSize:10,color:C.muted,width:72,flexShrink:0,letterSpacing:1,textTransform:'uppercase'}}>{l}</span><span style={{fontSize:13,flex:1,wordBreak:'break-all'}}>{val}</span><button onClick={()=>copyText(val,l,toast2)} style={{padding:'3px 10px',borderRadius:6,border:`1px solid ${C.bord}`,background:'none',color:C.muted,fontSize:10,cursor:'pointer'}}>copy</button></div>:null)}</div>
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
              <div style={{fontSize:10,color:C.muted,marginBottom:4}}>To: {cv.email||'No email on file'}</div>
              <div style={{fontSize:12,color:C.acc2,marginBottom:8,fontWeight:500}}>Subject: {filledSubject}</div>
              <div style={{fontSize:11,color:'#9090b0',lineHeight:1.8,whiteSpace:'pre-wrap',maxHeight:220,overflowY:'auto'}}>{fullBody}</div>
            </div>
            {currentTemplate?.photoLinks?.length>0&&<div style={{marginBottom:10}}><div style={{fontSize:10,color:C.muted,marginBottom:6,letterSpacing:1,textTransform:'uppercase'}}>[photo] Press Kit Links Included</div>{currentTemplate.photoLinks.map((p,i)=><div key={i} style={{fontSize:11,color:C.acc2,marginBottom:3}}>* {p.label}</div>)}</div>}
            {cv&&<button onClick={()=>{
              const touches=(cv.contactLog||[]).length;
              const isNew=touches===0;
              const prompt='You are Jason Schuster, comedian and tour manager for Phil Medina. Write a SHORT natural booking email.\n\nVenue: '+cv.venue+'\nCity: '+cv.city+', '+cv.state+'\nBooker: '+(cv.booker||'their booker')+(cv.bookerLast?' '+cv.bookerLast:'')+'\nRelationship: '+(isNew?'brand new contact, first outreach':'existing contact, touch #'+(touches+1))+'\nPrevious contacts: '+touches+'\nHistory: '+(cv.history||'none')+'\nWarmth: '+(cv.warmth||'Cold')+'\nStatus: '+cv.status+'\nTarget dates: '+(cv.targetDates||'flexible')+'\n\nPhil Medina credits: Laugh Factory, Hollywood Improv, Ice House, Netflix Is A Joke Fest, Hulu West Coast Comedy.\nJason Schuster credits: Comedy Store, Jimmy Kimmel Comedy Club, Kenan Presents.\n\n'+(isNew?'First outreach - warm, professional, brief.':'Follow-up - reference previous outreach, stay persistent but friendly.')+'\n\nWrite ONLY the email body under 120 words. Sign as Jason Schuster.';
              // API key handled server-side
              getToken().then(token3=>{
                if(!token3){toast2('Session expired. Please log out and log in again.');return;}
                fetch('/.netlify/functions/generate-email',{method:'POST',
                  headers:{'Content-Type':'application/json','Authorization':'Bearer '+token3},
                  body:JSON.stringify({venue:cv,tone:'professional',dates:co.customDates||'',touchHistory:(cv.contactLog||[]).slice(-5)})})
                .then(r=>r.json()).then(d=>{if(d.error){toast2(d.error);return;}setComposeOpts(o=>({...o,aiNote:d.body,filledBody:d.body}));toast2('AI draft ready!');})
                .catch(e=>toast2('Connection error: '+e.message));
              });
              toast2('Generating AI draft...');
            }} style={{...s.btn('rgba(108,92,231,0.1)',C.acc2,'rgba(108,92,231,0.3)'),width:'100%',marginBottom:8,fontSize:12}}>AI Draft Email (relationship-aware)</button>}
            <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
              {mailto&&<button onClick={()=>{upd(cv.id,{status:cv.status==='Lead'?'Contacted':cv.status,nextFollowUp:new Date(Date.now()+7*24*60*60*1000).toISOString().split('T')[0]});const entry={date:new Date().toISOString().split('T')[0],method:'Email',note:'Outreach email sent via Gmail'};setVenues(vs=>vs.map(v=>v.id===cv.id?{...v,contactLog:[...(v.contactLog||[]),entry]}:v));toast2('Opening Gmail...');openGmail(cv?.email||'',filledSubject,fullBody);}} style={{...s.btn(C.acc,'#fff',null),width:'100%',flex:1}}>[email] Open Gmail</button>}
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
