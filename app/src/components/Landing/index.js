import React from 'react';
import Button from '../Button';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.newQuoteClick = this.newQuoteClick.bind(this);
  }

  newQuoteClick() {
    this.context.router.transitionTo('/b/create_quote');
  }
  
  render() {
    return (
      <div className="Landing">
        <Button
          classTag="Button Button-create-new-order"
          onClickHandler={this.newQuoteClick}
          text="Create New Quote"/>
        {this.props.children}
      </div>
    )
  }
}

Landing.contextTypes = {
  router: React.PropTypes.object
}

export default Landing;
