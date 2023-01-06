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
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Row, Typography, Col, Button, Modal, Tooltip } from "antd";
// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";
// Data
import data from "layouts/dashboard/components/Projects/data";
import { formulas } from "api";

function Projects() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [modal2, setmodal2] = useState(false);
  const [value, setvalue] = useState([]);
  const [getID, setgetID] = useState("");

  const setLoadingFalse = () => {
    setLoading(false);
  };

  const handleCancel2 = () => {
    setmodal2(false);
  };

  const showModal2 = (item) => {
    setgetID(item.id);
    setmodal2(true);
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
  const onUpdate = (id) => {
    formulas(`/${id}`, {
      method: "patch",
      data: {
        value: value,
      },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
      },
    })
      .then(function (res) {
        console.log(res.data);
        getFormulas();
        handleCancel2();
      })
      .catch(function (error) {
        console.log(error);
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
            <Col lg={8} md={24} xs={24} style={{ marginBottom: "1rem", marginTop: "2rem" }}>
              <Tooltip placement="topLeft" title={a.description}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Key : {a.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="div">
                      value : {a.value + " " + a.sign}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => showModal2(a)}>
                      update
                    </Button>
                  </CardActions>
                </Card>
              </Tooltip>
            </Col>
          ))}
        </Row>
      )}
      <Modal footer={[]} open={modal2} onCancel={handleCancel2}>
        <div>
          <MDBox pt={3} px={3}>
            <MDBox display="flex" flexWrap="wrap" p={2}>
              <MDInput
                label="value"
                onChange={(e) => setvalue(e.target.value)}
                style={{
                  width: "100%",
                }}
              />
            </MDBox>
            <MDBox p={2} mt="auto">
              <MDButton variant="contained" color="info" fullWidth onClick={() => onUpdate(getID)}>
                update
              </MDButton>
            </MDBox>
          </MDBox>
        </div>
      </Modal>
    </Card>
  );
}

export default Projects;
