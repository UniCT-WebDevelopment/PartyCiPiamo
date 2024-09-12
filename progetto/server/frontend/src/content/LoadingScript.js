import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const mapContainerStyle = {
    height: '650px',
    width: '100%',
};

const center = {
    lat: 37.51136,
    lng: 15.08709,
};

const mapId = '6e674a5f15d5b512';


function LoadingScript() {
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await axios.get('/api/events/futureEvents', { headers: { authorization: sessionStorage.getItem('token') } });
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
        <div>
            <LoadScript
                googleMapsApiKey="AIzaSyDfHYlA0EODV9YfoDGc5pAO93XLqhu_0Fs"
                mapIds={[mapId]}
                onLoad={() => console.log('Google Maps script loaded successfully.')}
                onError={(error) => console.error('Error loading Google Maps script:', error)}

            >

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
                                        <p className='text-dark'>{new Date(selectedMarker.date).toLocaleDateString()}</p>
                                    </a>
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                    </div>
            </LoadScript>
        </div>

    );
}

export default LoadingScript;
