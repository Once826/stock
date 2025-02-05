import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIndexHistory } from "../api";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { LineChart } from "@mui/x-charts";
import Pagination from './Pagination';

const IndexDetails = () => {
    const { ticker } = useParams();
    const [historicalData, setHistoricalData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const rowsPerPage = 10;

    const fetchData = () => {
        getIndexHistory(ticker, startDate, endDate)
            .then(response => setHistoricalData(response.data))
            .catch(error => console.error("Error fetching historical data:", error));
    };

    useEffect(() => {
        fetchData();
    }, [ticker]);

    const handleFilter = () => {
        fetchData();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedData = historicalData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div>
            <h1>Historical Data for {ticker}</h1>
            <Form inline className="mb-3">
                <Row>
                    <Col>
                        <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="endDate" className="mx-2">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button variant="dark" onClick={handleFilter}>Filter</Button>
                    </Col>
                </Row>
            </Form>
            <LineChart
                xAxis={[{ scaleType: "band", data: historicalData.map(item => (new Date(item.date)).toDateString()).reverse() }]}
                series={[{ data: historicalData.map(item => item.close).reverse(), showMark: false }]}
                width={1300}
                height={600}
            />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                        <th>Volume</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((item) => (
                        <tr key={item.id}>
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
                totalRows={historicalData.length}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default IndexDetails;
