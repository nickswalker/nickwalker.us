import { LitElement, css, html } from 'lit';
import {map} from 'lit-html/directives/map.js';

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
// Solubility is g/ml (e.g. 0.5 means 0.5g dissolves in 1ml of water at saturation)
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
        activeAmountControl: {type: String},
        activeThicknessControl: {type: String},
        duration: { type: String },
        carbohydrateG: { type: Number },
        glucoseRatio: { type: Number },
        fructoseRatio: { type: Number },
        carbsPerHour: { type: Number },
        targetVolumeMl: {type: Number},
        targetCarbsG: {type: Number},
        calories: {type: Number},
        volumeMl: {type: Number},
        weightG: {type: Number},
        osmolalityMOsmKg: {type: Number},
        fullyDissolve: {type: Boolean},
        saturation: {type: Number},
        targetOsmolalityMOsmKg: {type: Number},
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

        .nav-link {
            padding: 0;
            padding-bottom: 0px;
            cursor: pointer;
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

        
    `;

    constructor() {
        super();

        for (const ingredient of Object.keys(INGREDIENTS)) {
            this[suffixCamelCase("use", ingredient)] = false
            this[suffixCamelCase("amount", ingredient)] = null
        }

        this.activeAmountControl = "duration";
        this.activeThicknessControl = "concentration";
        this.carbsPerHour = null;
        this.duration = null;
        this.fructoseRatio = null;
        this.glucoseRatio = null;
        this.targetOsmolalityMOsmKg = null;
        this.fullyDissolve = false;
        this.optimizationObjective = "volume";
        this.targetVolumeMl = null;
        this.targetCarbsG = null;

        // NOTE: to be valid, each recipe must have A) a target duration and carb rate or B) a target amount of carbs or C) manually specified amounts of ingredients.
        this.recipePresets = [
            {
                label: 'Default', value: {
                    "useMaltodextrin": true,
                    "useSugar": true,
                    "useWater": true,
                    "fructoseRatio": 1.0,
                    "glucoseRatio": 3.0,
                    "targetCarbsG": 25,
                    "targetOsmolalityMOsmKg": 3400,
                    "fullyDissolve": false,
                    "optimizationObjective": "volume",
                }
            },
            {
                label: '\"Maurten 100\" Gel', value: {
                    "useMaltodextrin": true,
                    "useFructose": true,
                    "useWater": true,
                    "amountWater": 20,
                    "fructoseRatio": 0.8,
                    "glucoseRatio": 1.0,
                    "targetCarbsG": 25,
                }
            },
            {
                label: 'Natural Gel', value: {
                    "useHoney": true,
                    "useBrownRiceSyrup": true,
                    "useMolasses": true,
                    "useWater": true,
                    "targetOsmolalityMOsmKg": 3400,
                    "targetCarbsG": 25,
                    "fructoseRatio": 1,
                    "glucoseRatio": 3,
                    "amountMolasses": 5,
                }
            },
            {
                label: 'Yellow \"Gatorade\"', value:
                    {
                        "useCitricAcid": true,
                        "useSalt": true,
                        "useSugar": true,
                        "useWater": true,
                        "fructoseRatio": null,
                        "glucoseRatio": null,
                        "amountWater": 450,
                        "amountSugar": 50,
                        "amountCitricAcid": 2.0,
                        "amountSalt": 1.0,
                    }
            },
        ];

        // NOTE: All values above are implicit defaults, which we pull here before we restore state.
        this.defaults = this.getRecipe()
        this.setRecipe(this.recipePresets[0].value);
        // Restore state if available
        this.restoreState();

        this.calculateIngredients();
    }

    // Store the current state to session storage
    storeState() {
        const state = {
            activeAmountControl: this.activeAmountControl,
            activeThicknessControl: this.activeThicknessControl,
            duration: this.duration,
            carbsPerHour: this.carbsPerHour,
            targetVolumeMl: this.targetVolumeMl,
            targetCarbsG: this.targetCarbsG,
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
            this.activeAmountControl = state.activeAmountControl || this.activeAmountControl;
            this.activeThicknessControl = state.activeThicknessControl || this.activeThicknessControl;
            this.duration = state.duration
            this.carbsPerHour = state.carbsPerHour
            this.targetVolumeMl = state.targetVolumeMl
            this.targetCarbsG = state.targetCarbsG
            this.glucoseRatio = state.glucoseRatio
            this.fructoseRatio = state.fructoseRatio
            this.fullyDissolve = state.fullyDissolve
            this.optimizationObjective = state.optimizationObjective
            this.targetOsmolalityMOsmKg = state.targetOsmolalityMOsmKg

            if (state.ingredientStates) {
                Object.keys(state.ingredientStates).forEach(ingredient => {
                    this[suffixCamelCase("use", ingredient)] = state.ingredientStates[ingredient].use;
                    this[suffixCamelCase("amount", ingredient)] = state.ingredientStates[ingredient].amount;
                });
            }
        }
    }

    updated(changedProperties) {
        // Only store the state if relevant properties have changed
        if (
            changedProperties.has('activeAmountControl') ||
            changedProperties.has('activeThicknessControl') ||
            changedProperties.has('duration') ||
            changedProperties.has('carbsPerHour') ||
            changedProperties.has('targetVolumeMl') ||
            changedProperties.has('targetCarbsG') ||
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
        let targetCarbs = null

        // Determine target carbs based on active control mode
        if (this.activeAmountControl === "duration" && this.duration && this.carbsPerHour) {
            const [hours, minutes] = this.duration.split(':').map(parseFloat);
            const durationInHours = hours + minutes / 60;
            targetCarbs = this.carbsPerHour * durationInHours
        } else if (this.activeAmountControl === "carbs" && this.targetCarbsG) {
            targetCarbs = this.targetCarbsG;
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

        // Add volume constraint for volume mode
        if (this.activeAmountControl === "volume" && this.targetVolumeMl) {
            model["constraints"].volume = {equal: this.targetVolumeMl}
        }

        // Apply thickness control constraints
        if (this.activeThicknessControl === "dissolve" && this.fullyDissolve) {
            model["constraints"].netSolubility = {equal: 0}
        } else if (this.activeThicknessControl === "water" && this.amountWater !== null) {
            // Water amount is specified, don't add osmolality constraint
        } else if (this.activeThicknessControl === "concentration" && this.targetOsmolalityMOsmKg !== null) {
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

    onAmountControlTabChange(tabName) {
        this.activeAmountControl = tabName;
        this.calculateIngredients();
    }

    onThicknessControlTabChange(tabName) {
        this.activeThicknessControl = tabName;

        // Clear conflicting constraints when switching modes
        if (tabName === "water") {
            this.targetOsmolalityMOsmKg = null;
            this.fullyDissolve = false;
        } else if (tabName === "concentration") {
            this.amountWater = null;
            this.fullyDissolve = false;
        } else if (tabName === "dissolve") {
            this.amountWater = null;
            this.targetOsmolalityMOsmKg = null;
            this.fullyDissolve = true;
        }

        this.calculateIngredients();
    }

    onDurationChangePart(event, part) {
        if (!this.duration) {
            event.target.classList.remove('is-invalid');
            this.calculateIngredients();
        }
        let [hours, minutes] = [0, 0]
        if (this.duration) {
            [hours, minutes] = this.duration.split(':').map(parseInt);
        }
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

    onTargetVolumeChange(event) {
        const input = event.target;
        const value = event.target.valueAsNumber

        if (input.validity.badInput || input.validity.rangeUnderflow || input.validity.rangeOverflow) {
            event.target.classList.add('is-invalid');
        } else {
            event.target.classList.remove('is-invalid');
            this.targetVolumeMl = Number.isNaN(value) ? null : value;
            this.calculateIngredients();
        }
    }

    onTargetCarbsChange(event) {
        const input = event.target;
        const value = event.target.valueAsNumber

        if (input.validity.badInput || input.validity.rangeUnderflow || input.validity.rangeOverflow) {
            event.target.classList.add('is-invalid');
        } else {
            event.target.classList.remove('is-invalid');
            this.targetCarbsG = Number.isNaN(value) ? null : value;
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

            // Auto-switch to concentration mode when user directly interacts with osmolality
            if (this.activeThicknessControl !== 'concentration') {
                this.activeThicknessControl = 'concentration';
                this.amountWater = null;
                this.fullyDissolve = false;
            }

            this.calculateIngredients();
        }
    }

    onSpecifiedWaterChange(event) {
        const input = event.target;
        const value = event.target.valueAsNumber

        if (input.validity.badInput || input.validity.rangeUnderflow || input.validity.rangeOverflow) {
            event.target.classList.add('is-invalid');
        } else {
            event.target.classList.remove('is-invalid');
            if (Number.isNaN(value)) {
                // User cleared the input box
                this.amountWater = null;
            } else {
                this.amountWater = value;

                // Auto-switch to water mode when user directly interacts with water input
                if (this.activeThicknessControl !== 'water') {
                    this.activeThicknessControl = 'water';
                    this.targetOsmolalityMOsmKg = null;
                    this.fullyDissolve = false;
                }
            }
            this.calculateIngredients();
        }
    }

    onFullyDissolveChange(event) {
        this.fullyDissolve = event.target.checked

        if (this.fullyDissolve) {
            // Auto-switch to dissolve mode and clear conflicting constraints
            this.activeThicknessControl = 'dissolve';
            this.targetOsmolalityMOsmKg = null;
            this.amountWater = null;
        }

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

    // Enhanced scaleAllIngredients method to handle all scaling scenarios
    scaleAllIngredients(scalar) {
        // Handle duration mode special case - scale carbs per hour instead of duration
        if (this.activeAmountControl === "duration" && this.carbsPerHour) {
            this.carbsPerHour *= scalar;
        }

        // Handle other target amounts
        if (this.targetCarbsG) this.targetCarbsG *= scalar;
        if (this.targetVolumeMl) this.targetVolumeMl *= scalar;

        // Scale ingredient amounts
        Object.keys(INGREDIENTS).forEach(ingredient => {
            const useKey = suffixCamelCase("use", ingredient);
            const amountKey = suffixCamelCase("amount", ingredient);

            // Only scale ingredients that are in use and have specified amounts
            if (this[useKey] && this[amountKey] !== null && this[amountKey] > 0) {
                this[amountKey] = this[amountKey] * scalar;
            }
        });

        this.calculateIngredients();
    }

    onPresetClick(preset) {
        if (this.isRecipePresetActive(preset.value) && this.getRecipeMultiple(preset.value)) {
            // Already active preset - double it
            this.scaleAllIngredients(2.0);
        } else {
            // Different preset - apply it
            this.setRecipe(preset.value);
        }
    }

    isRecipePresetActive(preset) {
        // Check that all used ingredients are the same
        for (const ingredient of Object.keys(INGREDIENTS)) {
            const useKey = suffixCamelCase("use", ingredient);
            const inPreset = preset[useKey] ? preset[useKey] : false;
            if (this[useKey] !== inPreset) {
                return false; // If any ingredient use state doesn't match, return false
            }
        }
        // Check if each key in the preset matches the current state
        for (const key of Object.keys(preset)) {
            if (key.startsWith("amount") || key === "targetCarbsG" || key === "targetVolumeMl" || key === "carbsPerHour" || key === "duration") {
                // We allow user to change amounts, so we only check if they are set


            } else if (this[key] !== preset[key]) {
                return false; // If any other property doesn't match, return false
            }
        }
        return true; // All properties match, return true
    }


    getRecipeMultiple(preset) {
        // For each ingredient, find the ratio of the amount to the recipe preset
        let multiple = null;
        for (const ingredient of Object.keys(INGREDIENTS)) {
            const amount = this[suffixCamelCase("amount", ingredient)];
            const recipeAmount = preset[suffixCamelCase("amount", ingredient)];
            if (amount !== null && recipeAmount && recipeAmount > 0) {
                const ratio = amount / recipeAmount;
                if (multiple === null) {
                    multiple = ratio; // Initialize multiple with the first ratio
                } else if (Math.abs(multiple - ratio) > 0.01) {
                    return null; // If ratios differ significantly, return null
                }
            }
        }

        // Also check duration mode scaling - compare carbsPerHour ratios
        if (this.activeAmountControl === "duration" && preset.carbsPerHour && this.carbsPerHour) {
            const carbRatio = this.carbsPerHour / preset.carbsPerHour;
            if (multiple === null) {
                multiple = carbRatio;
            } else if (Math.abs(multiple - carbRatio) > 0.01) {
                return null;
            }
        }

        // Check other target amounts
        if (preset.targetCarbsG && this.targetCarbsG) {
            const carbRatio = this.targetCarbsG / preset.targetCarbsG;
            if (multiple === null) {
                multiple = carbRatio;
            } else if (Math.abs(multiple - carbRatio) > 0.01) {
                return null;
            }
        }

        if (preset.targetVolumeMl && this.targetVolumeMl) {
            const volumeRatio = this.targetVolumeMl / preset.targetVolumeMl;
            if (multiple === null) {
                multiple = volumeRatio;
            } else if (Math.abs(multiple - volumeRatio) > 0.01) {
                return null;
            }
        }

        return multiple;
    }

    getRecipePresetLabel(preset) {
        if (this.isRecipePresetActive(preset.value)) {
            const multiple = this.getRecipeMultiple(preset.value)
            if (multiple) {
                return `${preset.label} (x${multiple})`;
            }
        }
        return preset.label;
    }

    getRecipe() {
        const recipe = Object.keys(INGREDIENTS).reduce((acc, ingredient) => {
            acc[suffixCamelCase("amount", ingredient)] = this[suffixCamelCase("amount", ingredient)]
            acc[suffixCamelCase("use", ingredient)] = this[suffixCamelCase("use", ingredient)];
            return acc;
        }, {});
        return {
            ...recipe, ...{
                activeAmountControl: this.activeAmountControl,
                activeThicknessControl: this.activeThicknessControl,
                fructoseRatio: this.fructoseRatio,
                glucoseRatio: this.glucoseRatio,
                duration: this.duration,
                carbsPerHour: this.carbsPerHour,
                targetVolumeMl: this.targetVolumeMl,
                targetCarbsG: this.targetCarbsG,
                fullyDissolve: this.fullyDissolve,
                targetOsmolalityMOsmKg: this.targetOsmolalityMOsmKg,
                optimizationObjective: this.optimizationObjective
            }
        }
    }

    setRecipe(recipe) {
        if (typeof recipe === 'string') {
            // Preset by name
            const preset = this.recipePresets.find(p => p.value === recipe);
            if (preset) {
                this.setRecipe(preset.value)
            }
        } else {
            let keysToProcess = Object.keys(this.defaults)
                .filter(key => !Object.keys(recipe).includes(key));
            for (const key of keysToProcess) {
                this[key] = this.defaults[key];
            }
            // Constraint properties
            for (const key of Object.keys(recipe)) {
                this[key] = recipe[key];
            }

            // Determine appropriate amount control mode
            if (recipe.targetCarbsG) {
                this.activeAmountControl = "carbs";
            } else if (recipe.carbsPerHour) {
                this.activeAmountControl = "duration";
            } else if (recipe.targetVolumeMl) {
                this.activeAmountControl = "volume";
            } else {
                this.activeAmountControl = "manual";
            }

            // Determine appropriate thickness control mode
            if (recipe.amountWater !== undefined && recipe.amountWater !== null) {
                this.activeThicknessControl = "water";
            } else if (recipe.fullyDissolve === true) {
                this.activeThicknessControl = "dissolve";
            } else if (recipe.targetOsmolalityMOsmKg !== undefined && recipe.targetOsmolalityMOsmKg !== null) {
                this.activeThicknessControl = "concentration";
            } else {
                // Default fallback
                this.activeThicknessControl = "concentration";
            }
        }
        this.calculateIngredients();
    }

    renderAmountControlContent() {
        switch (this.activeAmountControl) {
            case "duration":
                return html`
                  <div class="row mb-2">
                    <div class="col-sm-7 col-12">
                      <div class="input-group">
                        <label for="hours" class="input-group-text">Duration</label>
                        <input
                                id="hours"
                                type="number"
                                min="0"
                                class="form-control form-control-sm"
                                .value="${this.duration ? this.duration.split(':')[0] : null}"
                                @input="${e => this.onDurationChangePart(e, 'hours')}"
                        />
                        <span class="input-group-text">hours</span>
                        <input
                                id="minutes"
                                type="number"
                                min="0"
                                max="59"
                                class="form-control form-control-sm"
                                .value="${this.duration ? this.duration.split(':')[1] : null}"
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
                `;
            case "volume":
                return html`
                  <div class="row mb-2">
                    <div class="col-12">
                      <div class="input-group">
                        <label for="targetVolume" class="input-group-text">Target Volume</label>
                        <input
                                id="targetVolume"
                                type="number"
                                min="0"
                                step="1"
                                class="form-control form-control-sm"
                                .value="${this.targetVolumeMl}"
                                @input="${this.onTargetVolumeChange}"
                        />
                        <span class="input-group-text">ml</span>
                      </div>
                    </div>
                  </div>
                `;
            case "carbs":
                return html`
                  <div class="row mb-2">
                    <div class="col-12">
                      <div class="input-group">
                        <label for="targetCarbs" class="input-group-text">Total Carbs</label>
                        <input
                                id="targetCarbs"
                                type="number"
                                min="0"
                                step="1"
                                class="form-control form-control-sm"
                                .value="${this.targetCarbsG}"
                                @input="${this.onTargetCarbsChange}"
                        />
                        <span class="input-group-text">g</span>
                      </div>
                    </div>
                  </div>
                `;
            case "manual":
                return html`
                  <div class="row mb-2">
                    <div class="d-flex justify-content-between">
                      <p class="text-secondary small mb-2">Enter specific ingredient amounts below</p>
                      <div class="d-flex gap-2">
                        <button
                                type="button"
                                class="btn btn-outline-secondary btn-sm"
                                @click="${() => this.scaleAllIngredients(0.5)}"
                        >
                          ÷2 Halve
                        </button>
                        <button
                                type="button"
                                class="btn btn-outline-secondary btn-sm"
                                @click="${() => this.scaleAllIngredients(2.0)}"
                        >
                          ×2 Double
                        </button>
                      </div>
                    </div>
                  </div>
                `;
            default:
                return html``;
        }
    }

    renderIngredientAmountCell(ingredient) {
        const amountG = this[`${ingredient}G`];
        const ingredientData = INGREDIENTS[ingredient];
        const cssClass = amountG === 0 ? 'text-secondary' : '';

        // Handle ingredients with no sugars (simpler case)
        if (ingredientData.glucose === 0 && ingredientData.fructose === 0) {
            return html`
              <td class="${cssClass}">${Math.ceil(amountG)}g</td>`;
        }

        // Handle ingredients with sugar content (tooltip case)
        const tooltip = `${(ingredientData.glucose * amountG).toFixed(1)}g:${(ingredientData.fructose * amountG).toFixed(1)}g`;

        return html`
          <td class="${cssClass} cursor-help" title="${tooltip}">
            ${Math.ceil(amountG)}g
          </td>
        `;
    }

    renderThicknessControlContent() {
        switch (this.activeThicknessControl) {
            case "water":
                return html`
                  <div class="input-group">
                    <label for="water" class="input-group-text">Water</label>
                    <input
                            id="water"
                            type="number"
                            min="0"
                            step="1"
                            class="form-control form-control-sm"
                            .value="${this.amountWater}"
                            @input="${this.onSpecifiedWaterChange}"
                    />
                    <span class="input-group-text">g</span>
                  </div>
                `;
            case "concentration":
                return html`
                  <div class="input-group">
                    <label for="osmolality" class="input-group-text">Osmolality</label>
                    <input
                            id="osmolality"
                            type="number"
                            min="300"
                            max="8000"
                            step="100"
                            class="form-control form-control-sm"
                            .value="${this.targetOsmolalityMOsmKg}"
                            @input="${this.onOsmolalityChange}"
                    />
                    <span class="input-group-text">mOsm/kg</span>
                  </div>
                `;
            case "dissolve":
                return html`
                  <div class="form-check">
                    <input
                            class="form-check-input"
                            type="checkbox"
                            id="fully-dissolve"
                            checked
                            disabled
                    />
                    <label class="form-check-label" for="fully-dissolve">
                      Fully dissolve all ingredients
                    </label>
                  </div>
                  <small class="text-secondary d-block mt-1">
                    Water amount will be automatically calculated to fully dissolve all selected ingredients
                  </small>
                `;
            default:
                return html``;
        }
    }

    render() {
        return html`
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.6/dist/css/bootstrap.min.css" rel="stylesheet">

          <div class="d-flex flex-column flex-lg-row gap-2 gap-lg-5">
            <div class="col">
              <h6 class="small fw-semibold mb-1">Presets</h6>
              <div class="preset-buttons gap-2 mb-2">
                ${map(this.recipePresets, (preset) => html`
                  <button
                          class="preset-btn ${this.isRecipePresetActive(preset.value) ? 'active' : ''}"
                          title="${preset.label}"
                          @click="${() => this.onPresetClick(preset)}"
                  >
                    ${this.getRecipePresetLabel(preset)}
                  </button>
                `)}
              </div>

              <div class="row-auto d-flex align-items-baseline justify-content-between mb-1">
                <h6 class="small fw-semibold mb-1">Amount</h6>

                <ul class="nav nav-underline small">
                  <li class="nav-item">
                    <a class="nav-link link-secondary ${this.activeAmountControl === 'duration' ? 'active' : ''}"
                       @click="${() => this.onAmountControlTabChange('duration')}">Duration</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link link-secondary ${this.activeAmountControl === 'carbs' ? 'active' : ''}"
                       @click="${() => this.onAmountControlTabChange('carbs')}">Carbs</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link link-secondary ${this.activeAmountControl === 'volume' ? 'active' : ''}"
                       @click="${() => this.onAmountControlTabChange('volume')}">Volume</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link link-secondary ${this.activeAmountControl === 'manual' ? 'active' : ''}"
                       @click="${() => this.onAmountControlTabChange('manual')}">Manual</a>
                  </li>
                </ul>
              </div>

              ${this.renderAmountControlContent()}

              <h6 class="small fw-semibold mb-1">Carb Ratio</h6>
              <div class="mb-2">
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

              <div class="row-auto d-flex align-items-baseline justify-content-between mb-1">
                <h6 class="small fw-semibold mb-1">Thickness</h6>

                <ul class="nav nav-underline small">
                  <li class="nav-item">
                    <a class="nav-link link-secondary ${this.activeThicknessControl === 'water' ? 'active' : ''}"
                       @click="${() => this.onThicknessControlTabChange('water')}">Water</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link link-secondary ${this.activeThicknessControl === 'concentration' ? 'active' : ''}"
                       @click="${() => this.onThicknessControlTabChange('concentration')}">Concentration</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link link-secondary ${this.activeThicknessControl === 'dissolve' ? 'active' : ''}"
                       @click="${() => this.onThicknessControlTabChange('dissolve')}">Fully Dissolve</a>
                  </li>
                </ul>
              </div>

              <div class="mb-3">
                ${this.renderThicknessControlContent()}
              </div>

              <h6 class="small fw-semibold mb-1">Ingredient Controls</h6>
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
                        <label class="form-check-label ms-2 cursor-help" for="${ingredient}"
                               title="${INGREDIENTS[ingredient].aka ? INGREDIENTS[ingredient].aka + ', ' : ""}${INGREDIENTS[ingredient].glucose || INGREDIENTS[ingredient].fructose ? 'glucose:fructose ' + glucoseFructoseRatio(ingredient) : ''}">${camelCaseToSplitWords(ingredient)}</label>
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
            </div>

            <div class="col">
              <hr class="d-lg-none"/>

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
                        ${this.renderIngredientAmountCell(ingredient)}
                      </tr>
                    ` : ''}
                  `)}
                  <tr>
                    <td>Water</td>
                    <td>${Math.ceil(this.waterG)}g ${this.waterFromIngredients > 0 ? html`<i
                            class="small text-secondary">(additional ${Math.ceil(this.waterFromIngredients)}g from
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
                    <td>${(this.cost).toFixed(2)}</td>
                  </tr>
                  </tbody>
                </table>
              ` : this.errorHint()}
            </div>
          </div>
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
