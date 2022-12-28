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

import { useEffect, useState } from "react";

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
import { formulas } from "api";

function Projects() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const setLoadingFalse = () => {
    setLoading(false);
  };
  // const { columns, rows } = data();
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
  const getFormulas = () => {
    formulas({
      method: "get",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
      },
    })
      .then((res) => {
        console.log(res.data.results);
        setData(res.data.results);
        setLoadingFalse();
        // messageApi.success("Switch Hive Cards fetched successfully");
      })
      .catch((error) => {
        messageApi.error(error.response.data.message);
        setLoadingFalse();
      })
      .finally(() => {
        setLoadingFalse();
      });
  };
  useEffect(() => {
    getFormulas();
  }, []);
  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            Formulas
          </MDTypography>
        </MDBox>
      </MDBox>
      {loading ? (
        <h1>Loading</h1>
      ) : (
        <Row className="overflow" gutter={10}>
          {data.map((a) => (
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
      )}
    </Card>
  );
}

export default Projects;
