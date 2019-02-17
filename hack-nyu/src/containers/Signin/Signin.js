import React, { Component } from 'react';
import VoteButton from '../../components/VoteButton/VoteButton';
import VoteDisplay from '../../components/VoteDisplay/VoteDisplay';
import VoteLoader from '../../components/VoteLoader/VoteLoader';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.login = this.login.bind(this);
  }
  login(){
    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      body: JSON.stringify({"username":"creator", "pin":"1234"}),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {res.json();}).then((data) => {
      console.log(data);
    });
  }
  render() {
    return(
      <div>
      <button onClick={()=>{this.login(); }}/>
      </div>)
  }
}
export default Signin;