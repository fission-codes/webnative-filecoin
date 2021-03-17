import * as wasm from './filecoin_signer_wasm_bg.wasm';

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_28(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4f6ae57296faf0c1(arg0, arg1, addHeapObject(arg2));
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
* @returns {string}
*/
export function generateMnemonic() {
    try {
        const retptr = wasm.__wbindgen_export_4.value - 16;
        wasm.__wbindgen_export_4.value = retptr;
        wasm.generateMnemonic(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_export_4.value += 16;
        wasm.__wbindgen_free(r0, r1);
    }
}

/**
* @param {string} mnemonic
* @param {string} path
* @param {string} password
* @param {string | undefined} language_code
* @returns {ExtendedKey}
*/
export function keyDerive(mnemonic, path, password, language_code) {
    var ptr0 = passStringToWasm0(mnemonic, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = isLikeNone(language_code) ? 0 : passStringToWasm0(language_code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ret = wasm.keyDerive(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3);
    return ExtendedKey.__wrap(ret);
}

/**
* @param {any} seed
* @param {string} path
* @returns {ExtendedKey}
*/
export function keyDeriveFromSeed(seed, path) {
    var ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.keyDeriveFromSeed(addHeapObject(seed), ptr0, len0);
    return ExtendedKey.__wrap(ret);
}

/**
* @param {any} private_key_js
* @param {boolean} testnet
* @returns {ExtendedKey}
*/
export function keyRecover(private_key_js, testnet) {
    var ret = wasm.keyRecover(addHeapObject(private_key_js), testnet);
    return ExtendedKey.__wrap(ret);
}

/**
* @param {any} private_key_js
* @param {boolean} testnet
* @returns {ExtendedKey}
*/
export function keyRecoverBLS(private_key_js, testnet) {
    var ret = wasm.keyRecoverBLS(addHeapObject(private_key_js), testnet);
    return ExtendedKey.__wrap(ret);
}

/**
* @param {any} message
* @returns {string}
*/
export function transactionSerialize(message) {
    try {
        const retptr = wasm.__wbindgen_export_4.value - 16;
        wasm.__wbindgen_export_4.value = retptr;
        wasm.transactionSerialize(retptr, addHeapObject(message));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_export_4.value += 16;
        wasm.__wbindgen_free(r0, r1);
    }
}

/**
* @param {any} unsigned_message
* @returns {Uint8Array}
*/
export function transactionSerializeRaw(unsigned_message) {
    try {
        const retptr = wasm.__wbindgen_export_4.value - 16;
        wasm.__wbindgen_export_4.value = retptr;
        wasm.transactionSerializeRaw(retptr, addHeapObject(unsigned_message));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
    } finally {
        wasm.__wbindgen_export_4.value += 16;
    }
}

/**
* @param {any} cbor_js
* @param {boolean} testnet
* @returns {any}
*/
export function transactionParse(cbor_js, testnet) {
    var ret = wasm.transactionParse(addHeapObject(cbor_js), testnet);
    return takeObject(ret);
}

/**
* @param {any} unsigned_tx_js
* @param {any} private_key_js
* @returns {any}
*/
export function transactionSign(unsigned_tx_js, private_key_js) {
    var ret = wasm.transactionSign(addHeapObject(unsigned_tx_js), addHeapObject(private_key_js));
    return takeObject(ret);
}

/**
* @param {any} unsigned_tx_js
* @param {any} private_key_js
* @returns {string}
*/
export function transactionSignLotus(unsigned_tx_js, private_key_js) {
    try {
        const retptr = wasm.__wbindgen_export_4.value - 16;
        wasm.__wbindgen_export_4.value = retptr;
        wasm.transactionSignLotus(retptr, addHeapObject(unsigned_tx_js), addHeapObject(private_key_js));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_export_4.value += 16;
        wasm.__wbindgen_free(r0, r1);
    }
}

/**
* @param {any} unsigned_tx_js
* @param {any} private_key_js
* @returns {any}
*/
export function transactionSignRaw(unsigned_tx_js, private_key_js) {
    var ret = wasm.transactionSignRaw(addHeapObject(unsigned_tx_js), addHeapObject(private_key_js));
    return takeObject(ret);
}

/**
* @param {any} signature_js
* @param {any} message_js
* @returns {boolean}
*/
export function verifySignature(signature_js, message_js) {
    var ret = wasm.verifySignature(addHeapObject(signature_js), addHeapObject(message_js));
    return ret !== 0;
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4);
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
* @param {string} sender_address
* @param {any[]} addresses
* @param {string} value
* @param {number} required
* @param {number} nonce
* @param {string} duration
* @param {string} start_epoch
* @param {string} gas_limit
* @param {string} gas_fee_cap
* @param {string} gas_premium
* @returns {any}
*/
export function createMultisigWithFee(sender_address, addresses, value, required, nonce, duration, start_epoch, gas_limit, gas_fee_cap, gas_premium) {
    var ptr0 = passStringToWasm0(sender_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArrayJsValueToWasm0(addresses, wasm.__wbindgen_malloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(duration, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(start_epoch, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ptr5 = passStringToWasm0(gas_limit, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len5 = WASM_VECTOR_LEN;
    var ptr6 = passStringToWasm0(gas_fee_cap, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len6 = WASM_VECTOR_LEN;
    var ptr7 = passStringToWasm0(gas_premium, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len7 = WASM_VECTOR_LEN;
    var ret = wasm.createMultisigWithFee(ptr0, len0, ptr1, len1, ptr2, len2, required, nonce, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6, ptr7, len7);
    return takeObject(ret);
}

/**
* @param {string} sender_address
* @param {any[]} addresses
* @param {string} value
* @param {number} required
* @param {number} nonce
* @param {string} duration
* @param {string} start_epoch
* @returns {any}
*/
export function createMultisig(sender_address, addresses, value, required, nonce, duration, start_epoch) {
    var ptr0 = passStringToWasm0(sender_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passArrayJsValueToWasm0(addresses, wasm.__wbindgen_malloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(value, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(duration, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(start_epoch, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ret = wasm.createMultisig(ptr0, len0, ptr1, len1, ptr2, len2, required, nonce, ptr3, len3, ptr4, len4);
    return takeObject(ret);
}

/**
* @param {string} multisig_address
* @param {string} to_address
* @param {string} from_address
* @param {string} amount
* @param {number} nonce
* @param {string} gas_limit
* @param {string} gas_fee_cap
* @param {string} gas_premium
* @returns {any}
*/
export function proposeMultisigWithFee(multisig_address, to_address, from_address, amount, nonce, gas_limit, gas_fee_cap, gas_premium) {
    var ptr0 = passStringToWasm0(multisig_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(to_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(gas_limit, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ptr5 = passStringToWasm0(gas_fee_cap, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len5 = WASM_VECTOR_LEN;
    var ptr6 = passStringToWasm0(gas_premium, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len6 = WASM_VECTOR_LEN;
    var ret = wasm.proposeMultisigWithFee(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, nonce, ptr4, len4, ptr5, len5, ptr6, len6);
    return takeObject(ret);
}

/**
* @param {string} multisig_address
* @param {string} to_address
* @param {string} from_address
* @param {string} amount
* @param {number} nonce
* @returns {any}
*/
export function proposeMultisig(multisig_address, to_address, from_address, amount, nonce) {
    var ptr0 = passStringToWasm0(multisig_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(to_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ret = wasm.proposeMultisig(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, nonce);
    return takeObject(ret);
}

/**
* @param {string} multisig_address
* @param {number} message_id
* @param {string} proposer_address
* @param {string} to_address
* @param {string} amount
* @param {string} from_address
* @param {number} nonce
* @param {string} gas_limit
* @param {string} gas_fee_cap
* @param {string} gas_premium
* @returns {any}
*/
export function approveMultisigWithFee(multisig_address, message_id, proposer_address, to_address, amount, from_address, nonce, gas_limit, gas_fee_cap, gas_premium) {
    var ptr0 = passStringToWasm0(multisig_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(proposer_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(to_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ptr5 = passStringToWasm0(gas_limit, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len5 = WASM_VECTOR_LEN;
    var ptr6 = passStringToWasm0(gas_fee_cap, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len6 = WASM_VECTOR_LEN;
    var ptr7 = passStringToWasm0(gas_premium, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len7 = WASM_VECTOR_LEN;
    var ret = wasm.approveMultisigWithFee(ptr0, len0, message_id, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, nonce, ptr5, len5, ptr6, len6, ptr7, len7);
    return takeObject(ret);
}

/**
* @param {string} multisig_address
* @param {number} message_id
* @param {string} proposer_address
* @param {string} to_address
* @param {string} amount
* @param {string} from_address
* @param {number} nonce
* @returns {any}
*/
export function approveMultisig(multisig_address, message_id, proposer_address, to_address, amount, from_address, nonce) {
    var ptr0 = passStringToWasm0(multisig_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(proposer_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(to_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ret = wasm.approveMultisig(ptr0, len0, message_id, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, nonce);
    return takeObject(ret);
}

/**
* @param {string} multisig_address
* @param {number} message_id
* @param {string} proposer_address
* @param {string} to_address
* @param {string} amount
* @param {string} from_address
* @param {number} nonce
* @param {string} gas_limit
* @param {string} gas_fee_cap
* @param {string} gas_premium
* @returns {any}
*/
export function cancelMultisigWithFee(multisig_address, message_id, proposer_address, to_address, amount, from_address, nonce, gas_limit, gas_fee_cap, gas_premium) {
    var ptr0 = passStringToWasm0(multisig_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(proposer_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(to_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ptr5 = passStringToWasm0(gas_limit, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len5 = WASM_VECTOR_LEN;
    var ptr6 = passStringToWasm0(gas_fee_cap, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len6 = WASM_VECTOR_LEN;
    var ptr7 = passStringToWasm0(gas_premium, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len7 = WASM_VECTOR_LEN;
    var ret = wasm.cancelMultisigWithFee(ptr0, len0, message_id, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, nonce, ptr5, len5, ptr6, len6, ptr7, len7);
    return takeObject(ret);
}

/**
* @param {string} multisig_address
* @param {number} message_id
* @param {string} proposer_address
* @param {string} to_address
* @param {string} amount
* @param {string} from_address
* @param {number} nonce
* @returns {any}
*/
export function cancelMultisig(multisig_address, message_id, proposer_address, to_address, amount, from_address, nonce) {
    var ptr0 = passStringToWasm0(multisig_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(proposer_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(to_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ret = wasm.cancelMultisig(ptr0, len0, message_id, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, nonce);
    return takeObject(ret);
}

/**
* @param {string} from_address
* @param {string} to_address
* @param {string} amount
* @param {number} nonce
* @param {string} gas_limit
* @param {string} gas_fee_cap
* @param {string} gas_premium
* @returns {any}
*/
export function createPymtChanWithFee(from_address, to_address, amount, nonce, gas_limit, gas_fee_cap, gas_premium) {
    var ptr0 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(to_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(gas_limit, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(gas_fee_cap, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ptr5 = passStringToWasm0(gas_premium, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len5 = WASM_VECTOR_LEN;
    var ret = wasm.createPymtChanWithFee(ptr0, len0, ptr1, len1, ptr2, len2, nonce, ptr3, len3, ptr4, len4, ptr5, len5);
    return takeObject(ret);
}

/**
* @param {string} from_address
* @param {string} to_address
* @param {string} amount
* @param {number} nonce
* @returns {any}
*/
export function createPymtChan(from_address, to_address, amount, nonce) {
    var ptr0 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(to_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ret = wasm.createPymtChan(ptr0, len0, ptr1, len1, ptr2, len2, nonce);
    return takeObject(ret);
}

/**
* @param {string} pch_address
* @param {string} from_address
* @param {number} nonce
* @param {string} gas_limit
* @param {string} gas_fee_cap
* @param {string} gas_premium
* @returns {any}
*/
export function settlePymtChanWithFee(pch_address, from_address, nonce, gas_limit, gas_fee_cap, gas_premium) {
    var ptr0 = passStringToWasm0(pch_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(gas_limit, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(gas_fee_cap, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(gas_premium, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ret = wasm.settlePymtChanWithFee(ptr0, len0, ptr1, len1, nonce, ptr2, len2, ptr3, len3, ptr4, len4);
    return takeObject(ret);
}

/**
* @param {string} pch_address
* @param {string} from_address
* @param {number} nonce
* @returns {any}
*/
export function settlePymtChan(pch_address, from_address, nonce) {
    var ptr0 = passStringToWasm0(pch_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.settlePymtChan(ptr0, len0, ptr1, len1, nonce);
    return takeObject(ret);
}

/**
* @param {string} pch_address
* @param {string} from_address
* @param {number} nonce
* @param {string} gas_limit
* @param {string} gas_fee_cap
* @param {string} gas_premium
* @returns {any}
*/
export function collectPymtChanWithFee(pch_address, from_address, nonce, gas_limit, gas_fee_cap, gas_premium) {
    var ptr0 = passStringToWasm0(pch_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(gas_limit, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(gas_fee_cap, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(gas_premium, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ret = wasm.collectPymtChanWithFee(ptr0, len0, ptr1, len1, nonce, ptr2, len2, ptr3, len3, ptr4, len4);
    return takeObject(ret);
}

/**
* @param {string} pch_address
* @param {string} from_address
* @param {number} nonce
* @returns {any}
*/
export function collectPymtChan(pch_address, from_address, nonce) {
    var ptr0 = passStringToWasm0(pch_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.collectPymtChan(ptr0, len0, ptr1, len1, nonce);
    return takeObject(ret);
}

/**
* @param {string} pch_address
* @param {string} from_address
* @param {string} signed_voucher
* @param {number} nonce
* @param {string} gas_limit
* @param {string} gas_fee_cap
* @param {string} gas_premium
* @returns {any}
*/
export function updatePymtChanWithFee(pch_address, from_address, signed_voucher, nonce, gas_limit, gas_fee_cap, gas_premium) {
    var ptr0 = passStringToWasm0(pch_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(signed_voucher, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(gas_limit, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(gas_fee_cap, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ptr5 = passStringToWasm0(gas_premium, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len5 = WASM_VECTOR_LEN;
    var ret = wasm.updatePymtChanWithFee(ptr0, len0, ptr1, len1, ptr2, len2, nonce, ptr3, len3, ptr4, len4, ptr5, len5);
    return takeObject(ret);
}

/**
* @param {string} pch_address
* @param {string} from_address
* @param {string} signed_voucher
* @param {number} nonce
* @returns {any}
*/
export function updatePymtChan(pch_address, from_address, signed_voucher, nonce) {
    var ptr0 = passStringToWasm0(pch_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(from_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(signed_voucher, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ret = wasm.updatePymtChan(ptr0, len0, ptr1, len1, ptr2, len2, nonce);
    return takeObject(ret);
}

/**
* @param {string} voucher
* @param {any} private_key_js
* @returns {any}
*/
export function signVoucher(voucher, private_key_js) {
    var ptr0 = passStringToWasm0(voucher, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.signVoucher(ptr0, len0, addHeapObject(private_key_js));
    return takeObject(ret);
}

/**
* @param {string} payment_channel_address
* @param {string} time_lock_min
* @param {string} time_lock_max
* @param {string} amount
* @param {string} lane
* @param {number} nonce
* @param {string} min_settle_height
* @returns {any}
*/
export function createVoucher(payment_channel_address, time_lock_min, time_lock_max, amount, lane, nonce, min_settle_height) {
    var ptr0 = passStringToWasm0(payment_channel_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(time_lock_min, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ptr2 = passStringToWasm0(time_lock_max, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len2 = WASM_VECTOR_LEN;
    var ptr3 = passStringToWasm0(amount, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len3 = WASM_VECTOR_LEN;
    var ptr4 = passStringToWasm0(lane, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len4 = WASM_VECTOR_LEN;
    var ptr5 = passStringToWasm0(min_settle_height, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len5 = WASM_VECTOR_LEN;
    var ret = wasm.createVoucher(ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, nonce, ptr5, len5);
    return takeObject(ret);
}

/**
* @param {any} params_value
* @returns {Uint8Array}
*/
export function serializeParams(params_value) {
    try {
        const retptr = wasm.__wbindgen_export_4.value - 16;
        wasm.__wbindgen_export_4.value = retptr;
        wasm.serializeParams(retptr, addHeapObject(params_value));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v0 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v0;
    } finally {
        wasm.__wbindgen_export_4.value += 16;
    }
}

/**
* @param {string} params_base64
* @param {string} actor_type
* @param {number} method
* @returns {any}
*/
export function deserializeParams(params_base64, actor_type, method) {
    var ptr0 = passStringToWasm0(params_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(actor_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.deserializeParams(ptr0, len0, ptr1, len1, method);
    return takeObject(ret);
}

/**
* @param {string} params_base64
* @param {string} code_cid
* @returns {any}
*/
export function deserializeConstructorParams(params_base64, code_cid) {
    var ptr0 = passStringToWasm0(params_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(code_cid, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.deserializeConstructorParams(ptr0, len0, ptr1, len1);
    return takeObject(ret);
}

/**
* @param {string} voucher_base64
* @param {string} address_signer
* @returns {boolean}
*/
export function verifyVoucherSignature(voucher_base64, address_signer) {
    var ptr0 = passStringToWasm0(voucher_base64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(address_signer, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.verifyVoucherSignature(ptr0, len0, ptr1, len1);
    return ret !== 0;
}

/**
* @param {any} message
* @returns {string}
*/
export function getCid(message) {
    try {
        const retptr = wasm.__wbindgen_export_4.value - 16;
        wasm.__wbindgen_export_4.value = retptr;
        wasm.getCid(retptr, addHeapObject(message));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        return getStringFromWasm0(r0, r1);
    } finally {
        wasm.__wbindgen_export_4.value += 16;
        wasm.__wbindgen_free(r0, r1);
    }
}

/**
* @param {any} transport_wrapper
* @returns {any}
*/
export function getVersion(transport_wrapper) {
    var ret = wasm.getVersion(addHeapObject(transport_wrapper));
    return takeObject(ret);
}

/**
* @param {string} path
* @param {any} transport_wrapper
* @returns {any}
*/
export function keyRetrieveFromDevice(path, transport_wrapper) {
    var ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.keyRetrieveFromDevice(ptr0, len0, addHeapObject(transport_wrapper));
    return takeObject(ret);
}

/**
* @param {string} path
* @param {any} transport_wrapper
* @returns {any}
*/
export function showKeyOnDevice(path, transport_wrapper) {
    var ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.showKeyOnDevice(ptr0, len0, addHeapObject(transport_wrapper));
    return takeObject(ret);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Uint8Array} message
* @param {string} path
* @param {any} transport_wrapper
* @returns {any}
*/
export function transactionSignRawWithDevice(message, path, transport_wrapper) {
    var ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    var ret = wasm.transactionSignRawWithDevice(ptr0, len0, ptr1, len1, addHeapObject(transport_wrapper));
    return takeObject(ret);
}

/**
* @param {any} unsigned_tx_js
* @param {string} path
* @param {any} transport_wrapper
* @returns {any}
*/
export function transactionSignWithDevice(unsigned_tx_js, path, transport_wrapper) {
    var ptr0 = passStringToWasm0(path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.transactionSignWithDevice(addHeapObject(unsigned_tx_js), ptr0, len0, addHeapObject(transport_wrapper));
    return takeObject(ret);
}

/**
* @param {any} transport_wrapper
* @returns {any}
*/
export function appInfo(transport_wrapper) {
    var ret = wasm.appInfo(addHeapObject(transport_wrapper));
    return takeObject(ret);
}

/**
* @param {any} transport_wrapper
* @returns {any}
*/
export function deviceInfo(transport_wrapper) {
    var ret = wasm.deviceInfo(addHeapObject(transport_wrapper));
    return takeObject(ret);
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}
function __wbg_adapter_110(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__hec8ad0723b2a63af(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export class ExtendedKey {

    static __wrap(ptr) {
        const obj = Object.create(ExtendedKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_extendedkey_free(ptr);
    }
    /**
    * @returns {Uint8Array}
    */
    get public_raw() {
        try {
            const retptr = wasm.__wbindgen_export_4.value - 16;
            wasm.__wbindgen_export_4.value = retptr;
            wasm.extendedkey_public_raw(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_export_4.value += 16;
        }
    }
    /**
    * @returns {Uint8Array}
    */
    get private_raw() {
        try {
            const retptr = wasm.__wbindgen_export_4.value - 16;
            wasm.__wbindgen_export_4.value = retptr;
            wasm.extendedkey_private_raw(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_export_4.value += 16;
        }
    }
    /**
    * @returns {string}
    */
    get public_hexstring() {
        try {
            const retptr = wasm.__wbindgen_export_4.value - 16;
            wasm.__wbindgen_export_4.value = retptr;
            wasm.extendedkey_public_hexstring(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_4.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get private_hexstring() {
        try {
            const retptr = wasm.__wbindgen_export_4.value - 16;
            wasm.__wbindgen_export_4.value = retptr;
            wasm.extendedkey_private_hexstring(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_4.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get public_base64() {
        try {
            const retptr = wasm.__wbindgen_export_4.value - 16;
            wasm.__wbindgen_export_4.value = retptr;
            wasm.extendedkey_public_base64(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_4.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get private_base64() {
        try {
            const retptr = wasm.__wbindgen_export_4.value - 16;
            wasm.__wbindgen_export_4.value = retptr;
            wasm.extendedkey_private_base64(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_4.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get address() {
        try {
            const retptr = wasm.__wbindgen_export_4.value - 16;
            wasm.__wbindgen_export_4.value = retptr;
            wasm.extendedkey_address(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_export_4.value += 16;
            wasm.__wbindgen_free(r0, r1);
        }
    }
}

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    var ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export const __wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbindgen_json_parse = function(arg0, arg1) {
    var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbindgen_json_serialize = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = JSON.stringify(obj === undefined ? null : obj);
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbg_from_97df795a364445c8 = function(arg0, arg1) {
    var ret = new Buffer(getArrayU8FromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_exchange_6c195caeaf4d0a08 = function(arg0, arg1) {
    var ret = getObject(arg0).exchange(takeObject(arg1));
    return addHeapObject(ret);
};

export const __wbindgen_number_new = function(arg0) {
    var ret = arg0;
    return addHeapObject(ret);
};

export const __wbg_new_59cb74e423758ede = function() {
    var ret = new Error();
    return addHeapObject(ret);
};

export const __wbg_stack_558ba5917b466edd = function(arg0, arg1) {
    var ret = getObject(arg1).stack;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
    try {
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(arg0, arg1);
    }
};

export const __wbindgen_cb_drop = function(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};

export const __wbg_randomFillSync_d2ba53160aec6aba = function(arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
};

export const __wbg_getRandomValues_e57c9b75ddead065 = function(arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
};

export const __wbg_self_86b4b13392c7af56 = handleError(function() {
    var ret = self.self;
    return addHeapObject(ret);
});

export const __wbg_require_f5521a5b85ad2542 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
    return addHeapObject(ret);
};

export const __wbg_crypto_b8c92eaac23d0d80 = function(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

export const __wbg_msCrypto_9ad6677321a08dd8 = function(arg0) {
    var ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

export const __wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export const __wbg_getRandomValues_dd27e6b0652b3236 = function(arg0) {
    var ret = getObject(arg0).getRandomValues;
    return addHeapObject(ret);
};

export const __wbg_static_accessor_MODULE_452b4680e8614c81 = function() {
    var ret = module;
    return addHeapObject(ret);
};

export const __wbg_new_1192d65414040ad9 = function(arg0, arg1) {
    var ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_call_d713ea0274dfc6d2 = handleError(function(arg0, arg1, arg2) {
    var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
});

export const __wbg_new_3e06d4f36713e4cb = function() {
    var ret = new Object();
    return addHeapObject(ret);
};

export const __wbg_new_d0c63652ab4d825c = function(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_110(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        var ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

export const __wbg_reject_5d8c18a490c1b8b2 = function(arg0) {
    var ret = Promise.reject(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_resolve_2529512c3bb73938 = function(arg0) {
    var ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_then_4a7a614abbbe6d81 = function(arg0, arg1) {
    var ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export const __wbg_then_3b7ac098cfda2fa5 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export const __wbg_buffer_49131c283a06686f = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export const __wbg_new_9b295d24cf1d706f = function(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_set_3bb960a9975f3cd2 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export const __wbg_length_2b13641a9d906653 = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

export const __wbg_newwithlength_3c570aeea9a95954 = function(arg0) {
    var ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_subarray_4eaeb3de00cf1955 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_get_0e3f2950cdf758ae = handleError(function(arg0, arg1) {
    var ret = Reflect.get(getObject(arg0), getObject(arg1));
    return addHeapObject(ret);
});

export const __wbg_has_c10fc8c7bef9b293 = handleError(function(arg0, arg1) {
    var ret = Reflect.has(getObject(arg0), getObject(arg1));
    return ret;
});

export const __wbg_set_304f2ec1a3ab3b79 = handleError(function(arg0, arg1, arg2) {
    var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
});

export const __wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

export const __wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

export const __wbindgen_closure_wrapper778 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 191, __wbg_adapter_28);
    return addHeapObject(ret);
};

