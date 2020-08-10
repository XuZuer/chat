<template>
  <div class="login">
    <van-row type="flex" justify="center" align="center" style="height:100%">
      <div class="box">
        <van-field v-model="loginData.uname" label="昵称" class="inp" />
        <van-field v-model="loginData.password" type="password" label="密码" class="inp" />
        <van-button round size="small" type="primary" class="btn" @click="login">
          <span class="ico icon-V" style="color:#fff"></span>
        </van-button>
      </div>
    </van-row>
    <van-row class="signin">
      <router-link to="/signin">用户注册</router-link>
    </van-row>
  </div>
</template>

<script>
import { Row, Field, Button, Icon, CellGroup, Notify } from "vant";
import axios from "axios";

export default {
  components: {
    [Row.name]: Row,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Notify.Component.name]: Notify.Component
  },
  data() {
    return {
      loginData: {
        uname: "",
        password: "",
      },
    };
  },
  methods: {
    login() {
      this.$socket.emit("login", this.loginData);
    }
  },
  mounted() {
    this.$nextTick(() => {

    });
  },
  created() {
    // 监听后台事件
    // this.sockets.listener.subscribe('message', (data) => {
    //   console.log(data) // 能执行
    // })
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
    login(data) {
      if (data.msg == 1) {
        sessionStorage.setItem("loginData", JSON.stringify(this.loginData));
        this.$router.push({ path: "/win" });
      } else {
        Notify({
          type: "warning",
          message: data,
          duration: 2000
        });
      }
    },
    
  }
};
</script>

<style rel='stylesheet/scss' lang='scss'>
.login {
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
  .btn {
    height: 38px;
  }
  .signin{
    height: 20px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 6px;
    a{
      color: #1989fa;
    }
  }
}
</style>