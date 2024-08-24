import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../../components/(Admin)/navBar";
import SideNab from "../../components/(Admin)/sideNab";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  const isLoggedIn = localStorage.getItem("accessToken");
  const isRefreshToken = localStorage.getItem("refreshToken");
  const [isRefreshTokenDeleted, setIsRefreshTokenDeleted] = useState(false);
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     toast.success("You are logged in successfully!");
  //   }
  //   if (!isLoggedIn) {
  //     navigate("/NoAccess");
  //   }
  //   // if (!isRefreshToken) {
  //   //   navigate("/RefreshToken");
  //   // }
  //   // const checkAndDeleteRefreshToken = async () => {
  //   //   const localStorageRefreshToken = localStorage.getItem("refreshToken");

  //   //   if (localStorageRefreshToken) {
  //   //     const timeoutId = setTimeout(() => {
  //   //       setIsRefreshTokenDeleted(true);
  //   //       navigate("/RefreshToken");
  //   //     }, 3000);

  //   //     return () => clearTimeout(timeoutId);
  //   //   }
  //   // };

  //   // checkAndDeleteRefreshToken();
  // }, []);
  return (
    <>
      {dir === "ltr" ? (
        <div className="h-[100vh] w-full grid grid-cols-12">
          <Toaster />

          {/* Navbar */}
          <div className="col-span-12 fixed top-0 w-full z-10 flex h-[10%]">
            <NavBar />
          </div>

          {/* Sidebar */}
          <aside className="col-start-3 left-0 col-span-2 fixed top-[10vh] min-w-[16%]  bottom-0 h-[calc(100vh-10vh)] z-10">
            <SideNab />
          </aside>

          {/* Main content area */}
          <div
            dir="ltr"
            className=" col-span-10 w-full h-[calc(100vh-10vh)] overflow-y-auto ml-auto mt-[10vh]"
          >
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="h-[100vh] w-full grid grid-cols-12">
          <Toaster />

          {/* Navbar */}
          <div className="col-span-12 fixed top-0 w-full z-10 flex h-[10%]">
            <NavBar />
          </div>

          {/* Sidebar */}
          <aside className=" right-0 col-span-2 fixed top-[10vh] min-w-[16%]  bottom-0 h-[calc(100vh-10vh)] z-10">
            <SideNab />
          </aside>

          {/* Main content area */}
          <div
            dir="rtl"
            className="col-start-3 col-span-10 w-full h-[calc(100vh-10vh)] overflow-y-auto ml-auto mt-[10vh]"
          >
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}
