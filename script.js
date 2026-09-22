'use strict';

/* =========================================================================
 * 보평초 등굣길 신호등
 *
 * 원본 데이터: Trafic.xlsx "등교 시간" 시트
 * 좌표는 Google Earth DMS 형식 그대로 두고 아래 dmsToDecimal()에서
 * 십진수로 변환한다. (WGS84 → OSM/Leaflet과 좌표계 동일)
 *
 * events: [하루 기준 초(0~86399), 그 시각부터 시작되는 상태]
 *         날짜는 무시하고 시:분:초만 비교한다.
 * ========================================================================= */

var SITES = [
  {
    name: "보평초교 사거리",
    coord: "37°23'46.43\"N 127°07'00.64\"E",
    events: [
      [29446, "green"],   // 08:10:46
      [29490, "red"],   // 08:11:30
      [29626, "green"],   // 08:13:46
      [29670, "red"],   // 08:14:30
      [29806, "green"],   // 08:16:46
      [29850, "red"],   // 08:17:30
      [29986, "green"],   // 08:19:46
      [30030, "red"],   // 08:20:30
      [30166, "green"],   // 08:22:46
      [30210, "red"],   // 08:23:30
      [30346, "green"],   // 08:25:46
      [30391, "red"],   // 08:26:31
      [30526, "green"],   // 08:28:46
      [30571, "red"],   // 08:29:31
      [30706, "green"],   // 08:31:46
      [30751, "red"],   // 08:32:31
      [30886, "green"],   // 08:34:46
      [30931, "red"],   // 08:35:31
      [31066, "green"],   // 08:37:46
      [31111, "red"],   // 08:38:31
      [31246, "green"],   // 08:40:46
      [31291, "red"],   // 08:41:31
      [31426, "green"],   // 08:43:46
      [31471, "red"],   // 08:44:31
      [31606, "green"],   // 08:46:46
      [31651, "red"],   // 08:47:31
      [31786, "green"],   // 08:49:46
      [31831, "red"],   // 08:50:31
    ],
  },
  {
    name: "롯데마트 사거리",
    coord: "37°23'46.50\"N 127°06'50.72\"E",
    events: [
      [29459, "green"],   // 08:10:59
      [29494, "red"],   // 08:11:34
      [29639, "green"],   // 08:13:59
      [29674, "red"],   // 08:14:34
      [29819, "green"],   // 08:16:59
      [29854, "red"],   // 08:17:34
      [29999, "green"],   // 08:19:59
      [30034, "red"],   // 08:20:34
      [30179, "green"],   // 08:22:59
      [30214, "red"],   // 08:23:34
      [30359, "green"],   // 08:25:59
      [30394, "red"],   // 08:26:34
      [30539, "green"],   // 08:28:59
      [30574, "red"],   // 08:29:34
      [30719, "green"],   // 08:31:59
      [30754, "red"],   // 08:32:34
      [30899, "green"],   // 08:34:59
      [30934, "red"],   // 08:35:34
      [31079, "green"],   // 08:37:59
      [31114, "red"],   // 08:38:34
      [31259, "green"],   // 08:40:59
      [31294, "red"],   // 08:41:34
      [31439, "green"],   // 08:43:59
      [31474, "red"],   // 08:44:34
      [31619, "green"],   // 08:46:59
      [31654, "red"],   // 08:47:34
      [31799, "green"],   // 08:49:59
      [31834, "red"],   // 08:50:34
    ],
  },
  {
    name: "보평초 정문앞 신호등",
    coord: "37°23'45.29\"N 127°07'06.39\"E",
    events: [
      [29445, "green"],   // 08:10:45
      [29461, "red"],   // 08:11:01
      [29505, "green"],   // 08:11:45
      [29521, "red"],   // 08:12:01
      [29565, "green"],   // 08:12:45
      [29581, "red"],   // 08:13:01
      [29625, "green"],   // 08:13:45
      [29641, "red"],   // 08:14:01
      [29685, "green"],   // 08:14:45
      [29701, "red"],   // 08:15:01
      [29745, "green"],   // 08:15:45
      [29761, "red"],   // 08:16:01
      [29805, "green"],   // 08:16:45
      [29821, "red"],   // 08:17:01
      [29865, "green"],   // 08:17:45
      [29881, "red"],   // 08:18:01
      [29925, "green"],   // 08:18:45
      [29941, "red"],   // 08:19:01
      [29985, "green"],   // 08:19:45
      [30001, "red"],   // 08:20:01
      [30045, "green"],   // 08:20:45
      [30061, "red"],   // 08:21:01
      [30105, "green"],   // 08:21:45
      [30121, "red"],   // 08:22:01
      [30165, "green"],   // 08:22:45
      [30181, "red"],   // 08:23:01
      [30225, "green"],   // 08:23:45
      [30241, "red"],   // 08:24:01
      [30285, "green"],   // 08:24:45
      [30301, "red"],   // 08:25:01
      [30345, "green"],   // 08:25:45
      [30361, "red"],   // 08:26:01
      [30405, "green"],   // 08:26:45
      [30421, "red"],   // 08:27:01
      [30465, "green"],   // 08:27:45
      [30481, "red"],   // 08:28:01
      [30525, "green"],   // 08:28:45
      [30541, "red"],   // 08:29:01
      [30585, "green"],   // 08:29:45
      [30601, "red"],   // 08:30:01
      [30645, "green"],   // 08:30:45
      [30661, "red"],   // 08:31:01
      [30705, "green"],   // 08:31:45
      [30721, "red"],   // 08:32:01
      [30765, "green"],   // 08:32:45
      [30781, "red"],   // 08:33:01
      [30825, "green"],   // 08:33:45
      [30841, "red"],   // 08:34:01
      [30885, "green"],   // 08:34:45
      [30901, "red"],   // 08:35:01
      [30945, "green"],   // 08:35:45
      [30961, "red"],   // 08:36:01
      [31005, "green"],   // 08:36:45
      [31021, "red"],   // 08:37:01
      [31065, "green"],   // 08:37:45
      [31081, "red"],   // 08:38:01
      [31125, "green"],   // 08:38:45
      [31141, "red"],   // 08:39:01
      [31185, "green"],   // 08:39:45
      [31201, "red"],   // 08:40:01
      [31245, "green"],   // 08:40:45
      [31261, "red"],   // 08:41:01
      [31305, "green"],   // 08:41:45
      [31321, "red"],   // 08:42:01
      [31365, "green"],   // 08:42:45
      [31381, "red"],   // 08:43:01
      [31425, "green"],   // 08:43:45
      [31441, "red"],   // 08:44:01
      [31485, "green"],   // 08:44:45
      [31501, "red"],   // 08:45:01
      [31545, "green"],   // 08:45:45
      [31561, "red"],   // 08:46:01
      [31605, "green"],   // 08:46:45
      [31621, "red"],   // 08:47:01
      [31665, "green"],   // 08:47:45
      [31681, "red"],   // 08:48:01
      [31725, "green"],   // 08:48:45
      [31741, "red"],   // 08:49:01
      [31785, "green"],   // 08:49:45
      [31801, "red"],   // 08:50:01
      [31845, "green"],   // 08:50:45
    ],
  },
  {
    name: "구숯내 삼거리",
    coord: "37°23'53.59\"N 127°07'00.68\"E",
    events: [
      [29410, "green"],   // 08:10:10
      [29500, "red"],   // 08:11:40
      [29630, "green"],   // 08:13:50
      [29662, "red"],   // 08:14:22
      [29790, "green"],   // 08:16:30
      [29821, "red"],   // 08:17:01
      [29890, "green"],   // 08:18:10
      [29920, "red"],   // 08:18:40
      [30050, "green"],   // 08:20:50
      [30082, "red"],   // 08:21:22
      [30210, "green"],   // 08:23:30
      [30241, "red"],   // 08:24:01
      [30310, "green"],   // 08:25:10
      [30400, "red"],   // 08:26:40
      [30530, "green"],   // 08:28:50
      [30562, "red"],   // 08:29:22
      [30690, "green"],   // 08:31:30
      [30721, "red"],   // 08:32:01
      [30850, "green"],   // 08:34:10
      [30881, "red"],   // 08:34:41
      [31011, "green"],   // 08:36:51
      [31041, "red"],   // 08:37:21
      [31170, "green"],   // 08:39:30
      [31201, "red"],   // 08:40:01
      [31330, "green"],   // 08:42:10
      [31362, "red"],   // 08:42:42
      [31491, "green"],   // 08:44:51
      [31522, "red"],   // 08:45:22
    ],
  },
  {
    name: "1단지 앞 신호등",
    coord: "37°23'36.68\"N 127°07'00.55\"E",
    events: [
      [29505, "green"],   // 08:11:45
      [29532, "red"],   // 08:12:12
      [29685, "green"],   // 08:14:45
      [29712, "red"],   // 08:15:12
      [29865, "green"],   // 08:17:45
      [29892, "red"],   // 08:18:12
      [30045, "green"],   // 08:20:45
      [30072, "red"],   // 08:21:12
      [30225, "green"],   // 08:23:45
      [30252, "red"],   // 08:24:12
      [30405, "green"],   // 08:26:45
      [30432, "red"],   // 08:27:12
      [30585, "green"],   // 08:29:45
      [30612, "red"],   // 08:30:12
      [30765, "green"],   // 08:32:45
      [30792, "red"],   // 08:33:12
      [30945, "green"],   // 08:35:45
      [30972, "red"],   // 08:36:12
      [31125, "green"],   // 08:38:45
      [31152, "red"],   // 08:39:12
      [31305, "green"],   // 08:41:45
      [31332, "red"],   // 08:42:12
      [31485, "green"],   // 08:44:45
      [31512, "red"],   // 08:45:12
      [31665, "green"],   // 08:47:45
      [31692, "red"],   // 08:48:12
      [31845, "green"],   // 08:50:45
    ],
  },
];

/** 등교 시간대. 이 범위를 벗어나면 "운행 시간 외". */
var WINDOW_START = 8 * 3600 + 10 * 60;  // 08:10:00
var WINDOW_END = 8 * 3600 + 50 * 60;    // 08:50:00

/* ---------------------------------------------------------------- 좌표 */

/**
 * 37°23'46.43"N 127°07'00.64"E  →  [37.3962306, 127.1168444]
 */
function dmsToDecimal(dms) {
  var re = /(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)\D+(\d+(?:\.\d+)?)\D*([NSEW])/g;
  var out = {};
  var m;

  while ((m = re.exec(dms)) !== null) {
    var value = parseFloat(m[1]) + parseFloat(m[2]) / 60 + parseFloat(m[3]) / 3600;
    var hemi = m[4];
    if (hemi === 'S' || hemi === 'W') value = -value;
    out[hemi === 'N' || hemi === 'S' ? 'lat' : 'lng'] = value;
  }

  if (typeof out.lat !== 'number' || typeof out.lng !== 'number') {
    throw new Error('좌표를 해석할 수 없습니다: ' + dms);
  }
  return [out.lat, out.lng];
}

/* ------------------------------------------------------------ 현재 시각 */

// 데이터가 한국 학교 일정이므로 보는 사람의 기기 시간대와 무관하게 KST로 고정한다.
var kstFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Seoul',
  hourCycle: 'h23',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});

/** 오늘 00:00:00부터 흐른 초 (KST 기준). */
function currentSeconds() {
  var parts = kstFormat.formatToParts(new Date());
  var h = 0, m = 0, s = 0;

  for (var i = 0; i < parts.length; i++) {
    if (parts[i].type === 'hour') h = parseInt(parts[i].value, 10);
    else if (parts[i].type === 'minute') m = parseInt(parts[i].value, 10);
    else if (parts[i].type === 'second') s = parseInt(parts[i].value, 10);
  }
  return (h % 24) * 3600 + m * 60 + s;
}

function formatClock(sec) {
  var h = Math.floor(sec / 3600) % 24;
  var m = Math.floor(sec / 60) % 60;
  var s = Math.floor(sec) % 60;
  return pad(h) + ':' + pad(m) + ':' + pad(s);
}

/** 남은 시간: 60초 이상이면 M:SS, 미만이면 "12초". */
function formatRemain(sec) {
  if (sec >= 60) return Math.floor(sec / 60) + ':' + pad(sec % 60);
  return sec + '초';
}

function pad(n) {
  return n < 10 ? '0' + n : String(n);
}

/* -------------------------------------------------------------- 상태 계산 */

/**
 * 주어진 시각에서 한 교차로의 신호 상태를 계산한다.
 *
 * 반환값 kind:
 *   'off'      등교 시간대 밖
 *   'before'   시간대 안이지만 첫 기록 이전 → 첫 이벤트의 반대 색으로 추정
 *   'running'  다음 전환 시각이 기록에 있음 (remain 유효)
 *   'trailing' 마지막 기록 이후 → 상태는 알지만 다음 전환 정보 없음
 */
function computeStatus(site, now) {
  if (now < WINDOW_START || now >= WINDOW_END) {
    return { kind: 'off', state: 'off' };
  }

  var events = site.events;
  var first = events[0];

  // 첫 기록 이전: 첫 이벤트가 초록불 시작이면 그 직전은 빨간불이었다고 본다.
  if (now < first[0]) {
    return {
      kind: 'before',
      state: first[1] === 'green' ? 'red' : 'green',
      next: first[1],
      remain: first[0] - now
    };
  }

  // now 이하인 마지막 이벤트 = 현재 상태를 시작시킨 이벤트 (이진 탐색)
  var lo = 0;
  var hi = events.length - 1;
  while (lo < hi) {
    var mid = (lo + hi + 1) >> 1;
    if (events[mid][0] <= now) lo = mid;
    else hi = mid - 1;
  }

  var current = events[lo][1];
  var upcoming = events[lo + 1];

  if (!upcoming) {
    return { kind: 'trailing', state: current };
  }

  return {
    kind: 'running',
    state: current,
    next: upcoming[1],
    remain: upcoming[0] - now
  };
}

var STATE_LABEL = { green: '초록불', red: '빨간불', off: '신호 정보 없음' };

/** 카드/팝업에 쓸 표시 문자열 묶음. */
function describe(status) {
  if (status.kind === 'off') {
    return { badge: '운행 시간 외', label: '등교 시간 08:10~08:50', value: '—' };
  }
  if (status.kind === 'trailing') {
    return { badge: STATE_LABEL[status.state], label: '다음 전환', value: '정보 없음' };
  }
  return {
    badge: STATE_LABEL[status.state],
    label: STATE_LABEL[status.next] + '까지',
    value: formatRemain(status.remain)
  };
}

/* ------------------------------------------------------------------ 지도 */

var map = L.map('map', { zoomControl: true, attributionControl: true });

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var signalIcon = L.divIcon({
  className: 'signal-marker',
  html: '<span class="signal-dot"></span>',
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -13]
});

/** 교차로별 DOM/Leaflet 핸들 모음. tick()에서 내용만 갈아끼운다. */
var views = [];
var siteList = document.getElementById('siteList');

SITES.forEach(function (site) {
  var latlng = dmsToDecimal(site.coord);

  /* --- 사이드 패널 카드 --- */
  var card = document.createElement('li');
  card.className = 'site-card';
  card.dataset.state = 'off';
  card.innerHTML =
    '<div class="site-top"><span class="dot"></span><span class="site-name"></span></div>' +
    '<div class="site-status">' +
      '<span class="state-badge"></span>' +
      '<span class="site-count">' +
        '<span class="count-label"></span>' +
        '<span class="count-value"></span>' +
      '</span>' +
    '</div>';
  card.querySelector('.site-name').textContent = site.name;
  card.addEventListener('click', function () {
    map.setView(latlng, Math.max(map.getZoom(), 17));
    marker.openPopup();
  });
  siteList.appendChild(card);

  /* --- 마커 + 팝업 --- */
  var popup = document.createElement('div');
  popup.className = 'popup';
  popup.dataset.state = 'off';
  popup.innerHTML =
    '<div class="popup-name"></div>' +
    '<span class="popup-badge"></span>' +
    '<div class="popup-count">' +
      '<span class="popup-label"></span>' +
      '<strong class="popup-remain"></strong>' +
    '</div>' +
    '<div class="popup-note"></div>';
  popup.querySelector('.popup-name').textContent = site.name;
  popup.querySelector('.popup-note').textContent =
    '기록 ' + site.events.length + '건 · ' +
    formatClock(site.events[0][0]) + ' ~ ' + formatClock(site.events[site.events.length - 1][0]);

  var marker = L.marker(latlng, { icon: signalIcon, title: site.name })
    .addTo(map)
    .bindPopup(popup, { closeButton: true, autoPan: true });

  views.push({
    site: site,
    latlng: latlng,
    marker: marker,
    card: card,
    cardBadge: card.querySelector('.state-badge'),
    cardLabel: card.querySelector('.count-label'),
    cardValue: card.querySelector('.count-value'),
    popup: popup,
    popupBadge: popup.querySelector('.popup-badge'),
    popupLabel: popup.querySelector('.popup-label'),
    popupRemain: popup.querySelector('.popup-remain')
  });
});

map.fitBounds(L.latLngBounds(views.map(function (v) { return v.latlng; })), {
  padding: [60, 60],
  maxZoom: 17
});

/* ------------------------------------------------- 시뮬레이션 시각 (확인용) */

var simToggle = document.getElementById('simToggle');
var simRange = document.getElementById('simRange');
var simTime = document.getElementById('simTime');
var simBox = document.querySelector('.sim');
var clockBox = document.querySelector('.clock-box');

function syncSim() {
  var on = simToggle.checked;
  simRange.disabled = !on;
  simBox.classList.toggle('on', on);
  clockBox.classList.toggle('sim', on);
  simTime.textContent = formatClock(parseInt(simRange.value, 10));
  tick();
}

simToggle.addEventListener('change', syncSim);
simRange.addEventListener('input', syncSim);

/* ------------------------------------------------------------------ 갱신 */

var clockEl = document.getElementById('clock');
var clockLabelEl = document.getElementById('clockLabel');

/** 화면 갱신은 잦아도 텍스트가 바뀔 때만 DOM에 쓴다. */
function setText(el, value) {
  if (el.textContent !== value) el.textContent = value;
}

function setState(el, value) {
  if (el.dataset.state !== value) el.dataset.state = value;
}

function tick() {
  var simulating = simToggle.checked;
  var now = simulating ? parseInt(simRange.value, 10) : currentSeconds();

  setText(clockEl, formatClock(now));
  setText(clockLabelEl, simulating ? '시뮬레이션 시각' : '한국 표준시 (KST)');

  for (var i = 0; i < views.length; i++) {
    var v = views[i];
    var status = computeStatus(v.site, now);
    var text = describe(status);
    var tone = status.kind === 'off' ? 'off' : status.state;

    setState(v.card, tone);
    setText(v.cardBadge, text.badge);
    setText(v.cardLabel, text.label);
    setText(v.cardValue, text.value);

    setState(v.popup, tone);
    setText(v.popupBadge, text.badge);
    setText(v.popupLabel, text.label);
    setText(v.popupRemain, text.value);

    var el = v.marker.getElement();
    if (el) setState(el, tone);
  }
}

tick();
// 250ms 주기 — 초가 바뀌는 순간을 놓치지 않으면서도 부담이 없다.
setInterval(tick, 250);
