import React, { PropTypes } from 'react';

import '../../../../css/components/FilterByBar.css';

const FilterByBar = props => (
  <div className="FilterByBar">
    {
      props.admin && props.orderSubGroups.length > 1
        ?
          <div className="filtering-options">
            <div className="filter-by-wrapper">
              <span>Filter By:</span>
            </div>
            <div
              className={
                `item ${props.viewBy === 'all' ? 'active' : ''}`
              }
            >
              <button
                onClick={() => {
                  props.changeOrderView();
                }}
              >
                <span>All</span>
              </button>
            </div>
            {
              props.orderSubGroups
                .map(sType => (
                  <div
                    className={
                      `item ${props.viewBy === sType ? 'active' : ''}`
                    }
                    key={Math.random()}
                  >
                    <button
                      onClick={() => {
                        props.changeOrderView(sType);
                      }}
                    >
                      <span>{sType}</span>
                    </button>
                  </div>
                ))
            }
          </div>
        : null
    }
  </div>
);

export default FilterByBar;

FilterByBar.propTypes = {
  admin: PropTypes.bool.isRequired,
  orderSubGroups: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  viewBy: PropTypes.string.isRequired,
  changeOrderView: PropTypes.func.isRequired
};
