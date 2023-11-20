import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../components/Navbar";
import { faAtom, faBookOpen, faFlaskVial } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
// import axios from "axios";
import Cookies from 'universal-cookie';
import { styled } from '@mui/material/styles';
import axios from "axios";
import { notifyE, notifyS } from "../funcs/func1";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function Home() {
  const [insArr, setInsArr] = useState([0, 0, 0, 0]);


  const [theory, settheory] = useState([]);
  const [practical, setPractical] = useState([]);

  const [uDetD, setUDetD] = useState();
  const [fetMD, setFetMD] = useState({ theory: [], practical: [] });
  const [feedData, setFeedD] = useState();
  const [commentsD, setCommD] = useState();
  const [selMFac, setSelMF] = useState();
  const [currI, setCurrI] = useState(0);

  const [currSF, setCurrSF] = useState(["", ""]);
  const [curCursor, setCurCursor] = useState(false);
  // const [subjD, setSubjD] = useState([]);
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    // emf
    console.log("yoo");
  }, [feedData])

  function authStudent() {
    var anoL = cookies.get("user");
    var uDets = cookies.get("user2");
    if (!anoL) {
      cookies.remove("user2", { path: "/" });
      cookies.remove("theoryFeed", { path: "/" });
      cookies.remove("currQ", { path: "/" });
      navigate("/login");
    }
    else if (!uDets) {
      cookies.remove("theoryFeed", { path: "/" });
      cookies.remove("currQ", { path: "/" });
      navigate("/login/details");
    }
  }

  useEffect(() => {
    var anoL = cookies.get("user");
    var uDets = cookies.get("user2");
    authStudent();
    setUDetD({ ...uDets });
    // console.log(uDets);
    fetchTAllQs();
    fetchPAllQs();
    // fetchAllSubj();
    fetchMapFac();
    doSetFeedStatus();
    console.log(theory);

  }, []);

  useEffect(() => {
    authStudent();
    doSetFeedStatus();
  }, [fetMD]);

  // useEffect(() => {
  //   console.log(currI);
  // }, [currI]);

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.9)',
      boxShadow: theme.shadows[1],
      fontSize: 15,
    },
  }));

  async function fetchTAllQs() {
    await axios.get("http://localhost:8000/api/theoryquest/")
      .then((res) => {
        // console.log(res.data);
        var dumD = res.data;
        settheory([...dumD]);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  async function fetchPAllQs() {
    await axios.get("http://localhost:8000/api/pracquest/")
      .then((res) => {
        // console.log(res.data);
        var dumD = res.data;
        setPractical([...dumD]);
        // console.log(dumD);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  async function fetchAndCh(dubO) {
    var el = { ...dubO };
    var dsData = { subject: {}, faculty: {} };
    dsData.subject = await axios.get(`http://localhost:8000/api/subject/?department=${el.department}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => { return false })
    dsData.faculty = await axios.get(`http://localhost:8000/api/faculty/?department=${el.department}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        return false
      })
    return dsData;
  }

  async function callMyKaam(allDs) {
    var uDets = cookies.get("user2");
    const res = await fetchAndCh(allDs[0]);
    var finalD = { theory: [], practical: [] };
    allDs.map((el, mi) => {
      for (var i = 0; i < res.faculty.length; i++) {
        if (res.faculty[i].id === el.faculty) {
          el.faculty = res.faculty[i];
          break;
        }
      }
      for (var i = 0; i < res.subject.length; i++) {
        if (res.subject[i].id === el.subject) {
          el.subject = res.subject[i];
          break;
        }
      }
      if (el.theory) {
        finalD.theory.push(el);
      }
      if (el.practical && el.practical_batch === uDets.batch) {
        finalD.practical.push(el);
      }
    })

    setFetMD({ ...finalD });

    // return allDs;
  }

  async function fetchMapFac() {
    var uDets = cookies.get("user2");
    if (!uDets) {
      return;
    }
    await axios.get(`http://localhost:8000/api/mapfaculty/?department=${uDets.department.id}&division=${uDets.division.id}`)
      .then((res) => {
        var dumDet = res.data;
        callMyKaam(dumDet);
      })
      .catch((err) => {
        // notifyE("Can't fetch mapping, please try again!");
        console.log(err);
        return;
      })

  }

  async function doSetFeedStatus() {

    var userAtt = cookies.get("user");
    var uDets = cookies.get("user2");
    var cI = cookies.get("currQ");
    var statusExist = cookies.get("theoryFeed");
    const date = new Date();
    var dumDats = { ...fetMD };
    if (!uDets) {
      return;
    }
    // else{}
    if (!dumDats.theory.length) {
      return;
    }
    if (!cI) {
      cookies.set("currQ", 1, { path: "/", maxAge: 18000 });
    }
    else {
      setCurrI(Number(cI));
    }
    if (!statusExist) {
      // statusExist = {
      //   user: "high",
      //   faculty: smf.faculty.faculty_name,
      //   subject: smf.subject.subject,
      //   department: uDetD.department.name,
      //   division: uDetD.division.name,
      //   batch: uDetD.batch,
      //   semester: uDetD.semester,
      //   f_date: `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`,
      //   attendance: "high",
      //   Q1: ffd[0],
      //   Q2: ffd[1],
      //   Q3: ffd[2],
      //   Q4: ffd[3],
      //   Q5: ffd[4],
      //   Q6: ffd[5],
      //   Q7: ffd[6],
      //   Q8: ffd[7],
      //   Q9: ffd[8],
      //   Q10: ffd[9],
      //   Q11: ffd[10],
      //   Q12: ffd[11],
      //   comment: commentsD
      // }
      statusExist = {
        user: userAtt,
        faculty: "",
        subject: "",
        department: uDets.department.name,
        division: uDets.division.name,
        batch: uDets.batch,
        semester: uDets.semester,
        f_date: `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`,
        attendance: userAtt,
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0,
        Q5: 0,
        Q6: 0,
        Q7: 0,
        Q8: 0,
        Q9: 0,
        Q10: 0,
        Q11: 0,
        Q12: 0,
        comment: "",
      }
      setFeedD({ ...statusExist });
      cookies.set("theoryFeed", JSON.stringify({ ...statusExist }), { path: "/", maxAge: 18000 });
    }
    else {
      if (feedData) {
        statusExist = { ...feedData };
      }
      if (cI > dumDats.theory.length) {
        var countP = cI - dumDats.theory.length;
        statusExist.faculty = dumDats.practical[countP - 1].faculty.faculty_name;
        statusExist.subject = dumDats.practical[countP - 1].subject.subject;
      }
      else {
        statusExist.faculty = dumDats.theory[cI - 1].faculty.faculty_name;
        statusExist.subject = dumDats.theory[cI - 1].subject.subject;
      }
      setCurrSF([statusExist.subject, statusExist.faculty])
      setFeedD({ ...statusExist });
      cookies.set("theoryFeed", JSON.stringify({ ...statusExist }), { path: "/", maxAge: 18000 });
    }
  }

  async function submitFeed() {
    var cI = Number(cookies.get("currQ"));
    // var statusExist = cookies.get("theoryFeed");
    var isTheory = (cI > fetMD.theory.length ? false : true);
    var totSubj = fetMD.theory.length + fetMD.practical.length;
    // console.log(theory.length);
    var uDets = cookies.get("user2");
    var dumData = { ...feedData };
    const date = new Date();

    if (!dumData.user || !dumData.department || !dumData.comment) {
      notifyE("Fill all details");
      return;
    }
    // console.log(dumData);

    if (isTheory) {
      var flag = true;
      for (var i = 0; i < theory.length; i++) {
        if (!dumData["Q" + String(Number(i + 1))]) {
          flag = false;
          // notifyE("Fill all details");
          break;
        }
      }
      if (flag == false) {
        notifyE("Fill all details");
        return;
      }
      await axios.post("http://localhost:8000/feed/theory_feedback/", dumData)
        .then((data) => {
          if (cI >= totSubj) {
            notifyS({ msg: "Thank you for filling out the feedback survey! You will be logged out soon!" });
            setTimeout(() => {
              cookies.remove("user", { path: "/" });
              cookies.remove("currQ", { path: "/" });
              cookies.remove("user2", { path: "/" });
              cookies.remove("theoryFeed", { path: "/" });
              navigate("/login");
            }, 2000)
          }
          else {
            notifyS({ msg: "Successful" });
            cookies.set("currQ", cI + 1, { path: "/", maxAge: 18000, });
            cookies.remove("theoryFeed", { path: "/" });

            doSetFeedStatus();
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(err);
          notifyE("Some error occurred, please try again!");

        })
    }
    else {
      var flag = true;
      for (var i = 0; i < practical.length; i++) {
        if (!dumData["Q" + String(Number(i + 1))]) {
          flag = false;
          // notifyE("Fill all details");
          break;
        }
      }
      if (flag == false) {
        notifyE("Fill all details");
        return;
      }
      await axios.post("http://localhost:8000/feed/pract_feedback/", dumData)
        .then((data) => {
          if (cI >= totSubj) {
            notifyS({ msg: "Thank you for filling out the feedback survey! You will be logged out soon!" });
            setTimeout(() => {
              cookies.remove("user", { path: "/" });
              cookies.remove("currQ", { path: "/" });
              cookies.remove("user2", { path: "/" });
              cookies.remove("theoryFeed", { path: "/" });
              navigate("/login");
            }, 2000)
          }
          else {
            notifyS({ msg: "Successful" });
            cookies.set("currQ", cI + 1, { path: "/", maxAge: 18000, });
            cookies.remove("theoryFeed", { path: "/" });

            doSetFeedStatus();
            window.location.reload();
          }

        })
        .catch((err) => {
          console.log(err);
          notifyE("Some error occurred, please try again!");

        })
    }

    // console.log(feedData);
    // notifyS(msg = "Success");


    // cookies.set("currQ", cI + 1, { path: "/", maxAge: 18000, });
    // cookies.remove("theoryFeed", { path: "/" });

    // doSetFeedStatus();

  }

  function handleInput(i, val) {
    var cloneA;
    var inData = { ...feedData };
    var qN = "Q" + String(Number(i + 1));
    inData[qN] = val;
    setFeedD(inData);
    // console.log(inData);
    cookies.set("theoryFeed", JSON.stringify({ ...inData }), { path: "/", maxAge: 18000 });
    // var cloneA = [...fetMD.];
    // cloneA[i] = val;
    var ni = i + 1;
    // setInsArr([...cloneA]);
    retId("insD" + i).innerHTML = val;

    retId("insD" + i).classList.remove("inputtedIns");
    retId("insD" + i).classList.add("insDDone");
    if (retId("insD" + ni) && !retId("insD" + ni).classList.contains("insDDone"))
      retId("insD" + ni).classList.add("inputtedIns");
    retId("mainQD" + i).classList.remove("mainInsQ");
    console.log(val);
  }

  function retId(idn) {
    return document.getElementById(idn);
  }

  const subjects = [
    ["CN", "Computer Networks"],
    ["TCS", "Theory of Computer Science"],
    ["DWM", "Data Warehouse Model"],
    ["SE", "Software Engineering"],
    ["PGM", "Probabilistic Graphical Models"],
  ];

  return (
    <>
      <Navbar />
      <div className="fullbg">
        <ToastContainer />
        <div className="dashbgI"></div>
        <div className="sliderSub">
          <div className="divf fdirc sliderSec">
            <LightTooltip title={"Theory"} placement="right-start">
              <p className="inSH">
                <FontAwesomeIcon icon={faBookOpen} />
              </p>
            </LightTooltip>

            <div className="divf fdirc allSlSec">
              {fetMD.theory.length && fetMD.theory.map((el, i) => {
                return (
                  <>
                    <LightTooltip title={`${el.subject.subject}, Prof. ${el.faculty.faculty_name} `} placement="right-start" key={el.faculty.id}>
                      <div className="divIndS">
                        {/* <button className={el[0] === "CN" ? "indSub ccSub" : "indSub"}>{el[0]}</button> */}
                        <button className={cookies.get("currQ") === i + 1 ? "indSub ccSub" : "indSub"} onClick={() => { setSelMF({ ...el }) }}>{el.subject.subject}</button>
                      </div>
                    </LightTooltip>
                  </>
                );
              })}
            </div>
          </div>
          <div className="divf fdirc sliderSec">
            <LightTooltip title={"Practical"} placement="right-start">
              <p className="inSH">
                <FontAwesomeIcon icon={faAtom} />
              </p>
            </LightTooltip>

            <div className="divf fdirc allSlSec">
              {fetMD.practical.length && fetMD.practical.map((el, i) => {
                return (
                  <>
                    <LightTooltip title={`${el.subject.subject}, Prof. ${el.faculty.faculty_name} `} placement="right-start" key={el.faculty.id}>
                      <div className="divIndS">
                        {/* <button className={el[0] === "CN" ? "indSub ccSub" : "indSub"}>{el[0]}</button> */}
                        <button className={cookies.get("currQ") - fetMD.theory.length === i + 1 ? "indSub ccSub" : "indSub"} onClick={() => { setSelMF({ ...el }) }}>{el.subject.subject}</button>
                      </div>
                    </LightTooltip>

                  </>
                );
              })}
            </div>
          </div>
        </div>
        <div className="divf mainContent fdirc pLeft">
          {uDetD && Object.keys(uDetD).length ?
            <div className="infoC divf ">
              <p className="infP">
                <span>Academic Year</span>{"2023-24"}
              </p>
              <p className="infP">
                <span>Department</span>{uDetD.department.name}
              </p>
              <p className="infP">
                <span>Semester</span>{uDetD.semester}
              </p>
              <p className="infP">
                <span>Division</span>{uDetD.division.name}
              </p>
              <p className="infP">
                <span>Batch</span>{uDetD.batch}
              </p>
            </div> : <></>}
          {/* {feedData && Object.keys(feedData).length ?

            <div className="infoC divf">
              {feedData.subject ?
                <p className="infP">
                  <span>Subject</span>{feedData.subject}
                </p> : <></>
              }
              {feedData.faculty ?
                <p className="infP">
                  <span>Faculty Name</span>{feedData.faculty}
                </p> : <></>
              }
            </div>
            : <></>} */}
          {currSF[0].length ?
            <div className="infoC divf">
              <p className="infP">
                <span>Subject</span>{currSF[0]}
              </p>
              <p className="infP">
                <span>Faculty Name</span>{currSF[1]}
              </p>
            </div> : <></>
          }
          {feedData && Object.keys(feedData).length ?
            <>
              <div className="quesT">
                <table>
                  <thead>
                    <tr>
                      <th>Questions</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {

                      ((Number(currI) > fetMD.theory.length) ? practical : theory).map((el, i) => {
                        var curAns = feedData["Q" + Number(i + 1)]
                        var putCursor = false;
                        if (curAns) {
                          var cCursor = false;
                        }
                        else {
                          curAns = "";
                          if ((i >= 1 && feedData["Q" + Number(i)]) || i === 0) {
                            putCursor = true;
                          }
                          var cCursor = true;
                        }

                        return (
                          <>
                            <tr key={i}>
                              <td align="center">
                                <p className="quesText">{el.question}</p>

                              </td>
                              <td>
                                <div
                                  id={"mainQD" + i}
                                  className={cCursor ? "mainInsQ divf posR" : " divf posR"}
                                >
                                  <div
                                    id={"insD" + i}
                                    className={!putCursor ? (curAns ? "insD insDDone" : "insD") : "insD inputtedIns"}
                                    onClick={(e) => {
                                      retId("mainQD" + i).classList.add("mainInsQ");
                                    }}
                                  >{curAns === 4 ? el.option1 : curAns === 3 ? el.option2 : curAns === 2 ? el.option3 : curAns === 1 ? el.option4 : ""}</div>
                                  <div className="divf fdirc dropIns">
                                    <button
                                      onClick={() => {
                                        handleInput(i, 4);
                                      }}
                                    >
                                      {el.option1}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleInput(i, 3);
                                      }}
                                    >
                                      {el.option2}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleInput(i, 2);
                                      }}
                                    >
                                      {el.option3}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleInput(i, 1);
                                      }}
                                    >
                                      {el.option4}
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </>
            : <></>
          }
          <div className="divf" style={{ gap: "0.5rem" }}>
            <input placeholder="Enter any comments..." className="specIns"
              onChange={(e) => {
                const dumDat = { ...feedData };
                dumDat.comment = e.target.value;
                setFeedD({ ...dumDat });
                cookies.set("theoryFeed", JSON.stringify({ ...dumDat }), { path: "/", maxAge: 18000 });
              }}
              value={feedData && Object.keys(feedData).length ? feedData.comment : ""}

            />
            <button className="specBut" onClick={() => { submitFeed() }}>Submit</button>
          </div>
        </div>
      </div>
    </>
  );
}
