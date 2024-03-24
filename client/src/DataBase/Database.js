import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import StorageIcon from '@mui/icons-material/Storage';
import HistoryIcon from '@mui/icons-material/History';
import { host } from "../url";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
export const Database = () => {
  const [dis, setDis] = useState(false);
  const [pass, setPass] = useState("");
  const [show,setShow] = useState(false);
  const handelToggel = ()=>{setShow(!show)}

  useEffect(()=>{
    let token = localStorage.getItem('Authorization')
    if(jwtDecode( token.split(' ')[1]).role != 'admin') window.location.replace("/");
  },[])

  const downloadCSV = (e) => {
    setDis(true);
    e.preventDefault();
    let token = localStorage.getItem('Authorization')
    fetch(`${host}/form/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization":token
      },
      body: JSON.stringify({ pass }),
    })
      .then((response) => {
        console.log(response.status);
        if (response.status == 200) {
          return response.blob();
        } else {
          setDis(false);
        }
      })
      .then((blob) => {
        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(new Blob([blob]));

        // Create a temporary <a> element and trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "database.csv");
        document.body.appendChild(link);
        link.click();

        // Cleanup the temporary URL and element
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
        setDis(false);
      })
      .catch((error) => {
        console.error("Error downloading CSV:", error);
        setDis(false);
      });
  };

  return (
    <div className="flex justify-between">
      <form
        onSubmit={downloadCSV}
        className="bg-white shadow-xl rounded-xl w-[20rem] m-auto flex items-center flex-col p-5 gap-6"
      >
        <div>
          <input
            type="password"
            className="w-[200px] p-4 border-2 rounded-lg text-right"
            placeholder="ادخل الباسورد"
            onChange={(e) => setPass(e.target.value)}
          ></input>
        </div>
        <button type="submit" disabled={dis} className="bg-slate-600 p-2 text-white rounded-lg">
          Download Database
        </button>
      </form>
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
    </div>
  );
};
