import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import styled from "styled-components";
import { InputAdornment, IconButton } from '@mui/material';
import "./searchbar.css";

import { useSpeechSynthesis } from "react-speech-kit";

const CustomTextField = styled(TextField)`
    & label.Mui-focused {
      color: #0B0B45;
    }
    & label {
      color: #0B0B45;
    }
    & .MuiOutlinedInput-root {
      border-radius: 20px;
      &.Mui-focused fieldset {
        border-color: #c65102;
      }
      &:hover fieldset {
        border-color: #c65102;
      }
      & fieldset {
        border-color: #c65102;
      }
    }
  `;

export default function Searchbar(props) {
  const rate = 1.7;

  const handleSubmit = async (e, searchTerm) => {
    e.preventDefault();
    props.urlCallback(searchTerm);
  }

  const { speak } = useSpeechSynthesis();
  
  const handleFocus = () => {
    console.log("input field");
    speak({ 
      text: "Enter listing url",
      rate: rate
    });
  }

  const searchIconFocus = () => {
    speak({ 
      text: "Search",
      rate: rate
    });
  }  

  return (
    <div className="searchbar-container" style = {{ width: "75%" }}>
      <form className="search" onSubmit={(e) => {
        handleSubmit(e, document.getElementById("searchTerm").value);
      }}>
        <CustomTextField onFocus={handleFocus} style = {{ width: "100%" }} label="Enter listing URL" type="search" id="searchTerm" required InputProps={{
          style: {
            marginBottom: -10
          },
          endAdornment: (
            <InputAdornment position="end" style={{ paddingRight: 10 }}>
              <IconButton edge="end" className="searchButton" type="submit" onFocus={searchIconFocus}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        InputLabelProps={{
          required: false
        }}
        />
      </form><br></br>
    </div>
  )
}
