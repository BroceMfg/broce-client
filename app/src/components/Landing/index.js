import React from 'react';
import Button from '../Button';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.newOrderClick = this.newOrderClick.bind(this);
  }
  newOrderClick() {
    this.context.router.transitionTo('/b/create_order');
  }
  render() {
    return (
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

Landing.contextTypes = {
  router: React.PropTypes.object
}

export default Landing;
