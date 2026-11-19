# -*- coding: UTF-8 -*-
# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "pybtex",
# ]
# ///
import re

from pybtex.database.input import bibtex
from pybtex.style.formatting import BaseStyle
import json

import os

# publications.bib is also the site's bibliography. submitted.bib holds papers
# under review, which belong on the CV but not the site.
def entries(path, submitted):
    if not os.path.exists(path):
        return []
    data = bibtex.Parser().parse_file(path)
    return [(key, data.entries[key], submitted) for key in data.entries]

pubs = []

from pybtex.style.names.plain import NameStyle
from pybtex.style.formatting import BaseStyle, toplevel
from pybtex.style.template import field, join, optional, sentence, words
from pybtex.style.sorting import BaseSortingStyle

month_abbreviations = {"January": "Jan.", "February": "Feb.", "March": "Mar.", "April": "Apr.", "May": "May", "June": "Jun.", "July": "Jul.", "August": "Aug.", "September": "Sept.", "October": "Oct.", "November": "Nov.", "December": "Dec."}

for key, entry, submitted in entries("submitted.bib", True) + entries("publications.bib", False):
    fields = entry.fields
    desc = {}
    if "wwwhidden" in fields and fields["wwwhidden"]:
        continue
    desc["type"] = "submitted" if submitted else fields["wwwtype"]
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
    if "wwwshortvenue" in fields:
        desc["shortName"] = fields["wwwshortvenue"]
    if submitted:
        desc["publisher"] = "Under review"
    elif desc["type"] == "journal":
        desc["publisher"] = fields["journal"]
    elif desc["type"] == "working":
        if "archivePrefix" in fields:
            desc["publisher"] = fields["archivePrefix"]
            desc["eprint"] = fields["eprint"]
        else:
            desc["publisher"] = "Preprint"
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
    if "month" in fields:
        desc["releaseDate"] = month_abbreviations[fields["month"]] + " " + fields["year"]
    else:
        desc["releaseDate"] = fields["year"]
    desc["year"] = fields["year"]
    # Only publications.bib entries get a page on the site
    if not submitted:
        desc["link"] = "https://nickwalker.us/publications/" + key + "/"
    pubs.append(desc)

with open("cv.json", 'r') as f:
    existing = f.read()

all_data = json.loads(existing)
all_data["publications"] = pubs
updated = json.dumps(all_data, indent=True)

# Leave the file alone when nothing changed: the CV build dates the PDF by
# when cv.json was last modified
if updated != existing:
    with open("cv.json", 'w') as f:
        f.write(updated)
