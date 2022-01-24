import React, { useState, useEffect } from 'react'
import './App.css';
import axios from 'axios'

const apiRequest = (alphabets, setResponseData) => {
  console.log('derd, alphabets', typeof alphabets)
  console.log('derd, alphabets check', alphabets === "?????")
  if (alphabets === '?????') {
    return;
  }
  console.log('sending', `https://api.datamuse.com/words?sp=${alphabets}`)
  const options = {
    method: 'GET',
    // url: 'https://wordsapiv1.p.rapidapi.com/words/',
    url: `https://api.datamuse.com/words?sp=${alphabets}`
  }
  axios.request(options)
    .then((response) => {
      setResponseData(response.data)
    }).catch(function (error) {
      console.error(error);
    })
}

function App() {
  const [alphabets, setAlphabets] = useState('?????');
  const [responseData, setResponseData] = useState([])

  useEffect(() => {
    apiRequest(alphabets, setResponseData);
  }, [alphabets]);

  const stringUpdater = (position, e) => {
    const replacementCharacter = e.target.value.length !== 0 ? e.target.value : '?'
    if (e.target.value.length > 1) {
      return;
    }
    console.log('derd alphabets in function', alphabets);
    console.log('replacing 1 ', alphabets.substring(0, position))
    console.log('replacing 2', e.target.value)
    console.log('replacing 2', alphabets.substring(0, position) + e.target.value)
    console.log('replacing 3', alphabets.substring(position + 1 + alphabets.length))
    console.log('replacing 3', alphabets.substring(0, position) + e.target.value + alphabets.substring(position + 1 + alphabets.length))
    setAlphabets(alphabets.substring(0, position) + replacementCharacter + alphabets.substring(position + 1, alphabets.length));
  }

  console.log('alphabets', alphabets)
  console.log('response data', responseData)
  return (
    <div className="App">
      <header className="App-header">
        <h1>World of Wordle</h1>
        <div className="row1">
          <input type="text" placeholder='1st' value={alphabets[0] !== '?' ? alphabets[0] : ""} className="individualCell" onChange={e => stringUpdater(0, e)} maxLength={1} />
          <input type="text" placeholder='2nd' value={alphabets[1] !== '?' ? alphabets[1] : ""} className="individualCell" onChange={e => stringUpdater(1, e)} maxLength={1} />
          <input type="text" placeholder='3rd' value={alphabets[2] !== '?' ? alphabets[2] : ""} className="individualCell" onChange={e => stringUpdater(2, e)} maxLength={1} />
          <input type="text" placeholder='4th' value={alphabets[3] !== '?' ? alphabets[3] : ""} className="individualCell" onChange={e => stringUpdater(3, e)} maxLength={1} />
          <input type="text" placeholder='5th' value={alphabets[4] !== '?' ? alphabets[4] : ""} className="individualCell" onChange={e => stringUpdater(4, e)} maxLength={1} />
        </div>
        <div className="button"><button onClick={() => setAlphabets('?????')}>Clear</button></div>
        {responseData.length ? <div className="resultsContainer">
          <span>Results</span>
          {responseData.map((result) => (
            <p className="individualResult">{result.word}</p>
          ))}
        </div> : <div>Enter your confirmed alphabets to get a list of possible results</div>}
      </header>
    </div>
  );
}

export default App;
