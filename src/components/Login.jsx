import Navbar from "./Navbar";
import React, { useEffect, useState } from "react";
import "../css/login.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import { notifyE, notifyS } from "../funcs/func1";

export default function Login() {

    const navigate = useNavigate();
    const cookies = new Cookies();
    const [user1, setUser1] = useState();
    const [pass1, setPass1] = useState();

    const timer = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
        if (cookies.get("user", { path: "/" })) {
            if (cookies.get("user2", { path: "/" })) {
                navigate("/");
            }
            else {
                navigate("/login/details");
            }
        }
    }, [])


    function retId(idname) {
        return document.getElementById(idname);
    }

    const doLogin = async (e) => {
        e.preventDefault()
        if (!user1 || !pass1) {
            notifyE("Fill all details");
            return;
        }
        if (user1 === "high" && pass1 === "1234") {
            notifyS({ msg: "Successful" });
            cookies.set("user", user1, { path: "/", maxAge: 18000 })
            retId("idDoLog").setAttribute("disabled", "disabled");
            await timer(500);
            navigate("/login/details");
        }
        else if (user1 === "low" && pass1 === "1234") {
            notifyS({ msg: "Successful" });
            cookies.set("user", user1, { path: "/", maxAge: 18000 });
            retId("idDoLog").setAttribute("disabled", "disabled");
            await timer(500);
            navigate("/login/details");
        }
        else {
            notifyE("Wrong Credentials");
        }
        // notifyS();
        // notifyE("Error!");
    }

    return (
        <>
            <Navbar />

            <div className="divf fullbg fullWH">
                <ToastContainer />
                <div className="dashbgI"></div>
                {/* <div > */}
                <form className="divf loginC fdirc">
                    <p className="f2 headT">Login</p>
                    <div className="divf divInsL gapSM mUpM">
                        <p className="f1-5">Username</p>
                        <input placeholder="username" className="insLU" onChange={(e) => { setUser1(e.target.value) }} />
                    </div>
                    <div className="divf divInsL gapSM">
                        <p className="f1-5">Password</p>
                        <input type="password" placeholder="password" className="insLU" onChange={(e) => { setPass1(e.target.value) }} />
                    </div>
                    <div className="divf mUpM wFull">
                        {/* <button className="f1-2">Forgot Password?</button> */}
                        <button id="idDoLog" className="doLog" onClick={(e) => { doLogin(e) }}>Login</button>
                    </div>
                </form>
                {/* </div> */}
            </div>

        </>
    )
}