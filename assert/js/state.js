// Some usefull variables
var maxHealth = 10;
var maxFood = 10;
var handSize = 5;
var cardUid = 0;
var currentPlayingCard = null;

state = {
    // 这个决定了此时的遮盖层是什么
    activeOverlay: null,
    // worldRatio: getWorldRatio(),
    worldRatio: getWorldRatio(),
    // 回合数
    turn: 1,
    // 两个玩家
    players: [
        {
            name: 'Anne of Cleves',
            food: 10,
            health: 10,
            // 跳过回合
            skipTurn: false,
            skippedTurn: false,
            // 手牌
            hand: [],
            // 上一个玩家出的牌的id，因为轮到本玩家是要显示上一回合对手出的牌
            lastPlayedCardId: null,
            // 死亡与否
            dead: false,
        },
        {
            name: 'William the Bald',
            food: 10,
            health: 10,
            skipTurn: false,
            skippedTurn: false,
            hand: [],
            lastPlayedCardId: null,
            dead: false,
        },
    ],
    // 随机决定谁先出牌
    currentPlayerIndex: Math.round(Math.random()),
    get currentPlayer() {
        return state.players[state.currentPlayerIndex];
    },
    get currentOpponentId () {
        return state.currentPlayerIndex === 0 ? 1 : 0
    },
    get currentOpponent () {
        return state.players[state.currentOpponentId]
    },
    get currentHand () {
        return state.currentPlayer.hand
    },
    // 牌堆
    drawPile: pile,
    // 弃牌堆
    discardPile: {},
    canPlay: false,
};
