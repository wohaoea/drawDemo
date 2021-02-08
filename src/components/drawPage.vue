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
      multiple
      collapse-tags
      placeholder="请选择奖品"
      :disabled="selectAble"
    >
      <el-option-group :key="1" label="">
        <el-option label='一轮奖品（全选）' value='全选' @click.native="selectAll(1)"></el-option>
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
      <el-option-group :key="2" label="">
        <el-option label='二轮奖品（全选）' value='全选' @click.native="selectAll(2)"></el-option>
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
    <el-table :data="tableData" style="width: 60%; margin: 80px auto">
      <el-table-column width="120" prop="round" label="轮次"></el-table-column>
      <el-table-column width="200" show-overflow-tooltip prop="prizeName" label="奖品名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="winner" label="中奖人"></el-table-column>
      <el-table-column show-overflow-tooltip label="礼品赞助人">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.supplier }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import nameList from "../assets/jsonData/name.json";
import nameList1 from "../assets/jsonData/name1.json";
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
      prize: [],
      circleUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      winner: "？？？",
      nameList: nameList,
      nameList1: nameList1,
      currentIndex: 0,
      selectAble: false
    };
  },
  methods: {
    start() {
      this.currentIndex = 0
      if (this.prize.length > 0) {
        this.selectAble = true
        this.everyPrize(this.prize[this.currentIndex])
      }
    },
    everyPrize(prize) {
      if (prize) {
        // 区分第一轮奖品和第二轮奖品
        let list, drawList
        let isFirst = this.firstGiftList.some(item => item.value === prize.value)
        if (isFirst) {
          // 第一轮奖品使用赞助人名单
          list = this.nameList;
          drawList = this.nameList
        } else {
          // 第二轮奖品使用符合抽奖资格人名单
          list = this.nameList1;
          drawList = this.nameList1
        }
        let luckId = Math.floor(Math.random() * list.length);
        this.winner = drawList[luckId].name
        let index = prize.value;
        // 开始抽奖后禁用抽奖按钮
        this.btnIsAbled = false;
        this.tableData.unshift({
          round: isFirst ? '第一轮' : '第二轮',
          prizeName: prize.label,
          winner: drawList[luckId].name,
          supplier: prize.supplier
        })
        // 已选物品不能重复选择抽奖
        this.$set(this.options.filter(item => item.value === index)[0], "disabled", true);
        // 移除已中奖人
        if (isFirst) {
          this.nameList = this.nameList.filter(item => item.name !== this.winner)
        } else {
          this.nameList1 = this.nameList1.filter(item => item.name !== this.winner)
        }
        if (this.currentIndex === this.prize.length - 1) {
          this.selectAble = false
        }
        this.currentIndex++
        if (this.currentIndex < this.prize.length) {
          setTimeout(() => {
            this.everyPrize(this.prize[this.currentIndex])
          }, 1000);
        }
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
    },
    removeGift (giftList) {
      let newGiftList
      if (giftList.some(item => item.value === 7)) {
        // 过滤器
        newGiftList = giftList.filter(item => item.value !== 7)
        newGiftList.unshift(giftList.filter(item => item.value === 7)[0])
      } else {
        newGiftList = giftList.filter(item => item.value !== 7)
      }
      return newGiftList
    },
    selectAll(round) {
      this.prize = round === 1 ? this.firstGiftList : this.secondGiftList
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 随机第一轮+第二轮礼物清单
      let newGiftList = this.getArrRandomly(this.options)
      this.firstGiftList = newGiftList.slice(0, Math.floor(newGiftList.length / 2))
      this.firstGiftList = this.removeGift(this.firstGiftList)
      this.secondGiftList = newGiftList.slice(Math.floor(newGiftList.length / 2), newGiftList.length)
      this.secondGiftList = this.removeGift(this.secondGiftList)
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  display: none;
}
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
.el-table .cell {
  font-size: 16px;
}
.el-input--medium .el-input__inner {
  font-size: 16px;
}
</style>
