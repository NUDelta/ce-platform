import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../../schema.js';

export const Detectors = new Mongo.Collection('detectors');

/**
{
    "_id": "mS8qJtDnrAzB8L57B",
    "description": "clear knowsDTR",
    "rules": [
        "(knowsDTR && ((clear && daytime)));"
    ],
    "variables": [
        "var clear;",
        "var daytime;",
        "var knowsDTR;"
    ]
}
 */
Schema.Detectors = new SimpleSchema({
    description: {
        type: String,
        unique: true
    },
    rules: {
        type: [String]
    },
    variables: {
        type: [String]
    }
});



Detectors.attachSchema(Schema.Detectors);