class FetchData {
    getResource = async url => {
        const res = await fetch(url);

        if (!res.ok) throw new Error(`error ${res.status}`);

        return res.json();
    }

    getPost = () => this.getResource('db/database.json');
}

class Twitter {
    constructor(props) {
        const {
            user, 
            $listElement, 
            modalElements, 
            tweetElements, 
            classDeleteTweet, 
            classLikeTweet,
            $sortElement,
            $userPost,
            $postLike
        } = props;

        const fetchData = new FetchData();

        this._user = user;
        this._tweets = new Posts();
        this.elements = {
            _list: document.querySelector($listElement),
            _sort: document.querySelector($sortElement),
            _userPost: document.querySelector($userPost),
            _postLike: document.querySelector($postLike),
            _modal: modalElements,
            _tweet: tweetElements,
        }
        this._class = {classDeleteTweet, classLikeTweet};
        this._sortDate = true;

        fetchData.getPost().then(data => {
            console.log(data)

            data.forEach(item => this._tweets.addPost(item));
            this.showAllPosts();
        })

        this.elements._modal.forEach(this.handleModal);
        this.elements._tweet.forEach(this.addTweet);
        this.elements._list.addEventListener('click', this.handleTweet);
        this.elements._sort.addEventListener('click', this.handleSort);
        this.elements._userPost.addEventListener('click', this.showUserPost);
        this.elements._postLike.addEventListener('click', this.showLikedPosts);
    }

    renderPosts = tweets => {
        const sortedPosts = tweets.sort(this.changeSort());

        this.elements._list.textContent = '';

        sortedPosts.forEach(tweet => {
            console.log(tweet);
            const { userName, nickname, getDate, text, img, id, liked, likes = 0 } = tweet;

            this.elements._list.insertAdjacentHTML('beforeend', `
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
                            <button 
                                class="tweet__like ${liked ? this._class.classLikeTweet.like : ''}"
                                data-id="${id}"
                            >
                                ${likes}
                            </button>
                        </footer>
                    </article>
                </li>
            `);
        });
    }

    showUserPost = () => {
        const post = this._tweets.posts.filter(post => post.nickname === this._user.nickname);

        this.renderPosts(post);
    }

    showLikedPosts = () => {
        const post = this._tweets.posts.filter(post => post.liked);

        this.renderPosts(post);
    }

    showAllPosts = () => {
        this.renderPosts(this._tweets.posts);
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
            this._tweets.addPost({
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

    handleTweet = ({ target }) => {
        if (target.classList.contains(this._class.classDeleteTweet)) {
            this._tweets.deletePost(target.dataset.id);
            this.showAllPosts();
        }

        if (target.classList.contains(this._class.classLikeTweet.like)) {
            this._tweets.likePost(target.dataset.id);
            this.showAllPosts();
        }
    }

    handleSort = () => {
        this._sortDate = !this._sortDate;
        this.showAllPosts();
    }

    changeSort = () => {
        if (this._sortDate) {
            return (a, b) => {
                const first = new Date(a.postDate);
                const second = new Date(b.postDate);

                return second - first;
            }
        } else {
            return (a, b) => b.likes - a.likes;
        }
    }
}

class Posts {
    constructor(props = {}) {
        const { posts = [] } = props;
        this.posts = posts;
    }

    addPost = tweet => {
        const post = new Post(tweet);

        this.posts.push(post);
    }

    deletePost = id => {
        this.posts = this.posts.filter(post => post.id !== id);
    }

    likePost = id => {
        this.posts.forEach(post => post.id === id && post.changeLike());
    }
}

class Post {
    constructor(props) {
        const { userName, nickname, postDate, text, img, likes = 0, id } = props;

        this.userName = userName;
        this.nickname = nickname;
        this.postDate = postDate ? this.correctDate(postDate) : new Date();
        this.text = text;
        this.img = img;
        this.likes = likes;
        this.id = id || this.generateId();
        this.liked = false;
    }

    changeLike = () => {
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

    correctDate = date => {
        isNaN(Date.parse(date)) && (date = date.replace(/\./g, '/'));

        return new Date(date);
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
        },
        {
            $text: '.tweet-form__text',
            $img: '.tweet-img__btn',
            $submit: '.tweet-form__btn',
        }
    ],
    classDeleteTweet: 'tweet__delete-button',
    classLikeTweet: {
        like: 'tweet__like',
        active: 'tweet__like-active',
    },
    $sortElement: '.header__link_sort',
    $userPost: '.header__link_profile',
    $postLike: '.header__link_likes',
})