import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export const ImageCapture = (props) => {
  const setLoading = props.setLoading
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [webcamStatus, setWebcamStatus] = useState(false);
  const [uploadImage, setUploadedImage] = useState(null);
  const [id, setId] = useState(undefined);
  const [matchedName, setMatchedName] = useState(null);
  const [latent_representation, setLatentRepresentation] = useState(undefined);

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startWebcam = async () => {
    setMatchedName(null)
    setCapturedImage(null);
    setUploadedImage(null)
    if (videoRef.current && videoRef.current.srcObject) {
      setWebcamStatus(false);
      stopWebcam();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setWebcamStatus(true);
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    }
  };

  // const captureImage = async() => {
    
  //   setMatchedName(null)
  //   if (videoRef.current && canvasRef.current) {
  //     const context = canvasRef.current.getContext("2d");
  //     context.drawImage(
  //       videoRef.current,
  //       0,
  //       0,
  //       canvasRef.current.width,
  //       canvasRef.current.height
  //     );
  //     // Stop the webcam
  //     setWebcamStatus(false);
  //     stopWebcam();
  //     const imageData = canvasRef.current.toDataURL("image/jpeg");
  //     console.log("image=",typeof(imageData))
  //     setCapturedImage(imageData);
  //     // Convert the data URL to a binary file
  //     const response = await fetch(imageData);
  //     // console.log("image",typeof(response.url))
  //     const blob = await response.blob();
  //     create_user_upload_image(blob);
  //     const stream = videoRef.current.srcObject;
  //     const tracks = stream.getTracks();
  //     tracks.forEach((track) => track.stop());
  //     videoRef.current.srcObject = null;
  //   }
  //   // Stop the webcam
  //   stopWebcam();
  // };
  const captureImage = async () => {
    setMatchedName(null);
  
    if (videoRef.current && canvasRef.current) {
      // Set the canvas dimensions to match the video dimensions
      const videoElement = videoRef.current;
      canvasRef.current.width = videoElement.videoWidth;
      canvasRef.current.height = videoElement.videoHeight;
  
      const context = canvasRef.current.getContext("2d");
      context.drawImage(
        videoElement,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
  
      // Stop the webcam
      setWebcamStatus(false);
      stopWebcam();
  
      // Convert the canvas image to data URL
      const imageData = canvasRef.current.toDataURL("image/jpeg");
      setCapturedImage(imageData);
  
      // Convert the data URL to a binary file
      const response = await fetch(imageData);
      const blob = await response.blob();
      create_user_upload_image(blob);
  
      const stream = videoElement.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoElement.srcObject = null;
    }
  };
  

  const handleFileUpload = (event) => {
    setUploadedImage(null)
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setMatchedName(null)
        setLoading(true)
        create_user_upload_image(event.target.files[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  let create_user_upload_image = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", "unknown");
    if (id !== undefined) formData.append("id", id);
    try {
      let response = await axios.post("http://125.23.58.83:443/uploadSimilarity", formData);
      console.log(response);
      if (response.data.status === true) {
        setId(response.data.id);
        get_latent_representation(response.data.id)
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  let get_latent_representation = async (ID) => {
    const formData = new FormData();
    let image_link = `http://125.23.58.83:443/api/similarity/` + ID;
    formData.append("image_link", image_link);
    console.log("formData 4", formData);
    try {
      let response = await axios.post(
        "http://127.0.0.1:8000/api/latent_api/",
        formData
      );
      if (response.data.status === true) {
        setLatentRepresentation(response.data.latent);
        get_similarities(response.data.latent)
        // console.log("latent representation = ", response.data.latent);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  let get_similarities = async (test_latent) => {
    const formData = {"test_latent": test_latent}
    console.log("formData =", formData )
    try {
      let response = await axios.post(
        "http://125.23.58.83:443/get_similarities",
        formData
      );
      console.log(response)
      if (response.status === 200) {
        console.log("call api", response.data)
        get_matched_person_name(response.data[0].id, (response.data[0].EuclideanDistance+100).toFixed(2) >= 100?100:(response.data[0].EuclideanDistance+100).toFixed(2))
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  let get_matched_person_name = async (matched_id, percentage) => {
    try {
      let response = await axios.get(
        "http://125.23.58.83:443/api/person_name/"+matched_id
      );
      console.log(response)
      setMatchedName(response.data+ " with "+percentage+" %")
      setLoading(false)
      // if (response.status === 200) {
      //   console.log("call api", response.data)
      //   // setLatentRepresentation(response.data.latent);
      //   // console.log("latent representation = ", response.data.latent);
      // }
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "end",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "530px",
          height: "398px",
          border: "1px black solid",
        }}
      >
        {uploadImage ? (
          <img
            src={uploadImage}
            style={{ display: "flex", width: "530px", height: "398px" }}
            alt="Uploaded"
          />
        ) : capturedImage ? (
          <img
            src={capturedImage}
            style={{ display: "flex", width: "530px", height: "398px" }}
            alt="Captured"
          />
        ) : (
          <video ref={videoRef} width="530" height="398"></video>
        )}
      </div>
      {matchedName?<p style={{display:"flex",width:"530px",border:"1px black solid"}}>Image matched with: {matchedName}</p>:null}
      <div
        style={{
          display: "flex",
          width: "530px",
          padding:"5px",
          justifyContent: "space-between",
        }}
      >
        <Button variant="contained" component="label" style={{width:"30%"}}>
          Upload Image
          <input
            type="file"
            accept=".jpg,.png"
            style={{ display: "none", }}
            onChange={handleFileUpload}
          />
        </Button>
        <Button
          color={webcamStatus ? "warning" : "success"}
          variant={"contained"}
          onClick={startWebcam}
          style={{width:"30%"}}
        >
          {webcamStatus ? "Stop Webcam" : "Start Webcam"}
        </Button>
        <Button
          disabled={webcamStatus ? false : true}
          variant={"contained"}
          onClick={captureImage}
          style={{width:"30%"}}
        >
          Capture Image
        </Button>
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
};