// // client/src/pages/LoginPage.jsx
import { Box, styled } from "@mui/material";
import DisclaimerNotice from "../../components/Auth/DisclaimerNotice";
import Logo from "../../components/Logo/Logo";

const AuthContainer = styled(Box)(() => ({
  width: "800px",
  minHeight: "40vh",
  margin: "40px auto",
}));

const BookBackground = styled(Box)(({ theme }) => ({
  display: "fixed",
  width: "100%",
  height: "100%",
  boxShadow: theme.shadows[3],
  backgroundImage: 'url("/assets/images/0030981ea4dd5ffddb8f07fc66a3c9a5.jpg")',
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "8px",
  overflow: "hidden",
}));

const NoticePanel = styled(Box)(({ theme }) => ({
  width: "50%",
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  overflowY: "auto",
}));

const AuthPanel = styled(Box)(({ theme }) => ({
  width: "50%",
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(3),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  overflowY: "auto",
}));

const AuthLayout = ({ children }) => {
  return (
    <AuthContainer>
      <BookBackground>
        <NoticePanel>
          <DisclaimerNotice />
        </NoticePanel>
        <AuthPanel>
          <Logo sx={{ mb: 2, alignSelf: "center" }} />
          {children}
        </AuthPanel>
      </BookBackground>
    </AuthContainer>
  );
};

export default AuthLayout;
