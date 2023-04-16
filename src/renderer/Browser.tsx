import { useState } from 'react';
import styled from 'styled-components';
import { csvReady, toggleMode } from './Output';
import { calibrate } from './Camera';
import { PostureBuddyLogo } from './Welcome';
import { InterventionMode } from './App';
import _ from 'lodash';
import IonIcon from '@reacticons/ionicons';
import { formatUrl } from './Utils';

const HOME_PAGE = 'http://google.com';

export const DISPLAY_MODES: InterventionMode[] = [
  'auto',
  'off',
  'visual',
  'haptic',
  'all',
  'test',
];
export function Broswer(props: {
  mode: InterventionMode;
  setMode: (m: InterventionMode) => void;
  showStats: () => void;
}) {
  const [searchBarText, setSearchBarText] = useState('');
  const [tabs, setTabs] = useState<string[]>([
    'https://docs.google.com/presentation/d/1xMgw5TA8XgQmJG4QvEATZVm8cVZTqQpXEYxCwI4bYFA/present?usp=sharing',
    'https://www.michigandaily.com',
    'https://www.coolmathgames.com',
    'https://bulletin.engin.umich.edu/courses/eecs#main',
  ]);
  const [currentTab, setCurrentTab] = useState(0);
  const search = () => {
    const newTabs = tabs.slice();
    newTabs[currentTab] = formatUrl(searchBarText);

    console.log('new tabs:', newTabs);

    setSearchBarText(newTabs[currentTab]);
    setTabs(newTabs);
  };

  const openNewTab = () => {
    const newTabs = tabs.slice();
    newTabs.push(HOME_PAGE);
    setTabs(newTabs);
    setCurrentTab(newTabs.length - 1);
  };

  const closeTab = (index: number) => {
    const newTabs = tabs.slice().filter((t, i) => i !== index);
    setTabs(newTabs);

    if (currentTab === index) {
      if (currentTab >= tabs.length) {
        setCurrentTab(tabs.length - 1);
      } else {
        setCurrentTab(currentTab - 1);
      }
    }
  };

  return (
    <Container>
      <Header>
        <PostureBuddyLogo>PostureBuddy Browser</PostureBuddyLogo>
        <div style={{ flexGrow: 1 }} />
        <div
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            display: 'flex',
            marginRight: 8,
          }}
        >
          <input
            style={{
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 6,
              paddingBottom: 6,
              backgroundColor: 'lightgray',
              marginLeft: 8,
              borderRadius: 12,
              fontWeight: 500,
              fontSize: 16,
              width: 300,
            }}
            placeholder="Search or enter website name"
            value={searchBarText}
            onChange={(e) => setSearchBarText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') search();
            }}
          />
          <Button
            className="btn"
            style={{
              marginLeft: -66,
            }}
          >
            Search
          </Button>
        </div>
        <div style={{ flexGrow: 1 }} />
        <Button className="btn" onClick={props.showStats}>
          <IonIcon
            name="stats-chart-outline"
            style={{ width: 18, height: 18, marginRight: 4 }}
          />
          Stats
        </Button>
        <Button className="btn" onClick={(event) => calibrate()}>
          <IonIcon
            name="scan-outline"
            style={{ width: 18, height: 18, marginRight: 4 }}
          />
          Calibrate
        </Button>
        <Button className="btn">
          <IonIcon
            name="hammer-outline"
            style={{ width: 18, height: 18, marginRight: 4 }}
          />
          Mode: {_.capitalize(props.mode)}
          <ModeSelect
            onChange={(e) =>
              props.setMode(e.currentTarget.value as InterventionMode)
            }
          >
            {DISPLAY_MODES.map((m) => (
              <option value={m} selected={m === props.mode}>
                {_.capitalize(m)}
              </option>
            ))}
          </ModeSelect>
        </Button>
      </Header>
      <Tabs>
        {tabs.map((t, i) => (
          <>
            <div
              className="btn"
              style={{
                width: '12%',
                height: 30,
                backgroundColor: currentTab === i ? '#78788044' : '#78788028',
                borderTopRightRadius: 8,
                borderTopLeftRadius: 8,
                marginRight: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                opacity: currentTab === i ? 1 : 0.8,
                borderColor: '#3c3c432d',
                borderWidth: currentTab === i ? 2 : 0,
                overflow: 'visible',
                paddingLeft: 8,
                paddingRight: 8,
              }}
              onClick={() => setCurrentTab(i)}
            >
              <p
                style={{
                  textOverflow: 'fade',
                  overflow: 'hidden',
                  fontWeight: currentTab === i ? '500' : '400',
                  flexGrow: 1,
                  maxLines: 1,
                  fontSize: 14,
                  height: 18,
                }}
              >
                {t.replace(/^.*(:\/\/)/, '').replace('www.', '')}
              </p>
              <p
                onClick={() => closeTab(i)}
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginLeft: 4,
                }}
              >
                ×
              </p>
            </div>
          </>
        ))}
        {tabs.length < 8 && (
          <div
            style={{
              width: '4%',
              height: 30,
              backgroundColor: 'lightgray',
              borderTopRightRadius: 8,
              borderTopLeftRadius: 8,
              marginRight: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={openNewTab}
            className="btn"
          >
            <p style={{ fontSize: 18, fontWeight: '600', margin: 0 }}>+</p>
          </div>
        )}
      </Tabs>
      <Separator />
      <div style={{ flexGrow: 1, position: 'relative' }}>
        {tabs.map((url, i) => (
          <div style={{ pointerEvents: currentTab === i ? 'all' : 'none' }}>
            <webview
              allowFullScreen={false}
              style={{
                position: 'absolute',
                opacity: currentTab === i ? 1 : 0,
                // height: '100%',
                // width: '100%',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                // marginBottom: 150,
              }}
              src={url}
              id={'webview' + i}
              onLoadStart={(e) => {
                // console.log('LOAD PAGE:', e.currentTarget.id);
                // const newTabs = tabs.slice();
                // newTabs[i] = formatUrl(
                //   // @ts-ignore
                //   document.getElementById('webview' + i).getUrl()
                // );
              }}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 99vh;
  width: 99.25vw;
  background-color: white;
`;
export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 16px;
`;
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px 16px;
`;
const Separator = styled.div`
  height: 2px;
  background-color: #78788044;
`;

export const Button = styled.p`
  background-color: #007aff;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  padding: 4px;
  color: white;
  margin-left: 4px;
  position: relative;
  align-items: center;
  display: flex;
  flex-direction: row;
`;
const ModeSelect = styled.select`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: red;
  opacity: 0;
`;
