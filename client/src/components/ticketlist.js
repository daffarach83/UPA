
import React from 'react';

const TicketList = () => {
  return (
    <div>
      <h2>All Tickets</h2>
      <div>
        <label>Show:</label>
        <select>
          <option>All</option>
          <option>Active</option>
          <option>Closed</option>
        </select>
        <input type="text" placeholder="Search..." />
      </div>
      {/* Placeholder for ticket items; can be mapped from an array */}
      <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '200px' }}>
        No tickets available.
      </div>
    </div>
  );
};

export default TicketList;