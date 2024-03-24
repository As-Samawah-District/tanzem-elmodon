import React, { useEffect, useState } from 'react'
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import StorageIcon from '@mui/icons-material/Storage';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { host } from '../url';
import { Box, Checkbox, FormControlLabel, Modal, TextField } from '@mui/material';
import createCache from "@emotion/cache";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const theme = (outerTheme) =>
createTheme({
  direction: "rtl",
});
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
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
export default function Users() {
  const [show, setShow] = useState(false);
  const handelToggel = ()=>{setShow(!show)}
  const [users,setUsers] = useState();
  const [edited,setEdited] = useState({})
  const [user,setUser] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);
  const [role,setAdmin] = useState(user?.role);
  const toggel = ()=>{ setEdited({...edited,role:role == 'user'? 'admin':'user'});setAdmin(role == 'user'? 'admin':'user'); }
  useEffect(()=>{
    let token = localStorage.getItem('Authorization')
    if(!token || jwtDecode( token.split(' ')[1]).role != 'admin') window.location.replace("/");
    const getDate= async()=>{
        let token = localStorage.getItem('Authorization')
        let res = await fetch(host + `/auth/all`, {
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
  const handelEdit = async()=>{
    let token = localStorage.getItem('Authorization')
    let res = await fetch(host + `/auth/${user._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
        },
        body: JSON.stringify({
            name: edited.name,
            password: edited.password,
            passwordConfirm: edited.passwordConfirm,
            role: edited.role
        })
    });
    window.location.reload();
  }
  const handelDelete = async()=>{
    let token = localStorage.getItem('Authorization')
    let res = await fetch(host + `/auth/${user._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
        },
        
    });
    window.location.reload();
  }
  return (
    <div className='flex justify-between' dir='rtl'>
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
        <div className='bg-white rounded-lg w-[90%] m-auto flex justify-around shadow-lg p-3'>
            <div className='font-bold my-auto text-2xl'>الموظفين</div>
            <button className='bg-black p-2 text-white rounded-lg font-bold px-4' onClick={()=>{window.location.replace('/signup')}}>تسجيل</button>
        </div>
        <div className='rounded-lg w-[90%] m-auto flex flex-wrap gap-2 justify-between p-4 mt-10'>
            {users && users.map((user)=>{
                return <div className='bg-white shadow-lg w-56 cursor-pointer h-48 rounded-xl flex flex-col gap-4 hover:bg-slate-100' onClick={()=>{setUser(user); setAdmin(user.role); handleOpenEdit();}}>
                <div className='border-4 border-red-600  rounded-t-xl w-full'></div>
                <img src='/user.png' className='h-[70px] w-[80px] rounded-full border-4 border-slate-100  shadow-md mx-auto'/>
                <div className='mx-auto font-bold text-xl'>{user.name}</div>
                <div className='mx-auto'><SettingsIcon /> <DeleteIcon style={{color:'red'}}/> <EditIcon/></div>
            </div>
            })}
        </div>
        <Modal
            open={openEdit}
            onClose={handleCloseEdit}
        >
        <Box sx={style}>
        <div className="text-center text-xl font-semibold mb-3">
            تعديل بيانات الموظف
          </div>
          <div className="text-center text-xl font-semibold mb-3">
          <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <TextField
                  label ="الاسم"
                  placeholder={user?.name}
                  variant="outlined"
                  onChange={(e) => {setEdited({...edited,name:e.target.value})}}
                  style={{ width: "17rem",marginBottom:'8PX'}}
                  dir='rtl'
                />
              </ThemeProvider>
            </CacheProvider>
            <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <TextField
                  label="الرقم السري"
                  type="password"
                  variant="outlined"
                  onChange={(e) => {setEdited({...edited,password:e.target.value})}}
                  style={{ width: "17rem" ,marginBottom:'8PX' }}
                  dir='rtl'
                />
              </ThemeProvider>
            </CacheProvider>
            <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <TextField
                  label=" تأكيد الرقم السري"
                  type="password"
                  variant="outlined"
                  onChange={(e) => {setEdited({...edited,passwordConfirm:e.target.value})}}
                  style={{ width: "17rem" }}
                  dir='rtl'
                />
              </ThemeProvider>
            </CacheProvider>
            <div>
                {console.log(role)}
            <Checkbox checked={role == 'admin'} onClick={toggel}/>
            <label>تعيين كأدمن؟</label>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="bg-red-500 rounded-lg p-2 text-white font-bold" onClick={handleOpenDelete} >حذف</button>
            <button className="bg-green-500 rounded-lg p-2 text-white font-bold ml-2" onClick={handelEdit}  >تعديل</button>
            <button className="bg-black rounded-lg p-2 text-white font-bold ml-2" onClick={handleCloseEdit}>الغاء</button>
        </div>
        <Modal
            open={openDelete}
            onClose={handleCloseDelete}
        >
        <Box sx={style}>
        <div className="text-center text-xl font-semibold mb-3">
            تعديل بيانات الموظف
          </div>
          <div className="text-center text-xl font-semibold mb-3">
           
          </div>
          <div className="flex justify-center">
            <button className="bg-red-500 rounded-lg p-2 text-white font-bold" onClick={handelDelete} >حذف</button>
            <button className="bg-black rounded-lg p-2 text-white font-bold ml-2" onClick={handleCloseDelete}>الغاء</button>
        </div>
        </Box>
      </Modal>
        </Box>
      </Modal>
      
      </div>
    </div>
  )
}
