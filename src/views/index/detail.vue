<template>
  <div class="detail">
    <Header />

    <div class="detail-content">
      <div class="detail-content-top">
        <div style="position: relative">
          <div class="thing-infos-view">
            <div class="thing-infos">
              <!--              <video :src="'http://192.168.101.134:9000/pic/6.mp4'" width="800" height="500" controls autoplay style="background-color: #000">-->

              <!--              </video>-->
              <video
                crossOrigin="anonymous"
                width="800"
                height="500"
                controls
                v-if="detailData && detailData.vediourl && detailData.vtturl"
                autoplay
                style="background-color: #000"
              >
                <source :src="detailData.vediourl" type="video/mp4" />
                <track kind="captions" :src="detailData.vtturl" srclang="zh-CN" label="中文" default />
                Your browser does not support the video tag.
              </video>

              <!--              <video id="player" playsinline controls data-poster="http://192.168.101.134:9000/pic/1.png">-->
              <!--                <source src="http://192.168.101.134:9000/pic/6.mp4" type="video/mp4" />-->

              <!--                &lt;!&ndash; Captions are optional &ndash;&gt;-->
              <!--                <track kind="captions" label="English captions" src="http://localhost:3001/pic/NQLc7UoVDo8A.vtt" srclang="zh-CN" default />-->
              <!--              </video>-->

              <div class="container">
                <div class="title">{{ detailData.title }}</div>
                <div class="sum" @click="showPopup"><a>AI视频总结</a></div>
              </div>
              <div class="meta">{{ detailData.pv }}次观看</div>
              <div class="desc">简介：{{ detailData.description }}</div>
            </div>

            <div v-if="isPopupVisible" class="popup">
              <div class="popup-content">
                <div class="popup-header">
                  <span class="popup-close" @click="closePopup">×</span>
                </div>
                <div class="popup-body" >
                  <p>{{summary}}}</p>
                </div>
              </div>
            </div>

            <div class="thing-counts hidden-sm">
              <div class="count-item flex-view pointer" @click="collect()">
                <div class="count-img">
                  <img :src="RecommendIcon" />
                </div>
                <div class="count-box flex-view">
                  <div class="count-text-box">
                    <span class="count-title">收藏</span>
                  </div>
                  <div class="count-num-box">
                    <span class="num-text">{{ detailData.collect_count }}</span>
                  </div>
                </div>
              </div>
              <div class="count-item flex-view pointer" @click="addToWish()">
                <div class="count-img">
                  <img :src="WantIcon" />
                </div>
                <div class="count-box flex-view">
                  <div class="count-text-box">
                    <span class="count-title">喜欢</span>
                  </div>
                  <div class="count-num-box">
                    <span class="num-text">{{ detailData.wish_count }}</span>
                  </div>
                </div>
              </div>
              <div class="count-item flex-view" @click="share()">
                <div class="count-img">
                  <img :src="ShareIcon" />
                </div>
                <div class="count-box flex-view">
                  <div class="count-text-box">
                    <span class="count-title">分享</span>
                  </div>
                  <div class="count-num-box">
                    <span class="num-text"></span>
                    <img :src="WeiboShareIcon" class="mg-l" />
                  </div>
                </div>
              </div>
              <div style="margin-top: 24px" v-if="adData">
                <!--广告区域-->
                <img style="width: 250px; height: 100px; background-size: cover; object-fit: cover" src="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-content-bottom">
        <div class="thing-content-view flex-view">
          <div class="main-content">
            <div class="order-view main-tab">
              <span
                class="tab"
                :class="selectTabIndex === index ? 'tab-select' : ''"
                v-for="(item, index) in tabData"
                :key="index"
                @click="selectTab(index)"
              >
                {{ item }}
              </span>
            </div>

            <!--评论-->
            <div class="thing-comment">
              <div class="title">发表新的评论</div>
              <div class="publish flex-view">
                <img :src="AvatarIcon" class="mine-img" />
                <input placeholder="说点什么..." class="content-input" ref="commentRef" />
                <button class="send-btn" @click="sendComment()">发送</button>
              </div>
              <div class="tab-view flex-view">
                <div class="count-text">共有{{ commentData.length }}条评论</div>
                <div class="tab-box flex-view" v-if="commentData.length > 0">
                  <span :class="sortIndex === 0 ? 'tab-select' : ''" @click="sortCommentList('recent')">最新</span>
                  <div class="line"></div>
                  <span :class="sortIndex === 1 ? 'tab-select' : ''" @click="sortCommentList('hot')">热门</span>
                </div>
              </div>
              <div class="comments-list">
                <div class="comment-item" v-for="item in commentData">
                  <div class="flex-item flex-view">
                    <img :src="AvatarIcon" class="avator" />
                    <div class="person">
                      <div class="name">{{ item.username }}</div>
                      <div class="time">{{ item.comment_time }}</div>
                    </div>
                    <div class="float-right">
                      <span @click="like(item.id)">推荐</span>
                      <span class="num">{{ item.like_count }}</span>
                    </div>
                  </div>
                  <p class="comment-content">{{ item.content }}</p>
                </div>
                <div class="infinite-loading-container">
                  <div class="infinite-status-prompt" style="">
                    <div slot="no-results" class="no-results">
                      <div></div>
                      <p>没有更多了</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="recommend" style="">
            <div class="title">热门推荐</div>
            <div class="things">
              <div v-for="item in recommendData" :key="item.id" @click="handleDetail(item)" class="thing-item item-column-3"
                ><!---->
                <div class="img-view">
                  <img :src="item.picurl" />
                  <div style="position: absolute; left: 10px; bottom: 10px">
                    <img :src="PlayIcon" style="width: 30px; height: 30px" />
                  </div>
                </div>
                <div class="info-view">
                  <h3 class="thing-name">{{ item.title }}</h3>
                  <span style="color: #444; font-size: 11px; height: 11px">{{ item.createTime.substring(0, 10) }}</span>
                  <br />
                  <span style="color: #444; font-size: 11px; height: 11px">{{ item.pv }}次观看</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>
<script setup>
import axios from 'axios';
import { message } from 'ant-design-vue';
import Header from '/@/views/index/components/header.vue';
import Footer from '/@/views/index/components/footer.vue';
import AddIcon from '/@/assets/images/add.svg';
import WantIcon from '/@/assets/images/want-read-hover.svg';
import RecommendIcon from '/@/assets/images/recommend-hover.svg';
import ShareIcon from '/@/assets/images/share-icon.svg';
import WeiboShareIcon from '/@/assets/images/wb-share.svg';
import AvatarIcon from '/@/assets/images/avatar.jpg';
import PlayIcon from '/@/assets/images/Play.png';

import { detailApi, listApi as listThingList } from '/@/api/index/thing';
import { listThingCommentsApi, createApi as createCommentApi, likeApi } from '/@/api/index/comment';
import { addWishUserApi } from '/@/api/index/thing';
import { addCollectUserApi } from '/@/api/index/thing';
import { BASE_URL } from '/@/store/constants';
import { useRoute, useRouter } from 'vue-router/dist/vue-router';
import { useUserStore } from '/@/store';
import { getFormatTime } from '/@/utils';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

let adData = ref();

let thingId = ref('');
let detailData = ref({});
let tabUnderLeft = ref(6);
let tabData = ref(['评论']);
let selectTabIndex = ref(0);
let summary = ref('这是一个AI生成的总结内容');
let commentData = ref([]);
let recommendData = ref([]);
let sortIndex = ref(0);
let order = ref('recent'); // 默认排序最新

let isPopupVisible = ref(false);

let commentRef = ref();

onMounted(() => {
  thingId.value = route.query.id.trim();
  getThingDetail();
  getRecommendThing();
  getCommentList();
});

const showPopup = () => {
  isPopupVisible.value = true;
};
const closePopup = () => {
  isPopupVisible.value = false;
};
const selectTab = (index) => {
  selectTabIndex.value = index;
  tabUnderLeft.value = 6 + 54 * index;
};
const getThingDetail = async () => {
  detailApi({id: thingId.value})
      .then(async (res) => {
        detailData.value = res.data;
        summary =detailData.value.summaryurl
        const response = await axios.get(detailData.value.summaryurl);
        summary= response.data;
      })
      .catch((err) => {
        message.error('获取详情失败');
      });

};


const addToWish = () => {
  let userid = userStore.user_id;
  if (userid) {
    addWishUserApi({ thingId: thingId.value, userid: id })
      .then((res) => {
        message.success(res.msg);
        getThingDetail();
      })
      .catch((err) => {
        console.log('操作失败');
      });
  } else {
    message.warn('请先登录');
  }
};
const collect = () => {
  let userid = userStore.user_id;
  if (userid) {
    addCollectUserApi({ thingId: thingId.value, userid: userid })
      .then((res) => {
        message.success(res.msg);
        getThingDetail();
      })
      .catch((err) => {
        console.log('收藏失败');
      });
  } else {
    message.warn('请先登录');
  }
};
const share = () => {
  let content = '分享一个非常好玩的网站 ' + window.location.href;
  let shareHref = 'http://service.weibo.com/share/share.php?title=' + content;
  window.open(shareHref);
};
const handleOrder = (detailData) => {
  console.log(detailData);
  const userId = userStore.user_id;
  router.push({
    name: 'confirm',
    query: {
      id: detailData.id,
      title: detailData.title,
      cover: detailData.cover,
      price: detailData.price,
    },
  });
};
const getRecommendThing = () => {
  listThingList({ sort: 'recommend' })
    .then((res) => {
      res.data.forEach((item, index) => {
        if (item.cover) {
          item.cover = BASE_URL + item.cover;
        }
      });
      console.log(res);
      recommendData.value = res.data.slice(0, 6);
    })
    .catch((err) => {
      console.log(err);
    });
};
const handleDetail = (item) => {
  // 跳转新页面
  let text = router.resolve({ name: 'detail', query: { id: item.id } });
  window.open(text.href, '_blank');
};
const sendComment = () => {
  console.log(commentRef.value);
  let text = commentRef.value.value.trim();
  console.log(text);
  if (text.length <= 0) {
    return;
  }
  commentRef.value.value = '';
  let userId = userStore.user_id;
  if (userId) {
    createCommentApi({ content: text, vedioid: thingId.value, userid: userId })
      .then((res) => {
        getCommentList();
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    message.warn('请先登录！');
    router.push({ name: 'login' });
  }
};
const like = (commentId) => {
  likeApi({ commentId: commentId })
    .then((res) => {
      getCommentList();
    })
    .catch((err) => {
      console.log(err);
    });
};
const getCommentList = () => {
  listThingCommentsApi({ thingId: thingId.value, order: order.value })
    .then((res) => {
      commentData.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};
const sortCommentList = (sortType) => {
  if (sortType === 'recent') {
    sortIndex.value = 0;
  } else {
    sortIndex.value = 1;
  }
  order.value = sortType;
  getCommentList();
};
</script>
<style scoped lang="less">
.hide {
  display: none;
}

.detail-content {
  display: flex;
  flex-direction: column;
  width: 1100px;
  margin: 4px auto;
}

.flex-view {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.hidden-lg {
  display: none !important;
}

.thing-infos-view {
  display: flex;
  margin: 89px 0 16px;
  overflow: hidden;

  .thing-infos {
    flex: 1;
    display: flex;
    flex-direction: column;

    .container {
      display: flex;
      justify-content: space-between;
    }

    .title {
      margin-top: 16px;
      font-size: 24px;
      font-weight: 400;
      color: #1e1e1e;
    }

    .sum {
      margin-top: 22px;
      font-size: 16px;
      font-weight: 400;
      color: #1e1e1e;
      margin-right: 55px;
    }

    .meta {
      font-size: 12px;
      color: #1e1e1e;
    }

    .desc {
      width: 800px;
      margin-top: 10px;
      font-size: 14px;
      color: #1e1e1e;
    }
  }

  .mobile-share-box {
    height: 38px;
    background: transparent;
    padding: 0 16px;
    margin: 12px 0;
    font-size: 0;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;

    .state {
      width: 64px;
      height: 24px;
      line-height: 24px;
      background: rgba(70, 132, 226, 0.1);
      border-radius: 2px;
      font-weight: 500;
      font-size: 12px;
      color: #4684e2;
      text-align: center;
    }

    .share-img {
      background: #fff;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      text-align: center;

      img {
        position: relative;
        top: 4px;
        width: 24px;
      }
    }
  }

  .thing-img-box {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 235px;
    flex: 0 0 235px;
    margin: 0 40px 0 0;

    img {
      width: 200px;
      height: 186px;
      display: block;
    }
  }

  .thing-info-box {
    text-align: left;
    padding: 0;
    margin: 0;
  }

  .thing-state {
    height: 26px;
    line-height: 26px;

    .state {
      font-weight: 500;
      color: #4684e2;
      background: rgba(70, 132, 226, 0.1);
      border-radius: 2px;
      padding: 5px 8px;
      margin-right: 16px;
    }

    span {
      font-size: 14px;
      color: #152844;
    }
  }

  .thing-name {
    line-height: 32px;
    margin: 16px 0;
    color: #0f1111 !important;
    font-size: 15px !important;
    font-weight: 400 !important;
    font-style: normal !important;
    text-transform: none !important;
    text-decoration: none !important;
  }

  .translators,
  .authors {
    line-height: 18px;
    font-size: 14px;
    margin: 8px 0;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    -webkit-box-pack: start;
    -ms-flex-pack: start;
    justify-content: flex-start;

    .name {
      color: #315c9e;
      white-space: normal;
    }
  }

  .tags {
    position: absolute;
    bottom: 20px;
    margin-top: 16px;

    .category-box {
      color: #152844;
      font-size: 14px;

      .title {
        color: #787878;
      }
    }
  }

  .thing-counts {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 235px;
    flex: 0 0 235px;
    margin-left: 20px;
  }

  .pointer {
    cursor: pointer;
  }

  .count-item {
    height: 64px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    cursor: pointer;
  }

  .count-img {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 32px;
    flex: 0 0 32px;
    margin-right: 24px;
    font-size: 0;

    img {
      width: 100%;
      display: block;
    }
  }

  .count-box {
    position: relative;
    border-bottom: 1px solid #cedce4;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    height: 100%;
  }

  .count-text-box {
    font-size: 0;

    .count-title {
      color: #152844;
      font-weight: 600;
      font-size: 16px;
      line-height: 18px;
      display: block;
      height: 18px;
    }
  }

  .count-num-box {
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: #152844;
  }
}

.buy-btn {
  cursor: pointer;
  display: block;
  background: #4684e2;
  border-radius: 4px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  width: 110px;
  outline: none;
  border: none;
  margin-top: 18px;
}

.buy-btn img {
  width: 12px;
  margin-right: 2px;
  vertical-align: middle;
}

.buy-btn span {
  vertical-align: middle;
}

.buy-way {
  overflow: hidden;

  .title {
    font-weight: 600;
    font-size: 18px;
    height: 26px;
    line-height: 26px;
    color: #152844;
    margin-bottom: 12px;
  }
}

.thing-content-view {
  margin-top: 4px;
  padding-bottom: 50px;
}

.main-content {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  padding-right: 16px;

  .text {
    color: #484848;
    font-size: 16px;
    line-height: 26px;
    padding-left: 12px;
    margin: 11px 0;
    white-space: pre-wrap;
  }
}

.main-tab {
  border-bottom: 1px solid #cedce4;
}

.order-view {
  position: relative;
  color: #6c6c6c;
  font-size: 14px;
  line-height: 40px;

  .title {
    margin-right: 8px;
  }

  .tab {
    margin-right: 20px;
    cursor: pointer;
    color: #5f77a6;
    font-size: 16px;
    cursor: pointer;
  }

  .tab-select {
    color: #152844;
    font-weight: 600;
  }

  .tab-underline {
    position: absolute;
    bottom: 0;
    left: 84px;
    width: 16px;
    height: 4px;
    background: #4684e2;
    -webkit-transition: left 0.3s;
    transition: left 0.3s;
  }
}

.recommend {
  -webkit-box-flex: 0;
  -ms-flex: 0 0 235px;
  flex: 0 0 235px;
  margin-left: 20px;
  margin-top: -400px;

  .title {
    font-weight: 600;
    font-size: 18px;
    line-height: 26px;
    color: #152844;
    margin-bottom: 12px;
  }

  .things {
    border-top: 1px solid #cedce4;

    .thing-item {
      min-width: 250px;
      max-width: 250px;
      position: relative;
      flex: 1;
      margin-right: 20px;
      height: fit-content;
      overflow: hidden;
      margin-top: 26px;
      margin-bottom: 36px;
      cursor: pointer;
      box-shadow: 4px 4px 4px rgba(200, 200, 200, 0.3), -4px 4px 4px rgba(200, 200, 200, 0.3);

      .img-view {
        //text-align: center;
        position: relative;
        height: 160px;
        width: 250px;

        img {
          height: 160px;
          width: 250px;
          margin: 0 auto;
          background-size: cover;
          object-fit: cover;
        }
      }

      .info-view {
        //background: #f6f9fb;
        overflow: hidden;
        padding: 16px 16px;

        .thing-name {
          line-height: 32px;
          color: #0f1111;
          font-size: 20px;
        }

        .price {
          color: #ff7b31;
          font-size: 20px;
          line-height: 20px;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .translators {
          color: #6f6f6f;
          font-size: 12px;
          line-height: 14px;
          margin-top: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.flex-view {
  display: flex;
}

.thing-comment {
  .title {
    font-weight: 600;
    font-size: 14px;
    line-height: 22px;
    height: 22px;
    color: #152844;
    margin: 24px 0 12px;
  }

  .publish {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    .mine-img {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 40px;
      flex: 0 0 40px;
      margin-right: 12px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
    }

    .content-input {
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      background: #f6f9fb;
      border-radius: 4px;
      height: 32px;
      line-height: 32px;
      color: #484848;
      padding: 5px 12px;
      white-space: nowrap;
      outline: none;
      border: 0px;
    }

    .send-btn {
      margin-left: 10px;
      background: #4684e2;
      border-radius: 4px;
      -webkit-box-flex: 0;
      -ms-flex: 0 0 80px;
      flex: 0 0 80px;
      color: #fff;
      font-size: 14px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      outline: none;
      border: 0px;
      cursor: pointer;
    }
  }

  .tab-view {
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    font-size: 14px;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    margin: 24px 0;

    .count-text {
      color: #484848;
      float: left;
    }

    .tab-box {
      color: #5f77a6;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;

      .tab-select {
        color: #152844;
      }

      span {
        cursor: pointer;
      }
    }

    .line {
      width: 1px;
      height: 12px;
      margin: 0 12px;
      background: #cedce4;
    }
  }
}

.comments-list {
  .comment-item {
    .flex-item {
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      padding-top: 16px;

      .avator {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 40px;
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        margin-right: 12px;
        border-radius: 50%;
        cursor: pointer;
      }

      .person {
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .name {
        color: #152844;
        font-weight: 600;
        font-size: 14px;
        line-height: 22px;
        height: 22px;
        cursor: pointer;
      }

      .time {
        color: #5f77a6;
        font-size: 12px;
        line-height: 16px;
        height: 16px;
        margin-top: 2px;
      }

      .float-right {
        color: #4684e2;
        font-size: 14px;
        float: right;

        span {
          margin-left: 19px;
          cursor: pointer;
        }

        .num {
          color: #152844;
          margin-left: 6px;
          cursor: auto;
        }
      }
    }
  }
}

.comment-content {
  margin-top: 8px;
  color: #484848;
  font-size: 14px;
  line-height: 22px;
  padding-bottom: 16px;
  border-bottom: 1px dashed #cedce4;
  margin-left: 52px;
  overflow: hidden;
  word-break: break-word;
}

.infinite-loading-container {
  clear: both;
  text-align: center;
}

.a-price-symbol {
  top: -0.5em;
  font-size: 12px;
}

.a-price {
  color: #0f1111;
  font-size: 21px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background: #fff;
  padding: 20px;
  max-width: 400px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.popup-header {
  display: flex;
  justify-content: flex-end;
}

.popup-close {
  cursor: pointer;
}

.popup-body {
  margin-top: 10px;
}
</style>
