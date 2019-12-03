---
title:  "Planning for User Commands with ASP"
date:   2019-07-19 12:00:00 -0700
categories: research
short_description: "Encoding user expectations and failing gracefully"
block_color: "#68a46a"
featured: true
has_article: true
published: true
layout: published_project_entry
citation_keys: [jiang2019icaps]
---

If a robot is asked to get an apple from the kitchen, how should it represent this command? There are plenty of possibilities, but in one recent paper, we looked at a compact [Answer Set Programming](https://en.wikipedia.org/wiki/Answer_set_programming) encoding that handles many of the concerns that arise when actually trying to execute such a command.

The [paper](http://www.cs.utexas.edu/%7Epstone/Papers/bib2html-links/ICAPS19-Jiang.pdf) provides more robotics-y context, but here I'll break down the actual answer set programs that our system would construct to handle a command like the apple fetching example. While the paper doesn't give rules in enough detail to step beyond vanilla ASP semantics, here I'll give complete code that you can run in [clingo](https://potassco.org/clingo/). Many of Clingo's innovations extend the typical ASP solving semantics, so I'll highlight unique features that we rely on.

You can download the full, ready to execute examples [here]({{"/assets/planning_for_user_commands_examples.zip" | absolute_url}}).

## Knowledge Representation

A planning problem is the task of generating a sequence of actions to accomplish a goal. So to start with, in what terms do you express the goal?

We chose a representation with three primitives: _concepts_, the abstract idea of something; _instances_, concrete objects in the physical world; and _relations_, descriptions of the relationships between and amongst concepts and instances.

Each concept and instance gets an ID, and relations are represented as predicates. Here's an example encoding of a world that consists of kitchen and a living room:


{% include article_image.html img="/assets/images/research/knowledge.svg"
    caption="A graphical depiction of a small knowledgebase. In this simple example, the label on each instance is a shorthand for an _instance of_ relation with the concept of the same name."%}

````
name(1, "robot").
name(2, "object").
name(3, "operator").
name(4, "hypothetical").
name(5, "location").
name(6, "room").
is_a(6, 5).

name(7, "placement").
is_a(7, 5).
name(8, "beacon").
is_a(8, 5).
name(9, "fruit").
is_a(9,2).
default_location(9, 12). % Usually in kitchen
name(10, "graspable").
name(11, "scanned").
name(12, "kitchen").
is_a(12, 6). % Room
name(13, "living room").
is_a(13, 6). % Room
name(14, "sofa").
name(15, "counter").

name(16, "table").
name(17, "cupboard").
name(18, "apple").
is_a(18, 9).
name(19, "empty_handed").
name(20, "person").

% Arrangement of the world
instance_of(50, 12). % Kitchen
instance_of(51, 13). % Living room
is_connected(50, 51).


instance_of(52, 14). % Sofa
instance_of(52, 8). % Beacon
is_in(52, 51).

instance_of(53, 15). % Counter
instance_of(53, 7). % Placement
is_in(53, 50).

instance_of(54, 16). % Table
instance_of(54, 7). % Placement
is_in(54, 50).

instance_of(55, 17). % Cupboard
instance_of(55, 7). % Placement
is_in(55, 50).


% Robot
instance_of(100, 1).
instance_of(100, 19). % Empty handed
is_near(100, 52). % At sofa

% Operator
instance_of(101, 20).
is_near(101, 52). % At sofa
````

## Actions

We can now describe actions in terms of their requirements and effects on this encoded version of the world.

First, we'll add some rules that take state atoms and produce helpful summary facts or equivalent fluents:
`base_rules.asp`
````
is_a(C1, C3) :- is_a(C1, C2), is_a(C2, C3).
instance_of_recursive(O, C1) :- instance_of(O, C2), is_a(C2, C1).
instance_of_recursive(O, C) :- instance_of(O, C).
has_concept(O, C) :- instance_of_recursive(O, C_id), name(C_id, C).

%% Support non-fluent to fluent promotion for basic attributes
is_near(self, L, 0) :- is_near(self, L).
is_near(P, L, 0) :- is_near(P, L).
is_placed(O, L, 0) :- is_placed(O, L).
is_facing(self, P, 0) :- is_facing(self, P).
is_holding(self, O, 0) :- is_holding(self, O).
is_delivered(O, P, 0) :- is_delivered(O, P).

% short-hand for concepts
scanned(S, 0) :- has_concept(S, "scanned").
hand_empty(0) :- has_concept(self, "empty_handed").

% Demotion
can_be_placed(O, L) :- can_be_placed(O, L, 0), has_concept(L, "placement"). 

% If an objecct can be placed in a room, then it can be placed on any surface in the room
can_be_placed(O, L) :- can_be_placed(O, R, 0), has_concept(R, "room"), is_in(L, R), has_concept(L, "placement").
````

Now we can define the pre and post conditions for a range of robot actions:

`action_rules.asp`
````
#const self = 100.

#program step(n).

% action navigate_to
is_near(self, T, n) :- navigate_to(T, n).
is_facing(self, T, n) :- navigate_to(T, n).
-is_near(self, F, n) :- navigate_to(T, n), is_near(self, F, n - 1), T != F.
%for now assume everything is connected

% action find_person
is_near(P, L, n) :- find_person(P, L, n).
is_facing(self, P, n) :- find_person(P, L, n).
:- find_person(P, L, n), not is_near(self, L, n - 1).
:- find_person(P, L, n), 0{can_be_near(P, L); is_near(P, L)}0.

% action pick_up
is_holding(self, O, n) :- pick_up(O, L, n).
-is_placed(O, L, n) :- pick_up(O, L, n).
-hand_empty(n) :- pick_up(O, L, n).
:- pick_up(O, L, n), not is_placed(O, L, n - 1).
:- pick_up(O, L, n), not is_facing(self, L, n - 1).
:- pick_up(O, L, n), not hand_empty(n - 1).
%:- pick_up(O, L, n), not has_concept(O, "sensed"), has_concept(L, "scanned").

% action put_down
-is_holding(self, O, n) :- put_down(O, L, n).
is_placed(O, L, n) :- put_down(O, L, n).
hand_empty(n) :- put_down(O, L, n).
:- put_down(O, L, n), not is_facing(self, L, n - 1).
:- put_down(O, L, n), not is_holding(self, O, n - 1).

% action perceive_surface
scanned(L, n) :- perceive_surface(O, L, n).
is_placed(O, L, n) :- perceive_surface(O, L, n).
is_facing(self, L, n) :- perceive_surface(O, L, n).
:- perceive_surface(O, L, n), not can_be_placed(O, L).
:- perceive_surface(O, L, n), not is_facing(self, L, n - 1).
:- perceive_surface(O, L, n), scanned(L, n - 1).

% action hand_over
is_delivered(O, P, n) :- hand_over(O, P, n).
hand_empty(n) :- hand_over(O, P, n).
:- hand_over(O, P, n), not is_facing(self, P, n - 1).
:- hand_over(O, P, n), not is_holding(self, O, n - 1).

%%inertial rules
is_near(P, L, n) :- is_near(P, L, n - 1), not -is_near(P, L, n).
is_near(self, L, n) :- is_near(self, L, n - 1), not -is_near(self, L, n).
is_placed(O, L, n) :- is_placed(O, L, n - 1), not -is_placed(O, L, n).
scanned(L, n) :- scanned(L, n - 1).
is_holding(self, O, n) :- is_holding(self, O, n - 1), not -is_holding(self, O, n).
hand_empty(n) :- hand_empty(n - 1), not -hand_empty(n).
is_delivered(O, P, n) :- is_delivered(O, P, n - 1).
````

Clingo lets us realize [iterative deepening](https://en.wikipedia.org/wiki/Iterative_deepening_depth-first_search) with a built in incremental solver mode that interleaves grounding and solving until an answer set is found. To activate this mode, we include the special incmode file and mark this section of the code as a subprogram named `step` with a single parameter, `n`. `step` programs will be grounded once for every time step in the incremental solving process, each time with an incremented value for `n`. It's important that incremental grounding doesn't redefine any existing rules or atoms, so generally step programs consist solely of fluents. The makers of Clingo have a [detailed description of the semantics of incremental Clingo](https://arxiv.org/pdf/1705.09811.pdf) if you want to look at the details.


## Planning

So far we've described the state of the world and its dynamics. As long as the knowledge is consistent, the answer sets for these programs will just be the original facts and some summary deductions from our `base_rules`. Now we'll phrase a planning query to this domain.

Let's say our user asked for an apple from the kitchen. This tells the robot that their _could_ be an apple placed in the kitchen, even if the robot has never seen it before. So we'll update the knowledgebase with an apple instance but tag it as hypothetical. To encode the tentative placement information, we'll use a soft version of the `placed` predicate.

`knowledge.asp`
````
%...

% Hypothetical apple
instance_of(102, 4).
instance_of(102, 18).

% Hypothesis extracted from user command
can_be_placed(102, 50, 0).
````

Then, we'll encode the actual goal of this command as the delivery of this hypothetical apple to the operator. We do this using the special `check` program, which tells Clingo to stop the incremental solving process when an answer set is found that satisfies some constraints.

`query.asp`
````
#program check(n).

:- not is_delivered(102, 101, n), query(n).

````

The `query` atom available in the `check` program is a special addition by the incremental solving control loop, allowing the developer to easily refer to specific loop iterations by conditioning on its truth. For instance, we could dissallow plans of less than 10 steps by saying something like `:- query(n), n < 10.`

Now, following the generate and test paradigm, we'll produce all possible sequences of actions:

`action_generation.asp`
````
#include <incmode>.
#program step(n).

1{
navigate_to(T, n) : has_concept(T, "location");
pick_up(O, L, n) : has_concept(O, "object"), has_concept(L, "placement");
put_down(O, L, n) : has_concept(O, "object"), has_concept(L, "placement");
hand_over(O, P, n) : has_concept(O, "object"), has_concept(P, "person");
perceive_surface(O, L, n) : has_concept(O, "object"), has_concept(L, "placement");
find_person(P, L, n) : has_concept(P, "person"), has_concept(L, "location")
}1.

% Hide everything that isn't an action when displaying answer sets
#show navigate_to/2.
#show pick_up/3.
#show put_down/3.
#show hand_over/3.
#show perceive_surface/3.
#show find_person/3.
````

Running the `clingo` executable with  on the code shown up to this point will produce a plan. To get all acceptable plans, we can run `clingo 0`:

````
clingo version 5.4.0
...
Solving...
Solving...
Solving...
Solving...
Solving...
Solving...
Answer: 1
navigate_to(55,1) perceive_surface(102,55,2) pick_up(102,55,3) navigate_to(52,4) find_person(101,52,5) hand_over(102,101,6)
Answer: 2
navigate_to(53,1) perceive_surface(102,53,2) pick_up(102,53,3) navigate_to(52,4) find_person(101,52,5) hand_over(102,101,6)
Answer: 3
navigate_to(54,1) perceive_surface(102,54,2) pick_up(102,54,3) navigate_to(52,4) find_person(101,52,5) hand_over(102,101,6)
SATISFIABLE

Models       : 3
Calls        : 7
Time         : 0.022s (Solving: 0.00s 1st Model: 0.00s Unsat: 0.00s)
CPU Time     : 0.022s

````


## Diagnostics

>Note 12-3-19: I'll add some description here tonight. These snippets are meant to be run just along with the original knowledge and the base rules (so no action rules or generation required). The query is attempting to derive the negation of the `can_be_placed` hypothesis that the user provided based on the knowledge that was collected from executing plans in the real world.

`diagnostic_rules.asp`

````
#program base.
-can_be_placed(O1, L, 0) :- scanned(L, 0), 0{is_placed(O2, L) : instance_of(O1, C), instance_of(O2, C)}0, has_concept(L, "placement"), has_concept(O1, "hypothetical").
-can_be_placed(O, R, 0) :- 0{is_in(L, R) : has_concept(L, "placement"), not -can_be_placed(O, L, 0)}0, has_concept(R, "room"), has_concept(O, "hypothetical").
%#show can_be_placed/3.
````

Update `knowledge.asp` with

````
% Results of scanning surfaces
instance_of(53, 10).
instance_of(54, 10).
instance_of(55, 10).
````

`query.asp`
````
0{ can_be_placed(102, 50, 0)}1.
:~ can_be_placed(102, 50, 0). [-1, 1]
````