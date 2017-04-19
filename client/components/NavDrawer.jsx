import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Drawer, Divider, Subheader } from 'material-ui';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import GroupAdd from 'material-ui/svg-icons/social/group-add';
import { withRouter } from 'react-router';

const SelectableList = makeSelectable(List);

class NavDrawer extends React.Component {

  static propTypes = {
    navOpen: PropTypes.bool.isRequired,
    docked: PropTypes.bool.isRequired,
    onRequestChange: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    groups: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  handleChangeList = (event, value) => {
    this.context.router.history.push(value);
    this.props.onRequestChange(false);
  };

  render() {
    const { groups, location, navOpen, docked, onRequestChange } = this.props;

    return (
      <Drawer
        open={navOpen}
        onRequestChange={onRequestChange}
        docked={docked}
      >
        <AppBar
          title="Phone Book"
          iconElementLeft={<div></div>}
        />
        <SelectableList
          value={location.pathname}
          onChange={this.handleChangeList}
        >
          <ListItem
            primaryText="Add Contact"
            leftIcon={<PersonAdd></PersonAdd>}
            value="/add-contact"
          />
          <Divider/>

          <Subheader>Groups</Subheader>

          <ListItem
            primaryText="All"
            value="/"
          />

          <ListItem
            primaryText="Favorites"
            value="/favorites"
          />

          {Object.keys(groups).map((key) => {
            const {name} = groups[key];

            return <ListItem
              key={key}
              primaryText={name}
              value={`/group/${key}`}
            />;
          })}

          <ListItem
            primaryText="Add Group"
            leftIcon={<GroupAdd></GroupAdd>}
            value="/add-group"
          />
        </SelectableList>
      </Drawer>
    );
  }
}

export default withRouter(NavDrawer);