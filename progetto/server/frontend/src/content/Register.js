import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './App.css'

function Register() {

  const [formData, setFormData] = useState({ email: '', username: '', password: '', organizer: false });
  const [errorMessage] = useState('');
  const navigate = useNavigate();

  //Cambia il contenuto di formData in tempo reale mentre si scrive
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', formData);
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred during registration.');
      }
    }
  };
  return (
    <div className="Register fullpage p-5 p-md-5 bg-danger">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
            <div className="card border border-success-subtle rounded-3 shadow-sm">
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="text-center mb-3">
                  <img src="assets/img/logoNuovo.png" alt="Eventi Logo" className="img-fluid" style={{ width: '50%' }} />

                </div>
                <h2 className="fs-6 fw-normal text-center text-success mb-4">
                  Registrati al tuo nuovo account
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="row gy-2 overflow-hidden">
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control border-dark"
                          name="email"
                          id="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="email" className="form-label text-dark">
                          Email
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="input"
                          className="form-control border-dark"
                          name="username"
                          id="username"
                          placeholder="Username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="password" className="form-label text-dark">
                          Username
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input
                          type="password"
                          className="form-control border-dark"
                          name="password"
                          id="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="password" className="form-label text-dark">
                          Password
                        </label>
                      </div>
                    </div>
                    <div class="col-12">
                      <div class="d-flex gap-2 justify-content-center">
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" value={formData.organizer} name="organizer" onChange={handleChange} id="organizer" />
                          <label class="form-check-label text-danger" for="organizer">
                            Sono un organizzatore
                          </label>
                        </div>
                      </div>
                    </div>
                    {errorMessage && (
                      <div className="col-12">
                        <p className="text-danger text-center">{errorMessage}</p>
                      </div>
                    )}

                    <div className="col-12">
                      <div className="d-grid my-3">
                        <button className="btn btn-danger text-white btn-lg" type="submit">
                          Registrati
                        </button>
                      </div>
                    </div>
                    <div className="col-12">
                      <p className="m-0 text-secondary text-center">
                        Hai già un account? <a href="./login" className="link-dark text-decoration-none">Entra!</a>
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

export default Register;
