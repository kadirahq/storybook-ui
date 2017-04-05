import React from 'react';
import { baseFonts } from '../theme';

const listStyle = {
  ...baseFonts,
};

const listStyleType = {
  listStyleType: 'none',
  paddingLeft: 0,
  margin: 'auto',
};

const kindStyle = {
  fontSize: '15px',
  color: 'inherit',
  textDecoration: 'none',
  padding: '10px 0px',
  cursor: 'pointer',
  borderBottom: '1px solid #EEE',
};

const storyStyle = {
  fontSize: '13px',
  color: 'inherit',
  textDecoration: 'none',
  padding: '8px 0px 8px 10px',
  cursor: 'pointer',
};

class Stories extends React.Component {
  constructor(...args) {
    super(...args);
    this.renderKind = this.renderKind.bind(this);
    this.renderStory = this.renderStory.bind(this);
  }

  fireOnKind(kind) {
    const { onSelectStory } = this.props;
    if (onSelectStory) onSelectStory(kind, null);
  }

  fireOnStory(story) {
    const { onSelectStory, selectedKind } = this.props;
    if (onSelectStory) onSelectStory(selectedKind, story);
  }

  renderStory(story) {
    const { selectedStory } = this.props;
    const style = { display: 'block', ...storyStyle };
    const props = {
      onClick: this.fireOnStory.bind(this, story),
    };

    if (story === selectedStory) {
      style.fontWeight = 'bold';
    }

    return (
      <li key={story}>
        <a href="#" title={`Open ${story}`} style={style} onClick={props.onClick}>
          {story}
        </a>
      </li>
    );
  }

  renderKind({ kind, stories }) {
    const { selectedKind } = this.props;
    const style = { display: 'block', ...kindStyle };
    const onClick = this.fireOnKind.bind(this, kind);

    if (kind === selectedKind) {
      style.fontWeight = 'bold';
      return (
        <li key={kind}>
          <a href="#" title={`Open ${kind}`} style={style} onClick={onClick}>
            {kind}
          </a>
          <div>
            <ul style={listStyleType}>
              {stories.map(this.renderStory)}
            </ul>
          </div>
        </li>
      );
    }

    return (
      <li key={kind}>
        <a href="#" title={`Open ${kind}`} style={style} onClick={onClick}>
          {kind}
        </a>
      </li>
    );
  }

  render() {
    const { stories } = this.props;
    return (
      <div style={listStyle}>
        <ul style={listStyleType}>
          {stories.map(this.renderKind)}
        </ul>
      </div>
    );
  }
}

Stories.propTypes = {
  stories: React.PropTypes.array.isRequired,
  selectedKind: React.PropTypes.string.isRequired,
  selectedStory: React.PropTypes.string.isRequired,
  onSelectStory: React.PropTypes.func,
};

export default Stories;
