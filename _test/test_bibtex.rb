require 'bundler/setup'

require 'bibtex'
passed = true
bibtex = BibTeX.open('_data/references.bib')
bibtex.each do |entry|
  if !entry["abstract"]
    STDERR.puts "\"%s\"  does not have an abstract. Please add one." % entry["title"]
    passed = false
  end
end

exit(passed)