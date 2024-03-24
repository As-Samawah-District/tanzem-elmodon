import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import StorageIcon from '@mui/icons-material/Storage';
import HistoryIcon from '@mui/icons-material/History';
import { useState } from "react";
import { Checkbox, FormControlLabel, TextField} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { host } from "../url";
import { Link } from "react-router-dom";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
[`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
},
[`&.${tableCellClasses.body}`]: {
    fontSize: 14,
},
}));
const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
    color: '#A0AAB4',
    },
    '& .MuiInput-underline:after': {
    borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
    '& fieldset': {
        borderColor: '#E0E3E7',
    },
    '&:hover fieldset': {
        borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
        borderColor: '#6F7E8C',
    },
    },
});
const StyledTableRow = styled(TableRow)(({ theme }) => ({
"&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
},
// hide last border
"&:last-child td, &:last-child th": {
    border: 0,
},
}));
export default function Logs() {

  const [show, setShow] = useState(false);
  const handelToggel = ()=>{setShow(!show)}
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [user, setUser] = useState();
  const [users, setUsers] = useState();
  const [type,setType] = useState();
  const [currentPage,setCur] = useState(1);
  const [data,setData] = useState();
  useEffect(()=>{
    let token = localStorage.getItem('Authorization')
    if(jwtDecode( token.split(' ')[1]).role != 'admin') window.location.replace("/");
    const getDate= async()=>{
        let token = localStorage.getItem('Authorization')
        if(jwtDecode( token.split(' ')[1]).role != 'admin') window.location.replace("/");
        let res = await fetch(host + `/logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        if(res.ok){
            res = await res.json();
            setData(res.result);
        }
        res = await fetch(host + `/auth/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
        });
        if(res.ok){
            res = await res.json();
            setUsers(res.users);
        }
    }
    getDate();
  },[]);

  const handlePagination = async(page)=>{
    if(page == 0) return;
    let token = localStorage.getItem('Authorization');
    let res = await fetch(host + `/logs/?page=${page}`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        },
    });
    if(res.ok){
        res = await res.json();
        if(res.forms?.length){
            setData(res.forms);
            setCur(page);
        }
    }
  }
  const handelSearch = async()=>{
    let token = localStorage.getItem('Authorization');
    let res = await fetch(host + `/logs`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        },
        body: JSON.stringify({
            from,
            to,
            user,
            type
        })
    });
    if(res.ok){
        res = await res.json();
        setData(res.result);
        setCur(1);
    }
  }
  
  return (
    <div className="flex flex-row justify-between" dir="rtl">
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
      <div className="w-full mb-10">
        <nav
            className="w-[100%] bg-white shadow-xl p-3 flex mb-10 rounded-t-lg rounded-l-lg "
            dir="ltr"
            >
            <img src="/user.png" className="w-[50px] h-10" />
            <div className="font-semibold ml-3 my-auto text-xl">{window.localStorage.getItem('name')}</div>
        </nav>
        <div className="bg-white shadow-xl p-3 flex mb-1 w-[95%] rounded-lg m-auto justify-around" dir="rtl">

            <select className="border-2 p-2" onChange={(e)=>setType(e.target.value)}>
                <option selected value={undefined}>النوع: الكل</option>
                <option value="تسجيل دخول">
                تسجيل دخول
              </option>
              <option value="اضافه استماره">
                اضافه استماره
              </option>
              <option value="تعديل">
                تعديل
              </option>
              <option value="حذف">
                حذف
              </option>
              <option value="اضافه موظف">
                اضافه موظف
              </option>

              <option value="excel">
                اضافه excel
              </option>
            </select>
            <select className="border-2 p-2" onChange={(e)=>setUser(e.target.value)}>
                <option selected value={undefined}> الموظف: الكل</option>
                {users && users.map((user,key)=>{
                    return <option value={user.name} key={user._id}>{user.name}</option>
                })}
            </select>
            <div className="flex flex-col">
                <p>من</p>
                <TextField  type="date" variant="standard" onChange={(e)=>{setFrom(e.target.value)}}/>
            </div>
            <div className="flex flex-col">
                <p>الي</p>
                <TextField  type="date" variant="standard" onChange={(e)=>{setTo(e.target.value)}}/>
            </div>
            <button className="bg-black text-white rounded-lg p-3" onClick={handelSearch}>بحث</button>
        </div>
        <TableContainer
          component={Paper}
          style={{ margin: "auto", width: "95%" }}
          dir="rtl"
        >
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  style={{ backgroundColor: "#334155" }}
                  align="center"
                >
                  النوع
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#334155" }}
                  align="center"
                >
                  الموظف
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#334155" }}
                  align="center"
                >
                   التفاصيل
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#334155" }}
                  align="center"
                >
                  التاريخ 
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#334155" }}
                  align="center"
                >
                  المنصه 
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#334155" }}
                  align="center"
                >
                  IP 
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => {
                let color = "";
                if (row.type.includes("دخول")) color = "#8ef3e7";
                if (row.type.includes("حذف")) color = "#f39a8e";
                if (row.type.includes("تعديل")) color = "#ffc107";
                if (row.type.includes("اضافه")) color = "#8ebef3";
                if (row.type.includes("موظف")) color = "#cb8ef3";
                return <StyledTableRow key={row.number}>
                  <StyledTableCell align="center" width={200} style={{backgroundColor:color,padding:'1px', fontWeight:'bold',border:'solid .5px'}}>
                    {row.type}
                  </StyledTableCell>
                  <StyledTableCell align="center" style={{border:'solid .5px'}} width={220}>{row.user}</StyledTableCell>
                  <StyledTableCell align="center" style={{border:'solid .5px'}}>{row.details}</StyledTableCell>
                  <StyledTableCell align="center" style={{border:'solid .5px'}} width={120}>{row.createdAt.slice(0,10)}</StyledTableCell>
                  <StyledTableCell align="center" style={{border:'solid .5px'}} width={100}>{row.system}</StyledTableCell>
                  <StyledTableCell align="center" style={{border:'solid .5px'}} width={200}>{row.ip}</StyledTableCell>
                </StyledTableRow>
            })}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex justify-center mt-3">
            <button className="bg-slate-500 px-3 py-1 rounded-lg ml-2 text-white font-bold" onClick={()=>handlePagination(currentPage+1)}>&laquo;</button>
            <button>{currentPage}</button>
            <button className="bg-slate-500 px-3 py-1 rounded-lg mr-2 text-white font-bold" onClick={()=>handlePagination(currentPage-1)}>&raquo;</button>
        </div>
      </div>
      
    </div>
  )
}
