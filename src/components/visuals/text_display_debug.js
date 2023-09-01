import React, { useState, useRef, useEffect } from 'react';

const DisplayStrings = ({ string, devmessage }) => {
  const [stringContent, setStringContent] = useState([]);
  const [devContent, setDevContent] = useState([]);
  const stringBoxRef = useRef(null);
  const devBoxRef = useRef(null);

  useEffect(() => {
    if (string) {
      setStringContent((prevContent) => [...prevContent, string]);
    }
  }, [string]);

  useEffect(() => {
    if (devmessage) {
      setDevContent((prevContent) => [...prevContent, devmessage]);
    }
  }, [devmessage]);

  return (
    <div style={styles.container}>
      <div style={styles.box} ref={stringBoxRef}>
        {stringContent.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
      </div>
      <div style={styles.box} ref={devBoxRef}>
        {devContent.map((item, index) => (
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
