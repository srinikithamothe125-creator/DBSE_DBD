import {
  useEffect,
  useState
} from "react";

import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DonorDashboard from "./pages/DonorDashboard";
import Donations from "./pages/Donations";
import NgoDashboard from "./pages/NgoDashboard";


function App() {

  // ==========================================
  // CURRENT PAGE
  // ==========================================

  const [page, setPage] =
    useState("home");


  // ==========================================
  // CURRENT USER
  // ==========================================

  const [user, setUser] =
    useState(
      JSON.parse(
        localStorage.getItem(
          "foodconnect_user"
        )
      ) || null
    );


  // ==========================================
  // LOAD SAVED USER
  // ==========================================

  useEffect(() => {

    const savedUser =
      localStorage.getItem(
        "foodconnect_user"
      );

    if (savedUser) {

      setUser(
        JSON.parse(savedUser)
      );

    }

  }, []);


  // ==========================================
  // NAVIGATION
  // ==========================================

  function navigate(targetPage) {

    setPage(targetPage);

  }


  // ==========================================
  // LOGIN
  // ==========================================

  function handleLogin(userData) {

    setUser(userData);

    localStorage.setItem(
      "foodconnect_user",
      JSON.stringify(userData)
    );


    if (
      userData.role === "NGO"
    ) {

      setPage(
        "ngo-dashboard"
      );

    } else {

      setPage(
        "donor-dashboard"
      );

    }

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  function handleLogout() {

    localStorage.removeItem(
      "foodconnect_user"
    );

    setUser(null);

    setPage("home");

  }


  // ==========================================
  // APP UI
  // ==========================================

  return (

    <div className="app">

      {/* NAVBAR */}

      <Navbar
        user={user}
        onNavigate={navigate}
        onLogout={handleLogout}
      />


      <main>

        {/* HOME */}

        {page === "home" && (

          <Home
            onNavigate={navigate}
          />

        )}


        {/* LOGIN */}

        {page === "login" && (

          <Login
            onLogin={handleLogin}
            onNavigate={navigate}
          />

        )}


        {/* REGISTER */}

        {page === "register" && (

          <Register
            onNavigate={navigate}
          />

        )}


        {/* DONATIONS */}

        {page === "donations" && (

          <Donations
            user={user}
            onNavigate={navigate}
          />

        )}


        {/* DONOR DASHBOARD */}

        {page === "donor-dashboard" && (

          <DonorDashboard
            user={user}
            onNavigate={navigate}
          />

        )}


        {/* NGO DASHBOARD */}

        {page === "ngo-dashboard" && (

          <NgoDashboard
            user={user}
            onNavigate={navigate}
          />

        )}

      </main>


      {/* FOOTER */}

      <Footer />

    </div>

  );

}


export default App;