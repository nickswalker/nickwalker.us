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

> Note 12-2-19: I'll add some explainer notes and throw these files in a ZIP tonight. Right now, you can run all of the code from _Planning Domain_ with all of the code in _Initial Planning Query_ to make a plan to pick up an apple, then you can run all of the files under _Diagnostics_ along with `base_rules.asp` to see if the solver can refute the hypothesis from the state of the knowledge after trying to execute the plan.

## Planning Domain

`action_generation.asp`
````
#include <incmode>.
#program step(n).

1{
navigate_to(T, n) : has_concept(T, "location"); % TODO: change this to navigable
pick_up(O, L, n) : has_concept(O, "object"), has_concept(L, "placement"); % TODO: change object to graspable
put_down(O, L, n) : has_concept(O, "object"), has_concept(L, "placement");
hand_over(O, P, n) : has_concept(O, "object"), has_concept(P, "person");
perceive_surface(O, L, n) : has_concept(O, "object"), has_concept(L, "placement");
find_person(P, L, n) : has_concept(P, "person"), has_concept(L, "location")
}1.

#show navigate_to/2.
#show pick_up/3.
#show put_down/3.
#show hand_over/3.
#show perceive_surface/3.
#show find_person/3.
````

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

% allow passing concept name in goal query
is_near_name(self, L_name, n) :- is_near(self, L_id, n), name(L_id, L_name).
is_placed_concept(O_concept, L_concept, n) :- is_placed(O_id, L_id, n), has_concept(O_id, O_concept), has_concept(L_id, L_concept).
is_in_concept(O_concept, R_concept, n) :- is_placed(O_id, L, n), is_in(L, R_id), has_concept(O_id, O_concept), has_concept(R_id, R_concept).
is_delivered_concept(O_concept, P, n) :- is_delivered(O_id, P, n), has_concept(O_id, O_concept).
scanned_concept(L_concept, n) :- scanned(L_id, n), has_concept(L_id, L_concept).
is_holding_concept(self, O_concept, n) :- is_holding(self, O_id, n), has_concept(O_id, O_concept).
````

`base_rules.asp`
````
#program base.

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
is_near_name(self, L_name, 0) :- is_near(self, L_id), name(L_id, L_name).
is_placed_concept(O_concept, L_concept, 0) :- is_placed(O_id, L_id), has_concept(O_id, O_concept), has_concept(L_id, L_concept).
is_in_concept(O_concept, R_concept, 0) :- is_placed(O_id, L), is_in(L, R_id), has_concept(O_id, O_concept), has_concept(R_id, R_concept).
is_delivered_concept(O_concept, P, 0) :- is_delivered(O_id, P), has_concept(O_id, O_concept).
scanned_concept(L_concept, 0) :- scanned(L_id, 0), has_concept(L_id, L_concept).
is_holding_concept(self, O_concept, 0) :- is_holding(self, O_id, 0), has_concept(O_id, O_concept).

% short-hand for concepts
scanned(S, 0) :- has_concept(S, "scanned").
hand_empty(0) :- has_concept(self, "empty_handed").

% Silence warnings
default_location(O, L) :- default_location(O, L).
is_facing(self, P) :- is_facing(self, P).
is_near(self, L) :- is_near(self, L).
is_holding(self, O) :- is_holding(self, O).
is_in(L, R) :- is_in(L, R).
is_placed(O, L) :- is_placed(O, L).
is_near(P, L) :- is_near(P, L).
is_delivered(O, P) :- is_delivered(O, P).
-is_near(P, L, n) :- -is_near(P, L, n).
can_be_near(O, L, 0) :- can_be_near(O, L, 0).
can_be_placed(O, L, 0) :- can_be_placed(O, L, 0).


% Fluent to predicate demotion
can_be_near(P, L) :- can_be_near(P, L, 0), has_concept(L, "beacon"). 

% If person can be in a room, they can be near any beacon in the room
can_be_near(P, L) :- can_be_near(P, R, 0), has_concept(R, "room"), is_in(L, R), has_concept(L, "beacon").

% Demotion
can_be_placed(O, L) :- can_be_placed(O, L, 0), has_concept(L, "placement"). 

% If an objecct can be placed in a room, then it can be placed on any surface in the room
can_be_placed(O, L) :- can_be_placed(O, R, 0), has_concept(R, "room"), is_in(L, R), has_concept(L, "placement").

can_be_placed(O_id, L_id) :- default_location(O_category_id, L_concept_id), is_a(O_id, O_concept_id), is_a(O_concept_id, O_category_id), is_a(L_id, L_concept_id), has_concept(O_id, "hypothetical"), 0{can_be_placed(O_id, L, 0)}0.

````

## Initial Planning Query

`knowledge.asp`
````
name(1, "robot").
name(2, "object").
name(3, "operator").
name(4, "hypothetical").
name(5, "location").
name(18, "room").
is_a(18, 5).
name(19, "empty_handed").
name(20, "person").

name(6, "placement").
is_a(6, 5).
name(7, "beacon").
is_a(7, 5).
name(8, "fruit").
is_a(8,2).
default_location(8, 11). % Usually in kitchen
name(9, "graspable").
name(10, "scanned").
name(11, "kitchen").
is_a(11, 18). % Room
name(12, "living room").
is_a(12, 18). % Room
name(13, "sofa").
name(14, "counter").

name(15, "table").
name(16, "cupboard").
name(17, "apple").
is_a(17, 8).


% Arrangement of the world
instance_of(50, 11). % Kitchen
instance_of(51, 12). % Living room
is_connected(50, 51).


instance_of(52, 13). % Sofa
instance_of(52, 7). % Beacon
is_in(52, 51).

instance_of(53, 14). % Counter
instance_of(53, 6). % Placement
is_in(53, 50).

instance_of(54, 15). % Table
instance_of(54, 6). % Placement
is_in(54, 50).

instance_of(55, 16). % Cupboard
instance_of(55, 6). % Placement
is_in(55, 50).


% Robot
instance_of(100, 1).
instance_of(100, 19). % Empty handed
is_near(100, 52). % At sofa

% Operator
instance_of(101, 20).
is_near(101, 52). % At sofa
````

`query.asp`
````
#program check(n).

% Hypothetical apple referenced in user command
instance_of(102, 4).
instance_of(102, 17).

% Hypothesis extracted from user command
can_be_placed(102, 50, 0).

:- not is_delivered(102, 101, n), query(n).

````

## Diagnostics

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
#program base.

0{ can_be_placed(102, 50, 0)}1.
:~ can_be_placed(102, 50, 0). [-1, 1]
````