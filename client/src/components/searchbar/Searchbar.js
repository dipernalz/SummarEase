import SearchIcon from '@mui/icons-material/Search';
import "./searchbar.css";

export default function Searchbar(props) {
  
  const handleSubmit = async (e, searchTerm) => {
    e.preventDefault();
    props.urlCallback(searchTerm);
  }

  return (
    <div className="searchbar-container" style={{width: "75%"}}>
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
          <SearchIcon className="searchIcon"/>
        </button>
      </form>
    </div>
  )
}
