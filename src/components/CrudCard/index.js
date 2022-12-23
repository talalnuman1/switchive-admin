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

export default function index() {
  const [name, setName] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const onsubmit = (values) => {
    cards({
      method: "post",
      data: { name, currency, maxAmount: Number(maxAmount), minAmount: Number(minAmount), avatar },
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
            label="Currency"
            onChange={(e) => setCurrency(e.target.value)}
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
          <MDInput
            label="Avatar"
            onChange={(e) => setAvatar(e.target.value)}
            style={{
              width: "100%",
            }}
          />
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
