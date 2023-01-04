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
import "./orderstyle.css";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import MDAvatar from "components/MDAvatar";
import Footer from "examples/Footer";
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
import { order } from "../../api";
import { message, Popconfirm, Pagination, Modal, Descriptions } from "antd";

function Order() {
  const [usersData, setUsersData] = useState([]);
  const [page, setpage] = useState(1);
  const [limit, setlimit] = useState(10);
  const [total, settotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modal2, setmodal2] = useState(false);
  const [Mdata, setMdata] = useState([]);

  const onShowSizeChange = (current, pageSize) => {
    setpage(current);
    setlimit(pageSize);
  };
  const cancel = (e) => {
    console.log(e);
    message.error("user not deleted");
  };

  const showModal2 = (item) => {
    console.log(item.country.name);
    setMdata(item);
    setmodal2(true);
  };

  const handleCancel2 = () => {
    setmodal2(false);
  };

  const columns = [
    {
      name: "Created By",
      selector: (row) => {
        return (
          <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDBox ml={2} lineHeight={1}>
              <MDTypography display="block" variant="button" fontWeight="medium">
                {row.createdBy}
              </MDTypography>
            </MDBox>
          </MDBox>
        );
      },
      width: "15rem",
    },
    // {
    //   name: "Product",
    //   selector: (row) => row.products,
    // },

    {
      name: "amount",
      selector: (row) => row.amount,
    },
    {
      name: "Transaction Id",
      selector: (row) => row.transactionId,
    },
    {
      name: "order Email",
      selector: (row) => row.orderEmail,
    },
    {
      name: "country",
      selector: (row) => row.country.name,
    },
    {
      name: "paid By",
      selector: (row) => row.paidBy,
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
                <MDButton
                  onClick={() => showModal2(row)}
                  size="small"
                  color="error"
                  variant="outlined"
                >
                  Detail
                </MDButton>
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
  const getOrders = () => {
    setLoading(true);
    if (sessionStorage.getItem("token-access") !== null) {
      setLoading(true);
      order({
        method: "get",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token-access")}`,
        },
        params: {
          page: page,
          limit: limit,
        },
      })
        .then((res) => {
          setUsersData([...res.data.results]);
          console.log(res.data.results);
          settotal(res.data.totalResults);
          setLoadingFalse();
          message.success("orders fetched successfully");
        })
        .catch((error) => {
          //   message.error(error.res.data.message);
          setLoadingFalse();
        });
    } else {
      setLoadingFalse();
      message.error("Please login first");
    }
  };
  useEffect(() => {
    getOrders();
  }, [limit, page]);
  return (
    <DashboardLayout>
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
                    Order
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
      <Modal className="model" footer={[]} open={modal2} onCancel={handleCancel2}>
        <div>
          <Descriptions title="order detail" bordered>
            <Descriptions.Item label="Transaction Id" span={1}>
              {Mdata?.transactionId}
            </Descriptions.Item>
            <Descriptions.Item label="order Email">{Mdata?.orderEmail}</Descriptions.Item>
            <Descriptions.Item label="amount">{Mdata?.amount} </Descriptions.Item>
            <Descriptions.Item label="paid By">{Mdata?.paidBy}</Descriptions.Item>
            <Descriptions.Item label="country">{Mdata?.country?.name}</Descriptions.Item>
          </Descriptions>
          <Descriptions className="tbb" title="Products" bordered>
            {Mdata?.products?.map((product) => (
              <Descriptions.Item label={product.name} span={1}>
                <ul>
                  <li>{product.totalAmount} USD </li>
                  <li>{product.localAmount + " " + product.localCurrency}</li>
                </ul>
              </Descriptions.Item>
            ))}
          </Descriptions>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

export default Order;
