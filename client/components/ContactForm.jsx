import React from 'react';
import PropTypes from 'prop-types';
import { Paper, TextField, RaisedButton } from 'material-ui';
import spacing from 'material-ui/styles/spacing';
import {
  Redirect,
} from 'react-router-dom';

export default class ContactForm extends React.Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    id: PropTypes.string,
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string,
  };

  constructor({id, name = '', phone = '', email = ''}) {
    super();
    this.state = {
      id,
      name,
      phone,
      email,
      submitted: false,
      errors: {}
    };
  }

  componentDidMount() {
    this.nameInput.focus();
  }

  handleInputChange = (event) => {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};
    for (let key of ['name', 'phone', 'email']) {
      if (this.state[key] === '') {
        errors[key] = 'This field cannot be empty'
      }
    }

    if (Object.keys(errors).length) {
      this.setState({
        errors
      });
      return;
    }

    this.props.onSubmit((({id, name, phone, email}) => ({id, name, phone, email}))(this.state));
    this.setState({
      errors: {},
      submitted: true
    });
  };

  render() {
    return (
      <Paper style={{padding: spacing.desktopGutter}}>
        {this.state.submitted && <Redirect to="/"/>}
        <form onSubmit={this.handleSubmit}>
          <TextField
            hintText="Alex..."
            floatingLabelText="Name"
            fullWidth={true}
            value={this.state.name}
            name="name"
            onChange={this.handleInputChange}
            ref={(input) => { this.nameInput = input; }}
            errorText={this.state.errors.name}
          />
          <TextField
            hintText="+7 900 900 90 90"
            floatingLabelText="Phone"
            fullWidth={true}
            value={this.state.phone}
            name="phone"
            onChange={this.handleInputChange}
            errorText={this.state.errors.phone}
          />
          <TextField
            hintText="example@gmail.com"
            floatingLabelText="Email"
            fullWidth={true}
            value={this.state.email}
            name="email"
            onChange={this.handleInputChange}
            errorText={this.state.errors.email}
          />
          <RaisedButton
            label={this.props.id ? 'Save' : 'Add'}
            primary={true}
            fullWidth={true}
            onTouchTap={this.handleSubmit}
          />
        </form>
      </Paper>
    );
  }
}