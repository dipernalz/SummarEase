import SearchIcon from '@mui/icons-material/Search';
import "./searchbar.css";
import { useSpeechSynthesis } from "react-speech-kit";

export default function Searchbar(props) {
  
  const handleSubmit = async (e, searchTerm) => {
    e.preventDefault();
    console.log("Searchbar calling prop fn");
    props.urlCallback(searchTerm);
  }

  const handleFocus = () => {
    console.log("input field");
    speak({ text: "Enter listing url" });
  }

  const { speak } = useSpeechSynthesis();

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
          onFocus={handleFocus}
        />
        <button className="searchButton">
          <SearchIcon className="searchIcon" />
        </button>
      </form>
    </div>
  )
}
