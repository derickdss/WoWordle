import React, { useState, useEffect } from 'react'
import './App.css';
import axios from 'axios'

const apiRequest = (searchString, setResponseData) => {
  if (searchString === '?????') {
    setResponseData([])
    return;
  }
  const options = {
    method: 'GET',
    // url: 'https://wordsapiv1.p.rapidapi.com/words/',
    url: `https://api.datamuse.com/words?sp=${searchString}`
  }
  axios.request(options)
    .then((response) => {
      setResponseData(response.data)
    }).catch(function (error) {
      console.error(error);
    })
}

const filterExclusionList = (initialList, data, exclusionList, updateList, poppedAlphabet) => {
  const listWithAddedExclusions = (data.filter((word) => !word.word.includes(exclusionList[exclusionList.length - 1])));
  const listWithAddedAndRemovedExclusions = poppedAlphabet ? [...listWithAddedExclusions, ...(initialList.filter((word) => word.word.includes(poppedAlphabet)))] : listWithAddedExclusions;
  updateList(listWithAddedAndRemovedExclusions);
}

function App() {
  const [searchString, setSearchString] = useState('?????');
  const [responseData, setResponseData] = useState([]);
  const [exclusionList, setExclusionList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [poppedAlphabet, setPoppedAlphabet] = useState()
  const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  useEffect(() => {
    apiRequest(searchString, setResponseData);
  }, [searchString]);

  useEffect(() => {
    if (exclusionList.length && responseData.length) {
      filterExclusionList(responseData, filteredList, exclusionList, setFilteredList, poppedAlphabet);
    } else {
      setFilteredList(responseData);
    }
  }, [responseData, exclusionList])

  const focusOnNext = (e, position) => {
    if (position === 4) {
      return
    }
    const form = e.target.form;
    // const index = [...form].indexOf(e.target);
    form.elements[position + 1].focus();
  }

  const stringUpdater = (position, e) => {
    const replacementCharacter = e.target.value.length !== 0 ? e.target.value : '?'
    if (e.target.value.length > 1) {
      return;
    }
    setSearchString(searchString.substring(0, position) + replacementCharacter + searchString.substring(position + 1, searchString.length));
    focusOnNext(e, position);
  }

  const exclusionListClickHandler = (e) => {
    if (!exclusionList.includes(e.target.value)) {
      setExclusionList(exclusionList => [...exclusionList, e.target.value]);
      setPoppedAlphabet();
    } else {
      console.log('remove exclusion', exclusionList.indexOf(e.target.value))
      const a = exclusionList;
      setPoppedAlphabet(a.splice(exclusionList.indexOf(e.target.value), 1))
      setExclusionList([...a]);
    }
  }

  const clearHandler = () => {
    setSearchString('?????')
    setExclusionList([])
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>World of Wordle</h1>
        <div className="row1">
          <form>
            <input type="text" placeholder='1st' value={searchString[0] !== '?' ? searchString[0] : ""} className="individualCell" onChange={e => stringUpdater(0, e)} maxLength={1} />
            <input type="text" placeholder='2nd' value={searchString[1] !== '?' ? searchString[1] : ""} className="individualCell" onChange={e => stringUpdater(1, e)} maxLength={1} />
            <input type="text" placeholder='3rd' value={searchString[2] !== '?' ? searchString[2] : ""} className="individualCell" onChange={e => stringUpdater(2, e)} maxLength={1} />
            <input type="text" placeholder='4th' value={searchString[3] !== '?' ? searchString[3] : ""} className="individualCell" onChange={e => stringUpdater(3, e)} maxLength={1} />
            <input type="text" placeholder='5th' value={searchString[4] !== '?' ? searchString[4] : ""} className="individualCell" onChange={e => stringUpdater(4, e)} maxLength={1} />
          </form>
        </div>
        <div className="button"><button onClick={clearHandler}>Clear</button></div>
        <div>
          <div style={{ borderBottom: '1px solid white', paddingBottom: '2rem' }}>Enter your confirmed alphabets to get a list of possible results</div>
          <p>
            Select the alphabets to exclude from search:
          </p>
          {

            alphabets.map((alphabet, index) =>
              <span
                style={{ color: searchString === '?????' || searchString.indexOf(alphabet) > -1 ? 'darkgrey' : null, fontSize: exclusionList.includes(alphabet) ? 'xxx-large' : null }} key={index}><input type="checkbox" id={alphabet} name={alphabet} disabled={searchString === '?????' || searchString.indexOf(alphabet) > -1} value={alphabet} checked={exclusionList.includes(alphabet)} onChange={exclusionListClickHandler} />{alphabet}, </span>)}

          <p>Excluded alphabets:</p>
          <p>{exclusionList.map((alphabet, index) => <span key={index}>{alphabet}, </span>)}</p>
        </div>
        {
          filteredList.length ? (
            <div className="resultsContainer">
              <span>Results</span>
              {filteredList.map((result, index) => (
                <p className="individualResult" key={index}>{result.word}</p>
              ))}
            </div>) : null
        }
      </header>
    </div>
  );
}

export default App;
