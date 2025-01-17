import React from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegisterStyles.css";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const name = values.name.trim();
      values.name = name;
      const email = values.email.trim();
      const password = values.password.trim();
      values.email = email;
      values.password = password;

      var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
      if (!values.password.match(passw)) {
        message.warning(
          "Please enter strong password having length atleast 6 including atleast one number, one uppercase, one lowercase character"
        );
        dispatch(hideLoading());
      } else {
        const res = await axios.post(
          `${process.env.REACT_APP_URL}/api/v1/user/register`,
          values
        );
        dispatch(hideLoading());
        if (res.data.success) {
          message.success("Registration Successfull!");
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          message.error(res.data.message);
        }
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something Went Wrong");
    }
  };
  return (
    <div className="form-container min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat">
      <Form
        layout="vertical"
        onFinish={onfinishHandler}
        className="register-form shadow-md rounded-lg w-9/12 md:w-6/12 lg:w-3/12"
      >
        <h3 className="text-center text-3xl">Register Form </h3>
        <Form.Item label="Name" name="name">
          <Input type="text" required placeholder="Enter your name" />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input type="email" required placeholder="Enter your email" />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input type="password" required placeholder="Enter your password" />
        </Form.Item>
        <div className="flex justify-center">
          <button
            className="w-4/12 text-white text-base bg-blue-500 p-2 text-center rounded-md"
            type="submit"
          >
            Register
          </button>
        </div>
        <br />
        <Link to="/login" className="m-2 mt-4 text-sm underline">
          Already have an account?
        </Link>
      </Form>
    </div>
  );
};

export default Register;
