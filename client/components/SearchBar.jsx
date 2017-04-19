import React from 'react';
import PropTypes from 'prop-types';
import { Paper } from 'material-ui';
import Search from 'material-ui/svg-icons/action/search';
import Clear from 'material-ui/svg-icons/content/clear';
import { grey500 } from 'material-ui/styles/colors';
import { TextField, IconButton } from 'material-ui';

export default class SearchBar extends React.Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  };

  render() {
    return (
      <Paper style={{
        padding: "12px"
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center'
        }}>
          <Search color={grey500} style={{
            marginRight: "5px"
          }}/>
          <TextField hintText="Search"
                     fullWidth={true}
                     onChange={this.props.onChange}
                     value={this.props.value}
          />
          {
            this.props.value !== '' && <IconButton
              onTouchTap={this.props.onClear}
            >
              <Clear/>
            </IconButton>
          }
        </div>
      </Paper>
    );
  }
}