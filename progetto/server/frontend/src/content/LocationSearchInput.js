import React, { useState, useRef } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

function LocationSearchInput({ onSelect }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_KEY, 
        libraries,
    });

    const [address, setAddress] = useState('');
    const autocompleteRef = useRef(null);

    const onLoad = (autocomplete) => {
        autocompleteRef.current = autocomplete;
    };

    const onPlaceChanged = () => {
        if (autocompleteRef.current !== null) {
            const place = autocompleteRef.current.getPlace();
            console.log('Place Object:', place); 

            // Verifica che place e place.geometry esistano
            if (place && place.geometry && place.geometry.location) {
                const location = place.geometry.location;
                setAddress(place.formatted_address);

                onSelect({
                    location: place.formatted_address,
                    latitude: location.lat(),
                    longitude: location.lng(),
                });
            } else {
                console.log('Place or place.geometry is not defined!');
                onSelect({
                    location: '',
                    latitude: '',
                    longitude: '',
                });
                return <div>Error founding place</div>;
            }
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Previene l'invio del form con il tasto Invio
        }
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading Maps...</div>;
    }

    return (
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
                id="place"
                type="text"
                placeholder="Cerca il luogo..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={handleKeyDown}
                className="form-control"
            />
        </Autocomplete>
    );
}

export default LocationSearchInput;