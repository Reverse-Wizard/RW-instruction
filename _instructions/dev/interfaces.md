---
title: 逆时巫师官方OL 接口说明
layout: article
key: interface-online-zh
cover: /assets/images/sets/ins.webp
aside:
  toc: true
---

# 接口定义

## 效果类型 EffectType

指导效果解析器读取效果数据

| EffectType | 描述 | 参数 |
|------------|------|------|
| damage | 造成伤害 | amount: number; target: (monsterUUID: string) |
| health | 怪物生命值 | add/set: number; target: (monsterUUID: string) |
| maxHealth | 怪物生命值上限 | add/set: number; target: (monsterUUID: string) |
| reward | 赏金 | add/set: number; target: (monsterUUID: string) |
| mana | 法力值 | add/set: number; target: (playerUUID: string)|
| gold | 金币 | add/set: number; target: (playerUUID: string) |
| freezing | 冻结值 | add/set: number; target: (playerUUID: string) |
| drawCard | 抽牌 | amount: number; target: (playerUUID: string) |
| discardCard | 使玩家弃牌 | [最小弃牌数量]minimum: number; [最大弃牌数量]maximum: number; target: (playerUUID: string) |
| manaCost | 增加法力消耗 | amount: number; target: (cardUUID: string) |
| shuffleBack | 洗回牌堆 | amount: number; target: (cardUUID: string) |

## 触发器事件 TriggerEvent

提供给自定义卡牌开发者可用的接口定义

| TriggerEvent | 描述 | 可供使用的上下文 |
|--------------|------|------|
| onRoundStart | 回合开始时 | [这个回合数] round: number |
| onPreparingPhaseStart | 准备阶段开始时 | 无 |
| onDiscard | 玩家弃牌时 | [玩家UUID] playerUUID: string; [被弃的卡牌UUID] cardUUID: string; [被弃的卡牌id] cardID |
| onPreparingPhaseEnd | 准备阶段结束时 | 无 |
| onExploringPhaseStart | 探索阶段开始时 | 无 |
| onExplorationFlip | 探索牌被翻开时 | [翻出牌的UUID] cardUUID: string; [翻出牌的类型] type: "monster" \| "event"; [翻出牌的id] id: string; [探索等级] level: ExplorationCardLevel; [翻开者的UUID]sourcePlayerUUID: string |
| onExploringPhaseEnd | 探索阶段结束时 | 无 |
| onBattlingPhaseStart | 战斗阶段开始时 | 无 |
| onBattleTurnStart | 回合轮到玩家战斗时 | [玩家UUID] playerUUID: string |
| onPlayCard | 玩家出牌时 | [玩家UUID] playerUUID: string; [牌的UUID] cardUUID: string; [牌的ID] cardID: string |
| onReverse | 玩家逆转时序 | [玩家UUID] playerUUID: string |
| onDamageTaken | 怪物受到伤害时 | [怪物牌的UUID] monsterUUID: string; [伤害来源的UUID] sourcePlayerUUID: string; [伤害数值] amount: number; [怪物牌的id]monsterID: string;[怪物等级] level: ExplorationCardLevel|
| onDefeat | 怪物被击败时 | [怪物牌的UUID] monsterUUID: string; [击败者的UUID] sourcePlayerUUID: string;[怪物牌的id]monsterID: string;[怪物等级] level: ExplorationCardLevel|
| onBattleTurnEnd | 回合玩家战斗结束时 | [玩家UUID] playerUUID: string |
| onBattlingPhaseEnd | 战斗阶段结束时 | 无 |
| onAdvancingPhaseStart | 推进阶段开始时 | 无 |
| onAdvanceTurnStart | 轮到玩家推进时 | [玩家UUID] playerUUID: string |
| onAdvanceKick | 玩家选择在推进阶段将其他玩家向前推进一步时 | [踢人者] kickerUUID: string; [被踢者] kickedUUID: string|
| onAdvanceTurnEnd | 玩家推进结束时 | [玩家UUID] playerUUID: string |
| onAdvancingPhaseEnd | 推进阶段结束时 | 无 |
| onSupplyingPhaseStart | 补给阶段开始时 | 无 |
| onSupplyTurnStart | 轮到玩家进行补给阶段时 | [玩家UUID] playerUUID: string |
| onBuy | 玩家在商店购买新的卡牌时 | [玩家UUID] playerUUID: string; [被买的卡牌UUID] cardUUID: string; [被买的卡牌id] cardID; [卖出时的价格] price: number |
| onForget | 玩家在酒馆遗忘卡牌时 | [玩家UUID] playerUUID: string; [被遗忘的卡牌UUID] cardUUID: string; [被遗忘的卡牌id] cardID |
| onSupplyTurnEnd | 玩家补给阶段结束/跳过时 | [玩家UUID] playerUUID: string |
| onSupplyingPhaseEnd | 补给阶段结束时 | 无 |
| onRoundEnd | 回合结束时 | [这个回合数] round: number |










