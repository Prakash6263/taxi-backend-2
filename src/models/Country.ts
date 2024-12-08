import { Schema, model, AggregatePaginateModel } from "mongoose";
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const CountrySchema = new Schema(
    {
        name: {
            type: String,
            default: null,
        }, 
        region: {
            type: String,
            default: null,
        },
        id:{
            type:String,default:null
        },
        latitude: {
            type: Number,
            default: null,
        },
        longitude: {
            type: Number,
            default: null,
        },
        emoji: {
            type: String,
            default: null,
        },
        currency: {
            type: String,
            default: null,
        },
        currency_symbol: {
            type: String,
            default: null,
        },
        phonecode: {
            type: Number,
            default: true,
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

CountrySchema.plugin(aggregatePaginate);

const Country = model<any, AggregatePaginateModel<any>>("Country", CountrySchema);

export default Country;
