import {List, ListItem, ListItemIcon, ListItemText, Paper} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import SearchIcon from '@mui/icons-material/Search';
import {NavLink} from 'react-router-dom';
import {routes} from '../../routes/routing';
export function Navigation() {
  return (
    <Paper>
      <List>
        <NavLink
          to={routes.home()}
          style={{textDecoration: 'none', color: 'white'}}
        >
          <ListItem>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </NavLink>
        <NavLink
          to={routes.search()}
          style={{textDecoration: 'none', color: 'white'}}
        >
          <ListItem>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search" />
          </ListItem>
        </NavLink>
      </List>
    </Paper>
  );
}
