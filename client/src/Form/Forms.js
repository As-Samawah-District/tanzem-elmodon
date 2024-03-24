import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import createCache from "@emotion/cache";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StorageIcon from '@mui/icons-material/Storage';
import HistoryIcon from '@mui/icons-material/History';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useState } from "react";
import {TextField} from "@mui/material";
import Box from '@mui/material/Box';
import { jwtDecode } from "jwt-decode";
import Modal from '@mui/material/Modal';
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
const theme = (outerTheme) =>
  createTheme({
    direction: "rtl",
});
const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
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
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function Forms() {
  const [show, setShow] = useState(false);
  const [userName, setUserName] = useState();
  const [buildingNumber, setNumber] = useState();
  const [idAdmin,setAdmin] = useState(false)
  const handelToggel = ()=>{setShow(!show)}
  const [id,setId]= useState(); 
  const [currentPage,setCur] = useState(1);
  const [data,setData] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  useEffect(()=>{
    let token = localStorage.getItem('Authorization');
    if(!token || !token.includes('Bearer')) window.location.replace('/login')
    setAdmin( jwtDecode( token.split(' ')[1]).role == 'admin');
    const getDate= async()=>{
        let res = await fetch(host + `/form/forms`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });
        if(res.ok){
            res = await res.json();
            setData(res.forms);
        }
    }
    getDate();
  },[]);

  const handlePagination = async(page)=>{
    if(page == 0) return;
    let token = localStorage.getItem('Authorization');
    let res = await fetch(host + `/form/forms/?page=${page}`, {
        method: "GET",
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
  const handelSearch = async(value)=>{
    let token = localStorage.getItem('Authorization');
    let res = await fetch(host + `/form/filter`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        },
        body: JSON.stringify({
            value
        })
    });
    if(res.ok){
        res = await res.json();
        setData(res.forms);
        setCur(1);
    }
  }
  
  const handelDelte = async()=>{
    let token = localStorage.getItem('Authorization');
    let res = await fetch(host + `/form/${id}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        },
    });
    window.location.reload();
  }
  
  const handelEdit = async()=>{
    let token = localStorage.getItem('Authorization');
    let res = await fetch(host + `/form/${id}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
        },
        body:JSON.stringify({
            userName,
            buildingNumber
        })
    });
    window.location.reload();
  }
  console.log(id);
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
        <div className="bg-white shadow-xl p-3 flex mb-1 w-[95%] rounded-lg m-auto justify-center" dir="ltr">
            {/* <button className="shadow-sm rounded-md p-2 bg-slate-800 text-lg min-w-fit w-20 mr-2 text-white">بحث</button> */}
            <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <CssTextField label="بحث" id="custom-css-outlined-input" dir="rtl" onChange={(e)=>handelSearch(e.target.value)} />
              </ThemeProvider>
            </CacheProvider>
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
                  الاسم
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#334155" }}
                  align="center"
                >
                  رقم الاستماره
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#334155" }}
                  align="center"
                >
                  رقم العقار
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#334155" }}
                  align="center"
                >
                  تاريخ الانشاء
                </StyledTableCell>
                <StyledTableCell
                  style={{ backgroundColor: "#334155" }}
                  align="center"
                >
                  تعديل / حذف 
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <StyledTableRow key={row.number}>
                  <StyledTableCell align="center">
                    {row.userName}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.number}</StyledTableCell>
                  <StyledTableCell align="center">{row.buildingNumber}</StyledTableCell>
                  <StyledTableCell align="center">{row.createdAt.slice(0,10)}</StyledTableCell>
                  <StyledTableCell align="center">
                    {idAdmin &&
                    <div className="flex justify-center gap-2">
                        <VisibilityIcon style={{cursor:'pointer'}} onClick={()=>{window.location.replace(`/print/?id=${row._id}`)}}/>
                        <DeleteIcon style={{color:'red', cursor:'pointer'}} onClick={()=>{setId(row._id); handleOpenDelete()}}/>
                        <EditIcon style={{cursor:'pointer'}} onClick={()=>{setId(row._id); setUserName(row.userName); setNumber(row.buildingNumber); handleOpenEdit()}}/>
                    </div>}
                </StyledTableCell>

                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {(!data || data.length == 0) && <div className="w-full flex justify-center my-3"> <button className="shadow-sm rounded-md p-2 bg-slate-700 text-lg min-w-fit w-20 text-white" onClick={()=>window.location.replace('/addform')}>اضافه استماره</button></div>}
        <div className="flex justify-center mt-3">
            <button className="bg-slate-500 px-3 py-1 rounded-lg ml-2 text-white font-bold" onClick={()=>handlePagination(currentPage+1)}>&laquo;</button>
            <button>{currentPage}</button>
            <button className="bg-slate-500 px-3 py-1 rounded-lg mr-2 text-white font-bold" onClick={()=>handlePagination(currentPage-1)}>&raquo;</button>
        </div>
      </div>
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
      >
        <Box sx={style}>
          <div className="text-center text-xl font-semibold mb-3">
            هل انت متأكد من هذا الاجراء؟
          </div>
          <div className="flex justify-center">
            <button className="bg-red-700 rounded-lg p-2 text-white font-bold" onClick={handelDelte} >حذف</button>
            <button className="bg-black rounded-lg p-2 text-white font-bold ml-2" onClick={handleCloseDelete}>الغاء</button>
        </div>
        </Box>
      </Modal>
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
      >
        <Box sx={style}>
        <div className="text-center text-xl font-semibold mb-3">
            تعديل استمارة
          </div>
          <div className="text-center text-xl font-semibold mb-3">
          <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <TextField
                  label="الاسم"
                  variant="outlined"
                  placeholder={userName}
                  onChange={(e) => {setUserName(e.target.value)}}
                  style={{ width: "17rem",marginBottom:'8PX' }}
                />
              </ThemeProvider>
            </CacheProvider>
            <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <TextField
                  label="رقم العقار"
                  placeholder={buildingNumber}
                  variant="outlined"
                  onChange={(e) => {setNumber(e.target.value)}}
                  style={{ width: "17rem" }}
                />
              </ThemeProvider>
            </CacheProvider>
          </div>
          <div className="flex justify-center">
            <button className="bg-green-500 rounded-lg p-2 text-white font-bold" onClick={handelEdit} >تعديل</button>
            <button className="bg-black rounded-lg p-2 text-white font-bold ml-2" onClick={handleCloseEdit}>الغاء</button>
        </div>
        </Box>
      </Modal>
      
    </div>
  );
}
