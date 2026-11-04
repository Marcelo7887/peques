/* Voz compartida por los juegos: elige la voz del aparato, la velocidad y el estilo. */
(function () {
  var KEY = 'voz-v1';
  var cfg = { voice: '', rate: 0.9, style: 'natural' };
  try {
    var saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) for (var k in saved) if (k in cfg) cfg[k] = saved[k];
  } catch (e) {}
  var has = 'speechSynthesis' in window;

  function save() { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) {} }
  function list() {
    if (!has) return [];
    var all = [];
    try { all = speechSynthesis.getVoices() || []; } catch (e) {}
    return all.filter(function (v) { return /^es/i.test(v.lang); });
  }
  function score(v) {
    var n = (v.name + ' ' + (v.voiceURI || '')).toLowerCase(), s = 0;
    if (/premium|enhanced|mejorada|neural|natural|wavenet/.test(n)) s += 4;
    if (/google|siri/.test(n)) s += 2;
    if (/m[oó]nica|paulina|jorge|marisol|diego|angelica|esperanza|lupe|elvira|alvaro|dalia/.test(n)) s += 1;
    if (/es[-_]es/i.test(v.lang)) s += 1;
    return s;
  }
  function pick() {
    var l = list(), i, best = null;
    if (!l.length) return null;
    if (cfg.voice) for (i = 0; i < l.length; i++) if (l[i].voiceURI === cfg.voice) return l[i];
    for (i = 0; i < l.length; i++) if (!best || score(l[i]) > score(best)) best = l[i];
    return best;
  }
  function speak(text, o) {
    if (!has) return;
    o = o || {};
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text), v = pick();
      if (v) u.voice = v;
      u.lang = (v && v.lang) || 'es-ES';
      u.volume = 1;
      if (cfg.style === 'gracioso') { u.rate = (o.rate || 1) * (cfg.rate / 0.9); u.pitch = o.pitch || 1; }
      else { u.rate = cfg.rate; u.pitch = 1; }
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  window.VOZ = {
    speak: speak,
    list: list,
    pick: pick,
    cfg: function () { return { voice: cfg.voice, rate: cfg.rate, style: cfg.style }; },
    set: function (p) { for (var k in p) if (k in cfg) cfg[k] = p[k]; save(); }
  };
  if (has) try { speechSynthesis.getVoices(); } catch (e) {}
})();
