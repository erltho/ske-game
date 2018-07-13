import React from 'react'
import ReactDOM from 'react-dom'
import {startGame, restart} from './game'
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import Button from 'aurora-frontend-react-komponenter/Button';
import GameLayout from './layout'
import loadMainMenu from './mainMenu'
import Underscore from 'underscore';

import './index.css'


class Game extends React.Component {

/*
  componentDidMount() {
    startGame()
  }
*/
  render() {
    return (
      <GameLayout>
        <div id="game"/>
        <Button buttonType="primary" onClick={startGame}>Start Game</Button>
      </GameLayout>
    )
  }

}

class MainMenu extends React.Component {


    componentDidMount() {
      loadMainMenu()
    }

  render() {
    return <GameLayout>
      <div className="ske-layout__body">
        <main className="ske-layout__kjerne">
          <div className="contentWrapper">
            <div className="content colorHoved">
              <img src={require("../src/assets/img/Skattepumpa.png")} height="" className="imgCenter"/>
              <div className="highScore scoreList"></div>
              <form id='nameForm'>
                <div className="inputList">
                  <ul className="input-list style-2 clearfix">
                    <li>
                      <input id='nameField' type="text" placeholder="Ditt navn"/>
                    </li>
                    <li>
                      <input id='numberField' type="text" placeholder="Ditt telefonnummer"/>
                    </li>
                  </ul>
                </div>
                <div style={{position: 'relative'}} className="errorMsg">
                  <div id="strError" className="errorMsgBlock" style={{color: "red"}}></div>
                  <div style={{bottom: "0", position: "absolute", color: "red"}} id="nrError"
                       className="errorMsgBlock"></div>
                </div>
              </form>
              <div
                style={{marginBottom: "2%", marginLeft: "2%", marginTop: "8.8%", zIndex: "10", position: "absolute"}}>
                <img src={require("../src/assets/img/2017/ForsideGubbe.png")} height="200px"/>
              </div>
            </div>
            {/* TODO: Knapp som sjekker input*/}
          </div>
        </main>
      </div>
      <div id="game"/>
      <Button buttonType="primary" onClick={startGame}>Start Game</Button>
    </GameLayout>
  }

}


ReactDOM.render(
  <SkeBasis>
    <MainMenu/>
  </SkeBasis>
  , document.getElementById('root'));
