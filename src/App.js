import React, { useState, useEffect } from 'react'
import './App.css';
import axios from 'axios'
import { initGA, PageView } from "./Tracking";

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

const filterEntireExclusionList = async (initialList, data, exclusionList, updateList) => {
  // Generic helper function that can be used for the three operations:        
  const operation = (list1, list2, isUnion = false) =>
    list1.filter(a => isUnion === list2.some(b => a.word === b.word));

  // Following functions are to be used:
  const inBoth = (list1, list2) => operation(list1, list2, true),
    inFirstOnly = operation,
    inSecondOnly = (list1, list2) => inFirstOnly(list2, list1);
  const tempList =
    exclusionList.map((alphabet) => {
      return initialList.filter((word) => {
        return !word.word.includes(alphabet);
      })
    });
  const exclusionFilteredList = await tempList.reduce((currentValue, nextValue) => {
    return inBoth(currentValue, nextValue);
  })
  updateList(exclusionFilteredList);
}

function App() {
  const [searchString, setSearchString] = useState('?????');
  const [responseData, setResponseData] = useState([]);
  const [exclusionList, setExclusionList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [completeWord, setCompleteWord] = useState(false);
  const alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  useEffect(() => {
    if (window.location.hostname !== "localhost") {
      initGA("UA-165250761-2");
      PageView();
    }
  }, [])

  useEffect(() => {
    setCompleteWord(false);
    if (!searchString.includes('?')) {
      setResponseData([]);
      setCompleteWord(true);
      return;
    }
    apiRequest(searchString, setResponseData);
  }, [searchString]);

  useEffect(() => {
    if (exclusionList.length && responseData.length) {
      filterEntireExclusionList(responseData, filteredList, exclusionList, setFilteredList);
    } else {
      setFilteredList(responseData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseData, exclusionList])

  const focusOnNext = (e, position) => {
    if (position === 4) {
      return
    }
    const form = e.target.form;
    form.elements[position + 1].focus();
  }

  const focusOnPrevious = (e, position) => {
    const form = e.target.form;
    if (position !== 0) {
      form.elements[position - 1].focus();
    }
  }

  const stringUpdater = (position, e) => {
    const replacementCharacter = e.target.value.length !== 0 ? e.target.value : '?'
    if (e.target.value.length > 1) {
      return;
    }
    if (e.target.value.length) {
      focusOnNext(e, position);
    }
    setSearchString(searchString.substring(0, position) + replacementCharacter + searchString.substring(position + 1, searchString.length));
  }

  const onKeyUp = (position, e) => {
    if (e.keyCode === 8) {
      focusOnPrevious(e, position);
    }
  }

  const exclusionListClickHandler = (e) => {
    if (!exclusionList.includes(e.target.value)) {
      setExclusionList(exclusionList => [...exclusionList, e.target.value]);
    } else {
      const a = exclusionList;
      (a.splice(exclusionList.indexOf(e.target.value), 1))
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
        <div className="InputContainer">
        <h1>World of Wordle</h1>
          <div className="Inputs">
          <form>
              <input type="text" placeholder='1st' value={searchString[0] !== '?' ? searchString[0] : ""} className="IndividualCell" onKeyUp={e => onKeyUp(0, e)} onChange={e => stringUpdater(0, e)} maxLength={1} />
              <input type="text" placeholder='2nd' value={searchString[1] !== '?' ? searchString[1] : ""} className="IndividualCell" onKeyUp={e => onKeyUp(1, e)} onChange={e => stringUpdater(1, e)} maxLength={1} />
              <input type="text" placeholder='3rd' value={searchString[2] !== '?' ? searchString[2] : ""} className="IndividualCell" onKeyUp={e => onKeyUp(2, e)} onChange={e => stringUpdater(2, e)} maxLength={1} />
              <input type="text" placeholder='4th' value={searchString[3] !== '?' ? searchString[3] : ""} className="IndividualCell" onKeyUp={e => onKeyUp(3, e)} onChange={e => stringUpdater(3, e)} maxLength={1} />
              <input type="text" placeholder='5th' value={searchString[4] !== '?' ? searchString[4] : ""} className="IndividualCell" onKeyUp={e => onKeyUp(4, e)} onChange={e => stringUpdater(4, e)} maxLength={1} />
          </form>
        </div>
          <div className="Button"><button onClick={clearHandler}>Clear</button></div>
        </div>
        {completeWord ? <h1>Congrats, you've got your word!</h1> :
          (<div>
          <div style={{ borderBottom: '1px solid white', paddingBottom: '2rem' }}>Enter your confirmed alphabets to get a list of possible results</div>
            <div>
              <p>
                Select the alphabets to exclude from search:
              </p>
            </div>
            <div className="AlphabetsContainer">{

            alphabets.map((alphabet, index) =>
              <span
                style={{ color: searchString === '?????' || searchString.indexOf(alphabet) > -1 ? 'darkgrey' : null, fontSize: exclusionList.includes(alphabet) ? 'xxx-large' : null }} key={index}><input type="checkbox" id={alphabet} name={alphabet} disabled={searchString === '?????' || searchString.indexOf(alphabet) > -1} value={alphabet} checked={exclusionList.includes(alphabet)} onChange={exclusionListClickHandler} />{alphabet}
              </span>
            )}
            </div>

            {exclusionList.length ? <div className="ExcludedListContainer">Excluded alphabets: {exclusionList.map((alphabet, index) => <span key={index}>{index !== 0 ? ',' : ''}{alphabet} </span>)}</div> : null}
          </div>)}
        {
          filteredList.length ? (
            <div className="ResultsContainer">
              <div style={{
                borderBottom: '1px solid white',
                marginBottom: '1rem'
              }}><span >Results</span></div>
              <div className="WordsContainer">{filteredList.map((result, index) => (
                <p className="IndividualResult" key={index}>{result.word}</p>
              ))}</div>
            </div>) : null
        }
      </header>
    </div>
  );
}

export default App;
