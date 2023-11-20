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
import Swal from "sweetalert2";
import AFNavbar from "../../components/AFNavbar";
// import 'sweetalert2/src/sweetalert2.scss'
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

function ChildModal(props) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button onClick={handleOpen} variant="contained">View</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, top: "10%", transform: 'translate(-50%, 0%)' }}>
                    <h2 id="child-modal-title">Division {props.data.name}</h2>
                    <p>Number of Practical bacth: {props.data.num_pract_batch}</p>
                    <p>Number of Tutorial bacth: {props.data.num_tutorial_batch}</p>
                    <Button onClick={handleClose} variant="contained">Close</Button>
                </Box>
            </Modal>
        </React.Fragment>
    );
}


export default function ADept() {
    const cookies = new Cookies(null, { path: '/' });

    const [divisionsD, setDivsData] = useState({ data: [] });
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [deptD, setDeptD] = useState({ rows: [], columns: [] });
    const [dName, setDname] = useState("");
    const [addDivD, setAddDivD] = useState({ department: "", deptN: "", name: "", num_pract_batch: 0, num_tutorial_batch: 0 });
    const [opAddD, setOpAddD] = useState(false);
    const [opViewD, setOpViewD] = useState(false);
    const [fileU, setFileU] = useState();


    async function fetchDept() {
        axios.get("http://localhost:8000/api/department/",
            {
                headers: {
                    'Authorization': `Token ${getCookie('token')}`
                }
            })
            .then((res) => {
                // console.log(res.data);
                var dubD = { ...deptD };
                dubD.rows = res.data;
                dubD.columns = [
                    { field: 'id', headerName: 'Id', width: 150 },
                    { field: 'name', headerName: 'Department', width: 150 },
                    {
                        field: 'add_division',
                        headerName: 'Add Division',
                        renderCell: (cellValue) => {
                            return (
                                <Button variant="outlined"
                                    // color="secondary"
                                    size="small"
                                    onClick={(event) => {
                                        addDivision(event, cellValue);
                                    }}
                                >Add
                                </ Button>
                            )
                        },
                        width: 120
                    },
                    {
                        field: 'view_divisions',
                        headerName: 'View Divisions',
                        renderCell: (cellValue) => {
                            return (
                                <Button variant="contained"
                                    // color="secondary"
                                    size="small"
                                    onClick={(event) => {
                                        showDivisions(event, cellValue);
                                    }}
                                >View
                                </ Button>
                            )
                        },
                        width: 140
                    }
                ]
                setDeptD({ ...dubD });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    async function addDivision(event, cellValue) {
        setAddDivD({ ...addDivD, department: cellValue.row.id, deptN: cellValue.row.name })
        setOpAddD(true);
    }

    async function showDivisions(event, cellValue) {
        await axios.get(`http://localhost:8000/api/division/?department=${cellValue.row.id}`, {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                var dubDat = { ...divisionsD };
                dubDat.data = res.data;
                setDivsData({ ...dubDat });
                setOpViewD(true);
            })
            .catch((err) => {
                console.log(err);
                notifyE("Some error occurred!");
            })

    }

    // useEffect(() => {
    //     console.log(divisionsD);
    //     if (divisionsD.data.length) {
    //         setOpViewD(true);
    //     }

    // }, [divisionsD]);

    async function createDivision() {
        if (!addDivD.name || !addDivD.department) {
            notifyE("Please fill all fields!");
            return;
        }
        var dubD = { ...addDivD };
        delete dubD.deptN;
        // console.log(dubD);
        await axios.post("http://localhost:8000/api/division/", { ...dubD },
            {
                headers: {
                    'Authorization': `Token ${getCookie('token')}`
                }
            })
            .then((res) => {
                notifyS({ msg: "Division Successfully created!" })
                setOpAddD(false);
                fetchDept();
                setAddDivD({ department: "", deptN: "", name: "", num_pract_batch: 0, num_tutorial_batch: 0 });
            })
            .catch((err) => {
                console.log(err);
                notifyE("Some error occurred!");
            })
    }

    useEffect(() => {

        fetchDept();
    }, []);

    async function addDept() {
        if (fileU) {
            console.log(fileU);
            Swal.fire({
                title: `Do you want to save <u>${fileU.name}</u> ? This can't be undone!`,
                showDenyButton: true,
                confirmButtonText: 'Save',
                denyButtonText: `Don't save`,
                allowOutsideClick: false,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    // const { title, content, file } = fileU;
                    // const allBody = { title, content, file };
                    // console.log(allBody);
                    async function postFile() {
                        await axios.post("http://localhost:8000/api/departmentbulk/", { "file": fileU },
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
                                    // "Accept": "application/json",
                                    'Authorization': `Token ${getCookie('token')}`
                                }
                            }
                        )
                            .then(
                                (res) => {
                                    // console.log(res)
                                    Swal.fire('Saved!', '', 'success')
                                    setOpen(false);
                                    fetchDept();
                                }
                            )
                            .catch(
                                (err) => {
                                    // console.log(err.response)
                                    Swal.fire('Changes are not saved', '', 'info')
                                }
                            )
                    }
                    postFile();

                } else if (result.isDenied) {
                    Swal.fire('Changes are not saved', '', 'info')
                }
            })
            return;
        }
        if (!dName) {
            notifyE("Please fill Department Name!")
            return;
        }
        else {
            console.log(`Token ${getCookie('token')}`);

            await axios.post("http://localhost:8000/api/department/", { "name": dName },
                {
                    headers: {
                        'Authorization': `Token ${getCookie('token')}`
                    }
                })
                .then((res) => {
                    setDname();
                    notifyS({ msg: "Successfully created!" })
                    setOpen(false);
                    fetchDept();
                })
                .catch((err) => {
                    console.log(err);
                    notifyE("Some error occurred!");
                })

        }

    }

    return (
        <>
            <Navbar />
            <div className="divf fdirc fullbg dashMain">
                <ToastContainer />
                <div className="dashbgI"></div>
                {/* <Link className="uTypeN" to="/admin">Admin Dashboard</Link> */}
                <AFNavbar />
                <section className="paddM">
                    <div className="divf jusSB">
                        <p className="dashTT1">Departments data</p>
                        <Button className="muiButOut" variant="outlined" endIcon={<AddCircleRounded />} onClick={handleOpen}>Add Department</Button>

                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Add Department
                                </Typography>
                                <input type="file" className="uplFileIns" onChange={(e) => { setFileU(e.target.files[0]) }} />
                                <div className="orShowT">
                                    OR
                                </div>
                                <TextField id="filled-basic" label="Department Name" onChange={(e) => { setDname(e.target.value) }}
                                    size="small" />
                                <Button variant="contained" onClick={addDept}>Save</Button>
                            </Box>
                        </Modal>
                    </div>
                    {deptD.rows.length ? <DTable data={deptD} /> : <></>}
                    <Modal
                        open={opAddD}
                        onClose={() => setOpAddD(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Add Division
                            </Typography>
                            <TextField
                                label="Department"
                                defaultValue={addDivD.deptN}
                                InputProps={{
                                    readOnly: true,
                                }}
                                size="small"
                            />
                            <TextField
                                label="Division"
                                value={addDivD.name}
                                onChange={(e) => { setAddDivD({ ...addDivD, name: e.target.value.toUpperCase() }) }}
                                size="small"
                            />
                            <FormControl size="small">
                                <InputLabel id="demo-select-small-label">Number of Practical batches</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    // id="demo-select-small"
                                    value={addDivD.num_pract_batch}
                                    label="Number of Practical batches"
                                    onChange={(e) => { setAddDivD({ ...addDivD, num_pract_batch: e.target.value }) }}
                                >
                                    {allData && allData.practBatches.map((el) => {
                                        return (
                                            <MenuItem value={el}>{el}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl size="small">
                                <InputLabel id="demo-select-small-label">Number of Tutorial batches</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    // id="demo-select-small"
                                    value={addDivD.num_tutorial_batch}
                                    label="Number of Tutorial batches"
                                    onChange={(e) => { setAddDivD({ ...addDivD, num_tutorial_batch: e.target.value }) }}
                                >
                                    {allData && allData.tutorialBatches.map((el) => {
                                        return (
                                            <MenuItem value={el}>{el}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <Button variant="contained" onClick={createDivision}>Save</Button>
                        </Box>
                    </Modal>
                    <Modal
                        open={opViewD}
                        onClose={() => setOpViewD(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                View Divisions
                            </Typography>
                            {!divisionsD.data.length ?
                                <p className="fColorB">No Divisions</p> : <></>
                            }
                            {divisionsD.data && divisionsD.data.map((el) => {
                                return (
                                    <div className="divf gapM">
                                        <p className="fColorB">Division: {el.name}</p>
                                        <ChildModal data={el} />
                                    </div>
                                )

                            })}


                        </Box>
                    </Modal>
                </section>
            </div>
        </>
    )
}