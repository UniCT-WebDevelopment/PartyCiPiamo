import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { ToastContainer, toast } from 'react-toastify';

const Dashboard = () => {
    const location = useLocation();
    const [events, setEvents] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const fetchEventi = async (page) => {
        const query = new URLSearchParams(location.search);
        const categoriaParam = query.get('c');
        setCategoria(categoriaParam || 'tutto');
        try {
            const response = await axios.get(`/api/events/category`, {
                params: { category: categoriaParam, page, limit: 9 },
            });
            setEvents(Array.isArray(response.data.events) ? response.data.events : []);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = sessionStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                navigate('/');
            }
        };
    
        checkLoginStatus();
        fetchEventi(currentPage);
    }, [location.search, currentPage, navigate]);
    
    const handleEventClick = (eventId) => {
        if (isLoggedIn) {
            navigate(`/evento?id=${eventId}`);
        } else {
            toast.info('Per vedere i dettagli dell\'evento, devi prima effettuare il login.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                onClose: () => navigate('/login'),
            });
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            fetchEventi(page);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-dark text-white">
            <Navbar />
            <header className="py-5 flex-grow-1">
                <div className="container text-center">
                    <h1 className="display-4 text-warning text-capitalize">Scopri tutti gli eventi</h1>
                </div>
                <div className="container mt-5">
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
                                <p className="text-center text-muted">Nessun evento in programma</p>
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <button
                            className="btn btn-warning mx-2"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Precedente
                        </button>
                        <span className="text-white">Pagina {currentPage} di {totalPages}</span>
                        <button
                            className="btn btn-warning mx-2"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Successivo
                        </button>
                    </div>
                </div>
            </header>

            <ToastContainer />

            <Footer />
        </div>
    );
};

export default Dashboard;
