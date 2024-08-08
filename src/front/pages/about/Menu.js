import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import LocalLibraryOutlinedIcon from "@material-ui/icons/LocalLibraryOutlined";
import TrendingUpOutlinedIcon from "@material-ui/icons/TrendingUpOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
const menu = [
    {
      icon: <HomeOutlinedIcon/>,
      title: 'Home',
      items: []
    },
    {
      icon: <LocalLibraryOutlinedIcon/>,
      title: 'Education',
      items: [
        {
          title:'Technical Analysis',
          items: [
            {
              title: 'The Dow Theory',
              to: '/thedowtheory'
            },
            {
              title: 'Charts & Chart Patterns',
              to: '/chart'
            },
            {
              title: 'Trend & Trend Lines',
              to: '/trendlines'
            },
            {
              title: 'Support & Resistance',
              to: '/sandr'
            },
          ]
        },
        {
          title:'Fundamental Analysis',
          items: [
            {
              title: 'The Dow Theory',
              to: '/thedowtheory'
            },
            {
              title: 'Charts & Chart Patterns',
              to: '/chart'
            },
            {
              title: 'Trend & Trend Lines',
              to: '/trendlines'
            },
            {
              title: 'Support & Resistance',
              to: '/sandr'
            },
          ]
        },
        {
          title:'Elliot Wave Analysis',
          items: [
            {
              title: 'The Dow Theory',
              to: '/thedowtheory'
            },
            {
              title: 'Charts & Chart Patterns',
              to: '/chart'
            },
            {
              title: 'Trend & Trend Lines',
              to: '/trendlines'
            },
            {
              title: 'Support & Resistance',
              to: '/sandr'
            },
          ]
        },
        ]
    },
    {
      icon: <TrendingUpOutlinedIcon/>,
      title: 'Options'
    },
    {
      icon: <DescriptionOutlinedIcon/>,
      title: 'Blog'
    },
  ]
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export const Menu = ({items}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    items.map(item =>
      !item.children ? (
          <div key={item.title}>
            <ListItem button>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          </div>
        ) : (
          <div
            component="nav"
            key={item.title}
          >
            <ListItem button onClick={handleClick}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText>
                    <Menu items={item} />
                  </ListItemText>
                </ListItem>
              </List>
            </Collapse>
          </div>
        )
    )
  );
}