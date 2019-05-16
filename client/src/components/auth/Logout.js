import React, { Component } from 'react';
import { NavLink } from "reactstrap";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from "../../actions/authActions";

export class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        <NavLink onClick={this.props.logout} href="#"> LOGOUT </NavLink>
      </div>
    )
  }
}

export default connect(null, { logout })(Logout)
