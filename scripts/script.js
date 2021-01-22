class FetchData {
    getResource = async url => {
        const res = await fetch(url);

        if (!res.ok) throw new Error(`error ${res.status}`);

        return res.json();
    }

    getPost = () => this.getResource('db/database.json');
}

class Twitter {
    constructor({ user, $listElement, modalElements, tweetElements }) {
        const fetchData = new FetchData();

        this._user = user;
        this.tweets = new Posts();
        this.elements = {
            _listElement: document.querySelector($listElement),
            _modal: modalElements,
            _tweet: tweetElements,
        }

        fetchData.getPost().then(data => {
            console.log(data)

            data.forEach(item => this.tweets.addPost(item));
            this.showAllPosts();
        })

        this.elements._modal.forEach(this.handleModal);
        this.elements._tweet.forEach(this.addTweet);
    }

    renderPosts = tweets => {
        this.elements._listElement.textContent = '';

        tweets.forEach(tweet => {
            console.log(tweet);
            const { userName, nickname, getDate, text, img, likes = 0, id } = tweet;

            this.elements._listElement.insertAdjacentHTML('beforeend', `
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

    handleModal = ({ $button, $modal, $overlay, $close}) => {
        const button = document.querySelector($button);
        const modal = document.querySelector($modal);
        const overlay = document.querySelector($overlay);
        const close = document.querySelector($close);

        const openModal = () => {
            modal.style.display = 'block';
        }

         const closeModal = (elem, { target }) => {
            target === elem && (modal.style.display = 'none');
        }

        button.addEventListener('click', openModal);
        close && close.addEventListener('click', closeModal.bind(null, close));
        overlay && overlay.addEventListener('click', closeModal.bind(null, overlay));

        this.handleModal.closeModal = () => {
            modal.style.display = 'none';
        };
    }

    addTweet = ({ $text, $img, $submit }) => {
        const text = document.querySelector($text);
        const img = document.querySelector($img);
        const submit = document.querySelector($submit);

        let imgUrl = '';
        let tempString = text.innerHTML;

        submit.addEventListener('click', () => {
            this.tweets.addPost({
                userName: this._user.name,
                nickname: this._user.nickname,
                text: text.innerHTML,
                img: imgUrl,
            });

            this.showAllPosts();
            this.handleModal.closeModal();
            text.innerHTML = tempString;
        })

        text.addEventListener('click', () => {
            text.innerHTML === tempString && (text.innerHTML = '');
        })

        img.addEventListener('click', () => imgUrl = prompt('Url to image'));
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
    user: {
        name: 'Johnny Oleg',
        nickname: 'johnny-o',
    },
    $listElement: '.tweet-list',
    modalElements: [
        {
            $button: '.header__link_tweet',
            $modal: '.modal',
            $overlay: '.overlay',
            $close: '.modal-close__btn',
        }
    ],
    tweetElements: [
        {
            $text: '.modal .tweet-form__text',
            $img: '.modal .tweet-img__btn',
            $submit: '.modal .tweet-form__btn',
        }
    ]
})