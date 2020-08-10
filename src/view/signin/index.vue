<template>
  <div class="signin">
    <van-notice-bar
      color="#1989fa"
      background="#ecf9ff"
      left-icon="info-o"
    >您所填写的信息，仅用于您的身份判定，他人无法查阅，请放心填写。</van-notice-bar>
    <van-row type="flex" justify="center" align="center" style="height:100%">
      <div class="box">
        <van-field v-model="signinData.uname" label="昵称" class="inp" />
        <van-field v-model="signinData.password" type="password" label="密码" class="inp" />
        <van-field
          v-model="passwords"
          type="password"
          label="确认密码"
          :error="ISerr"
          :error-message="tishi"
          @input="PWverify"
          class="inp"
        />
        <van-field v-model="signinData.name" label="真是姓名" class="inp" />
        <van-field
          v-model="signinData.phone"
          type="tel"
          label="手机号码"
          :error="ISerrs"
          :error-message="tishis"
          @input="PHONEverify($event)"
          class="inp"
        />
        <van-button size="small" type="primary" round @click="signin">注册</van-button>
      </div>
    </van-row>
  </div>
</template>

<script>
import { Row, Field, Button, Icon, CellGroup, Notify, NoticeBar } from "vant";
import axios from "axios";

export default {
  components: {
    [Row.name]: Row,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Notify.Component.name]: Notify.Component,
    [NoticeBar.name]: NoticeBar
  },
  data() {
    return {
      signinData: {
        uname: "",
        password: "",
        name: "",
        phone: ""
      },
      passwords: "",
      tishi: "",
      ISerr: false,
      tishis: "",
      ISerrs: false,
    };
  },
  methods: {
    signin() {
      if (this.ISPW()) {
        this.$socket.emit("signin", this.signinData);
      } else {
        Notify({
          type: "warning",
          message: "失败",
          duration: 2000
        });
      }
    },
    PWverify() {
      if (this.ISPW()) {
        this.ISerr = false;
        this.tishi = "";
      } else {
        this.ISerr = true;
        this.tishi = "密码不一致";
      }
    },
    ISPW() {
      if (this.passwords === this.signinData.password) {
        return true;
      } else {
        return false;
      }
    },
    PHONEverify(e){
      if(/^1[3456789]\d{9}$/.test(e)){
        this.ISerrs = false;
        this.tishis = "";
      }else{
        this.ISerrs = true;
        this.tishis = "号码格式错误";
      }
    }
  },
  mounted() {
    this.$nextTick(() => {});
  },
  sockets: {
    //查看socket是否渲染成功
    connect() {
      console.log("链接成功");
    },
    //检测socket断开链接
    disconnect() {
      console.log("断开链接");
    },
    reconnect() {
      console.log("重新链接");
    },
    //客户端接收后台传输的socket事件
    signin(data) {
      if (data == "成功") {
        sessionStorage.setItem("loginData", JSON.stringify(this.signinData));
        this.$router.push({ path: "/win" });
      } else {
        Notify({
          type: "warning",
          message: data,
          duration: 2000
        });
      }
    }
  }
};
</script>

<style rel='stylesheet/scss' lang='scss'>
.signin {
  height: 100%;
  background: #fff;
  .box {
    text-align: center;
    width: 70%;
  }
  .inp {
    background: #f2f3f7;
    border-radius: 2em;
    margin-bottom: 20px;
  }
  .ico {
    font-size: 20px;
  }
  .van-notice-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .tishi {
    color: #dd4f42;
    font-size: 12px;
  }
}
</style>