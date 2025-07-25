# -*- coding: UTF-8 -*-
import re

from pybtex.database.input import bibtex
from pybtex.style.formatting import BaseStyle
import json

parser = bibtex.Parser()
bib_data = parser.parse_file("publications.bib")

pubs = []

from pybtex.style.names.plain import NameStyle
from pybtex.style.formatting import BaseStyle, toplevel
from pybtex.style.template import field, join, optional, sentence, words
from pybtex.style.sorting import BaseSortingStyle

month_abbreviations = {"January": "Jan.", "February": "Feb.", "March": "Mar.", "April": "Apr.", "May": "May", "June": "Jun.", "July": "Jul.", "August": "Aug.", "September": "Sept.", "October": "Oct.", "November": "Nov.", "December": "Dec."}

for key in bib_data.entries:
    entry = bib_data.entries[key]
    fields = entry.fields
    desc = {}
    if "wwwhidden" in fields and fields["wwwhidden"]:
        continue
    desc["type"] = fields["wwwtype"]
    desc["name"] = fields["title"]
    desc["authors"] = ""
    cofirst = -1
    if "cofirst" in fields:
        cofirst = int(fields["cofirst"])
    for (i, person) in enumerate(entry.persons["author"]):
        nbsp = " "
        name = NameStyle().format(person, abbr=True).format().render_as("text")
        name = name.replace(". ", "."+nbsp)
        desc["authors"] += name
        if i < cofirst:
            desc["authors"] += "*"
        desc["authors"] += ", "
    desc["authors"] = desc["authors"][:-2]
    if "location" in fields:
        desc["location"] = fields["location"]
    if desc["type"] == "journal":
        desc["publisher"] = fields["journal"]
    elif desc["type"] == "working":
        desc["publisher"] = fields["archivePrefix"]
        desc["eprint"] = fields["eprint"]
    elif desc["type"] == "patent":
        desc["publisher"] = fields["number"]
    elif desc["type"] == "thesis":
        desc["publisher"] = fields["school"]
    else:
        desc["publisher"] = fields["booktitle"]
    desc["publisher"] = desc["publisher"].replace("The Journal", "Journal")
    desc["publisher"] = desc["publisher"].replace("Proceedings", "Proc.")
    desc["publisher"] = desc["publisher"].replace("International", "Int.")
    desc["publisher"] = desc["publisher"].replace("Conference", "Conf.")
    desc["publisher"] = desc["publisher"].replace("Symposium", "Symp.")
    desc["publisher"] = desc["publisher"].replace(" and ", " ")
    desc["publisher"] = desc["publisher"].replace(" on ", " ")
    desc["publisher"] = desc["publisher"].replace(" of the ", " ")
    desc["publisher"] = re.sub(r' \([^)]*\)', '', desc["publisher"])
    month_string = month_abbreviations[fields["month"]]
    desc["releaseDate"] = month_string + " " + fields["year"]
    desc["link"] = "https://nickwalker.us/publications/" + key + "/"
    pubs.append(desc)

with open("cv.json", 'r') as f:
    all_data = json.load(f)

all_data["publications"] = pubs

with open("cv.json", 'w') as f:
    json.dump(all_data, f, indent=True)
