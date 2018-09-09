import _ from 'underscore';
import jQuery from "jquery";


window.$ = window.jQuery = jQuery;

function loadMainMenu() {
  localStorage.setItem("BrukersNavn", "");
  localStorage.setItem("BrukersNummer", "");
  localStorage.setItem("buttonMashScore", 0);
  localStorage.setItem("reactionGameScore", 0);
  localStorage.setItem("sideScrollerScore", 0);
  localStorage.setItem("trykk", 0);
  localStorage.setItem("reaksjon", 0);
  localStorage.setItem("fangetTyv", 0);
  localStorage.setItem("spagetti", 0);
  localStorage.setItem("totalScore", 0);




  $("#nameField").attr("tabindex", 1);
  $("#numberField").attr("tabindex", 2);

  $('#myBtn').prop("disabled", true);
  setTimeout(() => document.getElementById("myBtn").disabled = false, 1000);
  $("#numberField").keyup(function () {
    let numberInput = document.getElementById('nrError');
    numberInput.textContent = "";
    document.getElementById("numberField").style.borderColor = "grey";
    /*
      if ($(this).val().length === 8 && $(this).val().match(/^\d+$/))
        $('#myBtn').prop('disabled', false);
      else
        //$('#myBtn').prop('disabled', true);
        console.log("Not valid number");
  */
  });
  $("#nameField").keyup(function () {
    let nameInput = document.getElementById('strError');
    nameInput.textContent = "";
    document.getElementById("nameField").style.borderColor = "grey";
  });

  if (localStorage.getItem("scoreBoard") === null) {
    localStorage.setItem("scoreBoard", "[]");
  }

  let topFive = document.getElementById("topFive");
  topFive.onclick = topFiveFun();

  let search = document.getElementById("searchNumber");
  search.onclick = plotMe();


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

function topFiveFun() {
  return function () {
    var scores = JSON.parse(localStorage.scoreBoard);
    scores = _.sortBy(scores, function (o) {
      return parseInt(o.totalScore);
    }).reverse();
    let items = document.getElementById("theList").childElementCount;

    console.log(scores.length);
    document.getElementById("antallSpillere").innerHTML = "Antall spillere: " + scores.length;
    if (items >= 5) {
      var myNode = document.getElementById("theList");
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }
    }
    for (var i = 0; i < 5; i++) {

      $('.highScore').append($('<div />', {
        class: 'myRow lineHS' + i
      }));

      if (i % 2 === 0) {
        $('.lineHS' + i).css('background-color', '#e8d6dc');
      }

      for (var j = 0; j < 3; j++) {

        var str;

        if (scores[i] == null) {
          str = "--"
        } else {
          if (j === 0) {
            str = i + 1;
          } else if (j === 1) {
            str = scores[i].navn;
          } else {
            str = scores[i].totalScore;
          }
        }

        $('.lineHS' + i).append($('<div />', {
          class: 'col colHS' + j,
          text: str
        }));


        $('.highScore').css('border', '1px solid black');
      }
    }
  }
}

function plotMe() {
  return function () {

    let searchFieldValue = document.getElementById('searchField').value;

    console.log(searchFieldValue);

    var scores = JSON.parse(localStorage.scoreBoard);
    scores = _.sortBy(scores, function (o) {
      return parseInt(o.totalScore);
    }).reverse();
    var index = scores.map(function (e) {
      return e.nummer;
    }).indexOf(searchFieldValue);
    var indexes = getMyNeigh(scores, index);

    //console.log(index);
    //console.log(indexes);

    let items = document.getElementById("theList").childElementCount;
    if (items >= 5) {
      var myNode = document.getElementById("theList");
      while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
      }
    }
    for (var i = 0; i < 5; i++) {

      $('.highScore').append($('<div />', {
        class: 'myRow lineMS' + i
      }));

      if (i % 2 === 0) {
        $('.lineMS' + i).css('background-color', '#e8d6dc');
      }

      for (var j = 0; j < 3; j++) {

        var str;

        if (scores[indexes[i]] == null) {
          str = "--"
        } else {
          if (j === 0) {
            str = indexes[i] + 1;
          } else if (j === 1) {
            str = scores[indexes[i]].navn;
          } else {
            str = scores[indexes[i]].totalScore;
          }
        }

        $('.lineMS' + i).append($('<div />', {
          class: 'col colMS' + j,
          text: str
        }));
      }
      if (index === indexes[i]) {
        $('.lineMS' + i).css("font-weight", "bolder");
      }
    }
  }
}

function getMyNeigh(scores, myPos) {
  //console.log(myPos);
  if (myPos <= 2 || scores <= scores.lengthl) {
    return [0, 1, 2, 3, 4]
  } else if (myPos + 3 >= scores.length) {
    var n = scores.length - 1;
    return [n - 4, n - 3, n - 2, n - 1, n]
  } else {
    return [myPos - 2, myPos - 1, myPos, myPos + 1, myPos + 2];
  }
}

function plotHigh() {
  var scores = JSON.parse(localStorage.scoreBoard);
  scores = _.sortBy(scores, function (o) {
    return parseInt(o.totalScore);
  }).reverse();


  console.log(scores.length);
  document.getElementById("antallSpillere").innerHTML = "Antall spillere: " + scores.length;
  let items = document.getElementById("theList").childElementCount;
  if (items >= 5) {
    var myNode = document.getElementById("theList");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  }
  for (var i = 0; i < 5; i++) {

    $('.highScore').append($('<div />', {
      class: 'myRow lineHS' + i
    }));

    if (i % 2 === 0) {
      $('.lineHS' + i).css('background-color', '#e8d6dc');
    }

    for (var j = 0; j < 3; j++) {

      var str;

      if (scores[i] == null) {
        str = "--"
      } else {
        if (j === 0) {
          str = i + 1;
        } else if (j === 1) {
          str = scores[i].navn;
        } else {
          str = scores[i].totalScore;
        }
      }

      $('.lineHS' + i).append($('<div />', {
        class: 'col colHS' + j,
        text: str
      }));


      $('.highScore').css('border', '1px solid black');
    }
  }

}


export {
  loadMainMenu,
  inputValidator
}

