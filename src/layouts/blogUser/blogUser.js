import React, { useEffect, useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "react-data-table-component";
import team2 from "assets/images/team-2.jpg";
import MDButton from "components/MDButton";
import { users, cards } from "../../api";
import { message, Popconfirm, Pagination, Modal } from "antd";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDAvatar from "components/MDAvatar";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MDInput from "components/MDInput";

export default function BlogUser() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [total, settotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const cancel = (e) => {
    console.log(e);
    message.error("writer not deleted");
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
      selector: (row) => row.createdAt.split("T")[0],
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
  const onsubmit = (values) => {
    if (name === "" || email === "" || password === "") {
      message.error("please fill all fields");
    } else {
      users({
        method: "post",
        data: {
          name,
          email,
          password,
          role: "blogWriter",
        },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
        },
      })
        .then(function (res) {
          console.log(res.data);
          getUsers();
          handleCancel();
        })
        .catch(function (error) {
          console.log(error);
          handleCancel();
        })
        .finally(function () {
          setName("");
          setEmail("");
          setPassword("");
        });
    }
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
          role: "blogWriter",
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
          messageApi.success("writer deleted successfully");
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

  useEffect(() => {
    getUsers();
  }, [limit, page]);
  return (
    <>
      <DashboardLayout>
        {contextHolder}
        <DashboardNavbar />
        <MDButton className="btn" onClick={showModal}>
          Create Blog writer
        </MDButton>
        <Modal footer={[]} open={isModalOpen} onCancel={handleCancel}>
          <div>
            <MDBox pt={3} px={3}>
              <MDBox display="flex" flexWrap="wrap" p={2}>
                <MDInput
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                  }}
                />
              </MDBox>

              <MDBox display="flex" flexWrap="wrap" p={2}>
                <MDInput
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                  }}
                />
              </MDBox>

              <MDBox display="flex" flexWrap="wrap" p={2}>
                <MDInput
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                  }}
                />
              </MDBox>
              <MDBox p={2} mt="auto">
                {
                  <MDButton variant="contained" color="info" fullWidth onClick={onsubmit}>
                    Create
                  </MDButton>
                }
              </MDBox>
            </MDBox>
          </div>
        </Modal>
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
                      blog writer Table
                    </MDTypography>
                  </MDBox>

                  <MDBox pt={3}>
                    <DataTable columns={columns} data={usersData} />
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
            </Grid>
          )}
        </MDBox>
      </DashboardLayout>
    </>
  );
}
