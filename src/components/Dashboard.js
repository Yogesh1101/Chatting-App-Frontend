import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const formValidationSchema = yup.object({
  msg: yup.string().min(1).required(),
});

function Dashboard() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    }
    getUserDetails();
    getAllMessages();
  }, []);

  const getUserDetails = async () => {
    const res = await fetch("https://chatting-app-77nc.onrender.com/user/userDetails", {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    setUserData(data.data);
  };

  const getAllMessages = async () => {
    const res = await fetch("https://chatting-app-77nc.onrender.com/user/all", {
      method: "GET",
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    });
    const data = await res.json();
    if (!data.data) {
      console.log(data.error);
    } else {
      setMessages(data.data);
    }
  };

  const formik = useFormik({
    initialValues: {
      msg: "",
    },
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      postNewMessage(values);
    },
  });

  const postNewMessage = async (values) => {
    await fetch("https://chatting-app-77nc.onrender.com/user/new", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "x-auth-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        getAllMessages();
        if (data.message) {
          navigate("/");
        } else {
          alert(data.error);
        }
      });
  };

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="h-screen bg-primary w-screen flex justify-center items-center">
      <div className="h-[800px] w-[600px] bg-secondary overflow-hidden shadow-2xl rounded-2xl flex flex-col items-center">
        <div className="w-[100%] bg-black h-[100px] flex justify-center items-center">
          <div className="text-white text-2xl h-[100%] flex w-[90%] justify-center items-center">
            <div className="flex-1">WELCOME {userData.username}</div>
            <div>
              <Button variant="contained" onClick={handleLogout}>
                LOGOUT
              </Button>
            </div>
          </div>
        </div>
        <div className="msg-box mt-5 flex-1">
          {messages.map((m, index) =>
            m.user._id === userData._id ? (
              <div
                key={index}
                className="shadow-2xl rounded-2xl w-[100%] flex justify-end items-center"
              >
                <div className="messages text-xl text-red-700">{m.msg}</div> - {m.date.slice(11, 19)}
              </div>
            ) : (
              <div
                key={index}
                className="shadow-2xl rounded-2xl w-[100%] flex justify-start items-center"
              >
                <div className="messages text-xl">{m.msg}</div> - {m.date.slice(11, 19)}
              </div>
            )
          )}
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="mt-5 mb-5 w-[90%] flex gap-4 justify-center items-center"
        >
          <div className="flex-1">
            <TextField
              type="text"
              id="msg"
              name="msg"
              value={formik.values.msg}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              fullWidth
              variant="outlined"
              label="Enter Message"
            />
          </div>
          <div>
            <Button type="submit" variant="contained">
              SEND
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
