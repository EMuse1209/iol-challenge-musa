import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Card, Table, TableHead, TableBody, TableCell, TableRow, TableFooter, TablePagination, LinearProgress } from '@material-ui/core';
import axios from 'axios';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

import SearchBar from './SearchBar';
import PokemonDialog from './PokemonDialog';

const useStyles = makeStyles(({ spacing }) => ({
  card: {
    marginTop: 40,
    borderRadius: spacing(0.5),
    transition: '0.3s',
    width: '100%',
    overflow: 'initial',
    background: '#FFFFFF',
    boxShadow: '0 0 20px 0 rgba(0,0,0,0.12)'
  },
  cardHeader: {
    backgroundColor: '#FF0000',
    borderRadius: spacing(2),
    margin: `-40px auto 0`,
    width: '88%',
    boxShadow: '0 2px 4px -2px rgba(0,0,0,0.24), 0 4px 24px -2px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexFlow: 'row wrap'
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.76)'
  },
  content: {
    paddingTop: 0,
    textAlign: 'left',
    overflowX: 'auto',
    '& table': {
      marginBottom: 0,
    }
  },
  progress: {
    width: '100%',
    marginTop: spacing(2)
  },
  progressColorBar1: {
    backgroundColor: '#CC0000'
  }
}));

const baseURL = 'https://pokeapi.co/api/v2';
const pokemonImageURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

 const MainPage = () => {
  const [tableData, setTableData] = useState([]);
  const [tableFiltered, setTableFiltered] = useState([]);
  const [tablePage, setTablePage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [pokeDialogOpen, setPokeDialogOpen] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState({});
  const [tableFilter, setTableFilter] = useState('');

  const classes = useStyles();

  const handleChangePage = (_, newPage) => {
    setTablePage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setTablePage(0);
  };

  const handleOpenDialog = async (pokeURL) => {
    const pokemonInfo = await axios.get(pokeURL);
    const pokemonId = pokeURL.split('/')[6];
    const pokemonSpecies = await axios.get(`${baseURL}/pokemon-species/${pokemonId}`);
    const pokemonImage = getImageURL(pokeURL);
    preProcessPokemonData(pokemonInfo.data, pokemonSpecies.data, pokemonImage);
    setPokeDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setPokeDialogOpen(false);
  };

  const handleChangeFilter = (event) => {
    console.log(event.target.value.length);
    if(event.target.value.length) {
      const filteredTable = tableData.filter(row => row.name.startsWith(event.target.value));
      setTableFiltered(filteredTable);
    }
    else {
      setTableFiltered(tableData);
    }
    setTableFilter(event.target.value);
  };

  const preProcessPokemonData = (pokeInfo, pokeSpecies, pokeImage) => {
    const pokemonData = {
      name: pokeInfo.name,
      species: pokeSpecies['genera'][5]['genus'],
      types: pokeInfo.types.map((type) => type.type.name).join(', '),
      abilities: pokeInfo.abilities.map((ability) => ability.ability.name).join(', '),
      stats: pokeInfo.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`),
      image: pokeImage
    };
    setSelectedPokemon(pokemonData);
  };

  const getImageURL = (pokemURL) => {
    const pokemonId = pokemURL.split('/')[6];
    return `${pokemonImageURL}/${pokemonId}.png`;
  };

  useEffect( () => {
    const fetchData = async () => {
      const result = await axios.get(`${baseURL}/pokemon`, {
        params: {
          limit: 2000,
          offset: 0
        }
      });
      setTableData(result.data.results);
      setTableFiltered(result.data.results);
    }
    fetchData();
  }, []);

  return (
    <Card className={classes.card}>
      <CardHeader
        classes={{ root: classes.cardHeader, title: classes.cardTitle, subheader: classes.cardSubtitle }}
        title={'Información sobre especies locales'}
        subheader={'Seleccione de la lista o filtre por nombre'}
        action={<SearchBar filter={tableFilter} handleChangeFilter={handleChangeFilter}/>}
      />
      <CardContent className={classes.content}>
  
      {tableData.length ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Nombre</TableCell>
              <TableCell align='center'>Imágen</TableCell>
              <TableCell align='center'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { tableFiltered.slice(tablePage * rowsPerPage, tablePage * rowsPerPage + rowsPerPage).map(row => (
              <TableRow key={row.name}>
                <TableCell align='center' component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align='center'>
                  <img alt={row.name} src={getImageURL(row.url)} />
                </TableCell>
                <TableCell align='center'>
                  <Button variant='contained' onClick={() => handleOpenDialog(row.url)}>
                    Más Info.
                  </Button>
                  <PokemonDialog handleClose={handleCloseDialog} open={pokeDialogOpen} pokemonInfo={selectedPokemon} />
                </TableCell>
              </TableRow> ))
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={3}
                count={tableFiltered.length ? tableFiltered.length : -1}
                rowsPerPage={rowsPerPage}
                page={tablePage}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 100]}
              />
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        <div className={classes.progress}>
          <LinearProgress variant='indeterminate' classes={{bar1Indeterminate: classes.progressColorBar1}}/>
        </div>
      )}
          
      </CardContent>
    </Card>
  );
};

export default MainPage;