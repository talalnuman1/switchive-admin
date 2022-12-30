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
import React, { useEffect, useState } from "react";
import "./styleuser.css"
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";

import DataTable from "react-data-table-component";
import team2 from "assets/images/team-2.jpg";
import MDButton from "components/MDButton";
import { users, cards } from "../../api";
import { message, Popconfirm, Pagination } from "antd";

function Tables() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [total, settotal] = useState(0);

  const cancel = (e) => {
    console.log(e);
    message.error("user not deleted");
  };
  const onShowSizeChange = (current, pageSize) => {
    setpage(current);
    setlimit(pageSize);
  };

  const columns = [
    {
      name: "User",
      selector: (row) => {
        return (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDAvatar src={team2} name={row.name} size="sm" />
            <MDBox ml={2} lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
                {row.name}
              </MDTypography>
              <MDTypography variant="caption">{row.email}</MDTypography>
            </MDBox>
          </MDBox>
        );
      },
      width: "15rem",
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "status",
      selector: (row) => {
        let content = row.isEmailVerified ? "Verified" : "Not Verified";
        let color = row.isEmailVerified ? "success" : "warning";
        return (
          <MDBox ml={-1}>
            <MDBadge ml={-1} badgeContent={content} color={color} variant="gradient" size="sm" />
          </MDBox>
        );
      },
    },
    {
      name: "Joined",
      selector: (row) => row.joined,
    },
    {
      name: "Actions",
      width: "15rem",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
      headerStyle: (selector, id) => {
        return { textAlign: "center" };
      },
      selector: (row) => {
        return (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDBox lineHeight={1} display="flex" px={1}>
              <MDBox ml={1}>
                <Popconfirm
                  title="Are you sure to delete this user?"
                  onConfirm={() => deleteUser(row.id)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <MDButton size="small" color="error" variant="outlined">
                    Delete
                  </MDButton>
                </Popconfirm>
              </MDBox>
            </MDBox>
          </MDBox>
        );
      },
    },
  ];
  const setLoadingFalse = () => {
    setLoading(false);
  };

  const getUsers = () => {
    setLoading(true);
    if (sessionStorage.getItem("token-access") !== null) {
      setLoading(true);
      users({
        method: "get",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
        },
        params: {
          role: "user",
          page: page,
          limit: limit,
        },
      })
        .then((res) => {
          setUsersData([...res.data.results]);
          console.log(res.data.results);
          settotal(res.data.totalResults);
          setLoadingFalse();
          messageApi.success("Users fetched successfully");
        })
        .catch((error) => {
          messageApi.error(error.response.data.message);
          setLoadingFalse();
        });
    } else {
      setLoadingFalse();
      messageApi.error("Please login first");
    }
  };
  const deleteUser = (id) => {
    setLoading(true);
    if (sessionStorage.getItem("token-access") !== null) {
      setLoading(true);
      users({
        method: "delete",
        url: `/${id}`,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
        },
      })
        .then((res) => {
          console.log(res);
          messageApi.success("User deleted successfully");
          getUsers();
        })
        .catch((error) => {
          messageApi.error(error.response.data.message);
          setLoadingFalse();
        });
    } else {
      setLoadingFalse();
      messageApi.error("Please login first");
    }
  };
  const getCards = () => {
    setLoading(true);
    users({
      method: "get",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
      },
    })
      .then((res) => {
        console.log(res.data.results);
        setLoadingFalse();
        messageApi.success("Switch Hive Cards fetched successfully");
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
    getUsers();
    getCards();
  }, [limit, page]);

  return (
    <DashboardLayout>
      {contextHolder}
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {loading ? (
          <MDBox sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CircularProgress color="secondary" />
          </MDBox>
        ) : (
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Users Table
                  </MDTypography>
                </MDBox>

                <MDBox pt={3}>
                  <DataTable columns={columns} data={usersData}  />
                </MDBox>
              </Card>
              <Pagination
                className="pageinantion"
                showSizeChanger
                onChange={onShowSizeChange}
                defaultCurrent={1}
                current={page}
                total={total}
              />
            </Grid>

            {/* <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Projects Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}
          </Grid>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default Tables;
