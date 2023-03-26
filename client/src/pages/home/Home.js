import Searchbar from "../../components/searchbar/Searchbar";
import React, { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import TextField from '@mui/material/TextField';
import styled from "styled-components";
import { InputAdornment, IconButton } from '@mui/material';
import { useSpeechSynthesis } from "react-speech-kit";
import "./home.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [successfulLoad, setSuccessfulLoad] = useState(false);
  const [productTitle, setProductTitle] = useState("");
  const [productImg, setProductImg] = useState("");
  // const [responseData, setResponseData] = useState({});
  const [prolist, setProlist] = useState([]);
  const [conslist, setConlist] = useState([]);
  const { speak, cancel } = useSpeechSynthesis();
  const [isSpeakingPros, setIsSpeakingPros] = useState(false);
  const [isSpeakingCons, setIsSpeakingCons] = useState(false);
  
  const queryBackend = async (searchVal) => {
    setIsLoading(true);
    console.log("url is " + searchVal);
    const resultData = await fetch('http://localhost:8080/api/product', {
        method: 'POST',
        mode: "cors",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"url": searchVal})
    }).then(response => {
        if (response.ok) {
          setIsLoading(false);
          return response.json()
        } else {
          throw response;
        }
      });
    console.log(resultData);
    try {
      if(resultData.status === "success") {
        setProductTitle(resultData.title);
        setProlist(resultData.pros);
        setConlist(resultData.cons);
        setProductImg(resultData.image);
        setSuccessfulLoad(true);
      } else {
        console.log("Scraping/summary failed");
        console.log(resultData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmitEmail = async (e, emailVal) => {
    e.preventDefault();
    console.log("recipient is " + emailVal);
    try {
        await fetch('http://localhost:8080/api/emailsave', {
          method: 'POST',
          mode: "cors",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            "emailrecipient": emailVal,
            "content": "Pros: " + prolist.toString() + "Cons: " + conslist.toString()
          })
      }).then(response => {
        if (response.ok) {
          console.log("email worked")
        } else {
          throw response;
        }
      });
    } catch (error) {
      console.log(error);
    }
    console.log("sent email");
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



  const prosFocus = () => {
    console.log("pros focus");
    speak({ text: "Pros" });
  }
  
  const prosClick = (text) => {
    console.log("pros click");
    setIsSpeakingPros(true);
    speak({ text: text });
  }

  const consFocus = () => {
    console.log("cons focus");
    speak({ text: "Cons" });
  }
  
  const consClick = (text) => {
    console.log("cons click");
    setIsSpeakingCons(true);
    speak({ text: text });
  }

  const cancelSpeech = () => {
    cancel();
    setIsSpeakingPros(false);
    setIsSpeakingCons(false);
  }

  return (
    <div className="home-page">
      <div className="info-section">
        <div className="info-blurb">
          Amazon product review summarizer.<br/>Enter a product listing url from amazon.com, and receive a summary of the pros and cons of the product!
        </div>
      </div>
      <Searchbar urlCallback={queryBackend}/>
      <div>
        {/* {!isLoading && <p>Amazon review stuff:</p>} */}
        {isLoading && <div><p className="loading">Loading...</p><div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>}
      </div>
      {successfulLoad &&
        <div className="emailsender-container" style = {{ width: "20%" }}>
          <form className="emailsender" onSubmit={(e) => {
            handleSubmitEmail(e, document.getElementById("emailTerm").value);
          }}>
          <CustomTextField style = {{ width: "100%" }} label="Enter your email" type="search" id="emailTerm" required InputProps={{
            endAdornment: (
              <InputAdornment position="end" style={{ paddingRight: 10 }}>
                <IconButton edge="end" className="emailSendButton" type="submit">
                  <EmailIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
          InputLabelProps={{
            required: false
          }}
          />
          </form><br></br>
        </div>}
      {successfulLoad && 
      <div className="product-card">
        <div className="titleitems"><div className="prodTitle">{productTitle}</div>
          <img src={productImg} alt="amazon product"></img>
        </div>
        <div className="product-summary-section">
          <div className="pros-cons">
            <div className="pc-item"><button className="procon-title" onFocus={prosFocus} onClick={() => {prosClick(prolist.join(". "))}}>Pros:</button>{isSpeakingPros && <button onClick={cancelSpeech}>Stop</button>}
              <ul>
                {prolist.map((listitem, idx) => {
                  return (
                  <li key={idx}>{listitem.toString()}</li>
                );
                })}
              </ul>
            </div>
            <div className="pc-item"><button className="procon-title" onFocus={consFocus} onClick={() => {consClick(conslist.join(". "))}}>Cons:</button>{isSpeakingCons && <button onClick={cancelSpeech}>Stop</button>}
              <ul>
                {conslist.map((listitem, idx) => {
                  return (
                  <li key={idx}>{listitem.toString()}</li>
                );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>}
    </div>
  )
}