import React, { useEffect, useState } from "react";
import { fetchData } from "../../firebase/CRUD";
import { sanitizeHtml } from "../../utils/htmlSanitizer";
import AboutSection from "./AboutSection";

const About = () => {
  const [data, setData] = useState([]);
  const collection = "about";

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const aboutData = await fetchData(collection);
      setData(aboutData.sort((a, b) => (a.position || 0) - (b.position || 0)));
    } catch (error) {
      console.error("Error fetching about data: ", error);
    }
  };

  return (
    <div className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-16 text-gray-900">
          Sobre el Posgrado
        </h1>
        <section className="prose prose-lg max-w-none">
          <img
            src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            alt="Laboratory"
            className="float-right rounded-2xl shadow-xl md:w-1/2 w-full ml-8 mb-8 object-cover"
          />
          {/* Se reemplaza la renderización de secciones por AboutSection */}
          <div className="space-y-12">
            {data.map((section, index) => (
              <AboutSection key={index} section={section} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
