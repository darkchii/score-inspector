import { clamp } from "lodash"

const erv_inv_imp_an = [Number("-0.000508781949658280665617"), Number("-0.00836874819741736770379"), Number("0.0334806625409744615033"), Number("-0.0126926147662974029034"), Number("-0.0365637971411762664006"), Number("0.0219878681111168899165"), Number("0.00822687874676915743155"), Number("-0.00538772965071242932965")]
const erv_inv_imp_ad = [Number("1"), Number("-0.970005043303290640362"), Number("-1.56574558234175846809"), Number("1.56221558398423026363"), Number("0.662328840472002992063"), Number("-0.71228902341542847553"), Number("-0.0527396382340099713954"), Number("0.0795283687341571680018"), Number("-0.00233393759374190016776"), Number("0.000886216390456424707504")]
const erv_inv_imp_bn = [Number("-0.202433508355938759655"), Number("0.105264680699391713268"), Number("8.37050328343119927838"), Number("17.6447298408374015486"), Number("-18.8510648058714251895"), Number("-44.6382324441786960818"), Number("17.445385985570866523"), Number("21.1294655448340526258"), Number("-3.67192254707729348546")]
const erv_inv_imp_bd = [Number("1"), Number("6.24264124854247537712"), Number("3.9713437953343869095"), Number("-28.6608180499800029974"), Number("-20.1432634680485188801"), Number("48.5609213108739935468"), Number("10.8268667355460159008"), Number("-22.6436933413139721736"), Number("1.72114765761200282724")]
const erv_inv_imp_cn = [Number("-0.131102781679951906451"), Number("-0.163794047193317060787"), Number("0.117030156341995252019"), Number("0.387079738972604337464"), Number("0.337785538912035898924"), Number("0.142869534408157156766"), Number("0.0290157910005329060432"), Number("0.00214558995388805277169"), Number("-0.000000679465575181126350155"), Number("0.000000285225331782217055858"), Number("-0.0000000681149956853776992068")]
const erv_inv_imp_cd = [Number("1"), Number("3.46625407242567245975"), Number("5.38168345707006855425"), Number("4.77846592945843778382"), Number("2.59301921623620271374"), Number("0.848854343457902036425"), Number("0.152264338295331783612"), Number("0.01105924229346489121")]
const erv_inv_imp_dn = [Number("-0.0350353787183177984712"), Number("-0.00222426529213447927281"), Number("0.0185573306514231072324"), Number("0.00950804701325919603619"), Number("0.00187123492819559223345"), Number("0.000157544617424960554631"), Number("0.460469890584317994083e-5"), Number("-0.230404776911882601748e-9"), Number("0.266339227425782031962e-11")]
const erv_inv_imp_dd = [Number("1"), Number("1.3653349817554063097"), Number("0.762059164553623404043"), Number("0.220091105764131249824"), Number("0.0341589143670947727934"), Number("0.00263861676657015992959"), Number("0.764675292302794483503e-4")]
const erv_inv_imp_en = [Number("-0.0167431005076633737133"), Number("-0.00112951438745580278863"), Number("0.00105628862152492910091"), Number("0.000209386317487588078668"), Number("0.000014962 4783758342370182"), Number("0.000000449696789927706453732"), Number("0.0000000462596163522878599135"), Number("-0.0000000281128735628831791805"), Number("0.000000000000099055709973310326855"), Number("0.00000000000000099055709973310326855")]
const erv_inv_imp_ed = [Number("1"), Number("0.591429344886417493481"), Number("0.138151865749083321638"), Number("0.0160746087093676504695"), Number("0.000964011 807005165528527"), Number("0.275335474764726041141e-4"), Number("0.282243172016108031869e-6")]
const erv_inv_imp_fn = [Number("-0.0024978212791898131227"), Number("-0.779190719229053954292e-5"), Number("0.254723037 413027451751e-4"), Number("0.162397777342510920873e-5"), Number("0.396341011304801168516e-7"), Number("0.411632831190944208473e-9"), Number("0.145596286718675035587e-11"), Number("-0.116765012397184275695e-17")]
const erv_inv_imp_fd = [Number("1"), Number("0.207123112 214422517181"), Number("0.0169410838120975906478"), Number("0.000690538 265622684595676"), Number("0.145007359818232637924e-4"), Number("0.144437756628144157666e-6"), Number("0.509761276599778486139e-9")]
const erv_inv_imp_gn = [Number("-0.000539042911019078575891"), Number("-0.28398759004727721098e-6"), Number("0.899465114892291446442e-6"), Number("0.229345859265920864296e-7"), Number("0.225561444863500149219e-9"), Number("0.947846627503022684216e-12"), Number("0.135880130108924861008e-14"), Number("-0.348890393399948882918e-21")]
const erv_inv_imp_gd = [Number("1"), Number("0.084574623 4001899436914"), Number("0.00282092984726264681981"), Number("0.468292921 940894236786e-4"), Number("0.399968812193862100054e-6"), Number("0.161809290887904476097e-8"), Number("0.231558608310259605225e-11")]

class DifficultyCalculationUtils {
    static ErfInv(z) {
        if (z === 0) return 0;

        if (z >= 1) return Infinity;

        if (z <= -1) return -Infinity;

        let p, q, s;

        if (z < 0) {
            p = -z;
            q = 1 - p;
            s = -1;
        } else {
            p = z;
            q = 1 - z;
            s = 1;
        }

        return DifficultyCalculationUtils.ErfInvImpl(p, q, s);
    }

    static ErfInvImpl(p, q, s) {
        let result;

        if (p <= 0.5) {
            const y = 0.0891314744949340820313;
            let g = p * (p + 10);
            let r = DifficultyCalculationUtils.evaluatePolynomial(p, erv_inv_imp_an) / DifficultyCalculationUtils.evaluatePolynomial(p, erv_inv_imp_ad);
            result = (g * y) + (g * r);
        } else if (q >= 0.25) {
            const y = 2.249481201171875;
            let g = Math.sqrt(-2 * Math.log(q));
            let xs = q - 0.25;
            let r = DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_bn) / DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_bd);
            result = g / (y + r);
        } else {
            let x = Math.sqrt(-Math.log(q));
            if (x < 3) {
                const y = 0.807220458984375;
                let xs = x - 1.125;
                let r = DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_cn) / DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_cd);
                result = (y * x) + (r * x);
            } else if (x < 6) {
                const y = 0.93995571136474609375;
                let xs = x - 3;
                let r = DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_dn) / DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_dd);
                result = (y * x) + (r * x);
            } else if (x < 18) {
                const y = 0.98362827301025390625;
                let xs = x - 6;
                let r = DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_en) / DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_ed);
                result = (y * x) + (r * x);
            } else if (x < 44) {
                const y = 0.99714565277099609375;
                let xs = x - 18;
                let r = DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_fn) / DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_fd);
                result = (y * x) + (r * x);
            } else {
                const y = 0.99941349029541015625;
                let xs = x - 44;
                let r = DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_gn) / DifficultyCalculationUtils.evaluatePolynomial(xs, erv_inv_imp_gd);
                result = (y * x) + (r * x);
            }
        }

        return s * result;
    }

    static evaluatePolynomial(z, coefficients) {
        if (coefficients === undefined || coefficients.length === 0) {
            throw new Error("Coefficients array is empty");
        }

        let n = coefficients.length;

        if (n === 0) {
            return 0;
        }

        let sum = coefficients[n - 1];

        for (let i = n - 2; i >= 0; --i) {
            sum *= z;
            sum += coefficients[i];
        }

        return sum;
    }

    static ReverseLerp(x, start, end) {
        return clamp((x - start) / (end - start), 0.0, 1.0);
    }

    static Lerp(start, end, t) {
        return start + (end - start) * t;
    }
}

export default DifficultyCalculationUtils;