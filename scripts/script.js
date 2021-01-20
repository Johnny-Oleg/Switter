class Twitter {
    constructor({ listElement }) {
        this.tweets = new Posts();
        this.elements = {
            listElement: document.querySelector(listElement)
        }
    }

    renderPosts = () => {

    }

    showUserPost = () => {

    }

    showLikedPosts = () => {

    }

    showAllPosts = () => {

    }

    openModal = () => {

    }
}

class Posts {
    constructor({ posts = [] } = {}) {
        this.posts = posts;
    }

    addPost = tweet => {
        const post = new Post(tweet);

        this.posts.push(post);
    }

    deletePost = id => {

    }

    likePost = id => {

    }
}

class Post {
    constructor(param) {
        this.userName = param.userName;
        this.nickname = param.nickname;
        this.id = param.id;
        this.postDate = param.postDate;
        this.text = param.text;
        this.img = param.img;
        this.likes = param.likes;
        this.liked = false;
    }

    changeLikes = () => {
        this.liked = !this.liked;

        this.liked ? this.likes++ : this.likes--;
    }
}

const twitter = new Twitter({
    listElement: '.tweet-list'
})