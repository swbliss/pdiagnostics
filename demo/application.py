from flask import Flask, render_template, send_from_directory, url_for, request
import os
import json
from shutil import copyfile
from cbm import cbm
import rpy2.robjects as robjects


#################### GLOBAL ####################
app = Flask(__name__)

@app.route('/test')
def test():
	return render_template('starter.html')


############### TAB:timeline ###############
@app.route('/')
def timeline():
	return render_template('imagemanager.html')

############### TAB:imagemanager ###############
# If to_new is true, it means deleting (ori->new)
def move_img(filename, to_new):
	data_dir = os.path.dirname(os.path.realpath(__file__)) + '/static/data/'

	src_dir = 'image_ori/' if to_new else 'image_new/'
	dst_dir = 'image_new/' if to_new else 'image_ori/'

	img_file = data_dir + src_dir + filename + '.jpg'
	meta_file = data_dir + src_dir + filename + '.meta.txt'

	if os.path.isfile(img_file):
		os.rename(img_file, data_dir + dst_dir + filename + '.jpg')
		os.rename(meta_file, data_dir + dst_dir + filename + '.meta.txt')

		src_list = open(data_dir + src_dir + 'list.txt').readlines()
		src_list.remove(filename + '\n')
		with open(data_dir + src_dir + 'list.txt', 'w') as f:
			f.write(''.join(src_list))

		dst_list = []
		if os.path.isfile(data_dir + dst_dir + 'list.txt'):
			dst_list = open(data_dir + dst_dir + 'list.txt').readlines()
		dst_list.append(filename + '\n')
		with open(data_dir + dst_dir + 'list.txt', 'w') as f:
			f.write(''.join(dst_list))
	return ''


@app.route('/imagemanager')
def image_manager():
	return render_template('imagemanager.html')

@app.route('/delete_img/<filename>/', methods=['GET', 'POST'])
def delete_img(filename):
	return move_img(filename, True)

@app.route('/add_img/<filename>/', methods=['GET', 'POST'])
def add_img(filename):
	return move_img(filename, False)


########### TAB:trainingsetmanager #############
def trainingset_info():
	prefix = 'static/data/training/'
	res = {}	# trainingset:images(array)

	sets = os.listdir(prefix)
	for trainingset in sets:
		res[trainingset] = []
		for f in os.listdir(prefix + trainingset):
			if f[-8:] == "meta.txt":
				toks = open(prefix + trainingset + '/' + f)\
						.readline().strip().split(',')
				toks.insert(0, f.split('.')[0])
				res[trainingset].append(toks)
	return res

@app.route('/trainingsetmanager')
def trainingset_manager():
	return render_template('trainingsetmanager.html')

@app.route('/trainingset', methods=['GET'])
def trainingset():
	return json.dumps(trainingset_info())

@app.route('/examples', methods=['GET'])
def examples():
	prefix = 'static/data/image_ori/'
	res = []
	for filename in os.listdir(prefix):
		if filename[-8:] != "meta.txt":
			continue
		toks = open(prefix + filename).readline().strip().split(',')
		res.append([filename.split('.')[0]] + toks)
	return json.dumps(res)


@app.route('/create_set', methods=['GET'])
def createset():
	name = request.args.get('name', '')
	if len(name) != 0:
		os.mkdir('static/data/training/' + name)
	return ''

@app.route('/set_delete_img', methods=['GET', 'POST'])
def set_delete_img():
	trainingset = request.args.get('set', '')
	filename = request.args.get('name', '')

	os.remove('static/data/training/{}/{}.jpg'.format(trainingset, filename))
	os.remove('static/data/training/{}/{}.meta.txt'.format(trainingset, filename))
	return ''

@app.route('/set_add_img', methods=['GET', 'POST'])
def set_add_img():
	trainingset = request.args.get('set', '')
	filename = request.args.get('name', '')

	copyfile('static/data/image_ori/{}.jpg'.format(filename),
		'static/data/training/{}/{}.jpg'.format(trainingset, filename))
	copyfile('static/data/image_ori/{}.meta.txt'.format(filename),
		'static/data/training/{}/{}.meta.txt'.format(trainingset, filename))
	return ''


########### TAB:diagnostics #############
@app.route('/diagnostics')
def diagnostics():
	return render_template('diagnostics.html')

@app.route('/trainingset_list')
def trainingset_list():
	return json.dumps(list(trainingset_info().keys()))

@app.route('/train')
def train():
	# TODO: run the real model
	trainingset = request.args.get('set', '')
	print(trainingset)
	return ''

@app.route('/eval')
def evaluation():
	res = {}
	prefix = 'static/data/test/'
	for name in os.listdir(prefix):
		if name[-8:] == "meta.txt":
			pred = open(prefix + name).readline().strip()
			res[name.split('.')[0]] = pred
	return json.dumps(res)


########### TAB:prognostics #############
@app.route('/prognostics')
def prognostics():
	return render_template('prognostics.html')

@app.route('/pmodel_list')
def pmodel_list():
	models = list(map(lambda x: x.split('.')[0], os.listdir('static/data/pmodel/')))
	models.sort()
	return json.dumps(models)

@app.route('/itemoptimize')
def itemoptimize():
	res = []
	state = []
	prefix = 'static/data/test/'
	for name in os.listdir(prefix):
		if name[-8:] == "meta.txt":
			pred = open(prefix + name).readline().strip()
			state.append(pred)
			res.append([name.split('.')[0], pred])

	params = getParams()
	params.append(robjects.FloatVector(state))
	opt_result = cbm.item_optimizer(*params)

	for i in range(int(len(opt_result[0])/3)):
		res[i].append(opt_result[0][3*i])
		res[i].append(opt_result[1][3*i])
		res[i].append('{:.2f}'.format(float(opt_result[2][3*i])))

	return json.dumps(res)

@app.route('/systemoptimize')
def optimized_item():
	test = [
		1209,
		5452.891728,
		['1930',
		 '1460',
		 '990',
		 '990',
		 '990',
		 '990',
		 '1020',
		 '1020',
		 '1020',
		 '1020',
		 '1020',
		 '1020',
		 '1020',
		 '1020',
		 '1020',
		 '1020',
		 '1020',
		]
	]
	return json.dumps(test)

def getParams():
	p1 = getModel(request.args.get('no_model', ''))
	p2 = getModel(request.args.get('partial_model', ''))
	p3 = getModel(request.args.get('reconst_model', ''))

	agency_cost = robjects.FloatVector([float(request.args.get('no_cost', '')),
									    float(request.args.get('partial_cost', '')),
									    float(request.args.get('reconst_cost', ''))])

	t_length = float(request.args.get('t_length', ''))

	user_cost = []
	for i in range(1, 11):
		user_cost.append(float(request.args.get('user_cost' + str(i), '')))
	user_cost = robjects.FloatVector(user_cost)

	return [user_cost, agency_cost, t_length, p1, p2, p3]


def getModel(model):
	line = open('static/data/pmodel/{}.txt'.format(model)).readline()
	model =  list(map(lambda x: float(eval(x)),
					line.strip().split(',')))
	return robjects.r.matrix(robjects.FloatVector(model),
							 nrow=10, ncol=10, byrow=True)

if __name__ == "__main__":
	app.run(host='0.0.0.0', port=9021, debug=True)
