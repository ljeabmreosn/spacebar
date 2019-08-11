import { ObjectType, Field, Int } from 'type-graphql';


@ObjectType() export default class Player {
  @Field() id: string;
  @Field() name: string;
  @Field(type => Int) score: number;
}