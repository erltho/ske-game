import React from 'react'
import ReactDOM from 'react-dom'
import {startGame, restart} from './game'
import SkeBasis from 'aurora-frontend-react-komponenter/SkeBasis';
import Button from 'aurora-frontend-react-komponenter/Button';
import Layout from './layout'

import './index.css'

class Game extends React.Component {

  componentDidMount() {
    startGame()
  }

  render() {
    return (
      <Layout>
        <div id="game"/>
        <Button buttonType="primary" onClick={restart}>Restart</Button>
      </Layout>
    )
  }

}

ReactDOM.render(
  <SkeBasis>
  <Game />
  </SkeBasis>
  , document.getElementById('root'));
