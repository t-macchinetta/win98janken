/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
$(function () {
  'use strict';

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

  if ('serviceWorker' in navigator &&
    (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function (registration) {
        // updatefound is fired if service-worker.js changes.
        registration.onupdatefound = function () {
          // updatefound is also fired the very first time the SW is installed,
          // and there's no need to prompt for a reload at that point.
          // So check here to see if the page is already controlled,
          // i.e. whether there's an existing service worker.
          if (navigator.serviceWorker.controller) {
            // The updatefound event implies that registration.installing is set:
            // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
            var installingWorker = registration.installing;

            installingWorker.onstatechange = function () {
              switch (installingWorker.state) {
                case 'installed':
                  // At this point, the old content will have been purged and the
                  // fresh content will have been added to the cache.
                  // It's the perfect time to display a "New content is
                  // available; please refresh." message in the page's interface.
                  break;

                case 'redundant':
                  throw new Error('The installing ' +
                    'service worker became redundant.');

                default:
                // Ignore
              }
            };
          }
        };
      }).catch(function (e) {
        console.error('Error during service worker registration:', e);
      });
  }

  // Your custom JavaScript goes here

  //勝数をカウントする
  var win_cnt = 0;
  // var time_cnt = 0;
  var interval = 0;

  $('#modal_alert').fadeIn("fast");

  function janken() {
    $('#modal_alert').remove();
    //キーボード操作などにより、オーバーレイが多重起動するのを防止する
    $(this).blur();
    //ボタンからフォーカスを外す
    if ($("#modal_overlay")[0]) return false;
    //新しくモーダルウィンドウを起動しない (防止策1)
    //勝数をカウントする
    //comの手を決める．1-4=グー，5-8=チョキ，9-12=パー
    var num = Math.floor(Math.random() * 11 + 1);
    if (num >= 1 && num <= 3) {
      $('#com').html('グー');
    }
    if (num == 4) {
      $('#com').html('rock');
    }
    if (num >= 5 && num <= 7) {
      $('#com').html('チョキ');
    }
    if (num == 8) {
      $('#com').html('scissors');
    }
    if (num >= 9 && num <= 11) {
      $('#com').html('パー');
    }
    if (num == 12) {
      $('#com').html('paper');
    }
    //乱数によってボタンの配置を変える
    if (num == 1 || num == 6 || num == 10) {
      $('.flex').css('flex-direction', 'row-reverse');
    } else {
      $('.flex').css('flex-direction', 'row');
    }

    //時々チョキが先頭に来る
    if (num == 3 || num == 7 || num == 11) {
      $('.flex_item:nth-child(1)').css('order', '1');
    } else {
      $('.flex_item:nth-child(1)').css('order', '0');
    }

    //オーバーレイを出現させる
    $('body').append('<div id="modal_overlay"></div>');
    $('#modal_overlay').fadeIn('fast');

    //コンテンツをセンタリングする
    centeringModalSyncer();

    //コンテンツをフェードインする
    $('#modal_content').fadeIn('fast');

    //[グー]をクリックしたら…
    $('#zero').unbind().click(function () {
      //comがチョキのとき勝数をカウントする
      if (num >= 5 && num <= 8) {
        win_cnt++;
        $('#result').html(win_cnt);
        $('#modal_content').fadeOut('fast');
      }
      //[#modal-content]と[#modal-overlay]をフェードアウトした後に…
      $('#modal_content,#modal_overlay').fadeOut('fast', function () {
        //[#modal-overlay]を削除する
        $('#modal_overlay').remove();
      });
    });

    //[チョキ]をクリックしたら…
    $('#two').unbind().click(function () {
      //comがパーのとき勝数をカウントする
      if (num >= 9 && num <= 12) {
        win_cnt++;
        $('#result').html(win_cnt);
      }
      //[#modal-content]と[#modal-overlay]をフェードアウトした後に…
      $('#modal_content,#modal_overlay').fadeOut('fast', function () {
        //[#modal-overlay]を削除する
        $('#modal_overlay').remove();
      });
    });

    //[パー]をクリックしたら…
    $('#five').unbind().click(function () {
      //comがグーのとき勝数をカウントする
      if (num >= 1 && num <= 4) {
        win_cnt++;
        $('#result').html(win_cnt);
      }
      //[#modal-content]と[#modal-overlay]をフェードアウトした後に…
      $('#modal_content,#modal_overlay').fadeOut('fast', function () {
        //[#modal-overlay]を削除する
        $('#modal_overlay').remove();
      });
    });
  }

  //    ウィンドウを出現させるクリックイベント
  $('#modal_open').on('click', function () {
    $('#modal_alert').remove();
    //じゃんけん関数を100ms毎に繰り返す
    interval = setInterval(function () {
      janken();
    }, 100);
    //指定秒後に処理を終了し，指定した勝数によって勝敗を決める
    setTimeout(function () {
      clearInterval(interval);
      if (win_cnt >= 3) {
        $('#modal_content').remove();
        $('#modal_overlay').remove();
        $('#win').fadeIn('fast');
        win_cnt = 0;
      } else {
        $('#modal_content').remove();
        $('#modal_overlay').remove();
        $('#lose').fadeIn('fast');
        win_cnt = 0;
      }
    }, 20000);
  });
  //勝った場合はOK押下時にページを更新
  $('#exit').on('click', function () {
    $('#win').remove();
    location.reload(true);
  });
  //負けた場合はOK押下時に背景画像表示
  $('#dead').on('click', function () {
    $('#lose').remove();
    $('#bs').css('display', 'inherit');
  });

  //リサイズされたら、センタリングをする関数[centeringModalSyncer()]を実行する
  $(window).resize(centeringModalSyncer);

  //センタリングを実行する関数
  function centeringModalSyncer() {
    //画面(ウィンドウ)の幅、高さを取得
    var w = $(window).width();
    var h = $(window).height();
    // コンテンツ(#modal-content)の幅、高さを取得
    var cw = $("#modal_content").outerWidth();
    var ch = $("#modal_content").outerHeight();
    var aw = $("#modal_alert").outerWidth();
    var ah = $("#modal_alert").outerHeight();
    //配置の乱数を取得
    var rand_w = Math.floor(Math.random() * (w - cw));
    var rand_h = Math.floor(Math.random() * (h - ch));
    //ランダムな位置に配置する
    $('#modal_content').css({
      'left': rand_w + "px",
      'top': rand_h + "px"
    });
  }

});
