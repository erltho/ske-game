import React from 'react'
import ReactDOM from 'react-dom'
import {startGame, restart, checkInput} from './game'
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import Button from 'aurora-frontend-react-komponenter/Button';
import {MenuLayout, GameOverLayout} from './layout'
import {loadMainMenu, inputValidator} from './mainMenu'
import loadTotalScore from './totalScore'
import _ from 'underscore';
import jQuery from "jquery";


window.$ = window.jQuery = jQuery;

import './index.css'

class MainMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      gamepadConnected: false,
      gameEnded: false
    };
    this.endGame = this.endGame.bind(this);
    this.newGame = this.newGame.bind(this);
  }


  componentDidMount() {

    this.timerID = setInterval(
      () => this.tick(),
      50
    );

    window.addEventListener("keyup", function (event) {
      event.preventDefault();
      if (event.key === "Enter") {
        document.getElementById("myBtn").click();
      }
    });

    window.addEventListener('gamepadconnected', (e) => {
      this.setState({gamepadConnected: true});
      console.log(e.gamepad.connected);
      console.log(e);
      window.connectedEvent = e;
    });

    window.addEventListener("gamepaddisconnected", (e) => {
      this.setState({gamepadConnected: false});
      console.log(e.gamepad.connected);
      console.log(e);
      window.connectedEvent = e;
    });

    /*
    if ($(".myRow lineHS2")[0]) {
      console.log("ku-melk")
    } else {
      loadMainMenu();
    }
*/
    loadMainMenu();

  }


  componentDidUpdate(prevProps) {


    if (this.state.gameEnded) {
      loadTotalScore();
      console.log("Total score loaded");
      document.getElementById("myBtn").disabled = true;
      setTimeout(() => document.getElementById("myBtn").disabled = false, 2000);
    } else if (!this.state.gameEnded) {
      loadMainMenu();
      document.getElementById("myBtn").disabled = true;
      console.log("componentDidUpdate main menu ");

    } else {
      console.log("component did update");
    }
  }


  componentWillUnmount() {
    clearInterval(this.timerID);
  }


  endGame() {
    this.setState(
      Object.assign(
        this.state,
        {gameEnded: true}
      )
    );
  }

  newGame() {
    this.setState(
      Object.assign(
        this.state,
        {gameEnded: false}
      )
    );
  }


  tick() {
    if (this.state.gamepadConnected === true) {
      let gamepad = navigator.getGamepads()[0];
      let button2 = gamepad.buttons[1];
      if (button2.value === 1) {
        document.getElementById("myBtn").click();
      }
    }
  }


  render() {
    console.log("render");
    var f = checkInput(this.endGame, this.newGame);
    if (!this.state.gameEnded) {
      return (<MenuLayout endGameFun={this.endGame}>
        <div id="game"/>
        <Button id="myBtn" buttonType="primary" onClick={f}>Neste</Button>
      </MenuLayout>);
    } else {
      return (<GameOverLayout>
        <div id="game"/>
        <Button id="myBtn" buttonType="primary" onClick={f}>Neste</Button>
      </GameOverLayout>);
    }

  }
}


ReactDOM.render(
  <SkeBasis>
    <MainMenu/>
  </SkeBasis>
  , document.getElementById('root'));

