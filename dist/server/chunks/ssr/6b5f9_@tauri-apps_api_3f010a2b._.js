module.exports = {

"[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/dpi.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "LogicalPosition": (()=>LogicalPosition),
    "LogicalSize": (()=>LogicalSize),
    "PhysicalPosition": (()=>PhysicalPosition),
    "PhysicalSize": (()=>PhysicalSize),
    "Position": (()=>Position),
    "Size": (()=>Size)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/core.js [app-ssr] (ecmascript)");
;
// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT
/**
 * A size represented in logical pixels.
 *
 * @since 2.0.0
 */ class LogicalSize {
    constructor(...args){
        this.type = 'Logical';
        if (args.length === 1) {
            if ('Logical' in args[0]) {
                this.width = args[0].Logical.width;
                this.height = args[0].Logical.height;
            } else {
                this.width = args[0].width;
                this.height = args[0].height;
            }
        } else {
            this.width = args[0];
            this.height = args[1];
        }
    }
    /**
     * Converts the logical size to a physical one.
     * @example
     * ```typescript
     * import { LogicalSize } from '@tauri-apps/api/dpi';
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     *
     * const appWindow = getCurrentWindow();
     * const factor = await appWindow.scaleFactor();
     * const size = new LogicalSize(400, 500);
     * const physical = size.toPhysical(factor);
     * ```
     *
     * @since 2.0.0
     */ toPhysical(scaleFactor) {
        return new PhysicalSize(this.width * scaleFactor, this.height * scaleFactor);
    }
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]() {
        return {
            width: this.width,
            height: this.height
        };
    }
    toJSON() {
        // eslint-disable-next-line security/detect-object-injection
        return this[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]();
    }
}
/**
 * A size represented in physical pixels.
 *
 * @since 2.0.0
 */ class PhysicalSize {
    constructor(...args){
        this.type = 'Physical';
        if (args.length === 1) {
            if ('Physical' in args[0]) {
                this.width = args[0].Physical.width;
                this.height = args[0].Physical.height;
            } else {
                this.width = args[0].width;
                this.height = args[0].height;
            }
        } else {
            this.width = args[0];
            this.height = args[1];
        }
    }
    /**
     * Converts the physical size to a logical one.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const appWindow = getCurrentWindow();
     * const factor = await appWindow.scaleFactor();
     * const size = await appWindow.innerSize(); // PhysicalSize
     * const logical = size.toLogical(factor);
     * ```
     */ toLogical(scaleFactor) {
        return new LogicalSize(this.width / scaleFactor, this.height / scaleFactor);
    }
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]() {
        return {
            width: this.width,
            height: this.height
        };
    }
    toJSON() {
        // eslint-disable-next-line security/detect-object-injection
        return this[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]();
    }
}
/**
 * A size represented either in physical or in logical pixels.
 *
 * This type is basically a union type of {@linkcode LogicalSize} and {@linkcode PhysicalSize}
 * but comes in handy when using `tauri::Size` in Rust as an argument to a command, as this class
 * automatically serializes into a valid format so it can be deserialized correctly into `tauri::Size`
 *
 * So instead of
 * ```typescript
 * import { invoke } from '@tauri-apps/api/core';
 * import { LogicalSize, PhysicalSize } from '@tauri-apps/api/dpi';
 *
 * const size: LogicalSize | PhysicalSize = someFunction(); // where someFunction returns either LogicalSize or PhysicalSize
 * const validSize = size instanceof LogicalSize
 *   ? { Logical: { width: size.width, height: size.height } }
 *   : { Physical: { width: size.width, height: size.height } }
 * await invoke("do_something_with_size", { size: validSize });
 * ```
 *
 * You can just use {@linkcode Size}
 * ```typescript
 * import { invoke } from '@tauri-apps/api/core';
 * import { LogicalSize, PhysicalSize, Size } from '@tauri-apps/api/dpi';
 *
 * const size: LogicalSize | PhysicalSize = someFunction(); // where someFunction returns either LogicalSize or PhysicalSize
 * const validSize = new Size(size);
 * await invoke("do_something_with_size", { size: validSize });
 * ```
 *
 * @since 2.1.0
 */ class Size {
    constructor(size){
        this.size = size;
    }
    toLogical(scaleFactor) {
        return this.size instanceof LogicalSize ? this.size : this.size.toLogical(scaleFactor);
    }
    toPhysical(scaleFactor) {
        return this.size instanceof PhysicalSize ? this.size : this.size.toPhysical(scaleFactor);
    }
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]() {
        return {
            [`${this.size.type}`]: {
                width: this.size.width,
                height: this.size.height
            }
        };
    }
    toJSON() {
        // eslint-disable-next-line security/detect-object-injection
        return this[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]();
    }
}
/**
 *  A position represented in logical pixels.
 *
 * @since 2.0.0
 */ class LogicalPosition {
    constructor(...args){
        this.type = 'Logical';
        if (args.length === 1) {
            if ('Logical' in args[0]) {
                this.x = args[0].Logical.x;
                this.y = args[0].Logical.y;
            } else {
                this.x = args[0].x;
                this.y = args[0].y;
            }
        } else {
            this.x = args[0];
            this.y = args[1];
        }
    }
    /**
     * Converts the logical position to a physical one.
     * @example
     * ```typescript
     * import { LogicalPosition } from '@tauri-apps/api/dpi';
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     *
     * const appWindow = getCurrentWindow();
     * const factor = await appWindow.scaleFactor();
     * const position = new LogicalPosition(400, 500);
     * const physical = position.toPhysical(factor);
     * ```
     *
     * @since 2.0.0
     */ toPhysical(scaleFactor) {
        return new PhysicalPosition(this.x * scaleFactor, this.y * scaleFactor);
    }
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]() {
        return {
            x: this.x,
            y: this.y
        };
    }
    toJSON() {
        // eslint-disable-next-line security/detect-object-injection
        return this[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]();
    }
}
/**
 *  A position represented in physical pixels.
 *
 * @since 2.0.0
 */ class PhysicalPosition {
    constructor(...args){
        this.type = 'Physical';
        if (args.length === 1) {
            if ('Physical' in args[0]) {
                this.x = args[0].Physical.x;
                this.y = args[0].Physical.y;
            } else {
                this.x = args[0].x;
                this.y = args[0].y;
            }
        } else {
            this.x = args[0];
            this.y = args[1];
        }
    }
    /**
     * Converts the physical position to a logical one.
     * @example
     * ```typescript
     * import { PhysicalPosition } from '@tauri-apps/api/dpi';
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     *
     * const appWindow = getCurrentWindow();
     * const factor = await appWindow.scaleFactor();
     * const position = new PhysicalPosition(400, 500);
     * const physical = position.toLogical(factor);
     * ```
     *
     * @since 2.0.0
     */ toLogical(scaleFactor) {
        return new LogicalPosition(this.x / scaleFactor, this.y / scaleFactor);
    }
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]() {
        return {
            x: this.x,
            y: this.y
        };
    }
    toJSON() {
        // eslint-disable-next-line security/detect-object-injection
        return this[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]();
    }
}
/**
 * A position represented either in physical or in logical pixels.
 *
 * This type is basically a union type of {@linkcode LogicalSize} and {@linkcode PhysicalSize}
 * but comes in handy when using `tauri::Position` in Rust as an argument to a command, as this class
 * automatically serializes into a valid format so it can be deserialized correctly into `tauri::Position`
 *
 * So instead of
 * ```typescript
 * import { invoke } from '@tauri-apps/api/core';
 * import { LogicalPosition, PhysicalPosition } from '@tauri-apps/api/dpi';
 *
 * const position: LogicalPosition | PhysicalPosition = someFunction(); // where someFunction returns either LogicalPosition or PhysicalPosition
 * const validPosition = position instanceof LogicalPosition
 *   ? { Logical: { x: position.x, y: position.y } }
 *   : { Physical: { x: position.x, y: position.y } }
 * await invoke("do_something_with_position", { position: validPosition });
 * ```
 *
 * You can just use {@linkcode Position}
 * ```typescript
 * import { invoke } from '@tauri-apps/api/core';
 * import { LogicalPosition, PhysicalPosition, Position } from '@tauri-apps/api/dpi';
 *
 * const position: LogicalPosition | PhysicalPosition = someFunction(); // where someFunction returns either LogicalPosition or PhysicalPosition
 * const validPosition = new Position(position);
 * await invoke("do_something_with_position", { position: validPosition });
 * ```
 *
 * @since 2.1.0
 */ class Position {
    constructor(position){
        this.position = position;
    }
    toLogical(scaleFactor) {
        return this.position instanceof LogicalPosition ? this.position : this.position.toLogical(scaleFactor);
    }
    toPhysical(scaleFactor) {
        return this.position instanceof PhysicalPosition ? this.position : this.position.toPhysical(scaleFactor);
    }
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]() {
        return {
            [`${this.position.type}`]: {
                x: this.position.x,
                y: this.position.y
            }
        };
    }
    toJSON() {
        // eslint-disable-next-line security/detect-object-injection
        return this[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SERIALIZE_TO_IPC_FN"]]();
    }
}
;
}}),
"[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/image.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Image": (()=>Image),
    "transformImage": (()=>transformImage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/core.js [app-ssr] (ecmascript)");
;
// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT
/** An RGBA Image in row-major order from top to bottom. */ class Image extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Resource"] {
    /**
     * Creates an Image from a resource ID. For internal use only.
     *
     * @ignore
     */ constructor(rid){
        super(rid);
    }
    /** Creates a new Image using RGBA data, in row-major order from top to bottom, and with specified width and height. */ static async new(rgba, width, height) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:image|new', {
            rgba: transformImage(rgba),
            width,
            height
        }).then((rid)=>new Image(rid));
    }
    /**
     * Creates a new image using the provided bytes by inferring the file format.
     * If the format is known, prefer [@link Image.fromPngBytes] or [@link Image.fromIcoBytes].
     *
     * Only `ico` and `png` are supported (based on activated feature flag).
     *
     * Note that you need the `image-ico` or `image-png` Cargo features to use this API.
     * To enable it, change your Cargo.toml file:
     * ```toml
     * [dependencies]
     * tauri = { version = "...", features = ["...", "image-png"] }
     * ```
     */ static async fromBytes(bytes) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:image|from_bytes', {
            bytes: transformImage(bytes)
        }).then((rid)=>new Image(rid));
    }
    /**
     * Creates a new image using the provided path.
     *
     * Only `ico` and `png` are supported (based on activated feature flag).
     *
     * Note that you need the `image-ico` or `image-png` Cargo features to use this API.
     * To enable it, change your Cargo.toml file:
     * ```toml
     * [dependencies]
     * tauri = { version = "...", features = ["...", "image-png"] }
     * ```
     */ static async fromPath(path) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:image|from_path', {
            path
        }).then((rid)=>new Image(rid));
    }
    /** Returns the RGBA data for this image, in row-major order from top to bottom.  */ async rgba() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:image|rgba', {
            rid: this.rid
        }).then((buffer)=>new Uint8Array(buffer));
    }
    /** Returns the size of this image.  */ async size() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:image|size', {
            rid: this.rid
        });
    }
}
/**
 * Transforms image from various types into a type acceptable by Rust.
 *
 * See [tauri::image::JsImage](https://docs.rs/tauri/2/tauri/image/enum.JsImage.html) for more information.
 * Note the API signature is not stable and might change.
 */ function transformImage(image) {
    const ret = image == null ? null : typeof image === 'string' ? image : image instanceof Image ? image.rid : image;
    return ret;
}
;
}}),
"[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/window.js [app-ssr] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CloseRequestedEvent": (()=>CloseRequestedEvent),
    "Effect": (()=>Effect),
    "EffectState": (()=>EffectState),
    "ProgressBarStatus": (()=>ProgressBarStatus),
    "UserAttentionType": (()=>UserAttentionType),
    "Window": (()=>Window),
    "availableMonitors": (()=>availableMonitors),
    "currentMonitor": (()=>currentMonitor),
    "cursorPosition": (()=>cursorPosition),
    "getAllWindows": (()=>getAllWindows),
    "getCurrentWindow": (()=>getCurrentWindow),
    "monitorFromPoint": (()=>monitorFromPoint),
    "primaryMonitor": (()=>primaryMonitor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/dpi.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/event.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/image.js [app-ssr] (ecmascript)");
;
;
;
;
;
// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT
/**
 * Provides APIs to create windows, communicate with other windows and manipulate the current window.
 *
 * #### Window events
 *
 * Events can be listened to using {@link Window.listen}:
 * ```typescript
 * import { getCurrentWindow } from "@tauri-apps/api/window";
 * getCurrentWindow().listen("my-window-event", ({ event, payload }) => { });
 * ```
 *
 * @module
 */ /**
 * Attention type to request on a window.
 *
 * @since 1.0.0
 */ var UserAttentionType;
(function(UserAttentionType) {
    /**
     * #### Platform-specific
     * - **macOS:** Bounces the dock icon until the application is in focus.
     * - **Windows:** Flashes both the window and the taskbar button until the application is in focus.
     */ UserAttentionType[UserAttentionType["Critical"] = 1] = "Critical";
    /**
     * #### Platform-specific
     * - **macOS:** Bounces the dock icon once.
     * - **Windows:** Flashes the taskbar button until the application is in focus.
     */ UserAttentionType[UserAttentionType["Informational"] = 2] = "Informational";
})(UserAttentionType || (UserAttentionType = {}));
class CloseRequestedEvent {
    constructor(event){
        this._preventDefault = false;
        this.event = event.event;
        this.id = event.id;
    }
    preventDefault() {
        this._preventDefault = true;
    }
    isPreventDefault() {
        return this._preventDefault;
    }
}
var ProgressBarStatus;
(function(ProgressBarStatus) {
    /**
     * Hide progress bar.
     */ ProgressBarStatus["None"] = "none";
    /**
     * Normal state.
     */ ProgressBarStatus["Normal"] = "normal";
    /**
     * Indeterminate state. **Treated as Normal on Linux and macOS**
     */ ProgressBarStatus["Indeterminate"] = "indeterminate";
    /**
     * Paused state. **Treated as Normal on Linux**
     */ ProgressBarStatus["Paused"] = "paused";
    /**
     * Error state. **Treated as Normal on linux**
     */ ProgressBarStatus["Error"] = "error";
})(ProgressBarStatus || (ProgressBarStatus = {}));
/**
 * Get an instance of `Window` for the current window.
 *
 * @since 1.0.0
 */ function getCurrentWindow() {
    return new Window(window.__TAURI_INTERNALS__.metadata.currentWindow.label, {
        // @ts-expect-error `skip` is not defined in the public API but it is handled by the constructor
        skip: true
    });
}
/**
 * Gets a list of instances of `Window` for all available windows.
 *
 * @since 1.0.0
 */ async function getAllWindows() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|get_all_windows').then((windows)=>windows.map((w)=>new Window(w, {
                // @ts-expect-error `skip` is not defined in the public API but it is handled by the constructor
                skip: true
            })));
}
/** @ignore */ // events that are emitted right here instead of by the created window
const localTauriEvents = [
    'tauri://created',
    'tauri://error'
];
/**
 * Create new window or get a handle to an existing one.
 *
 * Windows are identified by a *label*  a unique identifier that can be used to reference it later.
 * It may only contain alphanumeric characters `a-zA-Z` plus the following special characters `-`, `/`, `:` and `_`.
 *
 * @example
 * ```typescript
 * import { Window } from "@tauri-apps/api/window"
 *
 * const appWindow = new Window('theUniqueLabel');
 *
 * appWindow.once('tauri://created', function () {
 *  // window successfully created
 * });
 * appWindow.once('tauri://error', function (e) {
 *  // an error happened creating the window
 * });
 *
 * // emit an event to the backend
 * await appWindow.emit("some-event", "data");
 * // listen to an event from the backend
 * const unlisten = await appWindow.listen("event-name", e => {});
 * unlisten();
 * ```
 *
 * @since 2.0.0
 */ class Window {
    /**
     * Creates a new Window.
     * @example
     * ```typescript
     * import { Window } from '@tauri-apps/api/window';
     * const appWindow = new Window('my-label');
     * appWindow.once('tauri://created', function () {
     *  // window successfully created
     * });
     * appWindow.once('tauri://error', function (e) {
     *  // an error happened creating the window
     * });
     * ```
     *
     * @param label The unique window label. Must be alphanumeric: `a-zA-Z-/:_`.
     * @returns The {@link Window} instance to communicate with the window.
     */ constructor(label, options = {}){
        var _a;
        this.label = label;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.listeners = Object.create(null);
        // @ts-expect-error `skip` is not a public API so it is not defined in WindowOptions
        if (!(options === null || options === void 0 ? void 0 : options.skip)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|create', {
                options: {
                    ...options,
                    parent: typeof options.parent === 'string' ? options.parent : (_a = options.parent) === null || _a === void 0 ? void 0 : _a.label,
                    label
                }
            }).then(async ()=>this.emit('tauri://created')).catch(async (e)=>this.emit('tauri://error', e));
        }
    }
    /**
     * Gets the Window associated with the given label.
     * @example
     * ```typescript
     * import { Window } from '@tauri-apps/api/window';
     * const mainWindow = Window.getByLabel('main');
     * ```
     *
     * @param label The window label.
     * @returns The Window instance to communicate with the window or null if the window doesn't exist.
     */ static async getByLabel(label) {
        var _a;
        return (_a = (await getAllWindows()).find((w)=>w.label === label)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Get an instance of `Window` for the current window.
     */ static getCurrent() {
        return getCurrentWindow();
    }
    /**
     * Gets a list of instances of `Window` for all available windows.
     */ static async getAll() {
        return getAllWindows();
    }
    /**
     *  Gets the focused window.
     * @example
     * ```typescript
     * import { Window } from '@tauri-apps/api/window';
     * const focusedWindow = Window.getFocusedWindow();
     * ```
     *
     * @returns The Window instance or `undefined` if there is not any focused window.
     */ static async getFocusedWindow() {
        for (const w of (await getAllWindows())){
            if (await w.isFocused()) {
                return w;
            }
        }
        return null;
    }
    /**
     * Listen to an emitted event on this window.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const unlisten = await getCurrentWindow().listen<string>('state-changed', (event) => {
     *   console.log(`Got error: ${payload}`);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param handler Event handler.
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async listen(event, handler) {
        if (this._handleTauriEvent(event, handler)) {
            return ()=>{
                // eslint-disable-next-line security/detect-object-injection
                const listeners = this.listeners[event];
                listeners.splice(listeners.indexOf(handler), 1);
            };
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["listen"])(event, handler, {
            target: {
                kind: 'Window',
                label: this.label
            }
        });
    }
    /**
     * Listen to an emitted event on this window only once.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const unlisten = await getCurrentWindow().once<null>('initialized', (event) => {
     *   console.log(`Window initialized!`);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param handler Event handler.
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async once(event, handler) {
        if (this._handleTauriEvent(event, handler)) {
            return ()=>{
                // eslint-disable-next-line security/detect-object-injection
                const listeners = this.listeners[event];
                listeners.splice(listeners.indexOf(handler), 1);
            };
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["once"])(event, handler, {
            target: {
                kind: 'Window',
                label: this.label
            }
        });
    }
    /**
     * Emits an event to all {@link EventTarget|targets}.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().emit('window-loaded', { loggedIn: true, token: 'authToken' });
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param payload Event payload.
     */ async emit(event, payload) {
        if (localTauriEvents.includes(event)) {
            // eslint-disable-next-line
            for (const handler of this.listeners[event] || []){
                handler({
                    event,
                    id: -1,
                    payload
                });
            }
            return;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["emit"])(event, payload);
    }
    /**
     * Emits an event to all {@link EventTarget|targets} matching the given target.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().emit('main', 'window-loaded', { loggedIn: true, token: 'authToken' });
     * ```
     * @param target Label of the target Window/Webview/WebviewWindow or raw {@link EventTarget} object.
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param payload Event payload.
     */ async emitTo(target, event, payload) {
        if (localTauriEvents.includes(event)) {
            // eslint-disable-next-line security/detect-object-injection
            for (const handler of this.listeners[event] || []){
                handler({
                    event,
                    id: -1,
                    payload
                });
            }
            return;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["emitTo"])(target, event, payload);
    }
    /** @ignore */ _handleTauriEvent(event, handler) {
        if (localTauriEvents.includes(event)) {
            if (!(event in this.listeners)) {
                // eslint-disable-next-line
                this.listeners[event] = [
                    handler
                ];
            } else {
                // eslint-disable-next-line
                this.listeners[event].push(handler);
            }
            return true;
        }
        return false;
    }
    // Getters
    /**
     * The scale factor that can be used to map physical pixels to logical pixels.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const factor = await getCurrentWindow().scaleFactor();
     * ```
     *
     * @returns The window's monitor scale factor.
     */ async scaleFactor() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|scale_factor', {
            label: this.label
        });
    }
    /**
     * The position of the top-left hand corner of the window's client area relative to the top-left hand corner of the desktop.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const position = await getCurrentWindow().innerPosition();
     * ```
     *
     * @returns The window's inner position.
     */ async innerPosition() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|inner_position', {
            label: this.label
        }).then((p)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](p));
    }
    /**
     * The position of the top-left hand corner of the window relative to the top-left hand corner of the desktop.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const position = await getCurrentWindow().outerPosition();
     * ```
     *
     * @returns The window's outer position.
     */ async outerPosition() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|outer_position', {
            label: this.label
        }).then((p)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](p));
    }
    /**
     * The physical size of the window's client area.
     * The client area is the content of the window, excluding the title bar and borders.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const size = await getCurrentWindow().innerSize();
     * ```
     *
     * @returns The window's inner size.
     */ async innerSize() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|inner_size', {
            label: this.label
        }).then((s)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalSize"](s));
    }
    /**
     * The physical size of the entire window.
     * These dimensions include the title bar and borders. If you don't want that (and you usually don't), use inner_size instead.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const size = await getCurrentWindow().outerSize();
     * ```
     *
     * @returns The window's outer size.
     */ async outerSize() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|outer_size', {
            label: this.label
        }).then((s)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalSize"](s));
    }
    /**
     * Gets the window's current fullscreen state.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const fullscreen = await getCurrentWindow().isFullscreen();
     * ```
     *
     * @returns Whether the window is in fullscreen mode or not.
     */ async isFullscreen() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_fullscreen', {
            label: this.label
        });
    }
    /**
     * Gets the window's current minimized state.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const minimized = await getCurrentWindow().isMinimized();
     * ```
     */ async isMinimized() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_minimized', {
            label: this.label
        });
    }
    /**
     * Gets the window's current maximized state.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const maximized = await getCurrentWindow().isMaximized();
     * ```
     *
     * @returns Whether the window is maximized or not.
     */ async isMaximized() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_maximized', {
            label: this.label
        });
    }
    /**
     * Gets the window's current focus state.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const focused = await getCurrentWindow().isFocused();
     * ```
     *
     * @returns Whether the window is focused or not.
     */ async isFocused() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_focused', {
            label: this.label
        });
    }
    /**
     * Gets the window's current decorated state.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const decorated = await getCurrentWindow().isDecorated();
     * ```
     *
     * @returns Whether the window is decorated or not.
     */ async isDecorated() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_decorated', {
            label: this.label
        });
    }
    /**
     * Gets the window's current resizable state.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const resizable = await getCurrentWindow().isResizable();
     * ```
     *
     * @returns Whether the window is resizable or not.
     */ async isResizable() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_resizable', {
            label: this.label
        });
    }
    /**
     * Gets the window's native maximize button state.
     *
     * #### Platform-specific
     *
     * - **Linux / iOS / Android:** Unsupported.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const maximizable = await getCurrentWindow().isMaximizable();
     * ```
     *
     * @returns Whether the window's native maximize button is enabled or not.
     */ async isMaximizable() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_maximizable', {
            label: this.label
        });
    }
    /**
     * Gets the window's native minimize button state.
     *
     * #### Platform-specific
     *
     * - **Linux / iOS / Android:** Unsupported.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const minimizable = await getCurrentWindow().isMinimizable();
     * ```
     *
     * @returns Whether the window's native minimize button is enabled or not.
     */ async isMinimizable() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_minimizable', {
            label: this.label
        });
    }
    /**
     * Gets the window's native close button state.
     *
     * #### Platform-specific
     *
     * - **iOS / Android:** Unsupported.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const closable = await getCurrentWindow().isClosable();
     * ```
     *
     * @returns Whether the window's native close button is enabled or not.
     */ async isClosable() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_closable', {
            label: this.label
        });
    }
    /**
     * Gets the window's current visible state.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const visible = await getCurrentWindow().isVisible();
     * ```
     *
     * @returns Whether the window is visible or not.
     */ async isVisible() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_visible', {
            label: this.label
        });
    }
    /**
     * Gets the window's current title.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const title = await getCurrentWindow().title();
     * ```
     */ async title() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|title', {
            label: this.label
        });
    }
    /**
     * Gets the window's current theme.
     *
     * #### Platform-specific
     *
     * - **macOS:** Theme was introduced on macOS 10.14. Returns `light` on macOS 10.13 and below.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const theme = await getCurrentWindow().theme();
     * ```
     *
     * @returns The window theme.
     */ async theme() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|theme', {
            label: this.label
        });
    }
    /**
     * Whether the window is configured to be always on top of other windows or not.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * const alwaysOnTop = await getCurrentWindow().isAlwaysOnTop();
     * ```
     *
     * @returns Whether the window is visible or not.
     */ async isAlwaysOnTop() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_always_on_top', {
            label: this.label
        });
    }
    // Setters
    /**
     * Centers the window.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().center();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async center() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|center', {
            label: this.label
        });
    }
    /**
     *  Requests user attention to the window, this has no effect if the application
     * is already focused. How requesting for user attention manifests is platform dependent,
     * see `UserAttentionType` for details.
     *
     * Providing `null` will unset the request for user attention. Unsetting the request for
     * user attention might not be done automatically by the WM when the window receives input.
     *
     * #### Platform-specific
     *
     * - **macOS:** `null` has no effect.
     * - **Linux:** Urgency levels have the same effect.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().requestUserAttention();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async requestUserAttention(requestType) {
        let requestType_ = null;
        if (requestType) {
            if (requestType === UserAttentionType.Critical) {
                requestType_ = {
                    type: 'Critical'
                };
            } else {
                requestType_ = {
                    type: 'Informational'
                };
            }
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|request_user_attention', {
            label: this.label,
            value: requestType_
        });
    }
    /**
     * Updates the window resizable flag.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setResizable(false);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async setResizable(resizable) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_resizable', {
            label: this.label,
            value: resizable
        });
    }
    /**
     * Enable or disable the window.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setEnabled(false);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */ async setEnabled(enabled) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_enabled', {
            label: this.label,
            value: enabled
        });
    }
    /**
     * Whether the window is enabled or disabled.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setEnabled(false);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */ async isEnabled() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|is_enabled', {
            label: this.label
        });
    }
    /**
     * Sets whether the window's native maximize button is enabled or not.
     * If resizable is set to false, this setting is ignored.
     *
     * #### Platform-specific
     *
     * - **macOS:** Disables the "zoom" button in the window titlebar, which is also used to enter fullscreen mode.
     * - **Linux / iOS / Android:** Unsupported.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setMaximizable(false);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async setMaximizable(maximizable) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_maximizable', {
            label: this.label,
            value: maximizable
        });
    }
    /**
     * Sets whether the window's native minimize button is enabled or not.
     *
     * #### Platform-specific
     *
     * - **Linux / iOS / Android:** Unsupported.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setMinimizable(false);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async setMinimizable(minimizable) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_minimizable', {
            label: this.label,
            value: minimizable
        });
    }
    /**
     * Sets whether the window's native close button is enabled or not.
     *
     * #### Platform-specific
     *
     * - **Linux:** GTK+ will do its best to convince the window manager not to show a close button. Depending on the system, this function may not have any effect when called on a window that is already visible
     * - **iOS / Android:** Unsupported.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setClosable(false);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async setClosable(closable) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_closable', {
            label: this.label,
            value: closable
        });
    }
    /**
     * Sets the window title.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setTitle('Tauri');
     * ```
     *
     * @param title The new title
     * @returns A promise indicating the success or failure of the operation.
     */ async setTitle(title) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_title', {
            label: this.label,
            value: title
        });
    }
    /**
     * Maximizes the window.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().maximize();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async maximize() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|maximize', {
            label: this.label
        });
    }
    /**
     * Unmaximizes the window.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().unmaximize();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async unmaximize() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|unmaximize', {
            label: this.label
        });
    }
    /**
     * Toggles the window maximized state.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().toggleMaximize();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async toggleMaximize() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|toggle_maximize', {
            label: this.label
        });
    }
    /**
     * Minimizes the window.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().minimize();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async minimize() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|minimize', {
            label: this.label
        });
    }
    /**
     * Unminimizes the window.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().unminimize();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async unminimize() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|unminimize', {
            label: this.label
        });
    }
    /**
     * Sets the window visibility to true.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().show();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async show() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|show', {
            label: this.label
        });
    }
    /**
     * Sets the window visibility to false.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().hide();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async hide() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|hide', {
            label: this.label
        });
    }
    /**
     * Closes the window.
     *
     * Note this emits a closeRequested event so you can intercept it. To force window close, use {@link Window.destroy}.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().close();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async close() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|close', {
            label: this.label
        });
    }
    /**
     * Destroys the window. Behaves like {@link Window.close} but forces the window close instead of emitting a closeRequested event.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().destroy();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async destroy() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|destroy', {
            label: this.label
        });
    }
    /**
     * Whether the window should have borders and bars.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setDecorations(false);
     * ```
     *
     * @param decorations Whether the window should have borders and bars.
     * @returns A promise indicating the success or failure of the operation.
     */ async setDecorations(decorations) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_decorations', {
            label: this.label,
            value: decorations
        });
    }
    /**
     * Whether or not the window should have shadow.
     *
     * #### Platform-specific
     *
     * - **Windows:**
     *   - `false` has no effect on decorated window, shadows are always ON.
     *   - `true` will make undecorated window have a 1px white border,
     * and on Windows 11, it will have a rounded corners.
     * - **Linux:** Unsupported.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setShadow(false);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async setShadow(enable) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_shadow', {
            label: this.label,
            value: enable
        });
    }
    /**
     * Set window effects.
     */ async setEffects(effects) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_effects', {
            label: this.label,
            value: effects
        });
    }
    /**
     * Clear any applied effects if possible.
     */ async clearEffects() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_effects', {
            label: this.label,
            value: null
        });
    }
    /**
     * Whether the window should always be on top of other windows.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setAlwaysOnTop(true);
     * ```
     *
     * @param alwaysOnTop Whether the window should always be on top of other windows or not.
     * @returns A promise indicating the success or failure of the operation.
     */ async setAlwaysOnTop(alwaysOnTop) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_always_on_top', {
            label: this.label,
            value: alwaysOnTop
        });
    }
    /**
     * Whether the window should always be below other windows.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setAlwaysOnBottom(true);
     * ```
     *
     * @param alwaysOnBottom Whether the window should always be below other windows or not.
     * @returns A promise indicating the success or failure of the operation.
     */ async setAlwaysOnBottom(alwaysOnBottom) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_always_on_bottom', {
            label: this.label,
            value: alwaysOnBottom
        });
    }
    /**
     * Prevents the window contents from being captured by other apps.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setContentProtected(true);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async setContentProtected(protected_) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_content_protected', {
            label: this.label,
            value: protected_
        });
    }
    /**
     * Resizes the window with a new inner size.
     * @example
     * ```typescript
     * import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
     * await getCurrentWindow().setSize(new LogicalSize(600, 500));
     * ```
     *
     * @param size The logical or physical inner size.
     * @returns A promise indicating the success or failure of the operation.
     */ async setSize(size) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_size', {
            label: this.label,
            value: size instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Size"] ? size : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Size"](size)
        });
    }
    /**
     * Sets the window minimum inner size. If the `size` argument is not provided, the constraint is unset.
     * @example
     * ```typescript
     * import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window';
     * await getCurrentWindow().setMinSize(new PhysicalSize(600, 500));
     * ```
     *
     * @param size The logical or physical inner size, or `null` to unset the constraint.
     * @returns A promise indicating the success or failure of the operation.
     */ async setMinSize(size) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_min_size', {
            label: this.label,
            value: size instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Size"] ? size : size ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Size"](size) : null
        });
    }
    /**
     * Sets the window maximum inner size. If the `size` argument is undefined, the constraint is unset.
     * @example
     * ```typescript
     * import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';
     * await getCurrentWindow().setMaxSize(new LogicalSize(600, 500));
     * ```
     *
     * @param size The logical or physical inner size, or `null` to unset the constraint.
     * @returns A promise indicating the success or failure of the operation.
     */ async setMaxSize(size) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_max_size', {
            label: this.label,
            value: size instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Size"] ? size : size ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Size"](size) : null
        });
    }
    /**
     * Sets the window inner size constraints.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setSizeConstraints({ minWidth: 300 });
     * ```
     *
     * @param constraints The logical or physical inner size, or `null` to unset the constraint.
     * @returns A promise indicating the success or failure of the operation.
     */ async setSizeConstraints(constraints) {
        function logical(pixel) {
            return pixel ? {
                Logical: pixel
            } : null;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_size_constraints', {
            label: this.label,
            value: {
                minWidth: logical(constraints === null || constraints === void 0 ? void 0 : constraints.minWidth),
                minHeight: logical(constraints === null || constraints === void 0 ? void 0 : constraints.minHeight),
                maxWidth: logical(constraints === null || constraints === void 0 ? void 0 : constraints.maxWidth),
                maxHeight: logical(constraints === null || constraints === void 0 ? void 0 : constraints.maxHeight)
            }
        });
    }
    /**
     * Sets the window outer position.
     * @example
     * ```typescript
     * import { getCurrentWindow, LogicalPosition } from '@tauri-apps/api/window';
     * await getCurrentWindow().setPosition(new LogicalPosition(600, 500));
     * ```
     *
     * @param position The new position, in logical or physical pixels.
     * @returns A promise indicating the success or failure of the operation.
     */ async setPosition(position) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_position', {
            label: this.label,
            value: position instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Position"] ? position : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Position"](position)
        });
    }
    /**
     * Sets the window fullscreen state.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setFullscreen(true);
     * ```
     *
     * @param fullscreen Whether the window should go to fullscreen or not.
     * @returns A promise indicating the success or failure of the operation.
     */ async setFullscreen(fullscreen) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_fullscreen', {
            label: this.label,
            value: fullscreen
        });
    }
    /**
     * Bring the window to front and focus.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setFocus();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async setFocus() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_focus', {
            label: this.label
        });
    }
    /**
     * Sets the window icon.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setIcon('/tauri/awesome.png');
     * ```
     *
     * Note that you may need the `image-ico` or `image-png` Cargo features to use this API.
     * To enable it, change your Cargo.toml file:
     * ```toml
     * [dependencies]
     * tauri = { version = "...", features = ["...", "image-png"] }
     * ```
     *
     * @param icon Icon bytes or path to the icon file.
     * @returns A promise indicating the success or failure of the operation.
     */ async setIcon(icon) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_icon', {
            label: this.label,
            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformImage"])(icon)
        });
    }
    /**
     * Whether the window icon should be hidden from the taskbar or not.
     *
     * #### Platform-specific
     *
     * - **macOS:** Unsupported.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setSkipTaskbar(true);
     * ```
     *
     * @param skip true to hide window icon, false to show it.
     * @returns A promise indicating the success or failure of the operation.
     */ async setSkipTaskbar(skip) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_skip_taskbar', {
            label: this.label,
            value: skip
        });
    }
    /**
     * Grabs the cursor, preventing it from leaving the window.
     *
     * There's no guarantee that the cursor will be hidden. You should
     * hide it by yourself if you want so.
     *
     * #### Platform-specific
     *
     * - **Linux:** Unsupported.
     * - **macOS:** This locks the cursor in a fixed location, which looks visually awkward.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setCursorGrab(true);
     * ```
     *
     * @param grab `true` to grab the cursor icon, `false` to release it.
     * @returns A promise indicating the success or failure of the operation.
     */ async setCursorGrab(grab) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_cursor_grab', {
            label: this.label,
            value: grab
        });
    }
    /**
     * Modifies the cursor's visibility.
     *
     * #### Platform-specific
     *
     * - **Windows:** The cursor is only hidden within the confines of the window.
     * - **macOS:** The cursor is hidden as long as the window has input focus, even if the cursor is
     *   outside of the window.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setCursorVisible(false);
     * ```
     *
     * @param visible If `false`, this will hide the cursor. If `true`, this will show the cursor.
     * @returns A promise indicating the success or failure of the operation.
     */ async setCursorVisible(visible) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_cursor_visible', {
            label: this.label,
            value: visible
        });
    }
    /**
     * Modifies the cursor icon of the window.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setCursorIcon('help');
     * ```
     *
     * @param icon The new cursor icon.
     * @returns A promise indicating the success or failure of the operation.
     */ async setCursorIcon(icon) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_cursor_icon', {
            label: this.label,
            value: icon
        });
    }
    /**
     * Sets the window background color.
     *
     * #### Platform-specific:
     *
     * - **Windows:** alpha channel is ignored.
     * - **iOS / Android:** Unsupported.
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.1.0
     */ async setBackgroundColor(color) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_background_color', {
            color
        });
    }
    /**
     * Changes the position of the cursor in window coordinates.
     * @example
     * ```typescript
     * import { getCurrentWindow, LogicalPosition } from '@tauri-apps/api/window';
     * await getCurrentWindow().setCursorPosition(new LogicalPosition(600, 300));
     * ```
     *
     * @param position The new cursor position.
     * @returns A promise indicating the success or failure of the operation.
     */ async setCursorPosition(position) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_cursor_position', {
            label: this.label,
            value: position instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Position"] ? position : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Position"](position)
        });
    }
    /**
     * Changes the cursor events behavior.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setIgnoreCursorEvents(true);
     * ```
     *
     * @param ignore `true` to ignore the cursor events; `false` to process them as usual.
     * @returns A promise indicating the success or failure of the operation.
     */ async setIgnoreCursorEvents(ignore) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_ignore_cursor_events', {
            label: this.label,
            value: ignore
        });
    }
    /**
     * Starts dragging the window.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().startDragging();
     * ```
     *
     * @return A promise indicating the success or failure of the operation.
     */ async startDragging() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|start_dragging', {
            label: this.label
        });
    }
    /**
     * Starts resize-dragging the window.
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().startResizeDragging();
     * ```
     *
     * @return A promise indicating the success or failure of the operation.
     */ async startResizeDragging(direction) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|start_resize_dragging', {
            label: this.label,
            value: direction
        });
    }
    /**
     * Sets the badge count. It is app wide and not specific to this window.
     *
     * #### Platform-specific
     *
     * - **Windows**: Unsupported. Use @{linkcode Window.setOverlayIcon} instead.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setBadgeCount(5);
     * ```
     *
     * @param count The badge count. Use `undefined` to remove the badge.
     * @return A promise indicating the success or failure of the operation.
     */ async setBadgeCount(count) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_badge_count', {
            label: this.label,
            value: count
        });
    }
    /**
     * Sets the badge cont **macOS only**.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setBadgeLabel("Hello");
     * ```
     *
     * @param label The badge label. Use `undefined` to remove the badge.
     * @return A promise indicating the success or failure of the operation.
     */ async setBadgeLabel(label) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_badge_label', {
            label: this.label,
            value: label
        });
    }
    /**
     * Sets the overlay icon. **Windows only**
     * The overlay icon can be set for every window.
     *
     *
     * Note that you may need the `image-ico` or `image-png` Cargo features to use this API.
     * To enable it, change your Cargo.toml file:
     *
     * ```toml
     * [dependencies]
     * tauri = { version = "...", features = ["...", "image-png"] }
     * ```
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from '@tauri-apps/api/window';
     * await getCurrentWindow().setOverlayIcon("/tauri/awesome.png");
     * ```
     *
     * @param icon Icon bytes or path to the icon file. Use `undefined` to remove the overlay icon.
     * @return A promise indicating the success or failure of the operation.
     */ async setOverlayIcon(icon) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_overlay_icon', {
            label: this.label,
            value: icon ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["transformImage"])(icon) : undefined
        });
    }
    /**
     * Sets the taskbar progress state.
     *
     * #### Platform-specific
     *
     * - **Linux / macOS**: Progress bar is app-wide and not specific to this window.
     * - **Linux**: Only supported desktop environments with `libunity` (e.g. GNOME).
     *
     * @example
     * ```typescript
     * import { getCurrentWindow, ProgressBarStatus } from '@tauri-apps/api/window';
     * await getCurrentWindow().setProgressBar({
     *   status: ProgressBarStatus.Normal,
     *   progress: 50,
     * });
     * ```
     *
     * @return A promise indicating the success or failure of the operation.
     */ async setProgressBar(state) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_progress_bar', {
            label: this.label,
            value: state
        });
    }
    /**
     * Sets whether the window should be visible on all workspaces or virtual desktops.
     *
     * #### Platform-specific
     *
     * - **Windows / iOS / Android:** Unsupported.
     *
     * @since 2.0.0
     */ async setVisibleOnAllWorkspaces(visible) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_visible_on_all_workspaces', {
            label: this.label,
            value: visible
        });
    }
    /**
     * Sets the title bar style. **macOS only**.
     *
     * @since 2.0.0
     */ async setTitleBarStyle(style) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_title_bar_style', {
            label: this.label,
            value: style
        });
    }
    /**
     * Set window theme, pass in `null` or `undefined` to follow system theme
     *
     * #### Platform-specific
     *
     * - **Linux / macOS**: Theme is app-wide and not specific to this window.
     * - **iOS / Android:** Unsupported.
     *
     * @since 2.0.0
     */ async setTheme(theme) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_theme', {
            label: this.label,
            value: theme
        });
    }
    // Listeners
    /**
     * Listen to window resize.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from "@tauri-apps/api/window";
     * const unlisten = await getCurrentWindow().onResized(({ payload: size }) => {
     *  console.log('Window resized', size);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async onResized(handler) {
        return this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].WINDOW_RESIZED, (e)=>{
            e.payload = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalSize"](e.payload);
            handler(e);
        });
    }
    /**
     * Listen to window move.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from "@tauri-apps/api/window";
     * const unlisten = await getCurrentWindow().onMoved(({ payload: position }) => {
     *  console.log('Window moved', position);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async onMoved(handler) {
        return this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].WINDOW_MOVED, (e)=>{
            e.payload = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](e.payload);
            handler(e);
        });
    }
    /**
     * Listen to window close requested. Emitted when the user requests to closes the window.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from "@tauri-apps/api/window";
     * import { confirm } from '@tauri-apps/api/dialog';
     * const unlisten = await getCurrentWindow().onCloseRequested(async (event) => {
     *   const confirmed = await confirm('Are you sure?');
     *   if (!confirmed) {
     *     // user did not confirm closing the window; let's prevent it
     *     event.preventDefault();
     *   }
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async onCloseRequested(handler) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        return this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].WINDOW_CLOSE_REQUESTED, async (event)=>{
            const evt = new CloseRequestedEvent(event);
            await handler(evt);
            if (!evt.isPreventDefault()) {
                await this.destroy();
            }
        });
    }
    /**
     * Listen to a file drop event.
     * The listener is triggered when the user hovers the selected files on the webview,
     * drops the files or cancels the operation.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from "@tauri-apps/api/webview";
     * const unlisten = await getCurrentWindow().onDragDropEvent((event) => {
     *  if (event.payload.type === 'over') {
     *    console.log('User hovering', event.payload.position);
     *  } else if (event.payload.type === 'drop') {
     *    console.log('User dropped', event.payload.paths);
     *  } else {
     *    console.log('File drop cancelled');
     *  }
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async onDragDropEvent(handler) {
        const unlistenDrag = await this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].DRAG_ENTER, (event)=>{
            handler({
                ...event,
                payload: {
                    type: 'enter',
                    paths: event.payload.paths,
                    position: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](event.payload.position)
                }
            });
        });
        const unlistenDragOver = await this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].DRAG_OVER, (event)=>{
            handler({
                ...event,
                payload: {
                    type: 'over',
                    position: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](event.payload.position)
                }
            });
        });
        const unlistenDrop = await this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].DRAG_DROP, (event)=>{
            handler({
                ...event,
                payload: {
                    type: 'drop',
                    paths: event.payload.paths,
                    position: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](event.payload.position)
                }
            });
        });
        const unlistenCancel = await this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].DRAG_LEAVE, (event)=>{
            handler({
                ...event,
                payload: {
                    type: 'leave'
                }
            });
        });
        return ()=>{
            unlistenDrag();
            unlistenDrop();
            unlistenDragOver();
            unlistenCancel();
        };
    }
    /**
     * Listen to window focus change.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from "@tauri-apps/api/window";
     * const unlisten = await getCurrentWindow().onFocusChanged(({ payload: focused }) => {
     *  console.log('Focus changed, window is focused? ' + focused);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async onFocusChanged(handler) {
        const unlistenFocus = await this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].WINDOW_FOCUS, (event)=>{
            handler({
                ...event,
                payload: true
            });
        });
        const unlistenBlur = await this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].WINDOW_BLUR, (event)=>{
            handler({
                ...event,
                payload: false
            });
        });
        return ()=>{
            unlistenFocus();
            unlistenBlur();
        };
    }
    /**
     * Listen to window scale change. Emitted when the window's scale factor has changed.
     * The following user actions can cause DPI changes:
     * - Changing the display's resolution.
     * - Changing the display's scale factor (e.g. in Control Panel on Windows).
     * - Moving the window to a display with a different scale factor.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from "@tauri-apps/api/window";
     * const unlisten = await getCurrentWindow().onScaleChanged(({ payload }) => {
     *  console.log('Scale changed', payload.scaleFactor, payload.size);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async onScaleChanged(handler) {
        return this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].WINDOW_SCALE_FACTOR_CHANGED, handler);
    }
    /**
     * Listen to the system theme change.
     *
     * @example
     * ```typescript
     * import { getCurrentWindow } from "@tauri-apps/api/window";
     * const unlisten = await getCurrentWindow().onThemeChanged(({ payload: theme }) => {
     *  console.log('New theme: ' + theme);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async onThemeChanged(handler) {
        return this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].WINDOW_THEME_CHANGED, handler);
    }
}
/**
 * Background throttling policy
 *
 * @since 2.0.0
 */ var BackgroundThrottlingPolicy;
(function(BackgroundThrottlingPolicy) {
    BackgroundThrottlingPolicy["Disabled"] = "disabled";
    BackgroundThrottlingPolicy["Throttle"] = "throttle";
    BackgroundThrottlingPolicy["Suspend"] = "suspend";
})(BackgroundThrottlingPolicy || (BackgroundThrottlingPolicy = {}));
/**
 * Platform-specific window effects
 *
 * @since 2.0.0
 */ var Effect;
(function(Effect) {
    /**
     * A default material appropriate for the view's effectiveAppearance.  **macOS 10.14-**
     *
     * @deprecated since macOS 10.14. You should instead choose an appropriate semantic material.
     */ Effect["AppearanceBased"] = "appearanceBased";
    /**
     *  **macOS 10.14-**
     *
     * @deprecated since macOS 10.14. Use a semantic material instead.
     */ Effect["Light"] = "light";
    /**
     *  **macOS 10.14-**
     *
     * @deprecated since macOS 10.14. Use a semantic material instead.
     */ Effect["Dark"] = "dark";
    /**
     *  **macOS 10.14-**
     *
     * @deprecated since macOS 10.14. Use a semantic material instead.
     */ Effect["MediumLight"] = "mediumLight";
    /**
     *  **macOS 10.14-**
     *
     * @deprecated since macOS 10.14. Use a semantic material instead.
     */ Effect["UltraDark"] = "ultraDark";
    /**
     *  **macOS 10.10+**
     */ Effect["Titlebar"] = "titlebar";
    /**
     *  **macOS 10.10+**
     */ Effect["Selection"] = "selection";
    /**
     *  **macOS 10.11+**
     */ Effect["Menu"] = "menu";
    /**
     *  **macOS 10.11+**
     */ Effect["Popover"] = "popover";
    /**
     *  **macOS 10.11+**
     */ Effect["Sidebar"] = "sidebar";
    /**
     *  **macOS 10.14+**
     */ Effect["HeaderView"] = "headerView";
    /**
     *  **macOS 10.14+**
     */ Effect["Sheet"] = "sheet";
    /**
     *  **macOS 10.14+**
     */ Effect["WindowBackground"] = "windowBackground";
    /**
     *  **macOS 10.14+**
     */ Effect["HudWindow"] = "hudWindow";
    /**
     *  **macOS 10.14+**
     */ Effect["FullScreenUI"] = "fullScreenUI";
    /**
     *  **macOS 10.14+**
     */ Effect["Tooltip"] = "tooltip";
    /**
     *  **macOS 10.14+**
     */ Effect["ContentBackground"] = "contentBackground";
    /**
     *  **macOS 10.14+**
     */ Effect["UnderWindowBackground"] = "underWindowBackground";
    /**
     *  **macOS 10.14+**
     */ Effect["UnderPageBackground"] = "underPageBackground";
    /**
     *  **Windows 11 Only**
     */ Effect["Mica"] = "mica";
    /**
     * **Windows 7/10/11(22H1) Only**
     *
     * #### Notes
     *
     * This effect has bad performance when resizing/dragging the window on Windows 11 build 22621.
     */ Effect["Blur"] = "blur";
    /**
     * **Windows 10/11**
     *
     * #### Notes
     *
     * This effect has bad performance when resizing/dragging the window on Windows 10 v1903+ and Windows 11 build 22000.
     */ Effect["Acrylic"] = "acrylic";
    /**
     * Tabbed effect that matches the system dark perefence **Windows 11 Only**
     */ Effect["Tabbed"] = "tabbed";
    /**
     * Tabbed effect with dark mode but only if dark mode is enabled on the system **Windows 11 Only**
     */ Effect["TabbedDark"] = "tabbedDark";
    /**
     * Tabbed effect with light mode **Windows 11 Only**
     */ Effect["TabbedLight"] = "tabbedLight";
})(Effect || (Effect = {}));
/**
 * Window effect state **macOS only**
 *
 * @see https://developer.apple.com/documentation/appkit/nsvisualeffectview/state
 *
 * @since 2.0.0
 */ var EffectState;
(function(EffectState) {
    /**
     *  Make window effect state follow the window's active state **macOS only**
     */ EffectState["FollowsWindowActiveState"] = "followsWindowActiveState";
    /**
     *  Make window effect state always active **macOS only**
     */ EffectState["Active"] = "active";
    /**
     *  Make window effect state always inactive **macOS only**
     */ EffectState["Inactive"] = "inactive";
})(EffectState || (EffectState = {}));
function mapMonitor(m) {
    return m === null ? null : {
        name: m.name,
        scaleFactor: m.scaleFactor,
        position: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](m.position),
        size: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalSize"](m.size)
    };
}
/**
 * Returns the monitor on which the window currently resides.
 * Returns `null` if current monitor can't be detected.
 * @example
 * ```typescript
 * import { currentMonitor } from '@tauri-apps/api/window';
 * const monitor = currentMonitor();
 * ```
 *
 * @since 1.0.0
 */ async function currentMonitor() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|current_monitor').then(mapMonitor);
}
/**
 * Returns the primary monitor of the system.
 * Returns `null` if it can't identify any monitor as a primary one.
 * @example
 * ```typescript
 * import { primaryMonitor } from '@tauri-apps/api/window';
 * const monitor = primaryMonitor();
 * ```
 *
 * @since 1.0.0
 */ async function primaryMonitor() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|primary_monitor').then(mapMonitor);
}
/**
 * Returns the monitor that contains the given point. Returns `null` if can't find any.
 * @example
 * ```typescript
 * import { monitorFromPoint } from '@tauri-apps/api/window';
 * const monitor = monitorFromPoint();
 * ```
 *
 * @since 1.0.0
 */ async function monitorFromPoint(x, y) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|monitor_from_point', {
        x,
        y
    }).then(mapMonitor);
}
/**
 * Returns the list of all the monitors available on the system.
 * @example
 * ```typescript
 * import { availableMonitors } from '@tauri-apps/api/window';
 * const monitors = availableMonitors();
 * ```
 *
 * @since 1.0.0
 */ async function availableMonitors() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|available_monitors').then((ms)=>ms.map(mapMonitor));
}
/**
 * Get the cursor position relative to the top-left hand corner of the desktop.
 *
 * Note that the top-left hand corner of the desktop is not necessarily the same as the screen.
 * If the user uses a desktop with multiple monitors,
 * the top-left hand corner of the desktop is the top-left hand corner of the main monitor on Windows and macOS
 * or the top-left of the leftmost monitor on X11.
 *
 * The coordinates can be negative if the top-left hand corner of the window is outside of the visible screen region.
 */ async function cursorPosition() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|cursor_position').then((v)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](v));
}
;
}}),
"[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/window.js [app-ssr] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/dpi.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/event.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$window$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/window.js [app-ssr] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/webview.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "Webview": (()=>Webview),
    "getAllWebviews": (()=>getAllWebviews),
    "getCurrentWebview": (()=>getCurrentWebview)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/dpi.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/event.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/core.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$window$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/window.js [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$window$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/window.js [app-ssr] (ecmascript) <locals>");
;
;
;
;
// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT
/**
 * Provides APIs to create webviews, communicate with other webviews and manipulate the current webview.
 *
 * #### Webview events
 *
 * Events can be listened to using {@link Webview.listen}:
 * ```typescript
 * import { getCurrentWebview } from "@tauri-apps/api/webview";
 * getCurrentWebview().listen("my-webview-event", ({ event, payload }) => { });
 * ```
 *
 * @module
 */ /**
 * Get an instance of `Webview` for the current webview.
 *
 * @since 2.0.0
 */ function getCurrentWebview() {
    return new Webview((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$window$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getCurrentWindow"])(), window.__TAURI_INTERNALS__.metadata.currentWebview.label, {
        // @ts-expect-error `skip` is not defined in the public API but it is handled by the constructor
        skip: true
    });
}
/**
 * Gets a list of instances of `Webview` for all available webviews.
 *
 * @since 2.0.0
 */ async function getAllWebviews() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|get_all_webviews').then((webviews)=>webviews.map((w)=>new Webview(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$window$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Window"](w.windowLabel, {
                // @ts-expect-error `skip` is not defined in the public API but it is handled by the constructor
                skip: true
            }), w.label, {
                // @ts-expect-error `skip` is not defined in the public API but it is handled by the constructor
                skip: true
            })));
}
/** @ignore */ // events that are emitted right here instead of by the created webview
const localTauriEvents = [
    'tauri://created',
    'tauri://error'
];
/**
 * Create new webview or get a handle to an existing one.
 *
 * Webviews are identified by a *label*  a unique identifier that can be used to reference it later.
 * It may only contain alphanumeric characters `a-zA-Z` plus the following special characters `-`, `/`, `:` and `_`.
 *
 * @example
 * ```typescript
 * import { Window } from "@tauri-apps/api/window"
 * import { Webview } from "@tauri-apps/api/webview"
 *
 * const appWindow = new Window('uniqueLabel');
 *
 * // loading embedded asset:
 * const webview = new Webview(appWindow, 'theUniqueLabel', {
 *   url: 'path/to/page.html'
 * });
 * // alternatively, load a remote URL:
 * const webview = new Webview(appWindow, 'theUniqueLabel', {
 *   url: 'https://github.com/tauri-apps/tauri'
 * });
 *
 * webview.once('tauri://created', function () {
 *  // webview successfully created
 * });
 * webview.once('tauri://error', function (e) {
 *  // an error happened creating the webview
 * });
 *
 * // emit an event to the backend
 * await webview.emit("some-event", "data");
 * // listen to an event from the backend
 * const unlisten = await webview.listen("event-name", e => {});
 * unlisten();
 * ```
 *
 * @since 2.0.0
 */ class Webview {
    /**
     * Creates a new Webview.
     * @example
     * ```typescript
     * import { Window } from '@tauri-apps/api/window'
     * import { Webview } from '@tauri-apps/api/webview'
     * const appWindow = new Window('my-label')
     * const webview = new Webview(appWindow, 'my-label', {
     *   url: 'https://github.com/tauri-apps/tauri'
     * });
     * webview.once('tauri://created', function () {
     *  // webview successfully created
     * });
     * webview.once('tauri://error', function (e) {
     *  // an error happened creating the webview
     * });
     * ```
     *
     * @param window the window to add this webview to.
     * @param label The unique webview label. Must be alphanumeric: `a-zA-Z-/:_`.
     * @returns The {@link Webview} instance to communicate with the webview.
     */ constructor(window1, label, options){
        this.window = window1;
        this.label = label;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.listeners = Object.create(null);
        // @ts-expect-error `skip` is not a public API so it is not defined in WebviewOptions
        if (!(options === null || options === void 0 ? void 0 : options.skip)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|create_webview', {
                windowLabel: window1.label,
                label,
                options
            }).then(async ()=>this.emit('tauri://created')).catch(async (e)=>this.emit('tauri://error', e));
        }
    }
    /**
     * Gets the Webview for the webview associated with the given label.
     * @example
     * ```typescript
     * import { Webview } from '@tauri-apps/api/webview';
     * const mainWebview = Webview.getByLabel('main');
     * ```
     *
     * @param label The webview label.
     * @returns The Webview instance to communicate with the webview or null if the webview doesn't exist.
     */ static async getByLabel(label) {
        var _a;
        return (_a = (await getAllWebviews()).find((w)=>w.label === label)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Get an instance of `Webview` for the current webview.
     */ static getCurrent() {
        return getCurrentWebview();
    }
    /**
     * Gets a list of instances of `Webview` for all available webviews.
     */ static async getAll() {
        return getAllWebviews();
    }
    /**
     * Listen to an emitted event on this webview.
     *
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * const unlisten = await getCurrentWebview().listen<string>('state-changed', (event) => {
     *   console.log(`Got error: ${payload}`);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param handler Event handler.
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async listen(event, handler) {
        if (this._handleTauriEvent(event, handler)) {
            return ()=>{
                // eslint-disable-next-line security/detect-object-injection
                const listeners = this.listeners[event];
                listeners.splice(listeners.indexOf(handler), 1);
            };
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["listen"])(event, handler, {
            target: {
                kind: 'Webview',
                label: this.label
            }
        });
    }
    /**
     * Listen to an emitted event on this webview only once.
     *
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * const unlisten = await getCurrent().once<null>('initialized', (event) => {
     *   console.log(`Webview initialized!`);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param handler Event handler.
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async once(event, handler) {
        if (this._handleTauriEvent(event, handler)) {
            return ()=>{
                // eslint-disable-next-line security/detect-object-injection
                const listeners = this.listeners[event];
                listeners.splice(listeners.indexOf(handler), 1);
            };
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["once"])(event, handler, {
            target: {
                kind: 'Webview',
                label: this.label
            }
        });
    }
    /**
     * Emits an event to all {@link EventTarget|targets}.
     *
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * await getCurrentWebview().emit('webview-loaded', { loggedIn: true, token: 'authToken' });
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param payload Event payload.
     */ async emit(event, payload) {
        if (localTauriEvents.includes(event)) {
            // eslint-disable-next-line
            for (const handler of this.listeners[event] || []){
                handler({
                    event,
                    id: -1,
                    payload
                });
            }
            return;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["emit"])(event, payload);
    }
    /**
     * Emits an event to all {@link EventTarget|targets} matching the given target.
     *
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * await getCurrentWebview().emitTo('main', 'webview-loaded', { loggedIn: true, token: 'authToken' });
     * ```
     *
     * @param target Label of the target Window/Webview/WebviewWindow or raw {@link EventTarget} object.
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param payload Event payload.
     */ async emitTo(target, event, payload) {
        if (localTauriEvents.includes(event)) {
            // eslint-disable-next-line
            for (const handler of this.listeners[event] || []){
                handler({
                    event,
                    id: -1,
                    payload
                });
            }
            return;
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["emitTo"])(target, event, payload);
    }
    /** @ignore */ _handleTauriEvent(event, handler) {
        if (localTauriEvents.includes(event)) {
            if (!(event in this.listeners)) {
                // eslint-disable-next-line security/detect-object-injection
                this.listeners[event] = [
                    handler
                ];
            } else {
                // eslint-disable-next-line security/detect-object-injection
                this.listeners[event].push(handler);
            }
            return true;
        }
        return false;
    }
    // Getters
    /**
     * The position of the top-left hand corner of the webview's client area relative to the top-left hand corner of the desktop.
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * const position = await getCurrentWebview().position();
     * ```
     *
     * @returns The webview's position.
     */ async position() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|webview_position', {
            label: this.label
        }).then((p)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](p));
    }
    /**
     * The physical size of the webview's client area.
     * The client area is the content of the webview, excluding the title bar and borders.
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * const size = await getCurrentWebview().size();
     * ```
     *
     * @returns The webview's size.
     */ async size() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|webview_size', {
            label: this.label
        }).then((s)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalSize"](s));
    }
    // Setters
    /**
     * Closes the webview.
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * await getCurrentWebview().close();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async close() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|webview_close', {
            label: this.label
        });
    }
    /**
     * Resizes the webview.
     * @example
     * ```typescript
     * import { getCurrent, LogicalSize } from '@tauri-apps/api/webview';
     * await getCurrentWebview().setSize(new LogicalSize(600, 500));
     * ```
     *
     * @param size The logical or physical size.
     * @returns A promise indicating the success or failure of the operation.
     */ async setSize(size) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|set_webview_size', {
            label: this.label,
            value: size instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Size"] ? size : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Size"](size)
        });
    }
    /**
     * Sets the webview position.
     * @example
     * ```typescript
     * import { getCurrent, LogicalPosition } from '@tauri-apps/api/webview';
     * await getCurrentWebview().setPosition(new LogicalPosition(600, 500));
     * ```
     *
     * @param position The new position, in logical or physical pixels.
     * @returns A promise indicating the success or failure of the operation.
     */ async setPosition(position) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|set_webview_position', {
            label: this.label,
            value: position instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Position"] ? position : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Position"](position)
        });
    }
    /**
     * Bring the webview to front and focus.
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * await getCurrentWebview().setFocus();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async setFocus() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|set_webview_focus', {
            label: this.label
        });
    }
    /**
     * Hide the webview.
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * await getCurrentWebview().hide();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async hide() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|webview_hide', {
            label: this.label
        });
    }
    /**
     * Show the webview.
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * await getCurrentWebview().show();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async show() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|webview_show', {
            label: this.label
        });
    }
    /**
     * Set webview zoom level.
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * await getCurrentWebview().setZoom(1.5);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async setZoom(scaleFactor) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|set_webview_zoom', {
            label: this.label,
            value: scaleFactor
        });
    }
    /**
     * Moves this webview to the given label.
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * await getCurrentWebview().reparent('other-window');
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async reparent(window1) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|reparent', {
            label: this.label,
            window: typeof window1 === 'string' ? window1 : window1.label
        });
    }
    /**
     * Clears all browsing data for this webview.
     * @example
     * ```typescript
     * import { getCurrentWebview } from '@tauri-apps/api/webview';
     * await getCurrentWebview().clearAllBrowsingData();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     */ async clearAllBrowsingData() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|clear_all_browsing_data');
    }
    /**
     * Specify the webview background color.
     *
     * #### Platfrom-specific:
     *
     * - **macOS / iOS**: Not implemented.
     * - **Windows**:
     *   - On Windows 7, transparency is not supported and the alpha value will be ignored.
     *   - On Windows higher than 7: translucent colors are not supported so any alpha value other than `0` will be replaced by `255`
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.1.0
     */ async setBackgroundColor(color) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|set_webview_background_color', {
            color
        });
    }
    // Listeners
    /**
     * Listen to a file drop event.
     * The listener is triggered when the user hovers the selected files on the webview,
     * drops the files or cancels the operation.
     *
     * @example
     * ```typescript
     * import { getCurrentWebview } from "@tauri-apps/api/webview";
     * const unlisten = await getCurrentWebview().onDragDropEvent((event) => {
     *  if (event.payload.type === 'over') {
     *    console.log('User hovering', event.payload.position);
     *  } else if (event.payload.type === 'drop') {
     *    console.log('User dropped', event.payload.paths);
     *  } else {
     *    console.log('File drop cancelled');
     *  }
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * When the debugger panel is open, the drop position of this event may be inaccurate due to a known limitation.
     * To retrieve the correct drop position, please detach the debugger.
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async onDragDropEvent(handler) {
        const unlistenDragEnter = await this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].DRAG_ENTER, (event)=>{
            handler({
                ...event,
                payload: {
                    type: 'enter',
                    paths: event.payload.paths,
                    position: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](event.payload.position)
                }
            });
        });
        const unlistenDragOver = await this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].DRAG_OVER, (event)=>{
            handler({
                ...event,
                payload: {
                    type: 'over',
                    position: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](event.payload.position)
                }
            });
        });
        const unlistenDragDrop = await this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].DRAG_DROP, (event)=>{
            handler({
                ...event,
                payload: {
                    type: 'drop',
                    paths: event.payload.paths,
                    position: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$dpi$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PhysicalPosition"](event.payload.position)
                }
            });
        });
        const unlistenDragLeave = await this.listen(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TauriEvent"].DRAG_LEAVE, (event)=>{
            handler({
                ...event,
                payload: {
                    type: 'leave'
                }
            });
        });
        return ()=>{
            unlistenDragEnter();
            unlistenDragDrop();
            unlistenDragOver();
            unlistenDragLeave();
        };
    }
}
;
}}),
"[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/webviewWindow.js [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "WebviewWindow": (()=>WebviewWindow),
    "getAllWebviewWindows": (()=>getAllWebviewWindows),
    "getCurrentWebviewWindow": (()=>getCurrentWebviewWindow)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$webview$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/webview.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$window$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/window.js [app-ssr] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$window$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/window.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/event.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@tauri-apps+api@2.5.0/node_modules/@tauri-apps/api/core.js [app-ssr] (ecmascript)");
;
;
;
;
// Copyright 2019-2024 Tauri Programme within The Commons Conservancy
// SPDX-License-Identifier: Apache-2.0
// SPDX-License-Identifier: MIT
/**
 * Get an instance of `Webview` for the current webview window.
 *
 * @since 2.0.0
 */ function getCurrentWebviewWindow() {
    const webview = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$webview$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentWebview"])();
    // @ts-expect-error `skip` is not defined in the public API but it is handled by the constructor
    return new WebviewWindow(webview.label, {
        skip: true
    });
}
/**
 * Gets a list of instances of `Webview` for all available webview windows.
 *
 * @since 2.0.0
 */ async function getAllWebviewWindows() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|get_all_windows').then((windows)=>windows.map((w)=>new WebviewWindow(w, {
                // @ts-expect-error `skip` is not defined in the public API but it is handled by the constructor
                skip: true
            })));
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class WebviewWindow {
    /**
     * Creates a new {@link Window} hosting a {@link Webview}.
     * @example
     * ```typescript
     * import { WebviewWindow } from '@tauri-apps/api/webviewWindow'
     * const webview = new WebviewWindow('my-label', {
     *   url: 'https://github.com/tauri-apps/tauri'
     * });
     * webview.once('tauri://created', function () {
     *  // webview successfully created
     * });
     * webview.once('tauri://error', function (e) {
     *  // an error happened creating the webview
     * });
     * ```
     *
     * @param label The unique webview label. Must be alphanumeric: `a-zA-Z-/:_`.
     * @returns The {@link WebviewWindow} instance to communicate with the window and webview.
     */ constructor(label, options = {}){
        var _a;
        this.label = label;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.listeners = Object.create(null);
        // @ts-expect-error `skip` is not a public API so it is not defined in WebviewOptions
        if (!(options === null || options === void 0 ? void 0 : options.skip)) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|create_webview_window', {
                options: {
                    ...options,
                    parent: typeof options.parent === 'string' ? options.parent : (_a = options.parent) === null || _a === void 0 ? void 0 : _a.label,
                    label
                }
            }).then(async ()=>this.emit('tauri://created')).catch(async (e)=>this.emit('tauri://error', e));
        }
    }
    /**
     * Gets the Webview for the webview associated with the given label.
     * @example
     * ```typescript
     * import { Webview } from '@tauri-apps/api/webviewWindow';
     * const mainWebview = Webview.getByLabel('main');
     * ```
     *
     * @param label The webview label.
     * @returns The Webview instance to communicate with the webview or null if the webview doesn't exist.
     */ static async getByLabel(label) {
        var _a;
        const webview = (_a = (await getAllWebviewWindows()).find((w)=>w.label === label)) !== null && _a !== void 0 ? _a : null;
        if (webview) {
            // @ts-expect-error `skip` is not defined in the public API but it is handled by the constructor
            return new WebviewWindow(webview.label, {
                skip: true
            });
        }
        return null;
    }
    /**
     * Get an instance of `Webview` for the current webview.
     */ static getCurrent() {
        return getCurrentWebviewWindow();
    }
    /**
     * Gets a list of instances of `Webview` for all available webviews.
     */ static async getAll() {
        return getAllWebviewWindows();
    }
    /**
     * Listen to an emitted event on this webivew window.
     *
     * @example
     * ```typescript
     * import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
     * const unlisten = await WebviewWindow.getCurrent().listen<string>('state-changed', (event) => {
     *   console.log(`Got error: ${payload}`);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param handler Event handler.
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async listen(event, handler) {
        if (this._handleTauriEvent(event, handler)) {
            return ()=>{
                // eslint-disable-next-line security/detect-object-injection
                const listeners = this.listeners[event];
                listeners.splice(listeners.indexOf(handler), 1);
            };
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["listen"])(event, handler, {
            target: {
                kind: 'WebviewWindow',
                label: this.label
            }
        });
    }
    /**
     * Listen to an emitted event on this webview window only once.
     *
     * @example
     * ```typescript
     * import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
     * const unlisten = await WebviewWindow.getCurrent().once<null>('initialized', (event) => {
     *   console.log(`Webview initialized!`);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param handler Event handler.
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     */ async once(event, handler) {
        if (this._handleTauriEvent(event, handler)) {
            return ()=>{
                // eslint-disable-next-line security/detect-object-injection
                const listeners = this.listeners[event];
                listeners.splice(listeners.indexOf(handler), 1);
            };
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$event$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["once"])(event, handler, {
            target: {
                kind: 'WebviewWindow',
                label: this.label
            }
        });
    }
    /**
     * Set the window and webview background color.
     *
     * #### Platform-specific:
     *
     * - **Android / iOS:** Unsupported for the window layer.
     * - **macOS / iOS**: Not implemented for the webview layer.
     * - **Windows**:
     *   - alpha channel is ignored for the window layer.
     *   - On Windows 7, alpha channel is ignored for the webview layer.
     *   - On Windows 8 and newer, if alpha channel is not `0`, it will be ignored.
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.1.0
     */ async setBackgroundColor(color) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:window|set_background_color', {
            color
        }).then(()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$core$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["invoke"])('plugin:webview|set_webview_background_color', {
                color
            });
        });
    }
}
// Order matters, we use window APIs by default
applyMixins(WebviewWindow, [
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$window$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Window"],
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$tauri$2d$apps$2b$api$40$2$2e$5$2e$0$2f$node_modules$2f40$tauri$2d$apps$2f$api$2f$webview$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Webview"]
]);
/** Extends a base class by other specified classes, without overriding existing properties */ function applyMixins(baseClass, extendedClasses) {
    (Array.isArray(extendedClasses) ? extendedClasses : [
        extendedClasses
    ]).forEach((extendedClass)=>{
        Object.getOwnPropertyNames(extendedClass.prototype).forEach((name)=>{
            var _a;
            if (typeof baseClass.prototype === 'object' && baseClass.prototype && name in baseClass.prototype) return;
            Object.defineProperty(baseClass.prototype, name, // eslint-disable-next-line
            (_a = Object.getOwnPropertyDescriptor(extendedClass.prototype, name)) !== null && _a !== void 0 ? _a : Object.create(null));
        });
    });
}
;
}}),

};

//# sourceMappingURL=6b5f9_%40tauri-apps_api_3f010a2b._.js.map