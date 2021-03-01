import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Avatar, Dialog, DialogTitle, DialogContent, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  pokemonImage: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  }
});

const MuiDialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <DialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
});

const MuiDialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  }
}))(DialogContent);

const PokemonAvatar = withStyles((theme) => ({
  root: {
    width: theme.spacing(25),
    height: theme.spacing(25),
  }
}))(Avatar);

const PokemonDialog = ({handleClose, open, pokemonInfo}) => {

  return (
    <Dialog onClose={handleClose} open={open}>
      <MuiDialogTitle onClose={handleClose}>
      {pokemonInfo.name}
      </MuiDialogTitle>
      <MuiDialogContent dividers>
        <PokemonAvatar src={pokemonInfo.image} />
        <Typography gutterBottom>
          {`Especie: ${pokemonInfo.species}`}
        </Typography>
        <Typography gutterBottom>
          {`Tipo/s: ${pokemonInfo.types}`}
        </Typography>
        <Typography gutterBottom>
          {`Habilidades: ${pokemonInfo.abilities}`}
        </Typography>
        <Typography gutterBottom>
          Estadísticas:
        </Typography>
        <ul>
          {pokemonInfo.stats?.map(stat => <li>{stat}</li>)}
        </ul>
      </MuiDialogContent>
    </Dialog>
  );
}

export default PokemonDialog;