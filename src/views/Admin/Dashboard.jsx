import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import LineC from "../../components/charts/LineC";
import DTable from "../../components/tables/Dtable";
import "../../css/dash.css";
import AFNavbar from "../../components/AFNavbar";
import { Button } from "@mui/material";

export default function ADash() {
    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <AFNavbar />
            <div className="divf fdirc fullbg dashMain">
                <div className="dashbgI"></div>

                <section className="sect1">
                    <div className="divf wFull chartP">
                        <div className="chartCards posR">
                            <p className="chartDesc">No. of Students filled Feedback</p>
                            <LineC className="chartsFig" />
                        </div>
                        <div className="chartCards posR">
                            <p className="chartDesc">No. of Students filled Feedback</p>
                            <LineC className="chartsFig" />
                        </div>
                    </div>
                </section>

                <section className="sect2">
                    <p className="dashTT1">Faculty Feedback Data</p>
                    {/* <DTable /> */}
                </section>
                {/* <section>
                    <div className="divf comBox">
                        <Link to="/admin/departments">Go to Departments</Link>
                        <Link to="/admin/subjects">Go to Subjects</Link>
                        <Link to="/admin/faculties">Go to Faculties</Link>
                    </div>
                    <div className="divf comBox">
                        <Link to="/admin/theory-questions">Theory Questions</Link>
                        <Link to="/admin/practical-questions">Practical Questions</Link>
                    </div>
                </section> */}
                <Button variant="outlined" target="_blank" href="/admin/report">Preview</Button>
            </div>

        </>
    )
}