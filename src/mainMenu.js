import _ from 'underscore';
import jQuery from "jquery";



window.$ = window.jQuery = jQuery;

function loadMainMenu() {
  localStorage.setItem("BrukersNavn", "");
  localStorage.setItem("BrukersNummer", "");
  localStorage.setItem("buttonMashScore", 0);
  localStorage.setItem("reactionGameScore", 0);
  localStorage.setItem("totalScore", 0);

  if (localStorage.getItem("scoreBoard") === null) {
    localStorage.setItem("scoreBoard", "[]");
    console.log(localStorage.scoreBoard);
  }

  plotHigh();
}

function inputValidator() {
  var nameField = document.getElementById('nameField').value;
  var numberField = document.getElementById('numberField').value;

  var nameInput = document.getElementById('strError');
  var numberInput = document.getElementById('nrError');


  var scores1 = JSON.parse(localStorage.scoreBoard);
  var validerNummer = _.where(scores1, {nummer: numberField});


  var strRegex = /^[\w._øæå ]+$/;
  var numRegex = /^\d{8}$/;

  var navntxt = "Dette er ikke et gyldig navn";
  var nummertxt = "Dette er ikke et gyldig telefonnummer";
  var nummerNotValid = "Dette nummeret er allerede registrert";


  if (nameField.match(strRegex) && numberField.match(numRegex) && validerNummer.length === 0) {
    localStorage.setItem("BrukersNavn", nameField);
    localStorage.setItem("BrukersNummer", numberField);
    window.location.replace('buttonMash.html');
  }

  if (!nameField.match(strRegex)) {
    nameInput.textContent = navntxt;
    document.getElementById("nameField").style.borderColor = "red";
  } else {
    nameInput.textContent = "";
    document.getElementById("nameField").style.borderColor = "grey";
  }

  if (!numberField.match(numRegex)) {
    numberInput.textContent = nummertxt;
    document.getElementById("numberField").style.borderColor = "red";
  } else if (validerNummer.length > 0) {
    numberInput.textContent = nummerNotValid;
    document.getElementById("numberField").style.borderColor = "red";
  } else {
    numberInput.textContent = "";
    document.getElementById("numberField").style.borderColor = "grey";
  }
}

function getUserName() {
  var nameField = document.getElementById('nameField').value;
  var navnResultat = document.getElementById('navnResultat');
  console.log(nameField);

  if (nameField.length < 0) {
    navnResultat.textContent = 'Navnet ditt må bestå av minst 3 bokstaver';

  } else {
    localStorage.setItem("BrukersNavn", nameField);

  }
}

function getNumber() {
  var numberField = document.getElementById('numberField').value;
  var nummerResultat = document.getElementById('nummerResultat');
  console.log(numberField);

  localStorage.setItem("BrukersNummer", numberField);

}

var subButton = document.getElementById('subButton');

function plotHigh() {
  var scores = JSON.parse(localStorage.scoreBoard);
  var scores =  _.sortBy(scores, function (o) {
    return parseInt(o.totalScore);
  }).reverse();

  for (var i = 0; i < 5; i++) {

    $('.highScore').append($('<div />', {
      class: 'myRow lineHS' + i
    }));

    if (i % 2 == 0) {
      $('.lineHS' + i).css('background-color', '#e8d6dc');
    }

    for (var j = 0; j < 3; j++) {

      var str;

      if (scores[i] == null) {
        str = "--"
      } else {
        if (j == 0) {
          str = i + 1;
        } else if (j == 1) {
          str = scores[i].navn;
        } else {
          str = scores[i].totalScore;
        }
      }

      $('.lineHS' + i).append($('<div />', {
        class: 'col colHS' + j,
        text: str
      }));
    }
  }
}

export {
  loadMainMenu,
  inputValidator
}

