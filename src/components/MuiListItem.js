import {
  Download,
  Email,
  ExpandLess,
  ExpandMore,
  FileDownload,
  Mail,
  PermIdentityTwoTone,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
// import React, { lazy, Suspense } from 'react';
import { useState, useEffect } from "react";
import { MuiImageList } from "./MuiImageList";
import { MediapipeFace } from "./MediapipeFace";
import axios from "axios";
import MatrixDownload from "./CSVdownload";
import { lazy, Suspense } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import CircularProgress from '@mui/material/CircularProgress';
export const MuiListItem = (props) => {
  const setLoading = props.setLoading
  const [image, setImage] = useState(props.photo);
  const [load, setLoad] = useState(false);
  const [updateId, setUpdateId] = useState(false);
  const [imageVersion, setImageVersion] = useState(1);
  const [latent_representation, setLatentRepresentation] = useState();
  const [weighted_adjacency_matrix, setWeighted_adjacency_matrix] = useState();
  const [feature_matrix, setFeature_matrix] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [id, setId] = useState(props.photo);
  const [open, setOpen] = useState(false);
  const [imageListStatus, setImageListStatus] = useState(false);
  
  // console.log("props", props);
  const handleClick = () => {
    setOpen(!open);
  };
  const setImageList = () => {
    setImageListStatus(!imageListStatus);
  };
  const personName = props.name;
  let download_matrix = async (value) => {
    const formData = {"person_id": id, "value":value};
    try {
      let response = await axios.post("http://127.0.0.1:5000/download_matrix", formData, {
        responseType: 'blob'
      });
      // Check if the response is successful
      
      if (response.status === 200) {
        console.log(response)
        // Extract the filename from the Content-Disposition header
        // const filename = response.headers['content-disposition'].split('filename=')[1];

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
        link.download = ""+personName+value;

        // Programmatically trigger the download
        link.click();

        // Clean up the temporary link
        window.URL.revokeObjectURL(link.href);
        link.remove();
      }
    } catch (error) {
      console.log("error:", error);
    }
  }
  let create_user_upload_image = async () => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", personName);
    if (id !== undefined) formData.append("id", id);
    try {
      let response = await axios.post("http://127.0.0.1:5000/upload", formData);
      console.log(response);
      if (response.data.status === true) {
        setId(response.data.id);
        setImageVersion(imageVersion + 1);
        setUpdateId(!updateId);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  let get_latent_representation = async () => {
    const formData = new FormData();
    let image_link = `http://127.0.0.1:5000/api/person/` + id;
    formData.append("image_link", image_link);
    // console.log("formData 4", formData);
    try {
      let response = await axios.post(
        "http://127.0.0.1:8000/api/latent_api/",
        formData
      );
      // console.log(response);
      if (response.data.status === true) {
        setLatentRepresentation(response.data.latent);
        setWeighted_adjacency_matrix(response.data.adj);
        setFeature_matrix(response.data.features);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  let upload_matrices = async () => {
    let latent_data = {
      person_id: id,
      // weighted_adjacency_matrix: weighted_adjacency_matrix,
      // feature_matrix: feature_matrix,
      latent_representation: latent_representation,
    };
    console.log("form data 3", latent_data);
    try {
      let response = await axios.post(
        "http://127.0.0.1:5000/api/upload_latent_matrix",
        latent_data
      );
      console.log("matrix upload response", response);
    } catch (error) {
      console.log("error:", error);
    }
    // upload ajd matrix
    let adj_data = {
      person_id: id,
      weighted_adjacency_matrix: weighted_adjacency_matrix,
      // feature_matrix: feature_matrix,
      // latent_representation: latent_representation,
    };
    // console.log("form data 3", adj_data);
    try {
      let response = await axios.post(
        "http://127.0.0.1:5000/api/upload_adj_matrix",
        adj_data
      );
      console.log("matrix upload response", response);
    } catch (error) {
      console.log("error:", error);
    }
    // upload feature matrix
    let feature_data = {
      person_id: id,
      // weighted_adjacency_matrix: weighted_adjacency_matrix,
      feature_matrix: feature_matrix,
      // latent_representation: latent_representation,
    };
    // console.log("form data 3", feature_data);
    try {
      let response = await axios.post(
        "http://127.0.0.1:5000/api/upload_feature_matrix",
        feature_data
      );
      setLoading(false)
      console.log("matrix upload response", response);
    } catch (error) {
      console.log("error:", error);
    }
  };
  useEffect(() => {
    // console.log(image)

    if (image !== undefined && load) {
      setLoading(true)
      create_user_upload_image();
    }
  }, [image]);

  useEffect(() => {
    // console.log(image)

    if (id !== undefined && load) {
      get_latent_representation();
    }
  }, [updateId]);

  useEffect(() => {
    if (
      id !== undefined &&
      latent_representation !== undefined &&
      weighted_adjacency_matrix !== undefined &&
      feature_matrix !== undefined &&
      showAlert &&
      load
    ) {
      upload_matrices();
      
      // alert("person added successfully");
      setOpen(!open);
    }
  }, [latent_representation]);

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <ListItemAvatar>
            <Avatar>
              {/* <PermIdentityTwoTone /> */}
              <img
                style={{ width: "60px", height: "60px" }}
                src={
                  `http://127.0.0.1:5000/api/person/` +
                  id +
                  `?version=` +
                  imageVersion
                }
                alt="person image"
              />
            </Avatar>
          </ListItemAvatar>
        </ListItemIcon>
        <ListItemText primary={personName} />
        {open ? <ExpandLess /> : <ExpandMore />}
        {/* 100% */}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
            <ListItemButton
              sx={{
                pl: 4,
                justifyContent: "space-between",
              }}
            >
              <IconButton color="primary" aria-label="Email" onClick={()=>download_matrix("latent_representation")}>
                <FileDownload />
                <Typography variant="body1">Latent Representation</Typography>
              </IconButton>
              <IconButton color="primary" aria-label="Email" onClick={()=>download_matrix("feature_matrix")}>
                <FileDownload />
                <Typography variant="body1">Feature Matrix</Typography>
              </IconButton>
              <IconButton color="primary" aria-label="Email" onClick={()=>download_matrix("weighted_adjacency_matrix")}>
                <FileDownload />
                <Typography variant="body1">Adjacency Matrix</Typography>
              </IconButton>
            </ListItemButton>
          <ListItemButton
            // disabled
            sx={{ pl: 4, justifyContent: "center" }}
            onClick={() => {
              setImageList();
            }}
          >
            View Uploaded Images
          </ListItemButton>
          {imageListStatus ? (
            <img
              style={{ width: "300px", height: "300px" }}
              src={
                `http://127.0.0.1:5000/api/person/` +
                id +
                `?version=` +
                imageVersion
              }
              alt="person image"
            />
          ) : (
            <></>
          )}
          <ListItemButton sx={{ pl: 4, justifyContent: "center" }}>
            <Button variant="contained" component="label">
              Upload New Image
              {/* <MediapipeFace setLandmarks={setLandmarks}/> */}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  setLoad(true);
                  setShowAlert(true);
                }}
              />
            </Button>
          </ListItemButton>
        </List>
      </Collapse>
      <Divider />
    </>
  );
};
