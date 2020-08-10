<template>
  <div class="win">
    <!-- 导航 -->
    <van-sticky>
      <van-nav-bar
        :title="tit"
        left-text="返回"
        right-text="按钮"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      >
        <template #right>
          <van-icon v-if="ISsearch" name="search" size="18" />
          <van-icon v-else-if="ISellipsis" name="weapp-nav" size="18" />
        </template>
      </van-nav-bar>
    </van-sticky>

    <!-- 内容 -->
    <van-row id="conData">
      <!-- <van-pull-refresh> -->
      <van-list>
        <van-cell v-for="item in dialoguelist" :key="item.uname" class="hhlist">
          <span>{{ item.uname }}：</span>
          <img v-if="ISgif(item.val)" :src="getBracketStr(item.val)" width="50px" class="ISimg" />
          <span v-else>{{ item.val }}</span>
        </van-cell>
      </van-list>
    </van-row>

    <!-- 输入框 -->
    <van-row>
      <van-cell-group>
        <van-field
          v-model="inputData.val"
          clearable
          type="textarea"
          rows="1"
          :autosize="{ maxHeight: 72 }"
          @click-left-icon="clickLI"
          @keyup.enter="submit"
          class="inptVal"
          placeholder="请输入文本"
        >
          <template #left-icon>
            <van-icon class="ico" size="18">&#xe62e;</van-icon>
          </template>
          <template #right-icon>
            <van-icon
              class="ico pullL"
              size="16"
              style="font-weight: bold;"
              @click="showPopup"
            >&#xe614;</van-icon>
            <van-icon
              class="ico pullL"
              size="18"
              style="padding-left: 8px;"
              @click="submit"
            >&#xe652;</van-icon>
          </template>
        </van-field>
      </van-cell-group>
      <van-cell-group :style="{height:popH}" class="memeBox">
        <van-row class="meme" type="flex" justify="space-around">
          <van-image
            v-for="e in meme"
            :key="e"
            :src="`http://a.zhongtengwang.cn/images/meme/${e}`"
            alt
            loading="spinner"
            @click="sendMeme(e)"
            width="55"
            height="55"
          />
        </van-row>
      </van-cell-group>
    </van-row>
  </div>
</template>

<script>
import {
  Toast,
  Notify,
  NavBar,
  Icon,
  Row,
  CellGroup,
  Field,
  Popup,
  Sticky,
  List,
  PullRefresh,
  Cell,
  Image as VanImage
} from "vant";
export default {
  components: {
    [Toast.name]: Toast,
    [Notify.name]: Notify,
    [NavBar.name]: NavBar,
    [Icon.name]: Icon,
    [Row.name]: Row,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Sticky.name]: Sticky,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Cell.name]: Cell,
    [VanImage.name]: VanImage
  },
  data() {
    return {
      loginData: {},
      inputData: {
        uname: "",
        val: ""
      },
      ISsearch: false,
      ISellipsis: true,
      popH: "0",
      // 内容
      dialoguelist: [],
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      // 表情
      meme: [],
      // 标题
      tit: "标题",
      lazyComponent: true
    };
  },
  methods: {
    onClickLeft() {
      Toast("返回");
    },
    onClickRight() {
      Toast("按钮");
    },
    clickLI() {
      Toast("左");
    },
    showPopup() {
      let conData_H = document.getElementById("conData").offsetHeight;
      this.flag = !this.flag;
      if (this.flag) {
        this.popH = "160px";
        document.getElementById("conData").style.height =
          conData_H - 160 + "px";
      } else {
        this.popH = "0";
        document.getElementById("conData").style.height =
          conData_H + 160 + "px";
      }
    },
    // 发送文本
    submit() {
      if (this.inputData.val != "") {
        this.inputData.val = this.wipe_n(this.inputData.val);
        this.$socket.emit("send", this.inputData);
        this.inputData.val = "";
      }
    },
    // 发送表情包
    sendMeme(e) {
      this.inputData.val = `[http://a.zhongtengwang.cn/images/meme/${e}]`;
      this.$socket.emit("send", this.inputData);
      this.inputData.val = "";
    },

    // 输入框获取焦点时
    inpFocus(){
      if(this.popH == "160px"){
        let conData_H = document.getElementById("conData").offsetHeight;
        this.popH = "0";
        document.getElementById("conData").style.height = conData_H + 160 + "px";
      }
    },
    // 去除字符中\n
    wipe_n(str) {
      return str.replace(/(\n*$)/g, "");
    },
    // 取出中括号内的内容
    getBracketStr(str) {
      let result = "";
      if (str.indexOf("[http") != -1) {
        let regex = /\[(.+?)\]/g;
        let option = str.match(regex)[0];
        result = option.substring(1, option.length - 1);
        return result;
      } else {
        return str;
      }
    },
    // 是否为表情包
    ISgif(str) {
      if (str.indexOf("[http") != -1) {
        return true;
      }
    },
    // 自动置底
    zhidi() {
      this.$nextTick(() => {
        let msg = document.getElementById("conData"); // 获取对象
        msg.scrollTop = msg.scrollHeight; // 滚动高度
      });
    }

  },
  mounted() {
    this.$nextTick(() => {
      this.$socket.emit("getDialogue");
      this.$socket.emit("meme");
      this.loginData = JSON.parse(sessionStorage.getItem("loginData"));
      this.inputData.uname = this.loginData.uname;
      document.title = this.loginData.uname;
    });
    document.addEventListener("visibilitychange", function() {
      if (document.visibilityState != "hidden") {
        document.title = JSON.parse(sessionStorage.getItem("loginData")).uname;
      }
    });
  },
  sockets: {
    //查看socket是否渲染成功
    connect() {
      console.log("链接成功");
    },
    //检测socket是否断开链接
    disconnect() {
      console.log("断开链接");
    },
    reconnect() {
      console.log("重新链接");
    },
    //客户端接收后台传输的socket事件
    loadUser(data) {
      if(this.dialoguelist.length != data.length){
        this.dialoguelist = data;
        this.zhidi();
        if (document.visibilityState == "hidden") {
          document.title = this.inputData.uname + " - (您有新消息)";
        }
      }
    },
    meme(data) {
      this.meme = data;
    }
  }
};
</script>

<style rel='stylesheet/scss' lang='scss'>
.win {
  height: 100%;
  .inptVal {
    textarea {
      background-color: #f6f7f9;
      border-radius: 12px;
      padding: 0 20px;
    }
  }
  .pullL {
    float: left;
  }
  #conData {
    height: calc(100% - 46px - 44px);
    overflow: scroll;
  }
  .van-pull-refresh {
    height: 100%;
    overflow: scroll;
  }
  .hhlist {
    background: none;
  }
  .ISimg {
    vertical-align: middle;
  }
  .meme {
    height: 100%;
    padding: 5px;
    flex-flow: row wrap;
    .van-image {
      margin-bottom: 6px;
    }
  }
  #conData,
  .memeBox {
    overflow: auto;
    transition: height 0.5s;
    -moz-transition: height 0.5s;
    -webkit-transition: height 0.5s;
    -o-transition: height 0.5s;
  }
}
</style>