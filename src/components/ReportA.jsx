import AFNavbar from "./AFNavbar";
import Navbar from "./Navbar";
import somLogo from "../img/somaiyaLogo.jpg";
import somTrust from "../img/somaiyaTrust.png";
import "../css/report.css";
import { useState } from "react";
// import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ReportA() {
    const [dumData, setDumD] = useState([0, 0, 0, 0, 0])

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
                    <div id="idMainReport" className="divf fdirc mainR">
                        <section className="divf fdirc">
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
                                <p>Faculty - Yash Chauhan | Subject - Data Structures</p>
                                <p>Faculty Feedback - Batch 1</p>
                            </div>
                            <table className="reportT">
                                <thead>
                                    <tr>
                                        <th colspan="2"></th>
                                        {/* <th></th> */}
                                        <th colspan="5">{"Attendance<60%"}</th>
                                        <th colspan="5">{"Attendance>60%"}</th>
                                    </tr>
                                    <tr>
                                        <th>SR. No.</th>
                                        <th>Parameter</th>
                                        <th>Very good</th>
                                        <th>Good</th>
                                        <th>Average</th>
                                        <th>Poor</th>
                                        <th>Score</th>
                                        <th>Very good</th>
                                        <th>Good</th>
                                        <th>Average</th>
                                        <th>Poor</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dumData.map((el, index) => {
                                        return (
                                            <>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>Organization of lecture, Practical & Tutorial</td>
                                                    <td>0.0</td>
                                                    <td>0.0</td>
                                                    <td>0.0</td>
                                                    <td>0.0</td>
                                                    <td>0.0</td>
                                                    <td>0.0</td>
                                                    <td>0.0</td>
                                                    <td>0.0</td>
                                                    <td>0.0</td>
                                                    <td>0.0</td>
                                                </tr>
                                            </>
                                        )
                                    })}

                                </tbody>
                            </table>
                            <div className="divf fdirc pdiv1 dangerZ">
                                <p>Low Attendance Students Count: O Score: 0.00 = 0%</p>
                                <p>High Attendance Students Count: 15 Score: 4.0 = 95%</p>
                                <p>Total Number of Students Count: 15 | Total Score: 4.0 = 95%</p>
                            </div>
                        </section>
                        <div className="sectDivider"></div>

                    </div>
                </div>
            </div>
        </>
    )
}