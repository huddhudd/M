document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const selectedLineupContainer = document.getElementById('selected-lineup-container');
    const toggleAllLineupsButton = document.getElementById('toggle-all-lineups-button');
    const allLineupsScrollContainer = document.getElementById('all-lineups-scroll-container');

    let allLineupsRawData = [];
    let heroMap = {};
    let equipmentMap = {};
    let currentlySelectedLineupId = null;

    Promise.all([
        fetch('lineup_detail_total.json').then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for lineup_detail_total.json`);
            return response.json();
        }),
        fetch('chess-6110.js').then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for chess-6110.js`);
            return response.json();
        }),
        fetch('equip-6110.js').then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for equip-6110.js`);
            return response.json();
        })
    ])
    .then(([lineupJson, chessJson, equipJson]) => {
        if (chessJson && chessJson.data) {
            chessJson.data.forEach(hero => {
                heroMap[hero.chessId] = hero;
            });
        } else {
            console.warn('chess-6110.js 数据格式不正确或为空。');
        }

        if (equipJson && equipJson.data) {
            equipJson.data.forEach(equip => {
                equipmentMap[equip.equipId] = equip;
            });
        } else {
            console.warn('equip-6110.js 数据格式不正确或为空。');
        }

        if (lineupJson && lineupJson.lineup_list && lineupJson.lineup_list.length > 0) {
            allLineupsRawData = lineupJson.lineup_list;
            if (allLineupsRawData.length > 0) {
                currentlySelectedLineupId = allLineupsRawData[0].id;
                renderSelectedLineup();
                renderAllLineupsList();
            }
        } else {
            throw new Error('lineup_detail_total.json 数据格式不正确或为空。');
        }
    })
    .catch(error => {
        console.error('无法加载初始数据:', error);
        selectedLineupContainer.innerHTML = `<p>无法加载数据，请检查文件或控制台错误。错误: ${error.message}</p>`;
        allLineupsScrollContainer.innerHTML = `<p>无法加载阵容列表。</p>`;
    });

    // --- 拖动逻辑开始 ---
    let isDragging = false;
    let offsetX, offsetY;
    let initialContainerLeft, initialContainerTop;

    if (container) {
        container.addEventListener('mousedown', (e) => {
            if (e.target.closest('button, .clickable-lineup-card, input, select, textarea')) {
                return;
            }
            isDragging = true;
            offsetX = e.clientX;
            offsetY = e.clientY;

            const styles = window.getComputedStyle(container);
            initialContainerLeft = parseInt(styles.left, 10) || 0;
            initialContainerTop = parseInt(styles.top, 10) || 0;

            container.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - offsetX;
            const dy = e.clientY - offsetY;

            container.style.left = `${initialContainerLeft + dx}px`;
            container.style.top = `${initialContainerTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                container.style.cursor = 'grab';
            }
        });
    }
    // --- 拖动逻辑结束 ---

    function createLineupCardElement(rawLineupData, isClickable = false) {
        if (!rawLineupData) return null;

        try {
            const lineupDetail = JSON.parse(rawLineupData.detail);
            const lineupDiv = document.createElement('div');
            lineupDiv.className = 'lineup-display-card';

            if (isClickable) {
                lineupDiv.classList.add('clickable-lineup-card');
                lineupDiv.dataset.lineupId = rawLineupData.id;

                // 创建 "+" 按钮
                const plusButton = document.createElement('button');
                plusButton.className = 'lineup-plus-button';
                plusButton.textContent = '+';
                plusButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // 防止触发父元素 (卡片) 的点击事件
                    console.log(`Plus button clicked for lineup ID: ${rawLineupData.id}`);
                    alert(`点击了阵容 ${rawLineupData.id} 的 "+" 按钮`);
                });
                lineupDiv.appendChild(plusButton); // "+" 按钮直接添加到 lineupDiv

                // 创建内容包裹器 (用于标题和英雄网格)
                const contentWrapper = document.createElement('div');
                contentWrapper.className = 'lineup-content-wrapper';

                const lineupCardHeader = document.createElement('div');
                lineupCardHeader.className = 'lineup-card-header';

                const title = document.createElement('h3');
                title.textContent = lineupDetail.line_name || `阵容 ${rawLineupData.id}`;
                lineupCardHeader.appendChild(title);
                contentWrapper.appendChild(lineupCardHeader); // 头部添加到内容包裹器

                // 卡片点击事件
                lineupDiv.addEventListener('click', (e) => {
                    // 确保点击的不是加号按钮本身 (虽然 stopPropagation 应该能处理)
                    if (e.target.classList.contains('lineup-plus-button')) {
                        return;
                    }
                    currentlySelectedLineupId = rawLineupData.id;
                    renderSelectedLineup();
                    if (!allLineupsScrollContainer.classList.contains('hidden')) {
                        allLineupsScrollContainer.classList.add('hidden');
                        updateToggleAllLineupsButtonText();
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });

                const heroesGrid = document.createElement('div');
                heroesGrid.className = 'heroes-grid';

                if (lineupDetail.hero_location && lineupDetail.hero_location.length > 0) {
                    const sortedHeroes = [...lineupDetail.hero_location].sort((heroLocA, heroLocB) => {
                        const heroDataA = heroMap[heroLocA.hero_id];
                        const heroDataB = heroMap[heroLocB.hero_id];
                        const priceA = (heroDataA && heroDataA.price) ? parseInt(heroDataA.price, 10) : Infinity;
                        const priceB = (heroDataB && heroDataB.price) ? parseInt(heroDataB.price, 10) : Infinity;
                        if (isNaN(priceA) && isNaN(priceB)) return 0;
                        if (isNaN(priceA)) return 1;
                        if (isNaN(priceB)) return -1;
                        return priceA - priceB;
                    });

                    sortedHeroes.forEach(hero => {
                        const heroCard = document.createElement('div');
                        heroCard.className = 'hero-card';
                        heroCard.style.position = 'relative';
                        const heroData = heroMap[hero.hero_id];

                        const starsContainer = document.createElement('div');
                        starsContainer.className = 'hero-stars';
                        const starCount = hero.numStar ? parseInt(hero.numStar, 10) : (hero.star ? parseInt(hero.star, 10) : 0);
                        if (starCount > 0) {
                            for (let i = 0; i < starCount; i++) {
                                const starElement = document.createElement('span');
                                starElement.className = 'star-icon';
                                starsContainer.appendChild(starElement);
                            }
                        }
                        heroCard.appendChild(starsContainer);

                        const mainInfoContainer = document.createElement('div');
                        mainInfoContainer.className = 'hero-main-info';

                        const leftIndicatorsContainer = document.createElement('div');
                        leftIndicatorsContainer.className = 'hero-indicators-left';
                        if (hero.is_carry_hero) {
                            const carryIndicator = document.createElement('div');
                            carryIndicator.className = 'carry-hero-indicator';
                            leftIndicatorsContainer.appendChild(carryIndicator);
                        }
                        if (hero.is_vanguard_hero) {
                            const vanguardIndicator = document.createElement('div');
                            vanguardIndicator.className = 'vanguard-hero-indicator';
                            leftIndicatorsContainer.appendChild(vanguardIndicator);
                        }
                        if (hero.is_plus_hero) { 
                            const plusIndicator = document.createElement('div');
                            plusIndicator.className = 'plus-indicator';
                            leftIndicatorsContainer.appendChild(plusIndicator);
                        }
                        mainInfoContainer.appendChild(leftIndicatorsContainer);

                        const avatar = document.createElement('div');
                        avatar.className = 'hero-avatar';
                        if (heroData && heroData.name) {
                            avatar.style.backgroundImage = `url(//game.gtimg.cn/images/lol/act/img/tft/champions/${heroData.name})`;
                        }
                        mainInfoContainer.appendChild(avatar);
                        heroCard.appendChild(mainInfoContainer);

                        const name = document.createElement('div');
                        name.className = 'hero-name';
                        name.textContent = heroData ? heroData.displayName : `ID: ${hero.hero_id}`;
                        heroCard.appendChild(name);

                        if (hero.equipment_id && hero.equipment_id.length > 0) {
                            const itemsDiv = document.createElement('div');
                            itemsDiv.className = 'hero-items';
                            const itemIds = hero.equipment_id.split(',');
                            itemIds.forEach(itemId => {
                                if (itemId) {
                                    const itemIconWrapper = document.createElement('div');
                                    itemIconWrapper.className = 'item-icon-wrapper';
                                    itemIconWrapper.style.position = 'relative';

                                    const itemIcon = document.createElement('div');
                                    itemIcon.className = 'item-icon';
                                    const equipmentData = equipmentMap[itemId.trim()];
                                    if (equipmentData) {
                                        itemIcon.style.backgroundImage = `url(${equipmentData.imagePath})`;
                                        itemIcon.title = equipmentData.name;

                                        itemIcon.addEventListener('mouseenter', () => {
                                            if (equipmentData.formula) {
                                                const formulaTooltip = document.createElement('div');
                                                formulaTooltip.className = 'formula-tooltip';
                                                formulaTooltip.style.position = 'absolute';
                                                formulaTooltip.style.bottom = '105%';
                                                formulaTooltip.style.left = '50%';
                                                formulaTooltip.style.transform = 'translateX(-50%)';
                                                formulaTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                                                formulaTooltip.style.padding = '5px';
                                                formulaTooltip.style.borderRadius = '4px';
                                                formulaTooltip.style.display = 'flex';
                                                formulaTooltip.style.gap = '3px';
                                                formulaTooltip.style.zIndex = '10';
                                                formulaTooltip.style.pointerEvents = 'none';

                                                const componentIds = equipmentData.formula.split(',');
                                                componentIds.forEach(compId => {
                                                    const componentData = equipmentMap[compId.trim()];
                                                    if (componentData) {
                                                        const componentImg = document.createElement('img');
                                                        componentImg.className = 'formula-component-img';
                                                        componentImg.style.width = '25px';
                                                        componentImg.style.height = '25px';
                                                        componentImg.style.border = '1px solid #555';
                                                        componentImg.style.borderRadius = '3px';
                                                        componentImg.src = componentData.imagePath;
                                                        componentImg.title = componentData.name;
                                                        formulaTooltip.appendChild(componentImg);
                                                    }
                                                });
                                                itemIconWrapper.appendChild(formulaTooltip);
                                            }
                                        });

                                        itemIcon.addEventListener('mouseleave', () => {
                                            const existingTooltip = itemIconWrapper.querySelector('.formula-tooltip');
                                            if (existingTooltip) {
                                                existingTooltip.remove();
                                            }
                                        });
                                    }
                                    itemIconWrapper.appendChild(itemIcon);
                                    itemsDiv.appendChild(itemIconWrapper);
                                }
                            });
                            heroCard.appendChild(itemsDiv);
                        }
                        heroesGrid.appendChild(heroCard);

                        heroCard.addEventListener('mouseenter', () => {
                            if (heroData) {
                                const tooltip = document.createElement('div');
                                tooltip.className = 'hero-cost-tooltip';
                                tooltip.style.position = 'absolute';
                                tooltip.style.bottom = '-22px';
                                tooltip.style.left = '50%';
                                tooltip.style.transform = 'translateX(-50%)';
                                tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
                                tooltip.style.color = 'white';
                                tooltip.style.padding = '3px 6px';
                                tooltip.style.borderRadius = '4px';
                                tooltip.style.fontSize = '11px';
                                tooltip.style.whiteSpace = 'nowrap';
                                tooltip.style.zIndex = '20';
                                const cost = heroData.price ? parseInt(heroData.price, 10) : '?';
                                tooltip.textContent = `${heroData.displayName || '未知英雄'} ${cost}费`;
                                heroCard.appendChild(tooltip);
                            }
                        });

                        heroCard.addEventListener('mouseleave', () => {
                            const existingTooltip = heroCard.querySelector('.hero-cost-tooltip');
                            if (existingTooltip) {
                                existingTooltip.remove();
                            }
                        });
                    });
                }
                contentWrapper.appendChild(heroesGrid); // 英雄网格添加到内容包裹器
                lineupDiv.appendChild(contentWrapper); // 内容包裹器添加到 lineupDiv

            } else { // 非可点击卡片 (即选中的阵容显示)
                const lineupCardHeader = document.createElement('div');
                lineupCardHeader.className = 'lineup-card-header'; // 保留，但样式可能需要调整
                const title = document.createElement('h3');
                title.textContent = lineupDetail.line_name || `阵容 ${rawLineupData.id}`;
                lineupCardHeader.appendChild(title);
                lineupDiv.appendChild(lineupCardHeader);

                const heroesGrid = document.createElement('div');
                heroesGrid.className = 'heroes-grid';
                
                if (lineupDetail.hero_location && lineupDetail.hero_location.length > 0) {
                    const sortedHeroes = [...lineupDetail.hero_location].sort((heroLocA, heroLocB) => {
                        const heroDataA = heroMap[heroLocA.hero_id];
                        const heroDataB = heroMap[heroLocB.hero_id];
                        const priceA = (heroDataA && heroDataA.price) ? parseInt(heroDataA.price, 10) : Infinity;
                        const priceB = (heroDataB && heroDataB.price) ? parseInt(heroDataB.price, 10) : Infinity;
                        if (isNaN(priceA) && isNaN(priceB)) return 0;
                        if (isNaN(priceA)) return 1;
                        if (isNaN(priceB)) return -1;
                        return priceA - priceB;
                    });

                    sortedHeroes.forEach(hero => {
                        const heroCard = document.createElement('div');
                        heroCard.className = 'hero-card';
                        heroCard.style.position = 'relative';
                        const heroData = heroMap[hero.hero_id];

                        const starsContainer = document.createElement('div');
                        starsContainer.className = 'hero-stars';
                        const starCount = hero.numStar ? parseInt(hero.numStar, 10) : (hero.star ? parseInt(hero.star, 10) : 0);
                        if (starCount > 0) {
                            for (let i = 0; i < starCount; i++) {
                                const starElement = document.createElement('span');
                                starElement.className = 'star-icon';
                                starsContainer.appendChild(starElement);
                            }
                        }
                        heroCard.appendChild(starsContainer);

                        const mainInfoContainer = document.createElement('div');
                        mainInfoContainer.className = 'hero-main-info';

                        const leftIndicatorsContainer = document.createElement('div');
                        leftIndicatorsContainer.className = 'hero-indicators-left';
                        if (hero.is_carry_hero) {
                            const carryIndicator = document.createElement('div');
                            carryIndicator.className = 'carry-hero-indicator';
                            leftIndicatorsContainer.appendChild(carryIndicator);
                        }
                        if (hero.is_vanguard_hero) {
                            const vanguardIndicator = document.createElement('div');
                            vanguardIndicator.className = 'vanguard-hero-indicator';
                            leftIndicatorsContainer.appendChild(vanguardIndicator);
                        }
                        if (hero.is_plus_hero) { 
                            const plusIndicator = document.createElement('div');
                            plusIndicator.className = 'plus-indicator';
                            leftIndicatorsContainer.appendChild(plusIndicator);
                        }
                        mainInfoContainer.appendChild(leftIndicatorsContainer);

                        const avatar = document.createElement('div');
                        avatar.className = 'hero-avatar';
                        if (heroData && heroData.name) {
                            avatar.style.backgroundImage = `url(//game.gtimg.cn/images/lol/act/img/tft/champions/${heroData.name})`;
                        }
                        mainInfoContainer.appendChild(avatar);
                        heroCard.appendChild(mainInfoContainer);

                        const name = document.createElement('div');
                        name.className = 'hero-name';
                        name.textContent = heroData ? heroData.displayName : `ID: ${hero.hero_id}`;
                        heroCard.appendChild(name);

                        if (hero.equipment_id && hero.equipment_id.length > 0) {
                            const itemsDiv = document.createElement('div');
                            itemsDiv.className = 'hero-items';
                            const itemIds = hero.equipment_id.split(',');
                            itemIds.forEach(itemId => {
                                if (itemId) {
                                    const itemIconWrapper = document.createElement('div');
                                    itemIconWrapper.className = 'item-icon-wrapper';
                                    itemIconWrapper.style.position = 'relative';

                                    const itemIcon = document.createElement('div');
                                    itemIcon.className = 'item-icon';
                                    const equipmentData = equipmentMap[itemId.trim()];
                                    if (equipmentData) {
                                        itemIcon.style.backgroundImage = `url(${equipmentData.imagePath})`;
                                        itemIcon.title = equipmentData.name;

                                        itemIcon.addEventListener('mouseenter', () => {
                                            if (equipmentData.formula) {
                                                const formulaTooltip = document.createElement('div');
                                                formulaTooltip.className = 'formula-tooltip';
                                                formulaTooltip.style.position = 'absolute';
                                                formulaTooltip.style.bottom = '105%';
                                                formulaTooltip.style.left = '50%';
                                                formulaTooltip.style.transform = 'translateX(-50%)';
                                                formulaTooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                                                formulaTooltip.style.padding = '5px';
                                                formulaTooltip.style.borderRadius = '4px';
                                                formulaTooltip.style.display = 'flex';
                                                formulaTooltip.style.gap = '3px';
                                                formulaTooltip.style.zIndex = '10';
                                                formulaTooltip.style.pointerEvents = 'none';

                                                const componentIds = equipmentData.formula.split(',');
                                                componentIds.forEach(compId => {
                                                    const componentData = equipmentMap[compId.trim()];
                                                    if (componentData) {
                                                        const componentImg = document.createElement('img');
                                                        componentImg.className = 'formula-component-img';
                                                        componentImg.style.width = '25px';
                                                        componentImg.style.height = '25px';
                                                        componentImg.style.border = '1px solid #555';
                                                        componentImg.style.borderRadius = '3px';
                                                        componentImg.src = componentData.imagePath;
                                                        componentImg.title = componentData.name;
                                                        formulaTooltip.appendChild(componentImg);
                                                    }
                                                });
                                                itemIconWrapper.appendChild(formulaTooltip);
                                            }
                                        });

                                        itemIcon.addEventListener('mouseleave', () => {
                                            const existingTooltip = itemIconWrapper.querySelector('.formula-tooltip');
                                            if (existingTooltip) {
                                                existingTooltip.remove();
                                            }
                                        });
                                    }
                                    itemIconWrapper.appendChild(itemIcon);
                                    itemsDiv.appendChild(itemIconWrapper);
                                }
                            });
                            heroCard.appendChild(itemsDiv);
                        }
                        heroesGrid.appendChild(heroCard);

                        heroCard.addEventListener('mouseenter', () => {
                            if (heroData) {
                                const tooltip = document.createElement('div');
                                tooltip.className = 'hero-cost-tooltip';
                                tooltip.style.position = 'absolute';
                                tooltip.style.bottom = '-22px';
                                tooltip.style.left = '50%';
                                tooltip.style.transform = 'translateX(-50%)';
                                tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
                                tooltip.style.color = 'white';
                                tooltip.style.padding = '3px 6px';
                                tooltip.style.borderRadius = '4px';
                                tooltip.style.fontSize = '11px';
                                tooltip.style.whiteSpace = 'nowrap';
                                tooltip.style.zIndex = '20';
                                const cost = heroData.price ? parseInt(heroData.price, 10) : '?';
                                tooltip.textContent = `${heroData.displayName || '未知英雄'} ${cost}费`;
                                heroCard.appendChild(tooltip);
                            }
                        });

                        heroCard.addEventListener('mouseleave', () => {
                            const existingTooltip = heroCard.querySelector('.hero-cost-tooltip');
                            if (existingTooltip) {
                                existingTooltip.remove();
                            }
                        });
                    });
                }
                lineupDiv.appendChild(heroesGrid);
            }

            return lineupDiv;
        } catch (e) {
            console.error(`解析阵容 ${rawLineupData.id} 的detail时出错:`, e, rawLineupData.detail);
            const errorDiv = document.createElement('div');
            errorDiv.textContent = `加载阵容 ${rawLineupData.id} 出错。`;
            return errorDiv;
        }
    }

    function renderSelectedLineup() {
        selectedLineupContainer.innerHTML = '';
        const rawLineupData = allLineupsRawData.find(l => l.id === currentlySelectedLineupId);
        if (!rawLineupData) {
            selectedLineupContainer.innerHTML = '<p>未找到选中的阵容信息。</p>';
            return;
        }
        const lineupElement = createLineupCardElement(rawLineupData, false);
        if (lineupElement) {
            lineupElement.id = 'current-selected-lineup-display';
            selectedLineupContainer.appendChild(lineupElement);
        }
        updateToggleAllLineupsButtonText();
    }

    function renderAllLineupsList() {
        allLineupsScrollContainer.innerHTML = '';
        allLineupsRawData.forEach(rawLineupData => {
            const lineupCard = createLineupCardElement(rawLineupData, true);
            if (lineupCard) {
                allLineupsScrollContainer.appendChild(lineupCard);
            }
        });
    }

    function updateToggleAllLineupsButtonText(){
        if (allLineupsScrollContainer.classList.contains('hidden')) {
            toggleAllLineupsButton.innerHTML = '阵容 &blacktriangledown;';
        } else {
            toggleAllLineupsButton.innerHTML = '阵容 &blacktriangle;';
        }
    }

    toggleAllLineupsButton.addEventListener('click', () => {
        allLineupsScrollContainer.classList.toggle('hidden');
        updateToggleAllLineupsButtonText();
    });
}); 