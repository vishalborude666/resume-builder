import React from "react";

const Title = ({ title, description }) => {
  return (
    <div className="text-center mt-6">
      <h2 className="text-3xl sm:text-4xl font-bold">
        {title}
      </h2>
      <p className="max-w-2xl mx-auto mt-2 text-gray-500">
        {description}
      </p>
    </div>
  );
};

export default Title;
