import { Resolver, Query, Arg, Int, Mutation, ID } from "type-graphql";
import uuid from 'uuid';

import Player from "@spacebar-server/schemas/Player";
import NewPlayer from "@spacebar-server/schemas/NewPlayer";
import { MongoPlayer } from "@spacebar-server/mongo/MongoPlayer";


@Resolver() export default class ProjectResolver {
  @Query(returns => [Player]) async getTopPlayers(
    @Arg("numPlayers", type => Int) numPlayers: number,
  ) {
    const ret = await MongoPlayer.find().sort({ score: -1 }).limit(numPlayers);
    return ret;
  }

  @Mutation(returns => ID) async savePlayer(
    @Arg("player", type => NewPlayer) player: NewPlayer,
  ) {
    const id = uuid.v4();
    await MongoPlayer.insertMany([{ ...player, id }]);
    return id;
  }
}