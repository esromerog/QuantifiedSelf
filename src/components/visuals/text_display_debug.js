import React from 'react';

const DisplayStrings = ({value}) => {
  return (
    <div style={styles.container}>
      <div style={styles.box}>
        {value.current.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
    width: '800px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  box: {
    height: '150px',
    width: '45%', // Adjust the width as needed to accommodate both boxes side by side.
    overflowY: 'auto',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
  },
};

export default DisplayStrings;
