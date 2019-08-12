import React from 'react';
import {
  H3, ProgressBar, Dialog, InputGroup, Classes, Button, Colors, Intent,
} from '@blueprintjs/core';
import { SPACE } from '@blueprintjs/core/lib/esm/common/keys';
import { ApolloConsumer } from '@apollo/react-common';
import { ApolloClient, gql } from 'apollo-boost';

import LeaderBoard from 'components/LeaderBoard';
import Message, { TIMEOUT } from 'utils/Message';

import 'styles/Game.css';


const MUTATION_SAVE = gql`
  mutation SavePlayer($player: NewPlayer!) {
    savePlayer(player: $player)
  }
`
;

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
  score: number;
  isHighScoreOpen: boolean;
  playerName: string;
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
  client: ApolloClient<any> | null = null;
  start: number | null = null;
  timerId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      flash: false,
      stage: Stage.Directions,
      score: 0,
      progress: null,
      isHighScoreOpen: false,
      playerName: '',
    };
  }

  componentDidMount = () => {
    window.addEventListener('keyup', this.onKeyPressed);
    window.addEventListener('touchend', this.onKeyPressed);
  };

  componentWillUnmount = () => {
    window.removeEventListener('keyup', this.onKeyPressed);
    window.removeEventListener('touchend', this.onKeyPressed);
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  };

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
      isHighScoreOpen: true,
    });
  };

  spacePressed = () => {
    const { score } = this.state;
    this.setState({ flash: true, score: score + 1 });
    setTimeout(() => this.setState({ flash: false }), 300);
  };

  onKeyPressed = (event: KeyboardEvent | Event) => {
    if ((event as KeyboardEvent).keyCode !== undefined && (event as KeyboardEvent).keyCode !== SPACE) return;

    const { stage } = this.state;
    switch (stage) {
      case Stage.Directions: return (
        this.setState({ stage: Stage.Playing }, () => {
          this.startTimer();
          this.spacePressed();
        })
      );
      case Stage.Playing: return this.spacePressed();
      case Stage.GameOver: return null;
      default: return null;
    }
  };

  onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      playerName: event.target.value,
    });
  };

  onSubmit = (event: any) => {
    const { playerName, score } = this.state;
    if ((event as React.FormEvent<HTMLFormElement>).preventDefault !== undefined) {
      (event as React.FormEvent<HTMLFormElement>).preventDefault();
    }

    this.setState({
      isHighScoreOpen: false,
    }, () => this.savePlayer(playerName, score));

    return false;
  };

  savePlayer = async (playerName: string, score: number) => {
    try {
      await this.client!.mutate({
        mutation: MUTATION_SAVE,
        variables: {
          player: {
            name: playerName,
            score,
          },
        },
      });

      Message.show({
        timeout: TIMEOUT,
        message: 'Successfully saved score!',
        icon: 'tick',
        intent: Intent.SUCCESS,
      });
    } catch (e) {
      Message.show({
        timeout: TIMEOUT,
        message: `Unable to save score: ${e}`,
        icon: 'warning-sign',
        intent: Intent.DANGER,
      });
    }
  };

  renderFromStage = (stage: Stage) => {
    const {
      flash, score, progress, isHighScoreOpen, playerName,
    } = this.state;

    switch (stage) {
      case Stage.Directions: return <H3>{DIRECTIONS}</H3>;
      case Stage.GameOver: return (
        <div style={{
          margin: '0 auto', height: '100%', width: '100%', boxAlign: 'center',
        }}
        >
          <H3>Game over</H3>
          <LeaderBoard />
          <Dialog
            icon="flame"
            title="High Score"
            isOpen={isHighScoreOpen}
            onClose={() => this.setState({ isHighScoreOpen: false })}
            usePortal
            autoFocus
            canEscapeKeyClose
            canOutsideClickClose={false}
          >
            <form onSubmit={this.onSubmit}>
              <InputGroup
                className={Classes.INPUT}
                onChange={this.onNameChange}
                placeholder="Your name"
                value={playerName}
              />
              <Button color={Colors.BLUE1} fill type="submit" onClick={this.onSubmit}>Submit</Button>
            </form>
          </Dialog>
        </div>
      );
      case Stage.Playing: return (
        <div
          className={`${flash ? 'flash' : ''}`}
          style={{ width: '100vw', height: '100vh' }}
        >
          <H3>{score}</H3>
          <ProgressBar
            className="sb-footer"
            value={progress!}
            stripes={false}
          />
        </div>
      );
      default: return null;
    }
  };

  render = () => {
    const { stage } = this.state;
    return (
      <ApolloConsumer>
        {
          client => {
            this.client = client;
            return this.renderFromStage(stage);
          }
        }
      </ApolloConsumer>
    );
  };
}