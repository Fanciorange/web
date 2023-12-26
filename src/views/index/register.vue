<template>
  <div class="container">

    <div class="tel-regist-page pc-style">
      <div class="regist-title">
        <span>注册新账号</span>
        <span @click="router.push({name:'login'})" class="toWxLogin">我要登录</span>
      </div>

      <div class="regist-padding">
        <div class="common-input">
          <img :src="MailIcon" class="left-icon">
          <div class="input-view">
            <input placeholder="请输入邮箱" v-model="tData.loginForm.email" type="text" class="input">
            <p class="err-view">
            </p>
          </div>
          <div class="send-code-btn">
            <button @click="sendVerificationCode" :disabled="countdownRunning || !tData.loginForm.email" class="code-btn">{{ countdownText }}</button>
          </div>
        </div>
        <div class="common-input" >
          <img :src="VerificationCodeIcon" class="left-icon">
          <div class="input-view">
            <input placeholder="请输入验证码" v-model="tData.loginForm.verificationCode" type="text" class="input">
            <p class="err-view"></p>
          </div>
        </div>
      </div>
      <div class="regist-padding">
        <div class="common-input">
          <img :src="PwdIcon" class="left-icon">
          <div class="input-view">
            <input placeholder="请输入密码" v-model="tData.loginForm.password" type="password" class="input">
            <p class="err-view">
            </p>
          </div>
        </div>
      </div>
      <div class="regist-padding">
        <div class="common-input">
          <img :src="PwdIcon" class="left-icon">
          <div class="input-view">
            <input placeholder="请再次输入密码" v-model="tData.loginForm.repassword" type="password" class="input">
            <p class="err-view">
            </p>
          </div>
        </div>
      </div>
      <div class="tel-login">
        <div class="next-btn-view">
          <button class="next-btn" @click="handleRegister">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {userRegisterApi,sendVerificationCodeApi} from '/@/api/index/user'
import {message} from "ant-design-vue";
import MailIcon from '/@/assets/images/mail-icon.svg';
import PwdIcon from '/@/assets/images/pwd-icon.svg';
import  VerificationCodeIcon from '/@/assets/images/verificationCodeIcon.svg'
const router = useRouter();

const tData = reactive({
  loginForm: {
    email: '',
    password: '',
    repassword: '',
    verificationCode: ''
  }
})
let countdownRunning = ref(false);
let countdownSeconds = ref(60);
let countdownInterval;
let countdownText = ref('发送验证码');
const handleRegister = () => {
  console.log('login')
  if(tData.loginForm.email === ''
    || tData.loginForm.password === ''
    || tData.loginForm.repassword === ''||tData.loginForm.verificationCode===''){
    message.warn('不能为空！')
    return;
  }

  userRegisterApi({
    email: tData.loginForm.email,
    password: tData.loginForm.password,
    repassword: tData.loginForm.repassword,
    code: tData.loginForm.verificationCode
  }).then(res => {
    message.success('注册成功！')
    router.push({name: 'login'})
  }).catch(err => {
    message.error(err.msg || '注册失败')
  })
}



const sendVerificationCode = () => {
  if (!tData.loginForm.email) {
    message.warn('邮箱不能为空！');
    return;
  }

  countdownRunning.value = true;
  countdownText.value = '发送验证码';

  sendVerificationCodeApi({email: tData.loginForm.email})
      .then(() => {
        message.success('验证码已发送成功！');
        startCountdown();
      })
      .catch((err) => {
        message.error(err.msg || '发送验证码失败，请稍后再试');
        countdownRunning.value = false;
      });
};

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    countdownSeconds.value--;

    if (countdownSeconds.value > 0) {
      countdownText.value = `重新发送(${countdownSeconds.value})`;
    } else {
      clearInterval(countdownInterval);
      countdownRunning.value = false;
      countdownSeconds.value = 60;
      countdownText.value = '发送验证码';
    }
  }, 1000);
};



</script>




<style scoped lang="less">
div {
  display: block;
}

*, :after, :before, img {
  border-style: none;
}

*, :after, :before {
  border-width: 0;
  border-color: #dae1e7;
}

.container {
  max-width: 100%;
  //background: #142131;
  background-image: url('../images/admin-login-bg.jpg');
  background-size: cover;
  object-fit: cover;
  height: 100vh;
  overflow: hidden;
  display:flex;
  justify-content: center;
  align-items:center;
}

.pc-style {
  position: relative;
  width: 400px;
  height: 464px;
  background: #fff;
  -webkit-box-shadow: 2px 2px 6px #aaa;
  box-shadow: 2px 2px 6px #aaa;
  border-radius: 4px;
}

.tel-regist-page {
  overflow: hidden;

  .regist-title {
    font-size: 14px;
    color: #1e1e1e;
    font-weight: 500;
    height: 24px;
    line-height: 24px;
    margin: 40px 0;
    padding: 0 28px;

    .toWxLogin {
      color: #3d5b96;
      float: right;
      cursor: pointer;
    }
  }

  .regist-padding {
    padding: 0 28px;
    margin-bottom: 8px;
  }
}

.common-input {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: flex-start;

  .left-icon {
    margin-right: 12px;
    width: 24px;
  }

  .input-view {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;

    .input {
      font-weight: 500;
      font-size: 14px;
      color: #1e1e1e;
      height: 26px;
      line-height: 26px;
      padding: 0;
      display: block;
      width: 100%;
      letter-spacing: 1.5px;
      outline: none; // 去掉边框线
    }

    .err-view {
      margin-top: 4px;
      height: 16px;
      line-height: 16px;
      font-size: 12px;
      color: #f62a2a;
    }
  }
}

.tel-login {
  padding: 0 28px;
}

.next-btn {
  background: #3d5b96;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  line-height: 40px;
  text-align: center;
  width: 100%;
  outline: none;
  cursor: pointer;
}

</style>
