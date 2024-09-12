import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import Navbar from './Navbar';
import Footer from './Footer';

const mapContainerStyle = {
    height: '650px',
    width: '100%',
};

const center = {
    lat: 37.51136,
    lng: 15.08709,
};

function Mappa() {
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await axios.get('/api/events/markers', {
                    headers: { authorization: sessionStorage.getItem('token') }
                });
                console.log('API Response:', response.data);
                setMarkers(response.data);
            } catch (error) {
                console.error('Error fetching marker data:', error);
            }
        };

        fetchMarkers();
    }, []);

    const handleEventClick = (eventId) => {
        navigate(`/evento?id=${eventId}`);
    };

    return (
        <div className="Mappa justify-content-center fullpage">
            <Navbar />
            <div className='m-5 shadow map'>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                >
                    {markers.length > 0 && markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={{ lat: marker.latitude, lng: marker.longitude }}
                            onClick={() => setSelectedMarker(marker)}
                            icon={{
                                url: '/assets/img/logoNuovo.png', // URL dell'icona
                                scaledSize: new window.google.maps.Size(40, 40) // Opzionale: dimensioni personalizzate dell'icona
                            }}
                        />
                    ))}

                    {selectedMarker && (
                        <InfoWindow
                            position={{ lat: selectedMarker.latitude, lng: selectedMarker.longitude }}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div>
                                <a onClick={() => handleEventClick(selectedMarker._id)}>
                                    <h5 className='text-primary fw-bold'>{selectedMarker.name}</h5>
                                    <p className='text-dark'>{selectedMarker.location}</p>
                                    <p className='text-dark'>{new Date(selectedMarker.date).toLocaleDateString('it-IT', {
                                                                year: 'numeric',
                                                                month: 'numeric',
                                                                day: 'numeric'
                                                            })}</p>
                                </a>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </div>

            <Footer />
        </div>
    );
}

export default Mappa;
