import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllForexData, searchInForexData } from '../api';
import Pagination from './Pagination';
import { Table } from 'react-bootstrap';
import PriceFilter from './PriceFilter';

const ForexData = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('9999999999');
  const rowsPerPage = 10;
  const query = searchParams.get('query');

  useEffect(() => {
    if (query) {
      searchForexData(query);
    } else {
      fetchSortedData(sortConfig.key, sortConfig.direction, minPrice, maxPrice);
    }
  }, [sortConfig, query, minPrice, maxPrice]);

  const fetchSortedData = (key, direction, minPrice, maxPrice) => {
    getAllForexData({ sort_by: key, order: direction, min_price: minPrice, max_price: maxPrice })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching forex data:', error);
        setLoading(false);
      });
  };

  const searchForexData = (query) => {
    searchInForexData(query)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching index data:', error);
        setLoading(false);
      });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    fetchSortedData(sortConfig.key, sortConfig.direction, min, max);
  };

  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  return (
    <div>
      <h1 className="my-4">Forex Data</h1>
      <PriceFilter onFilterChange={handleFilterChange} />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('pair')}>Pair{getSortIndicator('pair')}</th>
            <th onClick={() => handleSort('date')}>Date{getSortIndicator('date')}</th>
            <th onClick={() => handleSort('open')}>Open{getSortIndicator('open')}</th>
            <th onClick={() => handleSort('high')}>High{getSortIndicator('high')}</th>
            <th onClick={() => handleSort('low')}>Low{getSortIndicator('low')}</th>
            <th onClick={() => handleSort('close')}>Close{getSortIndicator('close')}</th>
            <th onClick={() => handleSort('volume')}>Volume{getSortIndicator('volume')}</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.pair}</td>
              <td>{item.date}</td>
              <td>{item.open}</td>
              <td>{item.high}</td>
              <td>{item.low}</td>
              <td>{item.close}</td>
              <td>{item.volume}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        totalRows={data.length}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ForexData;