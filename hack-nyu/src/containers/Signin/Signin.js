import React, { Component } from 'react';
import SignUp from '../../components/SignUp/SignUp.js';
import NameList from '../../components/NameList/NameList';
import './Signin.css';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 1,
      username: '',
      pin: '',
      communities: [],
      descriptions: [],
      usernames: [],
      ids: [],
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  progressStage = () => {
    this.setState((prevState) => {
      return {
        stage: prevState.stage + 1,
      };
    });
  };

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetch(
          '/api/locations?long=' +
            pos.coords.longitude +
            '&lat=' +
            pos.coords.longitude
        ).then((res) => {
          res.json().then((c) => {
            console.log('comm', c);
            this.setState({
              communities: c,
            });
            this.progressStage();
          });
        });
      });
    }
  };

  getNames = () => {
    console.log('get names');
    fetch('/api/usernameSimilar?name=' + this.state.name).then((res) => {
      res.json().then((names) => {
        console.log(names);
        this.setState({
          usernames: names,
        });
        this.progressStage();
      });
    });
  };

  signin = () => {
    const body = JSON.stringify({
      username: this.state.username,
      pin: this.state.pin,
    });
    console.log('body', body);
    fetch('/api/login', {
      credentials: 'include',
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      res.json().then((data) => {
        console.log('state', this.state);
        console.log(data.status);
        if (data.status !== 'error') {
          this.props.history.push('/vote');
        }
      });
    });
  };

  nextCommunity = () => {
    this.setState({
      cIndex: (this.state.cIndex + 1) % this.state.communities.length,
    });
  };

  render() {
    if (this.state.stage === 1) {
      return (
        <div className='hero is-fullheight has-background-grey-light'>
          <div className='signUpContainer'>
            <SignUp
              name={this.state.name}
              handleChange={this.handleChange}
              progressStage={this.progressStage}
            />
          </div>
        </div>
      );
    }
    if (this.state.stage === 2) {
      // get location
      return (
        <div className='hero is-fullheight has-background-grey-light'>
          <div className='signUpContainer buttonOnly'>
            <button
              className='button is-large is-1 greenHov'
              onClick={() => {
                this.getLocation();
              }}
            >
              Locate me!
            </button>
          </div>
        </div>
      );
    }
    if (this.state.stage === 3) {
      return (
        <div className='hero is-fullheight has-background-grey-light'>
          <div className='signUpContainer'>
            <h1 className='title is-1'>
              {this.state.communities[1].community.name}!
            </h1>
            <h2 className='subtitle is-1'>New York, NY 10012</h2>
            <button
              className='button greenHov'
              onClick={() => {
                this.getNames();
              }}
            >
              {' '}
              Yes{' '}
            </button>
            <button className='button greenHov' onClick={this.nextCommunity}>
              {' '}
              Find another community{' '}
            </button>
          </div>
        </div>
      );
    }
    if (this.state.stage === 4) {
      return (
        <div className='hero is-fullheight has-background-grey-light'>
          <div className='signUpContainer'>
            <NameList
              names={this.state.usernames}
              progressStage={this.progressStage}
              handleChange={this.handleChange}
            />
          </div>
        </div>
      );
    }
    if (this.state.stage === 5) {
      return (
        <div className='hero is-fullheight has-background-grey-light'>
          <div className='signUpContainer'>
            <h1 className='title is-1'>Pin:</h1>
            <input
              className='input is-large'
              type='password'
              value={this.state.pin}
              onChange={this.handleChange}
              name='pin'
            />
            <button className='button is-large greenHov' onClick={this.signin}>
              Sign in
            </button>
          </div>
        </div>
      );
    } else {
      return <div>Redirect to Somewhere</div>;
    }
  }
}
export default Signin;
