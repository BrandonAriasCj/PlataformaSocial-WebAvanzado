import express from "express";
import postController from "../controllers/postController.js";

const router = express.Router();

router.get("/", postController.getAll);
router.post("/", postController.create);
router.get("/add", (req, res)=>{
    res.render("add");
})
router.delete("/:id", postController.delete);

export default router;

