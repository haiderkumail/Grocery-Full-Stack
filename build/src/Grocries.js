// src/components/Grocries.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Grocries.css";

const Grocries = ({ userId }) => {
  const [groceries, setGroceries] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroceries = async () => {
      if (!userId) {
        setError("Please log in to view your grocery list.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/users/${userId}/checklist`);
        setGroceries(response.data);
        setError("");
      } catch (err) {
        setError("Error fetching groceries");
      }
    };
    
    fetchGroceries();
  }, [userId]);

  const addItem = async () => {
    if (!newItem) {
      setError("Please enter a grocery item");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/users/${userId}/checklist`, { name: newItem });
      setGroceries((prevGroceries) => [...prevGroceries, response.data]);
      setNewItem("");
      setError("");
    } catch (err) {
      setError("Error adding grocery item");
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${userId}/checklist/${id}`);
      setGroceries((prevGroceries) => prevGroceries.filter((grocery) => grocery.id !== id));
    } catch (err) {
      setError("Error deleting grocery item");
    }
  };

  const toggleCompleted = async (id, completed) => {
    const url = completed
      ? `http://localhost:5000/users/${userId}/checklist/${id}/incomplete`
      : `http://localhost:5000/users/${userId}/checklist/${id}/complete`;

    try {
      await axios.patch(url);
      setGroceries((prevGroceries) =>
        prevGroceries.map((grocery) =>
          grocery.id === id ? { ...grocery, completed: !completed } : grocery
        )
      );
    } catch (err) {
      setError("Error toggling completion status");
    }
  };

  return (
    <div className="Grocries">
      <h1>Items List</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="input-data">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new grocery"
          className="input-field"
        />
        <button onClick={addItem} className="add-button">Add</button>
      </div>

      <ul className="grocery-list">
        {groceries.map((grocery) => (
          <li key={grocery.id} className="grocery-item">
            <span className={`grocery-name ${grocery.completed ? "completed" : ""}`}>
              {grocery.name}
            </span>
            <button
              onClick={() => toggleCompleted(grocery.id, grocery.completed)}
              className="toggle-button"
            >
              {grocery.completed ? "Uncomplete" : "Complete"}
            </button>
            <button onClick={() => deleteItem(grocery.id)} className="delete-button">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Grocries;
