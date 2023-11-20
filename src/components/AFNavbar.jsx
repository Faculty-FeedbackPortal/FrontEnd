import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faPerson, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AFNavbar() {

    const [userDash, setuserDash] = useState(false);

    return (
        <>
            <div className="divf uTypeN jusSB">

                <p className="divf fnavHead">
                    <button id="idMenubt" className="menuBt"
                        onClick={() => { document.getElementById("idSlider").classList.add("showSlider") }}
                    >
                        <span>{">>"}</span>
                    </button>
                    <Link className="linkAnim1" to="/admin">Admin Dashboard</Link>
                    <div className="divf quickLSect" style={{ "gap": "1rem" }}>
                        <p>|</p>
                        <div className="divf quicklk">
                            <p className="col-b">Quick links:</p>
                            <Link className="linkAnim1" to="/admin/departments">Departments</Link>
                            <Link className="linkAnim1" to="/admin/subjects">Subjects</Link>
                            <Link className="linkAnim1" to="/admin/faculties">Faculties</Link>
                            <div
                                onMouseLeave={() => {
                                    document.getElementById("idHovDash").classList.remove("showHD")
                                }}>
                                <p className="linkAnim1 hovQD" onMouseEnter={() => {
                                    document.getElementById("idHovDash").classList.add("showHD")
                                }}
                                    onMouseLeave={() => {
                                        document.getElementById("idHovDash").classList.remove("showHD")
                                    }}
                                >Questions</p>
                                <div id="idHovDash" className="divf fdirc HovDash"
                                    onMouseEnter={() => {
                                        document.getElementById("idHovDash").classList.add("showHD")
                                    }}
                                >
                                    <Link className="linkAnim1" to="/admin/practical-questions">Practical Questions</Link>
                                    <Link className="linkAnim1" to="/admin/theory-questions">Theory Questions</Link>
                                </div>

                            </div>

                        </div>
                    </div>
                </p>
                <div className="posR usDD"
                    onMouseLeave={() => {
                        document.getElementById("iduserDash").classList.remove("showPD")
                    }}
                >
                    <button className="userProfile" onClick={() => { setuserDash(true) }}
                        onMouseEnter={() => {
                            document.getElementById("iduserDash").classList.add("showPD")
                        }}
                    ><FontAwesomeIcon icon={faUser} /></button>
                    <div id="iduserDash" className="divf fdirc HovDash profDash"
                        onMouseEnter={() => {
                            document.getElementById("iduserDash").classList.add("showPD")
                        }}
                    >
                        <button>Logout</button>
                        {/* <Link className="linkAnim1">Practical Questions</Link>
                        <Link className="linkAnim1">Theory Questions</Link> */}
                    </div>
                </div>

            </div>
            <div id="idSlider" className="divf fdirc slider jusSB">
                <div className="divf fdirc slidTopCont">
                    <div className="divf jusSB slidHead">
                        <p>Admin Dashboard</p>
                        <button className="menuBt"
                            onClick={() => { document.getElementById("idSlider").classList.remove("showSlider") }}
                        >
                            <span>{"<<"}</span>
                        </button>
                    </div>
                    <div className="divf fdirc slidQL">
                        <p className="col-b">Quick Links</p>
                        <Link className="">Departments</Link>
                        <Link className="">Subjects</Link>
                        <Link className="">Faculties</Link>
                        <Link className="">Practical Questions</Link>
                        <Link className="">Theory Questions</Link>
                    </div>
                </div>
                <button className="slidbts">Logout</button>
            </div>
        </>
    )
}