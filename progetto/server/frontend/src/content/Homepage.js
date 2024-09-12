import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Homepage() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      axios
        .get('/api/auth/verify', { headers: { authorization: token } })
        .then((response) => {
          if (response.status !== 200) {
            navigate('/login');
          } else {
            setUser(response.data.user);
            fetchFutureEvents(response.data.user);
          }
        })
        .catch((error) => {
          console.error('Verification error:', error);
          navigate('/login');
        });
    }
  }, [navigate]);

  const fetchFutureEvents = async (userId) => {
    await axios
      .get('/api/events/futureEvents', {
        headers: { authorization: sessionStorage.getItem('token') },
        params: { userId: userId },
      })
      .then((response) => {
        setEvents(response.data || []);
      })
      .catch((error) => {
        console.error('Error fetching events:', error);
      });
  };

  const handleEventClick = (eventId) => {
    navigate(`/evento?id=${eventId}`);
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div >
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100 bg-dark text-white">
      <Navbar />

      <div className="container text-center mt-5">
        <h1 className="display-4 text-warning">Ciao {user.username}!</h1>
      </div>

      <div className="container mt-5">
        <h2 className="text-center text-warning">I tuoi eventi futuri</h2>
        <div className="row justify-content-start">
          {events.length > 0 ? (
            events.map((event) => {
              const data = new Date(event.date);
              return (
                <div
                  key={event._id}
                  className="col-lg-4 col-md-6 mb-4"
                  onClick={() => handleEventClick(event._id)}
                >
                  <div className="card bg-black text-light h-100">
                    <figure className="card-img-top mb-0 overflow-hidden bsb-overlay-hover">
                      <img
                        src={
                          event.images.length > 0
                            ? event.images[0]
                            : '/assets/img/logoNuovo.png'
                        }
                        className=""
                        alt={event.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <figcaption>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-eye text-white bsb-hover-fadeInLeft" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                        </svg>
                        <h4 className="h6 text-white bsb-hover-fadeInRight mt-2">Scopri evento</h4>
                      </figcaption>
                    </figure>
                    <div className="card-body row d-flex ">
                      <h5 className="card-title col-12 text-warning mb-5">{event.name}</h5>
                      <p className=" col-6">
                        <span className="badge bg-info">{event.category}</span>
                      </p>
                      <p className="text-end text-warning col-6">
                        {data.toLocaleDateString('it-IT', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                        })}
                        ,{' '}
                        {data.toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-12">
              <p className="text-center text-muted">
                Nessun evento in programma
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Homepage;