import React from 'react'
import ReactDOM from 'react-dom'
import {startGame, restart} from './game'
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import Button from 'aurora-frontend-react-komponenter/Button';
import MenuLayout from './layout'
import {loadMainMenu, inputValidator} from './mainMenu'

import './index.css'

class MainMenu extends React.Component {


  componentDidMount() {
    loadMainMenu();

    console.log("componentDidMount");
  }

  render() {
    console.log("render");

    return (
      <MenuLayout>
        <div id="game"/>
        <Button id="myBtn" buttonType="primary" onClick={startGame}>Neste</Button>

      </MenuLayout>
    )
  }

}


ReactDOM.render(
  <SkeBasis>
    <MainMenu/>
  </SkeBasis>
  , document.getElementById('root'));

