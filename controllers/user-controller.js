
const { User, Thought } = require("../models");

const userController = {
	// get all users
	getAllUsers(req, res) {
		User.find({})
			.populate({ 
                path: "thoughts", 
                select: "-__v" 
            })
			.select("-__v")
            //this will show the newest user first 
            .sort({_id: -1})
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.status(400).json(err));
	},

	// get user by id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
          .populate({
            path: 'thoughts',
            select: '-__v',
          })
          .select('-__v')
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No User with this id!' });
              return;
            }
            res.json(dbUserData);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json(err);
          });
    },

	// create a user
    creatUser({ body }, res) {
        User.create(body)
          .then((dbUserData) => res.json(dbUserData))
          .catch((err) => res.status(400).json(err));
    },

	// update user by id
    //params.id and validators 
	updateUser({ params, body }, res) {
		User.findOneAndUpdate({ _id: params.id }, body, {
			new: true,
			runValidators: true,
		})
			.then((dbUserData) => {
				if (!dbUserData) {
					return res
						.status(404)
						.json({ message: "No user with this id!" });
				}
				res.json(dbUserData);
			})
			.catch((err) => res.json(err));
	},

	// remove a user by id
    //find and delete 
	deleteUser({ params }, res) {
		User.findOneAndDelete({ _id: params.id }).then((dbUserData) => {
			if (!dbUserData) {
				return res.status(404).json({ message: "No user found with this id!" });
			}
            //for all the thoughts under the user deltemany will work
            //target all thoughts under that username that will be deleted
			Thought.deleteMany({ username: dbUserData.username })
				.then(function () {
					console.log("All Data under", dbUserData.username,"has been deleted");
					return res.json(dbUserData);
				})
				.catch((err) => res.json(err));
		});
        
	},

	// aad a new frind 
    //using update and push 
	addFriend({ params }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $push: { friends: params.friendId } },
			{ new: true, runValidators: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					return res
						.status(404)
						.json({ message: "No user found with this id!" });
				}
				res.json(dbUserData);
			})
			.catch((err) => res.json(err));
	},

	// remove a friend 
    //delete and pull 
	removeFriend({ params }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $pull: { friends: params.friendId } }
		)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.json(err));
	},
};

module.exports = userController;