import React, { Component } from "react";
import { Container, ListGroup, ListGroupItem, Button } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
// import uuid from "uuid/v4";
import { connect } from "react-redux";
import { getItems, deleteItem } from "../actions/itemActions";
import PropTypes from 'prop-types';
import Spinner from "./common/Spinner";
//*NOTE* Only shows buttons if loggin in

class ShoppingList extends Component {

  static propTypes = {
    getItems: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool
  }

  componentDidMount() {
    this.props.getItems();
  }

  onDeleteClick = (id) => {
    this.props.deleteItem(id);
  }
  render() {
    let itemContent;
    const { items, loading } = this.props.item;

    if(loading === true) {
      itemContent = <Spinner />
    } else {
      itemContent = 
      <TransitionGroup className="shopping-list">
      {/* Iterate through the state: */}
      {items.map(({ _id, name }) => (
        <CSSTransition key={_id} timeout={500} classNames="fade">
          <ListGroupItem>
            { this.props.isAuthenticated ? <Button className="remove-btn"
            color="danger"
            size="sm"
            onClick={this.onDeleteClick.bind(this, _id)}> &times; </Button> : null }

            {name}
          </ListGroupItem>
        </CSSTransition>
      ))}
    </TransitionGroup>
    }
    return (
      <Container>
        <ListGroup>
          {itemContent}
        </ListGroup>
      </Container>
    )
  }
}


const mapStateToProps = (state) => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { getItems, deleteItem })(ShoppingList);