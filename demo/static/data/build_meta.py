import os
import numpy as np

for f in os.listdir('image_ori'):
	toks = f.strip().split('.')

	if f == 'list.txt': continue
	if toks[-1] == 'jpg' and not os.path.isfile('image_ori/' + toks[0] + '.meta.txt'):
		os.remove('image_ori/' + f)	
	if toks[-1] == 'txt' and not os.path.isfile('image_ori/' + toks[0] + '.jpg'):
		os.remove('image_ori/' + f)

for f in os.listdir('image_ori'):
	toks = f.strip().split('.')
	if toks[-1] != 'jpg':
		continue

	# 20171015-DJI-P4P-GSPro-Test-03_L_20.jpg
	# 20171015-DJI-P4P-GSPro-Test-03_N_21.jpg
	# 20171015-DJI-P4P-GSPro-Test-01_D_04
	ntoks = toks[0].split('_')

	route = ntoks[0].split('-')[-1]
	section = ntoks[1]
	platform = 'DJI-P4P-GSPro' 
	date = ntoks[0][:8]

	metafile = 'image_ori/' + toks[0] + '.meta.txt'
	state = int(open(metafile).readline().strip())
	if state == 1:
		state = np.random.choice([1,2,3], 1, p=[0.6, 0.3, 0.1])[0]
	elif state == 3:
		state = np.random.choice([4,5,6,7], 1, p=[0.2, 0.5, 0.2, 0.1])[0]
	elif state == 5:
		state = np.random.choice([8,9,10], 1, p=[0.1, 0.3, 0.6])[0]
	else:
		state = np.random.choice(10, 1)[0]
	
	with open(metafile, 'w') as meta:
		meta.write(','.join([route, section, platform, date, str(state)]))
		
