import React from 'react'
import { AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Auth.module.css";
import Modal from "react-modal";
import { Formik } from "formik";
import { object, string } from "yup";
import { TextField, Button, CircularProgress } from "@material-ui/core";

import {
    selectIsLoadingAuth,
    selectOpenSignIn,
    selectOpenSignUp,
    setOpenSignIn,
    resetOpenSignIn,
    setOpenSignUp,
    resetOpenSignUp,
    fetchCredStart,
    fetchCredEnd,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncGetMyProf,
    fetchAsyncGetProfs,
    fetchAsyncCreateProf,
} from "./authSlice";

import { fetchAsyncGetPosts, fetchAsyncGetComments } from "../post/postSlice";

const customStyles = {
    overlay: {
        backgroundColor: "#777777",
    },
    content: {
        top: "55%",
        left: "50%",

        width: 280,
        height: 350,
        padding: "50px",

        transform: "translate(-50%, -50%)",
    },
};

export const Auth: React.FC = () => {

    Modal.setAppElement("#root");
    const openSignIn = useSelector(selectOpenSignIn);
    const openSignUp = useSelector(selectOpenSignUp);
    const isLoadingAuth = useSelector(selectIsLoadingAuth);
    const dispatch: AppDispatch = useDispatch();

    return (

        <>
            <Modal
                isOpen={openSignUp}
                onRequestClose={async () => {
                    await dispatch(resetOpenSignUp());
                }}
                style={customStyles}
            >
                <Formik
                    initialErrors={{ email: "required" }}
                    initialValues={{ email: "", password: "" }}
                    onSubmit={async (values) => {
                        await dispatch(fetchCredStart());
                        const resultReg = await dispatch(fetchAsyncRegister(values));

                        if (fetchAsyncRegister.fulfilled.match(resultReg)) {
                            await dispatch(fetchAsyncLogin(values));
                            await dispatch(fetchAsyncCreateProf({ nickName: "anonymous" }));
                            await dispatch(fetchAsyncGetProfs());
                            await dispatch(fetchAsyncGetPosts());
                            await dispatch(fetchAsyncGetComments());
                            await dispatch(fetchAsyncGetMyProf());
                        }
                        await dispatch(fetchCredEnd());
                        await dispatch(resetOpenSignUp());
                    }}
                    validationSchema={object().shape({
                        email: string()
                            .email('email format is wrong')
                            .required('email is must'),
                        password: string().required("password is must").min(4),
                    })}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            errors,
                            touched,
                            isValid,
                        }) => (
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.auth_signUp}>
                                        <h1 className={styles.auth_title}>
                                            Welcome to Instagram
                                        </h1>
                                        <br />
                                        <div className={styles.auth_progress}>
                                            {isLoadingAuth && <CircularProgress/>}
                                        </div>
                                        <br />

                                        <TextField
                                        placeholder="email"
                                        type="input"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        />
                                        <br />
                                        {touched.email && errors.email ? (
                                            <div className={styles.auth_error}>{errors.email}</div>)
                                            : null
                                        }

                                        <TextField
                                        placeholder="password"
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        />
                                        <br />
                                        {touched.password && errors.password ? (
                                            <div className={styles.auth_error}>{errors.password}</div>)
                                            : null
                                        }
                                        <br />
                                        <br />

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={!isValid}
                                            type="submit"
                                        >
                                            Register
                                        </Button>
                                        <br />
                                        <br />

                                        <span
                                        className={styles.auth_text}
                                        onClick={async () => {
                                            await dispatch(setOpenSignIn());
                                            await dispatch(resetOpenSignUp());
                                        }}>
                                            You already have a account?
                                        </span>
                                        <br />
                                        <br />



                                    </div>
                                </form>
                            </div>
                        )}
                    </Formik>
            </Modal>

            <Modal
            isOpen={openSignIn}
            onRequestClose={async () => {
                await dispatch(resetOpenSignIn());
            }}
            style={customStyles}
            >
                    <Formik
                    initialErrors={{ email: "required" }}
                    initialValues={{ email: "", password: "" }}
                    onSubmit={async (values) => {
                        await dispatch(fetchCredStart());
                        //下記を実装中はローディングを表示させておくため

                        const result = await dispatch(fetchAsyncLogin(values));
                        
                        if (fetchAsyncLogin.fulfilled.match(result)) {

                            await dispatch(fetchAsyncGetProfs());
                            await dispatch(fetchAsyncGetPosts());
                            await dispatch(fetchAsyncGetComments());
                            await dispatch(fetchAsyncGetMyProf());
                        }
                        await dispatch(fetchCredEnd());
                        await dispatch(resetOpenSignIn());
                    }}
                    validationSchema={object().shape({
                        email: string()
                            .email('email format is wrong')
                            .required('email is must'),
                        password: string().required("password is must").min(4),
                    })}
                    >
                        {({
                            handleSubmit,
                            handleChange,
                            handleBlur,
                            values,
                            errors,
                            touched,
                            isValid,
                        }) => (
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.auth_signUp}>
                                    <h1 className={styles.auth_title}>Welcome to Instagram</h1>
                                    <br />
                                    <div className={styles.auth_progress}>
                                        {isLoadingAuth && <CircularProgress />}
                                    </div>
                                    <br />

                                    <TextField
                                        placeholder="email"
                                        type="input"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        />
                                        <br />
                                        {touched.email && errors.email ? (
                                            <div className={styles.auth_error}>{errors.email}</div>)
                                            : null
                                        }

                                        <TextField
                                        placeholder="password"
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        />
                                        <br />
                                        {touched.password && errors.password ? (
                                            <div className={styles.auth_error}>{errors.password}</div>)
                                            : null
                                        }
                                        <br />
                                        <br />


                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={!isValid}
                                            type="submit"
                                        >
                                            Login
                                        </Button>
                                        <br />
                                        <br />
                                        <span
                                        className={styles.auth_text}
                                        onClick={async () => {
                                            await dispatch(setOpenSignUp());
                                            await dispatch(resetOpenSignIn());
                                        }}>
                                            You don't have a account?
                                        </span>
                                    </div>
                                </form>
                                </div>
                        )}



                    </Formik>

            </Modal>
        </>
    )
}
