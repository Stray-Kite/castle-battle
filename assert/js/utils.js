function getLastPlayedCard (player) {
    return cards[player.lastPlayedCardId];
}

// WORLD
function getWorldRatio () {
    return 1 / 1920 * window.innerWidth;
}

// 初始化手牌
function drawInitialHand (player) {
    for (let i = 0; i < handSize; i++) {
        player.hand.push(drawCard());
    }
}

// Pile
// 绘制手牌
function drawCard () {
    // drawPile中排数是否为零
    if (getDrawPileCount() === 0) {
        refillPile();
    }

    const choice = Math.round(Math.random() * (getDrawPileCount() - 1)) + 1;

    let	accumulation = 0;
    for (let k in state.drawPile) {
        accumulation += state.drawPile[k];

        if (choice <= accumulation) {
            state.drawPile[k] --;

            return {
                id: k,
                uid: cardUid++,
                def: cards[k],
            }
        }
    }
}

function getDrawPileCount () {
    let result = 0;
    for (let k in state.drawPile) {
        result += state.drawPile[k];
    }
    return result;
}

function refillPile () {
    // 将discardPile中的元素填充到drawPile中，并将discardPile清零
    Object.assign(state.drawPile, state.discardPile);
    state.discardPile = {};
}

// 将cardId加入pile中
function addCardToPile(pile, cardId) {
    if (typeof pile[cardId] === 'number') {
        pile[cardId] ++;
    }else {
        pile[cardId] = 1;
    }
}

// Card play

// 手牌特效施展
function applyCardEffect(card) {
    state.currentPlayer.lastPlayedCardId = card.id;
    card.def.play(state.currentPlayer, state.currentOpponent);
    state.players.forEach(checkStatsBounds);
}

// 是否有玩家死亡
function isOnePlayerDead () {
    return state.players.some(p => p.dead)
}

// 检查血条和食物条
function checkStatsBounds (player) {
    // Health
    if (player.health < 0) {
        player.health = 0;
    } else if (player.health > maxHealth) {
        player.health = maxHealth;
    }

    // Food
    if (player.food < 0) {
        player.food = 0;
    } else if (player.food > maxFood) {
        player.food = maxFood;
    }
}

// 是否有玩家输掉比赛
function checkPlayerLost (player) {
    player.dead = (player.health === 0 || player.food === 0)
}
