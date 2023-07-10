import React, { useRef, useState, useEffect } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import * as Facemesh from "@mediapipe/face_mesh";
import { drawConnectors } from "@mediapipe/drawing_utils";

export const MediapipeFace = (prop) => {
  const [imageFile, setImageFile] = useState(null);
  const [faceLandmarks, setLandmarks] = useState();
  const imageRef = useRef(null);
  const canvasRef = useRef(null);

  const onImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  const onResults = async (results) => {
    const imageElement = imageRef.current;
    const canvasElement = canvasRef.current;

    // Check if the image and canvas elements are loaded
    if (imageElement && canvasElement) {
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();

      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      // canvasCtx.drawImage(imageElement, 0, 0);

      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          
          setLandmarks(landmarks)
          prop.setLandmarks(landmarks)
          // drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
          //   color: "#C0C0C070",
          //   lineWidth: 0.5,
          // });
          
          // drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
          //   color: "#C0C0C070",
          // });
          // drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_IRIS, {
          //   color: "#C0C0C070",
          // });
          // drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
          //   color: "#C0C0C070",
          // });
          // drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_IRIS, {
          //   color: "#30FF30",
          // });
          // drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
          //   color: "#C0C0C070",
          // });
          // drawConnectors(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
          //   color: "#C0C0C070",
          // });
        }
      }
    }
  };

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMesh.setOptions({
      maxNumFaces: 3,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults(onResults);

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageElement = imageRef.current;
        imageElement.onload = () => {
          faceMesh.send({ image: imageElement });
        };
        imageElement.src = event.target.result;
      };
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  return (
    <>
      <input hidden type="file" accept="image/*" onChange={onImageUpload} />
      {imageFile && (
        <img
          ref={imageRef}
          src=""
          alt="Uploaded Image"
          style={{
            display: "none",
          }}
        />
      )}
      {imageFile && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
          }}
        />
      )}
    </>
  );
};
