/* ============================================================
   TRAIN TRIP 中文本地版 — 应用逻辑
   纯本地运行：印章收集存 localStorage，无任何账号/登录/API
   ============================================================ */
(function () {
  "use strict";

  var KEY = "traintrip_cn_stamps_v1";

  /* ---------- 本地集章 ---------- */
  function loadStamps() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveStamps(map) {
    localStorage.setItem(KEY, JSON.stringify(map));
  }
  function addStamp(id, extra) {
    var m = loadStamps();
    if (!m[id]) {
      m[id] = { t: Date.now(), s: (extra && extra.source) || "station" };
      saveStamps(m);
    }
    return m[id];
  }
  function removeStamp(id) {
    var m = loadStamps();
    if (m[id]) { delete m[id]; saveStamps(m); }
  }
  function hasStamp(id) { return !!loadStamps()[id]; }
  function countStamps() { return Object.keys(loadStamps()).length; }

  /* ---------- 数据加载（fetch 本地 JSON） ---------- */
  var _cache = {};
  function loadJSON(url) {
    if (_cache[url]) return Promise.resolve(_cache[url]);
    return fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      _cache[url] = d; return d;
    });
  }

  /* ---------- 公司名/区域中文 ---------- */
  var GROUP_CN = {
    "JR北海道": "JR北海道", "JR東日本": "JR东日本", "JR東海": "JR东海",
    "JR西日本": "JR西日本", "JR四国": "JR四国", "JR九州": "JR九州"
  };
  var AREA_CN = {
    "北海道": "北海道", "東北・関東": "东北・关东", "中部": "中部",
    "近畿": "近畿", "中国・四国": "中国・四国", "九州": "九州"
  };

  /* ---------- 站点收集交互：点击收集/取消 ---------- */
  function bindCollectButtons(root) {
    var rootEl = root || document;
    rootEl.querySelectorAll("[data-collect]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var id = btn.getAttribute("data-collect");
        var name = btn.getAttribute("data-name") || "";
        if (hasStamp(id)) {
          removeStamp(id);
          btn.classList.remove("got");
          btn.textContent = btn.getAttribute("data-label") || "未获得";
          if (btn.dataset.cb) window[btn.dataset.cb] && window[btn.dataset.cb]();
        } else {
          addStamp(id);
          btn.classList.add("got");
          btn.textContent = "已获得";
          if (btn.dataset.cb) window[btn.dataset.cb]();
        }
        window.dispatchEvent(new CustomEvent("stampchange", { detail: { id: id } }));
      });
    });
  }

  /* ---------- 站点名称显示（保留原名 + 简化处理） ---------- */
  function stationLabel(name) {
    if (!name) return "";
    return name.replace(/駅$/, "站");
  }

  window.TT = {
    loadStamps: loadStamps, saveStamps: saveStamps, addStamp: addStamp,
    removeStamp: removeStamp, hasStamp: hasStamp, countStamps: countStamps,
    loadJSON: loadJSON, GROUP_CN: GROUP_CN, AREA_CN: AREA_CN,
    bindCollectButtons: bindCollectButtons, stationLabel: stationLabel
  };
})();
