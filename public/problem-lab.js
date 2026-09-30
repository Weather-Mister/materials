(function problemLabModule() {
  "use strict";
  const course = window.MATERIALS_COURSE || { modules: [] };
  const $ = (id) => document.getElementById(id);
  const qa = (sel, root = document) => [...root.querySelectorAll(sel)];
  const safe = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));

  function number(id) {
    const value = Number($(id)?.value);
    return Number.isFinite(value) ? value : NaN;
  }
  function fmt(value, digits = 6) {
    if (!Number.isFinite(value)) return "—";
    if (value === 0) return "0";
    const a = Math.abs(value);
    if (a >= 1e5 || a < 1e-4) return value.toExponential(5);
    return Number(value.toPrecision(digits)).toString();
  }
  function gcd(a, b) {
    a = Math.abs(Math.trunc(a)); b = Math.abs(Math.trunc(b));
    while (b) [a, b] = [b, a % b];
    return a || 1;
  }
  function lcm(a, b) {
    if (!a || !b) return 0;
    return Math.abs(a * b) / gcd(a, b);
  }
  function parseRational(raw) {
    const s = String(raw ?? "").trim().toLowerCase();
    if (["∞","inf","infinity"].includes(s)) return { infinite: true, n: 1, d: 0 };
    if (!s) return null;
    if (s.includes("/")) {
      const p = s.split("/");
      if (p.length !== 2) return null;
      let n = Number(p[0]), d = Number(p[1]);
      if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;
      if (n === 0) return { zero: true, n: 0, d: 1 };
      if (d < 0) { n *= -1; d *= -1; }
      const g = gcd(Math.round(n), Math.round(d));
      return { n: Math.round(n / g), d: Math.round(d / g) };
    }
    const x = Number(s);
    if (!Number.isFinite(x)) return null;
    if (x === 0) return { zero: true, n: 0, d: 1 };
    const decimals = (s.split(".")[1] || "").length;
    const scale = Math.min(1e6, 10 ** decimals);
    let n = Math.round(x * scale), d = scale;
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
  }
  function millerFromIntercepts(values) {
    const parsed = values.map(parseRational);
    if (parsed.some((v) => !v)) return { error: "Use numbers, fractions such as 1/2, or ∞ / inf." };
    if (parsed.some((v) => v.zero)) return { error: "A zero intercept means the plane passes through the chosen origin. Shift the origin to an equivalent lattice point first." };
    const reciprocals = parsed.map((v) => {
      if (v.infinite) return { n: 0, d: 1 };
      let n = v.d, d = v.n;
      if (d < 0) { n *= -1; d *= -1; }
      const g = gcd(n, d);
      return { n: n / g, d: d / g };
    });
    const scale = reciprocals.reduce((m, r) => lcm(m || 1, Math.abs(r.d)), 1);
    return { reciprocals, scale, indices: reciprocals.map((r) => r.n * (scale / r.d)) };
  }
  function millerText(indices) {
    return "(" + indices.map((n) => n < 0 ? "−" + Math.abs(n) : String(n)).join(" ") + ")";
  }
  function output(id, html, bad = false) {
    const el = $(id);
    if (!el) return;
    el.classList.toggle("bad", !!bad);
    el.innerHTML = html;
  }

  function render() {
    const host = $("problemLabHost");
    if (!host) return;
    const m3 = course.modules.find((m) => m.id === "m03" && m.available);
    if (!m3) {
      host.innerHTML = "<div class='problemUnavailable'><b>Problem Lab is waiting for Week 3.</b><p>Load Atomic and Ionic Arrangements to activate the Assignment 1 calculators.</p></div>";
      return;
    }
    host.innerHTML = `
      <div class="problemCoverage">
        <div><b>Assignment 1 coverage</b><span>Q1 a₀ ↔ r</span><span>Q2 ρ ↔ a₀</span><span>Q3 PD + PPF</span><span>Q4 (hkl) + dₕₖₗ</span></div>
        <p>Every tool shows formula → conversion → substitution → result. The Miller-plane tool follows the professor's slide rule: <strong>clear fractions but do not reduce to lowest integers afterward.</strong></p>
      </div>
      <div class="problemGrid">
        <section class="problemCard">
          <div class="problemCardHead"><span>01</span><div><b>Cubic geometry</b><small>BCC / FCC · a₀ ↔ r</small></div></div>
          <div class="problemPresetRow"><button type="button" data-geom-preset="fe">Load Fe Q1(a)</button><button type="button" data-geom-preset="cu">Load Cu Q1(b)</button></div>
          <div class="problemFields">
            <label>Structure<select id="probGeomStructure"><option value="bcc">BCC</option><option value="fcc">FCC</option></select></label>
            <label>Known<select id="probGeomKnown"><option value="a">lattice parameter a₀</option><option value="r">atomic radius r</option></select></label>
            <label>Value<input id="probGeomValue" inputmode="decimal" value="0.2866"></label>
            <label>Unit<select id="probGeomUnit"><option value="nm">nm</option><option value="A">Å</option></select></label>
          </div>
          <button class="problemSolve" id="probGeomSolve" type="button">Solve with steps</button>
          <div class="problemOutput" id="probGeomOut">Assignment Q1(a) values are preloaded.</div>
        </section>
        <section class="problemCard">
          <div class="problemCardHead"><span>02</span><div><b>Theoretical density</b><small>ρ = nM / (Nₐa₀³)</small></div></div>
          <div class="problemPresetRow"><button type="button" id="probDensityPreset">Load K Q2</button></div>
          <div class="problemFields">
            <label>Atoms/cell n<input id="probDensityN" inputmode="decimal" value="2"></label>
            <label>Atomic weight M (g/mol)<input id="probDensityM" inputmode="decimal" value="39.09"></label>
            <label>Lattice a₀ (nm)<input id="probDensityA" inputmode="decimal" placeholder="for a₀ → ρ"></label>
            <label>Density ρ (g/cm³)<input id="probDensityRho" inputmode="decimal" value="0.855"></label>
          </div>
          <div class="problemActionRow"><button class="problemSolve" id="probDensityFromA" type="button">a₀ → ρ</button><button class="problemSolve" id="probAFromDensity" type="button">ρ → a₀</button></div>
          <div class="problemOutput" id="probDensityOut">For Assignment Q2 choose ρ → a₀; the BCC radius step is included automatically.</div>
        </section>
        <section class="problemCard">
          <div class="problemCardHead"><span>03</span><div><b>Planar calculations</b><small>FCC (100) PD · FCC (111) PPF</small></div></div>
          <div class="problemPresetRow"><button type="button" id="probPlanarPreset">Load Ni Q3</button></div>
          <div class="problemFields one"><label>FCC lattice a₀ (nm)<input id="probPlanarA" inputmode="decimal" value="0.35167"></label></div>
          <div class="problemActionRow"><button class="problemSolve" id="probPlanarDensity" type="button">Solve PD(100)</button><button class="problemSolve" id="probPpf" type="button">Show PPF(111)</button></div>
          <div class="problemOutput" id="probPlanarOut">FCC (100) contains 2 atom centers per square planar repeat area.</div>
        </section>
        <section class="problemCard">
          <div class="problemCardHead"><span>04</span><div><b>Miller plane</b><small>intercepts → reciprocals → clear fractions</small></div></div>
          <div class="problemPresetRow"><button type="button" id="probMillerPreset">Load Assignment Q4(a)</button></div>
          <div class="problemFields three"><label>x/a<input id="probMillerX" value="1"></label><label>y/a<input id="probMillerY" value="2"></label><label>z/a<input id="probMillerZ" value="∞"></label></div>
          <button class="problemSolve" id="probMillerSolve" type="button">Find (hkl)</button>
          <div class="problemOutput" id="probMillerOut">Enter numbers, fractions such as 1/2, or ∞.</div>
        </section>
        <section class="problemCard wide">
          <div class="problemCardHead"><span>05</span><div><b>Cubic interplanar spacing</b><small>dₕₖₗ = a₀ / √(h²+k²+l²)</small></div></div>
          <div class="problemPresetRow"><button type="button" data-spacing="111">Load Al (111)</button><button type="button" data-spacing="220">Load Al (220)</button></div>
          <div class="problemFields five"><label>a₀ (nm)<input id="probSpacingA" inputmode="decimal" value="0.4049"></label><label>h<input id="probSpacingH" inputmode="numeric" value="1"></label><label>k<input id="probSpacingK" inputmode="numeric" value="1"></label><label>l<input id="probSpacingL" inputmode="numeric" value="1"></label><label>Output<select id="probSpacingUnit"><option value="nm">nm</option><option value="A">Å</option></select></label></div>
          <button class="problemSolve" id="probSpacingSolve" type="button">Calculate dₕₖₗ</button>
          <div class="problemOutput" id="probSpacingOut">Assignment Q4(b) values are preloaded.</div>
        </section>
      </div>`;

    qa("[data-geom-preset]", host).forEach((b) => b.addEventListener("click", () => {
      if (b.dataset.geomPreset === "fe") {
        $("probGeomStructure").value = "bcc"; $("probGeomKnown").value = "a"; $("probGeomValue").value = "0.2866"; $("probGeomUnit").value = "nm";
      } else {
        $("probGeomStructure").value = "fcc"; $("probGeomKnown").value = "r"; $("probGeomValue").value = "1.278"; $("probGeomUnit").value = "A";
      }
      $("probGeomSolve").click();
    }));
    $("probGeomSolve").addEventListener("click", () => {
      const structure = $("probGeomStructure").value, known = $("probGeomKnown").value, unit = $("probGeomUnit").value;
      const raw = number("probGeomValue");
      if (!(raw > 0)) return output("probGeomOut", "Enter a positive length.", true);
      const valueNm = unit === "A" ? raw / 10 : raw;
      let aNm, rNm, relation;
      if (structure === "bcc") {
        relation = "√3a₀ = 4r";
        if (known === "a") { aNm = valueNm; rNm = Math.sqrt(3) * aNm / 4; }
        else { rNm = valueNm; aNm = 4 * rNm / Math.sqrt(3); }
      } else {
        relation = "√2a₀ = 4r ⇒ a₀ = 2√2r";
        if (known === "a") { aNm = valueNm; rNm = aNm / (2 * Math.sqrt(2)); }
        else { rNm = valueNm; aNm = 2 * Math.sqrt(2) * rNm; }
      }
      const conversion = unit === "A" ? `${raw} Å × 0.1 = ${fmt(valueNm)} nm` : `${raw} nm`;
      const substitution = known === "a" ? (structure === "bcc" ? `r = √3(${fmt(aNm)})/4` : `r = ${fmt(aNm)}/(2√2)`) : (structure === "bcc" ? `a₀ = 4(${fmt(rNm)})/√3` : `a₀ = 2√2(${fmt(rNm)})`);
      output("probGeomOut", `<b>${relation}</b><span>1. Units: ${conversion}</span><span>2. Substitute: ${substitution}</span><strong>a₀ = ${fmt(aNm)} nm = ${fmt(aNm*10)} Å<br>r = ${fmt(rNm)} nm = ${fmt(rNm*10)} Å</strong>`);
    });
    $("probDensityPreset").addEventListener("click", () => { $("probDensityN").value="2"; $("probDensityM").value="39.09"; $("probDensityA").value=""; $("probDensityRho").value="0.855"; $("probAFromDensity").click(); });
    $("probDensityFromA").addEventListener("click", () => {
      const n=number("probDensityN"), M=number("probDensityM"), aNm=number("probDensityA");
      if (!(n>0 && M>0 && aNm>0)) return output("probDensityOut","Enter positive n, M, and a₀.",true);
      const aCm=aNm*1e-7, rho=n*M/(6.022e23*aCm**3);
      output("probDensityOut", `<b>ρ = nM/(Nₐa₀³)</b><span>1. a₀ = ${fmt(aNm)} nm × 10⁻⁷ = ${aCm.toExponential(6)} cm</span><span>2. Substitute into ρ = nM/(Nₐa₀³)</span><strong>ρ = ${fmt(rho)} g/cm³</strong>`);
    });
    $("probAFromDensity").addEventListener("click", () => {
      const n=number("probDensityN"), M=number("probDensityM"), rho=number("probDensityRho");
      if (!(n>0 && M>0 && rho>0)) return output("probDensityOut","Enter positive n, M, and ρ.",true);
      const aCm=Math.cbrt(n*M/(rho*6.022e23)), aNm=aCm*1e7, rBcc=Math.sqrt(3)*aNm/4;
      output("probDensityOut", `<b>a₀ = [nM/(ρNₐ)]<sup>1/3</sup></b><span>1. a₀³ = (${fmt(n)})(${fmt(M)})/[(${fmt(rho)})(6.022×10²³)]</span><span>2. a₀ = ${aCm.toExponential(6)} cm</span><span>3. Convert cm → nm: ×10⁷</span><span>4. BCC radius: r = √3a₀/4</span><strong>a₀ = ${fmt(aNm)} nm<br>r = ${fmt(rBcc)} nm</strong>`);
    });
    $("probPlanarPreset").addEventListener("click", () => { $("probPlanarA").value="0.35167"; $("probPlanarDensity").click(); });
    $("probPlanarDensity").addEventListener("click", () => {
      const a=number("probPlanarA");
      if (!(a>0)) return output("probPlanarOut","Enter a positive FCC lattice parameter.",true);
      const pdNm=2/(a*a), pdCm=pdNm*1e14;
      output("probPlanarOut", `<b>FCC (100): PD = 2/a₀²</b><span>PD = 2/(${fmt(a)} nm)²</span><span>1 nm² = 10⁻¹⁴ cm²</span><strong>PD = ${fmt(pdNm)} atoms/nm²<br>PD = ${pdCm.toExponential(6)} atoms/cm²</strong>`);
    });
    $("probPpf").addEventListener("click", () => {
      const ppf=Math.PI/(2*Math.sqrt(3));
      output("probPlanarOut", `<b>FCC (111): PPF = π/(2√3)</b><span>Triangular close-packed 2D arrangement.</span><strong>PPF = ${fmt(ppf)} = ${fmt(ppf*100)}%</strong><span>Yes — {111} is the close-packed plane family in FCC.</span>`);
    });
    $("probMillerPreset").addEventListener("click", () => { $("probMillerX").value="1"; $("probMillerY").value="2"; $("probMillerZ").value="∞"; $("probMillerSolve").click(); });
    $("probMillerSolve").addEventListener("click", () => {
      const raws=[$("probMillerX").value,$("probMillerY").value,$("probMillerZ").value], r=millerFromIntercepts(raws);
      if (r.error) return output("probMillerOut",r.error,true);
      const reciprocals=r.reciprocals.map((x)=>x.n===0?"0":(x.d===1?String(x.n):`${x.n}/${x.d}`)).join(", ");
      output("probMillerOut", `<b>Plane-index procedure</b><span>1. Intercepts: ${raws.map(safe).join(", ")}</span><span>2. Reciprocals: ${reciprocals}</span><span>3. Clear fractions by ×${r.scale}.</span><span>4. Do <strong>not</strong> divide out a common integer factor afterward in this course convention.</span><strong>(hkl) = ${millerText(r.indices)}</strong>`);
    });
    qa("[data-spacing]", host).forEach((b)=>b.addEventListener("click",()=>{
      $("probSpacingA").value="0.4049";
      if(b.dataset.spacing==="220"){ $("probSpacingH").value="2"; $("probSpacingK").value="2"; $("probSpacingL").value="0"; }
      else { $("probSpacingH").value="1"; $("probSpacingK").value="1"; $("probSpacingL").value="1"; }
      $("probSpacingSolve").click();
    }));
    $("probSpacingSolve").addEventListener("click",()=>{
      const a=number("probSpacingA"),h=number("probSpacingH"),k=number("probSpacingK"),l=number("probSpacingL");
      if(!(a>0)||![h,k,l].every(Number.isFinite)||(h===0&&k===0&&l===0)) return output("probSpacingOut","Enter a positive a₀ and a nonzero (hkl).",true);
      const denom=Math.sqrt(h*h+k*k+l*l),dNm=a/denom,unit=$("probSpacingUnit").value,final=unit==="A"?dNm*10:dNm;
      output("probSpacingOut", `<b>dₕₖₗ = a₀/√(h²+k²+l²)</b><span>d = ${fmt(a)}/√(${h}²+${k}²+${l}²) = ${fmt(a)}/${fmt(denom)}</span><strong>d<sub>${h}${k}${l}</sub> = ${fmt(final)} ${unit==="A"?"Å":"nm"}</strong>`);
    });
  }
  render();
  document.querySelector('[data-tab="problem"]')?.addEventListener("click", render);
})();
