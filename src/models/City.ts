import * as mongoose from 'mongoose';
import { model, AggregatePaginateModel } from 'mongoose';
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const Schema = mongoose.Schema;

const City = new Schema(
  {
    name: {
        type: String,
        default: null,
    },
    state_id: {
        type: Number,
        default: null,
    },
    state_name: {
        type: String,
        default: null,
    },
    state_code: {
        type: String,
        default: null,
    },
    country_id: {
        type: Number,
        default: null,
    },
    country_code: {
        type: String,
        default: null,
    },
    country_name: {
        type: String,
        default: null,
    },
    latitude: {
        type: String,
        default: null,
    },
    longitude: {
        type: String,
        default: null,
    },

    is_status: {
        type: Boolean,
        default: true,
    },
    
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

mongoose.plugin(aggregatePaginate);

export default model<any, AggregatePaginateModel<any>>("City", City);