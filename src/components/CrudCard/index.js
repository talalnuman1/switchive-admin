import MDInput from "components/MDInput";
// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import React, { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import { cards } from "api";
import { array, number } from "prop-types";
import { UploadOutlined } from "@ant-design/icons";

import { Button, message, Upload, Select } from "antd";
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
export default function index() {
  const Dragger = Upload.Dragger;
  const [name, setName] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const [fileList, setFileList] = useState([]);
  const [FileSend, setFileSend] = useState([]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
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

  return (
    <Card sx={{ height: "100%", width: "100%", alignItems: "center" }}>
      <MDTypography variant="h4" fontWeight="medium" mt={2}>
        Switchive Gift Card
      </MDTypography>
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
          <h5>Select Currency : </h5>
          <Select
            defaultValue="USD"
            style={{
              width: "100%",
              height: "10%",
            }}
            onChange={handleChange}
            options={options}
          />
        </MDBox>
        <MDBox display="flex" flexWrap="wrap" p={2}>
          <MDBox display="flex" flexWrap="wrap" pr={2}>
            <h5>Avatar : </h5>
          </MDBox>

          <Upload {...propsUpload}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </MDBox>

        <MDBox p={2} mt="auto">
          <MDButton variant="contained" color="info" fullWidth onClick={onsubmit}>
            Create
          </MDButton>
        </MDBox>
      </MDBox>
    </Card>
  );
}
