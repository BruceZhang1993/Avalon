import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import * as moment from 'moment';
import { DatePicker } from 'material-ui-pickers/src';

import './style.scss';

interface Props {}

interface State {
  channels: string[];
  selectedChannel: string;
  selectedDate: moment.Moment;
  minDate: string;
  availableDate: string[];
}

class NavBar extends React.Component<Props, State> {
  state = {
    channels: [],
    selectedChannel: '',
    selectedDate: moment(),
    minDate: '1900-1-1',
    availableDate: []
  };

  componentDidMount () {
    fetch('/api/channels')
      .then((res: Response) => res.json())
      .then(json => this.setState({ channels: json.data.list }))
      .then(() => this.setState({ selectedChannel: this.state.channels[0] }))
      .catch(error => null);

    fetch('/api/times')
      .then((res: Response) => res.json())
      .then(json => this.setState({ availableDate: json.data.list }))
      .then(() => this.setState({ minDate: `${this.state.availableDate[0]}-1` }))
      .catch(error => null);
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {    
    this.setState({ selectedChannel: event.target.value });
  }

  handleDateChange = (date: moment.Moment): void => {
    this.setState({ selectedDate: date });    
  }

  handleDateDismiss = (event: React.MouseEvent<HTMLElement>): void => undefined;

  render () {
    return (
      <div className="nav-bar">
        <AppBar position="static">
          <Toolbar>
            <IconButton className="menu-button" color="contrast" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <div className="detail-info">
              <InputLabel
                htmlFor="channel-simple"
                className="input-label"
              >
                Channel:
              </InputLabel>
              <Select
                value={this.state.selectedChannel}              
                input={<Input name="channel" id="channel-simple" />}
                onChange={this.handleChange}
                className="select-bar"
                color="white"
              >
                {
                  this.state.channels.map((channel: string, i: number) => (
                    <MenuItem value={channel} key={i}>
                      <em>{channel}</em>
                    </MenuItem>
                  ))
                }
              </Select>            
              <div className="date-picker">
                <div className="picker-label">Date:</div>
                <DatePicker
                  className="picker"
                  value={this.state.selectedDate}
                  onChange={this.handleDateChange}
                  disableFuture={true}
                  minDate={this.state.minDate}
                />
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default NavBar;