import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import "./searchbar.css";

export default function Searchbar() {

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e, t) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("url is " + t);
    fetch('http://localhost:3000/api/product', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: {url: t}
    }).then(() => {
      setIsLoading(false);
  });
  }
  return (
    <div>
      <form className="search" onSubmit={(e) => {
        handleSubmit(e, document.getElementById("searchTerm").value);
      }}>
        <input 
          id="searchTerm"
          type="text" 
          className="searchTerm"
          placeholder="Enter listing url"
          required
        />
        <button className="searchButton">
          <SearchIcon className="searchIcon" />
        </button>
      </form>
      {!isLoading && <p>amazon review stuff</p>}
      {isLoading && <p>Loading...</p>}
    </div>
  )
}
