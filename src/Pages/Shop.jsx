// ./Pages/Shop.jsx

import React, { useEffect, useState } from 'react';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollections from '../Components/NewCollections/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';

// Get the API URL from the environment variable we set up
const API_URL = process.env.REACT_APP_API_URL || import.meta.env.VITE_API_URL;

const Shop = () => {
  const [popular, setPopular] = useState([]);
  const [newCollection, setNewCollection] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const [error, setError] = useState(null);     // State to track errors

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        // Use Promise.all to fetch all data concurrently
        const [popularRes, newCollectionRes] = await Promise.all([
          fetch(`${API_URL}/popularinwomen`),
          fetch(`${API_URL}/newcollections`)
        ]);

        if (!popularRes.ok || !newCollectionRes.ok) {
          throw new Error('Failed to fetch product data.');
        }

        const popularData = await popularRes.json();
        const newCollectionData = await newCollectionRes.json();

        setPopular(popularData);
        setNewCollection(newCollectionData);

      } catch (err) {
        setError(err.message); // Set error message if anything fails
      } finally {
        setLoading(false); // Stop loading once done (either success or fail)
      }
    };

    fetchInfo();
  }, []); // Empty array ensures this runs only once on mount

  if (loading) {
    return <div>Loading your delicious food items...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Hero />
      <Popular data={popular} />
      <Offers />
      <NewCollections data={newCollection} />
      <NewsLetter />
    </div>
  );
};

export default Shop;