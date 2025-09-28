import postService from "../services/postService.js";

class PostController {
    async create(req, res) {
        try {
            console.log(req.body);
            const post = await postService.createPost(req.body);
            res.redirect('/posts');
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            console.log(posts);
            res.render("posts", { posts }); // Renderiza la vista posts/index.ejs
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async renderForm(req, res){
        console.log("adsfasdfa");
        try{
            console.log("paso por controller");
            res.render("add", {})
        } catch (error){
            console.log("paso por controller");
            res.status(400).json({error: error.message});
        }

    }
    async delete(req, res){
        try{
            const { id } = req.params;
            await postService.deletePost(id);
            res.redirect('/posts');
        }catch (error){
            res.status(500).json({error: error.message})
        }
    }
}

export default new PostController();

