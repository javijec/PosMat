import React from "react";
import Features from "./components/Features.jsx";
import News from "./components/News.jsx";
import Hero from "./components/Hero.jsx";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <Features />
      {/* <News /> */}
    </div>
  );
};

export default Home;
