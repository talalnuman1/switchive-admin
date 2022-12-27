/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Row, Typography, Col, Button } from "antd";
// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";

// Data
import data from "layouts/dashboard/components/Projects/data";

const data1 = [
  { id: "63a9b8a05addf71ba83bff4d", key: "commission", value: 1 },
  {
    id: "63a9b8d35addf71ba83bff50",
    key: "loyaltyPoints",
    value: 0.5,
  },
  { id: "63a9b9c7dd9b140c4485e828", key: "referralPoints", value: 50 },
  { id: "63aab122664b171fdcf834e4", key: "shp", value: 0.01 },
  { id: "63aab1f3664b171fdcf834e7", key: "referralLimit", value: 500 },
];

function Projects() {
  const { columns, rows } = data();
  const [menu, setMenu] = useState(null);

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={closeMenu}>Action</MenuItem>
      <MenuItem onClick={closeMenu}>Another action</MenuItem>
      <MenuItem onClick={closeMenu}>Something else</MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Projects
          </MDTypography>
        </MDBox>
      </MDBox>
      <Row className="overflow" gutter={10}>
        {data1.map((a) => (
          <Col lg={6} md={12} xs={24} style={{ marginBottom: "1rem" }}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Key : {a.key}
                </Typography>
                <Typography gutterBottom variant="body2" color="text.secondary" component="div">
                  value : {a.value}
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
    </Card>
  );
}

export default Projects;
