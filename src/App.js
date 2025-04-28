import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Authentication/signup.js";
import Login from "./Authentication/login.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./dashboard/dashboard.js";
import AddEmployee from "./Dashboard/AddEmployee.js";
import EditEmployee from "./Dashboard/EditEmployee.js";
import AddDepartment from './Dashboard/AddDepartment.js';
import DeleteEmployee from "./Dashboard/DeleteEmployee.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/add-employee" element={<AddEmployee/>}/>
        <Route path="/edit-employee/:id" element={<EditEmployee/>}/>
        <Route path="/add-department/" element={<AddDepartment/>}/>
        <Route path="/delete-employee/:id" element={<DeleteEmployee/>}/>


      </Routes>
    </Router>
  );
}

export default App;