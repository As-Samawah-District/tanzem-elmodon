import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import StorageIcon from "@mui/icons-material/Storage";
import HistoryIcon from "@mui/icons-material/History";
import { Link } from "react-router-dom";
import { TextField, Box } from "@mui/material";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import { host } from "../url";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const theme = (outerTheme) =>
  createTheme({
    direction: "rtl",
  });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
export default function Form() {
  const [show, setShow] = useState(false);
  const handelToggel = () => {
    setShow(!show);
  };
  const [data, setData] = useState({});
  useEffect(()=>{
    let token = localStorage.getItem('Authorization');
    if(!token || !token.includes('Bearer')) window.location.replace('/login')
  },[])
  const handelSubmit = async () => {
    //console.log(data.file);
    if (!data.userName && !data.file) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "من فضلك ادخل الاسم",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if (!data.buildingNumber && !data.file) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "من فضلك ادخل رقم العقار",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    const formdata = new FormData();
    for (const [key, value] of Object.entries(data)) {
      console.log(key, value);
      formdata.append(key, value);
    }
    if (data.file) {
      formdata.append("file", data.file);
    }
    let token = localStorage.getItem("Authorization");
    let res = await axios.post(`${host}/form`, formdata, {
      headers: {
        Authorization: token,
      },
    });
    console.log(res);

    if (res.status == 200) {
      window.location.replace(`/forms`);
    } else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: res.message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };
  return (
    <div className="flex justify-between" dir="rtl">
      <div
        className={`h-screen sticky top-0 bg-slate-800 ${
          show ? "w-52" : "w-16"
        } rounded-md transition-all duration-300 flex flex-col p-3 gap-4`}
      >
        {show && (
          <div
            onClick={handelToggel}
            className="text-white cursor-pointer mb-[40px] text-center"
          >
            <CloseIcon fontSize="large" />
          </div>
        )}
        {!show && (
          <div
            onClick={handelToggel}
            className="text-white cursor-pointer mb-[40px] text-center"
          >
            <MenuIcon fontSize="large" />
          </div>
        )}

        <Link
          to={"/forms"}
          className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg"
          dir="ltr"
        >
          {show && <p className="font-bold m-auto">الاستمارات</p>}
          <HomeIcon fontSize="large" />
        </Link>

        <Link
          to={"/addforms"}
          className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg"
          dir="ltr"
        >
          {show && <p className="font-bold m-auto">اضافه استماره</p>}
          <AddIcon fontSize="large" />
        </Link>

        <Link
          to={"/adduser"}
          className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg"
          dir="ltr"
        >
          {show && <p className="font-bold m-auto">اضافه مستخدم </p>}
          <PersonAddAltIcon fontSize="large" />
        </Link>

        <Link
          to={"/users"}
          className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg"
          dir="ltr"
        >
          {show && <p className="font-bold m-auto"> المستخدمين </p>}
          <PersonOutlineIcon fontSize="large" />
        </Link>

        <Link
          to={"/database"}
          className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg"
          dir="ltr"
        >
          {show && <p className="font-bold m-auto"> قاعده البيانات </p>}
          <StorageIcon fontSize="large" />
        </Link>

        <Link
          to={"/logs"}
          className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg"
          dir="ltr"
        >
          {show && <p className="font-bold m-auto"> logs system </p>}
          <HistoryIcon fontSize="large" />
        </Link>

        <Link
          className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg"
          dir="ltr"
          onClick={() => {
            window.localStorage.removeItem("Authorization");
            window.location.replace("/login");
          }}
        >
          {show && <p className="font-bold m-auto">تسجيل الخروج</p>}
          <LogoutIcon fontSize="large" />
        </Link>
      </div>
      <div className="w-full">
        <nav
          className="w-[100%] bg-white shadow-xl p-3 flex mb-10 rounded-t-lg rounded-l-lg "
          dir="ltr"
        >
          <img src="/user.png" className="w-[50px] h-10" />
          <div className="font-semibold ml-3 my-auto text-xl">
            {window.localStorage.getItem("name")}
          </div>
        </nav>
        <div className="bg-white rounded-lg p-4 shadow-lg flex flex-col m-auto h-fit items-center w-fit">
          <h1 className="text-pretty text-xl font-bold my-3 bg-black rounded-xl text-white p-3">
            اضافه استمارة
          </h1>
          <Box sx={{ "& > :not(style)": {} }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "flex-end",
              }}
            >
              <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={theme}>
                  <TextField
                    label="الاسم"
                    variant="outlined"
                    onChange={(e) => {
                      setData({ ...data, userName: e.target.value });
                    }}
                    style={{ width: "17rem" }}
                  />
                </ThemeProvider>
              </CacheProvider>
              <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={theme}>
                  <TextField
                    label="رقم العقار"
                    variant="outlined"
                    onChange={(e) => {
                      setData({ ...data, buildingNumber: e.target.value });
                    }}
                    style={{ width: "17rem" }}
                  />
                </ThemeProvider>
              </CacheProvider>
            </Box>
          </Box>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            fullWidth
            dir="rtl"
            style={{ marginTop: "10px" }}
            onChange={(e) => {
              setData({ ...data, file: e.target.files[0] });
            }}
          >
            تحميل ملف اكسيل
            <VisuallyHiddenInput type="file" />
          </Button>
          <Button
            variant="contained"
            fullWidth
            style={{
              marginTop: "10px",
              fontWeight: "bold",
              fontSize: "1.2rem",
              backgroundColor: "black",
            }}
            onClick={handelSubmit}
          >
            انشاء
          </Button>
        </div>
      </div>
    </div>
  );
}
