require 'csv'

col_data = [] 
CSV.foreach("secciones_simple.csv") {|row| puts row[0]}