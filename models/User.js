const { Schema, model } = require("mongoose");

const userSchema = new Schema(

	{
        //string unique required trimmed 
		username: {
			type: String,
			unique: true,
			required: true,
			trim: true,
		},
        //striung required unique must match email address (regex)
		email: {
			type: String,
			required: true,
			unique: true,
			match: /.+\@.+\..+/,
		},
        //ARRAY of _id balues references the thought model 
		thoughts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Thought",
			},
		],
        //references the user model 
		friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
	},
	{
		toJSON: {
			virtuals: true,
		},
		id: false,
	}
);

//to get friend count, friends.lenght making a virtual coloum to display count 
userSchema.virtual("friendCount").get(function () {
	return this.friends.length;
});


const User = model("User", userSchema);

module.exports = User;