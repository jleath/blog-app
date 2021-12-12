import React from 'react';

const Notification = ({ message, isError }) => {
  const type = isError ? 'error' : 'success';
  if (!message) {
    return null;
  } else {
    return (
      <div className={`notification ${type}`}>
        <p>{message}</p>
      </div>
    );
  }
};

export default Notification;