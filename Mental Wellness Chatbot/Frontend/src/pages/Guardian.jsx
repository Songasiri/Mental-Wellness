import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";

const Guardian = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [guardian, setGuardian] = useState({
    name: "",
    email: "",
    relation: "",
  });
  const [allGuardians, setAllGuardians] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  // Handle input change
  const handleChange = (e) => {
    setGuardian({ ...guardian, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/user/addGuardian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, ...guardian }),
      });

      if (response.ok) {
        alert("Guardian added successfully!");
        setGuardian({ name: "", email: "", relation: "" });
        setIsOpen(false);
        getUser(); // Refresh list
      } else {
        alert("Failed to add guardian!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred!");
    }
  };

  // Fetch User Data
  const getUser = async () => {
    try {
      const { data } = await axios.post("http://localhost:3000/user/getUser", {
        userId,
      });
      setAllGuardians(data?.user?.guardians);

      // Extract email addresses and store them in local storage
      const guardianEmails =
        data?.user?.guardians?.map((guardian) => guardian.email) || [];
      localStorage.setItem("guardianEmails", JSON.stringify(guardianEmails));
    } catch (error) {
      console.log(error);
    }
  };

  // Delete Guardian
  const deleteGuardian = async (guardianId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/user/deleteGuardian",
        {
          userId,
          guardianId,
        }
      );

      alert("Guardian deleted successfully!");
      getUser(); // Refresh list
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while deleting guardian!");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Header />
      <div className="p-6">
        {/* Add Guardian Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-200"
        >
          <FaPlus /> Add Guardian
        </button>

        {/* Guardian List */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allGuardians.map((guardian) => (
            <div
              key={guardian._id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2 border border-gray-200"
            >
              <h3 className="text-lg font-semibold">{guardian.name}</h3>
              <p className="text-gray-600">{guardian.email}</p>
              <p className="text-gray-600">Relation: {guardian.relation}</p>
              <button
                onClick={() => deleteGuardian(guardian._id)}
                className="mt-2 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Add Guardian</h2>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={guardian.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                    placeholder="Enter Guardian Name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={guardian.email}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                    placeholder="Enter Guardian Email"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    Relation
                  </label>
                  <input
                    type="text"
                    name="relation"
                    value={guardian.relation}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                    placeholder="e.g., Father, Mother, Uncle"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition"
                  >
                    Add Guardian
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Guardian;
