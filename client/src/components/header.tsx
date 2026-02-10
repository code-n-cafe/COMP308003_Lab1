import React from "react";

function Header() {
    const headerStyle: React.CSSProperties = {
        backgroundColor: "#282c34",
        padding: "20px",
        color: "white",
        textAlign: "center",
    };

    return (
        <header style={headerStyle}>
        <h1>MyClasses</h1>
        </header>
    );
    }

export default Header;