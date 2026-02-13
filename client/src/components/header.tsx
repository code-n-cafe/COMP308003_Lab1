import React from "react";

function Header() {
    const headerStyle: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        boxSizing: "border-box",       // ensure padding doesn't shift centering
        padding: "30px",          // symmetric horizontal padding
        backgroundColor: "#123884",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    };

    return (
        <header style={headerStyle}>
          <h1 style={{ margin: 0 }}>MyClasses</h1>
        </header>
    );
}

export default Header;