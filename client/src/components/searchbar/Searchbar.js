import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import "./searchbar.css";

export default function Searchbar() {
  return (
    <form className="search">
      <input type="text" className="searchTerm" placeholder="Enter listing url"/>
      <button type="submit" className="searchButton">
            <SearchIcon className="searchIcon" />
      </button>
    </form>
  )
}
