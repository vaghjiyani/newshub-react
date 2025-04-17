import React, { useState } from 'react';
import axios from 'axios'
import { styles } from './index'; // Import styles from index.js
import { useNavigate } from 'react-router-dom';


function Register() {

    const [inputData,setInputData] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",

    })

    const navigate = useNavigate();

    const submitFrom = async (event) => {

        console.log(inputData);
        event.preventDefault();
        if(inputData.confirmPassword === inputData.password){

            const data = {
                username:inputData.username,
                email:inputData.email,
                password:inputData.password
            }

            
            
            try {
                console.log(data);
                const response = await axios.post('http://localhost:8080/signup',data);
                console.log(response.data);

                if(response.data.userName !== undefined){
                    localStorage.setItem('userName', response.data.userName);
                    navigate('/user/login');
                }
                alert(response.data.message);
            } catch (error) {
                console.log(error);
            }


        }


    }

    const handleInput = (even) => {

        setInputData({...inputData,[even.target.name]: even.target.value}) 

    }

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h3 style={styles.formTitle}>register now</h3>
                <form onSubmit={submitFrom}>
                <input style={styles.input} name='username' value={inputData.username} onChange={handleInput} placeholder="enter your name" />
                <input style={styles.input} name='email' value={inputData.email} onChange={handleInput} placeholder="enter your email" />
                <input style={styles.input} type="password" value={inputData.password} onChange={handleInput} name='password' placeholder="enter your password" />
                <input style={styles.input} type="password" value={inputData.confirmPassword} onChange={handleInput} name='confirmPassword' placeholder="confirm your password" />
                <input type="submit" name="submit" value="Register now" className="form-btn" style={styles.formBtn} />
                </form>
                <p style={styles.formText}>already have an account? <a href="/user/login" style={styles.formLink}>login now</a></p>
            </div>
        </div>
    );
}

export default Register;
