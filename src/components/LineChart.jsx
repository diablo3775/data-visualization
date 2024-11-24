import React, { useEffect, useRef, useState } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const LineChart = ({ data, selectedFeature }) => {
  const graphRef = useRef(null);

  // Transform and sort data for the selected feature
  const transformedData = data
    .map((d) => {
      const [day, month, year] = d.Day.split("/");
      const date = new Date(year, month - 1, day).toLocaleDateString("en-GB");
      return { date, value: d[selectedFeature] || 0 };
    })
    .sort((a, b) => {
      const dateA = new Date(a.date.split("/").reverse().join("/"));
      const dateB = new Date(b.date.split("/").reverse().join("/"));
      return dateA - dateB;
    });

  // Manage zoom and pan states
  const [zoomDomain, setZoomDomain] = useState({
    startIndex: 0,
    endIndex: transformedData.length - 1,
  });

  const handleWheel = (e) => {
    e.preventDefault();
    const { startIndex, endIndex } = zoomDomain;
    const range = endIndex - startIndex;

    if (e.deltaY < 0) {
      // Zoom in (scroll up)
      if (range > 2) {
        setZoomDomain({
          startIndex: Math.min(startIndex + 1, transformedData.length - 2),
          endIndex: Math.max(endIndex - 1, startIndex + 2),
        });
      }
    } else {
      // Zoom out (scroll down)
      setZoomDomain({
        startIndex: Math.max(0, startIndex - 1),
        endIndex: Math.min(transformedData.length - 1, endIndex + 1),
      });
    }
  };

  const handleScrollBlock = (e) => {
    if (graphRef.current && graphRef.current.contains(e.target)) {
      e.preventDefault(); // Prevent scrolling the body
    }
  };

  const resetZoom = () => {
    setZoomDomain({ startIndex: 0, endIndex: transformedData.length - 1 });
  };

  // Reset zoom when selectedFeature or data changes
  useEffect(() => {
    resetZoom();
  }, [selectedFeature, data]);

  // Attach event listeners to block scroll on mouse enter
  React.useEffect(() => {
    document.addEventListener("wheel", handleScrollBlock, { passive: false });
    return () => {
      document.removeEventListener("wheel", handleScrollBlock);
    };
  }, []);

  return (
    <div
      ref={graphRef}
      onWheel={handleWheel}
      className="relative"
      style={{ overflow: "hidden", height: "auto" }}
    >
      <RechartsLineChart
        width={800}
        height={400}
        data={transformedData.slice(
          zoomDomain.startIndex,
          zoomDomain.endIndex + 1
        )}
      >
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
      </RechartsLineChart>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          onClick={resetZoom}
        >
          Reset Zoom
        </button>
      </div>
    </div>
  );
};

export default LineChart;
