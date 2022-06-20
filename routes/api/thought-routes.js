const router = require("express").Router();
const {
    addThought,
	allThoughts,
	getThoughtById,
	updateThought,
	deleteThought,
	addReaction,
	removeReaction,
} = require("../../controllers/thought-controller");

//Route to get all thoughts  and add 
// "api/thoughts"  <- how route url looks
router.route("/").get(allThoughts).post(addThought);

//route to get update and delete  a thought by id
// "/api/thoughts/:id"  <- how route url looks
router.route("/:id").get(getThoughtById).put(updateThought).delete(deleteThought);

//route to add reactions  and delete 
// "/api/thoughts/:thoughtId/reactions/:reactionId" <- how route url looks
router.route("/:thoughtId/reactions/:reactionId").post(addReaction).delete(removeReaction);

module.exports = router;