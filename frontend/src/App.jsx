import { Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import SignUp from "./pages/SignUp"
import LoginPage from "./pages/LoginPage"
import Navbar from "./components/Navbar"
import { Toaster } from "react-hot-toast"
import { userStore } from "./store/useUserStore"
import { useEffect } from "react"
import LoadingSpinner from "./components/LoadingSpinner"
import AdminPage from "./pages/AdminPage"
import CategoryPage from "./pages/CategoryPage"
import { useCartStore } from "./store/useCartStore"
import CartPage from "./pages/CartPage"
import { useLocation } from "react-router-dom"
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage"
// import Footer from "./components/Footer"


function App() {
  const {user,checkAuth,checkingAuth} = userStore()

  const {getCartItems} = useCartStore()
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ["/login", "/signup"];
    if (publicRoutes.includes(location.pathname)) return;

    const func = async () => {
      await checkAuth();
    };
    func();
  }, [checkAuth, location.pathname]);

  useEffect(() => {
    if(!user) return

    getCartItems();
  },[getCartItems,user])

  if(checkingAuth) return <LoadingSpinner/>

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">

      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user ? <SignUp /> : <Navigate to="/"/>} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/"/>} />
          <Route path="/secret-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login"/>} />
          <Route path="/category/:category" element={ <CategoryPage />}/>
          <Route path="/cart" element={ user ? <CartPage /> : <Navigate to="/login"/>}/>
          <Route />
          <Route path="/purchase-success" element={ user ? <PurchaseSuccessPage/> : <Navigate to="/login"/>}/>
          <Route />
        </Routes>
        {/* <Footer /> */}
      </div>
      <Toaster/>
    </div>
  )
}

export default App
