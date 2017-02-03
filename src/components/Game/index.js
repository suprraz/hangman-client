// src/components/About/index.js
import React, { Component } from 'react';
import 'whatwg-fetch'

import './style.css';

const hangmanServer = 'http://localhost:10010';

export default class Game extends Component {
  constructor(props) {
    super(props);

    this.imageList = [
      require('./images/Hangman-0.svg'),
      require('./images/Hangman-1.svg'),
      require('./images/Hangman-2.svg'),
      require('./images/Hangman-3.svg'),
      require('./images/Hangman-4.svg'),
      require('./images/Hangman-5.svg'),
      require('./images/Hangman-6.svg')
    ];

    this.state = {
      alert: ''
    };
  }

  componentDidMount() {
  }

  newGame() {
    return fetch(hangmanServer + '/game', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // firstParam: 'yourValue',
        // secondParam: 'yourOtherValue',
      })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({game: responseJson.game});
        return this.state;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  guessLetter(letter) {
    if(!letter) {
      this.setState( {alert: 'Please type a letter to guess.'});
      return;
    }
    fetch(hangmanServer + '/game/' + this.state.game.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        letter: letter
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      this.setState({game: responseJson.game});
      console.log(this.state);
      return this.state;
    })
    .catch((error) => {
      console.error(error);
    });
  }

  guessWord(word) {
    if(!word) {
      this.setState( {alert: 'Please type a word to guess.'});
      return;
    }
    fetch(hangmanServer + '/game/' + this.state.game.id, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        word: word
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({game: responseJson.game});
        return this.state;
      })
      .catch((error) => {
        console.error(error);
      });
  }
  clearAlert() {
    this.setState( {alert: ''});
  }

  render() {
    if(!this.state.game) {
      return <button onClick={() => {this.newGame()}}>New Game</button>
    }

    if(this.state.game.mistakes > 6) {
      return <div>
        <h1>You Lost :(</h1>
        <button onClick={() => {this.newGame()}}>New Game</button>
      </div>
    } else if (this.state.game.progress.indexOf('_') === -1) {
      return <div>
        <h1>You Win :)</h1>
        <button onClick={() => {this.newGame()}}>New Game</button>
      </div>
    }

    return (
      <div>
        <h1>
          Hangman
        </h1>

        <img src={this.imageList[this.state.game.mistakes]} alt="hangman"/>
        <h1>{this.state.game.progress}</h1>

        <div className='alert'>{this.state.alert}</div>
        <div>
          <h1>
            <input ref="letter" size="1" onChange={() => {this.clearAlert()}}></input>
          </h1>
          <button onClick={() => this.guessLetter(this.refs.letter.value)}>Guess Letter</button>

        </div>
        <div>
          <h1>
            <input ref="word" size={this.state.game.progress.length} onChange={() => {this.clearAlert()}}></input>
          </h1>
          <button onClick={() => this.guessWord(this.refs.word.value)} >Guess Word</button>
        </div>
      </div>
    );
  }
}