import { Field, Int, InputType } from 'type-graphql';


@InputType() export default class NewPlayer {
  @Field() name: string;
  @Field(type => Int) score: number;
}