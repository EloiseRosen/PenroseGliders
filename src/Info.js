import React, { useState } from 'react';
import gliderImage from './images/glider.png'; 
import oscillatorImage from './images/oscillator.png'; 


function Info() {
  const [infoIsOpen, setInfoIsOpen] = useState(false);

  return (
    <>
      {infoIsOpen && 
      <div id="info-box">
        <button onClick={() => setInfoIsOpen(prev => !prev)} id="exit-info-button">
          <i className="fa-solid fa-times"></i>
        </button>
        
        <p>This is an implementation of the Penrose-tiling-based cellular automaton described in <a href="https://www.semanticscholar.org/paper/Gliders-in-Cellular-Automata-on-Penrose-Tilings-Goucher/621cfcd0dd0a8e205855545e832cf977f11b416f" target="_blank" rel="noreferrer">this paper</a>.</p>
        <h1>Some things you can make</h1>
        <p>To make a <a href="https://en.wikipedia.org/wiki/Spaceship_(cellular_automaton)" target="_blank" rel="noreferrer">glider/spaceship</a>, choose any two tiles that share an edge, click to set one of them to state 1, and the other to state 2. Then press play.</p>
        <p>This is the first glider pattern to exist on an aperiodic tiling!</p>
        <div className="centered-content">
          <img src={gliderImage} className="info-box-image" alt="initial glider state"></img>
        </div>
        <br/>
        <p>To make an <a href="https://en.wikipedia.org/wiki/Oscillator_(cellular_automaton)" target="_blank" rel="noreferrer">oscillator</a>, find an all-skinny-tile star, and click to put a ring of 10 alternating 1s and 2s around it. Then press play.</p>
        <div className="centered-content">
          <img src={oscillatorImage} className="info-box-image" alt="initial oscillator state"></img>
        </div>
        
        <h1>The rules</h1>
        <p>The next state of a tile is determined by the first rule that matches in the table below.</p>
        <p>The neighbors of a tile are those that share at least one vertex with it.  n<span className="subscript">i</span> is the number of neighbors that are in state i.  An asterisk means no constraints.</p>
        <table>
          <thead>
            <tr>
              <th>Current state</th>
              <th colSpan="3">Neighbor conditions</th>
              <th>Next state</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0</td>
              <td>n<span className="subscript">1</span> ≥ 1</td>
              <td>n<span className="subscript">2</span> ≥ 1</td>
              <td>*</td>
              <td>3</td>
            </tr>
            <tr>
              <td>0</td>
              <td>n<span className="subscript">1</span> ≥ 1</td>
              <td>*</td>
              <td>n<span className="subscript">3</span> ≥ 2</td>
              <td>1</td>
            </tr>
            <tr>
              <td>1</td>
              <td>*</td>
              <td>*</td>
              <td>n<span className="subscript">3</span> ≥ 1</td>
              <td>2</td>
            </tr>
            <tr>
              <td>1</td>
              <td>*</td>
              <td>*</td>
              <td>*</td>
              <td>1</td>
            </tr>
            <tr>
              <td>2</td>
              <td>*</td>
              <td>*</td>
              <td>*</td>
              <td>3</td>
            </tr>
            <tr>
              <td>*</td>
              <td>*</td>
              <td>*</td>
              <td>*</td>
              <td>0</td>
            </tr>
          </tbody>
        </table>

        <div className="centered-content">
          <a href="https://github.com/EloiseRosen/PenroseGliders" target="_blank" rel="noreferrer"><i className="fa-brands fa-square-github"></i></a>
        </div>
      </div>
      }

      <button onClick={() => setInfoIsOpen(prev => !prev)} id="info-button">
        <i className="fa-solid fa-question"></i>
      </button>
    </>
  );
}

export default Info;
