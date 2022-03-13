import { Mongo } from 'meteor/mongo';

export const IncidentsCache = new Mongo.Collection('incidentsCache', {connection: null});