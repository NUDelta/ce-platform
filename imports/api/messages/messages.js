import { Mongo } from 'meteor/mongo';
 
export const Messages = new Mongo.Collection('messages');
export const Images = new Mongo.Collection('Images');