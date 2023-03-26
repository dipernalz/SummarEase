import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import styled from "styled-components";
import { InputAdornment, IconButton } from '@mui/material';
import "./searchbar.css";


export default function Searchbar(props) {
  const handleSubmit = async (e, searchTerm) => {
    e.preventDefault();
    props.urlCallback(searchTerm);
  }

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

  return (
    <div className="searchbar-container" style = {{ width: "75%" }}>
      <form className="search" onSubmit={(e) => {
        handleSubmit(e, document.getElementById("searchTerm").value);
      }}>
        <CustomTextField style = {{ width: "100%" }} label="Enter listing url" type="search" id="searchTerm" required InputProps={{
          style: {
            marginBottom: -10
          },
          endAdornment: (
            <InputAdornment position="end" style={{ paddingRight: 10 }}>
              <IconButton edge="end" className="searchButton" type="submit">
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
