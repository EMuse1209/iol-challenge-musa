import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Card, Table, TableHead, TableBody, TableCell, TableRow, TableFooter, TablePagination, LinearProgress} from '@material-ui/core';
import axios from 'axios';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

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
      boxShadow: '0 2px 4px -2px rgba(0,0,0,0.24), 0 4px 24px -2px rgba(0, 0, 0, 0.2)'
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
  },
  progressColorBar2: {
    backgroundColor: '#FF0000'
  }
}));

const baseURL = 'https://pokeapi.co/api/v2';
const pokemonImageURL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

 const MainPage = () => {
  const [tableData, setTableData] = useState({});
  const [tablePage, setTablePage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const classes = useStyles();

  const handleChangePage = (event, newPage) => {
    setTablePage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setTablePage(0);
  };

  const getImageURL = (pokemonURL) => {
    const pokemonId = pokemonURL.split('/')[6];
    console.log(pokemonId)
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
    }
    fetchData();
  }, []);

  console.log(tableData);

  return (
    <Card className={classes.card}>
      <CardHeader
        classes={{ root: classes.cardHeader, title: classes.cardTitle, subheader: classes.cardSubtitle }}
        title={'Información sobre especies locales'}
        subheader={'Seleccione de la lista o filtre por nombre'}
      />
      <CardContent className={classes.content}>
  
      {tableData.length ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Imágen</TableCell>
              <TableCell align="right">Más Información</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { tableData.slice(tablePage * rowsPerPage, tablePage * rowsPerPage + rowsPerPage).map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">
                  <img alt={row.name} src={getImageURL(row.url)} />
                </TableCell>
                <TableCell align="right">{row.url}</TableCell>
              </TableRow> ))
            }
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={3}
                count={tableData.length ? tableData.length : -1}
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
          <LinearProgress variant='indeterminate' classes={{bar1Indeterminate: classes.progressColorBar1, bar2Indeterminate: classes.progressColorBar2}}/>
        </div>
      )}
          
      </CardContent>
    </Card>
  );
};

export default MainPage;