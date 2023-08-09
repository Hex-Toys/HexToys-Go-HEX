import JSBI from "@pulsex/jsbi";

export const La = 3;
export const R = 1575331200;
export const $a = a => {
    const e = a.length;
    let t = e % 3 || 3, i = a.slice(0, t);
    while (t < e) i += "," + a.slice(t, t += 3);
    return i
};

export const za = (a, e, t, i = La) => {
    if (a.length > e) {
        const l = a.length - e;
        let r = a.slice(0, l);
        if (r.length > 3) {
            if (r = $a(r), i !== e) return t ? [r, "", t] : [r]
        } else if (!e) return t ? [r, "", t] : [r];
        const n = a.slice(l, l + i).padEnd(i, "0"), d = "." + n;
        return t ? [r, d, t] : [r, d]
    }
    return null
}
export const ja = (a, e) => "." + a.padStart(e, "0");
export const Wa = (a, e) => ["0", ja(a, e)];
export const Oa = a => JSBI.isBigInt(a) ? JSBI.toString10U(a) : a.toString();
export const Ja = (a, e, t = La) => ja(a, e).slice(0, t + 1);
export const Qa = (a, e, t = La) => ["0", Ja(a, e, t)], ae = (a, e, t, i = La) => ["0", Ja(a, e, i), t];
export const ee = (a, e, t = La) => za(a, e + 12, "T") || za(a, e + 9, "B") || za(a, e + 6, "M") || za(a, e, null, t) || Qa(a, e, t);
export const ie = (a, e) => za(a, e, null, e) || Wa(a, e);
export const re = (a, e) => ee(a, e);
export const ne = (a, e, t) => te(a, e, t);


export const Re = a => ie(Oa(a), 3);
export const Me = a => ie(Oa(a), 2);
export const ke = a => re(JSBI.toString10U(a), 8);
export const De = a => re(JSBI.toString10U(a), 12);
export const Pe = a => ee(JSBI.toString10U(a), 2, 2)
export const Ei = (a, e) => {return a - e};
export const Ot = a => "" + (a + 1);

export const se = (a, e) => {
    const t = a ? "− " : "+ ";
    return e[0] = t + e[0], e
};
export const ce = a => a < 0 || Object.is(a, -0);
export const de = (a, e, t, i) => a.length + 3 > e || "0" === a ? te(a, e, t) : te(a, 0, i);
export const te = (a, e, t) => za(a, e + 12, "T" + t) || za(a, e + 9, "B" + t) || za(a, e + 6, "M" + t) || za(a, e, t) || ae(a, e, t, La);
export const Ue = a => se(ce(a), re(Math.abs(a).toString(), 8));
export const Ve = a => de(JSBI.toString10U(a), 8, " HEX", " Hearts");
export const Ee = a => se(a.sign, de(JSBI.toString10U(a), 8, " HEX", " Hearts"))
export const _e = (a, e) => ne(JSBI.toString10U(a), 8, e)
export const Xa = a => Math.trunc((a - R) / 86400) + 1;
export const Le = a => `${a.slice(0, 6)}...${a.slice(38)}`;
export const Te = a => se(a.sign, re(JSBI.toString10U(a), 8));