import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

const AppContext = createContext()

export default function AppProvider({ children }) {
    const fullLocation = useLocation();
    const cookies = new Cookies();
    const navigate = useNavigate();
    const flname = fullLocation.pathname;
    // console.log(fullLocation);
    // console.log(flname.split("/"));

    useEffect(() => {
        // console.log(fullLocation.pathname);
        // if (fullLocation.pathname === "/") {
        //     var anoL = cookies.get("user");
        //     var uDets = cookies.get("user2");
        //     if (!anoL) {
        //         cookies.remove("user2", { path: "/" });
        //         cookies.remove("theoryFeed", { path: "/" });
        //         cookies.remove("currQ", { path: "/" });
        //         navigate("/login");
        //     }
        //     else if (!uDets) {
        //         cookies.remove("theoryFeed", { path: "/" });
        //         cookies.remove("currQ", { path: "/" });
        //         navigate("/login/details");
        //     }
        // }
        // var ttoken = cookies.get("token", { path: "/" });
        // if(loca)

        console.log(flname.split("/"));
    }, [flname]);

    return (
        <AppContext.Provider value={{ userI: 1 }}>{children}</AppContext.Provider>
    )
}

export const AppState = () => {
    return useContext(AppContext)
}


