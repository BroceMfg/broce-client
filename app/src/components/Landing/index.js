import React from 'react';
import Button from '../Button';

class Landing extends React.Component{
  constructor(props){
    super(props);
    this.newOrderClick = this.newOrderClick.bind(this);
  }
  newOrderClick(){
    console.log("new order clicked");
  }
  render(){
    return(
      <div className="Landing">
        <Button
          classTag="Button Button-create-new-order"
          onClickHandler={this.newOrderClick}
          text="Create New Order"/>
          {this.props.children}
      </div>

    )
  }
}
export default Landing;
