import uuid from 'uuid';
import {
  Resolver,
  Query,
  Arg,
  Int,
  Mutation,
  ID,
} from 'type-graphql';

import { Player, NewPlayer } from '@spacebar-server/schemas';
import { MongoPlayer } from '@spacebar-server/mongo';


@Resolver() export default class ProjectResolver {
  @Query(returns => [Player]) async getTopPlayers(
    @Arg('numPlayers', type => Int) numPlayers: number,
  ) {
    const ret = await MongoPlayer.find().sort({ score: -1 }).limit(numPlayers);
    return ret;
  }

  @Mutation(returns => ID) async savePlayer(
    @Arg('player', type => NewPlayer) player: NewPlayer,
  ) {
    const id = uuid.v4();
    await MongoPlayer.insertMany([{ ...player, id }]);
    return id;
  }
}