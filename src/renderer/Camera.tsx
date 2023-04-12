import { Pose, Results, LandmarkList } from '@mediapipe/pose';
import { useState } from 'react';
import React, { useRef, useEffect } from 'react';
import * as mediapose from '@mediapipe/pose';
import * as drawing from '@mediapipe/drawing_utils';
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import styled from 'styled-components';
import { SHOW_CAMERA } from './App';
import {addData} from './Output';
import { lastPostureClass, curPostureClass} from './Diagram';

export interface PostureState {
  relativeDistance?: number;
  dxPercent?: number;
  dyPercent?: number;

  relativeDistances?: number[];
  dxPercents?: number[];
  dyPercents?: number[];
  results?: Results;
}

interface InitialPose {
  calibreated: boolean;
  landmarks?: LandmarkList;
  shoulderWidth: number;
  noseX: number;
  noseY: number;
}

let initialPose: InitialPose = {
  calibreated: false,
  landmarks: undefined,
  shoulderWidth: 0,
  noseX: 0,
  noseY: 0,
};

const handleCalibrate = function (results: Results) {
  initialPose.landmarks = results.poseLandmarks;
  initialPose.shoulderWidth = Math.sqrt(
    Math.pow(results.poseLandmarks[11].x - results.poseLandmarks[12].x, 2) +
      Math.pow(results.poseLandmarks[11].y - results.poseLandmarks[12].y, 2)
  );
  initialPose.noseX = results.poseLandmarks[0].x;
  initialPose.noseY = results.poseLandmarks[0].y;
  addData("Calbration", results.poseLandmarks);
  initialPose.calibreated = true;
};

//to enable calibration in App.tsx
const calibrate = function () {
  initialPose.calibreated = false;
};

const initRelDistances = (relDistances: number[], rdLen: number) => {
  relDistances = [];
  for (let i = 0; i < rdLen - 1; i++) {
    relDistances.push(1);
  }
};

const Camera = (props: { onUpdateState: (result: PostureState) => void }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<any>(null);
  const connect = (window as any).drawConnectors;
  const drawLM = drawing.drawLandmarks;
  var camera = null;

  // let initialShoulderWidth = 0;
  // let initialNose = { x: 0, y: 0 };

  const relDistances: number[] = [];
  const rdlen = 30;
  initRelDistances(relDistances, rdlen);

  const dxPercents: number[] = [];
  for (let i = 0; i < rdlen - 1; i++) {
    dxPercents.push(1);
  }
  const dyPercents: number[] = [];
  for (let i = 0; i < rdlen - 1; i++) {
    dyPercents.push(1);
  }

  function onResults(results: Results) {
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current?.video?.videoWidth;
    const videoHeight = webcamRef.current?.video?.videoHeight;

    // Set canvas width
    if (canvasRef.current) {
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
    }

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    canvasCtx.globalCompositeOperation = 'source-over';
    connect(canvasCtx, results.poseLandmarks, mediapose.POSE_CONNECTIONS, {
      color: '#00FF00',
      lineWidth: 4,
    });
    drawLM(canvasCtx, results.poseLandmarks, {
      color: '#FF0000',
      lineWidth: 2,
    });
    // console.log(results);

    if (!initialPose.calibreated) {
      initRelDistances(relDistances, rdlen);
      handleCalibrate(results);
    }

    // Parse shoulders
    const leftShoulder =
      results.poseLandmarks?.length > 10
        ? results.poseLandmarks[11]
        : undefined;
    const rightShoulder =
      results.poseLandmarks?.length > 11
        ? results.poseLandmarks[12]
        : undefined;

    let result: PostureState = {
      results,
    };

    if (
      leftShoulder &&
      (leftShoulder.visibility ?? 0 > 0.5) &&
      rightShoulder &&
      (rightShoulder.visibility ?? 0 > 0.5)
    ) {
      const dist = Math.sqrt(
        Math.pow(leftShoulder.x - rightShoulder.x, 2) +
          Math.pow(leftShoulder.y - rightShoulder.y, 2)
      );

      const diffPercent = dist / initialPose.shoulderWidth;
      if (relDistances.length >= rdlen) {
        relDistances.shift();
      }
      relDistances.push(diffPercent);
      result.relativeDistances = relDistances;
      result.relativeDistance = diffPercent;
    }

    const nose =
      results.poseLandmarks?.length > 0 ? results.poseLandmarks[0] : undefined;
    if (nose && (nose.visibility ?? 0 > 0.5)) {
      const dxPercent =
        (initialPose.noseX - nose.x) / Math.abs(initialPose.noseX);
      const dyPercent =
        ((initialPose.noseY - nose.y) * -1) / Math.abs(initialPose.noseY);
      result.dxPercent = dxPercent;
      result.dyPercent = dyPercent;

      if (dxPercents.length >= rdlen) {
        dxPercents.shift();
      }
      if (dyPercents.length >= rdlen) {
        dyPercents.shift();
      }
      dxPercents.push(dxPercent);
      dyPercents.push(dyPercent);
      result.dxPercents = dxPercents;
      result.dyPercents = dyPercents;
    }

    if(curPostureClass !== lastPostureClass) {
      addData(curPostureClass, results.poseLandmarks);
    }

    props.onUpdateState(result);
    canvasCtx.restore();
  }
  // }

  // setInterval(())
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: true,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    if (webcamRef.current?.video) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current?.video) {
            await pose.send({ image: webcamRef.current.video });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  }, []);
  return (
    <Container style={{ opacity: SHOW_CAMERA ? 1 : 0 }}>
      <Webcam
        ref={webcamRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      />{' '}
      <canvas
        ref={canvasRef}
        className="output_canvas"
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      ></canvas>
    </Container>
  );
};

export { Camera, calibrate};

const Container = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  height: 160px;
  aspect-ratio: 4/3;
  border-radius: 24px;
  overflow: hidden;
`;
