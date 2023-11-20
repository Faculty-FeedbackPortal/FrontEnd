import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';
import axios from "axios";
import { notifyE, notifyS } from "../../src/funcs/func1";
import { getCookie, isAuthenticated } from "../action/type";

const AppContext = createContext()

export default function AppProvider({ children }) {
    const fullLocation = useLocation();
    const cookies = new Cookies();
    const navigate = useNavigate();
    const flname = fullLocation.pathname;
    // const [Isauthenticated, setIsAuthenticated] = useState('')
    // console.log(fullLocation);
    // console.log(flname.split("/"));

    const isauthenticated = async () => {
        const result = await axios.get("http://localhost:8000/api/authenticated/", {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                // setIsAuthenticated(res.data['isAuthenticated']);
                return res.data.isAuthenticated
            })
            .catch((err) => {
                // notifyE("Can't fetch mapping, please try again!");
                return false;
            })

        // console.log(result);
        return result;


    }

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
        // if(loca)'
        var isAdminAuth = isauthenticated();
        const routesA = flname.split("/");
        if (routesA[1] == "admin" && !getCookie('token')) {
            // if(!isAdminAuth){
            if (routesA[2] != "register") {
                navigate("/admin/login");
            }

            // return false;

        }
        else if (routesA[1] == "admin" && routesA[2] == "login" && isAdminAuth) {
            navigate("/admin")

        }
        else if (routesA[1] == "admin" && isAuthenticated === false) {
            if (!isAdminAuth) {
                navigate("/admin/login");
            }
        }
    }, [flname]);

    return (
        <AppContext.Provider value={{ userI: 1 }}>{children}</AppContext.Provider>
    )
}

export const AppState = () => {
    return useContext(AppContext)
}