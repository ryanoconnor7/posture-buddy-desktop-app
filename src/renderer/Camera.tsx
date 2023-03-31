import { Pose, Results } from '@mediapipe/pose';
import React, { useRef, useEffect } from 'react';
import * as mediapose from '@mediapipe/pose';
import * as drawing from '@mediapipe/drawing_utils';
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import styled from 'styled-components';

interface PostureState {
  relativeDistance?: number;
  dxPercent?: number;
  dyPercent?: number;

  relativeDistances?: number[]
  dxPercents?: number[]
  dyPercents?: number[]
}

const Camera = (props: { onUpdateState: (result: PostureState) => void }) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<any>(null);
  const connect = (window as any).drawConnectors;
  const drawLM = drawing.drawLandmarks;
  var camera = null;

  let initialShoulderWidth = 0;
  let initialNose = { x: 0, y: 0 };

  const relDistances : number[] = [];
  const rdlen = 30;
  for(let i = 0; i < rdlen - 1; i++){
    relDistances.push(1);
  }
  const dxPercents : number[]  = [];
  for(let i = 0; i < rdlen - 1; i++){
    dxPercents.push(1);
  }
  const dyPercents : number[]  = [];
  for(let i = 0; i < rdlen - 1; i++){
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

    // Parse shoulders
    const leftShoulder =
      results.poseLandmarks?.length > 10
        ? results.poseLandmarks[11]
        : undefined;
    const rightShoulder =
      results.poseLandmarks?.length > 11
        ? results.poseLandmarks[12]
        : undefined;

    let result: PostureState = {};

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
      if (!initialShoulderWidth) {
        initialShoulderWidth = dist;
      }

      const diffPercent = dist / initialShoulderWidth;
      if (relDistances.length >= rdlen){
        relDistances.shift();
      }
      relDistances.push(diffPercent);
      result.relativeDistances = relDistances;
      result.relativeDistance = diffPercent;
    }

    const nose =
      results.poseLandmarks?.length > 0 ? results.poseLandmarks[0] : undefined;
    if (nose && (nose.visibility ?? 0 > 0.5)) {
      if (!initialNose.x) {
        initialNose.x = nose.x;
        initialNose.y = nose.y;
      }

      const dxPercent = (initialNose.x - nose.x) / Math.abs(initialNose.x);
      const dyPercent =
        ((initialNose.y - nose.y) * -1) / Math.abs(initialNose.y);
      result.dxPercent = dxPercent;
      result.dyPercent = dyPercent;

      if (dxPercents.length >= rdlen){
        dxPercents.shift();
      }
      if (dyPercents.length >= rdlen){
        dyPercents.shift();
      }
      dxPercents.push(dxPercent);
      dyPercents.push(dyPercent);
      result.dxPercents = dxPercents;
      result.dyPercents = dyPercents;
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
    <Container>
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

export default Camera;

const Container = styled.div`
  position: absolute;
  /* right: 16; */
  /* top: 16; */
  /* width: 0px;
  height: 0px; */
`;
