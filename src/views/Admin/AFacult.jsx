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
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { notifyE, notifyS } from "../../funcs/func1";
import { ToastContainer } from "react-toastify";
import Cookies from "universal-cookie";
import { allData } from "../../data/basicD";
import { Link } from "react-router-dom";
import { getCookie } from "../../action/type";
import AFNavbar from "../../components/AFNavbar";
import Swal from "sweetalert2";
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
    gap: '13px',
    overflow: 'auto',
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
                <Box sx={{ ...style }}>
                    <h2>
                        {props.data.theory ? "Theory" : ""}
                        {props.data.theory && props.data.practical ? " & " : ""}
                        {props.data.practical ? "Practical" : ""}
                        {(props.data.theory && props.data.tutorial) || (props.data.tutorial && props.data.practical)
                            ? " & " : ""
                        }
                        {props.data.tutorial ? "Tutorial" : ""}
                    </h2>
                    <p>Division: <b>{props.data.division.name}</b></p>
                    <p>Subject: <b>{props.data.subject.subject}</b></p>
                    {props.data.practical ?
                        <p>Practical batch: <b>{props.data.practical_batch}</b></p> : <></>}
                    {props.data.tutorial ?
                        <p>Tutorial batch: <b>{props.data.tutorial_batch}</b></p> : <></>}
                    <Button onClick={handleClose} variant="contained">Close</Button>
                </Box>
            </Modal>
        </React.Fragment >
    );
}

export default function AFacult() {
    const cookies = new Cookies(null, { path: '/' });


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [factDat, setFactD] = useState({ rows: [], columns: [] })

    const [addFac, setAddFac] = useState({ faculty_name: "", department: "", deptN: "" });
    const [facName, setFacName] = useState();
    const [deptN, setDeptN] = useState();

    const [deptI, setDeptI] = useState();

    const [deptAll, setDeptAll] = useState();

    const [divisionsD, setDivsData] = useState({ data: [] });
    const [opAddMap, setOpAddMap] = useState(false);
    const [addMapDet, setAddMapDet] = useState({ faculty: "", faculty_name: "", department: "", sem: "", subject: {}, division: "", theory: "", practical: "", tutorial: "", practical_batch: "", tutorial_batch: "", year: "", divRef: {} });
    const [subjDat, setSubD] = useState([]);
    const [opViewD, setOpViewD] = useState(false);
    const [fetMapD, setFetMD] = useState([]);
    const [currFac, setCurrF] = useState();
    const [fileU, setFileU] = useState();

    useEffect(() => {
        fetchDept();
        // showDivisions();
        // fetchSubj();
    }, []);

    useEffect(() => {
        if (addMapDet.department) {
            fetchDivision(addMapDet.department);
        }
        if (addMapDet.sem && addMapDet.department) {
            fetchSubj(addMapDet.sem, addMapDet.department);
        }
        console.log(addMapDet);
    }, [addMapDet]);

    async function fetchDivision(depId) {
        await axios.get(`http://localhost:8000/api/division/?department=${depId}`, {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                var dubDat = { ...divisionsD };
                dubDat.data = res.data;
                setDivsData({ ...dubDat });
            })
            .catch((err) => {
                console.log(err);
                notifyE("Some error occurred in fetching divisions!");
            })
    }

    async function fetchSubj(semId, depId) {
        // if (!addMapDet.sem || !addMapDet.department) {
        //     notifyE("Please provide all inputs for query!");
        //     return;
        // }
        // console.log(`http://localhost:8000/api/subject/?semester=${addMapDet.sem}&department=${addMapDet.department}`);
        await axios.get(`http://localhost:8000/api/subject/?semester=${semId}&department=${depId}`, {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                var dubD = res.data;
                // console.log(res.data);
                setSubD([...dubD]);
            })
            .catch((err) => {
                console.log(err);
                notifyE("Unable to fetch subjects");
            })
    }

    async function fetchDept() {
        axios.get("http://localhost:8000/api/department", {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                setDeptAll(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    async function fetchFact() {
        if (!deptI) {
            notifyE("Please provide department!");
            return;
        }
        await axios.get(`http://localhost:8000/api/faculty/?department=${deptI.id}`)
            .then((res) => {
                // console.log(res.data);
                var dubD = { ...factDat };
                dubD.rows = res.data;
                dubD.rows.forEach((el) => {
                    el.department = deptI.name
                    el.deptI = deptI.id
                });
                dubD.columns = [
                    { field: 'id', headerName: 'Id', width: 150 },
                    { field: 'faculty_name', headerName: 'Faculty Name', width: 150 },
                    { field: 'department', headerName: 'Department', width: 150 },
                    // { field: 'act_map', headerName: 'Map Faculty', width: 100 }
                    {
                        field: 'add_map',
                        headerName: 'Add Map',
                        renderCell: (cellValue) => {
                            return (
                                <Button variant="outlined"
                                    // color="secondary"
                                    size="small"
                                    onClick={(event) => {
                                        addMapFact(event, cellValue);

                                    }}
                                >Add
                                </ Button>
                            )
                        },
                        width: 140
                    },
                    {
                        field: 'view_map',
                        headerName: 'View Mapping',
                        renderCell: (cellValue) => {
                            return (
                                <Button variant="contained"
                                    // color="secondary"
                                    size="small"
                                    onClick={(event) => {
                                        showMappingF(event, cellValue);
                                    }}
                                >View
                                </ Button>
                            )
                        },
                        width: 140
                    }
                ]
                setFactD({ ...dubD });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    async function fetchAndCh(dubO) {
        var el = { ...dubO };
        var dsData = { division: {}, subject: {} };
        dsData.division = await axios.get(`http://localhost:8000/api/division/?department=${el.department}`, {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                return res.data;
            })
            .catch((err) => { return false })
        dsData.subject = await axios.get(`http://localhost:8000/api/subject/?department=${el.department}`, {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                return res.data;
            })
            .catch((err) => { return false })
        return dsData;
    }

    async function callMyKaam(allDs, facDumD) {
        const res = await fetchAndCh({ ...allDs[0] });
        allDs.map((el, mi) => {
            for (var i = 0; i < res.division.length; i++) {
                if (res.division[i].id === el.division) {
                    el.division = res.division[i];
                    break;
                }
            }
            for (var i = 0; i < res.subject.length; i++) {
                if (res.subject[i].id === el.subject) {
                    el.subject = res.subject[i];
                    break;
                }
            }
            el.faculty = { ...facDumD };
        })
        setFetMD([...allDs]);
        setOpViewD(true);
    }

    async function showMappingF(event, cellValue) {
        // console.log(cellValue.row.id);
        await axios.get(`http://localhost:8000/api/mapfaculty/?faculty=${cellValue.row.id}`, {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                var facDDat = { id: cellValue.row.id, faculty_name: cellValue.row.faculty_name, department: cellValue.row.department };
                var dumDet = [...fetMapD];
                dumDet = res.data;
                var dsData = callMyKaam(dumDet, facDDat);
            })
            .catch((err) => {
                notifyE("Can't fetch mapping, please try again!");
                return;
            })

    }

    async function addMapFact(event, cellValue) {
        var dubMapD = addMapDet;
        dubMapD.faculty = cellValue.row.id;
        dubMapD.faculty_name = cellValue.row.faculty_name;
        dubMapD.department = cellValue.row.deptI;
        setAddMapDet({ ...dubMapD });
        setOpAddMap(true);
        // console.log(`http://localhost:8000/api/division/?department=${deptI.id}`);


        // fetchSubj();
    }



    async function addFact() {
        if (fileU) {
            // console.log(fileU);
            Swal.fire({
                title: `Do you want to save <u>${fileU.name}</u> ? This can't be undone!`,
                showDenyButton: true,
                confirmButtonText: 'Save',
                denyButtonText: `Don't save`,
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    async function postFile() {
                        await axios.post("http://localhost:8000/api/facultybulk/", { "file": fileU },
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
                                    fetchSubj();
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
        if (!addFac.faculty_name || !addFac.department) {
            notifyE("Please fill All Details!")
            return;
        }
        else {
            axios.post("http://localhost:8000/api/faculty/", { "faculty_name": addFac.faculty_name, "department": addFac.department },
                {
                    headers: {
                        'Authorization': `Token ${getCookie('token')}`
                    }
                })
                .then((res) => {
                    // console.log(res);
                    notifyS({ msg: "Successfully created!" })
                    setOpen(false);
                    fetchDept();
                    fetchFact();
                    setAddMapDet({ faculty: "", faculty_name: "", department: "", sem: "", subject: {}, division: "", theory: "", practical: "", tutorial: "", practical_batch: "", tutorial_batch: "", year: "", divRef: {} })
                })
                .catch((err) => {
                    console.log(err);
                    notifyE("Some error occurred!");
                })

        }
    }

    function findDivisionF(dId) {
        var allDivisions = divisionsD.data;
        var finResult = {};
        // console.log(divisionsD);
        for (var i = 0; i < allDivisions.length; i++) {
            if (allDivisions[i].id === dId) {
                finResult = { ...allDivisions[i] };
                // return;
            }
        }
        // console.log(finResult);
        setAddMapDet({ ...addMapDet, divRef: { ...finResult }, division: finResult.name });
        document.getElementById("divisionId1").value = finResult.name;
        // return finResult;
    }

    function updateSubject(sId) {
        var subjD = subjDat;
        var finRes = {}
        for (var i = 0; i < subjD.length; i++) {
            if (subjD[i].id === sId) {
                finRes = subjD[i];
            }
        }
        setAddMapDet({ ...addMapDet, subject: { ...finRes } });
        document.getElementById("subjId1").value = finRes.subject;
    }

    function compYN(inValue) {
        if (inValue === "YES" || inValue === 1) {
            return 1;
        }
        else {
            return 0;
        }
    }

    async function doMapFact() {
        var dumDat = { ...addMapDet };
        // console.log(dumDat);
        if ((!dumDat.faculty || !dumDat.department || !dumDat.sem || !dumDat.subject || dumDat.theory === "" || dumDat.practical === "" || dumDat.tutorial === "")) {
            notifyE("Provide necessary details!")
            return;
        }
        if (dumDat.practical === "YES" && dumDat.practical_batch === "") {
            notifyE("Input the practical batch for the practical");
            return;
        }
        if (dumDat.tutorial === "YES" && dumDat.tutorial_batch === "") {
            notifyE("Input the tutorial batch for the practical");
            return;
        }
        if (dumDat.practical === "NO" || dumDat.practical === 0) {
            dumDat.practical_batch = 0;
        }
        if (dumDat.tutorial === "NO" || dumDat.tutorial === 0) {
            dumDat.tutorial_batch = 0;
        }
        dumDat.theory = compYN(dumDat.theory);
        dumDat.practical = compYN(dumDat.practical);
        dumDat.tutorial = compYN(dumDat.tutorial);
        // console.log(dumDat);
        dumDat.division = dumDat.divRef.id;
        dumDat.subject = dumDat.subject.id;
        delete dumDat.divRef;
        delete dumDat.faculty_name;
        dumDat.year = "2023-2024";
        // dumDat.division = { id: dumDat.divRef.id };
        // dumDat.subject = { id: dumDat.subject.id };
        // dumDat.faculty = { id: dumDat.faculty };
        // dumDat.department = { id: dumDat.department };
        console.log(cookies.get('csrftoken'));
        await axios.post("http://localhost:8000/api/mapfaculty/", dumDat, {
            headers: {
                'Authorization': `Token ${getCookie('token')}`
            }
        })
            .then((res) => {
                // console.log(res);
                setOpAddMap(false);
                fetchDept();
                fetchFact();
                notifyS({ msg: "Successfully mapped faculty!" });
                setAddMapDet({ faculty: "", faculty_name: "", department: "", sem: "", subject: {}, division: "", theory: "", practical: "", tutorial: "", practical_batch: "", tutorial_batch: "", year: "", divRef: {} })
            })
            .catch((err) => {
                console.log(err);
                notifyE("Some error occurred!");
            })
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
                    <form>
                        <div className="divf fdirc comBox gapM">
                            <p className="tL f1-2"><b>Provide the specified inputs to view all Faculties for the same</b></p>
                            <div className="divf wFull jusSB">
                                <div className="divf fwrap jusStart wFull gapM">
                                    <FormControl sx={{ minWidth: 120 }} size="small">
                                        <InputLabel id="demo-select-small-label">Department</InputLabel>
                                        <Select
                                            labelId="demo-select-small-label"
                                            id="queryDept1"
                                            defaultValue={""}
                                            label="Department"
                                            onChange={(e) => { setDeptI(e.target.value); document.getElementById("queryDept1").value = e.target.value.name }}
                                        >
                                            {deptAll && deptAll.map((el) => {
                                                return (
                                                    <MenuItem value={el}>{el.name}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </FormControl>
                                </div>
                                <Button variant="contained" onClick={fetchFact}>Find</Button>
                            </div>

                        </div>
                    </form>
                    {/* Add or create faculty */}
                    <div className="divf jusSB">
                        <p className="dashTT1">Faculties data</p>
                        <Button className="muiButOut" variant="outlined" endIcon={<AddCircleRounded />} onClick={handleOpen}>Add Faculty</Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Add Faculty
                                </Typography>
                                <input type="file" className="uplFileIns" onChange={(e) => { setFileU(e.target.files[0]) }} />
                                <div className="orShowT">
                                    OR
                                </div>
                                <TextField
                                    label="Faculty Name"
                                    id="outlined-size-small"
                                    size="small"
                                    onChange={(e) => { setAddFac({ ...addFac, faculty_name: e.target.value }) }}
                                />
                                <FormControl sx={{ minWidth: 120 }} size="small">
                                    <InputLabel id="demo-select-small-label">Department</InputLabel>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="dep12"
                                        defaultValue={""}
                                        // value={addFac.deptN}
                                        label="Department"
                                        onChange={(e) => {
                                            setAddFac({ ...addFac, department: e.target.value.id, deptN: e.target.value.name });
                                            document.getElementById("dep12").value = e.target.value.name
                                        }}
                                    >
                                        {deptAll && deptAll.map((el) => {
                                            return (
                                                <MenuItem value={el}>{el.name}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                                <Button variant="contained" onClick={addFact}>Save</Button>
                            </Box>
                        </Modal>
                    </div>
                    {factDat.rows.length ? <DTable data={factDat} /> : <></>}
                    {/* <DTable /> */}
                    {/* Add Mapping to faculty */}
                    <Modal
                        open={opAddMap}
                        onClose={() => setOpAddMap(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                        className="modMaj"
                    >
                        <Box sx={style} >
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Add Mapping
                            </Typography>
                            <TextField
                                label="Faculty Name"
                                defaultValue={addMapDet.faculty_name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                size="small"
                            />
                            <TextField
                                label="Department"
                                defaultValue={deptI ? deptI.name : ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                                size="small"
                            />
                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel>Semester</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    // id="demo-select-small"
                                    value={addMapDet.sem}
                                    label="Semester"
                                    onChange={(e) => { setAddMapDet({ ...addMapDet, sem: e.target.value }); }}
                                >
                                    {allData && allData.semester.map((el) => {
                                        return (
                                            <MenuItem value={el}>{el}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel >Division</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="divisionId1"
                                    defaultValue=""
                                    // value={addMapDet.division}
                                    label="Division"
                                    onChange={(e) => {
                                        findDivisionF(e.target.value);
                                        // document.getElementById("divisionId1").value = e.target.value.name
                                    }}
                                >
                                    {divisionsD.data && divisionsD.data.map((el) => {
                                        return (
                                            <MenuItem value={el.id}>{el.name}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel >Subject</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="subjId1"
                                    defaultValue=""
                                    // value={addMapDet.subject.subject ? addMapDet.subject.subject : ""}
                                    label="Semester"
                                    onChange={(e) => { updateSubject(e.target.value) }}
                                >
                                    {subjDat && subjDat.map((el) => {
                                        return (
                                            <MenuItem value={el.id}>{el.subject}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel>Theory</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    // id="demo-select-small"
                                    value={addMapDet.theory}
                                    label="Theory"
                                    onChange={(e) => { setAddMapDet({ ...addMapDet, theory: e.target.value }); }}
                                >
                                    <MenuItem value="YES">YES</MenuItem>
                                    <MenuItem value="NO">NO</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel>Practical</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    // id="demo-select-small"
                                    value={addMapDet.practical}
                                    label="Practical"
                                    onChange={(e) => { setAddMapDet({ ...addMapDet, practical: e.target.value }); }}
                                >
                                    <MenuItem value="YES">YES</MenuItem>
                                    <MenuItem value="NO">NO</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel>Tutorial</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    // id="demo-select-small"
                                    value={addMapDet.tutorial}
                                    label="Tutorial"
                                    onChange={(e) => { setAddMapDet({ ...addMapDet, tutorial: e.target.value }); }}
                                >
                                    <MenuItem value="YES">YES</MenuItem>
                                    <MenuItem value="NO">NO</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel >Practical Batch</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    // id="demo-select-small"
                                    value={addMapDet.divRef.practical_batch}
                                    label="Practical Batch"
                                    onChange={(e) => { setAddMapDet({ ...addMapDet, practical_batch: e.target.value }); }}
                                >
                                    {addMapDet.divRef.num_pract_batch > 0 && [...Array(addMapDet.divRef.num_pract_batch).keys()].map((el) => {
                                        return (
                                            <MenuItem value={el + 1} id={"practBacth" + el} >{el + 1}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120 }} size="small">
                                <InputLabel >Tutorial Batch</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    // id="demo-select-small"
                                    value={addMapDet.divRef.tutorial_batch}
                                    label="Tutorial Batch"
                                    onChange={(e) => { setAddMapDet({ ...addMapDet, tutorial_batch: e.target.value }); }}
                                >
                                    {addMapDet.divRef.num_tutorial_batch > 0 && [...Array(addMapDet.divRef.num_tutorial_batch).keys()].map((el) => {
                                        return (
                                            <MenuItem value={el + 1} id={"tutBacth" + el} >{el + 1}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                            <Button variant="contained" onClick={doMapFact}>Save</Button>
                        </Box>
                    </Modal>
                    {/* View mapping to faculty */}
                    <Modal
                        open={opViewD}
                        onClose={() => setOpViewD(false)}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                View Faculty Mapping
                            </Typography>
                            {!fetMapD.length ?
                                <p className="fColorB">No Mapping</p> : <></>
                            }
                            {fetMapD.length && fetMapD.map((el, i) => {
                                return (
                                    <div div className="divf gapM fullW" >
                                        <p>{i + 1}.</p>
                                        <p className="fColorB">Division: {el.division.name}</p>
                                        <p className="fColorB">Subject: {el.subject.subject}</p>
                                        <ChildModal data={el} />
                                    </div>
                                )

                            })}


                        </Box>
                    </Modal>
                </section>
            </div >
        </>
    )
}