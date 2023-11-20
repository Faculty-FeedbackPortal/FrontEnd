import Navbar from "./Navbar";
import "../css/login.css";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { notifyE, notifyS } from "../funcs/func1";
import Cookies from 'universal-cookie';
import { useEffect, useState } from "react";
import { allData } from "../data/basicD";

export default function Login() {

    const navigate = useNavigate();
    const cookies = new Cookies();
    const [deptsD, setDeptsD] = useState([]);
    const [divsD, setDivsD] = useState([]);

    const timer = ms => new Promise(res => setTimeout(res, ms));

    const [studentD, setStudentD] = useState({
        "year": 0,
        "semester": 0,
        "batch": 0,
        "department": {},
        "division": {}
    });

    useEffect(() => {

        if (cookies.get("user2", { path: "/" })) {
            if (cookies.get("user", { path: "/" })) {
                navigate("/");
            }
            else {
                cookies.remove("user2", { path: "/" })
                navigate("/login");
            }
        }
        else {
            if (!cookies.get("user", { path: "/" })) {
                navigate("/login")
            }
        }
        fetchDept();
    }, []);

    useEffect(() => {
        fetchDiv();
    }, [studentD]);

    async function fetchDept() {
        axios.get("http://localhost:8000/api/department/")
            .then((res) => {
                var dubD = res.data;
                setDeptsD([...dubD]);
            })
            .catch((err) => {
                notifyE("Unable to fetch departments, please try again!")
            })

    }

    async function fetchDiv() {
        if (!studentD.department.id) {
            return;
        }
        await axios.get(`http://localhost:8000/api/division/?department=${studentD.department.id}`)
            .then((res) => {
                var dubDat = res.data;
                setDivsD([...dubDat]);
            })
            .catch((err) => {
                console.log(err);
                notifyE("Some error occurred in fetching divisions!");
            })
    }


    const doLoginDet = async (e) => {
        e.preventDefault()
        if (!studentD.semester || !studentD.year ||
            Object.keys(studentD.department).length === 0 ||
            Object.keys(studentD.division).length === 0 ||
            !studentD.batch) {
            notifyE("Please fill all details");
            return;
        }
        // console.log(studentD);
        cookies.set("user2", JSON.stringify(studentD), { maxAge: 18000, path: "/" });
        notifyS({ msg: "Successful" });
        await timer(400);
        navigate("/");
    }

    return (
        <>
            <Navbar />
            <div className="divf fullbg fullWH">
                <ToastContainer />
                <div className="dashbgI"></div>
                <form className="divf loginC fdirc">
                    <p className="f2 headT">Please Enter your details</p>
                    <div className="divf divInsL gapSM mUpM">
                        <p className="f1-5">Year</p>
                        <select placeholder="Year" className="insLU" value={studentD.year} onChange={(e) => { setStudentD({ ...studentD, year: Number(e.target.value) }); }}>
                            <option value=""></option>
                            {allData.courseYears.map((el) => {
                                return (
                                    <option value={el}>{el}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="divf divInsL gapSM mUpM">
                        <p className="f1-5">Semester</p>
                        <select placeholder="Year" className="insLU" value={studentD.semester} onChange={(e) => { setStudentD({ ...studentD, semester: Number(e.target.value) }); }}>
                            <option value=""></option>
                            {allData.semester.map((el) => {
                                return (
                                    <option value={el}>{el}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="divf divInsL gapSM mUpM">
                        <p className="f1-5">Department</p>
                        <select id="deptId1" placeholder="department" className="insLU" onChange={(e) => { setStudentD({ ...studentD, department: deptsD[Number(e.target.value)] }) }}>
                            <option value=""></option>
                            {deptsD.length && deptsD.map((el, i) => {
                                return (
                                    <option key={i} value={i}>{el.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="divf divInsL gapSM mUpM">
                        <p className="f1-5">Division</p>
                        <select placeholder="Year" className="insLU" onChange={(e) => { setStudentD({ ...studentD, division: divsD[Number(e.target.value)] }); }}>
                            <option value=""></option>
                            {divsD.length && divsD.map((el, i) => {
                                return (
                                    <option value={i} key={i}>{el.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="divf divInsL gapSM mUpM">
                        <p className="f1-5">Batch</p>
                        <select placeholder="Batch" className="insLU" onChange={(e) => { setStudentD({ ...studentD, batch: Number(e.target.value) }); }}>
                            <option value=""></option>
                            {studentD.division.num_pract_batch && [...Array(studentD.division.num_pract_batch).keys()].map((el) => {
                                return (
                                    <option value={el + 1} key={el + 1}>{el + 1}</option>
                                )
                            })}
                        </select>
                    </div>
                    <button className="doLog mUpM" onClick={(e) => { doLoginDet(e) }}>Next</button>
                </form>
            </div>
        </>
    )
}