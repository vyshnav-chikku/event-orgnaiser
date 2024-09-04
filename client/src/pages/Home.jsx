import React from 'react';
import { Link } from 'react-router-dom';
import CarouselComponent from '../components/Carsoule';
import EventListing from '../components/EventListing';


const Home = () => {
  return (
    <div>
      <CarouselComponent />
      <div className="container mt-5">
        <div className="jumbotron bg-light">
          <h1 className="display-4">Welcome to Event Weddora!</h1>
          <p className="lead">
            Your one-stop solution for all event management needs. We specialize in creating memorable and successful events tailored to your vision.
          </p>
          <hr className="my-4" />
          <p>Explore our services and let us make your event unforgettable.</p>
          <Link className="btn btn-primary btn-lg" to="/login" role="button">
            LoginNow
          </Link>
        </div>
      </div>
      <EventListing />

    </div>
  );
};

export default Home;

