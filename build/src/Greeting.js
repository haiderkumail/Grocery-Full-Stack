import React from 'react';
import './Greeting.css';

function Greeting(props) {
  return (
    <div className="greeting-container">
      <h1 className="greeting">
        Hello, <span className="name">{props.name}</span>! Welcome to Super Mart!
      </h1>
    </div>
  );
}

export default Greeting;
