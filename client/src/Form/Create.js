import React, { useEffect, useRef, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useReactToPrint } from "react-to-print";
import { TextField, Box } from "@mui/material";
import Button from "@mui/material/Button";
import QRCode from "react-qr-code";
import Swal from "sweetalert2";
import { host } from "../url";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import StorageIcon from '@mui/icons-material/Storage';
import { Link } from "react-router-dom";

const theme = (outerTheme) =>
  createTheme({
    direction: "rtl",
  });

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
export default function Create() {
  const componentRef = useRef();
  const [buildingNumber, setBuilding] = useState();
  const [userName, setUserName] = useState();
  const [number, setNumber] = useState();
  const [show,setShow] = useState(false);
  const handelToggel = ()=>{setShow(!show)}
  const [date, setDate] = useState(
    `${new Date().getDate()}-${
      new Date().getMonth() + 1
    }-${new Date().getFullYear()}`
  );
  const [id,setId] = useState();
  const handelPrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "SMV",
  });
  useEffect(()=>{
    let token = localStorage.getItem('Authorization');
    console.log(token);
    if(!token || !token.includes('Bearer')){
      window.location.replace('/login')
    }
    const getNumber = async()=>{
      if(!number){
        let res = await fetch(host+`/form/formNumber`);
        if(res.ok){
          res = await res.json();
          console.log(res.formNumber);
          setNumber(Number(res.formNumber));
        }
     }
    }
    getNumber()
  })
  const handelSubmit = async()=>{
    if(!userName){
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "من فضلك ادخل الاسم",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    if(!buildingNumber){
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "من فضلك ادخل رقم العقار",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    let token = localStorage.getItem('Authorization');
    let res = await fetch(host+'/form', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      body: JSON.stringify({
       userName,
       buildingNumber,
       number
      }),
    });
    

    if(res.ok){
      res = await res.json();
      setId(res.form?._id)
      window.location.replace(`/print/?id=${res.form?._id}`)
    }else{
      setTimeout(() => {
        handelPrint();
      }, 2000);
    }
    
  }
  return (
    <div className="flex justify-between flex-row-reverse">
      <div className={`h-screen sticky top-0 bg-slate-800 ${show?"w-52":"w-16"} rounded-md transition-all duration-300 flex flex-col p-3 gap-4`}>
        {show && <div onClick={handelToggel} className="text-white cursor-pointer mb-[40px] text-center"><CloseIcon fontSize="large" /></div>}
        {!show && <div onClick={handelToggel} className="text-white cursor-pointer mb-[40px] text-center"><MenuIcon fontSize="large" /></div>}
      
        <Link to={"/forms"} className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg" dir="ltr"
          >{show && <p className="font-bold m-auto">الاستمارات</p>}<HomeIcon fontSize="large"/></Link>
       
        <Link to={"/addforms"} className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg" dir="ltr">{show && <p className="font-bold m-auto">اضافه استماره</p>}<AddIcon fontSize="large" /></Link>
      
        <Link to={"/adduser"} className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg" dir="ltr" >{show && <p className="font-bold m-auto">اضافه مستخدم </p>}<PersonAddAltIcon fontSize="large"  /></Link>
        
        <Link to={"/users"} className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg" dir="ltr" >{show && <p className="font-bold m-auto">  المستخدمين </p>}<PersonOutlineIcon fontSize="large"  /></Link>
        
        <Link to={"/database"} className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg" dir="ltr">{show && <p className="font-bold m-auto">  قاعده البيانات </p>}<StorageIcon fontSize="large"  /></Link>
        
        <Link to={"/logs"} className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg" dir="ltr">{show && <p className="font-bold m-auto"> logs system </p>}<HistoryIcon fontSize="large"  /></Link>
        
        <Link className="flex text-white cursor-pointer justify-between hover:bg-slate-200 rounded-lg" dir="ltr" onClick={()=>{
          window.localStorage.removeItem('Authorization')
          window.location.replace('/login')
        }}>{show && <p className="font-bold m-auto">تسجيل الخروج</p>}<LogoutIcon fontSize="large"  /></Link>

      </div>
    <div className="flex lg:flex-row flex-col justify-between">
      <div className="flex flex-col p-4 container border-black border-4 m-4 w-full lg:w-[65%] "  dir="rtl">
        <div className="flex flex-col gap-2 pt-2 overflow-auto" ref={componentRef} dir="rtl">
          <div className="flex justify-between w-[80%] m-auto">
            <h1 className="text-lg font-bold">  مديرية بلدية السماوة <br/>شعبة تنظيم المدن</h1>
            <img src="/logo.png" style={{width:'100px', height:'70px'}}/>
            <h1 className="text-base font-normal">رقم الاستماره / {number} </h1>
          </div>
          <div className="flex justify-between w-[80%] m-auto">
            <h1 className="text-base font-normal">  الاسم / {userName}</h1>
            <h1 className="text-base font-normal mr-[6rem]">رقم العقار / {buildingNumber} </h1>
          </div>
          <div className="border-dashed border-2 border-black w-[80%] m-auto my-2"></div>
          <div className="flex justify-between w-[80%] m-auto">
            <h1 className="text-base font-normal"> التاريخ:&nbsp; {date.split('-')[0]}/{date.split('-')[1]}/{date.split('-')[2]}</h1>
            <h1 className="text-base font-normal  ">رقم الاستماره / {number}</h1>
          </div>
          <h1 className="text-base font-bas w-[80%] m-auto"> استمارة وصف الشارع المطلة عليه العقار المرقم ({buildingNumber}) </h1>
          <div className="flex w-[80%] m-auto justify-between" >
            <h1>اذا كان العقار عرضة</h1>
            <div className="flex">
                <label>مسيجة</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex mr-2">
                <label> غير مسيجة</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
          </div>
          <div className="w-[80%] m-auto">ج 1-شارع مبلط حديثا</div>
          <div className="flex w-[80%] m-auto justify-between flex-wrap gap-1" >
            <div className="flex">
                <label>أ-طبقه ترابية</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label> ب-طبقة حصي خابط </label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>ج-طبقة اسفلت 10 سم ستيلايزر</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>د-طبقة اسفلت 5 سم</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>هـ- التطبيق بالكرانيت للشارع 8 سم </label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label> و- طبقة من الكونكريت المسلح </label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>ز - رصيف من الانترولوك سمك 6 سم</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>ر - التطبيق للانترلوك 8 سم</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>ي - رصيف من الكرانيت سمك 2 سم</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>ج2 - شارع مبلط قديما قبل عام 2000</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>ج3 -شارع غير مبلط</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex ">
                <label>ج4- الاستعمال سكني</label>
                <p className="border-black border-2 w-20 mx-2"></p>
                <label> تجاري</label>
                <p className="border-black border-2 w-20 mx-2"></p>
                <label> صناعي</label>
                <p className="border-black border-2 w-20 mx-2"></p>
            </div>
            <div>
                ج5- عرض الشارع.........................
            </div>
            <div className="ml-[8rem]">
                ج6- واجهة العقار .........................
            </div>
            <div className="w-full text-xl font-bold">
            الواجهة الجانبية اذا كانت ركنية
            </div>
            <div>ج 1-شارع مبلط حديثا /</div>
            <div className="flex">
                <div > الغرض من الاستمارة  </div>
                <p className="border-black border-2 w-[20rem] py-4 mr-2"></p>
            </div>
            <div className="flex">
                <label>أ-طبقه ترابية</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label> ب-طبقة حصي خابط </label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>ج-طبقة اسفلت 10 سم </label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>د-طبقة اسفلت 5 سم</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>هـ- التطبيق بالكرانيت للشارع 8 سم </label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>ج2 - شارع مبلط قديما قبل عام 2000</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex">
                <label>ج3 -شارع غير مبلط</label>
                <p className="border-black border-2 w-16 mr-2"></p>
            </div>
            <div className="flex flex-wrap g-1">
                <label>ج4- الاستعمال سكني</label>
                <p className="border-black border-2 w-20 mx-2"></p>
                <label> تجاري</label>
                <p className="border-black border-2 w-20 mx-2"></p>
                <label> صناعي</label>
                <p className="border-black border-2 w-20 mx-2"></p>
            </div>
            <div>
                ج5- عرض الشارع.........................
            </div>
            <div className="ml-[8rem]">
                ج6- واجهة العقار .........................
            </div>
            <div className="w-full">
               حقل احتساب الكلفة امن قبل تنظيم المدن 
            </div>
            <div className="border-black border-2 flex flex-col w-full px-2 py-1">
              <div>
              رقم الوصل وتاريخه/
              </div>
              <div>
                المجموع
              </div>
            </div>
            <div className="flex justify-between w-full px-4">
              <div className="font-bold">
                مساح القسم البلدي
              </div>
              <div className="font-bold ml-[15%]">
                مساح القسم البلدي
              </div>
            </div>
            <div className="flex justify-between w-full px-4 mt-6">
              <div className="font-bold">
                اسم محاسب
              </div>
              <div className="font-bold ml-[15%]">
                اسم مدقق
              </div>
            </div>
            <div className="m-auto mt-4">
              <QRCode
                value={`https://${window.location.hostname}/print/?id=${id}`}
                style={{ height: "100px" }}
              />
            </div>
            <p>
            {" "}
            <b>ملاحظه :</b>
            الاستمارة خالية من الحك والشطب وفي حال ذلك تعتبر مزورة (الاستمارة
            صالحة لمدة ٦٠يوم من تاريخ الصادر)
          </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col shadow-lg lg:bg-gradient-to-r lg:from-slate-400 items-center p-6 h-fit rounded-lg m-auto justify-center">
        <h1 className="text-pretty text-xl font-bold my-3">بيانات الاستماره</h1>
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
                  onChange={(e) => {setUserName(e.target.value)}}
                  style={{ width: "17rem" }}
                />
              </ThemeProvider>
            </CacheProvider>
            <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <TextField
                  label="رقم العقار"
                  variant="outlined"
                  onChange={(e) => {setBuilding(e.target.value)}}
                  style={{ width: "17rem" }}
                />
              </ThemeProvider>
            </CacheProvider>
          </Box>
        </Box>
        <Button variant="contained" style={{marginTop:'10px' ,width:'10rem', fontWeight:'bold', fontSize:'1.2rem'}} 
        onClick={handelSubmit}>انشاء</Button>
      </div>
    </div>
    </div>
  );
}
