import postRepository from "../repositories/postRepository.js";
import userRepository from "../repositories/userRepository.js";

class PostService {
    async createPost(postData) {
        // Por ahora creamos posts sin usuario específico
        // En una implementación real, obtendrías el usuario de la sesión
        const postToCreate = {
            ...postData,
            imageUrl: postData.imageUrl || '',
            hashtags: postData.hashtags || ''
        };
        return await postRepository.create(postToCreate);
    }

    async getPosts() {
        return await postRepository.findAll();
    }

    async getPostsByUser(userId) {
        return await postRepository.findByUser(userId);
    }

    async deletePost(postId) {
        return await postRepository.delete(postId);
    }

    async getPostById(postId) {
        return await postRepository.findById(postId);
    }

    async updatePost(postId, postData) {
        return await postRepository.update(postId, postData);
    }
}

export default new PostService();
