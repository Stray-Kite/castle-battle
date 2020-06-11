new Vue({
    name: 'game',
    el: '#app',

    template: `<div id="#app" :class="cssClass">
                      <top-bar  :turn="turn" :current-player-index="currentPlayerIndex" :players="players" />   
                      
                      <div class="world">
                         <castle v-for="(player, index) in players" :player="player" :index="index" />
                         <div class="land" />
                         <div class="clouds">
                              <cloud v-for="index in 10" :type="(index - 1) % 5 + 1" />
                         </div>
                      </div>
                     
                      <transition name="hand">
                         <hand v-if="!activeOverlay" :cards="currentHand" @card-play="handlePlayCard" @card-leave-end="handleCardLeaveEnd" />
                      </transition>
                      
                      <transition name="fade">
                         <div class="overlay-background" v-if="activeOverlay" />
                      </transition>
                      
                      <transition name="zoom">
                         <overlay v-if="activeOverlay" :key="activeOverlay" @close="handleOverlayClose">
                            <component :is="'overlay-content-' + activeOverlay" :player="currentPlayer" :opponent="currentOpponent" :players="players" />
                         </overlay>
                      </transition>
               </div>`,
    data: state,
    computed: {
        cssClass () {
            return {
                'can-play': this.canPlay,
            }
        },
    },
    methods: {
        handlePlayCard(card) {
            playCard(card);
        },
        handleCardLeaveEnd() {
            applyCard();
        },
        handleOverlayClose () {
            overlayCloseHandlers[this.activeOverlay]();
        },
    },
    computed: {
        cssClass () {
            return {
                'can-play': this.canPlay,
            }
        },
    },
    mounted() {
        beginGame();
    }
});

var overlayCloseHandlers = {
    'player-turn' () {
        if (state.turn > 1) {
            state.activeOverlay = 'last-play';
        } else {
            newTurn();
        }
    },

    'last-play' () {
        newTurn();
    },

    'game-over' () {
        document.location.reload();
    },
};

// Window resize handling
window.addEventListener('resize', () => {
    state.worldRatio = getWorldRatio()
});

// Tween.js, 85-90行代码为开启tween
requestAnimationFrame(animate);

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}

state.activeOverlay = 'player-turn';

function beginGame() {
    state.players.forEach(drawInitialHand);
}

function playCard(card) {
    if (state.canPlay) {
        state.canPlay = false;
        currentPlayingCard = card;

        // 手牌去除打出去的牌
        const index = state.currentPlayer.hand.indexOf(card);
        state.currentPlayer.hand.splice(index, 1);

        // 讲打出去的手牌放入discardPile中
        addCardToPile(state.discardPile, card.id);
    }
}

function applyCard () {
    const card = currentPlayingCard;

    //施展卡牌特效
    applyCardEffect(card);

    setTimeout(() => {
        // 检查是否有选手死亡
        state.players.forEach(checkPlayerLost);

        // 死亡的话结束游戏，否则进入下一轮
        if (isOnePlayerDead()) {
            endGame();
        } else {
            nextTurn();
        }
    }, 700)
}

function nextTurn () {
    state.turn ++;
    state.currentPlayerIndex = state.currentOpponentId;
    state.activeOverlay = 'player-turn';
}

function skipTurn () {
    state.currentPlayer.skippedTurn = true;
    state.currentPlayer.skipTurn = false;
    nextTurn();
}

function newTurn () {
    state.activeOverlay = null;
    if (state.currentPlayer.skipTurn) {
        skipTurn();
    } else {
        startTurn();
    }
}

function startTurn () {
    state.currentPlayer.skippedTurn = false;
    if (state.turn > 2) {
        // 抽一张新牌
        setTimeout(() => {
            state.currentPlayer.hand.push(drawCard());
            state.canPlay = true;
        }, 800)
    } else {
        state.canPlay = true;
    }
}

function endGame () {
    state.activeOverlay = 'game-over';
}
