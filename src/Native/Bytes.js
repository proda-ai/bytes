/*

import Bytes.Encode as Encode exposing (getWidth, write)
import Elm.Kernel.Scheduler exposing (binding, succeed)
import Elm.Kernel.Utils exposing (Tuple2, chr)
import Maybe exposing (Just, Nothing)

*/

// BYTES

var _proda_ai$elm_bytes$Native_Bytes = function() {
    function width(bytes)
    {
        return bytes.byteLength;
    }

    var getHostEndianness = F2(function(le, be)
    {
        return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback)
        {
            callback(_elm_lang$core$Native_Scheduler.succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
        });
    });


    // ENCODERS

    function encode(encoder)
    {
        var mutableBytes = new DataView(new ArrayBuffer(_proda_ai$elm_bytes$Bytes_Encode$getWidth(encoder)));
        _proda_ai$elm_bytes$Bytes_Encode$write(encoder)(mutableBytes)(0);
        return mutableBytes;
    }


    // SIGNED INTEGERS

    var write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
    var write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
    var write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


    // UNSIGNED INTEGERS

    var write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
    var write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
    var write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


    // FLOATS

    var write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
    var write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


    // BYTES

    var write_bytes = F3(function(mb, offset, bytes)
    {
        for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
        {
            mb.setUint32(offset + i, bytes.getUint32(i));
        }
        for (; i < len; i++)
        {
            mb.setUint8(offset + i, bytes.getUint8(i));
        }
        return offset + len;
    });


    // STRINGS

    function getStringWidth(string)
    {
        for (var width = 0, i = 0; i < string.length; i++)
        {
            var code = string.charCodeAt(i);
            width +=
                (code < 0x80) ? 1 :
                (code < 0x800) ? 2 :
                (code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
        }
        return width;
    }

    var write_string = F3(function(mb, offset, string)
    {
        for (var i = 0; i < string.length; i++)
        {
            var code = string.charCodeAt(i);
            offset +=
                (code < 0x80)
                    ? (mb.setUint8(offset, code)
                    , 1
                    )
                    :
                (code < 0x800)
                    ? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
                        | (code >>> 6 & 0x1F /* 0b00011111 */) << 8
                        | code & 0x3F /* 0b00111111 */)
                    , 2
                    )
                    :
                (code < 0xD800 || 0xDBFF < code)
                    ? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
                        | (code >>> 12 & 0xF /* 0b00001111 */) << 8
                        | code >>> 6 & 0x3F /* 0b00111111 */)
                    , mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
                        | code & 0x3F /* 0b00111111 */)
                    , 3
                    )
                    :
                (code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
                , mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
                    | (code >>> 18 & 0x7 /* 0b00000111 */) << 24
                    | (code >>> 12 & 0x3F /* 0b00111111 */) << 16
                    | (code >>> 6 & 0x3F /* 0b00111111 */) << 8
                    | code & 0x3F /* 0b00111111 */)
                , 4
                );
        }
        return offset;
    });


    // DECODER

    var decode = F2(function(decoder, bytes)
    {
        try {
            return _elm_lang$core$Maybe$Just(A2(decoder, bytes, 0)._1);
        } catch(e) {
            return _elm_lang$core$Maybe$Nothing;
        }
    });

    var read_i8  = F2(function(      bytes, offset) { return _elm_lang$core$Native_Utils.Tuple2(offset + 1, bytes.getInt8(offset)); });
    var read_i16 = F3(function(isLE, bytes, offset) { return _elm_lang$core$Native_Utils.Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
    var read_i32 = F3(function(isLE, bytes, offset) { return _elm_lang$core$Native_Utils.Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
    var read_u8  = F2(function(      bytes, offset) { return _elm_lang$core$Native_Utils.Tuple2(offset + 1, bytes.getUint8(offset)); });
    var read_u16 = F3(function(isLE, bytes, offset) { return _elm_lang$core$Native_Utils.Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
    var read_u32 = F3(function(isLE, bytes, offset) { return _elm_lang$core$Native_Utils.Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
    var read_f32 = F3(function(isLE, bytes, offset) { return _elm_lang$core$Native_Utils.Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
    var read_f64 = F3(function(isLE, bytes, offset) { return _elm_lang$core$Native_Utils.Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

    var read_bytes = F3(function(len, bytes, offset)
    {
        return _elm_lang$core$Native_Utils.Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
    });

    var read_string = F3(function(len, bytes, offset)
    {
        var string = '';
        var end = offset + len;
        for (; offset < end;)
        {
            var byte = bytes.getUint8(offset++);
            string +=
                (byte < 128)
                    ? String.fromCharCode(byte)
                    :
                ((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
                    ? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
                    :
                ((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
                    ? String.fromCharCode(
                        (byte & 0xF /* 0b00001111 */) << 12
                        | (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
                        | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
                    )
                    :
                    (byte =
                        ((byte & 0x7 /* 0b00000111 */) << 18
                            | (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
                            | (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
                            | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
                        ) - 0x10000
                    , String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
                    );
        }
        return _elm_lang$core$Native_Utils.Tuple2(offset, string);
    });

    var decodeFailure = F2(function() { throw 0; });

    return {
        width: width,
        getHostEndianness: getHostEndianness ,
        encode: encode,
        write_i8: write_i8  ,
        write_i16: write_i16 ,
        write_i32: write_i32 ,
        write_u8: write_u8  ,
        write_u16: write_u16 ,
        write_u32: write_u32 ,
        write_f32: write_f32 ,
        write_f64: write_f64 ,
        write_bytes: write_bytes ,
        getStringWidth: getStringWidth,
        write_string: write_string ,
        decode: decode ,
        read_i8: read_i8  ,
        read_i16: read_i16 ,
        read_i32: read_i32 ,
        read_u8: read_u8  ,
        read_u16: read_u16 ,
        read_u32: read_u32 ,
        read_f32: read_f32 ,
        read_f64: read_f64 ,
        read_bytes: read_bytes ,
        read_string: read_string ,
        decodeFailure: decodeFailure
    };

}();
