import {LitElement, css, html} from 'lit';
import {map} from 'lit-html/directives/map.js';

// A straight length of 0 collapses the stadium shape into a plain circle,
// so the same path math covers both oval tracks and circular loop courses.

function stadiumOutline(halfStraight, r) {
    return `M ${-halfStraight} ${-r} L ${halfStraight} ${-r} A ${r} ${r} 0 0 1 ${halfStraight} ${r} L ${-halfStraight} ${r} A ${r} ${r} 0 0 1 ${-halfStraight} ${-r} Z`;
}

// Outer ring traced clockwise, inner traced counter-clockwise; combined with
// fill-rule="evenodd" this renders as just the band between the two radii.
function stadiumRing(halfStraight, rInner, rOuter) {
    const outer = stadiumOutline(halfStraight, rOuter);
    const inner = `M ${-halfStraight} ${-rInner} A ${rInner} ${rInner} 0 0 0 ${-halfStraight} ${rInner} L ${halfStraight} ${rInner} A ${rInner} ${rInner} 0 0 0 ${halfStraight} ${-rInner} L ${-halfStraight} ${-rInner} Z`;
    return `${outer} ${inner}`;
}

export class LaneViz extends LitElement {
    static properties = {
        straight: {type: Number},
        radius: {type: Number},
        laneWidth: {type: Number},
        laneCount: {type: Number},
        laneNumber: {type: Number},
    };

    static styles = css`
        :host {
            display: block;
        }

        svg {
            width: 100%;
            height: auto;
            max-height: 220px;
            display: block;
        }

        .lane-line {
            fill: none;
            stroke: var(--bs-border-color, #ccc);
            stroke-width: 0.12;
        }

        .curb {
            fill: none;
            stroke: var(--bs-secondary-color, #888);
            stroke-width: 0.25;
        }

        .active-lane {
            fill: var(--bs-primary, #0d6efd);
            fill-opacity: 0.25;
            stroke: var(--bs-primary, #0d6efd);
            stroke-width: 0.18;
        }

        text {
            font-family: var(--sans-serif-font-family, sans-serif);
            fill: var(--bs-body-color, #333);
            font-weight: bold;
        }
    `;

    render() {
        const halfStraight = this.straight / 2;
        const lane = Math.min(Math.max(1, this.laneNumber || 1), this.laneCount);
        const innerR = this.radius + (lane - 1) * this.laneWidth;
        const outerR = innerR + this.laneWidth;
        const outermostR = this.radius + this.laneCount * this.laneWidth;

        const margin = this.laneWidth * 1.5;
        const minX = -halfStraight - outermostR - margin;
        const minY = -outermostR - margin;
        const width = this.straight + 2 * (outermostR + margin);
        const height = 2 * (outermostR + margin);

        const laneLines = [];
        for (let n = 1; n < this.laneCount; n++) {
            laneLines.push(this.radius + n * this.laneWidth);
        }

        const labelRadius = (innerR + outerR) / 2;

        return html`
          <svg viewBox="${minX} ${minY} ${width} ${height}" preserveAspectRatio="xMidYMid meet">
            <path class="active-lane" fill-rule="evenodd"
                  d="${stadiumRing(halfStraight, innerR, outerR)}"></path>
            <path class="curb" d="${stadiumOutline(halfStraight, this.radius)}"></path>
            ${map(laneLines, (r) => html`
              <path class="lane-line" d="${stadiumOutline(halfStraight, r)}"></path>
            `)}
            <path class="curb" d="${stadiumOutline(halfStraight, outermostR)}"></path>
            <text x="0" y="${-labelRadius}" font-size="${this.laneWidth * 1.3}"
                  text-anchor="middle" dominant-baseline="middle">${lane}</text>
          </svg>
        `;
    }
}

customElements.define('lane-viz', LaneViz);
