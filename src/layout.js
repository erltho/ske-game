import React from 'react'
import TopBanner from 'aurora-frontend-react-komponenter/TopBanner';
import FooterContent from 'aurora-frontend-react-komponenter/FooterContent';
import Grid from 'aurora-frontend-react-komponenter/Grid';

const MenuLayout = ({children, endGameFun}) => {
  //endGameFun();
  return (
    <div>
      <TopBanner
        external
        compact
        homeText="Til skatteetaten.no"
        title="Skattepumpa"
      />
      <div id="ske-layout__body">
        <main className="ske-layout__kjerne">
          <div className="contentWrapper">
            <div className="content colorHoved">
              <img src={require("./assets/img/2017/Skattepumpa.png")} height="" className="imgCenter"/>
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
              <div id={'gubbediv'}
                   style={{
                     marginBottom: "2%",
                     marginLeft: "2%",
                     marginTop: "8.8%",
                     zIndex: "10",
                     position: "absolute"
                   }}>
                <img src={require("./assets/img/2017/ForsideGubbe.png")} height="200px"/>
              </div>
            </div>
          </div>
        </main>
      </div>
      {children}
      <FooterContent>
        <Grid>
          <Grid.Row>
            <Grid.Col sm={12} lg={12} xl={3}>
              <FooterContent.Logo/>
            </Grid.Col>
            <Grid.Col sm={12} lg={12} xl={3}>
              All rights reversed
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </FooterContent>
    </div>
  );
}


const GameOverLayout = ({children}) => (

  <div>
    <TopBanner
      external
      compact
      homeText="Til skatteetaten.no"
      title="Skattepumpa"
    />
    <div id="ske-layout__body">
      <main className="ske-layout__kjerne">
        <div className="contentWrapper">
          <div className="content colorScore">
            <img src={require("./assets/img/2017/DinScore.png")} height="" className="imgCenter"/>
            <h3 className="simpleText" id="antallTrykk">0</h3>
            <h3 className="simpleText" id="reaksjon">0</h3>
            <h1 className="totalScoreText" id="totalS">0</h1>
            <div className="myScore scoreList"></div>
          </div>
        </div>
      </main>
    </div>
    {children}
    <FooterContent>
      <Grid>
        <Grid.Row>
          <Grid.Col sm={12} lg={12} xl={3}>
            <FooterContent.Logo/>
          </Grid.Col>
          <Grid.Col sm={12} lg={12} xl={3}>
            All rights reversed
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </FooterContent>
  </div>
);


export {
  MenuLayout,
  GameOverLayout
}

