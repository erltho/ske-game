import React from 'react'
import TopBanner from 'aurora-frontend-react-komponenter/TopBanner';
import FooterContent from 'aurora-frontend-react-komponenter/FooterContent';
import Grid from 'aurora-frontend-react-komponenter/Grid';

const Layout = ({children}) => (
  <div>
    <TopBanner
      external
      compact
      homeText="Til skatteetaten.no"
      title="Ske game"
    />
    {children}
    <FooterContent>
      <Grid>
        <Grid.Row>
          <Grid.Col sm={12} lg={12} xl={3}>
            <FooterContent.Logo />
          </Grid.Col>
          <Grid.Col sm={12} lg={12} xl={3}>
            Annet innhold
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </FooterContent>
  </div>
);

export default Layout
