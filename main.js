class RobloxClicker {
    constructor() {
        this.robux = 0;
        this.rps = 0;
        this.upgrades = {
            'auto-clicker': { level: 0, cost: 10, rps: 0.1 },
            'premium': { level: 0, cost: 50, rps: 0.5 },
            'game-passes': { level: 0, cost: 100, rps: 1 },
            'vip-server': { level: 0, cost: 500, rps: 2 }
        };
        this.achievements = {
            '100': false,
            '1000': false,
            '10000': false
        };
        
        this.loadGame();
        this.init();
        this.startGameLoop();
    }

    init() {
        this.clickBtn = document.getElementById('click-btn');
        this.robuxElement = document.getElementById('robux');
        this.rpsElement = document.getElementById('rps');
        this.clickEffect = document.getElementById('click-effect');

        this.clickBtn.addEventListener('click', () => this.handleClick());
        this.updateUI();
    }

    handleClick() {
        this.robux++;
        this.showClickEffect();
        this.updateUI();
        this.checkAchievements();
        this.saveGame();
    }

    showClickEffect() {
        const effect = this.clickEffect.cloneNode(true);
        effect.textContent = '+1';
        effect.style.opacity = '1';
        this.clickBtn.parentNode.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 1000);
    }

    buyUpgrade(upgradeId) {
        const upgrade = this.upgrades[upgradeId];
        if (this.robux >= upgrade.cost) {
            this.robux -= upgrade.cost;
            upgrade.level++;
            this.rps += upgrade.rps;
            upgrade.cost = Math.floor(upgrade.cost * 1.5);
            
            this.updateUI();
            this.saveGame();
        }
    }

    updateUI() {
        this.robuxElement.textContent = this.formatNumber(this.robux);
        this.rpsElement.textContent = this.formatNumber(this.rps);
        
        // Обновляем информацию об улучшениях
        for (const [id, upgrade] of Object.entries(this.upgrades)) {
            document.getElementById(`${id}-level`).textContent = upgrade.level;
            document.getElementById(`${id}-cost`).textContent = this.formatNumber(upgrade.cost);
            
            const button = document.querySelector(`#${id} .buy-btn`);
            button.disabled = this.robux < upgrade.cost;
        }

        // Обновляем достижения
        this.updateAchievements();
    }

    updateAchievements() {
        const achievements = {
            '100': this.robux >= 100,
            '1000': this.robux >= 1000,
            '10000': this.robux >= 10000
        };

        for (const [amount, unlocked] of Object.entries(achievements)) {
            const achievementElement = document.getElementById(`achievement-${amount}`);
            if (unlocked && !this.achievements[amount]) {
                this.achievements[amount] = true;
                achievementElement.style.background = 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)';
                achievementElement.querySelector('.achievement-status').textContent = '✅';
            }
        }
    }

    checkAchievements() {
        if (this.robux >= 100 && !this.achievements['100']) {
            this.unlockAchievement('100');
        }
        if (this.robux >= 1000 && !this.achievements['1000']) {
            this.unlockAchievement('1000');
        }
        if (this.robux >= 10000 && !this.achievements['10000']) {
            this.unlockAchievement('10000');
        }
    }

    unlockAchievement(amount) {
        this.achievements[amount] = true;
        this.saveGame();
    }

    startGameLoop() {
        setInterval(() => {
            this.robux += this.rps;
            this.updateUI();
            this.checkAchievements();
            this.saveGame();
        }, 1000);
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return Math.floor(num);
    }

    saveGame() {
        const gameData = {
            robux: this.robux,
            rps: this.rps,
            upgrades: this.upgrades,
            achievements: this.achievements
        };
        localStorage.setItem('robloxClickerSave', JSON.stringify(gameData));
    }

    loadGame() {
        const savedData = localStorage.getItem('robloxClickerSave');
        if (savedData) {
            const gameData = JSON.parse(savedData);
            this.robux = gameData.robux || 0;
            this.rps = gameData.rps || 0;
            this.upgrades = gameData.upgrades || this.upgrades;
            this.achievements = gameData.achievements || this.achievements;
        }
    }
}

// Глобальные функции для кнопок
function buyUpgrade(upgradeId) {
    game.buyUpgrade(upgradeId);
}

// Инициализация игры
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new RobloxClicker();
});
