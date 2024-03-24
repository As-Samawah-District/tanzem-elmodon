import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import SendIcon from "@mui/icons-material/Send";
import { TextField, Box } from "@mui/material";
import style from "./loginStyle.module.css";
import Button from "@mui/material/Button";
import { host } from "../url";
const theme = (outerTheme) =>
  createTheme({
    direction: "rtl",
  });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

export default function Login() {
  const [clk, setClk] = useState(false);
  const [name, setName] = useState(null);
  const [password, setPassword] = useState(null);
  const [err, setErr] = useState(null);
  let token = localStorage.getItem("Authorization");
  useEffect(() => {
     if (token && token.includes('Bearer')) window.location.replace("/");
  }, []);
  const handelSumbit = async () => {
    setClk(true);
    let res = await fetch(`${host}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
      }),
    });
    if (res.ok) {
      setClk(false);

      let token = await res.json();
      console.log(token);
      localStorage.setItem("Authorization", `Bearer ${token.token}`);
      localStorage.setItem('name', token.user.name)
      localStorage.setItem('role', token.role);
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
        src="/logo.png"
        style={{ width: "4rem", height: "4rem" }}
      />
      <h2 className="mb-[1rem] font-normal text-base ">مديرية بلدية السماوة</h2>
      <h1 className="mb-[1rem] text-2xl font-bold">تسجيل الدخول</h1>
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
                required
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
                required
                style={{ width: "17rem" }}
              />
            </ThemeProvider>
          </CacheProvider>
        </Box>
      </Box>
      <b className="text-red-500 my-4">{err}</b>
      <button
        className="bg-slate-900 font-bold w-[150px] p-3 text-lg text-white rounded-lg hover:shadow-lg "
        onClick={handelSumbit}
      >
        {clk ? <span className={style.loader} /> : "تأكيد"}
      </button>
    </div>    

  );
}
