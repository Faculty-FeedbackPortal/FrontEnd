import { AddAPhoto, AddCircleRounded, PlusOne } from "@material-ui/icons";
import Navbar from "../../components/Navbar";
import LineC from "../../components/charts/LineC";
import DTable from "../../components/tables/Dtable";
import "../../css/dash.css";
import Button from '@mui/material/Button';
import React, { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import { TextField } from "@mui/material";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { notifyE, notifyS } from "../../funcs/func1";
import Cookies from "universal-cookie";
import { allData } from "../../data/basicD";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { getCookie } from "../../action/type";
import AFNavbar from "../../components/AFNavbar";
// import AddIcon from '@mui/icons-material/Add';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'rgba(255, 255, 255, 1)',
    // border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: '13px'
};

export default function ACPractQ() {
    const cookies = new Cookies(null, { path: '/' });

    const [divisionsD, setDivsData] = useState({ data: [] });
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [deptD, setDeptD] = useState({ rows: [], columns: [] });
    const [dName, setDname] = useState("");
    const [qData, setQData] = useState({ number: 0, question: "", option1: "", option2: "", option3: "", option4: "" });
    const [opAddD, setOpAddD] = useState(false);
    const [opViewD, setOpViewD] = useState(false);
    const [allQsD, setAllQD] = useState({ rows: [], columns: [] });

    useEffect(() => {
        fetchAllQs();
    }, [])

    async function addQs() {
        var qDum = { ...qData };
        qDum.number = allQsD.rows.length ? allQsD.rows.length + 1 : 1
        await axios.post("http://localhost:8000/api/pracquest/", qDum, {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                // console.log(res.data);
                fetchAllQs();
                setOpen(false);
            })
            .catch((err) => {
                console.log(err);
                notifyE("Some error occurred!");
            })

    }

    async function addQuesF() {
        if (!qData.number) {
            var qNum = allQsD.rows.length ? allQsD.rows.length + 1 : 1
            setQData({ ...qData, number: qNum })
        }
        if (!qData.question || !qData.option1 || !qData.option2 || !qData.option3 || !qData.option4) {
            notifyE("Please fill all details");
            return;
        }
        addQs();
    }

    async function fetchAllQs() {
        axios.get("http://localhost:8000/api/pracquest/", {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                // console.log(res.data);
                var dubD = { ...allQsD };
                var datD = res.data;
                datD.map((el, index) => {
                    el.id = index + 1;
                })
                dubD.rows = datD;
                dubD.columns = [
                    { field: 'id', headerName: 'Id', width: 20 },
                    { field: 'number', headerName: 'Q Number', width: 40 },
                    { field: 'question', headerName: 'Question', width: 300 },
                    { field: 'option1', headerName: 'Option1', width: 100 },
                    { field: 'option2', headerName: 'Option2', width: 100 },
                    { field: 'option3', headerName: 'Option3', width: 100 },
                    { field: 'option4', headerName: 'Option4', width: 100 }
                ]
                setAllQD({ ...dubD });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            <Navbar />
            <div className="divf fdirc fullbg dashMain">
                <ToastContainer />
                <div className="dashbgI"></div>
                {/* <p className="uTypeN"><Link to="/admin" >Admin Dashboard</Link></p> */}
                <AFNavbar />
                <section className="paddM">
                    <div className="divf jusSB">
                        <p className="dashTT1">Practical Questions</p>
                        <Button className="muiButOut" variant="outlined" endIcon={<AddCircleRounded />} onClick={handleOpen}>Add Practical Question</Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Add Practical Question
                                </Typography>
                                <TextField id="filled-basic" type="Number" label="Question Number"
                                    value={allQsD.rows.length ? allQsD.rows.length + 1 : 1}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    size="small" />
                                <TextField id="filled-basic" label="Question" onChange={(e) => {
                                    setQData({ ...qData, question: e.target.value })
                                }
                                } size="small" />
                                <TextField id="filled-basic" label="Option1" onChange={(e) => {
                                    setQData({ ...qData, option1: e.target.value })
                                }
                                } size="small" />
                                <TextField id="filled-basic" label="Option2" onChange={(e) => {
                                    setQData({ ...qData, option2: e.target.value })
                                }
                                } size="small" />
                                <TextField id="filled-basic" label="Option3" onChange={(e) => {
                                    setQData({ ...qData, option3: e.target.value })
                                }
                                } size="small" />
                                <TextField id="filled-basic" label="Option4" onChange={(e) => {
                                    setQData({ ...qData, option4: e.target.value })
                                }
                                } size="small" />
                                <Button variant="contained" onClick={addQuesF}>Save</Button>
                            </Box>
                        </Modal>
                    </div>
                    {allQsD.rows.length ? <DTable data={allQsD} /> : <></>}
                </section>
            </div>
        </>
    )
}
