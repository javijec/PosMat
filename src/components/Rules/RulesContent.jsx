import React from "react";
import { sanitizeHtml } from "../../utils/htmlSanitizer";

const RulesContent = ({ selectedSection }) => {
  return (
    <div className="mt-4 text-sm md:text-base prose prose-indigo max-w-none">
      <div
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(selectedSection.html) }}
      />
    </div>
  );
};

export default RulesContent;
