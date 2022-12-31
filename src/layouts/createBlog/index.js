import React, { useState } from "react";
import Typography from "@mui/material/Typography";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

import { Storage } from "../../firebase";
import { uploadBytes, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import "./createBlog.css";

const date = new Date();
const showTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const account = (editor) => {
    const wordCount = draftToHtml(convertToRaw(editorState.getCurrentContent())).split(" ").length;
    console.log(wordCount);
    setWordCount(
      draftToHtml(convertToRaw(editorState.getCurrentContent())).match(/(\w+)/g).length - 2
    );
  };
  //   const uploadImage = async () => {
  //     console.log("fghj");
  //     const formData = new FormData();
  //     formData.append("file", imageSelected);
  //     formData.append("upload_preset", "axupvbze");

  //     await axios
  //       .post(`https://`, formData)
  //       .then((response) => {
  //         console.log(response, "img");
  //       });
  //   };
  const [description, setDescription] = useState(EditorState.createEmpty());
  const onEditorStateChange = (editorstate) => {
    setDescription(editorstate);
    console.log(draftToHtml(convertToRaw(description.getCurrentContent())));
    // account();
  };
  const toTextFile = () => {
    const element = document.createElement("a");
    const file = new Blob([draftToHtml(convertToRaw(description.getCurrentContent()))], {
      type: "text/plain",
    });
    console.log(file);
    sentToFirebase(file);
  };

  const sentToFirebase = (e) => {
    let values = e;

    // if (e.target.files[0]) {
    // }
    const avatarDocument = ref(Storage, `blogs/${title + showTime}`);
    const uploadTask = uploadBytesResumable(avatarDocument, values);
    uploadBytes(avatarDocument, values)
      .then(() => {
        getDownloadURL(avatarDocument)
          .then((Url) => {
            setUrl(Url);
            console.log(Url);
            setDescription("");
            setTitle("");
          })
          .catch((error) => {
            console.log(error.message, "error getting the avatar url");
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
    uploadTask.on("state_changed", (snapshot) => {
      const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    });
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Typography gutterBottom variant="h4" component="div">
          Create a Blog
        </Typography>
        {/* <MDBox pt={3} px={3}> */}
        <MDBox p={2}>
          <Typography gutterBottom variant="h5" component="div">
            Blog Title
          </Typography>
          <MDInput
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "80%",
            }}
          />
        </MDBox>
        {/* </MDBox> */}
        <MDBox p={2}>
          <Typography gutterBottom variant="h5" component="div">
            Blog Description
          </Typography>
          <Editor
            editorState={description}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
          />
        </MDBox>

        <MDBox p={2} mr={5} display={"flex"} style={{ justifyContent: "flex-end" }}>
          <MDButton variant="contained" color="info" onClick={() => toTextFile()}>
            Create
          </MDButton>
        </MDBox>
      </DashboardLayout>
    </>
  );
}
