import {LitElement, css, html} from 'lit';
import {map} from 'lit-html/directives/map.js';


export function formatDuration(seconds, includeHours = true, includeMilliseconds = false, trimLeadingZeros = false) {
    if (!Number.isFinite(seconds)) {
        // Don't render Infinity, NaN, etc.
        return "";
    }

    let date = new Date(0);
    const hours = Math.floor(seconds / 3600)
    let milliseconds = (seconds % 1.0) * 1000
    // We allow a small tolerance for floating point errors
    if (milliseconds > 1e-6 && !includeMilliseconds) {
        // If we're not showing the milliseconds, have to round up
        // World Athletics Technical Rules, 19.24.5
        // For all races, all times not ending in zero shall be converted and recorded
        // to the next longer whole second, e.g. 2:09:44.3 shall be recorded as
        // 2:09:45.
        date.setSeconds(seconds + 1);
    } else {
        date.setSeconds(seconds)
        date.setMilliseconds(milliseconds)
    }
    let start = 14
    let end = 19

    if (includeHours) {
        if (hours >= 10) {
            start -= 3
        } else {
            start -= 2
        }
    }
    if (includeMilliseconds) {
        end += 2
    }
    let result = date.toISOString().substring(start, end)
    if (trimLeadingZeros) {
        result = result.replace(/^0+/, '')
    }
    return result
}

export class LapCalculator extends LitElement {
    static properties = {
        eventDistance: {type: Number},
        trackLength: {type: Number},
        laneNumber: {type: Number},
        naturalMode: {type: String}, // 'paceKm', 'paceMi', 'duration', 'lap', 'firstLap'
        isScrolled: {type: Boolean},
        contentHidden: {type: Boolean},
    };

    static styles = css`
        :host {
            font-family: var(--sans-serif-font-family);
        }

        td {
            font-feature-settings: "lnum";
        }

        .sans {
            font-family: var(--sans-serif-font-family);
        }

        /* Set a fixed scrollable wrapper */

        .table-wrap {
            max-height: 60vh;
            overflow: auto;
            position: relative;
        }

        .table-wrap.content-hidden {
            box-shadow: 0 16px 16px -20px #ddd inset, 0 -16px 16px -20px #ddd inset;
        }

        .table td {
            background-color: transparent;
        }

        /* Set header to stick to the top of the container. */

        thead.sticky {
            position: sticky;
            top: 0;
            background: white;
            z-index: 10;
            cursor: pointer;
            user-select: none;
        }

        thead.sticky.scrolled {
            box-shadow: #ddd 0px 0px 16px, var(--bs-secondary-bg) 0px 1px 0px;
        }

        thead tr th:hover {
            background-color: var(--bs-tertiary-bg);
        }

        thead tr th.natural {
            //text-decoration: underline;
            font-weight: bold;
            background-color: var(--bs-secondary-bg);
        }

        h4 {
            text-transform: uppercase;
            font-weight: bold;
            letter-spacing: 1px;
            color: var(--bs-secondary);
            font-size: 1rem;
        }

        /* Preset button styles */
        
        .preset-buttons {
            display: flex;
            flex-wrap: wrap;
        }

        .preset-btn {
            padding: 0.375rem 0.75rem;
            border: 1px solid var(--bs-border-color);
            background: var(--bs-body-bg);
            color: var(--bs-body-color);
            border-radius: var(--bs-border-radius);
            cursor: pointer;
            transition: all 0.15s ease-in-out;
            font-size: 0.875rem;
            white-space: nowrap;
            position: relative;
        }

        .preset-btn:hover {
            background: var(--bs-tertiary-bg);
            border-color: var(--bs-border-color-translucent);
        }

        .preset-btn.active {
            background: var(--bs-secondary-bg);
            color: var(--bs-primary-text);
            border-color: var(--bs-secondary-border);
        }

        .preset-label {
            font-weight: 600;
            font-size: 0.875rem;
        }

        /* Carousel dots for multi-variant presets */

        .preset-btn:has(.preset-dots) {
            padding-right: 18px; /* Add space for dots */
        }

        .preset-dots {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 3px;
        }

        .preset-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.3);
            transition: background-color 0.15s ease-in-out;
        }

        .preset-dot.active {
            background-color: var(--bs-primary, #0d6efd);
        }

        .preset-btn.active .preset-dot.active {
            background-color: currentColor;
        }

        /* Chevron indicator for multi-lap preset */

        .preset-btn:has(.preset-chevron) {
            padding-right: 20px; /* Add space for chevron */
        }

        .preset-chevron {
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            width: 0;
            height: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            border-bottom: 6px solid rgba(0, 0, 0, 0.4);
            transition: border-bottom-color 0.15s ease-in-out;
        }

        .preset-btn.active .preset-chevron {
            border-bottom-color: currentColor;
        }
    `;

    constructor() {
        super();

        // Default values
        this.eventDistance = 5000;
        this.trackLength = 400;
        this.laneNumber = 1;
        this.naturalMode = 'paceMi';
        this.isScrolled = false;
        this.contentHidden = false;

        this.eventDistancePresets = [
            {label: '1 Lap', value: 'track'},
            {label: 'Mile', value: 1609.34},
            {label: '5K', value: 5000},
            {label: '10K', value: 10000},
            {label: 'Half Marathon', value: 21097.5},
            {label: 'Marathon', value: 42195},
        ];

        this.trackLengthPresets = [
            {
                label: 'Drumheller',
                variants: [
                    {label: 'Drumheller (Ramp)', value: 192.37},
                    {label: 'Drumheller', value: 191.47}
                ]
            },
            {label: '200m', value: 200},
            {label: '400m', value: 400},
        ];

        this.restoreState();
        this.initializeFromQueryParams();
    }

    // Get the current number of laps for the event distance
    getCurrentLapCount() {
        return Math.round(this.eventDistance / this.trackLength);
    }

    // Check if the event distance is an even multiple of track length
    isEvenMultipleOfTrack() {
        const lapCount = this.getCurrentLapCount();
        return Math.abs(this.eventDistance - (lapCount * this.trackLength)) < 0.01;
    }

    getEventDistanceTooltip(preset) {
        if (preset.value === 'track') {
            if (this.isEvenMultipleOfTrack()) {
                const lapCount = this.getCurrentLapCount();
                const nextLapCount = lapCount + 1;
                return `${lapCount} lap${lapCount !== 1 ? 's' : ''} (${this.eventDistance}m) • Click to cycle to ${nextLapCount} lap${nextLapCount !== 1 ? 's' : ''}`;
            }
            return `${this.trackLength}m`;
        }
        return `${preset.value}m`;
    }

    getTrackLengthTooltip(preset) {
        if (preset.variants) {
            const activeVariantIndex = this.getActiveVariantIndex(preset);
            if (activeVariantIndex >= 0) {
                const activeVariant = preset.variants[activeVariantIndex];
                return `${activeVariant.value}m • Click to cycle variants`;
            }
            return `${preset.variants[0].value}m • Click to cycle variants`;
        }
        return `${preset.value}m`;
    }

    // Get which variant is currently active based on track length
    getActiveVariantIndex(preset) {
        if (!preset.variants) return -1;
        return preset.variants.findIndex(variant =>
            Math.abs(variant.value - this.trackLength) < 0.01
        );
    }

    // Initialize values from URL query parameters
    initializeFromQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);

        const eventDistance = urlParams.get('eventDistance') || urlParams.get('event_distance') || urlParams.get('distance') || urlParams.get('dist');
        const trackLength = urlParams.get('trackLength') || urlParams.get('track_length') || urlParams.get('track');
        const laneNumber = urlParams.get('laneNumber') || urlParams.get('lane_number') || urlParams.get('lane') || urlParams.get('ln');
        const naturalMode = urlParams.get('naturalMode') || urlParams.get('natural_mode') || urlParams.get('mode') || urlParams.get('m');

        if (eventDistance && !isNaN(parseFloat(eventDistance))) {
            this.eventDistance = parseFloat(eventDistance);
        }

        if (trackLength && !isNaN(parseFloat(trackLength))) {
            this.trackLength = parseFloat(trackLength);
        }

        if (laneNumber && !isNaN(parseInt(laneNumber))) {
            this.laneNumber = parseInt(laneNumber);
        }

        if (naturalMode && ['paceKm', 'paceMi', 'duration', 'lap', 'firstLap'].includes(naturalMode)) {
            this.naturalMode = naturalMode;
        }
    }

    // Update URL query parameters with current state
    updateQueryParams() {
        const params = new URLSearchParams();

        // Only add parameters if they differ from defaults
        if (this.eventDistance !== 5000) {
            params.set('dist', this.eventDistance.toFixed(2).toString());
        }

        if (this.trackLength !== 400.0) {
            params.set('track', this.trackLength.toFixed(2).toString());
        }

        if (this.laneNumber !== 1) {
            params.set('ln', this.laneNumber.toString());
        }

        if (this.naturalMode !== 'paceMi') {
            params.set('m', this.naturalMode);
        }

        // Update the URL without triggering a page reload
        const newUrl = params.toString() ?
            `${window.location.pathname}?${params.toString()}` :
            window.location.pathname;

        window.history.replaceState({}, '', newUrl);
    }

    firstUpdated() {
        const tableWrap = this.shadowRoot.querySelector('.table-wrap');
        tableWrap.addEventListener('scroll', this.updateContentHidden.bind(this));
        // Also run handler when element changes size
        const resizeObserver = new ResizeObserver(this.updateContentHidden.bind(this));
        resizeObserver.observe(tableWrap);
        this.contentHidden = tableWrap.scrollHeight > tableWrap.clientHeight && tableWrap.scrollTop < tableWrap.scrollHeight - tableWrap.clientHeight;
    }

    updateContentHidden(event) {
        const element = event.target;
        const scrollTop = element.scrollTop;
        this.isScrolled = scrollTop > 0;
        // Check whether the element can be scrolled any further
        this.contentHidden = element.scrollHeight > element.clientHeight && element.scrollTop < element.scrollHeight - element.clientHeight;
    }

    storeState() {
        const state = {
            eventDistance: this.eventDistance,
            trackLength: this.trackLength,
            laneNumber: this.laneNumber,
            naturalMode: this.naturalMode,
        };
        sessionStorage.setItem('lapCalculatorState', JSON.stringify(state));
    }

    restoreState() {
        const savedState = sessionStorage.getItem('lapCalculatorState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.eventDistance = state.eventDistance || this.eventDistance;
            this.trackLength = state.trackLength || this.trackLength;
            this.laneNumber = state.laneNumber || this.laneNumber;
            this.naturalMode = state.naturalMode || this.naturalMode;
        }
    }

    updated(changedProperties) {
        // Store state if relevant properties have changed
        if (
            changedProperties.has('laneNumber') ||
            changedProperties.has('eventDistance') ||
            changedProperties.has('trackLength') ||
            changedProperties.has('naturalMode')
        ) {
            this.storeState();
            this.updateQueryParams(); // Update URL whenever state changes
        }

        // If we're in "1 Lap" mode and naturalMode is lap or firstLap, switch to a valid mode
        if (this.isOneLapMode && (this.naturalMode === 'lap' || this.naturalMode === 'firstLap')) {
            this.naturalMode = 'paceKm';
        }

        // If event divides evenly and naturalMode is firstLap, switch to a valid mode
        if (this.isEvenlyDivisible && this.naturalMode === 'firstLap') {
            this.naturalMode = 'paceKm';
        }
    }

    get isOneLapMode() {
        return Math.abs(this.eventDistance - this.trackLength) < 0.01; // Allow for small floating point differences
    }

    get isEvenlyDivisible() {
        // Check if event distance is evenly divisible by track length
        const remainder = this.eventDistance % this.trackLength;
        return Math.abs(remainder) < 0.01 || Math.abs(remainder) > (this.trackLength - 0.01); // Allow for small floating point differences
    }

    get startLength() {
        return ((this.eventDistance / this.trackLength) % 1.0) * this.trackLength;
    }

    // Primary calculation: pace (seconds per km) -> all other values
    calculateFromPace(paceSecondsPerKm) {
        const duration = (paceSecondsPerKm / 1000) * this.eventDistance;
        const lapTime = this.trackLength * paceSecondsPerKm / 1000;
        const firstLapTime = (this.startLength + this.trackLength) * paceSecondsPerKm / 1000;
        const pacePerMile = paceSecondsPerKm * 1.60934;

        return {
            paceSecondsPerKm,
            pacePerMile,
            duration,
            lapTime,
            firstLapTime
        };
    }

    // Inverse functions - solve for pace given target value
    solvePaceFromMilePace(paceSecondsPerMile) {
        return paceSecondsPerMile / 1.60934;
    }

    solvePaceFromDuration(targetDuration) {
        return (targetDuration * 1000) / this.eventDistance;
    }

    solvePaceFromLapTime(targetLapTime) {
        return (targetLapTime * 1000) / this.trackLength;
    }

    solvePaceFromFirstLap(targetFirstLap) {
        return (targetFirstLap * 1000) / (this.startLength + this.trackLength);
    }

    // Generate natural ticks based on current mode
    generateNaturalTicks() {
        switch (this.naturalMode) {
            case 'paceKm':
                // 5 second ticks from 8:30/km to 3:00/km
                const ticks = [];
                for (let seconds = 510; seconds >= 180; seconds -= 5) {
                    ticks.push(seconds);
                }
                return ticks;

            case 'paceMi':
                // 5 second ticks from 14:00/mi to 4:30/mi
                const miTicks = [];
                for (let seconds = 840; seconds >= 270; seconds -= 5) {
                    miTicks.push(seconds);
                }
                return miTicks;

            case 'duration': {
                // Find duration range based on pace extremes
                const slowestPace = 520; // 8:40/km
                const fastestPace = 180; // 3:00/km
                const slowestDuration = this.calculateFromPace(slowestPace).duration;
                const fastestDuration = this.calculateFromPace(fastestPace).duration;

                // Use 5 second granularity for events shorter than 15K, otherwise 1 minute
                let granularity = 60;

                let startTime, endTime;
                if (this.eventDistance < 2000) {
                    startTime = Math.round(slowestDuration);
                    endTime = Math.round(fastestDuration);
                    granularity = 1;
                } else if (this.eventDistance < 15000) {
                    // Round to nearest 5 seconds
                    startTime = Math.round(slowestDuration / 5) * 5;
                    endTime = Math.round(fastestDuration / 5) * 5;
                    granularity = 5;
                } else {
                    // Round to nearest minute
                    startTime = Math.round(slowestDuration / 60) * 60;
                    endTime = Math.round(fastestDuration / 60) * 60;
                }

                const durationTicks = [];
                for (let time = startTime; time >= endTime; time -= granularity) {
                    durationTicks.push(time);
                }
                return durationTicks;
            }

            case 'lap': {
                // Find lap time range and use whole seconds
                const slowestPace = 520; // 8:40/km
                const fastestPace = 180; // 3:00/km
                const slowestLap = this.calculateFromPace(slowestPace).lapTime;
                const fastestLap = this.calculateFromPace(fastestPace).lapTime;

                const startSecond = Math.round(slowestLap);
                const endSecond = Math.round(fastestLap);

                const lapTicks = [];
                for (let second = startSecond; second >= endSecond; second--) {
                    lapTicks.push(second);
                }
                return lapTicks;
            }

            case 'firstLap': {
                // Find first lap time range and use whole seconds
                const slowestPace = 510; // 8:30/km
                const fastestPace = 180; // 3:00/km
                const slowestFirstLap = this.calculateFromPace(slowestPace).firstLapTime;
                const fastestFirstLap = this.calculateFromPace(fastestPace).firstLapTime;

                const startSecond = Math.round(slowestFirstLap);
                const endSecond = Math.round(fastestFirstLap);

                const firstLapTicks = [];
                for (let second = startSecond; second >= endSecond; second--) {
                    firstLapTicks.push(second);
                }
                return firstLapTicks;
            }

            default:
                return [];
        }
    }

    // Generate table data based on natural mode
    generateTableData() {
        const ticks = this.generateNaturalTicks();

        return ticks.map(tick => {
            let pace;
            switch (this.naturalMode) {
                case 'paceKm':
                    pace = tick;
                    break;
                case 'paceMi':
                    pace = this.solvePaceFromMilePace(tick);
                    break;
                case 'duration':
                    pace = this.solvePaceFromDuration(tick);
                    break;
                case 'lap':
                    pace = this.solvePaceFromLapTime(tick);
                    break;
                case 'firstLap':
                    pace = this.solvePaceFromFirstLap(tick);
                    break;
                default:
                    pace = tick;
            }
            return this.calculateFromPace(pace);
        });
    }

    handleColumnClick(columnType) {
        // Don't allow clicking on lap/firstLap columns in one lap mode
        if (this.isOneLapMode && (columnType === 'lap' || columnType === 'firstLap')) {
            return;
        }
        // Don't allow clicking on firstLap column if evenly divisible
        if (this.isEvenlyDivisible && columnType === 'firstLap') {
            return;
        }
        this.naturalMode = columnType;
    }

    // Preset handlers
    setEventDistance(value) {
        if (value === 'track') {
            // If already an even multiple of track length, increment by one lap
            if (this.isEvenMultipleOfTrack()) {
                // It doesn't take long for us to get small floating point issues. Evidence: 7 * 192.37
                this.eventDistance = Math.round((this.getCurrentLapCount() + 1) * this.trackLength * 100) / 100;
            } else {
                // Otherwise, set to exactly one lap
                this.eventDistance = this.trackLength;
            }
        } else {
            this.eventDistance = value;
        }
    }

    setTrackLength(preset) {
        if (preset.variants) {
            // Handle multi-variant preset
            const currentVariantIndex = this.getActiveVariantIndex(preset);
            let nextVariantIndex;

            if (currentVariantIndex >= 0) {
                // If already active, cycle to next variant
                nextVariantIndex = (currentVariantIndex + 1) % preset.variants.length;
            } else {
                // If not active, activate with first variant
                nextVariantIndex = 0;
            }

            const nextVariant = preset.variants[nextVariantIndex];
            this.trackLength = nextVariant.value;


        } else {
            // Handle single-value preset
            this.trackLength = preset.value;

        }
    }

    // Check which presets are currently active
    isEventPresetActive(preset) {
        if (preset.value === 'track') {
            return this.isEvenMultipleOfTrack();
        }
        return preset.value === this.eventDistance;
    }

    isTrackPresetActive(preset) {
        if (preset.variants) {
            return this.getActiveVariantIndex(preset) >= 0;
        }
        return preset.value === this.trackLength;
    }

    getTrackPresetLabel(preset) {
        if (preset.variants) {
            const activeVariantIndex = this.getActiveVariantIndex(preset);
            if (activeVariantIndex >= 0) {
                return preset.variants[activeVariantIndex].label;
            }
            return preset.variants[0].label;
        }
        return preset.label;
    }

    getEventPresetLabel(preset) {
        if (preset.value === 'track' && this.isEvenMultipleOfTrack()) {
            const lapCount = this.getCurrentLapCount();
            if (lapCount === 1) {
                return '1 Lap';
            } else {
                return `${lapCount} Laps`;
            }
        }
        return preset.label;
    }

    formatPace(seconds, includeMilliseconds = true) {
        let minutes = Math.floor(seconds / 60);
        let secs = Math.round(seconds % 60);
        /*const milliseconds = Math.round((seconds % 1) * 1000);
        let millisecondsString = milliseconds > 0 ? `.${String(milliseconds).padStart(3, '0')}` : '';
        if (!includeMilliseconds) {
            millisecondsString = '';
        }*/
        // Just one decimal place for milliseconds
        let milliseconds = Math.round((seconds % 1) * 10);
        if (milliseconds === 10) {
            // If we rounded up to 10, we need to carry it over
            milliseconds = 0;
            secs += 1;
            if (secs === 60) {
                secs = 0;
                minutes += 1;
            }
        }
        let millisecondsString = `.${String(milliseconds).padStart(1, '0')}`;

        if (!includeMilliseconds) {
            millisecondsString = '';
        }

        return `${minutes}:${String(secs).padStart(2, '0')}${millisecondsString}`;
    }

    render() {
        const tableData = this.generateTableData();

        return html`
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                crossorigin="anonymous">

          <div class="row mb-2">
            <div class="col-sm-7 col-12 mb-2">
              <div class="input-group">
                <label for="eventDistance" class="input-group-text">Event distance</label>
                <input
                        id="eventDistance"
                        type="number"
                        min="0"
                        step="1"
                        class="form-control form-control-sm sans"
                        novalidate
                        .value="${this.eventDistance}"
                        @input="${(e) => this.eventDistance = parseFloat(e.target.value)}"
                />
                <span class="input-group-text">m</span>
              </div>
            </div>

            <div class="col-sm-5 col-12">
              <div class="input-group">
                <label for="trackLength" class="input-group-text">Track length</label>
                <input
                        id="trackLength"
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control form-control-sm sans"
                        novalidate
                        .value="${this.trackLength}"
                        @input="${(e) => this.trackLength = parseFloat(e.target.value)}"
                />
                <span class="input-group-text">m</span>
              </div>
            </div>
          </div>

          <h4>Presets</h4>
          <div class="preset-section mb-2">

            <div class="preset-label mb-1">Event Distance</div>
            <div class="preset-buttons gap-2">
              ${map(this.eventDistancePresets, (preset) => html`
                <button
                        class="preset-btn ${this.isEventPresetActive(preset) ? 'active' : ''}"
                        title="${this.getEventDistanceTooltip(preset)}"
                        @click="${() => this.setEventDistance(preset.value)}"
                >
                  ${this.getEventPresetLabel(preset)}
                  ${preset.value === 'track' && this.isEventPresetActive(preset) ? html`
                    <div class="preset-chevron"></div>
                  ` : ''}
                </button>
              `)}
            </div>
          </div>
          
          <div class="preset-section mb-2">
            <div class="preset-label mb-1">Track Length</div>
            <div class="preset-buttons gap-2">
              ${map(this.trackLengthPresets, (preset) => html`
                <button
                        class="preset-btn ${this.isTrackPresetActive(preset) ? 'active' : ''}"
                        title="${this.getTrackLengthTooltip(preset)}"
                        @click="${() => this.setTrackLength(preset)}"
                >
                  ${this.getTrackPresetLabel(preset)}
                  ${preset.variants && this.isTrackPresetActive(preset) ? html`
                    <div class="preset-dots">
                      ${map(preset.variants, (variant, index) => html`
                        <div class="preset-dot ${index === this.getActiveVariantIndex(preset) ? 'active' : ''}"></div>
                      `)}
                    </div>
                  ` : ''}
                </button>
              `)}
            </div>
          </div>

          <hr/>

          <table class="table table-sm mb-0">
            <tbody>
            <tr>
              <td><b>Laps</b></td>
              <td class="sans">${Math.round(this.eventDistance / this.trackLength)}</td>
            </tr>
            ${!this.isEvenlyDivisible ? html`
              <tr>
                <td title="The event distance isn't evenly divided into laps, so the first lap will need to be longer by this distance.">
                  <b>Start offset</b>
                </td>
                <td class="sans">${this.startLength.toFixed(2)}m</td>
              </tr>
            ` : ''}
            </tbody>
          </table>

          <div class="table-wrap ${this.contentHidden ? 'content-hidden' : ''}">
            <table class="table table-sm mb-0">
              <thead class="sticky ${this.isScrolled ? 'scrolled' : ''}">
              <tr>
                <th scope="col"
                    class="${this.naturalMode === 'paceKm' ? 'natural' : ''}"
                    @click="${() => this.handleColumnClick('paceKm')}"
                    title="Pace in minutes per kilometer ${this.naturalMode !== 'paceKm' ? '(click to set as basis)' : ''}">
                
                  
                  min/km
                </th>
                <th scope="col"
                    class="${this.naturalMode === 'paceMi' ? 'natural' : ''}"
                    @click="${() => this.handleColumnClick('paceMi')}"
                    title="Pace in minutes per mile ${this.naturalMode !== 'paceMi' ? '(click to set as basis)' : ''}"
                >
                  min/mi
                </th>
                <th scope="col"
                    class="${this.naturalMode === 'duration' ? 'natural' : ''}"
                    @click="${() => this.handleColumnClick('duration')}"
                    title="Total duration to complete the event distance in HH:MM:SS format ${this.naturalMode !== 'duration' ? '(click to set as basis)' : ''}">
                  Duration
                </th>
                ${!this.isOneLapMode ? html`
                  <th scope="col"
                      class="${this.naturalMode === 'lap' ? 'natural' : ''}"
                      @click="${() => this.handleColumnClick('lap')}"
                    title="Lap time in seconds ${this.naturalMode !== 'lap' ? '(click to set as basis)' : ''}">
                  
                    Lap (s)
                  </th>
                ` : ''}
                ${!this.isOneLapMode && !this.isEvenlyDivisible ? html`
                  <th scope="col"
                      class="${this.naturalMode === 'firstLap' ? 'natural' : ''}"
                      @click="${() => this.handleColumnClick('firstLap')}"
                    title="First lap time in seconds ${this.naturalMode !== 'firstLap' ? '(click to set as basis)' : ''}"
                  >
                    First Lap (s)
                  </th>
                ` : ''}
              </tr>
              </thead>
              <tbody>
              ${map(tableData, (row) => html`
                <tr class="sans">
                  <td>${this.formatPace(row.paceSecondsPerKm, this.naturalMode !== "paceKm")}</td>
                  <td>${this.formatPace(row.pacePerMile, this.naturalMode !== "paceMi")}</td>
                  <td>${formatDuration(row.duration)}</td>
                  ${!this.isOneLapMode ? html`
                    <td>${row.lapTime.toFixed(this.naturalMode === "lap" ? 0 : 1)}</td>
                  ` : ''}
                  ${!this.isOneLapMode && !this.isEvenlyDivisible ? html`
                    <td>${row.firstLapTime.toFixed(this.naturalMode === "firstLap" ? 0 : 1)}</td>
                  ` : ''}
                </tr>
              `)}
              </tbody>
            </table>
          </div>
        `;
    }
}

customElements.define('lap-calculator', LapCalculator);