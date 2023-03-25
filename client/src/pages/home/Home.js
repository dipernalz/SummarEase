import Searchbar from "../../components/searchbar/Searchbar";
import React, { useState } from 'react';
import "./home.css";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState("");

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
      setResponseData(resultData.reviews.critical[0]);
    } catch (error) {
      console.error(error);
      setResponseData(resultData.toString());
    }

  }
  return (
    <div className="home-page">
      <Searchbar urlCallback={queryBackend}/>
      <div>
        {!isLoading && <p>Amazon review stuff:</p>}
      {isLoading && <div><p>Loading...</p>
      </div>}
      </div>
      <div>
      {responseData}
      </div>
    </div>
  )
}