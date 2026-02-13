import React from "react";
import { useAuth } from "../context/AuthContext";

function SignOutFooter() {
    const { logout } = useAuth();
    const footerStyle: React.CSSProperties = {
        position: "fixed",
        bottom: 0,
        right: 0,
        width: "100%",
        boxSizing: "border-box",
        padding: "10px",
        backgroundColor: "#123884",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    };

    return (
        <footer style={footerStyle}>
          <button onClick={() => {
            logout();
            window.location.href = "/login";
          }}>Sign Out</button>
        </footer>
    );
}

export default SignOutFooter;