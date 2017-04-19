import React from 'react';
import PropTypes from 'prop-types';
import { AppBar } from 'material-ui';
import withWidth, { SMALL } from 'material-ui/utils/withWidth';
import spacing from 'material-ui/styles/spacing';
import {
  HashRouter as Router,
  Route
} from 'react-router-dom';
import uuid from 'uuid/v4';
import axios from 'axios';

import NavDrawer from './NavDrawer';
import ContactsList from './ContactList';
import ContactForm from './ContactForm';
import GroupForm from './GroupForm';

const style = {
  appBar: {
    position: 'fixed',
    top: 0
  },
  root: {
    paddingTop: spacing.desktopKeylineIncrement
  },
  content: {
    margin: spacing.desktopGutter
  }
};

class App extends React.Component {

  static propTypes = {
    width: PropTypes.number.isRequired
  };

  getInitialState = () => JSON.parse(localStorage.getItem('state') || JSON.stringify({
    contacts: [],
    groups: {},
    favoritesMap: {}
  }));

  persistState = () => {
    localStorage.setItem(
      'state',
      JSON.stringify(
        // pick only particular part of state using object destructuring
        (({ contacts, groups, favoritesMap }) => ({ contacts, groups, favoritesMap }))(this.state)
      )
    );
  };

  constructor(props) {
    super(props);
    this.state = Object.assign(this.getInitialState(), {
      navOpen: false,
      searchValue: ''
    });
  }

  componentDidMount() {
    axios.get('http://localhost:3000/contacts')
      .then(({data}) => this.setState({contacts: data}, this.persistState));
  }

  handleNavToggle = () => this.setState({navOpen: !this.state.navOpen});

  handleRequestChange = (navOpen) => this.setState({navOpen});

  handleSearchChange = (e) => {
    this.setState({
      searchValue: e.target.value
    });
  };

  handleSearchClear = () => {
    this.setState({
      searchValue: ''
    });
  };

  handleFavoriteToggle = (id) => {
    let favoritesMap = Object.assign({}, this.state.favoritesMap);

    if (favoritesMap[id]) {
      delete favoritesMap[id];
    } else {
      favoritesMap[id] = {};
    }

    this.setState({
      favoritesMap
    }, this.persistState);
  };

  getFavorites = () => {
    return this.state.contacts.filter(c => this.state.favoritesMap[c.id]);
  };

  handleGroupSubmit = (name) => {
    let groups = Object.assign({}, this.state.groups);
    groups[uuid()] = { name, contactsMap: {} };
    this.setState({
      groups
    }, this.persistState);
  };

  getContactsByGroup = (groupId) => {
    return this.state.contacts.filter(c => this.state.groups[groupId].contactsMap[c.id]);
  };

  handleAddContact = (contact) => {
    contact.id = uuid();

    this.setState({
      contacts: [...this.state.contacts, contact]
    }, this.persistState);

    axios.post('http://localhost:3000/contacts', contact);
  };

  handleUpdateContact = (contact) => {
    const { contacts } = this.state;
    const idx = contacts.findIndex(c => c.id === contact.id);
    const updatedContact = Object.assign(contacts[idx], contact);

    this.setState({
      contacts: [
        ...contacts.slice(0, idx),
        updatedContact,
        ...contacts.slice(idx + 1)
      ]
    }, this.persistState);

    axios.put('http://localhost:3000/contacts/' + contact.id, updatedContact);
  };

  render() {
    let { navOpen } = this.state;
    const isSmall = this.props.width === SMALL;
    let rootStyle = style.root;
    if ( ! isSmall) {
      navOpen = true;
      rootStyle = Object.assign({}, rootStyle, {
        paddingLeft: "256px"
      });
    }

    const contactsList = <ContactsList
      contacts={this.state.contacts}
      onFavoriteClick={this.handleFavoriteToggle}
      favoritesMap={this.state.favoritesMap}
      searchValue={this.state.searchValue}
      onSearchChange={this.handleSearchChange}
      onSearchClear={this.handleSearchClear}
    />;

    return (
      <Router>
        <div>
          <AppBar
            title="Phone Book"
            onLeftIconButtonTouchTap={this.handleNavToggle}
            style={style.appBar}
          />

          <div style={rootStyle}>
            <div style={style.content}>
              <Route path="/add-contact" render={() => <ContactForm onSubmit={this.handleAddContact}/>}/>
              <Route path="/contact/:id" render={({match}) => {
                const contact = this.state.contacts.find(c => c.id === match.params.id);
                return <ContactForm {...contact} onSubmit={this.handleUpdateContact}/>;
              }}/>
              <Route path="/add-group" render={() => <GroupForm onSubmit={this.handleGroupSubmit}/>}/>
              <Route
                exact
                path="/"
                render={() => contactsList}
              />
              <Route
                path="/favorites"
                render={() => React.cloneElement(contactsList, {contacts: this.getFavorites()})}
              />
              <Route
                path="/group/:groupId"
                component={({match}) => React.cloneElement(
                  contactsList,
                  {contacts: this.getContactsByGroup(match.params.groupId)}
                )}
              />
            </div>
          </div>

          <NavDrawer
            navOpen={navOpen}
            docked={!isSmall}
            onRequestChange={this.handleRequestChange}
            groups={this.state.groups}
          />
        </div>
      </Router>
    );
  }

}

export default withWidth()(App);