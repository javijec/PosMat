import React from "react";

const ContactMap = () => {
  return (
    <div className="h-[200px] md:h-[350px] bg-gray-200 rounded-lg overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.5050395530075!2d-57.58610460913509!3d-38.01200397299919!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9584dec67072377d%3A0xc3c80a9a9de624d3!2sFacultad%20de%20Ingenier%C3%ADa!5e0!3m2!1ses-419!2sar!4v1739051762079!5m2!1ses-419!2sar"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="mapa"
      ></iframe>
    </div>
  );
};

export default ContactMap;
