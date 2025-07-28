import { LitElement, css, html } from 'lit';
import {solve} from 'https://cdn.jsdelivr.net/npm/yalps@0.5.6/+esm';

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
// Solubility is g/ml
const INGREDIENTS = {
    // We assume malto is N glucose molecules (180g/mol), and subtract water molecules lost due to glycosidic bonds
    maltodextrin: {volume: 0.95, solubility: .5, glucose: 1.0, fructose: 0, molarMass: 1640, water: 0, cost: .0132, aka: "easier to stomach form of glucose"},
    fructose: {volume: 0.8, solubility: .79, glucose: 0, fructose: 1.0, molarMass: 180, water: 0, cost: .0132},
    dextrose: {volume: 0.7, solubility: .9, glucose: 1, fructose: 0, molarMass: 180, water: 0, cost: .01, aka: "pure glucose"},
    sugar: {volume: 0.75, solubility: 2, glucose: 0.5, fructose: 0.5, molarMass: 342, water: 0, cost: .0024, aka: "sucrose"},
    honey: {
        volume: 0.7,
        solubility: 2.2,
        glucose: 0.35,
        fructose: 0.4,
        calories: 3.2,
        molarMass: 155,
        water: 0.2,
        cost: .0110
    },
    // Maltose, glucose, maltotriose, in .5, .30, .20 ratio
    brownRiceSyrup: {
        volume: 0.7,
        solubility: 2,
        glucose: 0.75,
        fructose: 0.05,
        calories: 3.2,
        molarMass: 334,
        water: 0.20,
        cost: .013
    },
    molasses: {volume: 0.7, solubility: 4, glucose: 0.3, fructose: 0.2, molarMass: 196, water: 0.25, cost: .0201},
    agaveNectar: {volume: 0.7, solubility: 2, glucose: 0.2, fructose: 0.56, molarMass: 164, water: 0.2, cost: .033},
    mapleSyrup: {volume: 0.7, solubility: 3, glucose: 0.33, fructose: 0.33, molarMass: 280, water: 0.25, cost: .022},
    cornSyrup: {
        volume: 0.71,           // Based on density of ~1.4 g/mL vs water at 1.0 g/mL (1/1.4 ≈ 0.71)
        solubility: 6,
        glucose: 0.33,          // ~1/3 glucose by weight per research
        fructose: 0,            // Regular corn syrup has minimal fructose (unlike HFCS)
        molarMass: 200,         // Estimated average - mix of glucose (180), maltose (342), higher oligosaccharides
        water: 0.24,            // ~24% water content typical for liquid corn syrup
        cost: 0.008,            // ~$0.35/lb bulk = $0.008/g (35 cents per 453g)
        aka: "liquid glucose syrup, prevents crystallization"
    },
    salt: {
        volume: 0.9,
        solubility: .36,
        glucose: 0,
        fructose: 0,
        molarMass: 58,
        osmoles: 0.0342,
        water: 0,
        cost: 0.0015
    },
    citricAcid: {
        volume: 0.6,
        solubility: 1.33,      // Very high solubility: ~133g/100mL water at room temp
        glucose: 0,
        fructose: 0,
        molarMass: 192,        // C6H8O7 molecular weight
        osmoles: 0.0156,       // Triprotic acid, so 3 osmoles per mole
        water: 0,
        cost: 0.011,
        aka: "sour salt, preservative and pH adjuster"
    },
    water: {volume: 1.0, glucose: 0, fructose: 0, water: 1, osmoles: 0, cost: 0},
};
for (const ingredientName of Object.keys(INGREDIENTS)) {
    const ingredient = INGREDIENTS[ingredientName]
    if (ingredient.osmoles === undefined && ingredient.molarMass !== undefined) {
        // Turn g/mol to mol/g. Nothing we have disassociates so molar/osmolar concentration are the same, so that's osm/g, or osm/ml
        ingredient.osmoles = 1 / (ingredient.molarMass);
    }
    if (ingredient.solubility === undefined) {
        ingredient.solubility = 0
    }
    if (ingredient.calories === undefined) {
        ingredient.calories = (ingredient.fructose + ingredient.glucose) * 4
    }
}

// Generate dynamic properties based on the ingredients table
const ingredientProperties = {};
Object.keys(INGREDIENTS).forEach(ingredient => {
    ingredientProperties[`${ingredient}G`] = { type: Number };
    ingredientProperties[suffixCamelCase("use", ingredient)] = { type: Boolean };
    ingredientProperties[suffixCamelCase("amount", ingredient)] = { type: Number };
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
        osmolalityMOsmKg: {type: Number},
        fullyDissolve: {type: Boolean},
        saturation: {type: Number},
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
            font-family: var(--sans-serif-font-family);
      }
        .cursor-help {
            cursor: help;
        }
    `;

    constructor() {
        super();

        // Default recipe
        this.duration = '4:00'
        this.carbsPerHour = 60
        for (const ingredient of Object.keys(INGREDIENTS)) {
            this[suffixCamelCase("use", ingredient)] = false
            this[suffixCamelCase("amount", ingredient)] = null
        }
        this.useSugar = true
        this.useMaltodextrin = true
        this.useWater = true
        this.targetOsmolalityMOsmKg = 3400
        this.glucoseRatio = 3
        this.fructoseRatio = 1
        this.fullyDissolve = false
        this.optimizationObjective = 'volume';
        // Initialize ingredient amounts to null
        Object.keys(INGREDIENTS).forEach(ingredient => {
            this[suffixCamelCase("amount", ingredient)] = null;
        });
        // Restore state if available
        this.restoreState();

        this.calculateIngredients();
    }

    // Store the current state to session storage
    storeState() {
        const state = {
            duration: this.duration,
            carbsPerHour: this.carbsPerHour,
            glucoseRatio: this.glucoseRatio,
            fructoseRatio: this.fructoseRatio,
            fullyDissolve: this.fullyDissolve,
            optimizationObjective: this.optimizationObjective,
            targetOsmolalityMOsmKg: this.targetOsmolalityMOsmKg,
            ingredientStates: Object.keys(INGREDIENTS).reduce((acc, ingredient) => {
                acc[ingredient] = {
                    use: this[suffixCamelCase("use", ingredient)],
                    amount: this[suffixCamelCase("amount", ingredient)]
                };
                return acc;
            }, {})
        };
        sessionStorage.setItem('recipeState', JSON.stringify(state));
    }

    // Restore the state from session storage
    restoreState() {
        const savedState = sessionStorage.getItem('recipeState');
        if (savedState) {
            const state = JSON.parse(savedState);
            this.duration = state.duration || this.duration;
            this.carbsPerHour = state.carbsPerHour || this.carbsPerHour;
            this.glucoseRatio = state.glucoseRatio || this.glucoseRatio;
            this.fructoseRatio = state.fructoseRatio || this.fructoseRatio;
            this.fullyDissolve = state.fullyDissolve || this.fullyDissolve;
            this.optimizationObjective = state.optimizationObjective || this.optimizationObjective;
            this.targetOsmolalityMOsmKg = state.targetOsmolalityMOsmKg || this.targetOsmolalityMOsmKg;

            Object.keys(state.ingredientStates).forEach(ingredient => {
                this[suffixCamelCase("use", ingredient)] = state.ingredientStates[ingredient].use;
                this[suffixCamelCase("amount", ingredient)] = state.ingredientStates[ingredient].amount;
            });
        }
    }

    updated(changedProperties) {
        // Only store the state if relevant properties have changed
        if (
            changedProperties.has('duration') ||
            changedProperties.has('carbsPerHour') ||
            changedProperties.has('glucoseRatio') ||
            changedProperties.has('fructoseRatio') ||
            changedProperties.has('fullyDissolve') ||
            changedProperties.has('optimizationObjective') ||
            changedProperties.has('targetOsmolalityMOsmKg') ||
            Object.keys(INGREDIENTS).some(ingredient => changedProperties.has(suffixCamelCase("use", ingredient)) || changedProperties.has(suffixCamelCase("amount", ingredient)))
        ) {
            this.storeState();
        }
    }

    // Calculate ingredient quantities based on body mass, duration, and units
    calculateIngredients() {
        const [hours, minutes] = this.duration.split(':').map(parseFloat);
        const durationInHours = hours + minutes / 60;
        let targetCarbs = null
        if (this.duration && this.carbsPerHour) {
            targetCarbs = this.carbsPerHour * durationInHours
        }

        const model = {
            direction: "minimize",
            objective: this.optimizationObjective === "cost" ? "cost" : "volume",
            constraints: {
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
                netOsmolality: 1000 * ingredient.osmoles  - this.targetOsmolalityMOsmKg / 1000 * ingredient.water,
                // Net additional water needed per gram (accounting for water already in ingredient) to reach 100% saturation
                netSolubility: ingredient.solubility > 0 ? (1 / ingredient.solubility) - ingredient.water : -ingredient.water,
                netCarbSourceRatio: ingredient.glucose * this.fructoseRatio  - ingredient.fructose * this.glucoseRatio,
                mass: 1,
            };
            model.variables[ingredientName][`target${ingredientName}`] = 1
            if (this[suffixCamelCase("amount", ingredientName)] !== null){
                model["constraints"][`target${ingredientName}`] = {equal: this[suffixCamelCase("amount", ingredientName)]}
            }
        });

        if (this.glucoseRatio !== null && this.fructoseRatio !== null) {
            model["constraints"].netCarbSourceRatio = { equal: 0 }
        }
        if (targetCarbs !== null) {
            model["constraints"].carbs =  { equal: targetCarbs }
        }
        if (this.fullyDissolve) {
            model["constraints"].netSolubility = {equal: 0}
        } else if (this.amountWater === null && this.targetOsmolalityMOsmKg !== null) {
            model["constraints"].netOsmolality = {equal: 0}
        }

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
            this[ingredient + 'G'] = 0
        }
        for (const [key, value] of Object.values(solution.variables)) {
            this[key + 'G'] = value
        }

        const allWater = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].water, 0)
        this.waterFromIngredients = allWater - this.waterG
        this.saturation = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + (INGREDIENTS[ingredient].solubility > 0 ? this[`${ingredient}G`] / INGREDIENTS[ingredient].solubility: 0), 0)
        this.saturation /= allWater
        const osmoles = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].osmoles, 0)
        this.osmolalityMOsmKg = osmoles * 1000 / (allWater / 1000)
        this.calories = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].calories, 0)
        this.volumeMl = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].volume, 0)
        this.weightG = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`], 0)
        this.cost = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].cost, 0)
        this.recipeFructose = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].fructose, 0)
        this.recipeGlucose = Object.keys(INGREDIENTS).reduce((acc, ingredient) => acc + this[`${ingredient}G`] * INGREDIENTS[ingredient].glucose, 0)
        this.carbohydrateG = this.recipeFructose + this.recipeGlucose
    }
    errorHint(){
        let errorString = "No solution found."
        errorString += " Try removing a constraint or adding a new ingredient."
        return html`<p class="alert alert-warning">${errorString}</p>`
    }

    onDurationChangePart(event, part) {
        let [hours, minutes] = this.duration.split(':').map(Number);
        const input = event.target
        const value = parseInt(event.target.value, 10);

        if (input.validity.badInput || input.validity.rangeUnderflow || input.validity.rangeOverflow || input.validity.stepMismatch ) {
            event.target.classList.add('is-invalid');
        } else {
            event.target.classList.remove('is-invalid');
            if (part === 'hours') {
                hours = value;
            } else {
                minutes = value;
            }
            this.duration = `${hours}:${minutes.toString().padStart(2, '0')}`;
            this.calculateIngredients();
        }
    }

    onRatioChange(event, type) {
        const input = event.target;
        const value = Number.isNaN(event.target.valueAsNumber) ? null : event.target.valueAsNumber
        const otherType = type === 'glucose' ? 'fructose' : 'glucose'
        const otherValue = this[`${otherType}Ratio`]
        const otherInput = this.shadowRoot.querySelector(`#${otherType}Ratio`)
        this[`${type}Ratio`] = value;

        if (value === null && otherValue !== null) {
            event.target.classList.add('is-invalid');
        } else if (value !== null && otherValue === null) {
            otherInput.classList.add('is-invalid');
        } else if (value === null && otherValue === null) {
            event.target.classList.remove('is-invalid');
            otherInput.classList.remove('is-invalid');
        } else {
            event.target.classList.remove('is-invalid');
        }
        let recompute = true
        if (input.validity.badInput || input.validity.rangeUnderflow || input.validity.rangeOverflow ) {
            event.target.classList.add('is-invalid');
            recompute = false
        }
        if (otherInput.validity.badInput || otherInput.validity.rangeUnderflow || otherInput.validity.rangeOverflow ) {
            otherInput.classList.add('is-invalid');
            recompute = false
        }

        if (recompute) {
            this.calculateIngredients();
        }

    }

    onCarbsPerHourChange(event) {
        const input = event.target;
        const value = event.target.valueAsNumber

        if (input.validity.badInput || input.validity.rangeUnderflow || input.validity.rangeOverflow ) {
            event.target.classList.add('is-invalid');
        } else {
            event.target.classList.remove('is-invalid');
            this.carbsPerHour = value;
            this.calculateIngredients();
        }
    }

    onOsmolalityChange(event) {
        const input = event.target;
        const value = event.target.valueAsNumber

        if (input.validity.badInput || input.validity.rangeUnderflow || input.validity.rangeOverflow || input.validity.valueMissing) {
            event.target.classList.add('is-invalid');
        } else {
            event.target.classList.remove('is-invalid');
            this.targetOsmolalityMOsmKg = value;
            this.calculateIngredients();
        }
    }
    onSpecifiedWaterChange(event) {
        const input = event.target;
        const value = event.target.valueAsNumber

        if (event.target.value !== "") {
            this.shadowRoot.querySelector("#osmolality").disabled = true
            this.shadowRoot.querySelector("#fully-dissolve").disabled = true
        } else {
            this.shadowRoot.querySelector("#osmolality").removeAttribute("disabled")
            this.shadowRoot.querySelector("#fully-dissolve").removeAttribute("disabled")
        }

        if (input.validity.badInput || input.validity.rangeUnderflow || input.validity.rangeOverflow) {
            event.target.classList.add('is-invalid');
        } else {
            event.target.classList.remove('is-invalid');
            if (Number.isNaN(value)) {
                // User cleared the input box
                this.amountWater = null;
            } else {
                this.amountWater = value;
            }
            this.calculateIngredients();
        }
    }
    onFullyDissolveChange(event) {
        this.fullyDissolve = event.target.checked
        if (this.fullyDissolve) {
            this.shadowRoot.querySelector("#osmolality").disabled = true
            this.shadowRoot.querySelector("#water").disabled = true
        } else {
            this.shadowRoot.querySelector("#osmolality").removeAttribute("disabled")
            this.shadowRoot.querySelector("#water").removeAttribute("disabled")
        }
        this.calculateIngredients()


    }
    onIngredientChange(event, ingredient) {
        this[suffixCamelCase("use", ingredient)] = event.target.checked;
        if (!this[suffixCamelCase("use", ingredient)]) {
            this[suffixCamelCase("amount", ingredient)] = null;
        }
        this.calculateIngredients();
    }

    onIngredientAmountChange(event, ingredient) {
        const input = event.target;
        const value = event.target.valueAsNumber

        if (input.validity.badInput || input.validity.rangeUnderflow || input.validity.rangeOverflow ) {
            event.target.classList.add('is-invalid');
        } else {
            event.target.classList.remove('is-invalid');

            if (Number.isNaN(value)) {
                // User cleared the input box
                this[suffixCamelCase("amount", ingredient)] = null;
            } else if (value === 0 || value === null) {
                this[suffixCamelCase("use", ingredient)] = false;
                this[suffixCamelCase("amount", ingredient)] = null;
            } else if (value > 0) {
                this[suffixCamelCase("use", ingredient)] = true;
                this[suffixCamelCase("amount", ingredient)] = value;
            }

            this.calculateIngredients();
        }
    }
    onObjectiveChange(event) {
        this.optimizationObjective = event.target.value;
        this.calculateIngredients();
    }

    render() {
        return html`
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

          <div class="row mb-1">
          <div class="col-sm-7 col-12">
            <div class="input-group">
              <label for="hours" class="input-group-text">Duration</label>
              <input
                      id="hours"
                      type="number"
                      min="0"
                      class="form-control form-control-sm"
                      .value="${this.duration.split(':')[0]}"
                      @input="${e => this.onDurationChangePart(e, 'hours')}"
              />
              <span class="input-group-text">hours</span>
              <input
                      id="minutes"
                      type="number"
                      min="0"
                      max="59"
                      class="form-control form-control-sm"
                      .value="${this.duration.split(':')[1]}"
                      @input="${e => this.onDurationChangePart(e, 'minutes')}"
              />
              <span class="input-group-text">mins</span>
            </div>
          </div>

            <div class="col-sm-5 col-12">
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
          </div>

            <div class="mb-1">
              <div class="input-group">
                <label for="glucoseRatio" class="input-group-text">Glucose</label>
                <input
                        id="glucoseRatio"
                        type="number"
                        min="0"
                        class="form-control"
                        .value="${this.glucoseRatio}"
                        @input="${e => this.onRatioChange(e, 'glucose')}"
                />
                <span class="input-group-text">:</span>
                <label for="fructoseRatio" class="input-group-text">Fructose</label>
                <input
                        id="fructoseRatio"
                        type="number"
                        min="0"
                        class="form-control"
                        .value="${this.fructoseRatio}"
                        @input="${e => this.onRatioChange(e, 'fructose')}"
                />
              </div>
            </div>

            <div class="mb-1 row align-items-center">
              <div class="col-12 col-sm-7">
                  <div class="input-group">
                    <label for="osmolality" class="input-group-text">Osmolality</label>
                    <input
                            id="osmolality"
                            type="number"
                            min="300"
                            max="8000"
                            step="100"
                            class="form-control form-control-sm"
                            required
                            .value="${this.targetOsmolalityMOsmKg}"
                            @input="${this.onOsmolalityChange}"
                    />
                    <span class="input-group-text">mOsm/kg</span>
                  </div>
              </div>
              <div class="col-12 col-sm-5">
                <div class="input-group">
                  <label for="water" class="input-group-text">Water</label>
                  <input
                          id="water"
                          type="number"
                          min="0"
                          step="1"
                          class="form-control form-control-sm"
                          required
                          .value="${this.specifiedWater}"
                          @input="${this.onSpecifiedWaterChange}"
                  />
                  <span class="input-group-text">g</span>
                </div>
              </div>
            </div>
          <div class="row mb-3 ">
            <div class="col-auto">
              <div class="form-check">
                <input class="form-check-input cursor-help" type="checkbox" id="fully-dissolve"         
                       .value="${this.fullyDissolve}"
                       @input="${this.onFullyDissolveChange}"
                       title="Automatically calculate water needed to fully dissolve the ingredients. Will be like a sports drink."
                />
                <label class="form-check-label" for="fully-dissolve">
                  Fully dissolve
                </label>
              </div>
            </div>

          </div>

            <div class="row">
            ${Object.keys(INGREDIENTS).filter(x => x !== 'water').map(ingredient => html`
 
              <div class="mb-1 col-sm-6 col-12">
                <div class="input-group">
                  <div class="input-group-text">
                    <input
                            id="${ingredient}"
                            type="checkbox"
                            class="form-check-input mt-0"
                            .checked="${this[suffixCamelCase("use", ingredient)]}"
                            @change="${e => this.onIngredientChange(e, ingredient)}"
                    />
                    <label class="form-check-label ms-2 cursor-help" for="${ingredient}" title="${INGREDIENTS[ingredient].aka? INGREDIENTS[ingredient].aka + ', ' : "" }glucose:fructose ${glucoseFructoseRatio(ingredient)}">${camelCaseToSplitWords(ingredient)}</label>
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
            </div>

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
                  <td>${this.carbohydrateG ? html`${Math.ceil(this.carbohydrateG)}g <i
                          class="text-secondary small">${Math.round(this.recipeGlucose)}g:${Math.round(this.recipeFructose)}g</i>` : html`0g`}
                  </td>
                </tr>
                <tr>
                  <td><b>Volume</b></td>
                  <td title="~${(this.volumeMl * 0.034).toFixed(2)}oz">~${Math.ceil(this.volumeMl)}ml</td>
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
                      <td class="${ this[`${ingredient}G`] === 0 ? 'text-secondary' : ''}">${camelCaseToSplitWords(ingredient)}</td>
                      <td class="${ this[`${ingredient}G`] === 0 ? 'text-secondary' : ''} cursor-help" title="${(INGREDIENTS[ingredient].glucose * this[`${ingredient}G`]).toFixed(1)}g:${(INGREDIENTS[ingredient].fructose * this[`${ingredient}G`]).toFixed(1)}g">${Math.ceil(this[`${ingredient}G`])}g</td>
                    </tr>
                  ` : ''}
                `)}
                <tr>
                  <td>Water</td>
                  <td>${Math.ceil(this.waterG)}g ${this.waterFromIngredients > 0 ? html`<i
                          class="small text-secondary">(+${Math.ceil(this.waterFromIngredients)}g from
                    ingredients)</i>` : html``}
                  </td>
                </tr>
                </tbody>
                <tbody class="table-group-divider">
                <tr>
                  <td>Concentration</td>
                  <td>${Math.ceil(this.osmolalityMOsmKg)} mOsm/kg</td>
                </tr>
                <tr>
                  <td>Saturation</td>
                  <td>${(this.saturation * 100).toFixed(0)} %</td>
                </tr>
                <tr>
                  <td>Cost</td>
                  <td>$${(this.cost).toFixed(2)}</td>
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
          font-family: var(--sans-serif-font-family);
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
        this.duration = event.target.valueAsNumber
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
