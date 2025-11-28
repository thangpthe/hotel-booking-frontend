import { Routes, Route, Outlet, Navigate } from "react-router-dom"; 
import { Toaster } from "react-hot-toast"; 
import { AppContext } from "./context/AppContext";

// --- COMPONENTS ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// --- PAGES: CLIENT ---
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Rooms from './pages/Rooms';
import SingleRoom from "./pages/SingleRoom";
import About from "./pages/About";
import MyBookings from "./pages/MyBookings";

// --- PAGES: AUTH ---
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

// --- PAGES: OWNER ---
import OwnerLayout from "./pages/owner/OwnerLayout";
import AllHotels from "./pages/owner/AllHotels";
import RegisterHotel from "./pages/owner/RegisterHotel";
import AllRooms from "./pages/owner/AllRooms";
import AddRoom from "./pages/owner/AddRoom";
import Bookings from "./pages/owner/Bookings";
import OwnerRoute from "./components/OwnerRoute";
import Loader from "./components/Loader";
import SingleHotel from "./pages/SingleHotel";

// --- LAYOUTS ---
const MainLayout = () => {
  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <Navbar />
      <div style={{flexGrow: 1}}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const AuthLayout = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
       <Outlet />
    </div>
  )
}

// --- APP COMPONENT ---
const App = () => {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        
      
        <Route element={<MainLayout />}>
          <Route path='/' element={<Home/>}/>
          <Route path='/hotels' element={<Hotels/>}/>
          <Route path="/hotel/:id" element={<SingleHotel />} />
          <Route path='/rooms' element={<Rooms/>}/>
          <Route path='/rooms/:id' element={<SingleRoom/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/my-bookings' element={<MyBookings/>}/>
          <Route path='/loader/:nextUrl' element={<Loader/>}/>
        </Route>

       
        <Route element={<AuthLayout />}>
           <Route path='/signup' element={<SignUp/>}/>
           <Route path='/login' element={<Login/>}/>
        </Route>

      
        <Route path="/owner" element={<OwnerLayout/>}>
             <Route index path="dashboard"  element={<OwnerRoute><AllHotels/></OwnerRoute>} />
             <Route path="hotels" element={<OwnerRoute><AllHotels/></OwnerRoute>} />
             <Route path="register-hotel" element={<OwnerRoute><RegisterHotel/></OwnerRoute>} />
             <Route path="rooms" element={<OwnerRoute><AllRooms/></OwnerRoute>} />
             <Route path="add-room" element={<OwnerRoute><AddRoom/></OwnerRoute>} />
             <Route path="bookings" element={<OwnerRoute><Bookings/></OwnerRoute>} />
            
        </Route>

      </Routes>
    </div>
  )
}

export default App;