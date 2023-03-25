import SearchIcon from '@mui/icons-material/Search';
import "./searchbar.css";

export default function Searchbar(props) {
  
  const handleSubmit = async (e, searchTerm) => {
    e.preventDefault();
    console.log("Searchbar calling prop fn");
    props.urlCallback(searchTerm);
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
    </div>
  )
}
