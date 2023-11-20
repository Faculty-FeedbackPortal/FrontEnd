import AFNavbar from "./AFNavbar";
import Navbar from "./Navbar";
import somLogo from "../img/somaiyaLogo.jpg";
import somTrust from "../img/somaiyaTrust.png";
import "../css/report.css";
import { useEffect, useState } from "react";
// import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { getCookie } from "../action/type";

export default function ReportA() {
    const [dumData, setDumD] = useState([0, 0, 0, 0, 0])
    const [reportDat, setReportD] = useState();
    const [theoryQ, setTQ] = useState();
    const [practQ, setPQ] = useState();

    useEffect(() => {
        async function callCalc() {
            await axios.get("http://localhost:8000/api/calculate/", {
                headers: {
                    'Authorization': `Token ${getCookie('token')}`
                }
            })
                .then((res) => {
                    console.log(res.data);
                    setReportD({ ...res.data });
                })
                .catch((err) => {
                    console.log(err);

                })
        }
        callCalc();
        async function fetchAllQs() {
            await axios.get("http://localhost:8000/api/theoryquest/", {
                headers: {
                    'Authorization': `Token ${getCookie('token')}`
                }
            })
                .then((res) => {
                    setTQ([...res.data]);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        fetchAllQs();
        async function fetchAllPQs() {
            await axios.get("http://localhost:8000/api/pracquest/", {
                headers: {
                    'Authorization': `Token ${getCookie('token')}`
                }
            })
                .then((res) => {
                    setPQ([...res.data]);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        fetchAllPQs();
    }, []);



    const downloadReport = () => {
        const report = document.getElementById("idMainReport");
        html2canvas(report)
            .then((reportCanvas) => {
                const imgReportData = reportCanvas.toDataURL("img/png");
                const reportDoc = new jsPDF("l", "mm", "a4");
                const repWidth = reportDoc.internal.pageSize.getWidth();
                const repHieght = reportDoc.internal.pageSize.getHeight();

                reportDoc.addImage(imgReportData, "PNG", 0, 0, repWidth, repHieght);
                reportDoc.save("faculty-report.pdf")
            })
    }


    return (
        <>
            <Navbar />
            <AFNavbar />
            <div className="divf fdirc fullbg dashMain aPaddF">
                <div className="dashbgI"></div>
                <div className="divf fdirc fGapS f1-2 boldT headToR" style={{ "alignItems": "start" }}>
                    <p>Report Preview</p>
                    <p>Download it from here: <Button variant="outlined" onClick={downloadReport}>Download</Button></p>
                </div>
                <div className="divf carReport">
                    <div className="divf fdirc mainR">
                        <section id="idMainReport" className="divf fdirc">
                            <div className="divf jusSB" style={{ "width": "100%" }}>
                                <div className="divf fGapS ">
                                    <img src={somLogo} className="somLogo" />
                                    <div className="kjsit">
                                        <p className="kjhead">K. J. Somaiya Institute of Technology, Sion</p>
                                        <p>An Autonomous Institute Permanently Affiliated to the University of Mumbai</p>
                                    </div>
                                </div>
                                <img src={somTrust} className="somTrust" />
                            </div>
                            <div className="divf fdirc pdiv1 col-b f1-1 boldT">
                                <p>Faculty Feedback Report 1 - 2023-24 Odd Semester</p>
                                <p>Faculty - {reportDat ? reportDat.faculty : ""} | Subject - {reportDat ? reportDat.subject : ""}</p>
                                <p>Theory Feedback - Batch {reportDat ? reportDat.batch : ""}</p>
                            </div>
                            <table className="reportT">
                                <thead>
                                    <tr>
                                        <th colspan="2"></th>
                                        {/* <th></th> */}
                                        <th colspan="1">{"Attendance<60%"}</th>
                                        <th colspan="1">{"Attendance>60%"}</th>
                                    </tr>
                                    <tr>
                                        <th>SR. No.</th>
                                        <th>Parameter</th>
                                        {/* <th>Very good</th>
                                        <th>Good</th>
                                        <th>Average</th>
                                        <th>Poor</th> */}
                                        <th>Score</th>
                                        {/* <th>Very good</th>
                                        <th>Good</th>
                                        <th>Average</th>
                                        <th>Poor</th> */}
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportDat && theoryQ && theoryQ.map((el, index) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{theoryQ[index] ? theoryQ[index].question : "Sample question"}</td>
                                                    <td>{reportDat.above.theory_q[index]}</td>
                                                    <td>{reportDat.below.theory_q[index]}</td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div className="divf fdirc pdiv1 dangerZ">
                                <p>Low Attendance Students Count: {reportDat ? reportDat.below.lowt : 0} | Score: {reportDat ? reportDat.below.theory : 0} = {reportDat ? (reportDat.below.theory / 4) * 100 : 0}</p>
                                <p>High Attendance Students Count: {reportDat ? reportDat.above.hight : 0} | Score: {reportDat ? reportDat.above.theory : 0} = {reportDat ? (reportDat.above.theory / 4) * 100 : 0}</p>
                                <p>Total Number of Students Count: {reportDat ? reportDat.totalt : ""} | Total Score: {reportDat ? (reportDat.above.theory + reportDat.below.theory) / 2 : ""}</p>
                            </div>
                        </section>
                        <div className="sectDivider"></div>
                        <section id="idMainReport" className="divf fdirc">
                            <div className="divf jusSB" style={{ "width": "100%" }}>
                                <div className="divf fGapS ">
                                    <img src={somLogo} className="somLogo" />
                                    <div className="kjsit">
                                        <p className="kjhead">K. J. Somaiya Institute of Technology, Sion</p>
                                        <p>An Autonomous Institute Permanently Affiliated to the University of Mumbai</p>
                                    </div>
                                </div>
                                <img src={somTrust} className="somTrust" />
                            </div>
                            <div className="divf fdirc pdiv1 col-b f1-1 boldT">
                                <p>Faculty Feedback Report 1 - 2023-24 Odd Semester</p>
                                <p>Faculty - {reportDat ? reportDat.faculty : ""} | Subject - {reportDat ? reportDat.subject : ""}</p>
                                <p>Practical Feedback - Batch {reportDat ? reportDat.batch : ""}</p>
                            </div>
                            <table className="reportT">
                                <thead>
                                    <tr>
                                        <th colspan="2"></th>
                                        {/* <th></th> */}
                                        <th colspan="1">{"Attendance<60%"}</th>
                                        <th colspan="1">{"Attendance>60%"}</th>
                                    </tr>
                                    <tr>
                                        <th>SR. No.</th>
                                        <th>Parameter</th>
                                        {/* <th>Very good</th>
                                        <th>Good</th>
                                        <th>Average</th>
                                        <th>Poor</th> */}
                                        <th>Score</th>
                                        {/* <th>Very good</th>
                                        <th>Good</th>
                                        <th>Average</th>
                                        <th>Poor</th> */}
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportDat && practQ && practQ.map((el, index) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{practQ[index] ? practQ[index].question : "Sample question"}</td>
                                                    <td>{reportDat.above.practical_q[index]}</td>
                                                    <td>{reportDat.below.practical_q[index]}</td>
                                                </tr>
                                            </>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <div className="divf fdirc pdiv1 dangerZ">
                                <p>Low Attendance Students Count: {reportDat ? reportDat.below.lowp : 0} | Score: {reportDat ? reportDat.below.practical : 0} = {reportDat ? (reportDat.below.practical / 4) * 100 : 0}</p>
                                <p>High Attendance Students Count: {reportDat ? reportDat.above.highp : 0} | Score: {reportDat ? reportDat.above.practical : 0} = {reportDat ? (reportDat.above.practical / 4) * 100 : 0}</p>
                                <p>Total Number of Students Count: {reportDat ? reportDat.totalp : ""} | Total Score: {reportDat ? (reportDat.above.practical + reportDat.below.practical) / 2 : ""}</p>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </>
    )
}