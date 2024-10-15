// Type definitions for Bitwig Studio Control Surface Scripting API v19
// Project: https://bitwig.com
// Definitions by: Joseph Larson <https://github.com/joslarson>
// TypeScript Version: 4.1.2

declare namespace com.bitwig.extension {
  // source: com/bitwig/extension/Extension.java

  import Host = com.bitwig.extension.api.Host;

  class Extension<
    HostType extends Host = Host,
    DefinitionType extends ExtensionDefinition = ExtensionDefinition
  > {
    constructor(extensionDefinition: DefinitionType, host: HostType);

    getHost(): HostType;

    getExtensionDefinition(): DefinitionType;

    mExtensionDefinition: DefinitionType;

    mHost: HostType;
  }

  // source: com/bitwig/extension/ExtensionDefinition.java

  import UUID = java.util.UUID;

  /** Base class for defining any kind of extension for Bitwig Studio. */
  class ExtensionDefinition {
    /** The name of the extension. */
    getName(): string;

    /** The author of the extension. */
    getAuthor(): string;

    /** The version of the extension. */
    getVersion(): string;

    /** A unique id that identifies this extension. */
    getId(): UUID;

    /** The minimum API version number that this extensions requires. */
    getRequiredAPIVersion(): number;

    /**
     * Is this extension is using Beta APIs?
     *
     * Beta APIs are still on development and might not be available in a future version of Bitwig Studio.
     *
     * Turning this flag to true, will flag your extension as being a beta extension which might not work after
     * updating Bitwig Studio.
     *
     * @return true if the extension wants to use Beta APIs.
     */
    isUsingBetaAPI(): boolean;

    /**
     * Gets a remote URI or a path within the extension's jar file where documentation for this extension can
     * be found or null if there is none. If the path is not a URI then it is assumed to be a path below the directory
     * "Documentation" within the extension's jar file.
     */
    getHelpFilePath(): string;

    /**
     * Gets a remote URI or a path within the extension's jar file where support files for this extension can
     * be found or null if there is none. If the path is not a URI then it is assumed to be a path below the directory
     * "Documentation" within the extension's jar file.
     *
     * Support files are for example a configuration file that one has use with a configuration software.
     *
     * @since API version 13
     */
    getSupportFolderPath(): string;

    /**
     * If true then this extension should fail when it calls a deprecated method in the API. This is useful
     * during development.
     */
    shouldFailOnDeprecatedUse(): boolean;

    /**
     * An e-mail address that can be used to contact the author of this extension if a problem is detected with
     * it or null if none.
     */
    getErrorReportingEMail(): string;

    toString(): string;
  }
}

declare namespace com.bitwig.extension.api {
  // source: com/bitwig/extension/api/Color.java

  /**
   * This class represents an RGBA color with each component being stored as double.
   *
   * @since API version 5
   */
  class Color {
    constructor(red: number, green: number, blue: number, alpha: number);

    static fromRGB(red: number, green: number, blue: number): Color;

    static fromRGBA(
      red: number,
      green: number,
      blue: number,
      alpha: number
    ): Color;

    static fromRGB255(red: number, green: number, blue: number): Color;

    static fromRGBA255(
      red: number,
      green: number,
      blue: number,
      alpha: number
    ): Color;

    static fromHex(hex: string): Color;

    /**
     * Mixes two colors.
     * @since API version 4
     */
    static mix(c1: Color, c2: Color, blend: number): Color;

    toHex(): string;

    addHex2Number(sb: object, x: number): void;

    static nullColor(): Color;

    static blackColor(): Color;

    static whiteColor(): Color;

    getRed(): number;

    getGreen(): number;

    getBlue(): number;

    getAlpha(): number;

    getRed255(): number;

    getGreen255(): number;

    getBlue255(): number;

    getAlpha255(): number;

    mRed: number;

    mGreen: number;

    mBlue: number;

    mAlpha: number;
  }

  // source: com/bitwig/extension/api/Host.java

  import Bitmap = com.bitwig.extension.api.graphics.Bitmap;
  import BitmapFormat = com.bitwig.extension.api.graphics.BitmapFormat;
  import FontFace = com.bitwig.extension.api.graphics.FontFace;
  import FontOptions = com.bitwig.extension.api.graphics.FontOptions;
  import Image = com.bitwig.extension.api.graphics.Image;
  import OscModule = com.bitwig.extension.api.opensoundcontrol.OscModule;

  /**
   * Defines the interface through which an extension can talk to the host application.
   */
  interface Host {
    /**
     * Returns the latest supported API version of the host application.
     *
     * @return the latest supported API version of the host application
     * @since API version 1
     */
    getHostApiVersion(): number;

    /**
     * Returns the vendor of the host application.
     *
     * @return the vendor of the host application
     * @since API version 1
     */
    getHostVendor(): string;

    /**
     * Returns the product name of the host application.
     *
     * @return the product name of the host application
     * @since API version 1
     */
    getHostProduct(): string;

    /**
     * Returns the version number of the host application.
     *
     * @return the version number of the host application
     * @since API version 1
     */
    getHostVersion(): string;

    /**
     * The platform type that this host is running on.
     */
    getPlatformType(): PlatformType;

    /**
     * Sets an email address to use for reporting errors found in this script.
     *
     * @since API version 2
     */
    setErrorReportingEMail(address: string): void;

    /**
     * Gets the OpenSoundControl module.
     * @since API version 5
     */
    getOscModule(): OscModule;

    /**
     * Allocates some memory that will be automatically freed once the extension exits.
     *
     * @since API version 7
     */
    allocateMemoryBlock(size: number): MemoryBlock;

    /**
     * Creates an offscreen bitmap that the extension can use to render into. The memory used by this bitmap is
     * guaranteed to be freed once this extension exits.
     *
     * @since API version 7
     */
    createBitmap(width: number, height: number, format: BitmapFormat): Bitmap;

    /**
     * Loads a font.
     * The memory used by this font is guaranteed to be freed once this extension exits.
     *
     * @since API version 7
     */
    loadFontFace(path: string): FontFace;

    /**
     * Creates a new FontOptions.
     * This object is used to configure how the GraphicOutput will display text.
     * The memory used by this object is guaranteed to be freed once this extension exits.
     *
     * @since API version 7
     */
    createFontOptions(): FontOptions;

    /**
     * Loads a PNG image.
     * The memory used by this image is guaranteed to be freed once this extension exits.
     *
     * @since API version 7
     */
    loadPNG(path: string): Image;

    /**
     * Loads a SVG image.
     * The memory used by this image is guaranteed to be freed once this extension exits.
     *
     * @since API version 7
     */
    loadSVG(path: string, scale: number): Image;
  }

  // source: com/bitwig/extension/api/MemoryBlock.java

  import ByteBuffer = java.nio.ByteBuffer;

  /**
   * Defines a block of memory. The memory can be read/written using a {@link ByteBuffer} provided by
   * {@link #createByteBuffer()}.
   *
   * @since API version 7
   */
  interface MemoryBlock {
    /** The size in bytes of this memory block. */
    size(): number;

    /** Creates a {@link ByteBuffer} that can be used to read/write the data at this memory block. */
    createByteBuffer(): ByteBuffer;
  }

  // source: com/bitwig/extension/api/PlatformType.java

  enum PlatformType {
    WINDOWS = 0,
    LINUX = 1,
    MAC = 2,
  }
}

declare namespace com.bitwig.extension.api.graphics {
  // source: com/bitwig/extension/api/graphics/Bitmap.java

  import MemoryBlock = com.bitwig.extension.api.MemoryBlock;

  /**
   * Represents a bitmap image which can be painted via {@link #render(Renderer)}.
   *
   * @since API version 7
   */
  interface Bitmap extends Image {
    getWidth(): number;

    getHeight(): number;

    getFormat(): BitmapFormat;

    getMemoryBlock(): MemoryBlock;

    /**
     * Call this method to start painting the bitmap.
     * This method will take care of disposing allocated patterns during the rendering.
     *
     * @since API version 7
     */
    render(renderer: Renderer): void;

    /**
     * Call this method to show a window which displays the bitmap.
     * You should see this as a debug utility rather than a Control Surface API feature.
     *
     * @since API version 7
     */
    showDisplayWindow(): void;

    /**
     * Updates the display window title.
     *
     * @since API version 7
     */
    setDisplayWindowTitle(title: string): void;

    /**
     * Saves the image as a PPM file.
     * @param path the location of the target file.
     *
     * @since API version 7
     */
    saveToDiskAsPPM(path: string): void;
  }

  // source: com/bitwig/extension/api/graphics/BitmapFormat.java

  enum BitmapFormat {
    ARGB32 = 0,
    RGB24_32 = 1,
  }

  // source: com/bitwig/extension/api/graphics/FontExtents.java

  /**
   * Information about the dimensions of a font.
   */
  interface FontExtents {
    /**
     * Returns the distance that the font extends above the baseline. Note that this is not always
     * exactly equal to the maximum of the extents of all the glyphs in the font, but rather is
     * picked to express the font designer's intent as to how the font should align with elements
     * above it.
     */
    getAscent(): number;

    /**
     * Returns the distance that the font extends below the baseline. This value is positive for
     * typical fonts that include portions below the baseline. Note that this is not always exactly
     * equal to the maximum of the extents of all the glyphs in the font, but rather is picked to
     * express the font designer's intent as to how the the font should align with elements below it.
     */
    getDescent(): number;

    /**
     * Returns the recommended vertical distance between baselines when setting consecutive lines of
     * text with the font. This is greater than ascent+descent by a quantity known as the line
     * spacing or external leading. When space is at a premium, most fonts can be set with only a
     * distance of ascent+descent between lines.
     */
    getHeight(): number;

    /**
     * the maximum distance in the X direction that the the origin is advanced for any glyph in the
     * font.
     */
    getMaxAdvanceX(): number;

    /**
     * Returns the maximum distance in the Y direction that the the origin is advanced for any glyph
     * in the font. this will be zero for normal fonts used for horizontal writing. (The scripts of
     * East Asia are sometimes written vertically.)
     */
    getMaxAdvanceY(): number;
  }

  // source: com/bitwig/extension/api/graphics/FontFace.java

  /**
   * Represents a Font.
   */
  interface FontFace {
    /**
     * Get the font name.
     */
    getName(): string;
  }

  // source: com/bitwig/extension/api/graphics/FontOptions.java

  /**
   * Configure the font rendering options.
   */
  interface FontOptions {
    getAntialiasMode(): GraphicsOutput;

    setAntialiasMode(mode: GraphicsOutput): void;

    getSubPixelOrder(): GraphicsOutput;

    setSubPixelOrder(subPixelOrder: GraphicsOutput): void;

    getHintStyle(): GraphicsOutput;

    setHintStyle(hintStyle: GraphicsOutput): void;

    getHintMetrics(): GraphicsOutput;

    setHintMetrics(hintMetrics: GraphicsOutput): void;
  }

  // source: com/bitwig/extension/api/graphics/GradientPattern.java

  import Color = com.bitwig.extension.api.Color;

  /**
   * This class represents a linear gradient.
   * Add color stops between 0 and 1.
   */
  interface GradientPattern extends Pattern {
    addColorStop(offset: number, color: Color): void;

    addColorStop(
      offset: number,
      red: number,
      green: number,
      blue: number
    ): void;

    addColorStop(
      offset: number,
      red: number,
      green: number,
      blue: number,
      alpha: number
    ): void;
  }

  // source: com/bitwig/extension/api/graphics/GraphicsOutput.java

  enum AntialiasMode {
    DEFAULT = 0,
    OFF = 1,
    GOOD = 2,
    BEST = 3,
  }

  enum SubPixelOrder {
    DEFAULT = 0,
    RGB = 1,
    BGR = 2,
    VRGB = 3,
    VBGR = 4,
  }

  enum HintStyle {
    DEFAULT = 0,
    NONE = 1,
    SLIGHT = 2,
    MEDIUM = 3,
    FULL = 4,
  }

  enum HintMetrics {
    DEFAULT = 0,
    ON = 1,
    OFF = 2,
  }

  enum FillRule {
    WINDING = 0,
    EVEN_ODD = 1,
  }

  enum LineCap {
    BUTT = 0,
    LINE = 1,
    SQUARE = 2,
  }

  enum LineJoin {
    MITER = 0,
    ROUND = 1,
    BEVEL = 2,
  }

  enum Operator {
    CLEAR = 0,
    SOURCE = 1,
    OVER = 2,
    IN = 3,
    OUT = 4,
    ATOP = 5,
    DEST = 6,
    DEST_OVER = 7,
    DEST_IN = 8,
    DEST_OUT = 9,
    DEST_ATOP = 10,
    XOR = 11,
    ADD = 12,
    SATURATE = 13,
    MULTIPLY = 14,
    SCREEN = 15,
    OVERLAY = 16,
    DARKEN = 17,
    LIGHTEN = 18,
    COLOR_DODGE = 19,
    COLOR_BURN = 20,
    HARD_LIGHT = 21,
    SOFT_LIGHT = 22,
    DIFFERENCE = 23,
    EXCLUSION = 24,
    HSL_HUE = 25,
    HSL_SATURATION = 26,
    HSL_COLOR = 27,
    HSL_LUMINOSITY = 28,
  }

  /**
   * Provides 2D vector drawing API very similar to cairo graphics.
   * Please read https://www.cairographics.org/manual/ to get a better idea of how this API works.
   */
  interface GraphicsOutput {
    ///////////
    save(): void;

    restore(): void;

    //////////////
    clip(): void;

    clipPreserve(): void;

    resetClip(): void;

    /////////////////
    translate(x: number, y: number): void;

    rotate(angle: number): void;

    scale(factor: number): void;

    scale(xFactor: number, yFactor: number): void;

    /////////////////////
    newPath(): void;

    newSubPath(): void;

    copyPath(): Path;

    copyPathFlat(): Path;

    appendPath(path: Path): void;

    closePath(): void;

    moveTo(x: number, y: number): void;

    relMoveTo(x: number, y: number): void;

    lineTo(x: number, y: number): void;

    relLineTo(x: number, y: number): void;

    rectangle(x: number, y: number, width: number, height: number): void;

    arc(
      xc: number,
      yc: number,
      radius: number,
      angle1: number,
      angle2: number
    ): void;

    arcNegative(
      xc: number,
      yc: number,
      radius: number,
      angle1: number,
      angle2: number
    ): void;

    circle(centerX: number, centerY: number, radius: number): void;

    curveTo(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number
    ): void;

    relCurveTo(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number
    ): void;

    ///////////////////////////
    paint(): void;

    paintWithAlpha(alpha: number): void;

    mask(image: Image, x: number, y: number): void;

    fill(): void;

    fillPreserve(): void;

    stroke(): void;

    strokePreserve(): void;

    setColor(red: number, green: number, blue: number): void;

    setColor(red: number, green: number, blue: number, alpha: number): void;

    setColor(color: Color): void;

    setPattern(pattern: Pattern): void;

    setAntialias(antialiasMode: AntialiasMode): void;

    setLineWidth(width: number): void;

    setDash(dashes: number, offset: number): void;

    setDash(dashes: number): void;

    setFillRule(rule: FillRule): void;

    setLineCap(lineCap: LineCap): void;

    setLineJoin(lineJoin: LineJoin): void;

    setMiterLimit(limit: number): void;

    setOperator(operator: Operator): void;

    setTolerance(tolerance: number): void;

    drawImage(image: Image, x: number, y: number): void;

    //////////////
    createLinearGradient(
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ): GradientPattern;

    createMeshGradient(): MeshPattern;

    //////////
    showText(text: string): void;

    setFontSize(fontSize: number): void;

    setFontFace(fontFace: FontFace): void;

    setFontOptions(fontOptions: FontOptions): void;

    getFontExtents(): FontExtents;

    getTextExtents(text: string): TextExtents;
  }

  // source: com/bitwig/extension/api/graphics/Image.java

  /**
   * Represents an abstract image type.
   */
  interface Image {
    /** Returns the width */
    getWidth(): number;

    /** Returns the height */
    getHeight(): number;
  }

  // source: com/bitwig/extension/api/graphics/MeshPattern.java

  /**
   * This represent a 2D gradient.
   *
   * @link https://www.cairographics.org/manual/cairo-cairo-pattern-t.html#cairo-pattern-create-mesh
   */
  interface MeshPattern extends Pattern {
    beginPatch(): void;

    endPatch(): void;

    moveTo(x: number, y: number): void;

    lineTo(x: number, y: number): void;

    curveTo(
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number
    ): void;

    setCornerColor(
      corner: number,
      red: number,
      green: number,
      blue: number
    ): void;

    setCornerColor(
      corner: number,
      red: number,
      green: number,
      blue: number,
      alpha: number
    ): void;
  }

  // source: com/bitwig/extension/api/graphics/Path.java

  /**
   * Represents a Path
   */
  interface Path {}

  // source: com/bitwig/extension/api/graphics/Pattern.java

  /**
   * Abstract class for patterns (gradient, mesh gradient, ...)
   */
  interface Pattern {}

  // source: com/bitwig/extension/api/graphics/Renderer.java

  /**
   * This class is a renderer.
   * The render method will be called by the Host with a provided GraphicsOutput context.
   */
  interface Renderer {
    render(gc: GraphicsOutput): void;
  }

  // source: com/bitwig/extension/api/graphics/TextExtents.java

  /**
   * Represent the size required to display some text.
   */
  interface TextExtents {
    /**
     * Returns the horizontal distance from the origin to the leftmost part of the glyphs as drawn.
     * Positive if the glyphs lie entirely to the right of the origin.
     */
    getBearingX(): number;

    /**
     * Returns the vertical distance from the origin to the topmost part of the glyphs as drawn.
     * Positive only if the glyphs lie completely below the origin; will usually be negative.
     */
    getBearingY(): number;

    /** Returns the width of the glyphs as drawn. */
    getWidth(): number;

    /** Returns the height of the glyphs as drawn. */
    getHeight(): number;

    /** Returns the distance to advance in the X direction after drawing these glyphs. */
    getAdvanceX(): number;

    /**
     * Returns the distance to advance in the Y direction after drawing these glyphs. Will typically
     * be zero except for vertical text layout as found in East-Asian languages.
     */
    getAdvanceY(): number;
  }
}

declare namespace com.bitwig.extension.api.opensoundcontrol {
  // source: com/bitwig/extension/api/opensoundcontrol/OscAddressSpace.java

  /**
   * An OSC address space.
   *
   * It contains the root OscContainer.
   *
   * @since API version 5
   */
  interface OscAddressSpace {
    /**
     * Register all the methods annotated with {@link OscMethod} object.
     * Also, if a method is annotated with {@link OscNode}, this method will be called and the returned object's method
     * will be registered.
     */
    registerObjectMethods(addressPrefix: string, object: object): void;

    /**
     * Low level way to register an Osc Method.
     * @param address The address to register the method at
     * @param typeTagPattern The globing pattern used to match the type tag. Pass "*" to match anything.
     * @param desc The method description.
     * @param callback The OSC Method call handler.
     */
    registerMethod(
      address: string,
      typeTagPattern: string,
      desc: string,
      callback: OscMethodCallback
    ): void;

    /**
     * This method will be called if no registered OscMethod could handle incoming OscPacket.
     */
    registerDefaultMethod(callback: OscMethodCallback): void;

    /**
     * Should the address spaces log the messages it dispatches?
     * Default is false.
     */
    setShouldLogMessages(shouldLogMessages: boolean): void;

    /**
     * This gives a display name for this address space.
     * It is useful if you have multiple address space to identify them when we generate the documentation.
     */
    setName(name: string): void;
  }

  // source: com/bitwig/extension/api/opensoundcontrol/OscBundle.java

  import List = java.util.List;

  /**
   * An OSC Bundle.
   *
   * @since API version 5
   */
  interface OscBundle extends OscPacket {
    getNanoseconds(): number;

    getPackets(): List<OscPacket>;
  }

  // source: com/bitwig/extension/api/opensoundcontrol/OscConnection.java

  /**
   * This interface lets you send OscMessage through an connection which can be via Tcp, Udp, or whatever.
   *
   * OscPackets are sent when all the startBundle() have a matching endBundle().
   * If you call sendMessage() with startBundle() before, then the message will be sent directly.
   *
   * Our maximum packet size is 64K.
   *
   * @since API version 5
   */
  interface OscConnection {
    /**
     * Starts an OscBundle.
     */
    startBundle(): void;

    /**
     * Supported object types:
     * - Integer for int32
     * - Long for int64
     * - Float for float
     * - Double for double
     * - null for nil
     * - Boolean for true and false
     * - String for string
     * - byte[] for blob
     */
    sendMessage(address: string, ...args: object[]): void;

    /**
     * Finishes the previous bundle, and if it was not inside an other bundle, it will send the message
     * directly.
     */
    endBundle(): void;
  }

  // source: com/bitwig/extension/api/opensoundcontrol/OscMessage.java

  /**
   * An OSC message.
   *
   * @since API version 5
   */
  interface OscMessage extends OscPacket {
    getAddressPattern(): string;

    getTypeTag(): string;

    getArguments(): List<object>;

    getString(index: number): string;

    getBlob(index: number): number;

    getInt(index: number): number;

    getLong(index: number): number;

    getFloat(index: number): number;

    getDouble(index: number): number;

    getBoolean(index: number): boolean;
  }

  // source: com/bitwig/extension/api/opensoundcontrol/OscMethod.java

  // source: com/bitwig/extension/api/opensoundcontrol/OscMethodCallback.java

  interface OscMethodCallback {
    (source: OscConnection, message: OscMessage): void;
  }

  // source: com/bitwig/extension/api/opensoundcontrol/OscModule.java

  /**
   * Interface to create Osc related object.
   *
   * @since API version 5
   */
  interface OscModule {
    /**
     * Creates a new OscAddressSpace.
     *
     * In short the OscAddressSpace dispatches the incoming messages to services.
     * An OscAddressSpace is an OscService.
     *
     * @since API version 5
     */
    createAddressSpace(): OscAddressSpace;

    /**
     * Creates a new OSC Server.
     *
     * @param addressSpace Use {@link #createAddressSpace()}
     * @since API version 5
     */
    createUdpServer(port: number, addressSpace: OscAddressSpace): void;

    /**
     * Creates a new OSC Server.
     * This server is not started yet, you'll have to start it by calling server.start(port);
     * Use this method if the port is not known during the initialization (coming from a setting)
     * or if the port number can change at runtime.
     *
     * @param addressSpace Use {@link #createAddressSpace()}
     * @return a new OscServer
     * @since API version 10
     */
    createUdpServer(addressSpace: OscAddressSpace): OscServer;

    /**
     * Tries to connect to an OscServer.
     *
     * @param addressSpace can be null
     *
     * @return a new OscConnection
     * @since API version 5
     */
    connectToUdpServer(
      host: string,
      port: number,
      addressSpace: OscAddressSpace
    ): OscConnection;
  }

  // source: com/bitwig/extension/api/opensoundcontrol/OscNode.java

  // source: com/bitwig/extension/api/opensoundcontrol/OscPacket.java

  /**
   * Base class for OscPackets.
   *
   * @since API version 5
   */
  interface OscPacket {
    /**
     * If the message was part of a bundle, get a pointer back to it.
     * If not, this methods returns null.
     */
    getParentBundle(): OscBundle;
  }

  // source: com/bitwig/extension/api/opensoundcontrol/OscServer.java

  /**
   * @since API version 10
   */
  interface OscServer {
    /**
     * Starts or restarts the server and restarts it on the given port.
     * @since API version 10
     */
    start(port: number): void;
  }
}

declare namespace com.bitwig.extension.api.util.midi {
  // source: com/bitwig/extension/api/util/midi/ShortMidiMessage.java

  class ShortMidiMessage {
    static NOTE_OFF: number;

    static NOTE_ON: number;

    static POLY_PRESSURE: number;

    static CONTROL_CHANGE: number;

    static PROGRAM_CHANGE: number;

    static CHANNEL_PRESSURE: number;

    static PITCH_BEND: number;

    static MIDI_TIME_CODE: number;

    static SONG_POSITION_POINTER: number;

    static SONG_SELECT: number;

    static TUNE_REQUEST: number;

    static TIMING_CLOCK: number;

    static START: number;

    static CONTINUE: number;

    static STOP: number;

    static ACTIVE_SENSING: number;

    static SYSTEM_RESET: number;

    constructor(status: number, data1: number, data2: number);

    getStatusByte(): number;

    getData1(): number;

    getData2(): number;

    getChannel(): number;

    getStatusMessage(): number;

    isNoteOff(): boolean;

    isNoteOn(): boolean;

    isPitchBend(): boolean;

    isPolyPressure(): boolean;

    isControlChange(): boolean;

    isProgramChange(): boolean;

    isChannelPressure(): boolean;

    toString(): string;

    mData: number;
  }

  // source: com/bitwig/extension/api/util/midi/SysexBuilder.java

  class SysexBuilder {
    static MAX_LENGTH: number;

    static fromHex(hexString: string): SysexBuilder;

    addByte(value: number): SysexBuilder;

    addString(string: string, length: number): SysexBuilder;

    add(bytes: number): SysexBuilder;

    addHex(hex: string): SysexBuilder;

    terminate(): number;

    array(): number;

    mData: number;

    mLength: number;
  }
}

declare namespace com.bitwig.extension.callback {
  // source: com/bitwig/extension/callback/BooleanValueChangedCallback.java

  interface BooleanValueChangedCallback extends ValueChangedCallback {
    (newValue: boolean): void;
  }

  // source: com/bitwig/extension/callback/Callback.java

  interface Callback {}

  // source: com/bitwig/extension/callback/ClipLauncherSlotBankPlaybackStateChangedCallback.java

  interface ClipLauncherSlotBankPlaybackStateChangedCallback extends Callback {
    /**
     * Registers an observer that reports the playback state of clips / slots. The reported states include
     * `stopped`, `playing`, `recording`, but also `queued for stop`, `queued for playback`, `queued for
     * recording`.
     *
     * @param callback
     *           a callback function that receives three parameters: 1. the slot index (integer), 2. the queued
     *           or playback state: `0` when stopped, `1` when playing, or `2` when recording, and 3. a boolean
     *           parameter indicating if the second argument is referring to the queued state (`true`) or the
     *           actual playback state (`false`)
     * @since API version 1
     */
    (slotIndex: number, playbackState: number, isQueued: boolean): void;
  }

  // source: com/bitwig/extension/callback/ColorValueChangedCallback.java

  import Color = com.bitwig.extension.api.Color;

  interface ColorValueChangedCallback extends ValueChangedCallback {
    /**
     * As alpha component was introduced after this interface was released,
     * the alpha component is not part of the parameter and would have to be
     * checked manually.
     */
    (red: number, green: number, blue: number): void;
  }

  // source: com/bitwig/extension/callback/ConnectionEstablishedCallback.java

  import RemoteConnection = com.bitwig.extension.controller.api.RemoteConnection;

  interface ConnectionEstablishedCallback extends Callback {
    (connection: RemoteConnection): void;
  }

  // source: com/bitwig/extension/callback/DataReceivedCallback.java

  interface DataReceivedCallback extends Callback {
    (data: number): void;
  }

  // source: com/bitwig/extension/callback/DirectParameterDisplayedValueChangedCallback.java

  interface DirectParameterDisplayedValueChangedCallback extends Callback {
    (id: string, value: string): void;
  }

  // source: com/bitwig/extension/callback/DirectParameterNameChangedCallback.java

  interface DirectParameterNameChangedCallback extends Callback {
    (id: string, name: string): void;
  }

  // source: com/bitwig/extension/callback/DirectParameterNormalizedValueChangedCallback.java

  interface DirectParameterNormalizedValueChangedCallback extends Callback {
    (id: string, normalizedValue: number): void;
  }

  // source: com/bitwig/extension/callback/DoubleValueChangedCallback.java

  interface DoubleValueChangedCallback extends ValueChangedCallback {
    (newValue: number): void;
  }

  // source: com/bitwig/extension/callback/EnumValueChangedCallback.java

  interface EnumValueChangedCallback
    extends ObjectValueChangedCallback<string> {}

  // source: com/bitwig/extension/callback/FloatValueChangedCallback.java

  interface FloatValueChangedCallback extends Callback {
    (newValue: number): void;
  }

  // source: com/bitwig/extension/callback/IndexedBooleanValueChangedCallback.java

  interface IndexedBooleanValueChangedCallback
    extends IndexedValueChangedCallback {
    /**
     * Registers an observer that reports the names of the scenes and slots. The slot names reflect the names
     * of containing clips.
     *
     * @param callback
     *           a callback function receiving two parameters: 1. the slot index (integer) within the
     *           configured window, and 2. the name of the scene/slot (string)
     * @since API version 1
     */
    (index: number, newValue: boolean): void;
  }

  // source: com/bitwig/extension/callback/IndexedColorValueChangedCallback.java

  interface IndexedColorValueChangedCallback
    extends IndexedValueChangedCallback {
    /**
     * Registers an observer that reports the names of the scenes and slots. The slot names reflect the names
     * of containing clips.
     *
     * @param callback
     *           a callback function receiving two parameters: 1. the slot index (integer) within the
     *           configured window, and 2. the name of the scene/slot (string)
     * @since API version 1
     */
    (index: number, red: number, green: number, blue: number): void;
  }

  // source: com/bitwig/extension/callback/IndexedStringValueChangedCallback.java

  interface IndexedStringValueChangedCallback
    extends IndexedValueChangedCallback {
    /**
     * Registers an observer that reports the names of the scenes and slots. The slot names reflect the names
     * of containing clips.
     *
     * @param callback
     *           a callback function receiving two parameters: 1. the slot index (integer) within the
     *           configured window, and 2. the name of the scene/slot (string)
     * @since API version 1
     */
    (index: number, newValue: string): void;
  }

  // source: com/bitwig/extension/callback/IndexedValueChangedCallback.java

  interface IndexedValueChangedCallback extends Callback {}

  // source: com/bitwig/extension/callback/IntegerValueChangedCallback.java

  interface IntegerValueChangedCallback extends ValueChangedCallback {
    (newValue: number): void;
  }

  // source: com/bitwig/extension/callback/NoArgsCallback.java

  interface NoArgsCallback extends Callback {
    (): void;
  }

  // source: com/bitwig/extension/callback/NotePlaybackCallback.java

  interface NotePlaybackCallback extends Callback {
    (isNoteOn: boolean, key: number, velocity: number): void;
  }

  // source: com/bitwig/extension/callback/NoteStepChangedCallback.java

  import NoteStep = com.bitwig.extension.controller.api.NoteStep;

  interface NoteStepChangedCallback extends Callback {
    (noteStep: NoteStep): void;
  }

  // source: com/bitwig/extension/callback/ObjectValueChangedCallback.java

  interface ObjectValueChangedCallback<ValueType> extends ValueChangedCallback {
    (newValue: ValueType): void;
  }

  // source: com/bitwig/extension/callback/ShortMidiDataReceivedCallback.java

  interface ShortMidiDataReceivedCallback extends Callback {
    /**
     * Registers a callback for receiving short (normal) MIDI messages on this MIDI input port.
     *
     * @param callback
     *           a callback function that receives three integer parameters: 1. the status byte 2. the data1
     *           value 2. the data2 value
     * @since API version 1
     */
    (statusByte: number, data1: number, data2: number): void;
  }

  // source: com/bitwig/extension/callback/ShortMidiMessageReceivedCallback.java

  import ShortMidiMessage = com.bitwig.extension.api.util.midi.ShortMidiMessage;

  interface ShortMidiMessageReceivedCallback
    extends ShortMidiDataReceivedCallback {
    /**
     * Registers a callback for receiving short (normal) MIDI messages on this MIDI input port.
     *
     * @param callback
     *           a callback function that receives a ShortMidiMessage instance.
     * @since API version 2
     */
    (msg: ShortMidiMessage): void;

    (statusByte: number, data1: number, data2: number): void;
  }

  // source: com/bitwig/extension/callback/StepDataChangedCallback.java

  interface StepDataChangedCallback extends Callback {
    /**
     * A callback function that receives three parameters: 1. the x (step) coordinate within the note grid
     * (integer), 2. the y (key) coordinate within the note grid (integer), and 3. an integer value that
     * indicates if the step is empty (`0`) or if a note continues playing (`1`) or starts playing (`2`).
     */
    (x: number, y: number, state: number): void;
  }

  // source: com/bitwig/extension/callback/StringArrayValueChangedCallback.java

  interface StringArrayValueChangedCallback
    extends ObjectValueChangedCallback<string[]> {}

  // source: com/bitwig/extension/callback/StringValueChangedCallback.java

  interface StringValueChangedCallback
    extends ObjectValueChangedCallback<string> {}

  // source: com/bitwig/extension/callback/SysexMidiDataReceivedCallback.java

  interface SysexMidiDataReceivedCallback extends Callback {
    /**
     * @param data
     *           The data encoded as a hex string
     */
    (data: string): void;
  }

  // source: com/bitwig/extension/callback/ValueChangedCallback.java

  interface ValueChangedCallback extends Callback {}
}

declare namespace com.bitwig.extension.controller {
  // source: com/bitwig/extension/controller/AutoDetectionMidiPortNames.java

  class AutoDetectionMidiPortNames {
    constructor(inputNames: string[], outputNames: string[]);

    getInputNames(): string[];

    getOutputNames(): string[];

    mInputNames: string[];
  }

  // source: com/bitwig/extension/controller/AutoDetectionMidiPortNamesList.java

  import List = java.util.List;

  class AutoDetectionMidiPortNamesList {
    add(inputNames: string[], outputNames: string[]): void;

    getPortNames(): List<AutoDetectionMidiPortNames>;

    getCount(): number;

    getPortNamesAt(index: number): AutoDetectionMidiPortNames;

    mList: List<AutoDetectionMidiPortNames>;
  }

  // source: com/bitwig/extension/controller/ControllerExtension.java

  import Extension = com.bitwig.extension.Extension;
  import ControllerHost = com.bitwig.extension.controller.api.ControllerHost;
  import MidiIn = com.bitwig.extension.controller.api.MidiIn;
  import MidiOut = com.bitwig.extension.controller.api.MidiOut;

  /**
   * Defines an extension that enabled a controller to work with Bitwig Studio.
   */
  class ControllerExtension extends Extension<
    ControllerHost,
    ControllerExtensionDefinition
  > {
    constructor(
      definition: ControllerExtensionDefinition,
      host: ControllerHost
    );

    getMidiInPort(index: number): MidiIn;

    getMidiOutPort(index: number): MidiOut;

    /**
     * Initializes this controller extension. This will be called once when the extension is started. During initialization the
     * extension should call the various create methods available via the {@link ControllerHost} interface in order to
     * create objects used to communicate with various parts of the Bitwig Studio application (e.g
     * {@link ControllerHost#createCursorTrack(int, int)}.
     */
    init(): void;

    /**
     * Called once when this controller extension is stopped.
     */
    exit(): void;

    /**
     * Called when this controller extension should flush any pending updates to the controller.
     */
    flush(): void;
  }

  // source: com/bitwig/extension/controller/ControllerExtensionDefinition.java

  import ExtensionDefinition = com.bitwig.extension.ExtensionDefinition;
  import PlatformType = com.bitwig.extension.api.PlatformType;

  /**
   * Defines an extension that enabled a controller to work with Bitwig Studio.
   */
  class ControllerExtensionDefinition extends ExtensionDefinition {
    toString(): string;

    /** The vendor of the controller that this extension is for. */
    getHardwareVendor(): string;

    /** The model name of the controller that this extension is for. */
    getHardwareModel(): string;

    /** The number of MIDI in ports that this controller extension has. */
    getNumMidiInPorts(): number;

    /** The number of MIDI out ports that this controller extension has. */
    getNumMidiOutPorts(): number;

    /**
     * Obtains a {@link AutoDetectionMidiPortNamesList} that defines the names of the MIDI in and out ports
     * that can be used for auto detection of the controller for the supplied platform type.
     */
    getAutoDetectionMidiPortNamesList(
      platformType: PlatformType
    ): AutoDetectionMidiPortNamesList;

    /**
     * Lists the {@link AutoDetectionMidiPortNames} that defines the names of the MIDI in and out ports that
     * can be used for auto detection of the controller for the supplied platform type.
     */
    listAutoDetectionMidiPortNames(
      list: AutoDetectionMidiPortNamesList,
      platformType: PlatformType
    ): void;

    getHardwareDeviceMatcherList(): HardwareDeviceMatcherList;

    /**
     * Lists the hardware devices that this controller needs to function. For each device that is listed the
     * user will see a chooser in the preferences for this extension that allows them to choose a connected
     * device. The {@link HardwareDeviceMatcher} will also be used during auto detection to automatically add
     * and select the device if possible.
     *
     * @since API version 7
     */
    listHardwareDevices(list: HardwareDeviceMatcherList): void;

    /** Creates an instance of this extension. */
    createInstance(host: ControllerHost): ControllerExtension;
  }

  // source: com/bitwig/extension/controller/HardwareDeviceMatcher.java

  /** Matcher that can match a particular hardware device that is connected to the user's machine.
   * Sub classes of this define how the hardware is connected.
   * Currently only USB devices are supported.
   * @see UsbDeviceMatcher
   * @see ControllerExtensionDefinition#listHardwareDevices(java.util.List)*/
  class HardwareDeviceMatcher {
    constructor(name: string);

    /** Human friendly name for the kinds of hardware devices this matcher matches. */
    getName(): string;

    mName: string;
  }

  // source: com/bitwig/extension/controller/HardwareDeviceMatcherList.java

  /**
   * Defines a list of all the hardware devices that a controller needs.
   *
   * @since API version 7
   */
  class HardwareDeviceMatcherList {
    /**
     * Adds information about a hardware device that is needed and how it can be matched. The hardware device
     * will need to match at least one of the supplied matchers.
     *
     * For each entry added to this list the user will see a device chooser that lets them select an
     * appropriate device. The information added here is also used for auto detection purposes.
     */
    add(...deviceMatchers: HardwareDeviceMatcher[]): void;

    /** The number of hardware devices in the list. */
    getCount(): number;

    getHardwareDeviceMatchersAt(index: number): HardwareDeviceMatcher[];

    getList(): List<HardwareDeviceMatcher[]>;

    mList: List<HardwareDeviceMatcher[]>;
  }

  // source: com/bitwig/extension/controller/UsbConfigurationMatcher.java

  class UsbConfigurationMatcher extends UsbMatcher {
    constructor(expression: string, matchOccurrenceIndex: number);

    constructor(expression: string);

    constructor(matchOccurrenceIndex: number);

    constructor();

    getInterfaceMatchers(): UsbInterfaceMatcher[];

    mInterfaceMatchers: UsbInterfaceMatcher[];
  }

  // source: com/bitwig/extension/controller/UsbDeviceMatcher.java

  /**
   * Defines information needed to identify suitable USB devices for use by an extension.
   *
   * @since API version 7
   */
  class UsbDeviceMatcher extends HardwareDeviceMatcher {
    /**
     * Creates a {@link UsbDeviceMatcher} that matches a USB device that matches the supplied expression and
     * has a configuration matching the supplied {@link UsbConfigurationMatcher}.
     *
     * @param name
     *           A human friendly name that describes the kind of devices this matcher tries to match.
     *
     * @param expression
     *           An expression that can be used on the USB device descriptor to decide if the device matches.
     *           Variables in the expression can refer to the following fields of the device descriptor:
     *
     *           - bDeviceClass - bDeviceSubClass - bDeviceProtocol - idVendor - idProduct
     *
     *           For example to match a device that has vendor id 0x10 product id 0x20 the expression would be:
     *
     *           "idVendor == 0x10 && idProduct == 0x20"
     *
     * @param configurationMatcher
     *           Object that tries to match a configuration on the device that it can use.
     *
     * @see https://beyondlogic.org/usbnutshell/usb5.shtml for more information about USB device descriptors.
     */
    constructor(
      name: string,
      expression: string,
      configurationMatcher: UsbConfigurationMatcher
    );

    /**
     * Creates a {@link UsbDeviceMatcher} that matches a USB device that matches the supplied expression and
     * has a configuration matching the supplied {@link UsbInterfaceMatcher}s.
     *
     * @param name
     *           A human friendly name that describes the kind of devices this matcher tries to match.
     *
     * @param expression
     *           An expression that can be used on the USB device descriptor to decide if the device matches.
     *           Variables in the expression can refer to the following fields of the device descriptor:
     *
     *           - bDeviceClass - bDeviceSubClass - bDeviceProtocol - idVendor - idProduct
     *
     *           For example to match a device that has vendor id 0x10 product id 0x20 the expression would be:
     *
     *           "idVendor == 0x10 && idProduct == 0x20"
     *
     * @param interfaceMatchers
     *           {@link UsbInterfaceMatcher}s that define the USB interface descriptors that a configuration of
     *           the device needs to have.
     *
     * @see https://beyondlogic.org/usbnutshell/usb5.shtml for more information about USB device descriptors.
     */
    constructor(name: string, expression: string);

    /** An expression that can be used on the USB device descriptor to decide if the device matches.
     *           Variables in the expression can refer to the following fields of the device descriptor:
     *
     *           - bDeviceClass - bDeviceSubClass - bDeviceProtocol - idVendor - idProduct
     *
     *           For example to match a device that has vendor id 0x10 product id 0x20 the expression would be:
     *
     *           "idVendor == 0x10 && idProduct == 0x20"
     *           */
    getExpression(): string;

    /** Object that tries to match a configuration on the device that it can use. */
    getConfigurationMatcher(): UsbConfigurationMatcher;

    mExpression: string;

    mConfigurationMatcher: UsbConfigurationMatcher;
  }

  // source: com/bitwig/extension/controller/UsbEndpointMatcher.java

  import UsbTransferDirection = com.bitwig.extension.controller.api.UsbTransferDirection;
  import UsbTransferType = com.bitwig.extension.controller.api.UsbTransferType;

  class UsbEndpointMatcher extends UsbMatcher {
    constructor(
      direction: UsbTransferDirection,
      transferType: UsbTransferType,
      expression: string,
      matchOccurrenceIndex: number
    );

    constructor(
      direction: UsbTransferDirection,
      transferType: UsbTransferType,
      expression: string
    );

    constructor(transferType: UsbTransferType, bEndpointAddress: number);

    getDirection(): UsbTransferDirection;

    getTransferType(): UsbTransferType;

    mDirection: UsbTransferDirection;

    mTransferType: UsbTransferType;
  }

  // source: com/bitwig/extension/controller/UsbInterfaceMatcher.java

  class UsbInterfaceMatcher extends UsbMatcher {
    constructor(expression: string, matchOccurrence: number);

    constructor(expression: string);

    getEndpointMatchers(): UsbEndpointMatcher[];

    mEndpointMatchers: UsbEndpointMatcher[];
  }

  // source: com/bitwig/extension/controller/UsbMatcher.java

  class UsbMatcher {
    constructor(expression: string, matchOccurrence: number);

    getExpression(): string;

    getMatchOccurrence(): number;

    mExpression: string;

    mMatchOccurrence: number;
  }
}

declare namespace com.bitwig.extension.controller.api {
  // source: com/bitwig/extension/controller/api/AbsoluteHardwarControlBindable.java

  /**
   * Something that can be bound to an {@link AbsoluteHardwareControl} and can respond to the user input (such
   * as user moving a slider up or down) in a meaningful way.
   *
   * @since API version 10
   */
  interface AbsoluteHardwarControlBindable extends HardwareBindable {
    /**
     * Binds this target to the supplied hardware control so that when the user moves the hardware control this
     * target will respond in a meaningful way.
     *
     * When the binding is no longer needed the {@link HardwareBinding#removeBinding()} method can be called on
     * it.
     *
     * @return The newly created binding
     */
    addBinding(
      hardwareControl: AbsoluteHardwareControl
    ): AbsoluteHardwareControlBinding;

    /**
     * Binds this target to the supplied hardware control so that when the user moves the hardware control this
     * target will respond in a meaningful way. This target will be adjusted within the supplied normalized
     * range.
     *
     * When the binding is no longer needed the {@link HardwareBinding#removeBinding()} method can be called on
     * it.
     *
     * @return The newly created binding
     */
    addBindingWithRange(
      hardwareControl: AbsoluteHardwareControl,
      minNormalizedValue: number,
      maxNormalizedValue: number
    ): AbsoluteHardwareControlBinding;
  }

  // source: com/bitwig/extension/controller/api/AbsoluteHardwareControl.java

  /**
   * Represents a hardware control that can input and absolute value (for example, a slider, knob or foot
   * pedal).
   *
   * @since API version 10
   */
  interface AbsoluteHardwareControl
    extends ContinuousHardwareControl<AbsoluteHardwareControlBinding> {
    /**
     * Sets the {@link AbsoluteHardwareValueMatcher} that can be used to detect when the user adjusts the
     * hardware control's value.
     *
     * @see MidiIn#createAbsoluteCCValueMatcher(int, int)
     * @see MidiIn#createAbsoluteValueMatcher(String, String, int)
     */
    setAdjustValueMatcher(matcher: AbsoluteHardwareValueMatcher): void;

    /**
     * The current value of this hardware control (0..1)
     */
    value(): DoubleValue;

    /**
     * Determines if this hardware control should immediately take over the parameter it is bound to rather
     * than respecting the user's current take over mode.
     *
     * This is useful for motorized sliders for example, where the slider is already at the value of the bound
     * parameter.
     */
    disableTakeOver(): void;

    /** Adds a new binding from this hardware control to the supplied target. */
    addBindingWithRange(
      target: AbsoluteHardwarControlBindable,
      minNormalizedValue: number,
      maxNormalizedValue: number
    ): AbsoluteHardwareControlBinding;

    /**
     * Convenience methods that ensures there is only a single binding to the supplied target. This is
     * equivalent to calling {@link #clearBindings()} and then
     * {@link #addBindingWithRange(AbsoluteHardwarControlBindable, double, double)}
     */
    setBindingWithRange(
      target: AbsoluteHardwarControlBindable,
      minNormalizedValue: number,
      maxNormalizedValue: number
    ): AbsoluteHardwareControlBinding;
  }

  // source: com/bitwig/extension/controller/api/AbsoluteHardwareControlBinding.java

  /**
   * Represents a binding from an {@link AbsoluteHardwareControl} to some target.
   *
   * @since API version 10
   *  */
  interface AbsoluteHardwareControlBinding
    extends HardwareBinding,
      HardwareBindingWithRange {}

  // source: com/bitwig/extension/controller/api/AbsoluteHardwareKnob.java

  /**
   * Represents a physical hardware knob that inputs an absolute value.
   *
   * @see HardwareSurface#createAbsoluteHardwareKnob(String)
   *
   * @since API version 10
   */
  interface AbsoluteHardwareKnob extends AbsoluteHardwareControl {}

  // source: com/bitwig/extension/controller/api/AbsoluteHardwareValueMatcher.java

  /**
   * Defines a means of recognizing when an absolute value is input by the user (for example, when moving a
   * slider or turning a knob based on some MIDI message). This matcher can then be set on an
   * {@link AbsoluteHardwareControl} using
   * {@link AbsoluteHardwareControl#setAdjustValueMatcher(AbsoluteHardwareValueMatcher)}.
   *
   * @see MidiIn#createAbsoluteValueMatcher(String, String, int)
   * @see MidiIn#createAbsoluteCCValueMatcher(int, int)
   * @see MidiIn#createAbsolutePitchBendValueMatcher(int)
   *
   * @since API version 10
   *
   */
  interface AbsoluteHardwareValueMatcher
    extends ContinuousHardwareValueMatcher {}

  // source: com/bitwig/extension/controller/api/Action.java

  /**
   * Instances of this interface represent actions in Bitwig Studio, such as commands that can be launched from
   * the main menu or via keyboard shortcuts.
   *
   * To receive the list of all actions provided by Bitwig Studio call {@link Application#getActions()}. The
   * list of actions that belong to a certain category can be queried by calling
   * {@link ActionCategory#getActions()}. Access to specific actions is provided in
   * {@link Application#getAction(String)}.
   *
   * @since API version 1
   */
  interface Action extends HardwareActionBindable {
    /**
     * Returns a string the identifies this action uniquely.
     *
     * @return the identifier string
     * @since API version 1
     */
    getId(): string;

    /**
     * Returns the name of this action.
     *
     * @return the name string
     * @since API version 1
     */
    getName(): string;

    /**
     * Returns the category of this action.
     *
     * @return the category string
     * @since API version 1
     */
    getCategory(): ActionCategory;

    /**
     * Returns the text that is displayed in menu items associated with this action.
     *
     * @return the menu item text
     * @since API version 1
     */
    getMenuItemText(): string;

    /**
     * Invokes the action.
     *
     * @since API version 1
     */
    invoke(): void;
  }

  // source: com/bitwig/extension/controller/api/ActionCategory.java

  /**
   * Instances of this interface are used to categorize actions in Bitwig Studio. The list of action categories
   * provided by Bitwig Studio can be queried by calling {@link Application#getActionCategories()}. To receive a
   * specific action category call {@link Application#getActionCategory(String)}.
   *
   * @see Application#getActionCategories()
   * @see Application#getActionCategory(String)
   * @since API version 1
   */
  interface ActionCategory {
    /**
     * Returns a string the identifies this action category uniquely.
     *
     * @return the identifier string
     * @since API version 1
     */
    getId(): string;

    /**
     * Returns the name of this action category.
     *
     * @return the name string
     * @since API version 1
     */
    getName(): string;

    /**
     * Lists all actions in this category.
     *
     * @return the array of actions in this category
     * @since API version 1
     */
    getActions(): Action[];
  }

  // source: com/bitwig/extension/controller/api/Application.java

  import BooleanValueChangedCallback = com.bitwig.extension.callback.BooleanValueChangedCallback;
  import StringValueChangedCallback = com.bitwig.extension.callback.StringValueChangedCallback;

  /**
   * An interface that provides methods for accessing the most common global application commands.
   *
   * In addition, functions are provided for accessing any application action in a generic and categorized way,
   * pretty much as displayed in the Bitwig Studio commander dialog (see {@link #getActions()},
   * {@link #getAction(String)}, {@link #getActionCategories()}), {@link #getActionCategory(String)}).
   *
   * To receive an instance of the application interface call {@link ControllerHost#createApplication()}.
   */
  interface Application {
    /**
     * This identifier can be used as parameter for {@link #setPanelLayout(String)} in order to switch to the
     * `ARRANGE` panel layout that is available in various display profiles.
     */
    PANEL_ARRANGE_ARRANGE: 'ARRANGE';

    /**
     * This identifier can be used as parameter for {@link #setPanelLayout(String)} in order to switch to the
     * `EDIT` panel layout that is available in various display profiles.
     */
    PANEL_MIX_ARRANGE: 'MIX';

    /**
     * This identifier can be used as parameter for {@link #setPanelLayout(String)} in order to switch to the
     * `MIX` panel layout that is available in various display profiles.
     */
    PANEL_EDIT_ARRANGE: 'EDIT';

    /**
     * Creates a new audio track at the given position.
     *
     * @param position
     *           the index within the list of main tracks where the new track should be inserted, or `-1` in
     *           case the track should be inserted at the end of the list. Values outside the valid range will
     *           get pinned to the valid range, so the actual position might be different from the provided
     *           parameter value.
     * @since API version 1
     */
    createAudioTrack(position: number): void;

    /**
     * Creates a new instrument track at the given position.
     *
     * @param position
     *           the index within the list of main tracks where the new track should be inserted, or `-1` in
     *           case the track should be inserted at the end of the list. Values outside the valid range will
     *           get pinned to the valid range, so the actual position might be different from the provided
     *           parameter value.
     * @since API version 1
     */
    createInstrumentTrack(position: number): void;

    /**
     * Creates a new effect track at the given position.
     *
     * @param position
     *           the index within the list of effect tracks where the new track should be inserted, or `-1` in
     *           case the track should be inserted at the end of the list. Values outside the valid range will
     *           get pinned to the valid range, so the actual position might be different from the provided
     *           parameter value.
     * @since API version 1
     */
    createEffectTrack(position: number): void;

    /**
     * Returns a list of actions that the application supports. Actions are commands in Bitwig Studio that are
     * typically accessible through menus or keyboard shortcuts.
     *
     * Please note that many of the commands encapsulated by the reported actions are also accessible through
     * other (probably more convenient) interfaces methods of the API. In contrast to that, this method
     * provides a more generic way to find available application functionality.
     *
     * @return the list of actions
     * @since API version 1
     */
    getActions(): Action[];

    /**
     * Returns the action for the given action identifier. For a list of available actions, see
     * {@link #getActions()}.
     *
     * @param id
     *           the action identifier string, must not be `null`
     * @return the action associated with the given id, or null in case there is no action with the given
     *         identifier.
     * @since API version 1
     */
    getAction(id: string): Action;

    /**
     * Returns a list of action categories that is used by Bitwig Studio to group actions into categories.
     *
     * @return the list of action categories
     * @since API version 1
     */
    getActionCategories(): ActionCategory[];

    /**
     * Returns the action category associated with the given identifier. For a list of available action
     * categories, see {@link #getActionCategories()}.
     *
     * @param id
     *           the category identifier string, must not be `null`
     * @return the action associated with the given id, or null in case there is no category with the given
     *         identifier
     * @since API version 1
     */
    getActionCategory(id: string): ActionCategory;

    /**
     * Activates the audio engine in Bitwig Studio.
     *
     * @since API version 1
     */
    activateEngine(): void;

    /**
     * Deactivates the audio engine in Bitwig Studio.
     *
     * @since API version 1
     */
    deactivateEngine(): void;

    /**
     * Value that reports whether an audio engine is active or not.
     *
     * @since API version 2
     */
    hasActiveEngine(): BooleanValue;

    /**
     * Registers an observer that gets called when the audio engine becomes active or inactive.
     *
     * @param callable
     *           a callback function that accepts a single boolean parameter. The callback parameter indicates
     *           whether the audio engine became active (true) or inactive (false).
     * @since API version 1
     * @deprecated Use {@link #hasActiveEngine()} instead.
     */
    addHasActiveEngineObserver(callable: BooleanValueChangedCallback): void;

    /**
     * Value that reports the name of the current project.
     *
     * @since API version 2
     */
    projectName(): StringValue;

    /**
     * Registers an observer that reports the name of the current project.
     *
     * @param callback
     *           a callback function that accepts a single string parameter.
     * @param maxChars
     *           the maximum length of the reported name. Longer names will get truncated.
     * @since API version 1
     * @deprecated Use {@link #projectName()} instead.
     */
    addProjectNameObserver(
      callback: StringValueChangedCallback,
      maxChars: number
    ): void;

    /**
     * Switches to the next project tab in Bitwig Studio.
     *
     * @since API version 1
     */
    nextProject(): void;

    /**
     * Switches to the previous project tab in Bitwig Studio.
     *
     * @since API version 1
     */
    previousProject(): void;

    /**
     * Set BitwigStudio to navigate into the group.
     *
     * @since API version 2
     */
    navigateIntoTrackGroup(track: Track): void;

    /**
     * Set BitwigStudio to navigate into the parent group.
     *
     * @since API version 2
     */
    navigateToParentTrackGroup(): void;

    /**
     * Sends an undo command to Bitwig Studio.
     *
     * @since API version 1
     */
    undo(): void;

    undoAction(): HardwareActionBindable;

    /**
     * Value that reports if there is an action to undo.
     *
     * @since API version 15
     */
    canUndo(): BooleanValue;

    /**
     * Sends a redo command to Bitwig Studio.
     *
     * @since API version 1
     */
    redo(): void;

    redoAction(): HardwareActionBindable;

    /**
     * Value that reports if there is an action to redo.
     *
     * @since API version 15
     */
    canRedo(): BooleanValue;

    /**
     * Switches the Bitwig Studio user interface to the panel layout with the given name. The list of available
     * panel layouts depends on the active display profile.
     *
     * @param panelLayout
     *           the name of the new panel layout
     * @since API version 1
     */
    setPanelLayout(panelLayout: string): void;

    /**
     * Switches to the next panel layout of the active display profile in Bitwig Studio.
     *
     * @since API version 1
     */
    nextPanelLayout(): void;

    /**
     * Switches to the previous panel layout of the active display profile in Bitwig Studio.
     *
     * @since API version 1
     */
    previousPanelLayout(): void;

    /**
     * Value that reports the name of the active panel layout.
     *
     * @since API version 2
     */
    panelLayout(): StringValue;

    /**
     * Registers an observer that reports the name of the active panel layout.
     *
     * @param callable
     *           a callback function object that accepts a single string parameter
     * @param maxChars
     *           the maximum length of the panel layout name
     * @since API version 1
     * @deprecated Use {@link #panelLayout()} instead.
     */
    addPanelLayoutObserver(
      callable: StringValueChangedCallback,
      maxChars: number
    ): void;

    /**
     * Value that reports the name of the active display profile.
     *
     * @since API version 2
     */
    displayProfile(): StringValue;

    /**
     * Registers an observer that reports the name of the active display profile.
     *
     * @param callable
     *           a callback function object that accepts a single string parameter
     * @param maxChars
     *           the maximum length of the display profile name
     * @since API version 1
     * @deprecated Use {@link #displayProfile()} instead.
     */
    addDisplayProfileObserver(
      callable: StringValueChangedCallback,
      maxChars: number
    ): void;

    /**
     * Toggles the visibility of the inspector panel.
     *
     * @since API version 1
     */
    toggleInspector(): void;

    /**
     * Toggles the visibility of the device chain panel.
     *
     * @since API version 1
     */
    toggleDevices(): void;

    /**
     * Toggles the visibility of the mixer panel.
     *
     * @since API version 1
     */
    toggleMixer(): void;

    /**
     * Toggles the visibility of the note editor panel.
     *
     * @since API version 1
     */
    toggleNoteEditor(): void;

    /**
     * Toggles the visibility of the automation editor panel.
     *
     * @since API version 1
     */
    toggleAutomationEditor(): void;

    /**
     * Toggles the visibility of the browser panel.
     *
     * @since API version 1
     */
    toggleBrowserVisibility(): void;

    /**
     * Shows the previous detail panel (note editor, device, automation).
     *
     * @since API version 1
     */
    previousSubPanel(): void;

    /**
     * Shows the next detail panel (note editor, device, automation).
     *
     * @since API version 1
     */
    nextSubPanel(): void;

    /**
     * Equivalent to an Arrow-Left key stroke on the computer keyboard. The concrete functionality depends on
     * the current keyboard focus in Bitwig Studio.
     *
     * @since API version 1
     */
    arrowKeyLeft(): void;

    /**
     * Equivalent to an Arrow-Right key stroke on the computer keyboard. The concrete functionality depends on
     * the current keyboard focus in Bitwig Studio.
     *
     * @since API version 1
     */
    arrowKeyRight(): void;

    /**
     * Equivalent to an Arrow-Up key stroke on the computer keyboard. The concrete functionality depends on the
     * current keyboard focus in Bitwig Studio.
     *
     * @since API version 1
     */
    arrowKeyUp(): void;

    /**
     * Equivalent to an Arrow-Down key stroke on the computer keyboard. The concrete functionality depends on
     * the current keyboard focus in Bitwig Studio.
     *
     * @since API version 1
     */
    arrowKeyDown(): void;

    /**
     * Equivalent to an Enter key stroke on the computer keyboard. The concrete functionality depends on the
     * current keyboard focus in Bitwig Studio.
     *
     * @since API version 1
     */
    enter(): void;

    /**
     * Equivalent to an Escape key stroke on the computer keyboard. The concrete functionality depends on the
     * current keyboard focus in Bitwig Studio.
     *
     * @since API version 1
     */
    escape(): void;

    /**
     * Selects all items according the current selection focus in Bitwig Studio.
     *
     * @since API version 1
     */
    selectAll(): void;

    selectAllAction(): HardwareActionBindable;

    /**
     * Deselects any items according the current selection focus in Bitwig Studio.
     *
     * @since API version 1
     */
    selectNone(): void;

    selectNoneAction(): HardwareActionBindable;

    /**
     * Selects the previous item in the current selection.
     *
     * @since API version 10
     */
    selectPrevious(): void;

    selectPreviousAction(): HardwareActionBindable;

    /**
     * Selects the next item in the current selection.
     *
     * @since API version 10
     */
    selectNext(): void;

    selectNextAction(): HardwareActionBindable;

    /**
     * Selects the first item in the current selection.
     *
     * @since API version 10
     */
    selectFirst(): void;

    selectFirstAction(): HardwareActionBindable;

    /**
     * Selects the last item in the current selection.
     *
     * @since API version 10
     */
    selectLast(): void;

    selectLastAction(): HardwareActionBindable;

    /**
     * Cuts the selected items in Bitwig Studio if applicable.
     *
     * @since API version 1
     */
    cut(): void;

    cutAction(): HardwareActionBindable;

    /**
     * Copies the selected items in Bitwig Studio to the clipboard if applicable.
     *
     * @since API version 1
     */
    copy(): void;

    copyAction(): HardwareActionBindable;

    /**
     * Pastes the clipboard contents into the current selection focus in Bitwig Studio if applicable.
     *
     * @since API version 1
     */
    paste(): void;

    pasteAction(): HardwareActionBindable;

    /**
     * Duplicates the active selection in Bitwig Studio if applicable.
     *
     * @since API version 1
     */
    duplicate(): void;

    /**
     * @since API version 10
     */
    duplicateAction(): HardwareActionBindable;

    /**
     * Deletes the selected items in Bitwig Studio if applicable. Originally this function was called `delete`
     * (Bitwig Studio 1.0). But as `delete` is reserved in JavaScript this function got renamed to `remove` in
     * Bitwig Studio 1.0.9.
     *
     * @since API version 1
     */
    remove(): void;

    removeAction(): HardwareActionBindable;

    /**
     * Opens a text input field in Bitwig Studio for renaming the selected item.
     *
     * @since API version 1
     */
    rename(): void;

    /**
     * Zooms in one step into the currently focused editor of the Bitwig Studio user interface.
     *
     * @since API version 1
     */
    zoomIn(): void;

    zoomInAction(): HardwareActionBindable;

    /**
     * Zooms out one step in the currently focused editor of the Bitwig Studio user interface.
     *
     * @since API version 1
     */
    zoomOut(): void;

    zoomOutAction(): HardwareActionBindable;

    /**
     * Same as zoomIn/zoomOut, but as a stepper
     *
     * @since API version 14
     */
    zoomLevel(): RelativeHardwarControlBindable;

    /**
     * Adjusts the zoom level of the currently focused editor so that it matches the active selection.
     *
     * @since API version 1
     */
    zoomToSelection(): void;

    zoomToSelectionAction(): HardwareActionBindable;

    /**
     * Toggles between zoomToSelection and zoomToFit.
     *
     * @since API version 10
     */
    zoomToSelectionOrAll(): void;

    zoomToSelectionOrAllAction(): HardwareActionBindable;

    /**
     * Toggles between zoomToSelection and the last śet zoom level.
     *
     * @since API version 10
     */
    zoomToSelectionOrPrevious(): void;

    zoomToSelectionOrPreviousAction(): HardwareActionBindable;

    /**
     * Adjusts the zoom level of the currently focused editor so that all content becomes visible.
     *
     * @since API version 1
     */
    zoomToFit(): void;

    zoomToFitAction(): HardwareActionBindable;

    /**
     * Moves the panel focus to the panel on the left of the currently focused panel.
     *
     * @since API version 1
     */
    focusPanelToLeft(): void;

    /**
     * Moves the panel focus to the panel right to the currently focused panel.
     *
     * @since API version 1
     */
    focusPanelToRight(): void;

    /**
     * Moves the panel focus to the panel above the currently focused panel.
     *
     * @since API version 1
     */
    focusPanelAbove(): void;

    /**
     * Moves the panel focus to the panel below the currently focused panel.
     *
     * @since API version 1
     */
    focusPanelBelow(): void;

    /**
     * Toggles between full screen and windowed user interface.
     *
     * @since API version 1
     */
    toggleFullScreen(): void;

    /**
     * @deprecated Use {@link #setPanelLayout(java.lang.String)} instead.
     * @since API version 1
     */
    setPerspective(perspective: string): void;

    /**
     * @deprecated Use {@link #nextPanelLayout()} instead.
     * @since API version 1
     */
    nextPerspective(): void;

    /**
     * @deprecated Use {@link #previousPanelLayout()} instead.
     * @since API version 1
     */
    previousPerspective(): void;

    /**
     * @deprecated Use {@link #addPanelLayoutObserver(org.mozilla.javascript.Callable, int)} instead.
     * @since API version 1
     */
    addSelectedModeObserver(
      callable: StringValueChangedCallback,
      maxChars: number,
      fallbackText: string
    ): void;

    /**
     * Returns the record quantization grid setting from the preferences.
     * Possible values are "OFF", "1/32", "1/16", "1/8", "1/4".
     *
     * @since API version 10
     */
    recordQuantizationGrid(): SettableEnumValue;

    /**
     * Returns a settable value to choose if the record quantization should quantize note length.
     *
     * @since API version 10
     */
    recordQuantizeNoteLength(): SettableBooleanValue;
  }

  // source: com/bitwig/extension/controller/api/Arpeggiator.java

  /**
   * Proxy to an arpeggiator component.
   *
   * @since API version 10
   */
  interface Arpeggiator extends ObjectProxy {
    /**
     * Returns an object to configure the arpeggiator mode.
     * Possible values:
     *  - all
     *  - up
     *  - up-down
     *  - up-then-down
     *  - down
     *  - down-up
     *  - down-then-up
     *  - flow
     *  - random
     *  - converge-up
     *  - converge-down
     *  - diverge-up
     *  - diverge-down
     *  - thumb-up
     *  - thumb-down
     *  - pinky-up
     *  - pinky-down
     *
     * @since API version 10
     */
    mode(): SettableEnumValue;

    /**
     * Returns an object to configure the range in octaves.
     * The range is between 0 and 8.
     *
     * @since API version 10
     */
    octaves(): SettableIntegerValue;

    /**
     * Returns an object to enable or disable the note repeat component.
     *
     * @since API version 10
     */
    isEnabled(): SettableBooleanValue;

    /**
     * If true the arpeggiator will not try to sync to the transport.
     * @since API version  10
     */
    isFreeRunning(): SettableBooleanValue;

    /**
     * Return an object to configure the note repeat to use shuffle or not.
     *
     * @since API version 10
     */
    shuffle(): SettableBooleanValue;

    /**
     * Returns an object to configure the note repeat rate in beats.
     *
     * @since API version 10
     */
    rate(): SettableDoubleValue;

    /**
     * Returns an object to configure the note length, expressed as a ratio of the period.
     * Must be between 1/32 and 8.
     *
     * @since API version 10
     */
    gateLength(): SettableDoubleValue;

    /**
     * Let the arpeggiator play overlapping notes.
     *
     * @since API version 11
     */
    enableOverlappingNotes(): SettableBooleanValue;

    /**
     * Will use the note pressure to determine the velocity of arpeggiated notes.
     *
     * @since API version 10
     */
    usePressureToVelocity(): SettableBooleanValue;

    /**
     * Release all notes being played.
     * @since API version 10
     */
    releaseNotes(): void;

    /**
     * Will introduce human-like errors.
     * Between 0 and 1.
     *
     * @since API version 11
     */
    humanize(): SettableDoubleValue;

    /**
     * If set to true, it will terminate the playing note as soon as it is released, otherwise it will
     * be held until its computed note-off time.
     *
     * @since API version 11
     */
    terminateNotesImmediately(): SettableBooleanValue;
  }

  // source: com/bitwig/extension/controller/api/Arranger.java

  /**
   * An interface representing various commands which can be performed on the Bitwig Studio arranger.
   *
   * To receive an instance of the application interface call {@link ControllerHost#createArranger}.
   */
  interface Arranger extends TimelineEditor {
    /**
     * Gets an object that allows to enable/disable arranger playback follow. Observers can be registered on
     * the returned object for receiving notifications when the setting switches between on and off.
     *
     * @return a boolean value object that represents the enabled state of arranger playback follow
     * @since API version 1
     */
    isPlaybackFollowEnabled(): SettableBooleanValue;

    /**
     * Gets an object that allows to control the arranger track height. Observers can be registered on the
     * returned object for receiving notifications when the track height changes.
     *
     * @return a boolean value object that has the state `true` when the tracks have double row height and
     *         `false` when the tracks have single row height.
     * @since API version 1
     */
    hasDoubleRowTrackHeight(): SettableBooleanValue;

    /**
     * Gets an object that allows to show/hide the cue markers in the arranger panel. Observers can be
     * registered on the returned object for receiving notifications when the cue marker lane switches between
     * shown and hidden.
     *
     * @return a boolean value object that represents the cue marker section visibility
     * @since API version 1
     */
    areCueMarkersVisible(): SettableBooleanValue;

    /**
     * Gets an object that allows to show/hide the clip launcher in the arranger panel. Observers can be
     * registered on the returned object for receiving notifications when the clip launcher switches between
     * shown and hidden.
     *
     * @return a boolean value object that represents the clip launcher visibility
     * @since API version 1
     */
    isClipLauncherVisible(): SettableBooleanValue;

    /**
     * Gets an object that allows to show/hide the timeline in the arranger panel. Observers can be registered
     * on the returned object for receiving notifications when the timeline switches between shown and hidden.
     *
     * @return a boolean value object that represents the timeline visibility
     * @since API version 1
     */
    isTimelineVisible(): SettableBooleanValue;

    /**
     * Gets an object that allows to show/hide the track input/output choosers in the arranger panel. Observers
     * can be registered on the returned object for receiving notifications when the I/O section switches
     * between shown and hidden.
     *
     * @return a boolean value object that represents the visibility of the track I/O section
     * @since API version 1
     */
    isIoSectionVisible(): SettableBooleanValue;

    /**
     * Gets an object that allows to show/hide the effect tracks in the arranger panel. Observers can be
     * registered on the returned object for receiving notifications when the effect track section switches
     * between shown and hidden.
     *
     * @return a boolean value object that represents the visibility of the effect track section
     * @since API version 1
     */
    areEffectTracksVisible(): SettableBooleanValue;

    /**
     * Returns an object that provides access to a bank of successive cue markers using a window configured with
     * the given size, that can be scrolled over the list of markers.
     *
     * @param size
     *           the number of simultaneously accessible items
     * @return the requested item bank object
     */
    createCueMarkerBank(size: number): CueMarkerBank;

    /**
     * Zooms in all arranger lanes, if it the arranger is visible.
     *
     * @since API version 14
     */
    zoomInLaneHeightsAllAction(): HardwareActionBindable;

    zoomInLaneHeightsAll(): void;

    /**
     * Zooms out all arranger lanes, if it the arranger is visible.
     *
     * @since API version 14
     */
    zoomOutLaneHeightsAllAction(): HardwareActionBindable;

    zoomOutLaneHeightsAll(): void;

    /**
     * Same as zoomInLaneHeightsAllAction/zoomOutLaneHeightsAllAction, but as a stepper
     *
     * @since API version 14
     */
    zoomLaneHeightsAllStepper(): RelativeHardwarControlBindable;

    /**
     * Zooms in selected arranger lanes, if it the arranger is visible.
     *
     * @since API version 14
     */
    zoomInLaneHeightsSelectedAction(): HardwareActionBindable;

    zoomInLaneHeightsSelected(): void;

    /**
     * Zooms out selected arranger lanes, if it the arranger is visible.
     *
     * @since API version 14
     */
    zoomOutLaneHeightsSelectedAction(): HardwareActionBindable;

    zoomOutLaneHeightsSelected(): void;

    /**
     * Same as zoomInLaneHeightsSelectedAction/zoomOutLaneHeightsSelectedAction, but as a stepper
     *
     * @since API version 14
     */
    zoomLaneHeightsSelectedStepper(): RelativeHardwarControlBindable;

    /**
     * Registers an observer that reports if playback-follow is enabled.
     *
     * @param callback
     *           a callback function object that accepts a single bool parameter
     * @see #isPlaybackFollowEnabled()
     * @deprecated call `isPlaybackFollowEnabled().addValueObserver` instead
     * @since API version 1
     */
    addPlaybackFollowObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports the current configuration of the arranger track row height.
     *
     * @param callback
     *           a callback function object that accepts a single bool parameter. The parameter indicates if
     *           the row height is double (`true`) or single (`false`).
     * @see #hasDoubleRowTrackHeight()
     * @deprecated call `hasDoubleRowTrackHeight().addValueObserver` instead
     * @since API version 1
     */
    addTrackRowHeightObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the cue marker lane is visible.
     *
     * @param callback
     *           a callback function object that accepts a single bool parameter.
     * @see #areCueMarkersVisible()
     * @deprecated call `areCueMarkersVisible().addValueObserver` instead
     * @since API version 1
     */
    addCueMarkerVisibilityObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Toggles the playback follow state.
     *
     * @see #isPlaybackFollowEnabled()
     * @deprecated call `isPlaybackFollowEnabled().toggle` instead
     * @since API version 1
     */
    togglePlaybackFollow(): void;

    /**
     * Toggles the arranger track row height between `double` and `single`.
     *
     * @see #hasDoubleRowTrackHeight()
     * @deprecated call `hasDoubleRowTrackHeight().toggle` instead
     * @since API version 1
     */
    toggleTrackRowHeight(): void;

    /**
     * Toggles the visibility of the arranger cue marker lane.
     *
     * @see #areCueMarkersVisible()
     * @deprecated call `areCueMarkersVisible().toggle` instead
     * @since API version 1
     */
    toggleCueMarkerVisibility(): void;
  }

  // source: com/bitwig/extension/controller/api/AsyncTransferCompledCallback.java

  /**
   * Callback that is notified when an asynchronous transfer has completed.
   */
  interface AsyncTransferCompledCallback {
    /** Called upon completion of an asynchronous read. */
    (amountTransferred: number): void;
  }

  // source: com/bitwig/extension/controller/api/Bank.java

  /**
   * A bank provides access to a range of items in Bitwig Studio. Instances of a bank are configured with a
   * fixed number of items and represent an excerpt of a larger list of items. Various methods are provided for
   * scrolling to different sections of the item list. It basically acts like a window moving over the list of
   * underlying items.
   *
   * @since API version 2
   */
  interface Bank<ItemType extends ObjectProxy = ObjectProxy>
    extends ObjectProxy,
      Scrollable {
    /**
     * The fixed size of this bank.
     * This will be initially equal to the capacity of the Bank.
     *
     * @since API version 2
     */
    getSizeOfBank(): number;

    /**
     * The maximum number of items in the bank which is defined when the bank is initially created.
     *
     * @since API version 7
     */
    getCapacityOfBank(): number;

    /**
     * Sets the size of this bank
     *
     * @param size number of items in the bank that has to be greater than 0 and less or equal to the capacity of the bank.
     *
     * @since API version 7
     */
    setSizeOfBank(size: number): void;

    /**
     * Gets the item in the bank at the supplied index. The index must be >= 0 and < {@link #getSizeOfBank()}.
     *
     * @since API version 2
     */
    getItemAt(index: number): ItemType;

    /**
     * Value that reports the underlying total item count (not the number of items available in the bank
     * window).
     *
     * @since API version 2
     */
    itemCount(): IntegerValue;

    /**
     * An integer value that defines the location of the cursor that this bank is following. If there is no
     * cursor or the cursor is not within the bank then the value is -1.
     *
     * @since API version 2
     */
    cursorIndex(): SettableIntegerValue;

    /**
     * Disabled items will not be accessible via the bank if set to true.
     * @since API version 11
     */
    setSkipDisabledItems(shouldSkip: boolean): void;
  }

  // source: com/bitwig/extension/controller/api/BeatTimeFormatter.java

  /**
   * Defines a formatter for a beat time that can convert a beat time to a string for display to the user.
   *
   * @since API version 2
   */
  interface BeatTimeFormatter {
    /**
     * Formats the supplied beat time as a string in the supplied time signature.
     *
     * @param beatTime
     *           The beat time to be formatted
     * @param isAbsolute
     *           If true the beat time represents an absolute time (such as a time on the arranger) otherwise
     *           it represents a beat time duration (such as the length of a clip).
     *
     * @since API version 2
     */
    formatBeatTime(
      beatTime: number,
      isAbsolute: boolean,
      timeSignatureNumerator: number,
      timeSignatureDenominator: number,
      timeSignatureTicks: number
    ): string;
  }

  // source: com/bitwig/extension/controller/api/BeatTimeValue.java

  import DoubleValueChangedCallback = com.bitwig.extension.callback.DoubleValueChangedCallback;

  /**
   * Instances of this interface represent beat time values.
   *
   * Beat time values are double-precision number representing the number of quarter notes, regardless of time-signature.
   *
   * @since API version 1
   */
  interface BeatTimeValue extends DoubleValue {
    /**
     * Add an observer which receives the internal raw of the parameter as floating point.
     *
     * @param callback
     *           a callback function that receives a single numeric parameter with double precision.
     * @since API version 1
     * @deprecated This exists for backwards compatibility. Use
     *             {@link #addValueObserver(DoubleValueChangedCallback)} instead.
     */
    addRawValueObserver(callback: DoubleValueChangedCallback): void;

    /**
     * Gets the current beat time formatted according to the supplied formatter.
     *
     * @since API version 2
     */
    getFormatted(formatter: BeatTimeFormatter): string;

    /**
     * Gets the current beat time formatted according to the default beat time formatter.
     *
     * @see ControllerHost#setDefaultBeatTimeFormatter(BeatTimeFormatter)
     * @since API version 2
     */
    getFormatted(): string;

    /**
     * Registers an observer that reports the internal beat time value as formatted text, for example
     * "012:03:00:01".
     *
     * @param separator
     *           the character used to separate the segments of the formatted beat time, typically ":", "." or
     *           "-"
     * @param barsLen
     *           the number of digits reserved for bars
     * @param beatsLen
     *           the number of digits reserved for beats
     * @param subdivisionLen
     *           the number of digits reserved for beat subdivisions
     * @param ticksLen
     *           the number of digits reserved for ticks
     * @param callback
     *           a callback function that receives a single string parameter
     * @since API version 1
     * @deprecated Use {@link #getFormatted(BeatTimeFormatter)} instead.
     */
    addTimeObserver(
      separator: string,
      barsLen: number,
      beatsLen: number,
      subdivisionLen: number,
      ticksLen: number,
      callback: StringValueChangedCallback
    ): void;
  }

  // source: com/bitwig/extension/controller/api/BitwigBrowsingSession.java

  /**
   * Instances of this interface are used for browsing Bitwig Studio document such as devices, presets,
   * multi-samples, or clips. Full access to all filter columns and the result column as shown in Bitwig
   * Studio's contextual browser window is provided.
   *
   * @see BrowsingSession
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface BitwigBrowsingSession extends BrowsingSession {
    /**
     * Returns the creator filter as shown in the category column of Bitwig Studio's contextual browser.
     *
     * @return the requested creator filter object.
     * @since API version 1
     */
    getCreatorFilter(): BrowserFilterColumn;

    /**
     * Returns the tags filter as shown in the category column of Bitwig Studio's contextual browser.
     *
     * @return the requested tags filter object.
     * @since API version 1
     */
    getTagsFilter(): BrowserFilterColumn;
  }

  // source: com/bitwig/extension/controller/api/BooleanHardwareProperty.java

  import BooleanSupplier = java.util.func.BooleanSupplier;
  import Consumer = java.util.func.Consumer;

  /**
   *  Represents an output value shown on some hardware (for example, if an LED is on or off).
   *
   * @since API version 10
   * */
  interface BooleanHardwareProperty extends HardwareProperty {
    /** Gets the current value. This is the value that should be sent to the hardware to be displayed. */
    currentValue(): boolean;

    /** The value that was last sent to the hardware. */
    lastSentValue(): boolean;

    /**
     * Specifies a callback that should be called with the value that needs to be sent to the hardware. This
     * callback is called as a result of calling the {@link HardwareSurface#updateHardware()} method (typically
     * from the flush method).
     */
    onUpdateHardware(sendValueConsumer: Consumer<boolean>): void;

    /** Sets the current value. */
    setValue(value: boolean): void;

    /** Sets the current value from a {@link BooleanSupplier} that supplies the latest value. */
    setValueSupplier(supplier: BooleanSupplier): void;
  }

  // source: com/bitwig/extension/controller/api/BooleanValue.java

  interface BooleanValue
    extends Value<BooleanValueChangedCallback>,
      BooleanSupplier {
    /**
     * Gets the current value.
     *
     * @since API version 2
     */
    get(): boolean;

    getAsBoolean(): boolean;
  }

  // source: com/bitwig/extension/controller/api/Browser.java

  /**
   * Instances of this interface represent a contextual browser in Bitwig Studio.
   *
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface Browser extends ObjectProxy {
    /**
     * Registers an observer that reports if a browsing session was started.
     *
     * @param callback
     *           a callback function that receivers a single boolean parameter.
     * @since API version 1
     * @deprecated Use {@link #exists()} instead.
     */
    addIsBrowsingObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Starts a new browser session.
     *
     * @since API version 1
     */
    startBrowsing(): void;

    /**
     * Cancels the current browser session.
     *
     * @since API version 1
     */
    cancelBrowsing(): void;

    /**
     * Finished the browser session by loading the selected item.
     *
     * @since API version 1
     */
    commitSelectedResult(): void;

    /**
     * Activates the given search session. Please note that only one search session can be active at a time.
     *
     * @param session
     *           the session that should be activated.
     * @since API version 1
     */
    activateSession(session: BrowsingSession): void;

    /**
     * Return an object allows to observe and control if the browser window should be small or full-sized.
     *
     * @return a boolean value object
     * @since API version 1
     */
    isWindowMinimized(): SettableBooleanValue;

    /**
     * Return an object allows to observe and control if the selected result should be auditioned.
     *
     * @return a boolean value object
     * @since API version 1
     */
    shouldAudition(): SettableBooleanValue;

    /**
     * Returns an object that provided bank-wise navigation of the available search sessions. Each search
     * session is dedicated to a certain material type, as shown in the tabs of Bitwig Studio's contextual
     * browser.
     *
     * @param size
     *           the size of the windows used to navigate the available browsing sessions.
     * @return the requested file column bank object
     * @since API version 1
     */
    createSessionBank(size: number): BrowsingSessionBank;

    /**
     * Returns an object that represents the selected tab as shown in Bitwig Studio's contextual browser
     * window.
     *
     * @return the requested browsing session cursor
     * @since API version 1
     */
    createCursorSession(): CursorBrowsingSession;

    /**
     * Returns an object that provides access to the contents of the device tab as shown in Bitwig Studio's
     * contextual browser window.
     *
     * @return the requested device browsing session instance
     * @since API version 1
     */
    getDeviceSession(): DeviceBrowsingSession;

    /**
     * Returns an object that provides access to the contents of the preset tab as shown in Bitwig Studio's
     * contextual browser window.
     *
     * @return the requested preset browsing session instance
     * @since API version 1
     */
    getPresetSession(): PresetBrowsingSession;

    /**
     * Returns an object that provides access to the contents of the samples tab as shown in Bitwig Studio's
     * contextual browser window.
     *
     * @return the requested sample browsing session instance
     * @since API version 1
     */
    getSampleSession(): SampleBrowsingSession;

    /**
     * Returns an object that provides access to the contents of the multi-samples tab as shown in Bitwig
     * Studio's contextual browser window.
     *
     * @return the requested multi-sample browsing session instance
     * @since API version 1
     */
    getMultiSampleSession(): MultiSampleBrowsingSession;

    /**
     * Returns an object that provides access to the contents of the clips tab as shown in Bitwig Studio's
     * contextual browser window.
     *
     * @return the requested clip browsing session instance
     * @since API version 1
     */
    getClipSession(): ClipBrowsingSession;

    /**
     * Returns an object that provides access to the contents of the music tab as shown in Bitwig Studio's
     * contextual browser window.
     *
     * @return the requested music browsing session instance
     * @since API version 1
     */
    getMusicSession(): MusicBrowsingSession;
  }

  // source: com/bitwig/extension/controller/api/BrowserColumn.java

  import IntegerValueChangedCallback = com.bitwig.extension.callback.IntegerValueChangedCallback;

  /**
   * Instances of this interface are used to navigate a column in the Bitwig Studio browser.
   *
   * @since API version 1
   */
  interface BrowserColumn extends ObjectProxy {
    /**
     * Registers an observer that reports if the column exists.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #exists()} instead.
     */
    addExistsObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports the underlying total count of column entries (not the size of the column window).
     *
     * @since API version 2
     */
    entryCount(): IntegerValue;

    /**
     * Registers an observer that reports the underlying total count of column entries (not the size of the
     * column window).
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #entryCount()}.addValueObserver(callback)
     */
    addEntryCountObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Returns the cursor item, which can be used to navigate over the list of entries.
     *
     * @return the requested filter item object
     * @since API version 1
     */
    createCursorItem(): BrowserItem;

    /**
     * Returns an object that provides access to a bank of successive entries using a window configured with
     * the given size, that can be scrolled over the list of entries.
     *
     * @param size
     *           the number of simultaneously accessible items
     * @return the requested item bank object
     */
    createItemBank(size: number): BrowserItemBank;
  }

  // source: com/bitwig/extension/controller/api/BrowserFilterColumn.java

  /**
   * Instances of this interface are used to navigate a filter column in the Bitwig Studio browser.
   *
   * @since API version 1
   */
  interface BrowserFilterColumn extends BrowserColumn {
    /**
     * Returns the filter item that represents the top-level all/any/everything wildcard item.
     *
     * @return the requested filter item object
     * @since API version 1
     */
    getWildcardItem(): BrowserFilterItem;

    /**
     * Returns the cursor filter item, which can be used to navigate over the list of entries.
     *
     * @return the requested filter item object
     * @since API version 1
     */
    createCursorItem(): BrowserFilterItem;

    /**
     * Returns an object that provides access to a bank of successive entries using a window configured with
     * the given size, that can be scrolled over the list of entries.
     *
     * @param size
     *           the number of simultaneously accessible items
     * @return the requested item bank object
     */
    createItemBank(size: number): BrowserFilterItemBank;

    /**
     * Value that reports the name of the filter column.
     *
     * @since API version2
     */
    name(): StringValue;

    /**
     * Registers an observer that reports the name of the filter column.
     *
     * @param callback
     *           a callback function that receives a single string argument.
     * @since API version 1
     * @deprecated Use {@link #name()} instead.
     */
    addNameObserver(
      maxCharacters: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;
  }

  // source: com/bitwig/extension/controller/api/BrowserFilterColumnBank.java

  /**
   * Instances of this interface are used to navigate the columns of a Bitwig Studio browser session.
   *
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface BrowserFilterColumnBank extends Bank<BrowserFilterColumn> {
    /**
     * Returns the window size that was used to configure the filter column during creation.
     *
     * @return the size of the filter column.
     */
    getSize(): number;

    /**
     * Returns the filter column for the given index.
     *
     * @param index
     *           the item index, must be in the range `[0..getSize-1]`
     * @return the requested filter column object
     */
    getItem(index: number): BrowserFilterColumn;

    /**
     * Scrolls the filter columns one item up.
     *
     * @since API version 1
     */
    scrollUp(): void;

    /**
     * Scrolls the filter columns one item down.
     *
     * @since API version 1
     */
    scrollDown(): void;

    /**
     * Scrolls the filter columns one page up. For example if the bank is configured with a window size of 8
     * entries and is currently showing items [1..8], calling this method would scroll the window to show
     * columns [9..16].
     *
     * @since API version 1
     */
    scrollPageUp(): void;

    /**
     * Scrolls the filter columns one page up. For example if the bank is configured with a window size of 8
     * entries and is currently showing items [9..16], calling this method would scroll the window to show
     * columns [1..8].
     *
     * @since API version 1
     */
    scrollPageDown(): void;

    /**
     * Registers an observer that reports the current scroll position, more specifically the position of the
     * first item within the underlying list of columns, that is shown as the first column within the window.
     *
     * @param callback
     *           a callback function that receives a single integer number parameter. The parameter reflects
     *           the scroll position, or `-1` in case the column has no content.
     * @since API version 1
     */
    addScrollPositionObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Registers an observer that reports if the columns can be scrolled further up.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     */
    addCanScrollUpObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the columns can be scrolled further down.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     */
    addCanScrollDownObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports the underlying total count of columns (not the size of the window).
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     */
    addEntryCountObserver(callback: IntegerValueChangedCallback): void;
  }

  // source: com/bitwig/extension/controller/api/BrowserFilterItem.java

  /**
   * Instances of this interface represent entries in a browser filter column.
   *
   * @since API version 1
   */
  interface BrowserFilterItem extends BrowserItem {
    /**
     * Value that reports the hit count of the filter item.
     *
     * @since API version 2
     */
    hitCount(): IntegerValue;

    /**
     * Registers an observer that reports the hit count of the filter item.
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #hitCount()} instead.
     */
    addHitCountObserver(callback: IntegerValueChangedCallback): void;
  }

  // source: com/bitwig/extension/controller/api/BrowserFilterItemBank.java

  /**
   * Instances of this interface are used to navigate a filter column in the Bitwig Studio browser.
   *
   * @since API version 1
   */
  interface BrowserFilterItemBank extends BrowserItemBank<BrowserFilterItem> {}

  // source: com/bitwig/extension/controller/api/BrowserItem.java

  /**
   * Instances of this interface represent entries in a browser filter column.
   *
   * @since API version 1
   */
  interface BrowserItem extends ObjectProxy {
    /**
     * Registers an observer that reports if the item exists.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #exists()} instead.
     */
    addExistsObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports the name of the browser item.
     *
     * @since API version 2
     */
    name(): StringValue;

    /**
     * Registers an observer that reports the string value of the browser item.
     *
     * @param maxCharacters
     * @param textWhenUnassigned
     * @param callback
     *           a callback function that receives a single string argument
     * @since API version 1
     * @deprecated Use {@link #name()} instead.
     */
    addValueObserver(
      maxCharacters: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Returns an object that provides access to the selected state of the browser item.
     *
     * @return an boolean value object
     * @since API version 1
     */
    isSelected(): SettableBooleanValue;
  }

  // source: com/bitwig/extension/controller/api/BrowserItemBank.java

  /**
   * Instances of this interface are used to navigate a column in the Bitwig Studio browser.
   *
   * @since API version 1
   */
  interface BrowserItemBank<ItemType extends BrowserItem = BrowserItem>
    extends Bank<ItemType> {
    /**
     * Returns the window size that was used to configure the filter column during creation.
     *
     * @return the size of the filter column.
     * @since API version 1
     * @deprecated Use {@link #getSizeOfBank()} instead.
     */
    getSize(): number;

    /**
     * Returns the item for the given index.
     *
     * @param index
     *           the item index, must be in the range `[0..getSize-1]`
     * @return the requested item object
     * @since API version 1
     * @deprecated Use {@link #getItemAt(int)} instead.
     */
    getItem(index: number): BrowserItem;

    /**
     * Scrolls the filter column entries one item up.
     *
     * @since API version 1
     * @deprecated Use {@link #scrollBackwards()} instead.
     */
    scrollUp(): void;

    /**
     * Scrolls the filter column entries one item down.
     *
     * @since API version 1
     * @deprecated Use {@link #scrollForwards()} instead.
     */
    scrollDown(): void;

    /**
     * Scrolls the filter column entries one page up. For example if the column is configured with a window
     * size of 8 entries and is currently showing items [1..8], calling this method would scroll the column to
     * show items [9..16].
     *
     * @since API version 1
     * @deprecated Use {@link #scrollPageBackwards()} instead.
     */
    scrollPageUp(): void;

    /**
     * Scrolls the filter column entries one page up. For example if the column is configured with a window
     * size of 8 entries and is currently showing items [9..16], calling this method would scroll the column to
     * show items [1..8].
     *
     * @since API version 1
     * @deprecated Use {@link #scrollPageForwards()} instead.
     */
    scrollPageDown(): void;

    /**
     * Registers an observer that reports the current scroll position, more specifically the position of the
     * first item within the underlying list of entries, that is shown as the first entry within the window.
     *
     * @param callback
     *           a callback function that receives a single integer number parameter. The parameter reflects
     *           the scroll position, or `-1` in case the column has no content.
     * @since API version 1
     * @deprecated Use {@link #scrollPosition()} instead.
     */
    addScrollPositionObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Registers an observer that reports if the column entries can be scrolled further up.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #canScrollBackwards()} instead.
     */
    addCanScrollUpObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the column entries can be scrolled further down.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #canScrollForwards()} instead.
     */
    addCanScrollDownObserver(callback: BooleanValueChangedCallback): void;
  }

  // source: com/bitwig/extension/controller/api/BrowserResultsColumn.java

  /**
   * Instances of this interface are used to navigate a results column in the Bitwig Studio browser.
   *
   * @since API version 1
   */
  interface BrowserResultsColumn extends BrowserColumn {
    /**
     * Returns the cursor result item, which can be used to navigate over the list of entries.
     *
     * @return the requested filter item object
     * @since API version 1
     */
    createCursorItem(): BrowserResultsItem;

    /**
     * Returns an object that provides access to a bank of successive entries using a window configured with
     * the given size, that can be scrolled over the list of entries.
     *
     * @param size
     *           the number of simultaneously accessible items
     * @return the requested item bank object
     */
    createItemBank(size: number): BrowserResultsItemBank;
  }

  // source: com/bitwig/extension/controller/api/BrowserResultsItem.java

  /**
   * Instances of this interface represent entries in a browser results column.
   *
   * @since API version 1
   */
  interface BrowserResultsItem extends BrowserItem {}

  // source: com/bitwig/extension/controller/api/BrowserResultsItemBank.java

  /**
   * Instances of this interface are used to navigate the results column in the Bitwig Studio browser.
   *
   * @since API version 1
   */
  interface BrowserResultsItemBank
    extends BrowserItemBank<BrowserResultsItem> {}

  // source: com/bitwig/extension/controller/api/BrowsingSession.java

  /**
   * Instances of this interface are used for browsing material according to a certain type. Possible material
   * types are devices, presets, samples, multi-samples, clips, or files from your music collection.
   *
   * In Bitwig Studio's contextual browser window the search sessions for the various material kinds are shown
   * in tabs. Just like the tabs in the browser window, instances of this interface provide access to multiple
   * filter columns and one result column. The filter columns are used to control the content of the results
   * column.
   *
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface BrowsingSession extends ObjectProxy {
    /**
     * Registers an observer that reports if the browser session is available for the current context.
     *
     * @param callback
     *           a callback function that receives a single boolean argument.
     * @since API version 1
     * @deprecated Use {@link #exists()} instead.
     */
    addIsAvailableObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the browser session is currently active.
     *
     * @param callback
     *           a callback function that receives a single boolean argument.
     * @since API version 1
     */
    addIsActiveObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Activates the given search session, same as calling {@link Browser#activateSession
     * Browser#activateSession(this)}. Please note that only one search session can be active at a time.
     *
     * @since API version 1
     * @see Browser#activateSession
     */
    activate(): void;

    /**
     * Returns an object that represents the column which shows the results according to the current filter
     * settings in Bitwig Studio's contextual browser.
     *
     * @return the requested results browser column.
     * @since API version 1
     */
    getResults(): BrowserResultsColumn;

    /**
     * Returns an object used for navigating the entries in the results column of Bitwig Studio's contextual
     * browser.
     *
     * @return the requested cursor object.
     * @since API version 1
     */
    getCursorResult(): CursorBrowserResultItem;

    /**
     * Returns an object that represents the currently loaded material item.
     *
     * @return the requested settled result object
     * @since API version 1
     */
    getSettledResult(): BrowserResultsItem;

    /**
     * Returns an object that can be used to navigate over the various filter sections of the browsing session.
     *
     * @return the requested filter cursor object
     */
    getCursorFilter(): CursorBrowserFilterColumn;

    /**
     * Returns an object that provided bank-wise navigation of filter columns.
     *
     * @return the requested file column bank object
     * @since API version 1
     * @param numColumns
     *           the number of columns that are simultaneously accessible.
     */
    createFilterBank(numColumns: number): BrowserFilterColumnBank;

    /**
     * Value that reports the number of results available for the current filter settings.
     *
     * @since API version 2
     */
    hitCount(): IntegerValue;

    /**
     * Registers an observer that reports the number of results available for the current filter settings.
     *
     * @param callback
     *           a callback function that receives a single integer argument.
     * @since API version 1
     * @deprecated Use {@link #hitCount()} instead.
     */
    addHitCountObserver(callback: IntegerValueChangedCallback): void;
  }

  // source: com/bitwig/extension/controller/api/BrowsingSessionBank.java

  /**
   * Instances of this interface are used to navigate the available sessions in Bitwig Studio's contextual
   * browser. The sessions are shown as tabs in the graphical user interface of the browser.
   *
   * @since API version 1
   */
  interface BrowsingSessionBank extends Bank<GenericBrowsingSession> {
    /**
     * Returns the window size that was used to configure the session bank during creation.
     *
     * @return the size of the session bank.
     * @since API version 1
     */
    getSize(): number;

    /**
     * Returns the browser session for the given index.
     *
     * @param index
     *           the session index, must be in the range `[0..getSize-1]`
     * @return the requested browser session object
     * @since API version 1
     */
    getSession(index: number): GenericBrowsingSession;

    /**
     * Scrolls the browser sessions one item up.
     *
     * @since API version 1
     * @deprecated Use {@link #scrollBackwards()} instead.
     */
    scrollUp(): void;

    /**
     * Scrolls the browser sessions one item down.
     *
     * @since API version 1
     * @deprecated Use {@link #canScrollForwards()} instead.
     */
    scrollDown(): void;

    /**
     * Scrolls the browser sessions one page up. For example if the bank is configured with a window size of 8
     * entries and is currently showing items [1..8], calling this method would scroll the window to show items
     * [9..16].
     *
     * @since API version 1
     * @deprecated Use {@link #scrollPageBackwards()} instead.
     */
    scrollPageUp(): void;

    /**
     * Scrolls the filter columns one page up. For example if the bank is configured with a window size of 8
     * entries and is currently showing items [9..16], calling this method would scroll the window to show
     * items [1..8].
     *
     * @since API version 1
     * @deprecated Use {@link #scrollPageForwards()} instead.
     */
    scrollPageDown(): void;

    /**
     * Registers an observer that reports the current scroll position, more specifically the position of the
     * first item within the underlying list of browser sessions, that is shown as the first session within the
     * window.
     *
     * @param callback
     *           a callback function that receives a single integer number parameter. The parameter reflects
     *           the scroll position, or `-1` in case the column has no content.
     * @since API version 1
     * @deprecated Use {@link #scrollPosition()} instead.
     */
    addScrollPositionObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Registers an observer that reports if the browser sessions can be scrolled further up.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #canScrollBackwards()} instead.
     */
    addCanScrollUpObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the browser sessions can be scrolled further down.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #canScrollForwards()} instead.
     */
    addCanScrollDownObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports the underlying total count of browser sessions (not the size of the
     * window).
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #itemCount()} instead.
     */
    addEntryCountObserver(callback: IntegerValueChangedCallback): void;
  }

  // source: com/bitwig/extension/controller/api/ChainSelector.java

  /**
   * This interface represents a chain selector device which can be:
   * - instrument selector
   * - effect selector
   *
   * @since API version 6
   */
  interface ChainSelector extends ObjectProxy, Cursor {
    /**
     * The index of the active chain in the chain selector.
     * In case the chain selector has no chains or the value is not connected to the chain selector,
     * then the value will be 0.
     *
     * @since API version 6
     */
    activeChainIndex(): SettableIntegerValue;

    /**
     * The number of chains in the chain selector.
     *
     * @since API version 6
     */
    chainCount(): IntegerValue;

    /**
     * The active device layer.
     *
     * @since API version 6
     */
    activeChain(): DeviceLayer;

    /**
     * Cycle to the next chain.
     * If the current active chain is the last one, then moves to the first one.
     *
     * @since API version 6
     */
    cycleNext(): void;

    /**
     * Cycle to the previous chain.
     * If the current active chain the first one, then moves to the last one.
     *
     * @since API version 6
     */
    cyclePrevious(): void;
  }

  // source: com/bitwig/extension/controller/api/Channel.java

  import ColorValueChangedCallback = com.bitwig.extension.callback.ColorValueChangedCallback;
  import NotePlaybackCallback = com.bitwig.extension.callback.NotePlaybackCallback;

  /**
   * This interface defines access to the common attributes and operations of channels, such as tracks or nested
   * device channels.
   *
   * @since API version 1
   */
  interface Channel extends DeviceChain, DeleteableObject, DuplicableObject {
    /**
     * Returns an object that represents the activated state of the channel.
     *
     * @return an object that provides access to the channels activated state.
     * @since API version 1
     */
    isActivated(): SettableBooleanValue;

    /**
     * Gets a representation of the channels volume control.
     *
     * @return an object that provides access to the channels volume control.
     * @since API version 1
     * @deprecated Use {@link #volume()} instead.
     */
    getVolume(): Parameter;

    /**
     * Gets a representation of the channels volume control.
     *
     * @return an object that provides access to the channels volume control.
     * @since API version 5
     */
    volume(): Parameter;

    /**
     * Gets a representation of the channels pan control.
     *
     * @return an object that provides access to the channels pan control.
     * @since API version 1
     * @deprecated Use {@link #pan()} instead.
     */
    getPan(): Parameter;

    /**
     * Gets a representation of the channels pan control.
     *
     * @return an object that provides access to the channels pan control.
     * @since API version 5
     */
    pan(): Parameter;

    /**
     * Gets a representation of the channels mute control.
     *
     * @return an object that provides access to the channels mute control.
     * @since API version 1
     * @deprecated Use {@link #mute()} instead.
     */
    getMute(): SettableBooleanValue;

    /**
     * Gets a representation of the channels mute control.
     *
     * @return an object that provides access to the channels mute control.
     * @since API version 5
     */
    mute(): SettableBooleanValue;

    /**
     * Gets a representation of the channels solo control.
     *
     * @return an object that provides access to the channels solo control.
     * @since API version 1
     * @deprecated Use {@link #solo()} instead.
     */
    getSolo(): SoloValue;

    /**
     * Gets a representation of the channels solo control.
     *
     * @return an object that provides access to the channels solo control.
     * @since API version 1
     */
    solo(): SoloValue;

    /**
     * True if the current channel is being muted by an other channel with solo on.
     * @since API version 10
     */
    isMutedBySolo(): BooleanValue;

    /**
     * Registers an observer for the VU-meter of this track.
     *
     * @param range
     *           the number of steps to which the reported values should be scaled. For example a range of 128
     *           would cause the callback to be called with values between 0 and 127.
     * @param channel
     *           0 for left channel, 1 for right channel, -1 for the sum of both
     * @param peak
     *           when `true` the peak value is reported, otherwise the RMS value
     * @param callback
     *           a callback function that takes a single numeric argument. The value is in the range
     *           [0..range-1].
     * @throws com.bitwig.base.control_surface.ControlSurfaceException
     * @since API version 1
     */
    addVuMeterObserver(
      range: number,
      channel: number,
      peak: boolean,
      callback: IntegerValueChangedCallback
    ): void;

    /**
     * Registers an observer that reports notes when they are played on the channel.
     *
     * @param callback
     *           a callback function that receives three parameters: 1. on/off state (boolean), 2. key (int),
     *           and 3. velocity (float).
     * @since API version 1
     *
     * @deprecated use {@link #playingNotes()} instead.
     */
    addNoteObserver(callback: NotePlaybackCallback): void;

    /**
     * Returns an array of the playing notes.
     *
     * @since API version 2
     */
    playingNotes(): PlayingNoteArrayValue;

    /**
     * Registers an observer that receives notifications about the color of the channel. The callback gets
     * called at least once immediately after this function call to report the current color. Additional calls
     * are fired each time the color changes.
     *
     * @param callback
     *           a callback function that receives three float parameters in the range [0..1]: 1. red, 2.
     *           green, and 3. blue.
     * @since API version 1
     * @deprecated use {@link #color()} instead.
     */
    addColorObserver(callback: ColorValueChangedCallback): void;

    /**
     * Get the color of the channel.
     *
     * @since API version 2
     */
    color(): SettableColorValue;

    /**
     * Gets a {@link SendBank} that can be used to navigate the sends of this channel.
     *
     * @since API version 2
     */
    sendBank(): SendBank;

    /**
     * Gets a representation of the channels send control at the given index.
     *
     * @param index
     *           the index of the send, must be valid
     * @return an object that provides access to the requested send control.
     * @since API version 1
     * @deprecated Use {@link #sendBank()} instead.
     */
    getSend(index: number): Send;

    /**
     * Duplicates the track.
     *
     * @since API version 1
     */
    duplicate(): void;

    /**
     * Selects the device chain in the Bitwig Studio mixer, in case it is a selectable object.
     *
     * @since API version 1
     */
    selectInMixer(): void;

    /**
     * Registers an observer that reports if the device chain is selected in Bitwig Studio mixer.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter.
     * @since API version 1
     */
    addIsSelectedInMixerObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Tries to scroll the contents of the arrangement editor so that the channel becomes visible.
     *
     * @since API version 1
     */
    makeVisibleInArranger(): void;

    /**
     * Tries to scroll the contents of the mixer panel so that the channel becomes visible.
     *
     * @since API version 1
     */
    makeVisibleInMixer(): void;
  }

  // source: com/bitwig/extension/controller/api/ChannelBank.java

  /**
   * A channel bank provides access to a range of channels in Bitwig Studio, such as tracks or device layers.
   * Instances of channel bank are typically configured with support for a fixed number of channels and
   * represent an excerpt of a larger list of channels. Various methods are provided for scrolling to different
   * sections of the channel list. It basically acts like a window moving over the list of channels.
   *
   * @since API version 1
   */
  interface ChannelBank<ChannelType extends Channel = Channel>
    extends ObjectProxy,
      Bank<ChannelType> {
    /**
     * Returns the channel for the given index.
     *
     * @param indexInBank
     *           the channel index within this bank, not the index within the list of all Bitwig Studio
     *           channels. Must be in the range [0..sizeOfBank-1].
     * @return the channel object
     * @since API version 1
     * @deprecated Use {@link #getItemAt(int)} instead.
     */
    getChannel(indexInBank: number): Channel;

    /**
     * Sets the step size used for scrolling the channel bank.
     *
     * @param stepSize
     *           the step size used for scrolling. Default is `1`.
     * @since API version 1
     */
    setChannelScrollStepSize(stepSize: number): void;

    /**
     * Scrolls the channels one page up. For example if the channel bank is configured with a window size of 8
     * channels and is currently showing channel [1..8], calling this method would scroll the channel bank to
     * show channel [9..16].
     *
     * @since API version 1
     * @deprecated {@link #scrollPageBackwards()}
     */
    scrollChannelsPageUp(): void;

    /**
     * Scrolls the channels one page up. For example if the channel bank is configured with a window size of 8
     * channels and is currently showing channel [9..16], calling this method would scroll the channel bank to
     * show channel [1..8].
     *
     * @since API version 1
     * @deprecated {@link #scrollPageForwards()}
     */
    scrollChannelsPageDown(): void;

    /**
     * Scrolls the channel window up by the amount specified via {@link #setChannelScrollStepSize(int)} (by
     * default one channel).
     *
     * @since API version 1
     * @deprecated {@link #scrollBackwards()}
     */
    scrollChannelsUp(): void;

    /**
     * Scrolls the channel window down by the amount specified via {@link #setChannelScrollStepSize(int)} (by
     * default one channel).
     *
     * @since API version 1
     * @deprecated {@link #scrollForwards()}
     */
    scrollChannelsDown(): void;

    /**
     * Scrolls the channel bank window so that the channel at the given position becomes visible.
     *
     * @param position
     *           the index of the channel within the underlying full list of channels (not the index within the
     *           bank). The position is typically directly related to the layout of the channel list in Bitwig
     *           Studio, starting with zero in case of the first channel.
     * @since API version 1
     * @deprecated {@link #scrollPosition()}
     */
    scrollToChannel(position: number): void;

    /**
     * Value that reports the current scroll position, more specifically the position of the
     * first channel within the underlying list of channels, that is shown as channel zero within the bank.
     *
     * @since API version 2
     * @deprecated {@link #scrollPosition()}
     */
    channelScrollPosition(): IntegerValue;

    /**
     * Registers an observer that reports the current scroll position, more specifically the position of the
     * first channel within the underlying list of channels, that is shown as channel zero within the bank.
     *
     * @param callback
     *           a callback function that receives a single integer number parameter
     * @param valueWhenUnassigned
     *           a default value for the channel position that gets reported in case the channel bank is not
     *           connected to a list of channels in Bitwig Studio.
     * @since API version 1
     * @deprecated Use {@link #channelScrollPosition()} instead
     */
    addChannelScrollPositionObserver(
      callback: IntegerValueChangedCallback,
      valueWhenUnassigned: number
    ): void;

    /**
     * Value that reports if the channel bank can be scrolled further down.
     *
     * @since API version 2
     */
    canScrollChannelsUp(): BooleanValue;

    /**
     * Registers an observer that reports if the channel bank can be scrolled further up.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use canScrollChannelsUp().addValueObserver(callback)
     */
    addCanScrollChannelsUpObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports if the channel bank can be scrolled further down.
     *
     * @since API version 2
     */
    canScrollChannelsDown(): BooleanValue;

    /**
     * Registers an observer that reports if the channel bank can be scrolled further down.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #canScrollChannelsDown()}.addValueObserver(callback)
     */
    addCanScrollChannelsDownObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Value that reports the underlying total channel count (not the number of channels available in the bank
     * window).
     *
     * @since API version 2
     */
    channelCount(): IntegerValue;

    /**
     * Registers an observer that reports the underlying total channel count (not the number of channels
     * available in the bank window).
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #channelCount()}.addValueObserver(callback)
     */
    addChannelCountObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Scrolls the sends one page up.
     *
     * @since API version 1
     * @deprecated Does nothing.
     */
    scrollSendsPageUp(): void;

    /**
     * Scrolls the sends one page down.
     *
     * @since API version 1
     * @deprecated Does nothing.
     */
    scrollSendsPageDown(): void;

    /**
     * Scrolls the sends one step up.
     *
     * @since API version 1
     * @deprecated Does nothing.
     */
    scrollSendsUp(): void;

    /**
     * Scrolls the sends one step down.
     *
     * @since API version 1
     * @deprecated Does nothing.
     */
    scrollSendsDown(): void;

    /**
     * Scrolls to the send.
     *
     * @param position
     *           the index of the send.
     * @since API version 1
     * @deprecated Does nothing.
     */
    scrollToSend(position: number): void;

    /**
     * Registers an observer that reports if the sends window can be scrolled further up.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter
     * @since API version 1
     * @deprecated Does nothing.
     */
    addCanScrollSendsUpObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the sends window can be scrolled further down.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter
     * @since API version 1
     * @deprecated Does nothing.
     */
    addCanScrollSendsDownObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports the underlying total send count (not the number of sends available in
     * the bank window).
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Does nothing.
     */
    addSendCountObserver(callback: IntegerValueChangedCallback): void;
  }

  // source: com/bitwig/extension/controller/api/Clip.java

  import NoteStepChangedCallback = com.bitwig.extension.callback.NoteStepChangedCallback;
  import StepDataChangedCallback = com.bitwig.extension.callback.StepDataChangedCallback;

  /**
   * An interface that provides access to the contents of a clip in Bitwig Studio.
   *
   * The note content of the clip is exposed in terms of steps and keys, mainly targeted to x-y-grid
   * applications such as step sequencers.
   *
   * @since API version 1
   */
  interface Clip extends ObjectProxy {
    /**
     * Scroll the note grid so that the given key becomes the key with y position of 0.
     *
     * Note: This can cause some parts of the grid to represent invalid keys as there is no clipping
     *
     * @param key
     *           the key that should be the new key with a y position of 0. This must be a value in the range
     *           0...127.
     * @since API version 1
     */
    scrollToKey(key: number): void;

    /**
     * Scrolls the note grid keys one page up. For example if the note grid is configured to show 12 keys and
     * is currently showing keys [36..47], calling this method would scroll the note grid to key range
     * [48..59].
     *
     * @since API version 1
     */
    scrollKeysPageUp(): void;

    /**
     * Scrolls the note grid keys one page down. For example if the note grid is configured to show 12 keys and
     * is currently showing keys [36..47], calling this method would scroll the note grid to key range
     * [48..59].
     *
     * @since API version 1
     */
    scrollKeysPageDown(): void;

    /**
     * Scrolls the note grid keys one key up. For example if the note grid is configured to show 12 keys and is
     * currently showing keys [36..47], calling this method would scroll the note grid to key range [37..48].
     *
     * @since API version 1
     */
    scrollKeysStepUp(): void;

    /**
     * Scrolls the note grid keys one key down. For example if the note grid is configured to show 12 keys and
     * is currently showing keys [36..47], calling this method would scroll the note grid to key range
     * [35..46].
     *
     * @since API version 1
     */
    scrollKeysStepDown(): void;

    /**
     * Scroll the note grid so that the given step becomes visible.
     *
     * @param step
     *           the step that should become visible
     * @since API version 1
     */
    scrollToStep(step: number): void;

    /**
     * Scrolls the note grid steps one page forward. For example if the note grid is configured to show 16
     * steps and is currently showing keys [0..15], calling this method would scroll the note grid to key range
     * [16..31].
     *
     * @since API version 1
     */
    scrollStepsPageForward(): void;

    /**
     * Scrolls the note grid steps one page backwards. For example if the note grid is configured to show 16
     * steps and is currently showing keys [16..31], calling this method would scroll the note grid to key
     * range [0..16].
     *
     * @since API version 1
     */
    scrollStepsPageBackwards(): void;

    /**
     * Scrolls the note grid steps one step forward. For example if the note grid is configured to show 16
     * steps and is currently showing keys [0..15], calling this method would scroll the note grid to key range
     * [1..16].
     *
     * @since API version 1
     */
    scrollStepsStepForward(): void;

    /**
     * Scrolls the note grid steps one step backwards. For example if the note grid is configured to show 16
     * steps and is currently showing keys [1..16], calling this method would scroll the note grid to key range
     * [0..15].
     *
     * @since API version 1
     */
    scrollStepsStepBackwards(): void;

    /**
     * Value that reports if the note grid keys can be scrolled further up.
     *
     * @since API version 2
     */
    canScrollKeysUp(): BooleanValue;

    /**
     * Registers an observer that reports if the note grid keys can be scrolled further up.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @since API version 1
     * @deprecated Use {@link #canScrollKeysUp()} instead.
     */
    addCanScrollKeysUpObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports if the note grid keys can be scrolled further down.
     *
     * @since API version 2
     */
    canScrollKeysDown(): BooleanValue;

    /**
     * Registers an observer that reports if the note grid keys can be scrolled further down.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @since API version 1
     * @deprecated Use {@link #canScrollKeysDown()} instead.
     */
    addCanScrollKeysDownObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports if the note grid if the note grid steps can be scrolled backwards.
     *
     * @since API version 2
     */
    canScrollStepsBackwards(): BooleanValue;

    /**
     * Registers an observer that reports if the note grid steps can be scrolled backwards.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @since API version 1
     * @deprecated Use {@link #canScrollStepsBackwards()} instead.
     */
    addCanScrollStepsBackwardsObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Value that reports if the note grid if the note grid steps can be scrolled forwards.
     *
     * @since API version 2
     */
    canScrollStepsForwards(): BooleanValue;

    /**
     * Registers an observer that reports if the note grid keys can be scrolled forward.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @since API version 1
     * @deprecated Use {@link #canScrollStepsForwards()} instead.
     */
    addCanScrollStepsForwardObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * @see #toggleStep(int, int, int, int) channel will be 0.
     * @since API version 1
     */
    toggleStep(x: number, y: number, insertVelocity: number): void;

    /**
     * Toggles the existence of a note in the note grid cell specified by the given x and y arguments.
     *
     * @param channel the MIDI channel, between 0 and 15.
     * @param x
     *           the x position within the note grid, defining the step/time of the target note
     * @param y
     *           the y position within the note grid, defining the key of the target note
     * @param insertVelocity
     *           the velocity of the target note in case a new note gets inserted
     * @since API version 10
     */
    toggleStep(
      channel: number,
      x: number,
      y: number,
      insertVelocity: number
    ): void;

    /**
     * @see #setStep(int, int, int, int, double) channel will be 0.
     * @since API version 1
     */
    setStep(
      x: number,
      y: number,
      insertVelocity: number,
      insertDuration: number
    ): void;

    /**
     * Creates a note in the grid cell specified by the given x and y arguments. Existing notes are
     * overwritten.
     *
     * @param x
     *           the x position within the note grid, defining the step/time of the new note
     * @param y
     *           the y position within the note grid, defining the key of the new note
     * @param insertVelocity
     *           the velocity of the new note
     * @param insertDuration
     *           the duration of the new note
     * @since API version 1
     */
    setStep(
      channel: number,
      x: number,
      y: number,
      insertVelocity: number,
      insertDuration: number
    ): void;

    /**
     * @see #clearStep(int, int, int)
     * @since API version 1
     */
    clearStep(x: number, y: number): void;

    /**
     * Removes the note in the grid cell specified by the given x and y arguments. Calling this method does
     * nothing in case no note exists at the given x-y-coordinates.
     *
     * @param channel MIDI channel, from 0 to 15.
     * @param x
     *           the x position within the note grid, defining the step/time of the target note
     * @param y
     *           the y position within the note grid, defining the key of the target note
     * @since API version 10
     */
    clearStep(channel: number, x: number, y: number): void;

    /**
     * Removes all notes in the grid started on the step x.
     *
     * @since API version 10
     */
    clearStepsAtX(channel: number, x: number): void;

    /**
     * @see #clearStepsAtY(int, int) channel will be 0.
     * @since API version 1
     * @deprecated Use {@link #clearStepsAtY(int, int)} instead.
     */
    clearSteps(y: number): void;

    /**
     * Removes all notes in the grid row specified by the given y argument.
     *
     * @param channel MIDI channel, from 0 to 15.
     * @param y the y position within the note grid, defining the key of the target note
     * @since API version 10
     */
    clearStepsAtY(channel: number, y: number): void;

    /**
     * Removes all notes in the grid.
     *
     * @since API version 1
     */
    clearSteps(): void;

    /**
     * @see #moveStep(int, int, int, int, int) channel will be 0.
     * @since API version 16
     */
    moveStep(x: number, y: number, dx: number, dy: number): void;

    /**
     * Moves a note in the note grid cell specified by the given x and y arguments to the grid cell (x + dx, y + dy).
     * @param channel MIDI channel, from 0 to 15.
     * @param x
     *           the x position within the note grid, defining the step/time of the target note
     * @param y
     *           the y position within the note grid, defining the key of the target note
     * @param dx
     *           the offset in x direction
     * @param dy
     *           the offset in y direction
     * @since API version 16
     */
    moveStep(
      channel: number,
      x: number,
      y: number,
      dx: number,
      dy: number
    ): void;

    /**
     * @see #selectStepContents(int, int, int, boolean) channel will be 0.
     * @since API version 1
     */
    selectStepContents(
      x: number,
      y: number,
      clearCurrentSelection: boolean
    ): void;

    /**
     * Selects the note in the grid cell specified by the given x and y arguments, in case there actually is a
     * note at the given x-y-coordinates.
     *
     * @param channel MIDI channel, from 0 to 15.
     * @param x
     *           the x position within the note grid, defining the step/time of the target note
     * @param y
     *           the y position within the note grid, defining the key of the target note
     * @param clearCurrentSelection
     *           `true` if the existing selection should be cleared, {@false} if the note should be added to
     *           the current selection.
     * @since API version 10
     */
    selectStepContents(
      channel: number,
      x: number,
      y: number,
      clearCurrentSelection: boolean
    ): void;

    /**
     * Sets the beat time duration that is represented by one note grid step.
     *
     * @param lengthInBeatTime
     *           the length of one note grid step in beat time.
     * @since API version 1
     */
    setStepSize(lengthInBeatTime: number): void;

    /**
     * Registers an observer that reports which note grid steps/keys contain notes.
     *
     * @param callback
     *           A callback function that receives three parameters: 1. the x (step) coordinate within the note
     *           grid (integer), 2. the y (key) coordinate within the note grid (integer), and 3. an integer
     *           value that indicates if the step is empty (`0`) or if a note continues playing (`1`) or starts
     *           playing (`2`).
     * @since API version 1
     * @see #addNoteStepObserver(NoteStepChangedCallback) which will provide more details.
     */
    addStepDataObserver(callback: StepDataChangedCallback): void;

    /**
     * Registers an observer that reports which note grid steps/keys contain notes.
     *
     * @param callback A callback function that receives the StepInfo.
     * @since API version 10
     */
    addNoteStepObserver(callback: NoteStepChangedCallback): void;

    /**
     * Value that reports note grid cells as they get played by the sequencer.
     *
     * @since API version 2
     */
    playingStep(): IntegerValue;

    /**
     * Registers an observer that reports note grid cells as they get played by the sequencer.
     *
     * @param callback
     *           A callback function that receives a single integer parameter, which reflects the step
     *           coordinate that is played, or -1 if no step is associated with the current playback position.
     * @since API version 1
     * @deprecated Use {@link #playingStep()} instead.
     */
    addPlayingStepObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Updates the name of the clip.
     *
     * @param name
     *           the new clip name
     * @since API version 1
     */
    setName(name: string): void;

    /**
     * Returns shuffle settings of the clip.
     *
     * @return the value object that represents the clips shuffle setting.
     * @since API version 1
     */
    getShuffle(): SettableBooleanValue;

    /**
     * Returns accent setting of the clip.
     *
     * @return the ranged value object that represents the clips accent setting.
     * @since API version 1
     */
    getAccent(): SettableRangedValue;

    /**
     * Returns the start of the clip in beat time.
     *
     * @return the beat time object that represents the clips start time.
     * @since API version 1
     */
    getPlayStart(): SettableBeatTimeValue;

    /**
     * Returns the length of the clip in beat time.
     *
     * @return the beat time object that represents the duration of the clip.
     * @since API version 1
     */
    getPlayStop(): SettableBeatTimeValue;

    /**
     * Returns an object that provides access to the loop enabled state of the clip.
     *
     * @return a boolean value object.
     * @since API version 1
     */
    isLoopEnabled(): SettableBooleanValue;

    /**
     * Returns the loop start time of the clip in beat time.
     *
     * @return the beat time object that represents the clips loop start time.
     * @since API version 1
     */
    getLoopStart(): SettableBeatTimeValue;

    /**
     * Returns the loop length of the clip in beat time.
     *
     * @return the beat time object that represents the clips loop length.
     * @since API version 1
     */
    getLoopLength(): SettableBeatTimeValue;

    /**
     * Registers an observer that reports the clip color.
     *
     * @param callback
     *           a callback function that receives three parameters: 1. the red coordinate of the RBG color
     *           value, 2. the green coordinate of the RBG color value, and 3. the blue coordinate of the RBG
     *           color value
     * @since API version 1
     * @deprecated use {@link #color()} instead.
     */
    addColorObserver(callback: ColorValueChangedCallback): void;

    /**
     * Get the color of the clip.
     *
     * @since API version 2
     */
    color(): SettableColorValue;

    /**
     * Duplicates the clip.
     *
     * @since API version 1
     */
    duplicate(): void;

    /**
     * Duplicates the content of the clip.
     *
     * @since API version 1
     */
    duplicateContent(): void;

    /**
     * Transposes all notes in the clip by the given number of semitones.
     *
     * @param semitones
     *           the amount of semitones to transpose, can be a positive or negative integer value.
     * @since API version 1
     */
    transpose(semitones: number): void;

    /**
     * Quantize the start time of all notes in the clip according to the given amount. The note lengths remain
     * the same as before.
     *
     * @param amount
     *           a factor between `0` and `1` that allows to morph between the original note start and the
     *           quantized note start.
     * @since API version 1
     */
    quantize(amount: number): void;

    /**
     * Gets the track that contains the clip.
     *
     * @return a track object that represents the track which contains the clip.
     * @since API version 1
     */
    getTrack(): Track;

    /**
     * Setting for the default launch quantization.
     *
     * Possible values are "default", "none", "8", "4", "2", "1", "1/2", "1/4", "1/8", "1/16"
     *
     * @since API version 8
     */
    launchQuantization(): SettableEnumValue;

    /**
     * Setting "Q to loop" in the inspector.
     *
     * @since API version 8
     */
    useLoopStartAsQuantizationReference(): SettableBooleanValue;

    /**
     * Setting "Legato" from the inspector.
     *
     * @since API version 8
     * @deprecated  Use {@link #launchMode()} instead.
     */
    launchLegato(): SettableBooleanValue;

    /**
     * Setting "Launch Mode" from the inspector.
     * Possible values are:
     *  - default
     *  - from_start
     *  - continue_or_from_start
     *  - continue_or_synced
     *  - synced
     *
     * @since API version 9
     */
    launchMode(): SettableEnumValue;

    /**
     * Get step info
     *
     * @since API version 10
     */
    getStep(channel: number, x: number, y: number): NoteStep;

    /**
     * Launches the clip.
     *
     * @since API version 10
     */
    launch(): void;

    /**
     * Launches with the given options:
     *
     * @param quantization possible values are "default", "none", "8", "4", "2", "1", "1/2", "1/4", "1/8", "1/16"
     * @param launchMode possible values are: "default", "from_start", "continue_or_from_start",
     *                   "continue_or_synced", "synced"
     *
     * @since API version 16
     */
    launchWithOptions(quantization: string, launchMode: string): void;

    /**
     * Get the clip launcher slot containing the clip.
     *
     * @since API version 10
     */
    clipLauncherSlot(): ClipLauncherSlot;

    /**
     * Open the detail editor and show the clip.
     *
     * @since API version 18
     */
    showInEditor(): void;
  }

  // source: com/bitwig/extension/controller/api/ClipBrowsingSession.java

  /**
   * Instances of this interface are used for browsing clips, including access to all filter columns and the
   * result column as shown in the 'Clips' tab of Bitwig Studio's contextual browser window.
   *
   * @see BrowsingSession
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface ClipBrowsingSession extends BrowsingSession {
    /**
     * Returns the file type filter as shown in the category column of the browser.
     *
     * @return the requested file type filter object.
     * @since API version 1
     */
    getFileTypeFilter(): BrowserFilterColumn;
  }

  // source: com/bitwig/extension/controller/api/ClipLauncherSlot.java

  interface ClipLauncherSlot extends ClipLauncherSlotOrScene {
    /**
     * Value that reports whether this slot is selected or not.
     *
     * @since API version 2
     */
    isSelected(): BooleanValue;

    /**
     * Value that reports whether this slot has content or not.
     *
     * @since API version 2
     */
    hasContent(): BooleanValue;

    /**
     * Value that reports whether this slot is playing or not.
     *
     * @since API version 2
     */
    isPlaying(): BooleanValue;

    /**
     * Value that reports whether this slot is queued for playback or not.
     *
     * @since API version 2
     */
    isPlaybackQueued(): BooleanValue;

    /**
     * Value that reports whether this slot is recording or not.
     *
     * @since API version 2
     */
    isRecording(): BooleanValue;

    /**
     * Value that reports whether this slot is queued for recording or not.
     *
     * @since API version 2
     */
    isRecordingQueued(): BooleanValue;

    /**
     * Value that reports true if the slot has a clip playing and the track is queued for stop.
     *
     * @since API version 2
     */
    isStopQueued(): BooleanValue;

    /**
     * Starts browsing for content that can be inserted in this slot in Bitwig Studio's popup browser.
     *
     * @since API version 2
     */
    browseToInsertClip(): void;

    /**
     * Value that reports the color of this slot.
     *
     * @since API version 2
     */
    color(): SettableColorValue;

    /**
     * Selects the slot.
     *
     * @since API version 10
     */
    select(): void;

    /**
     * @since API version 10
     */
    selectAction(): HardwareActionBindable;

    /**
     * Start recording a clip.
     *
     * @since API version 10
     */
    record(): void;

    /**
     * @since API version 10
     */
    recordAction(): HardwareActionBindable;

    /**
     * Makes the clip content of the slot visible in the note or audio editor.
     *
     * @since API version 10
     */
    showInEditor(): void;

    /**
     * Creates an new clip.
     *
     * @since API version 10
     */
    createEmptyClip(lengthInBeats: number): void;

    /**
     * Duplicates the clip.
     *
     * @since API version 10
     */
    duplicateClip(): void;
  }

  // source: com/bitwig/extension/controller/api/ClipLauncherSlotBank.java

  import ClipLauncherSlotBankPlaybackStateChangedCallback = com.bitwig.extension.callback.ClipLauncherSlotBankPlaybackStateChangedCallback;
  import IndexedBooleanValueChangedCallback = com.bitwig.extension.callback.IndexedBooleanValueChangedCallback;
  import IndexedColorValueChangedCallback = com.bitwig.extension.callback.IndexedColorValueChangedCallback;

  /**
   * Instances of this interface represent a scrollable fixed-size window that is connected to a section of the
   * clip launcher slots for a specific track.
   *
   * @since API version 1
   */
  interface ClipLauncherSlotBank
    extends ClipLauncherSlotOrSceneBank<ClipLauncherSlot> {
    /**
     * Selects the slot with the given index.
     *
     * @param slot
     *           the index of the slot within the slot window.
     * @since API version 1
     */
    select(slot: number): void;

    /**
     * Starts recording into the slot with the given index.
     *
     * @param slot
     *           the index of the slot within the slot window.
     * @since API version 1
     */
    record(slot: number): void;

    /**
     * Makes the clip content of the slot with the given index visible in the note or audio editor.
     *
     * @param slot
     *           the index of the slot within the slot window.
     * @since API version 1
     */
    showInEditor(slot: number): void;

    /**
     * Creates an new clip in the slot with the given index.
     *
     * @param slot
     *           the index of the slot within the slot window.
     * @since API version 1
     */
    createEmptyClip(slot: number, lengthInBeats: number): void;

    /**
     * Deletes the clip in the slot with the given index.
     *
     * @param slot
     *           the index of the slot within the slot window.
     * @since API version 1
     * @deprecated Use {@link #getItemAt(int).deleteObject()} instead.
     */
    deleteClip(slot: number): void;

    /**
     * Duplicates the clip in the slot with the given index.
     *
     * @param slot
     *           the index of the slot within the slot window.
     * @since API version 1
     */
    duplicateClip(slot: number): void;

    /**
     * Registers an observer that reports selection changes for the slots inside the window.
     *
     * @param callback
     *           a callback function that receives two parameters: 1. the slot index (integer), and 2. a
     *           boolean parameter indicating if the slot at that index is selected (`true`) or not (`false`)
     * @since API version 1
     */
    addIsSelectedObserver(callback: IndexedBooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports which slots contain clips.
     *
     * @param callback
     *           a callback function that receives two parameters: 1. the slot index (integer), and 2. a
     *           boolean parameter indicating if the slot at that index contains a clip (`true`) or not
     *           (`false`)
     * @since API version 1
     */
    addHasContentObserver(callback: IndexedBooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports the playback state of clips / slots. The reported states include
     * `stopped`, `playing`, `recording`, but also `queued for stop`, `queued for playback`, `queued for
     * recording`.
     *
     * @param callback
     *           a callback function that receives three parameters: 1. the slot index (integer), 2. the queued
     *           or playback state: `0` when stopped, `1` when playing, or `2` when recording, and 3. a boolean
     *           parameter indicating if the second argument is referring to the queued state (`true`) or the
     *           actual playback state (`false`)
     * @since API version 1
     */
    addPlaybackStateObserver(
      callback: ClipLauncherSlotBankPlaybackStateChangedCallback
    ): void;

    /**
     * Registers an observer that reports which slots have clips that are currently playing.
     *
     * @param callback
     *           a callback function that receives two parameters: 1. the slot index (integer), and 2. a
     *           boolean parameter indicating if the slot at that index has a clip that is currently playing
     *           (`true`) or not (`false`)
     * @since API version 1
     */
    addIsPlayingObserver(callback: IndexedBooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports which slots have clips that are currently recording.
     *
     * @param callback
     *           a callback function that receives two parameters: 1. the slot index (integer), and 2. a
     *           boolean parameter indicating if the slot at that index has a clip that is currently recording
     *           (`true`) or not (`false`)
     * @since API version 1
     */
    addIsRecordingObserver(callback: IndexedBooleanValueChangedCallback): void;

    /**
     * Add an observer if clip playback is queued on the slot.
     *
     * @param callback
     *           a callback function that receives two parameters: 1. the slot index (integer), and 2. a
     *           boolean parameter indicating if the slot at that index has a clip that is currently queued for
     *           playback (`true`) or not (`false`)
     * @since API version 1
     */
    addIsPlaybackQueuedObserver(
      callback: IndexedBooleanValueChangedCallback
    ): void;

    /**
     * Add an observer if clip recording is queued on the slot.
     *
     * @param callback
     *           a callback function that receives two parameters: 1. the slot index (integer), and 2. a
     *           boolean parameter indicating if the slot at that index has a clip that is currently queued for
     *           recording (`true`) or not (`false`)
     * @since API version 1
     */
    addIsRecordingQueuedObserver(
      callback: IndexedBooleanValueChangedCallback
    ): void;

    /**
     * Add an observer if clip playback is queued to stop on the slot.
     *
     * @param callback
     *           a callback function that receives two parameters: 1. the slot index (integer), and 2. a
     *           boolean parameter indicating if the slot at that index has a clip that is currently queued for
     *           stop (`true`) or not (`false`)
     * @since API version 1
     */
    addIsStopQueuedObserver(callback: IndexedBooleanValueChangedCallback): void;

    /**
     * @deprecated Use {@link #addIsPlaybackQueuedObserver} instead.
     * @since API version 1
     */
    addIsQueuedObserver(callback: IndexedBooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports the colors of clip in the current slot window.
     *
     * @param callback
     *           a callback function that receives four parameters: 1. the slot index (integer), 2. the red
     *           coordinate of the RBG color value, 3. the green coordinate of the RBG color value, and 4. the
     *           blue coordinate of the RBG color value
     * @since API version 1
     */
    addColorObserver(callback: IndexedColorValueChangedCallback): void;

    /**
     * Specifies if the Bitwig Studio clip launcher should indicate which slots are part of the window. By
     * default indications are disabled.
     *
     * @param shouldIndicate
     *           `true` if visual indications should be enabled, `false` otherwise
     * @since API version 1
     * @deprecated
     */
    setIndication(shouldIndicate: boolean): void;

    /**
     * Returns an object that can be used to observe and toggle if the slots on a connected track group show
     * either scenes launch buttons (for launching the content of the track group) or the clips of the group
     * master track.
     *
     * @return a boolean value object.
     */
    isMasterTrackContentShownOnTrackGroups(): SettableBooleanValue;
  }

  // source: com/bitwig/extension/controller/api/ClipLauncherSlotOrScene.java

  interface ClipLauncherSlotOrScene
    extends ObjectProxy,
      DeleteableObject,
      DuplicableObject {
    /**
     * Returns an object that provides access to the name of the scene.
     *
     * @return a string value object that represents the scene name.
     * @since API version 2
     */
    name(): StringValue;

    /**
     * Launches the clip or scene.
     *
     * @since API version 1
     */
    launch(): void;

    launchAction(): HardwareActionBindable;

    /**
     * Launches with alternative settings.
     *
     * @since API version 18
     */
    launchAlt(): void;

    /**
     * @since API version 18
     */
    launchAltAction(): HardwareActionBindable;

    /**
     * Call it when the pad is released.
     *
     * @since API version 18
     */
    launchRelease(): void;

    /**
     * @since API version 18
     */
    launchReleaseAction(): HardwareActionBindable;

    /**
     * Call it when the pad is released with alternative settings.
     *
     * @since API version 18
     */
    launchReleaseAlt(): void;

    /**
     * @since API version 18
     */
    launchReleaseAltAction(): HardwareActionBindable;

    /**
     * Launches with the given options:
     *
     * @param quantization
     *           possible values are "default", "none", "8", "4", "2", "1", "1/2", "1/4", "1/8", "1/16"
     * @param launchMode
     *           possible values are: "default", "from_start", "continue_or_from_start",
     *           "continue_or_synced", "synced"
     *
     * @since API version 16
     */
    launchWithOptions(quantization: string, launchMode: string): void;

    launchWithOptionsAction(
      quantization: string,
      launchMode: string
    ): HardwareActionBindable;

    /**
     * Launches the last clip with the given options:
     *
     * @param quantization
     *           possible values are "default", "none", "8", "4", "2", "1", "1/2", "1/4", "1/8", "1/16"
     * @param launchMode
     *           possible values are: "default", "from_start", "continue_or_from_start",
     *           "continue_or_synced", "synced"
     *
     * @since API version 16
     */
    launchLastClipWithOptions(quantization: string, launchMode: string): void;

    launchLastClipWithOptionsAction(
      quantization: string,
      launchMode: string
    ): HardwareActionBindable;

    /**
     * Value that reports the position of the scene within the list of Bitwig Studio scenes.
     *
     * @since API version 2
     */
    sceneIndex(): IntegerValue;

    /**
     * Copies the current slot or scene into the dest slot or scene.
     *
     * @since API version 4
     * @deprecated Use {@link #replaceInsertionPoint()} instead.
     */
    copyFrom(source: ClipLauncherSlotOrScene): void;

    /**
     * Moves the current slot or scene into the destination slot or scene.
     *
     * @since API version 4
     * @deprecated Use {@link #replaceInsertionPoint()} instead.
     */
    moveTo(dest: ClipLauncherSlotOrScene): void;

    /**
     * Value that reports the color of this slot.
     *
     * @since API version 7
     */
    color(): SettableColorValue;

    /**
     * Specifies if the Bitwig Studio clip launcher should indicate which slots and scenes are part of the
     * window. By default indications are disabled.
     *
     * @param shouldIndicate
     *           `true` if visual indications should be enabled, `false` otherwise
     * @since API version 10
     * @deprecated Clip launcher indication is now not per slot or scene but instead as a framed rectangle in
     *             the user interface. Use {@link SceneBank#setIndication(boolean)} or
     *             {@link TrackBank#setShouldShowClipLauncherFeedback()}
     */
    setIndication(shouldIndicate: boolean): void;

    /**
     * An {@link InsertionPoint} that is used to replace the contents of this slot or scene.
     *
     * @since API version 7
     */
    replaceInsertionPoint(): InsertionPoint;

    /**
     * An {@link InsertionPoint} that can be used to insert content in the next scene.
     *
     * @since API version 7
     */
    nextSceneInsertionPoint(): InsertionPoint;

    /**
     * An {@link InsertionPoint} that can be used to insert content after this slot or scene.
     *
     * @since API version 7
     */
    previousSceneInsertionPoint(): InsertionPoint;
  }

  // source: com/bitwig/extension/controller/api/ClipLauncherSlotOrSceneBank.java

  import IndexedStringValueChangedCallback = com.bitwig.extension.callback.IndexedStringValueChangedCallback;

  /**
   * An abstract interface that represents the clip launcher scenes or slots of a single track.
   *
   * @since API version 1
   */
  interface ClipLauncherSlotOrSceneBank<
    ItemType extends ClipLauncherSlotOrScene = ClipLauncherSlotOrScene
  > extends Bank<ItemType> {
    /**
     * Launches the scene/slot with the given index.
     *
     * @param slot
     *           the index of the slot that should be launched
     * @since API version 1
     */
    launch(slot: number): void;

    /**
     * Launches the scene/slot with the given index.
     *
     * @param slot
     *           the index of the slot that should be launched
     * @since API version 18
     */
    launchAlt(slot: number): void;

    /**
     * Stops clip launcher playback for the associated track.
     *
     * @since API version 1
     */
    stop(): void;

    /**
     * Stops clip launcher playback for the associated track.
     *
     * @since API version 18
     */
    stopAlt(): void;

    /**
     * Action to call {@link #stop()}.
     * @since API version 10
     */
    stopAction(): HardwareActionBindable;

    /**
     * Action to call {@link #stopAlt()}.
     * @since API version 18
     */
    stopAltAction(): HardwareActionBindable;

    /**
     * Performs a return-to-arrangement operation on the related track, which caused playback to be taken over
     * by the arrangement sequencer.
     *
     * @since API version 1
     */
    returnToArrangement(): void;

    /**
     * Registers an observer that reports the names of the scenes and slots. The slot names reflect the names
     * of containing clips.
     *
     * @param callback
     *           a callback function receiving two parameters: 1. the slot index (integer) within the
     *           configured window, and 2. the name of the scene/slot (string)
     * @since API version 1
     */
    addNameObserver(callback: IndexedStringValueChangedCallback): void;
  }

  // source: com/bitwig/extension/controller/api/ColorHardwareProperty.java

  import Supplier = java.util.func.Supplier;
  import Color = com.bitwig.extension.api.Color;

  /**
   * Represents an output value shown on some hardware (for example, the color of a light).
   *
   * @since API version 10
   */
  interface ColorHardwareProperty extends HardwareProperty {
    /** Gets the current value. This is the value that should be sent to the hardware to be displayed. */
    currentValue(): Color;

    /** The value that was last sent to the hardware. */
    lastSentValue(): Color;

    /**
     * Specifies a callback that should be called with the value that needs to be sent to the hardware. This
     * callback is called as a result of calling the {@link HardwareSurface#updateHardware()} method (typically
     * from the flush method).
     */
    onUpdateHardware(sendValueConsumer: Consumer<Color>): void;

    /** Sets the current value. */
    setValue(value: Color): void;

    /** Sets the current value from a {@link Supplier} that supplies the latest value. */
    setValueSupplier(supplier: Supplier<Color>): void;
  }

  // source: com/bitwig/extension/controller/api/ColorValue.java

  interface ColorValue
    extends Value<ColorValueChangedCallback>,
      Supplier<Color> {
    /**
     * Gets the red component of the current value.
     *
     * @since API version 2
     */
    red(): number;

    /**
     * Gets the green component of the current value.
     *
     * @since API version 2
     */
    green(): number;

    /**
     * Gets the blue component of the current value.
     *
     * @since API version 2
     */
    blue(): number;

    /**
     * Gets the alpha component of the current value.
     *
     * @since API version 5
     */
    alpha(): number;

    get(): Color;
  }

  // source: com/bitwig/extension/controller/api/ContinuousHardwareControl.java

  /**
   * Represents a hardware control that can input a relative or absolute value (for example, a slider, knob,
   * relative encoder...).
   *
   * @since API version 10
   */
  interface ContinuousHardwareControl<
    HardwareBindingType extends HardwareBinding = HardwareBinding
  > extends HardwareControl,
      HardwareBindingSource<HardwareBindingType> {
    /**
     * An optional button that can be associated with this control when this control can also act as a button
     * (e.g by pressing down on it).
     */
    hardwareButton(): HardwareButton;

    /**
     * Sets an optional button that can be associated with this control when this control can also act as a
     * button (e.g by pressing down on it).
     */
    setHardwareButton(button: HardwareButton): void;

    /**
     * The name of the target that this hardware control has been bound to.
     *
     * @since API version 11
     */
    targetName(): StringValue;

    /** The value of the target that this hardware control has been bound to (0..1). */
    targetValue(): DoubleValue;

    /**
     * Value that represents a formatted text representation of the target value whenever the value changes.
     *
     * @since API version 11
     */
    targetDisplayedValue(): StringValue;

    /**
     * The value of the target that this hardware control has been bound to (0..1).
     *
     * @since API version 11
     */
    modulatedTargetValue(): DoubleValue;

    /**
     * Value that represents a formatted text representation of the target's modulated value whenever the value
     * changes.
     *
     * @since API version 11
     */
    modulatedTargetDisplayedValue(): StringValue;

    /**
     * Can be called from the {@link #targetValue()} changed callback to check if this control is responsible
     * for changing the target value or not.
     */
    isUpdatingTargetValue(): BooleanValue;

    /** Value that indicates if this hardware control has a target value that it changes or not. */
    hasTargetValue(): BooleanValue;
  }

  // source: com/bitwig/extension/controller/api/ContinuousHardwareValueMatcher.java

  /**
   * Defines a means of recognizing when a continuous value is input by the user (for example, when moving a
   * slider or turning a knob based on some MIDI message).
   *
   * @see MidiIn#createAbsoluteValueMatcher(String, String, int)
   * @see MidiIn#createAbsoluteCCValueMatcher(int, int)
   * @see MidiIn#createAbsolutePitchBendValueMatcher(int)
   *
   * @since API version 10
   *
   */
  interface ContinuousHardwareValueMatcher extends HardwareInputMatcher {}

  // source: com/bitwig/extension/controller/api/ControllerHost.java

  import UUID = java.util.UUID;
  import DoubleConsumer = java.util.func.DoubleConsumer;
  import Host = com.bitwig.extension.api.Host;
  import ConnectionEstablishedCallback = com.bitwig.extension.callback.ConnectionEstablishedCallback;
  import DataReceivedCallback = com.bitwig.extension.callback.DataReceivedCallback;
  import ControllerExtensionDefinition = com.bitwig.extension.controller.ControllerExtensionDefinition;
  import HardwareDeviceMatcher = com.bitwig.extension.controller.HardwareDeviceMatcher;

  /**
   * @mainpage Introduction
   *
   * Welcome to the Bitwig Control Surface API.<br/>
   *
   * The pages shown here include the reference documentation for the various interfaces and functions provided
   * by the API.<br/>
   *
   * The best starting point for becoming familiar with the API within these pages is the documentation of the
   * {@link Host} interface. A singleton instance of that interface is available in the scope of each script.
   * In addition it is highly recommended to also walk through the <b>Control Surface Scripting Guide</b> that is
   * available from the @em Help menu in Bitwig Studio.
   */
  interface ControllerHost extends Host {
    /**
     * Restarts this controller.
     *
     * @since API version 7
     */
    restart(): void;

    /**
     * Loads the supplied API version into the calling script. This is only intended to be called from a
     * controller script. It cannot be called from a Java controller extension.
     */
    loadAPI(version: number): void;

    /**
     * Call this method to allow your script to use Beta APIs.
     *
     * Beta APIs are still on development and might not be available in a future version of Bitwig Studio.
     *
     * Turning this flag to true, will flag your extension as being a beta extension which might not work after
     * updating Bitwig Studio.
     *
     * @since API version 7
     */
    useBetaApi(): void;

    /**
     * Determines whether the calling script should fail if it calls a deprecated method based on the API
     * version that it requested.
     */
    shouldFailOnDeprecatedUse(): boolean;

    /**
     * Sets whether the calling script should fail if it calls a deprecated method based on the API version
     * that it requested. This is only intended to be called from a controller script. It cannot be called from
     * a Java controller extension.
     */
    setShouldFailOnDeprecatedUse(value: boolean): void;

    /**
     * Loads the script defined by the supplied path. This is only intended to be called from a controller
     * script. It cannot be called from a Java controller extension.
     */
    load(path: string): void;

    /**
     * Indicates if the host platform is Windows.
     *
     * @return `true` if the host platform is Windows, `false` otherwise.
     * @since API version 1
     */
    platformIsWindows(): boolean;

    /**
     * Indicates if the host platform is Apple Mac OS X.
     *
     * @return `true` if the host platform is Mac, `false` otherwise.
     * @since API version 1
     */
    platformIsMac(): boolean;

    /**
     * Indicates if the host platform is Linux.
     *
     * @return `true` if the host platform is Linux, `false` otherwise.
     * @since API version 1
     */
    platformIsLinux(): boolean;

    /**
     * Registers a controller script with the given parameters. This function must be called once at the global
     * scope of the script.
     *
     * @param vendor
     *           the name of the hardware vendor. Must not be <code>null</code>.
     * @param name
     *           the name of the controller script as listed in the user interface of Bitwig Studio. Must not
     *           be <code>null</code>.
     * @param version
     *           the version of the controller script. Must not be <code>null</code>.
     * @param uuid
     *           a universal unique identifier (UUID) string that is used to distinguish one script from
     *           another, for example `550e8400-e29b-11d4-a716-446655440000`. Must not be <code>null</code>.
     *           For generating random UUID strings several free web tools are available.
     * @param author
     *           the name of the script author
     * @since API version 1
     */
    defineController(
      vendor: string,
      name: string,
      version: string,
      uuid: string,
      author: string
    ): void;

    /**
     * Defines the number of MIDI ports for input and output that the device uses. This method should be called
     * once in the global scope if the script is supposed to exchange MIDI messages with the device, or if the
     * script adds entries to the MIDI input/output choosers in Bitwig Studio. After calling this method the
     * individual port objects can be accessed using {@link #getMidiInPort(int index)} and
     * {@link #getMidiInPort(int index)}.
     *
     * @param numInports
     *           the number of input ports
     * @param numOutports
     *           the number of output ports
     * @since API version 1
     */
    defineMidiPorts(numInports: number, numOutports: number): void;

    /**
     * Returns the MIDI input port with the given index.
     *
     * @param index
     *           the index of the MIDI input port, must be valid.
     * @return the requested MIDI input port
     * @since API version 1
     */
    getMidiInPort(index: number): MidiIn;

    /**
     * Returns the MIDI output port with the given index.
     *
     * @param index
     *           the index of the MIDI output port, must be valid.
     * @return the requested MIDI output port
     * @since API version 1
     */
    getMidiOutPort(index: number): MidiOut;

    /**
     * Gets the {@link HardwareDevice} at the specified index. This index corresponds to the index of the
     * {@link HardwareDeviceMatcher} specified in the
     * {@link ControllerExtensionDefinition#listHardwareDevices(java.util.List)}
     *
     * @since API version 7
     */
    hardwareDevice(index: number): HardwareDevice;

    /**
     * Registers patterns which are used to automatically detect hardware devices that can be used with the
     * script.<br/>
     *
     * When the user clicks on the `detect` button in the Bitwig Studio controller preferences dialog, Bitwig
     * Studio searches for connected controller hardware by comparing the parameters passed into this function
     * are compared with the port names of the available MIDI drivers. Found controller scripts are
     * automatically added with their input/output ports configured.<br/>
     *
     * Calling this function is optional, but can also be called multiple times in the global script scope in
     * order to support alternative driver names.
     *
     * @param inputs
     *           the array of strings used to detect MIDI input ports, must not be `null`.
     * @param outputs
     *           the array of strings used to detect MIDI output ports, must not be `null`.
     * @since API version 1
     */
    addDeviceNameBasedDiscoveryPair(inputs: string[], outputs: string[]): void;

    /**
     * Registers the `Identity Reply Universal SysEx` message (if any) that the MIDI device sends after
     * receiving the `Identity Request Universal SysEx` message (`F0 7E 7F 06 01 F7`), as defined in the MIDI
     * standard.<br/>
     *
     * This function may be called at the global scope of the script, but is optional. Please note that this
     * function is only applicable to scripts with one MIDI input and one MIDI output. Also note that not all
     * MIDI hardware supports SysEx identity messages.
     *
     * @param reply
     *           the `Identity Reply Universal SysEx` message. Must not be <code>null</code>
     * @deprecated
     * @since API version 1
     */
    defineSysexIdentityReply(reply: string): void;

    /**
     * Creates a preferences object that can be used to insert settings into the Controller Preferences panel
     * in Bitwig Studio.
     *
     * @return an object that provides access to custom controller preferences
     * @since API version 1
     */
    getPreferences(): Preferences;

    /**
     * Creates a document state object that can be used to insert settings into the Studio I/O Panel in Bitwig
     * Studio.
     *
     * @return an object that provides access to custom document settings
     * @since API version 1
     */
    getDocumentState(): DocumentState;

    /**
     * Returns an object that is used to configure automatic notifications. Bitwig Studio supports automatic
     * visual feedback from controllers that shows up as popup notifications. For example when the selected
     * track or the current device preset was changed on the controller these notifications are shown,
     * depending on your configuration.
     *
     * @return a configuration object used to enable/disable the various automatic notifications supported by
     *         Bitwig Studio
     * @since API version 1
     */
    getNotificationSettings(): NotificationSettings;

    /**
     * Returns an object for controlling various aspects of the currently selected project.
     *
     * @since API version 1
     */
    getProject(): Project;

    /**
     * Returns an object for controlling and monitoring the elements of the `Transport` section in Bitwig
     * Studio. This function should be called once during initialization of the script if transport access is
     * desired.
     *
     * @return an object that represents the `Transport` section in Bitwig Studio.
     * @since API version 1
     */
    createTransport(): Transport;

    /**
     * Returns an object for controlling and monitoring the `Groove` section in Bitwig Studio. This function
     * should be called once during initialization of the script if groove control is desired.
     *
     * @return an object that represents the `Groove` section in Bitwig Studio.
     * @since API version 1
     */
    createGroove(): Groove;

    /**
     * Returns an object that provides access to general application functionality, including global view
     * settings, the list of open projects, and other global settings that are not related to a certain
     * document.
     *
     * @return an application object.
     * @since API version 1
     */
    createApplication(): Application;

    /**
     * Returns an object which provides access to the `Arranger` panel of Bitwig Studio. Calling this function
     * is equal to `createArranger(-1)`.
     *
     * @return an arranger object
     * @see #createArranger(int)
     * @since API version 1
     */
    createArranger(): Arranger;

    /**
     * Returns an object which provides access to the `Arranger` panel inside the specified window.
     *
     * @param window
     *           the index of the window where the arranger panel is shown, or -1 in case the first arranger
     *           panel found on any window should be taken
     * @return an arranger object
     * @since API version 1
     */
    createArranger(window: number): Arranger;

    /**
     * Returns an object which provides access to the `Mixer` panel of Bitwig Studio. Calling this function is
     * equal to `createMixer(-1, null)`.
     *
     * @return a `Mixer` object
     * @since API version 1
     */
    createMixer(): Mixer;

    /**
     * Returns an object which provides access to the `Mixer` panel that belongs to the specified panel layout.
     * Calling this function is equal to `createMixer(-1, panelLayout)`.
     *
     * @param panelLayout
     *           the name of the panel layout that contains the mixer panel, or `null` in case the selected
     *           panel layout in Bitwig Studio should be followed. Empty strings or invalid names are treated
     *           the same way as `null`. To receive the list of available panel layouts see
     *           {@link Application#addPanelLayoutObserver}.
     * @return a `Mixer` object
     * @since API version 1
     */
    createMixer(panelLayout: string): Mixer;

    /**
     * Returns an object which provides access to the `Mixer` panel inside the specified window. Calling this
     * function is equal to `createMixer(window, null)`.
     *
     * @param window
     *           the index of the window where the mixer panel is shown, or -1 in case the first mixer panel
     *           found on any window should be taken
     * @return a `Mixer` object
     * @since API version 1
     */
    createMixer(window: number): Mixer;

    /**
     * Returns an object which provides access to the `Mixer` panel that matches the specified parameters.
     *
     * @param panelLayout
     *           the name of the panel layout that contains the mixer panel, or `null` in case the selected
     *           panel layout in Bitwig Studio should be followed. Empty strings or invalid names are treated
     *           the same way as `null`. To receive the list of available panel layouts see
     *           {@link Application#addPanelLayoutObserver}.
     * @param window
     *           the index of the window where the mixer panel is shown, or -1 in case the first mixer panel
     *           found on any window should be taken
     * @return a `Mixer` object
     * @since API version 1
     */
    createMixer(panelLayout: string, window: number): Mixer;

    /**
     * Returns an object which provides access to the `DetailEditor` panel of Bitwig Studio. Calling this function
     * is equal to `createDetailEditor(-1)`.
     *
     * @return a detail editor object
     * @see #createDetailEditor(int)
     * @since API version 14
     */
    createDetailEditor(): DetailEditor;

    /**
     * Returns an object which provides access to the `DetailEditor` panel inside the specified window.
     *
     * @param window
     *           the index of the window where the detail editor panel is shown, or -1 in case the first detail
     *           editor panel found on any window should be taken
     * @return a detail editor object
     * @since API version 14
     */
    createDetailEditor(window: number): DetailEditor;

    /**
     * Returns a track bank with the given number of tracks, sends and scenes.<br/>
     *
     * A track bank can be seen as a fixed-size window onto the list of tracks in the current document
     * including their sends and scenes, that can be scrolled in order to access different parts of the track
     * list. For example a track bank configured for 8 tracks can show track 1-8, 2-9, 3-10 and so on.<br/>
     *
     * The idea behind the `bank pattern` is that hardware typically is equipped with a fixed amount of channel
     * strips or controls, for example consider a mixing console with 8 channels, but Bitwig Studio documents
     * contain a dynamic list of tracks, most likely more tracks than the hardware can control simultaneously.
     * The track bank returned by this function provides a convenient interface for controlling which tracks
     * are currently shown on the hardware.<br/>
     *
     * Creating a track bank using this method will consider all tracks in the document, including effect
     * tracks and the master track. Use {@link #createMainTrackBank} or {@link #createEffectTrackBank} in case
     * you are only interested in tracks of a certain kind.
     *
     * @param numTracks
     *           the number of tracks spanned by the track bank
     * @param numSends
     *           the number of sends spanned by the track bank
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @return an object for bank-wise navigation of tracks, sends and scenes
     * @see Track#createTrackBank
     * @see #createMainTrackBank
     * @see #createEffectTrackBank
     * @since API version 1
     */
    createTrackBank(
      numTracks: number,
      numSends: number,
      numScenes: number
    ): TrackBank;

    /**
     * Returns a track bank with the given number of child tracks, sends and scenes.<br/>
     *
     * A track bank can be seen as a fixed-size window onto the list of tracks in the connected track group
     * including their sends and scenes, that can be scrolled in order to access different parts of the track
     * list. For example a track bank configured for 8 tracks can show track 1-8, 2-9, 3-10 and so on.<br/>
     *
     * The idea behind the `bank pattern` is that hardware typically is equipped with a fixed amount of channel
     * strips or controls, for example consider a mixing console with 8 channels, but Bitwig Studio documents
     * contain a dynamic list of tracks, most likely more tracks than the hardware can control simultaneously.
     * The track bank returned by this function provides a convenient interface for controlling which tracks
     * are currently shown on the hardware.<br/>
     *
     * Creating a track bank using this method will consider all tracks in the document, including effect
     * tracks and the master track. Use {@link #createMainTrackBank} or {@link #createEffectTrackBank} in case
     * you are only interested in tracks of a certain kind.
     *
     * @param numTracks
     *           the number of child tracks spanned by the track bank
     * @param numSends
     *           the number of sends spanned by the track bank
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @param hasFlatTrackList
     *           specifies whether the track bank should operate on a flat list of all nested child tracks or
     *           only on the direct child tracks of the connected group track.
     * @return an object for bank-wise navigation of tracks, sends and scenes
     * @see #createMainTrackBank
     * @see #createEffectTrackBank
     * @since API version 1
     */
    createTrackBank(
      numTracks: number,
      numSends: number,
      numScenes: number,
      hasFlatTrackList: boolean
    ): TrackBank;

    /**
     * Returns a track bank with the given number of tracks, sends and scenes. Only audio tracks, instrument
     * tracks and hybrid tracks are considered. For more information about track banks and the `bank pattern`
     * in general, see the documentation for {@link #createTrackBank}.
     *
     * @param numTracks
     *           the number of tracks spanned by the track bank
     * @param numSends
     *           the number of sends spanned by the track bank
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @return an object for bank-wise navigation of tracks, sends and scenes
     * @see Track#createMainTrackBank
     * @see #createTrackBank
     * @see #createEffectTrackBank
     * @since API version 1
     */
    createMainTrackBank(
      numTracks: number,
      numSends: number,
      numScenes: number
    ): TrackBank;

    /**
     * Returns a track bank with the given number of effect tracks, sends and scenes. Only effect tracks are
     * considered. For more information about track banks and the `bank pattern` in general, see the
     * documentation for {@link #createTrackBank}.
     *
     * @param numTracks
     *           the number of tracks spanned by the track bank
     * @param numSends
     *           the number of sends spanned by the track bank
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @return an object for bank-wise navigation of tracks, sends and scenes
     * @see Track#createEffectTrackBank
     * @see #createTrackBank
     * @see #createMainTrackBank
     * @since API version 18
     */
    createEffectTrackBank(
      numTracks: number,
      numSends: number,
      numScenes: number
    ): TrackBank;

    /**
     * Returns a track bank with the given number of effect tracks and scenes. Only effect tracks are
     * considered. For more information about track banks and the `bank pattern` in general, see the
     * documentation for {@link #createTrackBank}.
     *
     * @param numTracks
     *           the number of tracks spanned by the track bank
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @return an object for bank-wise navigation of tracks, sends and scenes
     * @see Track#createEffectTrackBank
     * @see #createTrackBank
     * @see #createMainTrackBank
     * @since API version 1
     */
    createEffectTrackBank(numTracks: number, numScenes: number): TrackBank;

    /**
     * Returns an object that represents the master track of the document.
     *
     * @param numScenes
     *           the number of scenes for bank-wise navigation of the master tracks clip launcher slots.
     * @return an object representing the master track.
     * @see Track#createMasterTrack
     * @since API version 1
     */
    createMasterTrack(numScenes: number): MasterTrack;

    /**
     * Returns an object that represents the cursor item of the arranger track selection.
     *
     * @param numSends
     *           the number of sends for bank-wise navigation of the sends that are associated with the track
     *           selection
     * @param numScenes
     *           the number of scenes for bank-wise navigation of the clip launcher slots that are associated
     *           with the track selection
     * @return an object representing the currently selected arranger track (in the future also multiple
     *         tracks)
     * @since API version 1
     * @deprecated Use {@link #createCursorTrack(int, int)} instead.
     */
    createArrangerCursorTrack(numSends: number, numScenes: number): CursorTrack;

    /**
     * Returns an object that represents a named cursor track, that is independent from the arranger or mixer
     * track selection in the user interface of Bitwig Studio.
     *
     * @param name
     *           the name of the track cursor
     * @param numSends
     *           the number of sends for bank-wise navigation of the sends that are associated with the track
     *           selection
     * @param numScenes
     *           the number of scenes for bank-wise navigation of the clip launcher slots that are associated
     *           with the track selection
     * @return an object representing the currently selected arranger track (in the future also multiple
     *         tracks).
     * @since API version 1
     * @deprecated use {@link #createCursorTrack(String, String, int, int, boolean)} instead.
     */
    createCursorTrack(
      name: string,
      numSends: number,
      numScenes: number
    ): CursorTrack;

    /**
     * Returns an object that represents a named cursor track, that is independent from the arranger or mixer
     * track selection in the user interface of Bitwig Studio.
     *
     * @param name
     *           the name of the track cursor
     * @param numSends
     *           the number of sends for bank-wise navigation of the sends that are associated with the track
     *           selection
     * @param numScenes
     *           the number of scenes for bank-wise navigation of the clip launcher slots that are associated
     *           with the track selection
     * @return an object representing the currently selected arranger track (in the future also multiple
     *         tracks).
     * @since API version 1
     */
    createCursorTrack(
      id: string,
      name: string,
      numSends: number,
      numScenes: number,
      shouldFollowSelection: boolean
    ): CursorTrack;

    /**
     * Returns a scene bank with the given number of scenes.<br/>
     *
     * A scene bank can be seen as a fixed-size window onto the list of scenes in the current document, that
     * can be scrolled in order to access different parts of the scene list. For example a scene bank
     * configured for 8 scenes can show scene 1-8, 2-9, 3-10 and so on.<br/>
     *
     * The idea behind the `bank pattern` is that hardware typically is equipped with a fixed amount of channel
     * strips or controls, for example consider a mixing console with 8 channels, but Bitwig Studio documents
     * contain a dynamic list of scenes, most likely more scenes than the hardware can control simultaneously.
     * The scene bank returned by this function provides a convenient interface for controlling which scenes
     * are currently shown on the hardware.<br/>
     *
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @return an object for bank-wise navigation of scenes
     * @since API version 1
     */
    createSceneBank(numScenes: number): SceneBank;

    /**
     * Returns an object that represents the cursor device in devices selections made by the user in Bitwig
     * Studio. Calling this method is equal to the following code: {@code
     * var cursorTrack = createArrangerCursorTrack(numSends, numScenes);
     * var cursorDevice = cursorTrack.createCursorDevice();
     * } To create a custom device selection that is not connected to the main device selection in the user
     * interface, call {@link Track#createCursorDevice(String) cursorTrack.createCursorDevice(String name)}.
     *
     * @return an object representing the currently selected device.
     * @see Track#createCursorDevice()
     * @see Track#createCursorDevice(String)
     * @see #createEditorCursorDevice(int numSends)
     * @since API version 1
     * @deprecated
     */
    createEditorCursorDevice(): CursorDevice;

    /**
     * Returns an object that represents the cursor device in devices selections made by the user in Bitwig
     * Studio. Calling this method is equal to the following code: {@code
     * var cursorTrack = createArrangerCursorTrack(numSends, numScenes);
     * var cursorDevice = cursorTrack.createCursorDevice();
     * } To create a custom device selection that is not connected to the main device selection in the user
     * interface, call {@link Track#createCursorDevice(String) cursorTrack.createCursorDevice(String name)}.
     *
     * @param numSends
     *           the number of sends that are simultaneously accessible in nested channels.
     * @return an object representing the currently selected device.
     * @deprecated Use cursorTrack.createCursorDevice().
     * @see Track#createCursorDevice()
     * @see Track#createCursorDevice(String)
     * @since API version 1
     */
    createEditorCursorDevice(numSends: number): CursorDevice;

    /**
     * @deprecated Use {@link #createLauncherCursorClip(int, int)} or
     *             {@link #createArrangerCursorClip(int, int)} instead.
     * @since API version 1
     */
    createCursorClip(gridWidth: number, gridHeight: number): Clip;

    /**
     * Returns a clip object that represents the cursor of the launcher clip selection. The gridWidth and
     * gridHeight parameters specify the grid dimensions used to access the note content of the clip.
     *
     * @param gridWidth
     *           the number of steps spanned by one page of the note content grid.
     * @param gridHeight
     *           the number of keys spanned by one page of the note content grid.
     * @return an object representing the currently selected cursor clip
     * @since API version 1
     */
    createLauncherCursorClip(gridWidth: number, gridHeight: number): Clip;

    /**
     * Returns a clip object that represents the cursor of the arranger clip selection. The gridWidth and
     * gridHeight parameters specify the grid dimensions used to access the note content of the clip.
     *
     * @param gridWidth
     *           the number of steps spanned by one page of the note content grid.
     * @param gridHeight
     *           the number of keys spanned by one page of the note content grid.
     * @return an object representing the currently selected cursor clip
     * @since API version 1
     */
    createArrangerCursorClip(gridWidth: number, gridHeight: number): Clip;

    /**
     * Returns an object that is used to define a bank of custom user controls. These controls are available to
     * the user for free controller assignments and are typically used when bank-wise navigation is
     * inconvenient.
     *
     * @param numControllers
     *           the number of controls that are available for free assignments
     * @return An object that represents a set of custom user controls.
     * @since API version 1
     */
    createUserControls(numControllers: number): UserControlBank;

    /**
     * Schedules the given callback function for execution after the given delay. For timer applications call
     * this method once initially and then from within the callback function.
     *
     * @param callback
     *           the callback function that will be called
     * @param args
     *           that array of arguments that gets passed into the callback function, may be `null`
     * @param delay
     *           the duration after which the callback function will be called in milliseconds
     * @deprecated
     * @since API version 1
     */
    scheduleTask(callback: object, args: object[], delay: number): void;

    /**
     * Schedules the given callback function for execution after the given delay. For timer applications call
     * this method once initially and then from within the callback function.
     *
     * @param callback
     *           the callback function that will be called
     * @param delay
     *           the duration after which the callback function will be called in milliseconds
     * @since API version 2
     */
    scheduleTask(callback: () => void, delay: number): void;

    /**
     * Requests that the driver's flush method gets called.
     *
     * @since API version 2
     */
    requestFlush(): void;

    /**
     * Prints the given string in the control surface console window. The console window can be opened in the
     * view menu of Bitwig Studio.
     *
     * @param s
     *           the string to be printed
     * @since API version 1
     */
    println(s: string): void;

    /**
     * Prints the given string in the control surface console window using a text style that highlights the
     * string as error. The console window can be opened in the view menu of Bitwig Studio.
     *
     * @param s
     *           the error string to be printed
     * @since API version 1
     */
    errorln(s: string): void;

    /**
     * Shows a temporary text overlay on top of the application GUI, that will fade-out after a short interval.
     * If the overlay is already shown, it will get updated with the given text.
     *
     * @param text
     *           the text to be shown
     * @since API version 1
     */
    showPopupNotification(text: string): void;

    /**
     * Opens a TCP (Transmission Control Protocol) host socket for allowing network connections from other
     * hardware and software.
     *
     * @param name
     *           a meaningful name that describes the purpose of this connection.
     * @param defaultPort
     *           the port that should be used for the connection. If the port is already in use, then another
     *           port will be used. Check {@link RemoteSocket#getPort()} on the returned object to be sure.
     * @return the object that represents the socket
     * @since API version 1
     */
    createRemoteConnection(name: string, defaultPort: number): RemoteSocket;

    /**
     * Connects to a remote TCP (Transmission Control Protocol) socket.
     *
     * @param host
     *           the host name or IP address to connect to.
     * @param port
     *           the port to connect to
     * @param callback
     *           the callback function that gets called when the connection gets established. A single
     *           {@link RemoteConnection} parameter is passed into the callback function.
     * @since API version 1
     */
    connectToRemoteHost(
      host: string,
      port: number,
      callback: ConnectionEstablishedCallback
    ): void;

    /**
     * Sends a UDP (User Datagram Protocol) packet with the given data to the specified host.
     *
     * @param host
     *           the destination host name or IP address
     * @param port
     *           the destination port
     * @param data
     *           the data to be send. When creating a numeric byte array in JavaScript, the byte values must be
     *           signed (in the range -128..127).
     * @since API version 1
     */
    sendDatagramPacket(host: string, port: number, data: number): void;

    /**
     * Adds an observer for incoming UDP (User Datagram Protocol) packets on the selected port.
     *
     * @param name
     *           a meaningful name that describes the purpose of this observer.
     * @param port
     *           the port that should be used
     * @param callback
     *           the callback function that gets called when data arrives. The function receives a single
     *           parameter that contains the data byte array.
     *
     * @return {@true} if was possible to bind the port, false otherwise
     * @since API version 1
     */
    addDatagramPacketObserver(
      name: string,
      port: number,
      callback: DataReceivedCallback
    ): boolean;

    /**
     * @deprecated Use {@link #defineController(String, String, String, String, String)} instead.
     * @since API version 1
     */
    defineController(
      vendor: string,
      name: string,
      version: string,
      uuid: string
    ): void;

    /**
     * @deprecated Use {@link #createTransport} instead.
     * @since API version 1
     */
    createTransportSection(): Transport;

    /**
     * @since API version 1
     */
    createCursorTrack(numSends: number, numScenes: number): CursorTrack;

    /**
     * @deprecated Use {@link #createGroove()} instead.
     * @since API version 1
     */
    createGrooveSection(): Groove;

    /**
     * @deprecated Use {@link #createApplication()} instead.
     * @since API version 1
     */
    createApplicationSection(): Application;

    /**
     * @deprecated Use {@link #createArranger(int)} instead.
     * @since API version 1
     */
    createArrangerSection(screenIndex: number): Arranger;

    /**
     * @deprecated Use {@link #createMixer(String, int)} instead.
     * @since API version 1
     */
    createMixerSection(perspective: string, screenIndex: number): Mixer;

    /**
     * @deprecated Use {@link #createTrackBank(int, int, int)} instead.
     * @since API version 1
     */
    createTrackBankSection(
      numTracks: number,
      numSends: number,
      numScenes: number
    ): TrackBank;

    /**
     * @deprecated Use {@link #createMainTrackBank(int, int, int)} instead.
     * @since API version 1
     */
    createMainTrackBankSection(
      numTracks: number,
      numSends: number,
      numScenes: number
    ): TrackBank;

    /**
     * @deprecated Use {@link #createEffectTrackBank(int, int)} instead.
     * @since API version 1
     */
    createEffectTrackBankSection(
      numTracks: number,
      numScenes: number
    ): TrackBank;

    /**
     * @deprecated Use {@link #createArrangerCursorTrack} instead.
     * @since API version 1
     */
    createCursorTrackSection(numSends: number, numScenes: number): CursorTrack;

    /**
     * @deprecated Use {@link #createMasterTrack(int)} instead.
     * @since API version 1
     */
    createMasterTrackSection(numScenes: number): Track;

    /**
     * @deprecated Use {@link #createCursorClip(int, int)} instead.
     * @since API version 1
     */
    createCursorClipSection(gridWidth: number, gridHeight: number): Clip;

    /**
     * @deprecated Use {@link #createEditorCursorDevice createEditorCursorDevice()} instead.
     * @since API version 1
     */
    createCursorDeviceSection(numControllers: number): CursorDevice;

    /**
     * @deprecated Use {@link #createEditorCursorDevice createEditorCursorDevice()} instead.
     * @since API version 1
     */
    createCursorDevice(): CursorDevice;

    /**
     * @deprecated Use {@link #createUserControls(int)} instead.
     * @since API version 1
     */
    createUserControlsSection(numControllers: number): UserControlBank;

    /**
     * @deprecated Use {@link #defineSysexIdentityReply(String)} instead.
     * @since API version 1
     */
    defineSysexDiscovery(request: string, reply: string): void;

    /**
     * Creates a {@link PopupBrowser} that represents the pop-up browser in Bitwig Studio.
     *
     * @since API version 2
     */
    createPopupBrowser(): PopupBrowser;

    /**
     * {@link BeatTimeFormatter} used to format beat times by default. This will be used to format beat times
     * when asking for a beat time in string format without providing any formatting options. For example by
     * calling {@link BeatTimeStringValue#get()}.
     *
     * @since API version 2
     */
    defaultBeatTimeFormatter(): BeatTimeFormatter;

    /**
     * Sets the {@link BeatTimeFormatter} to use by default for formatting beat times.
     *
     * @see #defaultBeatTimeFormatter()
     * @since API version 2
     */
    setDefaultBeatTimeFormatter(formatter: BeatTimeFormatter): void;

    /**
     * Creates a {@link BeatTimeFormatter} that can be used to format beat times.
     *
     * @param separator
     *           the character used to separate the segments of the formatted beat time, typically ":", "." or
     *           "-"
     * @param barsLen
     *           the number of digits reserved for bars
     * @param beatsLen
     *           the number of digits reserved for beats
     * @param subdivisionLen
     *           the number of digits reserved for beat subdivisions
     * @param ticksLen
     *           the number of digits reserved for ticks
     *
     * @since API version 2
     */
    createBeatTimeFormatter(
      separator: string,
      barsLen: number,
      beatsLen: number,
      subdivisionLen: number,
      ticksLen: number
    ): BeatTimeFormatter;

    /**
     * Creates a {@link HardwareSurface} that can contain hardware controls.
     *
     * @since API version 10
     */
    createHardwareSurface(): HardwareSurface;

    /**
     * Creates a {@link HardwareActionMatcher} that is matched by either of the 2 supplied action matchers.
     *
     * @since API version 10
     */
    createOrHardwareActionMatcher(
      matcher1: HardwareActionMatcher,
      matcher2: HardwareActionMatcher
    ): HardwareActionMatcher;

    /**
     * Creates a {@link RelativeHardwareValueMatcher} that is matched by either of the 2 supplied action
     * matchers.
     *
     * @since API version 10
     */
    createOrRelativeHardwareValueMatcher(
      matcher1: RelativeHardwareValueMatcher,
      matcher2: RelativeHardwareValueMatcher
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a {@link AbsoluteHardwareValueMatcher} that is matched by either of the 2 supplied action
     * matchers.
     *
     * @since API version 10
     */
    createOrAbsoluteHardwareValueMatcher(
      matcher1: AbsoluteHardwareValueMatcher,
      matcher2: AbsoluteHardwareValueMatcher
    ): AbsoluteHardwareValueMatcher;

    /**
     * An object that can be used to generate useful MIDI expression strings which can be used in
     * {@link MidiIn#createActionMatcher(String)} and other related methods.
     *
     * @since API version 10
     */
    midiExpressions(): MidiExpressions;

    /**
     * Creates a {@link HardwareActionBindable} that can be bound to some {@link HardwareAction} (such as a
     * button press) and when that action occurs the supplied {@link Runnable} will be run.
     *
     * This is exactly the same as {@link #createAction(Runnable, Supplier)} but does not use parameter
     * overloading so can be used from non type safe languages like JavaScript.
     *
     * @param runnable
     *           The runnable to be run
     * @param descriptionProvider
     *           Provider that can provide a description of what the runnable does (used for showing onscreen
     *           feedback or help to the user).
     *
     * @since API version 18
     */
    createCallbackAction(
      runnable: () => void,
      descriptionProvider: Supplier<string>
    ): HardwareActionBindable;

    /**
     * Creates a {@link HardwareActionBindable} that can be bound to some {@link HardwareAction} (such as a
     * button press) and when that action occurs the supplied {@link Runnable} will be run.
     *
     * @param runnable
     *           The runnable to be run
     * @param descriptionProvider
     *           Provider that can provide a description of what the runnable does (used for showing onscreen
     *           feedback or help to the user).
     *
     * @since API version 10
     */
    createAction(
      runnable: () => void,
      descriptionProvider: Supplier<string>
    ): HardwareActionBindable;

    /**
     * Creates a {@link HardwareActionBindable} that can be bound to some {@link HardwareAction} (such as a
     * button press) and when that action occurs the supplied {@link Runnable} will be run.
     *
     * This is exactly the same as {@link #createAction(DoubleConsumer, Supplier)} but does not use parameter
     * overloading so can be used from non type safe languages like JavaScript.
     *
     * @param actionPressureConsumer
     *           Consumer that will be notified of the pressure of the action
     * @param descriptionProvider
     *           Provider that can provide a description of what the runnable does (used for showing onscreen
     *           feedback or help to the user).
     *
     * @since API version 18
     */
    createPressureCallbackAction(
      actionPressureConsumer: DoubleConsumer,
      descriptionProvider: Supplier<string>
    ): HardwareActionBindable;

    /**
     * Creates a {@link HardwareActionBindable} that can be bound to some {@link HardwareAction} (such as a
     * button press) and when that action occurs the supplied {@link Runnable} will be run
     *
     * @param actionPressureConsumer
     *           Consumer that will be notified of the pressure of the action
     * @param descriptionProvider
     *           Provider that can provide a description of what the runnable does (used for showing onscreen
     *           feedback or help to the user).
     *
     * @since API version 10
     */
    createAction(
      actionPressureConsumer: DoubleConsumer,
      descriptionProvider: Supplier<string>
    ): HardwareActionBindable;

    /**
     * Creates a {@link RelativeHardwarControlBindable} that can be used to step forwards or backwards when a
     * {@link RelativeHardwareControl} is adjusted. A step is defined by the
     * {@link RelativeHardwareControl#setStepSize(double)}.
     *
     * @param stepForwardsAction
     *           The action that should happen when stepping forwards
     * @param stepBackwardsAction
     *           The action that should happen when stepping backwards
     *
     * @since API version 10
     */
    createRelativeHardwareControlStepTarget(
      stepForwardsAction: HardwareActionBindable,
      stepBackwardsAction: HardwareActionBindable
    ): RelativeHardwarControlBindable;

    /**
     * Creates a {@link RelativeHardwarControlBindable} that can be used to adjust some value in an arbitrary
     * way.
     *
     * @param adjustmentConsumer
     *           A consumer that will receive the relative adjustment amount when bound to a
     *           {@link RelativeHardwareControl}.
     *
     * @since API version 10
     */
    createRelativeHardwareControlAdjustmentTarget(
      adjustmentConsumer: DoubleConsumer
    ): RelativeHardwarControlBindable;

    /**
     * Creates a {@link AbsoluteHardwarControlBindable} that can be used to adjust some value in an arbitrary
     * way.
     *
     * @param adjustmentConsumer
     *           A consumer that will receive the absolute adjustment amount when bound to an
     *           {@link AbsoluteHardwareControl}.
     *
     * @since API version 10
     */
    createAbsoluteHardwareControlAdjustmentTarget(
      adjustmentConsumer: DoubleConsumer
    ): AbsoluteHardwarControlBindable;

    /**
     * It will delete multiple object within one undo step.
     *
     * @since API version 10
     */
    deleteObjects(undoName: string, ...objects: DeleteableObject[]): void;

    /**
     * It will delete multiple object within one undo step.
     *
     * @since API version 10
     */
    deleteObjects(...objects: DeleteableObject[]): void;

    /**
     * It will duplicate multiple object within one undo step.
     *
     * @since API version 19
     */
    duplicateObjects(undoName: string, ...objects: DuplicableObject[]): void;

    /**
     * It will duplicate multiple object within one undo step.
     *
     * @since API version 19
     */
    duplicateObjects(...objects: DuplicableObject[]): void;

    /**
     * Creates a {@link DeviceMatcher} that will match any instrument.
     *
     * @since API version 12
     */
    createInstrumentMatcher(): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that will match any audio effect.
     *
     * @since API version 12
     */
    createAudioEffectMatcher(): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that will match any note effect.
     *
     * @since API version 12
     */
    createNoteEffectMatcher(): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that will match any Bitwig native device with the supplied id.
     *
     * @since API version 12
     */
    createBitwigDeviceMatcher(id: UUID): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that will match any VST2 plug-in with the supplied id.
     *
     * @since API version 12
     */
    createVST2DeviceMatcher(id: number): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that will match any VST3 plug-in with the supplied id.
     *
     * @since API version 12
     */
    createVST3DeviceMatcher(id: string): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that will only match devices that are currently active.
     *
     * @since API version 12
     */
    createActiveDeviceMatcher(): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that will only match devices if it is the last device in the chain.
     *
     * @since API version 12
     */
    createFirstDeviceInChainMatcher(): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that will only match devices if it is the last device in the chain.
     *
     * @since API version 12
     */
    createLastDeviceInChainMatcher(): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that matches a device if any of the supplied matchers match the device.
     *
     * @since API version 12
     */
    createOrDeviceMatcher(...deviceMatchers: DeviceMatcher[]): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that matches a device if all of the supplied matchers match the device.
     *
     * @since API version 12
     */
    createAndDeviceMatcher(...deviceMatchers: DeviceMatcher[]): DeviceMatcher;

    /**
     * Creates a {@link DeviceMatcher} that matches a device if the supplied matcher does not match the device.
     *
     * @since API version 12
     */
    createNotDeviceMatcher(deviceMatcher: DeviceMatcher): DeviceMatcher;
  }

  // source: com/bitwig/extension/controller/api/CueMarker.java

  /**
   * This interface defines access to the common attributes and operations of cue markers.
   *
   * @since API version 2
   */
  interface CueMarker extends ObjectProxy, DeleteableObject, DuplicableObject {
    /**
     * Launches playback at the marker position.
     *
     * @param quantized Specified if the cue marker should be launched quantized or immediately
     * @since API version 2
     */
    launch(quantized: boolean): void;

    /**
     * Gets a representation of the marker name.
     *
     * @since API version 15
     */
    name(): SettableStringValue;

    /**
     * Gets a representation of the marker color.
     *
     * @since API version 2
     */
    getColor(): ColorValue;

    /**
     * Gets a representation of the markers beat-time position in quarter-notes.
     *
     * @since API version 10
     */
    position(): SettableBeatTimeValue;

    /**
     * Gets a representation of the marker name.
     *
     * @since API version 2
     * @deprecated Use {@link #name()} instead
     */
    getName(): StringValue;
  }

  // source: com/bitwig/extension/controller/api/CueMarkerBank.java

  /**
   * A cue marker bank provides access to a range of cue markers in Bitwig Studio.
   * Instances are typically configured with a fixed number of markers and represent an excerpt
   * of a larger list of markers. It basically acts like a window moving over the list of markers.
   *
   * @since API version 2
   */
  interface CueMarkerBank extends Bank<CueMarker> {
    /**
     * Scrolls the cue marker bank window so that the marker at the given position becomes visible.
     *
     * @param position
     *           the index of the marker within the underlying full list of markers (not the index within the
     *           bank). The position is typically directly related to the layout of the marker list in Bitwig
     *           Studio, starting with zero in case of the first marker.
     * @since API version 2
     */
    scrollToMarker(position: number): void;
  }

  // source: com/bitwig/extension/controller/api/Cursor.java

  /**
   * A generic interface that provides the foundation for working with selections.
   *
   * Implementations of this interface can either represent custom selection cursors that are created by
   * controller scripts, or represent the cursor of user selections as shown in Bitwig Studio editors, such as
   * the Arranger track selection cursor, the note editor event selection cursor and so on.
   *
   * @since API version 1
   */
  interface Cursor extends RelativeHardwarControlBindable {
    /**
     * Select the previous item.
     *
     * @since API version 1
     */
    selectPrevious(): void;

    selectPreviousAction(): HardwareActionBindable;

    /**
     * Select the next item.
     *
     * @since API version 1
     */
    selectNext(): void;

    selectNextAction(): HardwareActionBindable;

    /**
     * Select the first item.
     *
     * @since API version 1
     */
    selectFirst(): void;

    /**
     * Select the last item.
     *
     * @since API version 1
     */
    selectLast(): void;

    /**
     * Boolean value that reports whether there is an item after the current cursor position.
     *
     * @since API version 2
     */
    hasNext(): BooleanValue;

    /**
     * Boolean value that reports whether there is an item before the current cursor position.
     *
     * @since API version 2
     */
    hasPrevious(): BooleanValue;

    /**
     * Registers a function with bool argument that gets called when the previous item gains or remains
     * selectable.
     *
     * @since API version 1
     * @deprecated Use {@link #hasPrevious()} instead.
     */
    addCanSelectPreviousObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers a function with bool argument that gets called when the next item gains or remains
     * selectable.
     *
     * @since API version 1
     * @deprecated Use {@link #hasNext()} instead.
     */
    addCanSelectNextObserver(callback: BooleanValueChangedCallback): void;
  }

  // source: com/bitwig/extension/controller/api/CursorBrowserFilterColumn.java

  /**
   * Instances of this interface are used to navigate the filter columns of a Bitwig Studio browsing session.
   *
   * @since API version 1
   */
  interface CursorBrowserFilterColumn extends BrowserFilterColumn, Cursor {}

  // source: com/bitwig/extension/controller/api/CursorBrowserFilterItem.java

  /**
   * Instances of this interface represent entries in a browser filter column.
   *
   * @since API version 1
   */
  interface CursorBrowserFilterItem
    extends BrowserFilterItem,
      CursorBrowserItem {
    /**
     * Select the parent item.
     *
     * @since API version 1
     */
    selectParent(): void;

    /**
     * Select the first child item.
     *
     * @since API version 1
     */
    selectFirstChild(): void;

    /**
     * Select the last child item.
     *
     * @since API version 1
     */
    selectLastChild(): void;

    /**
     * Select the previous item.
     *
     * @since API version 1
     */
    moveToPrevious(): void;

    /**
     * Select the next item.
     *
     * @since API version 1
     */
    moveToNext(): void;

    /**
     * Select the first item.
     *
     * @since API version 1
     */
    moveToFirst(): void;

    /**
     * Select the last item.
     *
     * @since API version 1
     */
    moveToLast(): void;

    /**
     * Select the parent item.
     *
     * @since API version 1
     */
    moveToParent(): void;

    /**
     * Move the cursor to the first child item.
     *
     * @since API version 1
     */
    moveToFirstChild(): void;

    /**
     * Move the cursor to the last child item.
     *
     * @since API version 1
     */
    moveToLastChild(): void;
  }

  // source: com/bitwig/extension/controller/api/CursorBrowserItem.java

  /**
   * Instances of this interface represent entries in a browser filter column.
   *
   * @since API version 1
   */
  interface CursorBrowserItem extends BrowserItem, Cursor {
    /**
     * Returns a bank object that provides access to the siblings of the cursor item. The bank will
     * automatically scroll so that the cursor item is always visible.
     *
     * @param numSiblings
     *           the number of simultaneously accessible siblings
     * @return the requested item bank object
     */
    createSiblingsBank(numSiblings: number): BrowserItemBank;
  }

  // source: com/bitwig/extension/controller/api/CursorBrowserResultItem.java

  /**
   * Instances of this interface represent entries in a browser column.
   *
   * @since API version 1
   */
  interface CursorBrowserResultItem
    extends BrowserResultsItem,
      CursorBrowserItem {}

  // source: com/bitwig/extension/controller/api/CursorBrowsingSession.java

  /**
   * Instances of this interface are used for navigating the various browsing sessions of Bitwig Studio's
   * contextual browser.
   *
   * @since API version 1
   */
  interface CursorBrowsingSession extends GenericBrowsingSession, Cursor {}

  // source: com/bitwig/extension/controller/api/CursorChannel.java

  /**
   * A special kind of channel that follows a channel selection cursor in Bitwig Studio. The selection can
   * either be a custom selection cursor that gets created by the controller script, or represent the user
   * selection cursor as shown in the Bitwig Studio editors, such as the Arranger track selection cursor.
   *
   * @since API version 1
   */
  interface CursorChannel extends Cursor, Channel {
    /**
     * Points the cursor to the given channel.
     *
     * @param channel
     *           the channel that this channel cursor should point to
     * @since API version 1
     */
    selectChannel(channel: Channel): void;
  }

  // source: com/bitwig/extension/controller/api/CursorClip.java

  /**
   * Represents a cursor clip.
   *
   * @since API version 10
   */
  interface CursorClip extends Clip, Cursor {
    /**
     * Requests that the supplied clip be selected in this cursor.
     * @since API version 10
     */
    selectClip(clip: Clip): void;
  }

  // source: com/bitwig/extension/controller/api/CursorDevice.java

  /**
   * A special kind of selection cursor used for devices.
   *
   * @since API version 1
   */
  interface CursorDevice extends Cursor, Device {
    /**
     * Returns the channel that this cursor device was created on. Currently this will always be a track or
     * cursor track instance.
     *
     * @return the track or cursor track object that was used for creation of this cursor device.
     * @since API version 1
     * @deprecated Use {@link #channel()} instead.
     */
    getChannel(): Channel;

    /**
     * Returns the channel that this cursor device was created on. Currently this will always be a track or
     * cursor track instance.
     *
     * @return the track or cursor track object that was used for creation of this cursor device.
     * @since API version 5
     */
    channel(): Channel;

    /**
     * Selects the parent device if there is any.
     *
     * @since API version 1
     */
    selectParent(): void;

    /**
     * Moves this cursor to the given device.
     *
     * @param device
     *           the device that this cursor should point to
     * @since API version 1
     */
    selectDevice(device: Device): void;

    /**
     * Selects the first device in the given channel.
     *
     * @param channel
     *           the channel in which the device should be selected
     * @since API version 1
     */
    selectFirstInChannel(channel: Channel): void;

    /**
     * Selects the last device in the given channel.
     *
     * @param channel
     *           the channel in which the device should be selected
     * @since API version 1
     */
    selectLastInChannel(channel: Channel): void;

    /**
     * Selects the first device in the nested FX slot with the given name.
     *
     * @param chain
     *           the name of the FX slot in which the device should be selected
     * @since API version 1
     */
    selectFirstInSlot(chain: string): void;

    /**
     * Selects the last device in the nested FX slot with the given name.
     *
     * @param chain
     *           the name of the FX slot in which the device should be selected
     * @since API version 1
     */
    selectLastInSlot(chain: string): void;

    /**
     * Selects the first device in the drum pad associated with the given key.
     *
     * @param key
     *           the key associated with the drum pad in which the device should be selected
     * @since API version 1
     */
    selectFirstInKeyPad(key: number): void;

    /**
     * Selects the last device in the drum pad associated with the given key.
     *
     * @param key
     *           the key associated with the drum pad in which the device should be selected
     * @since API version 1
     */
    selectLastInKeyPad(key: number): void;

    /**
     * Selects the first device in the nested layer with the given index.
     *
     * @param index
     *           the index of the nested layer in which the device should be selected
     * @since API version 1
     */
    selectFirstInLayer(index: number): void;

    /**
     * Selects the last device in the nested layer with the given index.
     *
     * @param index
     *           the index of the nested layer in which the device should be selected
     * @since API version 1
     */
    selectLastInLayer(index: number): void;

    /**
     * Selects the first device in the nested layer with the given name.
     *
     * @param name
     *           the name of the nested layer in which the device should be selected
     * @since API version 1
     */
    selectFirstInLayer(name: string): void;

    /**
     * Selects the last device in the nested layer with the given name.
     *
     * @param name
     *           the name of the nested layer in which the device should be selected
     * @since API version 1
     */
    selectLastInLayer(name: string): void;
  }

  // source: com/bitwig/extension/controller/api/CursorDeviceFollowMode.java

  enum CursorDeviceFollowMode {
    FOLLOW_SELECTION = 0,
    FIRST_DEVICE = 1,
    FIRST_INSTRUMENT = 2,
    FIRST_AUDIO_EFFECT = 3,
    FIRST_INSTRUMENT_OR_DEVICE = 4,
    LAST_DEVICE = 5,
  }

  // source: com/bitwig/extension/controller/api/CursorDeviceLayer.java

  /**
   * Instances of this interface represent the cursor item in device layer selections.
   *
   * @since API version 1
   */
  interface CursorDeviceLayer extends CursorChannel, DeviceLayer {}

  // source: com/bitwig/extension/controller/api/CursorDeviceSlot.java

  /**
   * Instances of this interface represent the selected device slot as shown in the Bitwig Studio user
   * interface.
   *
   * @since API version 1
   */
  interface CursorDeviceSlot extends DeviceChain {
    selectSlot(slot: string): void;
  }

  // source: com/bitwig/extension/controller/api/CursorNavigationMode.java

  enum CursorNavigationMode {
    NESTED = 0,
    FLAT = 1,
    GUI = 2,
  }

  // source: com/bitwig/extension/controller/api/CursorRemoteControlsPage.java

  /**
   * Represents a cursor that looks at a {@link RemoteControlsPage}.
   *
   * @since API version 2
   */
  interface CursorRemoteControlsPage extends Cursor, RemoteControlsPage {
    /**
     * Value that reports the names of the devices parameter pages.
     */
    pageNames(): StringArrayValue;

    /**
     * Selects the next page.
     *
     * @param shouldCycle
     *           If true then when the end is reached and there is no next page it selects the first page
     *
     * @since API version 2
     */
    selectNextPage(shouldCycle: boolean): void;

    /**
     * Selects the previous page.
     *
     * @param shouldCycle
     *           If true then when the end is reached and there is no next page it selects the first page
     *
     * @since API version 2
     */
    selectPreviousPage(shouldCycle: boolean): void;

    /**
     * Selects the next page that matches the given expression.
     *
     * @param expression
     *           An expression that can match a page based on how it has been tagged. For now this can only be
     *           the name of a single tag that you would like to match.
     *
     * @param shouldCycle
     *           If true then when the end is reached and there is no next page it selects the first page
     *
     * @since API version 2
     */
    selectNextPageMatching(expression: string, shouldCycle: boolean): void;

    /**
     * Selects the previous page that matches the given expression.
     *
     * @param expression
     *           An expression that can match a page based on how it has been tagged. For now this can only be
     *           the name of a single tag that you would like to match.
     *
     * @param shouldCycle
     *           If true then when the end is reached and there is no next page it selects the first page
     *
     * @since API version 2
     */
    selectPreviousPageMatching(expression: string, shouldCycle: boolean): void;

    /**
     * Value that reports the currently selected parameter page index.
     *
     * @since API version 2
     */
    selectedPageIndex(): SettableIntegerValue;

    /**
     * Value that represents the number of pages.
     *
     * @since API version 7
     */
    pageCount(): IntegerValue;

    /**
     * Creates a new preset page.
     *
     * @since API version 16
     */
    createPresetPage(): void;

    /**
     * @see #createPresetPage()
     */
    createPresetPageAction(): HardwareActionBindable;
  }

  // source: com/bitwig/extension/controller/api/CursorTrack.java

  /**
   * Instances of this interface represent the cursor item of track selections.
   *
   * @since API version 1
   */
  interface CursorTrack extends CursorChannel, Track, PinnableCursor {
    /**
     * Makes the cursor track point to it's parent group track, in case it is not already pointing to the root
     * group track.
     *
     * @since API version 1
     */
    selectParent(): void;

    /**
     * Makes the cursor track point to the first child found with the track group that this cursor currently
     * points to. If this cursor is not pointing to a track group or the track group is empty then this has no
     * effect.
     *
     * @since API version 2
     */
    selectFirstChild(): void;

    /**
     * Specifies the behaviour of the functions {@link #selectPrevious()}, {@link #selectNext()},
     * {@link #selectFirst()} and {@link #selectLast()}. Calling those functions can either navigate the cursor
     * within the current nesting level, or over a flat list of either all tracks or only the expanded tracks.
     * Default is CursorNavigationMode.FLAT.
     *
     * @since API version 1
     */
    setCursorNavigationMode(mode: CursorNavigationMode): void;

    createCursorDevice(): PinnableCursorDevice;

    /**
     * @param name
     *           the name of the custom device selection cursor, for example "Primary", or `null` to refer to
     *           the device selection cursor in the arranger cursor track as shown in the Bitwig Studio user
     *           interface.
     * @deprecated Use {{@link #createCursorDevice(String, String, int, CursorDeviceFollowMode)}} instead.
     */
    createCursorDevice(name: string): PinnableCursorDevice;

    /**
     * @param name
     *           the name of the custom device selection cursor, for example "Primary", or `null` to refer to
     *           the device selection cursor in the arranger cursor track as shown in the Bitwig Studio user
     *           interface.
     * @param numSends
     *           the number of sends that are simultaneously accessible in nested channels.
     * @deprecated Use {{@link #createCursorDevice(String, String, int, CursorDeviceFollowMode)}} instead.
     */
    createCursorDevice(name: string, numSends: number): PinnableCursorDevice;

    /**
     * Creates a {@link CursorDevice} for this cursor track that by default follows a device based on the
     * supplied follow mode.
     *
     * @param id
     *           An id that is used to identify this cursor.
     * @param name
     *           A name that is displayed to the user for this cursor.
     * @param numSends
     *           the number of sends that are simultaneously accessible in nested channels.
     * @param followMode
     *           Mode that defines how this cursor should follow devices.
     *
     * @since API version 2
     */
    createCursorDevice(
      id: string,
      name: string,
      numSends: number,
      followMode: CursorDeviceFollowMode
    ): PinnableCursorDevice;

    /**
     * Creates a {@link PinnableCursorClip} for this track that follows a clip within the track on the clip
     * launcher. This clip typically gets updated when the user selects a new clip on the clip launcher. It can
     * also act independently from the user's selection if the user so chooses in the settings for the
     * controller.
     *
     * @since API version 10
     */
    createLauncherCursorClip(
      gridWidth: number,
      gridHeight: number
    ): PinnableCursorClip;

    /**
     * Creates a {@link PinnableCursorClip} for this track that follows a clip within the track on the clip
     * launcher. This clip typically gets updated when the user selects a new clip on the clip launcher. It can
     * also act independently from the user's selection if the user so chooses in the settings for the
     * controller.
     *
     * @since API version 10
     */
    createLauncherCursorClip(
      id: string,
      name: string,
      gridWidth: number,
      gridHeight: number
    ): PinnableCursorClip;
  }

  // source: com/bitwig/extension/controller/api/DeleteableObject.java

  /**
   * Interface implemented by objects that can be deleted from the project.
   *
   * @since API version 10
   */
  interface DeleteableObject {
    /**
     * Deletes this object from the document.
     *
     * If you want to delete multiple objects at once, see Host.deleteObjects().
     *
     * @since API version 10
     */
    deleteObject(): void;

    /**
     * Deletes this object from the document.
     *
     * @since API version 15
     */
    deleteObjectAction(): HardwareActionBindable;
  }

  // source: com/bitwig/extension/controller/api/DetailEditor.java

  /**
   * An interface representing various commands which can be performed on the Bitwig Studio detail editor.<br/>
   *
   * To receive an instance of the application interface call {@link ControllerHost#createDetailEditor}.
   *
   * @since API version 14
   */
  interface DetailEditor extends TimelineEditor {
    /**
     * Zooms in all detail editor lanes, if it the detail editor is visible.
     *
     * @since API version 14
     */
    zoomInLaneHeightsAction(): HardwareActionBindable;

    zoomInLaneHeights(): void;

    /**
     * Zooms out all detail editor lanes, if it the detail editor is visible.
     *
     * @since API version 14
     */
    zoomOutLaneHeightsAction(): HardwareActionBindable;

    zoomOutLaneHeights(): void;

    /**
     * Same as zoomInLaneHeightsAction/zoomOutLaneHeightsAction, but as a stepper
     *
     * @since API version 14
     */
    zoomLaneHeightsStepper(): RelativeHardwarControlBindable;
  }

  // source: com/bitwig/extension/controller/api/Device.java

  import DirectParameterDisplayedValueChangedCallback = com.bitwig.extension.callback.DirectParameterDisplayedValueChangedCallback;
  import DirectParameterNameChangedCallback = com.bitwig.extension.callback.DirectParameterNameChangedCallback;
  import DirectParameterNormalizedValueChangedCallback = com.bitwig.extension.callback.DirectParameterNormalizedValueChangedCallback;
  import StringArrayValueChangedCallback = com.bitwig.extension.callback.StringArrayValueChangedCallback;

  /**
   * This interface represents a device in Bitwig Studio, both internal devices and plugins.
   *
   * @since API version 1
   */
  interface Device extends ObjectProxy, DeleteableObject, DuplicableObject {
    /**
     * Returns a representation of the device chain that contains this device. Possible device chain instances
     * are tracks, device layers, drums pads, or FX slots.
     *
     * @return the requested device chain object
     * @since API version 1
     * @deprecated Use {@link #deviceChain()} instead.
     */
    getDeviceChain(): DeviceChain;

    /**
     * Returns a representation of the device chain that contains this device. Possible device chain instances
     * are tracks, device layers, drums pads, or FX slots.
     *
     * @return the requested device chain object
     * @since API version 5
     */
    deviceChain(): DeviceChain;

    /**
     * Value that reports the position of the device within the parent device chain.
     *
     * @since API version 2
     */
    position(): IntegerValue;

    /**
     * Registers an observer that reports the position of the device within the parent device chain.
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #position()} instead.
     */
    addPositionObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Returns an object that provides access to the open state of plugin windows.
     *
     * @return a boolean value object that represents the open state of the editor window, in case the device
     *         features a custom editor window (such as plugins).
     * @since API version 1
     */
    isWindowOpen(): SettableBooleanValue;

    /**
     * Returns an object that provides access to the expanded state of the device.
     *
     * @return a boolean value object that represents the expanded state of the device.
     * @since API version 1
     */
    isExpanded(): SettableBooleanValue;

    /**
     * Returns an object that provides access to the visibility of the device macros section.
     *
     * @return a boolean value object that represents the macro section visibility.
     *
     * @deprecated Use {@link #isRemoteControlsSectionVisible()} instead
     * @since API version 1
     */
    isMacroSectionVisible(): SettableBooleanValue;

    /**
     * Returns an object that provides access to the visibility of the device remote controls section.
     *
     * @return a boolean value object that represents the remote controls section visibility.
     *
     * @since API version 2
     */
    isRemoteControlsSectionVisible(): SettableBooleanValue;

    /**
     * Returns an object that provides access to the visibility of the parameter page mapping editor.
     *
     * @return a boolean value object that represents visibility of the parameter page mapping editor.
     *
     * @deprecated Use {@link #isRemoteControlsSectionVisible()} instead
     * @since API version 1
     */
    isParameterPageSectionVisible(): SettableBooleanValue;

    /**
     * Returns the parameter with the given index in the current parameter page.
     *
     * @param indexInPage
     *           the index of the parameter within the current parameter page.
     * @return an object that provides access to the requested parameter
     * @deprecated Use getRemoteControls().getRemoteControlInSlot(indexInPage)
     * @since API version 1
     */
    getParameter(indexInPage: number): Parameter;

    /**
     * Creates a cursor for the selected remote controls page in the device with the supplied number of
     * parameters. This section will follow the current page selection made by the user in the application.
     *
     * @param parameterCount
     *           The number of parameters the remote controls should contain
     *
     * @since API version 2
     */
    createCursorRemoteControlsPage(
      parameterCount: number
    ): CursorRemoteControlsPage;

    /**
     * Creates a cursor for a remote controls page in the device with the supplied number of parameters. This
     * section will be independent from the current page selected by the user in Bitwig Studio's user
     * interface. The supplied filter is an expression that can be used to match pages this section is
     * interested in. The expression is matched by looking at the tags added to the pages. If the expression is
     * empty then no filtering will occur.
     *
     * @param name
     *           A name to associate with this section. This will be used to remember manual mappings made by
     *           the user within this section.
     *
     *
     * @param parameterCount
     *           The number of parameters the remote controls should contain
     *
     * @param filterExpression
     *           An expression used to match pages that the user can navigate through. For now this can only be
     *           the name of a single tag the pages should contain (e.g "drawbars", "dyn", "env", "eq",
     *           "filter", "fx", "lfo", "mixer", "osc", "overview", "perf").
     *
     * @since API version 2
     */
    createCursorRemoteControlsPage(
      name: string,
      parameterCount: number,
      filterExpression: string
    ): CursorRemoteControlsPage;

    /**
     * Returns the parameter with the given index in the envelope parameter page.
     *
     * @param index
     *           the index of the parameter within the envelope parameter page.
     * @return an object that provides access to the requested parameter
     * @since API version 1
     * @deprecated The remote controls deprecate this feature. Instead create remote controls with
     *             {@link #createIndependentRemoteControls(String, int, String)}.
     */
    getEnvelopeParameter(index: number): Parameter;

    /**
     * Returns the parameter with the given index in the common parameter page.
     *
     * @param index
     *           the index of the parameter within the common parameter page.
     * @return an object that provides access to the requested parameter
     * @since API version 1
     * @deprecated The remote controls deprecate this feature. Instead create remote controls with
     *             {@link #createIndependentRemoteControls(String, int, String)}.
     */
    getCommonParameter(index: number): Parameter;

    /**
     * Returns the modulation source at the given index.
     *
     * @param index
     *           the index of the modulation source
     * @return An object that represents the requested modulation source
     * @since API version 1
     * @deprecated The remote controls deprecate this feature. Instead create remote controls with
     *             {@link #createIndependentRemoteControls(String, int, String)}.
     */
    getModulationSource(index: number): ModulationSource;

    /**
     * Returns the macro control at the given index.
     *
     * @param index
     *           the index of the macro control, must be in the range [0..7]
     * @return An object that represents the requested macro control
     * @since API version 1
     * @deprecated Devices no longer have a built in fixed macro section. Instead the user can define pages of
     *             mappings and these should be used instead.
     */
    getMacro(index: number): Macro;

    /**
     * Registers an observer that reports if the device is selected.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @since API version 1
     * @deprecated Use {@link #exists()} instead.
     */
    addHasSelectedDeviceObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Selects the device in Bitwig Studio.
     *
     * @since API version 1
     */
    selectInEditor(): void;

    /**
     * Value that reports if the device is a plugin.
     *
     * @since API version 2
     */
    isPlugin(): BooleanValue;

    /**
     * Registers an observer that reports if the device is a plugin.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @since API version 1
     * @deprecated Use {@link #isPlugin()} instead
     */
    addIsPluginObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Switches to the previous parameter page.
     *
     * @since API version 1
     */
    previousParameterPage(): void;

    /**
     * Switches to the next parameter page.
     *
     * @since API version 1
     */
    nextParameterPage(): void;

    /**
     * Registers an observer that reports if there is a previous parameter page.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     */
    addPreviousParameterPageEnabledObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Registers an observer that reports if there is a next parameter page.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     */
    addNextParameterPageEnabledObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Switches to the parameter page at the given page index.
     *
     * @param page
     *           the index of the desired parameter page
     * @since API version 1
     */
    setParameterPage(page: number): void;

    /**
     * Loads the previous preset.
     *
     * @since API version 1
     * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
     */
    switchToPreviousPreset(): void;

    /**
     * Loads the next preset.
     *
     * @since API version 1
     * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
     */
    switchToNextPreset(): void;

    /**
     * Switches to the previous preset category.
     *
     * @since API version 1
     * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
     */
    switchToPreviousPresetCategory(): void;

    /**
     * Switches to the next preset category.
     *
     * @since API version 1
     * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
     */
    switchToNextPresetCategory(): void;

    /**
     * Switches to the previous preset creator.
     *
     * @since API version 1
     * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
     */
    switchToPreviousPresetCreator(): void;

    /**
     * Switches to the next preset creator.
     *
     * @since API version 1
     * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
     */
    switchToNextPresetCreator(): void;

    /**
     * Returns an object used for browsing devices, presets and other content. Committing the browsing session
     * will load or create a device from the selected resource and replace the current device.
     *
     * @param numFilterColumnEntries
     *           the size of the window used to navigate the filter column entries.
     * @param numResultsColumnEntries
     *           the size of the window used to navigate the results column entries.
     * @return the requested device browser object.
     * @since API version 1
     * @deprecated Use {@link ControllerHost#createPopupBrowser()} instead
     */
    createDeviceBrowser(
      numFilterColumnEntries: number,
      numResultsColumnEntries: number
    ): Browser;

    /**
     * Value that reports the name of the device.
     *
     * @since API version 2
     */
    name(): StringValue;

    /**
     * Registers an observer that reports the name of the device.
     *
     * @param len
     *           the maximum length of the name. Longer names will get truncated.
     * @param textWhenUnassigned
     *           the default name that gets reported when the device is not associated with a Bitwig Studio
     *           device yet.
     * @param callback
     *           a callback function that receives a single name (string) parameter
     * @since API version 1
     * @deprecated Use {@link #name()} instead
     */
    addNameObserver(
      len: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Value that reports the last loaded preset name.
     *
     * @since API version 2
     */
    presetName(): StringValue;

    /**
     * Registers an observer that reports the last loaded preset name.
     *
     * @param len
     *           the maximum length of the name. Longer names will get truncated.
     * @param textWhenUnassigned
     *           the default name that gets reported when the device is not associated with a Bitwig Studio
     *           device yet.
     * @param callback
     *           a callback function that receives a single name (string) parameter
     * @since API version 1
     * @deprecated Use {@link #presetName()}.addValueObserver(callback) instead.
     */
    addPresetNameObserver(
      len: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Value that reports the current preset category name.
     *
     * @since API version 2
     */
    presetCategory(): StringValue;

    /**
     * Registers an observer that reports the current preset category name.
     *
     * @param len
     *           the maximum length of the name. Longer names will get truncated.
     * @param textWhenUnassigned
     *           the default name that gets reported when the device is not associated with a Bitwig Studio
     *           device yet.
     * @param callback
     *           a callback function that receives a single name (string) parameter
     * @since API version 1
     * @deprecated use {@link #presetCategory()} instead.
     */
    addPresetCategoryObserver(
      len: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Value that reports the current preset creator name.
     *
     * @since API version 2
     */
    presetCreator(): StringValue;

    /**
     * Registers an observer that reports the current preset creator name.
     *
     * @param len
     *           the maximum length of the name. Longer names will get truncated.
     * @param textWhenUnassigned
     *           the default name that gets reported when the device is not associated with a Bitwig Studio
     *           device yet.
     * @param callback
     *           a callback function that receives a single name (string) parameter
     * @since API version 1
     * @deprecated Use {@link #presetCreator()} instead.
     */
    addPresetCreatorObserver(
      len: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Registers an observer that reports the currently selected parameter page.
     *
     * @param valueWhenUnassigned
     *           the default page index that gets reported when the device is not associated with a device
     *           instance in Bitwig Studio yet.
     * @param callback
     *           a callback function that receives a single page index parameter (integer)
     * @since API version 1
     * @deprecated Use {@link #createCursorRemoteControlsPage(int)} instead.
     */
    addSelectedPageObserver(
      valueWhenUnassigned: number,
      callback: IntegerValueChangedCallback
    ): void;

    /**
     * Registers an observer that reports the name of the active modulation source.
     *
     * @param len
     *           the maximum length of the name. Longer names will get truncated.
     * @param textWhenUnassigned
     *           the default name that gets reported when the device is not associated with a Bitwig Studio
     *           device yet.
     * @param callback
     *           a callback function that receives a single name parameter (string)
     * @since API version 1
     * @deprecated Use {@link #createCursorRemoteControlsPage(int)} instead.
     */
    addActiveModulationSourceObserver(
      len: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Registers an observer that reports the names of the devices parameter pages.
     *
     * @param callback
     *           a callback function that receives a single string array parameter containing the names of the
     *           parameter pages
     * @since API version 1
     * @deprecated Use {@link #createCursorRemoteControlsPage(int)} instead.
     */
    addPageNamesObserver(callback: StringArrayValueChangedCallback): void;

    /**
     * Registers an observer that reports the names of the available presets for the device according to the
     * current configuration of preset category and creator filtering.
     *
     * @param callback
     *           a callback function that receives a single string array parameter containing the names of the
     *           presets for the current category and creator filter.
     * @see #addPresetCategoryObserver
     * @see #addPresetCreatorObserver
     * @see #setPresetCategory
     * @see #setPresetCreator
     * @since API version 1
     * @deprecated Use the new browser API instead.
     */
    addPresetNamesObserver(callback: StringArrayValueChangedCallback): void;

    /**
     * Loads the preset with the index from the list provided by {@link #addPresetNamesObserver}.
     *
     * @since API version 1
     * @deprecated Use the new browser API instead.
     */
    loadPreset(index: number): void;

    /**
     * Registers an observer that reports the names of the available preset categories for the device.
     *
     * @param callback
     *           a callback function that receives a single string array parameter containing the names of the
     *           preset categories
     * @since API version 1
     * @deprecated Use the new browser API instead.
     */
    addPresetCategoriesObserver(
      callback: StringArrayValueChangedCallback
    ): void;

    /**
     * Sets the preset category filter with the index from the array provided by
     * {@link #addPresetCategoriesObserver}.
     *
     * @since API version 1
     * @deprecated Use the new browser API instead.
     */
    setPresetCategory(index: number): void;

    /**
     * Registers an observer that reports the names of the available preset creators for the device.
     *
     * @param callback
     *           a callback function that receives a single string array parameter containing the names of the
     *           preset creators
     * @since API version 1
     * @deprecated Use the new browser API instead.
     */
    addPresetCreatorsObserver(callback: StringArrayValueChangedCallback): void;

    /**
     * Sets the preset creator filter with the index from the list provided by
     * {@link #addPresetCreatorsObserver}.
     *
     * @since API version 1
     * @deprecated Use the new browser API instead.
     */
    setPresetCreator(index: number): void;

    /**
     * Toggles the enabled state of the device.
     *
     * @since API version 1
     * @deprecated Use isEnabled().toggle() instead.
     */
    toggleEnabledState(): void;

    /**
     * Value that reports if the device is enabled.
     *
     * @since API version 2
     */
    isEnabled(): SettableBooleanValue;

    /**
     * Registers an observer that reports if the device is enabled.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #isEnabled()} instead.
     */
    addIsEnabledObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Indicates if the device has nested device chain slots. Use {@link #slotNames()} to get a list of
     * available slot names, and navigate to devices in those slots using the {@link CursorDevice} interface.
     *
     * @return a value object that indicates if the device has nested device chains in FX slots.
     * @since API version 1
     */
    hasSlots(): BooleanValue;

    /**
     * Value of the list of available FX slots in this device.
     *
     * @since API version 2
     */
    slotNames(): StringArrayValue;

    /**
     * Registers an observer that gets notified when the list of available FX slots changes.
     *
     * @param callback
     *           a callback function which takes a single string array argument that contains the names of the
     *           slots.
     * @since API version 1
     * @deprecated Use {@link #slotNames()} instead.
     */
    addSlotsObserver(callback: StringArrayValueChangedCallback): void;

    /**
     * Returns an object that represents the selected device slot as shown in the user interface, and that
     * provides access to the contents of slot's device chain.
     *
     * @return the requested slot cursor object
     * @since API version 1
     */
    getCursorSlot(): DeviceSlot;

    /**
     * Indicates if the device is contained by another device.
     *
     * @return a value object that indicates if the device is nested
     * @since API version 1
     */
    isNested(): BooleanValue;

    /**
     * Indicates if the device supports nested layers.
     *
     * @return a value object that indicates if the device supports nested layers.
     * @since API version 1
     */
    hasLayers(): BooleanValue;

    /**
     * Indicates if the device has individual device chains for each note value.
     *
     * @return a value object that indicates if the device has individual device chains for each note value.
     * @since API version 1
     */
    hasDrumPads(): BooleanValue;

    /**
     * Create a bank for navigating the nested layers of the device using a fixed-size window.
     *
     * This bank will work over the following devices:
     *  - Instrument Layer
     *  - Effect Layer
     *  - Instrument Selector
     *  - Effect Selector
     *
     * @param numChannels
     *           the number of channels that the device layer bank should be configured with
     * @return a device layer bank object configured with the desired number of channels
     * @since API version 1
     */
    createLayerBank(numChannels: number): DeviceLayerBank;

    /**
     * Create a bank for navigating the nested layers of the device using a fixed-size window.
     *
     * @param numPads
     *           the number of channels that the drum pad bank should be configured with
     * @return a drum pad bank object configured with the desired number of pads
     * @since API version 1
     */
    createDrumPadBank(numPads: number): DrumPadBank;

    /**
     * Returns a device layer instance that can be used to navigate the layers or drum pads of the device, in
     * case it has any
     *
     * This is the selected layer from the user interface.
     *
     * @return a cursor device layer instance
     * @since API version 1
     */
    createCursorLayer(): CursorDeviceLayer;

    /**
     * Creates a ChainSelector object which will give you control over the current device if it is an
     * Instrument Selector or an Effect Selector.
     *
     * To check if the device is currently a ChainSelector, use {@link ChainSelector.exists()}.
     *
     * If you want to have access to all the chains, use {@link #createLayerBank(int)}.
     *
     * @return a chain selector instance
     * @since API version 6
     */
    createChainSelector(): ChainSelector;

    /**
     * Creates an interface for accessing the features of a specific Bitwig device.
     *
     * @since API version 12
     * */
    createSpecificBitwigDevice(deviceId: UUID): SpecificBitwigDevice;

    /**
     * Creates an interface for accessing the features of a specific VST2 device.
     *
     * @since API version 12
     * */
    createSpecificVst2Device(deviceId: number): SpecificPluginDevice;

    /**
     * Creates an interface for accessing the features of a specific VST2 device.
     *
     * @since API version 12
     * */
    createSpecificVst2Device(...deviceIds: number[]): SpecificPluginDevice;

    /**
     * Creates an interface for accessing the features of a specific VST2 device.
     *
     * @since API version 12
     * */
    createSpecificVst3Device(deviceId: string): SpecificPluginDevice;

    /**
     * Creates an interface for accessing the features of a specific VST2 device.
     *
     * @since API version 12
     * */
    createSpecificVst3Device(...deviceIds: string[]): SpecificPluginDevice;

    /**
     * Adds an observer on a list of all parameters for the device.
     *
     * The callback always updates with an array containing all the IDs for the device.
     *
     * @param callback
     *           function with the signature (String[])
     * @since API version 1
     */
    addDirectParameterIdObserver(
      callback: StringArrayValueChangedCallback
    ): void;

    /**
     * Adds an observer for the parameter names (initial and changes) of all parameters for the device.
     *
     * @param maxChars
     *           maximum length of the string sent to the observer.
     * @param callback
     *           function with the signature (String ID, String name)
     * @since API version 1
     */
    addDirectParameterNameObserver(
      maxChars: number,
      callback: DirectParameterNameChangedCallback
    ): void;

    /**
     * Returns an observer that reports changes of parameter display values, i.e. parameter values formatted as
     * a string to be read by the user, for example "-6.02 dB". The returned observer object can be used to
     * configure which parameters should be observed. By default no parameters are observed. It should be
     * avoided to observe all parameters at the same time for performance reasons.
     *
     * @return an observer object that can be used to enable or disable actual observing for certain
     *         parameters.
     * @param maxChars
     *           maximum length of the string sent to the observer.
     * @param callback
     *           function with the signature (String ID, String valueDisplay)
     * @since API version 1
     */
    addDirectParameterValueDisplayObserver(
      maxChars: number,
      callback: DirectParameterDisplayedValueChangedCallback
    ): DirectParameterValueDisplayObserver;

    /**
     * Adds an observer for the parameter display value (initial and changes) of all parameters for the device.
     *
     * @param callback
     *           a callback function with the signature (String ID, float normalizedValue). If the value is not
     *           accessible 'Number.NaN' (not-a-number) is reported, can be checked with 'isNaN(value)'.
     * @since API version 1
     */
    addDirectParameterNormalizedValueObserver(
      callback: DirectParameterNormalizedValueChangedCallback
    ): void;

    /**
     * Sets the parameter with the specified `id` to the given `value` according to the given `resolution`.
     *
     * @param id
     *           the parameter identifier string
     * @param value
     *           the new value normalized to the range [0..resolution-1]
     * @param resolution
     *           the resolution of the new value
     * @since API version 1
     */
    setDirectParameterValueNormalized(
      id: string,
      value: number,
      resolution: number
    ): void;

    /**
     * Increases the parameter with the specified `id` by the given `increment` according to the given
     * `resolution`. To decrease the parameter value pass in a negative increment.
     *
     * @param id
     *           the parameter identifier string
     * @param increment
     *           the amount that the parameter value should be increased by, normalized to the range
     *           [0..resolution-1]
     * @param resolution
     *           the resolution of the new value
     * @since API version 1
     */
    incDirectParameterValueNormalized(
      id: string,
      increment: number,
      resolution: number
    ): void;

    /**
     * Value that reports the file name of the currently loaded sample, in case the device is a sample
     * container device.
     *
     * @since API version 2
     */
    sampleName(): StringValue;

    /**
     * Registers an observer that reports the file name of the currently loaded sample, in case the device is a
     * sample container device.
     *
     * @param maxChars
     *           maximum length of the string sent to the observer.
     * @param textWhenUnassigned
     *           the default name that gets reported when the device is not associated with a Bitwig Studio
     *           device yet.
     * @param callback
     *           a callback function that receives a single string parameter.
     * @deprecated Use {@link #sampleName()} instead.
     */
    addSampleNameObserver(
      maxChars: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Returns an object that provides bank-wise navigation of sibling devices of the same device chain
     * (including the device instance used to create the siblings bank).
     *
     * @param numDevices
     *           the number of devices that are simultaneously accessible
     * @return the requested device bank object
     * @since API version 1
     */
    createSiblingsDeviceBank(numDevices: number): DeviceBank;

    /**
     * Starts browsing for content that can be inserted before this device in Bitwig Studio's popup browser.
     *
     * @since API version 2
     * @deprecated Use {@link #beforeDeviceInsertionPoint()} instead.
     */
    browseToInsertBeforeDevice(): void;

    /**
     * Starts browsing for content that can be inserted before this device in Bitwig Studio's popup browser.
     *
     * @since API version 2
     * @deprecated Use {@link #afterDeviceInsertionPoint()} instead.
     */
    browseToInsertAfterDevice(): void;

    /**
     * Starts browsing for content that can replace this device in Bitwig Studio's popup browser.
     *
     * @since API version 2
     * @deprecated Use {@link #replaceDeviceInsertionPoint()} instead.
     */
    browseToReplaceDevice(): void;

    /**
     * {@link InsertionPoint} that can be used for inserting after this device.
     *
     * @since API version 7
     */
    afterDeviceInsertionPoint(): InsertionPoint;

    /**
     * {@link InsertionPoint} that can be used for inserting before this device.
     *
     * @since API version 7
     */
    beforeDeviceInsertionPoint(): InsertionPoint;

    /**
     * {@link InsertionPoint} that can be used for replacing this device.
     *
     * @since API version 7
     */
    replaceDeviceInsertionPoint(): InsertionPoint;

    /**
     * The type of this device.
     *
     * @since API version 12
     */
    deviceType(): EnumValue;
  }

  // source: com/bitwig/extension/controller/api/DeviceBank.java

  /**
   * This interface is used for navigation of device chains in Bitwig Studio. Instances are configured with a
   * fixed number of devices and provide access to a excerpt of the devices inside a device chain. Various
   * methods are provided for scrolling to different sections of the device chain. It basically acts like a
   * window moving over the devices.
   *
   * To receive an instance of DeviceBank call {@link Track#createDeviceBank}.
   *
   * @see {@link Track#createDeviceBank}
   * @since API version 1
   */
  interface DeviceBank extends Bank<Device> {
    /**
     * Returns the object that was used to instantiate this device bank. Possible device chain instances are
     * tracks, device layers, drums pads, or FX slots.
     *
     * @return the requested device chain object
     * @since API version 1
     */
    getDeviceChain(): DeviceChain;

    /**
     * Returns the device at the given index within the bank.
     *
     * @param indexInBank
     *           the device index within this bank, not the position within the device chain. Must be in the
     *           range [0..sizeOfBank-1].
     * @return the requested device object
     * @since API version 1
     */
    getDevice(indexInBank: number): Device;

    /**
     * Scrolls the device window one page up.
     *
     * @since API version 1
     */
    scrollPageUp(): void;

    /**
     * Scrolls the device window one page down.
     *
     * @since API version 1
     */
    scrollPageDown(): void;

    /**
     * Scrolls the device window one device up.
     *
     * @since API version 1
     */
    scrollUp(): void;

    /**
     * Scrolls the device window one device down.
     *
     * @since API version 1
     */
    scrollDown(): void;

    /**
     * Makes the device with the given position visible in the track bank.
     *
     * @param position
     *           the position of the device within the device chain
     * @since API version 1
     * @deprecated Use {@link #scrollIntoView(int)} instead
     */
    scrollTo(position: number): void;

    /**
     * Registers an observer that reports the current device scroll position.
     *
     * @param callback
     *           a callback function that takes a single integer parameter
     * @param valueWhenUnassigned
     *           the default value that gets reports when the device chain is not yet connected to a Bitwig
     *           Studio document
     * @since API version 1
     * @deprecated Use {@link #scrollPosition()} instead.
     */
    addScrollPositionObserver(
      callback: IntegerValueChangedCallback,
      valueWhenUnassigned: number
    ): void;

    /**
     * Registers an observer that reports if the device window can be scrolled further up.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #canScrollBackwards()} instead.
     */
    addCanScrollUpObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the device window can be scrolled further down.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #canScrollForwards()} instead.
     */
    addCanScrollDownObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports the total device count of the device chain (not the number of devices
     * accessible through the bank window).
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #deviceCount()}.addValueObserver(callback)
     */
    addDeviceCountObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Browses for content to insert a device at the given index inside this bank.
     *
     * @param index
     *           the index to insert the device at. Must be >= 0 and <= {@link #getSizeOfBank()}.
     *
     * @since API version 2
     */
    browseToInsertDevice(index: number): void;

    /**
     * Sets a {@link DeviceMatcher} that can be used to filter devices in this bank to show only those
     * matching the supplied matcher.
     *
     * @param matcher The matcher that should filter the devices or null if all devices should be matched
     *
     * @since API version 12
     */
    setDeviceMatcher(matcher: DeviceMatcher): void;
  }

  // source: com/bitwig/extension/controller/api/DeviceBrowsingSession.java

  /**
   * Instances of this interface are used for browsing devices, including access to all filter columns and the
   * result column as shown in the 'Devices' tab of Bitwig Studio's contextual browser window.
   *
   * @see BrowsingSession
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface DeviceBrowsingSession extends BrowsingSession {
    /**
     * Returns the category filter as shown in the category column of the browser.
     *
     * @return the requested category filter object.
     * @since API version 1
     */
    getCategoryFilter(): BrowserFilterColumn;

    /**
     * Returns the device type filter as shown in the category column of the browser.
     *
     * @return the requested device type filter object.
     * @since API version 1
     */
    getDeviceTypeFilter(): BrowserFilterColumn;

    /**
     * Returns the file type filter as shown in the category column of the browser.
     *
     * @return the requested file type filter object.
     * @since API version 1
     */
    getFileTypeFilter(): BrowserFilterColumn;
  }

  // source: com/bitwig/extension/controller/api/DeviceChain.java

  /**
   * The foundation of all interfaces that contain devices, such as tracks, device layers, drum pads or FX
   * slots.
   *
   * @since API version 1
   */
  interface DeviceChain extends ObjectProxy {
    /**
     * Selects the device chain in Bitwig Studio, in case it is a selectable object.
     *
     * @since API version 1
     */
    selectInEditor(): void;

    /**
     * Value that reports the name of the device chain, such as the track name or the drum pad
     * name.
     *
     * @since API version 2
     */
    name(): SettableStringValue;

    /**
     * Registers an observer that reports the name of the device chain, such as the track name or the drum pad
     * name.
     *
     * @param numChars
     *           the maximum number of characters used for the reported name
     * @param textWhenUnassigned
     *           the default text that gets reported when the device chain is not associated with an object in
     *           Bitwig Studio yet.
     * @param callback
     *           a callback function that receives a single name parameter (string).
     * @since API version 1
     * @deprecated Use {@link #name()} instead.
     */
    addNameObserver(
      numChars: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Registers an observer that reports if the device chain is selected in Bitwig Studio editors.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter.
     * @since API version 1
     */
    addIsSelectedInEditorObserver(callback: BooleanValueChangedCallback): void;

    /**
     * @deprecated Use {@link #addIsSelectedInEditorObserver} instead.
     * @since API version 1
     */
    addIsSelectedObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Returns an object that provides bank-wise navigation of devices.
     *
     * @param numDevices
     *           the number of devices should be accessible simultaneously
     * @return the requested device bank object
     * @since API version 1
     */
    createDeviceBank(numDevices: number): DeviceBank;

    /**
     * Returns an object used for browsing devices, presets and other content. Committing the browsing session
     * will load or create a device from the selected resource and insert it into the device chain.
     *
     * @param numFilterColumnEntries
     *           the size of the window used to navigate the filter column entries.
     * @param numResultsColumnEntries
     *           the size of the window used to navigate the results column entries.
     * @return the requested device browser object.
     * @since API version 1
     */
    createDeviceBrowser(
      numFilterColumnEntries: number,
      numResultsColumnEntries: number
    ): Browser;

    /**
     * @deprecated Use {@link #selectInEditor()} or {@link Channel#selectInMixer()} instead.
     * @since API version 1
     */
    select(): void;

    /**
     * Starts browsing for content that can be inserted at the start of this device chain.
     *
     * @since API version 2
     * @deprecated Use {@link #startOfDeviceChainInsertionPoint()} instead.
     */
    browseToInsertAtStartOfChain(): void;

    /**
     * Starts browsing for content that can be inserted at the end of this device chain.
     *
     * @since API version 2
     * @deprecated Use {@link #endOfDeviceChainInsertionPoint()} instead.
     */
    browseToInsertAtEndOfChain(): void;

    /**
     * {@link InsertionPoint} that can be used to insert at the start of the device chain.
     *
     * @since API version 7
     */
    startOfDeviceChainInsertionPoint(): InsertionPoint;

    /**
     * {@link InsertionPoint} that can be used to insert at the end of the device chain.
     *
     * @since API version 7
     */
    endOfDeviceChainInsertionPoint(): InsertionPoint;
  }

  // source: com/bitwig/extension/controller/api/DeviceLayer.java

  /**
   * Instances of this interface represent device layers in Bitwig Studio.
   *
   * @since API version 1
   */
  interface DeviceLayer extends Channel {}

  // source: com/bitwig/extension/controller/api/DeviceLayerBank.java

  /**
   * Devices layers are features of special Bitwig Studio devices, more specifically the Layer Instrument and
   * Layer FX devices, and are also shown as sub-channels in the mixer panel.
   *
   * Instances of device layer bank are configured with a fixed number of channels and represent an excerpt of
   * underlying complete list of channels. Various methods are provided for scrolling to different sections of
   * the underlying list. It basically acts like a one-dimensional window moving over the device layers.
   *
   * To receive an instance of device layer bank call {@link Device#createLayerBank(int numChannels)}.
   *
   * @see {@link Device#createLayerBank}
   * @since API version 1
   */
  interface DeviceLayerBank extends ChannelBank<DeviceLayer> {
    /**
     * Returns the device layer at the given index.
     *
     * @param indexInBank
     *           the device layer index within this bank, not the index within the list of all device layers as
     *           shown in Bitwig Studio layer devices. Must be in the range [0..sizeOfBank-1].
     * @return the device layer object
     * @since API version 1
     * @deprecated Use {@link #getItemAt(int)} instead.
     */
    getChannel(indexInBank: number): DeviceLayer;
  }

  // source: com/bitwig/extension/controller/api/DeviceMatcher.java

  /**
   * Something that can be used to match a certain device. The matcher can be used to filter devices in a
   * {@link DeviceBank}, for example.
   *
   * {@link DeviceMatcher}s can be created by calling methods in
   * {@link ControllerHost} such as {@link ControllerHost#createInstrumentMatcher()}.
   *
   * @since API version 12
   */
  interface DeviceMatcher {}

  // source: com/bitwig/extension/controller/api/DeviceSlot.java

  /**
   * Instances of this interface represent nested FX slots in devices.
   *
   * @since API version 1
   */
  interface DeviceSlot extends DeviceChain {}

  // source: com/bitwig/extension/controller/api/DirectParameterValueDisplayObserver.java

  /**
   * This interface is used to configure observation of pretty-printed device parameter values.
   *
   * @since API version 1
   */
  interface DirectParameterValueDisplayObserver {
    /**
     * Starts observing the parameters according to the given parameter ID array, or stops observing in case
     * `null` is passed in for the parameter ID array.
     *
     * @param parameterIds
     *           the array of parameter IDs or `null` to stop observing parameter display values.
     * @since API version 1
     */
    setObservedParameterIds(parameterIds: string[]): void;
  }

  // source: com/bitwig/extension/controller/api/DocumentState.java

  /**
   * This interface is used to save custom script settings inside Bitwig Studio documents. The settings are
   * shown to the user in the `Studio IO` panel of Bitwig Studio.
   *
   * @since API version 1
   */
  interface DocumentState extends Settings {}

  // source: com/bitwig/extension/controller/api/DoubleValue.java

  import DoubleSupplier = java.util.func.DoubleSupplier;

  /**
   * Instances of this interface represent double values.
   * @since API version 2
   */
  interface DoubleValue
    extends Value<DoubleValueChangedCallback>,
      DoubleSupplier {
    /**
     * Gets the current value.
     *
     * @since API version 2
     */
    get(): number;

    getAsDouble(): number;
  }

  // source: com/bitwig/extension/controller/api/DrumPad.java

  /**
   * Instances of this interface are special kind of channel objects that represent the pads of a drum machine
   * instrument. Drum pads are typically associated to channel objects via note keys.
   *
   * @since API version 1
   */
  interface DrumPad extends Channel {
    /**
     * {@link InsertionPoint} that can be used to insert content in this drum pad.
     *
     * @since API version 7
     * */
    insertionPoint(): InsertionPoint;
  }

  // source: com/bitwig/extension/controller/api/DrumPadBank.java

  /**
   * Drum pads are features of special Bitwig Studio devices (currently only the Bitwig Drum Machine
   * instrument), and are also shown as sub-channels in the mixer panel.
   *
   * Instances of drum pad bank are configured with a fixed number of pads/channels and represent an excerpt of
   * underlying complete list of channels. Various methods are provided for scrolling to different sections of
   * the underlying list. It basically acts like a one-dimensional window moving over the drum pad channels.
   *
   * To receive an instance of drum pad bank call {@link Device#createDrumPadBank(int numChannels)}.
   *
   * @see {@link Device#createDrumPadBank}
   * @since API version 1
   */
  interface DrumPadBank extends ChannelBank<DrumPad> {
    /**
     * Specifies if the Drum Machine should visualize which pads are part of the window. By default indications
     * are enabled.
     *
     * @param shouldIndicate
     *           `true` if visual indications should be enabled, `false` otherwise
     * @since API version 1
     */
    setIndication(shouldIndicate: boolean): void;

    /**
     * Clears mute on all drum pads.
     *
     * @since API version 10
     */
    clearMutedPads(): void;

    /**
     * Clears solo on all drum pads.
     *
     * @since API version 10
     */
    clearSoloedPads(): void;

    /**
     * True if there is one or many muted pads.
     * @since API version 10
     */
    hasMutedPads(): BooleanValue;

    /**
     * True if there is one or many soloed pads.
     * @since API version 10
     */
    hasSoloedPads(): BooleanValue;
  }

  // source: com/bitwig/extension/controller/api/DuplicableObject.java

  interface DuplicableObject {
    /**
     * Duplicates this object into the document.
     *
     * If you want to duplicate multiple objects at once, see Host.duplicateObjects().
     *
     * @since API version 19
     */
    duplicateObject(): void;

    /**
     * Duplicates this object into the document.
     *
     * @since API version 19
     */
    duplicateObjectAction(): HardwareActionBindable;
  }

  // source: com/bitwig/extension/controller/api/EnumDefinition.java

  /**
   * Defines an enumeration.
   *
   * @since API version 11
   */
  interface EnumDefinition {
    /**
     * Gets the number of entries in the enum, must be greater than 0.
     * @since API version 11
     */
    getValueCount(): number;

    /**
     * Gets the {@Link EnumValueDefinition} for the given index.
     * @param valueIndex must be in the range 0 .. {@link #getValueCount()} - 1.
     * @return null if not found
     * @since API version 11
     */
    valueDefinitionAt(valueIndex: number): EnumValueDefinition;

    /**
     * Gets the {@Link EnumValueDefinition} for the given enum id.
     * @return null if not found
     * @since API version 11
     */
    valueDefinitionFor(id: string): EnumValueDefinition;
  }

  // source: com/bitwig/extension/controller/api/EnumValue.java

  import EnumValueChangedCallback = com.bitwig.extension.callback.EnumValueChangedCallback;

  interface EnumValue
    extends Value<EnumValueChangedCallback>,
      Supplier<string> {
    /**
     * Gets the current value.
     *
     * @since API version 2
     */
    get(): string;

    /**
     * Gets the enum definition.
     *
     * @since API version 11
     */
    enumDefinition(): EnumDefinition;
  }

  // source: com/bitwig/extension/controller/api/EnumValueDefinition.java

  /**
   * Defines a single value from an enum.
   * @since API version 11
   */
  interface EnumValueDefinition {
    /**
     * Gets the enum definition this value belongs to.
     * @since API version 11
     */
    enumDefinition(): EnumDefinition;

    /**
     * Index of this value in the enum definition.
     * @since API version 11
     */
    getValueIndex(): number;

    /**
     * Identifier for this enum value. It will never change.
     * This is the value to pass to {@link SettableEnumValue#set(String)}.
     * @since API version 11
     */
    getId(): string;

    /**
     * This is a string that is suitable for display.
     * @since API version 11
     */
    getDisplayName(): string;

    /**
     * This is a shorter version of {@link #getDisplayName()}.
     * @param maxLength Maximum number of characters
     * @since API version 11
     */
    getLimitedDisplayName(maxLength: number): string;
  }

  // source: com/bitwig/extension/controller/api/GenericBrowsingSession.java

  /**
   * Instances of this interface are used for browsing material with bank-wise access to the filter columns.
   *
   * @see com.bitwig.extension.controller.api.BrowsingSession
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface GenericBrowsingSession extends BrowsingSession {
    /**
     * Value that reports the name of the browsing session.
     *
     * @since API version 2
     */
    name(): StringValue;

    /**
     * Registers an observer that reports the name of the browsing session.
     *
     * @param callback
     *           a callback function that receives a single string argument.
     * @since API version 1
     * @deprecated Use
     */
    addNameObserver(
      maxCharacters: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;
  }

  // source: com/bitwig/extension/controller/api/Groove.java

  /**
   * An interface representing the global groove settings of the project.
   *
   * @since API version 1
   */
  interface Groove {
    /**
     * Returns the enabled state of the groove.
     *
     * @return an object that provides access to the groove on/off setting
     * @since API version 1
     */
    getEnabled(): Parameter;

    /**
     * Returns the object that represents the shuffle amount in Bitwig Studio.
     *
     * @return an ranged value object that provides access to the shuffle amount
     * @since API version 1
     */
    getShuffleAmount(): Parameter;

    /**
     * Returns the object that represents the shuffle rate in Bitwig Studio.
     *
     * @return an ranged value object that provides access to the shuffle rate
     * @since API version 1
     */
    getShuffleRate(): Parameter;

    /**
     * Returns the object that represents the accent amount in Bitwig Studio.
     *
     * @return an ranged value object that provides access to the accent amount
     * @since API version 1
     */
    getAccentAmount(): Parameter;

    /**
     * Returns the object that represents the accent rate in Bitwig Studio.
     *
     * @return an ranged value object that provides access to the accent rate
     * @since API version 1
     */
    getAccentRate(): Parameter;

    /**
     * Returns the object that represents the accent phase in Bitwig Studio.
     *
     * @return an ranged value object that provides access to the accent phase
     * @since API version 1
     */
    getAccentPhase(): Parameter;
  }

  // source: com/bitwig/extension/controller/api/HardwareAction.java

  /**
   * An action that can happen on a hardware control. For example, the user touching it, pressing it, releasing
   * it etc.
   *
   * @since API version 10
   */
  interface HardwareAction
    extends HardwareBindingSource<HardwareActionBinding> {
    /** Sets the {@link HardwareActionMatcher} that is used to recognize when this action happens. */
    setActionMatcher(actionMatcher: HardwareActionMatcher): void;

    /**
     * Sets the {@link AbsoluteHardwareValueMatcher} that is used to recognize when this action happens and
     * with what pressure.
     *
     * This is useful for a button press that is pressure sensitive. The pressure can be obtained by creating a
     * custom action with
     * {@link ControllerHost#createAction(java.util.function.DoubleConsumer, java.util.function.Supplier)} and
     * then binding the created action to this {@link HardwareAction}.
     */
    setPressureActionMatcher(actionMatcher: AbsoluteHardwareValueMatcher): void;

    /**
     * Checks if this action is supported (that is, it has a {@link HardwareActionMatcher} that can detect it).
     */
    isSupported(): boolean;

    /**
     * Decides if this action should fire even if the hardware input that matched it was also used as note
     * input. Note input is defined as input that matches a {@link NoteInput} mask and its event translations.
     * Usually events should only be note input or actions but not both at the same time (this is the default
     * state). However, occasionally it is useful for a note event to be played as both note input and also
     * trigger some action. For example, a drum pad may play a note but in a special mode on the controller it
     * should also select the pad somehow. In this case it would be both note input and the action that fires
     * to select the pad.
     *
     * @since API version 11
     */
    setShouldFireEvenWhenUsedAsNoteInput(value: boolean): void;
  }

  // source: com/bitwig/extension/controller/api/HardwareActionBindable.java

  /**
   * Something that can be bound to a hardware action (such as user pressing a button).
   *
   * @since API version 10
   */
  interface HardwareActionBindable extends HardwareBindable {
    /**
     * Binds this target to the supplied {@link HardwareAction} so that when the hardware action occurs this
     * target is invoked.
     *
     * When the binding is no longer needed the {@link HardwareBinding#removeBinding()} method can be called on
     * it.
     */
    addBinding(action: HardwareAction): HardwareActionBinding;

    /**
     * Invokes the action.
     *
     * @since API version 1
     */
    invoke(): void;
  }

  // source: com/bitwig/extension/controller/api/HardwareActionBinding.java

  /**
   * Represents a binding from a hardware action (such as user pressing a button) to some target action.
   *
   * @since API version 10
   * */
  interface HardwareActionBinding extends HardwareBinding {}

  // source: com/bitwig/extension/controller/api/HardwareActionMatcher.java

  /**
   * Defines a means of recognizing when a {@link HardwareAction} happens based on some hardware input.
   *
   * For example, when a certain MIDI CC message happens.
   *
   * @see MidiIn#createActionMatcher(String)
   *
   * @since API version 10
   *
   */
  interface HardwareActionMatcher extends HardwareInputMatcher {}

  // source: com/bitwig/extension/controller/api/HardwareBindable.java

  /**
   * An object that can be a target in a {@link HardwareBinding}.
   *
   * @since API version 10
   */
  interface HardwareBindable {}

  // source: com/bitwig/extension/controller/api/HardwareBinding.java

  /**
   * Represents a binding from some hardware input to a target.
   *
   * When the binding is no longer needed the {@link #removeBinding()} method can be called to remove it.
   *
   * @since API version 10
   */
  interface HardwareBinding {
    /** Removes this binding between its source and target so it is no longer in effect. */
    removeBinding(): void;
  }

  // source: com/bitwig/extension/controller/api/HardwareBindingSource.java

  /**
   * Represents the source of a {@link HardwareBinding}.
   *
   * @since API version 10
   */
  interface HardwareBindingSource<
    HardwareBindingType extends HardwareBinding = HardwareBinding
  > {
    /** Checks if it is possible to make a binding from this source to the supplied target object. */
    canBindTo(target: object): boolean;

    /**
     * Binds this source to the supplied target and returns the created binding. This can only be called if the
     * {@link #canBindTo(Object)} returns true.
     */
    addBinding(target: HardwareBindable): HardwareBindingType;

    /** Clears all bindings from this source to its targets. */
    clearBindings(): void;

    /**
     * Ensures there is a single binding to the supplied target.
     *
     * This is a convenience method that is equivalent to calling {@link #clearBindings()} and the
     * {@link #addBinding(HardwareBindable)}
     */
    setBinding(target: HardwareBindable): HardwareBindingType;
  }

  // source: com/bitwig/extension/controller/api/HardwareBindingWithRange.java

  /**
   * Represents a binding from some hardware input to a ranged value.
   *
   * @since API version 10
   */
  interface HardwareBindingWithRange extends HardwareBinding {
    /** Sets the minimum normalized value (0...1) that should be used for this binding. */
    setMinNormalizedValue(min: number): void;

    /** Sets the maximum normalized value (0...1) that should be used for this binding. */
    setMaxNormalizedValue(max: number): void;

    /** Sets the normalized range (0...1) that should be used for this binding. */
    setNormalizedRange(min: number, max: number): void;
  }

  // source: com/bitwig/extension/controller/api/HardwareBindingWithSensitivity.java

  /**
   * A {@link HardwareBinding} that has some sensitivity setting.
   *
   * @since API version 10
   */
  interface HardwareBindingWithSensitivity extends HardwareBinding {
    /** Sets the sensitivity of this binding. */
    setSensitivity(sensitivity: number): void;
  }

  // source: com/bitwig/extension/controller/api/HardwareButton.java

  /**
   * Represents a physical hardware button on a controller
   *
   * @since API version 10
   */
  interface HardwareButton extends HardwareControl {
    /** Action that happens when the user presses the button. */
    pressedAction(): HardwareAction;

    /** Action that happens when the user releases the button. */
    releasedAction(): HardwareAction;

    /** Button state */
    isPressed(): BooleanValue;

    /** Sets the optional control that represents the aftertouch value for this button. */
    setAftertouchControl(control: AbsoluteHardwareControl): void;

    /** An indication of how rounded the corners of this button should be. */
    setRoundedCornerRadius(radiusInMM: number): void;
  }

  // source: com/bitwig/extension/controller/api/HardwareControl.java

  /**
   * Some kind of physical control on a piece of hardware (such as a knob, button, slider etc).
   *
   * @since API version 10
   */
  interface HardwareControl extends HardwareElement {
    /**
     * The name of this hardware control. This will be shown in the mapping browser, for example. It should
     * provide enough information for the user to understand which control is being referred to. If the name is
     * not provided then the label will be used, and if that is not provided then the id will be used.
     *
     * @since API version 11
     */
    getName(): string;

    /**
     * The name of this hardware control. This will be shown in the mapping browser, for example. It should
     * provide enough information for the user to understand which control is being referred to. If the name is
     * not provided then the label will be used, and if that is not provided then the id will be used.
     *
     * @since API version 11
     */
    setName(name: string): void;

    /**
     * If this control is part of group of related controls then this specifies the index in that group.
     * This index is used to automatically indicate a mapping color on a parameter that this hardware
     * control gets bound to.
     *
     * @since API version 11
     */
    setIndexInGroup(index: number): void;

    /** Action that happens when the user touches this control. */
    beginTouchAction(): HardwareAction;

    /** Action that happens when the user stops touching this control. */
    endTouchAction(): HardwareAction;

    /** Value that indicates if this control is being touched or not. */
    isBeingTouched(): BooleanValue;

    /** Optional light that is in the background of this control. */
    backgroundLight(): HardwareLight;

    /** Sets the optional light that is in the background of this control. */
    setBackgroundLight(light: HardwareLight): void;
  }

  // source: com/bitwig/extension/controller/api/HardwareControlType.java

  enum HardwareControlType {
    KNOB = 0,
    SLIDER = 1,
    ENCODER = 2,
  }

  // source: com/bitwig/extension/controller/api/HardwareDevice.java

  /**
   * Represents a hardware device that the user has chosen to communicate with. The hardware devices that the
   * user needs to choose are defined by the
   * {@link ControllerExtensionDefinition#listHardwareDevices(java.util.List)} method.
   *
   * @since API version 7
   */
  interface HardwareDevice {
    /**
     * The {@link HardwareDeviceMatcher} that was provided by the controller for identifying this hardware
     * device in {@link ControllerExtensionDefinition#listHardwareDevices(java.util.List)}.
     *
     */
    deviceMatcher(): HardwareDeviceMatcher;
  }

  // source: com/bitwig/extension/controller/api/HardwareElement.java

  /**
   * Represents some physical hardware element. Hardware elements can be {@link HardwareControl}s (e.g. buttons,
   * sliders etc) or {@link HardwareOutputElement}s (e.g lights, text displays etc).
   *
   * @since API version 10
   */
  interface HardwareElement {
    /** The unique id associated with this element. */
    getId(): string;

    /** An optional label associated with this element. */
    getLabel(): string;

    /** Sets the label for this hardware control as written on the hardware. */
    setLabel(label: string): void;

    /** The color of the label. */
    getLabelColor(): Color;

    /** Sets the color of the label. */
    setLabelColor(color: Color): void;

    /** {@link RelativePosition} that defines where the label is. */
    getLabelPosition(): RelativePosition;

    setLabelPosition(position: RelativePosition): void;

    /** The physical bounds of this hardware element on the controller. */
    setBounds(
      xInMM: number,
      yInMM: number,
      widthInMM: number,
      heightInMM: number
    ): void;

    getX(): number;

    getY(): number;

    getWidth(): number;

    getHeight(): number;
  }

  // source: com/bitwig/extension/controller/api/HardwareInputMatcher.java

  /**
   * Defines a means of recognizing when some kind of hardware input happens.
   *
   * For example, when a certain MIDI CC message happens.
   *
   * @see MidiIn#createActionMatcher(String)
   *
   * @since API version 10
   *
   */
  interface HardwareInputMatcher {}

  // source: com/bitwig/extension/controller/api/HardwareLight.java

  /**
   * Defines a hardware light. There are 2 kinds of lights: {@link OnOffHardwareLight} and
   * {@link MultiStateHardwareLight}.
   *
   * @since API version 10
   */
  interface HardwareLight extends HardwareOutputElement {}

  // source: com/bitwig/extension/controller/api/HardwareLightVisualState.java

  /**
   * Defines the visual state of a hardware light so that it can be visualized in Bitwig Studio's user
   * interface.
   *
   * This is currently only used when simulating hardware when it is not present for debugging but it may be
   * used for other purposes in the future.
   *
   * @since API version 10
   */
  class HardwareLightVisualState {
    static defaultLabelColorForLightColor(lightColor: Color): Color;

    static createForColor(color: Color): HardwareLightVisualState;

    static createForColor(
      color: Color,
      labelColor: Color
    ): HardwareLightVisualState;

    static createBlinking(
      onColor: Color,
      offColor: Color,
      onBlinkTimeInSec: number,
      offBlinkTimeInSec: number
    ): HardwareLightVisualState;

    static createBlinking(
      onColor: Color,
      offColor: Color,
      labelOnColor: Color,
      labelOffColor: Color,
      onBlinkTimeInSec: number,
      offBlinkTimeInSec: number
    ): HardwareLightVisualState;

    constructor(
      color: Color,
      offColor: Color,
      labelColor: Color,
      labelBlinkOffColor: Color,
      onBlinkTime: number,
      offBlinkTime: number
    );

    isBlinking(): boolean;

    getColor(): Color;

    getBlinkOffColor(): Color;

    getOffBlinkTime(): number;

    getOnBlinkTime(): number;

    getLabelColor(): Color;

    getLabelBlinkOffColor(): Color;

    hashCode(): number;

    equals(obj: object): boolean;

    mColor: Color;

    mOnBlinkTime: number;
  }

  // source: com/bitwig/extension/controller/api/HardwareOutputElement.java

  /**
   * Represents a physical hardware element that displays some output to the user.
   *
   * For example, a light, some text etc
   *
   * @since API version 10
   */
  interface HardwareOutputElement extends HardwareElement {
    /**
     * Sets an optional callback for this element whenever it's state needs to be sent to the hardware. This
     * will be called when calling {@link HardwareSurface#updateHardware()} if the state needs to be sent.
     */
    onUpdateHardware(sendStateRunnable: () => void): void;
  }

  // source: com/bitwig/extension/controller/api/HardwarePixelDisplay.java

  import Bitmap = com.bitwig.extension.api.graphics.Bitmap;

  /**
   * Defines a physical pixel display on the controller.
   *
   * @since API version 10
   */
  interface HardwarePixelDisplay extends HardwareOutputElement {
    /** The {@link Bitmap} that contains the contents of this display. */
    bitmap(): Bitmap;
  }

  // source: com/bitwig/extension/controller/api/HardwareProperty.java

  /**
   * Represents a value that needs to be displayed somehow on the hardware.
   *
   * A {@link HardwareProperty} is part of a {@link HardwareOutputElement}.
   *
   * @since API version 10
   * */
  interface HardwareProperty {}

  // source: com/bitwig/extension/controller/api/HardwareSlider.java

  /**
   * Represents a physical hardware button on a controller
   *
   * @since API version 10
   */
  interface HardwareSlider extends AbsoluteHardwareControl {
    /** Indicates if this slider is horizontal rather than vertical. */
    setIsHorizontal(isHorizontal: boolean): void;
  }

  // source: com/bitwig/extension/controller/api/HardwareSurface.java

  import List = java.util.List;

  /**
   * Represents a surface that can contain {@link HardwareElement}s such as {@link HardwareButton}s,
   * {@link HardwareSlider}s, {@link MultiStateHardwareLight}s etc
   *
   * <p>
   * This information allows Bitwig Studio to construct a reliable physical model of the hardware. This
   * information can be used to simulate hardware being present even when physical hardware is not available
   * (and may also be used for other purposes in the future).
   *
   * <p>
   * To be able to simulate hardware being connected so that you can debug controllers without the real hardware
   * you need to do the following:
   *
   * <p>
   * Create a file with the name "config.json" in your user settings directory. The location of this directory
   * is platform dependent:
   *
   * <ul>
   * <li>On Windows: %LOCALAPPDATA%\Bitwig Studio
   * <li>On macOS: Library/Application Support/Bitwig/Bitwig Studio
   * <li>On Linux: $HOME/.BitwigStudio
   * </ul>
   *
   * <p>
   * Then add the following line to the config.json file:
   *
   * <pre>
   * extension-dev : true
   * </pre>
   *
   * <p>
   * You will then need to restart Bitwig Studio. To simulate the controller being connected you can right click
   * on the controller in the preferences and select "Simulate device connected".
   *
   * <p>
   * If you have also provided physical positions for various {@link HardwareElement}s using
   * {@link HardwareElement#setBounds(double, double, double, double)} then you can also see a GUI simulator for
   * your controller by selecting "Show simulated hardware GUI".
   *
   * @since API version 10
   */
  interface HardwareSurface {
    /**
     * Creates a {@link HardwareSlider} that represents a physical slider on a controller.
     *
     * @param id
     *           A unique string that identifies this control.
     *
     * @since API version 10
     */
    createHardwareSlider(id: string): HardwareSlider;

    /**
     * Creates a {@link HardwareSlider} that represents a physical slider on a controller.
     *
     * @param id
     *           A unique string that identifies this control.
     *
     * @param currentValue
     *          The current position of the slider 0..1
     *
     * @since API version 15
     */
    createHardwareSlider(id: string, currentValue: number): HardwareSlider;

    /**
     * Creates an {@link AbsoluteHardwareKnob} that represents a physical knob on a controller that can be used
     * to input an absolute value.
     *
     * @param id
     *           A unique string that identifies this control.
     *
     * @since API version 10
     */
    createAbsoluteHardwareKnob(id: string): AbsoluteHardwareKnob;

    /**
     * Creates an {@link AbsoluteHardwareKnob} that represents a physical knob on a controller that can be used
     * to input an absolute value.
     *
     * @param id
     *           A unique string that identifies this control.
     *
     * @param currentValue
     *          The current position of the knob 0..1
     *
     * @since API version 10
     */
    createAbsoluteHardwareKnob(
      id: string,
      currentValue: number
    ): AbsoluteHardwareKnob;

    /**
     * Creates an {@link RelativeHardwareKnob} that represents a physical knob on a controller that can be used
     * to input a relative value change.
     *
     * @param id
     *           A unique string that identifies this control.
     *
     * @since API version 10
     */
    createRelativeHardwareKnob(id: string): RelativeHardwareKnob;

    createPianoKeyboard(
      id: string,
      numKeys: number,
      octave: number,
      startKeyInOctave: number
    ): PianoKeyboard;

    /**
     * Creates a {@link HardwareButton} that represents a physical button on a controller
     *
     * @param id
     *           A unique string that identifies this control.
     *
     * @since API version 10
     */
    createHardwareButton(id: string): HardwareButton;

    /**
     * Creates a {@link OnOffHardwareLight} that represents a physical light on a controller
     *
     * @since API version 10
     */
    createOnOffHardwareLight(id: string): OnOffHardwareLight;

    /**
     * Creates a {@link MultiStateHardwareLight} that represents a physical light on a controller
     *
     * @param id
     *           A unique string that identifies this parameter.
     * @param internalStateToLightVisualStateFunction
     *           A function that can be used to determine the visual state of the light on the hardware so it
     *           can be visualized in Bitwig Studio's user interface when needed.
     *
     * @since API version 10
     */
    createMultiStateHardwareLight(id: string): MultiStateHardwareLight;

    /**
     * Creates a {@link HardwareTextDisplay} that represents a physical text display on a controller
     *
     * @param id
     *           A unique string that identifies this control.
     *
     * @since API version 10
     */
    createHardwareTextDisplay(
      id: string,
      numLines: number
    ): HardwareTextDisplay;

    /**
     * Creates a {@link HardwarePixelDisplay} that displays the provided {@link Bitmap} that is rendered by the
     * controller.
     *
     * @since API version 10
     */
    createHardwarePixelDisplay(
      id: string,
      bitmap: Bitmap
    ): HardwarePixelDisplay;

    /**
     * Sets the physical size of this controller in mm.
     *
     * @since API version 10
     */
    setPhysicalSize(widthInMM: number, heightInMM: number): void;

    /**
     * Updates the state of all {@link HardwareOutputElement}s that have changed since the last time this
     * method was called.
     *
     * Any onUpdateHardware callbacks that have been registered on {@link HardwareOutputElement}s or
     * {@link HardwareProperty}s will be invoked if their state/value has changed since the last time it was
     * called.
     *
     * This is typically called by the control script from its flush method.
     *
     * @since API version 10
     */
    updateHardware(): void;

    /**
     * Mark all {@link HardwareOutputElement}s as needing to resend their output state, regardless of it has
     * changed or not.
     */
    invalidateHardwareOutputState(): void;

    /**
     * A list of all the {@link HardwareControl}s that have been created on this {@link HardwareSurface}.
     */
    hardwareControls(): List<HardwareControl>;

    /** Finds the {@link HardwareElement} that has the supplied id or null if not found. */
    hardwareElementWithId(id: string): HardwareElement;

    /** List of all {@link HardwareElement}s on this {@link HardwareSurface}. */
    hardwareOutputElements(): List<HardwareOutputElement>;
  }

  // source: com/bitwig/extension/controller/api/HardwareTextDisplay.java

  /**
   * Represents a display on some hardware that shows one or more lines of text.
   *
   * @since API version 10
   */
  interface HardwareTextDisplay extends HardwareOutputElement {
    /** The line at the supplied line index. */
    line(line: number): HardwareTextDisplayLine;
  }

  // source: com/bitwig/extension/controller/api/HardwareTextDisplayLine.java

  /**
   * Represents a line of text on a {@link HardwareTextDisplay}.
   *
   * @since API version 10
   */
  interface HardwareTextDisplayLine {
    /** Property that defines the current text shown. */
    text(): StringHardwareProperty;

    /** Property that defines the background color of this line. */
    backgroundColor(): ColorHardwareProperty;

    /** Property that defines the text color of this line. */
    textColor(): ColorHardwareProperty;
  }

  // source: com/bitwig/extension/controller/api/InputPipe.java

  import MemoryBlock = com.bitwig.extension.api.MemoryBlock;

  /**
   * A pipe that can be used to read data.
   *
   * @since API version 7
   */
  interface InputPipe extends Pipe {
    /**
     * Requests to read some data from this pipe in an asynchronous way (the caller is not blocked). Once some
     * data has been read the callback will be notified on the controller's thread.
     *
     * @param data
     *           A {@link MemoryBlock} that can receive the data that is read.
     * @param callback
     *           A callback that is notified on the controller's thread when the read has completed.
     * @param timeoutInMs
     *           A timeout in milliseconds that will result in an error and termination of the controller if
     *           the read does not happen in this time. For inifnite timeout use 0.
     */
    readAsync(
      data: MemoryBlock,
      callback: AsyncTransferCompledCallback,
      timeoutInMs: number
    ): void;

    /**
     * Requests to read some data from this pipe in a synchronous way (the caller is blocked until the transfer
     * completes).
     *
     * @return The number of bytes that was read.
     * @param timeoutInMs
     *           A timeout in milliseconds that will result in an error and termination of the controller if
     *           the read does not happen in this time. For inifinite timeout use 0.
     */
    read(data: MemoryBlock, timeoutInMs: number): number;
  }

  // source: com/bitwig/extension/controller/api/InsertionPoint.java

  /**
   * Defines an insertion point where various objects can be inserted as if the user had dragged and dropped
   * them to this insertion point (e.g with the mouse). Some things may not make sense to insert in which case
   * nothing happens.
   *
   * @since API version 7
   */
  interface InsertionPoint {
    /**
     * Copies the supplied tracks to this insertion point. If it's not possible to do so then this does
     * nothing.
     */
    copyTracks(...tracks: Track[]): void;

    /**
     * Moves the supplied tracks to this insertion point. If it's not possible to do so then this does nothing.
     */
    moveTracks(...tracks: Track[]): void;

    /**
     * Copies the supplied devices to this insertion point. If it's not possible to do so then this does
     * nothing.
     */
    copyDevices(...devices: Device[]): void;

    /**
     * Moves the supplied devices to this insertion point. If it's not possible to do so then this does
     * nothing.
     */
    moveDevices(...devices: Device[]): void;

    /**
     * Copies the supplied slots or scenes to this insertion point. If it's not possible to do so then this
     * does nothing.
     */
    copySlotsOrScenes(
      ...clipLauncherSlotOrScenes: ClipLauncherSlotOrScene[]
    ): void;

    /**
     * Moves the supplied slots or scenes to this insertion point. If it's not possible to do so then this does
     * nothing.
     */
    moveSlotsOrScenes(
      ...clipLauncherSlotOrScenes: ClipLauncherSlotOrScene[]
    ): void;

    /**
     * Inserts the supplied file at this insertion point. If it's not possible to do so then this does nothing.
     */
    insertFile(path: string): void;

    /**
     * Inserts a Bitwig device with the supplied id at this insertion point. If the device is unknown or it's
     * not possible to insert a device here then his does nothing.
     *
     * @param id
     *           The Bitwig device id to insert
     */
    insertBitwigDevice(id: UUID): void;

    /**
     * Inserts a VST2 plugin device with the supplied id at this insertion point. If the plug-in is unknown, or
     * it's not possible to insert a plug-in here then his does nothing.
     *
     * @param id
     *           The VST2 plugin id to insert
     */
    insertVST2Device(id: number): void;

    /**
     * Inserts a VST3 plugin device with the supplied id at this insertion point. If the plug-in is unknown, or
     * it's not possible to insert a plug-in here then his does nothing.
     *
     * @param id
     *           The VST3 plugin id to insert
     */
    insertVST3Device(id: string): void;

    /**
     * Inserts a CLAP plugin device with the supplied id at this insertion point. If the plug-in is unknown, or
     * it's not possible to insert a plug-in here then his does nothing.
     *
     * @param id
     *           The CLAP plugin id to insert
     *
     * @since API version 18
     */
    insertCLAPDevice(id: string): void;

    /** Pastes the contents of the clipboard at this insertion point. */
    paste(): void;

    /** Starts browsing using the popup browser for something to insert at this insertion point. */
    browse(): void;

    /**
     *
     * @since API version 15
     */
    browseAction(): HardwareActionBindable;
  }

  // source: com/bitwig/extension/controller/api/IntegerHardwareProperty.java

  import IntConsumer = java.util.func.IntConsumer;
  import IntSupplier = java.util.func.IntSupplier;

  /**
   * Represents an output value shown on some hardware.
   *
   * @since API version 10
   * */
  interface IntegerHardwareProperty extends HardwareProperty {
    /** Gets the current value. This is the value that should be sent to the hardware to be displayed. */
    currentValue(): number;

    /** The value that was last sent to the hardware. */
    lastSentValue(): number;

    /**
     * Specifies a callback that should be called with the value that needs to be sent to the hardware. This
     * callback is called as a result of calling the {@link HardwareSurface#updateHardware()} method (typically
     * from the flush method).
     */
    onUpdateHardware(sendValueConsumer: IntConsumer): void;

    /** Sets the current value. */
    setValue(value: number): void;

    /** Sets the current value from a {@link BooleanSupplier} that supplies the latest value. */
    setValueSupplier(supplier: IntSupplier): void;
  }

  // source: com/bitwig/extension/controller/api/IntegerValue.java

  // @ts-ignore
  interface IntegerValue
    extends Value<IntegerValueChangedCallback>,
      IntSupplier {
    /**
     * Gets the current value.
     *
     * @since API version 2
     */
    get(): number;

    getAsInt(): number;

    /**
     * Adds an observer that is notified when this value changes. This is intended to aid in backwards
     * compatibility for drivers written to the version 1 API.
     *
     * @param callback
     *           The callback to notify with the new value
     * @param valueWhenUnassigned
     *           The value that the callback will be notified with if this value is not currently assigned to
     *           anything.
     */
    addValueObserver(
      callback: IntegerValueChangedCallback,
      valueWhenUnassigned: number
    ): void;
  }

  // source: com/bitwig/extension/controller/api/InternalHardwareLightState.java

  /**
   * Defines the current state of a {@link MultiStateHardwareLight}. What this state means is entirely up to the
   * controller implementation.
   *
   * @apiNote The {@link Object#equals(Object)} method <b>MUST</b> be overridden to compare light states
   *          correctly.
   *
   * @since API version 10
   */
  class InternalHardwareLightState {
    /** The visual state of this light (used by Bitwig Studio to visualize the light when needed). */
    getVisualState(): HardwareLightVisualState;

    equals(obj: object): boolean;
  }

  // source: com/bitwig/extension/controller/api/Macro.java

  /**
   * Instances of this interface are used to represent macro controls in Bitwig Studio to controllers.
   *
   * @deprecated Macros no longer exist as built in features of all devices. Instead the user can customize
   *             pages of controls.
   * @since API version 1
   */
  interface Macro {
    /**
     * Returns an object that provides access to the control value of the macro.
     *
     * @return a ranged value object.
     * @since API version 1
     */
    getAmount(): Parameter;

    /**
     * Returns an object that provides access to the modulation source of the macro.
     *
     * @return a modulation source object.
     * @since API version 1
     */
    getModulationSource(): ModulationSource;

    /**
     * Registers an observer that reports the label of the macro control.
     *
     * @param numChars
     *           the maximum number of characters of the reported label
     * @param textWhenUnassigned
     *           the default text that is reported when the macro is not connected to a Bitwig Studio macro
     *           control.
     * @param callback
     *           a callback function that receives a single string parameter.
     */
    addLabelObserver(
      numChars: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;
  }

  // source: com/bitwig/extension/controller/api/MasterTrack.java

  /**
   * A special kind of track that represents the master track in Bitwig Studio.
   *
   * @since API version 1
   */
  interface MasterTrack extends Track {}

  // source: com/bitwig/extension/controller/api/MidiExpressions.java

  /**
   * Creates useful MIDI expressions that can be used to match MIDI events.
   *
   * @since API version 10
   */
  interface MidiExpressions {
    /** Creates an expression that recognizes a MIDI CC event regardless of its channel.
     * @since API version 11 */
    createIsCCExpression(controlNumber: number): string;

    /** Creates an expression that recognizes a MIDI CC event. */
    createIsCCExpression(channel: number, controlNumber: number): string;

    /**
     * Creates an expression that recognizes a MIDI CC event with a specific value. This expression can be used
     * in {@link #createActionMatcher(String)} or {@link #createAbsoluteValueMatcher(String, String, int)}, for
     * example.
     *
     * @since API version 10
     */
    createIsCCValueExpression(
      channel: number,
      control: number,
      value: number
    ): string;

    /**
     * Creates an expression that recognizes a pitch bend event. This expression can be used in
     * {@link #createActionMatcher(String)} or {@link #createAbsoluteValueMatcher(String, String, int)}, for
     * example.
     *
     * @since API version 10
     */
    createIsPitchBendExpression(channel: number): string;

    /**
     * Creates an expression that recognizes a note on event. This expression can be used in
     * {@link #createActionMatcher(String)} or {@link #createAbsoluteValueMatcher(String, String, int)}, for
     * example.
     *
     * @since API version 10
     */
    createIsNoteOnExpression(channel: number, note: number): string;

    /**
     * Creates an expression that recognizes a note off event. This expression can be used in
     * {@link #createActionMatcher(String)} or {@link #createAbsoluteValueMatcher(String, String, int)}, for
     * example.
     *
     * @since API version 10
     */
    createIsNoteOffExpression(channel: number, note: number): string;

    /**
     * Creates an expression that recognizes a polyphonic aftertouch event. This expression can be used in
     * {@link #createActionMatcher(String)} or {@link #createAbsoluteValueMatcher(String, String, int)}, for
     * example.
     *
     * @since API version 10
     */
    createIsPolyAftertouch(channel: number, note: number): string;
  }

  // source: com/bitwig/extension/controller/api/MidiIn.java

  import ShortMidiDataReceivedCallback = com.bitwig.extension.callback.ShortMidiDataReceivedCallback;
  import SysexMidiDataReceivedCallback = com.bitwig.extension.callback.SysexMidiDataReceivedCallback;

  /**
   * Instances of this interface are used to setup handler functions for incoming MIDI messages from a specific
   * MIDI hardware.
   *
   * <p>
   * Expressions can be used to generate matchers for various MIDI events that can then be used to update
   * hardware control states (see {@link MidiIn#createActionMatcher(String)} and {@link HardwareControl}).
   *
   * <p>
   * The expression language supports these operators in the same way that C, Java, C++ do: +, -, *, /, %,
   * <<, >>, &&, ||, &, |, ^, <, <=, >, >=, ==, !=
   *
   * <p>
   * The following variables are also defined for matching parts of the event:
   * <ul>
   * <li>status - Value of the status byte
   * <li>data1 - Value of the first data byte
   * <li>data2 - Value of the second data byte
   * <li>event - Integer value of the whole MIDI event with data2 byte in the least significant bits
   * </ul>
   *
   * <p>
   * Integers can be represented in hex using same syntax as C. 'true' and 'false' keywords are also defined.
   *
   * @since API version 1
   */
  interface MidiIn {
    /**
     * Registers a callback for receiving short (normal) MIDI messages on this MIDI input port.
     *
     * @param callback
     *           a callback function that receives three integer parameters: 1. the status byte 2. the data1
     *           value 2. the data2 value
     * @since API version 1
     */
    setMidiCallback(callback: ShortMidiDataReceivedCallback): void;

    /**
     * Registers a callback for receiving sysex MIDI messages on this MIDI input port.
     *
     * @param callback
     *           a callback function that takes a single string argument
     * @since API version 1
     */
    setSysexCallback(callback: SysexMidiDataReceivedCallback): void;

    /**
     * Creates a note input that appears in the track input choosers in Bitwig Studio. This method must be
     * called within the `init()` function of the script. The messages matching the given mask parameter will
     * be fed directly to the application, and are not processed by the script.
     *
     * @param name
     *           the name of the note input as it appears in the track input choosers in Bitwig Studio
     * @param masks
     *           a filter string formatted as hexadecimal value with `?` as wildcard. For example `80????`
     *           would match note-off on channel 1 (0). When this parameter is {@null}, a standard filter will
     *           be used to forward note-related messages on channel 1 (0).
     *
     *           If multiple note input match the same MIDI event then they'll all receive the MIDI event, and
     *           if one of them does not consume events then the events wont' be consumed.
     * @return the object representing the requested note input
     * @since API version 1
     */
    createNoteInput(name: string, ...masks: string[]): NoteInput;

    /**
     * Creates a matcher that matches the absolute value of a MIDI CC message.
     *
     * @since API version 10
     */
    createAbsoluteCCValueMatcher(
      channel: number,
      controlNumber: number
    ): AbsoluteHardwareValueMatcher;

    /**
     * Creates a matcher that matches the absolute value of a MIDI CC message regardless of its channel.
     *
     * @since API version 11
     */
    createAbsoluteCCValueMatcher(
      controlNumber: number
    ): AbsoluteHardwareValueMatcher;

    /**
     * Creates a matcher that matches the absolute value of a Poly AT message.
     *
     * @since API version 10
     */
    createPolyAftertouchValueMatcher(
      channel: number,
      note: number
    ): AbsoluteHardwareValueMatcher;

    /**
     * Creates a matcher that matches the relative value of a MIDI CC message encoded using signed bit.
     *
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelativeSignedBitCCValueMatcher(
      channel: number,
      controlNumber: number,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that matches the relative value of a MIDI CC message encoded using signed bit 2.
     *
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelativeSignedBit2CCValueMatcher(
      channel: number,
      controlNumber: number,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that matches the relative value of a MIDI CC message encoded using bin offset.
     *
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelativeBinOffsetCCValueMatcher(
      channel: number,
      controlNumber: number,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that matches the relative value of a MIDI CC message encoded using 2s complement.
     *
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelative2sComplementCCValueMatcher(
      channel: number,
      controlNumber: number,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Create a matcher that matches the absolute value of a MIDI pitch bend message.
     *
     * @since API version 10
     */
    createAbsolutePitchBendValueMatcher(
      channel: number
    ): AbsoluteHardwareValueMatcher;

    /**
     * Creates an absolute value matcher that is defined by 2 separate MIDI events that have to occur in
     * sequence.
     *
     * This can be used to get a much higher precision value that a single MIDI event would allow. Some
     * controllers for example will send 2 CC events for a single value.
     *
     * @since API version 10
     */
    createSequencedValueMatcher(
      firstValueMatcher: AbsoluteHardwareValueMatcher,
      secondValueMatcher: AbsoluteHardwareValueMatcher,
      areMostSignificantBitsInSecondEvent: boolean
    ): AbsoluteHardwareValueMatcher;

    /**
     * Creates a matcher that matches the absolute value of a MIDI CC message by using expressions to filter
     * and extract a value out of the MIDI event.
     *
     * @param eventExpression
     *           Expression that must be true in order to extract the value.
     * @param valueExpression
     *           Expression that determines the value once an event has been matched.
     * @param valueBitCount
     *           The number of bits that are relevant from the value extracted by the valueExpression.
     *
     * @since API version 10
     */
    createAbsoluteValueMatcher(
      eventExpression: string,
      valueExpression: string,
      valueBitCount: number
    ): AbsoluteHardwareValueMatcher;

    /**
     * Creates a matcher that applies a relative adjustment when a MIDI event occurs matching an expression.
     *
     * @param eventExpression
     *           Expression that must be true in order to extract the value.
     * @param relativeAdjustment
     *           The amount of relative adjustment that should be applied
     *
     * @since API version 10
     */
    createRelativeValueMatcher(
      eventExpression: string,
      relativeAdjustment: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that matches the relative value (encoded as signed bit) of a MIDI CC message by using
     * expressions to filter and extract a value out of the MIDI event.
     *
     * @param eventExpression
     *           Expression that must be true in order to extract the value.
     * @param valueExpression
     *           Expression that determines the value once an event has been matched.
     * @param valueBitCount
     *           The number of bits that are relevant from the value extracted by the valueExpression.
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelativeSignedBitValueMatcher(
      eventExpression: string,
      valueExpression: string,
      valueBitCount: number,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that converts a value matched by an {@link AbsoluteHardwareValueMatcher} to a relative
     * value using signed bit.
     *
     * @param valueMatcher
     *           Value matcher that matches the value that needs to be converted to a relative value
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelativeSignedBitValueMatcher(
      valueMatcher: AbsoluteHardwareValueMatcher,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that matches the relative value (encoded as signed bit 2) of a MIDI CC message by
     * using expressions to filter and extract a value out of the MIDI event.
     *
     * @param eventExpression
     *           Expression that must be true in order to extract the value.
     * @param valueExpression
     *           Expression that determines the value once an event has been matched.
     * @param valueBitCount
     *           The number of bits that are relevant from the value extracted by the valueExpression.
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelativeSignedBit2ValueMatcher(
      eventExpression: string,
      valueExpression: string,
      valueBitCount: number,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that converts a value matched by an {@link AbsoluteHardwareValueMatcher} to a relative
     * value using signed bit 2.
     *
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelativeSignedBit2ValueMatcher(
      valueMatcher: AbsoluteHardwareValueMatcher,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that matches the relative value (encoded as bin offset) of a MIDI CC message by using
     * expressions to filter and extract a value out of the MIDI event.
     *
     * @param eventExpression
     *           Expression that must be true in order to extract the value.
     * @param valueExpression
     *           Expression that determines the value once an event has been matched.
     * @param valueBitCount
     *           The number of bits that are relevant from the value extracted by the valueExpression.
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelativeBinOffsetValueMatcher(
      eventExpression: string,
      valueExpression: string,
      valueBitCount: number,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that converts a value matched by an {@link AbsoluteHardwareValueMatcher} to a relative
     * value using bin offset.
     *
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelativeBinOffsetValueMatcher(
      valueMatcher: AbsoluteHardwareValueMatcher,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that matches the relative value (encoded as 2s complement) of a MIDI CC message by
     * using expressions to filter and extract a value out of the MIDI event.
     *
     * @param eventExpression
     *           Expression that must be true in order to extract the value.
     * @param valueExpression
     *           Expression that determines the value once an event has been matched.
     * @param valueBitCount
     *           The number of bits that are relevant from the value extracted by the valueExpression.
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelative2sComplementValueMatcher(
      eventExpression: string,
      valueExpression: string,
      valueBitCount: number,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that converts a value matched by an {@link AbsoluteHardwareValueMatcher} to a relative
     * value using 2s complement.
     *
     * @param valueAmountForOneFullRotation
     *           The value that would represent one full rotation to the right (should be very similar to the
     *           amount of rotation needed to take an absolute knob from 0 to 1). For example, if a value of
     *           127 meant it had been rotated to the right by a full rotation then you would pass 127 here.
     *           This ensures that {@link RelativeHardwareControl}s have similar sensitivity to each other and
     *           can be mapped and behave in a very similar way to {@link AbsoluteHardwareControl}s.
     *
     * @since API version 10
     */
    createRelative2sComplementValueMatcher(
      valueMatcher: AbsoluteHardwareValueMatcher,
      valueAmountForOneFullRotation: number
    ): RelativeHardwareValueMatcher;

    /**
     * Creates a matcher that recognizes an action when getting a MIDI CC event with a specific value.
     *
     * @since API version 10
     */
    createCCActionMatcher(
      channel: number,
      controlNumber: number,
      value: number
    ): HardwareActionMatcher;

    /**
     * Creates a matcher that recognizes an action when getting a MIDI CC event regardless of the value.
     *
     * @since API version 10
     */
    createCCActionMatcher(
      channel: number,
      controlNumber: number
    ): HardwareActionMatcher;

    /**
     * Creates a matcher that recognizes an action when a MIDI note on event occurs.
     *
     * @since API version 10
     */
    createNoteOnActionMatcher(
      channel: number,
      note: number
    ): HardwareActionMatcher;

    /**
     * Creates a matcher that recognizes a note's on velocity when a MIDI note on event occurs.
     *
     * @since API version 10
     */
    createNoteOnVelocityValueMatcher(
      channel: number,
      note: number
    ): AbsoluteHardwareValueMatcher;

    /**
     * Creates a matcher that recognizes a note's off velocity when a MIDI note off event occurs.
     *
     * @since API version 10
     */
    createNoteOffVelocityValueMatcher(
      channel: number,
      note: number
    ): AbsoluteHardwareValueMatcher;

    /**
     * Creates a matcher that recognizes an action when a MIDI note off event occurs.
     *
     * @since API version 10
     */
    createNoteOffActionMatcher(
      channel: number,
      note: number
    ): HardwareActionMatcher;

    /**
     * Creates a matcher that can match an action from a MIDI event. For example, pressing a button based on
     * input of a MIDI CC event.
     *
     * @param expression
     *           Expression returns true if the event matches
     */
    createActionMatcher(expression: string): HardwareActionMatcher;
  }

  // source: com/bitwig/extension/controller/api/MidiOut.java

  /**
   * Instances of this interface are used to send MIDI messages to a specific MIDI hardware.
   *
   * @since API version 1
   */
  interface MidiOut {
    /**
     * Sends a MIDI message to the hardware device.
     *
     * @param status
     *           the status byte of the MIDI message, system messages are not permitted.
     * @param data1
     *           the data1 part of the MIDI message
     * @param data2
     *           the data2 part of the MIDI message
     * @since API version 1
     */
    sendMidi(status: number, data1: number, data2: number): void;

    /**
     * Sends a MIDI SysEx message to the hardware device.
     *
     * Starting from API version 19, sending invalid sysex will crash the ControllerExtension.
     *
     * @param hexString
     *           the sysex message formatted as hexadecimal value string
     * @since API version 1
     */
    sendSysex(hexString: string): void;

    /**
     * Sends a MIDI SysEx message to the hardware device.
     *
     * Starting from API version 19, sending invalid sysex will crash the ControllerExtension.
     *
     * @param data
     *           the array of bytes to send
     *
     * @since API version 2
     */
    sendSysex(data: number): void;

    /**
     * Sends a MIDI SysEx message to the hardware device. This method is identical to {@link #sendSysex(byte[])}
     * but exists so that Javascript controllers can explicitly call this method instead of relying on some
     * intelligent overload resolution of the Javascript engine based on its loose type system.
     *
     * Starting from API version 19, sending invalid sysex will crash the ControllerExtension.
     *
     * @param data
     *           the array of bytes to send
     * @since API version 2
     */
    sendSysexBytes(data: number): void;

    /**
     * Enables or disables sending MIDI beat clock messages to the hardware depending on the given parameter.
     * Typically MIDI devices that run an internal sequencer such as hardware step sequencers would be
     * interested in MIDI clock messages.
     *
     * @param shouldSendClock
     *           `true` in case the hardware should receive MIDI clock messages, `false` otherwise
     * @deprecated Users should enable the clock from the settings.
     * @since API version 1
     */
    setShouldSendMidiBeatClock(shouldSendClock: boolean): void;
  }

  // source: com/bitwig/extension/controller/api/Mixer.java

  /**
   * An interface used to access various commands that can be performed on the Bitwig Studio mixer panel.<br/>
   *
   * To get an instance of the mixer interface call {@link ControllerHost#createMixer}.
   *
   * @since API version 1
   */
  interface Mixer {
    /**
     * Gets an object that allows to show/hide the meter section of the mixer panel. Observers can be
     * registered on the returned object for receiving notifications when the meter section switches between
     * shown and hidden state.
     *
     * @return a boolean value object that represents the meter section visibility
     * @since API version 1
     */
    isMeterSectionVisible(): SettableBooleanValue;

    /**
     * Gets an object that allows to show/hide the io section of the mixer panel. Observers can be registered
     * on the returned object for receiving notifications when the io section switches between shown and hidden
     * state.
     *
     * @return a boolean value object that represents the io section visibility
     * @since API version 1
     */
    isIoSectionVisible(): SettableBooleanValue;

    /**
     * Gets an object that allows to show/hide the sends section of the mixer panel. Observers can be
     * registered on the returned object for receiving notifications when the sends section switches between
     * shown and hidden state.
     *
     * @return a boolean value object that represents the sends section visibility
     * @since API version 1
     */
    isSendSectionVisible(): SettableBooleanValue;

    /**
     * Gets an object that allows to show/hide the clip launcher section of the mixer panel. Observers can be
     * registered on the returned object for receiving notifications when the clip launcher section switches
     * between shown and hidden state.
     *
     * @return a boolean value object that represents the clip launcher section visibility
     * @since API version 1
     */
    isClipLauncherSectionVisible(): SettableBooleanValue;

    /**
     * Gets an object that allows to show/hide the devices section of the mixer panel. Observers can be
     * registered on the returned object for receiving notifications when the devices section switches between
     * shown and hidden state.
     *
     * @return a boolean value object that represents the devices section visibility
     * @since API version 1
     */
    isDeviceSectionVisible(): SettableBooleanValue;

    /**
     * Gets an object that allows to show/hide the cross-fade section of the mixer panel. Observers can be
     * registered on the returned object for receiving notifications when the cross-fade section switches
     * between shown and hidden state.
     *
     * @return a boolean value object that represents the cross-fade section visibility
     * @since API version 1
     */
    isCrossFadeSectionVisible(): SettableBooleanValue;

    /**
     * Zooms in all mixer tracks, if it the mixer is visible.
     *
     * @since API version 14
     */
    zoomInTrackWidthsAllAction(): HardwareActionBindable;

    zoomInTrackWidthsAll(): void;

    /**
     * Zooms out all mixer tracks, if it the mixer is visible.
     *
     * @since API version 14
     */
    zoomOutTrackWidthsAllAction(): HardwareActionBindable;

    zoomOutTrackWidthsAll(): void;

    /**
     * Same as zoomInTrackWidthsAllAction/zoomOutTrackWidthsAllAction, but as a stepper
     *
     * @since API version 14
     */
    zoomTrackWidthsAllStepper(): RelativeHardwarControlBindable;

    /**
     * Zooms in selected mixer tracks, if it the mixer is visible.
     *
     * @since API version 14
     */
    zoomInTrackWidthsSelectedAction(): HardwareActionBindable;

    zoomInTrackWidthsSelected(): void;

    /**
     * Zooms out selected mixer tracks, if it the mixer is visible.
     *
     * @since API version 14
     */
    zoomOutTrackWidthsSelectedAction(): HardwareActionBindable;

    zoomOutTrackWidthsSelected(): void;

    /**
     * Same as zoomInTrackWidthsSelectedAction/zoomOutTrackWidthsSelectedAction, but as a stepper
     *
     * @since API version 14
     */
    zoomTrackWidthsSelectedStepper(): RelativeHardwarControlBindable;

    /**
     * Registers an observer that reports if the meter section is visible (callback argument is `true`) in the
     * mixer panel or not (callback argument is `false`).
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @see #isMeterSectionVisible()
     * @deprecated call `isMeterSectionVisible().addValueObserver` instead
     * @since API version 1
     */
    addMeterSectionVisibilityObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Registers an observer that reports if the IO section is visible (callback argument is `true`) in the
     * mixer panel or not (callback argument is `false`).
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @see #isIoSectionVisible()
     * @deprecated call `isIoSectionVisible().addValueObserver` instead
     * @since API version 1
     */
    addIoSectionVisibilityObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the send control section is visible (callback argument is `true`)
     * in the mixer panel or not (callback argument is `false`).
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @see #isSendSectionVisible()
     * @deprecated call `isSendSectionVisible().addValueObserver` instead
     * @since API version 1
     */
    addSendsSectionVisibilityObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Registers an observer that reports if the clip launcher section is visible (callback argument is `true`)
     * in the mixer panel or not (callback argument is `false`).
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @see #isClipLauncherSectionVisible()
     * @deprecated call `isClipLauncherSectionVisible().addValueObserver` instead
     * @since API version 1
     */
    addClipLauncherSectionVisibilityObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Registers an observer that reports if the device section is visible (callback argument is `true`) in the
     * mixer panel or not (callback argument is `false`).
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @see #isDeviceSectionVisible()
     * @deprecated call `isDeviceSectionVisible().addValueObserver` instead
     * @since API version 1
     */
    addDeviceSectionVisibilityObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Registers an observer that reports if the cross-fade section is visible (callback argument is `true`) in
     * the mixer panel or not (callback argument is `false`).
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @see #isCrossFadeSectionVisible()
     * @deprecated call `isCrossFadeSectionVisible().addValueObserver` instead
     * @since API version 1
     */
    addCrossFadeSectionVisibilityObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Toggles the visibility of the meter section in the mixer panel.
     *
     * @see #isMeterSectionVisible()
     * @deprecated call `isMeterSectionVisible().toggle()` instead
     * @since API version 1
     */
    toggleMeterSectionVisibility(): void;

    /**
     * Toggles the visibility of the IO section in the mixer panel.
     *
     * @see #isIoSectionVisible()
     * @deprecated call `isIoSectionVisible().toggle()` instead
     * @since API version 1
     */
    toggleIoSectionVisibility(): void;

    /**
     * Toggles the visibility of the send control section in the mixer panel.
     *
     * @see #isSendSectionVisible()
     * @deprecated call `isSendSectionVisible().toggle()` instead
     * @since API version 1
     */
    toggleSendsSectionVisibility(): void;

    /**
     * Toggles the visibility of the clip launcher section in the mixer panel.
     *
     * @see #isClipLauncherSectionVisible()
     * @deprecated call `isClipLauncherSectionVisible().toggle()` instead
     * @since API version 1
     */
    toggleClipLauncherSectionVisibility(): void;

    /**
     * Toggles the visibility of the device section in the mixer panel.
     *
     * @see #isDeviceSectionVisible()
     * @deprecated call `isDeviceSectionVisible().toggle()` instead
     * @since API version 1
     */
    toggleDeviceSectionVisibility(): void;

    /**
     * Toggles the visibility of the cross-fade section in the mixer panel.
     *
     * @see #isCrossFadeSectionVisible()
     * @deprecated call `isCrossFadeSectionVisible().toggle()` instead
     * @since API version 1
     */
    toggleCrossFadeSectionVisibility(): void;
  }

  // source: com/bitwig/extension/controller/api/ModulationSource.java

  /**
   * This interface represents a modulation source in Bitwig Studio.
   *
   * @since API version 1
   */
  interface ModulationSource {
    /**
     * Value which reports when the modulation source is in mapping mode.
     *
     * @since API version 2
     */
    isMapping(): BooleanValue;

    /**
     * Registers an observer which reports when the modulation source is in mapping mode.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #isMapping()} instead.
     */
    addIsMappingObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Toggles the modulation source between mapping mode and normal control functionality.
     *
     * @since API version 1
     */
    toggleIsMapping(): void;

    /**
     * Value the reports the name of the modulation source.
     *
     * @since API version 2
     */
    name(): StringValue;

    /**
     * Registers an observer the reports the name of the modulation source.
     *
     * @param numChars
     *           the maximum number of character the reported name should be long
     * @param textWhenUnassigned
     *           the default text that gets reported if the modulation source is not connected to to a
     *           modulation source in Bitwig Studio yet
     * @param callback
     *           a callback function that receives a single string parameter
     * @since API version 1
     * @deprecated Use {@link #name()} instead.
     */
    addNameObserver(
      numChars: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Value which reports if the modulation source is mapped to any destination(s).
     *
     * @since API version 2
     */
    isMapped(): BooleanValue;

    /**
     * Registers an observer which reports if the modulation source is mapped to any destination(s).
     *
     * @param callback
     *           a callback function that receives a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #isMapped()} instead.
     */
    addIsMappedObserver(callback: BooleanValueChangedCallback): void;
  }

  // source: com/bitwig/extension/controller/api/MultiSampleBrowsingSession.java

  /**
   * Instances of this interface are used for browsing multi-samples, including access to all filter columns and
   * the result column as shown in the 'Multi-Samples' tab of Bitwig Studio's contextual browser window.
   *
   * @see BrowsingSession
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface MultiSampleBrowsingSession extends BrowsingSession {
    /**
     * Returns the file type filter as shown in the category column of the browser.
     *
     * @return the requested file type filter object.
     * @since API version 1
     */
    getFileTypeFilter(): BrowserFilterColumn;
  }

  // source: com/bitwig/extension/controller/api/MultiStateHardwareLight.java

  import Function = java.util.func.Function;
  import IntFunction = java.util.func.IntFunction;

  /**
   * Represents a physical hardware light on a controller. The light has an on/off state and may also be
   * optionally colored.
   *
   * @since API version 10
   */
  interface MultiStateHardwareLight extends HardwareLight {
    /**
     * Object that represents the current state of this light. The interpretation of this value is entirely up
     * to the implementation.
     */
    state(): ObjectHardwareProperty<InternalHardwareLightState>;

    /**
     * Sets a function that can be used to convert a color to the closest possible state representing that
     * color. Once this function has been provided it is possible to then use the convenient
     * {@link #setColor(Color)} and {@link #setColorSupplier(Supplier)} methods.
     */
    setColorToStateFunction(
      func: Function<Color, InternalHardwareLightState>
    ): void;

    /**
     * Tries to set this light's state to be the best state to represent the supplied {@link Color}. For this
     * to be used you must first call {@link #setColorToStateFunction(IntFunction)}.
     */
    setColor(color: Color): void;

    /**
     * Tries to set this light's state to be the best state to represent the value supplied by the
     * {@link Supplier}. For this to be used you must first call {@link #setColorToStateFunction(IntFunction)}.
     */
    setColorSupplier(colorSupplier: Supplier<Color>): void;

    /**
     * Determines the best light state for the supplied color. For this to be used you must first call
     * {@link #setColorToStateFunction(IntFunction)}.
     */
    getBestLightStateForColor(color: Color): InternalHardwareLightState;
  }

  // source: com/bitwig/extension/controller/api/MusicBrowsingSession.java

  /**
   * Instances of this interface are used for browsing music files, including access to all filter columns and
   * the result column as shown in the 'Music' tab of Bitwig Studio's contextual browser window.
   *
   * @see BrowsingSession
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface MusicBrowsingSession extends BrowsingSession {
    /**
     * Returns the file type filter as shown in the category column of the browser.
     *
     * @return the requested file type filter object.
     * @since API version 1
     */
    getFileTypeFilter(): BrowserFilterColumn;
  }

  // source: com/bitwig/extension/controller/api/NoteInput.java

  enum NoteExpression {
    NONE = 0,
    PITCH_DOWN = 1,
    PITCH_UP = 2,
    GAIN_DOWN = 3,
    GAIN_UP = 4,
    PAN_LEFT = 5,
    PAN_RIGHT = 6,
    TIMBRE_DOWN = 7,
    TIMBRE_UP = 8,
  }

  /**
   * Instances of this interface implement note input functionality used for recording notes in Bitwig Studio
   * and for playing the instruments in tracks on hardware keyboards. In Bitwig Studio the note inputs are shown
   * in the input choosers of Bitwig Studio tracks.
   *
   * @since API version 1
   */
  interface NoteInput {
    /**
     * Specifies if the note input should consume MIDI notes, or in other words if it should prevent forwarding
     * incoming notes to the MIDI callback registered in {@link MidiIn#setMidiCallback}. This setting is `true`
     * by default.
     *
     * @param shouldConsumeEvents
     *           `true` if note events should be consumed, `false` of the events should be additionally sent to
     *           the callback registered via {@link MidiIn#setMidiCallback}
     * @since API version 1
     */
    setShouldConsumeEvents(shouldConsumeEvents: boolean): void;

    /**
     * Specifies a translation table which defines the actual key value (0-127) of notes arriving in Bitwig
     * Studio for each note key potentially received from the hardware. This is used for note-on/off and
     * polyphonic aftertouch events. Specifying a value of `-1` for a key means that notes with the key value
     * will be filtered out.
     *
     * Typically this method is used to implement transposition or scale features in controller scripts. By
     * default an identity transform table is configured, which means that all incoming MIDI notes keep their
     * original key value when being sent into Bitwig Studio.
     *
     * @param table
     *           an array which should contain 128 entries. Each entry should be a note value in the range
     *           [0..127] or -1 in case of filtering.
     * @since API version 1
     */
    setKeyTranslationTable(table: number[]): void;

    /**
     * Specifies a translation table which defines the actual velocity value (0-127) of notes arriving in
     * Bitwig Studio for each note velocity potentially received from the hardware. This is used for note-on
     * events only.
     *
     * Typically this method is used to implement velocity curves or fixed velocity mappings in controller
     * scripts. By default an identity transform table is configured, which means that all incoming MIDI notes
     * keep their original velocity when being sent into Bitwig Studio.
     *
     * @param table
     *           an array which should contain 128 entries. Each entry should be a note value in the range
     *           [0..127] or -1 in case of filtering.
     * @since API version 1
     */
    setVelocityTranslationTable(table: number[]): void;

    /**
     * Assigns polyphonic aftertouch MIDI messages to the specified note expression. Multi-dimensional control
     * is possible by calling this method several times with different MIDI channel parameters. If a key
     * translation table is configured by calling {@link #setKeyTranslationTable}, that table is used for
     * polyphonic aftertouch as well.
     *
     * @param channel
     *           the MIDI channel to map, range [0..15]
     * @param expression
     *           the note-expression to map for the given MIDI channel
     * @param pitchRange
     *           the pitch mapping range in semitones, values must be in the range [1..24]. This parameter is
     *           ignored for non-pitch expressions.
     * @since API version 1
     */
    assignPolyphonicAftertouchToExpression(
      channel: number,
      expression: NoteExpression,
      pitchRange: number
    ): void;

    /**
     * Enables use of Expressive MIDI mode. (note-per-channel)
     *
     * @param useExpressiveMidi
     *           enabled/disable the MPE mode for this note-input
     * @param baseChannel
     *           which channel (must be either 0 or 15) which is used as the base for this note-input
     * @param pitchBendRange
     *           initial pitch bend range used
     */
    setUseExpressiveMidi(
      useExpressiveMidi: boolean,
      baseChannel: number,
      pitchBendRange: number
    ): void;

    /**
     * Enables use of Multidimensional Polyphonic Expression mode. (note-per-channel)
     *
     * @param useMPE
     *           enabled/disable the MPE mode for this note-input
     * @param baseChannel
     *           which channel (must be either 0 or 15) which is used as the base for this note-input
     */
    setUseMultidimensionalPolyphonicExpression(
      useMPE: boolean,
      baseChannel: number
    ): void;

    /**
     * Sends MIDI data directly to the note input. This will bypass both the event filter and translation
     * tables. The MIDI channel of the message will be ignored.
     *
     * @param status
     *           the status byte of the MIDI message
     * @param data0
     *           the data0 part of the MIDI message
     * @param data1
     *           the data1 part of the MIDI message
     * @since API version 1
     */
    sendRawMidiEvent(status: number, data0: number, data1: number): void;

    /**
     * Creates a proxy object to the NoteInput's NoteLatch component.
     *
     * @since API version 10
     */
    noteLatch(): NoteLatch;

    /**
     * Creates a proxy object to the NoteInput's Arpeggiator component.
     *
     * @since API version 10
     */
    arpeggiator(): Arpeggiator;

    /**
     * Should this note input be included in the "All Inputs" note source?
     *
     * @since API version 10
     */
    includeInAllInputs(): SettableBooleanValue;
  }

  // source: com/bitwig/extension/controller/api/NoteLatch.java

  /**
   * Creates a proxy object to the NoteInput's NoteLatch component.
   *
   * @since API version 10
   */
  interface NoteLatch extends ObjectProxy {
    /**
     * Returns an object to enable or disable the note latch component.
     *
     * @since API version 10
     */
    isEnabled(): SettableBooleanValue;

    /**
     * Returns an object to configure the note latch mode.
     * Possible values:
     *  - chord
     *  - toggle
     *  - velocity
     *
     * @since API version 10
     */
    mode(): SettableEnumValue;

    /**
     * Only one note at a time.
     * @since API version 10
     */
    mono(): SettableBooleanValue;

    /**
     * The velocity threshold used by the velocity latch mode.
     * @since API version 10
     */
    velocityThreshold(): SettableIntegerValue;

    /**
     * How many notes are being latched.
     * @since API version 10
     */
    activeNotes(): IntegerValue;

    /**
     * Release all notes being latched.
     * @since API version 10
     */
    releaseNotes(): void;
  }

  // source: com/bitwig/extension/controller/api/NoteOccurrence.java

  enum NoteOccurrence {
    ALWAYS = 0,
    FIRST = 1,
    NOT_FIRST = 2,
    PREV = 3,
    NOT_PREV = 4,
    PREV_CHANNEL = 5,
    NOT_PREV_CHANNEL = 6,
    PREV_KEY = 7,
    NOT_PREV_KEY = 8,
    FILL = 9,
    NOT_FILL = 10,
  }

  // source: com/bitwig/extension/controller/api/NoteStep.java

  enum State {
    Empty = 0,
    NoteOn = 1,
    NoteSustain = 2,
  }

  /**
   * Object that describes the content of a step at a given position: x for the time, and y for the key.
   *
   * @since API version 10
   */
  interface NoteStep {
    /**
     * @return the position of the step (time)
     * @since API version 10
     */
    x(): number;

    /**
     * @return the position of the step (key)
     * @since API version 10
     */
    y(): number;

    /**
     * @return the note's channel, in the range 0..15.
     * @since API version 10
     */
    channel(): number;

    /**
     * @return the state of the step, it lets you know if a note starts.
     * @since API version 10
     */
    state(): State;

    /**
     * @return the velocity of the step, in the range 0..1
     * @since API version 10
     */
    velocity(): number;

    /**
     * If there is a note started at this position, it will update the velocity of the note.
     * @param velocity between 0 and 1
     * @since API version 10
     */
    setVelocity(velocity: number): void;

    /**
     * @return the release velocity of the step, in the range 0..1
     * @since API version 10
     */
    releaseVelocity(): number;

    /**
     * If there is a note started at this position, it will update the release velocity of the note.
     * @param velocity between 0 and 1
     * @since API version 10
     */
    setReleaseVelocity(velocity: number): void;

    /**
     * @since API version 14
     */
    velocitySpread(): number;

    /**
     * @since API version 14
     * @param amount velocity spread amount in the range 0..1
     */
    setVelocitySpread(amount: number): void;

    /**
     * @return the duration of the step in beats
     * @since API version 10
     */
    duration(): number;

    /**
     * If there is a note started at this position, it will update the duration of the note.
     * @param duration in beats
     * @since API version 10
     */
    setDuration(duration: number): void;

    /**
     * @return the pan of the step in the range -1..1
     * @since API version 10
     */
    pan(): number;

    /**
     * If there is a note started at this position, it will update the panning of the note.
     * @param pan -1 for left, +1 for right
     * @since API version 10
     */
    setPan(pan: number): void;

    /**
     * @return the timbre of the step, in the range -1..1
     * @since API version 10
     */
    timbre(): number;

    /**
     * If there is a note started at this position, it will update the timbre of the note.
     * @param timbre from -1 to +1
     * @since API version 10
     */
    setTimbre(timbre: number): void;

    /**
     * @return the pressure of the step, in the range 0..1
     * @since API version 10
     */
    pressure(): number;

    /**
     * If there is a note started at this position, it will update the pressure of the note.
     * @param pressure from 0 to +1
     * @since API version 10
     */
    setPressure(pressure: number): void;

    /**
     * @return the gain of the step, in the range 0..1
     * @since API version 10
     */
    gain(): number;

    /**
     * If there is a note started at this position, it will update the gain of the note.
     * @param gain in the range 0..1, a value of 0.5 results in a gain of 0dB.
     * @since API version 10
     */
    setGain(gain: number): void;

    /**
     * @return the transpose of the step, in semitones
     * @since API version 10
     */
    transpose(): number;

    /**
     * If there is a note started at this position, it will update the pitch offset of the note.
     * @param transpose in semitones, from -96 to +96
     * @since API version 10
     */
    setTranspose(transpose: number): void;

    /**
     * @return true if a note exists and is selected
     * @since API version 10
     */
    isIsSelected(): boolean;

    /**
     * Gets the note chance.
     * @return the probability, 0..1
     * @since API version 14
     */
    chance(): number;

    /**
     * Sets the note chance.
     * @param chance 0..1
     * @since API version 14
     */
    setChance(chance: number): void;

    /**
     * @since API version 14
     */
    isChanceEnabled(): boolean;

    /**
     * @since API version 14
     */
    setIsChanceEnabled(isEnabled: boolean): void;

    /**
     * @since API version 14
     */
    isOccurrenceEnabled(): boolean;

    /**
     * @since API version 14
     */
    setIsOccurrenceEnabled(isEnabled: boolean): void;

    /**
     * @since API version 14
     */
    occurrence(): NoteOccurrence;

    /**
     * @since API version 14
     */
    setOccurrence(condition: NoteOccurrence): void;

    /**
     * @since API version 14
     */
    isRecurrenceEnabled(): boolean;

    /**
     * @since API version 14
     */
    setIsRecurrenceEnabled(isEnabled: boolean): void;

    /**
     * @since API version 14
     */
    recurrenceLength(): number;

    /**
     * @since API version 14
     */
    recurrenceMask(): number;

    /**
     * @param length from 1 to 8
     * @param mask bitfield, cycle N -> bit N; max 8 cycles
     * @since API version 14
     */
    setRecurrence(length: number, mask: number): void;

    /**
     * @since API version 14
     */
    isRepeatEnabled(): boolean;

    /**
     * @since API version 14
     */
    setIsRepeatEnabled(isEnabled: boolean): void;

    /**
     * @since API version 14
     */
    repeatCount(): number;

    /**
     * @param count -127..127, positive values indicates a number of divisions, negative values a rate.
     * @since API version 14
     */
    setRepeatCount(count: number): void;

    /**
     * @since API version 14
     */
    repeatCurve(): number;

    /**
     * @param curve -1..1
     * @since API version 14
     */
    setRepeatCurve(curve: number): void;

    /**
     * @since API version 14
     */
    repeatVelocityEnd(): number;

    /**
     * @param velocityEnd -1..1, relative velocity amount applied to the note on velocity.
     * @since API version 14
     */
    setRepeatVelocityEnd(velocityEnd: number): void;

    /**
     * @since API version 14
     */
    repeatVelocityCurve(): number;

    /**
     * @param curve -1..1
     * @since API version 14
     */
    setRepeatVelocityCurve(curve: number): void;

    /**
     * @return true if the note is muted
     * @since API version 14
     */
    isMuted(): boolean;

    /**
     * Mutes the note if values is true.
     * @since API version 14
     */
    setIsMuted(value: boolean): void;
  }

  // source: com/bitwig/extension/controller/api/NotificationSettings.java

  /**
   * Bitwig Studio supports automatic visual feedback from controllers that shows up as popup notifications. For
   * example when the selected track or the current device preset was changed on the controller, these
   * notifications are shown, depending on the configuration.
   *
   * It depends both on the users preference and the capabilities of the controller hardware if a certain
   * notification should be shown. This interface provides functions for enabling/disabling the various kinds of
   * automatic notifications from the hardware point of view. Typically, controllers that include an advanced
   * display don't need to show many notifications additionally on screen. For other controllers that do not
   * include a display it might be useful to show all notifications. By default all notifications are disabled.
   *
   * In addition, the user can enable or disable all notifications the have been enabled using this interface in
   * the preferences dialog of Bitwig Studio.
   *
   * @since API version 1
   */
  interface NotificationSettings {
    /**
     * Returns an object that reports if user notifications are enabled and that allows to enable/disable user
     * notifications from the control surface. If user notifications are disabled, no automatic notifications
     * will be shown in the Bitwig Studio user interface. If user notifications are enabled, all automatic
     * notifications will be shown that are enabled using the methods of this interface.
     *
     * @return a boolean value object
     * @since API version 1
     */
    getUserNotificationsEnabled(): SettableBooleanValue;

    /**
     * Specifies if user notification related to selection changes should be shown. Please note that this
     * setting only applies when user notifications are enabled in general, otherwise no notification are
     * shown. By default this setting is `false`.
     *
     * @param shouldShowNotifications
     *           `true` in case selection notifications should be shown, `false` otherwise.
     * @see #getUserNotificationsEnabled()
     * @since API version 1
     */
    setShouldShowSelectionNotifications(shouldShowNotifications: boolean): void;

    /**
     * Specifies if user notification related to selection changes should be shown. Please note that this
     * setting only applies when user notifications are enabled in general, otherwise no notification are
     * shown. By default this setting is `false`.
     *
     * @param shouldShowNotifications
     *           `true` in case selection notifications should be shown, `false` otherwise.
     * @see #getUserNotificationsEnabled()
     * @since API version 1
     */
    setShouldShowChannelSelectionNotifications(
      shouldShowNotifications: boolean
    ): void;

    /**
     * Specifies if user notification related to selection changes should be shown. Please note that this
     * setting only applies when user notifications are enabled in general, otherwise no notification are
     * shown. By default this setting is `false`.
     *
     * @param shouldShowNotifications
     *           `true` in case selection notifications should be shown, `false` otherwise.
     * @see #getUserNotificationsEnabled()
     * @since API version 1
     */
    setShouldShowTrackSelectionNotifications(
      shouldShowNotifications: boolean
    ): void;

    /**
     * Specifies if user notification related to selection changes should be shown. Please note that this
     * setting only applies when user notifications are enabled in general, otherwise no notification are
     * shown. By default this setting is `false`.
     *
     * @param shouldShowNotifications
     *           `true` in case selection notifications should be shown, `false` otherwise.
     * @see #getUserNotificationsEnabled()
     * @since API version 1
     */
    setShouldShowDeviceSelectionNotifications(
      shouldShowNotifications: boolean
    ): void;

    /**
     * Specifies if user notification related to selection changes should be shown. Please note that this
     * setting only applies when user notifications are enabled in general, otherwise no notification are
     * shown. By default this setting is `false`.
     *
     * @param shouldShowNotifications
     *           `true` in case selection notifications should be shown, `false` otherwise.
     * @see #getUserNotificationsEnabled()
     * @since API version 1
     */
    setShouldShowDeviceLayerSelectionNotifications(
      shouldShowNotifications: boolean
    ): void;

    /**
     * Specifies if user notification related to selection changes should be shown. Please note that this
     * setting only applies when user notifications are enabled in general, otherwise no notification are
     * shown.
     *
     * @param shouldShowNotifications
     *           `true` in case selection notifications should be shown, `false` otherwise.
     * @see #getUserNotificationsEnabled()
     * @since API version 1
     */
    setShouldShowPresetNotifications(shouldShowNotifications: boolean): void;

    /**
     * Specifies if user notification related to selection changes should be shown. Please note that this
     * setting only applies when user notifications are enabled in general, otherwise no notification are
     * shown. By default this setting is `false`.
     *
     * @param shouldShowNotifications
     *           `true` in case selection notifications should be shown, `false` otherwise.
     * @see #getUserNotificationsEnabled()
     * @since API version 1
     */
    setShouldShowMappingNotifications(shouldShowNotifications: boolean): void;

    /**
     * Specifies if user notification related to selection changes should be shown. Please note that this
     * setting only applies when user notifications are enabled in general, otherwise no notification are
     * shown. By default this setting is `false`.
     *
     * @param shouldShowNotifications
     *           `true` in case selection notifications should be shown, `false` otherwise.
     * @see #getUserNotificationsEnabled()
     * @since API version 1
     */
    setShouldShowValueNotifications(shouldShowNotifications: boolean): void;
  }

  // source: com/bitwig/extension/controller/api/ObjectArrayValue.java

  import ObjectValueChangedCallback = com.bitwig.extension.callback.ObjectValueChangedCallback;

  /**
   * @since API version 2
   */
  interface ObjectArrayValue<ObjectType>
    extends Value<ObjectValueChangedCallback<ObjectType[]>>,
      Supplier<ObjectType[]> {
    /**
     * @since API version 2
     */
    get(): ObjectType[];

    /**
     * @since API version 2
     */
    get(index: number): ObjectType;

    /**
     * @since API version 7
     */
    isEmpty(): boolean;
  }

  // source: com/bitwig/extension/controller/api/ObjectHardwareProperty.java

  /**
   * Represents an output value shown on some hardware.
   *
   * @since API version 10
   */
  interface ObjectHardwareProperty<T> extends HardwareProperty {
    /** Gets the current value. This is the value that should be sent to the hardware to be displayed. */
    currentValue(): T;

    /** The value that was last sent to the hardware. */
    lastSentValue(): T;

    /**
     * Specifies a callback that should be called with the value that needs to be sent to the hardware. This
     * callback is called as a result of calling the {@link HardwareSurface#updateHardware()} method (typically
     * from the flush method).
     */
    onUpdateHardware(sendValueConsumer: Consumer<T>): void;

    /** Sets the current value. */
    setValue(value: T): void;

    /** Sets the current value from a {@link BooleanSupplier} that supplies the latest value. */
    setValueSupplier(supplier: Supplier<T>): void;
  }

  // source: com/bitwig/extension/controller/api/ObjectProxy.java

  /**
   * Interface for an object that acts as a proxy for the actual object in Bitwig Studio (for example a track, a
   * device etc).
   *
   * @since API version 2
   */
  interface ObjectProxy extends Subscribable {
    /**
     * Returns a value object that indicates if the object being proxied exists, or if it has content.
     */
    exists(): BooleanValue;

    /**
     * Creates a {@link BooleanValue} that determines this proxy is considered equal to another proxy. For this
     * to be the case both proxies need to be proxying the same target object.
     *
     * @since API version 3
     */
    createEqualsValue(other: ObjectProxy): BooleanValue;
  }

  // source: com/bitwig/extension/controller/api/OnOffHardwareLight.java

  /**
   * Defines a simple hardware light that only has an on and off state.
   *
   * @since API version 10
   */
  interface OnOffHardwareLight extends HardwareLight {
    /** Property that determines if this light is on or not. */
    isOn(): BooleanHardwareProperty;

    setOnColor(color: Color): void;

    setOffColor(color: Color): void;

    setOnVisualState(state: HardwareLightVisualState): void;

    setOffVisualState(state: HardwareLightVisualState): void;

    /**
     *
     * @deprecated Typo in method name use {@link #setStateToVisualStateFunction(Function)} instead
     */
    setStateToVisualStateFuncation(
      func: Function<boolean, HardwareLightVisualState>
    ): void;

    setStateToVisualStateFunction(
      func: Function<boolean, HardwareLightVisualState>
    ): void;
  }

  // source: com/bitwig/extension/controller/api/OutputPipe.java

  /**
   * A pipe that can be used to write data.
   *
   * @since API version 7
   * */
  interface OutputPipe extends Pipe {
    /**
     * Requests to write some data to this pipe in an asynchronous way (the caller is not blocked). Once some
     * data has been written the callback will be notified on the controller's thread.
     *
     * @param data
     *           A {@link MemoryBlock} containing the data to be written.
     * @param callback
     *           A callback that is notified on the controller's thread when the write has completed.
     * @param timeoutInMs
     *           A timeout in milliseconds that will result in an error and termination of the controller if
     *           the write does not happen in this time. For infinite timeout use 0.
     */
    writeAsync(
      data: MemoryBlock,
      callback: AsyncTransferCompledCallback,
      timeoutInMs: number
    ): void;

    write(data: MemoryBlock, timeoutInMs: number): number;
  }

  // source: com/bitwig/extension/controller/api/Parameter.java

  /**
   * Instances of this interface represent ranged parameters that can be controlled with automation in Bitwig
   * Studio.
   *
   * @since API version 1
   */
  interface Parameter extends SettableRangedValue, ObjectProxy {
    /**
     * Gets the current value of this parameter.
     *
     * @since API version 2
     */
    value(): SettableRangedValue;

    /**
     * Gets the modulated value of this parameter.
     *
     * @since API version 2
     */
    modulatedValue(): RangedValue;

    /**
     * The name of the parameter.
     *
     * @since API version 2
     */
    name(): StringValue;

    /**
     * Adds an observer which reports changes to the name of the automated parameter. The callback will get
     * called at least once immediately after calling this method for reporting the current name.
     *
     * @param maxChars
     *           maximum length of the string sent to the observer
     * @param textWhenUnassigned
     *           the default text to use
     * @param callback
     *           a callback function that receives a single string parameter
     * @since API version 1
     * @deprecated
     */
    addNameObserver(
      maxChars: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Adds an observer which sends a formatted text representation of the value whenever the value changes.
     * The callback will get called at least once immediately after calling this method for reporting the
     * current state.
     *
     * @param maxChars
     *           maximum length of the string sent to the observer
     * @param textWhenUnassigned
     *           the default text to use
     * @param callback
     *           a callback function that receives a single string parameter
     * @since API version 1
     * @deprecated Use {@link #value()#displayedValue()} instead
     */
    addValueDisplayObserver(
      maxChars: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Resets the value to its default.
     *
     * @since API version 1
     */
    reset(): void;

    /**
     * Touch (or un-touch) the value for automation recording.
     *
     * @param isBeingTouched
     *           `true` for touching, `false` for un-touching
     * @since API version 1
     */
    touch(isBeingTouched: boolean): void;

    /**
     * Specifies if this value should be indicated as mapped in Bitwig Studio, which is visually shown as
     * colored dots or tinting on the parameter controls.
     *
     * @param shouldIndicate
     *           `true` in case visual indications should be shown in Bitwig Studio, `false` otherwise
     * @since API version 1
     */
    setIndication(shouldIndicate: boolean): void;

    /**
     * Specifies a label for the mapped hardware parameter as shown in Bitwig Studio, for example in menu items
     * for learning controls.
     *
     * @param label
     *           the label to be shown in Bitwig Studio
     * @since API version 1
     */
    setLabel(label: string): void;

    /**
     * Restores control of this parameter to automation playback.
     *
     * @since API version 1
     */
    restoreAutomationControl(): void;

    /**
     * Boolean value that is true if the parameter has automation data.
     *
     * @since API version 19
     */
    hasAutomation(): BooleanValue;

    /**
     * Deletes all automation for this parameter.
     *
     * @since API version 19
     */
    deleteAllAutomation(): void;
  }

  // source: com/bitwig/extension/controller/api/ParameterBank.java

  /**
   * Defines a bank of parameters.
   *
   * @since API version 2
   */
  interface ParameterBank {
    /**
     * Gets the number of slots that these remote controls have.
     *
     * @since API version 2
     */
    getParameterCount(): number;

    /**
     * Returns the parameter at the given index within the bank.
     *
     * @param indexInBank
     *           the parameter index within this bank. Must be in the range [0..getParameterCount()-1].
     * @return the requested parameter
     * @since API version 2
     */
    getParameter(indexInBank: number): Parameter;

    /**
     * Informs the application how to display the controls during the on screen notification.
     *
     * @param type which kind of hardware control is used for this bank (knobs/encoders/sliders)
     * @param columns How wide this section is in terms of layout (4/8/9)
     *
     * @since API version 7
     */
    setHardwareLayout(type: HardwareControlType, columns: number): void;
  }

  // source: com/bitwig/extension/controller/api/PianoKeyboard.java

  /**
   * Represents a physical piano keyboard on a {@link HardwareSurface}.
   */
  interface PianoKeyboard extends HardwareElement {
    /**
     * The {@link MidiIn} where this piano keyboard would send key presses. If set this allows the simulator
     * for the hardware to simulate the note input.
     */
    setMidiIn(midiIn: MidiIn): void;

    /**
     * Sets the {@link NoteInput} that this keyboard should send notes to.
     *
     * @since API version 15
     */
    setNoteInput(noteInput: NoteInput): void;

    setChannel(channel: number): void;

    setIsVelocitySensitive(value: boolean): void;

    setSupportsPolyAftertouch(value: boolean): void;
  }

  // source: com/bitwig/extension/controller/api/PinnableCursor.java

  /**
   * Interface that defines a cursor that can be "pinned".
   *
   * @since API version 2
   */
  interface PinnableCursor extends Cursor {
    /**
     * Determines if this cursor is currently pinned or not. If the cursor is pinned then it won't follow the
     * selection the user makes in the application.
     *
     * @since API version 2
     */
    isPinned(): SettableBooleanValue;
  }

  // source: com/bitwig/extension/controller/api/PinnableCursorClip.java

  /**
   * Cursor clip that can act independently from the user's clip selection if desired by being pinned in the
   * controller settings panel.
   *
   * @since API version 10
   */
  interface PinnableCursorClip extends CursorClip, PinnableCursor {}

  // source: com/bitwig/extension/controller/api/PinnableCursorDevice.java

  /**
   * Cursor that can be pinned to the current device or follow the selection.
   *
   * @since API version 2
   */
  interface PinnableCursorDevice extends CursorDevice, PinnableCursor {}

  // source: com/bitwig/extension/controller/api/Pipe.java

  /**
   * A pipe represents a communication channel with some other hardware device or network service. Pipes are
   * opened and closed by Bitwig Studio automatically and exist for the entire lifetime of a controller. If
   * communication is lost on a specific pipe (for example the user unplugs a USB device) then the controller
   * will exit and the user will be notified.
   *
   * A controller defines which pipes it wants to establish for communication using a
   * {@link HardwareDeviceMatcher}.
   *
   * @see ControllerExtensionDefinition#listHardwareDevices(com.bitwig.extension.controller.HardwareDeviceMatcherList)
   *
   * @since API version 7
   */
  interface Pipe {}

  // source: com/bitwig/extension/controller/api/PlayingNote.java

  /**
   * @since API version 2
   */
  interface PlayingNote {
    /**
     * @since API version 2
     */
    pitch(): number;

    /**
     * @since API version 2
     */
    velocity(): number;
  }

  // source: com/bitwig/extension/controller/api/PlayingNoteArrayValue.java

  /**
   * @since API version 2
   */
  interface PlayingNoteArrayValue extends ObjectArrayValue<PlayingNote> {
    isNotePlaying(note: number): boolean;
  }

  // source: com/bitwig/extension/controller/api/PopupBrowser.java

  /**
   * Object that represents the popup browser in Bitwig Studio.
   *
   * @since API version 2
   */
  interface PopupBrowser extends ObjectProxy, RelativeHardwarControlBindable {
    /**
     * The title of the popup browser.
     *
     * @since API version 2
     */
    title(): StringValue;

    /**
     * Value that reports the possible content types that can be inserted by the popup browser. These are
     * represented by the tabs in Bitwig Studio's popup browser.
     *
     * (e.g "Device", "Preset", "Sample" etc.)
     *
     * @since API version 2
     */
    contentTypeNames(): StringArrayValue;

    /**
     * Value that represents the selected content type.
     *
     * @since API version 2
     */
    selectedContentTypeName(): StringValue;

    /**
     * Value that represents the index of the selected content type within the content types supported.
     *
     * @since API version 2
     */
    selectedContentTypeIndex(): SettableIntegerValue;

    /**
     * The smart collections column of the browser.
     *
     * @since API version 2
     */
    smartCollectionColumn(): BrowserFilterColumn;

    /**
     * The location column of the browser.
     *
     * @since API version 2
     */
    locationColumn(): BrowserFilterColumn;

    /**
     * The device column of the browser.
     *
     * @since API version 2
     */
    deviceColumn(): BrowserFilterColumn;

    /**
     * The category column of the browser.
     *
     * @since API version 2
     */
    categoryColumn(): BrowserFilterColumn;

    /**
     * The tag column of the browser.
     *
     * @since API version 2
     */
    tagColumn(): BrowserFilterColumn;

    /**
     * The device type column of the browser.
     *
     * @since API version 2
     */
    deviceTypeColumn(): BrowserFilterColumn;

    /**
     * The file type column of the browser.
     *
     * @since API version 2
     */
    fileTypeColumn(): BrowserFilterColumn;

    /**
     * The creator column of the browser.
     *
     * @since API version 2
     */
    creatorColumn(): BrowserFilterColumn;

    /**
     * Column that represents the results of the search.
     *
     * @since API version 2
     */
    resultsColumn(): BrowserResultsColumn;

    /**
     * Value that indicates if the browser is able to audition material in place while browsing.
     *
     * @since API version 2
     */
    canAudition(): BooleanValue;

    /**
     * Value that decides if the browser is currently auditioning material in place while browsing or not.
     *
     * @since API version 2
     */
    shouldAudition(): SettableBooleanValue;

    /**
     * Selects the next file.
     *
     * @since API version 2
     */
    selectNextFile(): void;

    /**
     * Action that selects the next file
     *
     * @since API version 15
     */
    selectNextFileAction(): HardwareActionBindable;

    /**
     * Selects the previous file.
     *
     * @since API version 2
     */
    selectPreviousFile(): void;

    /**
     * Action that selects the next file
     *
     * @since API version 15
     */
    selectPreviousFileAction(): HardwareActionBindable;

    /**
     * Selects the first file.
     *
     * @since API version 2
     */
    selectFirstFile(): void;

    /**
     * Selects the last file.
     *
     * @since API version 2
     */
    selectLastFile(): void;

    /**
     * Cancels the popup browser.
     *
     * @since API version 2
     */
    cancel(): void;

    cancelAction(): HardwareActionBindable;

    /**
     * Commits the selected item in the popup browser.
     *
     * @since API version 2
     */
    commit(): void;

    commitAction(): HardwareActionBindable;
  }

  // source: com/bitwig/extension/controller/api/Preferences.java

  /**
   * This interface is used to store custom controller settings into the Bitwig Studio preferences. The settings
   * are shown to the user in the controller preferences dialog of Bitwig Studio.
   *
   * @since API version 1
   */
  interface Preferences extends Settings {}

  // source: com/bitwig/extension/controller/api/PresetBrowsingSession.java

  /**
   * Instances of this interface are used for browsing presets, including access to all filter columns and the
   * result column as shown in the 'Presets' tab of Bitwig Studio's contextual browser window.
   *
   * @see BrowsingSession
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface PresetBrowsingSession extends BitwigBrowsingSession {
    /**
     * Returns the category filter as shown in the category column of the browser.
     *
     * @return the requested category filter object.
     * @since API version 1
     */
    getCategoryFilter(): BrowserFilterColumn;

    /**
     * Returns the preset type filter as shown in the category column of the browser.
     *
     * @return the requested preset type filter object.
     * @since API version 1
     */
    getPresetTypeFilter(): BrowserFilterColumn;

    /**
     * Returns the file type filter as shown in the category column of the browser.
     *
     * @return the requested file type filter object.
     * @since API version 1
     */
    getFileTypeFilter(): BrowserFilterColumn;
  }

  // source: com/bitwig/extension/controller/api/PrimaryDevice.java

  enum ChainLocation {
    FIRST = 0,
    NEXT = 1,
    PREVIOUS = 2,
    LAST = 3,
  }

  enum DeviceType {
    ANY = 0,
  }

  /**
   * A special kind of device that represents the primary device of a track.
   *
   * @since API version 1
   * @deprecated This is now replaced by creating a named {@link CursorDevice}.
   * @see Track#createCursorDevice(String)
   */
  interface PrimaryDevice extends Device {
    /**
     * Makes the device with the given type and location the new primary device.
     *
     * @param deviceType
     *           the requested device type of the new primary device
     * @param chainLocation
     *           the requested chain location of the new primary device
     * @since API version 1
     */
    switchToDevice(deviceType: DeviceType, chainLocation: ChainLocation): void;

    /**
     * Registers an observer that reports if navigation to another device with the provided characteristics is
     * possible.
     *
     * @param deviceType
     *           the requested device type of the new primary device
     * @param chainLocation
     *           the requested chain location of the new primary device
     * @param callback
     *           a callback function the receives a single boolean parameter
     * @since API version 1
     * @deprecated This method never did anything. Please do not use.
     */
    addCanSwitchToDeviceObserver(
      deviceType: DeviceType,
      chainLocation: ChainLocation,
      callback: BooleanValueChangedCallback
    ): void;
  }

  // source: com/bitwig/extension/controller/api/Project.java

  /**
   * An interface for representing the current project.
   *
   * @since API version 1
   */
  interface Project extends ObjectProxy {
    /**
     * Returns an object that represents the root track group of the active Bitwig Studio project.
     *
     * @return the root track group of the currently active project
     * @since API version 1
     */
    getRootTrackGroup(): Track;

    /**
     * Returns an object that represents the top level track group as shown in the arranger/mixer of the active
     * Bitwig Studio project.
     *
     * @return the shown top level track group of the currently active project
     * @since API version 1
     */
    getShownTopLevelTrackGroup(): Track;

    /**
     * Creates a new empty scene as the last scene in the project.
     *
     * @since API version 13
     */
    createScene(): void;

    /**
     * Creates a new scene (using an existing empty scene if possible) from the clips that are currently
     * playing in the clip launcher.
     *
     * @since API version 1
     */
    createSceneFromPlayingLauncherClips(): void;

    /**
     * The volume used for cue output.
     *
     * @since API version 10
     */
    cueVolume(): Parameter;

    /**
     * Mix between cue bus and the studio bus (master).
     *
     * @since API version 10
     */
    cueMix(): Parameter;

    /**
     * Sets the solo state of all tracks to off.
     *
     * @since API version 10
     */
    unsoloAll(): void;

    hasSoloedTracks(): BooleanValue;

    /**
     * Sets the mute state of all tracks to off.
     *
     * @since API version 10
     */
    unmuteAll(): void;

    /**
     * Value that indicates if the project has muted tracks or not.
     *
     * @since API version 10
     */
    hasMutedTracks(): BooleanValue;

    /**
     * Sets the arm state of all tracks to off.
     *
     * @since API version 10
     */
    unarmAll(): void;

    /**
     * Value that indicates if the project has armed tracks or not.
     *
     * @since API version 10
     */
    hasArmedTracks(): BooleanValue;

    /**
     * Value that indicates if the project is modified or not.
     *
     * @since API version 18
     */
    isModified(): BooleanValue;
  }

  // source: com/bitwig/extension/controller/api/RangedValue.java

  /** Instances of this interface represent numeric values that have an upper and lower limit.
   *
   * @since API version 1
   * */
  // @ts-ignore
  interface RangedValue
    extends Value<DoubleValueChangedCallback>,
      DoubleSupplier {
    /**
     * The current value normalized between 0..1 where 0 represents the minimum value and 1 the maximum.
     *
     * @since API version 2
     */
    get(): number;

    /**
     * Gets the current value.
     *
     * @since API version 2
     */
    getRaw(): number;

    getAsDouble(): number;

    /**
     * Value that represents a formatted text representation of the value whenever the value changes.
     *
     * @since API version 2
     */
    displayedValue(): StringValue;

    /**
     * Adds an observer which receives the normalized value of the parameter as an integer number within the
     * range [0..range-1].
     *
     * @param range
     *           the range used to scale the value when reported to the callback
     * @param callback
     *           a callback function that receives a single double parameter
     * @since API version 1
     */
    addValueObserver(
      range: number,
      callback: IntegerValueChangedCallback
    ): void;

    /**
     * Add an observer which receives the internal raw of the parameter as floating point.
     *
     * @param callback
     *           a callback function that receives a single numeric parameter with double precision.
     * @since API version 1
     */
    addRawValueObserver(callback: DoubleValueChangedCallback): void;
  }

  // source: com/bitwig/extension/controller/api/RelativeHardwarControlBindable.java

  /**
   * Something that can be bound to an {@link RelativeHardwareControl} and can respond to the user input (such
   * as user turning an encoder left or right) in a meaningful way.
   *
   * @since API version 10
   */
  interface RelativeHardwarControlBindable extends HardwareBindable {
    /**
     * Binds this target to the supplied hardware control so that when the user moves the hardware control this
     * target will respond in a meaningful way.
     *
     * When the binding is no longer needed the {@link HardwareBinding#removeBinding()} method can be called on
     * it.
     */
    addBinding(
      hardwareControl: RelativeHardwareControl
    ): RelativeHardwareControlBinding;

    /**
     * Binds this target to the supplied hardware control so that when the user moves the hardware control this
     * target will respond in a meaningful way.
     *
     * When the binding is no longer needed the {@link HardwareBinding#removeBinding()} method can be called on
     * it.
     */
    addBindingWithSensitivity(
      hardwareControl: RelativeHardwareControl,
      sensitivity: number
    ): RelativeHardwareControlBinding;
  }

  // source: com/bitwig/extension/controller/api/RelativeHardwareControl.java

  /**
   * Represents a hardware control that can input a relative value (for example, a relative encoder knob).
   *
   * A relative adjustment is positive value when being increased and a negative when being decreased. The
   * relative amount represents the amount of adjustment made. In order to have relative hardware controls work
   * with the same level of sensitivity the relative amount should be +1.0 if the user were to rotate a knob one
   * full rotation (defined as roughly the same amount of rotation as that of an absolute knob to go from 0 to
   * 1) to the right.
   *
   * <p>
   * {@link RelativeHardwareControl}s can also be used to step through items (e.g in a list, or an enum
   * parameter). In this case the {@link #getStepSize()} is used to determine how far the knob has to be rotated
   * in order to increment by one step. For example, if a full rotation of a knob should step through 10 items
   * you would set the step size to 1.0 / 10 (i.e 0.1).
   *
   * @since API version 10
   */
  interface RelativeHardwareControl
    extends ContinuousHardwareControl<RelativeHardwareControlBinding> {
    /**
     * Sets the sensitivity of this hardware control. The default sensitivity is 1. This value is a multiplied
     * with the adjustment coming from the {@link RelativeHardwareValueMatcher} to determine the final
     * adjustment amount.
     */
    setSensitivity(sensitivity: number): void;

    /**
     * Sets the {@link RelativeHardwareValueMatcher} that can be used to detect when the user adjusts the
     * hardware control's value.
     *
     * @see MidiIn#createRelative2sComplementCCValueMatcher(int, int)
     * @see MidiIn#createRelativeSignedBitValueMatcher(AbsoluteHardwareValueMatcher)
     */
    setAdjustValueMatcher(matcher: RelativeHardwareValueMatcher): void;

    /** Adds a binding to the supplied target with the supplied sensitivity. */
    addBindingWithSensitivity(
      target: RelativeHardwarControlBindable,
      sensitivity: number
    ): RelativeHardwareControlBinding;

    /** Makes sure there is a single binding to the supplied target with the supplied sensitivity. */
    setBindingWithSensitivity(
      target: RelativeHardwarControlBindable,
      sensitivity: number
    ): RelativeHardwareControlBinding;

    /**
     * Adds a binding to the supplied target that does not adjust the target outside of the supplied min and
     * max normalized range.
     */
    addBindingWithRange(
      target: SettableRangedValue,
      minNormalizedValue: number,
      maxNormalizedValue: number
    ): RelativeHardwareControlBinding;

    /**
     * Makes sure there is single binding to the supplied target that does not adjust the target outside of the
     * supplied min and max normalized range.
     */
    setBindingWithRange(
      target: SettableRangedValue,
      minNormalizedValue: number,
      maxNormalizedValue: number
    ): RelativeHardwareControlBinding;

    /**
     * Adds a binding to the supplied target that does not adjust the target outside of the supplied min and
     * max normalized range and is adjusted with the supplied sensitivity.
     */
    addBindingWithRangeAndSensitivity(
      target: SettableRangedValue,
      minNormalizedValue: number,
      maxNormalizedValue: number,
      sensitivity: number
    ): RelativeHardwareControlBinding;

    /**
     * Makes sure there is a single binding to the supplied target that does not adjust the target outside of
     * the supplied min and max normalized range and is adjusted with the supplied sensitivity.
     */
    setBindingWithRangeAndSensitivity(
      target: SettableRangedValue,
      minNormalizedValue: number,
      maxNormalizedValue: number,
      sensitivity: number
    ): RelativeHardwareControlBinding;

    /** The current steps size (amount of relative rotation) necessary to step through an item in a list. */
    getStepSize(): number;

    /**
     * Sets the step size of this relative hardware control. The step size is used when using this control to
     * step through items in a list, or values in an enum parameter, for example. For each step forwards a
     * certain action can be invoked and for each step backwards a different action.
     */
    setStepSize(stepSize: number): void;
  }

  // source: com/bitwig/extension/controller/api/RelativeHardwareControlBinding.java

  /**
   * Represents a binding from a {@link RelativeHardwareControl} to some target.
   *
   * @since API version 10
   */
  interface RelativeHardwareControlBinding
    extends HardwareBindingWithSensitivity {}

  // source: com/bitwig/extension/controller/api/RelativeHardwareControlToRangedValueBinding.java

  /**
   * Represents a binding from an {@link RelativeHardwareControl} to a {@link SettableRangedValue}
   *
   * @since API version 10
   */
  interface RelativeHardwareControlToRangedValueBinding
    extends RelativeHardwareControlBinding,
      HardwareBindingWithRange {}

  // source: com/bitwig/extension/controller/api/RelativeHardwareKnob.java

  /**
   * Represents a physical hardware knob that inputs a relative value.
   *
   * @see ControllerHost#createRelativeHardwareKnob()
   *
   * @since API version 10
   */
  interface RelativeHardwareKnob extends RelativeHardwareControl {}

  // source: com/bitwig/extension/controller/api/RelativeHardwareValueMatcher.java

  /**
   * Defines a means of recognizing when a relative value is input by the user (for example, when turning a continuous knob).
   *
   * For example, when a certain MIDI CC message happens.
   *
   * @see MidiIn#createRelative2sComplementCCValueMatcher(int, int)
   * @see MidiIn#createRelativeBinOffsetCCValueMatcher(int, int)
   * @see MidiIn#createRelativeSignedBit2CCValueMatcher(int, int)
   *
   * @since API version 10
   *
   */
  interface RelativeHardwareValueMatcher
    extends ContinuousHardwareValueMatcher {}

  // source: com/bitwig/extension/controller/api/RelativePosition.java

  enum RelativePosition {
    ABOVE = 0,
    BELOW = 1,
    LEFT = 2,
    RIGHT = 3,
    INSIDE = 4,
  }

  // source: com/bitwig/extension/controller/api/RemoteConnection.java

  import NoArgsCallback = com.bitwig.extension.callback.NoArgsCallback;

  /**
   * Instances of this interface are reported to the supplied script callback when connecting to a remote TCP
   * socket via {@link ControllerHost#connectToRemoteHost}.
   *
   * @see {@link ControllerHost#connectToRemoteHost}
   * @since API version 1
   */
  interface RemoteConnection {
    /**
     * Disconnects from the remote host.
     *
     * @since API version 1
     */
    disconnect(): void;

    /**
     * Registers a callback function that gets called when the connection gets lost or disconnected.
     *
     * @param callback
     *           a callback function that doesn't receive any parameters
     * @since API version 1
     */
    setDisconnectCallback(callback: NoArgsCallback): void;

    /**
     * Sets the callback used for receiving data.
     *
     * The remote connection needs a header for each message sent to it containing a 32-bit big-endian integer
     * saying how big the rest of the message is. The data delivered to the script will not include this
     * header.
     *
     * @param callback
     *           a callback function with the signature `(byte[] data)`
     * @since API version 1
     */
    setReceiveCallback(callback: DataReceivedCallback): void;

    /**
     * Sends data to the remote host.
     *
     * @param data
     *           the byte array containing the data to be sent. When creating a numeric byte array in
     *           JavaScript, the byte values must be signed (in the range -128..127).
     * @throws IOException
     * @since API version 1
     */
    send(data: number): void;
  }

  // source: com/bitwig/extension/controller/api/RemoteControl.java

  /**
   * Represents a remote control in Bitwig Studio.
   *
   * @since API version 2
   */
  interface RemoteControl extends Parameter, DeleteableObject {
    name(): SettableStringValue;

    /**
     * Returns an object indicating whether this remote control's mapping is being changed. An unmapped remote control
     * slot can be mapped by setting this to true.
     */
    isBeingMapped(): SettableBooleanValue;
  }

  // source: com/bitwig/extension/controller/api/RemoteControlsPage.java

  /**
   * Represents a page of remote controls in a device.
   *
   * @since API version 2
   */
  interface RemoteControlsPage extends ParameterBank, DeleteableObject {
    getParameter(indexInBank: number): RemoteControl;

    /** @since API version 4 */
    getName(): StringValue;
  }

  // source: com/bitwig/extension/controller/api/RemoteSocket.java

  /**
   * Instances of this interface represent a TCP socket that other network clients can connect to, typically
   * created by calling {@link ControllerHost#createRemoteConnection}.
   *
   * @see {@link ControllerHost#createRemoteConnection}
   * @since API version 1
   */
  interface RemoteSocket {
    /**
     * Sets a callback which receives a remote connection object for each incoming connection.
     *
     * @param callback
     *           a callback function which receives a single {@link RemoteConnection} argument
     * @since API version 1
     */
    setClientConnectCallback(callback: ConnectionEstablishedCallback): void;

    /**
     * Gets the actual port used for the remote socket, which might differ from the originally requested port
     * when calling {@link ControllerHost#createRemoteConnection(String name, int port)} in case the requested port was
     * already used.
     *
     * @return the actual port used for the remote socket
     * @since API version 1
     */
    getPort(): number;
  }

  // source: com/bitwig/extension/controller/api/SampleBrowsingSession.java

  /**
   * Instances of this interface are used for browsing samples, including access to all filter columns and the
   * result column as shown in the 'Samples' tab of Bitwig Studio's contextual browser window.
   *
   * @see BrowsingSession
   * @since API version 1
   * @deprecated Use {@link PopupBrowser} instead.
   */
  interface SampleBrowsingSession extends BrowsingSession {
    /**
     * Returns the file type filter as shown in the category column of the browser.
     *
     * @return the requested file type filter object.
     * @since API version 1
     */
    getFileTypeFilter(): BrowserFilterColumn;
  }

  // source: com/bitwig/extension/controller/api/Scene.java

  /**
   * Instances of this interface represent scenes in Bitwig Studio.
   *
   * @since API version 1
   */
  interface Scene extends ClipLauncherSlotOrScene {
    /**
     * Returns an object that provides access to the name of the scene.
     *
     * @return a string value object that represents the scene name.
     * @since API version 1
     * @deprecated Use {@link #name()} instead.
     */
    getName(): SettableStringValue;

    /**
     * Returns an object that provides access to the name of the scene.
     *
     * @return a string value object that represents the scene name.
     * @since API version 2
     */
    name(): SettableStringValue;

    /**
     * Value that reports the number of clips in the scene.
     *
     * @since API version 2
     */
    clipCount(): IntegerValue;

    /**
     * Registers an observer that reports the number of clips in the scene.
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #clipCount()}.addValueObserver(callback).
     */
    addClipCountObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Registers an observer that reports the position of the scene within the list of Bitwig Studio scenes.
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #sceneIndex()} instead.
     */
    addPositionObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Registers an observer that reports if the scene is selected in Bitwig Studio.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter.
     * @since API version 1
     */
    addIsSelectedInEditorObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Selects the scene in Bitwig Studio.
     *
     * @since API version 1
     */
    selectInEditor(): void;

    /**
     * Makes the scene visible in the Bitwig Studio user interface.
     *
     * @since API version 1
     */
    showInEditor(): void;
  }

  // source: com/bitwig/extension/controller/api/SceneBank.java

  /**
   * A scene bank provides access to a range of scenes in Bitwig Studio. Instances of scene bank are configured
   * with a fixed number of scenes and represent an excerpt of a larger list of scenes. Various methods are
   * provided for scrolling to different sections of the scene list. It basically acts like a window moving over
   * the list of underlying scenes.
   *
   * To receive an instance of scene bank call
   * {@link com.bitwig.extension.controller.api.ControllerHost#createSceneBank}.
   *
   * @see {@link com.bitwig.extension.controller.api.ControllerHost#createSceneBank}
   * @since API version 1
   */
  interface SceneBank extends ClipLauncherSlotOrSceneBank<Scene> {
    /**
     * Returns the scene at the given index within the bank.
     *
     * @param indexInBank
     *           the scene index within this bank, not the index within the list of all Bitwig Studio scenes.
     *           Must be in the range [0..sizeOfBank-1].
     * @return the requested scene object
     * @since API version 1
     */
    getScene(indexInBank: number): Scene;

    /**
     * Scrolls the scenes one page up.
     *
     * @since API version 1
     * @deprecated Use {@link #scrollPageBackwards()} instead.
     */
    scrollPageUp(): void;

    /**
     * Scrolls the scenes one page down.
     *
     * @since API version 1
     * @deprecated Use {@link #scrollPageForwards()} instead.
     */
    scrollPageDown(): void;

    /**
     * Scrolls the scenes one scene up.
     *
     * @since API version 1
     * @deprecated Use {@link #scrollBackwards()} instead.
     */
    scrollUp(): void;

    /**
     * Scrolls the scenes one scene down.
     *
     * @since API version 1
     * @deprecated Use {@link #scrollForwards()} instead.
     */
    scrollDown(): void;

    /**
     * Makes the scene with the given position visible in the track bank.
     *
     * @param position
     *           the position of the scene within the underlying full list of scenes
     * @since API version 1
     * @deprecated Use {@link #scrollIntoView(int)} instead.
     */
    scrollTo(position: number): void;

    /**
     * Registers an observer that reports the current scene scroll position.
     *
     * @param callback
     *           a callback function that takes a single integer parameter
     * @param valueWhenUnassigned
     *           the default value that gets reports when the track bank is not yet connected to a Bitwig
     *           Studio document
     * @since API version 1
     * @deprecated Use {@link #scrollPosition()} instead
     */
    addScrollPositionObserver(
      callback: IntegerValueChangedCallback,
      valueWhenUnassigned: number
    ): void;

    /**
     * Registers an observer that reports if the scene window can be scrolled further up.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #canScrollBackwards()} instead.
     */
    addCanScrollUpObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the scene window can be scrolled further down.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter
     * @since API version 1
     * @deprecated Use {@link #canScrollForwards()} instead.
     */
    addCanScrollDownObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports the underlying total scene count (not the number of scenes available
     * in the bank window).
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #itemCount()} instead.
     */
    addSceneCountObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Launches the scene with the given bank index.
     *
     * @param indexInWindow
     *           the scene index within the bank, not the position of the scene withing the underlying full
     *           list of scenes.
     * @since API version 1
     */
    launchScene(indexInWindow: number): void;

    /**
     * Specifies if the Bitwig Studio clip launcher should indicate which scenes are part of the window. By
     * default indications are disabled.
     *
     * @param shouldIndicate
     *           `true` if visual indications should be enabled, `false` otherwise
     * @since API version 10
     */
    setIndication(shouldIndicate: boolean): void;
  }

  // source: com/bitwig/extension/controller/api/Scrollable.java

  /**
   * Interface for something that can be scrolled.
   *
   * @since API version 2
   */
  interface Scrollable extends RelativeHardwarControlBindable {
    /**
     * Value that reports the current scroll position.
     *
     * @since API version 2
     */
    scrollPosition(): SettableIntegerValue;

    /**
     * Scrolls the supplied position into view if it isn't already.
     *
     * @since API version 7
     */
    scrollIntoView(position: number): void;

    /**
     * Scrolls by a number of steps.
     *
     * @param amount
     *           The number of steps to scroll by (positive is forwards and negative is backwards).
     */
    scrollBy(amount: number): void;

    /**
     * Scrolls forwards by one step. This is the same as calling {@link #scrollBy(int)} with 1
     *
     * @since API version 2
     */
    scrollForwards(): void;

    scrollForwardsAction(): HardwareActionBindable;

    /**
     * Scrolls forwards by one step. This is the same as calling {@link #scrollBy(int)} with -1
     *
     * @since API version 2
     */
    scrollBackwards(): void;

    scrollBackwardsAction(): HardwareActionBindable;

    /**
     * Scrolls by a number of pages.
     *
     * @param amount
     *           The number of pages to scroll by (positive is forwards and negative is backwards).
     */
    scrollByPages(amount: number): void;

    /**
     * Scrolls forwards by one page.
     *
     * @since API version 2
     */
    scrollPageForwards(): void;

    scrollPageForwardsAction(): HardwareActionBindable;

    /**
     * Scrolls backwards by one page.
     *
     * @since API version 2
     */
    scrollPageBackwards(): void;

    scrollPageBackwardsAction(): HardwareActionBindable;

    /**
     * Value that reports if it is possible to scroll the bank backwards or not.
     *
     * @since API version 2
     */
    canScrollBackwards(): BooleanValue;

    /**
     * Value that reports if it is possible to scroll the bank forwards or not.
     *
     * @since API version 2
     */
    canScrollForwards(): BooleanValue;
  }

  // source: com/bitwig/extension/controller/api/Send.java

  interface Send extends Parameter {
    /**
     * Value that reports the color of the channel that this send sends to.
     *
     * @since API version 2
     */
    sendChannelColor(): SettableColorValue;

    /**
     * Value that reports if the send happens before or after the fader.
     *
     * @since API version 10
     */
    isPreFader(): BooleanValue;

    /**
     * Define how the send will happen.
     * Possible values: AUTO, PRE, POST.
     *
     * @since API version 10
     */
    sendMode(): SettableEnumValue;

    /**
     * Enables/Disables the send.
     * @since API version 18
     */
    isEnabled(): SettableBooleanValue;
  }

  // source: com/bitwig/extension/controller/api/SendBank.java

  interface SendBank extends Bank<Send> {}

  // source: com/bitwig/extension/controller/api/SettableBeatTimeValue.java

  interface SettableBeatTimeValue
    extends BeatTimeValue,
      SettableDoubleValue,
      RelativeHardwarControlBindable {
    /**
     * The same as the set method.
     *
     * @deprecated This is included only for backwards compatibility with API version 1 where this inherited
     *             from {@link RangedValue} instead of {@link DoubleValue}.
     */
    setRaw(value: number): void;

    /**
     * The same as the inc method.
     *
     * @deprecated This is included only for backwards compatibility with API version 1 where this inherited
     *             from {@link RangedValue} instead of {@link DoubleValue}.
     */
    incRaw(amount: number): void;

    /**
     * Stepper that steps through beat values. This can be used as a target for a
     * {@link RelativeHardwareControl}.
     *
     * @since API version 10
     */
    beatStepper(): RelativeHardwarControlBindable;
  }

  // source: com/bitwig/extension/controller/api/SettableBooleanValue.java

  /**
   * Instances of this interface represent boolean values.
   *
   * @since API version 1
   */
  interface SettableBooleanValue extends BooleanValue, HardwareActionBindable {
    /**
     * Sets the internal value.
     *
     * @param value
     *           the new boolean value.
     * @since API version 1
     */
    set(value: boolean): void;

    /**
     * Toggles the current state. In case the current value is `false`, the new value will be `true` and the
     * other way round.
     *
     * @since API version 1
     */
    toggle(): void;

    toggleAction(): HardwareActionBindable;

    setToTrueAction(): HardwareActionBindable;

    setToFalseAction(): HardwareActionBindable;
  }

  // source: com/bitwig/extension/controller/api/SettableColorValue.java

  interface SettableColorValue extends ColorValue {
    /**
     * Sets the internal value.
     *
     * @since API version 2
     */
    set(red: number, green: number, blue: number): void;

    /**
     * Sets the internal value.
     *
     * @since API version 5
     */
    set(red: number, green: number, blue: number, alpha: number): void;

    /**
     * Sets the color.
     *
     * @since API version 11
     */
    set(color: Color): void;
  }

  // source: com/bitwig/extension/controller/api/SettableDoubleValue.java

  interface SettableDoubleValue extends DoubleValue {
    /**
     * Sets the internal value.
     *
     * @param value
     *           the new integer value.
     * @since API version 1
     */
    set(value: number): void;

    /**
     * Increases/decrease the internal value by the given amount.
     *
     * @param amount
     *           the integer amount to increase
     * @since API version 1
     */
    inc(amount: number): void;
  }

  // source: com/bitwig/extension/controller/api/SettableEnumValue.java

  /**
   * Instances of this interface represent enumeration values. Enum values work similar to string values, but
   * are limited to a fixed set of value options.
   *
   * @since API version 1
   */
  interface SettableEnumValue extends EnumValue {
    /**
     * Sets the value to the enumeration item with the given name.
     *
     * @param name
     *           the name of the new enum item
     * @since API version 1
     */
    set(value: string): void;
  }

  // source: com/bitwig/extension/controller/api/SettableIntegerValue.java

  /**
   * Instances of this interface represent integer values.
   *
   * @since API version 1
   */
  interface SettableIntegerValue
    extends IntegerValue,
      RelativeHardwarControlBindable {
    /**
     * Sets the internal value.
     *
     * @param value
     *           the new integer value.
     * @since API version 1
     */
    set(value: number): void;

    /**
     * Increases/decrease the internal value by the given amount.
     *
     * @param amount
     *           the integer amount to increase
     * @since API version 1
     */
    inc(amount: number): void;
  }

  // source: com/bitwig/extension/controller/api/SettableRangedValue.java

  /**
   * Instances of this interface represent numeric values that have an upper and lower limit.
   *
   * @since API version 1
   */
  interface SettableRangedValue
    extends RangedValue,
      AbsoluteHardwarControlBindable,
      RelativeHardwarControlBindable {
    /**
     * Sets the value in an absolute fashion as a value between 0 .. 1 where 0 represents the minimum value and
     * 1 the maximum. The value may not be set immediately if the user has configured a take over strategy for
     * the controller.
     *
     * @param value
     *           absolute value [0 .. 1]
     * @since API version 2
     */
    set(value: number): void;

    /**
     * Sets the value in an absolute fashion as a value between 0 .. 1 where 0 represents the minimum value and
     * 1 the maximum. The value change is applied immediately and does not care about what take over mode the
     * user has selected. This is useful if the value does not need take over (e.g. a motorized slider).
     *
     * @param value
     *           absolute value [0 .. 1]
     *
     * @since API version 4
     */
    setImmediately(value: number): void;

    /**
     * Sets the value in an absolute fashion. The value will be scaled according to the given resolution.
     *
     * Typically the resolution would be specified as the amount of steps the hardware control provides (for
     * example 128) and just pass the integer value as it comes from the MIDI device. The host application will
     * take care of scaling it.
     *
     * @param value
     *           integer number in the range [0 .. resolution-1]
     * @param resolution
     *           the resolution used for scaling @ if passed-in parameters are null
     * @since API version 1
     */
    set(value: number, resolution: number): void;

    /**
     * Increments or decrements the value by a normalized amount assuming the whole range of the value is 0 ..
     * 1. For example to increment by 10% you would use 0.1 as the increment.
     *
     * @since API version 2
     */
    inc(increment: number): void;

    /**
     * Increments or decrements the value according to the given increment and resolution parameters.
     *
     * Typically the resolution would be specified as the amount of steps the hardware control provides (for
     * example 128) and just pass the integer value as it comes from the MIDI device. The host application will
     * take care of scaling it.
     *
     * @param increment
     *           the amount that the current value is increased by
     * @param resolution
     *           the resolution used for scaling
     * @since API version 1
     */
    inc(increment: number, resolution: number): void;

    /**
     * Set the internal (raw) value.
     *
     * @param value
     *           the new value with double precision. Range is undefined.
     * @since API version 1
     */
    setRaw(value: number): void;

    /**
     * Increments / decrements the internal (raw) value.
     *
     * @param delta
     *           the amount that the current internal value get increased by.
     * @since API version 1
     */
    incRaw(delta: number): void;

    addBinding(
      hardwareControl: AbsoluteHardwareControl
    ): AbsoluteHardwareControlBinding;

    addBindingWithRange(
      hardwareControl: AbsoluteHardwareControl,
      minNormalizedValue: number,
      maxNormalizedValue: number
    ): AbsoluteHardwareControlBinding;

    addBinding(
      hardwareControl: RelativeHardwareControl
    ): RelativeHardwareControlToRangedValueBinding;

    addBindingWithRange(
      hardwareControl: RelativeHardwareControl,
      minNormalizedValue: number,
      maxNormalizedValue: number
    ): RelativeHardwareControlBinding;

    addBindingWithRangeAndSensitivity(
      hardwareControl: RelativeHardwareControl,
      minNormalizedValue: number,
      maxNormalizedValue: number,
      sensitivity: number
    ): RelativeHardwareControlToRangedValueBinding;

    addBindingWithSensitivity(
      hardwareControl: RelativeHardwareControl,
      sensitivity: number
    ): RelativeHardwareControlToRangedValueBinding;
  }

  // source: com/bitwig/extension/controller/api/SettableStringArrayValue.java

  /**
   * @since API version 2
   */
  interface SettableStringArrayValue extends StringArrayValue {
    /**
     * Sets the internal value.
     *
     * @param value
     *           the new value.
     * @since API version 2
     */
    set(value: string[]): void;
  }

  // source: com/bitwig/extension/controller/api/SettableStringValue.java

  /**
   * Instances of this interface implement the {@link Value} interface for string values.
   *
   * @since API version 1
   */
  interface SettableStringValue extends StringValue {
    /**
     * Sets the value object to the given string.
     *
     * @param value
     *           the new value string
     * @since API version 1
     */
    set(value: string): void;
  }

  // source: com/bitwig/extension/controller/api/Setting.java

  /**
   * A common base interface for labeled and categorized settings.
   *
   * @since API version 1
   */
  interface Setting {
    /**
     * Returns the category name of the setting.
     *
     * @return a string value containing the category name
     * @since API version 1
     */
    getCategory(): string;

    /**
     * Returns the label text of the setting.
     *
     * @return a string value containing the label text
     * @since API version 1
     */
    getLabel(): string;

    /**
     * Marks the settings as enabled in Bitwig Studio. By default the setting is enabled.
     *
     * @since API version 1
     */
    enable(): void;

    /**
     * Marks the settings as disabled in Bitwig Studio. By default the setting is enabled.
     *
     * @since API version 1
     */
    disable(): void;

    /**
     * Shows the setting in Bitwig Studio. By default the setting is shown.
     *
     * @since API version 1
     */
    show(): void;

    /**
     * Hides the setting in Bitwig Studio. By default the setting is shown.
     *
     * @since API version 1
     */
    hide(): void;
  }

  // source: com/bitwig/extension/controller/api/Settings.java

  /**
   * This interface builds the foundation for storing custom settings in Bitwig Studio documents or in the
   * Bitwig Studio preferences.
   *
   * @since API version 1
   */
  interface Settings {
    /**
     * Returns a signal setting object, which is shown a push button with the given label in Bitwig Studio.
     *
     * @param label
     *           the name of the setting, must not be `null`
     * @param category
     *           the name of the category, may not be `null`
     * @param action
     *           the action string as displayed on the related Bitwig Studio button, must not be `null`
     * @return the object that encapsulates the requested signal
     * @since API version 1
     */
    getSignalSetting(label: string, category: string, action: string): Signal;

    /**
     * Returns a numeric setting that is shown a number field in Bitwig Studio.
     *
     * @param label
     *           the name of the setting, must not be `null`
     * @param category
     *           the name of the category, may not be `null`
     * @param minValue
     *           the minimum value that the user is allowed to enter
     * @param maxValue
     *           the minimum value that the user is allowed to enter
     * @param stepResolution
     *           the step resolution used for the number field
     * @param unit
     *           the string that should be used to display the unit of the number
     * @param initialValue
     *           the initial numeric value of the setting
     * @return the object that encapsulates the requested numeric setting
     * @since API version 1
     */
    getNumberSetting(
      label: string,
      category: string,
      minValue: number,
      maxValue: number,
      stepResolution: number,
      unit: string,
      initialValue: number
    ): SettableRangedValue;

    /**
     * Returns an enumeration setting that is shown either as a chooser or as a button group in Bitwig Studio,
     * depending on the number of provided options.
     *
     * @param label
     *           the name of the setting, must not be `null`
     * @param category
     *           the name of the category, may not be `null`
     * @param options
     *           the string array that defines the allowed options for the button group or chooser
     * @param initialValue
     *           the initial string value, must be one of the items specified with the option argument
     * @return the object that encapsulates the requested enum setting
     * @since API version 1
     */
    getEnumSetting(
      label: string,
      category: string,
      options: string[],
      initialValue: string
    ): SettableEnumValue;

    /**
     * Returns an enumeration setting that is shown either as a chooser or as a button group in Bitwig Studio,
     * depending on the number of provided options.
     *
     * @param label
     *           the name of the setting, must not be `null`
     * @param category
     *           the name of the category, may not be `null`
     * @param initialValue
     *           the initial string value, must be one of the items specified with the option argument
     * @return the object that encapsulates the requested enum setting
     * @since API version 11
     */
    getEnumSetting(
      label: string,
      category: string,
      initialValue: EnumValueDefinition
    ): SettableEnumValue;

    /**
     * Returns an enumeration setting that is shown either as a chooser or as a button group in Bitwig Studio,
     * depending on the number of provided options.
     *
     * @param label
     *           the name of the setting, must not be `null`
     * @param category
     *           the name of the category, may not be `null`
     * @param value
     *           the settable enum value that the setting will be connected to
     * @return the object that encapsulates the requested enum setting
     * @since API version 11
     */
    getEnumSettingForValue(
      label: string,
      category: string,
      value: SettableEnumValue
    ): SettableEnumValue;

    /**
     * Returns a textual setting that is shown as a text field in the Bitwig Studio user interface.
     *
     * @param label
     *           the name of the setting, must not be `null`
     * @param category
     *           the name of the category, may not be `null`
     * @param numChars
     *           the maximum number of character used for the text value
     * @param initialText
     *           the initial text value of the setting
     * @return the object that encapsulates the requested string setting
     * @since API version 1
     */
    getStringSetting(
      label: string,
      category: string,
      numChars: number,
      initialText: string
    ): SettableStringValue;

    /**
     * Returns a color setting that is shown in the Bitwig Studio user interface.
     *
     * @param label
     *           the name of the setting, must not be `null`
     * @param category
     *           the name of the category, may not be `null`
     * @param initialColor
     *           the initial color value of the setting
     * @return the object that encapsulates the requested string setting
     * @since API version 5
     */
    getColorSetting(
      label: string,
      category: string,
      initialColor: Color
    ): SettableColorValue;

    /**
     * Returns a color setting that is shown in the Bitwig Studio user interface.
     *
     * @param label
     *           the name of the setting, must not be `null`
     * @param category
     *           the name of the category, may not be `null`
     * @param value
     *           the color value to which the setting will be connected to
     * @return the object that encapsulates the requested string setting
     * @since API version 5
     */
    getColorSettingForValue(
      label: string,
      category: string,
      value: SettableColorValue
    ): SettableColorValue;

    /**
     * Returns a boolean setting.
     *
     * @param label
     *           the name of the setting, must not be `null`
     * @param category
     *           the name of the category, may not be `null`
     * @param initialValue
     *           the initial color value of the setting
     * @return the object that encapsulates the requested string setting
     * @since API version 7
     */
    getBooleanSetting(
      label: string,
      category: string,
      initialValue: boolean
    ): SettableBooleanValue;

    /**
     * Returns an boolean setting.
     *
     * @param label
     *           the name of the setting, must not be `null`
     * @param category
     *           the name of the category, may not be `null`
     * @param value
     *           the settable enum value that the setting will be connected to
     * @return the object that encapsulates the requested boolean setting
     * @since API version 11
     */
    getBooleanSettingForValue(
      label: string,
      category: string,
      value: SettableBooleanValue
    ): SettableBooleanValue;
  }

  // source: com/bitwig/extension/controller/api/Signal.java

  /**
   * A generic interface used to implement actions or events that are not associated with a value.
   *
   * @since API version 1
   */
  interface Signal {
    /**
     * Registers an observer that gets notified when the signal gets fired.
     *
     * @param callback
     *           a callback function that does not receive any argument.
     * @since API version 1
     */
    addSignalObserver(callback: NoArgsCallback): void;

    /**
     * Fires the action or event represented by the signal object.
     *
     * @since API version 1
     */
    fire(): void;
  }

  // source: com/bitwig/extension/controller/api/SoloValue.java

  /**
   * Instances of this interface represent the state of a solo button.
   *
   * @since API version 1
   */
  // @ts-ignore
  interface SoloValue extends SettableBooleanValue {
    /**
     * Toggles the current solo state.
     *
     * @param exclusive
     *           specifies if solo on other channels should be disabled automatically ('true') or not
     *           ('false').
     * @since API version 1
     */
    toggle(exclusive: boolean): void;

    /**
     * Toggles the current solo state, using the exclusive setting from the user preferences.
     *
     * @param negatePreferences
     *           If false, then toggles the solo using the exclusive behavior specified in the user preferences,
     *           ortherwise negate the preference setting.
     * @since API version 18
     */
    toggleUsingPreferences(negatePreferences: boolean): void;
  }

  // source: com/bitwig/extension/controller/api/SourceSelector.java

  /**
   * Instance of this class represent sources selectors in Bitwig Studio, which are shown as choosers in the
   * user interface and contain entries for either note inputs or audio inputs or both.
   *
   * The most prominent source selector in Bitwig Studio is the one shown in the track IO section, which can be
   * accessed via the API by calling {@link Track#getSourceSelector()}.
   *
   * @since API version 1
   */
  interface SourceSelector extends ObjectProxy {
    /**
     * Returns an object that indicates if the source selector has note inputs enabled.
     *
     * @return a boolean value object
     * @since API version 1
     * @deprecated Use {@link #hasNoteInputSelected()} instead.
     */
    getHasNoteInputSelected(): BooleanValue;

    /**
     * Returns an object that indicates if the source selector has note inputs enabled.
     *
     * @return a boolean value object
     * @since API version 5
     */
    hasNoteInputSelected(): BooleanValue;

    /**
     * Returns an object that indicates if the source selector has audio inputs enabled.
     *
     * @return a boolean value object
     * @since API version 1
     * @deprecated Use {@link #hasAudioInputSelected()} instead.
     */
    getHasAudioInputSelected(): BooleanValue;

    /**
     * Returns an object that indicates if the source selector has audio inputs enabled.
     *
     * @return a boolean value object
     * @since API version 5
     */
    hasAudioInputSelected(): BooleanValue;
  }

  // source: com/bitwig/extension/controller/api/SpecificBitwigDevice.java

  /**
   * Interface that can be used to access the parameter and output value of a specific Bitwig native device.
   *
   * Specific interfaces can be created by calling {@link Device#createSpecificBitwigDevice(java.util.UUID)}.
   *
   * @since API version 12
   */
  interface SpecificBitwigDevice {
    /**
     * Creates a {@link Parameter} that will refer to the parameter of the device with the specified parameter
     * id.
     */
    createParameter(id: string): Parameter;

    /**
     * Creates an {@link IntegerValue} that can be used to read a certain output value of the device.
     */
    createIntegerOutputValue(id: string): IntegerValue;
  }

  // source: com/bitwig/extension/controller/api/SpecificDevice.java

  /**
   * Interface that can be used to directly access a specific device (Bitwig native device or plug-in).
   *
   * @since API version 12
   * */
  interface SpecificDevice extends ObjectProxy {}

  // source: com/bitwig/extension/controller/api/SpecificPluginDevice.java

  /**
   * Interface that can be used to access the parameters of a specific plug-in device.
   *
   * Specific interfaces can be created by calling {@link Device#createSpecificVst2Device(int)} or
   * {@link Device#createSpecificVst3Device(String)}.
   *
   * @since API version 12
   */
  interface SpecificPluginDevice {
    /**
     * Creates a {@link Parameter} that will refer to the parameter of the plug-in with the specified parameter
     * id.
     */
    createParameter(parameterId: number): Parameter;
  }

  // source: com/bitwig/extension/controller/api/StringArrayValue.java

  /**
   * @since API version 2
   */
  // @ts-ignore
  interface StringArrayValue extends ObjectArrayValue<string> {
    /**
     * Gets the current value.
     *
     * @since API version 2
     */
    get(): string[];
  }

  // source: com/bitwig/extension/controller/api/StringHardwareProperty.java

  /**
   * Represents an output value shown on some hardware (for example, the title of a track).
   *
   * @since API version 10
   */
  interface StringHardwareProperty extends HardwareProperty {
    /** Gets the current value. This is the value that should be sent to the hardware to be displayed. */
    currentValue(): string;

    /** The value that was last sent to the hardware. */
    lastSentValue(): string;

    /**
     * Specifies a callback that should be called with the value that needs to be sent to the hardware. This
     * callback is called as a result of calling the {@link HardwareSurface#updateHardware()} method (typically
     * from the flush method).
     */
    onUpdateHardware(sendValueConsumer: Consumer<string>): void;

    /** Sets the current value. */
    setValue(value: string): void;

    /** Sets the current value from a {@link Supplier} that supplies the latest value. */
    setValueSupplier(supplier: Supplier<string>): void;

    /** The maximum number of characters that can be output or -1 if not specified and there is no limit. */
    getMaxChars(): number;

    setMaxChars(maxChars: number): void;
  }

  // source: com/bitwig/extension/controller/api/StringValue.java

  interface StringValue
    extends Value<StringValueChangedCallback>,
      Supplier<string> {
    /**
     * Gets the current value.
     *
     * @since API version 2
     */
    get(): string;

    /**
     * Gets the current value and tries to intelligently limit it to the supplied length in the best way
     * possible.
     *
     * @since API version 2
     */
    getLimited(maxLength: number): string;
  }

  // source: com/bitwig/extension/controller/api/Subscribable.java

  /**
   * Interface for an object that can be 'subscribed' or not. A subscribed object will notify any observers when
   * changes occur to it. When it is unsubscribed the observers will no longer be notified. A driver can use
   * this to say which objects it is interested in and which ones it is not (for example in one mode the driver
   * may not be interested in track meters) at runtime. This allows the driver to improve efficiency by only
   * getting notified about changes that are really relevant to it. By default a driver is subscribed to
   * everything.
   *
   * Subscription is counter based.
   *
   * @since API version 2
   */
  interface Subscribable {
    /**
     * Determines if this object is currently 'subscribed'. In the subscribed state it will notify any
     * observers registered on it.
     */
    isSubscribed(): boolean;

    /**
     * Sets whether the driver currently considers this object 'active' or not.
     * @deprecated subscribe/unsubscribe is now counter based.
     */
    setIsSubscribed(value: boolean): void;

    /**
     * Subscribes the driver to this object.
     */
    subscribe(): void;

    /**
     * Unsubscribes the driver from this object.
     */
    unsubscribe(): void;
  }

  // source: com/bitwig/extension/controller/api/TimelineEditor.java

  /**
   * Shared functions between `Arranger` and `DetailEditor`
   */
  interface TimelineEditor {
    /**
     * Zooms in the timeline, if the timeline editor is visible.
     *
     * @since API version 14
     */
    zoomInAction(): HardwareActionBindable;

    zoomIn(): void;

    /**
     * Zooms out the timeline, if the timeline editor is visible.
     *
     * @since API version 14
     */
    zoomOutAction(): HardwareActionBindable;

    zoomOut(): void;

    /**
     * Smoothly adjusts the zoom level
     */
    zoomLevel(): RelativeHardwarControlBindable;

    /**
     * Adjusts the zoom level of the timeline so that all content becomes visible, if the timeline editor is visible.
     *
     * @since API version 14
     */
    zoomToFitAction(): HardwareActionBindable;

    zoomToFit(): void;

    /**
     * Adjusts the zoom level of the timeline so that it matches the active selection, if the timeline editor is visible.
     *
     * @since API version 14
     */
    zoomToSelectionAction(): HardwareActionBindable;

    zoomToSelection(): void;

    /**
     * Toggles the timeline between zoomToSelection and zoomToFit, if it is visible.
     *
     * @since API version 18
     */
    zoomToFitSelectionOrAllAction(): HardwareActionBindable;

    zoomToFitSelectionOrAll(): void;

    /**
     * Toggles the timeline between zoomToSelection and the last śet zoom level, if it is visible.
     *
     * @since API version 18
     */
    zoomToFitSelectionOrPreviousAction(): HardwareActionBindable;

    zoomToFitSelectionOrPrevious(): void;
  }

  // source: com/bitwig/extension/controller/api/TimeSignatureValue.java

  /**
   * Instances of this interface represent time signature values.
   *
   * @since API version 1
   */
  interface TimeSignatureValue
    extends Value<StringValueChangedCallback>,
      Supplier<string> {
    /**
     * Gets the current value.
     *
     * @since API version 2
     */
    get(): string;

    /**
     * Updates the time signature according to the given string.
     *
     * @param name
     *           a textual representation of the new time signature value, formatted as
     *           `numerator/denominator[, ticks]`
     * @since API version 1
     */
    set(name: string): void;

    /**
     * Returns an object that provides access to the time signature numerator.
     *
     * @return an integer value object that represents the time signature numerator.
     * @since API version 1
     * @deprecated Use {@link #numerator()} instead.
     */
    getNumerator(): SettableIntegerValue;

    /**
     * Returns an object that provides access to the time signature numerator.
     *
     * @return an integer value object that represents the time signature numerator.
     * @since API version 5
     */
    numerator(): SettableIntegerValue;

    /**
     * Returns an object that provides access to the time signature denominator.
     *
     * @return an integer value object that represents the time signature denominator.
     * @since API version 1
     * @deprecated Use {@link #denominator()} instead.
     */
    getDenominator(): SettableIntegerValue;

    /**
     * Returns an object that provides access to the time signature denominator.
     *
     * @return an integer value object that represents the time signature denominator.
     * @since API version 5
     */
    denominator(): SettableIntegerValue;

    /**
     * Returns an object that provides access to the time signature tick subdivisions.
     *
     * @return an integer value object that represents the time signature ticks.
     * @since API version 1
     * @deprecated Use {@link #ticks()} instead.
     */
    getTicks(): SettableIntegerValue;

    /**
     * Returns an object that provides access to the time signature tick subdivisions.
     *
     * @return an integer value object that represents the time signature ticks.
     * @since API version 5
     */
    ticks(): SettableIntegerValue;
  }

  // source: com/bitwig/extension/controller/api/Track.java

  /**
   * Instances of this interface represent tracks in Bitwig Studio.
   *
   * @since API version 1
   */
  interface Track extends Channel {
    /**
     * Value that reports the position of the track within the list of Bitwig Studio tracks.
     *
     * @since API version 2
     */
    position(): IntegerValue;

    /**
     * Registers an observer that reports the position of the track within the list of Bitwig Studio tracks.
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #position()} instead.
     */
    addPositionObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Returns an object that can be used to access the clip launcher slots of the track.
     *
     * @return an object that represents the clip launcher slots of the track
     * @since API version 1
     * @deprecated Use {@link #clipLauncherSlotBank()} instead.
     */
    getClipLauncherSlots(): ClipLauncherSlotBank;

    /**
     * Returns an object that can be used to access the clip launcher slots of the track.
     *
     * @return an object that represents the clip launcher slots of the track
     * @since API version 2
     */
    clipLauncherSlotBank(): ClipLauncherSlotBank;

    /**
     * @deprecated Use {@link #getClipLauncherSlots()} instead.
     * @since API version 1
     */
    getClipLauncher(): ClipLauncherSlotBank;

    /**
     * Registers an observer that reports if the clip launcher slots are queued for stop.
     *
     * @param callback
     *           a callback function that receives a single boolean argument.
     * @since API version 1
     * @deprecated Use {@link #isQueuedForStop()} instead.
     */
    addIsQueuedForStopObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Returns an object that provides access to the arm state of the track.
     *
     * @return a boolean value object
     * @since API version 1
     * @deprecated Use {@link #arm()} instead.
     */
    getArm(): SettableBooleanValue;

    /**
     * Returns an object that provides access to the arm state of the track.
     *
     * @return a boolean value object
     * @since API version 5
     */
    arm(): SettableBooleanValue;

    /**
     * Returns an object that provides access to the monitoring state of the track.
     *
     * @return a boolean value object
     * @since API version 1
     * @deprecated Use {@link #monitor()} instead.
     */
    getMonitor(): SettableBooleanValue;

    /**
     * Returns an object that provides access to the monitoring state of the track.
     *
     * @return a boolean value object
     * @since API version 5
     */
    monitor(): SettableBooleanValue;

    /**
     * Returns an object that provides a readout of the monitoring state of the track.
     *
     * @return a read-only boolean value object
     * @since API version 14
     */
    isMonitoring(): BooleanValue;

    /**
     * Returns an object that provides access to the auto-monitoring state of the track.
     *
     * @return a boolean value object
     * @since API version 1
     * @deprecated Use {@link #autoMonitor()} instead.
     */
    getAutoMonitor(): SettableBooleanValue;

    /**
     * Returns an object that provides access to the auto-monitoring state of the track.
     *
     * @return a boolean value object
     * @since API version 5
     */
    autoMonitor(): SettableBooleanValue;

    /**
     * Returns an object that provides access to the auto-monitoring mode of the track.
     *
     * @return a boolean value object
     * @since API version 14
     */
    monitorMode(): SettableEnumValue;

    /**
     * Returns an object that provides access to the cross-fade mode of the track.
     *
     * @return an enum value object that has three possible states: "A", "B", or "AB"
     * @since API version 1
     * @deprecated Use {@link #crossFadeMode()} instead.
     */
    getCrossFadeMode(): SettableEnumValue;

    /**
     * Returns an object that provides access to the cross-fade mode of the track.
     *
     * @return an enum value object that has three possible states: "A", "B", or "AB"
     * @since API version 5
     */
    crossFadeMode(): SettableEnumValue;

    /**
     * Value that reports if this track is currently stopped. When a track is stopped it is not playing content
     * from the arranger or clip launcher.
     *
     * @since API version 2
     */
    isStopped(): BooleanValue;

    /**
     * Returns a value object that provides access to the clip launcher playback state of the track.
     *
     * @return a boolean value object that indicates if the clip launcher is stopped for this track
     * @see #getIsMatrixQueuedForStop()
     * @since API version 1
     * @deprecated Use {@link #isStopped()} instead.
     */
    getIsMatrixStopped(): BooleanValue;

    /**
     * Returns a value object that provides access to the clip launcher's queue-for-stop state on this track. A
     * clip is considered to be queued for stop when playback has been requested to be stopped on that clip,
     * but the playback has not stopped yet due to the current launch quantization settings.
     *
     * @return a boolean value object that indicates if the clip launcher slots have been queued for stop
     * @see #getIsMatrixStopped()
     * @since API version 1
     * @deprecated Use {@link #isQueuedForStop()} instead.
     */
    getIsMatrixQueuedForStop(): BooleanValue;

    /**
     * Value that reports if the clip launcher slots are queued for stop.
     *
     * @since API version 2
     */
    isQueuedForStop(): BooleanValue;

    /**
     * Returns the source selector for the track, which is shown in the IO section of the track in Bitwig
     * Studio and lists either note or audio sources or both depending on the track type.
     *
     * @return a source selector object
     * @since API version 1
     * @deprecated Use {@link #sourceSelector()} instead.
     */
    getSourceSelector(): SourceSelector;

    /**
     * Returns the source selector for the track, which is shown in the IO section of the track in Bitwig
     * Studio and lists either note or audio sources or both depending on the track type.
     *
     * @return a source selector object
     * @since API version 5
     */
    sourceSelector(): SourceSelector;

    /**
     * Stops playback of the track.
     *
     * @since API version 1
     */
    stop(): void;

    /**
     * Action to call {@link #stop()}.
     * @since API version 10
     */
    stopAction(): HardwareActionBindable;

    /**
     * Stops playback of the track using alternative quantization.
     *
     * @since API version 18
     */
    stopAlt(): void;

    /**
     * Action to call {@link #stopAlt()}.
     * @since API version 18
     */
    stopAltAction(): HardwareActionBindable;

    /**
     * Calling this method causes the arrangement sequencer to take over playback.
     *
     * @since API version 1
     */
    returnToArrangement(): void;

    /**
     * Updates the name of the track.
     *
     * @param name
     *           the new track name
     * @since API version 1
     */
    setName(name: string): void;

    /**
     * Registers an observer that reports names for note key values on this track. The track might provide
     * special names for certain keys if it contains instruments that support that features, such as the Bitwig
     * Drum Machine.
     *
     * @param callback
     *           a callback function that receives two arguments: 1. the key value in the range [0..127], and
     *           2. the name string
     * @since API version 1
     */
    addPitchNamesObserver(callback: IndexedStringValueChangedCallback): void;

    /**
     * Plays a note on the track with a default duration and the given key and velocity.
     *
     * @param key
     *           the key value of the played note
     * @param velocity
     *           the velocity of the played note
     * @since API version 1
     */
    playNote(key: number, velocity: number): void;

    /**
     * Starts playing a note on the track with the given key and velocity.
     *
     * @param key
     *           the key value of the played note
     * @param velocity
     *           the velocity of the played note
     * @since API version 1
     */
    startNote(key: number, velocity: number): void;

    /**
     * Stops playing a currently played note.
     *
     * @param key
     *           the key value of the playing note
     * @param velocity
     *           the note-off velocity
     * @since API version 1
     */
    stopNote(key: number, velocity: number): void;

    /**
     * Sends a MIDI message to the hardware device.
     *
     * @param status
     *           the status byte of the MIDI message
     * @param data1
     *           the data1 part of the MIDI message
     * @param data2
     *           the data2 part of the MIDI message
     * @since API version 2
     */
    sendMidi(status: number, data1: number, data2: number): void;

    /**
     * Value that reports the track type. Possible reported track types are `Group`, `Instrument`, `Audio`,
     * `Hybrid`, `Effect` or `Master`.
     *
     * @since API version 2
     */
    trackType(): StringValue;

    /**
     * Registers an observer that reports the track type. Possible reported track types are `Group`,
     * `Instrument`, `Audio`, `Hybrid`, `Effect` or `Master`.
     *
     * @param numChars
     *           the maximum number of characters used for the reported track type
     * @param textWhenUnassigned
     *           the default text that gets reported when the track is not yet associated with a Bitwig Studio
     *           track.
     * @param callback
     *           a callback function that receives a single track type parameter (string).
     * @since API version 1
     * @deprecated Use {@link #trackType()} instead.
     */
    addTrackTypeObserver(
      numChars: number,
      textWhenUnassigned: string,
      callback: StringValueChangedCallback
    ): void;

    /**
     * Value that reports if the track may contain child tracks, which is the case for group tracks.
     *
     * @since API version 2
     */
    isGroup(): BooleanValue;

    /**
     * Value that indicates if the group's child tracks are visible.
     *
     * @since API version 15
     */
    isGroupExpanded(): SettableBooleanValue;

    /**
     * If the track is an effect track, returns an object that indicates if the effect track is configured
     * as pre-fader.
     *
     * @since API version 10
     */
    getIsPreFader(): SettableBooleanValue;

    /**
     * Registers an observer that reports if the track may contain child tracks, which is the case for group
     * tracks.
     *
     * @param callback
     *           a callback function that receives a single boolean parameter.
     * @since API version 1
     * @deprecated Use {@link #isGroup()} instead.
     */
    addIsGroupObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Returns an object that indicates if the track may contain notes.
     *
     * @return a boolean value object
     * @since API version 1
     * @deprecated Use {@link #canHoldNoteData()} instead.
     */
    getCanHoldNoteData(): SettableBooleanValue;

    /**
     * Returns an object that indicates if the track may contain notes.
     *
     * @return a boolean value object
     * @since API version 5
     */
    canHoldNoteData(): SettableBooleanValue;

    /**
     * Returns an object that indicates if the track may contain audio events.
     *
     * @return a boolean value object
     * @since API version 1
     * @deprecated Use {@link #canHoldAudioData()} instead.
     */
    getCanHoldAudioData(): SettableBooleanValue;

    /**
     * Returns an object that indicates if the track may contain audio events.
     *
     * @return a boolean value object
     * @since API version 5
     */
    canHoldAudioData(): SettableBooleanValue;

    /**
     * Returns an object that provides access to the cursor item of the track's device selection as shown in
     * the Bitwig Studio user interface.
     *
     * @return the requested device selection cursor object
     * @since API version 1
     */
    createCursorDevice(): CursorDevice;

    /**
     * Creates a named device selection cursor that is independent from the device selection in the Bitwig
     * Studio user interface, assuming the name parameter is not null. When `name` is `null` the result is
     * equal to calling {@link Track#createCursorDevice}.
     *
     * @param name
     *           the name of the custom device selection cursor, for example "Primary", or `null` to refer to
     *           the device selection cursor in the arranger cursor track as shown in the Bitwig Studio user
     *           interface.
     * @return the requested device selection cursor object
     * @see Track#createCursorDevice
     * @see #createCursorDevice(String name, int numSends)
     * @since API version 1
     */
    createCursorDevice(name: string): CursorDevice;

    /**
     * Creates a named device selection cursor that is independent from the device selection in the Bitwig
     * Studio user interface, assuming the name parameter is not null. When `name` is `null` the result is
     * equal to calling {@link Track#createCursorDevice}.
     *
     * @param name
     *           the name of the custom device selection cursor, for example "Primary", or `null` to refer to
     *           the device selection cursor in the arranger cursor track as shown in the Bitwig Studio user
     *           interface.
     * @param numSends
     *           the number of sends that are simultaneously accessible in nested channels.
     * @return the requested device selection cursor object
     * @see Track#createCursorDevice
     * @since API version 1
     */
    createCursorDevice(name: string, numSends: number): CursorDevice;

    /**
     * Gets the channels primary device.
     *
     * @return an object that provides access to the channels primary device.
     * @deprecated Use {@link #createCursorDevice(String) createCursorDevice("Primary")} instead.
     * @since API version 1
     */
    getPrimaryDevice(): Device;

    /**
     * @deprecated Use {@link #createCursorDevice(String) createCursorDevice("Primary")} instead.
     * @since API version 1
     */
    getPrimaryInstrument(): Device;

    /**
     * Returns a track bank with the given number of child tracks, sends and scenes. The track bank will only
     * have content if the connected track is a group track.<br/>
     *
     * A track bank can be seen as a fixed-size window onto the list of tracks in the connected track group
     * including their sends and scenes, that can be scrolled in order to access different parts of the track
     * list. For example a track bank configured for 8 tracks can show track 1-8, 2-9, 3-10 and so on.<br/>
     *
     * The idea behind the `bank pattern` is that hardware typically is equipped with a fixed amount of channel
     * strips or controls, for example consider a mixing console with 8 channels, but Bitwig Studio documents
     * contain a dynamic list of tracks, most likely more tracks than the hardware can control simultaneously.
     * The track bank returned by this function provides a convenient interface for controlling which tracks
     * are currently shown on the hardware.<br/>
     *
     * Creating a track bank using this method will consider all tracks in the document, including effect
     * tracks and the master track. Use {@link #createMainTrackBank} or {@link #createEffectTrackBank} in case
     * you are only interested in tracks of a certain kind.
     *
     * @param numTracks
     *           the number of child tracks spanned by the track bank
     * @param numSends
     *           the number of sends spanned by the track bank
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @param hasFlatTrackList
     *           specifies whether the track bank should operate on a flat list of all nested child tracks or
     *           only on the direct child tracks of the connected group track.
     * @return an object for bank-wise navigation of tracks, sends and scenes
     * @see #createMainTrackBank
     * @see #createEffectTrackBank
     * @since API version 1
     */
    createTrackBank(
      numTracks: number,
      numSends: number,
      numScenes: number,
      hasFlatTrackList: boolean
    ): TrackBank;

    /**
     * Returns a track bank with the given number of child tracks, sends and scenes. Only audio tracks,
     * instrument tracks and hybrid tracks are considered. The track bank will only have content if the
     * connected track is a group track. For more information about track banks and the `bank pattern` in
     * general, see the documentation for {@link #createTrackBank}.
     *
     * @param numTracks
     *           the number of child tracks spanned by the track bank
     * @param numSends
     *           the number of sends spanned by the track bank
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @param hasFlatTrackList
     *           specifies whether the track bank should operate on a flat list of all nested child tracks or
     *           only on the direct child tracks of the connected group track.
     * @return an object for bank-wise navigation of tracks, sends and scenes
     * @see #createTrackBank
     * @see #createEffectTrackBank
     * @since API version 1
     */
    createMainTrackBank(
      numTracks: number,
      numSends: number,
      numScenes: number,
      hasFlatTrackList: boolean
    ): TrackBank;

    /**
     * Returns a track bank with the given number of child effect tracks and scenes. Only effect tracks are
     * considered. The track bank will only have content if the connected track is a group track. For more
     * information about track banks and the `bank pattern` in general, see the documentation for
     * {@link #createTrackBank}.
     *
     * @param numTracks
     *           the number of child tracks spanned by the track bank
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @param hasFlatTrackList
     *           specifies whether the track bank should operate on a flat list of all nested child tracks or
     *           only on the direct child tracks of the connected group track.
     * @return an object for bank-wise navigation of tracks, sends and scenes
     * @see #createTrackBank
     * @see #createMainTrackBank
     * @since API version 1
     */
    createEffectTrackBank(
      numTracks: number,
      numScenes: number,
      hasFlatTrackList: boolean
    ): TrackBank;

    /**
     * Returns a track bank with the given number of child effect tracks and scenes. Only effect tracks are
     * considered. The track bank will only have content if the connected track is a group track. For more
     * information about track banks and the `bank pattern` in general, see the documentation for
     * {@link #createTrackBank}.
     *
     * @param numTracks
     *           the number of child tracks spanned by the track bank
     * @param numSends
     *           the number of sends spanned by the track bank
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @param hasFlatTrackList
     *           specifies whether the track bank should operate on a flat list of all nested child tracks or
     *           only on the direct child tracks of the connected group track.
     * @return an object for bank-wise navigation of tracks, sends and scenes
     * @see #createTrackBank
     * @see #createMainTrackBank
     * @since API version 18
     */
    createEffectTrackBank(
      numTracks: number,
      numSends: number,
      numScenes: number,
      hasFlatTrackList: boolean
    ): TrackBank;

    /**
     * Returns an object that represents the master track of the connected track group. The returned object
     * will only have content if the connected track is a group track.
     *
     * @param numScenes
     *           the number of scenes for bank-wise navigation of the master tracks clip launcher slots.
     * @return an object representing the master track of the connected track group.
     * @since API version 1
     */
    createMasterTrack(numScenes: number): MasterTrack;

    /**
     * Returns a bank of sibling tracks with the given number of tracks, sends and scenes. For more information
     * about track banks and the `bank pattern` in general, see the documentation for {@link #createTrackBank}.
     *
     * @param numTracks
     *           the number of child tracks spanned by the track bank
     * @param numSends
     *           the number of sends spanned by the track bank
     * @param numScenes
     *           the number of scenes spanned by the track bank
     * @param shouldIncludeEffectTracks
     *           specifies whether effect tracks should be included
     * @param shouldIncludeMasterTrack
     *           specifies whether the master should be included
     * @return an object for bank-wise navigation of sibling tracks
     * @see #createTrackBank
     * @since API version 1
     */
    createSiblingsTrackBank(
      numTracks: number,
      numSends: number,
      numScenes: number,
      shouldIncludeEffectTracks: boolean,
      shouldIncludeMasterTrack: boolean
    ): TrackBank;

    /**
     * {@link InsertionPoint} that can be used to insert after this track.
     *
     * @since API version 7
     */
    afterTrackInsertionPoint(): InsertionPoint;

    /**
     * {@link InsertionPoint} that can be used to insert after this track.
     *
     * @since API version 7
     */
    beforeTrackInsertionPoint(): InsertionPoint;

    /**
     * Creates an object that represent the parent track.
     *
     * @since API version 10
     */
    createParentTrack(numSends: number, numScenes: number): Track;

    /**
     * Routes the given noteInput directly to the track regardless of monitoring.
     * @since API version 10
     */
    addNoteSource(noteInput: NoteInput): void;

    /**
     * Removes a routing operated by {@link #addNoteSource(NoteInput)}
     * @since API version 10
     */
    removeNoteSource(noteInput: NoteInput): void;

    /**
     * Will create a new empty clip at or after slot index.
     * If necessary, a new scene will be created.
     * The new clip will be selected.
     * @param slotIndex absolute slot index in the track (unrelated to banks)
     * @since API version 10
     */
    createNewLauncherClip(slotIndex: number, lengthInBeats: number): void;

    /**
     * Will create a new empty clip at or after slot index.
     * It will use the default clip length.
     * If necessary, a new scene will be created.
     * The new clip will be selected.
     * @param slotIndex absolute slot index in the track (unrelated to banks)
     * @since API version 10
     */
    createNewLauncherClip(slotIndex: number): void;

    /**
     * Will start recording a new clip at or after slot index.
     * If necessary, a new scene will be created.
     * The new clip will be selected.
     * @param slotIndex absolute slot index in the track (unrelated to banks)
     * @since API version 10
     */
    recordNewLauncherClip(slotIndex: number): void;

    /**
     * Selects the slot at the given index.
     * @param slotIndex absolute slot index in the track (unrelated to banks)
     * @since API version 10
     */
    selectSlot(slotIndex: number): void;

    /**
     * Launches the last clip with the given options:
     *
     * @param quantization possible values are "default", "none", "8", "4", "2", "1", "1/2", "1/4", "1/8", "1/16"
     * @param launchMode possible values are: "default", "from_start", "continue_or_from_start",
     *                   "continue_or_synced", "synced"
     *
     * @since API version 16
     */
    launchLastClipWithOptions(quantization: string, launchMode: string): void;

    launchLastClipWithOptionsAction(
      quantization: string,
      launchMode: string
    ): HardwareActionBindable;

    /**
     * Creates a cursor for the selected remote controls page in the device with the supplied number of
     * parameters. This section will follow the current page selection made by the user in the application.
     *
     * @param parameterCount
     *           The number of parameters the remote controls should contain
     *
     * @since API version 18
     */
    createCursorRemoteControlsPage(
      parameterCount: number
    ): CursorRemoteControlsPage;

    /**
     * Creates a cursor for a remote controls page in the device with the supplied number of parameters. This
     * section will be independent from the current page selected by the user in Bitwig Studio's user
     * interface. The supplied filter is an expression that can be used to match pages this section is
     * interested in. The expression is matched by looking at the tags added to the pages. If the expression is
     * empty then no filtering will occur.
     *
     * @param name
     *           A name to associate with this section. This will be used to remember manual mappings made by
     *           the user within this section.
     *
     *
     * @param parameterCount
     *           The number of parameters the remote controls should contain
     *
     * @param filterExpression
     *           An expression used to match pages that the user can navigate through. For now this can only be
     *           the name of a single tag the pages should contain (e.g "drawbars", "dyn", "env", "eq",
     *           "filter", "fx", "lfo", "mixer", "osc", "overview", "perf").
     *
     * @since API version 18
     */
    createCursorRemoteControlsPage(
      name: string,
      parameterCount: number,
      filterExpression: string
    ): CursorRemoteControlsPage;
  }

  // source: com/bitwig/extension/controller/api/TrackBank.java

  /**
   * A track bank provides access to a range of tracks and their scenes (clip launcher slots) in Bitwig Studio.
   * Instances of track bank are configured with a fixed number of tracks and scenes and represent an excerpt of
   * a larger list of tracks and scenes. Various methods are provided for scrolling to different sections of the
   * track/scene list. It basically acts like a 2-dimensional window moving over the grid of tracks and scenes.
   *
   * To receive an instance of track bank that supports all kinds of tracks call {@link ControllerHost#createTrackBank}.
   * Additional methods are provided in the {@link ControllerHost} interface to create track banks that include only main
   * tracks ({@link ControllerHost#createMainTrackBank}) or only effect tracks ({@link ControllerHost#createEffectTrackBank}).
   *
   * @see {@link ControllerHost#createTrackBank}
   * @see {@link ControllerHost#createMainTrackBank}
   * @see {@link ControllerHost#createEffectTrackBank}
   * @since API version 1
   */
  interface TrackBank extends ChannelBank<Track> {
    /**
     * @deprecated use {@link #getChannel(int)} instead.
     * @since API version 1
     */
    getTrack(indexInBank: number): Track;

    /**
     * Returns the track at the given index within the bank.
     *
     * @param indexInBank
     *           the track index within this bank, not the index within the list of all Bitwig Studio tracks.
     *           Must be in the range [0..sizeOfBank-1].
     * @return the requested track object
     * @since API version 1
     * @deprecated Use {@link #getItemAt(int)} instead.
     */
    getChannel(indexInBank: number): Track;

    /**
     * @deprecated use {@link #setChannelScrollStepSize(int)} instead.
     */
    setTrackScrollStepSize(stepSize: number): void;

    /**
     * @deprecated use {@link #scrollChannelsPageUp()} instead.
     */
    scrollTracksPageUp(): void;

    /**
     * @deprecated use {@link #scrollChannelsPageDown()} instead.
     */
    scrollTracksPageDown(): void;

    /**
     * @deprecated use {@link #scrollChannelsUp()} instead.
     */
    scrollTracksUp(): void;

    /**
     * @deprecated use {@link #scrollChannelsDown()} instead.
     */
    scrollTracksDown(): void;

    /**
     * @deprecated use {@link #scrollToChannel(int)} instead.
     */
    scrollToTrack(position: number): void;

    /**
     * @deprecated use {@link #addChannelScrollPositionObserver(Callable, int)} instead.
     */
    addTrackScrollPositionObserver(
      callback: IntegerValueChangedCallback,
      valueWhenUnassigned: number
    ): void;

    /**
     * {@link SceneBank} that represents a view on the scenes in this {@link TrackBank}.
     *
     * @since API version 2
     */
    sceneBank(): SceneBank;

    /**
     * Scrolls the scenes one page up.
     *
     * @since API version 1
     * @deprecated Use {@link #sceneBank()} instead.
     */
    scrollScenesPageUp(): void;

    /**
     * Scrolls the scenes one page down.
     *
     * @since API version 1
     * @deprecated Use {@link #sceneBank()} instead.
     */
    scrollScenesPageDown(): void;

    /**
     * Scrolls the scenes one step up.
     *
     * @since API version 1
     * @deprecated Use {@link #sceneBank()} instead.
     */
    scrollScenesUp(): void;

    /**
     * Scrolls the scenes one step down.
     *
     * @since API version 1
     * @deprecated Use {@link #sceneBank()} instead.
     */
    scrollScenesDown(): void;

    /**
     * Makes the scene with the given position visible in the track bank.
     *
     * @param position
     *           the position of the scene within the underlying full list of scenes
     * @since API version 1
     * @deprecated Use {@link #sceneBank()} instead.
     */
    scrollToScene(position: number): void;

    /**
     * Registers an observer that reports the current scene scroll position.
     *
     * @param callback
     *           a callback function that takes a single integer parameter
     * @param valueWhenUnassigned
     *           the default value that gets reports when the track bank is not yet connected to a Bitwig
     *           Studio document
     * @since API version 1
     * @deprecated Use {@link #sceneBank()} instead.
     */
    addSceneScrollPositionObserver(
      callback: IntegerValueChangedCallback,
      valueWhenUnassigned: number
    ): void;

    /**
     * @deprecated use {@link #canScrollChannelsUp()} instead.
     */
    addCanScrollTracksUpObserver(callback: BooleanValueChangedCallback): void;

    /**
     * @deprecated use {@link #canScrollChannelsDown()} instead.
     */
    addCanScrollTracksDownObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the scene window can be scrolled further up.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter
     * @since API version 1
     *
     * @deprecated use {@link #canScrollScenesUp()} instead.
     */
    addCanScrollScenesUpObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports if the scene window can be scrolled further down.
     *
     * @param callback
     *           a callback function that takes a single boolean parameter
     * @since API version 1
     *
     * @deprecated use {@link #canScrollScenesDown()} instead.
     */
    addCanScrollScenesDownObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Registers an observer that reports the underlying total scene count (not the number of scenes available
     * in the bank window).
     *
     * @param callback
     *           a callback function that receives a single integer parameter
     * @since API version 1
     * @deprecated Use {@link #sceneBank().itemCount().addValueObserver()}
     */
    addSceneCountObserver(callback: IntegerValueChangedCallback): void;

    /**
     * Returns an object that provides access to the clip launcher scenes of the track bank.
     *
     * @return an object that provides access to the clip launcher scenes of the track bank.
     * @since API version 1
     * @deprecated Use {@link #sceneBank()} instead.
     */
    getClipLauncherScenes(): ClipLauncherSlotOrSceneBank;

    /**
     * Launches the scene with the given bank index.
     *
     * @param indexInWindow
     *           the scene index within the bank, not the position of the scene withing the underlying full
     *           list of scenes.
     * @since API version 1
     * @deprecated Use {@link #sceneBank()} instead.
     */
    launchScene(indexInWindow: number): void;

    /**
     * Causes this bank to follow the supplied cursor. When the cursor moves to a new item the bank will be
     * scrolled so that the cursor is within the bank, if possible.
     *
     * @param cursorTrack
     *           The {@link CursorTrack} that this bank should follow.
     *
     * @since API version 2
     */
    followCursorTrack(cursorTrack: CursorTrack): void;

    /**
     * Decides if Bitwig Studio's clip launcher should indicate the area being controlled by this controller or not.
     *
     * @since API versian 17
     */
    setShouldShowClipLauncherFeedback(value: boolean): void;
  }

  // source: com/bitwig/extension/controller/api/Transport.java

  /**
   * An interface representing the transport section in Bitwig Studio.
   *
   * @since API version 1
   */
  interface Transport extends ObjectProxy {
    /**
     * Starts playback in the Bitwig Studio transport.
     *
     * @since API version 1
     */
    play(): void;

    /**
     * Continues the playback in the Bitwig Studio transport.
     *
     * @since API version 10
     */
    continuePlayback(): void;

    /**
     * Action that can be used to play the transport.
     *
     * @see #play()
     *
     * @since API version 10
     * */
    playAction(): HardwareActionBindable;

    /**
     * Action that can be used to continue the transport.
     *
     * @see #continuePlayback()
     *
     * @since API version 10
     * */
    continuePlaybackAction(): HardwareActionBindable;

    /**
     * Stops playback in the Bitwig Studio transport.
     *
     * @since API version 1
     */
    stop(): void;

    /**
     * Action that can be used to stop the transport.
     *
     * @see #stop()
     *
     * @since API version 10
     * */
    stopAction(): HardwareActionBindable;

    /**
     * Toggles the transport playback state between playing and stopped.
     *
     * @since API version 1
     */
    togglePlay(): void;

    /**
     * When the transport is stopped, calling this function starts transport playback, otherwise the transport
     * is first stopped and the playback is restarted from the last play-start position.
     *
     * @since API version 1
     */
    restart(): void;

    /**
     * Action that can be used to restart the transport.
     *
     * @see #restart()
     *
     * @since API version 10
     * */
    restartAction(): HardwareActionBindable;

    /**
     * Starts recording in the Bitwig Studio transport.
     *
     * @since API version 1
     */
    record(): void;

    /**
     * Action that can be used to start recording
     *
     * @see #record()
     *
     * @since API version 10
     * */
    recordAction(): HardwareActionBindable;

    /**
     * Rewinds the Bitwig Studio transport to the beginning of the arrangement.
     *
     * @since API version 1
     */
    rewind(): void;

    /**
     * Action that can be used to rewind the transport.
     *
     * @see #rewind()
     *
     * @since API version 10
     * */
    rewindAction(): HardwareActionBindable;

    /**
     * Calling this function is equivalent to pressing the fast forward button in the Bitwig Studio transport.
     *
     * @since API version 1
     */
    fastForward(): void;

    /**
     * Action that can be used to fast forward the transport.
     *
     * @see #fastForward()
     *
     * @since API version 10
     * */
    fastForwardAction(): HardwareActionBindable;

    /**
     * When calling this function multiple times, the timing of those calls gets evaluated and causes
     * adjustments to the project tempo.
     *
     * @since API version 1
     */
    tapTempo(): void;

    /**
     * Action that can be used to tap the tempo.
     *
     * @see #tapTempo()
     *
     * @since API version 10
     * */
    tapTempoAction(): HardwareActionBindable;

    /**
     * Value that reports if the Bitwig Studio transport is playing.
     *
     * @since API version 2
     */
    isPlaying(): SettableBooleanValue;

    /**
     * Registers an observer that reports if the Bitwig Studio transport is playing.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` if playing, `false`
     *           otherwise).
     * @since API version 1
     * @deprecated Use {@link #isPlaying()} instead.
     */
    addIsPlayingObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports if the Bitwig Studio transport is recording.
     *
     * @since API version 2
     */
    isArrangerRecordEnabled(): SettableBooleanValue;

    /**
     * Registers an observer that reports if the Bitwig Studio transport is recording.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` if recording, `false`
     *           otherwise).
     * @since API version 1
     * @deprecated Use {@link #isArrangerRecordEnabled()} instead.
     */
    addIsRecordingObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports if overdubbing is enabled in Bitwig Studio.
     *
     * @since API version 2
     */
    isArrangerOverdubEnabled(): SettableBooleanValue;

    /**
     * Registers an observer that reports if over-dubbing is enabled in Bitwig Studio.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` if over-dubbing is
     *           enabled, `false` otherwise).
     * @since API version 1
     * @deprecated Use {@link #isArrangerOverdubEnabled()} instead.
     */
    addOverdubObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value reports if clip launcher overdubbing is enabled in Bitwig Studio.
     *
     * @since API version 2
     */
    isClipLauncherOverdubEnabled(): SettableBooleanValue;

    /**
     * Registers an observer that reports if clip launcher over-dubbing is enabled in Bitwig Studio.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` if clip launcher
     *           over-dubbing is enabled, `false` otherwise).
     * @since API version 1
     * @deprecated Use {@link #isClipLauncherOverdubEnabled()} instead.
     */
    addLauncherOverdubObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports the current automation write mode. Possible values are `"latch"`, `"touch"` or
     * `"write"`.
     *
     * @since API version 2
     */
    automationWriteMode(): SettableEnumValue;

    /**
     * Registers an observer that reports the current automation write mode.
     *
     * @param callback
     *           a callback function that receives a single string argument. Possible values are `"latch"`,
     *           `"touch"` or `"write"`.
     * @since API version 1
     * @deprecated Use {@link #automationWriteMode()} instead.
     */
    addAutomationWriteModeObserver(callback: EnumValueChangedCallback): void;

    /**
     * Value that reports if automation write is currently enabled for the arranger.
     *
     * @since API version 2
     */
    isArrangerAutomationWriteEnabled(): SettableBooleanValue;

    /**
     * Registers an observer that reports if Bitwig Studio is currently writing arranger automation.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` when arranger automation
     *           write is enabled, `false` otherwise).
     * @since API version 1
     * @deprecated Use {@link #isArrangerAutomationWriteEnabled()} instead.
     */
    addIsWritingArrangerAutomationObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Value that reports if automation write is currently enabled on the clip launcher.
     *
     * @since API version 2
     */
    isClipLauncherAutomationWriteEnabled(): SettableBooleanValue;

    /**
     * Registers an observer that reports if Bitwig Studio is currently writing clip launcher automation.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` when clip launcher
     *           automation write is enabled, `false` otherwise).
     * @since API version 1
     * @deprecated Use {@link #isClipLauncherAutomationWriteEnabled()} instead.
     */
    addIsWritingClipLauncherAutomationObserver(
      callback: BooleanValueChangedCallback
    ): void;

    /**
     * Value that indicates if automation override is currently on.
     *
     * @since API version 2
     */
    isAutomationOverrideActive(): BooleanValue;

    /**
     * Registers an observer that reports if automation is overridden in Bitwig Studio.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` if overridden, `false`
     *           otherwise).
     * @since API version 1
     * @deprecated Use {@link #isAutomationOverrideActive()}.addValueObserver(callback)
     */
    addAutomationOverrideObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that indicates if the loop is currently active or not.
     *
     * @since API version 2
     */
    isArrangerLoopEnabled(): SettableBooleanValue;

    /**
     * Value that corresponds to the start time of the arranger loop
     *
     * @since API version 15
     */
    arrangerLoopStart(): SettableBeatTimeValue;

    /**
     * Value that corresponds to the duration of the arranger loop
     *
     * @since API version 15
     */
    arrangerLoopDuration(): SettableBeatTimeValue;

    /**
     * Registers an observer that reports if arranger looping is enabled in Bitwig Studio.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` when enabled, `false`
     *           otherwise).
     * @since API version 1
     * @deprecated Use {@link #isArrangerLoopEnabled()}.addValueObserver(callback)
     */
    addIsLoopActiveObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports if punch-in is enabled in the Bitwig Studio transport.
     *
     * @since API version 2
     */
    isPunchInEnabled(): SettableBooleanValue;

    /**
     * Registers an observer that reports if punch-in is enabled in the Bitwig Studio transport.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` when punch-in is enabled,
     *           `false` otherwise).
     * @since API version 1
     * @deprecated Use {@link #isPunchInEnabled()} instead.
     */
    addPunchInObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports if punch-in is enabled in the Bitwig Studio transport.
     *
     * @since API version 2
     */
    isPunchOutEnabled(): SettableBooleanValue;

    /**
     * Registers an observer that reports if punch-out is enabled in the Bitwig Studio transport.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` when punch-out is enabled,
     *           `false` otherwise).
     * @since API version 1
     * @deprecated Use {@link #isPunchOutEnabled()} instead.
     */
    addPunchOutObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports if the metronome is enabled in Bitwig Studio.
     *
     * @since API version 2
     */
    isMetronomeEnabled(): SettableBooleanValue;

    /**
     * Registers an observer that reports if the metronome is enabled in Bitwig Studio.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` when the metronome is
     *           enabled, `false` otherwise).
     * @since API version 1
     * @deprecated Use {@link #isMetronomeEnabled()} instead.
     */
    addClickObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports if the metronome has tick playback enabled.
     *
     * @since API version 2
     */
    isMetronomeTickPlaybackEnabled(): SettableBooleanValue;

    /**
     * Registers an observer that reports if the metronome has tick playback enabled.
     *
     * @param callback
     *           a callback function that receives a single boolean argument (`true` if metronome ticks, are
     *           enabled, `false` otherwise).
     * @since API version 1
     * @deprecated Use {@link #isMetronomeTickPlaybackEnabled()} instead.
     */
    addMetronomeTicksObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports the metronome volume.
     *
     * @since API version 2
     */
    metronomeVolume(): SettableRangedValue;

    /**
     * Registers an observer that reports the metronome volume.
     *
     * @param callback
     *           a callback function that receives a single numeric argument.
     * @since API version 1
     * @deprecated Use {@link #metronomeVolume()} instead.
     */
    addMetronomeVolumeObserver(callback: DoubleValueChangedCallback): void;

    /**
     * Value that reports if the metronome is audible during pre-roll.
     *
     * @since API version 2
     */
    isMetronomeAudibleDuringPreRoll(): SettableBooleanValue;

    /**
     * Registers an observer that reports if the metronome is audible during pre-roll.
     *
     * @param callback
     *           a callback function that receives a single boolean argument.
     * @since API version 1
     * @deprecated Use {@link #isMetronomeAudibleDuringPreRoll()} instead.
     */
    addPreRollClickObserver(callback: BooleanValueChangedCallback): void;

    /**
     * Value that reports the current pre-roll setting. Possible values are `"none"`, `"one_bar"`,
     * `"two_bars"`, or `"four_bars"`.
     *
     * @since API version 2
     */
    preRoll(): SettableEnumValue;

    /**
     * Registers an observer that reports the current pre-roll setting.
     *
     * @param callback
     *           a callback function that receives a single string argument. Possible values are `"none"`,
     *           `"one_bar"`, `"two_bars"`, or `"four_bars"`.
     * @since API version 1
     * @deprecated Use {@link #preRoll()} instead.
     */
    addPreRollObserver(callback: EnumValueChangedCallback): void;

    /**
     * Toggles the enabled state of the arranger loop in Bitwig Studio.
     *
     * @since API version 1
     * @deprecated Use {@link #isArrangerLoopEnabled()} instead.
     */
    toggleLoop(): void;

    /**
     * Enables of disables the arranger loop according to the given parameter.
     *
     * @param isEnabled
     *           `true` to enable the arranger loop, `false` otherwise
     * @since API version 1
     * @deprecated Use {@link #isArrangerLoopEnabled()} instead.
     */
    setLoop(isEnabled: boolean): void;

    /**
     * Toggles the punch-in enabled state of the Bitwig Studio transport.
     *
     * @since API version 1
     * @deprecated Use {@link #isPunchInEnabled()} instead.
     */
    togglePunchIn(): void;

    /**
     * Toggles the punch-out enabled state of the Bitwig Studio transport.
     *
     * @since API version 1
     * @deprecated Use {@link #isPunchOutEnabled()} instead.
     */
    togglePunchOut(): void;

    /**
     * Toggles the metronome enabled state of the Bitwig Studio transport.
     *
     * @since API version 1
     * @deprecated Use {@link #isMetronomeEnabled()} instead.
     */
    toggleClick(): void;

    /**
     * Enables of disables the metronome according to the given parameter.
     *
     * @param isEnabled
     *           `true` to enable the metronome, `false` otherwise
     * @since API version 1
     * @deprecated Use {@link #isMetronomeEnabled()} instead.
     */
    setClick(isEnabled: boolean): void;

    /**
     * Toggles the enabled state of the metronome ticks.
     *
     * @since API version 1
     * @deprecated Use {@link #isMetronomeTickPlaybackEnabled()} instead.
     */
    toggleMetronomeTicks(): void;

    /**
     * Toggles the enabled state of the metronome during pre-roll.
     *
     * @since API version 1
     * @deprecated Use {@link #isMetronomeAudibleDuringPreRoll()} instead.
     */
    toggleMetronomeDuringPreRoll(): void;

    /**
     * Updates the transport pre-roll setting according to the given parameter.
     *
     * @param value
     *           the new pre-roll setting, either `"none"`, `"one_bar"`, `"two_bars"`, or `"four_bars"`.
     * @since API version 1
     * @deprecated Use {@link #preRoll()} instead.
     */
    setPreRoll(value: string): void;

    /**
     * Sets the metronome volume.
     *
     * @param amount
     *           the new metronome volume relative to the specified range. Values should be in the range
     *           [0..range-1].
     * @param range
     *           the range of the provided amount value
     * @since API version 1
     * @deprecated Use {@link #metronomeVolume()} instead.
     */
    setMetronomeValue(amount: number, range: number): void;

    /**
     * Toggles the over-dubbing enabled state of the Bitwig Studio transport.
     *
     * @since API version 1
     * @deprecated Use {@link #isArrangerOverdubEnabled()} instead.
     */
    toggleOverdub(): void;

    /**
     * Enables of disables arranger over-dubbing according to the given parameter.
     *
     * @param isEnabled
     *           `true` to enable over-dubbing, `false` otherwise
     * @since API version 1
     * @deprecated Use {@link #isArrangerOverdubEnabled()} instead.
     */
    setOverdub(isEnabled: boolean): void;

    /**
     * Toggles clip launcher overdubbing in Bitwig Studio.
     *
     * @since API version 1
     * @deprecated Use {@link #isClipLauncherOverdubEnabled()} instead.
     */
    toggleLauncherOverdub(): void;

    /**
     * Enables of disables clip launcher over-dubbing according to the given parameter.
     *
     * @param isEnabled
     *           `true` to enable the over-dubbing, `false` otherwise
     * @since API version 1
     * @deprecated Use {@link #isClipLauncherOverdubEnabled()} instead.
     */
    setLauncherOverdub(isEnabled: boolean): void;

    /**
     * Sets the automation write mode.
     *
     * @param mode
     *           the string that identifies the new automation write mode. Possible values are `"latch"`,
     *           `"touch"` or `"write"`.
     * @since API version 1
     * @deprecated Use {@link #automationWriteMode()} instead.
     */
    setAutomationWriteMode(mode: string): void;

    /**
     * Toggles the latch automation write mode in the Bitwig Studio transport.
     *
     * @since API version 1
     */
    toggleLatchAutomationWriteMode(): void;

    /**
     * Toggles the arranger automation write enabled state of the Bitwig Studio transport.
     *
     * @since API version 1
     */
    toggleWriteArrangerAutomation(): void;

    /**
     * Toggles the clip launcher automation write enabled state of the Bitwig Studio transport.
     *
     * @since API version 1
     */
    toggleWriteClipLauncherAutomation(): void;

    /**
     * Resets any automation overrides in Bitwig Studio.
     *
     * @since API version 1
     */
    resetAutomationOverrides(): void;

    /**
     * Switches playback to the arrangement sequencer on all tracks.
     *
     * @since API version 1
     */
    returnToArrangement(): void;

    /**
     * Returns an object that provides access to the project tempo.
     *
     * @return the requested tempo value object
     * @since API version 1
     * @deprecated Use {@link #tempo()} instead.
     */
    getTempo(): Parameter;

    /**
     * Returns an object that provides access to the project tempo.
     *
     * @return the requested tempo value object
     * @since API version 1
     */
    tempo(): Parameter;

    /**
     * Increases the project tempo value by the given amount, which is specified relative to the given range.
     *
     * @param amount
     *           the new tempo value relative to the specified range. Values should be in the range
     *           [0..range-1].
     * @param range
     *           the range of the provided amount value
     * @since API version 1
     */
    increaseTempo(amount: number, range: number): void;

    /**
     * Returns an object that provides access to the transport position in Bitwig Studio.
     *
     * @return a beat time object that represents the transport position
     * @since API version 1
     */
    getPosition(): SettableBeatTimeValue;

    /**
     * Returns an object that provides access to the current transport position.
     *
     * @return beat-time value
     * @since API version 10
     */
    playPosition(): BeatTimeValue;

    /**
     * Returns an object that provides access to the current transport position in seconds.
     *
     * @return value (seconds)
     * @since API version 10
     */
    playPositionInSeconds(): DoubleValue;

    /**
     * Returns an object that provides access to the transport's play-start position. (blue triangle)
     *
     * @return beat-time value
     * @since API version 10
     */
    playStartPosition(): SettableBeatTimeValue;

    /**
     * Returns an object that provides access to the transport's play-start position in seconds. (blue triangle)
     *
     * @return value (seconds)
     * @since API version 10
     */
    playStartPositionInSeconds(): SettableDoubleValue;

    /**
     * Make the transport jump to the play-start position.
     *
     * @since API version 10
     */
    launchFromPlayStartPosition(): void;

    launchFromPlayStartPositionAction(): HardwareActionBindable;

    /**
     * Make the transport jump to the play-start position.
     *
     * @since API version 10
     */
    jumpToPlayStartPosition(): void;

    jumpToPlayStartPositionAction(): HardwareActionBindable;

    /**
     * Make the transport jump to the previous cue marker.
     *
     * @since API version 10
     */
    jumpToPreviousCueMarker(): void;

    jumpToPreviousCueMarkerAction(): HardwareActionBindable;

    /**
     * Make the transport jump to the previous cue marker.
     *
     * @since API version 10
     */
    jumpToNextCueMarker(): void;

    jumpToNextCueMarkerAction(): HardwareActionBindable;

    /**
     * Sets the transport playback position to the given beat time value.
     *
     * @param beats
     *           the new playback position in beats
     * @since API version 1
     */
    setPosition(beats: number): void;

    /**
     * Increases the transport position value by the given number of beats, which is specified relative to the
     * given range.
     *
     * @param beats
     *           the beat time value that gets added to the current transport position. Values have double
     *           precision and can be positive or negative.
     * @param snap
     *           when `true` the actual new transport position will be quantized to the beat grid, when `false`
     *           the position will be increased exactly by the specified beat time
     * @since API version 1
     */
    incPosition(beats: number, snap: boolean): void;

    /**
     * Returns an object that provides access to the punch-in position in the Bitwig Studio transport.
     *
     * @return a beat time object that represents the punch-in position
     * @since API version 1
     */
    getInPosition(): SettableBeatTimeValue;

    /**
     * Returns an object that provides access to the punch-out position in the Bitwig Studio transport.
     *
     * @return a beat time object that represents the punch-out position
     * @since API version 1
     */
    getOutPosition(): SettableBeatTimeValue;

    /**
     * Adds a cue marker at the current position
     *
     * @since API version 15
     */
    addCueMarkerAtPlaybackPosition(): void;

    addCueMarkerAtPlaybackPositionAction(): HardwareActionBindable;

    /**
     * Returns an object that provides access to the cross-fader, used for mixing between A/B-channels as
     * specified on the Bitwig Studio tracks.
     *
     * @see Track#getCrossFadeMode()
     * @since API version 1
     * @deprecated Use {@link #crossfade()} instead.
     */
    getCrossfade(): Parameter;

    /**
     * Returns an object that provides access to the cross-fader, used for mixing between A/B-channels as
     * specified on the Bitwig Studio tracks.
     *
     * @see Track#getCrossFadeMode()
     * @since API version 5
     */
    crossfade(): Parameter;

    /**
     * Returns an object that provides access to the transport time signature.
     *
     * @return the time signature value object that represents the transport time signature.
     * @since API version 1
     * @deprecated Use {@link #timeSignature()} instead.
     */
    getTimeSignature(): TimeSignatureValue;

    /**
     * Returns an object that provides access to the transport time signature.
     *
     * @return the time signature value object that represents the transport time signature.
     * @since API version 5
     */
    timeSignature(): TimeSignatureValue;

    /**
     * Value that reports the current clip launcher post recording action. Possible values are `"off"`,
     * `"play_recorded"`, `"record_next_free_slot"`, `"stop"`, `"return_to_arrangement"`,
     * `"return_to_previous_clip"` or `"play_random"`.
     *
     * @since API version 2
     */
    clipLauncherPostRecordingAction(): SettableEnumValue;

    /**
     * Registers an observer that reports the current clip launcher post recording action.
     *
     * @param callback
     *           a callback function that receives a single string argument. Possible values are `"off"`,
     *           `"play_recorded"`, `"record_next_free_slot"`, `"stop"`, `"return_to_arrangement"`,
     *           `"return_to_previous_clip"` or `"play_random"`.
     * @since API version 1
     * @deprecated Use {@link #clipLauncherPostRecordingAction()} instead.
     */
    addClipLauncherPostRecordingActionObserver(
      callback: EnumValueChangedCallback
    ): void;

    /**
     * Sets the automation write mode.
     *
     * @param action
     *           the string that identifies the new automation write mode. Possible values are `"off"`,
     *           `"play_recorded"`, `"record_next_free_slot"`, `"stop"`, `"return_to_arrangement"`,
     *           `"return_to_previous_clip"` or `"play_random"`.
     * @since API version 1
     * @deprecated Use {@link #clipLauncherPostRecordingAction()} instead.
     */
    setClipLauncherPostRecordingAction(action: string): void;

    /**
     * Returns an object that provides access to the clip launcher post recording time offset.
     *
     * @return a beat time object that represents the post recording time offset
     * @since API version 1
     */
    getClipLauncherPostRecordingTimeOffset(): SettableBeatTimeValue;

    /**
     * Setting for the default launch quantization.
     *
     * Possible values are `"none"`, `"8"`, `"4"`, `"2"`, `"1"`, `"1/2"`, `"1/4"`, `"1/8"`, `"1/16"`.
     *
     * @since API version 8
     */
    defaultLaunchQuantization(): SettableEnumValue;

    /**
     * Value that indicates if the project's fill mode is active or not.
     *
     * @since API version 14
     */
    isFillModeActive(): SettableBooleanValue;
  }

  // source: com/bitwig/extension/controller/api/UsbDevice.java

  import UsbDeviceMatcher = com.bitwig.extension.controller.UsbDeviceMatcher;
  import UsbInterfaceMatcher = com.bitwig.extension.controller.UsbInterfaceMatcher;

  /**
   * Defines a USB device that is available for communication.
   *
   * @since API version 7
   */
  interface UsbDevice extends HardwareDevice {
    /**
     * The {@link UsbDeviceMatcher} that was provided by the controller for identifying this device.
     *
     */
    deviceMatcher(): UsbDeviceMatcher;

    /** The list of {@link UsbInterface}s that have been opened for this device. */
    ifaces(): List<UsbInterface>;

    /**
     * The {@link UsbInterface} that was claimed using the {@link UsbInterfaceMatcher} defined at the
     * corresponding index in the {@link UsbDeviceMatcher}.
     */
    iface(index: number): UsbInterface;
  }

  // source: com/bitwig/extension/controller/api/UsbInputPipe.java

  interface UsbInputPipe extends UsbPipe, InputPipe {}

  // source: com/bitwig/extension/controller/api/UsbInterface.java

  interface UsbInterface {
    /**
     * The {@link UsbInterfaceMatcher} that was provided by the controller for identifying this device.
     *
     * */
    interfaceMatcher(): UsbInterfaceMatcher;

    /** The list of pipes that have been opened for this interface. */
    pipes(): List<UsbPipe>;

    pipe(index: number): UsbPipe;

    pipeCount(): number;
  }

  // source: com/bitwig/extension/controller/api/UsbOutputPipe.java

  interface UsbOutputPipe extends UsbPipe, OutputPipe {}

  // source: com/bitwig/extension/controller/api/UsbPipe.java

  import UsbEndpointMatcher = com.bitwig.extension.controller.UsbEndpointMatcher;

  /**
   * Defines a pipe for talking to an endpoint on a USB device.
   *
   * @since API version 7
   */
  interface UsbPipe extends Pipe {
    /**
     * The device this endpoint is on.
     *
     * @since API version 7
     */
    device(): UsbDevice;

    /**
     * The {@link UsbEndpointMatcher} that was provided by the controller for identifying the endpoint to use
     * for communication.
     */
    endpointMatcher(): UsbEndpointMatcher;

    /**
     * The endpoint address on the device that this endpoint is for.
     *
     * @since API version 7
     */
    endpointAddress(): number;

    /** {@link UsbTransferDirection} for this pipe. */
    direction(): UsbTransferDirection;

    /** The {@link UsbTransferType} type that this pipe uses for communicating with the USB device. */
    transferType(): UsbTransferType;
  }

  // source: com/bitwig/extension/controller/api/UsbTransferDirection.java

  enum UsbTransferDirection {
    IN = 0,
    OUT = 1,
  }

  // source: com/bitwig/extension/controller/api/UsbTransferStatus.java

  enum UsbTransferStatus {
    Completed = 0,
    Error = 1,
    TimedOut = 2,
    Cancelled = 3,
    Stall = 4,
    NoDevice = 5,
    Overflow = 6,
  }

  // source: com/bitwig/extension/controller/api/UsbTransferType.java

  enum UsbTransferType {
    BULK = 0,
    INTERRUPT = 1,
  }

  // source: com/bitwig/extension/controller/api/UserControlBank.java

  /**
   * Instances of this interface represent a bank of custom controls that can be manually learned to device
   * parameters by the user.
   *
   * @since API version 1
   */
  interface UserControlBank {
    /**
     * Gets the user control at the given bank index.
     *
     * @param index
     *           the index of the control within the bank
     * @return the requested user control object
     * @since API version 1
     */
    getControl(index: number): Parameter;
  }

  // source: com/bitwig/extension/controller/api/Value.java

  import ValueChangedCallback = com.bitwig.extension.callback.ValueChangedCallback;

  /**
   * The common interface that is shared by all value objects in the controller API.
   *
   * @since API version 1
   */
  interface Value<
    ObserverType extends ValueChangedCallback = ValueChangedCallback
  > extends Subscribable {
    /**
     * Marks this value as being of interest to the driver. This can only be called once during the driver's
     * init method. A value that is of interest to the driver can be obtained using the value's get method. If
     * a value has not been marked as interested then an error will be reported if the driver attempts to get
     * the current value. Adding an observer to a value will automatically mark this value as interested.
     *
     * @since API version 2
     */
    markInterested(): void;

    /**
     * Registers an observer that reports the current value.
     *
     * @param callback
     *           a callback function that receives a single parameter
     * @since API version 1
     */
    addValueObserver(callback: ObserverType): void;
  }
}

declare namespace java {
  namespace nio {
    type ByteBuffer = any;
  }
  namespace util {
    type List<T> = Array<T>;
    type UUID = string;

    namespace func {
      type BooleanSupplier = {
        getAsBoolean(): boolean;
      };
      type Consumer<T = any> = {
        accept(t: T): void;
        andThen(after: Consumer<T>): Consumer<T>;
      };
      type Supplier<T = any> = {
        get(): T;
      };
      type DoubleConsumer = {
        accept(double: number): void;
        andThen(after: DoubleConsumer): DoubleConsumer;
      };
      type DoubleSupplier = {
        getAsDouble(): number;
      };
      type IntConsumer = {
        accept(int: number): void;
        andThen(after: IntConsumer): IntConsumer;
      };
      type IntSupplier = {
        getAsInt(): number;
      };
      interface Function<T = any, R = any> {
        andThen(after: Function): Function<T>;
        apply(t: T): R;
        compose(before: Function): Function<any, R>;
      }
      type IntFunction<R = any> = {
        apply(value: number): R;
      };
    }
  }
}

import API = com.bitwig.extension.controller.api;

declare const host: API.ControllerHost;
declare const loadAPI: typeof host.loadAPI;
declare const load: typeof host.load;
declare const println: typeof host.println;
declare const errorln: typeof host.errorln;
declare function dump(obj: any): void;
