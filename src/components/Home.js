import { AddCircle } from "@mui/icons-material";
import { Box, IconButton, TextField, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { MuiList } from "./MuiList";
import { NavBar } from "./Navbar";
import axios from "axios";
import { ImageCapture } from "./ImageCapture";
import CircularProgress from '@mui/material/CircularProgress';
export const Home = () => {
  const [loading, setLoading] = useState(true);
  let [persons, setPersons] = useState([]);
  let [photos, setPhotos] = useState([]);
  let [newPerson, setNewPerson] = useState({ name: "", photo: "" });
  let [personData, setPersonData] = useState([]);
  let addPerson = () => {
    setPersons([...persons, newPerson]);
    setNewPerson({ name: "", photo: "" });
  };
  let getPersons = async () => {
    try {
      let response = await axios.get("http://125.23.58.83:443/get_all_persons");
      let personData = [];
      if (response.data.status === true)
        response.data.data.map((value) => {
          personData.push({
            name: value.name,
            photo: value._id,
          });
        });
      setPersons([...persons, ...personData]);
      setLoading(false);
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    getPersons();
  }, []);
  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <Modal open={loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Modal>
      )}
      {/* Disable all components */}
    <div style={{ pointerEvents: loading ? 'none' : 'auto' }}>
      {/* <CircularProgress variant="determinate" value={progress} /> */}
      <NavBar />
      <div style={{ display: "flex", marginTop:"70px", position:"relative"}}>
        <div>
          <MuiList persons={persons} setLoading={setLoading}/>
          <Box
            sx={{
              display: "flex",
              width: "50vw",
              justifyContent: "space-between",
              //   padding:"4"
            }}
            pl={4}
            pr={4}
          >
            <TextField
              placeholder="Add a New Person"
              fullWidth
              value={newPerson.name}
              onChange={(event) => {
                setNewPerson({ name: event.target.value, photo: undefined });
              }}
            />
            <IconButton
              sx={{
                width: "50px",
                height: "50px",
                display: "flex",
                paddingLeft: "40px",
              }}
              onClick={() => {
                addPerson();
              }}
            >
              <AddCircle
                color="primary"
                sx={{
                  width: "50px",
                  height: "50px",
                  display: "flex",
                }}
              />
            </IconButton>
          </Box>
        </div>
        <Box
          sx={{
            display: "flex",
            position:"fixed",
            width: "50vw",
            justifyContent: "space-between",
            // border: "1px black solid",
            left:"700px",
            //   padding:"4"
          }}
          pl={4}
          pr={4}
        >
          <ImageCapture setLoading={setLoading}/>
        </Box>
      </div>
    </div>
    </div>
  );
};
