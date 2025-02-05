import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addForexData, getForexData, searchForexData, deleteForexData } from '../api';
import Pagination from './Pagination';
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import PriceFilter from './PriceFilter';

const ForexData = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [pair, setPair] = useState('');
  const rowsPerPage = 15;
  const query = searchParams.get('query');

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    } else {
      fetchForexData();
    }
  }, [query, sortConfig, minPrice, maxPrice]);

  const fetchForexData = () => {
    const params = {
      ordering: sortConfig.direction === 'asc' ? sortConfig.key : `-${sortConfig.key}`,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
    };

    getForexData(params)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching Forex data:', error);
        setLoading(false);
      });
  };

  const fetchSearchResults = (query) => {
    searchForexData(query)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error searching Forex data:', error);
        setLoading(false);
      });
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
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

  const handleAddForexPair = async (e) => {
    e.preventDefault();
    try {
      await addForexData({ pair });
      alert("Forex pair added successfully.");
      setPair(''); // Clear the input field after submitting
    } catch (error) {
      console.error("Error adding forex pair", error);
      alert("Failed to add forex pair.");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this forex?')) {
      deleteForexData(id)
        .then(() => {
          setData(data.filter(item => item.id !== id));
        })
        .catch(error => {
          console.error('Error deleting forex data:', error);
        });
    }
  };

  return (
    <div>
      <h1 className="my-4">Forex Data</h1>
      <Row>
        <Col xs="auto">
          <PriceFilter onFilterChange={handleFilterChange} />
        </Col>
        <Col/>
        <Col xs="auto">
            <Form onSubmit={handleAddForexPair} inline>
              <Row>
              <Col>
                <Form.Control
                  type="text"
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  placeholder="Add new: e.g. EURUSD"
                  required
                />
              </Col>
              <Col xs="auto">
                <Button type="submit" variant='dark'>Add</Button>
              </Col>
              </Row>
            </Form>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('pair')}>Ticker{getSortIndicator('pair')}</th>
            <th onClick={() => handleSort('date')}>Date{getSortIndicator('date')}</th>
            <th onClick={() => handleSort('open')}>Open{getSortIndicator('open')}</th>
            <th onClick={() => handleSort('high')}>High{getSortIndicator('high')}</th>
            <th onClick={() => handleSort('low')}>Low{getSortIndicator('low')}</th>
            <th onClick={() => handleSort('close')}>Close{getSortIndicator('close')}</th>
            <th onClick={() => handleSort('volume')}>Volume{getSortIndicator('volume')}</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, Forex) => (
            <tr key={Forex}>
              <td>{item.pair}</td>
              <td>{item.date}</td>
              <td>{item.open}</td>
              <td>{item.high}</td>
              <td>{item.low}</td>
              <td>{item.close}</td>
              <td>{item.volume}</td>
              <td>
              <Row>
                  <Col>
                    <Button variant="dark" href={`/forex/${item.pair}`}>Details</Button>
                  </Col>
                  <Col>
                    <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                  </Col>
                </Row>
              </td>
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
