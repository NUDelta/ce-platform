import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Schema } from '../schema.js';

Schema.UserNeedMapping = new SimpleSchema({
    needName:{
        type: String
    },
    avUsers :{
        type: [String]
    },
});
export const UserNeedMapping = new ExperiencesCollection('userneedmapping');
UserNeedMapping.attachSchema(Schema.UserNeedMapping);


Schema.Experience = new SimpleSchema({
    _id: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
        optional: true
    },
    eid: {
        type: String,
        regEx: SimpleSchema.RegEx.Id,
    },
    needs: {
        type: [Schema.UserNeedMapping],
    },

});
export const Experiences = new ExperiencesCollection('experiences');
Experiences.attachSchema(Schema.Experience);
