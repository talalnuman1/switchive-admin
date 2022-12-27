import MDInput from "components/MDInput";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import React, { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import { cards } from "api";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Upload, Select, Modal, Row, Col, Input, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./giftCard.css";
import { Storage } from "../../firebase";
import { uploadBytes, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import avatar from "assets/theme/components/avatar";

const options = [
  {
    value: "USD",
    label: "USD",
  },
  {
    value: "GBP",
    label: "GBP",
  },
  {
    value: "EURO",
    label: "EUR",
  },
];

export default function GiftCard() {
  const [name, setName] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [getID, setgetID] = useState("");
  const [url, setUrl] = useState(null);
  const [modal2, setmodal2] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setdata] = useState([]);
  const [refresh, setrefresh] = useState(false);

  const date = new Date();
  const showTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  const handlePdfChange = (e) => {
    let values = e.target.files[0];
    if (e.target.files[0]) {
    }
    const avatarDocument = ref(Storage, `images/${avatar.name + showTime}`);
    const uploadTask = uploadBytesResumable(avatarDocument, values);
    uploadBytes(avatarDocument, values)
      .then(() => {
        getDownloadURL(avatarDocument)
          .then((Url) => {
            setUrl(Url);
            console.log(Url);
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

  const handleSubmit = () => {};

  const handleChange = (value) => {
    setCurrency(value);
    console.log(value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const showModal2 = (item) => {
    setgetID(item.id);
    setName(item.name);
    setCurrency(item.currency);
    setMinAmount(item.minAmount);
    setMaxAmount(item.maxAmount);
    setmodal2(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancel2 = () => {
    setmodal2(false);
  };

  const confirm = (id) => {
    cards(`/${id}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
      },
    })
      .then(function () {
        setrefresh(!refresh);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onUpdate = (id) => {
    cards(`/${id}`, {
      method: "patch",
      data: {
        name,
        currency,
        maxAmount: Number(maxAmount),
        minAmount: Number(minAmount),
        avatar: url,
      },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
      },
    })
      .then(function (res) {
        console.log(res.data);
        getCards();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onsubmit = (values) => {
    handleSubmit();
    cards({
      method: "post",
      data: {
        name,
        currency,
        maxAmount: Number(maxAmount),
        minAmount: Number(minAmount),
        avatar: url,
      },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
      },
    })
      .then(function (res) {
        console.log(res.data);
        getCards();

      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getCards = () => {
    cards({
      method: "get",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
      },
    })
      .then(function (res) {
        setdata(res.data.results);
        console.log(data);
      })
      .catch(() => {
        message.destroy("an error occured ");
      });
  };
  useEffect(() => {
    getCards();
  }, [refresh]);

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <MDButton className="btn" onClick={showModal}>
          Create Gift Card
        </MDButton>
        <Modal footer={[]} open={isModalOpen} onCancel={handleCancel}>
          <div>
            <MDBox pt={3} px={3}>
              <MDBox display="flex" flexWrap="wrap" p={2}>
                <MDInput
                  label="Name"
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                  }}
                />
              </MDBox>

              <MDBox display="flex" flexWrap="wrap" p={2}>
                <MDInput
                  label="Min Amount"
                  onChange={(e) => setMinAmount(e.target.value)}
                  style={{
                    width: "47%",
                    marginRight: "20px",
                  }}
                />
                <MDInput
                  label="Max Amount"
                  onChange={(e) => setMaxAmount(e.target.value)}
                  style={{
                    width: "47%",
                  }}
                />
              </MDBox>
              <MDBox display="flex" flexWrap="wrap" p={2}>
                <Select
                  className="select"
                  showSearch
                  placeholder="Select a Currency"
                  optionFilterProp="Currency"
                  onChange={handleChange}
                  options={options}
                ></Select>
              </MDBox>
              <MDBox display="flex" flexWrap="wrap" p={2}>
                <h5>Avatar : </h5>
                <Input type="file" onChange={handlePdfChange} />
              </MDBox>
              <MDBox p={2} mt="auto">
                <MDButton variant="contained" color="info" fullWidth onClick={onsubmit}>
                  Create
                </MDButton>
              </MDBox>
            </MDBox>
          </div>
        </Modal>
        <Row className="overflow" gutter={10}>
          {data.map((a) => (
            <Col lg={6} md={12} xs={24} style={{ marginBottom: "1rem" }}>
              <Card>
                <CardMedia sx={{ height: 140 }} image={a.avatar} />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {a.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    max price : {a.maxAmount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    min price : {a.minAmount}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => confirm(a.id)}>
                    delete
                  </Button>
                  <Button size="small" onClick={() => showModal2(a)}>
                    update
                  </Button>
                </CardActions>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal footer={[]} open={modal2} onCancel={handleCancel2}>
          <div>
            <MDBox pt={3} px={3}>
              <MDBox display="flex" flexWrap="wrap" p={2}>
                <MDInput
                value={name}
                  label="Name"
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                  }}
                />
              </MDBox>

              <MDBox display="flex" flexWrap="wrap" p={2}>
                <MDInput
                                value={minAmount}

                  label="Min Amount"
                  onChange={(e) => setMinAmount(e.target.value)}
                  style={{
                    width: "47%",
                    marginRight: "20px",
                  }}
                />
                <MDInput
                                value={maxAmount}

                  label="Max Amount"
                  onChange={(e) => setMaxAmount(e.target.value)}
                  style={{
                    width: "47%",
                  }}
                />
              </MDBox>
              <MDBox display="flex" flexWrap="wrap" p={2}>
                <Select
                                value={currency}

                  className="select"
                  showSearch
                  placeholder="Select a Currency"
                  optionFilterProp="Currency"
                  onChange={handleChange}
                  options={options}
                ></Select>
              </MDBox>
              <MDBox display="flex" flexWrap="wrap" p={2}>
                <h5>Avatar : </h5>
                <Input type="file" onChange={handlePdfChange} />
              </MDBox>
              <MDBox p={2} mt="auto">
                <MDButton
                  variant="contained"
                  color="info"
                  fullWidth
                  onClick={() => onUpdate(getID)}
                >
                  update
                </MDButton>
              </MDBox>
            </MDBox>
          </div>
        </Modal>
        <Footer />
      </DashboardLayout>
    </>
  );
}
