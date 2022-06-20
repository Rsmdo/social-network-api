const { Thought, User } = require("../models");
//foe thought model 
const thoughtController = {

	allThoughts(req, res) {
        //to get all thoughts 
		Thought.find({})
        //select to not inclued virtual lines but include data 
			.populate({ 
                path: "reactions", 
                select: "-__v" 
            })
			.select("-__v")
			.then((dbThoughtData) => res.json(dbThoughtData))
			.catch((err) => res.status(400).json(err));
	},

	// to get single thought by id 
	getThoughtById({ params }, res) {
		Thought.findOne({ _id: params.id })
			.populate({ 
                path: "reactions",
                select: "-__v" 
            })
			.select("-__v")
            .then(dbUserData => {
                //if id not found send this message 
                if (!dbUserData) {
                  res.status(404).json({ message: 'no thought found' });
                  return;
                }
                res.json(dbUserData);
            })
			.catch((err) => res.status(400).json(err));
	},

	// create a thought (updated)
	addThought({ params, body }, res) {
        //defingin the format of creatioin so its easier 
		Thought.create({thoughtText: body.thoughtText, username: body.username})
        //previious issue is the id would be undefined resulting in error, so defingin _id by body.userId instead of params.Userid works
        //the thought would send to db but not be associated with a user id 
			.then(({ _id }) => {
				return User.findOneAndUpdate(
					{ _id: body.userId },
					{ $push: { thoughts: _id } },
					{ new: true }
				)
            })
            .then((dbThoughtData) => {
                if (!dbThoughtData) {
                  res.status(404).json({ message: 'No User found with this id!' });
                  return;
                }
                res.json(dbThoughtData);
              })
			.catch((err) => res.json(err));
	},

	// updating a  thought by id
	updateThought({ params, body }, res) {
        //validators for the requirments to work 
		Thought.findOneAndUpdate({ _id: params.id }, body, {new: true,runValidators: true,})
			.then((dbThoughtData) => {
				if (!dbThoughtData) {
					return res
						.status(404)
						.json({ message: "No thought with this id!" });
				}
				res.json(dbThoughtData);
			})
			.catch((err) => res.json(err));
	},

	// create a reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId },{ $push: { reactions: body } },{ new: true, runValidators: true })
          .then((dbThoughtData) => {
            if (!dbThoughtData) {
              res.status(404).json({ message: 'No Thought with this id!' });
              return;
            }
            res.json(dbThoughtData);
          })
          .catch((err) => res.json(err));
      },

	// remove  reaction
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: params.reactionId } } },
          { new: true }//no validators needed to remove reaction
        )
          .then((dbThoughtData) => res.json(dbThoughtData))
          .catch((err) => res.json(err));
      },

    	// deleting a thought by id
	deleteThought({ params }, res) {//fund one and delete 
		Thought.findOneAndDelete({ _id: params.id })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                return res
                    .status(404).json({ message: "No thought with this id!" });
            }
            res.json(dbThoughtData);
        })
			.catch((err) => res.json(err));
	},

};

module.exports = thoughtController;