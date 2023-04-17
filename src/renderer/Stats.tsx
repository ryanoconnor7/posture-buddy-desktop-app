import styled from 'styled-components';
import { Button, Container, Header } from './Browser';
import { CSVdata, csvReady, postureInstance } from './Output';
import { PostureBuddyLogo } from './Welcome';
import IonIcon from '@reacticons/ionicons';
import _ from 'lodash';
import {
  feedbackMethodDisplay,
  modeSummary,
  timeMinSec,
  timeSec,
} from './Utils';
import { useEffect, useState } from 'react';
import { BAD_ERROR_RATE, PostureClass, postureClassColor } from './Diagram';
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
  BarElement,
} from 'chart.js';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import { InterventionMode } from './App';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement
);

const processData = () => {
  let data = CSVdata;
  let tStart: number | undefined = undefined;
  const durationsDefault = {
    total: 0,
    pause: 0,
    good: 0,
    fair: 0,
    bad: 0,
  };
  let durations = {
    overall: { ...durationsDefault },
    off: { ...durationsDefault },
    visual: { ...durationsDefault },
    haptic: { ...durationsDefault },
    all: { ...durationsDefault },
    extreme: { ...durationsDefault },
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

  let lastMode: any = 'off';
  const addDuration = (
    state: PostureClass | 'total' | 'pause',
    value: number,
    mode: InterventionMode = 'off'
  ) => {
    // Always add to overall
    durations.overall[state] += value;

    // Add to individual modes
    if (mode == 'paused') {
      // @ts-ignore
      durations[lastMode][state] += value;
    } else {
      durations[mode][state] += value;
      lastMode = mode;
    }
  };

  let lastBadElapsed = 0;
  let currState: PostureClass = 'good';
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
        case 'FINISH':
        case 'NEXT_CYCLE':
          addDuration(currState, frameDuration, log.Control);
          break;
        case 'RESUME':
          addDuration('pause', frameDuration, log.Control);
          break;
        case 'good':
        case 'fair':
        case 'bad':
          addDuration(currState, frameDuration, log.Control);
          currState = log.Reason;
          break;
      }

      if (log.Reason !== 'RESUME') {
        addDuration('total', frameDuration, log.Control);
      }

      if (log.Reason === 'bad' && lastBadElapsed == 0) {
        lastBadElapsed = durations.overall.total;
      } else if (log.Reason === 'good' && lastBadElapsed > 0) {
        const diffBadToGood = durations.overall.total - lastBadElapsed;
        correctionTimes.push(diffBadToGood);
        lastBadElapsed = 0;
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

const timeRow = (
  title: string,
  valueMs: number,
  percent?: number,
  accessory?: JSX.Element,
  hideBorder?: boolean
) => {
  const percentStr = percent ? ` (${(percent * 100).toFixed(0)}%)` : '';
  return (
    <StatRow style={hideBorder ? { border: 'none' } : {}}>
      {accessory}
      <StatTitle>{title}</StatTitle>
      {timeMinSec(valueMs) + percentStr}
    </StatRow>
  );
};

const DurationRow = (
  mode: InterventionMode | 'overall',
  durations: any,
  showTitle: boolean,
  direction: 'row' | 'column'
) => {
  return (
    <DataSection>
      {showTitle && <SectionTitle>{modeSummary(mode)}</SectionTitle>}
      <div
        style={{
          flexDirection: direction,
          display: 'flex',
          flexGrow: 1,
          alignItems: 'center',
        }}
      >
        <DataSection style={{ margin: 16, marginTop: 0 }}>
          {timeRow(
            `${showTitle ? 'Total' : modeSummary(mode)} Time`,
            durations.total,
            undefined,
            undefined,
            true
          )}
          {timeRow(
            'Good Posture',
            durations.good,
            durations.good / durations.total,
            <Dot style={{ backgroundColor: postureClassColor.good }} />
          )}
          {timeRow(
            'Fair Posture',
            durations.fair,
            durations.fair / durations.total,
            <Dot style={{ backgroundColor: postureClassColor.fair }} />
          )}
          {timeRow(
            'Bad Posture',
            durations.bad,
            durations.bad / durations.total,
            <Dot style={{ backgroundColor: postureClassColor.bad }} />
          )}
        </DataSection>
        <div style={{ width: '35%' }}>
          <Doughnut
            data={{
              datasets: [
                {
                  data: [durations.good, durations.fair, durations.bad].map(
                    (v) => v / 1000 / 60
                  ),
                  backgroundColor: [
                    postureClassColor.good,
                    postureClassColor.fair,
                    postureClassColor.bad,
                  ],
                  label: 'Time (min)',
                },
              ],
            }}
            style={{ paddingRight: 16, paddingBottom: 16 }}
          />
        </div>
      </div>
    </DataSection>
  );
};

const Stats = (props: { hide: () => void }) => {
  const [stats, setStats] = useState<any>(undefined);
  useEffect(() => {
    setStats(processData());
  }, []);

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

  const baseModes: (InterventionMode | 'overall')[] = [
    'off',
    'visual',
    'haptic',
    'extreme',
    'all',
  ];
  const timeDisplayModes = stats
    ? baseModes.filter((m) => stats.durations[m].total > 0 || m === 'overall')
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
            <TimeSectionWrapper style={{ width: '50%' }}>
              {DurationRow('overall', stats.durations.overall, true, 'row')}
              {/* <div style={{ flexDirection: 'row', display: 'flex' }}>
                {timeDisplayModes.map((mode) =>
                  DurationRow(mode, stats.durations[mode], false, 'column')
                )}
              </div> */}
              <DataSection>
                <SectionTitle>Posture by Feedback Method</SectionTitle>
                <Bar
                  data={{
                    datasets: ['good', 'fair', 'bad'].map((postureClass) => ({
                      data: timeDisplayModes.map((m) => ({
                        x: feedbackMethodDisplay(m),
                        y:
                          (stats.durations[m][postureClass] /
                            stats.durations[m].total) *
                          100,
                      })),
                      backgroundColor:
                        postureClassColor[postureClass as PostureClass],
                      label: _.capitalize(postureClass),
                      maxBarThickness: 70,
                    })),
                  }}
                  options={{
                    scales: {
                      x: {
                        stacked: true,
                        title: { text: 'Feedback Method', display: true },
                      },
                      y: {
                        stacked: true,
                        title: { text: 'Time (%)', display: true },
                      },
                    },
                  }}
                  style={{ margin: 16 }}
                />
              </DataSection>
            </TimeSectionWrapper>
            <DataSection style={{ width: '25%' }}>
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
                  scales: {
                    x: {
                      title: {
                        text: 'Instance of Correction',
                        display: true,
                      },
                    },
                    y: {
                      title: { text: 'Correction Time (s)', display: true },
                    },
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
                style={{
                  padding: 8,
                  // paddingTop: 4,
                  borderTop: '1px solid #78788044',
                }}
              />
            </DataSection>
            <DataSection style={{ width: '25%' }}>
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
  padding: 0px 8px;
`;
const DataSection = styled.div`
  background-color: #78788028;
  border-radius: 12px;
  margin: 8px 8px;
`;
const TimeSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* margin-right: 18px; */
`;
const StatRow = styled.p`
  font-size: 16px;
  padding: 12px 12px;
  border-top: 1px solid #78788044;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
  font-variant: tabular-nums;
  flex-wrap: wrap;
`;
const SectionTitle = styled.p`
  text-align: center;
  font-size: 19px;
  font-weight: 600;
  padding: 12px 12px;
  margin: 0px;
`;
const StatTitle = styled.p`
  font-weight: 500;
  flex-grow: 1;
  margin: 0;
  margin-right: 8px;
`;
const Dot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 9px;
  margin-right: 8px;
`;
