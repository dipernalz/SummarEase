import Searchbar from "../../components/searchbar/Searchbar";
import React, { useState } from 'react';
import { useSpeechSynthesis } from "react-speech-kit";
import "./home.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [successfulLoad, setSuccessfulLoad] = useState(false);
  // const [responseData, setResponseData] = useState({});
  const [prolist, setProlist] = useState([]);
  const [conslist, setConlist] = useState([]);
  const { speak, cancel } = useSpeechSynthesis();
  
  const queryBackend = async (searchVal) => {
    console.log("callback function called");
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
      // setResponseData(resultData);
      // var arr = [];
      // for(var i = 0; i < resultData.pros.length; i++) {
      //   arr.push({"id": i, "text": resultData.pros[i]});
      // }
      // console.log(arr);
      if(resultData.status === "success") {
        setProlist(resultData.pros);
        setConlist(resultData.cons);
        setSuccessfulLoad(true);
      } else {
        console.log("Scraping/summary failed");
        console.log(resultData);
      }
    } catch (error) {
      console.error(error);
    }

  }

  const prosFocus = () => {
    console.log("pros focus");
    speak({ text: "Pros" });
  }
  
  const prosClick = (text) => {
    console.log("pros click");
    speak({ text: text });
  }

  const consFocus = () => {
    console.log("cons focus");
    speak({ text: "Cons" });
  }
  
  const consClick = (text) => {
    console.log("cons click");
    speak({ text: text });
  }

  const cancelSpeech = () => {
    cancel();
  }

  return (
    <div className="home-page">
      <Searchbar urlCallback={queryBackend}/>
      <div>
        {!isLoading && <p>Amazon review stuff:</p>}
      {isLoading && <div><p>Loading...</p>
      </div>}
      </div>
      {successfulLoad && <div className="product-summary-section">
        <button onFocus={prosFocus} onClick={(text) => {prosClick(prolist.join(". "))}}>Pros</button>
        <button onClick={cancelSpeech}>Stop</button>
        <ul>
          {prolist.map((listitem, idx) => {
            return (
            <li key={idx}>{listitem.toString()}</li>
          );
          })}
        </ul>
        <button onFocus={consFocus} onClick={(text) => {consClick(conslist.join(". "))}}>Cons</button>
        <button onClick={cancelSpeech}>Stop</button>
        <ul>
          {conslist.map((listitem, idx) => {
            return (
            <li key={idx}>{listitem.toString()}</li>
          );
          })}
        </ul>
      </div>}
    </div>
  )
}