---
layout: page-restrict-width-article
title:  "Precision Running Course Measurement"
description:
  Has GPS come far enough that we can use it to measure road running courses? Try it and see.
categories: ["running", "note"]
permalink: precision-course-measurement/
---

_These are work in progress notes on GNSS methods for [course measurement](https://rrtc.net/). Nothing here is approved for official measurements in the US or elsewhere._
{: .alert .alert-light }

The calibrated bicycle method is the only approved method for [measuring the length of a road running course](https://rrtc.net/). Officials have limited discretion to accept alternatives, but you cannot count on having a course certified in the US or elsewhere without a [Jones Counter](https://en.wikipedia.org/wiki/Jones_Counter) measurement.

Small courses are difficult for the calibrated bicycle method, enough so that we really shouldn't use it.
It's challenging to maintain the correct distance from the curb (especially on a curve), and almost impossible to start the bike without wobbling. These systematic errors would be insignificant for a typical marathon measurement ride, but a mistake on a short loop is multiplied by the number of laps. Unless the loop is a standard track---where you know any number more than a few centimeters off 400m is suspect---you'd never notice how wrong the measurement is. **We need an instrument that's less vulnerable to undetectable operator error**. 

Even if you could ride the bike perfectly, the measurement wouldn't be precise enough for small loops. A "count", the smallest measurement a Jones Counter can make, typically works out to about 9cm. For the [192m Drumheller Marathon](https://drumhellermarathon.com) loop, this already limits the precision of the entire course length to ±9m. For the [64m Whaleathon](https://whaleathon.com/) loop, it would be ±29m. All certified courses are lengthened by 1m per kilometer to ensure they aren't short due to inaccuracies of using the bicycle (the "short course prevention factor"), but that 42m buffer is too small when it's already decimated by the inherent imprecision of the measuring tool. **We need an instrument that's more precise.**

If you can steel tape directly along the curb, do that. If you can convince the certifying official to take a calibrated survey-wheel measurement, do that. But if you can't, or you want higher confidence in your measurements, use survey GPS instead.


## Using RTK GNSS to Measure Small Courses

Standard GPS devices like phones are precise to about 1m in ideal conditions. Sophisticated processing techniques can enable higher precision GNSS with various tradeoffs. They generally require a larger antenna (to enable [carrier phase tracking](https://ocw.mit.edu/courses/12-540-principles-of-the-global-positioning-system-spring-2012/7a866b4a6977a0bc4537aab5c8dc581d_MIT12_540S12_lec8.pdf)) and corrections data (to remove the effect of atmospheric delays in satellite signals).

[Real time kinematic (RTK) positioning](https://en.wikipedia.org/wiki/Real-time_kinematic_positioning) makes the most sense for course measurement, and has become much cheaper. RTK systems usually have an integrated antenna and receiver that applies corrections in real time, enabling measurements precise to 1cm even while moving. Complete packages can be had for $500-$2500.

### Equipment

* [SparkFun RTK Torch](https://www.sparkfun.com/sparkfun-rtk-torch.html), [documentation](https://docs.sparkfun.com/SparkFun_RTK_Everywhere_Firmware/), [overview video](https://www.youtube.com/watch?v=gJyWOUiZ-bg)
* Survey pole
* Bosch GLM-40, laser distance meter for checking antenna height
* Phone, with [SWMaps app](https://aviyaantech.com/swmaps/)

### RTK Corrections Sources

[RTK2Go](http://rtk2go.com/) provides free corrections from a network of bases.

* NTRIP Caster Address: `rtk2go.com`
* Port: `2101`
* Mount Point: Check the map (open [list](http://monitor.use-snip.com/?hostUrl=rtk2go.com&port=2101) > View All), use the name of the closest base. Pittsburgh: `PIT_TEST_TRACK`, `cmuairlab01`. Seattle: `LFPWD_HV`
* Username: `<your email address>` (no registration required)
* Password: empty



Some [states have free networks](https://e38surveysolutions.com/pages/ntrip-rtk-network-access-by-state).

Alternatively, you can sign up for [thingstream](https://www.u-blox.com/en/product/thingstream) and use their [PointPerfect](https://developer.thingstream.io/guides/location-services/pointperfect-getting-started#h.bnxb00jfm4sd) service and enable NTRIP.

### Setup

Charge the receiver the night before. It should run at least 10 hours on a full charge.

#### SWMaps Project

1. Create layers: top left icon > "Layers" > "Add Layer" > "GNSS Recorded Feature" > "Name: Curb", "Type: POLYGON", "Color: bright green"
2. Add another layer, "Name: Landmarks", "Type: POINT" as a catchall for other points of interest

#### Pole

1. Screw together the pole and attach the phone mount at a comfortable height. Make sure you can see both the screen and the pole's level bubble at the same time.
2. Turn on the receiver and attach it to the pole.
3. Check the antenna height by standing the pole on a flat surface and shooting the height from the base of the receiver to the ground with the laser distance meter. It should be close to 2.008m

#### Phone

1. Open SWMaps and pair with the receiver over bluetooth: top left icon > "Bluetooth GNSS", "Scan", select "Torch Rover" entry, "Instrument Model: SparkFun RTK", "Instrument Height: 2.008m"
2. Start streaming corrections: top left icon > "NTRIP Client" > fill all fields, enable "Send NMEA GGA to Caster", "Connect"
3. Wait until RTK Fix is acquired. Monitor current accuracy numbers under "GNSS Status". It should take at most 2 minutes to achieve fix.
4. Clamp the phone in the mount. Make sure it doesn't squeeze down the volume or power buttons.

##### If it doesn't acquire RTK Fix:
* Make sure the antenna has a clear view of the sky.
* Turn off the receiver and turn it back on.
* If the GNSS state is "Single" or "Fix", confirm that NTRIP is connected
* If the status is "DGPS" or "RTK Float", the NTRIP connection is working, but too few satellites are shared between the base and the receiver. It is normal for it take about a minute to switch to "RTK Fix". If it is taking longer, you may need to restart the device or switch NTRIP bases.

**If NTRIP disconnects frequently**, the app may not be sending "NMEA GGA" data to the server. Disconnect NTRIP, toggle the control off, connect, disconnect, then toggle the control back on. If the connection is valid, you should see a "Baseline" stat printed at the bottom of NTRIP Client setting screen.

### Procedure

1. Open the recording interface. "REC" icon (top right) > "Record Feature", select appropriate layer, name the new polygon ("curb") or point ("start line", "course edge")
2. Poke the pole into some identifiable landmark. For marking courses, use the edge of the curb at a seam. If there aren't enough landmarks, sample every 1.5m along the curb.
3. Level the pole, adjusting until the bubble is within the circle. It's sensitive.
4. Tap the marker icon in the bottom right. If you tapped at a bad time, hit the reload icon next to it to replace the previous measurement.

**Using tilt compensation mode**: See [this video](https://www.youtube.com/watch?v=gJyWOUiZ-bg) for the steps to turn it on. The receiver must be in RTK Fix before enabling tilt compensation, and will stop compensating if the fix is lost. If you are experiencing intermittent drops, it may not be worth the futzing. When it's working, you don't need to level the pole perfectly, but it should still be nearly upright for maximum accuracy.

### Data Processing

Do not trust area or perimeter measurements given in SWMaps.

Export the data as shapefiles then use QGIS to process the data for the final measurement.

### Comparison to Bicycle Method

<div class="row">
<div class="col-6" markdown="1">


**Pros**
* Measurements are always in shared reference frame
  * Can stitch multiple measurements with no loss of accuracy
* Splits can be computed (no extra work)
* Higher precision
* Errors are traceable
* No calibration required (faster)
* Also measures elevation
* Requires less skill


</div>
<div class="col-6" markdown="1">

**Cons**
* Only works outside, with good view of sky
* Processing data requires expertise
* 5-10x cost of Jones Counter
* Requires cell reception
* Requires nearby corrections base station

</div>
</div>

## Using RTK GNSS to Measure Long Courses

TODO: mounting receiver to bicycle, stitching measurements

## Using a Laser Distance Meter to Measure Circular Courses

Stake four points along the curb, measure chord lengths between each pair of points, [calculate](https://planetcalc.com/1050/) the diameter of the [circumcircle](https://en.wikipedia.org/wiki/Circumcircle) of each subset of three points. The agreement of the four estimates indicates the quality of your measurements and the actual circularity of the course. If they do not agree to within 10cm, you shouldn't use the measurements.


## Other Reading

* Bicycle procedures: [The Measurement of Road Race Courses](https://media.aws.iaaf.org/competitioninfo/2023%20Course%20Measurement%20Book%20-%20ENG.pdf), World Athletics
* Track surveying: [Outdoor Facilities Measurement Report Form](https://www.worldathletics.org/download/download?filename=8cfa0284-c460-4030-9389-73489c1bf61f.doc&urlslug=REPORT%20FORMS%20-%20Measurement%20Report%20-%20Outdoor), World Athletics
* [How to Tape a Track](https://www.flipsnack.com/USATF/how-to-tape-a-track/full-view.html)
* [DGPS course measurement](https://rrtc.net/Articles/Spac%20Meas.pdf) circa 2006