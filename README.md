# p7.Searchtool

Project 7 of the Open Classrooms Frontend Path

Goals: 
- build UI with Bootstrap
- develop two search algorithms for a recipe book, displaying the results on the site
- compare the performance of the two algorithms

Limitations: 
- No file splitting (spoiler: spaghetti code)
- No frameworks, limited to Bootstrap & vanilla JS
- On algorithm 1 use only basic functions (for loops etc)
- On algorithm 2 I was allowed to use Array Methods etc.

Algorithm 1: (Masterbranch)

Builds a dictionary of all possible search results, returns results after first three letters are typed and then moves tree like along remaining possibilities
- Pros: Initial computation time depending on datasize, user search itself very fast and efficient
- Cons: Hard Coded to datastructure, should rather run on server for bigger databases 

Algorithm 2: (NoIndex Branch)

Recursive function running through the database on every search input.
- Pros: Very flexible, can handle a wide range of data structures, slim codebase
- Cons: Runs through whole database on every search, doesn't scale to a lot bigger databases

Performance comparison: 
Algorithm 1 is two orders of magnitude faster then Algorithm 2 if you take user searchinput as starting point for measurement. 
Would scale well if dictionary creation is run on server. Overkill for this projectsize though, as no noticeable difference occurs to the user on this project.

Functionality Investigations Sheet: 
https://github.com/TomOeggl/p7.Searchtool/blob/0f8c81a3923bead0977e0de5638625fdbd59a2fa/files/THOMAS%20OEGGL_7_03222021.pdf
