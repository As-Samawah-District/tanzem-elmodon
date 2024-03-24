import Login from "./Authenticaton/Login";
import Signup from "./Authenticaton/Signup";
import { Database } from "./DataBase/Database";
import Create from "./Form/Create";
import Forms from "./Form/Forms";
import Print from "./Form/Print";
import {
  Routes,
  BrowserRouter,
  Route,
  useBeforeUnload,
} from "react-router-dom";
import Logs from "./Logs/Logs";
import Users from "./users/Users";
import Form from "./Form/Form";
function App() {
  return (
    <>
      <Routes>
        <Route exact path="/addform" element={<Create />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/print" element={<Print />} />
        <Route exact path="/logs" element={<Logs />} />
        <Route exact path="/users" element={<Users/>}/>
        <Route exact path="/addforms" element={<Form/>}/>
        <Route exact path="/database" element={<Database/>}/>
        <Route exact path="*" element={<Forms />} />
      </Routes>
    </>
  );
}

export default App;
