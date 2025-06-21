// client/src/components/Layout/Layout.js
import Navbar from "./Header/Navbar";
import Footer from "./Footer/Footer";
import ChatButton from "../Chat/ChatButton";
import { Box } from "@mui/material";
import useAuth from "../../hooks/useAuth";

export default function Layout({ children }) {
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", position: "relative" }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1}}>
        {children}
      </Box>
      <Footer />
      {user && <ChatButton />}
    </Box>
  );
}