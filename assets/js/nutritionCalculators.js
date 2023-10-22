import { LitElement, css, html } from 'lit';

export class GelRecipeCalculator extends LitElement {
    static properties = {
        duration: { type: String },
        carbohydrateG: { type: Number },
        glucoseRatio: { type: Number },
        honeyG: { type: Number },
        maltodextrinG: { type: Number },
        fructoseG: { type: Number },
        waterMl: { type: Number },
        carbsPerHour: { type: Number },
        calories: {type: Number},
        volumeMl: {type: Number},
        osmolalityMOsmL: {type: Number},
        makeIsotonic: { type: Boolean },
        usePureFructose: { type: Boolean },
    };


    static styles = css`
      :host {
      }
    `;

    constructor() {
        super();
        this.duration = '4:00'
        this.carbsPerHour = 60
        this.makeIsotonic = false
        this.usePureFructose = false
        this.glucoseRatio = 3
        this.calculateIngredients()
    }

    // Calculate ingredient quantities based on body mass, duration, and units
    calculateIngredients() {
        const glucoseFructoseRatio = this.glucoseRatio
        const targetFructose = 1 / (glucoseFructoseRatio + 1)
        const targetGlucose = glucoseFructoseRatio / (glucoseFructoseRatio + 1)

        const maltodextrinMolarMass = 1400
        const fructoseMolarMass = 180

        const [hours, minutes] = this.duration.split(':').map(parseFloat);
        const durationInHours = hours + minutes / 60;
        this.carbohydrateG = this.carbsPerHour * durationInHours
        if (!this.usePureFructose) {
            // 1g of carbs in mix will come from: glucose+malto and fructose
            const glucosePerHoneyG = .3
            const fructosePerHoneyG = .4
            const waterPerHoneyG = .2
            // Use honey to get the amount of fructose we need
            const honeyPerGCarb = targetFructose / fructosePerHoneyG
            const maltoPerGCarb = targetGlucose - (glucosePerHoneyG * honeyPerGCarb)
            const waterPerGCarb = 1 - (honeyPerGCarb * waterPerHoneyG);



            // Extract hours and minutes from the duration input

            this.honeyG = this.carbohydrateG * honeyPerGCarb;
            this.maltodextrinG = this.carbohydrateG * maltoPerGCarb;
            this.waterMl = this.carbohydrateG * waterPerGCarb;
            this.calories = this.honeyG * 2.85 + this.maltodextrinG * 4.0
            this.osmolalityMOsmL = (((this.honeyG / fructoseMolarMass) + (this.maltodextrinG / maltodextrinMolarMass)) * 1000) / (this.waterMl / 1000)
        } else {
            this.honeyG = null
            this.fructoseG = targetFructose * this.carbohydrateG
            this.maltodextrinG = targetGlucose * this.carbohydrateG
            this.waterMl = 1 * this.carbohydrateG
            this.calories = this.fructoseG * 4 + this.maltodextrinG * 4.0
            this.osmolalityMOsmL = (((this.fructoseG / fructoseMolarMass) + (this.maltodextrinG / maltodextrinMolarMass)) * 1000) / (this.waterMl / 1000)
        }

        // We assume carbs have density similar to water
        this.volumeMl = this.waterMl + this.carbohydrateG
        // Convert to moles using approximate molar weights, then get into /L units

        if (this.makeIsotonic) {
            this.waterMl = (1000 / 295) * (((this.honeyG / 180) + (this.maltodextrinG / maltodextrinMolarMass)) * 1000)
            this.osmolalityMOsmL = (((this.honeyG / 180) + (this.maltodextrinG / maltodextrinMolarMass)) * 1000) / (this.waterMl / 1000)
            // 295 = (this.honeyG / 400 + this.maltodextrinG / 500) * 1000 / (this.waterMl +x / 1000)
            // 295 (this.waterMl + x) / 1000 = (this.honeyG / 400 + this.maltodextrinG / 500) * 1000
            // 1000
        }
    }

    onDurationChange(event) {
        this.duration = event.target.value;
        this.calculateIngredients();
    }
    onGlucoseRatioChange(event) {
        this.glucoseRatio = parseFloat(event.target.value);
        this.calculateIngredients();
    }
    onUsePureFructoseChange(event) {
        this.usePureFructose = event.target.checked
        this.calculateIngredients()
    }
    onCarbsPerHourChange(event) {
        this.carbsPerHour = parseFloat(event.target.value);
        this.calculateIngredients();
    }
    onMakeIsotonicChange(event) {
        this.makeIsotonic = event.target.checked;
        this.calculateIngredients();
    }


    render() {
        let fructoseLine = `Honey: ${Math.ceil(this.honeyG)}g`
        if (this.usePureFructose) {
            fructoseLine = `Fructose: ${Math.ceil(this.fructoseG)}g`
        }
        return html`
      <label for="duration">Duration (hh:mm):</label>
      <input
              id="duration"
              type="text"
              .value="${this.duration}"
              @input="${this.onDurationChange}"
      />
      <br />
      <label for="glucoseRatio">Glucose:fructose ratio</label>
      <input
              id="glucoseRatio"
              type="number"
              .value="${this.glucoseRatio}"
              @input="${this.onGlucoseRatioChange}"
      /> : 1
      <br />
      <label for="carbsPerHour">Carbs g/hour:</label>
      <input
              id="carbsPerHour"
              type="number"
              step="1"
              .value="${this.carbsPerHour}"
              @input="${this.onCarbsPerHourChange}"
      />
      <br />
      <label for="usePureFructose">Use pure fructose:</label>
      <input
              id="usePureFructose"
              type="checkbox"
              .checked="${this.usePureFructose}"
              @change="${this.onUsePureFructoseChange}"
      />
      <br />
      <label for="makeIsotonic">Isotonic:</label>
      <input
              id="makeIsotonic"
              type="checkbox"
              .checked="${this.makeIsotonic}"
              @change="${this.onMakeIsotonicChange}"
      />


      <ul>
        <li>Carbohydrate: ${Math.ceil(this.carbohydrateG)}g</li>
          <li>---</li>
          <li>Maltodextrin: ${Math.ceil(this.maltodextrinG)}g</li>
          <li>${fructoseLine}</li>
          <li>Water: ${Math.ceil(this.waterMl)}ml</li>
          <li>---</li>
          <li>${Math.ceil(this.volumeMl)}ml, ${Math.ceil(this.calories)} kcal, ${Math.ceil(this.osmolalityMOsmL)} mOsm/L</li>

      </ul>
    `;
    }
}

export class CaffeineCalculator extends LitElement {
    static properties = {
        duration: { type: String },
        bodyMass: { type: Number },
        bodyMassUnits: { type: Number },
        caffeineBeforeMg: { type: Number },
        caffeineDuringMg: {type: Number}
    };


    static styles = css`
      :host {
      }
    `;

    constructor() {
        super();
        this.duration = "1:00"
        this.bodyMass = 70; // Default value for body mass
        this.bodyMassUnits = 'kg'; // Default units
        this.calculateIngredients()
    }

    // Calculate ingredient quantities based on body mass, duration, and units
    calculateIngredients() {
        const [hours, minutes] = this.duration.split(':').map(parseFloat);
        const durationInHours = hours + minutes / 60;
        const bodyMassKg = this.bodyMass * (this.bodyMassUnits == "lb" ? .45: 1.0)
        this.caffeineBeforeMg = 3 * bodyMassKg
        this.caffeineDuringMg = 3 * bodyMassKg
    }

    onBodyMassChange(event) {
        this.bodyMass = event.target.value;
        this.calculateIngredients();
    }

    onUnitsChange(event) {
        this.bodyMassUnits = event.target.value;
        this.calculateIngredients();
    }
    onDurationChange(event) {
        this.duration = parseFloat(event.target.value);
        this.calculateIngredients();
    }

    render() {
        return html`

      <label for="body-mass">Body Mass:</label>
      <input
        id="body-mass"
        type="number"
        step="0.1"
        .value="${this.bodyMass}"
        @input="${this.onBodyMassChange}"
      />
      <label>Units:</label>
      <input
        type="radio"
        id="kg"
        name="units"
        value="kg"
        ?checked="${this.bodyMassUnits === 'kg'}"
        @change="${this.onUnitsChange}"
      />
      <label for="kg">kg</label>
      <input
        type="radio"
        id="lb"
        name="units"
        value="lb"
        ?checked="${this.bodyMassUnits === 'lb'}"
        @change="${this.onUnitsChange}"
      />
      <label for="lb">lb</label>

      <ul>
        <li>Caffeine: ${Math.ceil(this.caffeineBeforeMg)}-${Math.ceil(this.caffeineBeforeMg) * 2}mg total</li>
      </ul>
    `;
    }
}

customElements.define('caffeine-calculator', CaffeineCalculator);
customElements.define('gel-recipe-calculator', GelRecipeCalculator);
