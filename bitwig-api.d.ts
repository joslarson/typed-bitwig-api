// Type definitions for Bitwig Studio's Control Surface API v6
// Project: https://bitwig.com
// Definitions by: Joseph Larson <https://github.com/joslarson/>
// TypeScript Version: 2.7.2

declare namespace API {
    /**
     * This class represents an RGBA color with each component being stored as double.
     *
     * @since API version 5
     * @class
     */
    class Color {
        constructor(red: number, green: number, blue: number, alpha: number);
        static fromRGB(red: number, green: number, blue: number): Color;
        static fromRGBA(red: number, green: number, blue: number, alpha: number): Color;
        static fromRGB255(red: number, green: number, blue: number): Color;
        static fromRGBA255(red: number, green: number, blue: number, alpha: number): Color;
        static fromHex(hex: string): Color;
        /**
         * Mixes two colors.
         * @since API version 4
         * @param {Color} c1
         * @param {Color} c2
         * @param {number} blend
         * @return {Color}
         */
        static mix(c1: Color, c2: Color, blend: number): Color;
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

    /**
     * Defines the interface through which an extension can talk to the host application.
     * @class
     */
    interface Host {
        /**
         * Returns the latest supported API version of the host application.
         *
         * @return {number} the latest supported API version of the host application
         * @since API version 1
         */
        getHostApiVersion(): number;
        /**
         * Returns the vendor of the host application.
         *
         * @return {string} the vendor of the host application
         * @since API version 1
         */
        getHostVendor(): string;
        /**
         * Returns the product name of the host application.
         *
         * @return {string} the product name of the host application
         * @since API version 1
         */
        getHostProduct(): string;
        /**
         * Returns the version number of the host application.
         *
         * @return {string} the version number of the host application
         * @since API version 1
         */
        getHostVersion(): string;
        /**
         * The platform type that this host is running on.
         * @return {PlatformType}
         */
        getPlatformType(): PlatformType;
        /**
         * Sets an email address to use for reporting errors found in this script.
         *
         * @since API version 2
         * @param {string} address
         */
        setErrorReportingEMail(address: string): any;
        /**
         * Gets the OpenSoundControl module.
         * @since API version 5
         * @return {*}
         */
        getOscModule(): OscModule;
    }

    /**
     * An OSC address space.
     *
     * It contains the root OscContainer.
     *
     * @since API version 5
     * @class
     */
    interface OscAddressSpace {
        /**
         * Register all the methods annotated with @OscMethod from object.
         * Also if a method is annotated with @OscNode, this method will be called and the returned object's method
         * will be registered.
         * @param {string} addressPrefix
         * @param {*} object
         */
        registerObjectMethods(addressPrefix: string, object: any): any;
        /**
         * Low level way to register an Osc Method.
         * @param {string} address The address to register the method at
         * @param {string} typeTagPattern The globing pattern used to match the type tag. Pass "*" to match anything.
         * @param {string} desc The method description.
         * @param {*} callback Then call handler.
         */
        registerMethod(
            address: string,
            typeTagPattern: string,
            desc: string,
            callback: OscMethodCallback
        ): any;
        /**
         * This method will be called if no registered OscMethod could handle incoming OscPacket.
         * @param {*} callback
         */
        registerDefaultMethod(callback: OscMethodCallback): any;
        /**
         * Should the address spaces log the messages it dispatches?
         * Default is false.
         * @param {boolean} shouldLogMessages
         */
        setShouldLogMessages(shouldLogMessages: boolean): any;
        /**
         * This gives a display name for this address space.
         * It is useful if you have multiple address space to identify them when we generate the documentation.
         * @param {string} name
         */
        setName(name: string): any;
    }

    /**
     * An OSC Bundle.
     *
     * @since API version 5
     * @class
     */
    interface OscBundle extends OscPacket {
        getNanoseconds(): number;
        getPackets(): Array<OscPacket>;
    }

    /**
     * This interface lets you send OscMessage through an connection which can be via Tcp, Udp, or whatever.
     *
     * OscPackets are sent when all the startBundle() have a matching endBundle().
     * If you call sendMessage() with startBundle() before, then the message will be sent directly.
     *
     * Our maximum packet size is 64K.
     *
     * @since API version 5
     * @class
     */
    interface OscConnection {
        /**
         * Starts an OscBundle.
         */
        startBundle(): any;
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
         * @param {string} address
         * @param {Array} args
         */
        sendMessage(address: string, ...args: any[]): any;
        /**
         * Finishes the previous bundle, and if it was not inside an other bundle, it will send the message
         * directly.
         */
        endBundle(): any;
    }

    class OscInvalidArgumentTypeException extends Error {
        constructor(type?: any, method?: any);
    }

    class OscIOException {
        constructor();
    }

    /**
     * An OSC message.
     *
     * @since API version 5
     * @class
     */
    interface OscMessage extends OscPacket {
        getAddressPattern(): string;
        getTypeTag(): string;
        getArguments(): Array<any>;
        getString(index: number): string;
        getBlob(index: number): number[];
        getInt(index: number): number;
        getLong(index: number): number;
        getFloat(index: number): number;
        getDouble(index: number): number;
        getBoolean(index: number): boolean;
    }

    interface OscMethodCallback {
        handle(source: OscConnection, message: OscMessage): any;
    }

    /**
     * Interface to create Osc related object.
     *
     * @since API version 5
     * @class
     */
    interface OscModule {
        /**
         * Creates a new OscAddressSpace.
         *
         * In short the OscAddressSpace dispatches the incoming messages to services.
         * An OscAddressSpace is an OscService.
         *
         * @since API version 5
         * @return {*}
         */
        createAddressSpace(): OscAddressSpace;
        /**
         * Creates a new OSC Server.
         *
         * @param service Use createAddressSpace
         *
         * @return {void} a new OscServer
         * @since API version 5
         * @param {number} port
         * @param {*} addressSpace
         */
        createUdpServer(port: number, addressSpace: OscAddressSpace): any;
        /**
         * Tries to connect to an OscServer.
         *
         * @param {*} addressSpace can be null
         *
         * @return {*} a new OscConnection
         * @since API version 5
         * @param {string} host
         * @param {number} port
         */
        connectToUdpServer(
            host: string,
            port: number,
            addressSpace: OscAddressSpace
        ): OscConnection;
    }

    /**
     * Base class for OscPackets.
     *
     * @since API version 5
     * @class
     */
    interface OscPacket {
        /**
         * If the message was part of a bundle, get a pointer back to it.
         * If not, this methods returns null.
         * @return {*}
         */
        getParentBundle(): OscBundle;
    }

    enum PlatformType {
        WINDOWS = 0,
        LINUX = 1,
        MAC = 2,
    }

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
        isPolyPressure(): boolean;
        isControlChange(): boolean;
        isProgramChange(): boolean;
        isChannelPressure(): boolean;
        mData: number;
    }

    class SysexBuilder {
        static MAX_LENGTH: number;
        static fromHex(hexString: string): SysexBuilder;
        addByte(value: number): SysexBuilder;
        addString(string: string, length: number): SysexBuilder;
        add(bytes: number[]): SysexBuilder;
        addHex(hex: string): SysexBuilder;
        terminate(): number[];
        array(): number[];
        mData: number[];
        mLength: number;
        constructor();
    }

    interface BooleanValueChangedCallback extends ValueChangedCallback {
        (newValue: boolean): any;
    }

    interface Callback {}

    interface ClipLauncherSlotBankPlaybackStateChangedCallback extends Callback {
        /**
         * Registers an observer that reports the playback state of clips / slots. The reported states include
         * `stopped`, `playing`, `recording`, but also `queued for stop`, `queued for playback`, `queued for
         * recording`.
         *
         * @param callback
         * a callback function that receives three parameters: 1. the slot index (integer), 2. the queued
         * or playback state: `0` when stopped, `1` when playing, or `2` when recording, and 3. a boolean
         * parameter indicating if the second argument is referring to the queued state (`true`) or the
         * actual playback state (`false`)
         * @since API version 1
         * @param {number} slotIndex
         * @param {number} playbackState
         * @param {boolean} isQueued
         */
        (slotIndex: number, playbackState: number, isQueued: boolean): any;
    }

    interface ColorValueChangedCallback extends ValueChangedCallback {
        /**
         * As alpha component was introduced after this interface was released,
         * the alpha component is not part of the parameter and would have to be
         * checked manually.
         * @param {number} red
         * @param {number} green
         * @param {number} blue
         */
        (red: number, green: number, blue: number): any;
    }

    interface ConnectionEstablishedCallback extends Callback {
        (connection: RemoteConnection): any;
    }

    interface DataReceivedCallback extends Callback {
        (data: number[]): any;
    }

    interface DirectParameterDisplayedValueChangedCallback extends Callback {
        (id: string, value: string): any;
    }

    interface DirectParameterNameChangedCallback extends Callback {
        (id: string, name: string): any;
    }

    interface DirectParameterNormalizedValueChangedCallback extends Callback {
        (id: string, normalizedValue: number): any;
    }

    interface DoubleValueChangedCallback extends ValueChangedCallback {
        (newValue: number): any;
    }

    interface EnumValueChangedCallback extends ObjectValueChangedCallback<string> {}

    interface FloatValueChangedCallback extends Callback {
        (newValue: number): any;
    }

    interface IndexedBooleanValueChangedCallback extends IndexedValueChangedCallback {
        /**
         * Registers an observer that reports the names of the scenes and slots. The slot names reflect the names
         * of containing clips.
         *
         * @param callback
         * a callback function receiving two parameters: 1. the slot index (integer) within the
         * configured window, and 2. the name of the scene/slot (string)
         * @since API version 1
         * @param {number} index
         * @param {boolean} newValue
         */
        (index: number, newValue: boolean): any;
    }

    interface IndexedColorValueChangedCallback extends IndexedValueChangedCallback {
        /**
         * Registers an observer that reports the names of the scenes and slots. The slot names reflect the names
         * of containing clips.
         *
         * @param callback
         * a callback function receiving two parameters: 1. the slot index (integer) within the
         * configured window, and 2. the name of the scene/slot (string)
         * @since API version 1
         * @param {number} index
         * @param {number} red
         * @param {number} green
         * @param {number} blue
         */
        (index: number, red: number, green: number, blue: number): any;
    }

    interface IndexedStringValueChangedCallback extends IndexedValueChangedCallback {
        /**
         * Registers an observer that reports the names of the scenes and slots. The slot names reflect the names
         * of containing clips.
         *
         * @param callback
         * a callback function receiving two parameters: 1. the slot index (integer) within the
         * configured window, and 2. the name of the scene/slot (string)
         * @since API version 1
         * @param {number} index
         * @param {string} newValue
         */
        (index: number, newValue: string): any;
    }

    interface IndexedValueChangedCallback extends Callback {}

    interface IntegerValueChangedCallback extends ValueChangedCallback {
        (newValue: number): any;
    }

    interface NoArgsCallback extends Callback {
        (): any;
    }

    interface NotePlaybackCallback extends Callback {
        (isNoteOn: boolean, key: number, velocity: number): any;
    }

    interface ObjectValueChangedCallback<ValueType> extends ValueChangedCallback {
        (newValue: ValueType): any;
    }

    interface ShortMidiDataReceivedCallback extends Callback {
        /**
         * Registers a callback for receiving short (normal) MIDI messages on this MIDI input port.
         *
         * @param callback
         * a callback function that receives three integer parameters: 1. the status byte 2. the data1
         * value 2. the data2 value
         * @ @since API version 1
         * @param {number} statusByte
         * @param {number} data1
         * @param {number} data2
         */
        (statusByte?: any, data1?: any, data2?: any): any;
    }

    interface ShortMidiMessageReceivedCallback extends ShortMidiDataReceivedCallback {
        /**
         *
         * @param {number} statusByte
         * @param {number} data1
         * @param {number} data2
         */
        (statusByte?: any, data1?: any, data2?: any): any;
    }

    interface StepDataChangedCallback extends Callback {
        /**
         * A callback function that receives three parameters: 1. the x (step) coordinate within the note grid
         * (integer), 2. the y (key) coordinate within the note grid (integer), and 3. an integer value that
         * indicates if the step is empty (`0`) or if a note continues playing (`1`) or starts playing (`2`).
         * @param {number} x
         * @param {number} y
         * @param {number} state
         */
        (x: number, y: number, state: number): any;
    }

    interface StringArrayValueChangedCallback extends ObjectValueChangedCallback<string[]> {}

    interface StringValueChangedCallback extends ObjectValueChangedCallback<string> {}

    interface SysexMidiDataReceivedCallback extends Callback {
        /**
         * @param {string} data
         * The data encoded as a hex string
         */
        (data: string): any;
    }

    interface ValueChangedCallback extends Callback {}

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
     * @class
     */
    interface Action {
        /**
         * Returns a string the identifies this action uniquely.
         *
         * @return {string} the identifier string
         * @since API version 1
         */
        getId(): string;
        /**
         * Returns the name of this action.
         *
         * @return {string} the name string
         * @since API version 1
         */
        getName(): string;
        /**
         * Returns the category of this action.
         *
         * @return {*} the category string
         * @since API version 1
         */
        getCategory(): ActionCategory;
        /**
         * Returns the text that is displayed in menu items associated with this action.
         *
         * @return {string} the menu item text
         * @since API version 1
         */
        getMenuItemText(): string;
        /**
         * Invokes the action.
         *
         * @since API version 1
         */
        invoke(): any;
    }

    /**
     * Instances of this interface are used to categorize actions in Bitwig Studio. The list of action categories
     * provided by Bitwig Studio can be queried by calling {@link Application#getActionCategories()}. To receive a
     * specific action category call {@link Application#getActionCategory(String)}.
     *
     * @see Application#getActionCategories()
     * @see Application#getActionCategory(String)
     * @since API version 1
     * @class
     */
    interface ActionCategory {
        /**
         * Returns a string the identifies this action category uniquely.
         *
         * @return {string} the identifier string
         * @since API version 1
         */
        getId(): string;
        /**
         * Returns the name of this action category.
         *
         * @return {string} the name string
         * @since API version 1
         */
        getName(): string;
        /**
         * Lists all actions in this category.
         *
         * @return {Array} the array of actions in this category
         * @since API version 1
         */
        getActions(): Action[];
    }

    /**
     * An interface that provides methods for accessing the most common global application commands.<br/>
     *
     * In addition, functions are provided for accessing any application action in a generic and categorized way,
     * pretty much as displayed in the Bitwig Studio commander dialog (see {@link #getActions()},
     * {@link #getAction(String)}, {@link #getActionCategories()}), {@link #getActionCategory(String)}).<br/>
     *
     * To receive an instance of the application interface call {@link ControllerHost#createApplication()}.
     *
     * @since API version 1
     * @class
     */
    interface Application {
        /**
         * Creates a new audio track at the given position.
         *
         * @param {number} position
         * the index within the list of main tracks where the new track should be inserted, or `-1` in
         * case the track should be inserted at the end of the list. Values outside the valid range will
         * get pinned to the valid range, so the actual position might be different from the provided
         * parameter value.
         * @since API version 1
         */
        createAudioTrack(position: number): any;
        /**
         * Creates a new instrument track at the given position.
         *
         * @param {number} position
         * the index within the list of main tracks where the new track should be inserted, or `-1` in
         * case the track should be inserted at the end of the list. Values outside the valid range will
         * get pinned to the valid range, so the actual position might be different from the provided
         * parameter value.
         * @since API version 1
         */
        createInstrumentTrack(position: number): any;
        /**
         * Creates a new effect track at the given position.
         *
         * @param {number} position
         * the index within the list of effect tracks where the new track should be inserted, or `-1` in
         * case the track should be inserted at the end of the list. Values outside the valid range will
         * get pinned to the valid range, so the actual position might be different from the provided
         * parameter value.
         * @since API version 1
         */
        createEffectTrack(position: number): any;
        /**
         * Returns a list of actions that the application supports. Actions are commands in Bitwig Studio that are
         * typically accessible through menus or keyboard shortcuts.
         *
         * Please note that many of the commands encapsulated by the reported actions are also accessible through
         * other (probably more convenient) interfaces methods of the API. In contrast to that, this method
         * provides a more generic way to find available application functionality.
         *
         * @return {Array} the list of actions
         * @ @since API version 1
         */
        getActions(): Action[];
        /**
         * Returns the action for the given action identifier. For a list of available actions, see
         * {@link #getActions()}.
         *
         * @param {string} id
         * the action identifier string, must not be `null`
         * @return {*} the action associated with the given id, or null in case there is no action with the given
         * identifier.
         * @ @since API version 1
         */
        getAction(id: string): Action;
        /**
         * Returns a list of action categories that is used by Bitwig Studio to group actions into categories.
         *
         * @return {Array} the list of action categories
         * @ @since API version 1
         */
        getActionCategories(): ActionCategory[];
        /**
         * Returns the action category associated with the given identifier. For a list of available action
         * categories, see {@link #getActionCategories()}.
         *
         * @param {string} id
         * the category identifier string, must not be `null`
         * @return {*} the action associated with the given id, or null in case there is no category with the given
         * identifier
         * @ @since API version 1
         */
        getActionCategory(id: string): ActionCategory;
        /**
         * Activates the audio engine in Bitwig Studio.
         *
         * @since API version 1
         */
        activateEngine(): any;
        /**
         * Deactivates the audio engine in Bitwig Studio.
         *
         * @since API version 1
         */
        deactivateEngine(): any;
        /**
         * Value that reports whether an audio engine is active or not.
         *
         * @since API version 2
         * @return {*}
         */
        hasActiveEngine(): BooleanValue;
        /**
         * Registers an observer that gets called when the audio engine becomes active or inactive.
         *
         * @param {*} callable
         * a callback function that accepts a single boolean parameter. The callback parameter indicates
         * whether the audio engine became active (true) or inactive (false).
         * @since API version 1
         * @deprecated Use {@link #hasActiveEngine()} instead.
         */
        addHasActiveEngineObserver(callable: BooleanValueChangedCallback): any;
        /**
         * Value that reports the name of the current project.
         *
         * @since API version 2
         * @return {*}
         */
        projectName(): StringValue;
        /**
         * Registers an observer that reports the name of the current project.
         *
         * @param {*} callback
         * a callback function that accepts a single string parameter.
         * @param {number} maxChars
         * the maximum length of the reported name. Longer names will get truncated.
         * @since API version 1
         * @deprecated Use {@link #projectName()} instead.
         */
        addProjectNameObserver(callback: StringValueChangedCallback, maxChars: number): any;
        /**
         * Switches to the next project tab in Bitwig Studio.
         *
         * @since API version 1
         */
        nextProject(): any;
        /**
         * Switches to the previous project tab in Bitwig Studio.
         *
         * @since API version 1
         */
        previousProject(): any;
        /**
         * Set BitwigStudio to navigate into the group.
         *
         * @since API version 2
         * @param {*} track
         */
        navigateIntoTrackGroup(track: Track): any;
        /**
         * Set BitwigStudio to navigate into the parent group.
         *
         * @since API version 2
         */
        navigateToParentTrackGroup(): any;
        /**
         * Sends an undo command to Bitwig Studio.
         *
         * @since API version 1
         */
        undo(): any;
        /**
         * Sends a redo command to Bitwig Studio.
         *
         * @since API version 1
         */
        redo(): any;
        /**
         * Switches the Bitwig Studio user interface to the panel layout with the given name. The list of available
         * panel layouts depends on the active display profile.
         *
         * @param {string} panelLayout
         * the name of the new panel layout
         * @since API version 1
         */
        setPanelLayout(panelLayout: string): any;
        /**
         * Switches to the next panel layout of the active display profile in Bitwig Studio.
         *
         * @since API version 1
         */
        nextPanelLayout(): any;
        /**
         * Switches to the previous panel layout of the active display profile in Bitwig Studio.
         *
         * @since API version 1
         */
        previousPanelLayout(): any;
        /**
         * Value that reports the name of the active panel layout.
         *
         * @since API version 2
         * @return {*}
         */
        panelLayout(): StringValue;
        /**
         * Registers an observer that reports the name of the active panel layout.
         *
         * @param {*} callable
         * a callback function object that accepts a single string parameter
         * @param {number} maxChars
         * the maximum length of the panel layout name
         * @since API version 1
         * @deprecated Use {@link #panelLayout()} instead.
         */
        addPanelLayoutObserver(callable: StringValueChangedCallback, maxChars: number): any;
        /**
         * Value that reports the name of the active display profile.
         *
         * @since API version 2
         * @return {*}
         */
        displayProfile(): StringValue;
        /**
         * Registers an observer that reports the name of the active display profile.
         *
         * @param {*} callable
         * a callback function object that accepts a single string parameter
         * @param {number} maxChars
         * the maximum length of the display profile name
         * @since API version 1
         * @deprecated Use {@link #displayProfile()} instead.
         */
        addDisplayProfileObserver(callable: StringValueChangedCallback, maxChars: number): any;
        /**
         * Toggles the visibility of the inspector panel.
         *
         * @since API version 1
         */
        toggleInspector(): any;
        /**
         * Toggles the visibility of the device chain panel.
         *
         * @since API version 1
         */
        toggleDevices(): any;
        /**
         * Toggles the visibility of the mixer panel.
         *
         * @since API version 1
         */
        toggleMixer(): any;
        /**
         * Toggles the visibility of the note editor panel.
         *
         * @since API version 1
         */
        toggleNoteEditor(): any;
        /**
         * Toggles the visibility of the automation editor panel.
         *
         * @since API version 1
         */
        toggleAutomationEditor(): any;
        /**
         * Toggles the visibility of the browser panel.
         *
         * @since API version 1
         */
        toggleBrowserVisibility(): any;
        /**
         * Shows the previous detail panel (note editor, device, automation).
         *
         * @since API version 1
         */
        previousSubPanel(): any;
        /**
         * Shows the next detail panel (note editor, device, automation).
         *
         * @since API version 1
         */
        nextSubPanel(): any;
        /**
         * Equivalent to an Arrow-Left key stroke on the computer keyboard. The concrete functionality depends on
         * the current keyboard focus in Bitwig Studio.
         *
         * @since API version 1
         */
        arrowKeyLeft(): any;
        /**
         * Equivalent to an Arrow-Right key stroke on the computer keyboard. The concrete functionality depends on
         * the current keyboard focus in Bitwig Studio.
         *
         * @since API version 1
         */
        arrowKeyRight(): any;
        /**
         * Equivalent to an Arrow-Up key stroke on the computer keyboard. The concrete functionality depends on the
         * current keyboard focus in Bitwig Studio.
         *
         * @since API version 1
         */
        arrowKeyUp(): any;
        /**
         * Equivalent to an Arrow-Down key stroke on the computer keyboard. The concrete functionality depends on
         * the current keyboard focus in Bitwig Studio.
         *
         * @since API version 1
         */
        arrowKeyDown(): any;
        /**
         * Equivalent to an Enter key stroke on the computer keyboard. The concrete functionality depends on the
         * current keyboard focus in Bitwig Studio.
         *
         * @since API version 1
         */
        enter(): any;
        /**
         * Equivalent to an Escape key stroke on the computer keyboard. The concrete functionality depends on the
         * current keyboard focus in Bitwig Studio.
         *
         * @since API version 1
         */
        escape(): any;
        /**
         * Selects all items according the current selection focus in Bitwig Studio.
         *
         * @since API version 1
         */
        selectAll(): any;
        /**
         * Deselects any items according the current selection focus in Bitwig Studio.
         *
         * @since API version 1
         */
        selectNone(): any;
        /**
         * Cuts the selected items in Bitwig Studio if applicable.
         *
         * @since API version 1
         */
        cut(): any;
        /**
         * Copies the selected items in Bitwig Studio to the clipboard if applicable.
         *
         * @since API version 1
         */
        copy(): any;
        /**
         * Pastes the clipboard contents into the current selection focus in Bitwig Studio if applicable.
         *
         * @since API version 1
         */
        paste(): any;
        /**
         * Duplicates the active selection in Bitwig Studio if applicable.
         *
         * @since API version 1
         */
        duplicate(): any;
        /**
         * Deletes the selected items in Bitwig Studio if applicable. Originally this function was called `delete`
         * (Bitwig Studio 1.0). But as `delete` is reserved in JavaScript this function got renamed to `remove` in
         * Bitwig Studio 1.0.9.
         *
         * @since API version 1
         */
        remove(): any;
        /**
         * Opens a text input field in Bitwig Studio for renaming the selected item.
         *
         * @since API version 1
         */
        rename(): any;
        /**
         * Zooms in one step into the currently focused editor of the Bitwig Studio user interface.
         *
         * @since API version 1
         */
        zoomIn(): any;
        /**
         * Zooms out one step in the currently focused editor of the Bitwig Studio user interface.
         *
         * @since API version 1
         */
        zoomOut(): any;
        /**
         * Adjusts the zoom level of the currently focused editor so that it matches the active selection.
         *
         * @since API version 1
         */
        zoomToSelection(): any;
        /**
         * Adjusts the zoom level of the currently focused editor so that all content becomes visible.
         *
         * @since API version 1
         */
        zoomToFit(): any;
        /**
         * Moves the panel focus to the panel on the left of the currently focused panel.
         *
         * @since API version 1
         */
        focusPanelToLeft(): any;
        /**
         * Moves the panel focus to the panel right to the currently focused panel.
         *
         * @since API version 1
         */
        focusPanelToRight(): any;
        /**
         * Moves the panel focus to the panel above the currently focused panel.
         *
         * @since API version 1
         */
        focusPanelAbove(): any;
        /**
         * Moves the panel focus to the panel below the currently focused panel.
         *
         * @since API version 1
         */
        focusPanelBelow(): any;
        /**
         * Toggles between full screen and windowed user interface.
         *
         * @since API version 1
         */
        toggleFullScreen(): any;
        /**
         * @deprecated Use {@link #setPanelLayout(java.lang.String)} instead.
         * @since API version 1
         * @param {string} perspective
         */
        setPerspective(perspective: string): any;
        /**
         * @deprecated Use {@link #nextPanelLayout()} instead.
         * @since API version 1
         */
        nextPerspective(): any;
        /**
         * @deprecated Use {@link #previousPanelLayout()} instead.
         * @since API version 1
         */
        previousPerspective(): any;
        /**
         * @deprecated Use {@link #addPanelLayoutObserver(org.mozilla.javascript.Callable, int)} instead.
         * @since API version 1
         * @param {*} callable
         * @param {number} maxChars
         * @param {string} fallbackText
         */
        addSelectedModeObserver(
            callable: StringValueChangedCallback,
            maxChars: number,
            fallbackText: string
        ): any;
    }
    namespace Application {
        /**
         * This identifier can be used as parameter for {@link #setPanelLayout(String)} in order to switch to the
         * `ARRANGE` panel layout that is available in various display profiles.
         */
        let PANEL_LAYOUT_ARRANGE: string;
        /**
         * This identifier can be used as parameter for {@link #setPanelLayout(String)} in order to switch to the
         * `EDIT` panel layout that is available in various display profiles.
         */
        let PANEL_LAYOUT_MIX: string;
        /**
         * This identifier can be used as parameter for {@link #setPanelLayout(String)} in order to switch to the
         * `MIX` panel layout that is available in various display profiles.
         */
        let PANEL_LAYOUT_EDIT: string;
    }

    /**
     * An interface representing various commands which can be performed on the Bitwig Studio arranger.<br/>
     *
     * To receive an instance of the application interface call {@link ControllerHost#createArranger}.
     *
     * @since API version 1
     * @class
     */
    interface Arranger {
        /**
         * Gets an object that allows to enable/disable arranger playback follow. Observers can be registered on
         * the returned object for receiving notifications when the setting switches between on and off.
         *
         * @return {*} a boolean value object that represents the enabled state of arranger playback follow
         * @since API version 1
         */
        isPlaybackFollowEnabled(): SettableBooleanValue;
        /**
         * Gets an object that allows to control the arranger track height. Observers can be registered on the
         * returned object for receiving notifications when the track height changes.
         *
         * @return {*} a boolean value object that has the state `true` when the tracks have double row height and
         * `false` when the tracks have single row height.
         * @since API version 1
         */
        hasDoubleRowTrackHeight(): SettableBooleanValue;
        /**
         * Gets an object that allows to show/hide the cue markers in the arranger panel. Observers can be
         * registered on the returned object for receiving notifications when the cue marker lane switches between
         * shown and hidden.
         *
         * @return {*} a boolean value object that represents the cue marker section visibility
         * @since API version 1
         */
        areCueMarkersVisible(): SettableBooleanValue;
        /**
         * Gets an object that allows to show/hide the clip launcher in the arranger panel. Observers can be
         * registered on the returned object for receiving notifications when the clip launcher switches between
         * shown and hidden.
         *
         * @return {*} a boolean value object that represents the clip launcher visibility
         * @since API version 1
         */
        isClipLauncherVisible(): SettableBooleanValue;
        /**
         * Gets an object that allows to show/hide the timeline in the arranger panel. Observers can be registered
         * on the returned object for receiving notifications when the timeline switches between shown and hidden.
         *
         * @return {*} a boolean value object that represents the timeline visibility
         * @since API version 1
         */
        isTimelineVisible(): SettableBooleanValue;
        /**
         * Gets an object that allows to show/hide the track input/output choosers in the arranger panel. Observers
         * can be registered on the returned object for receiving notifications when the I/O section switches
         * between shown and hidden.
         *
         * @return {*} a boolean value object that represents the visibility of the track I/O section
         * @since API version 1
         */
        isIoSectionVisible(): SettableBooleanValue;
        /**
         * Gets an object that allows to show/hide the effect tracks in the arranger panel. Observers can be
         * registered on the returned object for receiving notifications when the effect track section switches
         * between shown and hidden.
         *
         * @return {*} a boolean value object that represents the visibility of the effect track section
         * @since API version 1
         */
        areEffectTracksVisible(): SettableBooleanValue;
        /**
         * Returns an object that provides access to a bank of successive cue markers using a window configured with
         * the given size, that can be scrolled over the list of markers.
         *
         * @param {number} size
         * the number of simultaneously accessible items
         * @return {*} the requested item bank object
         */
        createCueMarkerBank(size: number): CueMarkerBank;
        /**
         * Registers an observer that reports if playback-follow is enabled.
         *
         * @param {*} callback
         * a callback function object that accepts a single bool parameter
         * @see #isPlaybackFollowEnabled()
         * @deprecated call `isPlaybackFollowEnabled().addValueObserver` instead
         * @since API version 1
         */
        addPlaybackFollowObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports the current configuration of the arranger track row height.
         *
         * @param {*} callback
         * a callback function object that accepts a single bool parameter. The parameter indicates if
         * the row height is double (`true`) or single (`false`).
         * @see #hasDoubleRowTrackHeight()
         * @deprecated call `hasDoubleRowTrackHeight().addValueObserver` instead
         * @since API version 1
         */
        addTrackRowHeightObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the cue marker lane is visible.
         *
         * @param {*} callback
         * a callback function object that accepts a single bool parameter.
         * @see #areCueMarkersVisible()
         * @deprecated call `areCueMarkersVisible().addValueObserver` instead
         * @since API version 1
         */
        addCueMarkerVisibilityObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Toggles the playback follow state.
         *
         * @see #isPlaybackFollowEnabled()
         * @deprecated call `isPlaybackFollowEnabled().toggle` instead
         * @since API version 1
         */
        togglePlaybackFollow(): any;
        /**
         * Toggles the arranger track row height between `double` and `single`.
         *
         * @see #hasDoubleRowTrackHeight()
         * @deprecated call `hasDoubleRowTrackHeight().toggle` instead
         * @since API version 1
         */
        toggleTrackRowHeight(): any;
        /**
         * Toggles the visibility of the arranger cue marker lane.
         *
         * @see #areCueMarkersVisible()
         * @deprecated call `areCueMarkersVisible().toggle` instead
         * @since API version 1
         */
        toggleCueMarkerVisibility(): any;
    }

    /**
     * A bank provides access to a range of items in Bitwig Studio. Instances of a bank are configured with a
     * fixed number of items and represent an excerpt of a larger list of items. Various methods are provided for
     * scrolling to different sections of the item list. It basically acts like a window moving over the list of
     * underlying items.
     *
     * @since API version 2
     * @class
     */
    interface Bank<ItemType extends ObjectProxy> extends ObjectProxy, Scrollable {
        /**
         * The fixed size of this bank.
         *
         * @since API version 2
         * @return {number}
         */
        getSizeOfBank(): number;
        /**
         *
         */
        scrollPageForwards(): any;
        /**
         *
         */
        scrollPageBackwards(): any;
        /**
         * Gets the item in the bank at the supplied index. The index must be >= 0 and < {@link #getSizeOfBank()}.
         *
         * @since API version 2
         * @param {number} index
         * @return {*}
         */
        getItemAt(index: number): ItemType;
        /**
         * Value that reports the underlying total item count (not the number of items available in the bank
         * window).
         *
         * @since API version 2
         * @return {*}
         */
        itemCount(): IntegerValue;
        /**
         * An integer value that defines the location of the cursor that this bank is following. If there is no
         * cursor or the cursor is not within the bank then the value is -1.
         *
         * @since API version 2
         * @return {*}
         */
        cursorIndex(): SettableIntegerValue;
    }

    /**
     * Defines a formatter for a beat time that can convert a beat time to a string for display to the user.
     *
     * @since API version 2
     * @class
     */
    interface BeatTimeFormatter {
        /**
         * Formats the supplied beat time as a string in the supplied time signature.
         *
         * @param {number} beatTime
         * The beat time to be formatted
         * @param {boolean} isAbsolute
         * If true the beat time represents an absolute time (such as a time on the arranger) otherwise
         * it represents a beat time duration (such as the length of a clip).
         *
         * @since API version 2
         * @param {number} timeSignatureNumerator
         * @param {number} timeSignatureDenominator
         * @param {number} timeSignatureTicks
         * @return {string}
         */
        formatBeatTime(
            beatTime: number,
            isAbsolute: boolean,
            timeSignatureNumerator: number,
            timeSignatureDenominator: number,
            timeSignatureTicks: number
        ): string;
    }

    /**
     * Instances of this interface represent beat time values.
     *
     * @since API version 1
     * @class
     */
    interface BeatTimeValue extends DoubleValue {
        /**
         * Add an observer which receives the internal raw of the parameter as floating point.
         *
         * @param {*} callback
         * a callback function that receives a single numeric parameter with double precision.
         * @since API version 1
         * @deprecated This exists for backwards compatibility. Use
         * {@link #addValueObserver(DoubleValueChangedCallback)} instead.
         */
        addRawValueObserver(callback: DoubleValueChangedCallback): any;
        /**
         * Gets the current beat time formatted according to the supplied formatter.
         *
         * @since API version 2
         * @param {*} formatter
         * @return {string}
         */
        getFormatted(formatter?: any): any;
        /**
         * Registers an observer that reports the internal beat time value as formatted text, for example
         * "012:03:00:01".
         *
         * @param {string} separator
         * the character used to separate the segments of the formatted beat time, typically ":", "." or
         * "-"
         * @param {number} barsLen
         * the number of digits reserved for bars
         * @param {number} beatsLen
         * the number of digits reserved for beats
         * @param {number} subdivisionLen
         * the number of digits reserved for beat subdivisions
         * @param {number} ticksLen
         * the number of digits reserved for ticks
         * @param {*} callback
         * a callback function that receives a single string parameter
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
        ): any;
    }

    /**
     * Instances of this interface are used for browsing Bitwig Studio document such as devices, presets,
     * multi-samples, or clips. Full access to all filter columns and the result column as shown in Bitwig
     * Studio's contextual browser window is provided.
     *
     * @see BrowsingSession
     * @since API version 1
     * @deprecated Use {@link PopupBrowser} instead.
     * @class
     */
    interface BitwigBrowsingSession extends BrowsingSession {
        /**
         * Returns the creator filter as shown in the category column of Bitwig Studio's contextual browser.
         *
         * @return {*} the requested creator filter object.
         * @since API version 1
         */
        getCreatorFilter(): BrowserFilterColumn;
        /**
         * Returns the tags filter as shown in the category column of Bitwig Studio's contextual browser.
         *
         * @return {*} the requested tags filter object.
         * @since API version 1
         */
        getTagsFilter(): BrowserFilterColumn;
    }

    interface BooleanValue extends Value<BooleanValueChangedCallback> {
        /**
         * Gets the current value.
         *
         * @since API version 2
         * @return {boolean}
         */
        get(): boolean;
    }

    /**
     * Instances of this interface represent a contextual browser in Bitwig Studio.
     *
     * @since API version 1
     * @deprecated Use {@link PopupBrowser} instead.
     * @class
     */
    interface Browser extends ObjectProxy {
        /**
         * Registers an observer that reports if a browsing session was started.
         *
         * @param {*} callback
         * a callback function that receivers a single boolean parameter.
         * @since API version 1
         * @deprecated Use {@link #exists()} instead.
         */
        addIsBrowsingObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Starts a new browser session.
         *
         * @since API version 1
         */
        startBrowsing(): any;
        /**
         * Cancels the current browser session.
         *
         * @since API version 1
         */
        cancelBrowsing(): any;
        /**
         * Finished the browser session by loading the selected item.
         *
         * @since API version 1
         */
        commitSelectedResult(): any;
        /**
         * Activates the given search session. Please note that only one search session can be active at a time.
         *
         * @param {*} session
         * the session that should be activated.
         * @since API version 1
         */
        activateSession(session: BrowsingSession): any;
        /**
         * Return an object allows to observe and control if the browser window should be small or full-sized.
         *
         * @return {*} a boolean value object
         * @since API version 1
         */
        isWindowMinimized(): SettableBooleanValue;
        /**
         * Return an object allows to observe and control if the selected result should be auditioned.
         *
         * @return {*} a boolean value object
         * @since API version 1
         */
        shouldAudition(): SettableBooleanValue;
        /**
         * Returns an object that provided bank-wise navigation of the available search sessions. Each search
         * session is dedicated to a certain material type, as shown in the tabs of Bitwig Studio's contextual
         * browser.
         *
         * @param {number} size
         * the size of the windows used to navigate the available browsing sessions.
         * @return {*} the requested file column bank object
         * @since API version 1
         */
        createSessionBank(size: number): BrowsingSessionBank;
        /**
         * Returns an object that represents the selected tab as shown in Bitwig Studio's contextual browser
         * window.
         *
         * @return {*} the requested browsing session cursor
         * @since API version 1
         */
        createCursorSession(): CursorBrowsingSession;
        /**
         * Returns an object that provides access to the contents of the device tab as shown in Bitwig Studio's
         * contextual browser window.
         *
         * @return {*} the requested device browsing session instance
         * @since API version 1
         */
        getDeviceSession(): DeviceBrowsingSession;
        /**
         * Returns an object that provides access to the contents of the preset tab as shown in Bitwig Studio's
         * contextual browser window.
         *
         * @return {*} the requested preset browsing session instance
         * @since API version 1
         */
        getPresetSession(): PresetBrowsingSession;
        /**
         * Returns an object that provides access to the contents of the samples tab as shown in Bitwig Studio's
         * contextual browser window.
         *
         * @return {*} the requested sample browsing session instance
         * @since API version 1
         */
        getSampleSession(): SampleBrowsingSession;
        /**
         * Returns an object that provides access to the contents of the multi-samples tab as shown in Bitwig
         * Studio's contextual browser window.
         *
         * @return {*} the requested multi-sample browsing session instance
         * @since API version 1
         */
        getMultiSampleSession(): MultiSampleBrowsingSession;
        /**
         * Returns an object that provides access to the contents of the clips tab as shown in Bitwig Studio's
         * contextual browser window.
         *
         * @return {*} the requested clip browsing session instance
         * @since API version 1
         */
        getClipSession(): ClipBrowsingSession;
        /**
         * Returns an object that provides access to the contents of the music tab as shown in Bitwig Studio's
         * contextual browser window.
         *
         * @return {*} the requested music browsing session instance
         * @since API version 1
         */
        getMusicSession(): MusicBrowsingSession;
    }

    /**
     * Instances of this interface are used to navigate a column in the Bitwig Studio browser.
     *
     * @since API version 1
     * @class
     */
    interface BrowserColumn extends ObjectProxy {
        /**
         * Registers an observer that reports if the column exists.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #exists()} instead.
         */
        addExistsObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports the underlying total count of column entries (not the size of the column window).
         *
         * @since API version 2
         * @return {*}
         */
        entryCount(): IntegerValue;
        /**
         * Registers an observer that reports the underlying total count of column entries (not the size of the
         * column window).
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #entryCount()}.addValueObserver(callback)
         */
        addEntryCountObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Returns the cursor item, which can be used to navigate over the list of entries.
         *
         * @return {*} the requested filter item object
         * @since API version 1
         */
        createCursorItem(): BrowserItem;
        /**
         * Returns an object that provides access to a bank of successive entries using a window configured with
         * the given size, that can be scrolled over the list of entries.
         *
         * @param {number} size
         * the number of simultaneously accessible items
         * @return {*} the requested item bank object
         */
        createItemBank(size: number): BrowserItemBank<any>;
    }

    /**
     * Instances of this interface are used to navigate a filter column in the Bitwig Studio browser.
     *
     * @since API version 1
     * @class
     */
    interface BrowserFilterColumn extends BrowserColumn {
        /**
         * Returns the filter item that represents the top-level all/any/everything wildcard item.
         *
         * @return {*} the requested filter item object
         * @since API version 1
         */
        getWildcardItem(): BrowserFilterItem;
        /**
         * Returns the cursor filter item, which can be used to navigate over the list of entries.
         *
         * @return {*} the requested filter item object
         * @since API version 1
         */
        createCursorItem(): BrowserFilterItem;
        /**
         * Returns an object that provides access to a bank of successive entries using a window configured with
         * the given size, that can be scrolled over the list of entries.
         *
         * @param {number} size
         * the number of simultaneously accessible items
         * @return {*} the requested item bank object
         */
        createItemBank(size: number): BrowserFilterItemBank;
        /**
         * Value that reports the name of the filter column.
         *
         * @since API version2
         * @return {*}
         */
        name(): StringValue;
        /**
         * Registers an observer that reports the name of the filter column.
         *
         * @param {*} callback
         * a callback function that receives a single string argument.
         * @since API version 1
         * @deprecated Use {@link #name()} instead.
         * @param {number} maxCharacters
         * @param {string} textWhenUnassigned
         */
        addNameObserver(
            maxCharacters: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
    }

    /**
     * Instances of this interface are used to navigate the columns of a Bitwig Studio browser session.
     *
     * @since API version 1
     * @deprecated Use {@link PopupBrowser} instead.
     * @class
     */
    interface BrowserFilterColumnBank extends Bank<BrowserFilterColumn> {
        /**
         * Returns the window size that was used to configure the filter column during creation.
         *
         * @return {number} the size of the filter column.
         */
        getSize(): number;
        /**
         * Returns the filter column for the given index.
         *
         * @param {number} index
         * the item index, must be in the range `[0..getSize-1]`
         * @return {*} the requested filter column object
         */
        getItem(index: number): BrowserFilterColumn;
        /**
         * Scrolls the filter columns one item up.
         *
         * @since API version 1
         */
        scrollUp(): any;
        /**
         * Scrolls the filter columns one item down.
         *
         * @since API version 1
         */
        scrollDown(): any;
        /**
         * Scrolls the filter columns one page up. For example if the bank is configured with a window size of 8
         * entries and is currently showing items [1..8], calling this method would scroll the window to show
         * columns [9..16].
         *
         * @since API version 1
         */
        scrollPageUp(): any;
        /**
         * Scrolls the filter columns one page up. For example if the bank is configured with a window size of 8
         * entries and is currently showing items [9..16], calling this method would scroll the window to show
         * columns [1..8].
         *
         * @since API version 1
         */
        scrollPageDown(): any;
        /**
         * Registers an observer that reports the current scroll position, more specifically the position of the
         * first item within the underlying list of columns, that is shown as the first column within the window.
         *
         * @param {*} callback
         * a callback function that receives a single integer number parameter. The parameter reflects
         * the scroll position, or `-1` in case the column has no content.
         * @since API version 1
         */
        addScrollPositionObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Registers an observer that reports if the columns can be scrolled further up.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         */
        addCanScrollUpObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the columns can be scrolled further down.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         */
        addCanScrollDownObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports the underlying total count of columns (not the size of the window).
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         */
        addEntryCountObserver(callback: IntegerValueChangedCallback): any;
    }

    /**
     * Instances of this interface represent entries in a browser filter column.
     *
     * @since API version 1
     * @class
     */
    interface BrowserFilterItem extends BrowserItem {
        /**
         * Value that reports the hit count of the filter item.
         *
         * @since API version 2
         * @return {*}
         */
        hitCount(): IntegerValue;
        /**
         * Registers an observer that reports the hit count of the filter item.
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #hitCount()} instead.
         */
        addHitCountObserver(callback: IntegerValueChangedCallback): any;
    }

    /**
     * Instances of this interface are used to navigate a filter column in the Bitwig Studio browser.
     *
     * @since API version 1
     * @class
     */
    interface BrowserFilterItemBank extends BrowserItemBank<BrowserFilterItem> {}

    /**
     * Instances of this interface represent entries in a browser filter column.
     *
     * @since API version 1
     * @class
     */
    interface BrowserItem extends ObjectProxy {
        /**
         * Registers an observer that reports if the item exists.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #exists()} instead.
         */
        addExistsObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports the name of the browser item.
         *
         * @since API version 2
         * @return {*}
         */
        name(): StringValue;
        /**
         * Registers an observer that reports the string value of the browser item.
         *
         * @param {number} maxCharacters
         * @param {string} textWhenUnassigned
         * @param {*} callback
         * a callback function that receives a single string argument
         * @since API version 1
         * @deprecated Use {@link #name()} instead.
         */
        addValueObserver(
            maxCharacters: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Returns an object that provides access to the selected state of the browser item.
         *
         * @return {*} an boolean value object
         * @since API version 1
         */
        isSelected(): SettableBooleanValue;
    }

    /**
     * Instances of this interface are used to navigate a column in the Bitwig Studio browser.
     *
     * @since API version 1
     * @class
     */
    interface BrowserItemBank<ItemType extends BrowserItem> extends Bank<ItemType> {
        /**
         * Returns the window size that was used to configure the filter column during creation.
         *
         * @return {number} the size of the filter column.
         * @since API version 1
         * @deprecated Use {@link #getSizeOfBank()} instead.
         */
        getSize(): number;
        /**
         * Returns the item for the given index.
         *
         * @param {number} index
         * the item index, must be in the range `[0..getSize-1]`
         * @return {*} the requested item object
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
        scrollUp(): any;
        /**
         * Scrolls the filter column entries one item down.
         *
         * @since API version 1
         * @deprecated Use {@link #scrollForwards()} instead.
         */
        scrollDown(): any;
        /**
         * Scrolls the filter column entries one page up. For example if the column is configured with a window
         * size of 8 entries and is currently showing items [1..8], calling this method would scroll the column to
         * show items [9..16].
         *
         * @since API version 1
         * @deprecated Use {@link #scrollPageBackwards()} instead.
         */
        scrollPageUp(): any;
        /**
         * Scrolls the filter column entries one page up. For example if the column is configured with a window
         * size of 8 entries and is currently showing items [9..16], calling this method would scroll the column to
         * show items [1..8].
         *
         * @since API version 1
         * @deprecated Use {@link #scrollPageForwards()} instead.
         */
        scrollPageDown(): any;
        /**
         * Registers an observer that reports the current scroll position, more specifically the position of the
         * first item within the underlying list of entries, that is shown as the first entry within the window.
         *
         * @param {*} callback
         * a callback function that receives a single integer number parameter. The parameter reflects
         * the scroll position, or `-1` in case the column has no content.
         * @since API version 1
         * @deprecated Use {@link #scrollPosition()} instead.
         */
        addScrollPositionObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Registers an observer that reports if the column entries can be scrolled further up.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #canScrollBackwards()} instead.
         */
        addCanScrollUpObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the column entries can be scrolled further down.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #canScrollForwards()} instead.
         */
        addCanScrollDownObserver(callback: BooleanValueChangedCallback): any;
    }

    /**
     * Instances of this interface are used to navigate a results column in the Bitwig Studio browser.
     *
     * @since API version 1
     * @class
     */
    interface BrowserResultsColumn extends BrowserColumn {
        /**
         * Returns the cursor result item, which can be used to navigate over the list of entries.
         *
         * @return {*} the requested filter item object
         * @since API version 1
         */
        createCursorItem(): BrowserResultsItem;
        /**
         * Returns an object that provides access to a bank of successive entries using a window configured with
         * the given size, that can be scrolled over the list of entries.
         *
         * @param {number} size
         * the number of simultaneously accessible items
         * @return {*} the requested item bank object
         */
        createItemBank(size: number): BrowserResultsItemBank;
    }

    /**
     * Instances of this interface represent entries in a browser results column.
     *
     * @since API version 1
     * @class
     */
    interface BrowserResultsItem extends BrowserItem {}

    /**
     * Instances of this interface are used to navigate the results column in the Bitwig Studio browser.
     *
     * @since API version 1
     * @class
     */
    interface BrowserResultsItemBank extends BrowserItemBank<BrowserResultsItem> {}

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
     * @class
     */
    interface BrowsingSession extends ObjectProxy {
        /**
         * Registers an observer that reports if the browser session is available for the current context.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument.
         * @since API version 1
         * @deprecated Use {@link #exists()} instead.
         */
        addIsAvailableObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the browser session is currently active.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument.
         * @since API version 1
         */
        addIsActiveObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Activates the given search session, same as calling {@link Browser#activateSession}. Please note that only one search session can be active at a time.
         *
         * @since API version 1
         * @see Browser#activateSession
         */
        activate(): any;
        /**
         * Returns an object that represents the column which shows the results according to the current filter
         * settings in Bitwig Studio's contextual browser.
         *
         * @return {*} the requested results browser column.
         * @since API version 1
         */
        getResults(): BrowserResultsColumn;
        /**
         * Returns an object used for navigating the entries in the results column of Bitwig Studio's contextual
         * browser.
         *
         * @return {*} the requested cursor object.
         * @since API version 1
         */
        getCursorResult(): CursorBrowserResultItem;
        /**
         * Returns an object that represents the currently loaded material item.
         *
         * @return {*} the requested settled result object
         * @since API version 1
         */
        getSettledResult(): BrowserResultsItem;
        /**
         * Returns an object that can be used to navigate over the various filter sections of the browsing session.
         *
         * @return {*} the requested filter cursor object
         */
        getCursorFilter(): CursorBrowserFilterColumn;
        /**
         * Returns an object that provided bank-wise navigation of filter columns.
         *
         * @return {*} the requested file column bank object
         * @since API version 1
         * @param {number} numColumns
         * the number of columns that are simultaneously accessible.
         */
        createFilterBank(numColumns: number): BrowserFilterColumnBank;
        /**
         * Value that reports the number of results available for the current filter settings.
         *
         * @since API version 2
         * @return {*}
         */
        hitCount(): IntegerValue;
        /**
         * Registers an observer that reports the number of results available for the current filter settings.
         *
         * @param {*} callback
         * a callback function that receives a single integer argument.
         * @since API version 1
         * @deprecated Use {@link #hitCount()} instead.
         */
        addHitCountObserver(callback: IntegerValueChangedCallback): any;
    }

    /**
     * Instances of this interface are used to navigate the available sessions in Bitwig Studio's contextual
     * browser. The sessions are shown as tabs in the graphical user interface of the browser.
     *
     * @since API version 1
     * @class
     */
    interface BrowsingSessionBank extends Bank<GenericBrowsingSession> {
        /**
         * Returns the window size that was used to configure the session bank during creation.
         *
         * @return {number} the size of the session bank.
         * @since API version 1
         */
        getSize(): number;
        /**
         * Returns the browser session for the given index.
         *
         * @param {number} index
         * the session index, must be in the range `[0..getSize-1]`
         * @return {*} the requested browser session object
         * @since API version 1
         */
        getSession(index: number): GenericBrowsingSession;
        /**
         * Scrolls the browser sessions one item up.
         *
         * @since API version 1
         * @deprecated Use {@link #scrollBackwards()} instead.
         */
        scrollUp(): any;
        /**
         * Scrolls the browser sessions one item down.
         *
         * @since API version 1
         * @deprecated Use {@link #canScrollForwards()} instead.
         */
        scrollDown(): any;
        /**
         * Scrolls the browser sessions one page up. For example if the bank is configured with a window size of 8
         * entries and is currently showing items [1..8], calling this method would scroll the window to show items
         * [9..16].
         *
         * @since API version 1
         * @deprecated Use {@link #scrollPageBackwards()} instead.
         */
        scrollPageUp(): any;
        /**
         * Scrolls the filter columns one page up. For example if the bank is configured with a window size of 8
         * entries and is currently showing items [9..16], calling this method would scroll the window to show
         * items [1..8].
         *
         * @since API version 1
         * @deprecated Use {@link #scrollPageForwards()} instead.
         */
        scrollPageDown(): any;
        /**
         * Registers an observer that reports the current scroll position, more specifically the position of the
         * first item within the underlying list of browser sessions, that is shown as the first session within the
         * window.
         *
         * @param {*} callback
         * a callback function that receives a single integer number parameter. The parameter reflects
         * the scroll position, or `-1` in case the column has no content.
         * @since API version 1
         * @deprecated Use {@link #scrollPosition()} instead.
         */
        addScrollPositionObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Registers an observer that reports if the browser sessions can be scrolled further up.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #canScrollBackwards()} instead.
         */
        addCanScrollUpObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the browser sessions can be scrolled further down.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #canScrollForwards()} instead.
         */
        addCanScrollDownObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports the underlying total count of browser sessions (not the size of the
         * window).
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #itemCount()} instead.
         */
        addEntryCountObserver(callback: IntegerValueChangedCallback): any;
    }

    /**
     * This interface represents a chain selector device which can be:
     * - instrument selector
     * - effect selector
     *
     * @since API version 6
     * @class
     */
    interface ChainSelector extends ObjectProxy, Cursor {
        /**
         * The index of the active chain in the chain selector.
         * In case the chain selector has no chains or the value is not connected to the chain selector,
         * then the value will be 0.
         *
         * @since API version 6
         * @return {*}
         */
        activeChainIndex(): SettableIntegerValue;
        /**
         * The number of chains in the chain selector.
         *
         * @since API version 6
         * @return {*}
         */
        chainCount(): IntegerValue;
        /**
         * The active device layer.
         *
         * @since API version 6
         * @return {*}
         */
        activeChain(): DeviceLayer;
        /**
         * Cycle to the next chain.
         * If the current active chain is the last one, then moves to the first one.
         *
         * @since API version 6
         */
        cycleNext(): any;
        /**
         * Cycle to the previous chain.
         * If the current active chain the first one, then moves to the last one.
         *
         * @since API version 6
         */
        cyclePrevious(): any;
    }

    /**
     * This interface defines access to the common attributes and operations of channels, such as tracks or nested
     * device channels.
     *
     * @since API version 1
     * @class
     */
    interface Channel extends DeviceChain {
        /**
         * Returns an object that represents the activated state of the channel.
         *
         * @return {*} an object that provides access to the channels activated state.
         * @since API version 1
         */
        isActivated(): SettableBooleanValue;
        /**
         * Gets a representation of the channels volume control.
         *
         * @return {*} an object that provides access to the channels volume control.
         * @since API version 1
         * @deprecated Use {@link #volume()} instead.
         */
        getVolume(): Parameter;
        /**
         * Gets a representation of the channels volume control.
         *
         * @return {*} an object that provides access to the channels volume control.
         * @since API version 5
         */
        volume(): Parameter;
        /**
         * Gets a representation of the channels pan control.
         *
         * @return {*} an object that provides access to the channels pan control.
         * @since API version 1
         * @deprecated Use {@link #pan()} instead.
         */
        getPan(): Parameter;
        /**
         * Gets a representation of the channels pan control.
         *
         * @return {*} an object that provides access to the channels pan control.
         * @since API version 5
         */
        pan(): Parameter;
        /**
         * Gets a representation of the channels mute control.
         *
         * @return {*} an object that provides access to the channels mute control.
         * @since API version 1
         * @deprecated Use {@link #mute()} instead.
         */
        getMute(): SettableBooleanValue;
        /**
         * Gets a representation of the channels mute control.
         *
         * @return {*} an object that provides access to the channels mute control.
         * @since API version 5
         */
        mute(): SettableBooleanValue;
        /**
         * Gets a representation of the channels solo control.
         *
         * @return {*} an object that provides access to the channels solo control.
         * @since API version 1
         * @deprecated Use {@link #solo()} instead.
         */
        getSolo(): SoloValue;
        /**
         * Gets a representation of the channels solo control.
         *
         * @return {*} an object that provides access to the channels solo control.
         * @since API version 1
         */
        solo(): SoloValue;
        /**
         * Registers an observer for the VU-meter of this track.
         *
         * @param {number} range
         * the number of steps to which the reported values should be scaled. For example a range of 128
         * would cause the callback to be called with values between 0 and 127.
         * @param {number} channel
         * 0 for left channel, 1 for right channel, -1 for the sum of both
         * @param {boolean} peak
         * when `true` the peak value is reported, otherwise the RMS value
         * @param {*} callback
         * a callback function that takes a single numeric argument. The value is in the range
         * [0..range-1].
         * @throws com.bitwig.base.control_surface.ControlSurfaceException
         * @since API version 1
         */
        addVuMeterObserver(
            range: number,
            channel: number,
            peak: boolean,
            callback: IntegerValueChangedCallback
        ): any;
        /**
         * Registers an observer that reports notes when they are played on the channel.
         *
         * @param {*} callback
         * a callback function that receives three parameters: 1. on/off state (boolean), 2. key (int),
         * and 3. velocity (float).
         * @since API version 1
         *
         * @deprecated use {@link #playingNotes()} instead.
         */
        addNoteObserver(callback: NotePlaybackCallback): any;
        /**
         * Returns an array of the playing notes.
         *
         * @since API version 2
         * @return {*}
         */
        playingNotes(): PlayingNoteArrayValue;
        /**
         * Registers an observer that receives notifications about the color of the channel. The callback gets
         * called at least once immediately after this function call to report the current color. Additional calls
         * are fired each time the color changes.
         *
         * @param {*} callback
         * a callback function that receives three float parameters in the range [0..1]: 1. red, 2.
         * green, and 3. blue.
         * @since API version 1
         * @deprecated use {@link #color()} instead.
         */
        addColorObserver(callback: ColorValueChangedCallback): any;
        /**
         * Get the color of the channel.
         *
         * @since API version 2
         * @return {*}
         */
        color(): SettableColorValue;
        /**
         * Gets a {@link SendBank} that can be used to navigate the sends of this channel.
         *
         * @since API version 2
         * @return {*}
         */
        sendBank(): SendBank;
        /**
         * Gets a representation of the channels send control at the given index.
         *
         * @param {number} index
         * the index of the send, must be valid
         * @return {*} an object that provides access to the requested send control.
         * @since API version 1
         * @deprecated Use {@link #sendBank()} instead.
         */
        getSend(index: number): Send;
        /**
         * Duplicates the track.
         *
         * @since API version 1
         */
        duplicate(): any;
        /**
         * Selects the device chain in the Bitwig Studio mixer, in case it is a selectable object.
         *
         * @since API version 1
         */
        selectInMixer(): any;
        /**
         * Registers an observer that reports if the device chain is selected in Bitwig Studio mixer.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter.
         * @since API version 1
         */
        addIsSelectedInMixerObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Tries to scroll the contents of the arrangement editor so that the channel becomes visible.
         *
         * @since API version 1
         */
        makeVisibleInArranger(): any;
        /**
         * Tries to scroll the contents of the mixer panel so that the channel becomes visible.
         *
         * @since API version 1
         */
        makeVisibleInMixer(): any;
    }

    /**
     * A channel bank provides access to a range of channels in Bitwig Studio, such as tracks or device layers.
     * Instances of channel bank are typically configured with support for a fixed number of channels and
     * represent an excerpt of a larger list of channels. Various methods are provided for scrolling to different
     * sections of the channel list. It basically acts like a window moving over the list of channels.
     *
     * @since API version 1
     * @class
     */
    interface ChannelBank<ChannelType extends Channel> extends ObjectProxy, Bank<ChannelType> {
        /**
         * Returns the channel for the given index.
         *
         * @param {number} indexInBank
         * the channel index within this bank, not the index within the list of all Bitwig Studio
         * channels. Must be in the range [0..sizeOfBank-1].
         * @return {*} the channel object
         * @since API version 1
         * @deprecated Use {@link #getItemAt(int)} instead.
         */
        getChannel(indexInBank: number): Channel;
        /**
         * Sets the step size used for scrolling the channel bank.
         *
         * @param {number} stepSize
         * the step size used for scrolling. Default is `1`.
         * @since API version 1
         */
        setChannelScrollStepSize(stepSize: number): any;
        /**
         * Scrolls the channels one page up. For example if the channel bank is configured with a window size of 8
         * channels and is currently showing channel [1..8], calling this method would scroll the channel bank to
         * show channel [9..16].
         *
         * @since API version 1
         * @deprecated {@link #scrollPageBackwards()}
         */
        scrollChannelsPageUp(): any;
        /**
         * Scrolls the channels one page up. For example if the channel bank is configured with a window size of 8
         * channels and is currently showing channel [9..16], calling this method would scroll the channel bank to
         * show channel [1..8].
         *
         * @since API version 1
         * @deprecated {@link #scrollPageForwards()}
         */
        scrollChannelsPageDown(): any;
        /**
         * Scrolls the channel window up by the amount specified via {@link #setChannelScrollStepSize(int)} (by
         * default one channel).
         *
         * @since API version 1
         * @deprecated {@link #scrollBackwards()}
         */
        scrollChannelsUp(): any;
        /**
         * Scrolls the channel window down by the amount specified via {@link #setChannelScrollStepSize(int)} (by
         * default one channel).
         *
         * @since API version 1
         * @deprecated {@link #scrollForwards()}
         */
        scrollChannelsDown(): any;
        /**
         * Scrolls the channel bank window so that the channel at the given position becomes visible.
         *
         * @param {number} position
         * the index of the channel within the underlying full list of channels (not the index within the
         * bank). The position is typically directly related to the layout of the channel list in Bitwig
         * Studio, starting with zero in case of the first channel.
         * @since API version 1
         * @deprecated {@link #scrollPosition()}
         */
        scrollToChannel(position: number): any;
        /**
         * Value that reports the current scroll position, more specifically the position of the
         * first channel within the underlying list of channels, that is shown as channel zero within the bank.
         *
         * @since API version 2
         * @deprecated {@link #scrollPosition()}
         * @return {*}
         */
        channelScrollPosition(): IntegerValue;
        /**
         * Registers an observer that reports the current scroll position, more specifically the position of the
         * first channel within the underlying list of channels, that is shown as channel zero within the bank.
         *
         * @param {*} callback
         * a callback function that receives a single integer number parameter
         * @param {number} valueWhenUnassigned
         * a default value for the channel position that gets reported in case the channel bank is not
         * connected to a list of channels in Bitwig Studio.
         * @since API version 1
         * @deprecated Use {@link #channelScrollPosition()} instead
         */
        addChannelScrollPositionObserver(
            callback: IntegerValueChangedCallback,
            valueWhenUnassigned: number
        ): any;
        /**
         * Value that reports if the channel bank can be scrolled further down.
         *
         * @since API version 2
         * @return {*}
         */
        canScrollChannelsUp(): BooleanValue;
        /**
         * Registers an observer that reports if the channel bank can be scrolled further up.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use canScrollChannelsUp().addValueObserver(callback)
         */
        addCanScrollChannelsUpObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if the channel bank can be scrolled further down.
         *
         * @since API version 2
         * @return {*}
         */
        canScrollChannelsDown(): BooleanValue;
        /**
         * Registers an observer that reports if the channel bank can be scrolled further down.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #canScrollChannelsDown()}.addValueObserver(callback)
         */
        addCanScrollChannelsDownObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports the underlying total channel count (not the number of channels available in the bank
         * window).
         *
         * @since API version 2
         * @return {*}
         */
        channelCount(): IntegerValue;
        /**
         * Registers an observer that reports the underlying total channel count (not the number of channels
         * available in the bank window).
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #channelCount()}.addValueObserver(callback)
         */
        addChannelCountObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Scrolls the sends one page up.
         *
         * @since API version 1
         * @deprecated Does nothing.
         */
        scrollSendsPageUp(): any;
        /**
         * Scrolls the sends one page down.
         *
         * @since API version 1
         * @deprecated Does nothing.
         */
        scrollSendsPageDown(): any;
        /**
         * Scrolls the sends one step up.
         *
         * @since API version 1
         * @deprecated Does nothing.
         */
        scrollSendsUp(): any;
        /**
         * Scrolls the sends one step down.
         *
         * @since API version 1
         * @deprecated Does nothing.
         */
        scrollSendsDown(): any;
        /**
         * Scrolls to the send.
         *
         * @param {number} position
         * the index of the send.
         * @since API version 1
         * @deprecated Does nothing.
         */
        scrollToSend(position: number): any;
        /**
         * Registers an observer that reports if the sends window can be scrolled further up.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter
         * @since API version 1
         * @deprecated Does nothing.
         */
        addCanScrollSendsUpObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the sends window can be scrolled further down.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter
         * @since API version 1
         * @deprecated Does nothing.
         */
        addCanScrollSendsDownObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports the underlying total send count (not the number of sends available in
         * the bank window).
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Does nothing.
         */
        addSendCountObserver(callback: IntegerValueChangedCallback): any;
    }

    /**
     * An interface that provides access to the contents of a clip in Bitwig Studio.
     *
     * The note content of the clip is exposed in terms of steps and keys, mainly targeted to x-y-grid
     * applications such as step sequencers.
     *
     * @since API version 1
     * @class
     */
    interface Clip extends ObjectProxy {
        /**
         * Scroll the note grid so that the given key becomes visible.
         *
         * @param {number} key
         * the key that should become visible
         * @since API version 1
         */
        scrollToKey(key: number): any;
        /**
         * Scrolls the note grid keys one page up. For example if the note grid is configured to show 12 keys and
         * is currently showing keys [36..47], calling this method would scroll the note grid to key range
         * [48..59].
         *
         * @since API version 1
         */
        scrollKeysPageUp(): any;
        /**
         * Scrolls the note grid keys one page down. For example if the note grid is configured to show 12 keys and
         * is currently showing keys [36..47], calling this method would scroll the note grid to key range
         * [48..59].
         *
         * @since API version 1
         */
        scrollKeysPageDown(): any;
        /**
         * Scrolls the note grid keys one key up. For example if the note grid is configured to show 12 keys and is
         * currently showing keys [36..47], calling this method would scroll the note grid to key range [37..48].
         *
         * @since API version 1
         */
        scrollKeysStepUp(): any;
        /**
         * Scrolls the note grid keys one key down. For example if the note grid is configured to show 12 keys and
         * is currently showing keys [36..47], calling this method would scroll the note grid to key range
         * [35..46].
         *
         * @since API version 1
         */
        scrollKeysStepDown(): any;
        /**
         * Scroll the note grid so that the given step becomes visible.
         *
         * @param {number} step
         * the step that should become visible
         * @since API version 1
         */
        scrollToStep(step: number): any;
        /**
         * Scrolls the note grid steps one page forward. For example if the note grid is configured to show 16
         * steps and is currently showing keys [0..15], calling this method would scroll the note grid to key range
         * [16..31].
         *
         * @since API version 1
         */
        scrollStepsPageForward(): any;
        /**
         * Scrolls the note grid steps one page backwards. For example if the note grid is configured to show 16
         * steps and is currently showing keys [16..31], calling this method would scroll the note grid to key
         * range [0..16].
         *
         * @since API version 1
         */
        scrollStepsPageBackwards(): any;
        /**
         * Scrolls the note grid steps one step forward. For example if the note grid is configured to show 16
         * steps and is currently showing keys [0..15], calling this method would scroll the note grid to key range
         * [1..16].
         *
         * @since API version 1
         */
        scrollStepsStepForward(): any;
        /**
         * Scrolls the note grid steps one step backwards. For example if the note grid is configured to show 16
         * steps and is currently showing keys [1..16], calling this method would scroll the note grid to key range
         * [0..15].
         *
         * @since API version 1
         */
        scrollStepsStepBackwards(): any;
        /**
         * Value that reports if the note grid keys can be scrolled further up.
         *
         * @since API version 2
         * @return {*}
         */
        canScrollKeysUp(): BooleanValue;
        /**
         * Registers an observer that reports if the note grid keys can be scrolled further up.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @since API version 1
         * @deprecated Use {@link #canScrollKeysUp()} instead.
         */
        addCanScrollKeysUpObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if the note grid keys can be scrolled further down.
         *
         * @since API version 2
         * @return {*}
         */
        canScrollKeysDown(): BooleanValue;
        /**
         * Registers an observer that reports if the note grid keys can be scrolled further down.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @since API version 1
         * @deprecated Use {@link #canScrollKeysDown()} instead.
         */
        addCanScrollKeysDownObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if the note grid if the note grid steps can be scrolled backwards.
         *
         * @since API version 2
         * @return {*}
         */
        canScrollStepsBackwards(): BooleanValue;
        /**
         * Registers an observer that reports if the note grid steps can be scrolled backwards.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @since API version 1
         * @deprecated Use {@link #canScrollStepsBackwards()} instead.
         */
        addCanScrollStepsBackwardsObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if the note grid if the note grid steps can be scrolled forwards.
         *
         * @since API version 2
         * @return {*}
         */
        canScrollStepsForwards(): BooleanValue;
        /**
         * Registers an observer that reports if the note grid keys can be scrolled forward.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @since API version 1
         * @deprecated Use {@link #canScrollStepsForwards()} instead.
         */
        addCanScrollStepsForwardObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Toggles the existence of a note in the note grid cell specified by the given x and y arguments.
         *
         * @param {number} x
         * the x position within the note grid, defining the step/time of the target note
         * @param {number} y
         * the y position within the note grid, defining the key of the target note
         * @param {number} insertVelocity
         * the velocity of the target note in case a new note gets inserted
         * @since API version 1
         */
        toggleStep(x: number, y: number, insertVelocity: number): any;
        /**
         * Creates a note in the grid cell specified by the given x and y arguments. Existing notes are
         * overwritten.
         *
         * @param {number} x
         * the x position within the note grid, defining the step/time of the new note
         * @param {number} y
         * the y position within the note grid, defining the key of the new note
         * @param {number} insertVelocity
         * the velocity of the new note
         * @param {number} insertDuration
         * the duration of the new note
         * @since API version 1
         */
        setStep(x: number, y: number, insertVelocity: number, insertDuration: number): any;
        /**
         * Removes the note in the grid cell specified by the given x and y arguments. Calling this method does
         * nothing in case no note exists at the given x-y-coordinates.
         *
         * @param {number} x
         * the x position within the note grid, defining the step/time of the target note
         * @param {number} y
         * the y position within the note grid, defining the key of the target note
         * @since API version 1
         */
        clearStep(x: number, y: number): any;
        /**
         * Removes all notes in the grid row specified by the given y argument.
         *
         * @param {number} y
         * the y position within the note grid, defining the key of the target note
         * @since API version 1
         */
        clearSteps(y?: any): any;
        /**
         * Selects the note in the grid cell specified by the given x and y arguments, in case there actually is a
         * note at the given x-y-coordinates.
         *
         * @param {number} x
         * the x position within the note grid, defining the step/time of the target note
         * @param {number} y
         * the y position within the note grid, defining the key of the target note
         * @param {boolean} clearCurrentSelection
         * `true` if the existing selection should be cleared, {@false} if the note should be added to
         * the current selection.
         * @since API version 1
         */
        selectStepContents(x: number, y: number, clearCurrentSelection: boolean): any;
        /**
         * Sets the beat time duration that is represented by one note grid step.
         *
         * @param {number} lengthInBeatTime
         * the length of one note grid step in beat time.
         * @since API version 1
         */
        setStepSize(lengthInBeatTime: number): any;
        /**
         * Registers an observer that reports which note grid steps/keys contain notes.
         *
         * @param {*} callback
         * A callback function that receives three parameters: 1. the x (step) coordinate within the note
         * grid (integer), 2. the y (key) coordinate within the note grid (integer), and 3. an integer
         * value that indicates if the step is empty (`0`) or if a note continues playing (`1`) or starts
         * playing (`2`).
         * @since API version 1
         */
        addStepDataObserver(callback: StepDataChangedCallback): any;
        /**
         * Value that reports note grid cells as they get played by the sequencer.
         *
         * @since API version 2
         * @return {*}
         */
        playingStep(): IntegerValue;
        /**
         * Registers an observer that reports note grid cells as they get played by the sequencer.
         *
         * @param {*} callback
         * A callback function that receives a single integer parameter, which reflects the step
         * coordinate that is played, or -1 if no step is associated with the current playback position.
         * @since API version 1
         * @deprecated Use {@link #playingStep()} instead.
         */
        addPlayingStepObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Updates the name of the clip.
         *
         * @param {string} name
         * the new clip name
         * @since API version 1
         */
        setName(name: string): any;
        /**
         * Returns shuffle settings of the clip.
         *
         * @return {*} the value object that represents the clips shuffle setting.
         * @since API version 1
         */
        getShuffle(): SettableBooleanValue;
        /**
         * Returns accent setting of the clip.
         *
         * @return {*} the ranged value object that represents the clips accent setting.
         * @since API version 1
         */
        getAccent(): SettableRangedValue;
        /**
         * Returns the start of the clip in beat time.
         *
         * @return {*} the beat time object that represents the clips start time.
         * @since API version 1
         */
        getPlayStart(): SettableBeatTimeValue;
        /**
         * Returns the length of the clip in beat time.
         *
         * @return {*} the beat time object that represents the duration of the clip.
         * @since API version 1
         */
        getPlayStop(): SettableBeatTimeValue;
        /**
         * Returns an object that provides access to the loop enabled state of the clip.
         *
         * @return {*} a boolean value object.
         * @since API version 1
         */
        isLoopEnabled(): SettableBooleanValue;
        /**
         * Returns the loop start time of the clip in beat time.
         *
         * @return {*} the beat time object that represents the clips loop start time.
         * @since API version 1
         */
        getLoopStart(): SettableBeatTimeValue;
        /**
         * Returns the loop length of the clip in beat time.
         *
         * @return {*} the beat time object that represents the clips loop length.
         * @since API version 1
         */
        getLoopLength(): SettableBeatTimeValue;
        /**
         * Registers an observer that reports the clip color.
         *
         * @param {*} callback
         * a callback function that receives three parameters: 1. the red coordinate of the RBG color
         * value, 2. the green coordinate of the RBG color value, and 3. the blue coordinate of the RBG
         * color value
         * @since API version 1
         * @deprecated use {@link #color()} instead.
         */
        addColorObserver(callback: ColorValueChangedCallback): any;
        /**
         * Get the color of the clip.
         *
         * @since API version 2
         * @return {*}
         */
        color(): SettableColorValue;
        /**
         * Duplicates the clip.
         *
         * @since API version 1
         */
        duplicate(): any;
        /**
         * Duplicates the content of the clip.
         *
         * @since API version 1
         */
        duplicateContent(): any;
        /**
         * Transposes all notes in the clip by the given number of semitones.
         *
         * @param {number} semitones
         * the amount of semitones to transpose, can be a positive or negative integer value.
         * @since API version 1
         */
        transpose(semitones: number): any;
        /**
         * Quantizes the start time of all notes in the clip according to the given amount. The note lengths remain
         * the same as before.
         *
         * @param {number} amount
         * a factor between `0` and `1` that allows to morph between the original note start and the
         * quantized note start.
         * @since API version 1
         */
        quantize(amount: number): any;
        /**
         * Gets the track that contains the clip.
         *
         * @return {*} a track object that represents the track which contains the clip.
         * @since API version 1
         */
        getTrack(): Track;
    }

    /**
     * Instances of this interface are used for browsing clips, including access to all filter columns and the
     * result column as shown in the 'Clips' tab of Bitwig Studio's contextual browser window.
     *
     * @see BrowsingSession
     * @since API version 1
     * @deprecated Use {@link PopupBrowser} instead.
     * @class
     */
    interface ClipBrowsingSession extends BrowsingSession {
        /**
         * Returns the file type filter as shown in the category column of the browser.
         *
         * @return {*} the requested file type filter object.
         * @since API version 1
         */
        getFileTypeFilter(): BrowserFilterColumn;
    }

    interface ClipLauncherSlot extends ClipLauncherSlotOrScene {
        /**
         * Value that reports whether this slot is selected or not.
         *
         * @since API version 2
         * @return {*}
         */
        isSelected(): BooleanValue;
        /**
         * Value that reports whether this slot has content or not.
         *
         * @since API version 2
         * @return {*}
         */
        hasContent(): BooleanValue;
        /**
         * Value that reports whether this slot is playing or not.
         *
         * @since API version 2
         * @return {*}
         */
        isPlaying(): BooleanValue;
        /**
         * Value that reports whether this slot is queued for playback or not.
         *
         * @since API version 2
         * @return {*}
         */
        isPlaybackQueued(): BooleanValue;
        /**
         * Value that reports whether this slot is recording or not.
         *
         * @since API version 2
         * @return {*}
         */
        isRecording(): BooleanValue;
        /**
         * Value that reports whether this slot is queued for recording or not.
         *
         * @since API version 2
         * @return {*}
         */
        isRecordingQueued(): BooleanValue;
        /**
         * Value that reports whether this slot is queued for recording or not.
         *
         * @since API version 2
         * @return {*}
         */
        isStopQueued(): BooleanValue;
        /**
         * Value that reports the color of this slot.
         *
         * @since API version 2
         * @return {*}
         */
        color(): ColorValue;
        /**
         * Starts browsing for content that can be inserted in this slot in Bitwig Studio's popup browser.
         *
         * @since API version 2
         */
        browseToInsertClip(): any;
    }

    /**
     * Instances of this interface represent a scrollable fixed-size window that is connected to a section of the
     * clip launcher slots for a specific track.
     *
     * @since API version 1
     * @class
     */
    interface ClipLauncherSlotBank extends ClipLauncherSlotOrSceneBank<ClipLauncherSlot> {
        /**
         * Selects the slot with the given index.
         *
         * @param {number} slot
         * the index of the slot within the slot window.
         * @since API version 1
         */
        select(slot: number): any;
        /**
         * Starts recording into the slot with the given index.
         *
         * @param {number} slot
         * the index of the slot within the slot window.
         * @since API version 1
         */
        record(slot: number): any;
        /**
         * Makes the clip content of the slot with the given index visible in the note or audio editor.
         *
         * @param {number} slot
         * the index of the slot within the slot window.
         * @since API version 1
         */
        showInEditor(slot: number): any;
        /**
         * Creates an new clip in the slot with the given index.
         *
         * @param {number} slot
         * the index of the slot within the slot window.
         * @since API version 1
         * @param {number} lengthInBeats
         */
        createEmptyClip(slot: number, lengthInBeats: number): any;
        /**
         * Deletes the clip in the slot with the given index.
         *
         * @param {number} slot
         * the index of the slot within the slot window.
         * @since API version 1
         */
        deleteClip(slot: number): any;
        /**
         * Duplicates the clip in the slot with the given index.
         *
         * @param {number} slot
         * the index of the slot within the slot window.
         * @since API version 1
         */
        duplicateClip(slot: number): any;
        /**
         * Registers an observer that reports selection changes for the slots inside the window.
         *
         * @param {*} callback
         * a callback function that receives two parameters: 1. the slot index (integer), and 2. a
         * boolean parameter indicating if the slot at that index is selected (`true`) or not (`false`)
         * @since API version 1
         */
        addIsSelectedObserver(callback: IndexedBooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports which slots contain clips.
         *
         * @param {*} callback
         * a callback function that receives two parameters: 1. the slot index (integer), and 2. a
         * boolean parameter indicating if the slot at that index contains a clip (`true`) or not
         * (`false`)
         * @since API version 1
         */
        addHasContentObserver(callback: IndexedBooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports the playback state of clips / slots. The reported states include
         * `stopped`, `playing`, `recording`, but also `queued for stop`, `queued for playback`, `queued for
         * recording`.
         *
         * @param {*} callback
         * a callback function that receives three parameters: 1. the slot index (integer), 2. the queued
         * or playback state: `0` when stopped, `1` when playing, or `2` when recording, and 3. a boolean
         * parameter indicating if the second argument is referring to the queued state (`true`) or the
         * actual playback state (`false`)
         * @since API version 1
         */
        addPlaybackStateObserver(callback: ClipLauncherSlotBankPlaybackStateChangedCallback): any;
        /**
         * Registers an observer that reports which slots have clips that are currently playing.
         *
         * @param {*} callback
         * a callback function that receives two parameters: 1. the slot index (integer), and 2. a
         * boolean parameter indicating if the slot at that index has a clip that is currently playing
         * (`true`) or not (`false`)
         * @since API version 1
         */
        addIsPlayingObserver(callback: IndexedBooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports which slots have clips that are currently recording.
         *
         * @param {*} callback
         * a callback function that receives two parameters: 1. the slot index (integer), and 2. a
         * boolean parameter indicating if the slot at that index has a clip that is currently recording
         * (`true`) or not (`false`)
         * @since API version 1
         */
        addIsRecordingObserver(callback: IndexedBooleanValueChangedCallback): any;
        /**
         * Add an observer if clip playback is queued on the slot.
         *
         * @param {*} callback
         * a callback function that receives two parameters: 1. the slot index (integer), and 2. a
         * boolean parameter indicating if the slot at that index has a clip that is currently queued for
         * playback (`true`) or not (`false`)
         * @since API version 1
         */
        addIsPlaybackQueuedObserver(callback: IndexedBooleanValueChangedCallback): any;
        /**
         * Add an observer if clip recording is queued on the slot.
         *
         * @param {*} callback
         * a callback function that receives two parameters: 1. the slot index (integer), and 2. a
         * boolean parameter indicating if the slot at that index has a clip that is currently queued for
         * recording (`true`) or not (`false`)
         * @since API version 1
         */
        addIsRecordingQueuedObserver(callback: IndexedBooleanValueChangedCallback): any;
        /**
         * Add an observer if clip playback is queued to stop on the slot.
         *
         * @param {*} callback
         * a callback function that receives two parameters: 1. the slot index (integer), and 2. a
         * boolean parameter indicating if the slot at that index has a clip that is currently queued for
         * stop (`true`) or not (`false`)
         * @since API version 1
         */
        addIsStopQueuedObserver(callback: IndexedBooleanValueChangedCallback): any;
        /**
         * @deprecated Use {@link #addIsPlaybackQueuedObserver} instead.
         * @since API version 1
         * @param {*} callback
         */
        addIsQueuedObserver(callback: IndexedBooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports the colors of clip in the current slot window.
         *
         * @param {*} callback
         * a callback function that receives four parameters: 1. the slot index (integer), 2. the red
         * coordinate of the RBG color value, 3. the green coordinate of the RBG color value, and 4. the
         * blue coordinate of the RBG color value
         * @since API version 1
         */
        addColorObserver(callback: IndexedColorValueChangedCallback): any;
        /**
         * Specifies if the Bitwig Studio clip launcher should indicate which slots are part of the window. By
         * default indications are disabled.
         *
         * @param {boolean} shouldIndicate
         * `true` if visual indications should be enabled, `false` otherwise
         * @since API version 1
         */
        setIndication(shouldIndicate: boolean): any;
        /**
         * Returns an object that can be used to observe and toggle if the slots on a connected track group show
         * either scenes launch buttons (for launching the content of the track group) or the clips of the group
         * master track.
         *
         * @return {*} a boolean value object.
         */
        isMasterTrackContentShownOnTrackGroups(): SettableBooleanValue;
    }

    interface ClipLauncherSlotOrScene extends ObjectProxy {
        /**
         * Returns an object that provides access to the name of the scene.
         *
         * @return {*} a string value object that represents the scene name.
         * @since API version 2
         */
        name(): StringValue;
        /**
         * Launches the scene.
         *
         * @since API version 1
         */
        launch(): any;
        /**
         * Value that reports the position of the scene within the list of Bitwig Studio scenes.
         *
         * @since API version 2
         * @return {*}
         */
        sceneIndex(): IntegerValue;
        /**
         * Copies the current slot or scene into the dest slot or scene.
         *
         * @since API version 4
         * @param {*} source
         */
        copyFrom(source: ClipLauncherSlotOrScene): any;
        /**
         * Moves the current slot or scene into the destination slot or scene.
         *
         * @since API version 4
         * @param {*} dest
         */
        moveTo(dest: ClipLauncherSlotOrScene): any;
    }

    /**
     * An abstract interface that represents the clip launcher scenes or slots of a single track.
     *
     * @since API version 1
     * @class
     */
    interface ClipLauncherSlotOrSceneBank<ItemType extends ClipLauncherSlotOrScene>
        extends Bank<ItemType> {
        /**
         * Launches the scene/slot with the given index.
         *
         * @param {number} slot
         * the index of the slot that should be launched
         * @since API version 1
         */
        launch(slot: number): any;
        /**
         * Stops clip launcher playback for the associated track.
         *
         * @since API version 1
         */
        stop(): any;
        /**
         * Performs a return-to-arrangement operation on the related track, which caused playback to be taken over
         * by the arrangement sequencer.
         *
         * @since API version 1
         */
        returnToArrangement(): any;
        /**
         * Registers an observer that reports the names of the scenes and slots. The slot names reflect the names
         * of containing clips.
         *
         * @param {*} callback
         * a callback function receiving two parameters: 1. the slot index (integer) within the
         * configured window, and 2. the name of the scene/slot (string)
         * @since API version 1
         */
        addNameObserver(callback: IndexedStringValueChangedCallback): any;
    }

    interface ColorValue extends Value<ColorValueChangedCallback> {
        /**
         * Gets the red component of the current value.
         *
         * @since API version 2
         * @return {number}
         */
        red(): number;
        /**
         * Gets the green component of the current value.
         *
         * @since API version 2
         * @return {number}
         */
        green(): number;
        /**
         * Gets the blue component of the current value.
         *
         * @since API version 2
         * @return {number}
         */
        blue(): number;
        /**
         * Gets the alpha component of the current value.
         *
         * @since API version 5
         * @return {number}
         */
        alpha(): number;
    }

    /**
     * An interface representing the host application to the script. A singleton instance of this interface is
     * available in the global scope of each script. The methods provided by this interface can be divided in
     * different categories:
     *
     * 1. functions for registering the script in Bitwig Studio, so that it can be listed, detected and configured
     * in the controller preferences. The methods that belong to this group are {@link #defineController},
     * {@link #defineMidiPorts}, {@link #defineSysexIdentityReply} and {@link #addDeviceNameBasedDiscoveryPair}.
     * 2. functions for creating objects that provide access to the various areas of Bitwig Studio to the script.
     * The name of those methods typically start with `create...` 3. functions for printing to the Control Surface
     * Console, which can be opened from the `View` menu of Bitwig Studio. 4. functions for determining the name
     * of the host application, API version, the host operating system and such.
     *
     * The first group of methods should be called on the global scope of the script. The function in the second
     * and third group are typically called from the init method of the script or other handler functions. The
     * last group is probably only required in rare cases and can be called any time.
     *
     * @since API version 1
     * @class
     */
    interface ControllerHost extends Host {
        /**
         * Loads the supplied API version into the calling script. This is only intended to be called from a controller
         * script. It cannot be called from a Java controller extension.
         * @param {number} version
         */
        loadAPI(version: number): any;
        /**
         * Determines whether the calling script should fail if it calls a deprecated method based on the API version
         * that it requested.
         * @return {boolean}
         */
        shouldFailOnDeprecatedUse(): boolean;
        /**
         * Sets whether the calling script should fail if it calls a deprecated method based on the API version
         * that it requested. This is only intended to be called from a controller
         * script. It cannot be called from a Java controller extension.
         * @param {boolean} value
         */
        setShouldFailOnDeprecatedUse(value: boolean): any;
        /**
         * Loads the script defined by the supplied path. This is only intended to be called from a controller
         * script. It cannot be called from a Java controller extension.
         * @param {string} path
         */
        load(path: string): any;
        /**
         * Indicates if the host platform is Windows.
         *
         * @return {boolean} `true` if the host platform is Windows, `false` otherwise.
         * @since API version 1
         */
        platformIsWindows(): boolean;
        /**
         * Indicates if the host platform is Apple Mac OS X.
         *
         * @return {boolean} `true` if the host platform is Mac, `false` otherwise.
         * @since API version 1
         */
        platformIsMac(): boolean;
        /**
         * Indicates if the host platform is Linux.
         *
         * @return {boolean} `true` if the host platform is Linux, `false` otherwise.
         * @since API version 1
         */
        platformIsLinux(): boolean;
        /**
         * Registers a controller script with the given parameters. This function must be called once at the global
         * scope of the script.
         *
         * @param {string} vendor
         * the name of the hardware vendor. Must not be <code>null</code>.
         * @param {string} name
         * the name of the controller script as listed in the user interface of Bitwig Studio. Must not
         * be <code>null</code>.
         * @param {string} version
         * the version of the controller script. Must not be <code>null</code>.
         * @param {string} uuid
         * a universal unique identifier (UUID) string that is used to distinguish one script from
         * another, for example `550e8400-e29b-11d4-a716-446655440000`. Must not be <code>null</code>.
         * For generating random UUID strings several free web tools are available.
         * @param {string} author
         * the name of the script author
         * @since API version 1
         */
        defineController(vendor?: any, name?: any, version?: any, uuid?: any, author?: any): any;
        /**
         * Defines the number of MIDI ports for input and output that the device uses. This method should be called
         * once in the global scope if the script is supposed to exchange MIDI messages with the device, or if the
         * script adds entries to the MIDI input/output choosers in Bitwig Studio. After calling this method the
         * individual port objects can be accessed using {@link #getMidiInPort(int index)} and
         * {@link #getMidiInPort(int index)}.
         *
         * @param {number} numInports
         * the number of input ports
         * @param {number} numOutports
         * the number of output ports
         * @since API version 1
         */
        defineMidiPorts(numInports: number, numOutports: number): any;
        /**
         * Returns the MIDI input port with the given index.
         *
         * @param {number} index
         * the index of the MIDI input port, must be valid.
         * @return {*} the requested MIDI input port
         * @since API version 1
         */
        getMidiInPort(index: number): MidiIn;
        /**
         * Returns the MIDI output port with the given index.
         *
         * @param {number} index
         * the index of the MIDI output port, must be valid.
         * @return {*} the requested MIDI output port
         * @since API version 1
         */
        getMidiOutPort(index: number): MidiOut;
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
         * @param {Array} inputs
         * the array of strings used to detect MIDI input ports, must not be `null`.
         * @param {Array} outputs
         * the array of strings used to detect MIDI output ports, must not be `null`.
         * @since API version 1
         */
        addDeviceNameBasedDiscoveryPair(inputs: string[], outputs: string[]): any;
        /**
         * Registers the `Identity Reply Universal SysEx` message (if any) that the MIDI device sends after
         * receiving the `Identity Request Universal SysEx` message (`F0 7E 7F 06 01 F7`), as defined in the MIDI
         * standard.<br/>
         *
         * This function may be called at the global scope of the script, but is optional. Please note that this
         * function is only applicable to scripts with one MIDI input and one MIDI output. Also note that not all
         * MIDI hardware supports SysEx identity messages.
         *
         * @param {string} reply
         * the `Identity Reply Universal SysEx` message. Must not be <code>null</code>
         * @deprecated
         * @since API version 1
         */
        defineSysexIdentityReply(reply: string): any;
        /**
         * Creates a preferences object that can be used to insert settings into the Controller Preferences panel
         * in Bitwig Studio.
         *
         * @return {*} an object that provides access to custom controller preferences
         * @since API version 1
         */
        getPreferences(): Preferences;
        /**
         * Creates a document state object that can be used to insert settings into the Studio I/O Panel in Bitwig
         * Studio.
         *
         * @return {*} an object that provides access to custom document settings
         * @since API version 1
         */
        getDocumentState(): DocumentState;
        /**
         * Returns an object that is used to configure automatic notifications. Bitwig Studio supports automatic
         * visual feedback from controllers that shows up as popup notifications. For example when the selected
         * track or the current device preset was changed on the controller these notifications are shown,
         * depending on your configuration.
         *
         * @return {*} a configuration object used to enable/disable the various automatic notifications supported by
         * Bitwig Studio
         * @since API version 1
         */
        getNotificationSettings(): NotificationSettings;
        /**
         * Returns an object for controlling various aspects of the currently selected project.
         *
         * @since API version 1
         * @return {*}
         */
        getProject(): Project;
        /**
         * Returns an object for controlling and monitoring the elements of the `Transport` section in Bitwig
         * Studio. This function should be called once during initialization of the script if transport access is
         * desired.
         *
         * @return {*} an object that represents the `Transport` section in Bitwig Studio.
         * @since API version 1
         */
        createTransport(): Transport;
        /**
         * Returns an object for controlling and monitoring the `Groove` section in Bitwig Studio. This function
         * should be called once during initialization of the script if groove control is desired.
         *
         * @return {*} an object that represents the `Groove` section in Bitwig Studio.
         * @since API version 1
         */
        createGroove(): Groove;
        /**
         * Returns an object that provides access to general application functionality, including global view
         * settings, the list of open projects, and other global settings that are not related to a certain
         * document.
         *
         * @return {*} an application object.
         * @since API version 1
         */
        createApplication(): Application;
        /**
         * Returns an object which provides access to the `Arranger` panel inside the specified window.
         *
         * @param {number} window
         * the index of the window where the arranger panel is shown, or -1 in case the first arranger
         * panel found on any window should be taken
         * @return {*} an arranger object
         * @since API version 1
         */
        createArranger(window?: any): any;
        /**
         * Returns an object which provides access to the `Mixer` panel that matches the specified parameters.
         *
         * @param {string} panelLayout
         * the name of the panel layout that contains the mixer panel, or `null` in case the selected
         * panel layout in Bitwig Studio should be followed. Empty strings or invalid names are treated
         * the same way as `null`. To receive the list of available panel layouts see
         * {@link Application#addPanelLayoutObserver}.
         * @param {number} window
         * the index of the window where the mixer panel is shown, or -1 in case the first mixer panel
         * found on any window should be taken
         * @return {*} a `Mixer` object
         * @since API version 1
         */
        createMixer(panelLayout?: any, window?: any): any;
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
         * @param {number} numTracks
         * the number of child tracks spanned by the track bank
         * @param {number} numSends
         * the number of sends spanned by the track bank
         * @param {number} numScenes
         * the number of scenes spanned by the track bank
         * @param {boolean} hasFlatTrackList
         * specifies whether the track bank should operate on a flat list of all nested child tracks or
         * only on the direct child tracks of the connected group track.
         * @return {*} an object for bank-wise navigation of tracks, sends and scenes
         * @see #createMainTrackBank
         * @see #createEffectTrackBank
         * @since API version 1
         */
        createTrackBank(
            numTracks?: any,
            numSends?: any,
            numScenes?: any,
            hasFlatTrackList?: any
        ): any;
        /**
         * Returns a track bank with the given number of tracks, sends and scenes. Only audio tracks, instrument
         * tracks and hybrid tracks are considered. For more information about track banks and the `bank pattern`
         * in general, see the documentation for {@link #createTrackBank}.
         *
         * @param {number} numTracks
         * the number of tracks spanned by the track bank
         * @param {number} numSends
         * the number of sends spanned by the track bank
         * @param {number} numScenes
         * the number of scenes spanned by the track bank
         * @return {*} an object for bank-wise navigation of tracks, sends and scenes
         * @see Track#createMainTrackBank
         * @see #createTrackBank
         * @see #createEffectTrackBank
         * @since API version 1
         */
        createMainTrackBank(numTracks: number, numSends: number, numScenes: number): TrackBank;
        /**
         * Returns a track bank with the given number of effect tracks and scenes. Only effect tracks are
         * considered. For more information about track banks and the `bank pattern` in general, see the
         * documentation for {@link #createTrackBank}.
         *
         * @param {number} numTracks
         * the number of tracks spanned by the track bank
         * @param {number} numScenes
         * the number of scenes spanned by the track bank
         * @return {*} an object for bank-wise navigation of tracks, sends and scenes
         * @see Track#createEffectTrackBank
         * @see #createTrackBank
         * @see #createMainTrackBank
         * @since API version 1
         */
        createEffectTrackBank(numTracks: number, numScenes: number): TrackBank;
        /**
         * Returns an object that represents the master track of the document.
         *
         * @param {number} numScenes
         * the number of scenes for bank-wise navigation of the master tracks clip launcher slots.
         * @return {*} an object representing the master track.
         * @see Track#createMasterTrack
         * @since API version 1
         */
        createMasterTrack(numScenes: number): MasterTrack;
        /**
         * Returns an object that represents the cursor item of the arranger track selection.
         *
         * @param {number} numSends
         * the number of sends for bank-wise navigation of the sends that are associated with the track
         * selection
         * @param {number} numScenes
         * the number of scenes for bank-wise navigation of the clip launcher slots that are associated
         * with the track selection
         * @return {*} an object representing the currently selected arranger track (in the future also multiple
         * tracks)
         * @since API version 1
         */
        createArrangerCursorTrack(numSends: number, numScenes: number): CursorTrack;
        /**
         * Returns an object that represents a named cursor track, that is independent from the arranger or mixer
         * track selection in the user interface of Bitwig Studio.
         *
         * @param {string} name
         * the name of the track cursor
         * @param {number} numSends
         * the number of sends for bank-wise navigation of the sends that are associated with the track
         * selection
         * @param {number} numScenes
         * the number of scenes for bank-wise navigation of the clip launcher slots that are associated
         * with the track selection
         * @return {*} an object representing the currently selected arranger track (in the future also multiple
         * tracks).
         * @since API version 1
         * @param {string} id
         * @param {boolean} shouldFollowSelection
         */
        createCursorTrack(
            id?: any,
            name?: any,
            numSends?: any,
            numScenes?: any,
            shouldFollowSelection?: any
        ): any;
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
         * @param {number} numScenes
         * the number of scenes spanned by the track bank
         * @return {*} an object for bank-wise navigation of scenes
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
         * @param {number} numSends
         * the number of sends that are simultaneously accessible in nested channels.
         * @return {*} an object representing the currently selected device.
         * @deprecated Use cursorTrack.createCursorDevice().
         * @see Track#createCursorDevice()
         * @see Track#createCursorDevice(String)
         * @since API version 1
         */
        createEditorCursorDevice(numSends?: any): any;
        /**
         * @deprecated Use {@link #createLauncherCursorClip(int, int)} or
         * {@link #createArrangerCursorClip(int, int)} instead.
         * @since API version 1
         * @param {number} gridWidth
         * @param {number} gridHeight
         * @return {*}
         */
        createCursorClip(gridWidth: number, gridHeight: number): Clip;
        /**
         * Returns a clip object that represents the cursor of the launcher clip selection. The gridWidth and
         * gridHeight parameters specify the grid dimensions used to access the note content of the clip.
         *
         * @param {number} gridWidth
         * the number of steps spanned by one page of the note content grid.
         * @param {number} gridHeight
         * the number of keys spanned by one page of the note content grid.
         * @return {*} an object representing the currently selected cursor clip
         * @since API version 1
         */
        createLauncherCursorClip(gridWidth: number, gridHeight: number): Clip;
        /**
         * Returns a clip object that represents the cursor of the arranger clip selection. The gridWidth and
         * gridHeight parameters specify the grid dimensions used to access the note content of the clip.
         *
         * @param {number} gridWidth
         * the number of steps spanned by one page of the note content grid.
         * @param {number} gridHeight
         * the number of keys spanned by one page of the note content grid.
         * @return {*} an object representing the currently selected cursor clip
         * @since API version 1
         */
        createArrangerCursorClip(gridWidth: number, gridHeight: number): Clip;
        /**
         * Returns an object that is used to define a bank of custom user controls. These controls are available to
         * the user for free controller assignments and are typically used when bank-wise navigation is
         * inconvenient.
         *
         * @param {number} numControllers
         * the number of controls that are available for free assignments
         * @return {*} An object that represents a set of custom user controls.
         * @since API version 1
         */
        createUserControls(numControllers: number): UserControlBank;
        /**
         * Schedules the given callback function for execution after the given delay. For timer applications call
         * this method once initially and then from within the callback function.
         *
         * @param {*} callback
         * the callback function that will be called
         * @param {Array} args
         * that array of arguments that gets passed into the callback function, may be `null`
         * @param {number} delay
         * the duration after which the callback function will be called in milliseconds
         * @deprecated
         * @since API version 1
         */
        scheduleTask(callback?: any, args?: any, delay?: any): any;
        /**
         * Requests that the driver's flush method gets called.
         *
         * @since API version 2
         */
        requestFlush(): any;
        /**
         * Prints the given string in the control surface console window. The console window can be opened in the
         * view menu of Bitwig Studio.
         *
         * @param {string} s
         * the string to be printed
         * @since API version 1
         */
        println(s: string): any;
        /**
         * Prints the given string in the control surface console window using a text style that highlights the
         * string as error. The console window can be opened in the view menu of Bitwig Studio.
         *
         * @param {string} s
         * the error string to be printed
         * @since API version 1
         */
        errorln(s: string): any;
        /**
         * Shows a temporary text overlay on top of the application GUI, that will fade-out after a short interval.
         * If the overlay is already shown, it will get updated with the given text.
         *
         * @param {string} text
         * the text to be shown
         * @since API version 1
         */
        showPopupNotification(text: string): any;
        /**
         * Opens a TCP (Transmission Control Protocol) host socket for allowing network connections from other
         * hardware and software.
         *
         * @param {string} name
         * a meaningful name that describes the purpose of this connection.
         * @param {number} defaultPort
         * the port that should be used for the connection. If the port is already in use, then another
         * port will be used. Check {@link RemoteSocket#getPort()} on the returned object to be sure.
         * @return {*} the object that represents the socket
         * @since API version 1
         */
        createRemoteConnection(name: string, defaultPort: number): RemoteSocket;
        /**
         * Connects to a remote TCP (Transmission Control Protocol) socket.
         *
         * @param {string} host
         * the host name or IP address to connect to.
         * @param {number} port
         * the port to connect to
         * @param {*} callback
         * the callback function that gets called when the connection gets established. A single
         * {@link RemoteConnection} parameter is passed into the callback function.
         * @since API version 1
         */
        connectToRemoteHost(
            host: string,
            port: number,
            callback: ConnectionEstablishedCallback
        ): any;
        /**
         * Sends a UDP (User Datagram Protocol) packet with the given data to the specified host.
         *
         * @param {string} host
         * the destination host name or IP address
         * @param {number} port
         * the destination port
         * @param {Array} data
         * the data to be send. When creating a numeric byte array in JavaScript, the byte values must be
         * signed (in the range -128..127).
         * @since API version 1
         */
        sendDatagramPacket(host: string, port: number, data: number[]): any;
        /**
         * Adds an observer for incoming UDP (User Datagram Protocol) packets on the selected port.
         *
         * @param {string} name
         * a meaningful name that describes the purpose of this observer.
         * @param {number} port
         * the port that should be used
         * @param {*} callback
         * the callback function that gets called when data arrives. The function receives a single
         * parameter that contains the data byte array.
         *
         * @return {boolean} {@true} if was possible to bind the port, false otherwise
         * @since API version 1
         */
        addDatagramPacketObserver(
            name: string,
            port: number,
            callback: DataReceivedCallback
        ): boolean;
        /**
         * @deprecated Use {@link #createTransport} instead.
         * @since API version 1
         * @return {*}
         */
        createTransportSection(): Transport;
        /**
         * @deprecated Use {@link #createGroove()} instead.
         * @since API version 1
         * @return {*}
         */
        createGrooveSection(): Groove;
        /**
         * @deprecated Use {@link #createApplication()} instead.
         * @since API version 1
         * @return {*}
         */
        createApplicationSection(): Application;
        /**
         * @deprecated Use {@link #createArranger(int)} instead.
         * @since API version 1
         * @param {number} screenIndex
         * @return {*}
         */
        createArrangerSection(screenIndex: number): Arranger;
        /**
         * @deprecated Use {@link #createMixer(String, int)} instead.
         * @since API version 1
         * @param {string} perspective
         * @param {number} screenIndex
         * @return {*}
         */
        createMixerSection(perspective: string, screenIndex: number): Mixer;
        /**
         * @deprecated Use {@link #createTrackBank(int, int, int)} instead.
         * @since API version 1
         * @param {number} numTracks
         * @param {number} numSends
         * @param {number} numScenes
         * @return {*}
         */
        createTrackBankSection(numTracks: number, numSends: number, numScenes: number): TrackBank;
        /**
         * @deprecated Use {@link #createMainTrackBank(int, int, int)} instead.
         * @since API version 1
         * @param {number} numTracks
         * @param {number} numSends
         * @param {number} numScenes
         * @return {*}
         */
        createMainTrackBankSection(
            numTracks: number,
            numSends: number,
            numScenes: number
        ): TrackBank;
        /**
         * @deprecated Use {@link #createEffectTrackBank(int, int)} instead.
         * @since API version 1
         * @param {number} numTracks
         * @param {number} numScenes
         * @return {*}
         */
        createEffectTrackBankSection(numTracks: number, numScenes: number): TrackBank;
        /**
         * @deprecated Use {@link #createArrangerCursorTrack} instead.
         * @since API version 1
         * @param {number} numSends
         * @param {number} numScenes
         * @return {*}
         */
        createCursorTrackSection(numSends: number, numScenes: number): CursorTrack;
        /**
         * @deprecated Use {@link #createMasterTrack(int)} instead.
         * @since API version 1
         * @param {number} numScenes
         * @return {*}
         */
        createMasterTrackSection(numScenes: number): Track;
        /**
         * @deprecated Use {@link #createCursorClip(int, int)} instead.
         * @since API version 1
         * @param {number} gridWidth
         * @param {number} gridHeight
         * @return {*}
         */
        createCursorClipSection(gridWidth: number, gridHeight: number): Clip;
        /**
         * @deprecated Use {@link #createEditorCursorDevice} instead.
         * @since API version 1
         * @param {number} numControllers
         * @return {*}
         */
        createCursorDeviceSection(numControllers: number): CursorDevice;
        /**
         * @deprecated Use {@link #createEditorCursorDevice} instead.
         * @since API version 1
         * @return {*}
         */
        createCursorDevice(): CursorDevice;
        /**
         * @deprecated Use {@link #createUserControls(int)} instead.
         * @since API version 1
         * @param {number} numControllers
         * @return {*}
         */
        createUserControlsSection(numControllers: number): UserControlBank;
        /**
         * @deprecated Use {@link #defineSysexIdentityReply(String)} instead.
         * @since API version 1
         * @param {string} request
         * @param {string} reply
         */
        defineSysexDiscovery(request: string, reply: string): any;
        /**
         * Creates a {@link PopupBrowser} that represents the pop-up browser in Bitwig Studio.
         *
         * @since API version 2
         * @return {*}
         */
        createPopupBrowser(): PopupBrowser;
        /**
         * {@link BeatTimeFormatter} used to format beat times by default. This will be used to format beat times
         * when asking for a beat time in string format without providing any formatting options. For example by
         * calling {@link BeatTimeStringValue#get()}.
         *
         * @since API version 2
         * @return {*}
         */
        defaultBeatTimeFormatter(): BeatTimeFormatter;
        /**
         * Sets the {@link BeatTimeFormatter} to use by default for formatting beat times.
         *
         * @see #defaultBeatTimeFormatter()
         * @since API version 2
         * @param {*} formatter
         */
        setDefaultBeatTimeFormatter(formatter: BeatTimeFormatter): any;
        /**
         * Creates a {@link BeatTimeFormatter} that can be used to format beat times.
         *
         * @param {string} separator
         * the character used to separate the segments of the formatted beat time, typically ":", "." or
         * "-"
         * @param {number} barsLen
         * the number of digits reserved for bars
         * @param {number} beatsLen
         * the number of digits reserved for beats
         * @param {number} subdivisionLen
         * the number of digits reserved for beat subdivisions
         * @param {number} ticksLen
         * the number of digits reserved for ticks
         *
         * @since API version 2
         * @return {*}
         */
        createBeatTimeFormatter(
            separator: string,
            barsLen: number,
            beatsLen: number,
            subdivisionLen: number,
            ticksLen: number
        ): BeatTimeFormatter;
    }

    /**
     * This interface defines access to the common attributes and operations of cue markers.
     *
     * @since API version 2
     * @class
     */
    interface CueMarker extends ObjectProxy {
        /**
         * Launches playback at the marker position.
         *
         * @param {boolean} quantized Specified if the cue marker should be launched quantized or immediately
         * @since API version 2
         */
        launch(quantized: boolean): any;
        /**
         * Gets a representation of the marker name.
         *
         * @since API version 2
         * @return {*}
         */
        getName(): StringValue;
        /**
         * Gets a representation of the marker color.
         *
         * @since API version 2
         * @return {*}
         */
        getColor(): ColorValue;
    }

    /**
     * A cue marker bank provides access to a range of cue markers in Bitwig Studio.
     * Instances are typically configured with a fixed number of markers and represent an excerpt
     * of a larger list of markers. It basically acts like a window moving over the list of markers.
     *
     * @since API version 2
     * @class
     */
    interface CueMarkerBank extends Bank<CueMarker> {
        /**
         * Scrolls the cue marker bank window so that the marker at the given position becomes visible.
         *
         * @param {number} position
         * the index of the marker within the underlying full list of markers (not the index within the
         * bank). The position is typically directly related to the layout of the marker list in Bitwig
         * Studio, starting with zero in case of the first marker.
         * @since API version 2
         */
        scrollToMarker(position: number): any;
    }

    /**
     * A generic interface that provides the foundation for working with selections.
     *
     * Implementations of this interface can either represent custom selection cursors that are created by
     * controller scripts, or represent the cursor of user selections as shown in Bitwig Studio editors, such as
     * the Arranger track selection cursor, the note editor event selection cursor and so on.
     *
     * @since API version 1
     * @class
     */
    interface Cursor {
        /**
         * Select the previous item.
         *
         * @since API version 1
         */
        selectPrevious(): any;
        /**
         * Select the next item.
         *
         * @since API version 1
         */
        selectNext(): any;
        /**
         * Select the first item.
         *
         * @since API version 1
         */
        selectFirst(): any;
        /**
         * Select the last item.
         *
         * @since API version 1
         */
        selectLast(): any;
        /**
         * Boolean value that reports whether there is an item after the current cursor position.
         *
         * @since API version 2
         * @return {*}
         */
        hasNext(): BooleanValue;
        /**
         * Boolean value that reports whether there is an item before the current cursor position.
         *
         * @since API version 2
         * @return {*}
         */
        hasPrevious(): BooleanValue;
        /**
         * Registers a function with bool argument that gets called when the previous item gains or remains
         * selectable.
         *
         * @since API version 1
         * @deprecated Use hasNext() instead.
         * @param {*} callback
         */
        addCanSelectPreviousObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers a function with bool argument that gets called when the next item gains or remains
         * selectable.
         *
         * @since API version 1
         * @param {*} callback
         */
        addCanSelectNextObserver(callback: BooleanValueChangedCallback): any;
    }

    /**
     * Instances of this interface are used to navigate the filter columns of a Bitwig Studio browsing session.
     *
     * @since API version 1
     * @class
     */
    interface CursorBrowserFilterColumn extends BrowserFilterColumn, Cursor {}

    /**
     * Instances of this interface represent entries in a browser filter column.
     *
     * @since API version 1
     * @class
     */
    interface CursorBrowserFilterItem extends BrowserFilterItem, CursorBrowserItem {
        /**
         * Select the parent item.
         *
         * @since API version 1
         */
        selectParent(): any;
        /**
         * Select the first child item.
         *
         * @since API version 1
         */
        selectFirstChild(): any;
        /**
         * Select the last child item.
         *
         * @since API version 1
         */
        selectLastChild(): any;
        /**
         * Select the previous item.
         *
         * @since API version 1
         */
        moveToPrevious(): any;
        /**
         * Select the next item.
         *
         * @since API version 1
         */
        moveToNext(): any;
        /**
         * Select the first item.
         *
         * @since API version 1
         */
        moveToFirst(): any;
        /**
         * Select the last item.
         *
         * @since API version 1
         */
        moveToLast(): any;
        /**
         * Select the parent item.
         *
         * @since API version 1
         */
        moveToParent(): any;
        /**
         * Move the cursor to the first child item.
         *
         * @since API version 1
         */
        moveToFirstChild(): any;
        /**
         * Move the cursor to the last child item.
         *
         * @since API version 1
         */
        moveToLastChild(): any;
    }

    /**
     * Instances of this interface represent entries in a browser filter column.
     *
     * @since API version 1
     * @class
     */
    interface CursorBrowserItem extends BrowserItem, Cursor {
        /**
         * Returns a bank object that provides access to the siblings of the cursor item. The bank will
         * automatically scroll so that the cursor item is always visible.
         *
         * @param {number} numSiblings
         * the number of simultaneously accessible siblings
         * @return {*} the requested item bank object
         */
        createSiblingsBank(numSiblings: number): BrowserItemBank<any>;
    }

    /**
     * Instances of this interface represent entries in a browser column.
     *
     * @since API version 1
     * @class
     */
    interface CursorBrowserResultItem extends BrowserResultsItem, CursorBrowserItem {}

    /**
     * Instances of this interface are used for navigating the various browsing sessions of Bitwig Studio's
     * contextual browser.
     *
     * @since API version 1
     * @class
     */
    interface CursorBrowsingSession extends GenericBrowsingSession, Cursor {}

    /**
     * A special kind of channel that follows a channel selection cursor in Bitwig Studio. The selection can
     * either be a custom selection cursor that gets created by the controller script, or represent the user
     * selection cursor as shown in the Bitwig Studio editors, such as the Arranger track selection cursor.
     *
     * @since API version 1
     * @class
     */
    interface CursorChannel extends Cursor, Channel {
        /**
         * Points the cursor to the given channel.
         *
         * @param {*} channel
         * the channel that this channel cursor should point to
         * @since API version 1
         */
        selectChannel(channel: Channel): any;
    }

    /**
     * A special kind of selection cursor used for devices.
     *
     * @since API version 1
     * @class
     */
    interface CursorDevice extends Cursor, Device {
        /**
         * Returns the channel that this cursor device was created on. Currently this will always be a track or
         * cursor track instance.
         *
         * @return {*} the track or cursor track object that was used for creation of this cursor device.
         * @since API version 1
         * @deprecated Use {@link #channel()} instead.
         */
        getChannel(): Channel;
        /**
         * Returns the channel that this cursor device was created on. Currently this will always be a track or
         * cursor track instance.
         *
         * @return {*} the track or cursor track object that was used for creation of this cursor device.
         * @since API version 5
         */
        channel(): Channel;
        /**
         * Selects the parent device if there is any.
         *
         * @since API version 1
         */
        selectParent(): any;
        /**
         * Moves this cursor to the given device.
         *
         * @param {*} device
         * the device that this cursor should point to
         * @since API version 1
         */
        selectDevice(device: Device): any;
        /**
         * Selects the first device in the given channel.
         *
         * @param {*} channel
         * the channel in which the device should be selected
         * @since API version 1
         */
        selectFirstInChannel(channel: Channel): any;
        /**
         * Selects the last device in the given channel.
         *
         * @param {*} channel
         * the channel in which the device should be selected
         * @since API version 1
         */
        selectLastInChannel(channel: Channel): any;
        /**
         * Selects the first device in the nested FX slot with the given name.
         *
         * @param {string} chain
         * the name of the FX slot in which the device should be selected
         * @since API version 1
         */
        selectFirstInSlot(chain: string): any;
        /**
         * Selects the last device in the nested FX slot with the given name.
         *
         * @param {string} chain
         * the name of the FX slot in which the device should be selected
         * @since API version 1
         */
        selectLastInSlot(chain: string): any;
        /**
         * Selects the first device in the drum pad associated with the given key.
         *
         * @param {number} key
         * the key associated with the drum pad in which the device should be selected
         * @since API version 1
         */
        selectFirstInKeyPad(key: number): any;
        /**
         * Selects the last device in the drum pad associated with the given key.
         *
         * @param {number} key
         * the key associated with the drum pad in which the device should be selected
         * @since API version 1
         */
        selectLastInKeyPad(key: number): any;
        /**
         * Selects the first device in the nested layer with the given name.
         *
         * @param {string} name
         * the name of the nested layer in which the device should be selected
         * @since API version 1
         */
        selectFirstInLayer(name?: any): any;
        /**
         * Selects the last device in the nested layer with the given name.
         *
         * @param {string} name
         * the name of the nested layer in which the device should be selected
         * @since API version 1
         */
        selectLastInLayer(name?: any): any;
    }

    /**
     * Mode that defines how a {@link CursorDevice} follows a device within the {@link CursorTrack} it is created
     * for by default. The user can still override this on a track by track basis but this defines a default
     * follow mode when the user has not done this.
     * @enum
     * @property {CursorDeviceFollowMode} FOLLOW_SELECTION
     * Follows the device selection made by the user in the track.
     * @property {CursorDeviceFollowMode} FIRST_DEVICE
     * Selects the first device in the track if there is one.
     * @property {CursorDeviceFollowMode} FIRST_INSTRUMENT
     * Selects the first instrument in the track if there is one.
     * @property {CursorDeviceFollowMode} FIRST_AUDIO_EFFECT
     * Selects the first audio effect in the track if there is one.
     * @property {CursorDeviceFollowMode} FIRST_INSTRUMENT_OR_DEVICE
     * Selects the first instrument or if there is no instrument the first device.
     *
     * @since API version 3
     * @class
     */
    enum CursorDeviceFollowMode {
        /**
         * Follows the device selection made by the user in the track.
         */
        FOLLOW_SELECTION = 0,
        /**
         * Selects the first device in the track if there is one.
         */
        FIRST_DEVICE = 1,
        /**
         * Selects the first instrument in the track if there is one.
         */
        FIRST_INSTRUMENT = 2,
        /**
         * Selects the first audio effect in the track if there is one.
         */
        FIRST_AUDIO_EFFECT = 3,
        /**
         * Selects the first instrument or if there is no instrument the first device.
         *
         * @since API version 3
         */
        FIRST_INSTRUMENT_OR_DEVICE = 4,
    }

    /**
     * Instances of this interface represent the cursor item in device layer selections.
     *
     * @since API version 1
     * @class
     */
    interface CursorDeviceLayer extends CursorChannel, DeviceLayer {}

    /**
     * Instances of this interface represent the selected device slot as shown in the Bitwig Studio user
     * interface.
     *
     * @since API version 1
     * @class
     */
    interface CursorDeviceSlot extends DeviceChain {
        selectSlot(slot: string): any;
    }

    /**
     * Instances of this interface represent the cursor item of track selections.
     *
     * @since API version 1
     * @enum
     * @property {CursorNavigationMode} NESTED
     * @property {CursorNavigationMode} FLAT
     * @property {CursorNavigationMode} GUI
     * @class
     */
    enum CursorNavigationMode {
        NESTED = 0,
        FLAT = 1,
        GUI = 2,
    }

    /**
     * Represents a cursor that looks at a {@link RemoteControlsPage}.
     *
     * @since API version 2
     * @class
     */
    interface CursorRemoteControlsPage extends Cursor, RemoteControlsPage {
        /**
         * Value that reports the names of the devices parameter pages.
         * @return {*}
         */
        pageNames(): StringArrayValue;
        /**
         * Selects the next page.
         *
         * @param {boolean} shouldCycle
         * If true then when the end is reached and there is no next page it selects the first page
         *
         * @since API version 2
         */
        selectNextPage(shouldCycle: boolean): any;
        /**
         * Selects the previous page.
         *
         * @param {boolean} shouldCycle
         * If true then when the end is reached and there is no next page it selects the first page
         *
         * @since API version 2
         */
        selectPreviousPage(shouldCycle: boolean): any;
        /**
         * Selects the next page that matches the given expression.
         *
         * @param {string} expression
         * An expression that can match a page based on how it has been tagged. For now this can only be
         * the name of a single tag that you would like to match.
         *
         * @param {boolean} shouldCycle
         * If true then when the end is reached and there is no next page it selects the first page
         *
         * @since API version 2
         */
        selectNextPageMatching(expression: string, shouldCycle: boolean): any;
        /**
         * Selects the previous page that matches the given expression.
         *
         * @param {string} expression
         * An expression that can match a page based on how it has been tagged. For now this can only be
         * the name of a single tag that you would like to match.
         *
         * @param {boolean} shouldCycle
         * If true then when the end is reached and there is no next page it selects the first page
         *
         * @since API version 2
         */
        selectPreviousPageMatching(expression: string, shouldCycle: boolean): any;
        /**
         * Value that reports the currently selected parameter page index.
         *
         * @since API version 2
         * @return {*}
         */
        selectedPageIndex(): SettableIntegerValue;
    }

    /**
     * Instances of this interface represent the cursor item of track selections.
     *
     * @since API version 1
     * @class
     */
    interface CursorTrack extends CursorChannel, Track, PinnableCursor {
        /**
         * Makes the cursor track point to it's parent group track, in case it is not already pointing to the root
         * group track.
         *
         * @since API version 1
         */
        selectParent(): any;
        /**
         * Makes the cursor track point to the first child found with the track group that this cursor currently
         * points to. If this cursor is not pointing to a track group or the track group is empty then this has no
         * effect.
         *
         * @since API version 2
         */
        selectFirstChild(): any;
        /**
         * Specifies the behaviour of the functions {@link #selectPrevious()}, {@link #selectNext()},
         * {@link #selectFirst()} and {@link #selectLast()}. Calling those functions can either navigate the cursor
         * within the current nesting level, or over a flat list of either all tracks or only the expanded tracks.
         * Default is CursorNavigationMode.FLAT.
         *
         * @since API version 1
         * @param {CursorNavigationMode} mode
         */
        setCursorNavigationMode(mode: CursorNavigationMode): any;
        /**
         * Creates a {@link CursorDevice} for this cursor track that by default follows a device based on the
         * supplied follow mode.
         *
         * @param {string} id
         * An id that is used to identify this cursor.
         * @param {string} name
         * A name that is displayed to the user for this cursor.
         * @param {number} numSends
         * the number of sends that are simultaneously accessible in nested channels.
         * @param {CursorDeviceFollowMode} followMode
         * Mode that defines how this cursor should follow devices.
         *
         * @since API version 2
         * @return {*}
         */
        createCursorDevice(id?: any, name?: any, numSends?: any, followMode?: any): any;
    }

    /**
     * This interface represents a device in Bitwig Studio, both internal devices and plugins.
     *
     * @since API version 1
     * @class
     */
    interface Device extends ObjectProxy {
        /**
         * Returns a representation of the device chain that contains this device. Possible device chain instances
         * are tracks, device layers, drums pads, or FX slots.
         *
         * @return {*} the requested device chain object
         * @since API version 1
         * @deprecated Use {@link #deviceChain()} instead.
         */
        getDeviceChain(): DeviceChain;
        /**
         * Returns a representation of the device chain that contains this device. Possible device chain instances
         * are tracks, device layers, drums pads, or FX slots.
         *
         * @return {*} the requested device chain object
         * @since API version 5
         */
        deviceChain(): DeviceChain;
        /**
         * Value that reports the position of the device within the parent device chain.
         *
         * @since API version 2
         * @return {*}
         */
        position(): IntegerValue;
        /**
         * Registers an observer that reports the position of the device within the parent device chain.
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #position()} instead.
         */
        addPositionObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Returns an object that provides access to the open state of plugin windows.
         *
         * @return {*} a boolean value object that represents the open state of the editor window, in case the device
         * features a custom editor window (such as plugins).
         * @since API version 1
         */
        isWindowOpen(): SettableBooleanValue;
        /**
         * Returns an object that provides access to the expanded state of the device.
         *
         * @return {*} a boolean value object that represents the expanded state of the device.
         * @since API version 1
         */
        isExpanded(): SettableBooleanValue;
        /**
         * Returns an object that provides access to the visibility of the device macros section.
         *
         * @return {*} a boolean value object that represents the macro section visibility.
         *
         * @deprecated Use {@link #isRemoteControlsSectionVisible()} instead
         * @since API version 1
         */
        isMacroSectionVisible(): SettableBooleanValue;
        /**
         * Returns an object that provides access to the visibility of the device remote controls section.
         *
         * @return {*} a boolean value object that represents the remote controls section visibility.
         *
         * @since API version 2
         */
        isRemoteControlsSectionVisible(): SettableBooleanValue;
        /**
         * Returns an object that provides access to the visibility of the parameter page mapping editor.
         *
         * @return {*} a boolean value object that represents visibility of the parameter page mapping editor.
         *
         * @deprecated Use {@link #isRemoteControlsSectionVisible()} instead
         * @since API version 1
         */
        isParameterPageSectionVisible(): SettableBooleanValue;
        /**
         * Returns the parameter with the given index in the current parameter page.
         *
         * @param {number} indexInPage
         * the index of the parameter within the current parameter page.
         * @return {*} an object that provides access to the requested parameter
         * @ @deprecated Use getRemoteControls().getRemoteControlInSlot(indexInPage)
         * @since API version 1
         */
        getParameter(indexInPage: number): Parameter;
        /**
         * Creates a cursor for a remote controls page in the device with the supplied number of parameters. This
         * section will be independent from the current page selected by the user in Bitwig Studio's user
         * interface. The supplied filter is an expression that can be used to match pages this section is
         * interested in. The expression is matched by looking at the tags added to the pages. If the expression is
         * empty then no filtering will occur.
         *
         * @param {string} name
         * A name to associate with this section. This will be used to remember manual mappings made by
         * the user within this section.
         *
         *
         * @param {number} parameterCount
         * The number of parameters the remote controls should contain
         *
         * @param {string} filterExpression
         * An expression used to match pages that the user can navigate through. For now this can only be
         * the name of a single tag the pages should contain (e.g "drawbars", "dyn", "env", "eq",
         * "filter", "fx", "lfo", "mixer", "osc", "overview", "perf").
         *
         * @since API version 2
         * @return {*}
         */
        createCursorRemoteControlsPage(
            name?: any,
            parameterCount?: any,
            filterExpression?: any
        ): any;
        /**
         * Returns the parameter with the given index in the envelope parameter page.
         *
         * @param {number} index
         * the index of the parameter within the envelope parameter page.
         * @return {*} an object that provides access to the requested parameter
         * @ @since API version 1
         * @deprecated The remote controls deprecate this feature. Instead create remote controls with
         * {@link #createIndependentRemoteControls(String, int, String)}.
         */
        getEnvelopeParameter(index: number): Parameter;
        /**
         * Returns the parameter with the given index in the common parameter page.
         *
         * @param {number} index
         * the index of the parameter within the common parameter page.
         * @return {*} an object that provides access to the requested parameter
         * @ @since API version 1
         * @deprecated The remote controls deprecate this feature. Instead create remote controls with
         * {@link #createIndependentRemoteControls(String, int, String)}.
         */
        getCommonParameter(index: number): Parameter;
        /**
         * Returns the modulation source at the given index.
         *
         * @param {number} index
         * the index of the modulation source
         * @return {*} An object that represents the requested modulation source
         * @ @since API version 1
         * @deprecated The remote controls deprecate this feature. Instead create remote controls with
         * {@link #createIndependentRemoteControls(String, int, String)}.
         */
        getModulationSource(index: number): ModulationSource;
        /**
         * Returns the macro control at the given index.
         *
         * @param {number} index
         * the index of the macro control, must be in the range [0..7]
         * @return {*} An object that represents the requested macro control
         * @ @since API version 1
         * @deprecated Devices no longer have a built in fixed macro section. Instead the user can define pages of
         * mappings and these should be used instead.
         */
        getMacro(index: number): Macro;
        /**
         * Registers an observer that reports if the device is selected.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @since API version 1
         * @deprecated Use {@link #exists()} instead.
         */
        addHasSelectedDeviceObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Selects the device in Bitwig Studio.
         *
         * @since API version 1
         */
        selectInEditor(): any;
        /**
         * Value that reports if the device is a plugin.
         *
         * @since API version 2
         * @return {*}
         */
        isPlugin(): BooleanValue;
        /**
         * Registers an observer that reports if the device is a plugin.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @since API version 1
         * @deprecated Use {@link #isPlugin()} instead
         */
        addIsPluginObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Switches to the previous parameter page.
         *
         * @since API version 1
         */
        previousParameterPage(): any;
        /**
         * Switches to the next parameter page.
         *
         * @since API version 1
         */
        nextParameterPage(): any;
        /**
         * Registers an observer that reports if there is a previous parameter page.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         */
        addPreviousParameterPageEnabledObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if there is a next parameter page.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         */
        addNextParameterPageEnabledObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Switches to the parameter page at the given page index.
         *
         * @param {number} page
         * the index of the desired parameter page
         * @since API version 1
         */
        setParameterPage(page: number): any;
        /**
         * Loads the previous preset.
         *
         * @since API version 1
         * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
         */
        switchToPreviousPreset(): any;
        /**
         * Loads the next preset.
         *
         * @since API version 1
         * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
         */
        switchToNextPreset(): any;
        /**
         * Switches to the previous preset category.
         *
         * @since API version 1
         * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
         */
        switchToPreviousPresetCategory(): any;
        /**
         * Switches to the next preset category.
         *
         * @since API version 1
         * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
         */
        switchToNextPresetCategory(): any;
        /**
         * Switches to the previous preset creator.
         *
         * @since API version 1
         * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
         */
        switchToPreviousPresetCreator(): any;
        /**
         * Switches to the next preset creator.
         *
         * @since API version 1
         * @deprecated Use new browser API provided via {@link #createDeviceBrowser(int, int)} instead.
         */
        switchToNextPresetCreator(): any;
        /**
         * Returns an object used for browsing devices, presets and other content. Committing the browsing session
         * will load or create a device from the selected resource and replace the current device.
         *
         * @param {number} numFilterColumnEntries
         * the size of the window used to navigate the filter column entries.
         * @param {number} numResultsColumnEntries
         * the size of the window used to navigate the results column entries.
         * @return {*} the requested device browser object.
         * @since API version 1
         */
        createDeviceBrowser(
            numFilterColumnEntries: number,
            numResultsColumnEntries: number
        ): Browser;
        /**
         * Value that reports the name of the device.
         *
         * @since API version 2
         * @return {*}
         */
        name(): StringValue;
        /**
         * Registers an observer that reports the name of the device.
         *
         * @param {number} len
         * the maximum length of the name. Longer names will get truncated.
         * @param {string} textWhenUnassigned
         * the default name that gets reported when the device is not associated with a Bitwig Studio
         * device yet.
         * @param {*} callback
         * a callback function that receives a single name (string) parameter
         * @since API version 1
         * @deprecated Use {@link #name()} instead
         */
        addNameObserver(
            len: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Value that reports the last loaded preset name.
         *
         * @since API version 2
         * @return {*}
         */
        presetName(): StringValue;
        /**
         * Registers an observer that reports the last loaded preset name.
         *
         * @param {number} len
         * the maximum length of the name. Longer names will get truncated.
         * @param {string} textWhenUnassigned
         * the default name that gets reported when the device is not associated with a Bitwig Studio
         * device yet.
         * @param {*} callback
         * a callback function that receives a single name (string) parameter
         * @since API version 1
         * @deprecated Use {@link #presetName()}.addValueObserver(callback) instead.
         */
        addPresetNameObserver(
            len: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Value that reports the current preset category name.
         *
         * @since API version 2
         * @return {*}
         */
        presetCategory(): StringValue;
        /**
         * Registers an observer that reports the current preset category name.
         *
         * @param {number} len
         * the maximum length of the name. Longer names will get truncated.
         * @param {string} textWhenUnassigned
         * the default name that gets reported when the device is not associated with a Bitwig Studio
         * device yet.
         * @param {*} callback
         * a callback function that receives a single name (string) parameter
         * @since API version 1
         * @deprecated use {@link #presetCategory()} instead.
         */
        addPresetCategoryObserver(
            len: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Value that reports the current preset creator name.
         *
         * @since API version 2
         * @return {*}
         */
        presetCreator(): StringValue;
        /**
         * Registers an observer that reports the current preset creator name.
         *
         * @param {number} len
         * the maximum length of the name. Longer names will get truncated.
         * @param {string} textWhenUnassigned
         * the default name that gets reported when the device is not associated with a Bitwig Studio
         * device yet.
         * @param {*} callback
         * a callback function that receives a single name (string) parameter
         * @since API version 1
         * @deprecated Use {@link #presetCreator()} instead.
         */
        addPresetCreatorObserver(
            len: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Registers an observer that reports the currently selected parameter page.
         *
         * @param {number} valueWhenUnassigned
         * the default page index that gets reported when the device is not associated with a device
         * instance in Bitwig Studio yet.
         * @param {*} callback
         * a callback function that receives a single page index parameter (integer)
         * @since API version 1
         * @deprecated Use {@link #createCursorRemoteControlsPage(int)} instead.
         */
        addSelectedPageObserver(
            valueWhenUnassigned: number,
            callback: IntegerValueChangedCallback
        ): any;
        /**
         * Registers an observer that reports the name of the active modulation source.
         *
         * @param {number} len
         * the maximum length of the name. Longer names will get truncated.
         * @param {string} textWhenUnassigned
         * the default name that gets reported when the device is not associated with a Bitwig Studio
         * device yet.
         * @param {*} callback
         * a callback function that receives a single name parameter (string)
         * @since API version 1
         * @deprecated Use {@link #createCursorRemoteControlsPage(int)} instead.
         */
        addActiveModulationSourceObserver(
            len: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Registers an observer that reports the names of the devices parameter pages.
         *
         * @param {*} callback
         * a callback function that receives a single string array parameter containing the names of the
         * parameter pages
         * @since API version 1
         * @deprecated Use {@link #createCursorRemoteControlsPage(int)} instead.
         */
        addPageNamesObserver(callback: StringArrayValueChangedCallback): any;
        /**
         * Registers an observer that reports the names of the available presets for the device according to the
         * current configuration of preset category and creator filtering.
         *
         * @param {*} callback
         * a callback function that receives a single string array parameter containing the names of the
         * presets for the current category and creator filter.
         * @see #addPresetCategoryObserver
         * @see #addPresetCreatorObserver
         * @see #setPresetCategory
         * @see #setPresetCreator
         * @since API version 1
         * @deprecated Use the new browser API instead.
         */
        addPresetNamesObserver(callback: StringArrayValueChangedCallback): any;
        /**
         * Loads the preset with the index from the list provided by {@link #addPresetNamesObserver}.
         *
         * @since API version 1
         * @deprecated Use the new browser API instead.
         * @param {number} index
         */
        loadPreset(index: number): any;
        /**
         * Registers an observer that reports the names of the available preset categories for the device.
         *
         * @param {*} callback
         * a callback function that receives a single string array parameter containing the names of the
         * preset categories
         * @since API version 1
         * @deprecated Use the new browser API instead.
         */
        addPresetCategoriesObserver(callback: StringArrayValueChangedCallback): any;
        /**
         * Sets the preset category filter with the index from the array provided by
         * {@link #addPresetCategoriesObserver}.
         *
         * @since API version 1
         * @deprecated Use the new browser API instead.
         * @param {number} index
         */
        setPresetCategory(index: number): any;
        /**
         * Registers an observer that reports the names of the available preset creators for the device.
         *
         * @param {*} callback
         * a callback function that receives a single string array parameter containing the names of the
         * preset creators
         * @since API version 1
         * @deprecated Use the new browser API instead.
         */
        addPresetCreatorsObserver(callback: StringArrayValueChangedCallback): any;
        /**
         * Sets the preset creator filter with the index from the list provided by
         * {@link #addPresetCreatorsObserver}.
         *
         * @since API version 1
         * @deprecated Use the new browser API instead.
         * @param {number} index
         */
        setPresetCreator(index: number): any;
        /**
         * Toggles the enabled state of the device.
         *
         * @since API version 1
         * @deprecated Use isEnabled().toggle() instead.
         */
        toggleEnabledState(): any;
        /**
         * Value that reports if the device is enabled.
         *
         * @since API version 2
         * @return {*}
         */
        isEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if the device is enabled.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #isEnabled()} instead.
         */
        addIsEnabledObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Indicates if the device has nested device chain slots. Use {@link #slotNames()}
         * to get a list of available slot names, and navigate to devices in those
         * slots using the {@link CursorDevice} interface.
         *
         * @return {*} a value object that indicates if the device has nested device chains in FX slots.
         * @since API version 1
         */
        hasSlots(): BooleanValue;
        /**
         * Value of the list of available FX slots in this device.
         *
         * @since API version 2
         * @return {*}
         */
        slotNames(): StringArrayValue;
        /**
         * Registers an observer that gets notified when the list of available FX slots changes.
         *
         * @param {*} callback
         * a callback function which takes a single string array argument that contains the names of the
         * slots.
         * @since API version 1
         * @deprecated Use {@link #slotNames()} instead.
         */
        addSlotsObserver(callback: StringArrayValueChangedCallback): any;
        /**
         * Returns an object that represents the selected device slot as shown in the user interface, and that
         * provides access to the contents of slot's device chain.
         *
         * @return {*} the requested slot cursor object
         * @since API version 1
         */
        getCursorSlot(): DeviceSlot;
        /**
         * Indicates if the device is contained by another device.
         *
         * @return {*} a value object that indicates if the device is nested
         * @since API version 1
         */
        isNested(): BooleanValue;
        /**
         * Indicates if the device supports nested layers.
         *
         * @return {*} a value object that indicates if the device supports nested layers.
         * @since API version 1
         */
        hasLayers(): BooleanValue;
        /**
         * Indicates if the device has individual device chains for each note value.
         *
         * @return {*} a value object that indicates if the device has individual device chains for each note value.
         * @since API version 1
         */
        hasDrumPads(): BooleanValue;
        /**
         * Create a bank for navigating the nested layers of the device using a fixed-size window.
         *
         * This bank will work over the following devices:
         * - Instrument Layer
         * - Effect Layer
         * - Instrument Selector
         * - Effect Selector
         *
         * @param {number} numChannels
         * the number of channels that the device layer bank should be configured with
         * @return {*} a device layer bank object configured with the desired number of channels
         * @since API version 1
         */
        createLayerBank(numChannels: number): DeviceLayerBank;
        /**
         * Create a bank for navigating the nested layers of the device using a fixed-size window.
         *
         * @param {number} numPads
         * the number of channels that the drum pad bank should be configured with
         * @return {*} a drum pad bank object configured with the desired number of pads
         * @since API version 1
         */
        createDrumPadBank(numPads: number): DrumPadBank;
        /**
         * Returns a device layer instance that can be used to navigate the layers or drum pads of the device, in
         * case it has any
         *
         * This is the selected layer from the user interface.
         *
         * @return {*} a cursor device layer instance
         * @since API version 1
         */
        createCursorLayer(): CursorDeviceLayer;
        /**
         * Creates a ChainSelector object which will give you control over the current device if it is
         * an Instrument Selector or an Effect Selector.
         *
         * To check if the device is currently a ChainSelector, use {@link ChainSelector.exists()}.
         *
         * If you want to have access to all the chains, use {@link #createLayerBank(int)}.
         *
         * @return {*} a chain selector instance
         * @since API version 6
         */
        createChainSelector(): ChainSelector;
        /**
         * Adds an observer on a list of all parameters for the device.
         *
         * The callback always updates with an array containing all the IDs for the device.
         *
         * @param {*} callback
         * function with the signature (String[])
         * @since API version 1
         */
        addDirectParameterIdObserver(callback: StringArrayValueChangedCallback): any;
        /**
         * Adds an observer for the parameter names (initial and changes) of all parameters for the device.
         *
         * @param {number} maxChars
         * maximum length of the string sent to the observer.
         * @param {*} callback
         * function with the signature (String ID, String name)
         * @since API version 1
         */
        addDirectParameterNameObserver(
            maxChars: number,
            callback: DirectParameterNameChangedCallback
        ): any;
        /**
         * Returns an observer that reports changes of parameter display values, i.e. parameter values formatted as
         * a string to be read by the user, for example "-6.02 dB". The returned observer object can be used to
         * configure which parameters should be observed. By default no parameters are observed. It should be
         * avoided to observe all parameters at the same time for performance reasons.
         *
         * @return {*} an observer object that can be used to enable or disable actual observing for certain
         * parameters.
         * @param {number} maxChars
         * maximum length of the string sent to the observer.
         * @param {*} callback
         * function with the signature (String ID, String valueDisplay)
         * @since API version 1
         */
        addDirectParameterValueDisplayObserver(
            maxChars: number,
            callback: DirectParameterDisplayedValueChangedCallback
        ): DirectParameterValueDisplayObserver;
        /**
         * Adds an observer for the parameter display value (initial and changes) of all parameters for the device.
         *
         * @param {*} callback
         * a callback function with the signature (String ID, float normalizedValue). If the value is not
         * accessible 'Number.NaN' (not-a-number) is reported, can be checked with 'isNaN(value)'.
         * @since API version 1
         */
        addDirectParameterNormalizedValueObserver(
            callback: DirectParameterNormalizedValueChangedCallback
        ): any;
        /**
         * Sets the parameter with the specified `id` to the given `value` according to the given `resolution`.
         *
         * @param {string} id
         * the parameter identifier string
         * @param {number} value
         * the new value normalized to the range [0..resolution-1]
         * @param {number} resolution
         * the resolution of the new value
         * @since API version 1
         */
        setDirectParameterValueNormalized(id: string, value: number, resolution: number): any;
        /**
         * Increases the parameter with the specified `id` by the given `increment` according to the given
         * `resolution`. To decrease the parameter value pass in a negative increment.
         *
         * @param {string} id
         * the parameter identifier string
         * @param {number} increment
         * the amount that the parameter value should be increased by, normalized to the range
         * [0..resolution-1]
         * @param {number} resolution
         * the resolution of the new value
         * @since API version 1
         */
        incDirectParameterValueNormalized(id: string, increment: number, resolution: number): any;
        /**
         * Value that reports the file name of the currently loaded sample, in case the device is a sample
         * container device.
         *
         * @since API version 2
         * @return {*}
         */
        sampleName(): StringValue;
        /**
         * Registers an observer that reports the file name of the currently loaded sample, in case the device is a
         * sample container device.
         *
         * @param {number} maxChars
         * maximum length of the string sent to the observer.
         * @param {string} textWhenUnassigned
         * the default name that gets reported when the device is not associated with a Bitwig Studio
         * device yet.
         * @param {*} callback
         * a callback function that receives a single string parameter.
         * @deprecated Use {@link #sampleName()} instead.
         */
        addSampleNameObserver(
            maxChars: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Returns an object that provides bank-wise navigation of sibling devices of the same device chain
         * (including the device instance used to create the siblings bank).
         *
         * @param {number} numDevices
         * the number of devices that are simultaneously accessible
         * @return {*} the requested device bank object
         * @ @since API version 1
         */
        createSiblingsDeviceBank(numDevices: number): DeviceBank;
        /**
         * Starts browsing for content that can be inserted before this device in Bitwig Studio's popup browser.
         *
         * @since API version 2
         */
        browseToInsertBeforeDevice(): any;
        /**
         * Starts browsing for content that can be inserted before this device in Bitwig Studio's popup browser.
         *
         * @since API version 2
         */
        browseToInsertAfterDevice(): any;
        /**
         * Starts browsing for content that can replace this device in Bitwig Studio's popup browser.
         *
         * @since API version 2
         */
        browseToReplaceDevice(): any;
    }

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
     * @class
     */
    interface DeviceBank extends Bank<Device> {
        /**
         * Returns the object that was used to instantiate this device bank. Possible device chain instances are
         * tracks, device layers, drums pads, or FX slots.
         *
         * @return {*} the requested device chain object
         * @since API version 1
         */
        getDeviceChain(): DeviceChain;
        /**
         * Returns the device at the given index within the bank.
         *
         * @param {number} indexInBank
         * the device index within this bank, not the position within the device chain. Must be in the
         * range [0..sizeOfBank-1].
         * @return {*} the requested device object
         * @since API version 1
         */
        getDevice(indexInBank: number): Device;
        /**
         * Scrolls the device window one page up.
         *
         * @since API version 1
         */
        scrollPageUp(): any;
        /**
         * Scrolls the device window one page down.
         *
         * @since API version 1
         */
        scrollPageDown(): any;
        /**
         * Scrolls the device window one device up.
         *
         * @since API version 1
         */
        scrollUp(): any;
        /**
         * Scrolls the device window one device down.
         *
         * @since API version 1
         */
        scrollDown(): any;
        /**
         * Makes the device with the given position visible in the track bank.
         *
         * @param {number} position
         * the position of the device within the device chain
         * @since API version 1
         */
        scrollTo(position: number): any;
        /**
         * Registers an observer that reports the current device scroll position.
         *
         * @param {*} callback
         * a callback function that takes a single integer parameter
         * @param {number} valueWhenUnassigned
         * the default value that gets reports when the device chain is not yet connected to a Bitwig
         * Studio document
         * @since API version 1
         * @deprecated Use {@link #scrollPosition()} instead.
         */
        addScrollPositionObserver(
            callback: IntegerValueChangedCallback,
            valueWhenUnassigned: number
        ): any;
        /**
         * Registers an observer that reports if the device window can be scrolled further up.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #canScrollBackwards()} instead.
         */
        addCanScrollUpObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the device window can be scrolled further down.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #canScrollForwards()} instead.
         */
        addCanScrollDownObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports the total device count of the device chain (not the number of devices
         * accessible through the bank window).
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #deviceCount()}.addValueObserver(callback)
         */
        addDeviceCountObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Browses for content to insert a device at the given index inside this bank.
         *
         * @param {number} index
         * the index to insert the device at. Must be >= 0 and <= {@link #getSizeOfBank()}.
         *
         * @since API version 2
         */
        browseToInsertDevice(index: number): any;
    }

    /**
     * Instances of this interface are used for browsing devices, including access to all filter columns and the
     * result column as shown in the 'Devices' tab of Bitwig Studio's contextual browser window.
     *
     * @see BrowsingSession
     * @since API version 1
     * @deprecated Use {@link PopupBrowser} instead.
     * @class
     */
    interface DeviceBrowsingSession extends BrowsingSession {
        /**
         * Returns the category filter as shown in the category column of the browser.
         *
         * @return {*} the requested category filter object.
         * @since API version 1
         */
        getCategoryFilter(): BrowserFilterColumn;
        /**
         * Returns the device type filter as shown in the category column of the browser.
         *
         * @return {*} the requested device type filter object.
         * @since API version 1
         */
        getDeviceTypeFilter(): BrowserFilterColumn;
        /**
         * Returns the file type filter as shown in the category column of the browser.
         *
         * @return {*} the requested file type filter object.
         * @since API version 1
         */
        getFileTypeFilter(): BrowserFilterColumn;
    }

    /**
     * The foundation of all interfaces that contain devices, such as tracks, device layers, drum pads or FX
     * slots.
     *
     * @since API version 1
     * @class
     */
    interface DeviceChain extends ObjectProxy {
        /**
         * Selects the device chain in Bitwig Studio, in case it is a selectable object.
         *
         * @since API version 1
         */
        selectInEditor(): any;
        /**
         * Value that reports the name of the device chain, such as the track name or the drum pad
         * name.
         *
         * @since API version 2
         * @return {*}
         */
        name(): SettableStringValue;
        /**
         * Registers an observer that reports the name of the device chain, such as the track name or the drum pad
         * name.
         *
         * @param {number} numChars
         * the maximum number of characters used for the reported name
         * @param {string} textWhenUnassigned
         * the default text that gets reported when the device chain is not associated with an object in
         * Bitwig Studio yet.
         * @param {*} callback
         * a callback function that receives a single name parameter (string).
         * @since API version 1
         * @deprecated Use {@link #name()} instead.
         */
        addNameObserver(
            numChars: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Registers an observer that reports if the device chain is selected in Bitwig Studio editors.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter.
         * @since API version 1
         */
        addIsSelectedInEditorObserver(callback: BooleanValueChangedCallback): any;
        /**
         * @deprecated Use {@link #addIsSelectedInEditorObserver} instead.
         * @since API version 1
         * @param {*} callback
         */
        addIsSelectedObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Returns an object that provides bank-wise navigation of devices.
         *
         * @param {number} numDevices
         * the number of devices should be accessible simultaneously
         * @return {*} the requested device bank object
         * @ @since API version 1
         */
        createDeviceBank(numDevices: number): DeviceBank;
        /**
         * Returns an object used for browsing devices, presets and other content. Committing the browsing session
         * will load or create a device from the selected resource and insert it into the device chain.
         *
         * @param {number} numFilterColumnEntries
         * the size of the window used to navigate the filter column entries.
         * @param {number} numResultsColumnEntries
         * the size of the window used to navigate the results column entries.
         * @return {*} the requested device browser object.
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
        select(): any;
        /**
         * Starts browsing for content that can be inserted at the start of this device chain.
         *
         * @since API version 2
         */
        browseToInsertAtStartOfChain(): any;
        /**
         * Starts browsing for content that can be inserted at the end of this device chain.
         *
         * @since API version 2
         */
        browseToInsertAtEndOfChain(): any;
    }

    /**
     * Instances of this interface represent device layers in Bitwig Studio.
     *
     * @since API version 1
     * @class
     */
    interface DeviceLayer extends Channel {}

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
     * @class
     */
    interface DeviceLayerBank extends ChannelBank<DeviceLayer> {
        /**
         * Returns the device layer at the given index.
         *
         * @param {number} indexInBank
         * the device layer index within this bank, not the index within the list of all device layers as
         * shown in Bitwig Studio layer devices. Must be in the range [0..sizeOfBank-1].
         * @return {*} the device layer object
         * @since API version 1
         * @deprecated Use {@link #getItemAt(int)} instead.
         */
        getChannel(indexInBank: number): DeviceLayer;
    }

    /**
     * Instances of this interface represent nested FX slots in devices.
     *
     * @since API version 1
     * @class
     */
    interface DeviceSlot extends DeviceChain {}

    /**
     * This interface is used to configure observation of pretty-printed device parameter values.
     *
     * @since API version 1
     * @class
     */
    interface DirectParameterValueDisplayObserver {
        /**
         * Starts observing the parameters according to the given parameter ID array, or stops observing in case
         * `null` is passed in for the parameter ID array.
         *
         * @param {Array} parameterIds
         * the array of parameter IDs or `null` to stop observing parameter display values.
         * @since API version 1
         */
        setObservedParameterIds(parameterIds: string[]): any;
    }

    /**
     * This interface is used to save custom script settings inside Bitwig Studio documents. The settings are
     * shown to the user in the `Studio IO` panel of Bitwig Studio.
     *
     * @since API version 1
     * @class
     */
    interface DocumentState extends Settings {}

    /**
     * Instances of this interface represent double values.
     * @since API version 2
     * @class
     */
    interface DoubleValue extends Value<DoubleValueChangedCallback> {
        /**
         * Gets the current value.
         *
         * @since API version 2
         * @return {number}
         */
        get(): number;
    }

    /**
     * Instances of this interface are special kind of channel objects that represent the pads of a drum machine
     * instrument. Drum pads are typically associated to channel objects via note keys.
     *
     * @since API version 1
     * @class
     */
    interface DrumPad extends Channel {}

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
     * @class
     */
    interface DrumPadBank extends ChannelBank<DrumPad> {
        /**
         * Specifies if the Drum Machine should visualize which pads are part of the window. By default indications
         * are enabled.
         *
         * @param {boolean} shouldIndicate
         * `true` if visual indications should be enabled, `false` otherwise
         * @since API version 1
         */
        setIndication(shouldIndicate: boolean): any;
    }

    interface EnumValue extends Value<EnumValueChangedCallback> {
        /**
         * Gets the current value.
         *
         * @since API version 2
         * @return {string}
         */
        get(): string;
    }

    /**
     * Instances of this interface are used for browsing material with bank-wise access to the filter columns.
     *
     * @see BrowsingSession
     * @since API version 1
     * @deprecated Use {@link PopupBrowser} instead.
     * @class
     */
    interface GenericBrowsingSession extends BrowsingSession {
        /**
         * Value that reports the name of the browsing session.
         *
         * @since API version 2
         * @return {*}
         */
        name(): StringValue;
        /**
         * Registers an observer that reports the name of the browsing session.
         *
         * @param {*} callback
         * a callback function that receives a single string argument.
         * @since API version 1
         * @deprecated Use
         * @param {number} maxCharacters
         * @param {string} textWhenUnassigned
         */
        addNameObserver(
            maxCharacters: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
    }

    /**
     * An interface representing the global groove settings of the project.
     *
     * @since API version 1
     * @class
     */
    interface Groove {
        /**
         * Returns the enabled state of the groove.
         *
         * @return {*} an object that provides access to the groove on/off setting
         * @since API version 1
         */
        getEnabled(): Parameter;
        /**
         * Returns the object that represents the shuffle amount in Bitwig Studio.
         *
         * @return {*} an ranged value object that provides access to the shuffle amount
         * @since API version 1
         */
        getShuffleAmount(): Parameter;
        /**
         * Returns the object that represents the shuffle rate in Bitwig Studio.
         *
         * @return {*} an ranged value object that provides access to the shuffle rate
         * @since API version 1
         */
        getShuffleRate(): Parameter;
        /**
         * Returns the object that represents the accent amount in Bitwig Studio.
         *
         * @return {*} an ranged value object that provides access to the accent amount
         * @since API version 1
         */
        getAccentAmount(): Parameter;
        /**
         * Returns the object that represents the accent rate in Bitwig Studio.
         *
         * @return {*} an ranged value object that provides access to the accent rate
         * @since API version 1
         */
        getAccentRate(): Parameter;
        /**
         * Returns the object that represents the accent phase in Bitwig Studio.
         *
         * @return {*} an ranged value object that provides access to the accent phase
         * @since API version 1
         */
        getAccentPhase(): Parameter;
    }

    interface IntegerValue extends Value<IntegerValueChangedCallback> {
        /**
         * Gets the current value.
         *
         * @since API version 2
         * @return {number}
         */
        get(): number;
        /**
         * Adds an observer that is notified when this value changes. This is intended to aid in backwards
         * compatibility for drivers written to the version 1 API.
         *
         * @param {*} callback
         * The callback to notify with the new value
         * @param {number} valueWhenUnassigned
         * The value that the callback will be notified with if this value is not currently assigned to
         * anything.
         */
        addValueObserver(callback: IntegerValueChangedCallback, valueWhenUnassigned?: any): any;
    }

    /**
     * Instances of this interface are used to represent macro controls in Bitwig Studio to controllers.
     *
     * @deprecated Macros no longer exist as built in features of all devices. Instead the user can customize
     * pages of controls.
     * @since API version 1
     * @class
     */
    interface Macro {
        /**
         * Returns an object that provides access to the control value of the macro.
         *
         * @return {*} a ranged value object.
         * @since API version 1
         */
        getAmount(): Parameter;
        /**
         * Returns an object that provides access to the modulation source of the macro.
         *
         * @return {*} a modulation source object.
         * @since API version 1
         */
        getModulationSource(): ModulationSource;
        /**
         * Registers an observer that reports the label of the macro control.
         *
         * @param {number} numChars
         * the maximum number of characters of the reported label
         * @param {string} textWhenUnassigned
         * the default text that is reported when the macro is not connected to a Bitwig Studio macro
         * control.
         * @param {*} callback
         * a callback function that receives a single string parameter.
         */
        addLabelObserver(
            numChars: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
    }

    /**
     * A special kind of track that represents the master track in Bitwig Studio.
     *
     * @since API version 1
     * @class
     */
    interface MasterTrack extends Track {}

    /**
     * Instances of this interface are used to setup handler functions for incoming MIDI messages from a specific
     * MIDI hardware.
     *
     * @since API version 1
     * @class
     */
    interface MidiIn {
        /**
         * Registers a callback for receiving short (normal) MIDI messages on this MIDI input port.
         *
         * @param {*} callback
         * a callback function that receives three integer parameters: 1. the status byte 2. the data1
         * value 2. the data2 value
         * @ @since API version 1
         */
        setMidiCallback(callback: ShortMidiDataReceivedCallback): any;
        /**
         * Registers a callback for receiving sysex MIDI messages on this MIDI input port.
         *
         * @param {*} callback
         * a callback function that takes a single string argument
         * @ @since API version 1
         */
        setSysexCallback(callback: SysexMidiDataReceivedCallback): any;
        /**
         * Creates a note input that appears in the track input choosers in Bitwig Studio. This method must be
         * called within the `init()` function of the script. The messages matching the given mask parameter will
         * be fed directly to the application, and are not processed by the script.
         *
         * @param {string} name
         * the name of the note input as it appears in the track input choosers in Bitwig Studio
         * @param {Array} masks
         * a filter string formatted as hexadecimal value with `?` as wildcard. For example `80????`
         * would match note-off on channel 1 (0). When this parameter is {@null}, a standard filter will
         * be used to forward note-related messages on channel 1 (0).
         *
         * If multiple note input match the same MIDI event then they'll all receive the MIDI event, and
         * if one of them does not consume events then the events wont' be consumed.
         * @return {*} the object representing the requested note input
         * @since API version 1
         */
        createNoteInput(name: string, ...masks: string[]): NoteInput;
    }

    /**
     * Instances of this interface are used to send MIDI messages to a specific MIDI hardware.
     *
     * @since API version 1
     * @class
     */
    interface MidiOut {
        /**
         * Sends a MIDI message to the hardware device.
         *
         * @param {number} status
         * the status byte of the MIDI message
         * @param {number} data1
         * the data1 part of the MIDI message
         * @param {number} data2
         * the data2 part of the MIDI message
         * @ @since API version 1
         */
        sendMidi(status: number, data1: number, data2: number): any;
        /**
         * Sends a MIDI SysEx message to the hardware device.
         *
         * @param {string} hexString
         * the sysex message formatted as hexadecimal value string
         * @ @since API version 1
         */
        sendSysex(hexString?: any): any;
        /**
         * Enables or disables sending MIDI beat clock messages to the hardware depending on the given parameter.
         * Typically MIDI devices that run an internal sequencer such as hardware step sequencers would be
         * interested in MIDI clock messages.
         *
         * @param {boolean} shouldSendClock
         * `true` in case the hardware should receive MIDI clock messages, `false` otherwise
         * @ @deprecated Users should enable the clock from the settings.
         * @since API version 1
         */
        setShouldSendMidiBeatClock(shouldSendClock: boolean): any;
    }

    /**
     * An interface used to access various commands that can be performed on the Bitwig Studio mixer panel.<br/>
     *
     * To get an instance of the mixer interface call {@link ControllerHost#createMixer}.
     *
     * @since API version 1
     * @class
     */
    interface Mixer {
        /**
         * Gets an object that allows to show/hide the meter section of the mixer panel. Observers can be
         * registered on the returned object for receiving notifications when the meter section switches between
         * shown and hidden state.
         *
         * @return {*} a boolean value object that represents the meter section visibility
         * @since API version 1
         */
        isMeterSectionVisible(): SettableBooleanValue;
        /**
         * Gets an object that allows to show/hide the io section of the mixer panel. Observers can be registered
         * on the returned object for receiving notifications when the io section switches between shown and hidden
         * state.
         *
         * @return {*} a boolean value object that represents the io section visibility
         * @since API version 1
         */
        isIoSectionVisible(): SettableBooleanValue;
        /**
         * Gets an object that allows to show/hide the sends section of the mixer panel. Observers can be
         * registered on the returned object for receiving notifications when the sends section switches between
         * shown and hidden state.
         *
         * @return {*} a boolean value object that represents the sends section visibility
         * @since API version 1
         */
        isSendSectionVisible(): SettableBooleanValue;
        /**
         * Gets an object that allows to show/hide the clip launcher section of the mixer panel. Observers can be
         * registered on the returned object for receiving notifications when the clip launcher section switches
         * between shown and hidden state.
         *
         * @return {*} a boolean value object that represents the clip launcher section visibility
         * @since API version 1
         */
        isClipLauncherSectionVisible(): SettableBooleanValue;
        /**
         * Gets an object that allows to show/hide the devices section of the mixer panel. Observers can be
         * registered on the returned object for receiving notifications when the devices section switches between
         * shown and hidden state.
         *
         * @return {*} a boolean value object that represents the devices section visibility
         * @since API version 1
         */
        isDeviceSectionVisible(): SettableBooleanValue;
        /**
         * Gets an object that allows to show/hide the cross-fade section of the mixer panel. Observers can be
         * registered on the returned object for receiving notifications when the cross-fade section switches
         * between shown and hidden state.
         *
         * @return {*} a boolean value object that represents the cross-fade section visibility
         * @since API version 1
         */
        isCrossFadeSectionVisible(): SettableBooleanValue;
        /**
         * Registers an observer that reports if the meter section is visible (callback argument is `true`) in the
         * mixer panel or not (callback argument is `false`).
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @see #isMeterSectionVisible()
         * @deprecated call `isMeterSectionVisible().addValueObserver` instead
         * @since API version 1
         */
        addMeterSectionVisibilityObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the IO section is visible (callback argument is `true`) in the
         * mixer panel or not (callback argument is `false`).
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @see #isIoSectionVisible()
         * @deprecated call `isIoSectionVisible().addValueObserver` instead
         * @since API version 1
         */
        addIoSectionVisibilityObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the send control section is visible (callback argument is `true`)
         * in the mixer panel or not (callback argument is `false`).
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @see #isSendSectionVisible()
         * @deprecated call `isSendSectionVisible().addValueObserver` instead
         * @since API version 1
         */
        addSendsSectionVisibilityObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the clip launcher section is visible (callback argument is `true`)
         * in the mixer panel or not (callback argument is `false`).
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @see #isClipLauncherSectionVisible()
         * @deprecated call `isClipLauncherSectionVisible().addValueObserver` instead
         * @since API version 1
         */
        addClipLauncherSectionVisibilityObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the device section is visible (callback argument is `true`) in the
         * mixer panel or not (callback argument is `false`).
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @see #isDeviceSectionVisible()
         * @deprecated call `isDeviceSectionVisible().addValueObserver` instead
         * @since API version 1
         */
        addDeviceSectionVisibilityObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the cross-fade section is visible (callback argument is `true`) in
         * the mixer panel or not (callback argument is `false`).
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @see #isCrossFadeSectionVisible()
         * @deprecated call `isCrossFadeSectionVisible().addValueObserver` instead
         * @since API version 1
         */
        addCrossFadeSectionVisibilityObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Toggles the visibility of the meter section in the mixer panel.
         *
         * @see #isMeterSectionVisible()
         * @deprecated call `isMeterSectionVisible().toggle()` instead
         * @since API version 1
         */
        toggleMeterSectionVisibility(): any;
        /**
         * Toggles the visibility of the IO section in the mixer panel.
         *
         * @see #isIoSectionVisible()
         * @deprecated call `isIoSectionVisible().toggle()` instead
         * @since API version 1
         */
        toggleIoSectionVisibility(): any;
        /**
         * Toggles the visibility of the send control section in the mixer panel.
         *
         * @see #isSendSectionVisible()
         * @deprecated call `isSendSectionVisible().toggle()` instead
         * @since API version 1
         */
        toggleSendsSectionVisibility(): any;
        /**
         * Toggles the visibility of the clip launcher section in the mixer panel.
         *
         * @see #isClipLauncherSectionVisible()
         * @deprecated call `isClipLauncherSectionVisible().toggle()` instead
         * @since API version 1
         */
        toggleClipLauncherSectionVisibility(): any;
        /**
         * Toggles the visibility of the device section in the mixer panel.
         *
         * @see #isDeviceSectionVisible()
         * @deprecated call `isDeviceSectionVisible().toggle()` instead
         * @since API version 1
         */
        toggleDeviceSectionVisibility(): any;
        /**
         * Toggles the visibility of the cross-fade section in the mixer panel.
         *
         * @see #isCrossFadeSectionVisible()
         * @deprecated call `isCrossFadeSectionVisible().toggle()` instead
         * @since API version 1
         */
        toggleCrossFadeSectionVisibility(): any;
    }

    /**
     * This interface represents a modulation source in Bitwig Studio.
     *
     * @since API version 1
     * @class
     */
    interface ModulationSource {
        /**
         * Value which reports when the modulation source is in mapping mode.
         *
         * @since API version 2
         * @return {*}
         */
        isMapping(): BooleanValue;
        /**
         * Registers an observer which reports when the modulation source is in mapping mode.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #isMapping()} instead.
         */
        addIsMappingObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Toggles the modulation source between mapping mode and normal control functionality.
         *
         * @since API version 1
         */
        toggleIsMapping(): any;
        /**
         * Value the reports the name of the modulation source.
         *
         * @since API version 2
         * @return {*}
         */
        name(): StringValue;
        /**
         * Registers an observer the reports the name of the modulation source.
         *
         * @param {number} numChars
         * the maximum number of character the reported name should be long
         * @param {string} textWhenUnassigned
         * the default text that gets reported if the modulation source is not connected to to a
         * modulation source in Bitwig Studio yet
         * @param {*} callback
         * a callback function that receives a single string parameter
         * @since API version 1
         * @deprecated Use {@link #name()} instead.
         */
        addNameObserver(
            numChars: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Value which reports if the modulation source is mapped to any destination(s).
         *
         * @since API version 2
         * @return {*}
         */
        isMapped(): BooleanValue;
        /**
         * Registers an observer which reports if the modulation source is mapped to any destination(s).
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #isMapped()} instead.
         */
        addIsMappedObserver(callback: BooleanValueChangedCallback): any;
    }

    /**
     * Instances of this interface are used for browsing multi-samples, including access to all filter columns and
     * the result column as shown in the 'Multi-Samples' tab of Bitwig Studio's contextual browser window.
     *
     * @see BrowsingSession
     * @since API version 1
     * @deprecated Use {@link PopupBrowser} instead.
     * @class
     */
    interface MultiSampleBrowsingSession extends BrowsingSession {
        /**
         * Returns the file type filter as shown in the category column of the browser.
         *
         * @return {*} the requested file type filter object.
         * @since API version 1
         */
        getFileTypeFilter(): BrowserFilterColumn;
    }

    /**
     * Instances of this interface are used for browsing music files, including access to all filter columns and
     * the result column as shown in the 'Music' tab of Bitwig Studio's contextual browser window.
     *
     * @see BrowsingSession
     * @since API version 1
     * @deprecated Use {@link PopupBrowser} instead.
     * @class
     */
    interface MusicBrowsingSession extends BrowsingSession {
        /**
         * Returns the file type filter as shown in the category column of the browser.
         *
         * @return {*} the requested file type filter object.
         * @since API version 1
         */
        getFileTypeFilter(): BrowserFilterColumn;
    }

    /**
     * Instances of this interface implement note input functionality used for recording notes in Bitwig Studio
     * and for playing the instruments in tracks on hardware keyboards. In Bitwig Studio the note inputs are shown
     * in the input choosers of Bitwig Studio tracks.
     *
     * @since API version 1
     * @class
     */
    interface NoteInput {
        /**
         * Specifies if the note input should consume MIDI notes, or in other words if it should prevent forwarding
         * incoming notes to the MIDI callback registered in {@link MidiIn#setMidiCallback}. This setting is `true`
         * by default.
         *
         * @param {boolean} shouldConsumeEvents
         * `true` if note events should be consumed, `false` of the events should be additionally sent to
         * the callback registered via {@link MidiIn#setMidiCallback}
         * @since API version 1
         */
        setShouldConsumeEvents(shouldConsumeEvents: boolean): any;
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
         * @param {Array} table
         * an array which should contain 128 entries. Each entry should be a note value in the range
         * [0..127] or -1 in case of filtering.
         * @since API version 1
         */
        setKeyTranslationTable(table: any[]): any;
        /**
         * Specifies a translation table which defines the actual velocity value (0-127) of notes arriving in
         * Bitwig Studio for each note velocity potentially received from the hardware. This is used for note-on
         * events only.
         *
         * Typically this method is used to implement velocity curves or fixed velocity mappings in controller
         * scripts. By default an identity transform table is configured, which means that all incoming MIDI notes
         * keep their original velocity when being sent into Bitwig Studio.
         *
         * @param {Array} table
         * an array which should contain 128 entries. Each entry should be a note value in the range
         * [0..127] or -1 in case of filtering.
         * @since API version 1
         */
        setVelocityTranslationTable(table: any[]): any;
        /**
         * Assigns polyphonic aftertouch MIDI messages to the specified note expression. Multi-dimensional control
         * is possible by calling this method several times with different MIDI channel parameters. If a key
         * translation table is configured by calling {@link #setKeyTranslationTable}, that table is used for
         * polyphonic aftertouch as well.
         *
         * @param {number} channel
         * the MIDI channel to map, range [0..15]
         * @param {NoteInput.NoteExpression} expression
         * the note-expression to map for the given MIDI channel
         * @param {number} pitchRange
         * the pitch mapping range in semitones, values must be in the range [1..24]. This parameter is
         * ignored for non-pitch expressions.
         * @ @since API version 1
         */
        assignPolyphonicAftertouchToExpression(
            channel: number,
            expression: NoteInput.NoteExpression,
            pitchRange: number
        ): any;
        /**
         * Enables use of Expressive MIDI mode. (note-per-channel)
         *
         * @param {boolean} useExpressiveMidi
         * enabled/disable the MPE mode for this note-input
         * @param {number} baseChannel
         * which channel (must be either 0 or 15) which is used as the base for this note-input
         * @param {number} pitchBendRange
         * initial pitch bend range used
         */
        setUseExpressiveMidi(
            useExpressiveMidi: boolean,
            baseChannel: number,
            pitchBendRange: number
        ): any;
        /**
         * Enables use of Multidimensional Polyphonic Expression mode. (note-per-channel)
         *
         * @param {boolean} useMPE
         * enabled/disable the MPE mode for this note-input
         * @param {number} baseChannel
         * which channel (must be either 0 or 15) which is used as the base for this note-input
         */
        setUseMultidimensionalPolyphonicExpression(useMPE: boolean, baseChannel: number): any;
        /**
         * Sends MIDI data directly to the note input. This will bypass both the event filter and translation
         * tables. The MIDI channel of the message will be ignored.
         *
         * @param {number} status
         * the status byte of the MIDI message
         * @param {number} data0
         * the data0 part of the MIDI message
         * @param {number} data1
         * the data1 part of the MIDI message
         * @since API version 1
         */
        sendRawMidiEvent(status: number, data0: number, data1: number): any;
    }
    namespace NoteInput {
        /**
         * An enum defining the note expressions available in Bitwig Studio, used for the expression parameter of
         * {@link #assignPolyphonicAftertouchToExpression}.
         *
         * @since API version 1
         * @enum
         * @property {NoteInput.NoteExpression} NONE
         * @property {NoteInput.NoteExpression} PITCH_DOWN
         * @property {NoteInput.NoteExpression} PITCH_UP
         * @property {NoteInput.NoteExpression} GAIN_DOWN
         * @property {NoteInput.NoteExpression} GAIN_UP
         * @property {NoteInput.NoteExpression} PAN_LEFT
         * @property {NoteInput.NoteExpression} PAN_RIGHT
         * @property {NoteInput.NoteExpression} TIMBRE_DOWN
         * @property {NoteInput.NoteExpression} TIMBRE_UP
         * @class
         */
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
    }

    /**
     * Instances of this interface are used to access the notes for a specific note key.
     *
     * @since API version 1
     * @class
     */
    interface NoteLane {
        /**
         * Value which represents the id of this lane. is either the note pitch represented by this lane, or in
         * case of audio a lane index (currently always 0 in that case).
         *
         * @since API version 2
         * @return {*}
         */
        noteLaneId(): IntegerValue;
        /**
         * Registers an observer for the note value, which is either the note pitch represented by this lane, or in
         * case of audio a lane index (currently always 0 in that case).
         *
         * @since API version 1
         * @deprecated Use {@link #noteLaneId()} instead.
         * @param {*} callback
         */
        addNoteValueObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Value  that reports the name of the note lane. Typically the name of a note lane is
         * either equal to the title of an associated drum pad, or reflects the pitch of the note, e.g. "C#3".
         * @return {*}
         */
        name(): StringValue;
        /**
         * Registers an observer that reports the name of the note lane. Typically the name of a note lane is
         * either equal to the title of an associated drum pad, or reflects the pitch of the note, e.g. "C#3".
         *
         * @param {number} numChars
         * the maximum number of characters used for the reported name
         * @param {string} textWhenUnassigned
         * the default name that gets reported when the lane is not yet associated with a note lane in
         * Bitwig Studio
         * @param {*} callback
         * a callback function that receives a single string argument
         * @since API version 1
         * @deprecated Use {@link #name()} instead.
         */
        addNameObserver(
            numChars: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Value the color of the note lane. By default the reported color will be the
         * track color, or in case an associated drum pad has a custom color it will be the color of that pad
         * @return {*}
         */
        color(): SettableColorValue;
        /**
         * Registers an observer that reports the color of the note lane. By default the reported color will be the
         * track color, or in case an associated drum pad has a custom color it will be the color of that pad.
         *
         * @param {*} callback
         * a callback function that receives three arguments which from an RGB color: 1. the red
         * dimension of the color value, 2. the green dimension of the color value, and 3. the blue
         * dimension of the color value
         * @since API version 1
         * @deprecated Use {@link #color()} instead.
         */
        addColorObserver(callback: ColorValueChangedCallback): any;
        /**
         * Plays a note with the key of the note lane and the provided velocity parameter.
         *
         * @param {number} velocity
         * the velocity the note should be played with
         * @since API version 1
         */
        play(velocity: number): any;
    }

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
     * @class
     */
    interface NotificationSettings {
        /**
         * Returns an object that reports if user notifications are enabled and that allows to enable/disable user
         * notifications from the control surface. If user notifications are disabled, no automatic notifications
         * will be shown in the Bitwig Studio user interface. If user notifications are enabled, all automatic
         * notifications will be shown that are enabled using the methods of this interface.
         *
         * @return {*} a boolean value object
         * @since API version 1
         */
        getUserNotificationsEnabled(): SettableBooleanValue;
        /**
         * Specifies if user notification related to selection changes should be shown. Please note that this
         * setting only applies when user notifications are enabled in general, otherwise no notification are
         * shown. By default this setting is `false`.
         *
         * @param {boolean} shouldShowNotifications
         * `true` in case selection notifications should be shown, `false` otherwise.
         * @see #getUserNotificationsEnabled()
         * @since API version 1
         */
        setShouldShowSelectionNotifications(shouldShowNotifications: boolean): any;
        /**
         * Specifies if user notification related to selection changes should be shown. Please note that this
         * setting only applies when user notifications are enabled in general, otherwise no notification are
         * shown. By default this setting is `false`.
         *
         * @param {boolean} shouldShowNotifications
         * `true` in case selection notifications should be shown, `false` otherwise.
         * @see #getUserNotificationsEnabled()
         * @since API version 1
         */
        setShouldShowChannelSelectionNotifications(shouldShowNotifications: boolean): any;
        /**
         * Specifies if user notification related to selection changes should be shown. Please note that this
         * setting only applies when user notifications are enabled in general, otherwise no notification are
         * shown. By default this setting is `false`.
         *
         * @param {boolean} shouldShowNotifications
         * `true` in case selection notifications should be shown, `false` otherwise.
         * @see #getUserNotificationsEnabled()
         * @since API version 1
         */
        setShouldShowTrackSelectionNotifications(shouldShowNotifications: boolean): any;
        /**
         * Specifies if user notification related to selection changes should be shown. Please note that this
         * setting only applies when user notifications are enabled in general, otherwise no notification are
         * shown. By default this setting is `false`.
         *
         * @param {boolean} shouldShowNotifications
         * `true` in case selection notifications should be shown, `false` otherwise.
         * @see #getUserNotificationsEnabled()
         * @since API version 1
         */
        setShouldShowDeviceSelectionNotifications(shouldShowNotifications: boolean): any;
        /**
         * Specifies if user notification related to selection changes should be shown. Please note that this
         * setting only applies when user notifications are enabled in general, otherwise no notification are
         * shown. By default this setting is `false`.
         *
         * @param {boolean} shouldShowNotifications
         * `true` in case selection notifications should be shown, `false` otherwise.
         * @see #getUserNotificationsEnabled()
         * @since API version 1
         */
        setShouldShowDeviceLayerSelectionNotifications(shouldShowNotifications: boolean): any;
        /**
         * Specifies if user notification related to selection changes should be shown. Please note that this
         * setting only applies when user notifications are enabled in general, otherwise no notification are
         * shown.
         *
         * @param {boolean} shouldShowNotifications
         * `true` in case selection notifications should be shown, `false` otherwise.
         * @see #getUserNotificationsEnabled()
         * @since API version 1
         */
        setShouldShowPresetNotifications(shouldShowNotifications: boolean): any;
        /**
         * Specifies if user notification related to selection changes should be shown. Please note that this
         * setting only applies when user notifications are enabled in general, otherwise no notification are
         * shown. By default this setting is `false`.
         *
         * @param {boolean} shouldShowNotifications
         * `true` in case selection notifications should be shown, `false` otherwise.
         * @see #getUserNotificationsEnabled()
         * @since API version 1
         */
        setShouldShowMappingNotifications(shouldShowNotifications: boolean): any;
        /**
         * Specifies if user notification related to selection changes should be shown. Please note that this
         * setting only applies when user notifications are enabled in general, otherwise no notification are
         * shown. By default this setting is `false`.
         *
         * @param {boolean} shouldShowNotifications
         * `true` in case selection notifications should be shown, `false` otherwise.
         * @see #getUserNotificationsEnabled()
         * @since API version 1
         */
        setShouldShowValueNotifications(shouldShowNotifications: boolean): any;
    }

    /**
     * @since API version 2
     * @class
     */
    interface ObjectArrayValue<ObjectType> extends Value<ObjectValueChangedCallback<ObjectType[]>> {
        /**
         * @since API version 2
         * @param {number} index
         * @return {*}
         */
        get(index?: any): any;
    }

    /**
     * Interface for an object that acts as a proxy for the actual object in Bitwig Studio (for example a track, a
     * device etc).
     *
     * @since API version 2
     * @class
     */
    interface ObjectProxy extends Subscribable {
        /**
         * Returns a value object that indicates if the object being proxied exists, or if it has content.
         * @return {*}
         */
        exists(): BooleanValue;
        /**
         * Creates a {@link BooleanValue} that determines this proxy is considered equal to another proxy. For this
         * to be the case both proxies need to be proxying the same target object.
         *
         * @since API version 3
         * @param {*} other
         * @return {*}
         */
        createEqualsValue(other: ObjectProxy): BooleanValue;
    }

    /**
     * Instances of this interface represent ranged parameters that can be controlled with automation in Bitwig
     * Studio.
     *
     * @since API version 1
     * @class
     */
    interface Parameter extends SettableRangedValue, ObjectProxy {
        /**
         * Gets the current value of this parameter.
         *
         * @since API version 2
         * @return {*}
         */
        value(): SettableRangedValue;
        /**
         * Gets the modulated value of this parameter.
         *
         * @since API version 2
         * @return {*}
         */
        modulatedValue(): RangedValue;
        /**
         * The name of the parameter.
         * @since API version 2
         * @return {*}
         */
        name(): StringValue;
        /**
         * Adds an observer which reports changes to the name of the automated parameter. The callback will get
         * called at least once immediately after calling this method for reporting the current name.
         *
         * @param {number} maxChars
         * maximum length of the string sent to the observer
         * @param {string} textWhenUnassigned
         * the default text to use
         * @param {*} callback
         * a callback function that receives a single string parameter
         * @since API version 1
         * @deprecated
         */
        addNameObserver(
            maxChars: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Adds an observer which sends a formatted text representation of the value whenever the value changes.
         * The callback will get called at least once immediately after calling this method for reporting the
         * current state.
         *
         * @param {number} maxChars
         * maximum length of the string sent to the observer
         * @param {string} textWhenUnassigned
         * the default text to use
         * @param {*} callback
         * a callback function that receives a single string parameter
         * @since API version 1
         * @deprecated Use {@link #value()#displayedValue()} instead
         */
        addValueDisplayObserver(
            maxChars: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Resets the value to its default.
         *
         * @since API version 1
         */
        reset(): any;
        /**
         * Touch (or un-touch) the value for automation recording.
         *
         * @param {boolean} isBeingTouched
         * `true` for touching, `false` for un-touching
         * @since API version 1
         */
        touch(isBeingTouched: boolean): any;
        /**
         * Specifies if this value should be indicated as mapped in Bitwig Studio, which is visually shown as
         * colored dots or tinting on the parameter controls.
         *
         * @param {boolean} shouldIndicate
         * `true` in case visual indications should be shown in Bitwig Studio, `false` otherwise
         * @since API version 1
         */
        setIndication(shouldIndicate: boolean): any;
        /**
         * Specifies a label for the mapped hardware parameter as shown in Bitwig Studio, for example in menu items
         * for learning controls.
         *
         * @param {string} label
         * the label to be shown in Bitwig Studio
         * @since API version 1
         */
        setLabel(label: string): any;
        /**
         * Restores control of this parameter to automation playback.
         *
         * @since API version 1
         */
        restoreAutomationControl(): any;
    }

    /**
     * Defines a bank of parameters.
     *
     * @since API version 2
     * @class
     */
    interface ParameterBank {
        /**
         * Gets the number of slots that these remote controls have.
         *
         * @since API version 2
         * @return {number}
         */
        getParameterCount(): number;
        /**
         * Returns the parameter at the given index within the bank.
         *
         * @param {number} indexInBank
         * the parameter index within this bank. Must be in the range [0..getParameterCount()-1].
         * @return {*} the requested parameter
         * @since API version 2
         */
        getParameter(indexInBank: number): Parameter;
    }

    /**
     * Interface that defines a cursor that can be "pinned".
     *
     * @since API version 2
     * @class
     */
    interface PinnableCursor extends Cursor {
        /**
         * Determines if this cursor is currently pinned or not. If the cursor is pinned then it won't follow the
         * selection the user makes in the application.
         *
         * @since API version 2
         * @return {*}
         */
        isPinned(): SettableBooleanValue;
    }

    /**
     * Cursor that can be pinned to the current device or follow the selection.
     *
     * @since API version 2
     * @class
     */
    interface PinnableCursorDevice extends CursorDevice, PinnableCursor {}

    /**
     * @since API version 2
     * @class
     */
    interface PlayingNote {
        /**
         * @since API version 2
         * @return {number}
         */
        pitch(): number;
        /**
         * @since API version 2
         * @return {number}
         */
        velocity(): number;
    }

    /**
     * @since API version 2
     * @class
     */
    interface PlayingNoteArrayValue extends ObjectArrayValue<PlayingNote> {
        isNotePlaying(note: number): boolean;
    }

    /**
     * Object that represents the popup browser in Bitwig Studio.
     *
     * @since API version 2
     * @class
     */
    interface PopupBrowser extends ObjectProxy {
        /**
         * The title of the popup browser.
         *
         * @since API version 2
         * @return {*}
         */
        title(): StringValue;
        /**
         * Value that reports the possible content types that can be inserted by the popup browser. These are
         * represented by the tabs in Bitwig Studio's popup browser.
         *
         * (e.g "Device", "Preset", "Sample" etc.)
         *
         * @since API version 2
         * @return {*}
         */
        contentTypeNames(): StringArrayValue;
        /**
         * Value that represents the selected content type.
         *
         * @since API version 2
         * @return {*}
         */
        selectedContentTypeName(): StringValue;
        /**
         * Value that represents the index of the selected content type within the content types supported.
         *
         * @since API version 2
         * @return {*}
         */
        selectedContentTypeIndex(): SettableIntegerValue;
        /**
         * The smart collections column of the browser.
         *
         * @since API version 2
         * @return {*}
         */
        smartCollectionColumn(): BrowserFilterColumn;
        /**
         * The location column of the browser.
         *
         * @since API version 2
         * @return {*}
         */
        locationColumn(): BrowserFilterColumn;
        /**
         * The device column of the browser.
         *
         * @since API version 2
         * @return {*}
         */
        deviceColumn(): BrowserFilterColumn;
        /**
         * The category column of the browser.
         *
         * @since API version 2
         * @return {*}
         */
        categoryColumn(): BrowserFilterColumn;
        /**
         * The tag column of the browser.
         *
         * @since API version 2
         * @return {*}
         */
        tagColumn(): BrowserFilterColumn;
        /**
         * The device type column of the browser.
         *
         * @since API version 2
         * @return {*}
         */
        deviceTypeColumn(): BrowserFilterColumn;
        /**
         * The file type column of the browser.
         *
         * @since API version 2
         * @return {*}
         */
        fileTypeColumn(): BrowserFilterColumn;
        /**
         * The creator column of the browser.
         *
         * @since API version 2
         * @return {*}
         */
        creatorColumn(): BrowserFilterColumn;
        /**
         * Column that represents the results of the search.
         *
         * @since API version 2
         * @return {*}
         */
        resultsColumn(): BrowserResultsColumn;
        /**
         * Value that indicates if the browser is able to audition material in place while browsing.
         *
         * @since API version 2
         * @return {*}
         */
        canAudition(): BooleanValue;
        /**
         * Value that decides if the browser is currently auditioning material in place while browsing or not.
         *
         * @since API version 2
         * @return {*}
         */
        shouldAudition(): SettableBooleanValue;
        /**
         * Selects the next file.
         *
         * @since API version 2
         */
        selectNextFile(): any;
        /**
         * Selects the previous file.
         *
         * @since API version 2
         */
        selectPreviousFile(): any;
        /**
         * Selects the first file.
         *
         * @since API version 2
         */
        selectFirstFile(): any;
        /**
         * Selects the last file.
         *
         * @since API version 2
         */
        selectLastFile(): any;
        /**
         * Cancels the popup browser.
         *
         * @since API version 2
         */
        cancel(): any;
        /**
         * Commits the selected item in the popup browser.
         *
         * @since API version 2
         */
        commit(): any;
    }

    /**
     * This interface is used to store custom controller settings into the Bitwig Studio preferences. The settings
     * are shown to the user in the controller preferences dialog of Bitwig Studio.
     *
     * @since API version 1
     * @class
     */
    interface Preferences extends Settings {}

    /**
     * Instances of this interface are used for browsing presets, including access to all filter columns and the
     * result column as shown in the 'Presets' tab of Bitwig Studio's contextual browser window.
     *
     * @see BrowsingSession
     * @since API version 1
     * @deprecated Use {@link PopupBrowser} instead.
     * @class
     */
    interface PresetBrowsingSession extends BitwigBrowsingSession {
        /**
         * Returns the category filter as shown in the category column of the browser.
         *
         * @return {*} the requested category filter object.
         * @since API version 1
         */
        getCategoryFilter(): BrowserFilterColumn;
        /**
         * Returns the preset type filter as shown in the category column of the browser.
         *
         * @return {*} the requested preset type filter object.
         * @since API version 1
         */
        getPresetTypeFilter(): BrowserFilterColumn;
        /**
         * Returns the file type filter as shown in the category column of the browser.
         *
         * @return {*} the requested file type filter object.
         * @since API version 1
         */
        getFileTypeFilter(): BrowserFilterColumn;
    }

    /**
     * A special kind of device that represents the primary device of a track.
     *
     * @since API version 1
     * @deprecated This is now replaced by creating a named {@link CursorDevice}.
     * @see Track#createCursorDevice(String)
     * @class
     */
    interface PrimaryDevice extends Device {
        /**
         * Makes the device with the given type and location the new primary device.
         *
         * @param {PrimaryDevice.DeviceType} deviceType
         * the requested device type of the new primary device
         * @param {PrimaryDevice.ChainLocation} chainLocation
         * the requested chain location of the new primary device
         * @since API version 1
         */
        switchToDevice(
            deviceType: PrimaryDevice.DeviceType,
            chainLocation: PrimaryDevice.ChainLocation
        ): any;
        /**
         * Registers an observer that reports if navigation to another device with the provided characteristics is
         * possible.
         *
         * @param {PrimaryDevice.DeviceType} deviceType
         * the requested device type of the new primary device
         * @param {PrimaryDevice.ChainLocation} chainLocation
         * the requested chain location of the new primary device
         * @param {*} callback
         * a callback function the receives a single boolean parameter
         * @since API version 1
         * @deprecated This method never did anything. Please do not use.
         */
        addCanSwitchToDeviceObserver(
            deviceType: PrimaryDevice.DeviceType,
            chainLocation: PrimaryDevice.ChainLocation,
            callback: BooleanValueChangedCallback
        ): any;
    }
    namespace PrimaryDevice {
        /**
         * An enum used to navigate the primary device within a device chain.
         *
         * @since API version 1
         * @deprecated
         * @enum
         * @property {PrimaryDevice.ChainLocation} FIRST
         * @property {PrimaryDevice.ChainLocation} NEXT
         * @property {PrimaryDevice.ChainLocation} PREVIOUS
         * @property {PrimaryDevice.ChainLocation} LAST
         * @class
         */
        enum ChainLocation {
            FIRST = 0,
            NEXT = 1,
            PREVIOUS = 2,
            LAST = 3,
        }
        /**
         * An enum used to specify different kinds of devices.
         *
         * @since API version 1
         * @deprecated
         * @enum
         * @property {PrimaryDevice.DeviceType} ANY
         * @class
         */
        enum DeviceType {
            ANY = 0,
        }
    }

    /**
     * An interface for representing the current project.
     *
     * @since API version 1
     * @class
     */
    interface Project extends ObjectProxy {
        /**
         * Returns an object that represents the root track group of the active Bitwig Studio project.
         *
         * @return {*} the root track group of the currently active project
         * @since API version 1
         */
        getRootTrackGroup(): Track;
        /**
         * Returns an object that represents the top level track group as shown in the arranger/mixer of the active
         * Bitwig Studio project.
         *
         * @return {*} the shown top level track group of the currently active project
         * @since API version 1
         */
        getShownTopLevelTrackGroup(): Track;
        /**
         * Creates a new scene (using an existing empty scene if possible) from the clips that are currently
         * playing in the clip launcher.
         *
         * @since API version 1
         */
        createSceneFromPlayingLauncherClips(): any;
    }

    /**
     * Instances of this interface represent numeric values that have an upper and lower limit.
     *
     * @since API version 1
     *
     * @class
     */
    interface RangedValue extends Value<DoubleValueChangedCallback> {
        /**
         * The current value normalized between 0..1 where 0 represents the minimum value and 1 the maximum.
         *
         * @since API version 2
         * @return {number}
         */
        get(): number;
        /**
         * Gets the current value.
         *
         * @since API version 2
         * @return {number}
         */
        getRaw(): number;
        /**
         * Value that represents a formatted text representation of the value whenever the value changes.
         *
         * @since API version 2
         * @return {*}
         */
        displayedValue(): StringValue;
        addValueObserver(callback: DoubleValueChangedCallback, valueWhenUnassigned?: any): any;
        /**
         * Add an observer which receives the internal raw of the parameter as floating point.
         *
         * @param {*} callback
         * a callback function that receives a single numeric parameter with double precision.
         * @since API version 1
         */
        addRawValueObserver(callback: DoubleValueChangedCallback): any;
    }

    /**
     * Instances of this interface are reported to the supplied script callback when connecting to a remote TCP
     * socket via {@link ControllerHost#connectToRemoteHost}.
     *
     * @see {@link ControllerHost#connectToRemoteHost}
     * @since API version 1
     * @class
     */
    interface RemoteConnection {
        /**
         * Disconnects from the remote host.
         *
         * @since API version 1
         */
        disconnect(): any;
        /**
         * Registers a callback function that gets called when the connection gets lost or disconnected.
         *
         * @param {*} callback
         * a callback function that doesn't receive any parameters
         * @since API version 1
         */
        setDisconnectCallback(callback: NoArgsCallback): any;
        /**
         * Sets the callback used for receiving data.
         *
         * The remote connection needs a header for each message sent to it containing a 32-bit big-endian integer
         * saying how big the rest of the message is. The data delivered to the script will not include this
         * header.
         *
         * @param {*} callback
         * a callback function with the signature `(byte[] data)`
         * @since API version 1
         */
        setReceiveCallback(callback: DataReceivedCallback): any;
        /**
         * Sends data to the remote host.
         *
         * @param {Array} data
         * the byte array containing the data to be sent. When creating a numeric byte array in
         * JavaScript, the byte values must be signed (in the range -128..127).
         * @throws IOException
         * @since API version 1
         */
        send(data: number[]): any;
    }

    /**
     * Represents a remote control in Bitwig Studio.
     *
     * @sice API version 2
     * @class
     */
    interface RemoteControl extends Parameter {
        /**
         *
         * @return {*}
         */
        name(): SettableStringValue;
    }

    /**
     * Represents a page of remote controls in a device.
     *
     * @since API version 2
     * @class
     */
    interface RemoteControlsPage extends ParameterBank {
        /**
         *
         * @param {number} indexInBank
         * @return {*}
         */
        getParameter(indexInBank: number): RemoteControl;
        getName(): StringValue;
    }

    /**
     * Instances of this interface represent a TCP socket that other network clients can connect to, typically
     * created by calling {@link ControllerHost#createRemoteConnection}.
     *
     * @see {@link ControllerHost#createRemoteConnection}
     * @since API version 1
     * @class
     */
    interface RemoteSocket {
        /**
         * Sets a callback which receives a remote connection object for each incoming connection.
         *
         * @param {*} callback
         * a callback function which receives a single {@link RemoteConnection} argument
         * @since API version 1
         */
        setClientConnectCallback(callback: ConnectionEstablishedCallback): any;
        /**
         * Gets the actual port used for the remote socket, which might differ from the originally requested port
         * when calling {@link ControllerHost#createRemoteConnection(String name, int port)} in case the requested port was
         * already used.
         *
         * @return {number} the actual port used for the remote socket
         * @since API version 1
         */
        getPort(): number;
    }

    /**
     * Instances of this interface are used for browsing samples, including access to all filter columns and the
     * result column as shown in the 'Samples' tab of Bitwig Studio's contextual browser window.
     *
     * @see BrowsingSession
     * @since API version 1
     * @deprecated Use {@link PopupBrowser} instead.
     * @class
     */
    interface SampleBrowsingSession extends BrowsingSession {
        /**
         * Returns the file type filter as shown in the category column of the browser.
         *
         * @return {*} the requested file type filter object.
         * @since API version 1
         */
        getFileTypeFilter(): BrowserFilterColumn;
    }

    /**
     * Instances of this interface represent scenes in Bitwig Studio.
     *
     * @since API version 1
     * @class
     */
    interface Scene extends ClipLauncherSlotOrScene {
        /**
         * Returns an object that provides access to the name of the scene.
         *
         * @return {*} a string value object that represents the scene name.
         * @since API version 1
         * @deprecated Use {@link #name()} instead.
         */
        getName(): SettableStringValue;
        /**
         * Returns an object that provides access to the name of the scene.
         *
         * @return {*} a string value object that represents the scene name.
         * @since API version 2
         */
        name(): SettableStringValue;
        /**
         * Value that reports the number of clips in the scene.
         *
         * @since API version 2
         * @return {*}
         */
        clipCount(): IntegerValue;
        /**
         * Registers an observer that reports the number of clips in the scene.
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #clipCount()}.addValueObserver(callback).
         */
        addClipCountObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Registers an observer that reports the position of the scene within the list of Bitwig Studio scenes.
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #sceneIndex()} instead.
         */
        addPositionObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Registers an observer that reports if the scene is selected in Bitwig Studio.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter.
         * @since API version 1
         */
        addIsSelectedInEditorObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Selects the scene in Bitwig Studio.
         *
         * @since API version 1
         */
        selectInEditor(): any;
        /**
         * Makes the scene visible in the Bitwig Studio user interface.
         *
         * @since API version 1
         */
        showInEditor(): any;
    }

    /**
     * A scene bank provides access to a range of scenes in Bitwig Studio. Instances of scene bank are configured
     * with a fixed number of scenes and represent an excerpt of a larger list of scenes. Various methods are
     * provided for scrolling to different sections of the scene list. It basically acts like a window moving over
     * the list of underlying scenes.
     *
     * To receive an instance of scene bank call
     * {@link ControllerHost#createSceneBank}.
     *
     * @see {@link ControllerHost#createSceneBank}
     * @since API version 1
     * @class
     */
    interface SceneBank extends ClipLauncherSlotOrSceneBank<Scene> {
        /**
         * Returns the scene at the given index within the bank.
         *
         * @param {number} indexInBank
         * the scene index within this bank, not the index within the list of all Bitwig Studio scenes.
         * Must be in the range [0..sizeOfBank-1].
         * @return {*} the requested scene object
         * @since API version 1
         */
        getScene(indexInBank: number): Scene;
        /**
         * Scrolls the scenes one page up.
         *
         * @since API version 1
         * @deprecated Use {@link #scrollPageBackwards()} instead.
         */
        scrollPageUp(): any;
        /**
         * Scrolls the scenes one page down.
         *
         * @since API version 1
         * @deprecated Use {@link #scrollPageForwards()} instead.
         */
        scrollPageDown(): any;
        /**
         * Scrolls the scenes one scene up.
         *
         * @since API version 1
         * @deprecated Use {@link #scrollBackwards()} instead.
         */
        scrollUp(): any;
        /**
         * Scrolls the scenes one scene down.
         *
         * @since API version 1
         * @deprecated Use {@link #scrollForwards()} instead.
         */
        scrollDown(): any;
        /**
         * Makes the scene with the given position visible in the track bank.
         *
         * @param {number} position
         * the position of the scene within the underlying full list of scenes
         * @since API version 1
         * @deprecated Use {@link #scrollPosition()} instead.
         */
        scrollTo(position: number): any;
        /**
         * Registers an observer that reports the current scene scroll position.
         *
         * @param {*} callback
         * a callback function that takes a single integer parameter
         * @param {number} valueWhenUnassigned
         * the default value that gets reports when the track bank is not yet connected to a Bitwig
         * Studio document
         * @since API version 1
         * @deprecated Use {@link #scrollPosition()} instead
         */
        addScrollPositionObserver(
            callback: IntegerValueChangedCallback,
            valueWhenUnassigned: number
        ): any;
        /**
         * Registers an observer that reports if the scene window can be scrolled further up.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #canScrollBackwards()} instead.
         */
        addCanScrollUpObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the scene window can be scrolled further down.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter
         * @since API version 1
         * @deprecated Use {@link #canScrollForwards()} instead.
         */
        addCanScrollDownObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports the underlying total scene count (not the number of scenes available
         * in the bank window).
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #itemCount()} instead.
         */
        addSceneCountObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Launches the scene with the given bank index.
         *
         * @param {number} indexInWindow
         * the scene index within the bank, not the position of the scene withing the underlying full
         * list of scenes.
         * @since API version 1
         */
        launchScene(indexInWindow: number): any;
    }

    /**
     * Interface for something that can be scrolled.
     *
     * @since API version 2
     * @class
     */
    interface Scrollable {
        /**
         * Value that reports the current scene scroll position.
         *
         * @since API version 2
         * @return {*}
         */
        scrollPosition(): SettableIntegerValue;
        /**
         * Scrolls by a number of steps.
         *
         * @param {number} amount
         * The number of steps to scroll by (positive is forwards and negative is backwards).
         */
        scrollBy(amount: number): any;
        /**
         * Scrolls forwards by one step. This is the same as calling {@link #scrollBy(int)} with 1
         *
         * @since API version 2
         */
        scrollForwards(): any;
        /**
         * Scrolls forwards by one step. This is the same as calling {@link #scrollBy(int)} with -1
         *
         * @since API version 2
         */
        scrollBackwards(): any;
        /**
         * Scrolls by a number of pages.
         *
         * @param {number} amount
         * The number of pages to scroll by (positive is forwards and negative is backwards).
         */
        scrollByPages(amount: number): any;
        /**
         * Scrolls forwards by one page.
         *
         * @since API version 2
         */
        scrollPageForwards(): any;
        /**
         * Scrolls backwards by one page.
         *
         * @since API version 2
         */
        scrollPageBackwards(): any;
        /**
         * Value that reports if it is possible to scroll the bank backwards or not.
         *
         * @since API version 2
         * @return {*}
         */
        canScrollBackwards(): BooleanValue;
        /**
         * Value that reports if it is possible to scroll the bank forwards or not.
         *
         * @since API version 2
         * @return {*}
         */
        canScrollForwards(): BooleanValue;
    }

    interface Send extends Parameter {
        /**
         * Value that reports the color of the channel that this send sends to.
         *
         * @since API version 2
         * @return {*}
         */
        sendChannelColor(): SettableColorValue;
    }

    interface SendBank extends Bank<Send> {}

    interface SettableBeatTimeValue extends BeatTimeValue, SettableDoubleValue {
        /**
         * The same as the set method.
         *
         * @deprecated This is included only for backwards compatibility with API version 1 where this inherited
         * from {@link RangedValue} instead of {@link DoubleValue}.
         * @param {number} value
         */
        setRaw(value: number): any;
        /**
         * The same as the inc method.
         *
         * @deprecated This is included only for backwards compatibility with API version 1 where this inherited
         * from {@link RangedValue} instead of {@link DoubleValue}.
         * @param {number} amount
         */
        incRaw(amount: number): any;
    }

    /**
     * Instances of this interface represent boolean values.
     *
     * @since API version 1
     * @class
     */
    interface SettableBooleanValue extends BooleanValue {
        /**
         * Sets the internal value.
         *
         * @param {boolean} value
         * the new boolean value.
         * @since API version 1
         */
        set(value: boolean): any;
        toggle(exclusive?: any): any;
    }

    interface SettableColorValue extends ColorValue {
        /**
         * Sets the internal value.
         *
         * @since API version 5
         * @param {number} red
         * @param {number} green
         * @param {number} blue
         * @param {number} alpha
         */
        set(red?: any, green?: any, blue?: any, alpha?: any): any;
    }

    interface SettableDoubleValue extends DoubleValue {
        /**
         * Sets the internal value.
         *
         * @param {number} value
         * the new integer value.
         * @since API version 1
         */
        set(value: number): any;
        /**
         * Increases/decrease the internal value by the given amount.
         *
         * @param {number} amount
         * the integer amount to increase
         * @since API version 1
         */
        inc(amount: number): any;
    }

    /**
     * Instances of this interface represent enumeration values. Enum values work similar to string values, but
     * are limited to a fixed set of value options.
     *
     * @since API version 1
     * @class
     */
    interface SettableEnumValue extends EnumValue {
        /**
         * Sets the value to the enumeration item with the given name.
         *
         * @param name
         * the name of the new enum item
         * @since API version 1
         * @param {string} value
         */
        set(value: string): any;
    }

    /**
     * Instances of this interface represent integer values.
     *
     * @since API version 1
     * @class
     */
    interface SettableIntegerValue extends IntegerValue {
        /**
         * Sets the internal value.
         *
         * @param {number} value
         * the new integer value.
         * @since API version 1
         */
        set(value: number): any;
        /**
         * Increases/decrease the internal value by the given amount.
         *
         * @param {number} amount
         * the integer amount to increase
         * @since API version 1
         */
        inc(amount: number): any;
    }

    /**
     * Instances of this interface represent numeric values that have an upper and lower limit.
     *
     * @since API version 1
     * @class
     */
    interface SettableRangedValue extends RangedValue {
        /**
         * Sets the value in an absolute fashion as a value between 0 .. 1 where 0 represents the minimum value and
         * 1 the maximum. The value change is applied immediately and does not care about what take over mode the
         * user has selected. This is useful if the value does not need take over (e.g. a motorized slider).
         *
         * @param {number} value
         * absolute value [0 .. 1]
         *
         * @since API version 4
         */
        setImmediately(value: number): any;
        /**
         * Sets the value in an absolute fashion. The value will be scaled according to the given resolution.
         *
         * Typically the resolution would be specified as the amount of steps the hardware control provides (for
         * example 128) and just pass the integer value as it comes from the MIDI device. The host application will
         * take care of scaling it.
         *
         * @param {number} value
         * integer number in the range [0 .. resolution-1]
         * @param {number} resolution
         * the resolution used for scaling @ if passed-in parameters are null
         * @since API version 1
         */
        set(value?: any, resolution?: any): any;
        /**
         * Increments or decrements the value according to the given increment and resolution parameters.
         *
         * Typically the resolution would be specified as the amount of steps the hardware control provides (for
         * example 128) and just pass the integer value as it comes from the MIDI device. The host application will
         * take care of scaling it.
         *
         * @param {number} increment
         * the amount that the current value is increased by
         * @param {number} resolution
         * the resolution used for scaling
         * @since API version 1
         */
        inc(increment?: any, resolution?: any): any;
        /**
         * Set the internal (raw) value.
         *
         * @param {number} value
         * the new value with double precision. Range is undefined.
         * @since API version 1
         */
        setRaw(value: number): any;
        /**
         * Increments / decrements the internal (raw) value.
         *
         * @param {number} delta
         * the amount that the current internal value get increased by.
         * @since API version 1
         */
        incRaw(delta: number): any;
    }

    /**
     * @since API version 2
     * @class
     */
    interface SettableStringArrayValue extends StringArrayValue {
        /**
         * Sets the internal value.
         *
         * @param {Array} value
         * the new value.
         * @since API version 2
         */
        set(value: string[]): any;
    }

    /**
     * Instances of this interface implement the {@link Value} interface for string values.
     *
     * @since API version 1
     * @class
     */
    interface SettableStringValue extends StringValue {
        /**
         * Sets the value object to the given string.
         *
         * @param {string} value
         * the new value string
         * @since API version 1
         */
        set(value: string): any;
    }

    /**
     * A common base interface for labeled and categorized settings.
     *
     * @since API version 1
     * @class
     */
    interface Setting {
        /**
         * Returns the category name of the setting.
         *
         * @return {string} a string value containing the category name
         * @since API version 1
         */
        getCategory(): string;
        /**
         * Returns the label text of the setting.
         *
         * @return {string} a string value containing the label text
         * @since API version 1
         */
        getLabel(): string;
        /**
         * Marks the settings as enabled in Bitwig Studio. By default the setting is enabled.
         *
         * @since API version 1
         */
        enable(): any;
        /**
         * Marks the settings as disabled in Bitwig Studio. By default the setting is enabled.
         *
         * @since API version 1
         */
        disable(): any;
        /**
         * Shows the setting in Bitwig Studio. By default the setting is shown.
         *
         * @since API version 1
         */
        show(): any;
        /**
         * Hides the setting in Bitwig Studio. By default the setting is shown.
         *
         * @since API version 1
         */
        hide(): any;
    }

    /**
     * This interface builds the foundation for storing custom settings in Bitwig Studio documents or in the
     * Bitwig Studio preferences.
     *
     * @since API version 1
     * @class
     */
    interface Settings {
        /**
         * Returns a signal setting object, which is shown a push button with the given label in Bitwig Studio.
         *
         * @param {string} label
         * the name of the setting, must not be `null`
         * @param {string} category
         * the name of the category, may not be `null`
         * @param {string} action
         * the action string as displayed on the related Bitwig Studio button, must not be `null`
         * @return {*} the object that encapsulates the requested signal
         * @ @since API version 1
         */
        getSignalSetting(label: string, category: string, action: string): Signal;
        /**
         * Returns a numeric setting that is shown a number field in Bitwig Studio.
         *
         * @param {string} label
         * the name of the setting, must not be `null`
         * @param {string} category
         * the name of the category, may not be `null`
         * @param {number} minValue
         * the minimum value that the user is allowed to enter
         * @param {number} maxValue
         * the minimum value that the user is allowed to enter
         * @param {number} stepResolution
         * the step resolution used for the number field
         * @param {string} unit
         * the string that should be used to display the unit of the number
         * @param {number} initialValue
         * the initial numeric value of the setting
         * @return {*} the object that encapsulates the requested numeric setting
         * @ @since API version 1
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
         * @param {string} label
         * the name of the setting, must not be `null`
         * @param {string} category
         * the name of the category, may not be `null`
         * @param {Array} options
         * the string array that defines the allowed options for the button group or chooser
         * @param {string} initialValue
         * the initial string value, must be one of the items specified with the option argument
         * @return {*} the object that encapsulates the requested enum setting
         * @ @since API version 1
         */
        getEnumSetting(
            label: string,
            category: string,
            options: string[],
            initialValue: string
        ): SettableEnumValue;
        /**
         * Returns a textual setting that is shown as a text field in the Bitwig Studio user interface.
         *
         * @param {string} label
         * the name of the setting, must not be `null`
         * @param {string} category
         * the name of the category, may not be `null`
         * @param {number} numChars
         * the maximum number of character used for the text value
         * @param {string} initialText
         * the initial text value of the setting
         * @return {*} the object that encapsulates the requested string setting
         * @ @since API version 1
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
         * @param {string} label
         * the name of the setting, must not be `null`
         * @param {string} category
         * the name of the category, may not be `null`
         * @param {Color} initialColor
         * the initial color value of the setting
         * @return {*} the object that encapsulates the requested string setting
         * @since API version 5
         */
        getColorSetting(label: string, category: string, initialColor: Color): SettableColorValue;
    }

    /**
     * A generic interface used to implement actions or events that are not associated with a value.
     *
     * @since API version 1
     * @class
     */
    interface Signal {
        /**
         * Registers an observer that gets notified when the signal gets fired.
         *
         * @param {*} callback
         * a callback function that does not receive any argument.
         * @since API version 1
         */
        addSignalObserver(callback: NoArgsCallback): any;
        /**
         * Fires the action or event represented by the signal object.
         *
         * @since API version 1
         */
        fire(): any;
    }

    /**
     * Instances of this interface represent the state of a solo button.
     *
     * @since API version 1
     * @class
     */
    interface SoloValue extends SettableBooleanValue {
        /**
         * Toggles the current solo state.
         *
         * @param {boolean} exclusive
         * specifies if solo on other channels should be disabled automatically ('true') or not
         * ('false').
         * @since API version 1
         */
        toggle(exclusive?: any): any;
    }

    /**
     * Instance of this class represent sources selectors in Bitwig Studio, which are shown as choosers in the
     * user interface and contain entries for either note inputs or audio inputs or both.
     *
     * The most prominent source selector in Bitwig Studio is the one shown in the track IO section, which can be
     * accessed via the API by calling {@link Track#getSourceSelector()}.
     *
     * @since API version 1
     * @class
     */
    interface SourceSelector extends ObjectProxy {
        /**
         * Returns an object that indicates if the source selector has note inputs enabled.
         *
         * @return {*} a boolean value object
         * @since API version 1
         * @deprecated Use {@link #hasNoteInputSelected()} instead.
         */
        getHasNoteInputSelected(): SettableBooleanValue;
        /**
         * Returns an object that indicates if the source selector has note inputs enabled.
         *
         * @return {*} a boolean value object
         * @since API version 5
         */
        hasNoteInputSelected(): SettableBooleanValue;
        /**
         * Returns an object that indicates if the source selector has audio inputs enabled.
         *
         * @return {*} a boolean value object
         * @since API version 1
         * @deprecated Use {@link #hasAudioInputSelected()} instead.
         */
        getHasAudioInputSelected(): SettableBooleanValue;
        /**
         * Returns an object that indicates if the source selector has audio inputs enabled.
         *
         * @return {*} a boolean value object
         * @since API version 5
         */
        hasAudioInputSelected(): SettableBooleanValue;
    }

    /**
     * @since API version 2
     * @class
     */
    interface StringArrayValue extends ObjectArrayValue<string> {
        get(index?: any): any;
    }

    interface StringValue extends Value<StringValueChangedCallback> {
        /**
         * Gets the current value.
         *
         * @since API version 2
         * @return {string}
         */
        get(): string;
        /**
         * Gets the current value and tries to intelligently limit it to the supplied length in the best way
         * possible.
         *
         * @since API version 2
         * @param {number} maxLength
         * @return {string}
         */
        getLimited(maxLength: number): string;
    }

    /**
     * Interface for an object that can be 'subscribed' or not. A subscribed object will notify any observers when
     * changes occur to it. When it is unsubscribed the observers will no longer be notified. A driver can use
     * this to say which objects it is interested in and which ones it is not (for example in one mode the driver
     * may not be interested in track meters) at runtime. This allows the driver to improve efficiency by only
     * getting notified about changes that are really relevant to it. By default a driver is subscribed to
     * everything.
     *
     * @since API version 2
     * @class
     */
    interface Subscribable {
        /**
         * Determines if this object is currently 'subscribed'. In the subscribed state it will notify any
         * observers registered on it.
         * @return {boolean}
         */
        isSubscribed(): boolean;
        /**
         * Sets whether the driver currently considers this object 'active' or not.
         * @param {boolean} value
         */
        setIsSubscribed(value: boolean): any;
        /**
         * Subscribes the driver to this object. This is equivalent to calling {@link #setIsSubscribed(boolean)}
         * with true.
         */
        subscribe(): any;
        /**
         * Unsubscribes the driver from this object. This is equivalent to calling {@link #setIsSubscribed(boolean)}
         * with false.
         */
        unsubscribe(): any;
    }

    /**
     * Instances of this interface represent time signature values.
     *
     * @since API version 1
     * @class
     */
    interface TimeSignatureValue extends Value<StringValueChangedCallback> {
        /**
         * Gets the current value.
         *
         * @since API version 2
         * @return {string}
         */
        get(): string;
        /**
         * Updates the time signature according to the given string.
         *
         * @param {string} name
         * a textual representation of the new time signature value, formatted as
         * `numerator/denominator[, ticks]`
         * @since API version 1
         */
        set(name: string): any;
        /**
         * Returns an object that provides access to the time signature numerator.
         *
         * @return {*} an integer value object that represents the time signature numerator.
         * @since API version 1
         * @deprecated Use {@link #numerator()} instead.
         */
        getNumerator(): SettableIntegerValue;
        /**
         * Returns an object that provides access to the time signature numerator.
         *
         * @return {*} an integer value object that represents the time signature numerator.
         * @since API version 5
         */
        numerator(): SettableIntegerValue;
        /**
         * Returns an object that provides access to the time signature denominator.
         *
         * @return {*} an integer value object that represents the time signature denominator.
         * @since API version 1
         * @deprecated Use {@link #denominator()} instead.
         */
        getDenominator(): SettableIntegerValue;
        /**
         * Returns an object that provides access to the time signature denominator.
         *
         * @return {*} an integer value object that represents the time signature denominator.
         * @since API version 5
         */
        denominator(): SettableIntegerValue;
        /**
         * Returns an object that provides access to the time signature tick subdivisions.
         *
         * @return {*} an integer value object that represents the time signature ticks.
         * @since API version 1
         * @deprecated Use {@link #ticks()} instead.
         */
        getTicks(): SettableIntegerValue;
        /**
         * Returns an object that provides access to the time signature tick subdivisions.
         *
         * @return {*} an integer value object that represents the time signature ticks.
         * @since API version 5
         */
        ticks(): SettableIntegerValue;
    }

    /**
     * Instances of this interface represent tracks in Bitwig Studio.
     *
     * @since API version 1
     * @class
     */
    interface Track extends Channel {
        /**
         * Value that reports the position of the track within the list of Bitwig Studio tracks.
         *
         * @since API version 2
         * @return {*}
         */
        position(): IntegerValue;
        /**
         * Registers an observer that reports the position of the track within the list of Bitwig Studio tracks.
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #position()} instead.
         */
        addPositionObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Returns an object that can be used to access the clip launcher slots of the track.
         *
         * @return {*} an object that represents the clip launcher slots of the track
         * @since API version 1
         * @deprecated Use {@link #clipLauncherSlotBank()} instead.
         */
        getClipLauncherSlots(): ClipLauncherSlotBank;
        /**
         * Returns an object that can be used to access the clip launcher slots of the track.
         *
         * @return {*} an object that represents the clip launcher slots of the track
         * @since API version 2
         */
        clipLauncherSlotBank(): ClipLauncherSlotBank;
        /**
         * @deprecated Use {@link #getClipLauncherSlots()} instead.
         * @since API version 1
         * @return {*}
         */
        getClipLauncher(): ClipLauncherSlotBank;
        /**
         * Registers an observer that reports if the clip launcher slots are queued for stop.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument.
         * @since API version 1
         * @deprecated Use {@link #isQueuedForStop()} instead.
         */
        addIsQueuedForStopObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Returns an object that provides access to the arm state of the track.
         *
         * @return {*} a boolean value object
         * @since API version 1
         * @deprecated Use {@link #arm()} instead.
         */
        getArm(): SettableBooleanValue;
        /**
         * Returns an object that provides access to the arm state of the track.
         *
         * @return {*} a boolean value object
         * @since API version 5
         */
        arm(): SettableBooleanValue;
        /**
         * Returns an object that provides access to the monitoring state of the track.
         *
         * @return {*} a boolean value object
         * @since API version 1
         * @deprecated Use {@link #monitor()} instead.
         */
        getMonitor(): SettableBooleanValue;
        /**
         * Returns an object that provides access to the monitoring state of the track.
         *
         * @return {*} a boolean value object
         * @since API version 5
         */
        monitor(): SettableBooleanValue;
        /**
         * Returns an object that provides access to the auto-monitoring state of the track.
         *
         * @return {*} a boolean value object
         * @since API version 1
         * @deprecated Use {@link #autoMonitor()} instead.
         */
        getAutoMonitor(): SettableBooleanValue;
        /**
         * Returns an object that provides access to the auto-monitoring state of the track.
         *
         * @return {*} a boolean value object
         * @since API version 5
         */
        autoMonitor(): SettableBooleanValue;
        /**
         * Returns an object that provides access to the cross-fade mode of the track.
         *
         * @return {*} an enum value object that has three possible states: "A", "B", or "AB"
         * @since API version 1
         * @deprecated Use {@link #crossFadeMode()} instead.
         */
        getCrossFadeMode(): SettableEnumValue;
        /**
         * Returns an object that provides access to the cross-fade mode of the track.
         *
         * @return {*} an enum value object that has three possible states: "A", "B", or "AB"
         * @since API version 5
         */
        crossFadeMode(): SettableEnumValue;
        /**
         * Value that reports if this track is currently stopped. When a track is stopped it is not playing content
         * from the arranger or clip launcher.
         *
         * @since API version 2
         * @return {*}
         */
        isStopped(): BooleanValue;
        /**
         * Returns a value object that provides access to the clip launcher playback state of the track.
         *
         * @return {*} a boolean value object that indicates if the clip launcher is stopped for this track
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
         * @return {*} a boolean value object that indicates if the clip launcher slots have been queued for stop
         * @see #getIsMatrixStopped()
         * @since API version 1
         * @deprecated Use {@link #isQueuedForStop()} instead.
         */
        getIsMatrixQueuedForStop(): BooleanValue;
        /**
         * Value that reports if the clip launcher slots are queued for stop.
         *
         * @since API version 2
         * @return {*}
         */
        isQueuedForStop(): BooleanValue;
        /**
         * Returns the source selector for the track, which is shown in the IO section of the track in Bitwig
         * Studio and lists either note or audio sources or both depending on the track type.
         *
         * @return {*} a source selector object
         * @since API version 1
         * @deprecated Use {@link #sourceSelector()} instead.
         */
        getSourceSelector(): SourceSelector;
        /**
         * Returns the source selector for the track, which is shown in the IO section of the track in Bitwig
         * Studio and lists either note or audio sources or both depending on the track type.
         *
         * @return {*} a source selector object
         * @since API version 5
         */
        sourceSelector(): SourceSelector;
        /**
         * Stops playback of the track.
         *
         * @since API version 1
         */
        stop(): any;
        /**
         * Calling this method causes the arrangement sequencer to take over playback.
         *
         * @since API version 1
         */
        returnToArrangement(): any;
        /**
         * Updates the name of the track.
         *
         * @param {string} name
         * the new track name
         * @since API version 1
         */
        setName(name: string): any;
        /**
         * Registers an observer that reports names for note key values on this track. The track might provide
         * special names for certain keys if it contains instruments that support that features, such as the Bitwig
         * Drum Machine.
         *
         * @param {*} callback
         * a callback function that receives two arguments: 1. the key value in the range [0..127], and
         * 2. the name string
         * @since API version 1
         */
        addPitchNamesObserver(callback: IndexedStringValueChangedCallback): any;
        /**
         * Plays a note on the track with a default duration and the given key and velocity.
         *
         * @param {number} key
         * the key value of the played note
         * @param {number} velocity
         * the velocity of the played note
         * @since API version 1
         */
        playNote(key: number, velocity: number): any;
        /**
         * Starts playing a note on the track with the given key and velocity.
         *
         * @param {number} key
         * the key value of the played note
         * @param {number} velocity
         * the velocity of the played note
         * @since API version 1
         */
        startNote(key: number, velocity: number): any;
        /**
         * Stops playing a currently played note.
         *
         * @param {number} key
         * the key value of the playing note
         * @param {number} velocity
         * the note-off velocity
         * @since API version 1
         */
        stopNote(key: number, velocity: number): any;
        /**
         * Sends a MIDI message to the hardware device.
         *
         * @param {number} status
         * the status byte of the MIDI message
         * @param {number} data1
         * the data1 part of the MIDI message
         * @param {number} data2
         * the data2 part of the MIDI message
         * @ @since API version 2
         */
        sendMidi(status: number, data1: number, data2: number): any;
        /**
         * Value that reports the track type. Possible reported track types are `Group`, `Instrument`, `Audio`,
         * `Hybrid`, `Effect` or `Master`.
         *
         * @since API version 2
         * @return {*}
         */
        trackType(): StringValue;
        /**
         * Registers an observer that reports the track type. Possible reported track types are `Group`,
         * `Instrument`, `Audio`, `Hybrid`, `Effect` or `Master`.
         *
         * @param {number} numChars
         * the maximum number of characters used for the reported track type
         * @param {string} textWhenUnassigned
         * the default text that gets reported when the track is not yet associated with a Bitwig Studio
         * track.
         * @param {*} callback
         * a callback function that receives a single track type parameter (string).
         * @since API version 1
         * @deprecated Use {@link #trackType()} instead.
         */
        addTrackTypeObserver(
            numChars: number,
            textWhenUnassigned: string,
            callback: StringValueChangedCallback
        ): any;
        /**
         * Value that reports if the track may contain child tracks, which is the case for group tracks.
         *
         * @since API version 2
         * @return {*}
         */
        isGroup(): BooleanValue;
        /**
         * Registers an observer that reports if the track may contain child tracks, which is the case for group
         * tracks.
         *
         * @param {*} callback
         * a callback function that receives a single boolean parameter.
         * @since API version 1
         * @deprecated Use {@link #isGroup()} instead.
         */
        addIsGroupObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Returns an object that indicates if the track may contain notes.
         *
         * @return {*} a boolean value object
         * @since API version 1
         * @deprecated Use {@link #canHoldNoteData()} instead.
         */
        getCanHoldNoteData(): SettableBooleanValue;
        /**
         * Returns an object that indicates if the track may contain notes.
         *
         * @return {*} a boolean value object
         * @since API version 5
         */
        canHoldNoteData(): SettableBooleanValue;
        /**
         * Returns an object that indicates if the track may contain audio events.
         *
         * @return {*} a boolean value object
         * @since API version 1
         * @deprecated Use {@link #canHoldAudioData()} instead.
         */
        getCanHoldAudioData(): SettableBooleanValue;
        /**
         * Returns an object that indicates if the track may contain audio events.
         *
         * @return {*} a boolean value object
         * @since API version 5
         */
        canHoldAudioData(): SettableBooleanValue;
        createCursorDevice(id?: any, name?: any, numSends?: any, followMode?: any): any;
        /**
         * Gets the channels primary device.
         *
         * @return {*} an object that provides access to the channels primary device.
         * @deprecated Use {@link #createCursorDevice(String) createCursorDevice("Primary")} instead.
         * @since API version 1
         */
        getPrimaryDevice(): Device;
        /**
         * @deprecated Use {@link #createCursorDevice(String) createCursorDevice("Primary")} instead.
         * @since API version 1
         * @return {*}
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
         * @param {number} numTracks
         * the number of child tracks spanned by the track bank
         * @param {number} numSends
         * the number of sends spanned by the track bank
         * @param {number} numScenes
         * the number of scenes spanned by the track bank
         * @param {boolean} hasFlatTrackList
         * specifies whether the track bank should operate on a flat list of all nested child tracks or
         * only on the direct child tracks of the connected group track.
         * @return {*} an object for bank-wise navigation of tracks, sends and scenes
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
         * @param {number} numTracks
         * the number of child tracks spanned by the track bank
         * @param {number} numSends
         * the number of sends spanned by the track bank
         * @param {number} numScenes
         * the number of scenes spanned by the track bank
         * @param {boolean} hasFlatTrackList
         * specifies whether the track bank should operate on a flat list of all nested child tracks or
         * only on the direct child tracks of the connected group track.
         * @return {*} an object for bank-wise navigation of tracks, sends and scenes
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
         * @param {number} numTracks
         * the number of child tracks spanned by the track bank
         * @param {number} numScenes
         * the number of scenes spanned by the track bank
         * @param {boolean} hasFlatTrackList
         * specifies whether the track bank should operate on a flat list of all nested child tracks or
         * only on the direct child tracks of the connected group track.
         * @return {*} an object for bank-wise navigation of tracks, sends and scenes
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
         * Returns an object that represents the master track of the connected track group. The returned object
         * will only have content if the connected track is a group track.
         *
         * @param {number} numScenes
         * the number of scenes for bank-wise navigation of the master tracks clip launcher slots.
         * @return {*} an object representing the master track of the connected track group.
         * @since API version 1
         */
        createMasterTrack(numScenes: number): MasterTrack;
        /**
         * Returns a bank of sibling tracks with the given number of tracks, sends and scenes. For more information
         * about track banks and the `bank pattern` in general, see the documentation for {@link #createTrackBank}.
         *
         * @param {number} numTracks
         * the number of child tracks spanned by the track bank
         * @param {number} numSends
         * the number of sends spanned by the track bank
         * @param {number} numScenes
         * the number of scenes spanned by the track bank
         * @param {boolean} shouldIncludeEffectTracks
         * specifies whether effect tracks should be included
         * @param {boolean} shouldIncludeMasterTrack
         * specifies whether the master should be included
         * @return {*} an object for bank-wise navigation of sibling tracks
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
    }

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
     * @class
     */
    interface TrackBank extends ChannelBank<Track> {
        /**
         * @deprecated use {@link #getChannel(int)} instead.
         * @since API version 1
         * @param {number} indexInBank
         * @return {*}
         */
        getTrack(indexInBank: number): Track;
        /**
         * Returns the track at the given index within the bank.
         *
         * @param {number} indexInBank
         * the track index within this bank, not the index within the list of all Bitwig Studio tracks.
         * Must be in the range [0..sizeOfBank-1].
         * @return {*} the requested track object
         * @since API version 1
         * @deprecated Use {@link #getItemAt(int)} instead.
         */
        getChannel(indexInBank: number): Track;
        /**
         * @deprecated use {@link #setChannelScrollStepSize(int)} instead.
         * @param {number} stepSize
         */
        setTrackScrollStepSize(stepSize: number): any;
        /**
         * @deprecated use {@link #scrollChannelsPageUp()} instead.
         */
        scrollTracksPageUp(): any;
        /**
         * @deprecated use {@link #scrollChannelsPageDown()} instead.
         */
        scrollTracksPageDown(): any;
        /**
         * @deprecated use {@link #scrollChannelsUp()} instead.
         */
        scrollTracksUp(): any;
        /**
         * @deprecated use {@link #scrollChannelsDown()} instead.
         */
        scrollTracksDown(): any;
        /**
         * @deprecated use {@link #scrollToChannel(int)} instead.
         * @param {number} position
         */
        scrollToTrack(position: number): any;
        /**
         * @deprecated use {@link #addChannelScrollPositionObserver(Callable, int)} instead.
         * @param {*} callback
         * @param {number} valueWhenUnassigned
         */
        addTrackScrollPositionObserver(
            callback: IntegerValueChangedCallback,
            valueWhenUnassigned: number
        ): any;
        /**
         * {@link SceneBank} that represents a view on the scenes in this {@link TrackBank}.
         *
         * @since API version 2
         * @return {*}
         */
        sceneBank(): SceneBank;
        /**
         * Scrolls the scenes one page up.
         *
         * @since API version 1
         * @deprecated Use {@link #sceneBank()} instead.
         */
        scrollScenesPageUp(): any;
        /**
         * Scrolls the scenes one page down.
         *
         * @since API version 1
         */
        scrollScenesPageDown(): any;
        /**
         * Scrolls the scenes one step up.
         *
         * @since API version 1
         * @deprecated Use {@link #sceneBank()} instead.
         */
        scrollScenesUp(): any;
        /**
         * Scrolls the scenes one step down.
         *
         * @since API version 1
         * @deprecated Use {@link #sceneBank()} instead.
         */
        scrollScenesDown(): any;
        /**
         * Makes the scene with the given position visible in the track bank.
         *
         * @param {number} position
         * the position of the scene within the underlying full list of scenes
         * @since API version 1
         * @deprecated Use {@link #sceneBank()} instead.
         */
        scrollToScene(position: number): any;
        /**
         * Registers an observer that reports the current scene scroll position.
         *
         * @param {*} callback
         * a callback function that takes a single integer parameter
         * @param {number} valueWhenUnassigned
         * the default value that gets reports when the track bank is not yet connected to a Bitwig
         * Studio document
         * @since API version 1
         * @deprecated Use {@link #sceneBank()} instead.
         */
        addSceneScrollPositionObserver(
            callback: IntegerValueChangedCallback,
            valueWhenUnassigned: number
        ): any;
        /**
         * @deprecated use {@link #canScrollChannelsUp()} instead.
         * @param {*} callback
         */
        addCanScrollTracksUpObserver(callback: BooleanValueChangedCallback): any;
        /**
         * @deprecated use {@link #canScrollChannelsDown()} instead.
         * @param {*} callback
         */
        addCanScrollTracksDownObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the scene window can be scrolled further up.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter
         * @since API version 1
         *
         * @deprecated use {@link #canScrollScenesUp()} instead.
         */
        addCanScrollScenesUpObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports if the scene window can be scrolled further down.
         *
         * @param {*} callback
         * a callback function that takes a single boolean parameter
         * @since API version 1
         *
         * @deprecated use {@link #canScrollScenesDown()} instead.
         */
        addCanScrollScenesDownObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Registers an observer that reports the underlying total scene count (not the number of scenes available
         * in the bank window).
         *
         * @param {*} callback
         * a callback function that receives a single integer parameter
         * @since API version 1
         * @deprecated Use {@link #sceneBank().itemCount().addValueObserver()}
         */
        addSceneCountObserver(callback: IntegerValueChangedCallback): any;
        /**
         * Returns an object that provides access to the clip launcher scenes of the track bank.
         *
         * @return {*} an object that provides access to the clip launcher scenes of the track bank.
         * @since API version 1
         * @deprecated Use {@link #sceneBank()} instead.
         */
        getClipLauncherScenes(): ClipLauncherSlotOrSceneBank<any>;
        /**
         * Launches the scene with the given bank index.
         *
         * @param {number} indexInWindow
         * the scene index within the bank, not the position of the scene withing the underlying full
         * list of scenes.
         * @since API version 1
         * @deprecated Use {@link #sceneBank()} instead.
         */
        launchScene(indexInWindow: number): any;
        /**
         * Causes this bank to follow the supplied cursor. When the cursor moves to a new item the bank will be
         * scrolled so that the cursor is within the bank, if possible.
         *
         * @param {*} cursorTrack
         * The {@link CursorTrack} that this bank should follow.
         *
         * @since API version 2
         */
        followCursorTrack(cursorTrack: CursorTrack): any;
    }

    /**
     * An interface representing the transport section in Bitwig Studio.
     *
     * @since API version 1
     * @class
     */
    interface Transport extends ObjectProxy {
        /**
         * Starts playback in the Bitwig Studio transport.
         *
         * @since API version 1
         */
        play(): any;
        /**
         * Stops playback in the Bitwig Studio transport.
         *
         * @since API version 1
         */
        stop(): any;
        /**
         * Toggles the transport playback state between playing and stopped.
         *
         * @since API version 1
         */
        togglePlay(): any;
        /**
         * When the transport is stopped, calling this function starts transport playback, otherwise the transport
         * is first stopped and the playback is restarted from the last play-start position.
         *
         * @since API version 1
         */
        restart(): any;
        /**
         * Starts recording in the Bitwig Studio transport.
         *
         * @since API version 1
         */
        record(): any;
        /**
         * Rewinds the Bitwig Studio transport to the beginning of the arrangement.
         *
         * @since API version 1
         */
        rewind(): any;
        /**
         * Calling this function is equivalent to pressing the fast forward button in the Bitwig Studio transport.
         *
         * @since API version 1
         */
        fastForward(): any;
        /**
         * When calling this function multiple times, the timing of those calls gets evaluated and causes
         * adjustments to the project tempo.
         *
         * @since API version 1
         */
        tapTempo(): any;
        /**
         * Value that reports if the Bitwig Studio transport is playing.
         *
         * @since API version 2
         * @return {*}
         */
        isPlaying(): SettableBooleanValue;
        /**
         * Registers an observer that reports if the Bitwig Studio transport is playing.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` if playing, `false`
         * otherwise).
         * @since API version 1
         * @deprecated Use {@link #isPlaying()} instead.
         */
        addIsPlayingObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if the Bitwig Studio transport is recording.
         *
         * @since API version 2
         * @return {*}
         */
        isArrangerRecordEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if the Bitwig Studio transport is recording.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` if recording, `false`
         * otherwise).
         * @since API version 1
         * @deprecated Use {@link #isArrangerRecordEnabled()} instead.
         */
        addIsRecordingObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if overdubbing is enabled in Bitwig Studio.
         *
         * @since API version 2
         * @return {*}
         */
        isArrangerOverdubEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if over-dubbing is enabled in Bitwig Studio.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` if over-dubbing is
         * enabled, `false` otherwise).
         * @since API version 1
         * @deprecated Use {@link #isArrangerOverdubEnabled()} instead.
         */
        addOverdubObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value reports if clip launcher overdubbing is enabled in Bitwig Studio.
         *
         * @since API version 2
         * @return {*}
         */
        isClipLauncherOverdubEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if clip launcher over-dubbing is enabled in Bitwig Studio.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` if clip launcher
         * over-dubbing is enabled, `false` otherwise).
         * @since API version 1
         * @deprecated Use {@link #isClipLauncherOverdubEnabled()} instead.
         */
        addLauncherOverdubObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports the current automation write mode. Possible values are `"latch"`, `"touch"` or
         * `"write"`.
         *
         * @since API version 2
         * @return {*}
         */
        automationWriteMode(): SettableEnumValue;
        /**
         * Registers an observer that reports the current automation write mode.
         *
         * @param {*} callback
         * a callback function that receives a single string argument. Possible values are `"latch"`,
         * `"touch"` or `"write"`.
         * @since API version 1
         * @deprecated Use {@link #automationWriteMode()} instead.
         */
        addAutomationWriteModeObserver(callback: EnumValueChangedCallback): any;
        /**
         * Value that reports if automation write is currently enabled for the arranger.
         *
         * @since API version 2
         * @return {*}
         */
        isArrangerAutomationWriteEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if Bitwig Studio is currently writing arranger automation.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` when arranger automation
         * write is enabled, `false` otherwise).
         * @since API version 1
         * @deprecated Use {@link #isArrangerAutomationWriteEnabled()} instead.
         */
        addIsWritingArrangerAutomationObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if automation write is currently enabled on the clip launcher.
         *
         * @since API version 2
         * @return {*}
         */
        isClipLauncherAutomationWriteEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if Bitwig Studio is currently writing clip launcher automation.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` when clip launcher
         * automation write is enabled, `false` otherwise).
         * @since API version 1
         * @deprecated Use {@link #isClipLauncherAutomationWriteEnabled()} instead.
         */
        addIsWritingClipLauncherAutomationObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that indicates if automation override is currently on.
         *
         * @since API version 2
         * @return {*}
         */
        isAutomationOverrideActive(): BooleanValue;
        /**
         * Registers an observer that reports if automation is overridden in Bitwig Studio.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` if overridden, `false`
         * otherwise).
         * @since API version 1
         * @deprecated Use {@link #isAutomationOverrideActive()}.addValueObserver(callback)
         */
        addAutomationOverrideObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that indicates if the loop is currently active or not.
         *
         * @since API version 2
         * @return {*}
         */
        isArrangerLoopEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if arranger looping is enabled in Bitwig Studio.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` when enabled, `false`
         * otherwise).
         * @since API version 1
         * @deprecated Use {@link #isArrangerLoopEnabled()}.addValueObserver(callback)
         */
        addIsLoopActiveObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if punch-in is enabled in the Bitwig Studio transport.
         *
         * @since API version 2
         * @return {*}
         */
        isPunchInEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if punch-in is enabled in the Bitwig Studio transport.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` when punch-in is enabled,
         * `false` otherwise).
         * @since API version 1
         * @deprecated Use {@link #isPunchInEnabled()} instead.
         */
        addPunchInObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if punch-in is enabled in the Bitwig Studio transport.
         *
         * @since API version 2
         * @return {*}
         */
        isPunchOutEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if punch-out is enabled in the Bitwig Studio transport.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` when punch-out is enabled,
         * `false` otherwise).
         * @since API version 1
         * @deprecated Use {@link #isPunchOutEnabled()} instead.
         */
        addPunchOutObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if the metronome is enabled in Bitwig Studio.
         *
         * @since API version 2
         * @return {*}
         */
        isMetronomeEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if the metronome is enabled in Bitwig Studio.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` when the metronome is
         * enabled, `false` otherwise).
         * @since API version 1
         * @deprecated Use {@link #isMetronomeEnabled()} instead.
         */
        addClickObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports if the metronome has tick playback enabled.
         *
         * @since API version 2
         * @return {*}
         */
        isMetronomeTickPlaybackEnabled(): SettableBooleanValue;
        /**
         * Registers an observer that reports if the metronome has tick playback enabled.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument (`true` if metronome ticks, are
         * enabled, `false` otherwise).
         * @since API version 1
         * @deprecated Use {@link #isMetronomeTickPlaybackEnabled()} instead.
         */
        addMetronomeTicksObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports the metronome volume.
         *
         * @since API version 2
         * @return {*}
         */
        metronomeVolume(): SettableRangedValue;
        /**
         * Registers an observer that reports the metronome volume.
         *
         * @param {*} callback
         * a callback function that receives a single numeric argument.
         * @since API version 1
         * @deprecated Use {@link #metronomeVolume()} instead.
         */
        addMetronomeVolumeObserver(callback: DoubleValueChangedCallback): any;
        /**
         * Value that reports if the metronome is audible during pre-roll.
         *
         * @since API version 2
         * @return {*}
         */
        isMetronomeAudibleDuringPreRoll(): SettableBooleanValue;
        /**
         * Registers an observer that reports if the metronome is audible during pre-roll.
         *
         * @param {*} callback
         * a callback function that receives a single boolean argument.
         * @since API version 1
         * @deprecated Use {@link #isMetronomeAudibleDuringPreRoll()} instead.
         */
        addPreRollClickObserver(callback: BooleanValueChangedCallback): any;
        /**
         * Value that reports the current pre-roll setting. Possible values are `"none"`, `"one_bar"`,
         * `"two_bars"`, or `"four_bars"`.
         *
         * @since API version 2
         * @return {*}
         */
        preRoll(): SettableEnumValue;
        /**
         * Registers an observer that reports the current pre-roll setting.
         *
         * @param {*} callback
         * a callback function that receives a single string argument. Possible values are `"none"`,
         * `"one_bar"`, `"two_bars"`, or `"four_bars"`.
         * @since API version 1
         * @deprecated Use {@link #preRoll()} instead.
         */
        addPreRollObserver(callback: EnumValueChangedCallback): any;
        /**
         * Toggles the enabled state of the arranger loop in Bitwig Studio.
         *
         * @since API version 1
         * @deprecated Use {@link #isArrangerLoopEnabled()} instead.
         */
        toggleLoop(): any;
        /**
         * Enables of disables the arranger loop according to the given parameter.
         *
         * @param {boolean} isEnabled
         * `true` to enable the arranger loop, `false` otherwise
         * @since API version 1
         * @deprecated Use {@link #isArrangerLoopEnabled()} instead.
         */
        setLoop(isEnabled: boolean): any;
        /**
         * Toggles the punch-in enabled state of the Bitwig Studio transport.
         *
         * @since API version 1
         * @deprecated Use {@link #isPunchInEnabled()} instead.
         */
        togglePunchIn(): any;
        /**
         * Toggles the punch-out enabled state of the Bitwig Studio transport.
         *
         * @since API version 1
         * @deprecated Use {@link #isPunchOutEnabled()} instead.
         */
        togglePunchOut(): any;
        /**
         * Toggles the metronome enabled state of the Bitwig Studio transport.
         *
         * @since API version 1
         * @deprecated Use {@link #isMetronomeEnabled()} instead.
         */
        toggleClick(): any;
        /**
         * Enables of disables the metronome according to the given parameter.
         *
         * @param {boolean} isEnabled
         * `true` to enable the metronome, `false` otherwise
         * @since API version 1
         * @deprecated Use {@link #isMetronomeEnabled()} instead.
         */
        setClick(isEnabled: boolean): any;
        /**
         * Toggles the enabled state of the metronome ticks.
         *
         * @since API version 1
         * @deprecated Use {@link #isMetronomeTickPlaybackEnabled()} instead.
         */
        toggleMetronomeTicks(): any;
        /**
         * Toggles the enabled state of the metronome during pre-roll.
         *
         * @since API version 1
         * @deprecated Use {@link #isMetronomeAudibleDuringPreRoll()} instead.
         */
        toggleMetronomeDuringPreRoll(): any;
        /**
         * Updates the transport pre-roll setting according to the given parameter.
         *
         * @param {string} value
         * the new pre-roll setting, either `"none"`, `"one_bar"`, `"two_bars"`, or `"four_bars"`.
         * @since API version 1
         * @deprecated Use {@link #preRoll()} instead.
         */
        setPreRoll(value: string): any;
        /**
         * Sets the metronome volume.
         *
         * @param {number} amount
         * the new metronome volume relative to the specified range. Values should be in the range
         * [0..range-1].
         * @param {number} range
         * the range of the provided amount value
         * @since API version 1
         * @deprecated Use {@link #metronomeVolume()} instead.
         */
        setMetronomeValue(amount: number, range: number): any;
        /**
         * Toggles the over-dubbing enabled state of the Bitwig Studio transport.
         *
         * @since API version 1
         * @deprecated Use {@link #isArrangerOverdubEnabled()} instead.
         */
        toggleOverdub(): any;
        /**
         * Enables of disables arranger over-dubbing according to the given parameter.
         *
         * @param {boolean} isEnabled
         * `true` to enable over-dubbing, `false` otherwise
         * @since API version 1
         * @deprecated Use {@link #isArrangerOverdubEnabled()} instead.
         */
        setOverdub(isEnabled: boolean): any;
        /**
         * Toggles clip launcher overdubbing in Bitwig Studio.
         *
         * @since API version 1
         * @deprecated Use {@link #isClipLauncherOverdubEnabled()} instead.
         */
        toggleLauncherOverdub(): any;
        /**
         * Enables of disables clip launcher over-dubbing according to the given parameter.
         *
         * @param {boolean} isEnabled
         * `true` to enable the over-dubbing, `false` otherwise
         * @since API version 1
         * @deprecated Use {@link #isClipLauncherOverdubEnabled()} instead.
         */
        setLauncherOverdub(isEnabled: boolean): any;
        /**
         * Sets the automation write mode.
         *
         * @param {string} mode
         * the string that identifies the new automation write mode. Possible values are `"latch"`,
         * `"touch"` or `"write"`.
         * @since API version 1
         * @deprecated Use {@link #automationWriteMode()} instead.
         */
        setAutomationWriteMode(mode: string): any;
        /**
         * Toggles the latch automation write mode in the Bitwig Studio transport.
         *
         * @since API version 1
         */
        toggleLatchAutomationWriteMode(): any;
        /**
         * Toggles the arranger automation write enabled state of the Bitwig Studio transport.
         *
         * @since API version 1
         */
        toggleWriteArrangerAutomation(): any;
        /**
         * Toggles the clip launcher automation write enabled state of the Bitwig Studio transport.
         *
         * @since API version 1
         */
        toggleWriteClipLauncherAutomation(): any;
        /**
         * Resets any automation overrides in Bitwig Studio.
         *
         * @since API version 1
         */
        resetAutomationOverrides(): any;
        /**
         * Switches playback to the arrangement sequencer on all tracks.
         *
         * @since API version 1
         */
        returnToArrangement(): any;
        /**
         * Returns an object that provides access to the project tempo.
         *
         * @return {*} the requested tempo value object
         * @since API version 1
         * @deprecated Use {@link #tempo()} instead.
         */
        getTempo(): Parameter;
        /**
         * Returns an object that provides access to the project tempo.
         *
         * @return {*} the requested tempo value object
         * @since API version 1
         */
        tempo(): Parameter;
        /**
         * Increases the project tempo value by the given amount, which is specified relative to the given range.
         *
         * @param {number} amount
         * the new tempo value relative to the specified range. Values should be in the range
         * [0..range-1].
         * @param {number} range
         * the range of the provided amount value
         * @since API version 1
         */
        increaseTempo(amount: number, range: number): any;
        /**
         * Returns an object that provides access to the transport position in Bitwig Studio.
         *
         * @return {*} a beat time object that represents the transport position
         * @since API version 1
         */
        getPosition(): SettableBeatTimeValue;
        /**
         * Sets the transport playback position to the given beat time value.
         *
         * @param {number} beats
         * the new playback position in beats
         * @since API version 1
         */
        setPosition(beats: number): any;
        /**
         * Increases the transport position value by the given number of beats, which is specified relative to the
         * given range.
         *
         * @param {number} beats
         * the beat time value that gets added to the current transport position. Values have double
         * precision and can be positive or negative.
         * @param {boolean} snap
         * when `true` the actual new transport position will be quantized to the beat grid, when `false`
         * the position will be increased exactly by the specified beat time
         * @since API version 1
         */
        incPosition(beats: number, snap: boolean): any;
        /**
         * Returns an object that provides access to the punch-in position in the Bitwig Studio transport.
         *
         * @return {*} a beat time object that represents the punch-in position
         * @since API version 1
         */
        getInPosition(): SettableBeatTimeValue;
        /**
         * Returns an object that provides access to the punch-out position in the Bitwig Studio transport.
         *
         * @return {*} a beat time object that represents the punch-out position
         * @since API version 1
         */
        getOutPosition(): SettableBeatTimeValue;
        /**
         * Returns an object that provides access to the cross-fader, used for mixing between A/B-channels as
         * specified on the Bitwig Studio tracks.
         *
         * @see Track#getCrossFadeMode()
         * @since API version 1
         * @deprecated Use {@link #crossfade()} instead.
         * @return {*}
         */
        getCrossfade(): Parameter;
        /**
         * Returns an object that provides access to the cross-fader, used for mixing between A/B-channels as
         * specified on the Bitwig Studio tracks.
         *
         * @see Track#getCrossFadeMode()
         * @since API version 5
         * @return {*}
         */
        crossfade(): Parameter;
        /**
         * Returns an object that provides access to the transport time signature.
         *
         * @return {*} the time signature value object that represents the transport time signature.
         * @since API version 1
         * @deprecated Use {@link #timeSignature()} instead.
         */
        getTimeSignature(): TimeSignatureValue;
        /**
         * Returns an object that provides access to the transport time signature.
         *
         * @return {*} the time signature value object that represents the transport time signature.
         * @since API version 5
         */
        timeSignature(): TimeSignatureValue;
        /**
         * Value that reports the current clip launcher post recording action. Possible values are `"off"`,
         * `"play_recorded"`, `"record_next_free_slot"`, `"stop"`, `"return_to_arrangement"`,
         * `"return_to_previous_clip"` or `"play_random"`.
         *
         * @since API version 2
         * @return {*}
         */
        clipLauncherPostRecordingAction(): SettableEnumValue;
        /**
         * Registers an observer that reports the current clip launcher post recording action.
         *
         * @param {*} callback
         * a callback function that receives a single string argument. Possible values are `"off"`,
         * `"play_recorded"`, `"record_next_free_slot"`, `"stop"`, `"return_to_arrangement"`,
         * `"return_to_previous_clip"` or `"play_random"`.
         * @since API version 1
         * @deprecated Use {@link #clipLauncherPostRecordingAction()} instead.
         */
        addClipLauncherPostRecordingActionObserver(callback: EnumValueChangedCallback): any;
        /**
         * Sets the automation write mode.
         *
         * @param {string} action
         * the string that identifies the new automation write mode. Possible values are `"off"`,
         * `"play_recorded"`, `"record_next_free_slot"`, `"stop"`, `"return_to_arrangement"`,
         * `"return_to_previous_clip"` or `"play_random"`.
         * @since API version 1
         * @deprecated Use {@link #clipLauncherPostRecordingAction()} instead.
         */
        setClipLauncherPostRecordingAction(action: string): any;
        /**
         * Returns an object that provides access to the clip launcher post recording time offset.
         *
         * @return {*} a beat time object that represents the post recording time offset
         * @since API version 1
         */
        getClipLauncherPostRecordingTimeOffset(): SettableBeatTimeValue;
    }

    /**
     * Instances of this interface represent a bank of custom controls that can be manually learned to device
     * parameters by the user.
     *
     * @since API version 1
     * @class
     */
    interface UserControlBank {
        /**
         * Gets the user control at the given bank index.
         *
         * @param {number} index
         * the index of the control within the bank
         * @return {*} the requested user control object
         * @since API version 1
         */
        getControl(index: number): Parameter;
    }

    /**
     * The common interface that is shared by all value objects in the controller API.
     *
     * @since API version 1
     * @class
     */
    interface Value<ObserverType extends ValueChangedCallback> extends Subscribable {
        /**
         * Marks this value as being of interest to the driver. This can only be called once during the driver's
         * init method. A value that is of interest to the driver can be obtained using the value's get method. If
         * a value has not been marked as interested then an error will be reported if the driver attempts to get
         * the current value. Adding an observer to a value will automatically mark this value as interested.
         *
         * @since API version 2
         */
        markInterested(): any;
        addValueObserver(callback: ObserverType, valueWhenUnassigned?: any): any;
    }

    class AutoDetectionMidiPortNames {
        constructor(inputNames: string[], outputNames: string[]);
        getInputNames(): string[];
        getOutputNames(): string[];
        mInputNames: string[];
        mOutputNames: string[];
    }

    class AutoDetectionMidiPortNamesList {
        add(inputNames: string[], outputNames: string[]): void;
        getPortNames(): Array<AutoDetectionMidiPortNames>;
        getCount(): number;
        getPortNamesAt(index: number): AutoDetectionMidiPortNames;
        mList: Array<AutoDetectionMidiPortNames>;
    }

    abstract class Extension<HostType extends Host, DefinitionType extends ExtensionDefinition> {
        constructor(extensionDefinition: DefinitionType, host: HostType);
        getHost(): HostType;
        getExtensionDefinition(): DefinitionType;
        mExtensionDefinition: DefinitionType;
        mHost: HostType;
    }

    /**
     * Base class for defining any kind of extension for Bitwig Studio.
     * @class
     */
    abstract class ExtensionDefinition {
        /**
         * The name of the extension.
         * @return {string}
         */
        abstract getName(): string;
        /**
         * The author of the extension.
         * @return {string}
         */
        abstract getAuthor(): string;
        /**
         * The version of the extension.
         * @return {string}
         */
        abstract getVersion(): string;
        /**
         * A unique id that identifies this extension.
         * @return {string}
         */
        abstract getId(): string;
        /**
         * The minimum API version number that this extensions requires.
         * @return {number}
         */
        abstract getRequiredAPIVersion(): number;
        /**
         * Gets a path within the extension's jar file where documentation for this extension can be found or null
         * if there is none. At the moment this file needs to be a PDF file but other file formats maybe supported
         * in the future.
         * @return {string}
         */
        getHelpFilePath(): string;
        /**
         * If true then this extension should fail when it calls a deprecated method in the API. This is useful
         * during development.
         * @return {boolean}
         */
        shouldFailOnDeprecatedUse(): boolean;
        /**
         * An e-mail address that can be used to contact the author of this extension if a problem is detected with
         * it or null if none.
         * @return {string}
         */
        getErrorReportingEMail(): string;
        /**
         *
         * @return {string}
         */
        toString(): string;
    }

    class OscPacketSizeExceededException extends OscIOException {
        constructor();
    }

    /**
     * Defines an extension that enabled a controller to work with Bitwig Studio.
     * @extends Extension
     * @class
     */
    abstract class ControllerExtension extends Extension<
        ControllerHost,
        ControllerExtensionDefinition
    > {
        constructor(definition: ControllerExtensionDefinition, host: ControllerHost);
        getMidiInPort(index: number): MidiIn;
        getMidiOutPort(index: number): MidiOut;
        /**
         * Initializes this controller extension. This will be called once when the extension is started. During initialization the
         * extension should call the various create methods available via the {@link ControllerHost} interface in order to
         * create objects used to communicate with various parts of the Bitwig Studio application (e.g
         * {@link ControllerHost#createCursorTrack(int, int)}.
         */
        abstract init(): any;
        /**
         * Called once when this controller extension is stopped.
         */
        abstract exit(): any;
        /**
         * Called when this controller extension should flush any pending updates to the controller.
         */
        abstract flush(): any;
    }

    /**
     * Defines an extension that enabled a controller to work with Bitwig Studio.
     *
     * @class
     * @extends ExtensionDefinition
     */
    abstract class ControllerExtensionDefinition extends ExtensionDefinition {
        /**
         *
         * @return {string}
         */
        toString(): string;
        /**
         * The vendor of the controller that this extension is for.
         * @return {string}
         */
        abstract getHardwareVendor(): string;
        /**
         * The model name of the controller that this extension is for.
         * @return {string}
         */
        abstract getHardwareModel(): string;
        /**
         * The number of MIDI in ports that this controller extension has.
         * @return {number}
         */
        abstract getNumMidiInPorts(): number;
        /**
         * The number of MIDI out ports that this controller extension has.
         * @return {number}
         */
        abstract getNumMidiOutPorts(): number;
        /**
         * Obtains a {@link AutoDetectionMidiPortNamesList} that defines the names of the MIDI in and out ports
         * that can be used for auto detection of the controller for the supplied platform type.
         * @param {PlatformType} platformType
         * @return {AutoDetectionMidiPortNamesList}
         */
        getAutoDetectionMidiPortNamesList(
            platformType: PlatformType
        ): AutoDetectionMidiPortNamesList;
        /**
         * Lists the {@link AutoDetectionMidiPortNames} that defines the names of the MIDI in and out ports
         * that can be used for auto detection of the controller for the supplied platform type.
         * @param {AutoDetectionMidiPortNamesList} list
         * @param {PlatformType} platformType
         */
        abstract listAutoDetectionMidiPortNames(
            list: AutoDetectionMidiPortNamesList,
            platformType: PlatformType
        ): any;
        /**
         * Creates an instance of this extension.
         * @param {*} host
         * @return {ControllerExtension}
         */
        abstract createInstance(host: ControllerHost): ControllerExtension;
    }
}

declare const host: API.ControllerHost;
declare const loadAPI: typeof host.loadAPI;
declare const load: typeof host.load;
declare const println: typeof host.println;
declare const errorln: typeof host.errorln;
declare function dump(obj: any): void;
