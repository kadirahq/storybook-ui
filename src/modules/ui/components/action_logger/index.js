import React, { Component } from 'react';
import Inspector from 'react-inspector';
import { baseFonts } from '../theme';

const preStyle = {
  color: '#666',
  overflowY: 'auto',
  padding: '8px 2px',
  boxSizing: 'border-box',
  border: '1px solid #ECECEC',
  borderRadius: 4,
  backgroundColor: '#FFF',
  margin: 0,
  position: 'absolute',
  top: '30px',
  right: 0,
  bottom: 0,
  left: 0,
};

const wrapStyle = {
  position: 'relative',
  height: '100%',
};

const headStyle = {
  ...baseFonts,
  letterSpacing: '2px',
  fontSize: 12,
  margin: '0 0 0 5px',
};

const btnStyle = {
  marginLeft: 5,
};

const countStyle = {
  display: 'inline-block',
  backgroundColor: '#777777',
  color: '#ffffff',
  padding: '1px 5px',
  borderRadius: '8px',
};

const logDivStyle = {
  margin: 5,
  paddingBottom: 3,
  marginBottom: 4,
  overflow: 'auto',
  borderBottom: '1px solid #fafafa',
};

const inspectorStyle = {
  marginLeft: 5,
  float: 'none',
  display: 'inline-block',
};

const countWrapper = {
  minWidth: 20,
  display: 'inline-block',
  float: 'left',
  height: 19,
  marginRight: 5,
};

const actionNameStyle = {
  float: 'right',
  padding: '0 5px',
  fontWeight: 'bold',
};

class ActionLogger extends Component {

  getActionData() {
    return this.props.actions
      .map((action) => {
        let data = action.data;
        if(action.data.args){
          data = action.data.args.length === 1 ? action.data.args[0] : action.data.args;
        }
        return (
          <div style={logDivStyle} key={action.id}>
          <div style={countWrapper}>
            { action.count > 1 && <span style={ countStyle }>{ action.count }</span> }
          </div>
          <div style={inspectorStyle}>
            <Inspector
              showNonenumerable
              name={action.data.name}
              data={data}
            />
          </div>
          <span style={actionNameStyle}>{action.data.name}</span>
        </div>
      )
  });
  }

  render() {
    const { onClear } = this.props;
    return (
      <div style={wrapStyle}>
        <h3 style={headStyle}>
          ACTION LOGGER
          <button style={btnStyle} onClick={onClear}>CLEAR</button>
        </h3>
        <pre style={preStyle}>{this.getActionData()}</pre>
      </div>
      );
  }
}

ActionLogger.propTypes = {
  onClear: React.PropTypes.func,
  actions: React.PropTypes.array,
};

export default ActionLogger;
