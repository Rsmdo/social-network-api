const { Schema, model, Types } = require("mongoose");
const formatDate = require("../utils/dateFormat");

//schema for reactions 
const reactionSchema = new Schema(
	{
        //object data type and default is set to new objectid 
		reactionId: {
			type: Schema.Types.ObjectId,
			default: () => new Types.ObjectId(),
		},
        //string required max lenght 280 characters 
		reactionBody: {
			type: String,
			required: true,
			maxlength: 280,
		},
        //type string and is required 
		username: {
			type: String,
			required: true,
		},
        //date with date now and getter to format date 
		createdAt: {
			type: Date,
			default: Date.now,
			get: (createdAtVal) => formatDate(createdAtVal),
		},
	},
	{
        //virtual not needed for this schema 
		toJSON: {
			getters: true,
		},
	}
);

const thoughtSchema = new Schema(
	{
        //string required min and max 1-280 
		thoughtText: {
			type: String,
			required: true,
			minlength: 1,
			maxlength: 280,
		},
        //type date date now is default getter method to format timestamp on query 
		createdAt: {
			type: Date,
			default: Date.now,
			get: (createdAtVal) => formatDate(createdAtVal),
		},
        //string and is required 
		username: {
			type: String,
			required: true,
		},
        //uses reactions schema 
		reactions: [reactionSchema],
	},
	{
		toJSON: {
			virtuals: true,
			getters: true,
		},
		id: false,
	}
);
//virtual foir lenght of thoughts reactions array field on query 
thoughtSchema.virtual("reactionCount").get(function () {
	return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;