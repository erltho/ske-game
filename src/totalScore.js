import _ from 'underscore';
import jQuery from "jquery";

window.$ = window.jQuery = jQuery;


function loadTotalScore() {
  document.getElementById("antallTrykk").innerHTML = "Antall trykk i hastighetsspillet: " + localStorage.getItem("trykk");
  if (localStorage.getItem("reaksjon") <= 0) {
    document.getElementById("reaksjon").innerHTML = "Du trykket for tidlig i reaksjonsspillet";
  } else {
    document.getElementById("reaksjon").innerHTML = "Din reaksjon: " + localStorage.getItem("reaksjon") + " ms";
  }
  if ((localStorage.getItem("fangetTyv") <= 0)) {
    document.getElementById("fly").innerHTML = "Du fanget ikke tyven i fingerferdighetspillet";
  } else {
    document.getElementById("fly").innerHTML = "Du fanget tyven i fingerferdighetspillet";
  }
  document.getElementById("totalS").innerHTML = "Total score: " + localStorage.getItem("totalScore") + " kr";
  plotMe();
}

function plotMe() {
  var scores = JSON.parse(localStorage.scoreBoard);
  scores = _.sortBy( scores, function(o) { return parseInt(o.totalScore); }).reverse();
  var index = scores.map(function(e) { return e.nummer; }).indexOf(localStorage.BrukersNummer);
  var indexes = getMyNeigh(scores, index);

  console.log(index);
  console.log(indexes);

  for (var i = 0; i < 5; i++) {

    $('.myScore').append($('<div />', {
      class: 'myRow lineMS'+i
    }));

    if (i%2 === 0) {
      console.log("aa");
      $('.lineMS'+i).css('background-color', '#e8d6dc');
    }

    for (var j = 0; j < 3; j++) {

      var str;

      if (scores[indexes[i]] == null) {
        str = "--"
      } else {
        if (j === 0) {
          str = indexes[i]+1;
        } else if (j === 1) {
          str = scores[indexes[i]].navn;
        } else {
          str = scores[indexes[i]].totalScore;
        }
      }

      $('.lineMS'+i).append($('<div />', {
        class: 'col colMS'+j,
        text: str
      }));
    }
    if (index === indexes[i]) {
      console.log("AAA");
      $('.lineMS'+i).css("font-weight", "bolder");
    }
  }
}

function getMyNeigh(scores, myPos) {
  if (myPos <= 2 || scores <= scores.lengthl) {
    return [0, 1, 2, 3, 4]
  } else if (myPos+3 >= scores.length) {
    var n = scores.length-1;
    return [n-4, n-3, n-2, n-1, n]
  } else {
    return [myPos-2, myPos-1, myPos, myPos+1, myPos+2];
  }
}



export default loadTotalScore;
