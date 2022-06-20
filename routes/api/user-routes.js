const router = require("express").Router();
const {
    creatUser,
	getAllUsers,
	getUserById,
	updateUser,
	deleteUser,
	addFriend,
	removeFriend,
} = require("../../controllers/user-controller");

//route to get all users and create 
// /api/users
router.route("/").get(getAllUsers).post(creatUser);

//route to add update and delete users by id 
// /api/users/:id
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

//route to add and delete a friend 
// /api/users/:userId/friends/:friendId
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;