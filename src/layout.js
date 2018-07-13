import React from 'react'
import TopBanner from 'aurora-frontend-react-komponenter/TopBanner';
import FooterContent from 'aurora-frontend-react-komponenter/FooterContent';
import Grid from 'aurora-frontend-react-komponenter/Grid';

const GameLayout = ({children}) => (
  <div>
    <TopBanner
      external
      compact
      homeText="Til skatteetaten.no"
      title="Skattepumpa"
    />
    {children}
    <FooterContent>
      <Grid>
        <Grid.Row>
          <Grid.Col sm={12} lg={12} xl={3}>
            <FooterContent.Logo />
          </Grid.Col>
          <Grid.Col sm={12} lg={12} xl={3}>
            All rights reserved
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </FooterContent>
  </div>
);

export default GameLayout;

