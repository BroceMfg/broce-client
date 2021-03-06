import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import autoBind from 'react-autobind';

import OrderPart from './OrderPart';
import ShippingDetailForm from './ShippingDetailForm';
import ShippingAddressForm from './ShippingAddressForm/ShippingAddressForm';
import Input from './Input';
import StockOrderForm from './App/Landing/FormWrapper/StockOrderForm/StockOrderForm';
import QuoteForm from './App/Landing/FormWrapper/QuoteForm/QuoteForm';
import Confirmation from './App/misc/Confirmation';

import req from './middleware/request';

import '../css/components/Order.css';

class Order extends React.Component {
  constructor(props) {
    super(props);
    this.request = req.bind(this);
    autoBind(this);
    this.state = {
      showDetails: this.props.showDetails || false,
      showControls: false,
      showDiscount: false,
      showAddAnotherPart: false,
      showDenyConfirmation: false,
      showArchiveConfirmation: false,
      showFinalizeConfirmation: false,
      showSplitOrder: false,
      splitOrderDetailIds: [],
      showSplitConfirmation: false,
      timestamp: Date.now()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // re-render the ItemForm component with new form data
    // check if timestamp hasn't been updated in the past
    // .01 seconds so that infinite loop doesn't occur
    if (Date.now() - this.state.timestamp > 10) {
      this.setState({
        ...nextState,
        timestamp: Date.now()
      });
      return true;
    }
    return false;
  }

  updateOrderDetail(newOrderDetail, index) {
    const order = this.props.order;
    let newOrderDetails = order.Order_Details;
    newOrderDetails[index] = newOrderDetail;
    this.props.updateOrder({
      ...order,
      Order_Details: newOrderDetails
    }, this.props.statusType);
  }

  renderStatusMessage() {
    const renderBlock = (content, sClass) => (
      <div className={`status-message ${sClass}`}>
        <div>
          {content}
        </div>
      </div>
    );
    let sClass;
    let content = null;

    if (this.props.admin) {
      if (this.props.statusType === 'quote') {
        sClass = 'finalize';
        content = this.finalizeControls();
      } else if (this.props.statusType === 'priced') {
        sClass = 'pending';
        content = (
          <span>Pending Client Approval.</span>
        );
      } else if (this.props.statusType === 'ordered') {
        sClass = 'controls-wrapper shipping-controls';
        content = this.shippingControls();
      }
    } else {
      if (this.props.statusType === 'quote') {
        sClass = 'pending';
        content = (
          <span>Waiting for admin to finalize prices.</span>
        );
      } else if (this.props.statusType === 'priced') {
        sClass = 'controls-wrapper accept-controls';
        content = this.acceptControls();
      } else if (this.props.statusType === 'ordered') {
        sClass = 'pending';
        content = (
          <span>Pending Shipment.</span>
        );
      }
    }

    return content ? renderBlock(content, sClass) : null;
  }

  toggleDetails(show) {
    let showDetails;
    if (show !== undefined && typeof show === 'boolean') {
      showDetails = show;
    } else {
      showDetails = !this.state.showDetails;
    }
    this.setState({
      ...this.state,
      showDetails,
      showAddAnotherPart: false,
      showSplitOrder: false
    });
  }

  toggleControls() {
    this.setState({
      ...this.state,
      showControls: !this.state.showControls
    });
  }

  // Provide either a button or a message (message is optional, button is default)
  // if message is used, buttonTitle should be null and message should be a string
  renderControls(precondition, buttonTitle, toggledBlock, message) {
    let content;
    if (precondition) {
      content = (
        <div>
          {
            message
              ?
                null
              :
                <button onClick={this.toggleControls}>
                  <span>Cancel</span>
                </button>
          }
          {toggledBlock}
        </div>
      );
    } else {
      if (message) {
        content = <span>{message}</span>;
      } else {
        content = <button onClick={this.toggleControls}><span>{buttonTitle}</span></button>;
      }
    }
    return <div className="controls">{content}</div>;
  }

  finalizeControls() {
    const orderDetails = this.props.order.Order_Details;

    const allPriced = orderDetails
      .filter((od) => od.price).length === orderDetails.length;

    // const total = Math.round(orderDetails
    //   .map((od) => (od.price * od.quantity)).reduce((a, b) => a + b) * 100) / 100;

    return this.renderControls(
      allPriced,
      null,
      (
        <div className="finalize-controls-wrapper">
          {
            this.state.showFinalizeConfirmation
              ?
                <Confirmation
                  cancel={() => {
                    this.setState({
                      ...this.state,
                      showFinalizeConfirmation: false
                    });
                  }}
                  message={'Are you sure you want to finalize order ' +
                      `#${this.props.order.id}?`}
                  submit={this.finalizeOrder}
                />
              : null
          }
          <button onClick={() => {
            this.setState({
              ...this.state,
              showFinalizeConfirmation: true
            });
          }}><span>Finalize Order</span></button>
          <button onClick={this.toggleDiscount}>
            {
              this.state.showDiscount
                ? <span>Cancel</span>
                : <span>Add Discount</span>
            }
          </button>
          {
            this.state.showDiscount
              ? this.renderDiscountInput()
              : null
          }
        </div>
      ),
      'All items must be priced before proceeding.'
    );
  }

  shippingControls() {
    return this.renderControls(
      this.state.showControls,
      'Mark Shipped',
      <ShippingDetailForm submit={this.addShippingDetail} cancel={this.toggleControls} />
    );
  }

  acceptControls() {
    return (
      <div className="accept-deny-controls-wrapper">
        {
          this.renderControls(
            this.state.showControls,
            'Accept Order',
            <ShippingAddressForm
              addresses={this.props.addresses}
              loading={this.props.loading}
              submit={this.acceptOrder}
              cancel={this.toggleControls}
              setStateVal={this.props.setStateVal}
              statesList={this.props.statesList}
            />
          )
        }
        <div className="controls">
          <button
            onClick={() => {
              this.setState({
                ...this.state,
                showDenyConfirmation: true
              });
            }}
          >
            <span>Deny Order</span>
          </button>
        </div>
        {
          this.state.showDenyConfirmation
            ?
              <Confirmation
                cancel={() => {
                  this.setState({
                    ...this.state,
                    showDenyConfirmation: false
                  });
                }}
                message={'Are you sure you want to deny order ' +
                    `#${this.props.order.id}?`}
                submit={this.denyOrder}
              />
            : null
        }
      </div>
    );
  }

  // admin function to promote order to the "priced" OrderStatus
  // only available after pricing each item in an order
  finalizeOrder() {
    this.request(
      'PUT',
      `${this.props.apiUrl}/orders/${this.props.order.id}/status?type=priced`,
      undefined,
      (response) => {
        if (JSON.parse(response).success) {
          // success
          this.props.promoteOrder(this.props.order, this.props.statusType);
          this.props.toggleMessage('Prices Submitted Successfully.', 'success');
          setTimeout(() => {
            window.location = '/';
          }, 1000);
        } else {
          // handle error
          console.log('internal server error');
        }
      },
      (errorResponse) => {
        this.props.toggleMessage('Error: Please try again.', 'error');
      }
    );
  }

  toggleDiscount() {
    this.setState({
      ...this.state,
      showDiscount: !this.state.showDiscount
    });
  }

  renderDiscountInput() {
    const submit = (e) => {
      e.preventDefault();
      const inputs = e.target.querySelectorAll('input[name]');
      const data = {};
      Object.keys(inputs).forEach((key) => {
        data[inputs[key].name] = inputs[key].value;
      });

      const handleError = () => {
        this.props.toggleMessage('Error: Please try again.', 'error');
      };

      const discount = data.discount !== '0' ? data.discount : null;
      this.request(
        'POST',
        `${this.props.apiUrl}/orders/${this.props.order.id}/discount`,
        data,
        (response) => {
          if (JSON.parse(response).success) {
            // success
            const updatedOrder = Object.assign(
              this.props.order,
              {
                Order_Details: this.props.order.Order_Details
                  .map(od => Object.assign(
                    od,
                    { discount }
                  ))
              }
            );

            this.props.updateOrder(
              this.props.order,
              null,
              updatedOrder,
              this.props.order.status || 'none'
            );

            this.setState({
              ...this.state,
              timestamp: Date.now(),
              showDiscount: false
            });
            const msgPt1 = discount !== null
              ? `${discount}% Discount Added to `
              : `Discount Removed from `;
            this.props.toggleMessage(
              msgPt1 +
              `Order #${this.props.order.id}.`,
             'success',
             2000
            );
          } else {
            handleError();
          }
        },
        handleError
      );

    }
    return (
      <div className="discount-form">
        <form
          onSubmit={submit}
          title="Add a discount percentage to the order or 0 to remove the discount"
        >
          <Input
            type="number"
            min={0}
            max={99}
            step={1}
            name="discount"
            placeholder="Discount"
            parentOnChange={() => {}}
            submit={submit}
          />
          <span className="percent-symbol">%</span>
          <button type="submit">Submit</button>
        </form>
      </div>
    )
  }

  // client order for accepting a "priced" order
  // this will promote the order's OrderStatus to "ordered"
  acceptOrder(form) {
    const orderDetailIds = this.props.order.Order_Details
      .map((orderDetail) => orderDetail.id);

    const statusType = this.props.getNextStatusType(this.props.statusType);

    this.request(
      'POSt',
      `${this.props.apiUrl}/orders/details/${orderDetailIds.join(',')}` +
        `/shippingaddress?statusType=${statusType}`,
      form,
      (response) => {
        if (JSON.parse(response).success) {
          // success
          this.props.promoteOrder(this.props.order, this.props.statusType);
          this.props.toggleMessage('Thank You', 'success');
          setTimeout(() => {
            window.location = '/';
          }, 1000);
        } else {
          // handle error
          console.log('internal server error');
        }
      },
      (errorResponse) => {
        // console.log(errorResponse)
        this.props.toggleMessage('Error: Please try again.', 'error');
      }
    );
  }

  denyOrder() {
    this.request(
      'PUT',
      `${this.props.apiUrl}/orders/${this.props.order.id}/status?type=abandoned`,
      undefined,
      (response) => {
        const resp = JSON.parse(response);
        if (resp.success) {
          this.props.promoteOrder(
            this.props.order,
            this.props.statusType,
            'abandoned'
          );
          this.props.toggleMessage('Order has been abandoned.', 'success');

          setTimeout(() => {
            window.location = '/';
          }, 1000);
        } else {
          // handle error
          console.log('internal server error');
        }
      },
      (errorResponse) => {
        this.props.toggleMessage('Error: Please try again.', 'error');
      }
    );
  }

  archiveOrder() {
    this.request(
      'PUT',
      `${this.props.apiUrl}/orders/${this.props.order.id}/status?type=archived`,
      undefined,
      (response) => {
        const resp = JSON.parse(response);
        if (resp.success) {
          this.props.promoteOrder(
            this.props.order,
            this.props.statusType,
            'archived'
          );
          this.props.toggleMessage('Order has been archived.', 'success');

          setTimeout(() => {
            window.location = '/';
          }, 1000);
        } else {
          // handle error
          console.log('internal server error');
        }
      },
      (errorResponse) => {
        this.props.toggleMessage('Error: Please try again.', 'error');
      }
    );
  }

  submitSplit() {
    const orderDetailIds = this.state.splitOrderDetailIds;
    this.request(
      'POST',
      `${this.props.apiUrl}/orders/${this.props.order.id}` +
        `/details/${orderDetailIds.join(',')}/split`,
      undefined,
      (response) => {
        const resp = JSON.parse(response);
        if (resp.success) {
          // success
          // this.props.promoteOrder(this.props.order, this.props.statusType);
          this.props.toggleMessage('Split order successfully.', 'success');
          setTimeout(() => {
            window.location = '/';
          }, 1000);
          console.log('resp');
          console.log(resp);
        } else {
          // handle error
          console.log('internal server error');
        }
      },
      (errorResponse) => {
        this.props.toggleMessage('Error: Please try again.', 'error');
      }
    );
  }

  addShippingDetail(form) {
    const orderDetailIds = this.props.order.Order_Details
      .map((orderDetail) => orderDetail.id);

    const statusType = this.props.getNextStatusType(this.props.statusType);

    this.request(
      'PUT',
      `${this.props.apiUrl}/orders/details/${orderDetailIds.join(',')}` +
        `?statusType=${statusType}`,
      form,
      (response) => {
        if (JSON.parse(response).success) {
          // success
          this.props.promoteOrder(this.props.order, this.props.statusType);
          this.props.toggleMessage('Added Shipping Details.', 'success');
          setTimeout(() => {
            window.location = '/';
          }, 1000);
        } else {
          // handle error
          console.log('internal server error');
        }
      },
      (errorResponse) => {
        this.props.toggleMessage('Error: Please try again.', 'error');
      }
    );
  }

  priceLessDiscount(price, disount) {
    return (price * ((100 - disount) / 100)).toFixed(2);
  }

  renderAddAnoterPartForm() {
    const submit = (e) => {
      e.preventDefault();
      const data = {};
      const inputs = e.target.querySelectorAll('input[name]');
      Object.keys(inputs).forEach((key) => {
        data[inputs[key].name.replace(/_0/, '')] = inputs[key].value;
      });

      const handleErr = () => {
        this.props.toggleMessage('Error: Please try again.', 'error');
      };
      // just testing post and get out
      this.request(
        'POST',
        `${this.props.apiUrl}/orders/${this.props.order.id}/part`,
        data,
        (response) => {
          if (response) {
            const resp = JSON.parse(response);
            if (resp.success) {
              this.props.toggleMessage(
                `New Part Added to Order #${this.props.order.id}. Thank you!`,
                'success'
              );
              setTimeout(() => {
                window.location.reload(false);
              }, 750);
            } else {
              handleErr();
            }
          }
        },
        handleErr
      );

      this.setState({
        ...this.state,
        showAddAnotherPart: false
      });
    };
    return (
      <div className="add-anoter-part-form">
        <div className="quote-stock-form-wrapper">
          <div className="h3-wrapper">
            <h3>Add Another Part to this Order</h3>
          </div>
          {
            this.props.showStockOrderForm
              ?
                <StockOrderForm
                  apiUrl={this.props.apiUrl}
                  toggleMessage={this.props.toggleMessage}
                  noAddButtons={true}
                  submit={submit}
                />
              :
                <QuoteForm
                  apiUrl={this.props.apiUrl}
                  toggleMessage={this.props.toggleMessage}
                  noAddButtons={true}
                  submit={submit}
                />
          }
          <div className="show-other-button-wrapper">
            <button onClick={this.props.showOtherForm}>
              {
                this.props.showStockOrderForm
                  ? <span>Regular Quote Part Instead</span>
                  : <span>Stock Order Part Instead</span>
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const order = this.props.order;
    const totalPrice = order.Order_Details
      .map(od => (od.price || 0) * od.quantity)
      .reduce((a, b) => a + b);
    const discount = order.Order_Details[0].discount;
    return (
      <div className="Order" key={this.state.timestamp}>
        {
          this.renderStatusMessage()
        }
        <div className="content">
          <div className="oStatus">
            <h3><span className="oId">#{order.id}</span> | {order.status}</h3>
          </div>
          <div>
            <h4>
              Order created on: {new Date(order.createdAt).toLocaleDateString('en-US')}
            </h4>
          </div>
          {
            (this.props.admin
              && new Date(order.createdAt).getTime() -
              new Date().getTime() > (2 * 24 * 60 * 60 * 1000))
              // older than 2 days
              || (!this.props.admin && order.status === 'shipped')
              ?
                <div className="archive-button-wrapper">
                  <button
                    onClick={() => {
                      this.setState({
                        ...this.state,
                        showArchiveConfirmation: true
                      });
                    }}
                  >
                    <span>Archive</span>
                  </button>
                  {
                    this.state.showArchiveConfirmation
                      ?
                        <Confirmation
                          cancel={() => {
                            this.setState({
                              ...this.state,
                              showArchiveConfirmation: false
                            });
                          }}
                          message={'Are you sure you want to archive order ' +
                              `#${this.props.order.id}?`}
                          submit={this.archiveOrder}
                        />
                      : null
                  }
                </div>
              : null
          }
          {
            !this.props.showDetails
              ?
                <button className="reveal-details" onClick={this.toggleDetails}>
                  {
                    this.state.showDetails
                      ? <span>Hide Details</span>
                      : <span>Show Details</span>
                  }
                </button>
              : null
          }
          <ReactCSSTransitionGroup
            className={
              `OrderPart-wrapper ${this.state.showDetails ? 'show' : 'hide'}`
            }
            component="div"
            transitionName="OrderPart-wrapper-transition"
            transitionEnterTimeout={350}
            transitionLeaveTimeout={350}
          >
            {
              this.state.showDetails
                ?
                  <div className="OrderParts-wrapper">
                    <div className="OrderParts-titles">
                      <div
                        className="shipped"
                        title="has shipped"
                      >
                        ship
                      </div>
                      <div
                        className="machine_serial_num"
                        title="machine serial number"
                      >
                        mach serial #
                      </div>
                      <div
                        className="part_num"
                        title="part number"
                      >
                        part #
                      </div>
                      <div
                        className="quantity"
                        title="quantity"
                      >
                        quantity
                      </div>
                      <div
                        className="price-unit"
                        title="price per unit"
                      >
                        PPU
                      </div>
                      <div
                        className="price-total"
                        title="total price"
                      >
                        total
                      </div>
                    </div>
                    {
                      order.Order_Details.map((orderDetail, i) =>
                        <OrderPart
                          key={orderDetail.id}
                          index={i}
                          admin={this.props.admin}
                          apiUrl={this.props.apiUrl}
                          showSplitOrder={this.state.showSplitOrder}
                          onSplitOrdersCheck={(e) => {
                            const val = e.target.value;
                            let newSplitOrders = this.state.splitOrderDetailIds;
                            if (this.state.splitOrderDetailIds.includes(val)) {
                              newSplitOrders = newSplitOrders.filter(s =>
                                s !== val);
                            } else {
                              newSplitOrders.push(val);
                            }
                            this.setState({
                              ...this.state,
                              splitOrderDetailIds: newSplitOrders
                            });
                          }}
                          statusType={this.props.statusType}
                          orderDetail={orderDetail}
                          updateOrderDetail={this.updateOrderDetail}
                          toggleMessage={this.props.toggleMessage}
                        />
                      )
                    }
                    {
                      discount
                        ?
                          <div>
                            <div className="OrderParts-final">
                              <div className="spacer" id="spacer1"></div>
                              <div className="spacer" id="spacer2"></div>
                              <div className="spacer" id="spacer3"></div>
                              <div className="spacer" id="spacer4"></div>
                              <div className="spacer" id="spacer5">subtotal:</div>
                              <div className="price">
                                {totalPrice !== 0 ? `$${totalPrice.toFixed(2)}` : '--'}
                              </div>
                            </div>
                            <div className="OrderParts-discount">
                              <div className="spacer" id="spacer1"></div>
                              <div className="spacer" id="spacer2"></div>
                              <div className="spacer" id="spacer3"></div>
                              <div className="spacer" id="spacer4"></div>
                              <div className="spacer" id="spacer5">
                                <span>disount:</span>
                              </div>
                              <div className="discount">
                                {discount}% off
                              </div>
                            </div>
                          </div>
                        : null
                    }
                    {
                      totalPrice !== 0
                        ?
                          <div className="OrderParts-total">
                            <div className="spacer" id="spacer1"></div>
                            <div className="spacer" id="spacer2"></div>
                            <div className="spacer" id="spacer3"></div>
                            <div className="spacer" id="spacer4"></div>
                            <div className="spacer" id="spacer5">final:</div>
                            <div className="final">
                              {`$${this.priceLessDiscount(totalPrice.toFixed(2), discount)}`}
                            </div>
                          </div>
                        : null
                    }
                    {
                      order.status === 'quote' && this.props.admin
                        ?
                          <div className="add-another-part-button-wrapper">
                            <button
                              className="add-another-part-button"
                              onClick={() => {
                                this.setState({
                                  ...this.state,
                                  showAddAnotherPart: !this.state.showAddAnotherPart
                                });
                              }}
                            >
                              {
                                this.state.showAddAnotherPart
                                  ?
                                    <span>
                                      Cancel
                                    </span>
                                  :
                                    <span>
                                      Add Another Part
                                    </span>
                              }
                            </button>
                          </div>
                        : null
                    }
                    {
                      this.state.showAddAnotherPart
                        ? this.renderAddAnoterPartForm()
                        : null
                    }
                    {
                      (() => {
                        if (order.Order_Details.length > 1
                          && order.status === 'quote') {
                          if (this.state.showSplitOrder) {
                            return (
                              <div className="split-order-button-wrapper">
                                {
                                  this.state.showSplitConfirmation
                                    ?
                                      <Confirmation
                                        cancel={() => {
                                          this.setState({
                                            ...this.state,
                                            showSplitConfirmation: false
                                          });
                                        }}
                                        message={'Are you sure you want to ' +
                                          `split from #${
                                            this.props.order.id
                                          } into a new order?`
                                        }
                                        submit={this.submitSplit}
                                      />
                                    : null
                                }
                                <div className="split-order-camc-sub-wrapper">
                                  <button
                                    className="cancel"
                                    onClick={() => {
                                      this.setState({
                                        ...this.state,
                                        showSplitOrder: false
                                      });
                                    }}
                                  >Cancel</button>
                                  <div className="split-instructions">
                                    {
                                      (this.state.splitOrderDetailIds.length
                                        !== order.Order_Details.length)
                                        ?
                                          <span>
                                            Select the parts to be split
                                            into a new order then click "split"'
                                          </span>
                                        :
                                          <span className="warning">
                                            You cannot split all parts.
                                            Please unckeck at least one part.
                                          </span>
                                    }
                                  </div>
                                  {
                                    this.state.splitOrderDetailIds.length > 0
                                      && (this.state.splitOrderDetailIds.length
                                        !== order.Order_Details.length)
                                      ?
                                        <button
                                          className="split"
                                          onClick={() => {
                                            this.setState({
                                              ...this.state,
                                              showSplitConfirmation: true
                                            });
                                          }}
                                          title="Split into a new order"
                                        >Split</button>
                                      : null
                                  }
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div className="split-order-button-wrapper">
                              <button
                                className="split-order-button"
                                onClick={() => {
                                  this.setState({
                                    ...this.state,
                                    showSplitOrder: true
                                  });
                                }}
                              >
                                <span>Split Order</span>
                              </button>
                            </div>
                          );
                        }
                        return null;
                      })()
                    }
                  </div>
                : null
            }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    )
  }
}

export default Order;
