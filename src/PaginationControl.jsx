import React from "react";
import { Pagination } from "react-bootstrap";

function PaginationControl({ currentPage, totalPages, onPageChange }) {
  const maxButtons = 7;
  let startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
  let endPage = startPage + maxButtons - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }

  const pageItems = [];
  for (let i = startPage; i <= endPage; i++) {
    pageItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <Pagination>
      <Pagination.Prev
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      />
      {startPage > 1 && <Pagination.Ellipsis disabled />}
      {pageItems}
      {endPage < totalPages && <Pagination.Ellipsis disabled />}
      <Pagination.Next
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
}

export default PaginationControl;
