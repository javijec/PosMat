import React from "react";
import { sanitizeHtml } from "../../utils/htmlSanitizer";

const AboutSection = ({ section }) => {
  return (
    <div className="mb-12">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900">
        {section.title}
      </h3>
      <p
        className="text-gray-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content) }}
      />
    </div>
  );
};

export default AboutSection;
