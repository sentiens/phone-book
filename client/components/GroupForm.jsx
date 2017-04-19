import React from 'react';
import PropTypes from 'prop-types';
import { Paper, TextField, RaisedButton } from 'material-ui';
import spacing from 'material-ui/styles/spacing';
import {
  Redirect,
} from 'react-router-dom';

export default class GroupForm extends React.Component {

  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      name: '',
      submitted: false
    };
  }

  componentDidMount() {
    this.nameInput.focus();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.name === '') return;

    this.props.onSubmit(this.state.name);
    this.setState({
      submitted: true
    });
  };

  render() {
    return (
      <Paper style={{padding: spacing.desktopGutter}}>
        {this.state.submitted && <Redirect to="/"/>}
        <form onSubmit={this.handleSubmit}>
          <TextField
            hintText="Friends..."
            floatingLabelText="Name"
            fullWidth={true}
            value={this.state.name}
            onChange={(e) => {this.setState({name: e.target.value})}}
            ref={(input) => { this.nameInput = input; }}
          />
          <RaisedButton
            label="Add"
            primary={true}
            fullWidth={true}
            disabled={this.state.name === ''}
            onTouchTap={this.handleSubmit}
          />
        </form>
      </Paper>
    );
  }
}