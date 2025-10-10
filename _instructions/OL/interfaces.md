---
title: 逆时巫师OL 数据结构规范与接口说明
layout: article
key: interface-ol-zh
cover: /assets/images/sets/ins.webp
aside:
  toc: true
---

# 逆时巫师 OL 数据结构规范

本文件描述了逆时巫师 OL 项目中使用的主要数据结构和格式规范，旨在确保前后端以及各个模块之间的数据一致性和互操作性。

## 1. 卡牌数据结构

### 1.1 基本卡牌结构

- 宝藏牌

```json
{
  "id": "base.treasure.original.stone", // 唯一标识符，格式为 "包名.类(treasure/exploration).细分.卡牌名"
  "count": "$1", // 数量，一局游戏中该卡牌副本的总量，"$1" 表示玩家数量x1, 1 表示固定1张无论玩家数量
  "name": "小石子", // 卡牌默认名称
  "manaCost": 0, // 法力消耗，整数
  "rarity": "ori", // 稀有度，"ori"（基础）,"com"(普通),"leg"(传说)
  "school": "none", // 派系，"none"(无派系),"fire"(火焰),"frost"(冰霜),"arcane"(奥能)
  "description": "造成2点伤害。", // 卡牌描述，支持简单的 HTML 标签
  "behaviors": [
    // 行为列表，顺序执行
    {
      "at": "onPlay", // 行为时机，"onPlay"(被打出时),"onDraw"(被抽到时),"onDiscard"(被弃牌时),"onForget"(被遗忘时) 指导卡牌移动器在何时执行事件挂载任务
      "do": "addTriggers",
      // 触发器对象，定义卡牌在特定事件下的行为
      "triggers": [{
        "event": "instant", // 触发事件类型，"onPlayed"(有玩家打出牌时),"onExplorationDrawn"(有玩家在抽牌探索牌时),"onDiscard"(有玩家在弃牌时),"onTurnStarted"(回合开始时),"onTurnEnd"(回合结束时),"instant"(立即触发)
        "conditions": [
          // 触发条件列表,与逻辑
          // 无条件，只要事件触发就执行
        ],
        "type": "once", // 触发器类型，"once"(触发一次后销毁),"permanent"(持续存在直到游戏结束),"round"(持续到回合结束),指导触发器管理器在触发后如何处理该触发器
        "effects": [
          // 触发效果列表，顺序执行
          {
            "type": "damage",
            "target": { "chooser": "monsters" },
            "amount": 2
          }
        ]
      }]
    }
  ]
}
```

#### 1.1.1 字段说明

- `id`: 卡牌的唯一标识符，建议使用包名、类别、细分和卡牌名的组合方式命名，以避免冲突。
- `count`: 表示该卡牌在一局游戏中的总数量，可以使用 "$1" 来表示与玩家数量相关的数量。
- `name`: 卡牌的默认名称，建议使用简洁明了的名称。
- `manaCost`: 卡牌的法力消耗，必须为整数。
- `rarity`: 卡牌的稀有度，建议使用预定义的字符串表示不同的稀有度等级。
- `school`: 卡牌的派系，建议使用预定义的字符串表示不同的派系。
- `description`: 卡牌的描述，支持简单的 HTML 标签以增强可读性。
- `behaviors`: 卡牌的行为列表，定义了卡牌在特定事件下的触发器和效果。

behavior类型

- `dealDamage`: 造成伤害
  - `target`: 目标
  - `amount`: 伤害数值

- `regenMana`: 恢复法力
  - `target`: 恢复目标
  - `amount`: 恢复数值

- `drawCards`: 抽牌
  - `target`: 抽牌目标
  - `amount`: 抽牌数量

这三种其实本质上是addTriggers的一种简写形式。事实上，当行为执行器遇到这三种类型时，会自动将他们翻译成instant trigger并发送到触发器管理器。

- `addTriggers`: 添加一个触发器到卡牌上
  - `triggers`: 触发器列表

- 探索牌

```json
{
  "id": "base.exploration.III.gilding_components",
  "name": "镀金的部件",
  "type": "event",
  "description": "你下一张翻开的怪物牌血量+3，赏金+1",
  "level": "III",
  "behaviors": [
    {
      "at": "onDrawExploration",
      "do": "addTriggers",
      "triggers": [
        {
          "event": "onExplored",
          "conditions": [
            {
              "type": "equals",
              "left": "$onDrawExploration.byWho",
              "right": "$onExplored.byWho"
            },
            {
              "type": "equals",
              "left": "$onExplored.card.type",
              "right": "monster"
            }
          ],
          "type": "once",
          "effects": [
            {
              "type": "buffMonster",
              "health": 3,
              "reward": 1
            }
          ]
        }
      ]
    }
  ]  ]
}
```

# 接口定义

## 宝藏牌行为时机 TreasureCardTiming

| TreasureCardTiming | 描述       | 可供使用的上下文               |
| ------------------ | ---------- | ------------------------------ |
| onPlay             | 出牌时     | [玩家 UUID] playerUUID: string |
| onEquip            | 装备时     | [玩家 UUID] playerUUID: string |
| onUnequip          | 卸下时     | [玩家 UUID] playerUUID: string |
| onDraw             | 抽到卡牌时 | [玩家 UUID] playerUUID: string |
| onBuy              | 购买卡牌时 | [玩家 UUID] playerUUID: string |
| onDiscard          | 弃牌时     | [玩家 UUID] playerUUID: string |
| onForget           | 遗忘卡牌时 | [玩家 UUID] playerUUID: string |

## 示例宝藏牌数据

```json
{
  "id": "base.treasure.common.bash", // 卡牌唯一标识符
  "count": 1,                  // 卡牌数量
  "name" : "当头一棒",         // 卡牌默认名称
  "manaCost": 3,           // 法力消耗
  "rarity": "common",      // 稀有度
  "school": "none",       // 派系
  "description": "造成9点伤害，若你装备了魔杖，改为造成12点伤害。", // 卡牌默认描述
  "behaviors": [ // 行为列表
    {
        "at": "onPlay", // 行为时机，在该卡牌被打出时触发
        "do": [ // doable 列表，顺序执行
            {
                "type": "if", // doable: if
                "condition": // if.condition
                {
                    "type": "HasWand",
                    "playerUUID": "$onPlay.playerUUID",
                },
                "do": [ // if.do 列表，条件满足时执行
                    {
                        "type": "damage",
                        "amount": 12,
                        "target": {
                            "type" : "monsterChooser",
                            "ask" : "$onPlay.playerUUID"
                        }
                    }
                ],
                "elsedo": [ // if.elsedo 列表，条件不满足时执行
                    {
                        "type": "damage",
                        "amount": 9,
                        "target": {
                            "type" : "monsterChooser",
                            "ask" : "$onPlay.playerUUID"
                        }
                    }
                ]
            }
        ]
    }
  ]
```

```json
{
  "id": "base.treasure.common.survival_of_the_fittest", // 卡牌唯一标识符
  "count": "1", // 卡牌数量
  "name": "优胜劣汰", // 卡牌默认名称
  "manaCost": 2, // 法力消耗
  "rarity": "common", // 稀有度
  "school": "none", // 派系
  "description": "抽5张牌，弃掉法力值消耗小于等于4点的卡牌。",
  "behaviors": [
    {
      // 索引器创建，服务于单个behavior key:value 对
      "at": "onPlay", // 行为时机，在该卡牌被打出时触发；它会提供一个上下文变量 {onPlay.playerUUID}, 在接下来的do中可以引用，现在上下文变量的样子是 { onPlay.playerUUID: playerUUIDstring }
      "do": [
        {
          "id": "loop1", // 给这个循环效果一个唯一标识符，可以在循环体内引用，现在上下文变量的样子是 { onPlay.playerUUID: playerUUIDstring, loop1.index: 1 }
          "type": "loop", // doable 类型为 loop
          "times": 5, // 循环次数
          "do": [
            // 循环体 doable 列表
            {
              "id": "dc{loop1.index}", // 给这个抽牌效果一个唯一标识符，可以在后续的if中引用; 对解析器而言，每需要在一个doable里取值时，会从上下文变量中寻找并替换字符串，例如第一次循环时，{loop1.index} 会被替换为 1，第二次循环时替换为 2...，所以这个id会被解析为 dc1, dc2, dc3, dc4, dc5
              "type": "drawCard",
              "amount": 1,
              "target": "{onPlay.playerUUID}" // 从上下文变量中取值
            },
            {
              "type": "if", // doable 类型为 if
              "condition": {
                // if.condition
                "type": "LessThanOrEqual", // 条件类型为 LessThanOrEqual
                "value1": {
                  "type": "getCardProperty", // value1 取值类型为 getCardProperty，表示从卡牌属性中取值
                  "cardUUID": "{dc{loop1.index}.UUID}", // cardUUID 从上下
                  "property": "manaCost" // 取法力消耗属性
                }, // 从上下文变量中取值，引用刚才抽到的卡牌的 UUID，解析器在解读时会先将内部的{...}索引替换值，所以先编程 {dc1.UUID}，然后将值再进行索引，最终得到抽到的卡牌 UUID
                "value2": 4
              },
              "do": [
                {
                  "type": "discardCard",
                  "target": "{dc{loop1.index}.UUID}"
                }
              ]
            }
          ]
        }
      ]
    } // 事情干完后，上下文变量会被清理掉
  ]
}
```

## 可执行效果 Doable

用于描述可执行的效果

| DoableType     | 描述         | 参数                                                          |
| -------------- | ------------ | ------------------------------------------------------------- |
| loop           | 循环执行     | times: number; do: Doable[]; target?: string \| Chooser       |
| if             | 条件执行     | condition: Condition; do: Doable[];elsedo?: Doable[]          |
| damage         | 造成伤害     | amount: number; target: string \| Chooser                     |
| health         | 生命值       | mode: "add"\|"set"; amount: number; target: string \| Chooser |
| maxHealth      | 生命值上限   | mode: "add"\|"set"; amount: number; target: string \| Chooser |
| reward         | 赏金         | mode: "add"\|"set"; amount: number; target: string \| Chooser |
| mana           | 法力值       | mode: "add"\|"set"; amount: number; target: string \| Chooser |
| gold           | 金币         | mode: "add"\|"set"; amount: number; target: string \| Chooser |
| freezing       | 冻结值       | mode: "add"\|"set"; amount: number; target: string \| Chooser |
| drawCard       | 抽牌         | amount: number; target: string \| Chooser                     |
| askDiscardCard | 使玩家弃牌   | minimum: number; maximum: number; target: string \| Chooser   |
| discardCard    | 弃掉指定卡牌 | target: string \| Chooser                                     |
| manaCost       | 增加法力消耗 | mode: "add"\|"set"; amount: number; target: string \| Chooser |
| shuffleBack    | 洗回牌堆     | player: string \| Chooser                                     |
| addTriggers    | 添加触发器   | triggers: Trigger[]                                           |
| removeTriggers | 移除触发器   | mode:"UUID"\|"id"; targets: string[] |

> removeTriggers 一般只有触发器管理器创建

## 触发器 Trigger

用于描述卡牌在特定事件下的行为

```typescript
interface Trigger {
  UUID: string;          // 触发器实例的唯一标识符
  id?: string;           // 触发器定义的标识符
  mode: "once" | "turn" | "round" | "battle" | "always"; // 触发模式
  event: TriggerEvent;     // 触发事件
  condition?: Condition;         // 触发条件
  do: Doable[];       // 效果列表
}
```

### 字段解释

- **UUID**: 触发器实例的唯一标识符，在实例化时生成，确保每个触发器都有独特的ID。
- **id**: 触发器定义的标识符，用于区分不同类型的触发器。便于Getter找到某一类或独属于某张卡牌的触发器，支持变量
- **mode**: 触发模式，定义触发器的生命周期。除了once和always 模式，其他情况下它会在触发器被挂载时额外创建一个用于移除它的触发器
  - "once": 触发一次后销毁
  - "turn": 持续到回合结束 一个onTurnEnd事件，condition是playerUUID等于触发器所属玩家的UUID，do是根据UUID移除这个触发器
  - "round": 持续到整轮结束 一个onRoundEnd事件，condition是无，do是根据UUID移除这个触发器
  - "battle": 持续到战斗结束 一个onBattlingPhaseEnd事件，condition是无，do是根据UUID移除这个触发器
  - "always": 持续存在直到游戏结束 不创建移除触发器。唯一可能被移除的情况是别的地方调用了removeTriggers

## 触发器事件 TriggerEvent

提供给自定义卡牌开发者可用的接口定义

| TriggerEvent | 描述 | 可供使用的上下文 |
| ---| --- | --- |
| onRoundStart| 回合开始时| [这个回合数] round: number |
| onPreparingPhaseStart | 准备阶段开始时 | 无 |
| onDiscard | 玩家弃牌时 | [玩家 UUID] playerUUID: string; [被弃的卡牌 UUID] cardUUID: string; [被弃的卡牌 id] cardID |
| onPreparingPhaseEnd | 准备阶段结束时 | 无 |
| onExploringPhaseStart | 探索阶段开始时 | 无 |
| onExplorationFlip | 探索牌被翻开时 | [翻出牌的 UUID] cardUUID: string; [翻出牌的类型] type: "monster" \| "event"; [翻出牌的 id] id: string; [探索等级] level: ExplorationCardLevel; [翻开者的 UUID]sourcePlayerUUID: string |
| onExploringPhaseEnd | 探索阶段结束时 | 无 |
| onBattlingPhaseStart | 战斗阶段开始时 | 无 |
| onBattleTurnStart | 回合轮到玩家战斗时 | [玩家 UUID] playerUUID: string |
| onPlayCard | 玩家出牌时 | [玩家 UUID] playerUUID: string; [牌的 UUID] cardUUID: string; [牌的 ID] cardID: string |
| onReverse | 玩家逆转时序 | [玩家 UUID] playerUUID: string |
| onDamageTaken | 怪物受到伤害时 | [怪物牌的 UUID] monsterUUID: string; [伤害来源的 UUID] sourcePlayerUUID: string; [伤害数值] amount: number; [怪物牌的 id]monsterID: string;[怪物等级] level: ExplorationCardLevel |
| onDefeat | 怪物被击败时 | [怪物牌的 UUID] monsterUUID: string; [击败者的 UUID] sourcePlayerUUID: string;[怪物牌的 id]monsterID: string;[怪物等级] level: ExplorationCardLevel |
| onBattleTurnEnd | 回合玩家战斗结束时 | [玩家 UUID] playerUUID: string |
| onBattlingPhaseEnd | 战斗阶段结束时 | 无 |
| onAdvancingPhaseStart | 推进阶段开始时 | 无 |
| onAdvanceTurnStart | 轮到玩家推进时 | [玩家 UUID] playerUUID: string |
| onAdvanceKick | 玩家选择在推进阶段将其他玩家向前推进一步时 | [踢人者] kickerUUID: string; [被踢者] kickedUUID: string |
| onAdvanceTurnEnd | 玩家推进结束时 | [玩家 UUID] playerUUID: string |
| onAdvancingPhaseEnd | 推进阶段结束时 | 无 |
| onSupplyingPhaseStart | 补给阶段开始时 | 无 |
| onSupplyTurnStart | 轮到玩家进行补给阶段时 | [玩家 UUID] playerUUID: string |
| onRefreshShop | 玩家刷新商店时 | [玩家 UUID] playerUUID: string; [刷新前的商店卡牌 UUID 列表] oldShopCardUUIDs: string[]; [刷新前的商店卡牌 ID 列表] oldShopCardIDs: string[]; [刷新后的商店卡牌 UUID 列表] newShopCardUUIDs: string[]; [刷新后的商店卡牌 ID 列表] newShopCardIDs: string[]; [刷新时的价格] price: number |
| onBuy | 玩家在商店购买新的卡牌时 | [玩家 UUID] playerUUID: string; [被买的卡牌 UUID] cardUUID: string; [被买的卡牌 id] cardID; [卖出时的价格] price: number |
| onForget | 玩家在酒馆遗忘卡牌时 | [玩家 UUID] playerUUID: string; [被遗忘的卡牌 UUID] cardUUID: string; [被遗忘的卡牌 id] cardID |
| onSupplyTurnEnd | 玩家补给阶段结束/跳过时 | [玩家 UUID] playerUUID: string |
| onSupplyingPhaseEnd | 补给阶段结束时 | 无 |
| onRoundEnd | 回合结束时 | [这个回合数] round: number |

### 事件触发顺序

- 回合开始 onRoundStart
  - 准备阶段开始 onPreparingPhaseStart
  - 准备阶段结束 onPreparingPhaseEnd
  - 探索阶段开始 onExploringPhaseStart
    - 探索牌被翻开 onExplorationFlip
  - 探索阶段结束 onExploringPhaseEnd
  - 战斗阶段开始 onBattlingPhaseStart
    - 回合轮到玩家战斗 onBattleTurnStart
      - 玩家出牌 onPlayCard
      - 玩家逆转时序 onReverse
      - 怪物受到伤害 onDamageTaken
      - 怪物被击败 onDefeat
    - 回合玩家战斗结束 onBattleTurnEnd
  - 战斗阶段结束 onBattlingPhaseEnd
  - 推进阶段开始 onAdvancingPhaseStart
    - 轮到玩家推进 onAdvanceTurnStart
      - 玩家选择在推进阶段将其他玩家向前推进一步 onAdvanceKick
    - 玩家推进结束 onAdvanceTurnEnd
  - 推进阶段结束 onAdvancingPhaseEnd
  - 补给阶段开始 onSupplyingPhaseStart
    - 轮到玩家进行补给阶段时 onSupplyTurnStart
      - 玩家进行补给操作（购买、遗忘等）
        - 刷新商店时触发 onRefreshShop 事件
        - 购买时触发 onBuy 事件
        - 遗忘时触发 onForget 事件
      - 玩家补给结束/跳过时 onSupplyTurnEnd
  - 补给阶段结束时 onSupplyingPhaseEnd
  - 回合结束时 onRoundEnd

## 条件 ConditionType

用于触发器的触发条件

| ConditionType      | 描述         | 参数                                  |
| ------------------ | ------------ | ------------------------------------- |
| Equals             | 等于         | value1: any; value2: any              |
| GreaterThan        | 大于         | value1: number; value2: number        |
| LessThan           | 小于         | value1: number; value2: number        |
| GreaterThanOrEqual | 大于等于     | value1: number; value2: number        |
| LessThanOrEqual    | 小于等于     | value1: number; value2: number        |
| And                | 并且         | conditions: Condition[]               |
| Or                 | 或者         | conditions: Condition[]               |
| Not                | 非           | condition: Condition                  |
| HasCard            | 拥有指定卡牌 | playUUID: string; cardUUID: string;   |
| HasNoCard          | 没有指定卡牌 | playUUID: string; cardUUID: string;   |
| IsType             | 是指定类型   | playUUID: string; cardType: CardType; |
| IsNotType          | 不是指定类型 | playUUID: string; cardType: CardType; |
| AlwaysTrue         | 永远为真     | 无                                    |
| AlwaysFalse        | 永远为假     | 无                                    |

## TriggerGetter

用于获取特定触发器的UUID列表

```typescript
interface TriggerGetter {
  mode: "id" | "event";      // 获取模式，按id或按event获取
  value: string;           // 获取值，mode为id时是触发器id，mode为event时是触发器事件名
}
```

### 示例触发器

> 反制你的下家的下一张法术牌

// play函数会专门等待触发器drain的执行结果是否指示反制效果，如果是则不执行后续效果

```json
{
  "event": "onPlay", // 触发事件
  "condition": { // 触发条件
    "type": "HasWand",
    "playerUUID": "$onPlay.playerUUID",
  },
  "do": [ // 效果列表
    {
      "type": "damage",
      "amount": 12,
      "target": {
        "type" : "monsterChooser",
        "ask" : "$onPlay.playerUUID"
      }
    }
  ]
}
```
