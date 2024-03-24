import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import Swal from "sweetalert2";
import { TextField, Box } from "@mui/material";
import style from "./loginStyle.module.css";
import Button from "@mui/material/Button";
import { host } from "../url";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'
import { jwtDecode } from "jwt-decode";

const theme = (outerTheme) =>
  createTheme({
    direction: "rtl",
  });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function Signup() {
  const [clk, setClk] = useState(false);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordConfirm, setConfirm] = useState();
  const [err, setErr] = useState(null);
  const [role,setAdmin] = useState('user');
  const toggel = ()=>{ setAdmin(role == 'user'? 'admin':'user')}
  let token = localStorage.getItem("Authorization");
  useEffect(() => {
    if (!token || !token.includes("Bearer")) window.location.replace("/");
     
    if(jwtDecode( token.split(' ')[1]).role != 'admin') window.location.replace("/");
  }, []);
  const handelSumbit = async () => {
    setClk(true);
    let res = await fetch(`${host}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        role,
        password,
        passwordConfirm,
      }),
    });
    if (res.ok) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "تم اضافه المستخدم بنجاح",
        showConfirmButton: false,
        timer: 3000,
      });
      window.location.replace("/");
    } else {
      setClk(false);
      let error = await res.json();
      setErr(error.message);
    }
  };
  return (
    <div
      dir="rtl"
      className="flex flex-col p-[2rem] w-[90%] sm:w-[45%] bg-white shadow-xl rounded-xl m-auto mt-[8rem] items-center"
    >
      <img
        src="https://res.cloudinary.com/dbymvhk8x/image/upload/v1685471180/image-525acf9e29b89e9cdea769d5d8c0ef1b8720823e_g8nzze.png"
        style={{ width: "4rem", height: "4rem" }}
      />
      <h2 className="mb-[1rem] font-normal text-base ">مديرية بلدية السماوة</h2>
      <h1 className="mb-[1rem] text-2xl font-bold">تسجيل مستخدم جديد</h1>
      <h3 className="mb-[1rem] text-base">
        من فضلك، أدخل بيانات حسابك للمتابعة
      </h3>
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
                label="اسم المستخدم"
                variant="outlined"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                style={{ width: "17rem" }}
              />
            </ThemeProvider>
          </CacheProvider>
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <TextField
                type="password"
                label="الرقم السري"
                variant="outlined"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                style={{ width: "17rem" }}
              />
            </ThemeProvider>
          </CacheProvider>
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <TextField
                type="password"
                label=" تأكيد الرقم السري "
                variant="outlined"
                onChange={(e) => {
                  setConfirm(e.target.value);
                }}
                style={{ width: "17rem" }}
              />
            </ThemeProvider>
          </CacheProvider>
        </Box>
      </Box>
      <FormControlLabel control={<Checkbox />} label="اضافه كأدمن؟"  dir="ltr" onClick={toggel}/>
      <b className="text-red-500 my-4">{err}</b>
      <Button
        className="text-3xl font-bold w-24 p-3"
        variant="contained"
        size="medium"
        onClick={handelSumbit}
      >
        {clk ? <span className={style.loader} /> : "تأكيد"}
      </Button>
      <Button
        color="inherit"
        variant="contained"
        size="small"
        style={{ marginTop: "5px" }}
        onClick={() => {
          window.location.replace("/");
        }}
      >
        رجوع
        <ArrowBackIcon />
      </Button>
    </div>
  );
}
