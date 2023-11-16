import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import ClipLoader from "react-spinners/ClipLoader";

const formValidationSchema = yup.object({
  email: yup
    .string()
    .email("Must be a valid Email Address")
    .required("Why not? Fill the Email!"),
  password: yup
    .string()
    .min(4, "Atleast 4 characters required")
    .max(10, "Too many characters")
    .required("Why not? Fill the Password!"),
});

function Login() {
  const navigate = useNavigate();
  const [err, setErr] = useState();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      setLoading(true);
      loginUser(values);
    },
  });

  const loginUser = async (values) => {
    await fetch("https://chatting-app-77nc.onrender.com/login", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.token) {
          localStorage.setItem("token", data.token);
          alert(data.message);
          navigate("/");
        } else {
          setErr(data.error);
        }
      });
  };
  return (
    <div className="h-screen bg-primary w-screen flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="h-[800px] w-[600px] bg-secondary shadow-2xl rounded-2xl flex flex-col justify-center items-center"
      >
        <p className="text-5xl font-bold">WELCOME RAABEY</p>
        <p className="mt-5 text-2xl">This is Thiku 😊 !</p>
        <div className="w-[100%] px-10 mt-10">
          <TextField
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            variant="outlined"
            label="Enter Email"
          />
        </div>
        <div className="w-[100%] px-10 text-red-700">
          {formik.touched.email && formik.errors.email ? (
            <p className="err-p">{formik.errors.email}</p>
          ) : (
            ""
          )}
        </div>
        <div className="w-[100%] px-10 mt-10">
          <TextField
            type="password"
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            fullWidth
            variant="outlined"
            label="Enter Password"
          />
        </div>
        <div className="w-[100%] px-10 text-red-700">
          {formik.touched.password && formik.errors.password ? (
            <p className="err-p">{formik.errors.password}</p>
          ) : (
            ""
          )}
        </div>
        <div>
          {loading ? (
            <ClipLoader size={50} color={"green"} loading={loading} />
          ) : (
            <Typography className="mt-3" color={"error"}>
              {err}
            </Typography>
          )}
        </div>
        <div className="mt-10">
          <Button type="submit" variant="contained">
            LOGIN
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Login;
