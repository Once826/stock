import { Button, ButtonGroup } from 'react-bootstrap';

const Pagination = ({ totalRows, rowsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  return (
    <ButtonGroup>
        {Array.from({ length: totalPages }, (_, index) => (
            <Button variant={`${currentPage === index + 1 ? 'dark' : 'outline-dark'}`} onClick={() => onPageChange(index + 1)}>
              {index + 1}
            </Button>
        ))}
    </ButtonGroup>
  );
};

export default Pagination;