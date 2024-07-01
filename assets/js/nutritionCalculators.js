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
// Volume is ml/g. For powders a value of the ml/g in solution accounting for solubility.
// Molar mass is g/mol
const INGREDIENTS = {
    // We assume malto is N glucose molecules (180g/mol), and subtract water molecules lost due to glycosidic bonds
    maltodextrin: { volume: 0.95, glucose: 1.0, fructose: 0, calories: 4.0, molarMass: 1640, water: 0, cost: .0133 },
    fructose: { volume: 0.8, glucose: 0, fructose: 1.0, calories: 4.0, molarMass: 180, water: 0, cost: .02 },
    sugar: { volume: 0.75, glucose: 0.5, fructose: 0.5, calories: 4.0, molarMass: 342, water: 0, cost: .004 },
    honey: { volume: 0.7, glucose: 0.35, fructose: 0.4, calories: 2.85, molarMass: 155, water: 0.2, cost: .0133 },
    // Maltose, glucose, maltotriose, in .5, .30, .20 ratio
    brownRiceSyrup: { volume: 0.7, glucose: 0.75, fructose: 0.05, calories: 3.0, molarMass: 334, water: 0.05, cost: .013 },
    molasses: { volume: 0.7, glucose: 0.3, fructose: 0.2, calories: 3.2, molarMass: 196, water: 0.25, cost: .009 },
    agaveNectar: { volume: 0.7, glucose: 0.2, fructose: 0.56, calories: 3.0, molarMass: 164, water: 0.2, cost: .032 },
    mapleSyrup: { volume: 0.7, glucose: 0.33, fructose: 0.33, calories: 3.2, molarMass: 280, water: 0.25, cost: .032 },
    water: { volume: 1.0, glucose: 0, fructose: 0, calories: 0, water: 1, osmoles: 0, cost: 0},
};
for (const ingredient of Object.keys(INGREDIENTS)) {
    if (INGREDIENTS[ingredient].osmoles === undefined && INGREDIENTS[ingredient].molarMass !== undefined && INGREDIENTS[ingredient].molarMass !== undefined) {
        // Turn g/mol to mol/g. Nothing we have disassociates so molar/osmolar concentration are the same, so that's osm/g, or osm/ml
        INGREDIENTS[ingredient].osmoles = 1 / (INGREDIENTS[ingredient].molarMass);
    }
}

// Generate dynamic properties based on the ingredients table
const ingredientProperties = {};
Object.keys(INGREDIENTS).forEach(ingredient => {
    ingredientProperties[`${ingredient}G`] = { type: Number };
    ingredientProperties[suffixCamelCase("use",ingredient)] = { type: Boolean };
    ingredientProperties[suffixCamelCase("amount", ingredient)] = { type: Number }; // Add this line


});

function glucoseFructoseRatio(ingredientName) {
    const ingredient = INGREDIENTS[ingredientName];
    if (ingredient.fructose === 0) {
        return "1:0";
    }
    if (ingredient.glucose === 0) {
        return "0:1"
    }

    let glucose = ingredient.glucose;
    let fructose = ingredient.fructose;

    if (glucose < 1.0) {
        fructose = (fructose / glucose);
        glucose = 1.0;
    }
    if (fructose < 1.0) {
        glucose = (glucose / fructose);
        fructose = 1.0;
    }

    // Remove decimal places for integers
    glucose = parseFloat(glucose.toFixed(2)).toString();
    fructose = parseFloat(fructose.toFixed(2)).toString();

    return `${glucose}:${fructose}`;
}


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
        optimizationObjective: { type: String },
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
        this.useWater = true
        this.targetOsmolalityMOsmL = 3400
        this.glucoseRatio = 3
        this.fructoseRatio = 1
        this.optimizationObjective = 'volume';
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
            objective: this.optimizationObjective === "cost" ? "cost" : "mass",
            constraints: {
                glucose: { equal: targetGlucose },
                fructose: { equal: targetFructose },
                carbs: { equal: targetCarbs },
                netOsmolality: {equal: 0}
            },
            variables: {
            }
        }

        // Define variables for the model
        Object.keys(INGREDIENTS).forEach(ingredientName => {
            // Check each `use` variable to see if we should include it in the model
            // If we should, add it to the model
            if (!this[suffixCamelCase("use", ingredientName)]) {
                return
            }
            if (this[suffixCamelCase("amount", ingredientName)] !== null){
                return
            }
            const ingredient = INGREDIENTS[ingredientName]
            model.variables[ingredientName] = {
                glucose: ingredient.glucose,
                fructose: ingredient.fructose,
                calories: ingredient.calories,
                carbs: ingredient.glucose + ingredient.fructose,
                volume: ingredient.volume,
                osmoles: ingredient.osmoles,
                water: ingredient.water,
                cost: ingredient.cost,
                netOsmolality: 1000 * ingredient.osmoles  - this.targetOsmolalityMOsmL / 1000 * ingredient.water,
                mass: 1,
            };
        });

        // ingredients = X
        // Osmolality =
        // o*x / w*x = target
        // o*x = target (w*x)
        // o*x - (target (w*x)) = 0
        // sum_i ( o_i - target * w_i) x = 0
        //         ^^^^^^^^^^^^^^^^^^^ Fresh coefficients specific to this constraint

        this.model = model
        console.log(model)
        const solution = solve(model)
        console.log(solution)
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

        const allWater = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].water, 0)
        this.waterFromIngredients = allWater - this.waterG
        const osmoles = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].osmoles, 0)
        this.osmolalityMOsmL = this.targetOsmolalityMOsmL
        this.calories = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].calories, 0)
        this.volumeMl = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].volume, 0)
        this.weightG = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`], 0)
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
        return html`<p class="alert alert-warning">${errorString}</p>`
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
        this.targetOsmolalityMOsmL = parseFloat(event.target.value);
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
    onObjectiveChange(event) {
        this.optimizationObjective = event.target.value;
        this.calculateIngredients();
    }

    render() {
        return html`
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

            <div class="mb-1">
              <div class="input-group">
                <label for="duration" class="input-group-text">Duration (hh:mm)</label>
                <input
                        id="duration"
                        type="text"
                        class="form-control form-control-sm"
                        .value="${this.duration}"
                        @input="${this.onDurationChange}"
                />
              </div>
            </div>

            <div class="mb-1">
              <div class="input-group">
                <label for="carbsPerHour" class="input-group-text">Carbs per hour</label>
                <input
                        id="carbsPerHour"
                        type="number"
                        min="0"
                        step="1"
                        class="form-control form-control-sm"
                        .value="${this.carbsPerHour}"
                        @input="${this.onCarbsPerHourChange}"
                />
                <span class="input-group-text">g</span>
              </div>
            </div>

            <div class="mb-1">
              <div class="input-group">
                <label for="glucoseRatio" class="input-group-text">Glucose</label>
                <input
                        id="glucoseRatio"
                        type="number"
                        class="form-control"
                        .value="${this.glucoseRatio}"
                        @input="${this.onGlucoseRatioChange}"
                />
                <span class="input-group-text">:</span>
                <label for="fructoseRatio" class="input-group-text">Fructose</label>
                <input
                        id="fructoseRatio"
                        type="number"
                        class="form-control"
                        .value="${this.fructoseRatio}"
                        @input="${this.onFructoseRatioChange}"
                />
              </div>
            </div>

            <div class="mb-3">
              <div class="input-group">
                <label for="osmolality" class="input-group-text">Osmolality</label>
                <input
                        id="osmolality"
                        type="number"
                        min="300"
                        max="8000"
                        step="100"
                        class="form-control form-control-sm"
                        .value="${this.targetOsmolalityMOsmL}"
                        @input="${this.onOsmolalityChange}"
                />
                <span class="input-group-text">mOsm/L</span>
              </div>
            </div>


            ${Object.keys(INGREDIENTS).filter(x => x !== 'water').map(ingredient => html`
 
              <div class="mb-1">
                <div class="input-group">
                  <div class="input-group-text">
                    <input
                            id="${ingredient}"
                            type="checkbox"
                            class="form-check-input mt-0"
                            .checked="${this[suffixCamelCase("use", ingredient)]}"
                            @change="${e => this.onIngredientChange(e, ingredient)}"
                    />
                    <label class="form-check-label ms-2" for="${ingredient}" title="Glucose to Fructose ratio: ${glucoseFructoseRatio(ingredient)}">${camelCaseToSplitWords(ingredient)}</label>
                  </div>
                  <input
                          id="${suffixCamelCase('amount', ingredient)}"
                          type="number"
                          min="0"
                          step="1"
                          class="form-control form-control-sm"
                          .value="${this[suffixCamelCase('amount', ingredient)]}"
                          @input="${e => this.onIngredientAmountChange(e, ingredient)}"
                  />
                  <span class="input-group-text">g</span>
                </div>
                ${this[suffixCamelCase('amount', ingredient)] === null ? '' : html`
                  <small class="form-text text-muted d-none">
                    <i>
                      glucose ${Math.round(INGREDIENTS[ingredient].glucose * this[suffixCamelCase('amount', ingredient)])}g
                      fructose ${Math.round(INGREDIENTS[ingredient].fructose * this[suffixCamelCase('amount', ingredient)])}g
                    </i>
                  </small>
                `}
              </div>
            `)}

          ${ false ? html`
          <div class="mb-3 mt-3">
            <div class="input-group">
             
              <label for="output-type" class="input-group-text">Optimize for</label>
              <div class="input-group-text">
                <div class="form-check form-check-inline">
                  <input
                          type="radio"
                          id="volume"
                          name="outputType"
                          value="volume"
                          class="form-check-input"
                          .checked="${this.optimizationObjective === 'volume'}"
                          @change="${this.onObjectiveChange}"
                  />
                  <label class="form-check-label ms-2" for="volume">Volume</label>
                </div>
                <div class="form-check form-check-inline">
                  <input
                          type="radio"
                          id="cost"
                          name="outputType"
                          value="cost"
                          class="form-check-input"
                          .checked="${this.optimizationObjective === 'cost'}"
                          @change="${this.onObjectiveChange}"
                  />
                  <label class="form-check-label ms-2" for="cost">Cost</label>
                </div>
              </div>
            </div>
          </div>` : ''}


            <hr/>

            ${this.foundSolution ? html`
              <table class="table table-sm mb-0">
                <tbody>
                <tr>
                  <td><b>Total Carbohydrate</b></td>
                  <td title="Glucose:Fructose ${Math.round(this.targetGlucoseG)}g:${Math.round(this.targetFructoseG)}g">${Math.ceil(this.carbohydrateG)}g</td>
                </tr>
                <tr>
                  <td><b>Size</b></td>
                  <td title="${(this.volumeMl * 0.034).toFixed(2)}oz">${Math.ceil(this.volumeMl)}ml</td>
                </tr>
                <tr>
                  <td><b>Weight</b></td>
                  <td>${Math.ceil(this.weightG)}g</td>
                </tr>
                <tr>
                  <td><b>Calories</b></td>
                  <td>${Math.ceil(this.calories)} kcal</td>
                </tr>

                </tbody>
                
                <tbody class="table-group-divider">
                ${Object.keys(INGREDIENTS).filter(x => x !== 'water').map(ingredient => html`
                  ${this[suffixCamelCase("use", ingredient)] ? html`
                    <tr>
                      <td>${camelCaseToSplitWords(ingredient)}</td>
                      <td title="${(INGREDIENTS[ingredient].glucose * this[`${ingredient}G`]).toFixed(1)}g:${(INGREDIENTS[ingredient].fructose * this[`${ingredient}G`]).toFixed(1)}g">${Math.ceil(this[`${ingredient}G`])}g</td>
                    </tr>
                  ` : ''}
                `)}
                <tr>
                  <td>Water (to add)</td>
                  <td>${Math.ceil(this.waterG)}ml</td>
                </tr>
                <tr class=" small">
                  <td class="text-secondary ">Water (from ingredients)</td>
                  <td class="text-secondary ">${Math.ceil(this.waterFromIngredients)}ml</td>
                </tr>
                </tbody>
                <tbody class="table-group-divider">
                <tr>
                  <td>Osmolality</td>
                  <td>${Math.ceil(this.osmolalityMOsmL)} mOsm/L</td>
                </tr>
                <tr>
                  <td>Cost</td>
                  <td>$${(this.cost / 100).toFixed(2)}</td>
                </tr>
                </tbody>
              </table>
            ` : this.errorHint()}
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
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            <div class="mb-3">

              <div class="input-group">
                <label for="body-mass" class="input-group-text">Body Mass</label>
                <input
                        id="body-mass"
                        type="number"
                        step="1"
                        class="form-control"
                        .value="${this.bodyMass}"
                        @input="${this.onBodyMassChange}"
                />
                <div class="input-group-append">
                  <div class="input-group-text">
                    <div class="form-check form-check-inline">
                      <input
                              type="radio"
                              id="kg"
                              name="units"
                              value="kg"
                              class="form-check-input"
                              ?checked="${this.bodyMassUnits === 'kg'}"
                              @change="${this.onUnitsChange}"
                      />
                      <label class="form-check-label" for="kg">kg</label>
                    </div>
                    <div class="form-check form-check-inline">
                      <input
                              type="radio"
                              id="lb"
                              name="units"
                              value="lb"
                              class="form-check-input"
                              ?checked="${this.bodyMassUnits === 'lb'}"
                              @change="${this.onUnitsChange}"
                      />
                      <label class="form-check-label" for="lb">lb</label>
                    </div>
                  </div>
                </div>
              </div>

    </div>

        <hr>

            <table class="table table-sm table-borderless mb-0">
                <tbody>
                <tr>
                    <td><b>Caffeine</b></td>
                    <td>${Math.ceil(this.caffeineBeforeMg)}-${Math.ceil(this.caffeineBeforeMg) * 2}mg total</td>
                </tr>
                </tbody>
            </table>
            `;


    }
}

customElements.define('caffeine-calculator', CaffeineCalculator);
customElements.define('gel-recipe-calculator', GelRecipeCalculator);
