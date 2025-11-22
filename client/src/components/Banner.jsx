import React from 'react'
import { assets } from '../assets/assets'
import { motion, scale } from "motion/react";

const Banner = () => {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    className='flex flex-col md:flex-row items-center justify-between px-8 md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-3 md:mx-auto rounded-2xl overflow-hidden'>
      
     
      <div className='text-white max-w-md'>
        <h2 className='text-3xl font-semibold'>Do you own a premium car?</h2>
        <p className='mt-2 text-sm md:text-base'>
          Monetize your vehicle effortlessly by listing it on CarRental.
        </p>
        <p className='mt-1 text-sm md:text-base'>
          We take care of insurance, driver verification, and secure payments — 
          so you can earn passive income stress-free.
        </p>

        <motion.button 
        whileHover={{scale:1.05}}
        whileTap={{scale:0.95}}

        className='px-6 py-2 bg-white hover:bg-slate-100 transition-all text-primary rounded-lg text-sm font-medium mt-6 cursor-pointer'>
          List your Car
        </motion.button>
      </div>

      
      <motion.img 
          initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6,delay:0.4 }}
        src={assets.banner_car_image} 
        alt="Luxury car" 
        className='max-h-72 md:max-h-80 mt-8 md:mt-0 object-contain'
      />
    </motion.div>
  )
}

export default Banner
