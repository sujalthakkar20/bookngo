import React from "react";
import { motion } from "framer-motion";
import {
  FaBusAlt,
  FaMobileAlt,
  FaCreditCard,
  FaUndoAlt,
  FaHeadset,
  FaMapMarkedAlt,
  FaShieldAlt,
} from "react-icons/fa";
import "./PageStyle.css";

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Features = () => {
  const featureData = [
    {
      icon: <FaCreditCard className="nfeature-icon" />,
      title: "Secure Online Payments",
      desc: "Book confidently with our trusted, encrypted payment gateways — supporting UPI, cards, and wallets.",
    },
    // {
    //   icon: <FaBusAlt className="nfeature-icon" />,
    //   title: "Real-Time Bus Tracking",
    //   desc: "Stay updated with live bus locations, estimated arrival times, and delay notifications so you never miss your ride.",
    // },
    {
      icon: <FaMobileAlt className="nfeature-icon" />,
      title: "Seamless Mobile Experience",
      desc: "Our responsive web design ensures smooth booking and ticket management across all your devices.",
    },
    {
      icon: <FaUndoAlt className="nfeature-icon" />,
      title: "Easy Cancellations & Instant Refunds",
      desc: "Cancel anytime with just a few clicks and get your refund instantly without waiting.",
    },
    {
      icon: <FaHeadset className="nfeature-icon" />,
      title: "24×7 Customer Support",
      desc: "Our dedicated team is always available to help you through chat, call, or email — anytime, anywhere.",
    },
    {
      icon: <FaMapMarkedAlt className="nfeature-icon" />,
      title: "Wide Route Coverage",
      desc: "Connect across 5000+ routes and cities with trusted private and government bus operators.",
    },
    {
      icon: <FaShieldAlt className="nfeature-icon" />,
      title: "Verified Operators & Safety First",
      desc: "All our partners meet strict safety and hygiene standards for a secure, comfortable, and worry-free journey.",
    },
  ];

  return (
    <div className="features-page">
      {/* Header Section */}
      <header className="features-header">
        <div className="overlay">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose <span>BookNGo</span>?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover the smart, secure, and seamless way to book your travel —
            powered by innovation and comfort.
          </motion.p>
        </div>
      </header>

      {/* Features Grid */}
      <section className="nfeatures-grid">
        {featureData.map((item, index) => (
          <motion.div
            className="nfeature-card"
            key={index}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {item.icon}
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Features;
