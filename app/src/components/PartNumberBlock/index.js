import React from 'react';

class PartNumberBlock extends React.Component {
  render() {
    return (
      <div className="PartNumberBlock">
        <span>PartNumberBlock with index = {this.props.index}</span>
      </div>
    )
  }
}

export default PartNumberBlock;