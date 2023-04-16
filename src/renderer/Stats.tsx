import styled from 'styled-components';
import { Button, Container, Header } from './Browser';
import { CSVdata, csvReady, postureInstance } from './Output';
import { PostureBuddyLogo } from './Welcome';
import IonIcon from '@reacticons/ionicons';
import _ from 'lodash';
import { timeMinSec, timeSec } from './Utils';
import { useEffect, useState } from 'react';
import { BAD_ERROR_RATE, postureClassColor } from './Diagram';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Doughnut, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const processData = () => {
  let data = CSVdata;
  let tStart: number | undefined = undefined;
  let durations = {
    total: 0,
    pause: 0,
    good: 0,
    fair: 0,
    bad: 0,
  };

  // Reasons for each posture violation
  // May be multiple reasons for a single bad instance
  let badPostureWarnings = {
    total: 0,
    sustained: 0,
    high: 0,
    low: 0,
    left: 0,
    right: 0,
    forward: 0,
    back: 0,
  };
  const correctionTimes: number[] = [];

  let lastBadStartIndex = 0;
  let currState: 'good' | 'fair' | 'bad' = 'good';
  data
    .filter((l) => !l.Reason?.includes('-state'))
    .forEach((log, i, r) => {
      if (log.Reason === 'START') {
        tStart = log.Time ?? 0;
        return;
      } else if (tStart === undefined || i === 0) {
        return;
      }

      const prevLog = r[i - 1];
      const frameDuration = (log.Time ?? 0) - (prevLog.Time ?? 0);
      switch (log.Reason) {
        case 'PAUSE':
          durations[currState] += frameDuration;
          break;
        case 'RESUME':
          durations.pause += frameDuration;
          break;
        case 'good':
        case 'fair':
        case 'bad':
          durations[currState] += frameDuration;
          currState = log.Reason;
          break;
      }

      if (log.Reason === 'bad' && lastBadStartIndex === 0) {
        lastBadStartIndex = i;
      } else if (log.Reason === 'good' && lastBadStartIndex) {
        const badLog = data[lastBadStartIndex];
        const diffBadToGood = (log.Time ?? 0) - (badLog.Time ?? 0);
        correctionTimes.push(diffBadToGood);
        lastBadStartIndex = 0;
      }

      if (log.Reason !== 'RESUME') {
        durations.total += frameDuration;
      }
    });

  // Analyze bad state violations (persisted bad state)
  data
    .filter((l) => l.Reason == 'bad')
    .forEach((log) => {
      badPostureWarnings.total += 1;

      const err = BAD_ERROR_RATE;
      if ((log.TranslateX ?? 0) < -1 * err) badPostureWarnings.left += 1;
      if ((log.TranslateX ?? 0) > err) badPostureWarnings.right += 1;

      if ((log.TranslateY ?? 0) < -1 * err) badPostureWarnings.high += 1;
      if ((log.TranslateY ?? 0) > err) badPostureWarnings.low += 1;

      if ((log.Scale ?? 0) < -1 * err) badPostureWarnings.back += 1;
      if ((log.Scale ?? 0) > err) badPostureWarnings.forward += 1;
    });

  badPostureWarnings.sustained = data.filter(
    (l) => l.Reason == 'bad-state'
  ).length;

  const stats = {
    durations,
    correctionTime: correctionTimes.length
      ? {
          average: _.mean(correctionTimes),
          max: _.max(correctionTimes),
          min: _.min(correctionTimes),
          values: correctionTimes,
        }
      : undefined,
    badPostures: badPostureWarnings,
  };
  console.log(stats);
  return stats;
};

const Stats = (props: { hide: () => void }) => {
  const [stats, setStats] = useState<any>(undefined);
  useEffect(() => {
    setStats(processData());
  }, []);

  const timeRow = (
    title: string,
    valueMs: number,
    percent?: number,
    accessory?: JSX.Element
  ) => {
    const percentStr = percent ? ` (${(percent * 100).toFixed(0)}%)` : '';
    return (
      <StatRow>
        {accessory}
        <StatTitle>{title}</StatTitle>
        {timeMinSec(valueMs) + percentStr}
      </StatRow>
    );
  };

  const statRow = (title: string, value: string) => {
    return (
      <StatRow>
        <StatTitle>{title}</StatTitle>
        {value}
      </StatRow>
    );
  };

  const correctionTimes: number[] = stats?.correctionTime?.values ?? [];

  const badPostures: { title: string; value: number }[] = stats
    ? [
        { title: 'Too Far Left', value: stats.badPostures.left },
        { title: 'Too Far Right', value: stats.badPostures.right },
        { title: 'Too High', value: stats.badPostures.high },
        { title: 'Too Low', value: stats.badPostures.low },
        { title: 'Too Close', value: stats.badPostures.forward },
        { title: 'Too Far Back', value: stats.badPostures.back },
      ]
        .filter((a) => a.value > 0)
        .sort((a, b) => b.value - a.value)
    : [];
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
      {stats && (
        <div
          style={{
            display: 'flex',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: -36,
          }}
        >
          <DataWrapper>
            <DataSection>
              <SectionTitle>Time Spent</SectionTitle>
              {timeRow('Total Time', stats.durations.total)}
              {timeRow(
                'Good Posture',
                stats.durations.good,
                stats.durations.good / stats.durations.total,
                <Dot style={{ backgroundColor: postureClassColor.good }} />
              )}
              {timeRow(
                'Fair Posture',
                stats.durations.fair,
                stats.durations.fair / stats.durations.total,
                <Dot style={{ backgroundColor: postureClassColor.fair }} />
              )}
              {timeRow(
                'Bad Posture',
                stats.durations.bad,
                stats.durations.bad / stats.durations.total,
                <Dot style={{ backgroundColor: postureClassColor.bad }} />
              )}
              <Doughnut
                data={{
                  datasets: [
                    {
                      data: [
                        stats.durations.good,
                        stats.durations.fair,
                        stats.durations.bad,
                      ].map((v) => v / 1000 / 60),
                      backgroundColor: [
                        postureClassColor.good,
                        postureClassColor.fair,
                        postureClassColor.bad,
                      ],
                      label: 'Time (min)',
                    },
                  ],
                }}
                style={{ borderTop: '1px solid #78788044' }}
              />
            </DataSection>
            <DataSection>
              <SectionTitle>Time to Correct Posture</SectionTitle>
              {statRow('Average', timeSec(stats.correctionTime?.average))}
              {statRow('Min', timeSec(stats.correctionTime?.min))}
              {statRow('Max', timeSec(stats.correctionTime?.max))}
              <Line
                data={{
                  labels: correctionTimes.map((t, i) => i + 1),
                  datasets: [
                    {
                      // data: correctionTimes.map((t, i) => t / 1000),
                      data: correctionTimes.map((t) => t / 1000),
                      label: 'Correction Time (sec)',
                      backgroundColor: '#007aff',
                      borderColor: '#007aff',
                      tension: 0.25,
                    },
                  ],
                }}
                options={{
                  showLine: true,
                }}
                style={{
                  padding: 8,
                  paddingTop: 4,
                  borderTop: '1px solid #78788044',
                }}
              />
            </DataSection>
            <DataSection>
              <SectionTitle>Bad Posture Reasons</SectionTitle>
              {statRow('Total Posture Slips', stats.badPostures.total)}
              {statRow('Sustained Slips (>7 sec)', stats.badPostures.sustained)}
              {badPostures.map((b) =>
                statRow(
                  b.title,
                  `${((b.value / stats.badPostures.total) * 100).toFixed(0)}%`
                )
              )}
            </DataSection>
          </DataWrapper>
        </div>
      )}
    </AbsoluteContainer>
  );
};

export default Stats;

const AbsoluteContainer = styled(Container)`
  position: absolute;
  top: 0px;
`;
const DataWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: center;
  width: 100%;
  max-width: 1150px;
  padding: 0px 36px;
`;
const DataSection = styled.div`
  background-color: #78788028;
  border-radius: 12px;
  margin: 18px;
  width: 33.33%;
`;
const StatRow = styled.p`
  font-size: 17px;
  padding: 12px 12px;
  border-top: 1px solid #78788044;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
  font-variant: tabular-nums;
`;
const SectionTitle = styled.p`
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  padding: 12px 12px;
  margin: 0px;
`;
const StatTitle = styled.p`
  font-weight: 500;
  flex-grow: 1;
  margin: 0;
  margin-right: 24px;
`;
const Dot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 9px;
  margin-right: 8px;
`;
