// PriceFilter.js
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const PriceFilter = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('9999999999');

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    onFilterChange(e.target.value, maxPrice);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    onFilterChange(minPrice, e.target.value);
  };

  return (
  <div>
    <div>
      <label>
        Min Price:
        <Form.Control type="number" value={minPrice} onChange={handleMinPriceChange} />
      </label>
      <label>
        Max Price:
        <Form.Control type="number" value={maxPrice} onChange={handleMaxPriceChange} />
      </label>
    </div>
    <br />
    </div>
  );
};

export default PriceFilter;