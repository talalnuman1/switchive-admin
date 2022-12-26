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
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Grid } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

export default function GiftCard() {
  const [name, setName] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [avatar, setAvatar] = useState(null)
  const [open, setOpen] = React.useState(false);


  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    <>
     <DashboardLayout>
      <DashboardNavbar />

      <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
    <Card >
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
    </Grid>
    </Grid>
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open responsive dialog
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
        </DialogTitle>
        <DialogContent>
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
        </DialogContent>
      </Dialog>
    </div>
    <Footer/>
    </DashboardLayout>
    </>
  );
}
