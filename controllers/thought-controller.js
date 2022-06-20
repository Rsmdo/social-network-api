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

	// create a thought
	addThought({ params, body }, res) {
		Thought.create(body)
			.then(({ _id }) => {
				return User.findOneAndUpdate(
					{ _id: params.userId },
					{ $push: { thoughts: _id } },
					{ new: true }
				)
            })
			.then((dbThoughtData) => res.json(dbThoughtData))
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
    addReaction({params, body}, res){
        Thought.findOneAndUpdate({ _id:params.thoughtId},{$push: {reactions:body}},{new: true}) 
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with this id!' });
                return;
                }
            res.json(dbThoughtData);
          })
          .catch(err => res.json(err));
        
    },

	// remove  reaction
	removeReaction({ params }, res) {//update and pull 
		Thought.findOneAndUpdate(
			{ _id: params.thoughtId },
			{ $pull: { reactions: { _id: params.reactionId } } },
			{ new: true, runValidators: true }
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