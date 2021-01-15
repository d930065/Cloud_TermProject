import sys 
import json
import pandas as pd
import numpy as np
from efficient_apriori import apriori as apr

df = pd.read_csv(sys.argv[1])
tr = df.values
encode = list()
for i, j in enumerate(tr):
    ad = np.where(j == 1.0)[0]
    if len(ad) == 0:
       continue
    else:
        encode.append(list(np.where(j == 1.0)[0]))
itemsets, rules = apr(encode, min_support = float(sys.argv[2]), min_confidence = float(sys.argv[3]))
if sys.argv[5] == 'conf':
	rules = sorted(rules, key=lambda rule: rule.confidence, reverse=True)
elif sys.argv[5] == 'sup':
	rules = sorted(rules, key=lambda rule: rule.support, reverse=True)
elif sys.argv[5] == 'conv':
	rules = sorted(rules, key=lambda rule: rule.conviction, reverse=True)
elif sys.argv[5] == 'lift':
	rules = sorted(rules, key=lambda rule: rule.lift, reverse=True)
new_rules = rules[:int(sys.argv[4])]
new = []
for i in range(len(new_rules)):
	new.append([new_rules[i].__repr__(), new_rules[i].support, new_rules[i].confidence, new_rules[i].conviction, new_rules[i].lift])
result = {
    'Rule': new
  }

json = json.dumps(result)

print(str(json))

