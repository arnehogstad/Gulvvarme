///////////////////////////////////////
//            DYNAMISKE              //
///////////////////////////////////////

//KNAPP BOENHET -> NYTT NAVN BOENHET
tippy.delegate('#container',{
  target: '.editUnit',
  content: "Endre navn på boenhet",
  delay: 500 // ms
});
//KNAPP BOENHET -> SLETT BOENHET
tippy.delegate('#container',{
  target: '.delUnit',
  content: "Slett boenhet",
  delay: 500 // ms
});
//KNAPP BOENHET -> VELG BOENHET
tippy.delegate('#container',{
  target: '.nameSpan',
  content: "Velg boenhet",
  delay: 500 // ms
});
//KNAPP RAD -> SLETT RAD
tippy.delegate('#container',{
  target: '.delRow',
  content: "Slett rad",
  delay: 500 // ms
});
//KNAPP RAD -> NY RAD
tippy.delegate('#container',{
  target: '.newRow',
  content: "Sett inn ny rad",
  delay: 500 // ms
});
//INPUTBOKS -> ETASJEVALG
tippy.delegate('#container',{
  target: '.floorPos',
  content: "Velg etasje, brukes for å sette automatisk valg på rørtype. Merk at ønsket type kan endres manuelt",
  delay: 500 // ms
});
//INPUTBOKS -> ROMNAVN
tippy.delegate('#container',{
  target: '.roomNames',
  content: "For romnavn som inneholder 'bad/våtrom/vaskerom/wc/dusj' vil det automatisk legges til en gulvføler",
  delay: 500 // ms
});
//INPUTBOKS -> AREAL
tippy.delegate('#container',{
  target: '.roomArea',
  content: "Rommets areal, brukes for å beregne minimum antall kurser",
  delay: 500 // ms
});
//INPUTBOKS -> RØRTYPE
tippy.delegate('#container',{
  target: '.pipeSelect',
  content: "Velg ønsket rørtype",
  delay: 500 // ms
});
//INPUTBOKS -> CC
tippy.delegate('#container',{
  target: '.ccSelect',
  content: "Sett ønsket røravstand",
  delay: 500 // ms
});
//INPUTBOKS -> ANTALL KRETSER
tippy.delegate('#container',{
  target: '.roomCircuits',
  content: "Minimum antall kurser i rom",
  delay: 500 // ms
});
//RADIOKNAPP -> FORDELERSKAP -> i VEGG
tippy.delegate('#container',{
  target: '.inWall',
  content: "Fordelerskap montert i vegg. Vanlig i villa",
  delay: 500 // ms
});
//RADIOKNAPP -> FORDELERSKAP -> PÅ VEGG
tippy.delegate('#container',{
  target: '.onWall',
  content: "Fordelerskap montert på vegg. Vanlig i leiligheter",
  delay: 500 // ms
});
//RADIOKNAPP -> UTEN FORDELERSKAP
tippy.delegate('#container',{
  target: '.noType',
  content: "Ingen fordelerskap.",
  delay: 500 // ms
});
//RADIOKNAPP -> FORDELERSTOKK -> MED BYPASS
tippy.delegate('#container',{
  target: '.withBypass',
  content: "Fordelerstokk med bypass, brukes når det ikke er akkumulatortank i varmeanlegget.",
  delay: 500 // ms
});
//RADIOKNAPP -> FORDELERSTOKK -> UTEN BYPASS
tippy.delegate('#container',{
  target: '.withoutBypass',
  content: "Fordelerstokk uten bypass, brukes når det er akkumulatortank i varmeanlegget.",
  delay: 500 // ms
});
//RADIOKNAPP -> TERMOSTAT -> ALPHA
tippy.delegate('#container',{
  target: '.alpha',
  content: "ALPHA TYPE",
  delay: 500 // ms
});
//RADIOKNAPP -> TERMOSTAT -> ICON
tippy.delegate('#container',{
  target: '.icon',
  content: "icon type",
  delay: 500 // ms
});
//RADIOKNAPP -> TERMOSTAT -> INGEN
tippy.delegate('#container',{
  target: '.noThermostat',
  content: "Ingen termostatstyring.",
  delay: 500 // ms
});
//RADIOKNAPP -> TERMOSTAT -> DIGITAL KUN BAD
tippy.delegate('#container',{
  target: '.digitalOnlyBathroom',
  content: "Kjipern, kun på bad lissm",
  delay: 500 // ms
});
//RADIOKNAPP -> TERMOSTAT -> DIGITAL ALLE ROM
tippy.delegate('#container',{
  target: '.digitalAllRooms',
  content: "Lux, alle skal få",
  delay: 500 // ms
});
///////////////////////////////////////
//            STATISKE               //
///////////////////////////////////////
//KNAPP -> legg til ny boenhet
tippy('#newUnitButton', {
  content: "Legg til ny boenhet",
  delay: 500 // ms
});
