import React, { PropTypes } from 'react';
import '../../../css/components/Loading.css';

const Loading = props => (
  <div className={`Loading ${props.loading ? 'shown' : 'hidden'} `}>
    <div className="inner">
      <div className={'content'}>
        <div className="sk-fading-circle">
          <div className="sk-circle1 sk-circle" />
          <div className="sk-circle2 sk-circle" />
          <div className="sk-circle3 sk-circle" />
          <div className="sk-circle4 sk-circle" />
          <div className="sk-circle5 sk-circle" />
          <div className="sk-circle6 sk-circle" />
          <div className="sk-circle7 sk-circle" />
          <div className="sk-circle8 sk-circle" />
          <div className="sk-circle9 sk-circle" />
          <div className="sk-circle10 sk-circle" />
          <div className="sk-circle11 sk-circle" />
          <div className="sk-circle12 sk-circle" />
        </div>
      </div>
    </div>
  </div>
);

export default Loading;

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
};
