class FetchData {
    getResource = async url => {
        const res = await fetch(url);

        if (!res.ok) throw new Error(`error ${res.status}`);

        return res.json();
    }

    getPost = () => this.getResource('db/database.json');
}

class Twitter {
    constructor({ listElement }) {
        const fetchData = new FetchData();
        this.tweets = new Posts();
        this.elements = {
            listElement: document.querySelector(listElement)
        }

        fetchData.getPost().then(data => {
            console.log(data)

            data.forEach(item => this.tweets.addPost(item));
            this.showAllPosts();
        });
    }

    renderPosts = tweets => {
        this.elements.listElement.textContent = '';

        tweets.forEach(tweet => {
            console.log(tweet);
            const { userName, nickname, getDate, text, img, likes = 0, id } = tweet;

            this.elements.listElement.insertAdjacentHTML('beforeend', `
                <li>
                    <article class="tweet">
                        <div class="row">
                            <img class="avatar" src="images/${nickname}.jpg" alt="Аватар пользователя ${nickname}">
                            <div class="tweet__wrapper">
                                <header class="tweet__header">
                                    <h3 class="tweet-author">${userName}
                                        <span class="tweet-author__add tweet-author__nickname">@${nickname}</span>
                                        <time class="tweet-author__add tweet__date">${getDate()}</time>
                                    </h3>
                                    <button class="tweet__delete-button chest-icon" data-id="${id}"></button>
                                </header>
                                <div class="tweet-post">
                                    <p class="tweet-post__text">${text}</p>
                                    ${img ? 
                                        `<figure class="tweet-post__image">
                                            <img src="${img}" alt="${text}">
                                        </figure>` : 
                                    ''}
                                </div>
                            </div>
                        </div>
                        <footer>
                            <button class="tweet__like">
                                ${likes}
                            </button>
                        </footer>
                    </article>
                </li>
            `);
        });
    }

    showUserPost = () => {

    }

    showLikedPosts = () => {

    }

    showAllPosts = () => {
        this.renderPosts(this.tweets.posts);
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
        const { userName, nickname, postDate, text, img, likes = 0, id } = param;

        this.userName = userName;
        this.nickname = nickname;
        this.postDate = postDate ? new Date(postDate) : new Date();
        this.text = text;
        this.img = img;
        this.likes = likes;
        this.id = id || this.generateId();
        this.liked = false;
    }

    changeLikes = () => {
        this.liked = !this.liked;

        this.liked ? this.likes++ : this.likes--;
    }

    generateId = () => {
        return Math.random().toString(32).substring(2, 9) + (+new Date).toString(32);
    }

    getDate = () => {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }

        return this.postDate.toLocaleDateString('ru-RU', options);
    }
}

const twitter = new Twitter({
    listElement: '.tweet-list'
})