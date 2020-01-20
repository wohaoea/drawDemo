<template>
  <div class="draw-lottery">
    <el-select
      @change="selectChange"
      class="w50"
      value-key="value"
      v-model="prize"
      size="medium"
      clearable
      filterable
      placeholder="请选择奖品"
    >
      <el-option-group :key="1" label="第一轮奖品">
        <el-option
          v-for="item in firstGiftList"
          :disabled="item.disabled"
          :key="item.value"
          :label="item.label"
          :value="item"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.supplier }}</span>
        </el-option>
      </el-option-group>
      <el-option-group :key="2" label="第二轮奖品">
        <el-option
          v-for="item in secondGiftList"
          :disabled="item.disabled"
          :key="item.value"
          :label="item.label"
          :value="item"
        >
          <span style="float: left">{{ item.label }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.supplier }}</span>
        </el-option>
      </el-option-group>
    </el-select>
    <el-button @click="start" :disabled="!btnIsAbled" type="primary">开始抽奖</el-button>
    <div class="demo-basic--circle m-t-100">
      <div class="block" style="margin-bottom: 10px;">
        <el-avatar :size="100" :src="circleUrl"></el-avatar>
      </div>
      <span>{{winner}}</span>
    </div>
    <el-table :data="tableData" style="width: 60%; margin: 80px auto">
      <el-table-column prop="prizeName" label="奖品名称"></el-table-column>
      <el-table-column prop="winner" label="中奖人"></el-table-column>
      <el-table-column prop="supplier" label="礼品赞助人"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import nameList from "../assets/jsonData/name.json";
import nameList1 from "../assets/jsonData/name1.json";
import nameList2 from "../assets/jsonData/name2.json";
import nameList3 from "../assets/jsonData/name3.json";
import giftList from "../assets/jsonData/gift.json";

export default {
  name: "drawPage",
  data() {
    return {
      tableData: [],
      btnIsAbled: true,
      options: giftList,
      firstGiftList: [],
      secondGiftList: [],
      prize: "",
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      winner: "？？？"
    };
  },
  methods: {
    start() {
      if (this.prize) {
        // 区分第一轮奖品和第二轮奖品
        let list
        if (this.firstGiftList.some(item => item.value === this.prize.value)) {
          // 第一轮奖品使用赞助人名单
          list = this.prize.value === 7 ? nameList2 : nameList;
        } else {
          // 第二轮奖品使用符合抽奖资格人名单
          list = this.prize.value === 7 ? nameList3 : nameList1;
        }
        let luckId = Math.floor(Math.random() * list.length);
        let index = this.prize.value;
        let i = 0;
        // 已选物品不能重复选择抽奖
        this.$set(this.options[index], "disabled", true);
        // 开始抽奖后禁用抽奖按钮
        this.btnIsAbled = false;
        var loopImg = setInterval(() => {
          this.circleUrl = nameList[i % nameList.length].imgSrc;
          this.winner = nameList[i % nameList.length].name;
          i++;
          if (i === nameList.length + luckId) {
            // 最终锁定中奖成员头像，昵称
            this.circleUrl = nameList[luckId].imgSrc;
            this.winner = nameList[luckId].name;
            this.tableData.push({
              prizeName: this.prize.label,
              winner: nameList[luckId].name,
              supplier: this.prize.supplier
            });
            clearInterval(loopImg);
          }
        }, 100);
      } else {
        this.$message.warning("请选择奖品");
      }
    },
    selectChange() {
      // 奖品改变后启用抽奖按钮
      this.btnIsAbled = true;
    },
    getArrRandomly(arr) {
      var len = arr.length;
      //首先从最大的数开始遍历，之后递减
      for (var i = len - 1; i >= 0; i--) {
        //随机索引值randomIndex是从0-arr.length中随机抽取的
        var randomIndex = Math.floor(Math.random() * (i + 1));
        //下面三句相当于把从数组中随机抽取到的值与当前遍历的值互换位置
        var itemIndex = arr[randomIndex];
        arr[randomIndex] = arr[i];
        arr[i] = itemIndex;
      }
      //每一次的遍历都相当于把从数组中随机抽取（不重复）的一个元素放到数组的最后面（索引顺序为：len-1,len-2,len-3......0）
      return arr;
    }
  },
  mounted () {
    // 随机第一轮+第二轮礼物清单
    let newGiftList = this.getArrRandomly(this.options)
    this.firstGiftList = newGiftList.slice(0, Math.floor(newGiftList.length / 2))
    this.secondGiftList = newGiftList.slice(Math.floor(newGiftList.length / 2), newGiftList.length)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.draw-lottery {
  color: #8492a6;
  .winner {
    // line-height: 20px;
    margin-left: 10px;
  }
  .avatar {
    vertical-align: bottom;
  }
}
.w50 {
  width: 50%;
}
.m-t-100 {
  margin-top: 100px;
}
</style>
