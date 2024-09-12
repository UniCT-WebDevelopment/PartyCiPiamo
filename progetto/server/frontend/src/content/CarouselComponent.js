import React from 'react';
import Slider from 'react-slick';

const CarouselComponent = ({ images }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <Slider {...settings}>
            {images.length > 0 ? (
                images.map((image, index) => (
                    <div key={index} className='eventDetail'>
                        <img src={image} className="d-block w-100 " alt={`Slide ${index}`} />
                    </div>
                ))
            ) : (
                <div>
                    <img src="assets/img/logoNuovo.png" className="defaultImage ms-lg-5" alt="Default Slide" />
                </div>
            )}
        </Slider>
    );
};

export default CarouselComponent;
