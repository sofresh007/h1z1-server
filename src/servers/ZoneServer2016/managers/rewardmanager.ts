// ======================================================================
//
//   GNU GENERAL PUBLIC LICENSE
//   Version 3, 29 June 2007
//   copyright (C) 2020 - 2021 Quentin Gruber
//   copyright (C) 2021 - 2024 H1emu community
//
//   https://github.com/QuentinGruber/h1z1-server
//   https://www.npmjs.com/package/h1z1-server
//
//   Based on https://github.com/psemu/soe-network
// ======================================================================

import { setInterval } from "timers";
import { ZoneServer2016 } from "../zoneserver";
import { AccountItems } from "../models/enums";
import { ZoneClient2016 } from "../classes/zoneclient";
import { isHalloween, isPosInPoi } from "../../../utils/utils";

interface Reward {
  itemId: AccountItems;
  dropChances: number;
}

export class RewardManager {
  rewards: Reward[];
  playTimerewards: Reward[];
  private timer?: NodeJS.Timeout;
  constructor(public server: ZoneServer2016) {
    this.rewards = [
      {
        itemId: AccountItems.REWARD_CRATE_MARAUDER,
        dropChances: 50
      },
      {
        itemId: AccountItems.REWARD_CRATE_SHOWDOWN,
        dropChances: 50
      },
      {
        itemId: AccountItems.REWARD_CRATE_INVITATIONAL,
        dropChances: 50
      }
    ];
    this.playTimerewards = [
      {
        itemId: AccountItems.MYSTERY_BAG_1,
        dropChances: 20
      },
      {
        itemId: AccountItems.ELITE_BAG_HARDCORE,
        dropChances: 10
      },
      {
        itemId: AccountItems.MYSTERY_BAG_V2,
        dropChances: 20
      }
    ];
  }

  startInterval() {
    this.timer = setInterval(this.update.bind(this), 1_000);
  }
  start() {
    this.startInterval();
  }
  stop() {
    clearInterval(this.timer);
  }
  addRewardToPlayer(client: ZoneClient2016, rewardId: AccountItems) {
    const item = this.server.generateAccountItem(rewardId);
    if (item) {
      this.server.lootAccountItem(this.server, client, item, true);
    } else {
      console.log("Server failed to generate reward account item");
    }
  }
  dropReward(client: ZoneClient2016) {
    client.character.lastDropPlaytime = client.character.playTime;
    if (isHalloween()) {
      const rewardId: AccountItems = AccountItems.REWARD_CRATE_INFERNAL;
      this.addRewardToPlayer(client, rewardId);
    } else {
      let rewardId: AccountItems = AccountItems.MYSTERY_BAG_1;
      let random = Math.random() * 100;
      for (const reward of this.playTimerewards) {
        random -= reward.dropChances;
        if (random <= 0) {
          rewardId = reward.itemId;
          break;
        }
      }
      this.addRewardToPlayer(client, rewardId);
    }
  }

  update() {
    for (const clientKey in this.server._clients) {
      const client = this.server._clients[clientKey];
      if (
        client.character.playTime - client.character.lastDropPlaytime >
          (isHalloween() ? 60 : 120) &&
        isPosInPoi(client.character.state.position)
      ) {
        this.dropReward(client);
      }
    }
  }
}
