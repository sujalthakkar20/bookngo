import React from 'react';
import './PageStyle.css';

const About = () => (
  <div className="about-page">
    {/* --- Hero Section --- */}
    <section className="about-hero">
      <div className="about-hero-content">
        <h1>About BookNGo</h1>
        <p>India’s Trusted Bus Booking Platform – Making Travel Simple, Fast, and Secure</p>
      </div>
    </section>

    {/* --- Main Content --- */}
    <div className="page-container">
      <h2>BookNGo – India’s Trusted Bus Booking Platform</h2>

      <p>
        Over the years, <strong>BookNGo</strong> has been dedicated to offering simple and seamless 
        bus booking solutions to travelers across India. Our continuous innovation and commitment 
        to customer satisfaction have made BookNGo one of the most reliable and top-rated online 
        bus ticket booking platforms in the country.
      </p>

      <p>
        With a vast network of over <strong>6,000+ bus operators</strong> and access to more than 
        <strong> 600,000 routes</strong>, BookNGo provides travelers with unmatched convenience and 
        flexibility. Whether you’re booking through our website or mobile app, our platform ensures 
        a fast, secure, and hassle-free experience every time.
      </p>

      <p>
        Founded in <strong>2015</strong>, BookNGo has evolved into a complete travel technology 
        provider, offering end-to-end solutions such as <strong>e-ticketing systems</strong>, 
        <strong>fleet and route management</strong>, <strong>GPS-based vehicle tracking</strong>, 
        and <strong>passenger information systems</strong>. All these are supported by a 
        <strong>24x7 customer support center</strong> that’s always ready to assist.
      </p>

      <p>
        Today, BookNGo proudly serves as a trusted technology partner for both 
        <strong> state transport corporations</strong> and <strong>private fleet operators</strong> 
        across India. We are committed to providing safe, efficient, and smart travel experiences 
        powered by advanced technology and dedicated service.
      </p>

      <p>
        BookNGo follows industry-best practices and high quality standards, continuously striving 
        to make every journey simpler, safer, and more enjoyable for our customers.
      </p>
    </div>
  </div>
);

export default About;
