import React from "react";

const DescriptionBox = ({ description }) => {
  if (!description) return null;

  return (
    <div className="mt-6 p-4 bg-gray-50 border-l-4 border-indigo-400 rounded">
      <h2 className="text-xl font-semibold mb-2">Generated Description</h2>
      <p className="text-gray-700 whitespace-pre-line">{description}</p>
    </div>
  );
};

export default DescriptionBox;
