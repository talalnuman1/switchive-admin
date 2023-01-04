import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import {v4} from "uuid";

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
import { async } from "@firebase/util";
import { blogs } from "../../api";
import { useNavigate } from "react-router-dom";

const date = new Date();
const showTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

export default function CreateBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
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

    setBlogUrl(draftToHtml(convertToRaw(description.getCurrentContent())));
    // account();
  };
  const toTextFile = () => {
    const file = new Blob([draftToHtml(convertToRaw(description.getCurrentContent()))], {
      type: "text/plain",
    });
    sentToFirebase(file);
  };

  const sentToFirebase = (e) => {
    let values = e;

    const blogDoc = ref(Storage, `blogs/${v4()}`);
    const uploadTask = uploadBytesResumable(blogDoc, values);
    uploadBytes(blogDoc, values)
      .then(() => {
        getDownloadURL(blogDoc)
          .then((blog) => {
            setBlogUrl(blog);
            handleSubmit(blog);
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
  const handlePdfChange = (e) => {
    setSelectedImage(e.target.files[0]);
    let value = e.target.files[0];
    sendImage(value);
  };
  const sendImage = (value) => {
    setImageLoading(true);
    const ImageDocument = ref(Storage, `images/${title + showTime}`);
    const uploadTask = uploadBytesResumable(ImageDocument, value);
    uploadBytes(ImageDocument, value)
      .then(() => {
        getDownloadURL(ImageDocument)
          .then((image) => {
            setImageUrl(image);
            console.log(image);
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch((error) => {
        console.log(error, "Error Outside Catch");
      })
      .finally(() => {
        setImageLoading(false);
      });
    uploadTask.on("state_changed", (snapshot) => {
      const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      setUploadPercentage(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      console.log(percent);
    });
  };
  const handleSubmit = (blog) => {
    blogs({
      method: "post",
      data: {
        title: title,
        blogUrl: blog,
        imageUrl: imageUrl,
      },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
      },
    })
      .then((res) => {
        console.log(res.data.id);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setTitle("");
        setDescription("");
        setBlogUrl("");
        setImageUrl("");
        navigate("/blog");
      });

    // toTextFile();
    // sendImage();
    console.log("first");
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
            required={true}
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
        <MDBox p={2}>
          <Typography gutterBottom variant="h5" component="div">
            Image:
          </Typography>
          <MDInput type="file" onChange={handlePdfChange} />
        </MDBox>
        <MDBox p={2} mr={5} display={"flex"} style={{ justifyContent: "flex-end" }}>
          {imageLoading ? (
            <MDButton variant="contained" color="info">
              Loading...
            </MDButton>
          ) : (
            title !== "" &&
            imageUrl !== "" &&
            blogUrl !== "" && (
              <MDButton variant="contained" color="info" onClick={toTextFile}>
                Create
              </MDButton>
            )
          )}
        </MDBox>
      </DashboardLayout>
    </>
  );
}
