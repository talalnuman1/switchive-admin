import MDInput from "components/MDInput";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import React, { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import { cards } from "api";
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Upload, Select,Modal, Row,Col, Empty } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "./giftCard.css"

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
  const [fileList, setFileList] = useState([]);
  const [FileSend, setFileSend] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setdata] = useState([]);
  const [refresh, setrefresh] = useState(false);


  const handleChange = (value) => {
    console.log(`selected ${value}`)
    setCurrency(`selected ${value}`)
    
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const propsUpload = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);

      return setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    onChange: (info) => {
      const listFiles = info.fileList.slice(-3);

      const newArrayFiles = listFiles.map((file) =>
        file.originFileObj ? file.originFileObj : file
      );

      const anAsyncFunction = async (item) => {
        return convertBase64(item);
      };

      const getData = async () => {
        return Promise.all(newArrayFiles.map((item) => anAsyncFunction(item)));
      };
      getData().then((data) => {
        setFileSend(data);
        console.log(data);
      });
    },
    multiple: true,
    fileList: fileList,
  };
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader?.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
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

  const onsubmit = (values) => {
    cards({
      method: "post",
      data: {
        name,
        currency,
        maxAmount: Number(maxAmount),
        minAmount: Number(minAmount),
        avatar: FileSend,
      },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
      },
    })
      .then(function (res) {
        console.log(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    cards({
      method: "get",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
      },
    })
      .then(function (res) {
        setdata(res.data.results);
        console.log(data)
      })
      .catch(() => {
        message.destroy("an error occured ");
      });
  }, [refresh]);

  return (
    <>
     <DashboardLayout>
      <DashboardNavbar />
    <MDButton className="btn" onClick={showModal}>
        Create Gift Card
      </MDButton>
      <Modal   footer={[]}
            open={isModalOpen}
            onCancel={handleCancel}>
    <div><MDBox pt={3} px={3}>
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
          <h5>Select Currency : </h5>
          <Select
           onChange={handleChange}
            defaultValue="USD"
            style={{
              width: "100%",
              height: "10%",
            }}
           
            options={options}
          />
        </MDBox>
        <MDBox display="flex" flexWrap="wrap" p={2}>
          <MDBox display="flex" flexWrap="wrap" pr={2}>
            <h5>Avatar : </h5>
          </MDBox>

          <Upload {...propsUpload} >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </MDBox>

        <MDBox p={2} mt="auto">
          <MDButton variant="contained" color="info" fullWidth onClick={onsubmit}>
            Create
          </MDButton>
        </MDBox>
      </MDBox></div>
      </Modal>
      <Row className="overflow" gutter={10}>
      {data.map((a) => ( 
      <Col lg={6} md={12} style={{marginBottom:"1rem"}} >
    <Card >
      <CardMedia
        sx={{ height: 140 }}
        image={a.avatar}
      />
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
        <Button size="small" onClick={() => confirm(a.id) }>delete</Button>
        <Button size="small">update</Button>
      </CardActions>
    </Card>
   </Col>
  ))}
    </Row>
    <Footer/>
    </DashboardLayout>
    </>
  );
}
