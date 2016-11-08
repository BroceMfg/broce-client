import React from 'react';

const Button = (props) => {
  return (
    <button
      onClick={props.onClickHandler}
      className={props.classTag}>
      {props.text}
    </button>
  )
}

export default Button;
