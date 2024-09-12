import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Category = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchEventi = async (page) => {
        const query = new URLSearchParams(location.search);
        const categoriaParam = query.get('c');
        setCategoria(categoriaParam || 'tutto');
        try {
            const response = await axios.get(`/api/events/category`, {
                headers: { authorization: sessionStorage.getItem('token') },
                params: { category: categoriaParam, page, limit: 9 },
            });
            setEvents(Array.isArray(response.data.events) ? response.data.events : []);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
            console.log(events);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axios.get('/api/auth/verify', {
                    headers: { authorization: sessionStorage.getItem('token') },
                });
                if (response.status === 200) {
                    setUser(response.data.user);
                    fetchEventi(currentPage);
                } else {
                    navigate('/homepage');
                }
            } catch (error) {
                console.error('Verification error:', error);
                navigate('/homepage');
            }
        };
        verifyUser();
    }, [location.search, navigate, currentPage]);

    const handleEventClick = (eventId) => {
        navigate(`/evento?id=${eventId}`);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            fetchEventi(page);
        }
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
            <header className="py-5 flex-grow-1">
                <div className="container text-center">
                    <h1 className="display-4 text-warning text-capitalize">{categoria}</h1>
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
                            className="btn btn-warning mx-5"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                            </svg>
                        </button>
                        <span className="text-white "> {currentPage} di {totalPages}</span>
                        <button
                            className="btn btn-warning mx-5"
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>
            <Footer />
        </div>
    );
};

export default Category;
