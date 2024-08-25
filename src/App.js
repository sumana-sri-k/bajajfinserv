import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [filter, setFilter] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);


  useEffect(() => {
    document.title = '21BCE7883';
  }, []);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Validate JSON format
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData || !Array.isArray(parsedData.data)) {
        setError('Invalid JSON format. Ensure JSON contains a valid "data" array.');
        return;
      }

      // Call the REST API
      const { data } = await axios.post('https://bfhcq-1-2bb9a5841482.herokuapp.com/bfhl', parsedData);
      setResponse(data);
    } catch (error) {
      setError('Error processing request. Ensure JSON is formatted correctly.');
      console.error(error);
    }
  };

  const handleFilterSelect = (filterValue) => {
    if (filter.includes(filterValue)) {
      setFilter(filter.filter(f => f !== filterValue));
    } else {
      setFilter([...filter, filterValue]);
    }
  };

  const handleFilterRemove = (filterValue) => {
    setFilter(filter.filter(f => f !== filterValue));
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const filteredData = [];

    if (filter.includes('numbers') && response.numbers?.length) {
      filteredData.push(<p key="numbers">Numbers: {response.numbers.join(', ')}</p>);
    }

    if (filter.includes('alphabets') && response.alphabets?.length) {
      filteredData.push(<p key="alphabets">Alphabets: {response.alphabets.join(', ')}</p>);
    }

    if (filter.includes('highest_lowercase_alphabet') && response.highest_lowercase_alphabet) {
      filteredData.push(<p key="highest_lowercase_alphabet">Highest Lowercase Alphabet: {response.highest_lowercase_alphabet}</p>);
    }

    if (filteredData.length === 0) {
      return <p>No data matches the selected filters.</p>;
    }

    return (
      <div className="filtered-response">
        <h3>Filtered Response</h3>
        {filteredData}
      </div>
    );
  };

  return (
    <div className="app-container">
      <h1>21BCE7883</h1>  { }

      <form onSubmit={handleSubmit} className="form-container">
        <label htmlFor="jsonInput" className="input-label">API Input</label>
        <input
          id="jsonInput"
          type="text"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON (e.g., {"data": ["M", "1", "334", "4", "B"]})'
          className="json-input"
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div className="filter-container">
          <label className="input-label">Multi Filter</label>
          <div className="filter-dropdown-container" ref={dropdownRef}>
            <div className="filter-input" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {filter.map(f => (
                <div key={f} className="filter-tag">
                  {f} <span className="remove-filter" onClick={(e) => { e.stopPropagation(); handleFilterRemove(f); }}>x</span>
                </div>
              ))}
              {!filter.length && <span>Select Filters</span>}
              <span className="dropdown-icon">{dropdownOpen ? '▲' : '▼'}</span>
            </div>

            {dropdownOpen && (
              <div className="filter-dropdown">
                <div className="filter-option" onClick={() => handleFilterSelect('numbers')}>
                  Numbers <span className="remove-filter" onClick={(e) => { e.stopPropagation(); handleFilterRemove('numbers'); }}>x</span>
                </div>
                <div className="filter-option" onClick={() => handleFilterSelect('alphabets')}>
                  Alphabets <span className="remove-filter" onClick={(e) => { e.stopPropagation(); handleFilterRemove('alphabets'); }}>x</span>
                </div>
                <div className="filter-option" onClick={() => handleFilterSelect('highest_lowercase_alphabet')}>
                  Highest Lowercase Alphabet <span className="remove-filter" onClick={(e) => { e.stopPropagation(); handleFilterRemove('highest_lowercase_alphabet'); }}>x</span>
                </div>
              </div>
            )}
          </div>

          <div className="filtered-output">
            {renderFilteredResponse()}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;