
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getDatabase,ref, child, get,onChildAdded, onValue,  } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js"
//import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSoro21zlvE2eZ3rDmJ-N2aIAqP2tLuw0",
  authDomain: "gulvvarme-d7010.firebaseapp.com",
  databaseURL: "https://gulvvarme-d7010.firebaseio.com",
  projectId: "gulvvarme-d7010",
  storageBucket: "gulvvarme-d7010.appspot.com",
  messagingSenderId: "1085382010732",
  appId: "1:1085382010732:web:835a60c87a60984f83f549",
  measurementId: "G-7DBDJ1DL5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

$(document).ready(function() {
  // Global variables, arrays, objects
  var globalFloorArray = [];
  var globalPipeArray = [];
  var globalCCArray = [];
  var globalCCFactorArray = [];
  var globalRomnavnArray = [];
  var globalPakkeArray = [];

  ///////////////////////////////////////////////////////
  //////////    LASTE INN DATA                ///////////
  ///////////////////////////////////////////////////////

  //hent data fra database
  $.ajax({
    url: 'index.html',
    success: function() {
      //setting up database connection
      const db = getDatabase();
      //reference to the specific children we need to populate our lists
      const floorRef = ref(db,'Etasjeliste');
      const pipeRef = ref(db,'gulvvarmePakker');
      const ccRef = ref(db,'ccliste');
      const roomNameRef = ref(db,'romnavnListe');

      //FLOOR
      //push data to global lists
      onChildAdded(floorRef,(data)=>{
      globalFloorArray.push(data.key);
      });
      //PIPE
      //push data to global lists and popuplate dropdown
      onChildAdded(pipeRef,(data)=>{
      globalPipeArray.push(data.key);
      globalPakkeArray.push(data.val());
      });
      //CC
      //push data to global lists and popuplate dropdown
      onChildAdded(ccRef,(data)=>{
      globalCCArray.push(data.key);
      globalCCFactorArray.push(data.val());
      });
      //ROOM
      //henter alle romnavn
      onChildAdded(roomNameRef,(data)=>{
      globalRomnavnArray.push(data.key);
      });
  }
});
  //sett inn data i dropdowns etc
  $(document).ajaxComplete(function(){
    var unitNmbr = 1;
    var floors = 10;
    newUnitSelectButtons(unitNmbr);
    newUnitHeadlines(unitNmbr);
    initializeUnit(unitNmbr,floors);
    newUnitRadioButtons(unitNmbr);
    toggleCssClass(unitNmbr);
    setTimeout(function(){
    populateDropDowns(unitNmbr,floors);
    }, 1500);
  });

  ///////////////////////////////////////////////////////
  //////////    GJØRE GREIER                  ///////////
  ///////////////////////////////////////////////////////

  //BUTTON - deleting line
  $(document.body).on('click', ".delRow", function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    //finds the clicked row
    var actRow = parseInt(this.id.replace('delRow',''));
    //finner aktiv Boenhet
    var unitNmbr = Math.floor((actRow+100)/100);
    //finner faktisk posisjon
    var actualRow = actRow-(unitNmbr-1)*100;
    //finner antall rader i boenheten
    var nRows = $('#gulvTabell'+unitNmbr+' .delRow').length;
    //henter ID til siste rad i tabellen
    var lastRow = (unitNmbr-1)*100+nRows;
    //finner den gjeldende tabellen
    var table = document.getElementById('gulvTabell'+unitNmbr);
    //deletes the current row
    table.getElementsByTagName("tr")[actualRow].remove();
    //updates all IDs in table
    if(actRow<lastRow){
      for (var i = actRow+1;i<=lastRow;i++){
        var newID = i-1;
        document.getElementById('delRow'+ i ).id = 'delRow'+ newID;
        document.getElementById('floorSelect'+ i ).id = 'floorSelect'+ newID;
        document.getElementById('roomName'+ i ).id = 'roomName'+ newID;
        document.getElementById('roomArea'+ i ).id = 'roomArea'+ newID;
        document.getElementById('pipeSelect'+ i ).id = 'pipeSelect'+ newID;
        document.getElementById('ccSelect'+ i ).id = 'ccSelect'+ newID;
        document.getElementById('roomCircuits'+ i ).id = 'roomCircuits'+ newID;
        document.getElementById('newRow'+ i ).id = 'newRow'+ newID;
      }
    }
    lastRow = lastRow+1;
    newID = lastRow-1;
    document.getElementById('newRow'+ lastRow ).id = 'newRow'+ newID;
    //document.getElementsByTagName("tr")[nRows].remove();
  });
  //BUTTON - insert line
  $(document.body).on('click', ".newRow", function(event){
        event.stopPropagation();
        event.stopImmediatePropagation();

        //finds the clicked row
        var actRow = parseInt(this.id.replace('newRow',''));
        //finner aktiv Boenhet - grense på 100 rom per boenhet
        var unitNmbr = Math.floor((actRow+100)/100);
        //finner faktisk posisjon
        var actualRow = actRow-(unitNmbr-1)*100;
        //finner den gjeldende tabellen
        var table = document.getElementById('gulvTabell'+unitNmbr);
        //finds total amound of rows
        var nRows = $('#gulvTabell'+unitNmbr+' .delRow').length;
        //Øker IDnummer på alle elementer fra og med den aktuelle raden
        var lastRow = (unitNmbr-1)*100+nRows+1;
        newID = lastRow+1;
        //endrer ID på nederste nyEnhetsKnapp først
        document.getElementById('newRow'+ (lastRow) ).id = 'newRow'+ newID;
        if(actRow<lastRow){
          for (var i = lastRow-1;i>=actRow;i--){
            var newID = i+1;
            document.getElementById('delRow'+ i ).id = 'delRow'+ newID;
            document.getElementById('floorSelect'+ i ).id = 'floorSelect'+ newID;
            document.getElementById('roomName'+ i ).id = 'roomName'+ newID;
            document.getElementById('roomArea'+ i ).id = 'roomArea'+ newID;
            document.getElementById('pipeSelect'+ i ).id = 'pipeSelect'+ newID;
            document.getElementById('ccSelect'+ i ).id = 'ccSelect'+ newID;
            document.getElementById('roomCircuits'+ i ).id = 'roomCircuits'+ newID;
            document.getElementById('newRow'+ i ).id = 'newRow'+ newID;
          }
        }
        //setter inn rad og celler
        var row = table.insertRow(actualRow);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);
        //slettknapp
        cell1.innerHTML = '<img class="delRow" id="delRow' + actRow + '" src="Pictures/Slett.jpg"/>';
        cell1.className = "buttonCol"
        //etasjeliste
        cell2.innerHTML = '<select class="inputSelect floorPos" id="floorSelect' + actRow + '"><option></option></select>';
        //romnavn
        cell3.innerHTML = '<input class="inputBoks roomNames" type="text" id="roomName' + actRow + '">';
        //areal
        cell4.innerHTML = '<input class="inputBoks roomArea" type="number" id="roomArea' + actRow + '">';
        //rørtype
        cell5.innerHTML = '<select class="inputSelect pipeSelect" id="pipeSelect' + actRow + '"><option></option></select>';
        //røravstand
        cell6.innerHTML = '<select class="inputSelect ccSelect" id="ccSelect' + actRow + '"><option></option></select>';
        //kurser
        cell7.innerHTML = '<input class="inputBoks roomCircuits" type="number" id="roomCircuits' + actRow + '">';
        //nylineknapp
        cell8.innerHTML = '<img class="newRow" id="newRow' + actRow + '" src="Pictures/NyLinjeBilde.png"/>';
        cell8.className = "buttonCol"

        var plasseringFloor = "floorSelect" + actRow;
        var plasseringPipe = "pipeSelect" + actRow;
        var plasseringCC = "ccSelect" + actRow;
        //finner største tabell
        var maxArray = Math.max(globalFloorArray.length,globalPipeArray.length,globalCCArray.length);
        //fyller dropdown med valgalternativer fra database
        for (var i=0;i<maxArray;i++){

          if(globalFloorArray.length>=i+1){
            $(document.getElementById ( plasseringFloor )).append('<option id=' + i + '>' + globalFloorArray[i] + '</option>');
          }
          if(globalPipeArray.length>=i+1){
            $(document.getElementById ( plasseringPipe )).append('<option id=' + i + '>' + globalPipeArray[i] + '</option>');
          }
          if(globalCCArray.length>=i+1){
            $(document.getElementById ( plasseringCC )).append('<option id=' + i + '>' + globalCCArray[i] + '</option>');
          }
        }

    });
  //Autocomplete on entering roomName
  $(document.body).on('focus', ".roomNames", function(event){
      event.stopPropagation();
      event.stopImmediatePropagation();
      //(... rest of your JS code)

      $('#' + this.id).autocomplete({
      source: globalRomnavnArray,
      autoFocus: true,
      minLength: 1,
    });
  });
  //set pipetype and CC when selecting floor
  $(document.body).on('change', ".floorPos", function(event){
      event.stopPropagation();
      event.stopImmediatePropagation();
      //(... rest of your JS code)
      var rowPos = this.id.replace('floorSelect','');
      if (this.value==""){
        $('#pipeSelect'+ rowPos ).prop("selectedIndex", 0);
        $('#ccSelect'+ rowPos ).prop("selectedIndex", 0);
      }else{
        if(this.selectedIndex>=2 && this.selectedIndex<=5){
          $('#pipeSelect'+ rowPos ).prop("selectedIndex", 4);
          $('#ccSelect'+ rowPos ).prop("selectedIndex", 3);
        }else{
        $('#pipeSelect'+ rowPos ).prop("selectedIndex", 1);
        $('#ccSelect'+ rowPos ).prop("selectedIndex", 3);
      }
      }

  });

  //CHANGE AREA - calculate kurser based on area and CC
  $('#tableDiv').on('input', ".roomArea", function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    //beregner basert på arael og CC
    var rowPos = this.id.replace('roomArea','');

    if (this.value=="" || this.value==0 ){
      $('#roomCircuits'+ rowPos ).val("");
    }else{
        if($('#pipeSelect'+ rowPos ).prop('selectedIndex') != 0 && $('#ccSelect'+ rowPos ).prop('selectedIndex') !=0){
          var ccLength = globalCCFactorArray[$('#ccSelect'+ rowPos ).prop('selectedIndex')-1]
          var nCircuits = Math.ceil((this.value * ccLength) / 100);
          $('#roomCircuits'+ rowPos ).val(nCircuits);
      }
    }
  });
  //CHANGE CC - calculate kurser based on area pipe and CC
  $(document.body).on('change', ".ccSelect", function(event){
    event.stopPropagation();
    event.stopImmediatePropagation();
    //beregner basert på arael og CC
    var rowPos = this.id.replace('ccSelect','');
    if (this.selectedIndex == 0){
      $('#roomCircuits'+ rowPos ).val("");
    }else{
        if($('#pipeSelect'+ rowPos ).prop('selectedIndex') != 0 && this.selectedIndex !=0){
          var areal = $('#roomArea'+ rowPos ).val();
          var ccLength = globalCCFactorArray[this.selectedIndex-1]
          var nCircuits = Math.ceil((areal * ccLength) / 100);
          $('#roomCircuits'+ rowPos ).val(nCircuits);
      }
    }
  });
  //vis enhet og endre bakgrunnsfarge på knapp når trykkes
  $('#boligEnhetDiv').on('click', ".nameSpan", function(event){
    //stopper propegering
    event.stopPropagation();
    event.stopImmediatePropagation();
    //finner gjeldende enhet
    var unitNmbr = this.id.replace('nameSpan','');
    //endrer synlighet på tabeller og radioknapper
    toggleUnitVisibility(unitNmbr);
    //endrer bakgrunnsfarge på knapper
    toggleCssClass(unitNmbr);
  });
  //Tillater bruker å endre navn på valgt boenhet
  $('#boligEnhetDiv').on('click', ".editUnit", function(event){
    //stopper propegering
    event.stopPropagation();
    event.stopImmediatePropagation();
    //finner gjeldende enhet
    var unitNmbr = this.id.replace('editUnit','');
    //ber bruker angi nytt navn
    let newName = prompt("Endre navn på " + $('#nameSpan'+unitNmbr).text(), $('#nameSpan'+unitNmbr).text());
    if (newName != null) {
      changeNameUnit(unitNmbr,newName);
      toggleUnitVisibility(unitNmbr);
      toggleCssClass(unitNmbr);
    }
  });

  //sletter boenhet - kaller alle underfunksjoner
  $('#boligEnhetDiv').on('click', ".delUnit", function(event){
    //stopper propegering
    event.stopPropagation();
    event.stopImmediatePropagation();
    //finner gjeldende enhet
    var unitNmbr = parseInt(this.id.replace('delUnit',''));
    //finer antall enheter
    var numberOfUnits = $('#boligEnhetDiv .boligenhetSpan').length;
    //toggleUnitVisibility(unitNmbr);
    //toggleCssClass(unitNmbr);
    //ber bruker angi nytt navn
    let confirmation = confirm('Slette '+$('#nameSpan'+unitNmbr).text()+'?');
    //sletter enheten
    if(confirmation == true){
      //dersom det kun er én boenhet vil denne tømmes
      if (numberOfUnits==1){
        //nullstiller navn
        changeNameUnit(1,"Boenhet 1");
        //tømmer tabellen for data
        $('#gulvTabellDiv1').remove();
        $('#diverseUtstyrDivEnhet1').remove();
        newUnitHeadlines(1);
        initializeUnit(1,10);
        populateDropDowns(1,10);
        newUnitRadioButtons(1);
      }else{
        //ser om enheten som slettes er den synlige:
        if($("#gulvTabellDiv"+unitNmbr).is(":visible")){
          if (unitNmbr==1){
            toggleUnitVisibility(2);
            toggleCssClass(2);
          }else if(unitNmbr==numberOfUnits){
            toggleUnitVisibility(unitNmbr-1);
            toggleCssClass(unitNmbr-1);
          }else{
            toggleUnitVisibility(unitNmbr+1);
            toggleCssClass(unitNmbr+1);
          }
        }
        //sletter enhet
        deleteUnit(unitNmbr);
        //forskyver alle elementers ID
        //loop fra neste GulvtabellDIV til siste gulvTabellDiv
        for (var oldIDmain = unitNmbr+1;oldIDmain<=numberOfUnits;oldIDmain++){
          //ny ID til hovedelementer
          var newIDMain = oldIDmain-1;
          //finner antall etasjerader i gjeldende boligenhet
          var nRows = $('#gulvTabell'+oldIDmain+' .delRow').length;
          //endrer ID på hoveedelementer
          //ROM
          $('#gulvTabellDiv'+oldIDmain).attr("id","gulvTabellDiv"+newIDMain);
          $('#gulvTabell'+oldIDmain).attr("id","gulvTabell"+newIDMain);
          $('#etasjeTabellOverskrift'+oldIDmain).attr("id","etasjeTabellOverskrift"+newIDMain);
          //RADIO
          $('#diverseUtstyrDivEnhet'+oldIDmain).attr("id",'diverseUtstyrDivEnhet'+newIDMain);
          $('#etasjeTekniskRomOverskrift'+oldIDmain).attr("id",'etasjeTekniskRomOverskrift'+newIDMain);
          $('#fordelerSkap'+oldIDmain).attr("id",'fordelerSkap'+newIDMain);
          $('#inWall'+oldIDmain).attr("id",'inWall'+newIDMain);
          $('#onWall'+oldIDmain).attr("id",'onWall'+newIDMain);
          $('#noType'+oldIDmain).attr("id",'noType'+newIDMain);
          $('#withoutBypass'+oldIDmain).attr("id",'withoutBypass'+newIDMain);
          $('#withBypass'+oldIDmain).attr("id",'withBypass'+newIDMain);
          $('#termostat'+oldIDmain).attr("id",'termostat'+newIDMain);
          $('#alpha'+oldIDmain).attr("id",'alpha'+newIDMain);
          $('#icon'+oldIDmain).attr("id",'icon'+newIDMain);
          $('#noThermostat'+oldIDmain).attr("id",'noThermostat'+newIDMain);
          $('#digitalOnlyBathroom'+oldIDmain).attr("id",'digitalOnlyBathroom'+newIDMain);
          $('#digitalAllRooms'+oldIDmain).attr("id",'digitalAllRooms'+newIDMain);
          //BOENHETKNAPP
          $('#boligenhetSpan'+oldIDmain).attr("id","boligenhetSpan"+newIDMain);
          $('#nameSpan'+oldIDmain).attr("id","nameSpan"+newIDMain);
          $('#editUnit'+oldIDmain).attr("id","editUnit"+newIDMain);
          $('#delUnit'+oldIDmain).attr("id","delUnit"+newIDMain);
          //gammel ID til underelementer
          var oldIDSub = (oldIDmain-1)*100+1
          var oldIDSubMax = (oldIDmain-1)*100+nRows;
          //ny ID til underelementer
          var newIDSub = (oldIDmain-1)*100;

          for (oldIDSub;oldIDSub<=oldIDSubMax;oldIDSub++){
            //ny ID til underelementer
            var newIDSub = oldIDSub-100;
            $('#delRow'+oldIDSub).attr("id","delRow"+newIDSub);
            $('#floorSelect'+oldIDSub).attr("id","floorSelect"+newIDSub);
            $('#roomName'+oldIDSub).attr("id","roomName"+newIDSub);
            $('#roomArea'+oldIDSub).attr("id","roomArea"+newIDSub);
            $('#pipeSelect'+oldIDSub).attr("id","pipeSelect"+newIDSub);
            $('#ccSelect'+oldIDSub).attr("id","ccSelect"+newIDSub);
            $('#roomCircuits'+oldIDSub).attr("id","roomCircuits"+newIDSub);
            $('#newRow'+oldIDSub).attr("id","newRow"+newIDSub);
          }
          //ny ID til den nederste knappen
          oldIDSubMax = oldIDSubMax+1;
          newIDSub = oldIDSubMax-100;
          $('#newRow'+oldIDSubMax).attr("id","newRow"+newIDSub);
        }
      }
    }
  });
  //legger til ny boenhet - kaller alle underfunksjoner
  $('#newUnitButton').on('click',function(event){
    //teller antall eksisterende enheter og legger til 1
    var unitNmbr = $('#boligEnhetDiv .boligenhetSpan').length+1;
    var floors = 10;
    newUnitSelectButtons(unitNmbr);
    newUnitHeadlines(unitNmbr);
    initializeUnit(unitNmbr,floors);
    populateDropDowns(unitNmbr,floors);
    newUnitRadioButtons(unitNmbr);
    toggleUnitVisibility(unitNmbr);
    toggleCssClass(unitNmbr);
  });
  //henter utstyrslisten og legger den nederst på siden
  $('#calculateButton').click(function (event) {
    //tømmer eksisterende utdata
    $('#resultatListe').html('');
    //looper gjennom alle enheter
    for (var i = 1;i<= $('#boligEnhetDiv .boligenhetSpan').length;i++){
      //teller antall rom i gjeldende boenhet
      var teller = 0;
      //finner antall rom i enheten
      var nRows = $('#gulvTabell'+i+' .delRow').length;
      //setter minimumsID og maksID
      var minID = (i-1)*100+1;
      var maksID = (i-1)*100+nRows;
      //looper gjennom alle rom i enheten
      for(var j = minID;j<=maksID;j++){
        //ser om det er data i det gjeldende rommet
        if($('#floorSelect'+j).val()){
          //øker romantall
          teller = teller+1;
          //returnerer utstyr for rommet dersom det ikke er tomt
          var romUtstyr = getPipesForRoom(i,j);
          //henter boenhetsNavn
          var totVerdier = getUnitTotalvaluesRoomAreaCircuits(i);
          var unitName = totVerdier[0];
          var areal = totVerdier[1];
          var nRom = totVerdier[2];
          var nKurser = totVerdier[3];
          //setter inn overskrift om det første rommet i ny boenhet
          if(teller==1){
          utstyrsListeHeadlines(unitName,areal,nRom,nKurser,i);
          }
          utstyrsListeVerdier(romUtstyr,i);

        }
      }
    }

  });

  $('#resultDiv').on('click', ".skjulVisSpan", function(event){
  //stopper propegering
  event.stopPropagation();
  event.stopImmediatePropagation();
  //finner nr på gjeldende span
  var actSpan = parseInt(this.id.replace('skjulVisSpan',''));
  if($('#skjulVisSpan'+actSpan).text() == "Skjul produkter"){
    $('#skjulVisSpan'+actSpan).text("Vis produkter");
    $('#skjulVismeg'+actSpan).hide();
  }else{
    $('#skjulVisSpan'+actSpan).text("Skjul produkter");
    $('#skjulVismeg'+actSpan).show();
  }

});

  ///////////////////////////////////////////////////////
  //////////    HJELPEFUNKSJONER              ///////////
  ///////////////////////////////////////////////////////
  //funksjon som setter inn ny knapp for den nye boenheten
  function newUnitSelectButtons(unitNmbr){
    $('#boligEnhetDiv').append($(
      '<span class ="boligenhetSpan" id="boligenhetSpan'+unitNmbr+'">'+
        '<span class="nameSpan" id="nameSpan'+unitNmbr+'">Boenhet '+unitNmbr+'</span>'+
        '<img class="delUnit" id="delUnit'+unitNmbr+'" src="Pictures/slett.jpg"/>'+
        '<img class="editUnit" id="editUnit'+unitNmbr+'" src="Pictures/rediger.png"/>'+
      '</span>'
    ));
  };
  //funksjon som setter inn overskrifter for ny boligEnhetDiv
  function newUnitHeadlines(unitNmbr){

    $('#tableDiv').append($(
      '<div id="gulvTabellDiv'+unitNmbr+'">'+
        '<table id="gulvTabell'+unitNmbr+'">'+
          '<br>'+
          '<span class = "enhetsOverskrift" id="etasjeTabellOverskrift'+unitNmbr+'">Romliste for boenhet '+unitNmbr+'</span>'+
          '<br><br>'+
          '<tr>'+
            '<th class="buttonCol"></th>'+
            '<th class = "floorCol">Etasje</th>'+
            '<th class = "roomCol">Romnavn</th>'+
            '<th class = "areaCol">Areal</th>'+
            '<th class = "pipeCol">R&oslashrtype</th>'+
            '<th class = "ccCol">R&oslashravstand</th>'+
            '<th class = "circuitCol">Kurser</th>'+
            '<th class="buttonCol"></th>'+
          '</tr>'+
        '</table>'+
        '<br><br>'+
      '</div>'
    ));

  };
  //funksjon som setter inn tomme rader
  function initializeUnit(unitNmbr,floors){
    var i;
    var startFloor = (unitNmbr-1)*100+1;
    var endFloor = startFloor + floors -1;
    //legger til romlinjer i tabellen
    for (i=startFloor;i<=endFloor;i++){
      $('#gulvTabell'+unitNmbr).append($(
        '<tr>'+
        '<td class="buttonCol">'+
          '<img class="delRow" id="delRow' + i + '" src="Pictures/Slett.jpg"/>'+
        '</td>'+
        '<td>'+
          '<select class="inputSelect floorPos" id="floorSelect' + i + '">'+
            '<option>Loading...</option>'+
          '</select>'+
        '</td>'+
        '<td>'+
          '<input class="inputBoks roomNames" type="text" id="roomName' + i + '">'+
        '</td>'+
        '<td>'+
          '<input class="inputBoks roomArea" type="number" id="roomArea' + i + '">'+
        '</td>'+
        '<td>'+
          '<select class="inputSelect pipeSelect" id="pipeSelect' + i + '">'+
            '<option>Loading...</option>'+
          '</select>'+
        '</td>'+
        '<td>'+
          '<select class="inputSelect ccSelect" id="ccSelect' + i + '">'+
            '<option>Loading...</option>'+
          '</select>'+
        '</td>'+
        '<td>'+
          '<input class="inputBoks roomCircuits" type="number" id="roomCircuits' + i + '">'+
        '</td>'+
        '<td class="buttonCol">'+
          '<img class="newRow" id="newRow' + i + '" src="Pictures/NyLinjeBilde.png"/>'+
        '</td>'+
      '</tr>'));
    }
    //setter inn tom rad med kun legg til nylinjeknapp
    $('#gulvTabell'+unitNmbr).append($(
      '<tr><td class="ghostCell"></td><td class="ghostCell"></td><td class="ghostCell"></td><td class="ghostCell">'+
      '</td><td class="ghostCell"></td><td class="ghostCell"></td><td class="ghostCell"></td>'+
      '<td class="buttonCol">'+
        '<img class="newRow" id="newRow' + i + '" src="Pictures/NyLinjeBilde.png"/>'+
      '</td></tr>'));

  };
  //funksjon som setter inn dropdownverdier
  function populateDropDowns(unitNmbr,floors){
    var startFloor = (unitNmbr-1)*100+1;
    var endFloor = startFloor + floors -1;
    //legger til romlinjer i tabellen

    for (var j=startFloor;j<=endFloor;j++){

      var plasseringFloor = "floorSelect" + j;
      var plasseringPipe = "pipeSelect" + j;
      var plasseringCC = "ccSelect" + j;
      //finner største tabell
      var maxArray = Math.max(globalFloorArray.length,globalPipeArray.length,globalCCArray.length);

      //fyller dropdown med valgalternativer fra database
      for (var i=0;i<maxArray;i++){
        var idNmbr = i+1;
        if(i==0){
          $(document.getElementById ( plasseringFloor )).html('<option id=' + i + '></option>');
          $(document.getElementById ( plasseringPipe )).html('<option id=' + i + '></option>');
          $(document.getElementById ( plasseringCC )).html('<option id=' + i + '></option>');
        }
        if(globalFloorArray.length>=i+1){
        $(document.getElementById ( plasseringFloor )).append('<option id=' + idNmbr + '>' + globalFloorArray[i] + '</option>');
        }
        if(globalPipeArray.length>=i+1){
        $(document.getElementById ( plasseringPipe )).append('<option id=' + idNmbr + '>' + globalPipeArray[i] + '</option>');
        }
        if(globalCCArray.length>=i+1){
        $(document.getElementById ( plasseringCC )).append('<option id=' + idNmbr + '>' + globalCCArray[i] + '</option>');
        }
      }
    }
  };
  //funksjon som legger til radioknapper til ny boligEnhetDiv
  function newUnitRadioButtons(unitNmbr){

    $('#diverseUtstyrDiv').append($(
      '<div class = "frameDiv" id="diverseUtstyrDivEnhet'+unitNmbr+'">'+
        '<br>'+
        '<span class = "enhetsOverskrift" id="etasjeTekniskRomOverskrift'+unitNmbr+'"">Teknisk utstyr for boenhet '+unitNmbr+'</span>'+
        '<br><br>'+
        '<div class ="fordelerSkap" id="fordelerSkap'+unitNmbr+'">'+
          '<br>'+
          '<p style="font-weight:bold;">Type fordelerskap</p>'+
          '<label class="inWall"><input type ="radio" class="inWall" id="inWall'+unitNmbr+'" name="type_skap'+unitNmbr+'" value ="inWall" checked> Fordelerskap i vegg</label><br>'+
          //'<label for "inWall'+unitNmbr+'" class="inWall">Fordelerskap i vegg</label><br>'+
          '<label class="onWall"><input type ="radio" class="onWall" id="onWall'+unitNmbr+'" name="type_skap'+unitNmbr+'" value ="onWall"> Fordelerskap p&aring vegg</label><br>'+
          //'<label for "onWall'+unitNmbr+'" class="onWall" >Fordelerskap p&aring vegg</label><br>'+
          '<label class="noType"><input type ="radio"  class="noType" id="noType'+unitNmbr+'" name="type_skap'+unitNmbr+'" value ="noType"> Uten fordelerskap</label><br><br>'+
          //'<label for "noType'+unitNmbr+'" class="noType" >Uten fordelerskap</label><br><br>'+
        '</div>'+
        '<div class ="fordelerStokk" id = "fordelerStokk'+unitNmbr+'">'+
            '<br>'+
            '<p style="font-weight:bold;">Type fordelerstokk</p>'+
            '<label class="withoutBypass"><input type="radio"  class="withoutBypass" id="withoutBypass'+unitNmbr+'" name="type_stokk'+unitNmbr+'" value="withoutBypass" checked> Uten bypass</label><br>'+
            //'<label for="withoutBypass'+unitNmbr+'" class="withoutBypass" >Uten bypass</label><br>'+
            '<label class="withBypass"><input type="radio"  class="withBypass" id="withBypass'+unitNmbr+'" name="type_stokk'+unitNmbr+'" value="withBypass"> Med bypass</label><br><br>'+
            //'<label for="withBypass'+unitNmbr+'" class="withBypass" >Med bypass</label><br><br>'+
        '</div>'+
        '<div class ="termostat" id="termostat'+unitNmbr+'">'+
            '<br>'+
            '<p style="font-weight:bold;">Type romtermostat</p>'+
            '<label class="alpha"><input type="radio"  class="alpha" id="alpha'+unitNmbr+'" name="type_termostat'+unitNmbr+'" value="alpha" checked> ALPHA</label><br>'+
            //'<label for="alpha'+unitNmbr+'" class="alpha" >ALPHA</label><br>'+
            '<label class="icon"><input type="radio"  class="icon" id="icon'+unitNmbr+'" name="type_termostat'+unitNmbr+'" value="icon"> ICON (for appstyring)</label><br>'+
            //'<label for="icon'+unitNmbr+'" class="icon" >ICON (for appstyring)</label><br>'+
            '<label class="noThermostat"><input type="radio"  class="noThermostat" id="noThermostat'+unitNmbr+'" name="type_termostat'+unitNmbr+'" value="noThermostat"> Ingen termostatstyring</label><br><br>'+
            //'<label for="noThermostat'+unitNmbr+'" class="noThermostat" >Ingen termostatstyring</label><br><br>'+
            '<p style="font-weight:bold;">Standard</p>'+
            '<label class="digitalOnlyBathroom"><input type="radio"  class="digitalOnlyBathroom" id="digitalOnlyBathroom'+unitNmbr+'" name="standard'+unitNmbr+'" value="digitalOnlyBathroom" checked> Digital kun p&aring bad</label><br>'+
            //'<label for="digitalOnlyBathroom'+unitNmbr+'" class="digitalOnlyBathroom" >Digital kun p&aring bad</label><br>'+
            '<label class="digitalAllRooms"><input type="radio"  class="digitalAllRooms" id="digitalAllRooms'+unitNmbr+'" name="standard'+unitNmbr+'" value="digitalAllRooms"> Digital i alle rom</label><br><br>'+
            //'<label for="digitalAllRooms'+unitNmbr+'" class="digitalAllRooms" >Digital i alle rom</label><br><br>'+
        '</div>'+
      '</div>'
    ));
  };
  //funksjon som viser kun aktuell boenheten
  function toggleUnitVisibility(unitNmbr){
    //finner antall boenheter
    var totUnits = $('#boligEnhetDiv .boligenhetSpan').length;
    //kontrollerer om det eksisterer boenheter
    if (totUnits>0){
        for (var i=1;i<=totUnits;i++){
          if (i==unitNmbr){
              $('#gulvTabellDiv'+i).show();
              $('#diverseUtstyrDivEnhet'+i).show();
          }else{
            $('#gulvTabellDiv'+i).hide();
            $('#diverseUtstyrDivEnhet'+i).hide();
          }
        }
    }
  };
  //funksjon som endrer CSS klasse på knapp som er trykket ned
  function toggleCssClass(unitNmbr){
    //finner antall boenheter
    var totUnits = $('#boligEnhetDiv .boligenhetSpan').length;
    //kontrollerer om det eksisterer boenheter
    if (totUnits>0){
      for (var i=1;i<=totUnits;i++){
        if($('#boligenhetSpan'+i).hasClass("boligenhetSpan_active")){
          if (i!=unitNmbr){
            $('#boligenhetSpan'+i).toggleClass("boligenhetSpan_active");
          }
        }else if (i==unitNmbr) {
          $('#boligenhetSpan'+i).toggleClass("boligenhetSpan_active");
        }
      }
    }
  };
  //funksjon som skriver nytt navn til boenheten
  function changeNameUnit(unitNmbr,newName){
    $('#nameSpan'+unitNmbr).text(newName);
    $('#etasjeTabellOverskrift'+unitNmbr).text("Romliste for "+newName);
    $('#etasjeTekniskRomOverskrift'+unitNmbr).text("Teknisk utstyr for "+newName);
  };
  //funksjon som sletter boenhet og endrer id på alle resterende boenheter
  function deleteUnit(unitNmbr){
    $('#boligenhetSpan'+unitNmbr).remove();
    $('#gulvTabellDiv'+unitNmbr).remove();
    $('#diverseUtstyrDivEnhet'+unitNmbr).remove();
  };
  //funksjon som finner nødvendig utstyr i rom
  function getPipesForRoom(unitNmbr,roomID){
    //definerer tom romMatrise
    var romMatrise = [];
    //finner gulvvarmepakke for gjeldende romn
    for (var i = 0;i<=globalPakkeArray.length-1;i++){
      if($('#pipeSelect'+roomID).val()==globalPakkeArray[i]["name"]){
        //finner gjeldende cc
        var ccRom = $('#ccSelect'+roomID).val();
        //looper over størrelsen til gulvvarmepakken
        for (var j=0;j<=globalPakkeArray[i]["artikkelnummer"].length-1;j++){
          // definerer artikkelmatrisen
          var artikkel = [3];
          //henter artikkelnummer
          artikkel[0] =globalPakkeArray[i]["artikkelnummer"][j]
          //henter artikkelnummer
          artikkel[1] =globalPakkeArray[i]["artikkelnavn"][j]
          //finner antall av varen basert på beregningsmetode og CC
          if(globalPakkeArray[i]["beregningsmetode"][j]=="pr kvm"){
            artikkel[2] =Math.round(globalPakkeArray[i]["cc"][ccRom]["antall"][j]*$('#roomArea'+roomID).val());
            artikkel[3] = "m"
          }else if(globalPakkeArray[i]["beregningsmetode"][j]=="pr kurs"){
            artikkel[2] =Math.round(globalPakkeArray[i]["cc"][ccRom]["antall"][j]*$('#roomCircuits'+roomID).val());
            artikkel[3] = "stk"
          }else if(globalPakkeArray[i]["beregningsmetode"][j]=="omkrets"){
            artikkel[2] =Math.round(globalPakkeArray[i]["cc"][ccRom]["antall"][j]*Math.sqrt($('#roomArea'+roomID).val())*4);
            artikkel[3] = "m"
          }
          //dytter resultatet til romMatrisen
          romMatrise.push(artikkel);
        }
        return romMatrise;
      }
    }
  };
  //funksjon som setter inn overskrifter for generert utstyrsliste

  function utstyrsListeHeadlines(unitName,areal,nRom,nKurser,unitNmbr){
    //setter inn hovedelement - oppsummering av boenheten
    $('#resultatListe').append('<div class="boenheterOppsummering"><strong>Gulvvarmeutstyr for '+ unitName +'</strong><br>'+
    'Utstyret dekker '+ areal +' m<sup>2</sup>, fordelt på '+ nRom +' rom, med til sammen '+ nKurser +' kurser<br><br>'+
    '<span class="skjulVisSpan" id="skjulVisSpan'+unitNmbr+'">Vis produkter</span><br><br></div>');
    //setter inn tag for skjul/vis
    $('#resultatListe').append('<div id="skjulVismeg'+unitNmbr+'"></div>');
    //skjuler den nye div
    $('#skjulVismeg'+unitNmbr).hide();
    //setter inn overskrifter for utstyret
    $('#skjulVismeg'+unitNmbr).append('<div class="artikkellisteOverskrifter"><span class="produktSpan">Produkt</span><span class="artikkelnrSpan">Artikkelnr.</span>'+
    '<span class="antallSpan">Antall</span><span class="enhetsSpan">Benevning</span></div>');

  };


  //funksjon som setter inn romutstyret
  function utstyrsListeVerdier(romUtstyr,unitNmbr){
    for (var i=0;i<=romUtstyr.length-1;i++){
    //setter inn verdiene
    $('#skjulVismeg'+unitNmbr).append('<div class="artikkellisteLinje"><span class="produktSpan">'+romUtstyr[i][1]+'</span><span class="artikkelnrSpan">'+romUtstyr[i][0]+'</span>'+
    '<span class="antallSpan">'+romUtstyr[i][2]+'</span><span class="enhetsSpan">'+romUtstyr[i][3]+'</span></div>')
    }
  };
  //funksjon som kun henter totalverdiene for hver enhet
  function getUnitTotalvaluesRoomAreaCircuits(unitNmbr){
    //finner totalVerdier
    var totVerdier = [3];
    //navn
    totVerdier[0] = $('#nameSpan'+unitNmbr).text();
    //areal
    totVerdier[1] = 10;
    //rom
    totVerdier[2] = 1;
    //kurser
    totVerdier[3] = 10;
    //returnerer totalverdiene
    return totVerdier;
  };
});
