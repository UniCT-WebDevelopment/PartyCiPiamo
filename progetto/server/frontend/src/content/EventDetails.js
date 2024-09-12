import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CarouselComponent from './CarouselComponent';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import getSocket from './Socket';

const EventDetails = () => {
    const token = sessionStorage.getItem('token');
    const [event, setEvent] = useState(null);
    const [user, setUser] = useState(null);
    const [organizer, setOrganizer] = useState(false);
    const [totalPartecipants, setTotalPartecipants] = useState('');
    const [isPartecipating, setIsPartecipating] = useState(false);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        text: '',
    });
    const location = useLocation();
    const navigate = useNavigate();
    const socket = getSocket();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const eventId = queryParams.get('id');

        if (eventId) {
            axios.get(`/api/events/${eventId}`, { headers: { authorization: token } })
                .then(response => {
                    setEvent(response.data);
                    fetchEventComments(eventId);
                })
                .catch(error => {
                    setError('Failed to load event details');
                    console.error(error);
                });

            axios.get('/api/auth/verify', { headers: { authorization: token } })
                .then(response => {
                    if (response.status !== 200) {
                        navigate('/homepage');
                    } else {
                        setUser(response.data.user);
                        fetchPartecipationStatus(response.data.user._id);
                        fetchPartecipantNumber();
                    }
                })
                .catch(error => {
                    console.error('Verification error:', error);
                    navigate('/homepage');
                });
            axios.get('/api/auth/verifyOrganizer', { headers: { authorization: token } })
                .then(response => {
                    if (response.status !== 200) {
                        setOrganizer(false);
                    } else {
                        setOrganizer(true);
                    }
                })
                .catch(error => {
                    console.error('Verification error:', error);
                    setOrganizer(false);
                });

        } else {
            setError('Event ID not found');
        }

        // Connect to socket and listen for new comments
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('newComment', (savedComment) => {
            console.log('New comment received:', savedComment); // Log the received comment
            setComments(prevComments => {
                const updatedComments = [...prevComments, savedComment];
                updatedComments.sort((a, b) => new Date(b.date) - new Date(a.date));
                return updatedComments;
            });
        });

        return () => {
            console.log('Socket disconnected');
            socket.off('newComment');
        };
    }, [location, token, navigate]);

    const fetchPartecipationStatus = async (userId) => {
        const queryParams = new URLSearchParams(location.search);
        const eventId = queryParams.get('id');

        try {
            const response = await axios.get('/api/partecipate/check', {
                params: {
                    eventId: eventId,
                    userId: userId
                }
            });
            setIsPartecipating(response.data.partecipa);
        } catch (error) {
            console.error('Errore nel recupero dello stato di partecipazione:', error);
        }
    };

    const fetchEventComments = async (eventId) => {
        try {
            const response = await axios.get('/api/events/commentsOf', { headers: { event: eventId } });
            const comments = response.data.comments || [];
            comments.sort((a, b) => new Date(b.date) - new Date(a.date));
            setComments(comments);
        } catch (error) {
            setError('Failed to load comments');
            console.error(error);
        }
    };

    const fetchPartecipantNumber = async () => {
        const queryParams = new URLSearchParams(location.search);
        const eventId = queryParams.get('id');

        try {
            const response = await axios.get('/api/partecipate/count', {
                params: {
                    eventId: eventId
                }
            });
            setTotalPartecipants(response.data.total);
        } catch (error) {
            console.error('Errore nel recupero dello stato di partecipazione:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePartecipate = async (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(location.search);
        const eventId = queryParams.get('id');

        try {
            const response = await axios.post(`/api/partecipate`,
                {
                    dati: {
                        eventId: eventId,
                        userId: user._id
                    }
                }, { headers: { authorization: token } });

            if (response.status === 200) {
                fetchPartecipationStatus(user._id);
                fetchPartecipantNumber();
            } else {
                console.error('Errore durante la partecipazione:', response);
                alert('Impossibile confermare la partecipazione.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Errore nella richiesta di partecipazione.');
        }
    };

    const handleNotPartecipate = async (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(location.search);
        const eventId = queryParams.get('id');

        try {
            const response = await axios.post(`/api/partecipate/stop`,
                {
                    dati: {
                        eventId: eventId,
                        userId: user._id
                    }
                });

            if (response.status === 200) {
                fetchPartecipationStatus(user._id);
                fetchPartecipantNumber();
            } else {
                console.error('Errore durante la non partecipazione:', response);
                alert('Impossibile confermare la non partecipazione.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Errore nella richiesta di non partecipazione.');
        }
    };

    const handleDeleteEvent = async (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(location.search);
        const eventId = queryParams.get('id');

        try {
            const response = await axios.delete(`/api/events/delete`,
                {
                    headers: { authorization: sessionStorage.getItem('token') },
                    params: { eventId: eventId }
                });

            if (response.status === 200) {
                alert("Evento eliminato");
                navigate('/organizzatore');
            } else {
                console.error('Errore durante l\'eliminazione:', response);
                alert('Impossibile confermare l\'eliminaziione.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Errore nella richiesta di eliminazione.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(location.search);
        const comment = {
            text: formData.text,
            user: user._id,
            event: queryParams.get('id'),
            data: new Date()
        };

        try {
            const response = await axios.post('/api/events/addComment', comment);
            console.log(response);
            if (response.status === 201) {
                socket.emit('sendComment', response.data);
                setFormData({ text: '' });
            } else {
                console.error('Error adding comment:', response);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleProfile = (userId) => {
        const goto = '/user?id=' + userId;
        navigate(goto);
    }
    if (error) {
        return <div>{error}</div>;
    }

    if (!event) {
        return (
          <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
            <div >
              <div className="loader"></div>
            </div>
          </div>
        );
      }

    return (
        <div className="fullpage">
            <Navbar />

            <div className="container px-lg-5">
                <div className="futureEvents p-4 p-lg-5 text-white text-center">
                    <div className="row text-white mb-4">
                        <div className="col-lg-2 col-12 d-flex justify-content-start">
                            <a href="javascript:history.back()" className="btn btn-outline-light d-flex align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5" />
                                </svg>
                            </a>
                        </div>
                        <div className="col-lg-8 col-12">
                            <h1 className="display-5 fw-bold text-white text-capitalize">{event.name}</h1>
                        </div>
                        <div className="col-lg-2 col-12 d-flex justify-content-end">
                            {isPartecipating ? (
                                <button type="button" className="btn btn-secondary d-flex align-items-center" onClick={handleNotPartecipate}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart me-2" viewBox="0 0 16 16">
                                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                    </svg>
                                    <span>Ci sono</span>
                                </button>
                            ) : (
                                <button type="button" className="btn btn-outline-light d-flex align-items-center" onClick={handlePartecipate}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart me-2" viewBox="0 0 16 16">
                                        <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                    </svg>
                                    <span>Partecipa</span>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-6 col-12 mb-4">
                            <div className="eventDetail carousel slide carousel-fade col-lg-6 col-sm-12 mb-4 mb-lg-0 p-0" id="carouselBasicExample" data-mdb-ride="carousel">
                                <CarouselComponent images={event.images} />
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="event-details text-start text-white overflow-auto p-4">
                                <h5><strong>Numero di partecipanti:</strong> {totalPartecipants}</h5>
                                <h5 className='text-capitalize'><strong>Categoria:</strong> {event.category}</h5>
                                <h5><strong>Data:</strong> {new Date(event.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                                    <strong> &ensp;Ora:</strong> {new Date(event.date).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                                </h5>
                                <h5><strong>Luogo:</strong> {event.location}</h5>
                                {event.description && <h5 className='overflow-auto'>{event.description}</h5>}
                            </div>
                            <form onSubmit={handleSubmit} className='mt-3 text-white bg-dark p-3 rounded'>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <textarea
                                            className="form-control details border-white inserisciCommento bg-dark text-white"
                                            name="text"
                                            id="text"
                                            placeholder="Commento..."
                                            rows="3"
                                            value={formData.text}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                        <label htmlFor="text" className="form-label details text-danger details">
                                            Commento...
                                        </label>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-danger">
                                            Send
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>

                    {organizer && event.organizer === user._id && (
                        <button className='btn btn-danger text-white col-12 mt-4' onClick={handleDeleteEvent}>Elimina Evento</button>
                    )}

                    <section className=''>
                        <h4 className="m-5 mb-0 text-warning fw-bold">Commenti</h4>
                        <div className="container py-5">
                            {comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <div key={index} className="row d-flex justify-content-center mb-3">
                                        <div className="col-md-12 col-lg-10">
                                            <div className="comment card shadow">
                                                <div className="card-body">
                                                    <div className="d-flex mb-3 ">
                                                        <a className="text-warning fw-bold ps-5" onClick={() => handleProfile(comment.user._id)}>
                                                            {comment.user.username || 'Anonimo'}
                                                        </a>
                                                        <span className="text-warning ms-auto">
                                                            {new Date(comment.date).toLocaleDateString('it-IT', { year: 'numeric', month: 'numeric', day: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className="mb-0 bg-light p-3 rounded">{comment.text}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div>
                                    <h6 className='fw-light text-black'>Ancora nessun commento</h6>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            <Footer />
        </div>

    );
}

export default EventDetails;
