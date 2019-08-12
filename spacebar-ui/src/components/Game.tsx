import React from 'react';
import { H3, ProgressBar } from '@blueprintjs/core';
import { SPACE } from '@blueprintjs/core/lib/esm/common/keys';

import LeaderBoard from 'components/LeaderBoard';

import 'styles/Game.css';


/** Three seconds. */
const DURATION = 3000;
const UPDATE_TIME = 100;
const DIRECTIONS = 'Press the spacebar as much as possible before time runs out ...';

enum Stage {
  Directions,
  Playing,
  GameOver,
}

interface Props { }

interface State {
  flash: boolean;
  stage: Stage;
  clicks: number;
  progress: number | null;
}

/**
 * There a 4 states:
 *   1. Inform the user what the task is.
 *   2. Countdown till game is over.
 *   3. Show score and leaderboard.
 *   4. Ask to play again.
 */
export default class Game extends React.Component<Props, State> {
  timerId: NodeJS.Timeout | null = null;
  start: number | null = null

  constructor(props: Props) {
    super(props);

    this.state = {
      flash: false,
      stage: Stage.Directions,
      clicks: 0,
      progress: null,
    };
  }

  componentDidMount = () => {
    document.addEventListener('keyup', this.onKeyPressed);
  };

  componentWillUnmount = () => {
    document.removeEventListener('keyup', this.onKeyPressed);
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  startTimer = () => {
    this.start = Date.now();
    this.timerId = setInterval(this.updateProgressBar, UPDATE_TIME);
    setTimeout(this.finishGame, DURATION);
  };

  updateProgressBar = () => this.setState({
    progress: (Date.now() - this.start!) / DURATION,
  });

  finishGame = () => {
    if (this.timerId) {
      clearInterval(this.timerId);
    }

    this.setState({
      stage: Stage.GameOver,
    });
  };

  spacePressed = () => {
    const { clicks } = this.state;
    this.setState({ flash: true, clicks: clicks + 1 });
    setTimeout(() => this.setState({ flash: false }), 300);
  };

  onKeyPressed = ({ keyCode }: KeyboardEvent) => {
    console.log('key', keyCode);
    if (keyCode !== SPACE) return;

    const { stage } = this.state;
    switch (stage) {
      case Stage.Directions: return (
        this.setState({ stage: Stage.Playing }, () => {
          this.startTimer();
          this.spacePressed();
        })
      )
      case Stage.Playing: return this.spacePressed();
      case Stage.GameOver: return;
    }
  };

  render = () => {
    const { flash, stage, clicks, progress } = this.state;

    switch (stage) {
      case Stage.Directions: return <H3>{DIRECTIONS}</H3>;
      case Stage.GameOver: return (
        <div style={{ margin: '0 auto', height: '100%', width: '100%', boxAlign: 'center' }}>
          <H3>Game over</H3>
          <LeaderBoard />
        </div>
      )
      case Stage.Playing: return (
        <div
          className={`${flash ? 'flash' : ''}`}
          style={{ width: '100vw', height: '100vh' }}
        >
          <H3>{clicks}</H3>
          <ProgressBar
            className="sb-footer"
            value={progress!}
            stripes={false}
          />
        </div>
      )
    }
  };
}