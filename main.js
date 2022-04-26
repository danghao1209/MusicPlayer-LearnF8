const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')

const PLAYER_STORAGE_KEY = 'DAHA_PLAYER'

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            id: 158022,
            name: "Driver License x Take Me To Church",
            singer: "DangHao",
            path: "./assets/music/driverlicensextakemetochurch.mp3",
            image: "./assets/img/TakeMeToChurchxDriverLicense.jpg"
        },
	{
            id: 87532,
            name: "Rồi Người Thương Cũng Hoá Người Dưng",
            singer: "ColdPlay",
            path: "./assets/music/FixYou.mp3",
            image: "./assets/img/FixYou.jpg"
        },      
        {
            id: 159373,
            name: "Paradise",
            singer: "ColdPlay",
            path: "./assets/music/Paradise.mp3",
            image: "./assets/img/Paradise.jpg"
        },
        {
            id: 159999,
            name: "Someone Like You",
            singer: "Adele",
            path: "./assets/music/SomeoneLikeYou.mp3",
            image: "./assets/img/SomeoneLikeYou.jpg"
        },
        {
            id: 160129,
            name: "Still Life",
            singer: "BigBang",
            path: "./assets/music/StillLife.mp3",
            image: "./assets/img/StillLife.jpg"
        },
        {
            id: 158976,
            name: "VivaLaVida",
            singer: "ColdPlay",
            path: "./assets/music/VivaLaVida.mp3",
            image: "./assets/img/VivaLaVida.jpg"
        },
        {
            id: 160323,
            name: "Something Just Like This",
            singer: "The Chainsmokers",
            path: "./assets/music/SomethingJustLikeThis.mp3",
            image: "./assets/img/SomethingJustLikeThis.jpg"
        },
        {
            id: 157878,
            name: "The Scientist",
            singer: "ColdPlay",
            path: "./assets/music/TheScientist.mp3",
            image: "./assets/img/TheScientist.jpg"
        },
        {
            id: 159831,
            name: "WaitingForLove",
            singer: "Avicii",
            path: "./assets/music/WaitingForLove.mp3",
            image: "./assets/img/WaitingForLove.jpg"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function (){
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                  <div class="thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth
        // xử lý cd quay /dừng
        const cdThumbAnimate=cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 15000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()
        // xử lý phóng to thu nhủ cd
        document.onscroll =  () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0 
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lý khi kích playlist
        playBtn.onclick = () => {
            if (this.isPlaying) {
                audio.pause()
            } 
            else {
                audio.play()                
            }
        }
        
        //khi song được player
        audio.onplay = () => {
            this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = () => {
            this.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = () => {
            if(audio.duration) {
                const progressPercent =Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // xử lý khi tua
        progress.oninput = (e) => {
            const seekTime = audio.duration /100 * e.target.value
            audio.currentTime = seekTime
        }

        //khi next Song 
        nextBtn.onclick = (e) => {
            if(this.isRandom){
                this.randomSongMode()
            }else{
                this.nextSong()
            }
            audio.play()
            this.render()
            this.scrollToActiveSong()
        }

        //khi prev Song 
        prevBtn.onclick = (e) => {
            if(this.isRandom){
                this.randomSongMode()
            }else{
                this.prevSong()
            }
            audio.play()
            this.render()
            this.scrollToActiveSong()
        }

        //random song 
        randomBtn.onclick = (e) => {
            this.isRandom = !this.isRandom
            this.setConfig('isRandom', this.isRandom)
            randomBtn.classList.toggle('active', this.isRandom)
        }
        
        //xử lí next song
        audio.onended = (e) => {
            if(this.isRepeat){
                audio.play()
            }else{
                nextBtn.click()
            }
        }

        //repeat
        repeatBtn.onclick = (e) => {
            this.isRepeat = !this.isRepeat
            this.setConfig('isRepeat', this.isRepeat)
            repeatBtn.classList.toggle('active', this.isRepeat)
        }
        // lắng nghe click vào playlist
        playList.onclick = (e) => {
            const songNode = e.target.closest('.song:not(.active)')

            if( songNode || e.target.closest('.option')) {
                // xử lý khi click song
                if(songNode) {
                    this.currentIndex = Number(songNode.dataset.index)
                    this.loadCurrentSong()
                    this.render()
                    audio.play()
                } 
                // xử lý click option
                if(e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong:function (){
        setTimeout(() =>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'nearest'
            })
        },300)
    },
    loadCurrentSong: function () {
        
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function () {
        this.isRandom =this.config.isRandom
        this.isRepeat =this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex ++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex=0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex --
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length -1
        }
        this.loadCurrentSong()
    },
    randomSongMode: function () {
        let newIndex;
        do {
            newIndex=Math.floor(Math.random()*this.songs.length)
        }
        while(newIndex===this.currentIndex)
        this.currentIndex=newIndex;
        this.loadCurrentSong()
    },
    start: function () {
        //load config
        this.loadConfig()
        // Định nghĩa các thuộc tính cho obj
        this.defineProperties()
        // lắng nghe / xử lý các sự kiện
        this.handleEvents()
        //tải bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        //render playlist
        this.render()
        // hiển thị trạng thái ban đầu của button repeat va random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()