#!/usr/bin/env ruby
require 'bundler/setup'
require 'bibtex'

if ARGV.length < 1
  puts "Pass the path to the bib file to check"
  exit 1
end

passed = true
bibtex = BibTeX.open(ARGV[0])
bibtex.each do |entry|
  if !entry.instance_of? BibTeX::Entry
    next
  end
  if !entry["abstract"]
    STDERR.puts "\"%s\"  does not have an abstract. Please add one." % entry["title"]
    passed = false
  end
end

exit(passed)

# TODO: Enforce key format
# TODO: Check that there aren't broken references in the output directory "(missing reference)"
