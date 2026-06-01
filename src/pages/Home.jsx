import React from 'react'
import Hero from '../components/home/Hero';
import MostPicked from '../components/home/MostPicked';
import PopularRooms from '../components/home/PopularRooms';
import Testimonial from '../components/home/Testimonial';
import NewsLetter from '../components/home/NewsLetter';

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