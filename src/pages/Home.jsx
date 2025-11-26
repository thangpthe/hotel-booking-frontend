import React from 'react'
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MostPicked from '../components/MostPicked';
import PopularRooms from '../components/PopularRooms';
import Testimonial from '../components/Testimonial';
import NewsLetter from '../components/NewsLetter';

const Home = () => {
  return (
    <div>
        <Hero/>
        <MostPicked/>
        <PopularRooms/>
        <Testimonial/>
        <NewsLetter/>
    </div>
  )
}

export default Home;