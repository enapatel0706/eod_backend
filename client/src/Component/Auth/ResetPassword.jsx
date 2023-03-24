import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import "../../css/reset-password.css";
import Swal from 'sweetalert2';

const ResetPassword = () => {

    const [loader, setLoader] = useState(false);

    let [cpass, setCPass] = useState("");
    let [npass, setNPass] = useState("");

    let navigate = useNavigate();
    const passValidations = () => {

        if (npass != cpass) {
            setLoader(false)
            Swal.fire({
                type: "error",
                icon: "error",
                title: "New Password and Confirm Password does not match!",
                confirmButtonText: "OK",
                confirmButtonColor: "#06bdff",
            });
            return false;
        } else {
            var decimal = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
            if (npass.match(decimal)) {
                return true;
            }
            else {
                setLoader(false)
                Swal.fire({
                    type: "error",
                    icon: "error",
                    title: `Password must contain 8 to 15 characters at least one uppercase, one lowercase, one number, and one special character`,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#06bdff",
                });
                return false;
            }
        }
    }




    const changePass = async (e) => {
        e.preventDefault();
        setLoader(true)
        try {
            if (passValidations()) {
                const queryParams = new URLSearchParams(window.location.search);
                const user_id = queryParams.get("user_id");
                const token = queryParams.get("token");

                const res = await axios.patch(`${process.env.REACT_APP_BACKEND_BASE_URL}/forgot/password`, {
                    "user_idF": user_id,
                    "tokenF": token,
                    "password": npass,
                    "password2": cpass
                });
                console.log(res);
                if (res.status == 200) {
                    setLoader(false)
                    Swal.fire({
                        type: "success",
                        icon: "success",
                        title: "Your password Changed Successfully!",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#06bdff",
                    })
                        .then(() => navigate('/'))
                } else {
                    setLoader(false)
                    Swal.fire({
                        type: "error",
                        icon: "error",
                        title: "Your password reset link has expired",
                        confirmButtonText: "OK",
                        confirmButtonColor: "#06bdff",
                    }).then(() =>
                        navigate('/forgotpassword'))

                }

            }
        } catch (err) {
            setLoader(false)
            Swal.fire({
                type: "error",
                icon: "error",
                title: "Your password reset link has expired",
                confirmButtonText: "OK",
                confirmButtonColor: "#06bdff",
            });
            navigate('/forgotpassword');
            console.log(err);
        }
    }

    return (
        <>
            {loader ? <div className="loadingPopup"></div> : null}
            <div
                className="main d-flex justify-content-center align-items-center"
            >
                <div className="box text-center ms-3 me-3 me-sm-5 p-4">
                    <div className="d-flex justify-content-center" style={{ "position": "relative" }}>
                        <div className="btn-top d-flex justify-content-between" id="btn-top">
                            <p className="mb-0">Reset Password?</p>
                        </div>

                    </div>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                            <div className="image mt-4 mb-3">
                                <img src="./image/Logo.png" alt="" srcset="" />
                            </div>
                            <form className="mt-3">
                                {/* <!-- Email input --> */}
                                <div className="row px-0 mx-0 d-flex justify-content-center">
                                    <div className="col-12">
                                        <div className="floating-label-group">
                                            <input
                                                type="password"
                                                id="password"
                                                name='npass'
                                                value={npass}
                                                onChange={(e) => { setNPass(e.target.value) }}
                                                className="form-control"
                                                autoComplete="off"
                                                required
                                            />
                                            <label className="floating-label">New Password</label>
                                        </div>

                                    </div>
                                    <div className="col-12">
                                        <div className="floating-label-group">
                                            <input
                                                type="password"
                                                id="password"
                                                className="form-control"
                                                autoComplete="off"
                                                name='cpass'
                                                value={cpass}
                                                onChange={(e) => { setCPass(e.target.value) }}
                                                required
                                            />
                                            <label className="floating-label">Confirm Password</label>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className='row mx-0 px-0 justify-content-center'>
                                    <div className="col-8 d-flex mb-3" style={{ color: "#ff0000" }}>
                                        <i className="fas fa-circle-info mt-2"></i>
                                        <p className='mb-0'>Password must contain 8 to 15 characters at least one uppercase, one lowercase, one number, and one special character</p>
                                    </div>
                                </div> */}


                                {/* <!-- Submit button --> */}
                                <button
                                    type="submit"
                                    onClick={changePass}
                                    className="btn btn-primary btn-block mb-3 px-5 py-1 fw-500 login"
                                >
                                    Done
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword