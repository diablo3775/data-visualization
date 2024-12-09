import React, { useEffect, useState } from "react";
import LineChart from "../components/LineChart";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Cookies from "universal-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useUserAuth } from "../context/UserAuthContext";

const cookies = new Cookies();

const Home = () => {
  const [firestoreData, setFirestoreData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [gender, setGender] = useState(cookies.get("gender") || "");
  const [age, setAge] = useState(cookies.get("age") || "");
  const [startDate, setStartDate] = useState(
    cookies.get("startDate") ? new Date(cookies.get("startDate")) : null
  );
  const [endDate, setEndDate] = useState(
    cookies.get("endDate") ? new Date(cookies.get("endDate")) : null
  );
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const { logOut, user } = useUserAuth();

  const handleLogout = async () => {
      try {
        await logOut();
        navigate("/")
      } catch (error) {
        console.log(error.message);
      }
    };
    
  const navigate = useNavigate();
  const location = useLocation();

   // Check authentication and redirect if not logged in
   useEffect(() => {
    if (!user) {
      navigate(`/login?returnUrl=${encodeURIComponent(location.pathname + location.search)}`);
    }
  }, [user, navigate, location]);

  // Parse URL for filters
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const urlGender = query.get("gender");
    const urlAge = query.get("age");
    const urlStartDate = query.get("startDate");
    const urlEndDate = query.get("endDate");

    if (urlGender) setGender(urlGender);
    if (urlAge) setAge(urlAge);
    if (urlStartDate) setStartDate(new Date(urlStartDate));
    if (urlEndDate) setEndDate(new Date(urlEndDate));
  }, [location.search]);

  useEffect(() => {
    const fetchFirestoreData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "data"));
        const data = querySnapshot.docs.map((doc) => doc.data());
        setFirestoreData(data);

        const parsedDates = data.map((d) => {
          const [day, month, year] = d.Day.split("/");
          return new Date(year, month - 1, day);
        });
        setMinDate(new Date(Math.min(...parsedDates)));
        setMaxDate(new Date(Math.max(...parsedDates)));
        setFilteredData(data);
      } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFirestoreData();
  }, []);

  useEffect(() => {
    const filtered = firestoreData.filter((d) => {
      const [day, month, year] = d.Day.split("/");
      const date = new Date(year, month - 1, day);
      const isWithinDate =
        (!startDate || date >= startDate) && (!endDate || date <= endDate);
      const matchesGender = !gender || d.Gender === gender;
      const matchesAge = !age || d.Age === age;

      return isWithinDate && matchesGender && matchesAge;
    });

    setFilteredData(filtered);

    // Save preferences to cookies
    cookies.set("gender", gender, { path: "/" });
    cookies.set("age", age, { path: "/" });
    cookies.set("startDate", startDate ? startDate.toISOString() : "", {
      path: "/",
    });
    cookies.set("endDate", endDate ? endDate.toISOString() : "", { path: "/" });
  }, [firestoreData, gender, age, startDate, endDate]);

  const features = ["A", "B", "C", "D", "E", "F"];
  const transformedData = features.map((feature) => {
    const total = filteredData.reduce((sum, d) => sum + (d[feature] || 0), 0);
    return { feature, total };
  });

  const clearPreferences = () => {
    cookies.remove("gender");
    cookies.remove("age");
    cookies.remove("startDate");
    cookies.remove("endDate");
    setGender("");
    setAge("");
    setStartDate(null);
    setEndDate(null);
  };

  const shareChart = () => {
    const url = new URL(window.location);
    url.searchParams.set("gender", gender || "");
    url.searchParams.set("age", age || "");
    url.searchParams.set("startDate", startDate ? startDate.toISOString() : "");
    url.searchParams.set("endDate", endDate ? endDate.toISOString() : "");
    navigator.clipboard.writeText(url.toString());
    alert("URL copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center">
          <label className="text-gray-700 mr-2">Gender:</label>
          <div className="w-40">
            <Select
              options={[
                { value: "", label: "All" },
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              value={{ value: gender, label: gender || "All" }}
              onChange={(option) => setGender(option?.value || "")}
            />
          </div>
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 mr-2">Age:</label>
          <div className="w-40">
            <Select
              options={[
                { value: "", label: "All" },
                { value: "15-25", label: "15-25" },
                { value: ">25", label: ">25" },
              ]}
              value={{ value: age, label: age || "All" }}
              onChange={(option) => setAge(option?.value || "")}
            />
          </div>
        </div>
      </div>
      
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogout}>Log Out</button>
      </div>
      

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={shareChart}
      >
        Share Chart
      </button>
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
        onClick={clearPreferences}
      >
        Clear Preferences
      </button>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-center">Bar Chart</h3>
        <div className="flex justify-center">
          <BarChart layout="vertical" width={600} height={400} data={transformedData}>
            <XAxis type="number" />
            <YAxis type="category" dataKey="feature" />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" onClick={(data) => setSelectedFeature(data.feature)} />
          </BarChart>
        </div>
      </div>

      {/* Line Chart Section */}
      {selectedFeature && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h3 className="text-xl font-semibold text-center">
            Line Chart for {selectedFeature}
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center">
              <label className="text-gray-700 mr-2">Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                minDate={minDate}
                maxDate={maxDate}
                className="border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center">
              <label className="text-gray-700 mr-2">End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                minDate={minDate}
                maxDate={maxDate}
                className="border-gray-300 rounded"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <LineChart data={filteredData} selectedFeature={selectedFeature} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
