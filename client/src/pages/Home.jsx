import React from 'react'
import Banner from '../assets/Components/home/Banner.jsx'
import Hero from '../assets/Components/home/hero.jsx'
import Features from '../assets/Components/home/Features.jsx'
import Testimonial from '../assets/Components/home/Testimonial.jsx'
import CallToAction from '../assets/Components/home/CallToAction.jsx'
import Footer from '../assets/Components/home/Footer.jsx'
import Login from './login.jsx'

const Home = () => {
  return (
    <div>
        <Banner/>
        <Hero/> 
        <Features/> 
        <Testimonial/> 
        <CallToAction />
        <Footer />
   
    </div>
  )
}

export default Home;