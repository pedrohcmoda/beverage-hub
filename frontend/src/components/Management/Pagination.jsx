import React from "react";
import styles from "./Pagination.module.css";
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from "react-icons/fa";

function Pagination({ page, totalPages, rowsPerPage, setRowsPerPage, setPage, totalRows }) {
  return (
    <div className={styles.pagination}>
      <span>Items per page:</span>
      <select className={styles.rowsSelect} value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}>
        {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <span>{(page - 1) * rowsPerPage + 1}-{Math.min(page * rowsPerPage, totalRows)} de {totalRows}</span>
      <button className={styles.pageBtn} onClick={() => setPage(1)} disabled={page === 1}><FaAngleDoubleLeft /></button>
      <button className={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><FaAngleLeft /></button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 2), page + 1).map(p => (
        <button
          key={p}
          className={styles.pageBtn + (p === page ? ' ' + styles.active : '')}
          onClick={() => setPage(p)}
          disabled={p === page}
        >
          {p}
        </button>
      ))}
      <button className={styles.pageBtn} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}><FaAngleRight /></button>
      <button className={styles.pageBtn} onClick={() => setPage(totalPages)} disabled={page === totalPages}><FaAngleDoubleRight /></button>
    </div>
  );
}

export default Pagination;
