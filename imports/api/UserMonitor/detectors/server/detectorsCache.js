import { Mongo } from 'meteor/mongo';

export const DetectorsCache = new Mongo.Collection('detectorsCache', {connection: null});