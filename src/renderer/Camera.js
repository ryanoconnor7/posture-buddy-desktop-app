import { Pose } from '@mediapipe/pose';
import React, { useRef, useEffect } from 'react';
import * as mediapose from '@mediapipe/pose';
import * as drawing from '@mediapipe/drawing_utils';
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import styled from 'styled-components';

const Camera = (props) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  const drawLM = drawing.drawLandmarks;
  var camera = null;

  let initialShoulderWidth = 0;
  let initialNose = { x: 0, y: 0 };

  function onResults(results) {
    // const video = webcamRef.current.video;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // Set canvas width
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

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
    const leftShoulder = results.poseLandmarks[11];
    const rightShoulder = results.poseLandmarks[12];

    let result = {};

    if (leftShoulder?.visibility > 0.5 && rightShoulder?.visibility > 0.5) {
      const dist = Math.sqrt(
        Math.pow(leftShoulder.x - rightShoulder.x, 2) +
          Math.pow(leftShoulder.y - rightShoulder.y, 2)
      );
      if (!initialShoulderWidth) {
        initialShoulderWidth = dist;
      }

      const diffPercent = dist / initialShoulderWidth;
      result.relativeDistance = diffPercent;
    }

    const nose = results.poseLandmarks[0];
    if (nose?.visibility > 0.5) {
      if (!initialNose.x) {
        initialNose.x = nose.x;
        initialNose.y = nose.y;
      }

      const dxPercent = (initialNose.x - nose.x) / Math.abs(initialNose.x);
      const dyPercent =
        ((initialNose.y - nose.y) * -1) / Math.abs(initialNose.y);
      result.dxPercent = dxPercent;
      result.dyPercent = dyPercent;
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

    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null
    ) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          await pose.send({ image: webcamRef.current.video });
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
          zindex: 9,
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
          zindex: 9,
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
