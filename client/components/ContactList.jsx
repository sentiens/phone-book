import React from 'react';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import { GridList, GridTile } from 'material-ui/GridList';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import Highlighter from 'react-highlight-words';
import spacing from 'material-ui/styles/spacing';

import SearchBar from './SearchBar';

export default class ContactList extends React.Component {

  static propTypes = {
    contacts: PropTypes.array.isRequired,
    searchValue: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onSearchClear: PropTypes.func.isRequired,
    onFavoriteClick: PropTypes.func.isRequired,
    favoritesMap: PropTypes.object.isRequired
  };

  render() {
    const { searchValue } = this.props;
    const contacts = this.props.contacts.filter(c => {

      return c.name.includes(searchValue)
        || c.phone.replace(/\s+/g, '').includes(searchValue)
        || c.email.includes(searchValue)
    });

    const highlight = (text) => (
      <Highlighter
        autoEscape={true}
        searchWords={[this.props.searchValue]}
        highlightStyle={{backgroundColor: 'white'}}
        textToHighlight={text}
      />
    );

    return (
      <div>
        <SearchBar
          onChange={this.props.onSearchChange}
          onClear={this.props.onSearchClear}
          value={this.props.searchValue}
        />
        <GridList
          cellHeight={180}
          style={{marginTop: spacing.desktopGutter}}
        >
          {contacts.map(({id, name, phone, email, avatar}, i) => (
            <GridTile
              key={id}
              title={highlight(name)}
              subtitle={<div>
                <div>{highlight(phone)}</div>
                <div>{highlight(email)}</div>
              </div>}
              actionIcon={
                <div>
                  <IconButton onTouchTap={() => this.props.onFavoriteClick(id)}>
                    <StarBorder color={this.props.favoritesMap[id] ? 'yellow' : 'white'}/>
                  </IconButton>
                  <IconButton style={{verticalAlign: 'none'}} href={`#/contact/${id}`}>
                    <ModeEdit color="white"/>
                  </IconButton>
                </div>
              }
            >
              {<img src={avatar || 'https://api.adorable.io/avatars/285/abott@adorable.png'} alt={name}/>}
            </GridTile>
          ))}
        </GridList>
      </div>
    );
  }
}