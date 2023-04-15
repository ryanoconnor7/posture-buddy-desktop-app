import styled from 'styled-components';
import { Button, Container, Header } from './Browser';
import { csvReady } from './Output';
import { PostureBuddyLogo } from './Welcome';
import IonIcon from '@reacticons/ionicons';

const Stats = (props: { hide: () => void }) => {
  return (
    <AbsoluteContainer>
      <Header>
        <PostureBuddyLogo>PostureBuddy Browser</PostureBuddyLogo>
        <div style={{ flexGrow: 1 }} />
        <Button className="btn" onClick={(event) => csvReady()}>
          <IonIcon
            name="download-outline"
            style={{ width: 18, height: 18, marginRight: 4 }}
          />
          Download Logs
        </Button>
        <Button className="btn" onClick={props.hide}>
          <IonIcon name="close-outline" style={{ width: 18, height: 18 }} />
          Close
        </Button>
      </Header>
      <h1>Testing complete!</h1>
      <h1>Please download logs and send to your test requester!</h1>
    </AbsoluteContainer>
  );
};

export default Stats;

const AbsoluteContainer = styled(Container)`
  position: absolute;
  top: 0px;
`;
