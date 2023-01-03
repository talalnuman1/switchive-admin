import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";

import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import { Storage } from "../../firebase";
import { uploadBytes, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// import "./createBlog.css";
import { async } from "@firebase/util";
import { blogs } from "../../api";
import { useLocation, useNavigate } from "react-router-dom";

const date = new Date();
const showTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

export default function updateBlog() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { blogId, blogTitle, blogBody, image } = state;
  const [title, setTitle] = useState(blogTitle ? blogTitle : "");
  const [imageUrl, setImageUrl] = useState(image ? image : "");
  const [blogUrl, setBlogUrl] = useState(blogBody ? blogBody : "");
  const [selectedImage, setSelectedImage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const getFirebaseData = (url) => {
    console.log(url, "url ");
    fetch(url).then((response) => {
      response.text().then((text) => {
        console.log(text);
        convertHtmlToDraft(text);
      });
    });
  };

  console.log(blogTitle, blogBody, image);
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
    console.log(editorstate);
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

    const blogDoc = ref(Storage, `blogs/${title + showTime}`);
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
    blogs(`/${blogId}`, {
      method: "patch",
      data: {
        title: title,
        blogUrl: blog,
        imageUrl: imageUrl,
      },
      headers: { Authorization: `Bearer ${sessionStorage.getItem("token-access")}` },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
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
  const convertHtmlToDraft = (content) => {
    const blocksFromHtml = htmlToDraft(content);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    setDescription(EditorState.createWithContent(contentState));
  };
  useEffect(() => {
    blogBody && getFirebaseData(blogBody);
  }, []);

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
          <MDButton variant="contained" color="info" onClick={!imageLoading && toTextFile}>
            {imageLoading
              ? "Loading..."
              : title !== "" && imageUrl !== "" && blogUrl !== "" && "Update"}
          </MDButton>
        </MDBox>
      </DashboardLayout>
    </>
  );
}
