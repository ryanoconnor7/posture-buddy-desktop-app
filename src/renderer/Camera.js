import { Pose } from '@mediapipe/pose';
import React, { useRef, useEffect } from 'react';
import * as mediapose from '@mediapipe/pose';
import * as drawing from '@mediapipe/drawing_utils';
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import styled from 'styled-components';

const Camera = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const connect = window.drawConnectors;
  const drawLM = drawing.drawLandmarks;
  var camera = null;

  let shouldWidthInitial = 0;

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
    console.log(results);

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
  /* position: absolute; */
  /* right: 16; */
  /* top: 16; */
  width: 100px;
  height: 100px;
`;
