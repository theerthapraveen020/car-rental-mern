import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import {motion} from 'motion/react'

const Testimonial = () => {
  const testimonials = [
    {
      name: "Sneha Gupta",
      location: "Mumbai, India",
      image: assets.testimonial_image_1,
      testimonial:
        "Renting a premium car was effortless and truly luxurious. The driving experience exceeded all expectations!",
    },
    {
      name: "Sophia Williams",
      location: "New York, USA",
      image: assets.testimonial_image_2,
      testimonial:
        "Smooth booking, impeccable service, and a car that made every journey special. Highly recommended!",
    },
    {
      name: "Sneha Gupta",
      location: "Bengaluru, India",
      image: assets.testimonial_image_1,
      testimonial:
        "The car was pristine and comfortable. A premium experience from start to finish!",
    },
  ];

  return (
    <div className="py-28 px-6 md:px-16 lg:px-24 xl:px-44">
      <Title
        title="What Our Customers Say"
        subTitle="See why car enthusiasts and discerning drivers choose our premium cars for a superior driving experience."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mt-18">
        {testimonials.map((testimonial, index) => (
          <motion.div
          initial={{opacity:0,y:40}}
          whileInView={{opacity:1,y:0}}
          transition={{duration:0.6,delay:index*0.2,ease:'easeOut'}}
          viewport={{once:true,amount:0.3}}
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 translation-all duration-500"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-12 h-12 rounded-full"
                src={testimonial.image}
                alt={testimonial.name}
              />
              <div>
                <p className="text-xl">{testimonial.name}</p>
                <p className="text-gray-500">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <img key={index} src={assets.star_icon} alt="star-icon" />
                ))}
            </div>
            <p className="text-gray-500 max-w-90 mt-4 font-light">
              "{testimonial.testimonial}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
