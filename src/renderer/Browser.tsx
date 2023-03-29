import { useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';

const HOME_PAGE = 'http://google.com';
export function Broswer() {
  const [searchBarText, setSearchBarText] = useState('');
  const [tabs, setTabs] = useState<string[]>([HOME_PAGE]);
  const [currentTab, setCurrentTab] = useState(0);
  const search = () => {
    const newTabs = tabs.slice();
    if (searchBarText.includes('://')) {
      newTabs[currentTab] = searchBarText;
    } else if (!searchBarText.includes(' ') && searchBarText.includes('.')) {
      newTabs[currentTab] = 'https://' + searchBarText;
    } else {
      newTabs[currentTab] =
        'http://google.com/search?q=' + encodeURIComponent(searchBarText);
    }

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
        <div style={{ flexGrow: 1 }}>
          <h2>PostureBuddy Browser</h2>
        </div>
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
          <div
            style={{
              backgroundColor: '#007aff',
              borderRadius: 8,
              marginLeft: -66,
            }}
          >
            <p
              style={{
                fontWeight: '500',
                fontSize: 16,
                margin: 4,
                color: 'white',
              }}
            >
              Search
            </p>
          </div>
        </div>
      </Header>
      <Tabs>
        {tabs.map((t, i) => (
          <>
            <div
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
                }}
              >
                {t.replace(/^.*(:\/\/)/, '')}
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
          >
            <p style={{ fontSize: 18, fontWeight: '600', margin: 0 }}>+</p>
          </div>
        )}
      </Tabs>

      <div style={{}}>
        {tabs.map((url, i) => (
          <webview
            style={{
              position: 'absolute',
              opacity: currentTab === i ? 1 : 0,
              height: '85%',
              width: '100%',
            }}
            src={url}
            id="webview"
          ></webview>
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: 90vw;
  background-color: white;
`;
const Header = styled.div`
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
