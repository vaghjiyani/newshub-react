import React, { useState } from 'react';
import { styles } from './index';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [inputData, setInputData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleInput = (event) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };

  const submitFrom = async (event) => {
    event.preventDefault();

    const data = {
      username: inputData.username,
      password: inputData.password,
    };

    try {
      const response = await axios.post('http://localhost:8080/login', data);
      console.log(response.data);

      if (response.data.username) {
        localStorage.setItem('userName', response.data.username);
        navigate('/');
      }

      alert(response.data.message);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h3 style={styles.formTitle}>login now</h3>
        <form onSubmit={submitFrom}>
          <input
            type="email"
            name="username"
            onChange={handleInput}
            value={inputData.username}
            required
            placeholder="enter your email"
            style={styles.input}
          />
          <input
            type="password"
            name="password"
            onChange={handleInput}
            value={inputData.password}
            required
            placeholder="enter your password"
            style={styles.input}
          />
          <input
            type="submit"
            name="submit"
            value="login now"
            className="form-btn"
            style={styles.formBtn}
          />
        </form>

        <p style={styles.formText}>
          don't have an account?{" "}
          <Link to="/user/register" style={styles.formLink}>
            register now
          </Link>
        </p>

        {/* Admin Login Link */}
        <p style={{ ...styles.formText, marginTop: "10px" }}>
          Are you an admin?{" "}
          <Link to="/admin/login" style={styles.formLink}>
            Admin Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
