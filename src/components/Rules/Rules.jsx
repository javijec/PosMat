import React, { useState, useEffect } from "react";
import { fetchData } from "../../firebase/CRUD";
import RulesNavigator from "./RulesNavigator";
import RulesContent from "./RulesContent";

const Rules = () => {
  const [data, setData] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const collection = "rules";

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    if (data.length > 0 && !selectedSection) {
      setSelectedSection(data[0]);
    }
  }, [data]);

  const fetchRules = async () => {
    try {
      const rulesData = await fetchData(collection);
      const sortedData = rulesData.sort(
        (a, b) => (a.position || 0) - (b.position || 0)
      );
      setData(sortedData);
    } catch (error) {
      console.error("Error fetching rules data: ", error);
    }
  };

  const selectedIndex = data.findIndex(
    (section) => section.id === selectedSection?.id
  );

  const previousSection = () => {
    if (selectedIndex > 0) {
      setSelectedSection(data[selectedIndex - 1]);
    }
  };

  const nextSection = () => {
    if (selectedIndex < data.length - 1) {
      setSelectedSection(data[selectedIndex + 1]);
    }
  };

  if (!selectedSection) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 break-words">
        Reglamentos
      </h1>
      {/* Se reemplaza la navegación original por RulesNavigator */}
      <RulesNavigator
        data={data}
        selectedSection={selectedSection}
        onPrev={previousSection}
        onNext={nextSection}
        onSelect={setSelectedSection}
      />
      {/* Se reemplaza el contenido original por RulesContent */}
      <RulesContent selectedSection={selectedSection} />
    </div>
  );
};

export default Rules;
