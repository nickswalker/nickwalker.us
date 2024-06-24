import { LitElement, css, html } from 'lit';
import {solve} from "https://unpkg.com/yalps@0.5.6/lib/module/index.js";

function camelCaseToSplitWords(camelCaseString) {
    return camelCaseString
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space before each uppercase letter
        .replace(/^./, str => str.toUpperCase()) // Capitalize the first character
        .toLowerCase() // Convert the rest to lowercase
        .replace(/^(.)|\s+(.)/g, c => c.toUpperCase()); // Capitalize the first letter of each word
}
function suffixCamelCase(prepend, camelCaseString) {
    return `${prepend}${camelCaseString.charAt(0).toUpperCase()}${camelCaseString.slice(1)}`
}

// Quantities per gram of ingredient.
// Volume is ml/g. For powders a value of the ml/g in solution accounting for dissolution effects is given.
// Molar mass is g/mol
const INGREDIENTS = {

    // We assume malto is N glucose molecules (180g/mol), and we assume degree
    // of polymerization of 10
    maltodextrin: { volume: 0.8, glucose: 1.0, fructose: 0, calories: 4.0, molarMass: 1800, water: 0, cost: .0133 },
    fructose: { volume: 0.7, glucose: 0, fructose: 1.0, calories: 4.0, molarMass: 180, water: 0, cost: .02 },
    sugar: { volume: 0.8, glucose: 0.5, fructose: 0.5, calories: 4.0, molarMass: 342, water: 0, cost: .004 },
    honey: { volume: 0.7, glucose: 0.35, fructose: 0.4, calories: 2.85, molarMass: 180, water: 0.2, cost: .0133 },
    // Maltose, glucose, maltotriose, in .5, .30, .20 ratio
    brownRiceSyrup: { volume: 0.7, glucose: 0.65, fructose: 0.05, calories: 3.0, molarMass: 340, water: 0.15, cost: .013 },
    molasses: { volume: 0.7, glucose: 0.3, fructose: 0.2, calories: 3.2, molarMass: 180, water: 0.25, cost: .009 },
    agaveNectar: { volume: 0.7, glucose: 0.2, fructose: 0.56, calories: 3.0, molarMass: 180, water: 0.2, cost: .032 },
    mapleSyrup: { volume: 0.7, glucose: 0.33, fructose: 0.33, calories: 3.2, molarMass: 340, water: 0.25, cost: .032 },

    //water: { volume: 1.0, glucose: 0, fructose: 0, calories: 0, molarMass: 18, water: 1, osmolality: 0.000001},
};
for (const ingredient of Object.keys(INGREDIENTS)) {
    if (INGREDIENTS[ingredient].osmolality === undefined && INGREDIENTS[ingredient].molarMass !== undefined && INGREDIENTS[ingredient].molarMass !== undefined) {
        INGREDIENTS[ingredient].osmolality = 1 / (INGREDIENTS[ingredient].molarMass);
    }
}

// Generate dynamic properties based on the ingredients table
const ingredientProperties = {};
Object.keys(INGREDIENTS).forEach(ingredient => {
    ingredientProperties[`${ingredient}G`] = { type: Number };
    ingredientProperties[suffixCamelCase("use",ingredient)] = { type: Boolean };
    ingredientProperties[suffixCamelCase("amount", ingredient)] = { type: Number }; // Add this line


});


export class GelRecipeCalculator extends LitElement {
    static properties = {
        duration: { type: String },
        carbohydrateG: { type: Number },
        glucoseRatio: { type: Number },
        fructoseRatio: { type: Number },
        carbsPerHour: { type: Number },
        calories: {type: Number},
        volumeMl: {type: Number},
        weightG: {type: Number},
        osmolalityMOsmL: {type: Number},
        targetOsmolality: { type: Number },
        targetGlucoseG: { type: Number },
        targetFructoseG: { type: Number },
        waterG: { type: Number },
        cost: {type: Number},
        foundSolution: {type: Boolean},
        ...ingredientProperties
    };


    static styles = css`
      :host {
      }
    `;

    constructor() {
        super();

        // Default recipe
        this.duration = '4:00'
        this.carbsPerHour = 60
        this.useFructose = true
        this.useMaltodextrin = true
        this.targetOsmolality = 3400
        this.glucoseRatio = 3
        this.fructoseRatio = 1
        // Initialize ingredient amounts to null
        Object.keys(INGREDIENTS).forEach(ingredient => {
            this[suffixCamelCase("amount", ingredient)] = null;
        });
        this.calculateIngredients()
    }

    // Calculate ingredient quantities based on body mass, duration, and units
    calculateIngredients() {
        const [hours, minutes] = this.duration.split(':').map(parseFloat);
        const durationInHours = hours + minutes / 60;
        this.carbohydrateG = this.carbsPerHour * durationInHours
        let targetCarbs = this.carbohydrateG
        this.targetFructoseG = (this.fructoseRatio / (this.glucoseRatio + this.fructoseRatio)) * this.carbohydrateG
        this.targetGlucoseG = (this.glucoseRatio / (this.glucoseRatio + this.fructoseRatio)) * this.carbohydrateG
        let targetFructose = this.targetFructoseG
        let targetGlucose = this.targetGlucoseG
        // Subtract away ingredients that the user has manually specified
        for (const ingredient of Object.keys(INGREDIENTS)) {
            if (this[suffixCamelCase("use", ingredient)] && this[suffixCamelCase("amount", ingredient)] !== null){
                let amount = this[suffixCamelCase("amount", ingredient)]
                targetFructose -= amount * INGREDIENTS[ingredient].fructose
                targetGlucose -= amount * INGREDIENTS[ingredient].glucose
                targetCarbs -= amount * (INGREDIENTS[ingredient].glucose + INGREDIENTS[ingredient].fructose)
            }
        }



        const model = {
            direction: "minimize",
            objective: "mass",
            constraints: {
                glucose: { equal: targetGlucose },
                fructose: { equal: targetFructose },
                carbs: { equal: targetCarbs }
            },
            variables: {
            }
        }

        // Define variables for the model
        Object.keys(INGREDIENTS).forEach(ingredient => {
            // Check each `use` variable to see if we should include it in the model
            // If we should, add it to the model
            if (!this[suffixCamelCase("use", ingredient)]) {
                return
            }
            if (this[suffixCamelCase("amount", ingredient)] !== null){
                return
            }
            model.variables[ingredient] = {
                glucose: INGREDIENTS[ingredient].glucose,
                fructose: INGREDIENTS[ingredient].fructose,
                calories: INGREDIENTS[ingredient].calories,
                carbs: INGREDIENTS[ingredient].glucose + INGREDIENTS[ingredient].fructose,
                volume: INGREDIENTS[ingredient].volume,
                osmolality: INGREDIENTS[ingredient].osmolality,
                mass: 1,
            };
        });

        this.model = model
        const solution = solve(model)
        this.foundSolution = solution.status !== "infeasible"
        // Solution has assigned values for each ingredient. Let's use them to calculate the final values
        // Set others to 0
        for (const ingredient of Object.keys(INGREDIENTS)) {
            if (this[suffixCamelCase("amount", ingredient)] !== null) {
                this[ingredient + 'G'] = this[suffixCamelCase("amount", ingredient)]
            } else {
                this[ingredient + 'G'] = 0
            }
        }
        for (const [key, value] of Object.values(solution.variables)) {
            this[key + 'G'] = value
        }

        const ingredientWaterMl = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].water, 0)
        const osmoles = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].osmolality, 0)
        const desiredOsmolality_Osm_per_L = this.targetOsmolality / 1000;
        const waterToAdd = (osmoles / desiredOsmolality_Osm_per_L) * 1000 - ingredientWaterMl;
        this.waterG = waterToAdd;
        this.osmolalityMOsmL = (osmoles * 1000) / ((ingredientWaterMl + waterToAdd) / 1000);
        this.calories = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].calories, 0)
        this.volumeMl = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].volume, 0) + this.waterG
        this.weightG = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`], 0) + this.waterG
        this.cost = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].cost, 0)


    }
    errorHint(){
        let errorString = "No solution found."
        let targetGlucose = this.model.constraints.glucose.equal
        let targetFructose = this.model.constraints.fructose.equal
        if (targetGlucose < 0 || targetFructose < 0){
            if (targetGlucose < 0 && targetFructose < 0){
                errorString += ` Try removing ${-this.model.constraints.glucose.equal.toFixed(0)}g of glucose and ${-this.model.constraints.fructose.equal.toFixed(0)} of fructose.`
            } else if (targetGlucose < 0){
                errorString += ` Try removing ${-this.model.constraints.glucose.equal}g of glucose.`
            }
            if (targetFructose < 0){
                errorString += ` Try removing ${-this.model.constraints.fructose.equal}g of fructose.`
            }
        } else {
            errorString += " Try removing a constraint or adding a new ingredient."
        }
        return html`<p>${errorString}</p>`
    }

    onDurationChange(event) {
        this.duration = event.target.value;
        this.calculateIngredients();
    }
    onGlucoseRatioChange(event) {
        this.glucoseRatio = parseFloat(event.target.value);
        this.calculateIngredients();
    }
    onFructoseRatioChange(event) {
        this.fructoseRatio = parseFloat(event.target.value);
        this.calculateIngredients();
    }
    onCarbsPerHourChange(event) {
        this.carbsPerHour = parseFloat(event.target.value);
        this.calculateIngredients();
    }
    onOsmolalityChange(event) {
        this.targetOsmolality = parseFloat(event.target.value);
        this.calculateIngredients();
    }
    onIngredientChange(event, ingredient) {
        this[suffixCamelCase("use", ingredient)] = event.target.checked;
        if (!this[suffixCamelCase("use", ingredient)]) {
            this[suffixCamelCase("amount", ingredient)] = null;
        }
        this.calculateIngredients();
    }

    onIngredientAmountChange(event, ingredient) {
        const value = parseFloat(event.target.value);
        if (Number.isNaN(value)) {
            // User cleared the input box
            this[suffixCamelCase("amount", ingredient)] = null;
        }
        else if (value === 0 || value === null) {
            this[suffixCamelCase("use", ingredient)] = false;
            this[suffixCamelCase("amount", ingredient)] = null;
        } else if (value > 0) {
            this[suffixCamelCase("use", ingredient)] = true;
            this[suffixCamelCase("amount", ingredient)] = value;
        }
        this.calculateIngredients();
    }

    render() {
        return html`
      <label for="duration">Duration (hh:mm):</label>
      <input
              id="duration"
              type="text"
              .value="${this.duration}"
              @input="${this.onDurationChange}"
      />
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
      <label for="glucoseRatio">Glucose:fructose ratio</label>
      <input
              id="glucoseRatio"
              type="number"
              .value="${this.glucoseRatio}"
              @input="${this.onGlucoseRatioChange}"
      /> : <input
              id="fructoseRatio"
              type="number"
              .value="${this.fructoseRatio}"
              @input="${this.onFructoseRatioChange}"
      />

      
      <br />
      <label for="osmolality">Osmolality (mOsm/L):</label>
      <input
              id="osmolality"
              type="range"
              min="300"
              max="8000"
              step="100"
              .value="${this.targetOsmolality}"
              @input="${this.onOsmolalityChange}"
      />
      <span>${this.targetOsmolality} mOsm/L</span>
      <br />
      ${Object.keys(INGREDIENTS).map(ingredient => html`
        <label for="${ingredient}">${camelCaseToSplitWords(ingredient)}:</label>
        <input id="${ingredient}" type="checkbox" .checked="${this[suffixCamelCase("use", ingredient)]}"
               @change="${e => this.onIngredientChange(e, ingredient)}"/>
        <input id="${suffixCamelCase('amount', ingredient)}" type="number" step="1"
               .value="${this[suffixCamelCase('amount', ingredient)]}"
               @input="${e => this.onIngredientAmountChange(e, ingredient)}"/>g
        ${this[suffixCamelCase('amount', ingredient)] === null ? '' : html`<small><i>glucose
          ${Math.round(INGREDIENTS[ingredient].glucose * this[suffixCamelCase('amount', ingredient)])}g fructose
          ${Math.round(INGREDIENTS[ingredient].fructose * this[suffixCamelCase('amount', ingredient)])}g</i></small>`}


        <br/>
      `)}
      <hr/>
      
      ${this.foundSolution ? html`
        <table>
          <tbody>
          <tr>
            <td><b>Total Carbohydrate</b></td><td>${Math.ceil(this.carbohydrateG)}g</td>
          </tr>
          <tr>
            <td><b>Size</b></td>
            <td>${Math.ceil(this.volumeMl)}ml</td>
          </tr>
          <tr>
            <td><b>Weight</b></td>
            <td>${Math.ceil(this.weightG)}g</td>
          </tr>
          <tr>
            <td><b>Calories</b></td>
            <td>${Math.ceil(this.calories)} kcal</td>
          </tr>
            <tr><td colspan="2"><i>(${Math.round(this.targetGlucoseG)}g glucose, ${Math.round(this.targetFructoseG)}g fructose)</i></td></tr>
            <tr colspan="2"><td><hr></td></tr>
          ${Object.keys(INGREDIENTS).map(ingredient => html`
                    ${this[suffixCamelCase("use", ingredient)] ? html`<tr><td>${camelCaseToSplitWords(ingredient)}</td> <td>${Math.ceil(this[`${ingredient}G`])}g</td></tr>` : ''}
            
                `)}
            <tr><td>Water</td> <td>${Math.round(this.waterG)}ml</td></tr>
            <tr colspan="2"><td><hr></td></tr>
            <tr><td>Osmolality</td><td>${Math.ceil(this.osmolalityMOsmL)} mOsm/L</td></tr>
            <tr><td>Cost</td><td>$${(this.cost / 100).toFixed(2)}</td></tr>     
          </tbody>
          </table>` : this.errorHint()}


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
        <hr>
      <p><b>Caffeine</b>: ${Math.ceil(this.caffeineBeforeMg)}-${Math.ceil(this.caffeineBeforeMg) * 2}mg total</p>

    `;
    }
}

customElements.define('caffeine-calculator', CaffeineCalculator);
customElements.define('gel-recipe-calculator', GelRecipeCalculator);
