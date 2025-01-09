const express = require("express");
const Notes = require("../models/Notes");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// I create notes from post api/notes/createnotes
// login is required
router.post(
  "/createnote",
  fetchuser,
  [
    body("title", "Enter the title").isLength({ min: 5 }),
    body("description", "Enter the description").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    try {
      const note = await Notes.create({
        user: userId,
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
      });
      res.json({ note });
    } catch (error) {
      res
        .status(500)
        .json({ message: "error occurred in notes controller create notes" });
    }
  }
);

// logged in user notes from the database
// II get notes from api/notes/fetchnotes
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Notes.find({ user:userId });
    res.status(200).json({ notes });
  } catch (error) {
    res.status(404).json("Access denied");
  }
});

//Updating the existing note
// III notes put  from api/notes/updatenotes
// login is required
// user updating their notes so validation requires
router.put("/updatenotes/:id", fetchuser, async (req, res) => {
  try {
    const{title,description,tag} = req.body;
    // new note creation 
    const newNote = {};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};
    // finding the note to be updated
    let user = req.user.id;
    let note = await Notes.findById(req.params.id);
    if(!note){
        return res.status(404).json("Not Found")
    }
    if(note.user.toString()!== req.user.id){
        return res.status(401).json("Access denied");
    }

    // note exist and user is authorised
    note = await Notes.findByIdAndUpdate(req.params.id,{$set : newNote},{new:true});

    res.status(200).json({note});


  } catch (error) {
    console.log(error.message);
    res.status(404).json("Internal Server error");
  }
});


router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if(!note){
        return res.status(404).json("Not Found")
    }
    // user  owns this note
    if(note.user.toString()!== req.user.id){
        return res.status(401).json("Access denied");
    }

    // note exist and user is authorised
    note = await Notes.findByIdAndDelete(req.params.id);

    res.status(200).json("Success note deleted");


  } catch (error) {
    console.log(error.message);
    res.status(404).json("Internal Server error");
  }
});



module.exports = router;
