
/* Daily fixtures fetcher for the player's Sports page. Run by sync-server.js (at start-up and every 6 hours) or by hand:
     node sports-fetch.js        -> prints one line per source and writes sports-cache.json next to this file
   The VPS talks to the sports sites, so the browser never needs to. Needs Node 16+, no packages. */
"use strict";
const fs = require("fs"), path = require("path"), https = require("https");
const OUT = process.env.SPORTS_OUT || path.join(__dirname, "sports-cache.json");
global.window = global;
global.fetch = function (u) {
  return new Promise(function (res, rej) {
    if (!/^https:/.test(u)) return rej(new Error("not absolute"));
    const req = https.get(u, { family: 4, headers: { "User-Agent": "Mozilla/5.0 iptv-sync", "Accept": "application/json" }, timeout: 20000 }, function (r) {
      const p = []; r.on("data", function (d) { p.push(d); });
      r.on("end", function () { const t = Buffer.concat(p).toString("utf8"); res({ ok: r.statusCode >= 200 && r.statusCode < 300, status: r.statusCode, text: function () { return Promise.resolve(t); } }); });
    });
    req.on("timeout", function () { req.destroy(new Error("timeout")); }); req.on("error", rej);
  });
};
  var SP_FLAG = { England:"\uD83C\uDDEC\uD83C\uDDE7", Scotland:"\uD83C\uDDEC\uD83C\uDDE7", Spain:"\uD83C\uDDEA\uD83C\uDDF8", France:"\uD83C\uDDEB\uDDF7".replace("\uDDEB\uDDF7","\uD83C\uDDF7"), Germany:"\uD83C\uDDE9\uD83C\uDDEA", Italy:"\uD83C\uDDEE\uD83C\uDDF9", Netherlands:"\uD83C\uDDF3\uD83C\uDDF1", Belgium:"\uD83C\uDDE7\uD83C\uDDEA", Portugal:"\uD83C\uDDF5\uD83C\uDDF9", Turkey:"\uD83C\uDDF9\uD83C\uDDF7", USA:"\uD83C\uDDFA\uD83C\uDDF8", Brazil:"\uD83C\uDDE7\uD83C\uDDF7", Argentina:"\uD83C\uDDE6\uD83C\uDDF7", "Saudi Arabia":"\uD83C\uDDF8\uD83C\uDDE6", Europe:"\uD83C\uDDEA\uD83C\uDDFA", International:"\uD83C\uDF0D" };
  SP_FLAG.World="\uD83C\uDF10"; SP_FLAG.Asia="\uD83C\uDF0F"; SP_FLAG.Africa="\uD83C\uDF0D"; SP_FLAG["South America"]="\uD83C\uDF0E"; SP_FLAG["North America"]="\uD83C\uDF0E"; SP_FLAG.Oceania="\uD83C\uDF0F"; SP_FLAG.Japan="\uD83C\uDDEF\uD83C\uDDF5"; SP_FLAG.Mexico="\uD83C\uDDF2\uD83C\uDDFD"; SP_FLAG.Australia="\uD83C\uDDE6\uD83C\uDDFA"; SP_FLAG.Switzerland="\uD83C\uDDE8\uD83C\uDDED"; SP_FLAG.Austria="\uD83C\uDDE6\uD83C\uDDF9"; SP_FLAG.Greece="\uD83C\uDDEC\uD83C\uDDF7"; SP_FLAG.Denmark="\uD83C\uDDE9\uD83C\uDDF0"; SP_FLAG.Sweden="\uD83C\uDDF8\uD83C\uDDEA"; SP_FLAG.Norway="\uD83C\uDDF3\uD83C\uDDF4"; SP_FLAG.India="\uD83C\uDDEE\uD83C\uDDF3"; SP_FLAG.China="\uD83C\uDDE8\uD83C\uDDF3";
  SP_FLAG.France = "\uD83C\uDDEB\uD83C\uDDF7";
  var SP_ORDER = ["Football (Soccer)","American Football","Basketball","Ice Hockey","Baseball","Cricket","Rugby","Volleyball","Handball","Boxing","MMA / UFC","Tennis","Motorsport","Golf","Darts"];
  // [path, sport, league, country, kind]  kind "e" = one entry per event (tournament / race / fight card)
  var SP_ESPN = [
    ["soccer/eng.1","Football (Soccer)","Premier League (Level 1)","England"],["soccer/eng.2","Football (Soccer)","EFL Championship (Level 2)","England"],
    ["soccer/eng.3","Football (Soccer)","EFL League One (Level 3)","England"],["soccer/eng.4","Football (Soccer)","EFL League Two (Level 4)","England"],
    ["soccer/eng.fa","Football (Soccer)","FA Cup","England"],["soccer/eng.league_cup","Football (Soccer)","EFL Cup","England"],
    ["soccer/esp.1","Football (Soccer)","La Liga","Spain"],["soccer/fra.1","Football (Soccer)","Ligue 1","France"],["soccer/ger.1","Football (Soccer)","Bundesliga","Germany"],
    ["soccer/ita.1","Football (Soccer)","Serie A","Italy"],["soccer/ned.1","Football (Soccer)","Eredivisie","Netherlands"],["soccer/bel.1","Football (Soccer)","Belgian Pro League","Belgium"],
    ["soccer/por.1","Football (Soccer)","Primeira Liga","Portugal"],["soccer/sco.1","Football (Soccer)","Scottish Premiership","Scotland"],["soccer/tur.1","Football (Soccer)","S\u00fcper Lig","Turkey"],
    ["soccer/usa.1","Football (Soccer)","MLS","USA"],["soccer/bra.1","Football (Soccer)","Brasileir\u00e3o","Brazil"],["soccer/arg.1","Football (Soccer)","Liga Profesional","Argentina"],
    ["soccer/ksa.1","Football (Soccer)","Saudi Pro League","Saudi Arabia"],["soccer/uefa.champions","Football (Soccer)","Champions League","Europe"],
    ["soccer/uefa.europa","Football (Soccer)","Europa League","Europe"],["soccer/uefa.europa.conf","Football (Soccer)","Conference League","Europe"],
    ["soccer/fifa.world","Football (Soccer)","FIFA World Cup","World"],
    ["soccer/fifa.worldq.uefa","Football (Soccer)","World Cup Qualifiers - Europe","Europe"],
    ["soccer/fifa.worldq.caf","Football (Soccer)","World Cup Qualifiers - Africa","Africa"],
    ["soccer/fifa.worldq.afc","Football (Soccer)","World Cup Qualifiers - Asia","Asia"],
    ["soccer/fifa.worldq.conmebol","Football (Soccer)","World Cup Qualifiers - South America","South America"],
    ["soccer/fifa.worldq.concacaf","Football (Soccer)","World Cup Qualifiers - North America","North America"],
    ["soccer/fifa.worldq.ofc","Football (Soccer)","World Cup Qualifiers - Oceania","Oceania"],
    ["soccer/fifa.friendly","Football (Soccer)","International Friendlies","World"],
    ["soccer/uefa.euro","Football (Soccer)","UEFA Euro","Europe"],
    ["soccer/uefa.euroq","Football (Soccer)","Euro Qualifiers","Europe"],
    ["soccer/uefa.nations","Football (Soccer)","UEFA Nations League","Europe"],
    ["soccer/caf.nations","Football (Soccer)","Africa Cup of Nations (AFCON)","Africa"],
    ["soccer/caf.nations_qual","Football (Soccer)","AFCON Qualifiers","Africa"],
    ["soccer/afc.asian.cup","Football (Soccer)","AFC Asian Cup","Asia"],
    ["soccer/afc.cupq","Football (Soccer)","Asian Cup Qualifiers","Asia"],
    ["soccer/conmebol.america","Football (Soccer)","Copa Am\u00e9rica","South America"],
    ["soccer/concacaf.gold","Football (Soccer)","CONCACAF Gold Cup","North America"],
    ["soccer/concacaf.nations.league","Football (Soccer)","CONCACAF Nations League","North America"],
    ["soccer/fifa.cwc","Football (Soccer)","FIFA Club World Cup","World"],
    ["soccer/fifa.w.world","Football (Soccer)","Women's World Cup","World"],
    ["soccer/uefa.weuro","Football (Soccer)","Women's Euro","Europe"],
    ["soccer/uefa.wchampions","Football (Soccer)","Women's Champions League","Europe"],
    ["soccer/conmebol.libertadores","Football (Soccer)","Copa Libertadores","South America"],
    ["soccer/conmebol.sudamericana","Football (Soccer)","Copa Sudamericana","South America"],
    ["soccer/afc.champions","Football (Soccer)","AFC Champions League Elite","Asia"],
    ["soccer/caf.champions","Football (Soccer)","CAF Champions League","Africa"],
    ["soccer/concacaf.champions","Football (Soccer)","CONCACAF Champions Cup","North America"],
    ["soccer/mex.1","Football (Soccer)","Liga MX","Mexico"],
    ["soccer/jpn.1","Football (Soccer)","J1 League","Japan"],
    ["soccer/aus.1","Football (Soccer)","A-League","Australia"],
    ["soccer/chn.1","Football (Soccer)","Chinese Super League","China"],
    ["soccer/sui.1","Football (Soccer)","Swiss Super League","Switzerland"],
    ["soccer/aut.1","Football (Soccer)","Austrian Bundesliga","Austria"],
    ["soccer/gre.1","Football (Soccer)","Super League Greece","Greece"],
    ["soccer/den.1","Football (Soccer)","Danish Superliga","Denmark"],
    ["soccer/swe.1","Football (Soccer)","Allsvenskan","Sweden"],
    ["soccer/nor.1","Football (Soccer)","Eliteserien","Norway"],
    ["soccer/esp.2","Football (Soccer)","La Liga 2","Spain"],
    ["soccer/ger.2","Football (Soccer)","2. Bundesliga","Germany"],
    ["soccer/ita.2","Football (Soccer)","Serie B","Italy"],
    ["soccer/fra.2","Football (Soccer)","Ligue 2","France"],
    ["soccer/esp.copa_del_rey","Football (Soccer)","Copa del Rey","Spain"],
    ["soccer/ger.dfb_pokal","Football (Soccer)","DFB-Pokal","Germany"],
    ["soccer/ita.coppa_italia","Football (Soccer)","Coppa Italia","Italy"],
    ["soccer/fra.coupe_de_france","Football (Soccer)","Coupe de France","France"],
    ["football/nfl","American Football","NFL","USA"],["football/college-football","American Football","NCAA Football","USA"],
    ["basketball/nba","Basketball","NBA","USA"],["basketball/wnba","Basketball","WNBA","USA"],["basketball/mens-college-basketball","Basketball","NCAA Basketball","USA"],
    ["hockey/nhl","Ice Hockey","NHL","USA"],["baseball/mlb","Baseball","MLB","USA"],
    ["mma/ufc","MMA / UFC","UFC","USA","e"],["racing/f1","Motorsport","Formula 1","International","e"],
    ["tennis/atp","Tennis","ATP Tour","International","e"],["tennis/wta","Tennis","WTA Tour","International","e"],["golf/pga","Golf","PGA Tour","USA","e"]
  ];
  // Season-long fixture lists (fixturedownload.com): one request per competition; used when ESPN has nothing for that league
  var SP_FD = [
    ["epl-2026","Football (Soccer)","Premier League (Level 1)","England"],
    ["championship-2026","Football (Soccer)","EFL Championship (Level 2)","England"],
    ["league-one-2026","Football (Soccer)","EFL League One (Level 3)","England"],
    ["league-two-2026","Football (Soccer)","EFL League Two (Level 4)","England"],
    ["la-liga-2026","Football (Soccer)","La Liga","Spain"],
    ["bundesliga-2026","Football (Soccer)","Bundesliga","Germany"],
    ["serie-a-2026","Football (Soccer)","Serie A","Italy"],
    ["ligue-1-2026","Football (Soccer)","Ligue 1","France"],
    ["eredivisie-2026","Football (Soccer)","Eredivisie","Netherlands"],
    ["champions-league-2026","Football (Soccer)","Champions League","Europe"],
    ["europa-league-2026","Football (Soccer)","Europa League","Europe"],
    ["conference-league-2026","Football (Soccer)","Conference League","Europe"],
    ["nations-league-2026","Football (Soccer)","UEFA Nations League","Europe"],
    ["wsl-2026","Football (Soccer)","Women's Super League","England"],
    ["aleague-women-2026","Football (Soccer)","A-League Women","Australia"],
    ["nba-2026","Basketball","NBA","USA"],
    ["wnbl-2026","Basketball","WNBL","Australia"],
    ["premiership-rugby-2026","Rugby","Premiership Rugby","England"],
    ["ipl-2026","Cricket","Indian Premier League","India"]
  ];
  var SP_TSDB = [["Cricket","Cricket"],["Fighting","Boxing"],["Volleyball","Volleyball"],["Rugby","Rugby"],["Handball","Handball"],["Darts","Darts"]];
  var sp = { rep: [], useProxy: false, ev: [], day: "all", limit: 150, ready: false, busy: false, days: [] };
  function spEsc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function spKey(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function spDays() { var a = [], d0 = new Date(); d0.setHours(0, 0, 0, 0); for (var i = 0; i < 7; i++) { var d = new Date(d0); d.setDate(d0.getDate() + i); a.push(d); } return a; }
  function spFetch(u) {
    var c = window.AbortController ? new AbortController() : null, t = setTimeout(function () { if (c) c.abort(); }, 15000);
    return fetch(u, c ? { signal: c.signal } : {}).then(function (r) {
      clearTimeout(t); if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text().then(function (x) { try { return JSON.parse(x); } catch (e) { throw new Error("not JSON (got a web page)"); } });
    }, function (e) { clearTimeout(t); throw new Error(e && e.name === "AbortError" ? "timeout" : "blocked/offline"); });
  }
  function spGet(url) {
    var px = String((typeof CONFIG !== "undefined" && CONFIG.SYNC_URL) || "/api/sync").replace(/\/+$/, "") + "/sports?u=" + encodeURIComponent(url);
    var tag = url.replace(/^https:\/\/[^\/]+\/(apis\/site\/v2\/sports\/)?/, "").slice(0, 70), good = function (j) { sp.okAny = true; return j; };
    var bad = function (e, note) { if (!/^HTTP 4/.test(e.message)) sp.fails++; if (!sp.err) sp.err = note + " [" + tag + "]"; throw e; };
    if (sp.useProxy) return spFetch(px).then(good, function (e) { bad(e, "Server relay: " + e.message); });
    if (sp.fails > 12 && !sp.okAny) return Promise.reject(new Error("skipped"));
    return spFetch(url).then(good, function (e1) {
      if (/^HTTP 4/.test(e1.message)) return bad(e1, "Direct: " + e1.message);      // the site answered but rejected the request: the relay would get the same answer
      return spFetch(px).then(function (j) { sp.useProxy = true; return good(j); }, function (e2) { bad(e2, "Direct: " + e1.message + " \u00b7 Server relay: " + e2.message); });
    });
  }
  function spEspnGet(L, dl, end, fmt) {
    var base = "https://site.api.espn.com/apis/site/v2/sports/" + L[0] + "/scoreboard?", gq = L[0] === "football/college-football" ? "groups=80&" : L[0] === "basketball/mens-college-basketball" ? "groups=50&" : "";
    var rng = "dates=" + fmt(dl[0]) + "-" + fmt(end), h4 = function (e) { if (!/^HTTP 4/.test(e.message)) throw e; };
    return spGet(base + "limit=300&" + gq + rng).catch(function (e) { h4(e); return spGet(base + gq + rng); }).catch(function (e) {
      h4(e); var last = e, nf = 0; return Promise.all(dl.map(function (d) { return spGet(base + gq + "dates=" + fmt(d)).catch(function (e3) { last = e3; nf++; return { events: [] }; }); })).then(function (rs) { if (nf === dl.length) throw last; return { events: [].concat.apply([], rs.map(function (r) { return r.events || []; })) }; });
    });
  }
  function spEspc(js, L) {
    return (js.events || []).map(function (ev) {
      var c = (ev.competitions || [])[0] || {}, cs = c.competitors || [], o = { id: "e" + ev.id + L[0], sport: L[1], league: L[2], country: L[3] };
      o.t = Date.parse(ev.date); o.venue = (c.venue && c.venue.fullName) || ""; o.tv = ((c.broadcasts || [])[0] || {}).names; o.tv = o.tv ? o.tv.join(", ") : "";
      var st = (ev.status && ev.status.type) || {}; o.state = st.state || "pre"; o.detail = st.shortDetail || "";
      if (L[4] === "e" || cs.length < 2) { o.title = ev.name; if (L[1] === "MMA / UFC") o.venue = (ev.competitions || []).length + " bouts" + (o.venue ? " \u00b7 " + o.venue : ""); }
      else {
        var h = cs.filter(function (x) { return x.homeAway === "home"; })[0] || cs[0], a = cs.filter(function (x) { return x.homeAway === "away"; })[0] || cs[1];
        var nm = function (x) { return (x.team && x.team.displayName) || (x.athlete && x.athlete.displayName) || ""; };
        o.home = nm(h); o.away = nm(a); o.hl = (h.team && h.team.logo) || ""; o.al = (a.team && a.team.logo) || "";
        if (o.state !== "pre") { o.hs = h.score; o.as = a.score; }
      }
      return o;
    });
  }
  function spFd(js, L) {
    return (Array.isArray(js) ? js : []).map(function (m) {
      var ds = String(m.DateUtc || "").replace(" ", "T"), t = Date.parse(/Z$/.test(ds) ? ds : ds + "Z"), sc = m.HomeTeamScore != null && m.AwayTeamScore != null;
      if (isNaN(t) || !m.HomeTeam || !m.AwayTeam) return null;
      var o = { id: "f" + L[0] + m.MatchNumber, sport: L[1], league: L[2], country: L[3], t: t, home: m.HomeTeam, away: m.AwayTeam, venue: m.Location || "", tv: "", state: sc ? "post" : "pre", detail: m.RoundNumber ? "Round " + m.RoundNumber : "" };
      if (sc) { o.hs = m.HomeTeamScore; o.as = m.AwayTeamScore; }
      return o;
    }).filter(Boolean);
  }
  function spTsdb(js, L, key) {
    return (js.events || []).map(function (e) {
      var ts = e.strTimestamp ? (/[zZ+]/.test(e.strTimestamp.slice(10)) ? e.strTimestamp : e.strTimestamp + "Z") : (e.dateEvent + "T" + (e.strTime || "12:00:00") + "Z");
      var sport = L[1], lg = e.strLeague || "";
      if (L[0] === "Fighting") { if (/ufc/i.test(lg)) return null; sport = /box/i.test(lg + e.strEvent) ? "Boxing" : "MMA / UFC"; }
      var o = { id: "t" + e.idEvent, sport: sport, league: lg || sport, country: e.strCountry || "International", t: Date.parse(ts), venue: e.strVenue || "", tv: "", state: /finished|ft|final/i.test(e.strStatus || "") ? "post" : "pre", detail: e.strStatus || "" };
      if (e.strHomeTeam && e.strAwayTeam) { o.home = e.strHomeTeam; o.away = e.strAwayTeam; o.hl = e.strHomeTeamBadge || ""; o.al = e.strAwayTeamBadge || ""; if (e.intHomeScore != null && e.intAwayScore != null) { o.hs = e.intHomeScore; o.as = e.intAwayScore; } }
      else o.title = e.strEvent;
      return isNaN(o.t) ? null : o;
    }).filter(Boolean);
  }

(function main() {
  const t0 = new Date(); t0.setHours(0, 0, 0, 0); t0.setDate(t0.getDate() - 1);
  const dl = []; for (let i = 0; i < 9; i++) { const d = new Date(t0); d.setDate(t0.getDate() + i); dl.push(d); }
  const end = new Date(dl[8]); end.setDate(end.getDate() + 1);
  const fmt = function (d) { return spKey(d).replace(/-/g, ""); };
  let evs = [], ok = 0, total = 0; const jobs = [];
  const add = function (name, fn, norm) { jobs.push(function () { return fn().then(function (j) { const x = norm(j); evs = evs.concat(x); ok++; console.log("OK   " + name + ": " + x.length); }, function (e) { console.log("FAIL " + name + ": " + e.message); }); }); };
  SP_ESPN.forEach(function (L) { add(L[2], function () { return spEspnGet(L, dl, end, fmt); }, function (j) { return spEspc(j, L); }); });
  SP_FD.forEach(function (L) { add("FD " + L[2], function () { return spGet("https://fixturedownload.com/feed/json/" + L[0]); }, function (j) { return spFd(j, L); }); });
  SP_TSDB.forEach(function (L) { dl.slice(1, 8).forEach(function (d) { add("TSDB " + L[0] + " " + spKey(d), function () { return spGet("https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=" + spKey(d) + "&s=" + L[0]); }, function (j) { return spTsdb(j, L); }); }); });
  total = jobs.length; let i = 0;
  function next() { return i >= jobs.length ? Promise.resolve() : jobs[i++]().then(next); }
  Promise.all([1, 2, 3, 4, 5, 6].map(next)).then(function () {
    const have = {}; evs.forEach(function (e) { if (e.id.charAt(0) === "e") have[e.league] = 1; });
    const seen = {}, lo = dl[0].getTime(), hi = end.getTime();
    const ev = evs.filter(function (e) { if (e.id.charAt(0) === "f" && have[e.league]) return false; if (seen[e.id] || !(e.t >= lo && e.t < hi)) return false; return (seen[e.id] = 1); }).sort(function (a, b) { return a.t - b.t; });
    console.log("Sources reachable: " + ok + "/" + total + "  events kept: " + ev.length);
    if (!ev.length) { console.log("Nothing fetched - keeping the previous cache. Check that this server can reach https://site.api.espn.com"); process.exit(0); }
    const tmp = OUT + ".tmp"; fs.writeFileSync(tmp, JSON.stringify({ generated: Date.now(), ev: ev })); fs.renameSync(tmp, OUT);
    console.log("Wrote " + OUT);
  });
})();
