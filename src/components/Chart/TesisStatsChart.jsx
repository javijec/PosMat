import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const TesisStatsChart = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
      <XAxis dataKey="year" tick={{ fill: "#374151", fontSize: 12 }} />
      <YAxis tick={{ fill: "#374151", fontSize: 12 }} />
      <Tooltip contentStyle={{ backgroundColor: "#f9fafb", border: "none" }} />
      <Legend wrapperStyle={{ color: "#374151" }} />
      <Bar dataKey="doctorado" fill="#4f46e5" name="Doctorado" />
      <Bar dataKey="maestria" fill="#10b981" name="Maestría" />
    </BarChart>
  </ResponsiveContainer>
);

export default TesisStatsChart;
