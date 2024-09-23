---
layout: page-restrict-width-article
title:  "Homemade Energy Gel Recipe"
permalink: energy-gels/
custom_js_modules: ['/assets/js/nutritionCalculators.js']
excerpt: "Cheap, easy, and customizable fuel"
---

Endurance athletes consume highly concentrated carbohydrate solutions because it maintains blood glucose levels and spares [limited accessible energy sources](https://doi.org/10.1093%2Fnutrit%2Fnuy001). There are [many "energy gel" sports nutrition products](https://www.researchgate.net/profile/Xuguang-Zhang-2/publication/277081684_Extreme_Variation_of_Nutritional_Composition_and_Osmolality_of_Commercially_Available_Carbohydrate_Energy_Gel/links/557971f508aeb6d8c020255c/Extreme-Variation-of-Nutritional-Composition-and-Osmolality-of-Commercially-Available-Carbohydrate-Energy-Gel.pdf) to choose from.

They can be costly, anywhere from $1 to as much as [$3.5 per 25g for high-end solutions](https://www.maurten.com/products/us/gel-100-box-us). That means spending $8-$28 to cover a marathon, and maybe $50-$150 per training block on gels if you're practicing nutrition regularly.

Fortunately, it's easy to make nutrition at home. The basic idea is **to target a 3:1 glucose to fructose ratio** with just enough water to be at a manageable concentration.

DIY means you can easily add caffeine and salt, or substitute a carb source. And you can use the containers of your choice. I prefer these [100ml flip-cap plastic pouches](https://www.amazon.com/s?k=100ml+plastic+flasks+concealable) which fit in most shorts' gel pockets. For workouts, I dump the ingredients in a bottle as a sports drink.

{% include article_multiimage.html images="/assets/projects/energy-gels/honey-malto-filling.webp /assets/projects/energy-gels/gel-flask.webp" caption="Maltodextrin and honey gel prep for my preferred reusable gel containers. April 2023."%}


## Recipe

This calculator takes your desired [carb-type ratio](#glucosefructose-ratio), [concentration](#osmotic-concentration-osmolality-and-tonicity) and any [particular ingredient](#which-ingredients-should-i-use) amounts, then optimizes for low volume. Checked ingredients will be considered in the calculation, but they may be ignored if not needed to reach the desired characteristics. Specify amounts manually to force the calculator to include an ingredient. A warning will appear if the ingredients or amounts can't meet the target ratio. Hover over ingredient names to see their glucose/fructose ratio, and hover over ml to see oz.

<div class="card mb-3">
    <div class="card-body">
        <gel-recipe-calculator ></gel-recipe-calculator>
    </div>
</div>

0. (Optionally) warm up the water.
1. Add viscous ingredients (e.g. syrup, honey) to water and mix until dissolved. 
2. Add powdered ingredients and mix until dissolved. 

Keeps for 2-3 days in a refrigerator.

### Which ingredients should I use?

Refined ingredients are more expensive and generally have to be bought online, but you need them to achieve the lowest concentrations in the smallest volume. Honey and other natural products are cheaper and more widely available, but will require more water to reach a manageable concentration. 

If you're using dry ingredients, use [maltodextrin](#maltodextrin). If you aren't, brown rice syrup is useful because it's close to a pure glucose source. Honey and agave nectar are good fructose sources.

{% include article_image.html img="/assets/projects/energy-gels/whole-foods-lay.webp" caption="Brown rice syrup, honey, salt and molasses gel prep. The hydroflask twist-cap is hard to open and close, so I don't recommend it. June 2020."%}


### How many carbs per hour?

For events longer than an hour, the common recommendation is 60g per hour, and there's [evidence of performance and recovery benefits for using as much as 120g of carbohydrate an hour](https://www.mdpi.com/2072-6643/12/5/1367) in elite endurance athletes. Tolerance varies between individuals and is trainable.

### Glucose:fructose ratio

Glucose and fructose [use separate metabolic pathways](https://www.mysportscience.com/post/2015/05/14/carb-mixes-and-benefits), and taking both at the same time [helps keep carbs available in your system](https://physoc.onlinelibrary.wiley.com/doi/10.1113/JP277116). The recipe defaults to a low amount of fructose compared to common recommendations of 2:1 or 1:1 ratios because fructose is not that important until you're able to saturate the glucose pathway. Large amounts of fructose can also be unpleasantly sweet.

### Osmotic concentration: osmolality and tonicity

The concentration of a solution is measured by the ratio of particles to water. This calculator uses [osmolality](https://en.wikipedia.org/wiki/Osmotic_concentration), milliosmole of solute per kilogram of solvent (mOsm/kg). A solution is isotonic if it has the same osmolality as blood plasma, ~295mOsm/kg. If the solution has too many particles for not enough water, it'll cause GI stress as osmosis pulls fluids in. If it's too dilute, it'll pass before full absorption.

 The only way to change osmolality for a given mass of carbohydrate is to use fewer particles (e.g. use heavier carbohydrates, like [maltodextrin](#maltodextrin), which are still quickly metabolized), or to add more water. The default 3400 mOsm/kg for this recipe is high, though lower than [that of most commercial products](https://www.researchgate.net/publication/277081684_Extreme_Variation_of_Nutritional_Composition_and_Osmolality_of_Commercially_Available_Carbohydrate_Energy_Gel). Making the solution isotonic requires adding so much fluid as to make it impractical (and doesn't align with fluid consumption of [high-performing athletes either](https://pubmed.ncbi.nlm.nih.gov/22450589/)).

### Maltodextrin

[Maltodextrin](https://en.wikipedia.org/wiki/Maltodextrin) is a large molecule consisting of chains of glucose and is created by chemically processing starch. Its less sweet and crystallization-prone than sugar, but also less viscous in solution than a starch. It is quickly broken down into glucose inside the body, and is typically easier to tolerate in large quantities. All of this is why it's the primary carb source in commercial gels.

The length of the glucose chain is [variable depending on the chemical process and starches used](https://www.naturalproductsinsider.com/specialty-nutrients/making-the-most-of-maltodextrins). Anything between 2 and 20 glucose groups (degree of polymerization) are sold alike. Longer chains are preferable as they'll result in a lower osmolality. You can contact the manufacturer to get the number, but generally longer chain versions will take longer to dissolve in water and will be barely sweet. The calculator assumes a degree of polymerization of 10, since I was quoted 10-12 by a representative of the company I use.

### Does it need to be fully dissolved?

Check fully dissolved if you want a sports drink. If you don't want a sports drink, the default concentration of 3400 mOsm/kg is a gooey paste. It's not the same as a commercial gel because there's no [gelling agent](https://en.wikipedia.org/wiki/Thickening_agent).

### Flavors

Citric acid, lemon juice or instant coffee work well, and in such small quantities that the effect on concentration is negligible.

### Caffeine

The [recommendation](https://doi.org/10.3390%2Fnu15010148) is 3-6mg caffeine per kilogram body mass, spread through the window starting an hour before the event to an hour before completion. Caffeine powder is dangerous and easily mishandled, so I recommend buying capsules and dumping the contents in as needed.

<div class="card mb-3">
    <div class="card-body">
        <caffeine-calculator></caffeine-calculator>
    </div>
</div>

### Carb loading

You can also use this gel/drink recipe in the lead up to a big event for an easy-to-tolerate carb load. See [this helpful calculator](https://www.featherstonenutrition.com/carb-loading) for an idea of how many carbs and when to eat them.

### Ingredient prices


<table class="table small">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Cost (¢/g)</th>
      <th scope="col">Common size</th>
      <th scope="col">Common cost</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Maltodextrin</td>
      <td>1.33</td>
      <td>4lb (1 gallon) container</td>
      <td>$6/lb</td>
    </tr>
    <tr>
      <td>Fructose</td>
      <td>2.00</td>
      <td>3lb bag</td>
      <td>$8/lb</td>
    </tr>
    <tr>
      <td>Dextrose (glucose)</td>
      <td>1.00</td>
      <td>1lb jar</td>
      <td>$4.50/lb</td>
    </tr>
    <tr>
      <td>Salt</td>
      <td>0.15</td>
      <td>26oz container</td>
      <td>$1/lb</td>
    </tr>
    <tr>
      <td>Sugar (sucrose)</td>
      <td>0.40</td>
      <td>4lb bag</td>
      <td>$1/lb</td>
    </tr>
    <tr>
      <td>Honey</td>
      <td>1.33</td>
      <td>1lb squeeze bottle</td>
      <td>$6/lb</td>
    </tr>
    <tr>
      <td>Brown rice syrup</td>
      <td>1.30</td>
      <td>21oz jar</td>
      <td>$5/lb</td>
    </tr>
    <tr>
      <td>Molasses</td>
      <td>0.90</td>
      <td>12oz bottle</td>
      <td>$8/lb</td>
    </tr>
    <tr>
      <td>Agave nectar</td>
      <td>3.20</td>
      <td>23.5oz bottle</td>
      <td>$15/lb</td>
    </tr>
    <tr>
      <td>Maple syrup</td>
      <td>3.20</td>
      <td>32oz bottle</td>
      <td>$10/lb</td>
    </tr>
    <tr>
      <td>Caffeine</td>
      <td>5¢/100mg</td>
      <td>250 100mg capsules</td>
      <td>$10/250 capsules</td>
    </tr>
  </tbody>
</table>



## Other recipes

* [Jim Downing](https://www.jimdowning.org/articles/diy-endurance-carbs/)
* [mtnPhil](http://mtnphil.com/GU.html)
* [Cycling Performance Tips](https://www.cptips.com/gelown.htm)
* [RunWorks forum post](http://www.runworks.com/about102.html)
* [Alex Tran's osmolality-based calculator](https://www.alextran.org/tonicity-calculator/)

## Changelog

* **2024-09-22**:
  * Store calculator input across refreshes (open a new tab to restore defaults) 
* **2024-06-23**: 
  * Solve for multiple ingredients and add many common carb sources
  * Allow partial specification of ingredients
  * Add "fully dissolve" for making drinks
* **2023-10-22**: Initial post