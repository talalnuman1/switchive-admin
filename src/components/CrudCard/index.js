import MDInput from "components/MDInput";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import React from "react";
import MDButton from "components/MDButton";

export default function index() {
  return (
    <Card sx={{ height: "100%", width: "100%", alignItems: "center" }}>
      <MDTypography variant="h4" fontWeight="medium" mt={2}>
        Switch Hive Card
      </MDTypography>
      <MDBox pt={3} px={3}>
        <MDBox display="flex" flexWrap="wrap" p={2}>
          <MDInput
            label="Name"
            style={{
              width: "100%",
            }}
          />
        </MDBox>
        <MDBox display="flex" flexWrap="wrap" p={2}>
          <MDInput
            label="Currency"
            style={{
              width: "100%",
            }}
          />
        </MDBox>
        <MDBox display="flex" flexWrap="wrap" p={2}>
          <MDInput
            label="Min Amount"
            style={{
              width: "47%",
              marginRight: "20px",
            }}
          />
          <MDInput
            label="Max Amount"
            style={{
              width: "47%",
            }}
          />
        </MDBox>
        <MDBox display="flex" flexWrap="wrap" p={2}>
          <MDInput
            label="Avatar"
            style={{
              width: "100%",
            }}
          />
        </MDBox>

        <MDBox p={2} mt="auto">
          <MDButton variant="contained" color="info" fullWidth onClick={() => console.log("first")}>
            Create
          </MDButton>
        </MDBox>
      </MDBox>
    </Card>
  );
}
