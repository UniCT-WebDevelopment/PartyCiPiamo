import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './App.css'

function Login() {

  const [formData, setFormData] = useState({ emailIn: '', passwordIn: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', formData);
      sessionStorage.setItem('token', response.data.token);
      navigate('/homepage');
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Invalid login credentials.');
    }
  };

  return (
    <div className="Login fullpage p-5 p-md-5 bg-danger">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div className="card border border-light-subtle rounded-3 shadow-sm">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="text-center mb-3">
                  <img src="assets/img/logoNuovo.png" alt="Eventi Logo" className="img-fluid" style={{ width: '50%' }} />
                </div>
                <h2 className="fs-6 fw-normal text-center text-secondary mb-4">
                  Entra nel tuo account
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-2 overflow-hidden">
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control border-primary"
                          name="emailIn"
                          id="emailIn"
                          placeholder="name@example.com"
                          value={formData.emailIn}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="emailIn" className="form-label text-primary">
                          Email
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control border-primary"
                          name="passwordIn"
                          id="passwordIn"
                          placeholder="password"
                          value={formData.passwordIn}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="passwordIn" className="form-label text-primary">
                          Passowrd
                        </label>
                      </div>
                    </div>
                    {errorMessage && (
                      <div className="col-12">
                        <p className="text-danger text-center">{errorMessage}</p>
                      </div>
                    )}

                    <div className="col-12">
                      <div className="d-grid my-3">
                        <button className="btn btn-primary btn-lg" type="submit">
                          Entra
                        </button>
                      </div>
                    </div>
                    <div className="col-12">
                      <p className="m-0 text-success text-center">
                        Non hai ancora un account? <a href="./register" className="link-danger text-decoration-none">Registrati ora!</a>
                      </p>
                    </div>
                    <div className="col-12">
                      <p className="m-0 text-success text-center">
                        Oppure
                      </p>
                    </div>
                    <div className="col-12">
                      <p className="m-0 text-success text-center">
                        <a href='/' className='btn btn-primary' >Scopri i nostri eventi</a>

                      </p>
                    </div>

                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
