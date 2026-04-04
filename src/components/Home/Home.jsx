import React from "react";
import Features from "./components/Features.jsx";
import News from "./components/News.jsx";
import Hero from "./components/Hero.jsx";

const Home = () => {
  return (
    <div className="bg-[var(--bg-surface)]">
      <Hero />
      <News />
      <Features />
    </div>
  );
};

export default Home;
