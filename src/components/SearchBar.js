import React from 'react';
import { InputBase } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/SearchRounded';

const useStyles = makeStyles(({ spacing, palette, shape, breakpoints, transitions }) => ({
  search: {
    position: 'relative',
    borderRadius: shape.borderRadius,
    backgroundColor: fade(palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(palette.common.white, 0.25),
    },
    marginRight: spacing(2),
    marginLeft: 0,
    marginTop: spacing(2),
    width: '100%',
    [breakpoints.up('sm')]: {
      marginLeft: spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: spacing(0, 2),
    color: 'white',
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'white',
  },
  inputInput: {
    padding: spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${spacing(4)}px)`,
    transition: transitions.create('width'),
    width: '100%',
    [breakpoints.up('md')]: {
      width: '20ch',
    }
  }
}));

const SearchBar = () => {
  const classes = useStyles();
  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Buscar..."
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
    </div>
  );
};

export default SearchBar;