import React from 'react'
import ReactDOM from 'react-dom'
import {startGame, restart} from './game'
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import Button from 'aurora-frontend-react-komponenter/Button';
import MenuLayout from './layout'
import {loadMainMenu, inputValidator }from './mainMenu'
import startButtonMash from './buttonMash'

import './index.css'

class MainMenu extends React.Component {


    componentDidMount() {
      loadMainMenu()
    }

  render() {
    return (
    <MenuLayout>
      <div id="game"/>
      <Button buttonType="primary" onClick={startGame}>Neste</Button>
    </MenuLayout>
    )
  }

}


ReactDOM.render(
  <SkeBasis>
    <MainMenu/>
  </SkeBasis>
  , document.getElementById('root'));

